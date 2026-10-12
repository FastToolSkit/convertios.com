/* Convertios Image Converter (all languages).
   Every output contains real bytes of the chosen format: JPG/PNG/WEBP from the browser encoder,
   BMP from a built-in encoder and GIF from gifenc. Each file's signature is checked before download. */
(function () {
  'use strict';
  var UI = window.ConvertiosUI;
  var GIFENC_URL = 'https://cdn.jsdelivr.net/npm/gifenc@1.0.3/dist/gifenc.esm.js';
  UI.extend({
    en: { notImage: 'Some files are not images and were skipped.', converting: 'Converting {n} of {total}…', converted: '{n} image(s) converted. Download them individually or as a ZIP.', failedOne: 'Could not convert {name}.', convertFirst: 'Convert at least one image before downloading.', download: 'Download' },
    ar: { notImage: 'بعض الملفات ليست صورًا وتم تجاوزها.', converting: 'جارٍ تحويل {n} من {total}…', converted: 'تم تحويل {n} صورة. نزّلها كل واحدة على حدة أو كملف ZIP.', failedOne: 'تعذّر تحويل {name}.', convertFirst: 'حوّل صورة واحدة على الأقل قبل التنزيل.', download: 'تنزيل' },
    es: { notImage: 'Algunos archivos no son imágenes y se omitieron.', converting: 'Convirtiendo {n} de {total}…', converted: '{n} imagen(es) convertida(s). Descárgalas por separado o en un ZIP.', failedOne: 'No se pudo convertir {name}.', convertFirst: 'Convierte al menos una imagen antes de descargar.', download: 'Descargar' }
  });
  function fmt(key, vars) {
    return UI.t(key).replace(/\{(\w+)\}/g, function (_, k) { return vars[k]; });
  }

  var dropArea = document.getElementById('drop-area');
  var fileInput = document.getElementById('upload');
  var preview = document.getElementById('preview');
  var formatSel = document.getElementById('format');
  var menuWrap = document.getElementById('downloadMenu');
  var menu = document.getElementById('menu');
  var convertBtn = document.querySelector('[onclick^="convertImage"]');
  var files = [];
  var outputs = [];
  var previewUrls = [];

  function setFiles(list) {
    var all = Array.prototype.slice.call(list || []);
    files = all.filter(function (f) { return /^image\//.test(f.type); });
    outputs = [];
    menuWrap.style.display = 'none';
    UI.clear();
    if (files.length < all.length) UI.notify(UI.t('notImage'), { type: 'info' });
    previewUrls.forEach(URL.revokeObjectURL);
    previewUrls = [];
    preview.innerHTML = '';
    files.forEach(function (f) {
      var img = document.createElement('img');
      var url = URL.createObjectURL(f);
      previewUrls.push(url);
      img.src = url;
      img.alt = f.name;
      preview.appendChild(img);
    });
  }

  function decode(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('decode')); };
      img.src = url;
    });
  }

  function draw(img, flattenWhite) {
    var c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    var ctx = c.getContext('2d');
    if (flattenWhite) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.drawImage(img, 0, 0);
    return c;
  }

  // 24-bit BMP (BITMAPINFOHEADER, bottom-up rows padded to 4 bytes).
  function encodeBmp(canvas) {
    var w = canvas.width, h = canvas.height;
    var rgba = canvas.getContext('2d').getImageData(0, 0, w, h).data;
    var rowSize = Math.ceil(w * 3 / 4) * 4;
    var size = 54 + rowSize * h;
    var buf = new ArrayBuffer(size);
    var v = new DataView(buf);
    var bytes = new Uint8Array(buf);
    v.setUint8(0, 0x42); v.setUint8(1, 0x4d);
    v.setUint32(2, size, true); v.setUint32(10, 54, true);
    v.setUint32(14, 40, true); v.setInt32(18, w, true); v.setInt32(22, h, true);
    v.setUint16(26, 1, true); v.setUint16(28, 24, true); v.setUint32(34, rowSize * h, true);
    v.setInt32(38, 2835, true); v.setInt32(42, 2835, true);
    for (var y = 0; y < h; y++) {
      var row = 54 + (h - 1 - y) * rowSize;
      for (var x = 0; x < w; x++) {
        var i = (y * w + x) * 4, o = row + x * 3;
        bytes[o] = rgba[i + 2]; bytes[o + 1] = rgba[i + 1]; bytes[o + 2] = rgba[i];
      }
    }
    return new Blob([buf], { type: 'image/bmp' });
  }

  var gifencPromise = null;
  function encodeGif(canvas) {
    gifencPromise = gifencPromise || import(GIFENC_URL);
    return gifencPromise.then(function (g) {
      var w = canvas.width, h = canvas.height;
      var rgba = canvas.getContext('2d').getImageData(0, 0, w, h).data;
      var palette = g.quantize(rgba, 256, { format: 'rgba4444', oneBitAlpha: true });
      var index = g.applyPalette(rgba, palette, 'rgba4444');
      var transparentIndex = palette.findIndex(function (c) { return c[3] === 0; });
      var gif = g.GIFEncoder();
      gif.writeFrame(index, w, h, { palette: palette, transparent: transparentIndex >= 0, transparentIndex: Math.max(0, transparentIndex) });
      gif.finish();
      return new Blob([gif.bytes()], { type: 'image/gif' });
    });
  }

  function encode(img, mime) {
    if (mime === 'image/bmp') return Promise.resolve(encodeBmp(draw(img, true)));
    if (mime === 'image/gif') return encodeGif(draw(img, false));
    var canvas = draw(img, mime === 'image/jpeg');
    return new Promise(function (resolve) { canvas.toBlob(resolve, mime, 0.92); });
  }

  function uniqueName(name, used) {
    var candidate = name, n = 2;
    while (used[candidate]) { candidate = name.replace(/(\.[a-z0-9]+)$/i, '-' + n + '$1'); n += 1; }
    used[candidate] = true;
    return candidate;
  }

  function convertImage() {
    if (!files.length) { UI.notify(UI.t('noFile')); return; }
    var mime = formatSel.value;
    var ext = UI.extensionFor(mime);
    outputs = [];
    menuWrap.style.display = 'none';
    var used = {};
    var failed = [];
    return UI.busy(convertBtn, function () {
      return files.reduce(function (chain, file, idx) {
        return chain.then(function () {
          UI.notify(fmt('converting', { n: idx + 1, total: files.length }), { type: 'info' });
          return decode(file).then(function (img) { return encode(img, mime); }).then(function (blob) {
            if (!blob) throw new Error('encode');
            return UI.verifyBlob(blob, mime).then(function (ok) {
              if (!ok) throw new Error('signature');
              outputs.push({ blob: blob, name: uniqueName(UI.safeName(file.name, ext, 'image'), used) });
            });
          }).catch(function () { failed.push(file.name); });
        });
      }, Promise.resolve()).then(function () {
        if (outputs.length) {
          menuWrap.style.display = 'block';
          UI.notify(fmt('converted', { n: outputs.length }) + (failed.length ? ' ' + fmt('failedOne', { name: failed.join(', ') }) : ''), { type: failed.length ? 'error' : 'success' });
        } else {
          UI.notify(fmt('failedOne', { name: failed.join(', ') }), { retry: true });
        }
      });
    });
  }

  function toggleMenu() {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }

  function downloadImages() {
    if (!outputs.length) { UI.notify(UI.t('convertFirst')); return; }
    outputs.forEach(function (o, i) { setTimeout(function () { UI.download(o.blob, o.name); }, i * 350); });
  }

  function downloadZip() {
    if (!outputs.length) { UI.notify(UI.t('convertFirst')); return; }
    if (!window.JSZip) { UI.notify(UI.t('generic'), { retry: true }); return; }
    var zip = new window.JSZip();
    outputs.forEach(function (o) { zip.file(o.name, o.blob); });
    return zip.generateAsync({ type: 'blob', mimeType: 'application/zip' }).then(function (content) {
      UI.download(content, 'convertios-images.zip');
    });
  }

  dropArea.addEventListener('click', function () { fileInput.click(); });
  dropArea.addEventListener('dragover', function (e) { e.preventDefault(); });
  dropArea.addEventListener('drop', function (e) { e.preventDefault(); setFiles(e.dataTransfer.files); });
  fileInput.addEventListener('change', function () { setFiles(fileInput.files); });
  menuWrap.style.display = 'none';
  window.convertImage = convertImage;
  window.toggleMenu = toggleMenu;
  window.downloadImages = downloadImages;
  window.downloadZip = downloadZip;
})();
