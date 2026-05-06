const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch'); // ✅ FIX

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ FIX PORT
const PORT = process.env.PORT || 3000;

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
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const mimeType = req.file.mimetype || 'image/png';
    const base64 = req.file.buffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;

    const createResponse = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        version: REPLICATE_MODEL_VERSION,
        input: {
          image: dataUri,
          scale: 2,
          face_enhance: false
        }
      })
    });

    const prediction = await createResponse.json();

    let current = prediction;

    while (!['succeeded', 'failed'].includes(current.status)) {
      await sleep(2000);

      const poll = await fetch(prediction.urls.get, {
        headers: getAuthHeaders()
      });

      current = await poll.json();
    }

    if (current.status !== 'succeeded') {
      return res.status(500).json({ error: 'Enhancement failed' });
    }

    const outputUrl = Array.isArray(current.output)
      ? current.output[0]
      : current.output;

    res.json({ enhancedImageUrl: outputUrl });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
