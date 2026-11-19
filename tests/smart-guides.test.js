'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const root = join(__dirname, '..');
const tools = JSON.parse(readFileSync(join(root, 'content/smart-tools/catalog.json'), 'utf8'));
const content = JSON.parse(readFileSync(join(root, 'content/smart-tools/guides.json'), 'utf8'));
const locales = {'en':'', 'es':'es', 'ar':'ar', 'pt-BR':'pt-br'};
const escape = x => String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
const legacy = readFileSync(join(root,'jpg-to-png','index.html'),'utf8');
test('the established Convertios tool section conventions are present in the reference',()=>{
  for(const css of ['tool-info-block','tool-info-grid','tool-description page-guide','more-tools-grid','more-tool-card']) {
    assert.ok(legacy.includes(css),css);
  }
});
test('all 40 smart pages match existing description/SEO section conventions', () => {
  assert.equal(tools.length, 10);
  for (const tool of tools) {
    for (const [lang,prefix] of Object.entries(locales)) {
      const rel=join(root,prefix,tool.slug,'index.html');
      const html=readFileSync(rel,'utf8');
      const guide=content.tools[tool.slug][lang];
      const h=content.headings[lang];
      assert.ok(guide,rel);
      for(const css of ['class="tool-info-block"','class="tool-info-grid"','class="tool-description page-guide"','class="more-tools-grid"']) assert.ok(html.includes(css),rel+': '+css);
      assert.equal((html.match(/class="more-tool-card"/g)||[]).length,4,rel+': related cards');
      assert.equal((html.match(/class="tool-info-grid">([\s\S]*?)<\/div><\/section>/g)||[]).length,1,rel+': info panel');
      for(const key of ['browser','upload','third','retention','size','formats']) assert.ok(html.includes(escape(h[key])),rel+': information '+key);
      for(const key of ['why','how','limits','faq','info','extra']) assert.ok(html.includes(escape(h[key])),rel+': heading '+key);
      for(const key of ['use','limits','question','answer']) assert.ok(html.includes(escape(guide[key])),rel+': guidance '+key);
      for(const dest of content.related_tools[tool.slug]) assert.ok(html.includes('href="/'+(prefix?prefix+'/':'')+dest+'/"'),rel+': related '+dest);
      assert.ok(html.includes('<meta name="twitter:card"'),rel);
      assert.ok(html.includes('rel="canonical"'),rel);
      assert.ok(html.includes('<meta name="robots" content="index, follow">'),rel);
      assert.equal((html.match(/<link rel="alternate" hreflang="/g)||[]).length,5,rel+': hreflang');
      assert.equal((html.match(/<h1>/g)||[]).length,1,rel+': h1');
      assert.ok(!html.includes('\uFFFD'),rel+': replacement characters');
      assert.equal((html.match(/<h3>/g)||[]).length>=3,true,rel+': FAQs');
      if(lang==='ar') assert.ok(html.includes('dir="rtl"'),rel);
      if(['svg-to-png','image-metadata-remover'].includes(tool.slug)) assert.ok(html.includes(escape(h.localret)),rel+': browser privacy');
      else assert.ok(html.includes(escape(h.remoteret)),rel+': server privacy');
    }
  }
});
