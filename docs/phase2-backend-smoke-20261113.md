# Phase 2 — Real production backend smoke (2026-11-13)

Branch: `audit/phase2-priority-tools-20261113` (draft PR #262). Testing is read-only with synthetic media uploads sent to documented public processing endpoints; no repository production changes.

## Environment and inputs
- Backend: `https://convertios-backend-sn5u.onrender.com`
- Generated a 2-second, 160×120 blue video with 440 Hz synthetic sine audio using local FFmpeg, 27,820 bytes. No personal/customer media.
- Generated a tiny solid-color 64×64 PNG using Pillow.
- Invoked each endpoint exactly once, using the same form fields as the production JavaScript.
- Script: `python tests/browser/phase2-backend-real-smoke.py` (manual opt-in only; no CI execution by default).

## Results
| Endpoint | HTTP | Response MIME | Bytes | File-signature verdict | Elapsed |
|---|---:|---|---:|---|---:|
| `POST /convert/video-to-mp3` | 200 | audio/mpeg | 50,298 | MP3 signature passed | 23.8s |
| `POST /convert/video` format=webm | 200 | video/webm | 31,703 | EBML/WebM signature passed | 1.6s |
| `POST /api/enhance-image` | 200 | image/png | 86 | PNG signature passed | 4.4s |

All three public processing operations returned nonempty output with expected file signatures. The unexpectedly small 86-byte image output is consistent with an extremely simple synthetic solid-color image, but the test did **not** decode it, compare pixels, or establish objective image improvement. Likewise, video and audio were signature-checked, not independently decoded or assessed for perceptual quality.

## Interpretation
- The earlier mock-only uncertainty for production video processing is reduced: the live backend successfully completed one MP3 extraction and one WebM conversion using real FFmpeg test input.
- The AI provider endpoint responds successfully to a tiny synthetic image; visual enhancement quality is **not** verified.
- These are backend endpoint tests, not complete browser-click-to-download tests; prior browser checks separately covered file selection/UI and client-side conversions.
- Google URL Inspection's stored statuses remain a different issue: none of this proves indexing. The connected OpenSEO tool **cannot run Google's live URL Inspection**, so do not claim such a test.
- Avoid speculative canonical, sitemap, metadata, content, or robots changes. Next evidence: manual GSC live inspection and differentiated Spanish editorial value for the recently crawled but not indexed AI Enhancer page.

## Safety
No merge or deployment, and no sensitive files or service credentials used. Do not run the production backend smoke script as part of routine CI: it makes real conversion requests and may consume service resources.
