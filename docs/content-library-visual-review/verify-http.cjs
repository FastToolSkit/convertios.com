// Run against the real local HTTP server. Third-party services are excluded.
// This is a preview smoke test, not a field CWV or Lighthouse measurement.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'C:/workspace/convertios-pt-qa/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:8891';
const routes = ['/blog/', '/blog/convert-pdf-to-word-keep-formatting/',
  '/blog/category/pdf-documents/', '/blog/page/2/', '/ar/blog/',
  '/ar/blog/convert-pdf-to-word-keep-formatting/', '/es/blog/', '/pt-br/blog/',
  '/docs/content-library-visual-review/'];
(async () => {
  const browser = await chromium.launch({headless:true, channel:'chrome'});
  const failures = [], results = [];
  try {
    for (const width of [390, 1440]) {
      for (const route of routes) {
        const context = await browser.newContext({viewport:{width, height:1000}});
        await context.route('**/*', r => new URL(r.request().url()).origin === base ? r.continue() : r.abort());
        await context.addInitScript(() => {
          window.__previewShifts = [];
          new PerformanceObserver(list => list.getEntries().forEach(e => {
            if (!e.hadRecentInput) window.__previewShifts.push(e.value);
          })).observe({type:'layout-shift', buffered:true});
        });
        const page = await context.newPage();
        page.on('pageerror', e => failures.push({route, width, error:e.message}));
        page.on('response', r => {
          if (r.url().startsWith(base) && r.status() >= 400) failures.push({route, width, status:r.status(), url:r.url()});
        });
        page.on('requestfailed', r => {
          if (r.url().startsWith(base)) failures.push({route, width, failed:r.url(), error:r.failure()});
        });
        const response = await page.goto(base + route, {waitUntil:'load', timeout:30000});
        await page.evaluate(async () => {
          document.querySelectorAll('img').forEach(i => i.loading = 'eager');
          await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
          await document.fonts.ready;
          await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        });
        const state = await page.evaluate(() => ({
          overflow:document.documentElement.scrollWidth > innerWidth + 1,
          broken:[...document.images].filter(i => !i.naturalWidth).map(i => i.src),
          dir:document.documentElement.dir,
          cls:window.__previewShifts.reduce((a,b) => a+b, 0),
          editorialImages:[...document.images].filter(i => i.currentSrc.includes('/editorial/')).map(i => ({src:i.currentSrc, width:i.naturalWidth})),
          transferredBytes:performance.getEntriesByType('resource').reduce((n,r) => n+r.transferSize,0)
        }));
        if (response.status() !== 200 || state.overflow || state.broken.length || (route.startsWith('/ar/') && state.dir !== 'rtl')) failures.push({route, width, ...state});
        results.push({route, width, status:response.status(), ...state});
        await context.close();
      }
    }
  } finally { await browser.close(); }
  const report = {checkedAt:new Date().toISOString(), base, checks:results.length, failures, results,
    limitations:'Actual local HTTP; third-party services blocked. All images eagerly decoded for missing-image checks. Transfer totals include those images and are not initial-load budgets.'};
  fs.writeFileSync(path.join(__dirname, 'http-results.json'), JSON.stringify(report,null,2));
  console.log(JSON.stringify({checks:results.length, failures, maxCLS:Math.max(...results.map(r=>r.cls))},null,2));
  if (failures.length) process.exitCode=1;
})().catch(e => {console.error(e);process.exitCode=1;});
