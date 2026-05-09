const express = require('express');
const cors = require('cors');
const multer = require('multer');

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


const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const REPLICATE_MODEL_VERSION = '42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b';
const MAX_REPLICATE_POLL_ATTEMPTS = 60;
const REPLICATE_POLL_INTERVAL_MS = 2000;

function getReplicateToken() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error('Missing REPLICATE_API_TOKEN environment variable');
  }

  const normalizedToken = token
    .trim()
    .replace(/^(Bearer|Token)\s+/i, '')
    .replace(/^['"]|['"]$/g, '')
    .trim();

  if (!normalizedToken) {
    throw new Error('REPLICATE_API_TOKEN is empty after removing quotes/auth prefix');
  }

  return normalizedToken;
}

function getReplicateHeaders({ wait = false } = {}) {
  const headers = {
    Authorization: `Bearer ${getReplicateToken()}`,
    'Content-Type': 'application/json'
  };

  if (wait) {
    headers.Prefer = 'wait=60';
  }

  return headers;
}

function buildImageDataUri(file) {
  const mimeType = file.mimetype || 'image/png';
  return `data:${mimeType};base64,${file.buffer.toString('base64')}`;
}

function extractReplicateOutputUrl(prediction) {
  const output = prediction?.output;

  if (typeof output === 'string') {
    return output;
  }

  if (Array.isArray(output)) {
    return output.find((item) => typeof item === 'string' && /^https?:\/\//i.test(item)) || output[0] || null;
  }

  if (output && typeof output === 'object') {
    return output.url || output.image || output.output || null;
  }

  return null;
}

async function pollReplicatePrediction(prediction, requestId) {
  if (!prediction?.urls?.get) {
    throw new Error('Replicate prediction did not include a polling URL');
  }

  let currentPrediction = prediction;

  for (let attempt = 1; attempt <= MAX_REPLICATE_POLL_ATTEMPTS; attempt += 1) {
    const outputUrl = extractReplicateOutputUrl(currentPrediction);
    if (outputUrl) {
      return outputUrl;
    }

    if (currentPrediction.status === 'succeeded') {
      throw new Error('Replicate prediction succeeded without returning an image URL');
    }

    if (['failed', 'canceled'].includes(currentPrediction.status)) {
      throw new Error(currentPrediction.error || `Replicate prediction ${currentPrediction.status}`);
    }

    console.log('[POST /enhance] Waiting for Replicate prediction', {
      requestId,
      predictionId: currentPrediction.id,
      status: currentPrediction.status,
      attempt
    });

    await sleep(REPLICATE_POLL_INTERVAL_MS);
    const pollResponse = await fetch(currentPrediction.urls.get, {
      method: 'GET',
      headers: getReplicateHeaders()
    });

    const pollText = await pollResponse.text();
    let pollData = null;
    try {
      pollData = pollText ? JSON.parse(pollText) : null;
    } catch (_error) {
      throw new Error(`Replicate returned an invalid polling response (${pollResponse.status})`);
    }

    if (!pollResponse.ok) {
      throw new Error(pollData?.detail || pollData?.error || `Replicate polling failed (${pollResponse.status})`);
    }

    currentPrediction = pollData;
  }

  throw new Error('Replicate enhancement timed out. Please try a smaller image or try again later.');
}

app.post('/enhance', upload.single('image'), async (req, res) => {
  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  console.log('[POST /enhance] Upload received', {
    requestId,
    hasFile: !!req.file,
    originalName: req.file?.originalname,
    mimetype: req.file?.mimetype,
    size: req.file?.size
  });

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded. Use FormData field name "image".' });
    }

    if (!req.file.mimetype?.startsWith('image/')) {
      return res.status(400).json({ success: false, error: 'Uploaded file must be an image.' });
    }

    const imageInput = buildImageDataUri(req.file);
    const payload = {
      version: REPLICATE_MODEL_VERSION,
      input: {
        image: imageInput,
        scale: 2,
        face_enhance: false
      }
    };

    console.log('[POST /enhance] Creating Replicate prediction', {
      requestId,
      version: REPLICATE_MODEL_VERSION,
      imageBytes: req.file.size,
      mimeType: req.file.mimetype
    });

    const createResponse = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: getReplicateHeaders({ wait: true }),
      body: JSON.stringify(payload)
    });

    const responseText = await createResponse.text();
    let prediction = null;
    try {
      prediction = responseText ? JSON.parse(responseText) : null;
    } catch (_error) {
      console.error('[POST /enhance] Replicate returned non-JSON response', {
        requestId,
        status: createResponse.status,
        responseText: responseText.slice(0, 500)
      });
      return res.status(502).json({ success: false, error: 'Replicate returned an invalid response.' });
    }

    console.log('[POST /enhance] Replicate response', {
      requestId,
      status: createResponse.status,
      predictionId: prediction?.id,
      predictionStatus: prediction?.status,
      error: prediction?.error
    });

    if (!createResponse.ok) {
      const message = prediction?.detail || prediction?.error || `Replicate request failed (${createResponse.status})`;
      return res.status(createResponse.status === 401 ? 401 : 502).json({ success: false, error: message });
    }

    let imageUrl = extractReplicateOutputUrl(prediction);
    if (!imageUrl) {
      imageUrl = await pollReplicatePrediction(prediction, requestId);
    }

    console.log('[POST /enhance] Enhancement complete', { requestId, imageUrl });
    return res.status(200).json({ success: true, imageUrl });
  } catch (error) {
    console.error('[POST /enhance] Replicate enhancement failed', {
      requestId,
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json({ success: false, error: error.message || 'Image enhancement failed.' });
  }
});

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

app.use((_req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

app.use((error, _req, res, _next) => {
  console.error('[server] Unhandled request error', error);
  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
});

app.listen(PORT, () => {
  console.log(`Convertios API server running on http://localhost:${PORT}`);
});
