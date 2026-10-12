/* Convertios Image Resizer (all languages).
   The whole image is kept unless the visitor turns on "Crop". Width/height or percentage are explicit. */
(function () {
  'use strict';
  var UI = window.ConvertiosUI;
  var MAX_SIDE = 8000;
  var MAX_PIXELS = 36000000;
  UI.extend({
    en: { original: 'Original', output: 'Output', notImage: 'Please choose an image file (JPG, PNG, WEBP, GIF or BMP).', loadFailed: 'This image could not be opened. Try another file.', invalidSize: 'Enter a width and height between 1 and 8000 pixels.', tooLarge: 'That size is too large for a browser to process safely. Use at most 8000 pixels per side and 36 megapixels in total.', ready: 'Your resized image is downloading.', pixels: 'px' },
    ar: { original: 'الأصلي', output: 'الناتج', notImage: 'يُرجى اختيار ملف صورة (JPG أو PNG أو WEBP أو GIF أو BMP).', loadFailed: 'تعذّر فتح هذه الصورة. جرّب ملفًا آخر.', invalidSize: 'أدخل عرضًا وارتفاعًا بين 1 و8000 بكسل.', tooLarge: 'هذا المقاس كبير جدًا لمعالجته بأمان في المتصفح. استخدم 8000 بكسل كحد أقصى لكل ضلع و36 ميغابكسل إجمالًا.', ready: 'يتم الآن تنزيل الصورة بعد تغيير حجمها.', pixels: 'بكسل' },
    es: { original: 'Original', output: 'Resultado', notImage: 'Elige un archivo de imagen (JPG, PNG, WEBP, GIF o BMP).', loadFailed: 'No se pudo abrir esta imagen. Prueba con otro archivo.', invalidSize: 'Introduce un ancho y un alto entre 1 y 8000 píxeles.', tooLarge: 'Ese tamaño es demasiado grande para procesarlo con seguridad en el navegador. Usa como máximo 8000 píxeles por lado y 36 megapíxeles en total.', ready: 'Tu imagen redimensionada se está descargando.', pixels: 'px' }
  });

  var $ = function (id) { return document.getElementById(id); };
  var upload = $('upload');
  var img = $('image');
  var widthIn = $('resizeWidth');
  var heightIn = $('resizeHeight');
  var percentIn = $('resizePercent');
  var lockIn = $('resizeLock');
  var cropIn = $('resizeCrop');
  var formatIn = $('resizeFormat');
  var origOut = $('resizeOriginal');
  var targetOut = $('resizeTarget');
  var controls = $('resizeControls');
  var downloadBtn = $('resizeDownload');

  var source = null;      // HTMLImageElement with the decoded original
  var file = null;
  var rotation = 0;       // 0, 90, 180, 270
  var cropper = null;
  var lastEdited = 'width';

  function baseSize() {
    if (cropper) {
      var d = cropper.getData(true);
      return { w: Math.max(1, Math.round(d.width)), h: Math.max(1, Math.round(d.height)) };
    }
    var swap = rotation % 180 !== 0;
    return { w: swap ? source.naturalHeight : source.naturalWidth, h: swap ? source.naturalWidth : source.naturalHeight };
  }

  function describe() {
    if (!source) return;
    origOut.textContent = UI.t('original') + ': ' + source.naturalWidth + ' × ' + source.naturalHeight + ' ' + UI.t('pixels');
    var w = parseInt(widthIn.value, 10), h = parseInt(heightIn.value, 10);
    targetOut.textContent = UI.t('output') + ': ' + (w > 0 ? w : '–') + ' × ' + (h > 0 ? h : '–') + ' ' + UI.t('pixels');
  }

  function applyPercent() {
    var base = baseSize();
    var p = parseFloat(percentIn.value);
    if (!(p > 0)) return describe();
    widthIn.value = Math.max(1, Math.round(base.w * p / 100));
    heightIn.value = Math.max(1, Math.round(base.h * p / 100));
    describe();
  }

  function syncFromWidth() {
    var base = baseSize();
    var w = parseInt(widthIn.value, 10);
    if (lockIn.checked && w > 0) heightIn.value = Math.max(1, Math.round(w * base.h / base.w));
    percentIn.value = w > 0 ? Math.round(w / base.w * 1000) / 10 : '';
    describe();
  }

  function syncFromHeight() {
    var base = baseSize();
    var h = parseInt(heightIn.value, 10);
    if (lockIn.checked && h > 0) widthIn.value = Math.max(1, Math.round(h * base.w / base.h));
    percentIn.value = h > 0 ? Math.round(h / base.h * 1000) / 10 : '';
    describe();
  }

  function refreshTarget() {
    // Keep the chosen percentage when the base changes (rotation or crop).
    if (!percentIn.value) percentIn.value = 100;
    applyPercent();
  }

  function setPreviewRotation() {
    img.style.transform = cropper ? '' : 'rotate(' + rotation + 'deg)';
    img.classList.toggle('is-sideways', !cropper && rotation % 180 !== 0);
  }

  function startCrop() {
    if (cropper || !window.Cropper) return;
    img.style.transform = '';
    cropper = new window.Cropper(img, {
      viewMode: 1,
      autoCropArea: 0.8,
      responsive: true,
      background: false,
      ready: function () { cropper.rotateTo(rotation); refreshTarget(); },
      cropend: refreshTarget
    });
  }

  function stopCrop() {
    if (!cropper) return;
    cropper.destroy();
    cropper = null;
    setPreviewRotation();
    refreshTarget();
  }

  function load(f) {
    UI.clear();
    if (!f) return;
    if (!/^image\//.test(f.type)) { UI.notify(UI.t('notImage')); return; }
    var url = URL.createObjectURL(f);
    var probe = new Image();
    probe.onload = function () {
      if (cropper) { cropper.destroy(); cropper = null; }
      file = f;
      source = probe;
      rotation = 0;
      cropIn.checked = false;
      img.src = url;
      img.alt = f.name;
      img.hidden = false;
      setPreviewRotation();
      controls.hidden = false;
      percentIn.value = 100;
      applyPercent();
      if (formatIn.value === 'same' && !/^image\/(jpeg|png|webp)$/.test(f.type)) formatIn.value = 'image/png';
    };
    probe.onerror = function () { UI.notify(UI.t('loadFailed')); };
    probe.src = url;
  }

  function rotate(delta) {
    if (!source) { UI.notify(UI.t('noFile')); return; }
    rotation = (rotation + delta + 360) % 360;
    if (cropper) cropper.rotateTo(rotation);
    setPreviewRotation();
    refreshTarget();
  }

  function outputMime() {
    var v = formatIn.value;
    if (v === 'same') return /^image\/(jpeg|png|webp)$/.test(file.type) ? file.type : 'image/png';
    return v;
  }

  // Draws the (rotated, optionally cropped) source at full resolution.
  function sourceCanvas() {
    if (cropper) return cropper.getCroppedCanvas({ imageSmoothingQuality: 'high' });
    var base = baseSize();
    var c = document.createElement('canvas');
    c.width = base.w;
    c.height = base.h;
    var ctx = c.getContext('2d');
    ctx.translate(base.w / 2, base.h / 2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.drawImage(source, -source.naturalWidth / 2, -source.naturalHeight / 2);
    return c;
  }

  // High-quality resize: halve repeatedly for big reductions, then one final step.
  function resizeCanvas(src, w, h) {
    var cur = src;
    while (cur.width / 2 >= w && cur.height / 2 >= h) {
      var half = document.createElement('canvas');
      half.width = Math.round(cur.width / 2);
      half.height = Math.round(cur.height / 2);
      var hc = half.getContext('2d');
      hc.imageSmoothingQuality = 'high';
      hc.drawImage(cur, 0, 0, half.width, half.height);
      cur = half;
    }
    var out = document.createElement('canvas');
    out.width = w;
    out.height = h;
    var oc = out.getContext('2d');
    oc.imageSmoothingQuality = 'high';
    oc.drawImage(cur, 0, 0, w, h);
    return out;
  }

  function download() {
    if (!source) { UI.notify(UI.t('noFile')); return; }
    var w = parseInt(widthIn.value, 10), h = parseInt(heightIn.value, 10);
    if (!(w >= 1 && h >= 1 && w <= MAX_SIDE && h <= MAX_SIDE)) { UI.notify(UI.t('invalidSize')); return; }
    if (w * h > MAX_PIXELS) { UI.notify(UI.t('tooLarge')); return; }
    UI.clear();
    var mime = outputMime();
    UI.busy(downloadBtn, function () {
      var resized = resizeCanvas(sourceCanvas(), w, h);
      if (mime === 'image/jpeg') {
        // JPG has no transparency: put transparent areas on white instead of black.
        var flat = document.createElement('canvas');
        flat.width = w; flat.height = h;
        var fc = flat.getContext('2d');
        fc.fillStyle = '#ffffff';
        fc.fillRect(0, 0, w, h);
        fc.drawImage(resized, 0, 0);
        resized = flat;
      }
      return new Promise(function (resolve) { resized.toBlob(resolve, mime, 0.92); }).then(function (blob) {
        if (!blob) throw new Error('encode failed');
        return UI.verifyBlob(blob, mime).then(function (ok) {
          if (!ok) throw new Error('wrong format');
          var name = UI.safeName(file.name, '-' + w + 'x' + h + UI.extensionFor(mime), 'image');
          if (UI.download(blob, name)) UI.notify(UI.t('ready'), { type: 'success' });
        });
      }).catch(function () { UI.notify(UI.t('generic'), { retry: download }); });
    });
  }

  upload.addEventListener('change', function () { load(this.files[0]); });
  widthIn.addEventListener('input', function () { lastEdited = 'width'; syncFromWidth(); });
  heightIn.addEventListener('input', function () { lastEdited = 'height'; syncFromHeight(); });
  percentIn.addEventListener('input', applyPercent);
  lockIn.addEventListener('change', function () { if (lockIn.checked) (lastEdited === 'height' ? syncFromHeight : syncFromWidth)(); });
  cropIn.addEventListener('change', function () { if (!source) { cropIn.checked = false; return; } if (cropIn.checked) startCrop(); else stopCrop(); });
  $('resizeRotateLeft').addEventListener('click', function () { rotate(-90); });
  $('resizeRotateRight').addEventListener('click', function () { rotate(90); });
  downloadBtn.addEventListener('click', download);
  window.downloadImage = download;
})();
