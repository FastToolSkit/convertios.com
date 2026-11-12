# Non-mocked production conversion checks — 12 November 2026

These checks used synthetic inputs and interacted with the currently deployed production site/backend. They did not change source data or submit user files. They are **read-only from a site-configuration perspective** but invoke processing endpoints and were run deliberately once.

## Browser conversions (production website)

- `python tests/browser/live-local-tools.py` — PASS **6/6**: JPG/PNG→PDF and PNG→JPEG in EN, ES and AR. Downloaded PDFs began with `%PDF-` and JPEG files with `FF D8 FF`. No browser JavaScript errors.
- `python tests/browser/live-pdf-tools.py` — PASS **6/6** using a valid single-page PDF fixture: PDF→JPG and Rotate PDF in EN, ES and AR. Downloaded JPEG/PDF signatures verified. Browser code used real external PDF libraries, not mocks.

## Server-backed conversions (production backend)

- `GET /health` — HTTP 200, backend version `7cb92f102e5b`, active engines reported.
- `POST /api/shorten-url` using a synthetic `https://example.com/?source=convertios-qa-20261112` — HTTP 200, returned a TinyURL link and matching original URL.
- `python tests/browser/live-backend.py` — PASS: a one-page synthetic PDF generated a valid DOCX ZIP with `word/document.xml`; a one-second synthesized MP4 produced an MP3 with a valid file signature, and a WebM with the expected EBML file signature.

The backend requires occasional cold starts. Both Python scripts are opt-in only, not run as mandatory GitHub Actions tests. `requests` and `ffmpeg` are needed for the backend test. Do not run many jobs in parallel; the production server reports a max of two active jobs.

## Scope limitations

Passing a smoke test on tiny generated files does **not** prove all real user files or providers will work. Remaining untested production functionality includes image background removal, Cloudinary AI enhancement, complex scanned/multilingual PDF conversion, large video uploads, multi-page rotations, high-load scenarios, and mobile hardware compatibility.

These tests ran against the existing production release and **did not test or deploy the content changes in PR #256**. They verify unaffected converters before rollout. After deployment, rerun representative tests and live URL checks.
