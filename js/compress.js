/* Convertios image compressor (all compress pages, all languages).
   Target mode: highest JPG/WEBP quality that fits the target, then gentle downscaling only if needed.
   PNG is lossless, so only downscaling can reduce it. The result message says honestly whether the
   target was reached, nearly reached, or not reachable without making the image unusably small. */
(function () {
  'use strict';
  var UI = window.ConvertiosUI;
  var MIN_QUALITY = 0.35;      // absolute floor, used only at the smallest allowed size
  var GOOD_QUALITY = 0.6;      // preferred floor: shrink dimensions a little rather than go blocky
  var MIN_SIDE = 160;          // never shrink the shorter side below this to chase a target
  UI.extend({
    en: { notImage: 'Please choose a JPG, PNG or WEBP image.', original: 'Original: {size} · {w}×{h} px', working: 'Compressing… {p}%', reached: 'Target reached: {size} (target {target} KB) · {w}×{h} px{q}.', close: 'Very close to the target: {size} (target {target} KB) · {w}×{h} px{q}.', missed: 'The {target} KB target could not be reached without making the image too small. Smallest usable result: {size} · {w}×{h} px{q}. Try a larger target or the JPG/WEBP format.', already: 'This image is already below {target} KB, so it was kept as it is ({size}).', manual: 'Compressed to {size} (was {orig}) · {w}×{h} px{q}.', bigger: 'This format made the file larger ({size}, was {orig}). Try JPG or WEBP, or a lower quality.', quality: ' · quality {q}%', download: 'Download ({size})', invalidTarget: 'Enter a target size between 1 and 50,000 KB, or leave it empty to use the quality slider.' },
    ar: { notImage: 'يُرجى اختيار صورة بصيغة JPG أو PNG أو WEBP.', original: 'الأصل: {size} · {w}×{h} بكسل', working: 'جارٍ الضغط… {p}%', reached: 'تم الوصول إلى الحجم المطلوب: {size} (المطلوب {target} كيلوبايت) · {w}×{h} بكسل{q}.', close: 'النتيجة قريبة جدًا من الحجم المطلوب: {size} (المطلوب {target} كيلوبايت) · {w}×{h} بكسل{q}.', missed: 'تعذّر الوصول إلى {target} كيلوبايت دون تصغير الصورة أكثر من اللازم. أصغر نتيجة مناسبة: {size} · {w}×{h} بكسل{q}. جرّب حجمًا مطلوبًا أكبر أو صيغة JPG/WEBP.', already: 'حجم هذه الصورة أقل من {target} كيلوبايت بالفعل، لذا تم الإبقاء عليها كما هي ({size}).', manual: 'تم الضغط إلى {size} (كان {orig}) · {w}×{h} بكسل{q}.', bigger: 'أدت هذه الصيغة إلى ملف أكبر ({size}، كان {orig}). جرّب JPG أو WEBP أو جودة أقل.', quality: ' · الجودة {q}%', download: 'تنزيل ({size})', invalidTarget: 'أدخل حجمًا مطلوبًا بين 1 و50,000 كيلوبايت، أو اتركه فارغًا لاستخدام شريط الجودة.' },
    es: { notImage: 'Elige una imagen JPG, PNG o WEBP.', original: 'Original: {size} · {w}×{h} px', working: 'Comprimiendo… {p}%', reached: 'Objetivo alcanzado: {size} (objetivo {target} KB) · {w}×{h} px{q}.', close: 'Muy cerca del objetivo: {size} (objetivo {target} KB) · {w}×{h} px{q}.', missed: 'No se pudo llegar a {target} KB sin reducir demasiado la imagen. Resultado más pequeño utilizable: {size} · {w}×{h} px{q}. Prueba con un objetivo mayor o con el formato JPG/WEBP.', already: 'Esta imagen ya pesa menos de {target} KB, así que se mantuvo tal cual ({size}).', manual: 'Comprimida a {size} (antes {orig}) · {w}×{h} px{q}.', bigger: 'Este formato hizo el archivo más grande ({size}, antes {orig}). Prueba JPG o WEBP, o una calidad menor.', quality: ' · calidad {q}%', download: 'Descargar ({size})', invalidTarget: 'Introduce un objetivo entre 1 y 50.000 KB, o déjalo vacío para usar el control de calidad.' }
  });
  function fmt(key, vars) { return UI.t(key).replace(/\{(\w+)\}/g, function (_, k) { return vars[k] == null ? '' : vars[k]; }); }
  function kb(bytes) { return (bytes / 1024 < 100 ? (Math.round(bytes / 102.4) / 10) : Math.round(bytes / 1024)) + ' KB'; }

  var $ = function (id) { return document.getElementById(id); };
  var upload = $('upload');
  var preview = $('preview');
  var targetIn = $('targetKB');
  var qualitySlider = $('quality');
  var qualityValue = $('qualityValue');
  var formatSel = $('format');
  var downloadLink = $('downloadLink');
  var progressBox = $('progressBox');
  var progressText = $('progressText');
  var runBtn = document.querySelector('[onclick^="runCompression"],[onclick^="runComprimirion"]');
  var info = document.createElement('p');
  info.className = 'compress-info';
  info.setAttribute('aria-live', 'polite');
  progressBox.insertAdjacentElement('afterend', info);

  var file = null;
  var image = null;
  var resultUrl = null;

  if (targetIn.dataset.defaultTarget && !targetIn.value) targetIn.value = targetIn.dataset.defaultTarget;
  qualitySlider.addEventListener('input', function () { qualityValue.textContent = qualitySlider.value; });

  function status(text) { progressBox.style.display = 'block'; progressText.textContent = text; }

  function load(f) {
    UI.clear();
    resetResult();
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { file = null; image = null; UI.notify(UI.t('notImage')); return; }
    var url = URL.createObjectURL(f);
    var img = new Image();
    img.onload = function () {
      file = f;
      image = img;
      preview.src = url;
      preview.alt = f.name;
      info.textContent = fmt('original', { size: kb(f.size), w: img.naturalWidth, h: img.naturalHeight });
      if (formatSel.dataset.userSet !== '1') formatSel.value = f.type === 'image/png' ? 'image/png' : f.type;
    };
    img.onerror = function () { UI.notify(UI.t('notImage')); };
    img.src = url;
  }

  function resetResult() {
    downloadLink.style.display = 'none';
    downloadLink.removeAttribute('href');
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = null;
  }

  function encode(scale, mime, quality) {
    var w = Math.max(1, Math.round(image.naturalWidth * scale));
    var h = Math.max(1, Math.round(image.naturalHeight * scale));
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    if (mime === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
    ctx.drawImage(image, 0, 0, w, h);
    return new Promise(function (resolve) {
      c.toBlob(function (blob) { resolve({ blob: blob, w: w, h: h, q: mime === 'image/png' ? null : quality, scale: scale }); }, mime, quality);
    });
  }

  // Highest quality in [MIN_QUALITY, 0.95] whose output fits `limit` bytes at this scale (binary search).
  function bestQuality(scale, mime, limit, step, floorQ) {
    var lo = floorQ, hi = 0.95, best = null, smallest = null, i = 0;
    function loop() {
      if (i >= 7) return Promise.resolve({ best: best, smallest: smallest });
      var q = i === 0 ? hi : (lo + hi) / 2;
      i += 1;
      step();
      return encode(scale, mime, q).then(function (r) {
        if (!smallest || r.blob.size < smallest.blob.size) smallest = r;
        if (r.blob.size <= limit) { best = r; if (i === 1) return { best: best, smallest: smallest }; lo = q; }
        else hi = q;
        if (hi - lo < 0.02) return { best: best, smallest: smallest };
        return loop();
      });
    }
    return encode(scale, mime, floorQ).then(function (floor) {
      smallest = floor;
      if (floor.blob.size > limit) return { best: null, smallest: floor };
      best = floor;
      return loop();
    });
  }

  function compressToTarget(targetKB, mime) {
    var limit = targetKB * 1024;
    var steps = 0;
    var step = function () { steps += 1; status(fmt('working', { p: Math.min(95, steps * 7) })); };
    var minScale = Math.min(1, MIN_SIDE / Math.min(image.naturalWidth, image.naturalHeight));
    var scale = 1;
    var smallestOverall = null;
    function attempt() {
      var run = mime === 'image/png'
        ? encode(scale, mime).then(function (r) { step(); return { best: r.blob.size <= limit ? r : null, smallest: r }; })
        : bestQuality(scale, mime, limit, step, scale <= minScale + 1e-6 ? MIN_QUALITY : GOOD_QUALITY);
      return run.then(function (res) {
        if (res.smallest && (!smallestOverall || res.smallest.blob.size < smallestOverall.blob.size)) smallestOverall = res.smallest;
        if (res.best) return { result: res.best, outcome: 'reached' };
        if (scale <= minScale + 1e-6 || steps > 80) return { result: smallestOverall, outcome: smallestOverall.blob.size <= limit * 1.1 ? 'close' : 'missed' };
        var ratio = Math.sqrt(limit / res.smallest.blob.size) * 0.95;
        scale = Math.max(minScale, scale * Math.min(0.9, Math.max(0.5, ratio)));
        return attempt();
      });
    }
    return attempt();
  }

  function finish(r, message) {
    if (!r || !r.blob || !r.blob.size) { UI.notify(UI.t('generic'), { retry: true }); return; }
    var mime = r.blob.type || formatSel.value;
    return UI.verifyBlob(r.blob, mime).then(function (ok) {
      if (!ok) { UI.notify(UI.t('generic'), { retry: true }); return; }
      resultUrl = URL.createObjectURL(r.blob);
      downloadLink.href = resultUrl;
      downloadLink.download = UI.safeName(file.name, '-compressed' + UI.extensionFor(mime), 'image');
      downloadLink.textContent = fmt('download', { size: kb(r.blob.size) });
      downloadLink.style.display = 'block';
      progressBox.style.display = 'none';
      info.textContent = message;
    });
  }

  function runCompression() {
    if (!file || !image) { UI.notify(UI.t('noFile')); return; }
    UI.clear();
    resetResult();
    var raw = String(targetIn.value || '').trim();
    var targetKB = raw === '' ? 0 : Number(raw);
    if (raw !== '' && !(targetKB >= 1 && targetKB <= 50000)) { UI.notify(UI.t('invalidTarget')); return; }
    var mime = formatSel.value;
    return UI.busy(runBtn, function () {
      status(fmt('working', { p: 0 }));
      if (!targetKB) {
        var q = Number(qualitySlider.value);
        return encode(1, mime, q).then(function (r) {
          var qText = r.q != null ? fmt('quality', { q: Math.round(r.q * 100) }) : '';
          var key = r.blob.size > file.size ? 'bigger' : 'manual';
          return finish(r, fmt(key, { size: kb(r.blob.size), orig: kb(file.size), w: r.w, h: r.h, q: qText }));
        });
      }
      if (file.size <= targetKB * 1024 && file.type === mime) {
        return finish({ blob: file, w: image.naturalWidth, h: image.naturalHeight }, fmt('already', { target: targetKB, size: kb(file.size) }));
      }
      return compressToTarget(targetKB, mime).then(function (out) {
        var r = out.result;
        var qText = r.q != null ? fmt('quality', { q: Math.round(r.q * 100) }) : '';
        return finish(r, fmt(out.outcome, { size: kb(r.blob.size), target: targetKB, w: r.w, h: r.h, q: qText }));
      });
    }).catch(function () { UI.notify(UI.t('generic'), { retry: true }); });
  }

  upload.addEventListener('change', function (e) { load(e.target.files[0]); });
  var area = document.querySelector('.upload-area');
  if (area) {
    area.addEventListener('dragover', function (e) { e.preventDefault(); });
    area.addEventListener('drop', function (e) { e.preventDefault(); load(e.dataTransfer.files[0]); });
  }
  formatSel.addEventListener('change', function () { formatSel.dataset.userSet = '1'; });
  window.runCompression = runCompression;
  window.runComprimirion = runCompression; // older Spanish markup
})();
