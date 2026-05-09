const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limit: '10mb' }));

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getEnvToken(name) {
  const token = process.env[name];
  if (!token) {
    throw new Error(`Missing ${name} environment variable`);
  }
  return token;
}

function sanitizeDownloadName(name, fallback) {
  return (name || fallback).replace(/[^a-z0-9._-]/gi, '_');
}


const CLOUDINARY_CLOUD_NAME = 'dd9it0hte';
const CLOUDINARY_UPLOAD_PRESET = 'convertios_unsigned';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

function buildEnhancedCloudinaryUrl(uploadedUrl) {
  if (!uploadedUrl || !uploadedUrl.includes('/upload/')) {
    throw new Error('Cloudinary upload response did not include a transformable image URL');
  }

  return uploadedUrl.replace('/upload/', '/upload/e_sharpen:300/q_auto/f_auto/');
}

app.post('/enhance', upload.single('image'), async (req, res) => {
  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  console.log('[POST /enhance] Upload received', {
    requestId,
    hasFile: !!req.file,
    originalName: req.file?.originalname,
    mimetype: req.file?.mimetype,
    size: req.file?.size
  });

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded. Use FormData field name "image".' });
    }

    if (!req.file.mimetype?.startsWith('image/')) {
      return res.status(400).json({ error: 'Uploaded file must be an image.' });
    }

    const formData = new FormData();
    formData.append('file', new Blob([req.file.buffer], { type: req.file.mimetype || 'image/png' }), req.file.originalname || 'image.png');
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const cloudinaryResponse = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    const responseText = await cloudinaryResponse.text();
    let cloudinaryData = null;
    try {
      cloudinaryData = responseText ? JSON.parse(responseText) : null;
    } catch (parseError) {
      console.error('[POST /enhance] Cloudinary returned non-JSON response', {
        requestId,
        status: cloudinaryResponse.status,
        responseText: responseText.slice(0, 500)
      });
      return res.status(502).json({ error: 'Cloudinary upload failed', details: 'Cloudinary returned an invalid response.' });
    }

    console.log('[POST /enhance] Cloudinary response', {
      requestId,
      status: cloudinaryResponse.status,
      publicId: cloudinaryData?.public_id,
      secureUrl: cloudinaryData?.secure_url,
      error: cloudinaryData?.error
    });

    if (!cloudinaryResponse.ok) {
      return res.status(502).json({
        error: 'Cloudinary upload failed',
        details: cloudinaryData?.error?.message || cloudinaryData?.message || 'Cloudinary rejected the upload.'
      });
    }

    const originalCloudinaryUrl = cloudinaryData?.secure_url;
    const enhancedImageUrl = buildEnhancedCloudinaryUrl(originalCloudinaryUrl);
    console.log('[POST /enhance] Original Cloudinary URL', { requestId, originalCloudinaryUrl });
    console.log('[POST /enhance] Transformed enhanced URL', { requestId, enhancedImageUrl });
    console.log('[POST /enhance] Final enhanced URL', { requestId, enhancedImageUrl });

    return res.status(200).json({ enhancedImageUrl });
  } catch (error) {
    console.error('[POST /enhance] Error', {
      requestId,
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json({ error: 'Enhancement failed', details: error.message });
  }
});

app.post('/convert/pdf-to-word', upload.single('file'), async (req, res) => {
  console.log('[POST /convert/pdf-to-word] Incoming request');

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF uploaded. Use FormData field name "file".' });
    }

    const token = getEnvToken('CLOUDCONVERT_API_TOKEN');
    const jobResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tasks: {
          upload: { operation: 'import/upload' },
          convert: {
            operation: 'convert',
            input: 'upload',
            input_format: 'pdf',
            output_format: 'docx'
          },
          export: {
            operation: 'export/url',
            input: 'convert'
          }
        }
      })
    });

    if (!jobResponse.ok) {
      const details = await jobResponse.text();
      return res.status(502).json({ error: 'CloudConvert job creation failed', details });
    }

    const job = await jobResponse.json();
    const uploadTask = job?.data?.tasks?.find((task) => task.name === 'upload');
    const form = uploadTask?.result?.form;

    if (!form?.url || !form?.parameters) {
      return res.status(502).json({ error: 'CloudConvert did not return a valid upload form' });
    }

    const uploadForm = new FormData();
    Object.entries(form.parameters).forEach(([key, value]) => uploadForm.append(key, value));
    uploadForm.append('file', new Blob([req.file.buffer], { type: req.file.mimetype || 'application/pdf' }), req.file.originalname || 'document.pdf');

    const uploadResponse = await fetch(form.url, {
      method: 'POST',
      body: uploadForm
    });

    if (!uploadResponse.ok) {
      const details = await uploadResponse.text();
      return res.status(502).json({ error: 'CloudConvert upload failed', details });
    }

    let fileUrl = null;
    for (let attempt = 0; attempt < 60 && !fileUrl; attempt += 1) {
      await sleep(2000);
      const pollResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${job.data.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!pollResponse.ok) {
        const details = await pollResponse.text();
        return res.status(502).json({ error: 'CloudConvert polling failed', details });
      }

      const data = await pollResponse.json();
      const exportTask = data?.data?.tasks?.find((task) => task.name === 'export');
      const failedTask = data?.data?.tasks?.find((task) => task.status === 'error');

      if (failedTask) {
        return res.status(502).json({ error: 'CloudConvert conversion failed', details: failedTask.message || failedTask.code || 'Task error' });
      }

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

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use((_req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

app.use((error, _req, res, _next) => {
  console.error('[server] Unhandled request error', error);
  return res.status(500).json({ error: 'Request failed', details: error.message || String(error) });
});

app.listen(PORT, () => {
  console.log(`Convertios API server running on http://localhost:${PORT}`);
});
