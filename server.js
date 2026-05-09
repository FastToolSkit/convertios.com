 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/server.js b/server.js
index f334e0bfa48df4cde31f4f7789d6b169ec0e6ea0..aa082982339086ff6b659d796e2ce94a34f46792 100644
--- a/server.js
+++ b/server.js
@@ -107,182 +107,222 @@ app.post('/convert/pdf-to-word', upload.single('file'), async (req, res) => {
       if (exportTask?.status === 'finished' && exportTask?.result?.files?.length) {
         fileUrl = exportTask.result.files[0].url;
       }
     }
 
     if (!fileUrl) {
       return res.status(504).json({ error: 'PDF to Word conversion timed out' });
     }
 
     const convertedResponse = await fetch(fileUrl);
     if (!convertedResponse.ok) {
       return res.status(502).json({ error: 'Unable to download converted DOCX from CloudConvert' });
     }
 
     const convertedBuffer = Buffer.from(await convertedResponse.arrayBuffer());
     const downloadName = sanitizeDownloadName((req.file.originalname || 'converted.pdf').replace(/\.pdf$/i, '.docx'), 'converted.docx');
     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
     res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
     return res.send(convertedBuffer);
   } catch (error) {
     console.error('[POST /convert/pdf-to-word] Unexpected error', error);
     return res.status(500).json({ error: 'PDF to Word conversion failed', details: error.message });
   }
 });
 
+
+function buildReplicateHeaders(token, extraHeaders = {}) {
+  return {
+    Authorization: `Bearer ${token}`,
+    'Content-Type': 'application/json',
+    ...extraHeaders
+  };
+}
+
+function fileToDataUri(file) {
+  const mimeType = file.mimetype || 'image/png';
+  const base64 = file.buffer.toString('base64');
+  return `data:${mimeType};base64,${base64}`;
+}
+
+function extractReplicateOutputUrl(output) {
+  if (!output) return null;
+  if (typeof output === 'string') return output;
+  if (Array.isArray(output)) {
+    const firstUrl = output.find((item) => typeof item === 'string' && /^https?:\/\//i.test(item));
+    return firstUrl || (typeof output[0] === 'string' ? output[0] : null);
+  }
+  if (typeof output === 'object') {
+    return output.url || output.image || output.output || null;
+  }
+  return null;
+}
+
+function getUploadedImage(req) {
+  return req.file || req.files?.image?.[0] || req.files?.file?.[0] || null;
+}
+
+async function parseReplicateResponse(response) {
+  const text = await response.text();
+  try {
+    return text ? JSON.parse(text) : {};
+  } catch (_error) {
+    return { error: text || 'Invalid Replicate response' };
+  }
+}
+
+async function pollReplicatePrediction(prediction, token) {
+  let current = prediction;
+  const getUrl = current?.urls?.get;
+
+  for (let attempt = 0; attempt < 90; attempt += 1) {
+    if (['succeeded', 'successful'].includes(current?.status)) return current;
+    if (['failed', 'canceled', 'cancelled'].includes(current?.status)) {
+      throw new Error(current?.error || `Replicate prediction ${current.status}`);
+    }
+
+    if (!getUrl) {
+      throw new Error('Replicate did not return a polling URL');
+    }
+
+    await sleep(2000);
+    const pollResponse = await fetch(getUrl, {
+      headers: { Authorization: `Bearer ${token}` }
+    });
+
+    current = await parseReplicateResponse(pollResponse);
+    if (!pollResponse.ok) {
+      throw new Error(current?.detail || current?.error || 'Replicate polling failed');
+    }
+  }
+
+  throw new Error('Replicate image enhancement timed out');
+}
+
+app.post('/ai-enhance', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res) => {
+  console.log('[POST /ai-enhance] Incoming request');
+
+  try {
+    const image = getUploadedImage(req);
+    if (!image) {
+      return res.status(400).json({ success: false, error: 'No image uploaded. Use FormData field name "image".' });
+    }
+
+    if (!image.mimetype?.startsWith('image/')) {
+      return res.status(400).json({ success: false, error: 'Uploaded file must be an image.' });
+    }
+
+    const token = getEnvToken('REPLICATE_API_TOKEN');
+    const imageDataUri = fileToDataUri(image);
+
+    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
+      method: 'POST',
+      headers: buildReplicateHeaders(token, {
+        Prefer: 'wait=60',
+        'Cancel-After': '3m'
+      }),
+      body: JSON.stringify({
+        version: '42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b',
+        input: {
+          image: imageDataUri,
+          scale: 2,
+          face_enhance: false
+        }
+      })
+    });
+
+    const createdPrediction = await parseReplicateResponse(createResponse);
+    if (!createResponse.ok) {
+      return res.status(502).json({
+        success: false,
+        error: createdPrediction?.detail || createdPrediction?.error || 'Replicate prediction creation failed'
+      });
+    }
+
+    const finishedPrediction = await pollReplicatePrediction(createdPrediction, token);
+    const imageUrl = extractReplicateOutputUrl(finishedPrediction.output);
+
+    if (!imageUrl) {
+      return res.status(502).json({ success: false, error: 'Replicate finished without returning an enhanced image URL' });
+    }
+
+    return res.json({ success: true, imageUrl });
+  } catch (error) {
+    console.error('[POST /ai-enhance] Error', error);
+    return res.status(500).json({ success: false, error: error.message || 'Replicate image enhancement failed' });
+  }
+});
+app.get('/ai-enhance/download', async (req, res) => {
+  try {
+    const imageUrl = String(req.query.url || '');
+    const parsedUrl = new URL(imageUrl);
+    const allowedHosts = new Set(['replicate.delivery', 'replicate.com']);
+
+    if (parsedUrl.protocol !== 'https:' || !allowedHosts.has(parsedUrl.hostname)) {
+      return res.status(400).json({ success: false, error: 'Invalid enhanced image URL.' });
+    }
+
+    const response = await fetch(imageUrl);
+    if (!response.ok) {
+      return res.status(502).json({ success: false, error: 'Unable to download enhanced image from Replicate.' });
+    }
+
+    const contentType = response.headers.get('content-type') || 'image/png';
+    const outputBuffer = Buffer.from(await response.arrayBuffer());
+    res.setHeader('Content-Type', contentType);
+    res.setHeader('Content-Disposition', 'attachment; filename="enhanced-image.png"');
+    return res.send(outputBuffer);
+  } catch (error) {
+    console.error('[GET /ai-enhance/download] Error', error);
+    return res.status(500).json({ success: false, error: error.message || 'Enhanced image download failed' });
+  }
+});
+
 app.post('/remove-background', upload.single('image_file'), async (req, res) => {
   console.log('[POST /remove-background] Incoming request');
 
   try {
     if (!req.file) {
       return res.status(400).json({ error: 'No image uploaded. Use FormData field name "image_file".' });
     }
 
     const formData = new FormData();
     formData.append('image_file', new Blob([req.file.buffer], { type: req.file.mimetype || 'image/png' }), req.file.originalname || 'image.png');
     formData.append('size', 'auto');
 
     const response = await fetch('https://api.remove.bg/v1.0/removebg', {
       method: 'POST',
       headers: { 'X-Api-Key': getEnvToken('REMOVE_BG_API_KEY') },
       body: formData
     });
 
     if (!response.ok) {
       const details = await response.text();
       return res.status(502).json({ error: 'Background removal failed', details });
     }
 
     const outputBuffer = Buffer.from(await response.arrayBuffer());
     res.setHeader('Content-Type', 'image/png');
     res.setHeader('Content-Disposition', 'attachment; filename="no-bg.png"');
     return res.send(outputBuffer);
   } catch (error) {
     console.error('[POST /remove-background] Unexpected error', error);
     return res.status(500).json({ error: 'Background removal failed', details: error.message });
   }
 });
 
 app.get('/', (req, res) => {
   res.send('Server running');
 });
 
 app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
