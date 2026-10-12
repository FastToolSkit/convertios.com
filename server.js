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
const api = require('./backend/api');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const PYTHON_BIN = process.env.PYTHON_BIN || 'python3';
const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
const PROCESS_TIMEOUT_MS = 120_000;
const VIDEO_PROCESS_TIMEOUT_MS = 300_000;
const MAX_ACTIVE_JOBS = Math.max(1, Number(process.env.MAX_ACTIVE_JOBS || 2));
// Render sets RENDER_GIT_COMMIT for every deploy; /health exposes it so a deploy can be verified.
const SERVICE_VERSION = (process.env.RENDER_GIT_COMMIT || process.env.SERVICE_VERSION || 'local').slice(0, 12);
const apiConfig = api.loadConfig();
const allowedOrigins = new Set([
  'https://convertios.com',
  'https://www.convertios.com',
  ...(process.env.EXTRA_ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean)
]);

let activeJobs = 0;

const documentUpload = multer({ storage: multer.memoryStorage(), limits: { files: 1, fileSize: MAX_DOCUMENT_BYTES } });
const imageUpload = multer({ storage: multer.memoryStorage(), limits: { files: 1, fileSize: MAX_IMAGE_BYTES } });
const videoUpload = multer({ storage: multer.memoryStorage(), limits: { files: 1, fileSize: MAX_VIDEO_BYTES } });
const enhanceUpload = multer({ storage: multer.memoryStorage(), limits: { files: 1, fileSize: api.LIMITS.enhanceUploadBytes } });

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Disposition']
}));

// Every error response carries a stable `code` so the pages can show a translated message.
function fail(res, status, code, message) {
  return res.status(status).json({ error: message, code });
}

function limiter(limit) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => fail(res, 429, 'RATE_LIMITED', 'Too many requests. Please wait a few minutes and retry.')
  });
}
const conversionRateLimit = limiter(30);
const videoConversionRateLimit = limiter(10);
const shortenRateLimit = limiter(40);

function runProcess(command, args, timeoutMs = PROCESS_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'ignore', 'pipe'],
      env: { ...process.env, PYTHONUNBUFFERED: '1' }
    });
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      const timeout = new Error('Processing timed out.');
      timeout.code = 'PROCESSING_TIMEOUT';
      reject(timeout);
    }, timeoutMs);

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

function runPython(scriptName, args) {
  return runProcess(PYTHON_BIN, [path.join(__dirname, 'backend', scriptName), ...args]);
}

function videoInputExtension(file) {
  const extension = path.extname(file.originalname || '').toLowerCase();
  const allowed = new Set(['.mp4', '.mov', '.webm', '.mkv', '.avi', '.m4v', '.mpeg', '.mpg', '.3gp', '.ogv', '.flv', '.wmv', '.ts']);
  return allowed.has(extension) ? extension : null;
}

