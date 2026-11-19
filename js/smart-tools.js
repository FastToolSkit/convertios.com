const config = JSON.parse(document.querySelector('#smart-config').textContent);
const {tool, messages, extension, limit, maxFiles, local} = config;
const form = document.querySelector('#smart-form');
const fields = form.querySelector('fieldset');
const input = form.elements.file;
const results = document.querySelector('#results');
const status = document.querySelector('#smart-status');
const queue = document.querySelector('#queue');
const sizeFormat = new Intl.NumberFormat(document.documentElement.lang, {maximumFractionDigits: 1});
let files = [];
let urls = [];
let busy = false;

function track(event, error) {
  if (typeof window.gtag === 'function') window.gtag('event', 'tool_' + event, {
    tool_id: tool, page_language: document.documentElement.lang, ...(error ? {error_code: error} : {})
  });
}
function size(bytes) {
  return sizeFormat.format(bytes >= 1048576 ? bytes / 1048576 : bytes / 1024) + (bytes >= 1048576 ? ' MiB' : ' KiB');
}
function clearResults() {
  urls.forEach(url => URL.revokeObjectURL(url));
  urls = [];
  results.replaceChildren();
}
function displayQueue() {
  queue.replaceChildren();
  for (const [i, file] of files.entries()) {
    const row = document.createElement('li');
    const name = document.createElement('bdi');
    name.textContent = file.name + ' · ' + size(file.size);
    row.append(name);
    if (tool === 'heic-to-pdf' && files.length > 1) {
      for (const step of [-1, 1]) {
        const button = document.createElement('button');
        const key = step < 0 ? 'up' : 'down';
        button.type = 'button';
        button.textContent = step < 0 ? '↑' : '↓';
        button.setAttribute('aria-label', messages[key] + ' · ' + file.name);
        button.disabled = !files[i + step];
        button.onclick = () => {
          [files[i], files[i + step]] = [files[i + step], files[i]];
          clearResults();
          displayQueue();
          queue.children[i + step].querySelector('button:not(:disabled)')?.focus();
        };
        row.append(button);
      }
    }
    queue.append(row);
  }
}
function select(list) {
  if (busy) return;
  clearResults();
  files = Array.from(list);
  status.textContent = '';
  if (files.length > maxFiles || files.some(f => f.size > limit * 1048576)) {
    files = [];
    status.textContent = messages.LIMIT;
  } else if (files.some(f => !f.size)) {
    files = [];
    status.textContent = messages.INVALID_FILE;
  }
  if (files.length) track('upload_start');
  if (!files.length) input.value = '';
  displayQueue();
}
input.addEventListener('change', () => select(input.files));
const zone = document.querySelector('#smart-drop');
zone.addEventListener('dragover', e => e.preventDefault());
zone.addEventListener('drop', e => {
  e.preventDefault();
  if (busy) return;
  input.value = '';
  select(e.dataTransfer.files);
});

async function convert(group, options) {
  if (local) {
    const {raster} = await import('./smart-raster.js');
    return raster(tool, group[0], options);
  }
  const data = new FormData();
  for (const file of group) data.append('file', file, 'input');
  for (const [key, value] of Object.entries(options)) data.set(key, value);
  const response = await window.ConvertiosUI.backendFetch('/convert/smart/' + tool, {method:'POST', body:data},
    {timeoutMs: 150000, onSlow: () => { status.textContent = messages.working + '…'; }});
  return response.blob();
}
async function checkOutput(blob) {
  if (!blob.size) throw new Error('INVALID_FILE');
  const bytes = new Uint8Array(await blob.slice(0,12).arrayBuffer());
  const text = String.fromCharCode(...bytes);
  const valid = {jpg: bytes[0] === 255 && bytes[1] === 216, png: text.slice(1,4) === 'PNG' && bytes[0] === 137,
    pdf: text.startsWith('%PDF-'), gif: /^GIF8[79]a/.test(text), mp4: text.slice(4,8) === 'ftyp',
    txt: blob.type.startsWith('text/plain')};
  if (!valid[extension]) throw new Error('PROCESSING_FAILED');
}
function outputLink(blob, name) {
  const link = document.createElement('a');
  link.textContent = messages.download + ' ' + extension.toUpperCase();
  link.download = name;
  link.href = URL.createObjectURL(blob);
  urls.push(link.href);
  link.addEventListener('click', () => track('download'));
  return link;
}
async function showResult(blob, group) {
  const card = document.createElement('section');
  const heading = document.createElement('strong');
  heading.dir = 'auto';
  heading.textContent = group.length > 1 ? group.length + ' ' + messages.files : group[0].name;
  const stats = document.createElement('p');
  const total = group.reduce((n, f) => n + f.size, 0);
  stats.textContent = messages.before + ' ' + size(total) + ' · ' + messages.after + ' ' + size(blob.size);
  const name = (group.length > 1 ? 'photos' : group[0].name.replace(/\.[^.]*$/, '')) + '-convertios.' + extension;
  const link = outputLink(blob, name);
  card.append(heading, stats);
  if (extension === 'txt') {
    const label = document.createElement('label');
    const editor = document.createElement('textarea');
    label.textContent = messages.edit;
    editor.value = await blob.text();
    editor.dir = 'auto';
    editor.addEventListener('input', () => {
      URL.revokeObjectURL(link.href);
      urls = urls.filter(url => url !== link.href);
      link.href = URL.createObjectURL(new Blob([editor.value], {type:'text/plain;charset=utf-8'}));
      urls.push(link.href);
    });
    label.append(editor);
    card.append(label);
  }
  card.append(link);
  results.append(card);
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  if (!files.length) {status.textContent = messages.empty; input.focus(); return;}
  const options = Object.fromEntries([...form.querySelectorAll('[name]:not([type=file])')].map(el => [el.name, el.value]));
  const groups = tool === 'heic-to-jpg' ? files.map(f => [f]) : [files.slice()];
  busy = fields.disabled = true;
  clearResults();
  let failed = 0;
  try {
    for (const [index, group] of groups.entries()) {
      status.textContent = messages.working + ' ' + (index + 1) + '/' + groups.length + '…';
      track('conversion_attempt');
      try {
        const blob = await convert(group, options);
        await checkOutput(blob);
        await showResult(blob, group);
        track('conversion_success');
      } catch (error) {
        const key = [error.code, error.message].find(k => Object.hasOwn(messages, k)) ||
          (local ? 'INVALID_FILE' : 'PROCESSING_FAILED');
        const item = document.createElement('p');
        item.dir = 'auto';
        item.textContent = group[0].name + ' — ' + messages[key];
        results.append(item);
        track('conversion_failure', key);
        failed++;
      }
    }
    status.textContent = failed ? messages.partial : messages.done;
  } finally { busy = fields.disabled = false; }
});
window.addEventListener('pagehide', event => { if (!event.persisted) clearResults(); });
