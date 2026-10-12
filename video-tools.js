/* Convertios Video to MP3 and Video Converter (all languages). Uses the Convertios server. */
(function () {
  'use strict';
  var root = document.body;
  var mode = root.dataset.videoMode;
  if (!mode) return;
  var UI = window.ConvertiosUI;
  var MAX_BYTES = 50 * 1024 * 1024;
  var ALLOWED = /\.(mp4|mov|webm|mkv|avi|m4v|mpeg|mpg|3gp|ogv|flv|wmv|ts)$/i;
  UI.extend({
    en: { tooLarge: 'The file is larger than 50 MB. Please choose a smaller video.', badType: 'This file type is not supported. Choose MP4, MOV, WEBM, MKV, AVI, M4V, MPEG, MPG, 3GP, OGV, FLV, WMV or TS.', working: 'Uploading and converting… larger videos can take several minutes. Keep this page open.', successMp3: 'MP3 created. Your download has started.', successVideo: 'Video converted. Your download has started.' },
    ar: { tooLarge: 'حجم الملف أكبر من 50 ميغابايت. يُرجى اختيار فيديو أصغر.', badType: 'نوع هذا الملف غير مدعوم. اختر MP4 أو MOV أو WEBM أو MKV أو AVI أو M4V أو MPEG أو MPG أو 3GP أو OGV أو FLV أو WMV أو TS.', working: 'جارٍ رفع الفيديو وتحويله… قد تستغرق الملفات الكبيرة عدة دقائق. أبقِ هذه الصفحة مفتوحة.', successMp3: 'تم إنشاء ملف MP3 وبدأ التنزيل.', successVideo: 'تم تحويل الفيديو وبدأ التنزيل.' },
    es: { tooLarge: 'El archivo supera los 50 MB. Elige un vídeo más pequeño.', badType: 'Este tipo de archivo no es compatible. Elige MP4, MOV, WEBM, MKV, AVI, M4V, MPEG, MPG, 3GP, OGV, FLV, WMV o TS.', working: 'Subiendo y convirtiendo… los vídeos grandes pueden tardar varios minutos. Mantén esta página abierta.', successMp3: 'MP3 creado. La descarga ha comenzado.', successVideo: 'Vídeo convertido. La descarga ha comenzado.' }
  });
  var formats = [['mp4', 'MP4'], ['webm', 'WEBM'], ['mov', 'MOV'], ['mkv', 'MKV'], ['avi', 'AVI'], ['m4v', 'M4V'], ['mpg', 'MPG'], ['mpeg', 'MPEG'], ['flv', 'FLV'], ['wmv', 'WMV'], ['3gp', '3GP'], ['ogv', 'OGV'], ['ts', 'TS']];
  var file = document.getElementById('videoFile');
  var button = document.getElementById('videoConvert');
  var status = document.getElementById('videoStatus');
  var note = document.getElementById('videoFileNote');
  var dropzone = document.getElementById('videoDropzone');
  var progress = document.getElementById('videoProgress');
  var format = document.getElementById('videoFormat');
  var chosen = null;

  if (format && !format.options.length) formats.forEach(function (f) { format.add(new Option(f[1], f[0])); });
  progress.style.display = 'none';

  function select(f) {
    UI.clear();
    chosen = null;
    button.disabled = true;
    status.textContent = '';
    if (!f) return;
    if (!ALLOWED.test(f.name)) { UI.notify(UI.t('badType')); file.value = ''; return; }
    if (f.size > MAX_BYTES) { UI.notify(UI.t('tooLarge')); file.value = ''; return; }
    chosen = f;
    note.textContent = f.name + ' · ' + (f.size / 1048576).toFixed(1) + ' MB';
    button.disabled = false;
    UI.warmUp();
  }

  function convert() {
    if (!chosen) { UI.notify(UI.t('noFile')); return; }
    UI.clear();
    return UI.busy(button, function () {
      progress.style.display = 'block';
      status.textContent = UI.t('working');
      var data = new FormData();
      data.append('file', chosen, chosen.name);
      if (mode === 'video') data.append('format', format.value);
      var endpoint = mode === 'mp3' ? '/convert/video-to-mp3' : '/convert/video';
      var extension = mode === 'mp3' ? '.mp3' : '.' + format.value;
      return UI.backendFetch(endpoint, { method: 'POST', body: data }, { timeoutMs: 330000, slowAfterMs: 10000, onSlow: function (msg) { status.textContent = UI.t('working') + ' ' + msg; } })
        .then(function (response) { return response.blob(); })
        .then(function (blob) {
          if (!blob.size) throw Object.assign(new Error('empty'), { userMessage: UI.t('PROCESSING_FAILED') });
          UI.download(blob, UI.safeName(chosen.name, extension, mode === 'mp3' ? 'audio' : 'video'));
          status.textContent = mode === 'mp3' ? UI.t('successMp3') : UI.t('successVideo');
        })
        .catch(function (error) {
          status.textContent = '';
          UI.notify(error.userMessage || UI.t('generic'), { retry: convert });
        })
        .finally(function () { progress.style.display = 'none'; });
    });
  }

  file.addEventListener('change', function () { select(file.files[0]); });
  ['dragenter', 'dragover'].forEach(function (name) { dropzone.addEventListener(name, function (e) { e.preventDefault(); dropzone.classList.add('is-dragging'); }); });
  ['dragleave', 'drop'].forEach(function (name) { dropzone.addEventListener(name, function (e) { e.preventDefault(); dropzone.classList.remove('is-dragging'); }); });
  dropzone.addEventListener('drop', function (e) { select(e.dataTransfer.files[0]); });
  button.addEventListener('click', convert);
  UI.warmUp();
})();
