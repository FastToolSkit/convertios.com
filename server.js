const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = 3000;
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const REPLICATE_MODEL_VERSION = '42fed1c497a4d2e1a7d0c9d03c6c3f6f2e3a0b0f3fdb1f9c3e4a6d5c4f9b6a8f';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function getAuthHeaders() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error('Missing REPLICATE_API_TOKEN environment variable');
  }

  return {
    Authorization: `Token ${token}`,
    'Content-Type': 'application/json'
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.post('/enhance', upload.single('image'), async (req, res) => {
  console.log('[POST /enhance] Incoming request');

  try {
    if (!req.file) {
      console.error('[POST /enhance] No image file received');
      return res.status(400).json({ error: 'No image uploaded. Use FormData field name "image".' });
    }

    const mimeType = req.file.mimetype || 'image/png';
    const base64 = req.file.buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;

    console.log('[POST /enhance] Image received', {
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType
    });

    const createPayload = {
      version: REPLICATE_MODEL_VERSION,
      input: {
        image: dataUri,
        scale: 2,
        face_enhance: false
      }
    };

    console.log('[POST /enhance] Creating Replicate prediction');
    const createResponse = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(createPayload)
    });

    if (!createResponse.ok) {
      const errText = await createResponse.text();
      console.error('[POST /enhance] Failed to create prediction', createResponse.status, errText);
      return res.status(502).json({ error: 'Failed to create Replicate prediction', details: errText });
    }

    const prediction = await createResponse.json();
    console.log('[POST /enhance] Prediction created', {
      id: prediction.id,
      status: prediction.status,
      get: prediction?.urls?.get
    });

    if (!prediction?.urls?.get) {
      console.error('[POST /enhance] Missing poll URL in Replicate response');
      return res.status(502).json({ error: 'Invalid response from Replicate (missing poll URL)' });
    }

    let current = prediction;
    let attempts = 0;
    const maxAttempts = 60;

    while (!['succeeded', 'failed', 'canceled'].includes(current.status) && attempts < maxAttempts) {
      attempts += 1;
      await sleep(2000);

      console.log(`[POST /enhance] Polling prediction attempt ${attempts}, current status: ${current.status}`);

      const pollResponse = await fetch(prediction.urls.get, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!pollResponse.ok) {
        const errText = await pollResponse.text();
        console.error('[POST /enhance] Polling failed', pollResponse.status, errText);
        return res.status(502).json({ error: 'Failed while polling Replicate prediction', details: errText });
      }

      current = await pollResponse.json();
    }

    if (attempts >= maxAttempts && current.status !== 'succeeded') {
      console.error('[POST /enhance] Polling timeout', { status: current.status });
      return res.status(504).json({ error: 'Enhancement timed out', status: current.status });
    }

    if (current.status !== 'succeeded') {
      console.error('[POST /enhance] Prediction did not succeed', {
        status: current.status,
        error: current.error
      });
      return res.status(500).json({ error: 'Image enhancement failed', status: current.status, details: current.error });
    }

    let outputUrl = null;

    if (Array.isArray(current.output) && current.output.length > 0) {
      outputUrl = current.output[0];
    } else if (typeof current.output === 'string') {
      outputUrl = current.output;
    } else if (current.output && typeof current.output === 'object' && current.output.url) {
      outputUrl = current.output.url;
    }

    if (!outputUrl) {
      console.error('[POST /enhance] Succeeded but no output URL found', { output: current.output });
      return res.status(502).json({ error: 'No enhanced image URL returned by Replicate' });
    }

    console.log('[POST /enhance] Enhancement complete', { outputUrl });
    return res.json({ enhancedImageUrl: outputUrl });
  } catch (error) {
    console.error('[POST /enhance] Unexpected error', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});


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

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`AI enhancer backend running on http://localhost:${PORT}`);
});
