// Backend logic tests. Run with: npm test   (Node 20+, no extra packages needed)
// External providers (TinyURL, is.gd, Cloudinary, an optional enhancement workflow) are replaced by a local mock server,
// so these tests never call third-party services.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const api = require('../backend/api');

const PNG_1x1 = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360f8cf00000301010018dd8db40000000049454e44ae426082', 'hex');
const JPEG_HEAD = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(20)]);

let mock;
let base;
const calls = [];
const mode = { tiny: 'ok', enhance: 'ok', cld: 'ok', width: 800 };

test.before(async () => {
  mock = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://mock');
    calls.push(url.pathname);
    const json = (status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
    if (url.pathname === '/tiny') {
      if (mode.tiny === 'down') { res.writeHead(500); return res.end('Error'); }
      if (mode.tiny === 'slow') return setTimeout(() => res.end('https://tinyurl.com/late'), 9_500);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(url.searchParams.get('url') ? 'https://tinyurl.com/abc123' : 'Error');
    }
    if (url.pathname === '/isgd') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end('https://is.gd/xyz789');
    }
    if (url.pathname === '/upload') {
      req.resume();
      return req.on('end', () => json(200, { secure_url: `${base}/image/upload/v1/sample.png`, width: mode.width, height: 600 }));
    }
    if (url.pathname.startsWith('/image/upload/')) {
      // Cloudinary delivery URL with transformations
      if (mode.cld === 'down' || (mode.cld === 'no-upscale' && url.pathname.includes('e_upscale'))) {
        res.writeHead(400, { 'x-cld-error': 'mock failure' });
        return res.end();
      }
      res.writeHead(200, { 'Content-Type': 'image/png' });
      return res.end(PNG_1x1);
    }
    if (url.pathname === '/enhance') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      return req.on('end', () => {
        if (mode.enhance === 'fail') return json(500, {});
        if (mode.enhance === 'not-image') return json(200, { success: true, imageUrl: `${base}/notimage` });
        const imageUrl = mode.enhance === 'evil-host' ? 'http://169.254.169.254/latest/meta-data' : `${base}/result.png`;
        return json(200, { success: true, imageUrl, received: JSON.parse(body).image });
      });
    }
    if (url.pathname === '/result.png') { res.writeHead(200, { 'Content-Type': 'image/png' }); return res.end(PNG_1x1); }
    if (url.pathname === '/notimage') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end('<html>'); }
    res.writeHead(404);
    return res.end();
  });
  await new Promise((resolve) => mock.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${mock.address().port}`;
});

test.after(() => mock && mock.close());

function config() {
  return api.loadConfig({
    SHORTENER_TINYURL_ENDPOINT: `${base}/tiny`,
    SHORTENER_ISGD_ENDPOINT: `${base}/isgd`,
    CLOUDINARY_UPLOAD_URL: `${base}/upload`,
    ENHANCED_IMAGE_HOSTS: base
  });
}
function workflowConfig() {
  return { ...config(), enhanceWorkflowUrl: `${base}/enhance` };
}

test('URL validation accepts real web addresses only', () => {
  assert.equal(api.normalizeShortenTarget('example.com/a?b=1'), 'https://example.com/a?b=1');
  assert.equal(api.normalizeShortenTarget('https://convertios.com/merge-pdf/'), 'https://convertios.com/merge-pdf/');
  assert.equal(api.normalizeShortenTarget('http://sub.example.co.uk/path#x'), 'http://sub.example.co.uk/path#x');
  assert.ok(api.normalizeShortenTarget('https://مثال.إختبار/صفحة'), 'international domains are accepted');
  for (const bad of ['', '   ', 'not a url', 'javascript:alert(1)', 'data:text/html,hi', 'ftp://example.com/x', 'http://localhost/x', 'http://intranet/x', 'http://192.168.1.1/', 'http://[::1]/', 'https://user:pass@example.com/', 'https://exa mple.com', 'https://-bad-.com', 'https://example.123', 'x'.repeat(3000), 42, null, undefined, {}]) {
    assert.equal(api.normalizeShortenTarget(bad), null, `should reject ${String(bad).slice(0, 30)}`);
  }
});

test('shorten returns a short link', async () => {
  const r = await api.handleShorten({ url: 'example.com/some/page' }, config());
  assert.equal(r.status, 200);
  assert.deepEqual(r.body, { shortUrl: 'https://tinyurl.com/abc123', longUrl: 'https://example.com/some/page' });
});

test('shorten rejects invalid input with a stable code', async () => {
  for (const body of [{}, { url: 'nope' }, { url: 'ftp://x.com' }, null]) {
    const r = await api.handleShorten(body, config());
    assert.equal(r.status, 400);
    assert.equal(r.body.code, 'INVALID_URL');
  }
});

test('shorten falls back to the second provider', async () => {
  mode.tiny = 'down';
  const r = await api.handleShorten({ url: 'https://convertios.com/' }, config());
  mode.tiny = 'ok';
  assert.equal(r.status, 200);
  assert.equal(r.body.shortUrl, 'https://is.gd/xyz789');
});

test('shorten reports an outage when every provider fails', async () => {
  const cfg = config();
  cfg.shortenerProviders = cfg.shortenerProviders.map((p) => ({ ...p, endpoint: `${base}/missing` }));
  const r = await api.handleShorten({ url: 'https://convertios.com/' }, cfg);
  assert.equal(r.status, 422);
  assert.equal(r.body.code, 'SHORTENER_REJECTED');
  cfg.shortenerProviders = cfg.shortenerProviders.map((p) => ({ ...p, endpoint: 'http://127.0.0.1:9/' }));
  const down = await api.handleShorten({ url: 'https://convertios.com/' }, cfg);
  assert.equal(down.status, 503);
  assert.equal(down.body.code, 'UPSTREAM_UNAVAILABLE');
});

test('enhance validates the upload', async () => {
  assert.equal((await api.handleEnhance(null, config())).body.code, 'NO_FILE');
  assert.equal((await api.handleEnhance({ buffer: Buffer.from('<html>'), originalname: 'x.png' }, config())).body.code, 'UNSUPPORTED_FORMAT');
  const big = { buffer: Buffer.concat([JPEG_HEAD, Buffer.alloc(api.LIMITS.enhanceUploadBytes)]), originalname: 'big.jpg' };
  assert.equal((await api.handleEnhance(big, config())).body.code, 'FILE_TOO_LARGE');
});

test('enhance returns Cloudinary AI-enhanced bytes with a safe filename', async () => {
  const before = calls.length;
  const r = await api.handleEnhance({ buffer: PNG_1x1, originalname: '../../My Photo.png' }, config());
  assert.equal(r.status, 200);
  assert.equal(r.mime, 'image/png');
  assert.equal(r.filename, 'My-Photo-enhanced.png');
  assert.ok(r.buffer.subarray(0, 8).equals(PNG_1x1.subarray(0, 8)));
  const used = calls.slice(before).filter((p) => p.startsWith('/image/upload/'));
  assert.deepEqual(used, ['/image/upload/e_gen_restore/e_enhance/e_upscale/v1/sample.png'], 'small images are restored and upscaled');
});

test('enhance skips upscaling for large images and falls back through effects', async () => {
  mode.width = 2400;
  let before = calls.length;
  await api.handleEnhance({ buffer: PNG_1x1, originalname: 'a.png' }, config());
  assert.deepEqual(calls.slice(before).filter((p) => p.startsWith('/image/upload/')), ['/image/upload/e_gen_restore/e_enhance/v1/sample.png']);
  mode.width = 800;
  mode.cld = 'no-upscale';
  before = calls.length;
  const r = await api.handleEnhance({ buffer: PNG_1x1, originalname: 'a.png' }, config());
  mode.cld = 'ok';
  assert.equal(r.status, 200);
  assert.equal(calls.slice(before).filter((p) => p.startsWith('/image/upload/')).length, 2);
});

test('enhance uses a configured workflow first and falls back to Cloudinary when it fails', async () => {
  let before = calls.length;
  const ok = await api.handleEnhance({ buffer: PNG_1x1, originalname: 'a.png' }, workflowConfig());
  assert.equal(ok.status, 200);
  assert.ok(calls.slice(before).includes('/result.png'));
  mode.enhance = 'fail';
  before = calls.length;
  const fallback = await api.handleEnhance({ buffer: PNG_1x1, originalname: 'a.png' }, workflowConfig());
  mode.enhance = 'ok';
  assert.equal(fallback.status, 200);
  assert.ok(calls.slice(before).some((p) => p.startsWith('/image/upload/e_')));
});

test('enhance never fetches result URLs outside the allow-list (SSRF guard)', async () => {
  mode.enhance = 'evil-host';
  mode.cld = 'down';
  const before = calls.length;
  const r = await api.handleEnhance({ buffer: PNG_1x1, originalname: 'a.png' }, workflowConfig());
  mode.enhance = 'ok';
  mode.cld = 'ok';
  assert.equal(r.status, 502);
  assert.equal(r.body.code, 'ENHANCER_UNAVAILABLE');
  assert.ok(!calls.slice(before).some((p) => p.includes('meta-data')));
});

test('enhance reports an outage when no engine returns an image', async () => {
  mode.enhance = 'not-image';
  mode.cld = 'down';
  assert.equal((await api.handleEnhance({ buffer: PNG_1x1, originalname: 'a.png' }, workflowConfig())).body.code, 'ENHANCER_UNAVAILABLE');
  mode.enhance = 'ok';
  assert.equal((await api.handleEnhance({ buffer: PNG_1x1, originalname: 'a.png' }, config())).body.code, 'ENHANCER_UNAVAILABLE');
  mode.cld = 'ok';
});

test('file signature helpers', () => {
  assert.equal(api.detectImageType(PNG_1x1).mime, 'image/png');
  assert.equal(api.detectImageType(JPEG_HEAD).mime, 'image/jpeg');
  assert.equal(api.detectImageType(Buffer.from('RIFF\0\0\0\0WEBPVP8 ')).mime, 'image/webp');
  assert.equal(api.detectImageType(Buffer.from('GIF89a......')), null);
  assert.ok(api.isPdf(Buffer.from('%PDF-1.7\n')));
  assert.ok(!api.isPdf(Buffer.from('hello world')));
  assert.equal(api.safeDownloadName('a/b/../evil name.pdf', '.docx', 'converted'), 'evil-name.docx');
  assert.equal(api.safeDownloadName('', '.mp3', 'audio'), 'audio.mp3');
  assert.equal(api.safeDownloadName('صورة.jpg', '-enhanced.jpg', 'image'), 'image-enhanced.jpg');
  assert.equal(api.safeDownloadName('Canción ñ.pdf', '.docx', 'converted'), 'Cancion-n.docx');
});

test('server wiring references every handler (static check)', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
  for (const route of ["'/api/shorten-url'", "'/api/enhance-image'", "'/convert/pdf-to-word'", "'/convert/video-to-mp3'", "'/convert/video'", "'/health'"]) {
    assert.ok(src.includes(`app.post(${route}`) || src.includes(`app.get(${route}`), `route ${route} is registered`);
  }
  assert.ok(src.includes('api.handleShorten') && src.includes('api.handleEnhance'));
  assert.ok(!/res\.status\(\d+\)\.json\(\{ error: [^}]*stack/.test(src), 'no stack traces sent to clients');
});
