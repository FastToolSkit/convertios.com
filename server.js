const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch'); // ✅ FIX

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3000;
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const REPLICATE_MODEL = 'nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b';
const REPLICATE_MODEL_VERSION = REPLICATE_MODEL.split(':').pop();
const MAX_ENHANCE_IMAGE_BYTES = 10 * 1024 * 1024;
const enhanceUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_ENHANCE_IMAGE_BYTES }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

function getAuthHeaders({ wait = false } = {}) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error('Missing REPLICATE_API_TOKEN environment variable');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  if (wait) {
    headers.Prefer = 'wait';
  }

  console.log("API KEY EXISTS:", !!process.env.REPLICATE_API_TOKEN);

  return headers;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractPredictionOutput(prediction) {
  let outputUrl = null;

  if (Array.isArray(prediction?.output)) {
    outputUrl = prediction.output[0] || null;
  } else if (typeof prediction?.output === 'string') {
    outputUrl = prediction.output;
  }

  return outputUrl;
}

function safeReplicateDetails(value) {
  if (!value) return value;

  return {
    id: value.id,
    status: value.status,
    error: value.error,
    output: value.output,
    logs: value.logs,
    urls: value.urls
  };
}

function sendEnhanceError(res, status, details, extra = {}) {
  return res.status(status).json({
    error: 'Enhancement failed',
    details,
    ...extra
  });
}

async function pollReplicatePrediction(prediction, requestId) {
  if (!prediction?.urls?.get) {
    throw new Error('Replicate prediction is missing a polling URL');
  }

  let current = prediction;
  const maxAttempts = 30;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (['failed', 'canceled'].includes(current.status)) {
      throw new Error(current.error || `Replicate prediction ${current.status}`);
    }

    const outputUrl = extractPredictionOutput(current);
    if (outputUrl) {
      return { prediction: current, outputUrl };
    }

    if (current.status === 'succeeded') {
      break;
    }

    await sleep(2000);
    console.log(`[POST /enhance] [${requestId}] Polling Replicate prediction attempt ${attempt}, current status: ${current.status}`);

    const pollResponse = await fetch(prediction.urls.get, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!pollResponse.ok) {
      const details = await pollResponse.text();
      throw new Error(`Replicate polling failed (${pollResponse.status}): ${details}`);
    }

    current = await pollResponse.json();
    console.log("REPLICATE RESPONSE:", current);
    console.log('📡 Replicate response:', { requestId, prediction: safeReplicateDetails(current) });
  }

  return { prediction: current, outputUrl: extractPredictionOutput(current) };
}

