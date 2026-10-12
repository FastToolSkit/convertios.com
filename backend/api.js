// Dependency-free logic for the Convertios API endpoints.
// server.js wires these handlers into Express; tests/server.test.js calls them directly.
'use strict';

const path = require('path');

const LIMITS = {
  enhanceUploadBytes: 8 * 1024 * 1024,
  enhancedResultBytes: 25 * 1024 * 1024,
  shortenerTimeoutMs: 8_000,
  enhanceUploadTimeoutMs: 30_000,
  enhanceProcessTimeoutMs: 90_000,
  enhanceDownloadTimeoutMs: 30_000
};

function list(value) {
  return String(value || '').split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
}

// External providers. Every value can be overridden through the environment; the defaults are
// the public, keyless endpoints Convertios already used. ENHANCED_IMAGE_HOSTS accepts hostnames
// (which must be served over https) or exact origins.
function loadConfig(env = process.env) {
  return {
    shortenerProviders: [
      { name: 'tinyurl', endpoint: env.SHORTENER_TINYURL_ENDPOINT || 'https://tinyurl.com/api-create.php', param: 'url', resultPrefixes: ['https://tinyurl.com/', 'http://tinyurl.com/'] },
      { name: 'isgd', endpoint: env.SHORTENER_ISGD_ENDPOINT || 'https://is.gd/create.php', param: 'url', extra: { format: 'simple' }, resultPrefixes: ['https://is.gd/', 'http://is.gd/'] }
    ],
    cloudinaryUploadUrl: env.CLOUDINARY_UPLOAD_URL || `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME || 'dd9it0hte'}/image/upload`,
    cloudinaryUploadPreset: env.CLOUDINARY_UPLOAD_PRESET || 'convertios_unsigned',
    // Optional external workflow (e.g. n8n). When unset, enhancement uses Cloudinary's own AI effects.
    enhanceWorkflowUrl: env.N8N_ENHANCE_URL || '',
    enhancedImageHosts: new Set(['res.cloudinary.com', ...list(env.ENHANCED_IMAGE_HOSTS)])
  };
}

function error(status, code, message) {
  return { status, body: { error: message, code } };
}

function safeDownloadName(name, extension, fallback) {
  const base = path.basename(name || fallback, path.extname(name || fallback));
  // ASCII only (it goes into a Content-Disposition header). Accents are folded; other scripts fall back.
  const safeBase = base.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  return `${safeBase || fallback}${extension}`;
}

function detectImageType(buffer) {
  if (!buffer || buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return { ext: '.jpg', mime: 'image/jpeg' };
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: '.png', mime: 'image/png' };
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return { ext: '.webp', mime: 'image/webp' };
  return null;
}

function isPdf(buffer) {
  return Boolean(buffer && buffer.length > 5 && buffer.toString('ascii', 0, 5) === '%PDF-');
}

async function fetchWithTimeout(url, options, timeoutMs) {
  try {
    return await fetch(url, { ...options, signal: AbortSignal.timeout(timeoutMs) });
  } catch (err) {
    const timedOut = err && (err.name === 'TimeoutError' || err.name === 'AbortError');
    const wrapped = new Error(timedOut ? 'Upstream request timed out.' : 'Upstream service could not be reached.');
    wrapped.code = timedOut ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNAVAILABLE';
    throw wrapped;
  }
}

// Accepts only absolute http(s) URLs that point at a public-looking hostname.
// Nothing is ever fetched from this URL; it is only passed to the shortening provider.
function normalizeShortenTarget(raw) {
  if (typeof raw !== 'string') return null;
  let value = raw.trim();
  if (!value || value.length > 2048 || /\s/.test(value)) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(value)) value = `https://${value}`;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  if (parsed.username || parsed.password) return null;
  const host = parsed.hostname.toLowerCase();
  if (!host.includes('.') || host === 'localhost' || /\.(localhost|local|internal)$/.test(host)) return null;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith('[')) return null;
  // WHATWG URL parsing converts international domains to punycode, so a valid host is plain ASCII.
  if (!/^[a-z0-9.-]+$/.test(host) || host.split('.').some((label) => !label || label.startsWith('-') || label.endsWith('-'))) return null;
  if (!/[a-z]/.test(host.split('.').pop())) return null;
  return parsed.toString();
}

