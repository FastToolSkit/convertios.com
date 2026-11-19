const MAX_FILES = 20;
const MAX_BYTES = 25 * 1024 * 1024;
const BLOCKED = /\.(?:exe|dll|msi|bat|cmd|com|scr|ps1|vbs|js|jar|sh|app|dmg|apk|ipa|deb|rpm)$/i;
const RESERVED = /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i;
const encoder = new TextEncoder();

export function planRename(files, {find = '', replace = '', letterCase = 'keep', sequence = false, start = 1, pad = 2} = {}) {
  if (!files.length || files.length > MAX_FILES || files.some(f => !f.size || f.size > MAX_BYTES) || files.reduce((n, f) => n + f.size, 0) > MAX_BYTES) throw new Error('LIMIT');
  if (find.length > 100 || replace.length > 100 || !['keep','lower','upper'].includes(letterCase) || !Number.isInteger(start) || start < 0 || start > 999999 || !Number.isInteger(pad) || pad < 1 || pad > 6) throw new Error('OPTIONS');
  const used = new Set();
  return files.map((file, index) => {
    const original = file.name.split(/[\\/]/).at(-1).replace(/[\x00-\x1f\x7f<>:"|?*]/g, '_').replace(/[. ]+$/g, '');
    if (!original || original === '.' || original === '..' || BLOCKED.test(original) || RESERVED.test(original)) throw new Error('FILE');
    const dot = original.lastIndexOf('.');
    let ext = dot > 0 ? original.slice(dot) : '';
    let stem = dot > 0 ? original.slice(0,dot) : original;
    if (find) stem = stem.split(find).join(replace);
    if (letterCase === 'lower') { stem = stem.toLocaleLowerCase(); ext = ext.toLocaleLowerCase(); }
    if (letterCase === 'upper') { stem = stem.toLocaleUpperCase(); ext = ext.toLocaleUpperCase(); }
    if (sequence) stem += '-' + String(start + index).padStart(pad,'0');
    stem = stem.replace(/[\\/\x00-\x1f\x7f<>:"|?*]/g, '_').replace(/^[. ]+|[. ]+$/g, '');
    if (!stem || RESERVED.test(stem + ext)) throw new Error('FILE');
    const base = stem + ext;
    let name = base, duplicate = 2;
    while (used.has(name.toLocaleLowerCase())) name = `${stem} (${duplicate++})${ext}`;
    if (encoder.encode(name).length > 200) throw new Error('FILE');
    used.add(name.toLocaleLowerCase());
    return {file, original: file.name, name};
  });
}

const crcTable = Uint32Array.from({length:256}, (_, n) => {
  for (let j=0;j<8;j++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function header(length) { return new Uint8Array(length); }
function view(bytes) { return new DataView(bytes.buffer); }
function dosDate(date) {
  const year = Math.min(2107, Math.max(1980, date.getFullYear()));
  return {time:(date.getHours()<<11)|(date.getMinutes()<<5)|(date.getSeconds()>>1), date:((year-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate()};
}

// ZIP store format: no compression or external library; file data is untouched.
export async function zipRenamed(plan) {
  if (!plan.length || plan.length > MAX_FILES || plan.reduce((n, p) => n + p.file.size, 0) > MAX_BYTES) throw new Error('LIMIT');
  const parts = [], central = [];
  let offset = 0, centralSize = 0;
  for (const entry of plan) {
    const name = encoder.encode(entry.name);
    const data = new Uint8Array(await entry.file.arrayBuffer());
    const crc = crc32(data);
    const stamp = dosDate(new Date(entry.file.lastModified || Date.now()));
    const local = header(30), lv = view(local);
    lv.setUint32(0,0x04034b50,true); lv.setUint16(4,20,true); lv.setUint16(6,0x800,true);
    lv.setUint16(10,stamp.time,true); lv.setUint16(12,stamp.date,true); lv.setUint32(14,crc,true);
    lv.setUint32(18,data.length,true); lv.setUint32(22,data.length,true); lv.setUint16(26,name.length,true);
    parts.push(local,name,data);
    const record = header(46), rv = view(record);
    rv.setUint32(0,0x02014b50,true); rv.setUint16(4,20,true); rv.setUint16(6,20,true);
    rv.setUint16(8,0x800,true); rv.setUint16(12,stamp.time,true); rv.setUint16(14,stamp.date,true);
    rv.setUint32(16,crc,true); rv.setUint32(20,data.length,true); rv.setUint32(24,data.length,true);
    rv.setUint16(28,name.length,true); rv.setUint32(42,offset,true);
    central.push(record,name); centralSize += record.length + name.length;
    offset += local.length + name.length + data.length;
  }
  const end = header(22), ev = view(end);
  ev.setUint32(0,0x06054b50,true); ev.setUint16(8,plan.length,true); ev.setUint16(10,plan.length,true);
  ev.setUint32(12,centralSize,true); ev.setUint32(16,offset,true);
  return new Blob([...parts,...central,end], {type:'application/zip'});
}
