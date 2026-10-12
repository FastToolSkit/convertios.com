/* Convertios Meme Generator (all languages). Keeps the image's own resolution (up to 4096 px per side),
   scales text with the image, wraps long captions, and downloads JPG for JPG input or PNG otherwise. */
(function () {
  'use strict';
  var UI = window.ConvertiosUI;
  var MAX_SIDE = 4096;
  var REFERENCE_WIDTH = 800; // font-size slider values are pixels at this width
  UI.extend({
    en: { notImage: 'Please choose an image file.', loadFailed: 'This image could not be opened. Try another file.' },
    ar: { notImage: 'يُرجى اختيار ملف صورة.', loadFailed: 'تعذّر فتح هذه الصورة. جرّب ملفًا آخر.' },
    es: { notImage: 'Elige un archivo de imagen.', loadFailed: 'No se pudo abrir esta imagen. Prueba con otro archivo.' }
  });

  var canvas = document.getElementById('memeCanvas');
  var ctx = canvas.getContext('2d');
  var $ = function (id) { return document.getElementById(id); };
  var img = null;
  var file = null;

  function wrap(text, maxWidth) {
    var words = text.split(/\s+/).filter(Boolean);
    var lines = [];
    var line = '';
    words.forEach(function (w) {
      var test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function drawCaption(text, position, size) {
    if (!text) return;
    var margin = size * 0.35;
    var lines = wrap(text, canvas.width * 0.92);
    var lineHeight = size * 1.1;
    lines.forEach(function (line, i) {
      var y = position === 'top'
        ? margin + size + i * lineHeight
        : canvas.height - margin - (lines.length - 1 - i) * lineHeight;
      ctx.strokeText(line, canvas.width / 2, y);
      ctx.fillText(line, canvas.width / 2, y);
    });
  }

  function draw() {
    if (!img) return;
    var scale = canvas.width / REFERENCE_WIDTH;
    var size = Math.round(Number($('fontSize').value) * scale);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.font = 'bold ' + size + 'px Impact, "Arial Black", "Segoe UI", Tahoma, sans-serif';
    ctx.textAlign = 'center';
    ctx.lineJoin = 'round';
    ctx.fillStyle = $('textColor').value;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Number($('strokeWidth').value) * scale * 1.5;
    drawCaption($('topText').value.trim(), 'top', size);
    drawCaption($('bottomText').value.trim(), 'bottom', size);
  }

  $('upload').addEventListener('change', function () {
    UI.clear();
    var f = this.files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) { UI.notify(UI.t('notImage')); return; }
    var url = URL.createObjectURL(f);
    var image = new Image();
    image.onload = function () {
      var scale = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);
      img = image;
      file = f;
      draw();
    };
    image.onerror = function () { UI.notify(UI.t('loadFailed')); };
    image.src = url;
  });

  document.querySelectorAll('.controls input').forEach(function (el) { el.addEventListener('input', draw); });

  window.downloadMeme = function () {
    if (!img) { UI.notify(UI.t('noFile')); return; }
    draw();
    var mime = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
    canvas.toBlob(function (blob) {
      UI.download(blob, UI.safeName(file.name, '-meme' + UI.extensionFor(mime), 'meme'));
    }, mime, 0.92);
  };
})();
