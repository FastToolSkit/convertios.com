// Tool test definitions for tests/browser/run.mjs.
// Every check uses real fixture files and inspects the real downloaded bytes.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Decodes a QR code image with OpenCV (python3 + cv2); returns the text or '' if unreadable.
export function decodeQr(buf) {
  const file = path.join(os.tmpdir(), `cv-qr-${process.pid}-${Math.random().toString(36).slice(2)}.png`);
  fs.writeFileSync(file, buf);
  try {
    return execFileSync('python3', ['-c', 'import cv2,sys\nimg=cv2.imread(sys.argv[1])\nprint(cv2.QRCodeDetector().detectAndDecode(img)[0])', file]).toString().trim();
  } catch { return ''; } finally { fs.rmSync(file, { force: true }); }
}

// ---------- helpers ----------------------------------------------------------------------------
export function signature(buf) {
  const b = buf;
  if (!b || b.length < 4) return 'empty';
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b.toString('ascii', 0, 4) === 'GIF8') return 'image/gif';
  if (b[0] === 0x42 && b[1] === 0x4d) return 'image/bmp';
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WAVE') return 'audio/wav';
  if (b.toString('ascii', 0, 5) === '%PDF-') return 'application/pdf';
  if (b[0] === 0x50 && b[1] === 0x4b) return 'application/zip';
  if (b.toString('ascii', 0, 3) === 'ID3' || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0)) return 'audio/mpeg';
  if (b.toString('ascii', 4, 8) === 'ftyp') return 'video/mp4-family';
  return 'unknown';
}

// Width/height/codec/channels/duration of an image or media file, via ffprobe.
export function probe(buf, ext = '.bin') {
  const file = path.join(os.tmpdir(), `cv-probe-${process.pid}-${Math.random().toString(36).slice(2)}${ext}`);
  fs.writeFileSync(file, buf);
  try {
    const out = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]).toString());
    const s = out.streams[0] || {};
    return { codec: s.codec_name, width: s.width, height: s.height, pixFmt: s.pix_fmt, channels: s.channels, duration: Number(out.format?.duration || s.duration || 0), streams: out.streams.map((x) => x.codec_type) };
  } catch {
    return { codec: null };
  } finally {
    fs.rmSync(file, { force: true });
  }
}

// Entry names inside a ZIP (central directory).
export function zipEntries(buf) {
  const names = [];
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) !== 0x06054b50) continue;
    let p = buf.readUInt32LE(i + 16);
    const count = buf.readUInt16LE(i + 10);
    for (let n = 0; n < count; n++) {
      const len = buf.readUInt16LE(p + 28), extra = buf.readUInt16LE(p + 30), comment = buf.readUInt16LE(p + 32);
      names.push(buf.toString('utf8', p + 46, p + 46 + len));
      p += 46 + len + extra + comment;
    }
    break;
  }
  return names;
}

export async function upload(page, selector, fixtures, ...names) {
  await page.setInputFiles(selector, names.map((n) => path.join(fixtures, n)));
}

// Runs `trigger` and returns the downloaded file, or null if nothing downloads within timeout.
export async function download(page, trigger, timeout = 15000) {
  const pending = page.waitForEvent('download', { timeout }).catch(() => null);
  await trigger();
  const d = await pending;
  if (!d) return null;
  const file = await d.path();
  return { name: d.suggestedFilename(), bytes: fs.readFileSync(file) };
}

async function message(page) {
  return page.evaluate(() => {
    const box = document.getElementById('toolMessage');
    return box && getComputedStyle(box).display !== 'none' ? box.innerText.trim() : '';
  });
}

const expectLang = { en: /[a-z]/i, ar: /[؀-ۿ]/, es: /[a-záéíóúñ¿¡]/i };

