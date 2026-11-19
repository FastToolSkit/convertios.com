// User files are decoded only after probing their dimensions and format.
const fail = code => { throw new Error(code); };
const pixels = (w, h) => {
  if (!Number.isFinite(w * h) || w < 1 || h < 1 || w > 16384 || h > 16384 || w*h > 16000000) fail('LIMIT');
};

function inspectPhoto(bytes) {
  const view = new DataView(bytes.buffer);
  if (bytes.length >= 33 && view.getUint32(0) === 0x89504e47 && view.getUint32(4) === 0x0d0a1a0a) {
    if (view.getUint32(12) !== 0x49484452) fail('INVALID_FILE');
    pixels(view.getUint32(16), view.getUint32(20));
    for (let at = 8; at + 12 <= bytes.length;) {
      const size = view.getUint32(at), type = view.getUint32(at + 4);
      if (at + 12 + size > bytes.length) fail('INVALID_FILE');
      if (type === 0x6163544c) fail('ANIMATED');
      if (type === 0x49454e44 && size === 0) return 'image/png';
      at += 12 + size;
    }
  } else if (view.byteLength >= 4 && view.getUint16(0) === 0xffd8 && view.getUint16(bytes.length-2) === 0xffd9) {
    for (let at = 2; at + 9 <= bytes.length;) {
      if (bytes[at++] !== 255) break;
      while (bytes[at] === 255) at++;
      const marker = bytes[at++], size = view.getUint16(at);
      if (size < 2 || at + size > bytes.length) break;
      if ([0xc0, 0xc1, 0xc2].includes(marker) && size >= 8) {
        pixels(view.getUint16(at + 5), view.getUint16(at + 3));
        return 'image/jpeg';
      }
      at += size;
    }
  }
  fail('INVALID_FILE');
}

const svgElements = new Set('svg g path line circle ellipse rect polygon polyline defs linearGradient radialGradient stop title desc'.split(' '));
const svgAttributes = new Set(('xmlns version id width height viewBox preserveAspectRatio d points x y x1 y1 x2 y2 cx cy r rx ry fx fy ' +
  'fill stroke fill-rule stroke-width stroke-linejoin stroke-linecap stroke-dasharray stroke-dashoffset fill-opacity stroke-opacity ' +
  'opacity transform gradientTransform gradientUnits spreadMethod offset stop-color stop-opacity').split(' '));

function prepareSvg(text, width) {
  if (/<!DOCTYPE|<!ENTITY|<\?(?!xml\s)/i.test(text)) fail('UNSAFE_SVG');
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const root = doc.documentElement;
  const ns = 'http://www.w3.org/2000/svg';
  if (root.localName !== 'svg' || root.namespaceURI !== ns || doc.querySelector('parsererror')) fail('INVALID_FILE');
  const elements = doc.getElementsByTagName('*');
  if (elements.length > 3000) fail('LIMIT');
  for (const el of elements) {
    if (el.namespaceURI !== ns || !svgElements.has(el.localName) || (el !== root && el.localName === 'svg')) fail('UNSAFE_SVG');
    for (const {name, value} of el.attributes) {
      if (!svgAttributes.has(name) || /[\\<>@;]/.test(value)) fail('UNSAFE_SVG');
      if (name === 'xmlns' && value === ns) continue;
      if (/url\s*\(/i.test(value) && !/^url\(#[A-Za-z_][\w.-]*\)$/.test(value)) fail('UNSAFE_SVG');
      if (/[/:]/.test(value)) fail('UNSAFE_SVG');
    }
  }
  const box = (root.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
  const size = key => Number((root.getAttribute(key) || '').replace(/px$/, ''));
  const [w, h] = box.length === 4 && box.every(Number.isFinite) ? box.slice(2) : [size('width'), size('height')];
  if (!(w > 0 && h > 0)) fail('INVALID_FILE');
  if (!root.hasAttribute('viewBox')) root.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
  const height = Math.max(1, Math.round(width*h/w));
  pixels(width, height);
  root.setAttribute('width', width);
  root.setAttribute('height', height);
  return new Blob([new XMLSerializer().serializeToString(root)], {type:'image/svg+xml'});
}

export async function raster(tool, file, options) {
  const svg = tool === 'svg-to-png';
  const input = svg ? prepareSvg(await file.text(), Number(options.width)) :
    file.slice(0, file.size, inspectPhoto(new Uint8Array(await file.arrayBuffer())));
  const url = URL.createObjectURL(input);
  const img = new Image();
  const canvas = document.createElement('canvas');
  try {
    img.src = url;
    await img.decode();
    pixels(img.naturalWidth, img.naturalHeight);
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (svg && options.background === 'white') {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob || !blob.size) fail('INVALID_FILE');
    return blob;
  } finally {
    URL.revokeObjectURL(url);
    canvas.width = canvas.height = 0;
  }
}
