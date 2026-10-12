/* Convertios JPG/PNG to PDF (all languages). Uses pdf-lib in the browser.
   Respects the EXIF rotation of phone photos and never creates a PDF without pages. */
(function () {
  'use strict';
  var UI = window.ConvertiosUI;
  var A4 = [595.28, 841.89];
  UI.extend({
    en: { skipped: 'Only JPG and PNG images can be added. Other files were skipped.', noneSelected: 'Select at least one image to include in the PDF.', include: 'Include', remove: 'Remove', making: 'Creating PDF…', done: 'PDF ready: {n} page(s).', download: 'Download PDF', pageSize: 'Page size', fit: 'Same as image', a4: 'A4' },
    ar: { skipped: 'يمكن إضافة صور JPG وPNG فقط. تم تجاوز الملفات الأخرى.', noneSelected: 'اختر صورة واحدة على الأقل لإضافتها إلى ملف PDF.', include: 'تضمين', remove: 'إزالة', making: 'جارٍ إنشاء ملف PDF…', done: 'ملف PDF جاهز: {n} صفحة.', download: 'تنزيل PDF', pageSize: 'حجم الصفحة', fit: 'بحجم الصورة', a4: 'A4' },
    es: { skipped: 'Solo se pueden añadir imágenes JPG y PNG. Se omitieron los demás archivos.', noneSelected: 'Selecciona al menos una imagen para incluir en el PDF.', include: 'Incluir', remove: 'Quitar', making: 'Creando PDF…', done: 'PDF listo: {n} página(s).', download: 'Descargar PDF', pageSize: 'Tamaño de página', fit: 'Igual que la imagen', a4: 'A4' }
  });

  var dropArea = document.getElementById('drop-area');
  var fileInput = document.getElementById('file-input');
  var preview = document.getElementById('preview');
  var link = document.getElementById('downloadLink');
  var createBtn = document.querySelector('[onclick^="createPDF"]');
  var items = [];
  var resultUrl = null;

  fileInput.setAttribute('accept', 'image/jpeg,image/png');
  var sizeWrap = document.createElement('label');
  sizeWrap.className = 'pdf-page-size';
  sizeWrap.textContent = UI.t('pageSize') + ' ';
  var sizeSel = document.createElement('select');
  sizeSel.id = 'pageSize';
  sizeSel.innerHTML = '<option value="fit">' + UI.t('fit') + '</option><option value="a4">' + UI.t('a4') + '</option>';
  sizeWrap.appendChild(sizeSel);
  preview.insertAdjacentElement('afterend', sizeWrap);

  // EXIF orientation (1-8) of a JPEG, or 1 when absent.
  function exifOrientation(bytes) {
    var v = new DataView(bytes);
    if (v.byteLength < 4 || v.getUint16(0) !== 0xffd8) return 1;
    var offset = 2;
    while (offset + 4 < v.byteLength) {
      var marker = v.getUint16(offset);
      var size = v.getUint16(offset + 2);
      if (marker === 0xffe1 && v.getUint32(offset + 4) === 0x45786966) {
        var tiff = offset + 10;
        var little = v.getUint16(tiff) === 0x4949;
        var ifd = tiff + v.getUint32(tiff + 4, little);
        var entries = v.getUint16(ifd, little);
        for (var i = 0; i < entries; i++) {
          var e = ifd + 2 + i * 12;
          if (v.getUint16(e, little) === 0x0112) return v.getUint16(e + 8, little);
        }
        return 1;
      }
      if ((marker & 0xff00) !== 0xff00) break;
      offset += 2 + size;
    }
    return 1;
  }

  function addFiles(list) {
    UI.clear();
    var all = Array.prototype.slice.call(list || []);
    var ok = all.filter(function (f) { return f.type === 'image/jpeg' || f.type === 'image/png'; });
    if (ok.length < all.length) UI.notify(UI.t('skipped'), { type: 'info' });
    ok.forEach(function (file) {
      var url = URL.createObjectURL(file);
      var div = document.createElement('div');
      div.className = 'preview-item';
      var img = document.createElement('img');
      img.src = url;
      img.alt = file.name;
      var label = document.createElement('label');
      var box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = true;
      label.appendChild(box);
      label.appendChild(document.createTextNode(' ' + UI.t('include')));
      div.appendChild(img);
      div.appendChild(label);
      preview.appendChild(div);
      items.push({ file: file, box: box });
    });
  }

  function imageBytesFor(file) {
    return file.arrayBuffer().then(function (bytes) {
      if (file.type === 'image/png') return { kind: 'png', bytes: bytes };
      if (exifOrientation(bytes) === 1) return { kind: 'jpg', bytes: bytes };
      // Rotated phone photo: let the browser apply the EXIF rotation, then re-encode.
      return createImageBitmap(file, { imageOrientation: 'from-image' }).then(function (bitmap) {
        var c = document.createElement('canvas');
        c.width = bitmap.width; c.height = bitmap.height;
        c.getContext('2d').drawImage(bitmap, 0, 0);
        return new Promise(function (resolve) { c.toBlob(resolve, 'image/jpeg', 0.95); });
      }).then(function (blob) { return blob.arrayBuffer(); }).then(function (b) { return { kind: 'jpg', bytes: b }; });
    });
  }

  function createPDF() {
    if (!items.length) { UI.notify(UI.t('noFile')); return; }
    var chosen = items.filter(function (i) { return i.box.checked; });
    if (!chosen.length) { UI.notify(UI.t('noneSelected')); return; }
    if (!window.PDFLib) { UI.notify(UI.t('generic'), { retry: true }); return; }
    UI.clear();
    return UI.busy(createBtn, function () {
      UI.notify(UI.t('making'), { type: 'info' });
      return window.PDFLib.PDFDocument.create().then(function (doc) {
        return chosen.reduce(function (chain, item) {
          return chain.then(function () { return imageBytesFor(item.file); }).then(function (data) {
            return data.kind === 'png' ? doc.embedPng(data.bytes) : doc.embedJpg(data.bytes);
          }).then(function (image) {
            var w = image.width, h = image.height;
            if (sizeSel.value === 'a4') {
              var page = doc.addPage(w > h ? [A4[1], A4[0]] : A4);
              var margin = 24;
              var s = Math.min((page.getWidth() - margin * 2) / w, (page.getHeight() - margin * 2) / h);
              page.drawImage(image, { x: (page.getWidth() - w * s) / 2, y: (page.getHeight() - h * s) / 2, width: w * s, height: h * s });
            } else {
              doc.addPage([w, h]).drawImage(image, { x: 0, y: 0, width: w, height: h });
            }
          });
        }, Promise.resolve()).then(function () { return doc.save(); });
      }).then(function (bytes) {
        var blob = new Blob([bytes], { type: 'application/pdf' });
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        resultUrl = URL.createObjectURL(blob);
        link.href = resultUrl;
        link.download = chosen.length === 1 ? UI.safeName(chosen[0].file.name, '.pdf', 'images') : 'convertios-images.pdf';
        link.textContent = UI.t('download');
        link.className = 'main-button';
        UI.notify(UI.t('done').replace('{n}', chosen.length), { type: 'success' });
      }).catch(function () { UI.notify(UI.t('generic'), { retry: true }); });
    });
  }

  dropArea.addEventListener('click', function () { fileInput.click(); });
  dropArea.addEventListener('dragover', function (e) { e.preventDefault(); });
  dropArea.addEventListener('drop', function (e) { e.preventDefault(); addFiles(e.dataTransfer.files); });
  fileInput.addEventListener('change', function () { addFiles(fileInput.files); fileInput.value = ''; });
  window.createPDF = createPDF;
})();
