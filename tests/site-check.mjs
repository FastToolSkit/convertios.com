// Static site checks for convertios.com. Run: node tests/site-check.mjs   (also part of `npm test`)
// No dependencies. Exits non-zero when a check fails; prints every problem found.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://convertios.com';
const SKIP = new Set(['node_modules', '.git', 'tests', 'test-results', 'backend', 'docs', 'scripts', 'js', 'tool-template']);
const problems = [];
const warn = [];
const fail = (cat, page, msg) => problems.push(`[${cat}] ${page}: ${msg}`);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name) || e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name === 'index.html') out.push(path.relative(ROOT, full).split(path.sep).join('/'));
  }
  return out;
}
const pages = walk(ROOT).sort();
const src = Object.fromEntries(pages.map((p) => [p, fs.readFileSync(path.join(ROOT, p), 'utf8')]));
const langOf = (p) => (p.startsWith('ar/') ? 'ar' : p.startsWith('es/') ? 'es' : 'en');
const urlOf = (p) => `${BASE}/${p.slice(0, -'index.html'.length)}`;
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const meta = (s, name, attr = 'name') => { const m = s.match(new RegExp(`<meta\\s+${attr}="${name}"\\s+content="([^"]*)"`)); return m ? decode(m[1]) : null; };
const robots = (s) => (meta(s, 'robots') || 'index, follow').toLowerCase();
const indexable = pages.filter((p) => !robots(src[p]).includes('noindex'));
const exists = (urlPath) => {
  const rel = urlPath.replace(/^\//, '');
  const full = path.join(ROOT, rel);
  return rel === '' || (fs.existsSync(full) && fs.statSync(full).isFile()) || fs.existsSync(path.join(full, 'index.html'));
};

// 1. language + direction
for (const p of pages) {
  const html = src[p].match(/<html([^>]*)>/)?.[1] || '';
  const lang = html.match(/lang="([^"]+)"/)?.[1]?.slice(0, 2);
  if (lang !== langOf(p)) fail('lang', p, `lang=${lang}`);
  const dir = html.match(/dir="([^"]+)"/)?.[1];
  if (langOf(p) === 'ar' && dir !== 'rtl') fail('lang', p, 'Arabic page without dir="rtl"');
}

