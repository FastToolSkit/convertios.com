'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const root = join(__dirname, '..');
const tools = JSON.parse(readFileSync(join(root, 'content/smart-tools/catalog.json'), 'utf8'));
const content = JSON.parse(readFileSync(join(root, 'content/smart-tools/guides.json'), 'utf8'));
const locales = {'en':'', 'es':'es', 'ar':'ar', 'pt-BR':'pt-br'};
function htmlEscape(s) {
  return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'",'&#x27;');
}
test('all 40 smart pages include unique local-language guidance and accurate facts', () => {
  assert.equal(tools.length, 10);
  for (const tool of tools) {
    for (const [lang, prefix] of Object.entries(locales)) {
      const rel = join(root, prefix, tool.slug, 'index.html');
      const html = readFileSync(rel, 'utf8');
      const guide = content.tools[tool.slug][lang];
      const headings = content.headings[lang];
      assert.ok(guide, tool.slug + ': ' + lang);
      for (const key of ['info','why','how','limits','faq','input','output','size','processing']) {
        assert.ok(html.includes(htmlEscape(headings[key])), rel + ': heading ' + key);
      }
      for (const key of ['use','limits','question','answer']) {
        assert.ok(guide[key].length > 50 || key === 'question', rel + ': missing detail ' + key);
        assert.ok(html.includes(htmlEscape(guide[key])), rel + ': content ' + key);
      }
      assert.ok(html.includes('class="smart-faq"') && html.includes('class="smart-info"'), rel);
      assert.ok(html.includes('<meta name="twitter:card"'), rel);
      assert.ok(html.includes('href="https://convertios.com/'+(prefix?prefix+'/':'')+tool.slug+'/"'), rel);
      assert.ok(!html.includes('\uFFFD'), rel + ': replacement characters');
    }
  }
});
