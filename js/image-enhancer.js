/* Convertios AI Image Enhancer: uploads the image to the Convertios server (/api/enhance-image),
   which talks to the enhancement service and returns the enhanced image itself. */
(function () {
  'use strict';
  var UI = window.ConvertiosUI;
  var MAX_BYTES = 8 * 1024 * 1024;
  UI.extend({
    en: { choose: 'Please choose a JPG, PNG or WEBP image.', tooBig: 'This image is larger than 8 MB. Please choose a smaller image.', selected: 'Selected: ', ready: 'Ready to enhance.', working: 'Enhancing your image… this usually takes 10–60 seconds.', done: 'Image enhanced. Preview it below and download it.', download: 'Download enhanced image' },
    ar: { choose: 'يُرجى اختيار صورة بصيغة JPG أو PNG أو WEBP.', tooBig: 'حجم هذه الصورة أكبر من 8 ميغابايت. يُرجى اختيار صورة أصغر.', selected: 'الملف المحدد: ', ready: 'جاهز للتحسين.', working: 'جارٍ تحسين صورتك… يستغرق ذلك عادةً من 10 إلى 60 ثانية.', done: 'تم تحسين الصورة. اطّلع على المعاينة أدناه ثم نزّلها.', download: 'تنزيل الصورة المحسّنة' },
    es: { choose: 'Elige una imagen JPG, PNG o WEBP.', tooBig: 'Esta imagen supera los 8 MB. Elige una imagen más pequeña.', selected: 'Seleccionado: ', ready: 'Lista para mejorar.', working: 'Mejorando tu imagen… normalmente tarda entre 10 y 60 segundos.', done: 'Imagen mejorada. Revisa la vista previa y descárgala.', download: 'Descargar imagen mejorada' }
  });

  var fileInput = document.getElementById('fileInput');
  var dropzone = document.getElementById('dropzone');
  var fileNameEl = document.getElementById('fileName');
  var preview = document.getElementById('preview');
  var resultPreview = document.getElementById('resultPreview');
  var enhanceBtn = document.getElementById('enhanceBtn');
  var downloadBtn = document.getElementById('downloadBtn');
  var statusEl = document.getElementById('status');

  var selectedFile = null;
  var previewUrl = null;
  var resultUrl = null;
  var resultName = '';

  function setStatus(text) { statusEl.textContent = text; }

  function resetResult() {
    resultPreview.style.display = 'none';
    resultPreview.removeAttribute('src');
    downloadBtn.style.display = 'none';
    downloadBtn.removeAttribute('href');
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = null;
  }

  function handleFile(file) {
    UI.clear();
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      selectedFile = null;
      enhanceBtn.disabled = true;
      UI.notify(UI.t('choose'));
      return;
    }
    if (file.size > MAX_BYTES) {
      selectedFile = null;
      enhanceBtn.disabled = true;
      UI.notify(UI.t('tooBig'));
      return;
    }
    selectedFile = file;
    fileNameEl.textContent = UI.t('selected') + file.name;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    preview.src = previewUrl;
    preview.style.display = 'block';
    resetResult();
    setStatus(UI.t('ready'));
    enhanceBtn.disabled = false;
    UI.warmUp();
  }

  function runEnhancement() {
    if (!selectedFile) { UI.notify(UI.t('noFile')); return; }
    UI.clear();
    resetResult();
    return UI.busy(enhanceBtn, function () {
      setStatus(UI.t('working'));
      var form = new FormData();
      form.append('image', selectedFile, selectedFile.name);
      return UI.backendFetch('/api/enhance-image', { method: 'POST', body: form }, { timeoutMs: 150000, slowAfterMs: 15000, onSlow: function (msg) { setStatus(msg); } })
        .then(function (response) {
          return response.blob().then(function (blob) { return { blob: blob }; });
        })
        .then(function (out) {
          var mime = out.blob.type.split(';')[0];
          return UI.verifyBlob(out.blob, mime).then(function (valid) {
            if (!valid || !out.blob.size) throw Object.assign(new Error('invalid result'), { userMessage: UI.t('ENHANCER_UNAVAILABLE') });
            resultUrl = URL.createObjectURL(out.blob);
            // Named from the original file here, so non-Latin names (e.g. Arabic) are kept.
            resultName = UI.safeName(selectedFile.name, '-enhanced' + UI.extensionFor(mime), 'image');
            resultPreview.src = resultUrl;
            resultPreview.style.display = 'block';
            downloadBtn.href = resultUrl;
            downloadBtn.download = resultName;
            downloadBtn.textContent = UI.t('download');
            downloadBtn.style.display = 'inline-block';
            setStatus(UI.t('done'));
          });
        })
        .catch(function (error) {
          setStatus('');
          UI.notify(error.userMessage || UI.t('generic'), { retry: runEnhancement });
        });
    });
  }

  fileInput.addEventListener('change', function (e) { handleFile(e.target.files[0]); });
  ['dragenter', 'dragover'].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add('dragover'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove('dragover'); }); });
  dropzone.addEventListener('drop', function (e) { handleFile(e.dataTransfer.files[0]); });
  dropzone.addEventListener('click', function (event) { if (!event.target.closest('label')) fileInput.click(); });
  enhanceBtn.addEventListener('click', runEnhancement);
  enhanceBtn.disabled = true;
})();
