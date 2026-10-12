// Convertios browser test runner (Playwright).
//
//   node tests/browser/run.mjs [--suite pages|tools|all] [--only name] [--vendor map.json] [--base URL]
//
// Without --base it serves the repository locally. The Convertios backend, Google ads/analytics and
// Cloudflare beacons are mocked, so no real third-party traffic happens. Third-party libraries load
// from their CDNs unless --vendor maps CDN URLs to local files (for offline runs).
// Requires the `playwright` package (npm i -D playwright, or NODE_PATH to an existing install).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { tools } from './tools.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const FIXTURES = path.join(ROOT, 'tests', 'fixtures', 'files');
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, arg, i, all) => {
  if (arg.startsWith('--')) acc.push([arg.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : 'true']);
  return acc;
}, []));
const suite = args.suite || 'all';
const vendor = args.vendor ? JSON.parse(fs.readFileSync(args.vendor, 'utf8')) : null;
const BACKEND = 'https://convertios-backend-sn5u.onrender.com';
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.mjs': 'text/javascript' };

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = path.join(ROOT, urlPath);
      if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
        if (!urlPath.endsWith('/')) { res.writeHead(301, { Location: urlPath + '/' }); return res.end(); }
        file = path.join(file, 'index.html');
      }
      if (!fs.existsSync(file)) {
        res.writeHead(404, { 'Content-Type': MIME['.html'] });
        return res.end(fs.readFileSync(path.join(ROOT, '404.html')));
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      return res.end(fs.readFileSync(file));
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

// --- mocked backend -------------------------------------------------------------------------
const PNG_SMALL = fs.existsSync(path.join(FIXTURES, 'photo.png')) ? fs.readFileSync(path.join(FIXTURES, 'photo.png')) : Buffer.alloc(0);
const backendMode = { shorten: 'ok', enhance: 'ok', delayMs: 0 };
async function mockBackend(route) {
  const req = route.request();
  const url = new URL(req.url());
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': 'Content-Disposition' };
  if (backendMode.delayMs) await new Promise((r) => setTimeout(r, backendMode.delayMs));
  if (url.pathname === '/health') return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: '{"status":"ok"}' });
  if (url.pathname === '/api/shorten-url') {
    const body = JSON.parse(req.postData() || '{}');
    if (!/^https?:\/\/[^\s/]+\.[^\s/]+/.test(body.url || '') && !/^[^\s/]+\.[a-z]{2,}/i.test(body.url || '')) return route.fulfill({ status: 400, headers: cors, contentType: 'application/json', body: '{"code":"INVALID_URL","error":"x"}' });
    if (backendMode.shorten === 'down') return route.fulfill({ status: 503, headers: cors, contentType: 'application/json', body: '{"code":"UPSTREAM_UNAVAILABLE","error":"x"}' });
    return route.fulfill({ status: 200, headers: cors, contentType: 'application/json', body: JSON.stringify({ shortUrl: 'https://tinyurl.com/test123', longUrl: body.url }) });
  }
  if (url.pathname === '/api/enhance-image') {
    if (backendMode.enhance === 'down') return route.fulfill({ status: 502, headers: cors, contentType: 'application/json', body: '{"code":"ENHANCER_UNAVAILABLE","error":"x"}' });
    return route.fulfill({ status: 200, headers: { ...cors, 'Content-Disposition': 'attachment; filename="photo-enhanced.png"' }, contentType: 'image/png', body: PNG_SMALL });
  }
  return route.fulfill({ status: 404, headers: cors, contentType: 'application/json', body: '{"code":"NOT_FOUND"}' });
}

const STUB_JS = '/* stub for an unavailable library in offline test runs */';
async function routeThirdParty(route) {
  const url = route.request().url();
  if (/googlesyndication|googletagmanager|google-analytics|cloudflareinsights|adtrafficquality|doubleclick/.test(url)) {
    return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
  }
  if (vendor) {
    const hit = Object.entries(vendor).find(([pattern]) => url.includes(pattern));
    if (hit) {
      if (hit[1] === 'stub') return route.fulfill({ status: 200, contentType: 'text/javascript', body: STUB_JS });
      const file = hit[1];
      return route.fulfill({ status: 200, contentType: file.endsWith('.css') ? 'text/css' : 'text/javascript', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(file) });
    }
    return route.fulfill({ status: 200, contentType: 'text/javascript', body: STUB_JS });
  }
  return route.continue();
}

function allPages() {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (['node_modules', 'tests', '.git', 'backend', 'docs', 'js', 'scripts', 'tool-template'].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === 'index.html') out.push('/' + path.relative(ROOT, path.dirname(full)).split(path.sep).join('/') + (dir === ROOT ? '' : '/'));
    }
  };
  walk(ROOT);
  return out.map((p) => p.replace(/^\/\/$/, '/').replace(/^\/\/+/, '/')).sort();
}

async function newPage(context, base) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e.message).slice(0, 160)));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    // Network errors for the mocked backend are expected when a test simulates an outage.
    if (/Failed to load resource/.test(m.text()) && (m.location().url || '').startsWith(BACKEND)) return;
    errors.push('console: ' + m.text().slice(0, 160));
  });
  page.on('requestfailed', (r) => { if (r.url().startsWith(base)) errors.push('requestfailed: ' + r.url()); });
  page.on('response', (r) => { if (r.url().startsWith(base) && r.status() >= 400 && !r.url().includes('no-such-page')) errors.push(`${r.status()}: ${r.url()}`); });
  page.errors = errors;
  return page;
}

