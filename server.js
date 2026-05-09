const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch'); // ✅ FIX

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limit: '10mb' }));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getEnvToken(name) {
  const token = process.env[name];
  if (!token) {
    throw new Error(`Missing ${name} environment variable`);
  }
  return token;
}

function sanitizeDownloadName(name, fallback) {
  return (name || fallback).replace(/[^a-z0-9._-]/gi, '_');
}

app.post('/convert/pdf-to-word', upload.single('file'), async (req, res) => {
  console.log('[POST /convert/pdf-to-word] Incoming request');

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF uploaded. Use FormData field name "file".' });
    }

    const token = getEnvToken('CLOUDCONVERT_API_TOKEN');
    const jobResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tasks: {
          upload: { operation: 'import/upload' },
          convert: {
            operation: 'convert',
            input: 'upload',
            input_format: 'pdf',
            output_format: 'docx'
          },
          export: {
            operation: 'export/url',
            input: 'convert'
          }
        }
      })
    });

    if (!jobResponse.ok) {
      const details = await jobResponse.text();
      return res.status(502).json({ error: 'CloudConvert job creation failed', details });
    }

    const job = await jobResponse.json();
    const uploadTask = job?.data?.tasks?.find((task) => task.name === 'upload');
    const form = uploadTask?.result?.form;

    if (!form?.url || !form?.parameters) {
      return res.status(502).json({ error: 'CloudConvert did not return a valid upload form' });
    }

    const uploadForm = new FormData();
    Object.entries(form.parameters).forEach(([key, value]) => uploadForm.append(key, value));
    uploadForm.append('file', new Blob([req.file.buffer], { type: req.file.mimetype || 'application/pdf' }), req.file.originalname || 'document.pdf');

    const uploadResponse = await fetch(form.url, {
      method: 'POST',
      body: uploadForm
    });

    if (!uploadResponse.ok) {
      const details = await uploadResponse.text();
      return res.status(502).json({ error: 'CloudConvert upload failed', details });
    }

    let fileUrl = null;
    for (let attempt = 0; attempt < 60 && !fileUrl; attempt += 1) {
      await sleep(2000);
      const pollResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${job.data.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!pollResponse.ok) {
        const details = await pollResponse.text();
        return res.status(502).json({ error: 'CloudConvert polling failed', details });
      }

      const data = await pollResponse.json();
      const exportTask = data?.data?.tasks?.find((task) => task.name === 'export');
      const failedTask = data?.data?.tasks?.find((task) => task.status === 'error');

      if (failedTask) {
        return res.status(502).json({ error: 'CloudConvert conversion failed', details: failedTask.message || failedTask.code || 'Task error' });
      }

      if (exportTask?.status === 'finished' && exportTask?.result?.files?.length) {
        fileUrl = exportTask.result.files[0].url;
      }
    }

    if (!fileUrl) {
      return res.status(504).json({ error: 'PDF to Word conversion timed out' });
    }

    const convertedResponse = await fetch(fileUrl);
    if (!convertedResponse.ok) {
      return res.status(502).json({ error: 'Unable to download converted DOCX from CloudConvert' });
    }

    const convertedBuffer = Buffer.from(await convertedResponse.arrayBuffer());
    const downloadName = sanitizeDownloadName((req.file.originalname || 'converted.pdf').replace(/\.pdf$/i, '.docx'), 'converted.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    return res.send(convertedBuffer);
  } catch (error) {
    console.error('[POST /convert/pdf-to-word] Unexpected error', error);
    return res.status(500).json({ error: 'PDF to Word conversion failed', details: error.message });
  }
});


const REAL_ESRGAN_VERSION = '42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b';

function imageFileToDataUri(file) {
  const mimeType = file.mimetype || 'image/png';
  const base64Image = file.buffer.toString('base64');
  return `data:${mimeType};base64,${base64Image}`;
}

