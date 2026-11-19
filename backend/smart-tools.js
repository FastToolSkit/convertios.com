'use strict';

const path = require('node:path');

const {spawn} = require('node:child_process');
const multer = require('multer');

const formats = new Map([
  ['heic-to-jpg', ['jpg', 'image/jpeg', 10]],
  ['heic-to-pdf', ['pdf', 'application/pdf', 10]],
  ['avif-to-png', ['png', 'image/png', 10]],
  ['gif-compressor', ['gif', 'image/gif', 10]],
  ['mp4-to-gif', ['gif', 'image/gif', 50]],
  ['video-compressor', ['mp4', 'video/mp4', 50]],
  ['image-to-text', ['txt', 'text/plain', 10]],
  ['pdf-to-text', ['txt', 'text/plain', 20]],
]);
const userErrors = new Set(['LIMIT', 'INVALID_FILE', 'NO_TEXT', 'BAD_OPTIONS', 'ANIMATED', 'NO_GAIN', 'TIMEOUT']);

function processFiles(python, cwd, args, res) {
  return new Promise((resolve, reject) => {
    const group = process.platform === 'linux';
    const worker = spawn(python, [path.join(__dirname, 'smart_tools.py'), ...args], {
      cwd, detached: group, stdio: ['ignore', 'ignore', 'pipe'],
      env: {MALLOC_ARENA_MAX: '2', PATH: process.env.PATH, LANG: 'C.UTF-8', SystemRoot: process.env.SystemRoot, PYTHONDONTWRITEBYTECODE: '1'}
    });
    let stopped = false;
    let diagnostic = '';
    function stop() {
      stopped = true;
      if (worker.pid) {
        try { process.kill(group ? -worker.pid : worker.pid, 'SIGKILL'); } catch (error) {
          if (error.code !== 'ESRCH') worker.kill();
        }
      }
    }
    const timeout = setTimeout(stop, 90_000);
    res.on('close', stop);
    if (res.destroyed) stop();
    worker.stderr.on('data', chunk => { diagnostic = (diagnostic + chunk).slice(-1024); });
    worker.on('error', reject);
    worker.on('close', code => {
      clearTimeout(timeout);
      res.off('close', stop);
      if (code === 0 && !stopped) return resolve();
      reject(new Error(stopped ? 'TIMEOUT' : diagnostic.trim()));
    });
  });
}

module.exports = function registerSmartTools(app, {withJob, limiter, python, fail}) {
  let occupied = false;
  app.post('/convert/smart/:tool', limiter, async (req, res) => {
    const tool = req.params.tool;
    if (!formats.has(tool)) return fail(res, 404, 'NOT_FOUND', 'Unknown tool.');
    if (occupied) return fail(res, 503, 'BUSY', 'Retry when the processor is available.');
    occupied = true;
    try {
      return await withJob(res, async dir => {
        const [extension, mime, maxMiB] = formats.get(tool);
        const count = tool === 'heic-to-pdf' ? 6 : 1;
        const upload = multer({dest: dir, limits: {
          files: count, fileSize: maxMiB * 1024 ** 2, fields: 6, fieldSize: 48, parts: count + 7
        }}).array('file', count);
        try {
          await new Promise((resolve, reject) => upload(req, res, error => error ? reject(error) : resolve()));
        } catch (error) {
          return fail(res, 413, 'LIMIT', 'Upload exceeds the supported limits.');
        }
        if (!req.files?.length || req.files.some(file => !file.size)) {
          return fail(res, 400, 'INVALID_FILE', 'Choose a nonempty file.');
        }
        const output = 'converted.' + extension;
        try {
          await processFiles(python, dir, [tool, output, JSON.stringify(req.body || {}), ...req.files.map(f => f.filename)], res);
        } catch (error) {
          if (res.destroyed) return;
          const code = userErrors.has(error.message) ? error.message : 'PROCESSING_FAILED';
          return fail(res, code === 'PROCESSING_FAILED' ? 500 : 422, code, 'Conversion could not complete.');
        }
        res.setHeader('Cache-Control', 'no-store');
        res.type(mime);
        await new Promise((resolve, reject) => {
          res.download(path.join(dir, output), output, error => error ? reject(error) : resolve());
        });
      });
    } finally {
      occupied = false;
    }
  });
};
