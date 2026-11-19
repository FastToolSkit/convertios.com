'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const locales = [
  {prefix: '', label: 'View all articles'},
  {prefix: 'es/', label: 'Ver todos los artículos'},
  {prefix: 'ar/', label: 'عرض كل المقالات'},
  {prefix: 'pt-br/', label: 'Ver todos os artigos'}
];
const categoryIds = ['pdf-documents','images-formats','ai-technology','audio-video','qr-web','productivity'];
test('every category listing exposes a localized full-library link with the published count', () => {
  let checked = 0;
  for (const {prefix,label} of locales) {
    const fullIndex = path.join(root,prefix,'blog','index.html');
    assert.ok(existsSync(fullIndex));
    for (const cat of categoryIds) {
      for (const suffix of ['', 'page/2/']) {
        const f = path.join(root,prefix,'blog','category',cat,suffix,'index.html');
        if (!existsSync(f)) continue;
        const html = readFileSync(f,'utf8');
        const match = html.match(/<p class="lib-all-articles"><a href="([^"]+)">([^<]+)<span class="lib-all-articles__count">\(([^)]+)\)<\/span>/);
        assert.ok(match, 'full library link missing from '+f);
        assert.equal(match[1],'/'+prefix+'blog/');
        assert.equal(match[2].trim(),label,'incorrect locale label '+f);
        assert.ok(match[3].includes('60'),'incorrect published count '+f);
        assert.ok(html.indexOf('class="lib-pagination"') < html.indexOf('class="lib-all-articles"') || !html.includes('class="lib-pagination"'));
        checked++;
      }
    }
    assert.ok(!readFileSync(fullIndex,'utf8').includes('class="lib-all-articles"'),'full blog index should not show redundant link');
  }
  assert.equal(checked,32,'expected all 32 generated category pages');
});