async function handleShorten(body, config = loadConfig()) {
  const target = normalizeShortenTarget(body && body.url);
  if (!target) return error(400, 'INVALID_URL', 'Enter a valid web address that starts with http:// or https://.');
  let lastCode = 'UPSTREAM_UNAVAILABLE';
  for (const provider of config.shortenerProviders) {
    try {
      const endpoint = new URL(provider.endpoint);
      endpoint.searchParams.set(provider.param, target);
      for (const [key, val] of Object.entries(provider.extra || {})) endpoint.searchParams.set(key, val);
      const response = await fetchWithTimeout(endpoint, { headers: { 'User-Agent': 'Convertios link shortener (+https://convertios.com)' } }, LIMITS.shortenerTimeoutMs);
      const text = (await response.text()).trim();
      if (response.ok && text.length < 200 && !/\s/.test(text) && provider.resultPrefixes.some((prefix) => text.startsWith(prefix))) {
        return { status: 200, body: { shortUrl: text.replace(/^http:\/\//, 'https://'), longUrl: target } };
      }
      lastCode = response.status >= 500 ? 'UPSTREAM_UNAVAILABLE' : 'SHORTENER_REJECTED';
    } catch (err) {
      lastCode = err.code || 'UPSTREAM_UNAVAILABLE';
    }
  }
  if (lastCode === 'SHORTENER_REJECTED') return error(422, 'SHORTENER_REJECTED', 'This address could not be shortened.');
  if (lastCode === 'UPSTREAM_TIMEOUT') return error(504, 'UPSTREAM_TIMEOUT', 'The shortening service took too long. Please retry.');
  return error(503, 'UPSTREAM_UNAVAILABLE', 'The shortening service is unavailable. Please retry shortly.');
}

// file: { buffer, originalname }
async function handleEnhance(file, config = loadConfig()) {
  if (!file || !file.buffer || !file.buffer.length) return error(400, 'NO_FILE', 'No image uploaded.');
  if (file.buffer.length > LIMITS.enhanceUploadBytes) return error(413, 'FILE_TOO_LARGE', 'Uploaded file is too large.');
  const type = detectImageType(file.buffer);
  if (!type) return error(415, 'UNSUPPORTED_FORMAT', 'Upload a JPG, PNG or WEBP image.');
  const unavailable = error(502, 'ENHANCER_UNAVAILABLE', 'The enhancement service is unavailable right now.');
  try {
    // 1. Upload to the image host (unsigned preset; nothing secret involved).
    const form = new FormData();
    form.append('file', new Blob([file.buffer], { type: type.mime }), `upload${type.ext}`);
    form.append('upload_preset', config.cloudinaryUploadPreset);
    const uploadResponse = await fetchWithTimeout(config.cloudinaryUploadUrl, { method: 'POST', body: form }, LIMITS.enhanceUploadTimeoutMs);
    const uploaded = await uploadResponse.json().catch(() => null);
    if (!uploadResponse.ok || !uploaded || typeof uploaded.secure_url !== 'string') {
      console.warn('[enhance] image host upload failed', uploadResponse.status);
      return unavailable;
    }

    // 2. Enhance: the optional external workflow first (if configured), then Cloudinary's AI effects.
    const candidates = [];
    if (config.enhanceWorkflowUrl) {
      const workflowUrl = await runEnhanceWorkflow(config, uploaded.secure_url);
      if (workflowUrl) candidates.push(workflowUrl);
    }
    candidates.push(...cloudinaryEnhanceUrls(uploaded));

    // 3. Fetch the result only from an allowed image host (never an arbitrary URL).
    for (const candidate of candidates) {
      const result = await fetchEnhancedImage(candidate, config);
      if (result) {
        return {
          status: 200,
          buffer: result.buffer,
          mime: result.type.mime,
          filename: safeDownloadName(file.originalname, `-enhanced${result.type.ext}`, 'image')
        };
      }
    }
    return unavailable;
  } catch (err) {
    console.warn('[enhance] failed:', err.code || err.message);
    if (err.code === 'UPSTREAM_TIMEOUT') return error(504, 'UPSTREAM_TIMEOUT', 'Enhancement took too long. Please retry with a smaller image.');
    return unavailable;
  }
}

// Cloudinary delivery URLs with AI effects, best first. e_upscale (4x super-resolution) only accepts
// images up to 4.2 megapixels, so it is used only when the result stays within 4096 px.
function cloudinaryEnhanceUrls(uploaded) {
  const marker = '/image/upload/';
  const at = uploaded.secure_url.indexOf(marker);
  if (at < 0) return [];
  const head = uploaded.secure_url.slice(0, at + marker.length);
  const tail = uploaded.secure_url.slice(at + marker.length);
  const longest = Math.max(Number(uploaded.width) || 0, Number(uploaded.height) || 0);
  const chains = [];
  if (longest > 0 && longest <= 1024) chains.push('e_gen_restore/e_enhance/e_upscale');
  chains.push('e_gen_restore/e_enhance', 'e_enhance', 'e_improve/e_sharpen:60');
  return chains.map((chain) => `${head}${chain}/${tail}`);
}

async function runEnhanceWorkflow(config, imageUrl) {
  try {
    const response = await fetchWithTimeout(config.enhanceWorkflowUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageUrl, message: 'Convertios AI image enhancement' })
    }, LIMITS.enhanceProcessTimeoutMs);
    const data = await response.json().catch(() => null);
    if (response.ok && data && data.success && typeof data.imageUrl === 'string') return data.imageUrl;
    console.warn('[enhance] workflow failed', response.status);
  } catch (err) {
    console.warn('[enhance] workflow failed:', err.code || err.message);
  }
  return null;
}

async function fetchEnhancedImage(candidate, config) {
  let resultUrl;
  try {
    resultUrl = new URL(candidate);
  } catch {
    return null;
  }
  const allowed = (resultUrl.protocol === 'https:' && config.enhancedImageHosts.has(resultUrl.hostname.toLowerCase()))
    || config.enhancedImageHosts.has(resultUrl.origin.toLowerCase());
  if (!allowed) {
    console.warn('[enhance] result host not allowed:', resultUrl.hostname);
    return null;
  }
  try {
    const imageResponse = await fetchWithTimeout(resultUrl, { redirect: 'error' }, LIMITS.enhanceProcessTimeoutMs);
    if (!imageResponse.ok || Number(imageResponse.headers.get('content-length') || 0) > LIMITS.enhancedResultBytes) {
      console.warn('[enhance] result fetch failed', imageResponse.status, imageResponse.headers.get('x-cld-error') || '');
      return null;
    }
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    const type = detectImageType(buffer);
    if (!type || buffer.length > LIMITS.enhancedResultBytes) return null;
    return { buffer, type };
  } catch (err) {
    console.warn('[enhance] result fetch failed:', err.code || err.message);
    if (err.code === 'UPSTREAM_TIMEOUT') throw err;
    return null;
  }
}

module.exports = { LIMITS, loadConfig, safeDownloadName, detectImageType, isPdf, normalizeShortenTarget, handleShorten, handleEnhance };
