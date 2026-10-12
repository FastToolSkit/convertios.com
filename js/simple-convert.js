/* Convertios PNG→JPG, JPG→PNG and WEBP→PNG converters (all languages).
   The conversion is chosen by the page: /png-to-jpg/, /jpg-to-png/, /webp-to-png/. */
(function () {
  'use strict';
  var UI = window.ConvertiosUI;
  var CONFIG = {
    'png-to-jpg': { from: ['image/png'], to: 'image/jpeg', label: 'PNG' },
    'jpg-to-png': { from: ['image/jpeg'], to: 'image/png', label: 'JPG' },
    'webp-to-png': { from: ['image/webp'], to: 'image/png', label: 'WEBP' }
  };
  var slug = (location.pathname.match(/(png-to-jpg|jpg-to-png|webp-to-png)/) || [])[1];
  var cfg = CONFIG[slug];
  if (!cfg) return;
  UI.extend({
    en: { wrongType: 'Only {type} images can be added here. Other files were skipped.', done: '{n} image(s) converted.', download: 'Download' },
    ar: { wrongType: 'يمكن إضافة صور {type} فقط هنا. تم تجاوز الملفات الأخرى.', done: 'تم تحويل {n} صورة.', download: 'تنزيل' },
    es: { wrongType: 'Aquí solo se pueden añadir imágenes {type}. Se omitieron los demás archivos.', done: '{n} imagen(es) convertida(s).', download: 'Descargar' }
  });

  var dropArea = document.getElementById('drop-area');
  var fileInput = document.getElementById('upload');
  var preview = document.getElementById('preview');
  var downloads = document.getElementById('downloads');
  var button = document.querySelector('[onclick^="convert"]');
  var files = [];
  var urls = [];

  function setFiles(list) {
    UI.clear();
    var all = Array.prototype.slice.call(list || []);
    files = all.filter(function (f) { return cfg.from.indexOf(f.type) !== -1; });
    if (files.length < all.length) UI.notify(UI.t('wrongType').replace('{type}', cfg.label), { type: 'info' });
    preview.innerHTML = '';
    downloads.innerHTML = '';
    urls.forEach(URL.revokeObjectURL);
    urls = [];
    files.forEach(function (f) {
      var img = document.createElement('img');
      var u = URL.createObjectURL(f);
      urls.push(u);
      img.src = u;
      img.alt = f.name;
      preview.appendChild(img);
    });
  }

  function convertOne(file) {
    return new Promise(function (resolve, reject) {
      var src = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        var ctx = c.getContext('2d');
        if (cfg.to === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height); }
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(src);
        c.toBlob(function (blob) { blob ? resolve(blob) : reject(new Error('encode')); }, cfg.to, 0.92);
      };
      img.onerror = function () { URL.revokeObjectURL(src); reject(new Error('decode')); };
      img.src = src;
    });
  }

  function convert() {
    if (!files.length) { UI.notify(UI.t('noFile')); return; }
    UI.clear();
    downloads.innerHTML = '';
    var ext = UI.extensionFor(cfg.to);
    var done = 0;
    return UI.busy(button, function () {
      return files.reduce(function (chain, file) {
        return chain.then(function () { return convertOne(file); }).then(function (blob) {
          return UI.verifyBlob(blob, cfg.to).then(function (ok) {
            if (!ok) throw new Error('format');
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = UI.safeName(file.name, ext, 'image');
            a.textContent = UI.t('download') + ': ' + a.download;
            a.className = 'download-link';
            downloads.appendChild(a);
            done += 1;
          });
        }).catch(function () { UI.notify(UI.t('generic') + ' (' + file.name + ')', { retry: true }); });
      }, Promise.resolve()).then(function () {
        if (done) UI.notify(UI.t('done').replace('{n}', done), { type: 'success' });
      });
    });
  }

  dropArea.addEventListener('click', function (e) { if (e.target !== fileInput) fileInput.click(); });
  dropArea.addEventListener('dragover', function (e) { e.preventDefault(); });
  dropArea.addEventListener('drop', function (e) { e.preventDefault(); setFiles(e.dataTransfer.files); });
  fileInput.addEventListener('change', function () { setFiles(fileInput.files); });
  window.convert = convert;
})();
