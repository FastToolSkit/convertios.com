/* Convertios QR Code Generator (all languages).
   Uses qrcode-generator 2.0.4 (MIT, self-hosted) with UTF-8 encoding. Renders from the QR module matrix: crisp 1024 px PNG with a proper quiet zone, plus scalable SVG. */
(function () {
  'use strict';
  var UI = window.ConvertiosUI;
  var QUIET = 4;          // modules of white border required by the QR specification
  var PNG_SIZE = 1024;
  UI.extend({
    en: { enterText: 'Enter a link or some text to turn into a QR code.', tooLong: 'This text is too long for one QR code. Shorten it (for long links, try the Link Shortener first).', svg: 'Download SVG (for print)' },
    ar: { enterText: 'أدخل رابطًا أو نصًا لتحويله إلى رمز QR.', tooLong: 'هذا النص طويل جدًا لرمز QR واحد. اختصره (للروابط الطويلة جرّب أداة اختصار الروابط أولًا).', svg: 'تنزيل SVG (للطباعة)' },
    es: { enterText: 'Introduce un enlace o un texto para convertirlo en código QR.', tooLong: 'Este texto es demasiado largo para un solo código QR. Acórtalo (para enlaces largos, prueba antes el Acortador de enlaces).', svg: 'Descargar SVG (para imprimir)' }
  });

  var input = document.getElementById('text');
  var holder = document.getElementById('qrcode');
  var downloadBtn = document.getElementById('downloadBtn');
  var svgBtn = document.createElement('button');
  svgBtn.type = 'button';
  svgBtn.id = 'downloadSvgBtn';
  svgBtn.textContent = UI.t('svg');
  downloadBtn.insertAdjacentElement('afterend', svgBtn);
  var matrix = null;

  function setButtons(on) {
    downloadBtn.style.display = on ? 'inline-block' : 'none';
    svgBtn.style.display = on ? 'inline-block' : 'none';
  }

  function generateQR() {
    var text = (input.value || '').trim();
    UI.clear();
    matrix = null;
    holder.innerHTML = '';
    setButtons(false);
    if (!text) { UI.notify(UI.t('enterText')); input.focus(); return; }
    if (!window.qrcode) { UI.notify(UI.t('generic'), { retry: true }); return; }
    try {
      window.qrcode.stringToBytes = window.qrcode.stringToBytesFuncs['UTF-8'];
      var qr = window.qrcode(0, 'M');
      qr.addData(text, 'Byte');
      qr.make();
      var n = qr.getModuleCount();
      matrix = [];
      for (var r = 0; r < n; r++) {
        var row = [];
        for (var c = 0; c < n; c++) row.push(qr.isDark(r, c));
        matrix.push(row);
      }
      var preview = drawCanvas(Math.max(2, Math.floor(256 / (n + QUIET * 2))));
      preview.setAttribute('role', 'img');
      preview.setAttribute('aria-label', text.slice(0, 80));
      holder.appendChild(preview);
      setButtons(true);
    } catch (e) {
      matrix = null;
      holder.innerHTML = '';
      UI.notify(UI.t('tooLong'));
    }
  }

  function drawCanvas(scale) {
    var n = matrix.length;
    var total = n + QUIET * 2;
    var c = document.createElement('canvas');
    c.width = c.height = total * scale;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#000000';
    for (var r = 0; r < n; r++) for (var col = 0; col < n; col++) if (matrix[r][col]) ctx.fillRect((col + QUIET) * scale, (r + QUIET) * scale, scale, scale);
    return c;
  }

  function renderPng() {
    var c = drawCanvas(Math.max(4, Math.ceil(PNG_SIZE / (matrix.length + QUIET * 2))));
    return new Promise(function (resolve) { c.toBlob(resolve, 'image/png'); });
  }

  function renderSvg() {
    var n = matrix.length;
    var total = n + QUIET * 2;
    var path = '';
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (matrix[r][c]) path += 'M' + (c + QUIET) + ' ' + (r + QUIET) + 'h1v1h-1z';
    var svg = '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + total + ' ' + total + '" width="1024" height="1024" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path fill="#000" d="' + path + '"/></svg>\n';
    return new Blob([svg], { type: 'image/svg+xml' });
  }

  function downloadQR() {
    if (!matrix) { UI.notify(UI.t('enterText')); return; }
    renderPng().then(function (blob) { UI.download(blob, 'convertios-qr.png'); });
  }

  function downloadSvg() {
    if (!matrix) { UI.notify(UI.t('enterText')); return; }
    UI.download(renderSvg(), 'convertios-qr.svg');
  }

  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); generateQR(); } });
  svgBtn.addEventListener('click', downloadSvg);
  setButtons(false);
  window.generateQR = generateQR;
  window.downloadQR = downloadQR;
})();
