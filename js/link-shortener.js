/* Convertios Link Shortener: calls the Convertios server (/api/shorten-url), never a third-party API directly. */
(function () {
  'use strict';
  var UI = window.ConvertiosUI;
  UI.extend({
    en: { enterUrl: 'Paste a web address to shorten.', shortening: 'Shortening…', shortened: 'Short link ready. It works anywhere a normal link does.', copied: 'Copied!', copyFailed: 'Copy failed. Select the link and copy it manually.' },
    ar: { enterUrl: 'الصق رابطًا لاختصاره.', shortening: 'جارٍ الاختصار…', shortened: 'الرابط المختصر جاهز ويعمل في أي مكان يعمل فيه الرابط العادي.', copied: 'تم النسخ!', copyFailed: 'تعذّر النسخ. حدّد الرابط وانسخه يدويًا.' },
    es: { enterUrl: 'Pega una dirección web para acortarla.', shortening: 'Acortando…', shortened: 'Enlace corto listo. Funciona en cualquier lugar donde funcione un enlace normal.', copied: '¡Copiado!', copyFailed: 'No se pudo copiar. Selecciona el enlace y cópialo manualmente.' }
  });

  var input = document.getElementById('url');
  var button = document.getElementById('shortenBtn');
  var result = document.getElementById('result');
  var copyBtn = document.getElementById('copyBtn');
  var buttonLabel = button ? button.textContent : '';
  var copyLabel = copyBtn ? copyBtn.textContent : '';

  function shorten() {
    var value = (input.value || '').trim();
    if (!value) {
      UI.notify(UI.t('enterUrl'));
      input.focus();
      return;
    }
    UI.clear();
    result.value = '';
    UI.busy(button, function () {
      button.textContent = UI.t('shortening');
      return UI.backendFetch('/api/shorten-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value })
      }, { timeoutMs: 75000 }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (!data || typeof data.shortUrl !== 'string') throw Object.assign(new Error('bad response'), { userMessage: UI.t('generic') });
        result.value = data.shortUrl;
        UI.notify(UI.t('shortened'), { type: 'success' });
        copyBtn.focus();
      }).catch(function (error) {
        UI.notify(error.userMessage || UI.t('generic'), { retry: error.code !== 'INVALID_URL' ? shorten : false });
      }).finally(function () {
        button.textContent = buttonLabel;
      });
    });
  }

  function copyLink() {
    if (!result.value) {
      UI.notify(UI.t('nothingToDownload'));
      return;
    }
    var done = function () {
      copyBtn.textContent = UI.t('copied');
      setTimeout(function () { copyBtn.textContent = copyLabel; }, 1600);
    };
    var fallback = function () {
      result.select();
      try { if (document.execCommand('copy')) return done(); } catch (e) { /* ignore */ }
      UI.notify(UI.t('copyFailed'));
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(result.value).then(done, fallback);
    else fallback();
  }

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') { event.preventDefault(); shorten(); }
  });
  window.shorten = shorten;
  window.copyLink = copyLink;
  UI.warmUp();
})();
