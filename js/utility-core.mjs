// Pure, bounded browser utilities. No data leaves the page.
export const MAX_TEXT = 2 * 1024 * 1024;

export function requireText(value) {
  if (typeof value !== 'string' || value.length > MAX_TEXT) throw new Error('LIMIT');
  return value;
}

export function jsonError(error, source) {
  const message = String(error.message || error);
  const position = /position\s+(\d+)/i.exec(message);
  const line = /line\s+(\d+).*column\s+(\d+)/i.exec(message);
  if (line) return `${message} (line ${line[1]}, column ${line[2]})`;
  const offset = position ? Number(position[1]) : locateJSONError(source);
  const before = source.slice(0, offset);
  const lines = before.split(/\r\n|\r|\n/);
  return `${message} (line ${lines.length}, column ${lines.at(-1).length + 1})`;
}

// JSON.parse error wording varies across engines. This scanner locates the first
// grammar error when the engine supplies no offset. It never evaluates input.
function locateJSONError(source) {
  const stack = [];
  let state = 'value', i = 0;
  const whitespace = /[\x20\t\r\n]/;
  function string() {
    i++;
    while (i < source.length) {
      const c = source[i++];
      if (c === '"') return true;
      if (c === '\\') {
        const escape = source[i++];
        if (escape === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(source.slice(i, i + 4))) return false;
          i += 4;
        } else if (!'"\\/bfnrt'.includes(escape || ' ')) return false;
      } else if (c.charCodeAt(0) < 32) return false;
    }
    return false;
  }
  function completed() {
    state = stack.length ? 'commaOrEnd' : 'end';
  }
  while (i < source.length) {
    if (whitespace.test(source[i])) { i++; continue; }
    const c = source[i], top = stack.at(-1);
    if (state === 'keyOrEnd' || state === 'key') {
      if (c === '}' && state === 'keyOrEnd') { stack.pop(); i++; completed(); continue; }
      if (c !== '"' || !string()) return i;
      state = 'colon'; continue;
    }
    if (state === 'colon') { if (c !== ':') return i; i++; state = 'value'; continue; }
    if (state === 'commaOrEnd') {
      if (c === ',' && top) { i++; state = top === 'object' ? 'key' : 'value'; continue; }
      if ((c === '}' && top === 'object') || (c === ']' && top === 'array')) { stack.pop(); i++; completed(); continue; }
      return i;
    }
    if (state === 'valueOrEnd' && c === ']') { stack.pop(); i++; completed(); continue; }
    if (state === 'end') return i;
    if (c === '{' || c === '[') {
      i++; stack.push(c === '{' ? 'object' : 'array');
      state = c === '{' ? 'keyOrEnd' : 'valueOrEnd'; continue;
    }
    if (c === '"') { if (!string()) return i; completed(); continue; }
    const literal = /^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(source.slice(i));
    if (!literal) return i;
    i += literal[0].length; completed();
  }
  return i;
}

export function formatJSON(source, mode = 'pretty') {
  requireText(source);
  const value = JSON.parse(source);
  return JSON.stringify(value, null, mode === 'pretty' ? 2 : 0);
}

function flatten(value, prefix, row) {
  for (const [key, item] of Object.entries(value)) {
    const name = prefix ? `${prefix}.${key.replaceAll('\\', '\\\\').replaceAll('.', '\\.')}` : key.replaceAll('\\', '\\\\').replaceAll('.', '\\.');
    if (item && typeof item === 'object' && !Array.isArray(item) && Object.keys(item).length) flatten(item, name, row);
    else row[name] = item == null ? '' : typeof item === 'object' ? JSON.stringify(item) : String(item);
  }
}

function csvCell(value) {
  // Spreadsheet applications can execute formulas even after CSV import.
  let safe = String(value);
  if (/^[\s\uFEFF]*[=+\-@\t\r]/u.test(safe)) safe = "'" + safe;
  return /[",\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

export function jsonToCSV(source) {
  requireText(source);
  const value = JSON.parse(source);
  if (!Array.isArray(value) || value.length === 0 || value.length > 10000 || value.some(row => !row || Array.isArray(row) || typeof row !== 'object')) throw new Error('SHAPE');
  const rows = value.map(row => { const flat = Object.create(null); flatten(row, '', flat); return flat; });
  const headers = [...new Set(rows.flatMap(row => Object.keys(row)))];
  if (!headers.length || headers.length > 500) throw new Error('SHAPE');
  const result = [headers.map(csvCell).join(','), ...rows.map(row => headers.map(key => csvCell(row[key] ?? '')).join(','))].join('\r\n');
  if (result.length > MAX_TEXT * 3) throw new Error('LIMIT');
  return result;
}

export function parseCSV(source, delimiter = ',') {
  requireText(source);
  if (![',', ';', '\t'].includes(delimiter)) throw new Error('DELIMITER');
  const rows = []; let row = [], cell = '', quoted = false, endedQuote = false;
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (quoted) {
      if (c === '"' && source[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') { quoted = false; endedQuote = true; }
      else cell += c;
    } else if (c === '"' && !cell && !endedQuote) quoted = true;
    else if (c === delimiter) { row.push(cell); cell = ''; endedQuote = false; }
    else if (c === '\r' || c === '\n') {
      row.push(cell); rows.push(row); row = []; cell = ''; endedQuote = false;
      if (c === '\r' && source[i + 1] === '\n') i++;
    } else if (c === '"' || (endedQuote && c !== ' ' && c !== '\t')) throw new Error('CSV');
    else if (!endedQuote) cell += c;
  }
  if (quoted) throw new Error('CSV');
  if (row.length || cell || endedQuote) { row.push(cell); rows.push(row); }
  if (!rows.length || rows.length > 10001) throw new Error('SHAPE');
  return rows;
}

export function csvToJSON(source, delimiter = ',') {
  const rows = parseCSV(source.replace(/^\uFEFF/, ''), delimiter);
  const headers = rows.shift();
  if (headers.length > 500 || headers.some(h => !h.trim()) || new Set(headers).size !== headers.length) throw new Error('HEADERS');
  if (rows.some(row => row.length !== headers.length)) throw new Error('COLUMNS');
  return JSON.stringify(rows.map(row => Object.fromEntries(headers.map((h, i) => [h, row[i]]))), null, 2);
}

export function buildUTM(rawUrl, fields) {
  if (rawUrl.length > 2048) throw new Error('LIMIT');
  const url = new URL(rawUrl);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('URL');
  for (const [key, value] of Object.entries(fields)) {
    if (!['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].includes(key)) continue;
    if (String(value).length > 200) throw new Error('LIMIT');
    if (value) url.searchParams.set(key, String(value));
    else url.searchParams.delete(key);
  }
  if (!url.searchParams.get('utm_source') || !url.searchParams.get('utm_medium') || !url.searchParams.get('utm_campaign')) throw new Error('REQUIRED');
  return url.href;
}

export function previewData(rawUrl, title, description, image) {
  const url = new URL(rawUrl);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('URL');
  let imageUrl = '';
  if (image) {
    const parsed = new URL(image);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error('IMAGE_URL');
    imageUrl = parsed.href;
  }
  if (title.length > 300 || description.length > 1000) throw new Error('LIMIT');
  return { url: url.href, domain: url.hostname, title: title.trim() || url.hostname, description: description.trim(), image: imageUrl };
}
