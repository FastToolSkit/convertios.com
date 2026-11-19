'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://convertios.com';
const slugs = [
  'heic-to-jpg','heic-to-pdf','mp4-to-gif','video-compressor','image-to-text',
  'gif-compressor','svg-to-png','avif-to-png','pdf-to-text','image-metadata-remover'
];
const locales = ['', 'es/', 'ar/', 'pt-br/'];
const localeHrefs = [
  {href:'/', lang:'en'}, {href:'/es/', lang:'es'},
  {href:'/ar/', lang:'ar'}, {href:'/pt-br/',lang:'pt-BR'}
];
test('every language homepage directly links to all ten published smart tools', () => {
  for (const locale of locales) {
    const html = fs.readFileSync(path.join(ROOT,locale,'index.html'),'utf8');
    assert.match(html, /data-indexing-discovery="smart-tools"/);
    for (const slug of slugs) {
      const href = '/' + locale + slug + '/';
      assert.ok(html.includes('href="' + href + '"'), 'missing '+href+' from /'+locale);
      assert.ok(fs.existsSync(path.join(ROOT,locale,slug,'index.html')), 'missing '+href);
    }
  }
});
test('new tool discovery section renders accessible cards and a versioned stylesheet in every locale', () => {
  const css = fs.readFileSync(path.join(ROOT, 'assets/smart-tools-home.css'), 'utf8');
  assert.match(css, /\.discovery-links__grid\s*\{/);
  assert.match(css, /\.discovery-card:focus-visible\s*\{/);
  for (const locale of locales) {
    const html = fs.readFileSync(path.join(ROOT, locale, 'index.html'), 'utf8');
    const section = html.match(/<section class="discovery-links"[^>]*>([\s\S]*?)<\/section>/);
    assert.ok(section, 'missing Smart Tools cards on /' + locale);
    const cards = [...section[1].matchAll(/<a class="discovery-card" href="([^"]+)"/g)];
    assert.equal(cards.length, slugs.length, 'must show exactly 10 cards on /' + locale);
    assert.deepEqual(cards.map(m => m[1]), slugs.map(slug => '/' + locale + slug + '/'));
    assert.match(html, /href="\/assets\/smart-tools-home\.css\?v=[a-f0-9]{8}"/);
    assert.ok(!section[1].includes('<p class="section-sub">'), 'unformatted raw links returned on /' + locale);
  }
});
test('every homepage has crawlable cross-language navigation', () => {
  for (const locale of locales) {
    const html = fs.readFileSync(path.join(ROOT,locale,'index.html'),'utf8');
    assert.match(html,/class="footer-language-links"/);
    for (const {href,lang} of localeHrefs) {
      assert.ok(html.includes('href="' + href + '" hreflang="' + lang + '" lang="' + lang + '"'),
        'missing locale '+href+' on /'+locale);
    }
  }
});
test('every sitemap URL is reachable via ordinary HTML anchors from the homepage', () => {
  const xml = fs.readFileSync(path.join(ROOT,'sitemap.xml'),'utf8');
  const sitemap = new Set([...xml.matchAll(/<loc>(https:\/\/convertios\.com[^<]+)<\/loc>/g)]
    .map(m => new URL(m[1]).pathname));
  assert.ok(sitemap.size >= 504,'unexpected sitemap shrinkage');
  const queue = ['/']; const seen = new Set();
  while(queue.length) {
    const at = queue.shift();
    if(seen.has(at)) continue;
    seen.add(at);
    const file = path.join(ROOT,at.slice(1),'index.html');
    if(!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file,'utf8');
    for(const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      const href = m[1];
      if(!href.startsWith('/') || href.startsWith('//')) continue;
      const pathname = new URL(href, SITE).pathname;
      if(sitemap.has(pathname) && !seen.has(pathname)) queue.push(pathname);
    }
  }
  const disconnected = [...sitemap].filter(url=>!seen.has(url));
  assert.deepEqual(disconnected,[], 'sitemap URL not reachable by HTML anchors');
});