async function crawl(browser, base) {
  const widths = (args.widths || '320,375,393,412,768,1280').split(',').map(Number);
  const pages = allPages();
  const failures = [];
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width < 768, hasTouch: width < 768 });
    await context.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith(BACKEND)) return mockBackend(route);
      if (!u.startsWith(base)) return routeThirdParty(route);
      return route.continue();
    });
    for (const p of pages) {
      const page = await newPage(context, base);
      await page.goto(base + p, { waitUntil: 'load' });
      await page.waitForTimeout(250);
      const info = await page.evaluate(() => {
        const W = document.documentElement.clientWidth;
        const over = document.documentElement.scrollWidth - W;
        const culprits = over > 1 ? [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > W + 1 && r.width > 0 && getComputedStyle(e).position !== 'fixed' && !e.closest('.dropdown-menu,.language-selector__menu'); }).slice(0, 3).map((e) => e.tagName + '.' + String(e.className).slice(0, 30)) : [];
        const brokenImages = [...document.images].filter((i) => i.getAttribute('src') && !/^(blob|data):/.test(i.getAttribute('src')) && i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src'));
        const smallTargets = W < 768 ? [...document.querySelectorAll('main button, main a.main-button, main select, .tool-container button, .tool-wrap button')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 32); }).slice(0, 3).map((e) => (e.id || e.textContent.trim()).slice(0, 20)) : [];
        return { over, culprits, brokenImages, smallTargets, lang: document.documentElement.lang, dir: document.documentElement.dir, h1: document.querySelectorAll('h1').length };
      });
      const problems = [];
      if (info.over > 1) problems.push(`overflow ${info.over}px ${info.culprits.join(',')}`);
      if (info.brokenImages.length) problems.push('broken images ' + info.brokenImages.join(','));
      if (info.smallTargets.length) problems.push('small touch targets ' + info.smallTargets.join(','));
      if (p.startsWith('/ar/') && (info.lang !== 'ar' || info.dir !== 'rtl')) problems.push('arabic lang/dir');
      if (page.errors.length) problems.push(...page.errors);
      if (problems.length) failures.push({ width, page: p, problems });
      await page.close();
    }
    await context.close();
    console.log(`  width ${width}: ${pages.length} pages checked`);
  }
  // 404 status
  const res = await fetch(base + '/no-such-page/');
  if (res.status !== 404) failures.push({ page: '/no-such-page/', problems: ['404 page returned ' + res.status] });
  return { pages: pages.length, widths, failures };
}

async function runTools(browser, base) {
  const results = [];
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 390, height: 900 }, isMobile: true, hasTouch: true });
  await context.route('**/*', (route) => {
    const u = route.request().url();
    if (u.startsWith(BACKEND)) return mockBackend(route);
    if (!u.startsWith(base)) return routeThirdParty(route);
    return route.continue();
  });
  const only = args.only ? args.only.split(',') : null;
  for (const tool of tools) {
    if (only && !only.some((o) => tool.name.includes(o))) continue;
    for (const lang of tool.langs || ['', 'ar/', 'es/']) {
      if (lang && args.lang && !lang.startsWith(args.lang)) continue;
      const page = await newPage(context, base);
      const url = `${base}/${lang}${tool.path}/`;
      const row = { tool: tool.name, lang: lang ? lang.slice(0, 2) : 'en', checks: [], errors: [] };
      try {
        await page.goto(url, { waitUntil: 'load' });
        await tool.run({ page, fixtures: FIXTURES, check: (name, ok, detail) => row.checks.push({ name, ok: Boolean(ok), detail }), backendMode, lang: row.lang });
      } catch (error) {
        row.checks.push({ name: 'run', ok: false, detail: String(error.message).split('\n')[0].slice(0, 200) });
      }
      row.errors = page.errors.filter((e) => !/stub for an unavailable/.test(e));
      results.push(row);
      const failed = row.checks.filter((c) => !c.ok);
      console.log(`  ${failed.length || row.errors.length ? 'FAIL' : 'pass'} ${tool.name} [${row.lang}] ${row.checks.length} checks${failed.length ? ' :: ' + failed.map((c) => `${c.name}: ${c.detail || ''}`).join(' | ') : ''}${row.errors.length ? ' :: errors ' + row.errors.join(' | ') : ''}`);
      await page.close();
    }
  }
  await context.close();
  return results;
}

const server = args.base ? null : await startServer();
const base = args.base || `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
const report = { base, startedAt: new Date().toISOString() };
try {
  if (suite === 'pages' || suite === 'all') {
    console.log('Page crawl');
    report.crawl = await crawl(browser, base);
    for (const f of report.crawl.failures.slice(0, 200)) console.log(`  FAIL ${f.width || ''} ${f.page}: ${f.problems.join(' | ')}`);
    console.log(`  ${report.crawl.failures.length} page/width failures`);
  }
  if (suite === 'tools' || suite === 'all') {
    console.log('Tool tests');
    report.tools = await runTools(browser, base);
  }
} finally {
  await browser.close();
  server?.close();
}
fs.mkdirSync(path.join(ROOT, 'test-results'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'test-results', 'browser-report.json'), JSON.stringify(report, null, 2));
const toolFails = (report.tools || []).filter((r) => r.checks.some((c) => !c.ok) || r.errors.length).length;
const pageFails = report.crawl ? report.crawl.failures.length : 0;
console.log(`\nSummary: ${pageFails} page failures, ${toolFails} tool failures`);
process.exit(pageFails || toolFails ? 1 : 0);
