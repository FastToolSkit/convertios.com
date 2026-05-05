const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = 3000;
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const REPLICATE_MODEL = 'nightmareai/real-esrgan';

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
      model: REPLICATE_MODEL,
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

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`AI enhancer backend running on http://localhost:${PORT}`);
});
