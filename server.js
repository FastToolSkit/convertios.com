const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3000;
const REAL_ESRGAN_VERSION = '42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b';
const allowedOrigins = new Set([
  'https://convertios.com',
  'https://www.convertios.com'
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS origin not allowed: ${origin}`));
  }
}));
app.use(express.json({ limit: '10mb' }));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getReplicateToken() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error('Missing REPLICATE_API_TOKEN environment variable.');
  }
  return token;
}

function imageToDataUri(file) {
  const mimeType = file.mimetype || 'image/png';
  const base64Image = file.buffer.toString('base64');
  return `data:${mimeType};base64,${base64Image}`;
}

function extractOutputUrl(output) {
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

async function readJson(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (_error) {
    return { error: text || 'Invalid JSON response.' };
  }
}

async function waitForPrediction(prediction, token) {
  let currentPrediction = prediction;

  for (let attempt = 0; attempt < 90; attempt += 1) {
    if (currentPrediction?.status === 'succeeded') {
      return currentPrediction;
    }

    if (['failed', 'canceled', 'cancelled'].includes(currentPrediction?.status)) {
      throw new Error(currentPrediction?.error || `Replicate prediction ${currentPrediction.status}.`);
    }

    const pollUrl = currentPrediction?.urls?.get;
    if (!pollUrl) {
      throw new Error('Replicate did not return a polling URL.');
    }

    await sleep(2000);
    const pollResponse = await fetch(pollUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    currentPrediction = await readJson(pollResponse);

    if (!pollResponse.ok) {
      throw new Error(currentPrediction?.detail || currentPrediction?.error || 'Replicate polling failed.');
    }
  }

  throw new Error('Replicate image enhancement timed out.');
}

app.get('/', (_req, res) => {
  return res.json({ success: true, message: 'Convertios AI enhancer backend is running.' });
});

app.post('/ai-enhance', upload.single('image'), async (req, res) => {
  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  console.log(`[${requestId}] POST /ai-enhance`);

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded. Use FormData field name "image".' });
    }

    if (!req.file.mimetype?.startsWith('image/')) {
      return res.status(400).json({ success: false, error: 'Uploaded file must be an image.' });
    }

    const token = getReplicateToken();
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
          image: imageToDataUri(req.file),
          scale: 2,
          face_enhance: false
        }
      })
    });

    const prediction = await readJson(createResponse);
    if (!createResponse.ok) {
      return res.status(502).json({
        success: false,
        error: prediction?.detail || prediction?.error || 'Replicate prediction creation failed.'
      });
    }

    const finishedPrediction = prediction.status === 'succeeded'
      ? prediction
      : await waitForPrediction(prediction, token);
    const outputUrl = extractOutputUrl(finishedPrediction.output);

    if (!outputUrl) {
      return res.status(502).json({ success: false, error: 'Replicate did not return an enhanced image URL.' });
    }

    return res.json({ success: true, imageUrl: outputUrl });
  } catch (error) {
    console.error(`[${requestId}] AI enhancement failed`, error);
    return res.status(500).json({ success: false, error: error.message || 'AI image enhancement failed.' });
  }
});

app.get('/ai-enhance/download', async (req, res) => {
  try {
    const imageUrl = String(req.query.url || '').trim();
    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'Missing image URL.' });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(imageUrl);
    } catch (_error) {
      return res.status(400).json({ success: false, error: 'Invalid image URL.' });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ success: false, error: 'Image URL must use HTTP or HTTPS.' });
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

app.use((_req, res) => {
  return res.status(404).json({ success: false, error: 'Not found' });
});

app.use((error, _req, res, _next) => {
  console.error('[server] Unhandled request error', error);
  return res.status(500).json({ success: false, error: error.message || 'Request failed.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
