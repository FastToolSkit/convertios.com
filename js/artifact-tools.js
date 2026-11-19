const config = JSON.parse(document.querySelector('#artifact-config').textContent);
const {tool, messages:m} = config;
const form = document.querySelector('#artifact-form');
const status = document.querySelector('#artifact-status');
const result = document.querySelector('#artifact-result');
const submit = form.querySelector('button[type=submit]');
const input = form.elements.file;
let currentUrl;
const field = name => form.elements[name]?.value || '';
const message = key => m[key] || m.ERROR;
const setStatus = value => { status.textContent = value; };

function clearResult() {
  if (currentUrl) URL.revokeObjectURL(currentUrl);
  currentUrl = null;
  result.replaceChildren();
}

function addItem() {
  const list = document.querySelector('#invoice-items');
  if (list.children.length >= 40) return setStatus(message('LIMIT'));
  const row = document.createElement('fieldset');
  row.className = 'invoice-row';
  const legend = document.createElement('legend');
  legend.textContent = m.item + ' ' + (list.children.length + 1);
  row.append(legend);
  for (const [name, label, type, value] of [
    ['description',m.itemDescription,'text',''], ['quantity',m.quantity,'number','1'],
    ['unitPrice',m.unitPrice,'number','0.00'], ['taxRate',m.taxRate,'number','0']
  ]) {
    const id = name + '-' + list.children.length;
    const caption = document.createElement('label'); caption.htmlFor = id; caption.textContent = label;
    const control = document.createElement('input'); control.id = id; control.name = name;
    control.type = type; control.value = value; control.required = true;
    if (type === 'number') { control.min = name === 'quantity' ? '0.01' : '0'; control.step = '0.01'; }
    control.maxLength = 160;
    row.append(caption, control);
  }
  const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = m.remove;
  remove.addEventListener('click', () => { if (list.children.length > 1) row.remove(); updateTotals(); });
  row.append(remove); list.append(row);
}

function cents(raw) {
  if (!/^\d{1,7}(?:\.\d{1,2})?$/.test(raw)) throw Error('BAD_OPTIONS');
  const [whole, fraction=''] = raw.split('.');
  return BigInt(whole) * 100n + BigInt((fraction + '00').slice(0,2));
}
function updateTotals() {
  if (tool !== 'invoice-generator') return;
  try {
    let subtotal = 0n, tax = 0n;
    for (const row of document.querySelectorAll('.invoice-row')) {
      const quantity = cents(row.querySelector('[name=quantity]').value);
      const unit = cents(row.querySelector('[name=unitPrice]').value);
      const rate = cents(row.querySelector('[name=taxRate]').value);
      const line = (quantity * unit + 50n) / 100n;
      subtotal += line;
      tax += (line * rate + 5000n) / 10000n;
    }
    const format = n => `${n / 100n}.${String(n % 100n).padStart(2,'0')}`;
    document.querySelector('#invoice-totals').textContent =
      `${m.subtotal}: ${format(subtotal)} · ${m.tax}: ${format(tax)} · ${m.total}: ${field('currency')} ${format(subtotal+tax)}`;
  } catch { document.querySelector('#invoice-totals').textContent = m.enterAmounts; }
}
if (tool === 'invoice-generator') {
  document.querySelector('#add-item').addEventListener('click', addItem);
  form.addEventListener('input', updateTotals);
  addItem(); updateTotals();
}

async function request(toolName, data) {
  return window.ConvertiosUI.backendFetch('/convert/artifact/' + toolName,
    {method:'POST', body:data}, {timeoutMs:150000, onSlow:() => setStatus(m.working)});
}

async function loadSheets() {
  const file = input.files?.[0];
  const select = form.elements.sheet;
  select.replaceChildren();
  if (!file || field('direction') !== 'xlsx-csv') return;
  if (file.size > 6 * 1024 * 1024) return setStatus(m.LIMIT);
  const data = new FormData(); data.set('file', file); data.set('direction', 'xlsx-csv');
  try {
    setStatus(m.working);
    const response = await request('xlsx-sheets', data);
    const names = await response.json();
    for (const name of names) {
      const option = document.createElement('option'); option.value = name; option.textContent = name;
      select.append(option);
    }
    setStatus(m.sheetReady);
  } catch (error) { setStatus(message(error.code)); }
}
if (tool === 'csv-xlsx-converter') {
  const updateDirection = () => {
    const isWorkbook = field('direction') === 'xlsx-csv';
    input.accept = isWorkbook ? '.xlsx' : '.csv,text/csv,text/plain';
    form.querySelector('#sheet-wrap').hidden = !isWorkbook;
    input.value = '';
    form.elements.sheet.replaceChildren();
    clearResult(); setStatus('');
  };
  form.elements.direction.addEventListener('change', updateDirection);
  input.addEventListener('change', loadSheets);
  updateDirection();
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  clearResult(); setStatus('');
  const data = new FormData();
  try {
    if (tool === 'invoice-generator') {
      const items = [...document.querySelectorAll('.invoice-row')].map(row =>
        Object.fromEntries(['description','quantity','unitPrice','taxRate'].map(name => [name,row.querySelector(`[name=${name}]`).value])));
      const invoice = Object.fromEntries(['seller','customer','number','issued','due','currency','notes'].map(name => [name,field(name)]));
      invoice.items = items;
      data.set('invoice', JSON.stringify(invoice));
      if (input.files?.[0]) data.set('file', input.files[0]);
    } else {
      const file = input.files?.[0];
      if (!file || !file.size || file.size > config.maxBytes) throw Error('LIMIT');
      data.set('file', file);
      if (tool === 'csv-xlsx-converter') {
        if (field('direction') === 'xlsx-csv' && !field('sheet')) throw Error('BAD_OPTIONS');
        for (const name of ['direction','delimiter','encoding','sheet']) data.set(name, field(name));
      } else if (tool === 'compress-pdf') data.set('preset', field('preset'));
      else data.set('lang', field('lang'));
    }
    submit.disabled = true; setStatus(m.working);
    const response = await request(tool, data);
    const blob = await response.blob();
    if (!blob.size) throw Error('INVALID_FILE');
    const header = new Uint8Array(await blob.slice(0,5).arrayBuffer());
    const magic = String.fromCharCode(...header);
    const direction = field('direction');
    const extension = tool === 'csv-xlsx-converter' ? (direction === 'xlsx-csv' ? 'csv' : 'xlsx') : 'pdf';
    if ((extension === 'pdf' && magic !== '%PDF-') || (extension === 'xlsx' && magic.slice(0,2) !== 'PK')) throw Error('INVALID_FILE');
    const name = tool === 'invoice-generator' ? `invoice-${field('number').replace(/[^a-z0-9_-]/gi,'-').slice(0,50)}.pdf` :
      tool === 'csv-xlsx-converter' ? `converted.${extension}` : `${tool === 'compress-pdf' ? 'compressed' : 'searchable'}.pdf`;
    currentUrl = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = currentUrl; link.download = name;
    link.textContent = `${m.download} ${extension.toUpperCase()}`;
    if (tool === 'compress-pdf') {
      const stats = document.createElement('p');
      stats.textContent = `${m.original}: ${input.files[0].size.toLocaleString()} ${m.bytes} · ${m.result}: ${blob.size.toLocaleString()} ${m.bytes}`;
      result.append(stats);
    }
    result.append(link); setStatus(m.ready);
  } catch (error) {
    clearResult();
    setStatus(message(error.code || error.message));
  } finally { submit.disabled = false; }
});
