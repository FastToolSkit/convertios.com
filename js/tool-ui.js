/*
 * Convertios shared tool layer (all languages).
 * - Translated, inline status messages instead of browser pop-ups
 * - Error messages for backend error codes
 * - Backend calls with timeouts and a "server is starting" notice for cold starts
 * - Safe downloads: never an empty file, always a correct extension
 * The page language comes from <html lang>, so English, Arabic and Spanish pages share one implementation.
 */
(function () {
  'use strict';

  var lang = String(document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
  if (lang !== 'ar' && lang !== 'es') lang = 'en';

  var BACKEND = 'https://convertios-backend-sn5u.onrender.com';

  var STRINGS = {
    en: {
      retry: 'Retry',
      generic: 'The tool could not complete the request. Check your file or input and try again.',
      actionRequired: 'Please check the tool inputs and try again.',
      network: 'Could not reach the conversion server. Check your connection and try again.',
      timeout: 'The server took too long to respond. Please try again.',
      coldStart: 'Starting the conversion server. The first request after a quiet period can take up to a minute.',
      noFile: 'Please choose a file first.',
      nothingToDownload: 'There is nothing to download yet. Run the tool first.',
      INVALID_URL: 'Enter a valid web address that starts with http:// or https://.',
      SHORTENER_REJECTED: 'This address could not be shortened. Check it and try again.',
      UPSTREAM_TIMEOUT: 'The external service took too long. Please try again.',
      UPSTREAM_UNAVAILABLE: 'The external service is unavailable right now. Please try again shortly.',
      RATE_LIMITED: 'Too many requests. Please wait a few minutes and try again.',
      NO_FILE: 'Please choose a file first.',
      FILE_TOO_LARGE: 'This file is larger than the tool allows.',
      UNSUPPORTED_FORMAT: 'This file type is not supported by this tool.',
      UNSUPPORTED_OUTPUT: 'This output format is not supported.',
      ENHANCER_UNAVAILABLE: 'The enhancement service is unavailable right now. Please try again later.',
      BUSY: 'The server is busy with other files. Please try again in a moment.',
      PROCESSING_TIMEOUT: 'Processing took too long. Try a smaller file.',
      PROCESSING_FAILED: 'The file could not be processed. Check that it is valid and not password-protected.',
      INVALID_REQUEST: 'The request was not valid. Please try again.'
    },
    ar: {
      retry: 'إعادة المحاولة',
      generic: 'تعذّر على الأداة إكمال الطلب. تحقّق من الملف أو المدخلات ثم حاول مرة أخرى.',
      actionRequired: 'يُرجى مراجعة مدخلات الأداة ثم المحاولة مرة أخرى.',
      network: 'تعذّر الوصول إلى خادم التحويل. تحقّق من اتصالك ثم حاول مرة أخرى.',
      timeout: 'استغرق الخادم وقتًا طويلًا للرد. يُرجى المحاولة مرة أخرى.',
      coldStart: 'جارٍ تشغيل خادم التحويل. قد يستغرق الطلب الأول بعد فترة توقف ما يصل إلى دقيقة.',
      noFile: 'يُرجى اختيار ملف أولًا.',
      nothingToDownload: 'لا يوجد شيء للتنزيل بعد. شغّل الأداة أولًا.',
      INVALID_URL: 'أدخل رابطًا صحيحًا يبدأ بـ http:// أو https://.',
      SHORTENER_REJECTED: 'تعذّر اختصار هذا الرابط. تحقّق منه ثم حاول مرة أخرى.',
      UPSTREAM_TIMEOUT: 'استغرقت الخدمة الخارجية وقتًا طويلًا. يُرجى المحاولة مرة أخرى.',
      UPSTREAM_UNAVAILABLE: 'الخدمة الخارجية غير متاحة حاليًا. يُرجى المحاولة بعد قليل.',
      RATE_LIMITED: 'عدد الطلبات كبير جدًا. انتظر بضع دقائق ثم حاول مرة أخرى.',
      NO_FILE: 'يُرجى اختيار ملف أولًا.',
      FILE_TOO_LARGE: 'حجم هذا الملف أكبر من الحد المسموح به في هذه الأداة.',
      UNSUPPORTED_FORMAT: 'نوع هذا الملف غير مدعوم في هذه الأداة.',
      UNSUPPORTED_OUTPUT: 'صيغة الإخراج هذه غير مدعومة.',
      ENHANCER_UNAVAILABLE: 'خدمة تحسين الصور غير متاحة حاليًا. يُرجى المحاولة لاحقًا.',
      BUSY: 'الخادم مشغول بملفات أخرى. يُرجى المحاولة بعد لحظات.',
      PROCESSING_TIMEOUT: 'استغرقت المعالجة وقتًا طويلًا. جرّب ملفًا أصغر.',
      PROCESSING_FAILED: 'تعذّرت معالجة الملف. تأكّد من أنه سليم وغير محمي بكلمة مرور.',
      INVALID_REQUEST: 'الطلب غير صالح. يُرجى المحاولة مرة أخرى.'
    },
    es: {
      retry: 'Reintentar',
      generic: 'La herramienta no pudo completar la solicitud. Revisa el archivo o los datos e inténtalo de nuevo.',
      actionRequired: 'Revisa los datos de la herramienta e inténtalo de nuevo.',
      network: 'No se pudo conectar con el servidor de conversión. Revisa tu conexión e inténtalo de nuevo.',
      timeout: 'El servidor tardó demasiado en responder. Inténtalo de nuevo.',
      coldStart: 'Iniciando el servidor de conversión. La primera solicitud tras un periodo de inactividad puede tardar hasta un minuto.',
      noFile: 'Primero elige un archivo.',
      nothingToDownload: 'Todavía no hay nada que descargar. Ejecuta primero la herramienta.',
      INVALID_URL: 'Introduce una dirección web válida que empiece por http:// o https://.',
      SHORTENER_REJECTED: 'No se pudo acortar esta dirección. Revísala e inténtalo de nuevo.',
      UPSTREAM_TIMEOUT: 'El servicio externo tardó demasiado. Inténtalo de nuevo.',
      UPSTREAM_UNAVAILABLE: 'El servicio externo no está disponible ahora. Inténtalo de nuevo en unos minutos.',
      RATE_LIMITED: 'Demasiadas solicitudes. Espera unos minutos e inténtalo de nuevo.',
      NO_FILE: 'Primero elige un archivo.',
      FILE_TOO_LARGE: 'Este archivo supera el tamaño permitido por la herramienta.',
      UNSUPPORTED_FORMAT: 'Este tipo de archivo no es compatible con esta herramienta.',
      UNSUPPORTED_OUTPUT: 'Este formato de salida no es compatible.',
      ENHANCER_UNAVAILABLE: 'El servicio de mejora no está disponible ahora. Inténtalo más tarde.',
      BUSY: 'El servidor está ocupado con otros archivos. Inténtalo de nuevo en un momento.',
      PROCESSING_TIMEOUT: 'El procesamiento tardó demasiado. Prueba con un archivo más pequeño.',
      PROCESSING_FAILED: 'No se pudo procesar el archivo. Comprueba que es válido y que no está protegido con contraseña.',
      INVALID_REQUEST: 'La solicitud no es válida. Inténtalo de nuevo.'
    }
  };

  function t(key, fallback) {
    var table = STRINGS[lang] || STRINGS.en;
    return table[key] || STRINGS.en[key] || fallback || key;
  }

  // Lets a tool add its own translated strings: ConvertiosUI.extend({ en: {...}, ar: {...}, es: {...} })
  function extend(dict) {
    Object.keys(dict || {}).forEach(function (code) {
      if (!STRINGS[code]) return;
      Object.keys(dict[code]).forEach(function (key) { STRINGS[code][key] = dict[code][key]; });
    });
  }

  var lastActionButton = null;
  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('button');
    if (button && !button.classList.contains('tool-retry-button')) lastActionButton = button;
  }, true);

  function messageBox() {
    var box = document.getElementById('toolMessage');
    if (!box) {
      box = document.createElement('div');
      box.id = 'toolMessage';
      box.className = 'tool-message-box';
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      var anchor = document.querySelector('.tool-container,.tool-wrap,.app-container,.video-tool-shell,main') || document.body;
      anchor.insertAdjacentElement('afterend', box);
    }
    return box;
  }

  // type: 'error' (default), 'info' or 'success'. retry: true re-clicks the last action button, or a function.
  function notify(message, options) {
    options = options || {};
    var box = messageBox();
    box.className = 'tool-message-box tool-message-' + (options.type || 'error');
    box.textContent = '';
    var text = document.createElement('span');
    text.textContent = String(message || t('generic'));
    box.appendChild(text);
    if (options.retry) {
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'tool-retry-button';
      retry.textContent = t('retry');
      retry.addEventListener('click', function () {
        clear();
        if (typeof options.retry === 'function') options.retry();
        else if (lastActionButton) lastActionButton.click();
      });
      box.appendChild(document.createTextNode(' '));
      box.appendChild(retry);
    }
    box.style.display = 'block';
    return box;
  }

  function clear() {
    var box = document.getElementById('toolMessage');
    if (box) box.style.display = 'none';
  }

  // Kept for older tool scripts that call showToolMessage(message, canRetry).
  window.showToolMessage = function (message, canRetry) {
    notify(message, { retry: !!canRetry });
  };

  // Native alert() calls inside tools are shown in the page instead of a browser pop-up.
  window.alert = function (message) {
    notify(String(message || t('actionRequired')), { retry: true });
  };

  // Show a message for uncaught errors from Convertios' own scripts only (never for ads or analytics).
  function ownScript(filename) {
    return !filename || filename.indexOf(location.origin) === 0;
  }
  window.addEventListener('error', function (event) {
    if (event.target && event.target !== window) return; // failed <img>/<script> loads are not tool errors
    if (!ownScript(event.filename)) return;
    notify(t('generic'), { retry: true });
  });
  window.addEventListener('unhandledrejection', function (event) {
    var reason = event.reason;
    var stack = reason && reason.stack ? String(reason.stack) : '';
    if (stack && stack.indexOf(location.origin) === -1 && /https?:\/\//.test(stack)) return;
    notify(t('generic'), { retry: true });
  });

  function messageForCode(code, fallbackKey) {
    if (code && STRINGS.en[code]) return t(code);
    return t(fallbackKey || 'generic');
  }

  // Calls the Convertios backend with a timeout and a cold-start notice.
  // Resolves with the Response for 2xx; rejects with an Error whose .userMessage is translated.
  function backendFetch(path, options, settings) {
    settings = settings || {};
    var timeoutMs = settings.timeoutMs || 120000;
    var slowAfterMs = settings.slowAfterMs || 7000;
    var controller = new AbortController();
    var slowTimer = setTimeout(function () {
      if (settings.onSlow) settings.onSlow(t('coldStart'));
      else notify(t('coldStart'), { type: 'info' });
    }, slowAfterMs);
    var killTimer = setTimeout(function () { controller.abort(); }, timeoutMs);
    var opts = Object.assign({}, options || {}, { signal: controller.signal });
    return fetch(BACKEND + path, opts).then(function (response) {
      if (response.ok) return response;
      return response.json().catch(function () { return {}; }).then(function (body) {
        var err = new Error(body.error || ('HTTP ' + response.status));
        err.code = body.code || 'HTTP_' + response.status;
        err.status = response.status;
        err.userMessage = messageForCode(body.code, response.status >= 500 ? 'PROCESSING_FAILED' : 'generic');
        throw err;
      });
    }, function (cause) {
      var err = new Error(cause && cause.name === 'AbortError' ? 'timeout' : 'network');
      err.code = cause && cause.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK';
      err.userMessage = t(err.code === 'TIMEOUT' ? 'timeout' : 'network');
      throw err;
    }).finally(function () {
      clearTimeout(slowTimer);
      clearTimeout(killTimer);
    });
  }

  // Wakes the backend while the visitor is choosing a file (free hosting sleeps when idle).
  var warmedUp = false;
  function warmUp() {
    if (warmedUp) return;
    warmedUp = true;
    try {
      fetch(BACKEND + '/health', { cache: 'no-store', mode: 'cors' }).catch(function () {});
    } catch (e) { /* ignore */ }
  }

  // Disables a button while an async action runs, so it can't be submitted twice.
  function busy(button, run) {
    if (button && button.disabled) return Promise.resolve();
    if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); }
    return Promise.resolve().then(run).finally(function () {
      if (button) { button.disabled = false; button.removeAttribute('aria-busy'); }
    });
  }

  // "My Photo (1).PNG" + ".jpg" -> "My-Photo-1.jpg"; never returns an empty name.
  function safeName(name, extension, fallback) {
    var base = String(name || '').replace(/\.[^./\\]+$/, '').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' ').trim();
    base = base.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '').slice(0, 80);
    return (base || fallback || 'convertios') + (extension || '');
  }

  var EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/bmp': '.bmp', 'application/pdf': '.pdf', 'application/zip': '.zip', 'audio/mpeg': '.mp3', 'audio/wav': '.wav' };
  function extensionFor(mime) { return EXT[String(mime || '').split(';')[0]] || ''; }

  // Triggers a download for a Blob; refuses empty output.
  function download(blob, filename) {
    if (!blob || !blob.size) {
      notify(t('nothingToDownload'));
      return false;
    }
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    return true;
  }

  // Checks the first bytes of generated files so a renamed format can never be offered as a download.
  function signatureOf(bytes) {
    var b = bytes;
    if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
    if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return 'image/gif';
    if (b[0] === 0x42 && b[1] === 0x4d) return 'image/bmp';
    if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
    if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return 'application/pdf';
    if (b[0] === 0x50 && b[1] === 0x4b) return 'application/zip';
    return '';
  }
  function verifyBlob(blob, expectedMime) {
    return blob.slice(0, 12).arrayBuffer().then(function (buffer) {
      return signatureOf(new Uint8Array(buffer)) === expectedMime;
    });
  }

  window.ConvertiosUI = {
    lang: lang,
    backend: BACKEND,
    t: t,
    extend: extend,
    notify: notify,
    clear: clear,
    messageForCode: messageForCode,
    backendFetch: backendFetch,
    warmUp: warmUp,
    busy: busy,
    safeName: safeName,
    extensionFor: extensionFor,
    download: download,
    signatureOf: signatureOf,
    verifyBlob: verifyBlob
  };

  if (document.documentElement.hasAttribute('data-uses-backend') || document.querySelector('[data-uses-backend]')) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', warmUp);
    else warmUp();
  }
})();
