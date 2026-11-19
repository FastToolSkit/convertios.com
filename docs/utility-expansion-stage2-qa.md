# Stage 2 QA — four artifact tools

Status: **all ten tools implemented and committed in draft PR #303; real artifact and API acceptance passed**. Production not merged or deployed.

## Code added

- `backend/utility_artifacts.py`: invoice PDF, CSV ↔ XLSX, PDF compression, scanned PDF OCR. Inputs are local generated paths in disposable job directories; no arbitrary URL fetch. CPU, address-space, output-size and wall-clock limits apply on Linux. PDF page dimensions/count and XLSX ZIP expansion are bounded.
- `backend/smart-tools.js`: `/convert/artifact/:tool` and workbook sheet discovery with upload caps, rate limiting, exclusive jobs, coded errors and cleanup after response completion.
- `requirements.txt` and `Dockerfile`: openpyxl, pypdf, Arabic shaping, Ghostscript and Noto fonts added to the production image.
- `js/artifact-tools.js`, generator and localized copy: 16 pages in EN/ES/AR/PT-BR with Business, Spreadsheet & Data and PDF discovery links, canonical/hreflang/schema, Arabic RTL and measured compression bytes.

## Checks run on this Windows sandbox

| Check | Result |
| --- | --- |
| `python -m py_compile backend/utility_artifacts.py scripts/artifact_content.py scripts/build-utility-tools.py` and `node --check` on both changed JS files | Passed |
| `npm.cmd test` | 29 tests passed; SEO audit: 544 sitemap URLs, 0 problems, 0 warnings |
| `python tests/browser/utility-tools.py` | Original six tools passed; JSON and ZIP downloads verified |
| `python tests/browser/artifact-tools.py` | 16 localized pages passed; invoice total preview, XLSX sheet selection, download links and no-gain state. Backend responses in this browser test are deterministic fixtures. |
| `python -m unittest -v tests/test_utility_artifacts.py` | 3 passed (cent math/validation, PDF bounds, XLSX ZIP rejection), 4 skipped (actual invoice/workbook/compression/OCR artifacts) |
| Local backend HTTP rejection | Malformed PDF returned 422 `INVALID_FILE`; missing converter upload returned 400 `INVALID_FILE` |
| Generator idempotence and sitemap set comparison | Checked output hashes stable; all 528 committed URLs retained among 544 |
| `git diff --check` | Passed; Git only reported Windows line-ending conversion notices |

The first six generated utility pages are not modified in the stage 2 working tree. The current static audit reports 546 pages, 544 indexable and 544 sitemap URLs.

## Historical sandbox limitations (subsequently resolved)

The sandbox has no local ReportLab, openpyxl, Ghostscript, Poppler or Tesseract binaries. Python package download was blocked by network policy. Docker and WSL are unavailable in this sandbox. Therefore the four real artifact tests could not run here. In a Docker-capable checkout, build the production image and run `python -m unittest -v tests/test_utility_artifacts.py` **inside an image with the production requirements, fonts and binaries**. Confirm all seven tests run with zero skips, then inspect invoice text/position/logo, actual XLSX cells and CSV formula protection, compression bytes and page legibility, and OCR text alignment on the output files. Run the local browser smoke against the real backend as a final integration check.

The initial sandbox could not commit; the authorized development session committed and pushed the implementation to draft PR #303.

## Additional independent Windows verification — 19 November 2026

The authorized Windows QA environment (outside CodexSandboxOffline) installed the production-pinned artifact dependencies in an isolated Python virtual environment. Using explicit test-only Windows font overrides (Arial and Tahoma), the **real invoice PDF artifact test passed**, including extracted invoice number, amount/tax totals, embedded logo, single A4 page and text geometry. The **real CSV/XLSX round-trip and workbook sheet test passed** under openpyxl 3.1.5. The full Python artifact suite ran **5 passed, 2 skipped** (only Ghostscript compression and Poppler/Tesseract OCR). The repository's `npm.cmd test` still passed **29/29** with **544 sitemap URLs, zero SEO problems/warnings**.

A dedicated GitHub Actions Linux artifact gate is now included in `.github/workflows/utility-artifacts-qa.yml`. It installs production-like Ghostscript/Poppler/Tesseract/Noto fonts plus pinned Python libraries and **fails if any artifact test skips**. Do not merge until this workflow passes, and perform a live-backend HTTP smoke before deployment.

## Linux CI artifact and HTTP acceptance — PASS

- GitHub Actions job `artifact-fixtures` (run 44598790868) successfully ran all seven production-like real artifact fixture tests on Ubuntu using Ghostscript, Poppler, Tesseract and Noto fonts, with **zero skips**.
- Additional HTTP integration was added in `tests/artifact_http_real.py` and tested through the actual Express backend. It caught two regressions in CSV↔XLSX: extensionless temporary uploads and streaming worksheets without dimension metadata. Both have been repaired and covered by regression tests.
- The latest `artifact-fixtures` check (run 44598790868 with follow-up HTTP fixes through commit `76ee86ae`) passed, including real downloaded invoice PDF, XLSX/CSV, compressed PDF and searchable OCR PDF. This is a branch test, not a production deployment.
- The static Pages build passed for the same stage with 544 indexable sitemap URLs.
- Remaining release requirements: preserve the existing smart-conversion Docker QA result, final deployment safety review, and explicit owner approval before merge/deployment.