function videoFormatSettings(format) {
  const settings = {
    mp4: { extension: '.mp4', contentType: 'video/mp4', args: ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart'] },
    webm: { extension: '.webm', contentType: 'video/webm', args: ['-c:v', 'libvpx-vp9', '-deadline', 'realtime', '-cpu-used', '8', '-crf', '34', '-b:v', '0', '-c:a', 'libopus', '-b:a', '96k'] },
    mov: { extension: '.mov', contentType: 'video/quicktime', args: ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart'] },
    mkv: { extension: '.mkv', contentType: 'video/x-matroska', args: ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-c:a', 'aac', '-b:a', '128k'] },
    avi: { extension: '.avi', contentType: 'video/x-msvideo', args: ['-c:v', 'mpeg4', '-q:v', '5', '-c:a', 'libmp3lame', '-b:a', '128k'] },
    m4v: { extension: '.m4v', contentType: 'video/x-m4v', args: ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart'] },
    mpg: { extension: '.mpg', contentType: 'video/mpeg', args: ['-c:v', 'mpeg2video', '-q:v', '5', '-c:a', 'mp2', '-b:a', '192k'] },
    mpeg: { extension: '.mpeg', contentType: 'video/mpeg', args: ['-c:v', 'mpeg2video', '-q:v', '5', '-c:a', 'mp2', '-b:a', '192k'] },
    flv: { extension: '.flv', contentType: 'video/x-flv', args: ['-c:v', 'flv', '-q:v', '5', '-c:a', 'libmp3lame', '-b:a', '128k'] },
    wmv: { extension: '.wmv', contentType: 'video/x-ms-wmv', args: ['-c:v', 'wmv2', '-q:v', '5', '-c:a', 'wmav2', '-b:a', '128k'] },
    '3gp': { extension: '.3gp', contentType: 'video/3gpp', args: ['-c:v', 'libx264', '-preset', 'veryfast', '-profile:v', 'baseline', '-level', '3.0', '-crf', '25', '-c:a', 'aac', '-b:a', '96k'] },
    ogv: { extension: '.ogv', contentType: 'video/ogg', args: ['-c:v', 'libtheora', '-q:v', '7', '-c:a', 'libvorbis', '-q:a', '4'] },
    ts: { extension: '.ts', contentType: 'video/mp2t', args: ['-c:v', 'mpeg2video', '-q:v', '5', '-c:a', 'mp2', '-b:a', '192k'] }
  };
  return settings[format] || null;
}

async function withJob(res, handler) {
  if (activeJobs >= MAX_ACTIVE_JOBS) {
    return fail(res, 503, 'BUSY', 'The converter is busy. Please retry in a moment.');
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
    if (!error) {
      // multer reports non-ASCII file names as latin1; restore the UTF-8 name.
      if (req.file && req.file.originalname) {
        const utf8 = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
        if (!utf8.includes('\uFFFD')) req.file.originalname = utf8;
      }
      return next();
    }
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return fail(res, 413, 'FILE_TOO_LARGE', 'Uploaded file is too large.');
    }
    return fail(res, 400, 'INVALID_UPLOAD', 'Invalid upload.');
  });
}

function sendFile(res, buffer, contentType, filename) {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Cache-Control', 'no-store');
  return res.send(buffer);
}

app.get('/', (_req, res) => {
  res.json({ service: 'Convertios conversion backend', status: 'ok' });
});

app.get('/health', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    status: 'ok',
    version: SERVICE_VERSION,
    activeJobs,
    maxActiveJobs: MAX_ACTIVE_JOBS,
    engines: {
      pdfToWord: 'pdf2docx',
      backgroundRemoval: 'rembg/u2netp',
      videoToMp3: 'ffmpeg',
      videoConverter: 'ffmpeg',
      linkShortener: apiConfig.shortenerProviders.map((provider) => provider.name).join('+'),
      imageEnhancement: 'cloudinary-ai'
    }
  });
});

app.post('/api/shorten-url', shortenRateLimit, express.json({ limit: '4kb' }), async (req, res) => {
  const result = await api.handleShorten(req.body, apiConfig);
  res.setHeader('Cache-Control', 'no-store');
  return res.status(result.status).json(result.body);
});

app.post('/api/enhance-image', conversionRateLimit, uploadSingle(enhanceUpload, 'image'), async (req, res) => {
  if (!req.file) return fail(res, 400, 'NO_FILE', 'No image uploaded.');
  if (activeJobs >= MAX_ACTIVE_JOBS) return fail(res, 503, 'BUSY', 'The server is busy. Please retry in a moment.');
  activeJobs += 1;
  try {
    const result = await api.handleEnhance(req.file, apiConfig);
    if (result.status !== 200) return res.status(result.status).json(result.body);
    return sendFile(res, result.buffer, result.mime, result.filename);
  } finally {
    activeJobs -= 1;
  }
});

