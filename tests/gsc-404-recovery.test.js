'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const root = join(__dirname, '..');
const redirects = readFileSync(join(root, '_redirects'), 'utf8')
  .split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'))
  .map(s => {const [source, target, status] = s.split(/\s+/); return {source,target,status};});
const recoveries = {
  '/ar/es/': '/ar/',
  '/ar/es/meme-generator/': '/ar/meme-generator/',
  '/ar/es/split-pdf/': '/ar/split-pdf/',
  '/ai-enhance.html': '/ai-image-enhancer/',
  '/ai-enhance/': '/ai-image-enhancer/',
  '/remove-background': '/remove-bg/',
};
test('GSC November 19 actionable 404s have specific canonical redirects', () => {
  const genericIndex = redirects.findIndex(r => r.source === '/*.html');
  assert.ok(genericIndex > 0);
  for (const [source, target] of Object.entries(recoveries)) {
    const matching = redirects.filter(r => r.source === source);
    assert.equal(matching.length, 1, 'single explicit redirect for ' + source);
    const rule = matching[0];
    assert.equal(rule.status, '301');
    assert.equal(rule.target, target);
    assert.ok(redirects.indexOf(rule) < genericIndex, 'specific rule before wildcard for ' + source);
    assert.ok(existsSync(join(root,target.slice(1),'index.html')), 'real canonical destination for ' + source);
    const html = readFileSync(join(root,target.slice(1),'index.html'),'utf8');
    assert.ok(html.includes('rel="canonical"'),target);
    assert.ok(html.includes('https://convertios.com' + target),target);
  }
});
test('GSC malformed and unrelated URLs are not given misleading redirects', () => {
  for (const source of ['/cdn-cgi/l/email-protection','/convert/images-to-hdr',
      '/convert/images-to-ase','/${e.target.result}']) {
    assert.ok(!redirects.some(r=>r.source === source), source);
  }
});
