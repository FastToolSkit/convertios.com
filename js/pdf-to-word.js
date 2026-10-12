/* Convertios PDF to Word (all languages): sends the PDF to the Convertios server and returns a DOCX. */
(function () {
  'use strict';
  var UI = window.ConvertiosUI;
  var MAX_BYTES = 25 * 1024 * 1024;
  UI.extend({
    en: { notPdf: 'Please choose a PDF file.', tooBig: 'This PDF is larger than 25 MB. Please choose a smaller file.', ready: 'Ready to convert. The PDF is processed on the Convertios server and deleted right after conversion.', uploading: 'Uploading and converting… larger PDFs can take up to a minute.', size: 'Size', done: 'Conversion complete. Your Word file is downloading.', download: 'Download Word file' },
    ar: { notPdf: 'يُرجى اختيار ملف PDF.', tooBig: 'حجم ملف PDF هذا أكبر من 25 ميغابايت. يُرجى اختيار ملف أصغر.', ready: 'جاهز للتحويل. تتم معالجة ملف PDF على خادم Convertios ويُحذف مباشرة بعد التحويل.', uploading: 'جارٍ الرفع والتحويل… قد تستغرق ملفات PDF الكبيرة ما يصل إلى دقيقة.', size: 'الحجم', done: 'اكتمل التحويل. يتم الآن تنزيل ملف Word.', download: 'تنزيل ملف Word' },
    es: { notPdf: 'Elige un archivo PDF.', tooBig: 'Este PDF supera los 25 MB. Elige un archivo más pequeño.', ready: 'Listo para convertir. El PDF se procesa en el servidor de Convertios y se elimina justo después de la conversión.', uploading: 'Subiendo y convirtiendo… los PDF grandes pueden tardar hasta un minuto.', size: 'Tamaño', done: 'Conversión completada. Tu archivo de Word se está descargando.', download: 'Descargar archivo de Word' }
  });

  var fileInput = document.getElementById('upload');
  var dropArea = document.getElementById('drop-area');
  var preview = document.getElementById('preview');
  var status = document.getElementById('status');
  var progressBar = document.getElementById('progress-bar');
  var downloads = document.getElementById('downloads');
  var convertBtn = document.querySelector('.convert-btn');
  var file = null;
  var resultUrl = null;

  function setFile(f) {
    UI.clear();
    downloads.textContent = '';
    progressBar.style.width = '0%';
    file = null;
    convertBtn.disabled = true;
    preview.textContent = '';
    if (!f) return;
    var isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
    if (!isPdf) { UI.notify(UI.t('notPdf')); return; }
    if (f.size > MAX_BYTES) { UI.notify(UI.t('tooBig')); return; }
    file = f;
    preview.textContent = '📄 ' + f.name + ' · ' + UI.t('size') + ': ' + (f.size / 1024 / 1024).toFixed(2) + ' MB';
    status.textContent = UI.t('ready');
    convertBtn.disabled = false;
    UI.warmUp();
  }

  function convert() {
    if (!file) { UI.notify(UI.t('noFile')); return; }
    UI.clear();
    downloads.textContent = '';
    return UI.busy(convertBtn, function () {
      status.textContent = UI.t('uploading');
      progressBar.style.width = '25%';
      var form = new FormData();
      form.append('file', file, file.name);
      return UI.backendFetch('/convert/pdf-to-word', { method: 'POST', body: form }, { timeoutMs: 180000, onSlow: function (msg) { status.textContent = msg; progressBar.style.width = '45%'; } })
        .then(function (response) { progressBar.style.width = '85%'; return response.blob(); })
        .then(function (blob) {
          return UI.verifyBlob(blob, 'application/zip').then(function (ok) {
            if (!ok) throw Object.assign(new Error('bad docx'), { userMessage: UI.t('PROCESSING_FAILED') });
            var docx = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            var name = UI.safeName(file.name, '.docx', 'converted');
            if (resultUrl) URL.revokeObjectURL(resultUrl);
            resultUrl = URL.createObjectURL(docx);
            UI.download(docx, name);
            var a = document.createElement('a');
            a.href = resultUrl;
            a.download = name;
            a.className = 'download-btn';
            a.textContent = '⬇ ' + UI.t('download');
            downloads.appendChild(a);
            progressBar.style.width = '100%';
            status.textContent = UI.t('done');
          });
        })
        .catch(function (error) {
          progressBar.style.width = '0%';
          status.textContent = '';
          UI.notify(error.userMessage || UI.t('generic'), { retry: convert });
        });
    });
  }

  dropArea.addEventListener('click', function () { fileInput.click(); });
  dropArea.addEventListener('dragover', function (e) { e.preventDefault(); });
  dropArea.addEventListener('drop', function (e) { e.preventDefault(); setFile(e.dataTransfer.files[0]); });
  fileInput.addEventListener('change', function () { setFile(fileInput.files[0]); });
  convertBtn.addEventListener('click', convert);
  convertBtn.disabled = true;
})();