function getReplicateOutputUrl(output) {
  if (!output) return null;
  if (typeof output === 'string') return output;
  if (Array.isArray(output)) {
    return output.find((item) => typeof item === 'string' && /^https?:\/\//i.test(item)) || null;
  }
  if (typeof output === 'object') {
    return output.url || output.image || output.output || null;
  }
  return null;
}

async function readJsonResponse(response) {
  const body = await response.text();
  try {
    return body ? JSON.parse(body) : {};
  } catch (_error) {
    return { error: body || 'Invalid JSON response' };
  }
}

async function waitForReplicatePrediction(prediction, token) {
  let currentPrediction = prediction;

  for (let attempt = 0; attempt < 90; attempt += 1) {
    if (currentPrediction?.status === 'succeeded') {
      return currentPrediction;
    }

    if (['failed', 'canceled', 'cancelled'].includes(currentPrediction?.status)) {
      throw new Error(currentPrediction?.error || `Replicate prediction ${currentPrediction.status}`);
    }

    const pollUrl = currentPrediction?.urls?.get;
    if (!pollUrl) {
      throw new Error('Replicate did not return a polling URL.');
    }

    await sleep(2000);
    const pollResponse = await fetch(pollUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    currentPrediction = await readJsonResponse(pollResponse);

    if (!pollResponse.ok) {
      throw new Error(currentPrediction?.detail || currentPrediction?.error || 'Replicate polling failed.');
    }
  }

  throw new Error('Replicate image enhancement timed out.');
}

app.post('/ai-enhance', upload.single('image'), async (req, res) => {
  console.log('[POST /ai-enhance] Incoming request');

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded. Use FormData field name "image".' });
    }

    if (!req.file.mimetype?.startsWith('image/')) {
      return res.status(400).json({ success: false, error: 'Uploaded file must be an image.' });
    }

    const token = getEnvToken('REPLICATE_API_TOKEN');
    const inputImage = imageFileToDataUri(req.file);

    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'wait=60'
      },
      body: JSON.stringify({
        version: REAL_ESRGAN_VERSION,
        input: {
          image: inputImage,
          scale: 2,
          face_enhance: false
        }
      })
    });

    const createdPrediction = await readJsonResponse(createResponse);
    if (!createResponse.ok) {
      return res.status(502).json({
        success: false,
        error: createdPrediction?.detail || createdPrediction?.error || 'Replicate prediction creation failed.'
      });
    }

    const finishedPrediction = await pollReplicatePrediction(createdPrediction, token);
    const outputUrl = extractReplicateOutputUrl(finishedPrediction.output);

    if (!outputUrl) {
      return res.status(502).json({ success: false, error: 'Replicate finished without returning an enhanced image URL' });
    }

    return res.json({ success: true, imageUrl: outputUrl });
  } catch (error) {
    console.error('[POST /ai-enhance] Error', error);
    return res.status(500).json({ success: false, error: error.message || 'AI image enhancement failed.' });
  }
});

app.get('/ai-enhance/download', async (req, res) => {
  try {
    const imageUrl = String(req.query.url || '').trim();
    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'Missing enhanced image URL.' });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(imageUrl);
    } catch (_error) {
      return res.status(400).json({ success: false, error: 'Invalid enhanced image URL.' });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ success: false, error: 'Enhanced image URL must use HTTP or HTTPS.' });
    }

    const response = await fetch(parsedUrl.toString());
    if (!response.ok) {
      return res.status(502).json({ success: false, error: 'Unable to download enhanced image from Replicate.' });
    }

    const imageResponse = await fetch(parsedUrl.toString());
    if (!imageResponse.ok) {
      return res.status(502).json({ success: false, error: 'Unable to fetch enhanced image.' });
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'attachment; filename="enhanced-image.png"');
    return res.send(imageBuffer);
  } catch (error) {
    console.error('[GET /ai-enhance/download] Error', error);
    return res.status(500).json({ success: false, error: error.message || 'Enhanced image download failed.' });
  }
});

app.post('/remove-background', upload.single('image_file'), async (req, res) => {
  console.log('[POST /remove-background] Incoming request');

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded. Use FormData field name "image_file".' });
    }

    const formData = new FormData();
    formData.append('image_file', new Blob([req.file.buffer], { type: req.file.mimetype || 'image/png' }), req.file.originalname || 'image.png');
    formData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': getEnvToken('REMOVE_BG_API_KEY') },
      body: formData
    });

    if (!response.ok) {
      const details = await response.text();
      return res.status(502).json({ error: 'Background removal failed', details });
    }

    const outputBuffer = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="no-bg.png"');
    return res.send(outputBuffer);
  } catch (error) {
    console.error('[POST /remove-background] Unexpected error', error);
    return res.status(500).json({ error: 'Background removal failed', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server running');
});

app.use((_req, res) => {
  return res.status(404).json({ success: false, error: 'Not found' });
});

app.use((error, _req, res, _next) => {
  console.error('[server] Unhandled request error', error);
  return res.status(500).json({ success: false, error: 'Request failed', details: error.message || String(error) });
});

app.listen(PORT, () => {
  console.log(`Convertios API server running on http://localhost:${PORT}`);
});