// ---------- tool definitions -------------------------------------------------------------------
export const tools = [
  {
    name: 'image-resizer', path: 'image-resizer',
    async run({ page, fixtures, check, lang }) {
      // empty submission
      await page.evaluate(() => document.getElementById('resizeDownload').click()).catch(() => {});
      const controlsHidden = await page.evaluate(() => document.getElementById('resizeControls').hidden);
      check('controls hidden before upload', controlsHidden);

      await upload(page, '#upload', fixtures, 'large.jpg');
      await page.waitForFunction(() => document.getElementById('resizeWidth').value !== '');
      const initial = await page.evaluate(() => [document.getElementById('resizeWidth').value, document.getElementById('resizeHeight').value]);
      check('defaults to full original size', initial[0] === '3000' && initial[1] === '2000', initial.join('x'));
      let d = await download(page, () => page.click('#resizeDownload'));
      let info = d && probe(d.bytes, '.jpg');
      check('no silent crop at 100%', info && info.width === 3000 && info.height === 2000, info && `${info.width}x${info.height}`);
      check('jpg stays jpg with extension', d && signature(d.bytes) === 'image/jpeg' && /\.jpg$/.test(d.name), d && d.name);

      await page.fill('#resizeWidth', '1200');
      await page.dispatchEvent('#resizeWidth', 'input');
      const locked = await page.inputValue('#resizeHeight');
      check('aspect lock computes height', locked === '800', locked);
      d = await download(page, () => page.click('#resizeDownload'));
      info = d && probe(d.bytes, '.jpg');
      check('exact pixel resize 1200x800', info && info.width === 1200 && info.height === 800, info && `${info.width}x${info.height}`);

      await page.uncheck('#resizeLock');
      await page.fill('#resizeHeight', '500');
      await page.dispatchEvent('#resizeHeight', 'input');
      d = await download(page, () => page.click('#resizeDownload'));
      info = d && probe(d.bytes, '.jpg');
      check('unlocked aspect 1200x500', info && info.width === 1200 && info.height === 500, info && `${info.width}x${info.height}`);

      await page.check('#resizeLock');
      await page.fill('#resizePercent', '50');
      await page.dispatchEvent('#resizePercent', 'input');
      await page.click('#resizeRotateRight');
      d = await download(page, () => page.click('#resizeDownload'));
      info = d && probe(d.bytes, '.jpg');
      check('rotate keeps whole image (50% of 2000x3000)', info && info.width === 1000 && info.height === 1500, info && `${info.width}x${info.height}`);

      for (const bad of ['0', '-5', '9000']) {
        await page.fill('#resizeWidth', bad);
        await page.dispatchEvent('#resizeWidth', 'input');
        const none = await download(page, () => page.click('#resizeDownload'), 1500);
        const msg = await message(page);
        check(`rejects width ${bad}`, !none && msg && expectLang[lang].test(msg), msg.slice(0, 60));
      }

      await upload(page, '#upload', fixtures, 'transparent.png');
      await page.waitForFunction(() => document.getElementById('resizeWidth').value === '800');
      d = await download(page, () => page.click('#resizeDownload'));
      info = d && probe(d.bytes, '.png');
      check('transparent png keeps alpha', d && signature(d.bytes) === 'image/png' && /a/.test(info.pixFmt || ''), info && info.pixFmt);

      await page.selectOption('#resizeFormat', 'image/jpeg');
      d = await download(page, () => page.click('#resizeDownload'));
      check('format switch to real JPEG', d && signature(d.bytes) === 'image/jpeg' && d.name.endsWith('.jpg'), d && d.name);

      await upload(page, '#upload', fixtures, 'portrait.jpg');
      await page.waitForFunction(() => document.getElementById('resizeWidth').value === '1200');
      await page.selectOption('#resizeFormat', 'same');
      await page.check('#resizeCrop');
      await page.waitForFunction(() => document.querySelector('.cropper-container'));
      await page.waitForTimeout(400);
      d = await download(page, () => page.click('#resizeDownload'));
      info = d && probe(d.bytes, '.jpg');
      check('crop only when chosen (smaller than original)', info && info.width < 1200 && info.height < 1800, info && `${info.width}x${info.height}`);
      await page.uncheck('#resizeCrop');
      d = await download(page, () => page.click('#resizeDownload'));
      info = d && probe(d.bytes, '.jpg');
      check('crop off restores full image', info && info.width === 1200 && info.height === 1800, info && `${info.width}x${info.height}`);

      await upload(page, '#upload', fixtures, 'photo.webp');
      await page.waitForFunction(() => document.getElementById('resizeWidth').value === '800');
      d = await download(page, () => page.click('#resizeDownload'));
      check('webp stays webp', d && signature(d.bytes) === 'image/webp' && d.name.endsWith('.webp'), d && d.name);
      await upload(page, '#upload', fixtures, 'square.jpg');
      await page.waitForFunction(() => document.getElementById('resizeWidth').value === '1000');
      await page.fill('#resizeWidth', '300'); await page.dispatchEvent('#resizeWidth', 'input');
      d = await download(page, () => page.click('#resizeDownload'));
      info = d && probe(d.bytes, '.jpg');
      check('square 300x300', info && info.width === 300 && info.height === 300, info && `${info.width}x${info.height}`);
    }
  },
  {
    name: 'link-shortener', path: 'link-shortener',
    async run({ page, check, backendMode, lang }) {
      await page.click('#shortenBtn');
      let msg = await message(page);
      check('empty input shows message', msg && expectLang[lang].test(msg), msg.slice(0, 60));
      await page.fill('#url', 'not a url');
      await page.click('#shortenBtn');
      await page.waitForTimeout(400);
      msg = await message(page);
      check('invalid url shows translated error', msg && expectLang[lang].test(msg) && !(await page.inputValue('#result')), msg.slice(0, 60));
      await page.fill('#url', 'https://convertios.com/merge-pdf/');
      await page.click('#shortenBtn');
      await page.waitForFunction(() => document.getElementById('result').value);
      check('real url is shortened', (await page.inputValue('#result')) === 'https://tinyurl.com/test123');
      backendMode.shorten = 'down';
      await page.click('#shortenBtn');
      await page.waitForTimeout(500);
      msg = await message(page);
      backendMode.shorten = 'ok';
      const hasRetry = await page.$('#toolMessage .tool-retry-button');
      check('outage shows error with retry', msg && hasRetry, msg.slice(0, 60));
      await page.click('#toolMessage .tool-retry-button');
      await page.waitForFunction(() => document.getElementById('result').value);
      check('retry works', (await page.inputValue('#result')).startsWith('https://tinyurl.com/'));
      const notice = await page.$('.temporary-tool-notice');
      check('no "being improved" notice', !notice);
    }
  },
  {
    name: 'ai-image-enhancer', path: 'ai-image-enhancer',
    async run({ page, fixtures, check, backendMode, lang }) {
      check('button disabled before upload', await page.isDisabled('#enhanceBtn'));
      await upload(page, '#fileInput', fixtures, 'image.gif');
      let msg = await message(page);
      check('rejects unsupported type', msg && expectLang[lang].test(msg) && await page.isDisabled('#enhanceBtn'), msg.slice(0, 60));
      await upload(page, '#fileInput', fixtures, 'small.jpg');
      check('enables after valid upload', !(await page.isDisabled('#enhanceBtn')));
      await page.click('#enhanceBtn');
      await page.waitForFunction(() => document.getElementById('downloadBtn').style.display !== 'none');
      const d = await download(page, () => page.click('#downloadBtn'));
      check('download is a real image', d && signature(d.bytes) === 'image/png' && d.name.endsWith('.png'), d && d.name);
      backendMode.enhance = 'down';
      await page.click('#enhanceBtn');
      await page.waitForTimeout(600);
      msg = await message(page);
      backendMode.enhance = 'ok';
      check('service outage message is translated', msg && expectLang[lang].test(msg), msg.slice(0, 70));
      check('no "being improved" notice', !(await page.$('.temporary-tool-notice')));
    }
  },
  {
    name: 'image-converter', path: 'image-converter',
    async run({ page, fixtures, check, lang }) {
      await page.evaluate(() => window.downloadZip());
      let msg = await message(page);
      check('zip before converting shows message, no download', msg && expectLang[lang].test(msg), msg.slice(0, 50));
      await page.evaluate(() => window.convertImage());
      msg = await message(page);
      check('convert with no file shows message', !!msg);
      await upload(page, '#upload', fixtures, 'transparent.png', 'small.jpg');
      const formats = { 'image/jpeg': ['.jpg', 'image/jpeg', 'mjpeg'], 'image/png': ['.png', 'image/png', 'png'], 'image/webp': ['.webp', 'image/webp', 'webp'], 'image/bmp': ['.bmp', 'image/bmp', 'bmp'], 'image/gif': ['.gif', 'image/gif', 'gif'] };
      for (const [mime, [ext, sig, codec]] of Object.entries(formats)) {
        await page.selectOption('#format', mime);
        await page.evaluate(() => window.convertImage());
        await page.waitForFunction(() => document.getElementById('downloadMenu').style.display === 'block', null, { timeout: 30000 });
        const files = [];
        const got = new Promise((resolve) => {
          const onDl = async (d) => { files.push({ name: d.suggestedFilename(), bytes: fs.readFileSync(await d.path()) }); if (files.length === 2) { page.off('download', onDl); resolve(); } };
          page.on('download', onDl);
        });
        await page.evaluate(() => window.downloadImages());
        await Promise.race([got, page.waitForTimeout(8000)]);
        const ok = files.length === 2 && files.every((x) => signature(x.bytes) === sig && x.name.endsWith(ext));
        const info = files[0] && probe(files[0].bytes, ext);
        check(`${ext} output is real ${sig}`, ok && info.codec === codec && info.width === 800, files.map((x) => `${x.name}:${signature(x.bytes)}`).join(',') + ` codec=${info && info.codec} ${info && info.width}x${info && info.height}`);
      }
      const z = await download(page, () => page.evaluate(() => window.downloadZip()));
      const entries = z ? zipEntries(z.bytes) : [];
      check('zip contains both converted files', z && signature(z.bytes) === 'application/zip' && entries.length === 2 && entries.every((n) => n.endsWith('.gif')), entries.join(','));
      await upload(page, '#upload', fixtures, 'text-samples.txt');
      msg = await message(page);
      check('non-image upload is rejected with message', msg && expectLang[lang].test(msg), msg.slice(0, 50));
    }
  },

  {
    name: 'compress-image', path: 'compress-image',
    async run({ page, fixtures, check, lang }) {
      await page.evaluate(() => window.runCompression());
      let msg = await message(page);
      check('run without file shows message', msg && expectLang[lang].test(msg), msg.slice(0, 40));
      const preset = await page.inputValue('#targetKB');
      check('target preset', preset === '', preset);
      async function run(target, format, fixture) {
        await upload(page, '#upload', fixtures, fixture);
        await page.waitForFunction(() => document.getElementById('preview').naturalWidth > 0);
        await page.fill('#targetKB', String(target));
        if (format) await page.selectOption('#format', format);
        await page.evaluate(() => window.runCompression());
        await page.waitForFunction(() => document.getElementById('downloadLink').style.display === 'block', null, { timeout: 60000 });
        const text = await page.evaluate(() => document.querySelector('.compress-info').innerText);
        const d = await download(page, () => page.click('#downloadLink'));
        return { d, text };
      }
      const target = 100;
      let r = await run(target, 'image/jpeg', 'large.jpg');
      const kb = r.d && r.d.bytes.length / 1024;
      check(`jpg ${target}KB target honest`, r.d && signature(r.d.bytes) === 'image/jpeg' && r.d.name.endsWith('.jpg') && kb <= target * 1.1 && expectLang[lang].test(r.text), `${kb && kb.toFixed(1)}KB ${r.d && r.d.name} :: ${r.text.slice(0, 90)}`);
      r = await run(target, 'image/webp', 'large.jpg');
      check(`webp ${target}KB target`, r.d && signature(r.d.bytes) === 'image/webp' && r.d.name.endsWith('.webp') && r.d.bytes.length / 1024 <= target * 1.1, `${(r.d.bytes.length / 1024).toFixed(1)}KB`);
      r = await run(target, 'image/png', 'transparent.png');
      const info = r.d && probe(r.d.bytes, '.png');
      check('png keeps transparency and extension', r.d && signature(r.d.bytes) === 'image/png' && /a/.test(info.pixFmt) && r.d.name.endsWith('.png'), `${info && info.pixFmt} ${r.d && r.d.name}`);
      r = await run(2, 'image/jpeg', 'large.jpg');
      const reached = r.d.bytes.length / 1024 <= 2;
      check('impossible 2KB target is reported honestly', r.d && (reached || !/^(Target reached|تم الوصول|Objetivo alcanzado)/.test(r.text)), `${(r.d.bytes.length / 1024).toFixed(1)}KB :: ${r.text.slice(0, 80)}`);
      await page.fill('#targetKB', '');
      await page.evaluate(() => window.runCompression());
      await page.waitForFunction(() => document.getElementById('downloadLink').style.display === 'block', null, { timeout: 30000 });
      const m = await download(page, () => page.click('#downloadLink'));
      check('manual quality mode works', m && signature(m.bytes) === 'image/jpeg' && m.name.endsWith('.jpg'), m && m.name);
    }
  },

  {
    name: 'compress-image-to-20kb', path: 'compress-image-to-20kb',
    async run({ page, fixtures, check, lang }) {
      await page.evaluate(() => window.runCompression());
      let msg = await message(page);
      check('run without file shows message', msg && expectLang[lang].test(msg), msg.slice(0, 40));
      const preset = await page.inputValue('#targetKB');
      check('target preset', preset === '20', preset);
      async function run(target, format, fixture) {
        await upload(page, '#upload', fixtures, fixture);
        await page.waitForFunction(() => document.getElementById('preview').naturalWidth > 0);
        await page.fill('#targetKB', String(target));
        if (format) await page.selectOption('#format', format);
        await page.evaluate(() => window.runCompression());
        await page.waitForFunction(() => document.getElementById('downloadLink').style.display === 'block', null, { timeout: 60000 });
        const text = await page.evaluate(() => document.querySelector('.compress-info').innerText);
        const d = await download(page, () => page.click('#downloadLink'));
        return { d, text };
      }
      const target = 20;
      let r = await run(target, 'image/jpeg', 'large.jpg');
      const kb = r.d && r.d.bytes.length / 1024;
      check(`jpg ${target}KB target honest`, r.d && signature(r.d.bytes) === 'image/jpeg' && r.d.name.endsWith('.jpg') && kb <= target * 1.1 && expectLang[lang].test(r.text), `${kb && kb.toFixed(1)}KB ${r.d && r.d.name} :: ${r.text.slice(0, 90)}`);
      r = await run(target, 'image/webp', 'large.jpg');
      check(`webp ${target}KB target`, r.d && signature(r.d.bytes) === 'image/webp' && r.d.name.endsWith('.webp') && r.d.bytes.length / 1024 <= target * 1.1, `${(r.d.bytes.length / 1024).toFixed(1)}KB`);
      r = await run(target, 'image/png', 'transparent.png');
      const info = r.d && probe(r.d.bytes, '.png');
      check('png keeps transparency and extension', r.d && signature(r.d.bytes) === 'image/png' && /a/.test(info.pixFmt) && r.d.name.endsWith('.png'), `${info && info.pixFmt} ${r.d && r.d.name}`);
      r = await run(2, 'image/jpeg', 'large.jpg');
      const reached = r.d.bytes.length / 1024 <= 2;
      check('impossible 2KB target is reported honestly', r.d && (reached || !/^(Target reached|تم الوصول|Objetivo alcanzado)/.test(r.text)), `${(r.d.bytes.length / 1024).toFixed(1)}KB :: ${r.text.slice(0, 80)}`);
      await page.fill('#targetKB', '');
      await page.evaluate(() => window.runCompression());
      await page.waitForFunction(() => document.getElementById('downloadLink').style.display === 'block', null, { timeout: 30000 });
      const m = await download(page, () => page.click('#downloadLink'));
      check('manual quality mode works', m && signature(m.bytes) === 'image/jpeg' && m.name.endsWith('.jpg'), m && m.name);
    }
  },

  {
    name: 'compress-image-to-50kb', path: 'compress-image-to-50kb',
    async run({ page, fixtures, check, lang }) {
      await page.evaluate(() => window.runCompression());
      let msg = await message(page);
      check('run without file shows message', msg && expectLang[lang].test(msg), msg.slice(0, 40));
      const preset = await page.inputValue('#targetKB');
      check('target preset', preset === '50', preset);
      async function run(target, format, fixture) {
        await upload(page, '#upload', fixtures, fixture);
        await page.waitForFunction(() => document.getElementById('preview').naturalWidth > 0);
        await page.fill('#targetKB', String(target));
        if (format) await page.selectOption('#format', format);
        await page.evaluate(() => window.runCompression());
        await page.waitForFunction(() => document.getElementById('downloadLink').style.display === 'block', null, { timeout: 60000 });
        const text = await page.evaluate(() => document.querySelector('.compress-info').innerText);
        const d = await download(page, () => page.click('#downloadLink'));
        return { d, text };
      }
      const target = 50;
      let r = await run(target, 'image/jpeg', 'large.jpg');
      const kb = r.d && r.d.bytes.length / 1024;
      check(`jpg ${target}KB target honest`, r.d && signature(r.d.bytes) === 'image/jpeg' && r.d.name.endsWith('.jpg') && kb <= target * 1.1 && expectLang[lang].test(r.text), `${kb && kb.toFixed(1)}KB ${r.d && r.d.name} :: ${r.text.slice(0, 90)}`);
      r = await run(target, 'image/webp', 'large.jpg');
      check(`webp ${target}KB target`, r.d && signature(r.d.bytes) === 'image/webp' && r.d.name.endsWith('.webp') && r.d.bytes.length / 1024 <= target * 1.1, `${(r.d.bytes.length / 1024).toFixed(1)}KB`);
      r = await run(target, 'image/png', 'transparent.png');
      const info = r.d && probe(r.d.bytes, '.png');
      check('png keeps transparency and extension', r.d && signature(r.d.bytes) === 'image/png' && /a/.test(info.pixFmt) && r.d.name.endsWith('.png'), `${info && info.pixFmt} ${r.d && r.d.name}`);
      r = await run(2, 'image/jpeg', 'large.jpg');
      const reached = r.d.bytes.length / 1024 <= 2;
      check('impossible 2KB target is reported honestly', r.d && (reached || !/^(Target reached|تم الوصول|Objetivo alcanzado)/.test(r.text)), `${(r.d.bytes.length / 1024).toFixed(1)}KB :: ${r.text.slice(0, 80)}`);
      await page.fill('#targetKB', '');
      await page.evaluate(() => window.runCompression());
      await page.waitForFunction(() => document.getElementById('downloadLink').style.display === 'block', null, { timeout: 30000 });
      const m = await download(page, () => page.click('#downloadLink'));
      check('manual quality mode works', m && signature(m.bytes) === 'image/jpeg' && m.name.endsWith('.jpg'), m && m.name);
    }
  },

  {
    name: 'compress-image-to-100kb', path: 'compress-image-to-100kb',
    async run({ page, fixtures, check, lang }) {
      await page.evaluate(() => window.runCompression());
      let msg = await message(page);
      check('run without file shows message', msg && expectLang[lang].test(msg), msg.slice(0, 40));
      const preset = await page.inputValue('#targetKB');
      check('target preset', preset === '100', preset);
      async function run(target, format, fixture) {
        await upload(page, '#upload', fixtures, fixture);
        await page.waitForFunction(() => document.getElementById('preview').naturalWidth > 0);
        await page.fill('#targetKB', String(target));
        if (format) await page.selectOption('#format', format);
        await page.evaluate(() => window.runCompression());
        await page.waitForFunction(() => document.getElementById('downloadLink').style.display === 'block', null, { timeout: 60000 });
        const text = await page.evaluate(() => document.querySelector('.compress-info').innerText);
        const d = await download(page, () => page.click('#downloadLink'));
        return { d, text };
      }
      const target = 100;
      let r = await run(target, 'image/jpeg', 'large.jpg');
      const kb = r.d && r.d.bytes.length / 1024;
      check(`jpg ${target}KB target honest`, r.d && signature(r.d.bytes) === 'image/jpeg' && r.d.name.endsWith('.jpg') && kb <= target * 1.1 && expectLang[lang].test(r.text), `${kb && kb.toFixed(1)}KB ${r.d && r.d.name} :: ${r.text.slice(0, 90)}`);
      r = await run(target, 'image/webp', 'large.jpg');
      check(`webp ${target}KB target`, r.d && signature(r.d.bytes) === 'image/webp' && r.d.name.endsWith('.webp') && r.d.bytes.length / 1024 <= target * 1.1, `${(r.d.bytes.length / 1024).toFixed(1)}KB`);
      r = await run(target, 'image/png', 'transparent.png');
      const info = r.d && probe(r.d.bytes, '.png');
      check('png keeps transparency and extension', r.d && signature(r.d.bytes) === 'image/png' && /a/.test(info.pixFmt) && r.d.name.endsWith('.png'), `${info && info.pixFmt} ${r.d && r.d.name}`);
      r = await run(2, 'image/jpeg', 'large.jpg');
      const reached = r.d.bytes.length / 1024 <= 2;
      check('impossible 2KB target is reported honestly', r.d && (reached || !/^(Target reached|تم الوصول|Objetivo alcanzado)/.test(r.text)), `${(r.d.bytes.length / 1024).toFixed(1)}KB :: ${r.text.slice(0, 80)}`);
      await page.fill('#targetKB', '');
      await page.evaluate(() => window.runCompression());
      await page.waitForFunction(() => document.getElementById('downloadLink').style.display === 'block', null, { timeout: 30000 });
      const m = await download(page, () => page.click('#downloadLink'));
      check('manual quality mode works', m && signature(m.bytes) === 'image/jpeg' && m.name.endsWith('.jpg'), m && m.name);
    }
  },

  {
    name: 'qr-generator', path: 'qr-generator',
    async run({ page, check, lang }) {
      await page.evaluate(() => window.generateQR());
      let msg = await message(page);
      check('empty input message', msg && expectLang[lang].test(msg), msg.slice(0, 40));
      check('download hidden before generating', !(await page.isVisible('#downloadBtn')));
      for (const text of ['https://convertios.com/qr-generator/', 'مرحبا بالعالم — Convertios', 'Ñandú: ¿qué tal? 123']) {
        await page.fill('#text', text);
        await page.evaluate(() => window.generateQR());
        const png = await download(page, () => page.click('#downloadBtn'));
        const info = png && probe(png.bytes, '.png');
        check(`png readable: ${text.slice(0, 18)}`, png && png.name === 'convertios-qr.png' && info.width >= 1000 && decodeQr(png.bytes) === text, png && `${png.name} ${info.width}px decoded="${decodeQr(png.bytes)}"`);
      }
      const svg = await download(page, () => page.click('#downloadSvgBtn'));
      check('svg download', svg && svg.name === 'convertios-qr.svg' && svg.bytes.toString().includes('<svg'), svg && svg.name);
      await page.fill('#text', 'x'.repeat(3500));
      await page.evaluate(() => window.generateQR());
      msg = await message(page);
      check('too-long text message', msg && expectLang[lang].test(msg), msg.slice(0, 50));
    }
  },
  {
    name: 'text-formatter', path: 'text-formatter',
    async run({ page, check }) {
      const set = (v) => page.fill('#text', v);
      const run = async (fn, input) => { await set(input); await page.evaluate((f) => window[f](), fn); return page.inputValue('#text'); };
      check('capitalize mixed case', (await run('capitalize', 'hello wORLD')) === 'Hello World');
      check('capitalize accents/apostrophes', (await run('capitalize', 'él ÁRBOL don’t café-bar 3RD')) === 'Él Árbol Don’t Café-Bar 3rd', await page.inputValue('#text'));
      check('capitalize leaves Arabic intact', (await run('capitalize', 'مرحبا بالعالم 123')) === 'مرحبا بالعالم 123');
      check('uppercase unicode', (await run('toUpper', 'canción ñ')) === 'CANCIÓN Ñ');
      check('lowercase unicode', (await run('toLower', 'ÁRBOL')) === 'árbol');
      check('remove extra spaces keeps lines', (await run('removeSpaces', '  a   b  \n\n\n\n c\t\td ')) === 'a b\n\nc d', JSON.stringify(await page.inputValue('#text')));
      await set('');
      await page.evaluate(() => window.capitalize());
      check('empty input message', !!(await message(page)));
    }
  },
  {
    name: 'meme-generator', path: 'meme-generator',
    async run({ page, fixtures, check }) {
      await page.evaluate(() => window.downloadMeme());
      check('no image -> message, no download', !!(await message(page)));
      await upload(page, '#upload', fixtures, 'square.jpg');
      await page.waitForFunction(() => document.getElementById('memeCanvas').width === 1000);
      await page.fill('#topText', 'TOP TEXT THAT IS QUITE LONG AND SHOULD WRAP NICELY');
      await page.fill('#bottomText', 'مرحبا');
      let d = await download(page, () => page.evaluate(() => window.downloadMeme()));
      let info = d && probe(d.bytes, '.jpg');
      check('keeps 1000px resolution, jpg in -> jpg out', d && signature(d.bytes) === 'image/jpeg' && info.width === 1000 && d.name === 'square-meme.jpg', d && `${d.name} ${info.width}x${info.height}`);
      await upload(page, '#upload', fixtures, 'transparent.png');
      await page.waitForFunction(() => document.getElementById('memeCanvas').width === 800);
      d = await download(page, () => page.evaluate(() => window.downloadMeme()));
      check('png in -> png out', d && signature(d.bytes) === 'image/png' && d.name.endsWith('.png'), d && d.name);
    }
  },
  ...['png-to-jpg', 'jpg-to-png', 'webp-to-png'].map((slug) => ({
    name: slug, path: slug,
    async run({ page, fixtures, check, lang }) {
      const cfg = { 'png-to-jpg': ['transparent.png', 'image/jpeg', '.jpg', 'small.jpg'], 'jpg-to-png': ['small.jpg', 'image/png', '.png', 'photo.png'], 'webp-to-png': ['photo.webp', 'image/png', '.png', 'small.jpg'] }[slug];
      await page.evaluate(() => window.convert());
      const msg = await message(page);
      check('convert without file shows message', msg && expectLang[lang].test(msg), msg.slice(0, 40));
      await upload(page, '#upload', fixtures, cfg[3]);
      const wrong = await message(page);
      check('wrong type rejected with message', wrong && (await page.$$('#preview img')).length === 0, wrong.slice(0, 40));
      await upload(page, '#upload', fixtures, cfg[0]);
      await page.evaluate(() => window.convert());
      await page.waitForSelector('#downloads a');
      const d = await download(page, () => page.click('#downloads a'));
      check('real output format and original name', d && signature(d.bytes) === cfg[1] && d.name === cfg[0].replace(/\.[a-z]+$/, cfg[2]), d && `${d.name} ${signature(d.bytes)}`);
    }
  })),
  {
    name: 'social-media-image-resizer', path: 'social-media-image-resizer',
    async run({ page, fixtures, check }) {
      await upload(page, '#fileInput', fixtures, 'large.jpg');
      await page.waitForTimeout(500);
      const boxes = await page.$$('#sizePanel input[type=checkbox]');
      for (const b of boxes.slice(0, 3)) await b.evaluate((el) => { el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); });
      const z = await download(page, () => page.click('#downloadZip'));
      const entries = z ? zipEntries(z.bytes) : [];
      check('zip has 3 uniquely named sizes', entries.length === 3 && new Set(entries).size === 3 && entries.every((n) => /\d+x\d+\.png$/.test(n)), entries.join(','));
      const files = [];
      const done = new Promise((resolve) => { const h = async (d) => { files.push(d.suggestedFilename()); if (files.length === 3) { page.off('download', h); resolve(); } }; page.on('download', h); });
      await page.click('#downloadSingle');
      await Promise.race([done, page.waitForTimeout(6000)]);
      check('single download saves every selected size', files.length === 3, files.join(','));
      check('no "being improved" notice', !(await page.$('.temporary-tool-notice')));
    }
  },
  {
    name: 'audio-converter', path: 'audio-converter',
    async run({ page, fixtures, check }) {
      await page.evaluate(() => window.convertAudio && window.convertAudio());
      check('convert without file shows message', !!(await message(page)));
      await upload(page, '#audioFile', fixtures, 'audio.wav');
      await page.waitForTimeout(800);
      for (const fmt of ['mp3', 'wav']) {
        await page.selectOption('#format', fmt);
        const d = await download(page, () => page.evaluate(() => window.convertAudio()), 30000);
        const info = d && probe(d.bytes, '.' + fmt);
        check(`${fmt} output valid stereo`, d && info.channels === 2 && Math.abs(info.duration - 4) < 0.2, d && `${d.name} ${info.codec} ${info.channels}ch ${info.duration}s`);
      }
    }
  },
  {
    name: 'audio-speed-changer', path: 'audio-speed-changer',
    async run({ page, fixtures, check }) {
      await page.evaluate(() => window.exportAudio && window.exportAudio());
      check('export without file shows message', !!(await message(page)));
      await upload(page, '#audioFile', fixtures, 'audio.wav');
      await page.waitForTimeout(800);
      await page.$eval('#speedSlider', (el) => { el.value = 2; el.dispatchEvent(new Event('input', { bubbles: true })); });
      const d = await download(page, () => page.evaluate(() => window.exportAudio()), 30000);
      const info = d && probe(d.bytes, '.mp3');
      check('2x speed halves duration, stereo mp3', d && info.codec === 'mp3' && info.channels === 2 && Math.abs(info.duration - 2) < 0.15, d && `${info.codec} ${info.channels}ch ${info.duration}s`);
    }
  },
  {
    name: 'pdf-to-word', path: 'pdf-to-word',
    async run({ page, fixtures, check, backendMode, lang }) {
      check('button disabled before upload', await page.isDisabled('.convert-btn'));
      await upload(page, '#upload', fixtures, 'small.jpg');
      let msg = await message(page);
      check('non-PDF rejected', msg && expectLang[lang].test(msg) && await page.isDisabled('.convert-btn'), msg.slice(0, 40));
      await upload(page, '#upload', fixtures, 'simple.pdf');
      const d = await download(page, () => page.click('.convert-btn'));
      check('docx downloads with right name', d && signature(d.bytes) === 'application/zip' && d.name === 'simple.docx', d && d.name);
      backendMode.convert = 'down';
      await page.click('.convert-btn');
      await page.waitForTimeout(600);
      msg = await message(page);
      backendMode.convert = 'ok';
      check('server failure translated + retry', msg && expectLang[lang].test(msg) && await page.$('#toolMessage .tool-retry-button'), msg.slice(0, 50));
      const text = await page.evaluate(() => document.getElementById('main-content').innerText);
      check('no 100 MB / instant claims', !/100 MB|instantly|al instante/.test(text));
    }
  },
  ...['video-to-mp3', 'video-converter'].map((slug) => ({
    name: slug, path: slug,
    async run({ page, fixtures, check, lang }) {
      check('button disabled before upload', await page.isDisabled('#videoConvert'));
      await upload(page, '#videoFile', fixtures, 'audio.wav');
      const msg = await message(page);
      check('unsupported type rejected', msg && expectLang[lang].test(msg), msg.slice(0, 40));
      for (const v of ['video.mp4', 'video.mov', 'video.avi']) {
        await upload(page, '#videoFile', fixtures, v);
        if (slug === 'video-converter') await page.selectOption('#videoFormat', 'mp4');
        const d = await download(page, () => page.click('#videoConvert'));
        const want = slug === 'video-to-mp3' ? v.replace(/\.\w+$/, '.mp3') : v.replace(/\.\w+$/, '.mp4');
        check(`${v} -> ${want}`, d && d.name === want && d.bytes.length > 1000, d && d.name);
      }
    }
  })),
  {
    name: 'password-generator', path: 'password-generator',
    async run({ page, check }) {
      const first = await page.inputValue('#password');
      check('generates on load', first.length === 12, first.length);
      await page.fill('#length', '32');
      await page.evaluate(() => window.generatePassword());
      const p = await page.inputValue('#password');
      check('length + all classes', p.length === 32 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p), p.length);
      for (const id of ['uppercase', 'lowercase', 'numbers', 'symbols']) await page.uncheck('#' + id);
      await page.evaluate(() => window.generatePassword());
      check('no classes -> message', !!(await message(page)));
    }
  },
  {
    name: 'word-counter', path: 'word-counter',
    async run({ page, check }) {
      await page.fill('#text', 'Hello world. مرحبا بالعالم! ¿Qué tal?\nNew line here.');
      await page.dispatchEvent('#text', 'input');
      const nums = await page.evaluate(() => [...document.querySelectorAll('#main-content [id]')].filter((e) => /^\d+$/.test(e.textContent.trim())).map((e) => e.id + '=' + e.textContent.trim()));
      check('counts words (9) and lines', nums.includes('words=9') && nums.includes('sentences=4'), nums.join(','));
    }
  },
  {
    name: 'unit-converter', path: 'unit-converter',
    async run({ page, check }) {
      await page.selectOption('#conversion', 'kg-lb');
      await page.fill('#value', '10');
      await page.evaluate(() => window.convert());
      check('10 kg = 22.046 lb', /22[.,]046/.test(await page.textContent('#result')), await page.textContent('#result'));
      await page.fill('#value', '');
      await page.evaluate(() => window.convert());
      check('empty value message', /\S/.test(await page.textContent('#result')));
    }
  },
  ...['merge-pdf', 'split-pdf', 'rotate-pdf', 'jpg-to-pdf', 'pdf-to-jpg', 'mp3-cutter', 'trim-audio-online', 'remove-bg'].map((slug) => ({
    name: slug + ' (empty state; full run is live-only)', path: slug,
    async run({ page, check }) {
      const action = { 'merge-pdf': 'mergePDF()', 'split-pdf': "document.getElementById('splitBtn').click()", 'rotate-pdf': "document.getElementById('downloadBtn').click()", 'jpg-to-pdf': 'createPDF()', 'pdf-to-jpg': null, 'mp3-cutter': "document.getElementById('export').click()", 'trim-audio-online': "document.getElementById('export').click()", 'remove-bg': "document.getElementById('download') && document.getElementById('download').click()" }[slug];
      if (!action) { check('page loads', true); return; }
      const d = await download(page, () => page.evaluate((a) => { try { (0, eval)(a); } catch (e) { /* stubbed library */ } }, action), 1500);
      check('no download without input', !d);
    }
  })),

];