app.post('/convert/pdf-to-word', conversionRateLimit, uploadSingle(documentUpload, 'file'), async (req, res) => {
  if (!req.file) return fail(res, 400, 'NO_FILE', 'No PDF uploaded.');
  if (!api.isPdf(req.file.buffer)) return fail(res, 415, 'UNSUPPORTED_FORMAT', 'Uploaded file must be a PDF.');

  return withJob(res, async (jobDir) => {
    const input = path.join(jobDir, `${crypto.randomUUID()}.pdf`);
    const output = path.join(jobDir, `${crypto.randomUUID()}.docx`);
    await fs.writeFile(input, req.file.buffer, { mode: 0o600 });
    await runPython('pdf_to_docx.py', [input, output]);
    const result = await fs.readFile(output);
    return sendFile(res, result, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', api.safeDownloadName(req.file.originalname, '.docx', 'converted'));
  });
});

app.post('/remove-background', conversionRateLimit, uploadSingle(imageUpload, 'image_file'), async (req, res) => {
  if (!req.file) return fail(res, 400, 'NO_FILE', 'No image uploaded.');
  const type = api.detectImageType(req.file.buffer);
  if (!type) return fail(res, 415, 'UNSUPPORTED_FORMAT', 'Upload a JPG, PNG or WEBP image.');

  return withJob(res, async (jobDir) => {
    const input = path.join(jobDir, `${crypto.randomUUID()}${type.ext}`);
    const output = path.join(jobDir, `${crypto.randomUUID()}.png`);
    await fs.writeFile(input, req.file.buffer, { mode: 0o600 });
    await runPython('remove_background.py', [input, output]);
    const result = await fs.readFile(output);
    return sendFile(res, result, 'image/png', api.safeDownloadName(req.file.originalname, '-no-bg.png', 'image'));
  });
});

app.post('/convert/video-to-mp3', videoConversionRateLimit, uploadSingle(videoUpload, 'file'), async (req, res) => {
  if (!req.file) return fail(res, 400, 'NO_FILE', 'No video uploaded.');
  const extension = videoInputExtension(req.file);
  if (!extension) return fail(res, 415, 'UNSUPPORTED_FORMAT', 'Unsupported video file.');

  return withJob(res, async (jobDir) => {
    const input = path.join(jobDir, `${crypto.randomUUID()}${extension}`);
    const output = path.join(jobDir, `${crypto.randomUUID()}.mp3`);
    await fs.writeFile(input, req.file.buffer, { mode: 0o600 });
    await runProcess('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-i', input, '-vn', '-c:a', 'libmp3lame', '-b:a', '192k', output], VIDEO_PROCESS_TIMEOUT_MS);
    const result = await fs.readFile(output);
    return sendFile(res, result, 'audio/mpeg', api.safeDownloadName(req.file.originalname, '.mp3', 'audio'));
  });
});

app.post('/convert/video', videoConversionRateLimit, uploadSingle(videoUpload, 'file'), async (req, res) => {
  if (!req.file) return fail(res, 400, 'NO_FILE', 'No video uploaded.');
  const extension = videoInputExtension(req.file);
  const format = String(req.body?.format || '').toLowerCase();
  const settings = videoFormatSettings(format);
  if (!extension) return fail(res, 415, 'UNSUPPORTED_FORMAT', 'Unsupported input video file.');
  if (!settings) return fail(res, 400, 'UNSUPPORTED_OUTPUT', 'Unsupported output format.');

  return withJob(res, async (jobDir) => {
    const input = path.join(jobDir, `${crypto.randomUUID()}${extension}`);
    const output = path.join(jobDir, `${crypto.randomUUID()}${settings.extension}`);
    await fs.writeFile(input, req.file.buffer, { mode: 0o600 });
    await runProcess('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-i', input, ...settings.args, output], VIDEO_PROCESS_TIMEOUT_MS);
    const result = await fs.readFile(output);
    return sendFile(res, result, settings.contentType, api.safeDownloadName(req.file.originalname, settings.extension, 'converted-video'));
  });
});

app.use((_req, res) => fail(res, 404, 'NOT_FOUND', 'Not found.'));

app.use((error, _req, res, _next) => {
  if (error.message === 'Origin not allowed by CORS') return fail(res, 403, 'ORIGIN_NOT_ALLOWED', 'Origin not allowed.');
  if (error.type === 'entity.parse.failed' || error.type === 'entity.too.large') return fail(res, 400, 'INVALID_REQUEST', 'Invalid request.');
  // Log only a short reason: processor output can contain temporary file paths.
  console.error('[server] Request failed:', error.code || String(error.message || '').split('\n')[0].slice(0, 200));
  if (error.code === 'PROCESSING_TIMEOUT') return fail(res, 504, 'PROCESSING_TIMEOUT', 'Processing took too long. Try a smaller file.');
  return fail(res, 500, 'PROCESSING_FAILED', 'Processing failed. Check the file and try again.');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Convertios backend ${SERVICE_VERSION} listening on port ${PORT}`);
  });
}

module.exports = { app };
