'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const core = import('../js/utility-core.mjs');
const rename = import('../js/rename-core.mjs');

test('JSON formatter reports malformed input and preserves parsed values', async () => {
  const {formatJSON, jsonError} = await core;
  assert.deepEqual(JSON.parse(formatJSON('{"a":[1,true,null]}')), {a:[1,true,null]});
  assert.equal(formatJSON('{"a":1}', 'compact'), '{"a":1}');
  let error;
  try { formatJSON('{\n"a": }'); } catch (caught) { error = caught; }
  assert.ok(error instanceof SyntaxError);
  assert.match(jsonError(error, '{\n"a": }'), /line 2, column/);
});

test('JSON and CSV produce real quoted artifacts and protect spreadsheet formulas', async () => {
  const {jsonToCSV, csvToJSON, parseCSV} = await core;
  const csv = jsonToCSV(JSON.stringify([{name:'A,"B"', nested:{score:2}, note:'=1+1'}, {name:'C\nD', nested:{score:3}, note:'@cmd'}]));
  assert.deepEqual(parseCSV(csv), [['name','nested.score','note'],['A,"B"','2',"'=1+1"],['C\nD','3',"'@cmd"]]);
  assert.deepEqual(JSON.parse(csvToJSON('a;b\r\n"one;two";3', ';')), [{a:'one;two',b:'3'}]);
  assert.throws(() => csvToJSON('a,a\n1,2'), /HEADERS/);
  assert.throws(() => csvToJSON('a,b\n1'), /COLUMNS/);
  assert.throws(() => csvToJSON('a\n"unfinished'), /CSV/);
  assert.throws(() => jsonToCSV('{"not":"an array"}'), /SHAPE/);
});

test('UTM output preserves existing query and fragment and rejects unsafe destinations', async () => {
  const {buildUTM} = await core;
  const result = new URL(buildUTM('https://example.com/p?x=1&utm_source=old#part', {utm_source:'social ads',utm_medium:'email',utm_campaign:'winter + spring'}));
  assert.equal(result.searchParams.get('x'), '1');
  assert.equal(result.searchParams.get('utm_source'), 'social ads');
  assert.equal(result.searchParams.get('utm_campaign'), 'winter + spring');
  assert.equal(result.hash, '#part');
  assert.throws(() => buildUTM('javascript:alert(1)', {utm_source:'x',utm_medium:'y',utm_campaign:'z'}), /URL/);
  assert.throws(() => buildUTM('https://example.com', {utm_source:'x',utm_medium:'y'}), /REQUIRED/);
});

test('SEO preview derives only manual metadata and restricts image URLs', async () => {
  const {previewData} = await core;
  assert.deepEqual(previewData('https://example.com/post','Hello','Summary','https://img.example/a.png'), {url:'https://example.com/post',domain:'example.com',title:'Hello',description:'Summary',image:'https://img.example/a.png'});
  assert.throws(() => previewData('https://example.com','T','D','http://image.example/p.png'), /IMAGE_URL/);
});

test('regex worker returns real captures and substitutions with bounded input', () => {
  const source = fs.readFileSync(path.join(ROOT,'js/regex-worker.js'),'utf8');
  let response;
  const self = {postMessage: value => { response = value; }};
  vm.runInNewContext(source, {self, RegExp, Set, String, Object, Error});
  self.onmessage({data:{pattern:'(?<word>\\w+)',flags:'g',input:'one two',replacement:'[$<word>]'}});
  assert.equal(response.matches.length, 2);
  assert.equal(response.matches[1].groups.word, 'two');
  assert.equal(response.substituted, '[one] [two]');
  self.onmessage({data:{pattern:'\\w+',flags:'',input:'one two',replacement:'[$&]'}});
  assert.equal(response.matches.length, 1);
  assert.equal(response.substituted, '[one] two');
  self.onmessage({data:{pattern:'a'.repeat(501),flags:'g',input:'a',replacement:''}});
  assert.equal(response.error, 'LIMIT');
});

test('generated localized pages and directory links are present', () => {
  for (const locale of ['', 'es/', 'ar/', 'pt-br/']) {
    const home = fs.readFileSync(path.join(ROOT,locale,'index.html'),'utf8');
    const directory = fs.readFileSync(path.join(ROOT,locale,'all-tools/index.html'),'utf8');
    for (const slug of ['json-formatter-validator','json-csv-converter','regex-tester','utm-campaign-builder','seo-social-preview','bulk-file-renamer']) {
      const page = fs.readFileSync(path.join(ROOT,locale,slug,'index.html'),'utf8');
      assert.ok(page.includes('id="utility-form"'));
      assert.ok(home.includes(`href="/${locale}${slug}/"`));
      assert.ok(directory.includes(`href="/${locale}${slug}/"`));
    }
  }
});

test('bulk rename previews collisions and creates a valid ZIP containing original bytes', async () => {
  const {planRename, zipRenamed} = await rename;
  const files = [new File(['first'], 'Photo.txt'), new File(['second'], 'Photo.txt')];
  const plan = planRename(files, {find:'Photo',replace:'item',letterCase:'lower'});
  assert.deepEqual(plan.map(p => p.name), ['item.txt','item (2).txt']);
  const zip = Buffer.from(await (await zipRenamed(plan)).arrayBuffer());
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  assert.equal(zip.readUInt32LE(zip.length - 22), 0x06054b50);
  assert.equal(zip.readUInt16LE(zip.length - 12), 2);
  let offset = 0;
  for (const [name, content] of [['item.txt','first'],['item (2).txt','second']]) {
    assert.equal(zip.readUInt32LE(offset), 0x04034b50);
    const length = zip.readUInt16LE(offset+26);
    assert.equal(zip.subarray(offset+30,offset+30+length).toString(), name);
    const size = zip.readUInt32LE(offset+22);
    assert.equal(zip.subarray(offset+30+length,offset+30+length+size).toString(), content);
    offset += 30+length+size;
  }
  assert.throws(() => planRename([new File(['x'],'evil.exe')]), /FILE/);
  assert.throws(() => planRename([new File(['x'],'CON.txt')]), /FILE/);
  assert.throws(() => planRename(Array.from({length:21}, (_,i) => new File(['x'],`f${i}.txt`))), /LIMIT/);
});