app.post('/enhance', (req, res, next) => {
  enhanceUpload.single('image')(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return sendEnhanceError(res, 413, 'Image must be smaller than 10MB.');
    }

    return sendEnhanceError(res, 400, error.message || 'Invalid image upload.');
  });
}, async (req, res) => {
  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  let prediction = null;
  let stage = 'received';

  try {
    console.log('🔥 Request received', { requestId, path: req.path, method: req.method });
    console.log('📦 File size:', req.file?.size);
    console.log('[POST /enhance] Upload metadata:', {
      requestId,
      fieldName: req.file?.fieldname,
      originalName: req.file?.originalname,
      mimetype: req.file?.mimetype,
      bufferBytes: req.file?.buffer?.length
    });
    console.log('🔑 Token exists:', !!process.env.REPLICATE_API_TOKEN);

    if (!req.file) {
      return sendEnhanceError(res, 400, 'No image uploaded. Use FormData field name "image".', { requestId, stage: 'validation' });
    }

    if (!req.file.mimetype?.startsWith('image/')) {
      return sendEnhanceError(res, 400, 'Uploaded file must be an image.', { requestId, stage: 'validation' });
    }

    if (req.file.size >= MAX_ENHANCE_IMAGE_BYTES) {
      return sendEnhanceError(res, 413, 'Image must be smaller than 10MB.', { requestId, stage: 'validation' });
    }

    stage = 'encoding';
    const mimeType = req.file.mimetype || 'image/png';
    const base64 = req.file.buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;
    const replicateInputImage = 'https://replicate.delivery/pbxt/sample.png';

    console.log('[POST /enhance] Encoded image for Replicate', {
      requestId,
      mimeType,
      base64Length: base64.length,
      dataUriLength: dataUri.length
    });

    const createPayload = {
      version: REPLICATE_MODEL_VERSION,
      input: {
        image: replicateInputImage,
        scale: 2,
        face_enhance: false
      }
    };

    stage = 'replicate_create';
    console.log('[POST /enhance] Creating Replicate prediction', {
      requestId,
      model: REPLICATE_MODEL,
      version: REPLICATE_MODEL_VERSION,
      mimeType,
      originalName: req.file.originalname,
      inputKeys: Object.keys(createPayload.input)
    });

    const createResponse = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: getAuthHeaders({ wait: true }),
      body: JSON.stringify(createPayload)
    });

    const responseText = await createResponse.text();

    try {
      prediction = responseText ? JSON.parse(responseText) : null;
    } catch (parseError) {
      throw new Error(`Replicate returned non-JSON response (${createResponse.status}): ${responseText.slice(0, 500)}`);
    }

    console.log("REPLICATE RESPONSE:", prediction);
    console.log('📡 Replicate response:', {
      requestId,
      httpStatus: createResponse.status,
      prediction: safeReplicateDetails(prediction)
    });

    if (!createResponse.ok) {
      throw new Error(`Replicate prediction failed (${createResponse.status}): ${JSON.stringify(safeReplicateDetails(prediction) || responseText)}`);
    }

    stage = 'output_extract';
    let outputUrl = extractPredictionOutput(prediction);

    if (!outputUrl && !['failed', 'canceled'].includes(prediction.status)) {
      stage = 'replicate_poll';
      const result = await pollReplicatePrediction(prediction, requestId);
      prediction = result.prediction;
      outputUrl = result.outputUrl;
    }

    if (['failed', 'canceled'].includes(prediction.status)) {
      throw new Error(prediction.error || `Replicate prediction ${prediction.status}`);
    }

    if (!outputUrl) {
      return sendEnhanceError(res, 502, safeReplicateDetails(prediction) || 'Replicate did not return an output URL.', { requestId, stage });
    }

    console.log('[POST /enhance] Enhancement complete', { requestId, outputUrl });
    return res.status(200).json({ enhancedImageUrl: outputUrl });
  } catch (error) {
    console.error('[POST /enhance] Enhancement failed', {
      requestId,
      stage,
      message: error.message,
      stack: error.stack,
      replicate: safeReplicateDetails(prediction)
    });
    return sendEnhanceError(res, 500, error.message || safeReplicateDetails(prediction), {
      requestId,
      stage,
      replicate: safeReplicateDetails(prediction)
    });
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

app.get('/', (req, res) => {
  res.send('Server running');
});

app.use((_req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

app.use((error, _req, res, _next) => {
  console.error('[server] Unhandled request error', error);
  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
});

app.use((_req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

app.use((error, _req, res, _next) => {
  console.error('[server] Unhandled request error', error);
  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
});

app.use((_req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

app.use((error, _req, res, _next) => {
  console.error('[server] Unhandled request error', error);
  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
});

app.use((_req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

app.use((error, _req, res, _next) => {
  console.error('[server] Unhandled request error', error);
  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
});

app.use((_req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

app.use((error, _req, res, _next) => {
  console.error('[server] Unhandled request error', error);
  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
});

app.use((_req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

app.use((error, _req, res, _next) => {
  console.error('[server] Unhandled request error', error);
  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
});

app.use((_req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

app.use((error, _req, res, _next) => {
  console.error('[server] Unhandled request error', error);
  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
