const crypto = require('crypto');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const PYTHON_BIN = process.env.PYTHON_BIN || 'python3';
const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const PROCESS_TIMEOUT_MS = 120_000;
const MAX_ACTIVE_JOBS = Math.max(1, Number(process.env.MAX_ACTIVE_JOBS || 2));
const allowedOrigins = new Set([
  'https://convertios.com',
  'https://www.convertios.com',
  ...(process.env.EXTRA_ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean)
]);

let activeJobs = 0;

const documentUpload = multer({ storage: multer.memoryStorage(), limits: { files: 1, fileSize: MAX_DOCUMENT_BYTES } });
const imageUpload = multer({ storage: multer.memoryStorage(), limits: { files: 1, fileSize: MAX_IMAGE_BYTES } });

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
const conversionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false
});

function safeDownloadName(name, extension, fallback) {
  const base = path.basename(name || fallback, path.extname(name || fallback));
  const safeBase = base.normalize('NFKD').replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '');
  return `${safeBase || fallback}${extension}`;
}

function runPython(scriptName, args) {
  const scriptPath = path.join(__dirname, 'backend', scriptName);
  return new Promise((resolve, reject) => {
    const child = spawn(PYTHON_BIN, [scriptPath, ...args], {
      stdio: ['ignore', 'ignore', 'pipe'],
      env: { ...process.env, PYTHONUNBUFFERED: '1' }
    });
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error('Processing timed out. Try a smaller file.'));
    }, PROCESS_TIMEOUT_MS);

    child.stderr.on('data', (chunk) => {
      if (stderr.length < 8_000) stderr += chunk.toString();
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) return resolve();
      return reject(new Error(stderr.trim() || `Processor exited with code ${code}`));
    });
  });
}

async function withJob(res, handler) {
  if (activeJobs >= MAX_ACTIVE_JOBS) {
    return res.status(503).json({ error: 'The converter is busy. Please retry in a moment.' });
  }
  activeJobs += 1;
  const jobDir = await fs.mkdtemp(path.join(os.tmpdir(), 'convertios-'));
  try {
    return await handler(jobDir);
  } finally {
    activeJobs -= 1;
    await fs.rm(jobDir, { recursive: true, force: true });
  }
}

function uploadSingle(upload, field) {
  return (req, res, next) => upload.single(field)(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Uploaded file is too large.' });
    }
    return res.status(400).json({ error: error.message || 'Invalid upload.' });
  });
}

app.get('/', (_req, res) => {
  res.json({ service: 'Convertios self-hosted conversion backend', status: 'ok' });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    processing: 'self-hosted',
    thirdPartyConversionApis: false,
    activeJobs,
    maxActiveJobs: MAX_ACTIVE_JOBS,
    engines: {
      pdfToWord: 'pdf2docx',
      backgroundRemoval: 'rembg/u2netp',
      imageEnhancement: 'not-enabled'
    }
  });
});

app.post('/convert/pdf-to-word', conversionRateLimit, uploadSingle(documentUpload, 'file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No PDF uploaded.' });
  if (req.file.mimetype !== 'application/pdf' && !/\.pdf$/i.test(req.file.originalname || '')) {
    return res.status(415).json({ error: 'Uploaded file must be a PDF.' });
  }

  return withJob(res, async (jobDir) => {
    const input = path.join(jobDir, `${crypto.randomUUID()}.pdf`);
    const output = path.join(jobDir, `${crypto.randomUUID()}.docx`);
    await fs.writeFile(input, req.file.buffer, { mode: 0o600 });
    await runPython('pdf_to_docx.py', [input, output]);
    const result = await fs.readFile(output);
    const downloadName = safeDownloadName(req.file.originalname, '.docx', 'converted');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    res.setHeader('Cache-Control', 'no-store');
    return res.send(result);
  });
});

app.post('/remove-background', conversionRateLimit, uploadSingle(imageUpload, 'image_file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });
  if (!req.file.mimetype?.startsWith('image/')) {
    return res.status(415).json({ error: 'Uploaded file must be an image.' });
  }

  return withJob(res, async (jobDir) => {
    const originalExtension = path.extname(req.file.originalname || '').toLowerCase();
    const extension = ['.png', '.jpg', '.jpeg', '.webp'].includes(originalExtension) ? originalExtension : '.png';
    const input = path.join(jobDir, `${crypto.randomUUID()}${extension}`);
    const output = path.join(jobDir, `${crypto.randomUUID()}.png`);
    await fs.writeFile(input, req.file.buffer, { mode: 0o600 });
    await runPython('remove_background.py', [input, output]);
    const result = await fs.readFile(output);
    const downloadName = safeDownloadName(req.file.originalname, '-no-bg.png', 'image');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    res.setHeader('Cache-Control', 'no-store');
    return res.send(result);
  });
});

app.post('/enhance', conversionRateLimit, (_req, res) => {
  return res.status(503).json({
    error: 'Self-hosted image enhancement is not enabled yet.',
    details: 'This route will be enabled after a suitable CPU/GPU model is installed.'
  });
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.use((error, _req, res, _next) => {
  console.error('[server] Request failed', error);
  const status = error.message === 'Origin not allowed by CORS' ? 403 : 500;
  return res.status(status).json({ error: status === 403 ? error.message : 'Processing failed.' });
});

app.listen(PORT, () => {
  console.log(`Convertios backend listening on port ${PORT}`);
});
