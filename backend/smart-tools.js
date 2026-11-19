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
const artifactFormats = new Map([
  ['invoice-generator', ['pdf', 'application/pdf', 2]],
  ['csv-xlsx-converter', ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 6]],
  ['compress-pdf', ['pdf', 'application/pdf', 15]],
  ['searchable-pdf-ocr', ['pdf', 'application/pdf', 12]],
  ['xlsx-sheets', ['json', 'application/json', 6]],
]);
const userErrors = new Set(['LIMIT', 'INVALID_FILE', 'NO_TEXT', 'BAD_OPTIONS', 'ANIMATED', 'NO_GAIN', 'TIMEOUT', 'ENCODING', 'FONT_UNAVAILABLE']);

function processFiles(python, cwd, args, res, script = 'smart_tools.py') {
  return new Promise((resolve, reject) => {
    const group = process.platform === 'linux';
    const worker = spawn(python, [path.join(__dirname, script), ...args], {
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
  app.post('/convert/artifact/:tool', limiter, async (req, res) => {
    const tool = req.params.tool;
    if (!artifactFormats.has(tool)) return fail(res, 404, 'NOT_FOUND', 'Unknown tool.');
    return withJob(res, async dir => {
      let [extension, mime, maxMiB] = artifactFormats.get(tool);
      const upload = multer({dest: dir, limits: {
        files: 1, fileSize: maxMiB * 1024 ** 2, fields: 8,
        fieldSize: tool === 'invoice-generator' ? 22000 : 100,
        parts: 10
      }}).array('file', 1);
      try {
        await new Promise((resolve, reject) => upload(req, res, error => error ? reject(error) : resolve()));
      } catch {
        return fail(res, 413, 'LIMIT', 'Upload exceeds the supported limits.');
      }
      const count = req.files?.length || 0;
      if ((tool === 'invoice-generator' ? count > 1 : count !== 1) || req.files?.some(file => !file.size)) {
        return fail(res, 400, 'INVALID_FILE', 'Choose a valid file.');
      }
      if (tool === 'csv-xlsx-converter' && req.body?.direction === 'xlsx-csv') {
        extension = 'csv'; mime = 'text/csv; charset=' + (req.body?.encoding === 'windows-1252' ? 'windows-1252' : 'utf-8');
      }
      const output = 'converted.' + extension;
      try {
        await processFiles(python, dir, [tool, output, JSON.stringify(req.body || {}), ...(req.files || []).map(f => f.filename)], res, 'utility_artifacts.py');
      } catch (error) {
        if (res.destroyed) return;
        const code = userErrors.has(error.message) ? error.message : 'PROCESSING_FAILED';
        return fail(res, code === 'PROCESSING_FAILED' ? 500 : 422, code, 'Conversion could not complete.');
      }
      res.setHeader('Cache-Control', 'no-store');
      if (tool === 'xlsx-sheets') {
        res.type('json');
        return new Promise((resolve, reject) => {
          res.sendFile(path.join(dir, output), error => error ? reject(error) : resolve());
        });
      }
      res.type(mime);
      await new Promise((resolve, reject) => {
        res.download(path.join(dir, output), output, error => error ? reject(error) : resolve());
      });
    }, {exclusive: true});
  });
  app.post('/convert/smart/:tool', limiter, async (req, res) => {
    const tool = req.params.tool;
    if (!formats.has(tool)) return fail(res, 404, 'NOT_FOUND', 'Unknown tool.');
    return withJob(res, async dir => {
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
    }, {exclusive: true});
  });
};
