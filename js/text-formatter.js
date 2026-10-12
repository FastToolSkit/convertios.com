/* Convertios Text Formatter (all languages). Unicode-aware: accented letters, Arabic, numbers,
   punctuation and line breaks are preserved. */
(function () {
  'use strict';
  var UI = window.ConvertiosUI;
  UI.extend({
    en: { empty: 'Type or paste some text first.', copied: 'Copied!', copyFailed: 'Copy failed. Select the text and copy it manually.' },
    ar: { empty: 'اكتب نصًا أو الصقه أولًا.', copied: 'تم النسخ!', copyFailed: 'تعذّر النسخ. حدّد النص وانسخه يدويًا.' },
    es: { empty: 'Primero escribe o pega un texto.', copied: '¡Copiado!', copyFailed: 'No se pudo copiar. Selecciona el texto y cópialo manualmente.' }
  });
  var box = document.getElementById('text');

  function apply(transform) {
    if (!box.value) { UI.notify(UI.t('empty')); box.focus(); return; }
    UI.clear();
    box.value = transform(box.value);
  }

  // A "word" is a run of letters, combining marks, digits and in-word apostrophes.
  var WORD = /[\p{L}\p{M}\p{N}]+(?:['’][\p{L}\p{M}\p{N}]+)*/gu;

  window.toUpper = function () { apply(function (t) { return t.toUpperCase(); }); };
  window.toLower = function () { apply(function (t) { return t.toLowerCase(); }); };
  window.capitalize = function () {
    apply(function (t) {
      return t.replace(WORD, function (word) {
        var chars = Array.from(word.toLowerCase());
        chars[0] = chars[0].toUpperCase();
        return chars.join('');
      });
    });
  };
  // Collapses repeated spaces and tabs, trims each line, and keeps line breaks (max one empty line in a row).
  window.removeSpaces = function () {
    apply(function (t) {
      return t.replace(/\r\n?/g, '\n')
        .split('\n').map(function (line) { return line.replace(/[^\S\n]+/g, ' ').trim(); }).join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
    });
  };
  window.copyText = function () {
    if (!box.value) { UI.notify(UI.t('empty')); return; }
    var btn = document.querySelector('[onclick^="copyText"]');
    var label = btn ? btn.textContent : '';
    var done = function () { if (btn) { btn.textContent = UI.t('copied'); setTimeout(function () { btn.textContent = label; }, 1500); } };
    var fallback = function () {
      box.select();
      try { if (document.execCommand('copy')) return done(); } catch (e) { /* ignore */ }
      UI.notify(UI.t('copyFailed'));
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(box.value).then(done, fallback);
    else fallback();
  };
  window.clearText = function () { box.value = ''; UI.clear(); box.focus(); };
})();