-});
-
-app.use((error, _req, res, _next) => {
-  console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
-});
-
-app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
-});
-
-app.use((error, _req, res, _next) => {
-  console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
-});
-
-app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
-});
-
-app.use((error, _req, res, _next) => {
-  console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
-});
-
-app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
-});
-
-app.use((error, _req, res, _next) => {
-  console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
-});
-
-app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
-});
-
-app.use((error, _req, res, _next) => {
-  console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
-});
-
-app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
-});
-
-app.use((error, _req, res, _next) => {
-  console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
-});
-
-app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
-});
-
-app.use((error, _req, res, _next) => {
-  console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
-});
-
-app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
-});
-
-app.use((error, _req, res, _next) => {
-  console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
-});
-
-app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
-});
-
-app.use((error, _req, res, _next) => {
-  console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
-});
-
-app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
-});
-
-app.use((error, _req, res, _next) => {
-  console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
-});
-
-app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
-});
-
-app.use((error, _req, res, _next) => {
-  console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
-});
-
-app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
-});
-
-app.use((error, _req, res, _next) => {
-  console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
-});
-
-app.use((_req, res) => {
-  return res.status(404).json({ error: 'Not found' });
+  return res.status(404).json({ success: false, error: 'Not found' });
 });
 
 app.use((error, _req, res, _next) => {
   console.error('[server] Unhandled request error', error);
-  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
+  return res.status(500).json({ success: false, error: 'Request failed', details: error.message || String(error) });
 });
 
 app.listen(PORT, () => {
   console.log(`Convertios API server running on http://localhost:${PORT}`);
 });
 
EOF
)
