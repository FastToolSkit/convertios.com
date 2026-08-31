# Convertios self-hosted backend

The backend performs conversions with open-source software inside its own
Docker container. It does not use CloudConvert, Replicate, remove.bg,
Cloudinary, or another conversion provider.

## Enabled routes

- `GET /health`: service and engine status.
- `POST /convert/pdf-to-word`: one PDF in the `file` form field, processed by
  `pdf2docx` locally.
- `POST /remove-background`: one image in the `image_file` form field,
  processed by the local `rembg` `u2netp` model.
- `POST /enhance`: deliberately returns `503` until a suitable local
  enhancement model and enough server capacity are configured.

Uploaded files use a unique private temporary directory and are deleted after
every request, including failed requests. The service limits upload size,
request rate, processing time, and concurrent jobs.

## Local Docker test

```bash
docker build -t convertios-backend .
docker run --rm -p 3000:3000 convertios-backend
curl http://localhost:3000/health
```

## Render deployment

The included `render.yaml` creates a free Docker web service for initial testing.
The free instance can sleep when inactive and its 512 MB memory limit might be
insufficient for background removal. Upgrade only if real testing shows that it
is necessary.

After deployment, keep the existing Render URL in the pages or attach
`api.convertios.com` to the service. Add preview domains to
`EXTRA_ALLOWED_ORIGINS` as a comma-separated list when needed.

No API keys are required.
