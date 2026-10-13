# Production QA checkpoint — 2026-10-13

This is an incomplete audit checkpoint, not a production certification.

## Baseline and preservation

- Repair branch: `qa/production-baseline-20261012`.
- Latest fetched `origin/main`: `e42bf50a702fd8fdad38a2bc955e4f068375886f`.
- Reviewed Claude's guide commit `5418a91`, UTF-8 filename commit `e04ce08`, Cloudinary integration and previous repair merge.
- The branch includes those commits. No tool JavaScript, recently added search intent, or Rotate PDF implementation was replaced.
- GitHub Pages deployment 7023247558 names the baseline SHA. Live guides were observed; Rotate PDF's existing-rotation behavior was executed. Complete byte-for-byte production comparison was BLOCKED by HTTP retrieval failures.

## Minimal corrections

- PNG to JPG EN/ES genuinely contained nested footer elements and a second copyright line in source and rendered DOM. Removed the redundant wrapper and notice.
- All three homepages now distinguish local processing, backend conversion, Cloudinary enhancement, and URL-shortening providers.
- MP3 Cutter guides now describe the actual draggable region and read-only time labels.
- Compress Image guides qualify metadata removal: a small original returned unchanged retains its metadata.
- Rotate PDF guides explain that saving rewrites the PDF and can invalidate digital signatures; the working rotation code is unchanged.
- JPG to PDF guides use the existing Include checkbox and explain the JPEG re-encoding exception for camera-orientation correction.
- Static regression checks require one footer and copyright notice per page and reject the removed universal-local-processing claims.

## Executed evidence

`cloud-tools.json` contains actual production browser interactions. `decoded-*.json` contains file inspection results using Pillow, pypdf, ZIP/XML parsing, FFprobe, and ZXing. A download path alone is not proof of valid contents. Temporary paths may expire; the recorded decode results describe inspections performed while files were present.

English execution includes real outputs from image conversion (including true BMP/GIF), resizer, all four compressors, QR, meme, JPG/PDF operations, audio operations, background removal, and production PDF-to-Word, enhancer, and video endpoints. The QR decoded back to the exact mixed Arabic/Spanish input. Merge/split outputs contained the expected pages. The DOCX contained the source PDF text. Rotate PDF preserved 90 degrees and produced 180 degrees after a turn. The social-size ZIP decoded to the two requested PNG dimensions.

PNG to JPG, JPG to PNG and WEBP to PNG also have Arabic/Spanish real-file execution, invalid-input and repeated-run evidence. Other language/tool combinations still need functional execution. Individual successful checks do not imply that all ten requested conditions passed for a tool.

Important evidence qualifications:

- Password values are redacted by the browser. The early length/class observations tested `<redacted>` and are invalid; subsequent evidence explicitly marks output verification BLOCKED.
- PDF to JPG rendered four pages, but download capture timed out. Download and file-content verification remain BLOCKED.
- An initial social-size ZIP path was missing. A subsequent two-size export was downloaded and both entries decoded successfully.
- Background removal's first large-image attempt lost browser responsiveness; a later 640×480 input completed and produced a valid transparent PNG. Large-image reliability is not verified.
- Backend unit tests use mocks; they do not establish live provider availability. Separately recorded live requests produced validated files.

## Regression and page coverage

PASS: `npm test` — 13 backend tests plus 131-page static audit, 129 indexable pages and sitemap URLs, zero reported problems or warnings. PASS: `git diff --check`.

Prior production desktop crawl: 129 attempted indexable routes, 120 DOM inspections completed including the later recovered Image Resizer route. Nine routes returned browser client-block errors: `/es/privacy/`, `/es/terms/`, `/ar/compress-image-to-100kb/`, `/es/compress-image-to-100kb/`, `/ar/compress-image-to-20kb/`, `/ar/compress-image-to-50kb/`, `/es/compress-image-to-20kb/`, `/es/compress-image-to-50kb/`, `/es/trim-audio-online/`. These are BLOCKED, not confirmed site failures. The two noindex tool-directory routes were NOT TESTED in a browser. The earlier per-page raw crawl file was not retained; aggregate observations are preserved here rather than fabricated into raw records.

Desktop DOM checks are not a complete visual/network/console audit. Mobile/tablet checks are BLOCKED by unavailable viewport control; local Chromium installation also failed. Core Web Vitals, complete external-link checks, complete performance measurements, and the full per-tool/per-language edge-case matrix remain NOT TESTED. Deployment and post-deployment repair verification remain outstanding at this checkpoint.
