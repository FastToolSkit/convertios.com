// Regression check: tools that used to call alert() must show the shared inline #toolMessage
// (translated, accessible) and must not open a native dialog. Serves the repository locally;
// ads, analytics and the backend are blocked. Run: node tests/browser/inline-messages.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' };

const server = http.createServer((req, res) => {
  let file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  return res.end(fs.readFileSync(file));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;
const notPdf = path.join(ROOT, 'tests', 'fixtures', 'files', 'small.jpg');

const cases = [];
for (const lang of ['', 'es/', 'ar/']) {
  cases.push([lang + 'merge-pdf/', (p) => p.evaluate(() => window.mergePDF())]);
  cases.push([lang + 'rotate-pdf/', (p) => p.evaluate(() => document.getElementById('downloadBtn').click())]);
  cases.push([lang + 'split-pdf/', (p) => p.evaluate(() => document.getElementById('splitBtn').click())]);
  cases.push([lang + 'pdf-to-jpg/', (p) => p.setInputFiles('#file-input', notPdf)]);
  cases.push([lang + 'password-generator/', async (p) => {
    for (const id of ['uppercase', 'lowercase', 'numbers', 'symbols']) await p.uncheck('#' + id);
    await p.evaluate(() => window.generatePassword());
  }]);
}

const browser = await chromium.launch();
let failed = 0;
for (const [url, act] of cases) {
  const context = await browser.newContext({ viewport: { width: 390, height: 900 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  let dialog = null;
  const errors = [];
  await page.route(/googlesyndication|googletagmanager|google-analytics|cloudflareinsights|onrender\.com/, (r) => r.fulfill({ status: 204, body: '' }));
  page.on('dialog', (d) => { dialog = d.message(); d.dismiss(); });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + url, { waitUntil: 'load' });
  await act(page);
  await page.waitForTimeout(600);
  const message = await page.evaluate(() => {
    const box = document.getElementById('toolMessage');
    return box && box.offsetParent !== null ? box.textContent.trim() : '';
  });
  const ok = !dialog && message.length > 0 && errors.length === 0;
  if (!ok) failed++;
  console.log(`${ok ? 'pass' : 'FAIL'} ${url.padEnd(24)} message="${message}"${dialog ? ' dialog=' + dialog : ''}${errors.length ? ' errors=' + errors.join(' | ') : ''}`);
  await context.close();
}
await browser.close();
server.close();
console.log(`${cases.length - failed}/${cases.length} passed`);
process.exit(failed ? 1 : 0);