// 2. canonical, hreflang, metadata, headings
const titles = new Map();
const descs = new Map();
const alternates = {};
for (const p of indexable) {
  const s = src[p];
  const canon = [...s.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
  if (canon.length !== 1 || canon[0] !== urlOf(p)) fail('canonical', p, canon.join(',') || 'missing');
  const alt = Object.fromEntries([...s.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
  alternates[p] = alt;
  for (const l of ['en', 'ar', 'es', 'x-default']) if (!alt[l]) fail('hreflang', p, `missing ${l}`);
  if (alt[langOf(p)] !== urlOf(p)) fail('hreflang', p, `self link ${alt[langOf(p)]}`);
  const title = decode((s.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '').trim();
  if (!title) fail('title', p, 'missing');
  else {
    if (title.length > 65) warn.push(`[title-length] ${p}: ${title.length} chars`);
    titles.set(title, [...(titles.get(title) || []), p]);
  }
  const desc = meta(s, 'description');
  if (!desc) fail('description', p, 'missing');
  else {
    if (desc.length < 50 || desc.length > 170) warn.push(`[description-length] ${p}: ${desc.length} chars`);
    descs.set(desc, [...(descs.get(desc) || []), p]);
  }
  const h1 = (s.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail('h1', p, `${h1} h1 elements`);
  if (!/name="viewport"/.test(s)) fail('viewport', p, 'missing');
  if (!meta(s, 'og:title', 'property')) fail('open-graph', p, 'missing og:title');
}
for (const [t, ps] of titles) if (ps.length > 1) fail('duplicate-title', ps.join(' + '), t);
for (const [d, ps] of descs) if (ps.length > 1) fail('duplicate-description', ps.join(' + '), d.slice(0, 80));
for (const [p, alt] of Object.entries(alternates)) {
  for (const [l, href] of Object.entries(alt)) {
    if (l === 'x-default') continue;
    const target = href.slice(BASE.length + 1) + 'index.html';
    if (!src[target]) { fail('hreflang', p, `${l} -> missing page ${href}`); continue; }
    if (alternates[target] && alternates[target][langOf(p)] !== urlOf(p)) fail('hreflang', p, `${target} does not link back`);
  }
}

// 3. links and assets
for (const p of pages) {
  const s = src[p];
  for (const [, href] of s.matchAll(/<a\s[^>]*href="([^"#]+)/g)) {
    let u = href.startsWith(BASE) ? href.slice(BASE.length) || '/' : href;
    if (/^[a-z]+:/i.test(u) || u.startsWith('//') || u.includes('${')) {
      if (/^(https?:)?\/\/(localhost|127\.|[^/]*onrender\.com|[^/]*github\.io)/.test(u)) fail('link', p, `internal/staging link ${u}`);
      continue;
    }
    u = u.split('?')[0];
    if (!u.startsWith('/')) u = path.posix.join('/' + path.posix.dirname(p), u);
    if (!exists(u)) fail('link', p, `broken ${href}`);
    else if (u.endsWith('.html') && !u.includes('google')) fail('link', p, `legacy .html link ${href}`);
  }
  for (const [, ref] of s.matchAll(/(?:src|href)="(\/[^"?#]+\.(?:css|js|png|jpg|svg|ico|webp))/g)) if (!exists(ref)) fail('asset', p, `missing ${ref}`);
  // language switcher points at the equivalent page
  const sw = s.match(/<details class="language-selector[\s\S]*?<\/details>/)?.[0];
  if (!sw) fail('language-switcher', p, 'missing');
  else {
    const stem = p.replace(/^(ar|es)\//, '').slice(0, -'index.html'.length);
    for (const [l, pre] of [['en', ''], ['ar', 'ar/'], ['es', 'es/']]) {
      const want = `${BASE}/${pre}${stem}`;
      const got = sw.match(new RegExp(`<a href="([^"]+)"[^>]*hreflang="${l}"`))?.[1];
      const fallback = `${BASE}/${pre}all-tools/`;
      const equivalentExists = Boolean(src[`${pre}${stem}index.html`]);
      if (got !== want && !(!equivalentExists && got === fallback)) fail('language-switcher', p, `${l} -> ${got}`);
    }
  }
}

// 4. structured data
for (const p of pages) {
  for (const [, block] of src[p].matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(block); } catch (e) { fail('json-ld', p, 'invalid JSON: ' + e.message); continue; }
    const text = JSON.stringify(data);
    if (/aggregateRating|"review"|ratingValue|reviewCount/i.test(text)) fail('json-ld', p, 'ratings/reviews present');
    if (/fasttools/i.test(text)) fail('json-ld', p, 'old brand name');
    for (const [, u] of text.matchAll(/"(https:\/\/convertios\.com\/[^"?{]*)"/g)) {
      const pathPart = u.slice(BASE.length);
      if (!exists(pathPart) && !/\.(png|ico|svg)$/.test(pathPart)) fail('json-ld', p, `URL not found ${u}`);
      const l = pathPart.startsWith('/ar/') ? 'ar' : pathPart.startsWith('/es/') ? 'es' : 'en';
      if (l !== langOf(p) && pathPart !== '/' && !/\.(png|ico|svg)$/.test(pathPart)) fail('json-ld', p, `links other language ${u}`);
    }
  }
}

// 5. sitemap and robots
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (new Set(locs).size !== locs.length) fail('sitemap', 'sitemap.xml', 'duplicate URLs');
for (const u of locs) {
  const p = u.slice(BASE.length + 1) + 'index.html';
  if (!src[p]) fail('sitemap', 'sitemap.xml', `no page for ${u}`);
  else if (!indexable.includes(p)) fail('sitemap', 'sitemap.xml', `noindex page listed ${u}`);
}
for (const p of indexable) if (!locs.includes(urlOf(p))) fail('sitemap', 'sitemap.xml', `missing ${urlOf(p)}`);
const robotsTxt = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
if (!robotsTxt.includes(`Sitemap: ${BASE}/sitemap.xml`)) fail('robots', 'robots.txt', 'sitemap line missing');
if (/Disallow:\s*\/(\s|$)/m.test(robotsTxt)) fail('robots', 'robots.txt', 'blocks the whole site');
if (!fs.readFileSync(path.join(ROOT, 'ads.txt'), 'utf8').includes('pub-8386549343296072, DIRECT')) fail('ads.txt', 'ads.txt', 'publisher line missing');

// 6. content hygiene
for (const p of pages) {
  const s = src[p];
  if (/fasttools/i.test(s)) fail('branding', p, 'old FastTools reference');
  if (/temporary-tool-notice|being improved|coming soon|lorem ipsum/i.test(s)) fail('unfinished', p, 'unfinished-looking notice');
  if ((s.match(/adsbygoogle\.js/g) || []).length > 1) fail('adsense', p, 'duplicate AdSense script');
  if (!robots(s).includes('noindex') && !/adsbygoogle\.js\?client=ca-pub-8386549343296072/.test(s)) fail('adsense', p, 'AdSense script missing');
  for (const img of s.match(/<img\b[^>]*>/g) || []) if (!/\balt="/.test(img)) fail('a11y', p, `img without alt ${img.slice(0, 60)}`);
  // inline handlers must call functions that exist somewhere on the page or in its scripts
  const scripts = [...s.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n')
    + [...s.matchAll(/<script[^>]*\bsrc="(\/[^"?]+)/g)].map((m) => (exists(m[1]) ? fs.readFileSync(path.join(ROOT, m[1]), 'utf8') : '')).join('\n');
  for (const [, fn] of s.matchAll(/\bon(?:click|change|input|submit)="\s*(?:return\s+)?([A-Za-z_$][\w$]*)\s*\(/g)) {
    if (!new RegExp(`(function\\s+${fn}\\b|\\b${fn}\\s*=|window\\.${fn}\\s*=)`).test(scripts)) fail('handler', p, `${fn}() is not defined`);
  }
}

// 7. asset version stamps
try {
  execFileSync('python3', [path.join(ROOT, 'scripts', 'stamp-assets.py'), '--check'], { stdio: 'pipe' });
} catch (e) {
  fail('asset-version', 'scripts/stamp-assets.py', String(e.stdout || e.message).trim().split('\n').slice(-1)[0]);
}

for (const w of warn) console.log('warning ' + w);
for (const p of problems) console.log(p);
console.log(`\n${pages.length} pages (${indexable.length} indexable), ${locs.length} sitemap URLs: ${problems.length} problem(s), ${warn.length} warning(s)`);
process.exit(problems.length ? 1 : 0);
