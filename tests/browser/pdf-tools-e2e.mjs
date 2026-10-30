// End-to-end check of the in-browser PDF tools with real fixture files (EN/AR/ES, phone profile 390px).
// Libraries load from their CDNs, so this needs internet. Output PDFs are verified with pdf-lib
// (page count, rotation); PDF to JPG output is verified by JPEG data URLs, one per page.
// Layout: after loading a 4-page PDF the thumbnail list must stay inside #preview and the page
// must not scroll sideways; Rotate PDF's button is pressed with a real (hit-tested) click.
// Run: node tests/browser/pdf-tools-e2e.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const FX = (n) => path.join(ROOT, 'tests', 'fixtures', 'files', n);
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  return res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

async function pdfInfo(page, buf) {
  return page.evaluate(async (b64) => {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const doc = await PDFLib.PDFDocument.load(bytes);
    return { pages: doc.getPageCount(), rotations: doc.getPages().map((p) => p.getRotation().angle) };
  }, buf.toString('base64'));
}
async function download(page, trigger) {
  const [d] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), trigger()]);
  return fs.readFileSync(await d.path());
}
// Thumbnails/file rows must not spill out of #preview, and the page must not overflow sideways.
async function layout(page) {
  return page.evaluate(() => {
    const p = document.getElementById('preview');
    const box = p.getBoundingClientRect();
    const bottom = Math.max(box.bottom, ...[...p.children].map((c) => c.getBoundingClientRect().bottom));
    const spill = Math.round(bottom - box.bottom);
    const sideways = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    return { ok: spill <= 1 && sideways <= 1, text: `spill=${spill}px sideways=${sideways}px` };
  });
}

const browser = await chromium.launch();
let failed = 0, total = 0;
const report = (name, ok, detail) => { total++; if (!ok) failed++; console.log(`${ok ? 'pass' : 'FAIL'} ${name.padEnd(22)} ${detail}`); };

for (const lang of ['', 'es/', 'ar/']) {
  const L = lang ? lang.slice(0, 2) : 'en';
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 390, height: 900 }, isMobile: true, hasTouch: true });
  await ctx.route(/googlesyndication|googletagmanager|google-analytics|cloudflareinsights|onrender\.com/, (r) => r.fulfill({ status: 204, body: '' }));
  const run = async (slug, fn) => {
    const page = await ctx.newPage(); const errors = []; let dialog = null;
    page.on('pageerror', (e) => errors.push(e.message)); page.on('dialog', (d) => { dialog = d.message(); d.dismiss(); });
    try {
      await page.goto(base + lang + slug + '/', { waitUntil: 'load' });
      const [ok, detail] = await fn(page);
      report(`${slug} [${L}]`, ok && !errors.length && !dialog, detail + (errors.length ? ' errors=' + errors.join('|') : '') + (dialog ? ' dialog=' + dialog : ''));
    } catch (e) { report(`${slug} [${L}]`, false, String(e.message).split('\n')[0]); }
    await page.close();
  };
  let srcPages = 0;
  await run('merge-pdf', async (page) => {
    srcPages = (await pdfInfo(page, fs.readFileSync(FX('multipage.pdf')))).pages;
    const one = (await pdfInfo(page, fs.readFileSync(FX('simple.pdf')))).pages;
    await page.setInputFiles('#file-input', [FX('simple.pdf'), FX('multipage.pdf')]);
    await page.waitForTimeout(800);
    const lay = await layout(page);
    await page.evaluate(() => window.mergePDF());
    await page.waitForFunction(() => (document.getElementById('downloadLink').href || '').startsWith('blob:'), null, { timeout: 20000 });
    const out = await pdfInfo(page, await download(page, () => page.click('#downloadLink')));
    return [lay.ok && out.pages === one + srcPages, `${one}+${srcPages} pages -> ${out.pages}; ${lay.text}`];
  });
  await run('split-pdf', async (page) => {
    await page.setInputFiles('#file-input', FX('multipage.pdf'));
    await page.waitForFunction((n) => document.querySelectorAll('.preview-item').length === n, srcPages, { timeout: 20000 });
    await page.waitForTimeout(500);
    const lay = await layout(page);
    await page.click('.preview-item >> nth=0');
    const out = await pdfInfo(page, await download(page, () => page.evaluate(() => document.getElementById('splitBtn').click())));
    return [lay.ok && out.pages === srcPages - 1, `deselected page 1 of ${srcPages} -> ${out.pages} pages; ${lay.text}`];
  });
  await run('rotate-pdf', async (page) => {
    await page.setInputFiles('#file-input', FX('multipage.pdf'));
    await page.waitForFunction((n) => document.querySelectorAll('.rotate-btn').length === n, srcPages, { timeout: 20000 });
    await page.waitForTimeout(500);
    const lay = await layout(page);
    await page.click('.rotate-btn >> nth=0', { timeout: 5000 });
    await page.waitForTimeout(300);
    const out = await pdfInfo(page, await download(page, () => page.click('#downloadBtn')));
    return [lay.ok && out.pages === srcPages && out.rotations[0] === 90 && out.rotations.slice(1).every((a) => a === 0), `rotations ${out.rotations.join(',')}; ${lay.text}`];
  });
  await run('jpg-to-pdf', async (page) => {
    await page.setInputFiles('#file-input', [FX('small.jpg'), FX('photo.png')]);
    await page.waitForTimeout(800);
    await page.evaluate(() => window.createPDF());
    await page.waitForFunction(() => (document.getElementById('downloadLink').href || '').startsWith('blob:'), null, { timeout: 20000 });
    const out = await pdfInfo(page, await download(page, () => page.click('#downloadLink')));
    return [out.pages === 2, `JPG+PNG -> ${out.pages} pages`];
  });
  await run('pdf-to-jpg', async (page) => {
    await page.setInputFiles('#file-input', FX('multipage.pdf'));
    await page.waitForFunction((n) => document.querySelectorAll('a.download-btn').length === n, srcPages, { timeout: 30000 });
    await page.waitForTimeout(500);
    const lay = await layout(page);
    const hrefs = await page.$$eval('a.download-btn', (a) => a.map((x) => x.href.slice(0, 23)));
    return [lay.ok && hrefs.every((h) => h === 'data:image/jpeg;base64,'), `${hrefs.length} JPEG pages; ${lay.text}`];
  });
  await ctx.close();
}
await browser.close(); server.close();
console.log(`${total - failed}/${total} passed`);
process.exit(failed ? 1 : 0);
