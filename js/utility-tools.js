const config = JSON.parse(document.querySelector('#utility-config').textContent);
const [{MAX_TEXT, formatJSON, jsonError, jsonToCSV, csvToJSON, buildUTM, previewData}, {planRename, zipRenamed}] = await Promise.all([
  import(`./utility-core.mjs?v=${config.versions.core}`),
  import(`./rename-core.mjs?v=${config.versions.rename}`)
]);
const {tool, labels} = config;
const form = document.querySelector('#utility-form');
const output = document.querySelector('#utility-output');
const status = document.querySelector('#utility-status');
const value = id => form.elements[id]?.value || '';
const setStatus = message => { status.textContent = message; };
const el = (tag, text, className) => { const item = document.createElement(tag); item.textContent = text; if (className) item.className = className; return item; };

function button(text, action) {
  const item = el('button', text);
  item.type = 'button'; item.addEventListener('click', action);
  return item;
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text); setStatus(labels.copied); }
  catch { setStatus(labels.copyFailed); }
}

function download(text, filename, mime) {
  downloadBlob(new Blob([text], {type: mime}), filename);
}
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function showText(text, filename, mime) {
  output.replaceChildren();
  const area = document.createElement('textarea'); area.readOnly = true; area.value = text;
  area.setAttribute('aria-label', labels.result);
  output.append(area, button(labels.copy, () => copy(text)), button(labels.download, () => download(text, filename, mime)));
  setStatus(labels.ready);
}

const file = form.elements.upload;
if (file) file.addEventListener('change', async () => {
  const selected = file.files?.[0]; if (!selected) return;
  if (selected.size > MAX_TEXT || !selected.size) { setStatus(labels.LIMIT); file.value = ''; return; }
  try {
    const data = await selected.arrayBuffer();
    const encoding = value('encoding') || 'utf-8';
    form.elements.source.value = new TextDecoder(encoding, {fatal:true}).decode(data);
    setStatus(labels.loaded);
  } catch { setStatus(labels.ENCODING); }
});

function runRegex() {
  const pattern = value('pattern'), input = value('source'), replacement = value('replacement');
  const flags = [...form.querySelectorAll('[name="flags"]:checked')].map(x => x.value).join('');
  if (pattern.length > 500 || input.length > 20000 || replacement.length > 500) throw new Error('LIMIT');
  const worker = new Worker('/js/regex-worker.js?v=' + config.versions.worker);
  let settled = false;
  const finish = () => { settled = true; worker.terminate(); };
  const timer = setTimeout(() => { if (!settled) { finish(); setStatus(labels.TIMEOUT); } }, 250);
  worker.onmessage = ({data}) => {
    if (settled) return;
    clearTimeout(timer); finish(); output.replaceChildren();
    if (data.error) { setStatus(data.error); return; }
    const count = el('p', `${data.matches.length}${data.truncated ? '+' : ''} ${labels.matches}`);
    const list = document.createElement('ol');
    for (const match of data.matches) {
      const item = document.createElement('li');
      item.append(el('bdi', `${match.index}: ${JSON.stringify(match.value)}`));
      if (match.captures.length || Object.keys(match.groups).length) {
        item.append(el('small', ` ${labels.captures}: ${JSON.stringify(match.captures)} ${JSON.stringify(match.groups)}`));
      }
      list.append(item);
    }
    output.append(count, list);
    if (replacement) {
      const area = document.createElement('textarea'); area.readOnly = true; area.value = data.substituted; area.setAttribute('aria-label', labels.replaced);
      output.append(el('h2', labels.replaced), area, button(labels.copy, () => copy(data.substituted)));
    }
    setStatus(labels.ready);
  };
  worker.onerror = () => { if (!settled) { clearTimeout(timer); finish(); setStatus(labels.ERROR); } };
  worker.postMessage({pattern, flags, input, replacement});
}

function runUTM() {
  const fields = Object.fromEntries(['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].map(key => [key, value(key)]));
  const url = buildUTM(value('url'), fields);
  const row = document.createElement('li');
  row.append(el('bdi', url), button(labels.copy, () => copy(url)));
  let list = output.querySelector('ol');
  if (!list) { list = document.createElement('ol'); output.append(list); }
  list.prepend(row);
  while (list.children.length > 25) list.lastChild.remove();
  setStatus(labels.ready);
}

function runPreview() {
  const data = previewData(value('url'), value('title'), value('description'), value('image'));
  output.replaceChildren();
  const google = el('section', '', 'utility-preview');
  google.append(el('h2', labels.google), el('span', data.domain), el('strong', data.title), el('p', data.description));
  const social = el('section', '', 'utility-preview utility-social');
  social.append(el('h2', labels.social));
  if (data.image) {
    const img = document.createElement('img'); img.src = data.image; img.alt = labels.imageAlt; img.loading = 'lazy';
    img.onerror = () => { img.replaceWith(el('p', labels.imageFailed)); };
    social.append(img);
  }
  social.append(el('span', data.domain), el('strong', data.title), el('p', data.description));
  output.append(google, social);
  setStatus(labels.previewNote);
}

let renamePlan;
if (tool === 'bulk-file-renamer') form.addEventListener('input', () => { renamePlan = null; output.replaceChildren(); setStatus(''); });
function runRename() {
  renamePlan = planRename([...form.elements.files.files], {
    find:value('find'), replace:value('replace'), letterCase:value('letterCase'),
    sequence:form.elements.sequence.checked, start:Number(value('start')), pad:Number(value('pad'))
  });
  output.replaceChildren();
  const list = document.createElement('ol');
  for (const entry of renamePlan) {
    const row = document.createElement('li');
    row.append(el('bdi', entry.original), document.createTextNode(' → '), el('bdi', entry.name));
    list.append(row);
  }
  const save = button(labels.downloadZip, async () => {
    save.disabled = true; setStatus(labels.working);
    try { downloadBlob(await zipRenamed(renamePlan), 'renamed-files.zip'); setStatus(labels.ready); }
    catch (error) { setStatus(labels[error.message] || labels.ERROR); }
    finally { save.disabled = false; }
  });
  output.append(list, save); setStatus(labels.previewReady);
}

form.addEventListener('submit', event => {
  event.preventDefault(); setStatus('');
  try {
    if (tool === 'json-formatter-validator') showText(formatJSON(value('source'), value('mode')), 'formatted.json', 'application/json;charset=utf-8');
    else if (tool === 'json-csv-converter') {
      const csv = value('direction') === 'json-csv';
      const text = csv ? jsonToCSV(value('source')) : csvToJSON(value('source'), value('delimiter'));
      showText(text, csv ? 'converted.csv' : 'converted.json', csv ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8');
    } else if (tool === 'regex-tester') runRegex();
    else if (tool === 'utm-campaign-builder') runUTM();
    else if (tool === 'seo-social-preview') runPreview();
    else if (tool === 'bulk-file-renamer') runRename();
  } catch (error) {
    output.replaceChildren();
    setStatus(error instanceof SyntaxError ? jsonError(error, value('source')) : (labels[error.message] || error.message || labels.ERROR));
  }
});
