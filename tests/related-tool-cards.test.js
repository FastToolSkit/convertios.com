'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const guides = JSON.parse(fs.readFileSync(path.join(root, 'content/smart-tools/guides.json'), 'utf8'));
const smart = JSON.parse(fs.readFileSync(path.join(root, 'content/smart-tools/catalog.json'), 'utf8')).map(t => t.slug);
const utility = ['compress-pdf','searchable-pdf-ocr','invoice-generator','csv-xlsx-converter','json-csv-converter','bulk-file-renamer','json-formatter-validator','regex-tester','utm-campaign-builder','seo-social-preview'];
const locales = {en:'',es:'es/',ar:'ar/','pt-BR':'pt-br/'};
const headings = {en:'Explore more tools',es:'Explora más herramientas',ar:'اكتشف المزيد من الأدوات','pt-BR':'Explore mais ferramentas'};
const page = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const plain = s => s.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").trim();

test('all 80 localized tool pages have four valid illustrated related cards', () => {
  assert.equal(smart.length,10);
  for (const [lang,prefix] of Object.entries(locales)) for (const slug of [...smart,...utility]) {
    const html = page(`${prefix}${slug}/index.html`);
    const sections = [...html.matchAll(/<section class="more-tools" aria-labelledby="more-tools-heading">([\s\S]*?)<\/section>/g)];
    assert.equal(sections.length,1,`${prefix}${slug}: section`);
    assert.ok(html.indexOf('class="more-tools"') > html.indexOf('class="smart-guide"') || html.indexOf('class="more-tools"') > html.indexOf('class="tool-description page-guide"'));
    assert.ok(html.indexOf('class="more-tools"') < html.indexOf('<footer'));
    assert.equal((html.match(/id="more-tools-heading"/g)||[]).length,1);
    assert.ok(sections[0][1].includes(`<h2 id="more-tools-heading">${headings[lang]}</h2>`));
    assert.ok(html.includes(`href="https://convertios.com/${prefix}${slug}/"`));
    assert.ok(html.includes(`href="/${prefix}all-tools/"`));
    assert.ok(html.includes(`dir="${lang==='ar'?'rtl':'ltr'}"`));
    const cards = [...sections[0][1].matchAll(/<a href="([^"]+)" class="more-tool-card"><span class="more-tool-icon" aria-hidden="true"><img src="([^"]+)" alt="" width="32" height="32" loading="lazy" decoding="async"><\/span><span>(.*?)<\/span><\/a>/g)];
    assert.equal(cards.length,4,`${prefix}${slug}: cards`);
    const destinations = new Set();
    for (const [,href,src,label] of cards) {
      assert.ok(href.startsWith(`/${prefix}`),`${prefix}${slug}: locale ${href}`);
      assert.notEqual(href,`/${prefix}${slug}/`);
      assert.ok(!destinations.has(href),`${prefix}${slug}: duplicate ${href}`);
      destinations.add(href);
      const target = page(`${href.slice(1)}index.html`);
      assert.equal(plain(label),plain(target.match(/<h1\b[^>]*>(.*?)<\/h1>/s)[1]),`${href}: localized label`);
      assert.ok(src.startsWith('/assets/related-tools/'));
      const svg = page(src.slice(1));
      assert.match(svg,/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg" width="48" height="48"/);
      assert.match(svg,/<\/svg>\s*$/);
      assert.ok(Buffer.byteLength(svg)<1000,`${src}: image size`);
    }
    if (smart.includes(slug)) assert.deepEqual([...destinations].map(x=>x.slice(prefix.length+1,-1)),guides.related_tools[slug]);
  }
});

test('related image styling retains mobile two-column card grid', () => {
  const css = page('smart-tools.css');
  const legacy = page('style.min.css');
  assert.match(css,/\.smart-page \.more-tool-icon img \{ display:block; width:32px; height:32px;/);
  assert.match(legacy,/section\.more-tools \.more-tools-grid/);
  assert.match(legacy,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
});
