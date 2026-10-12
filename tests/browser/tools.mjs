// Tool test definitions for tests/browser/run.mjs.
// Every check uses real fixture files and inspects the real downloaded bytes.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

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
  }
];
