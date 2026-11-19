# Smart Tools — Existing Tool Page Parity Review (2026-11-19)

Compared directly with `jpg-to-png/index.html` and `compress-image/index.html` from the same current `main` baseline (`ea5b37f7`).

## Aligned with existing tool pages
- Existing shared `.tool-info-block`, `.tool-info-grid` and `#tool-info-heading` pattern.
- All six established information fields: browser execution, upload requirement, third-party processing, retention, max file size and supported formats.
- Existing `.tool-description.page-guide` pattern with `#guide-heading`, useful task descriptions, step-by-step instructions, format limitations and three FAQ questions.
- Existing `.more-tools`, `.more-tools-grid`, `.more-tool-card` section with four relevant working tool destinations; additionally one localized topical Content Library link.
- Existing shared CSS design, neon header/footer, mobile accessibility and four-language localization including Arabic RTL.
- Existing canonical/reciprocal hreflang/social tags and structured data preserved. Explicit `index, follow` robots directive added to match the legacy markup.
- All generated content is maintained through `content/smart-tools/guides.json` and `scripts/build-smart-tools.py`, rather than manually patching 40 files.

## Differences that must remain accurate
- Video, OCR, HEIC, AVIF and PDF native conversions upload files to the Convertios backend. SVG rasterization and photo metadata removal run locally in the browser. Do not copy the older JPG-to-PNG page's *browser-only* privacy claim to other tools.
- The new upload interface has its own accessible control styling, since the file-processing options differ; page sections and linked-card presentation now use the same established components. This change does not claim pixel-perfect equivalence of all upload controls.
- File-size limits and input/output formats are tool-specific.
- Meta keywords are not copied; they are not necessary for Google indexing or ranking.

## Validation
- Node regression tests check all 40 generated pages against the established section conventions, all six fields, localized copy, three FAQs, four related-tool links, robots/canonical/hreflang and privacy statements.
- Chromium smoke test at 390 px visited all 40 pages, confirmed sections and links render and found no horizontal overflow.
- `npm test` and the complete site checker should pass before review/merge.
- Actual Google/Bing ranking gains cannot be proven from template parity; only post-indexation performance data can show them.

No production deployment or merge is authorized by this review.
