# Utility expansion batch 2 — implementation and QA

Branch: `feat/utility-expansion-batch2-20261119`. Draft PR #303 is open. No push, merge, or deployment was performed in stage 2.

**Commit status:** the first six tools are committed at `b971d603`. Stage 2 changes are uncommitted. This sandbox cannot write Git metadata because the worktree's `.git` points outside its writable root. The four new processors have not passed production artifact tests, so this branch is **not release ready**.

## Shipped in this branch

Six working browser tools, each with English, Spanish, Arabic RTL and Brazilian Portuguese pages:

| Tool | Behavior verified | Processing boundary |
| --- | --- | --- |
| JSON Formatter and Validator | Pretty or compact JSON, parse error location, copy and JSON download | Browser, 2 MiB input |
| JSON ↔ CSV Converter | Both directions, nested object flattening, CSV quoting, delimiter choice, UTF-8 or Windows-1252 file input, safer formula cells | Browser, 2 MiB input, 10,000 rows and 500 columns |
| Regex Tester | Matches, numbered/named captures, flags, substitution, worker termination after 250 ms | Browser, 500 character pattern, 20,000 character input, 200 listed matches |
| UTM Campaign Builder | Encoded parameters, existing query and fragment retained, repeatable copyable rows | Browser; HTTP(S) URL only |
| SEO and Social Preview | Search and social mockups from manually entered title, description and optional HTTPS image URL | Browser; does **not** fetch remote metadata; image URL loads in the user's browser |
| Bulk File Renamer | Literal replacement, case, sequence, case-insensitive collision suffixes, preview, valid downloadable ZIP with original bytes | Browser, 20 files/25 MiB total; executable extensions and unsafe names refused; ZIP stores, does not recompress |

The JSON ↔ CSV tool intentionally returns flat text values when converting CSV to JSON. Nested JSON objects become escaped dotted column names going to CSV; arrays become JSON text. Empty and null values lose their distinction in CSV. Its page explains those limits. The regex match list follows the `g` flag; replacement follows standard JavaScript `String.replace` behavior. The SEO preview is illustrative because search and social platforms may choose different text/layout.

`scripts/build-utility-tools.py` owns these 24 pages plus the 16 new stage 2 pages, localized homepage discovery links, categorized All Tools sections, and sitemap entries. It is idempotent and does not edit the existing smart-tool generator. Each page has a canonical, reciprocal hreflang set, OG metadata, WebApplication and BreadcrumbList structured data, accessible form controls, localized guidance, and a link back to All Tools. The six original utility pages remain byte-for-byte unchanged in the stage 2 working tree.

## QA performed

Reproduce from the repository root on Windows:

```powershell
python scripts/build-utility-tools.py
npm.cmd test
python tests/browser/utility-tools.py
git -c safe.directory=C:/Users/ASUS/convertios-utility-batch2 diff --check
```

- `npm.cmd test`: 29 tests passed; current static validator reports **546 pages, 544 indexable, 544 sitemap URLs, zero problems and zero warnings**.
- Browser smoke used headless Chrome against a local static HTTP server. It exercised all six tools, a real JSON download, a real ZIP download opened with Python `zipfile` and checked for original bytes, JSON syntax failure, a catastrophic regex stopped by the 250 ms timeout, Arabic RTL, and mobile horizontal overflow checks on all six pages. Passed.
- All 528 URLs from the first committed batch remain in the 544-URL sitemap. Generator rerun left checked output hashes unchanged.
- Redirects, Content Library, and IndexNow files were not changed.

The original six-tool browser smoke still passes. Stage 2 details and the remaining release gate are in [the stage 2 QA report](utility-expansion-stage2-qa.md).

## Stage 2 implementation state

Four routes, forms and localized pages have been added in the working tree, but the actual artifact processors still need execution in the production Python image before commit or release:

1. **Invoice Generator:** server-side ReportLab renderer, decimal line/tax calculation, date and field validation, sanitized PNG/JPEG logo input, and embedded Noto Latin/Arabic fonts with Arabic shaping. PDF text/geometry/logo fixture test exists but was skipped locally because ReportLab and the Docker fonts are unavailable.
2. **CSV ↔ XLSX:** openpyxl reader/writer, sheet discovery/selection, encoding and delimiter controls, text-only CSV import, formula-safe CSV export, 6 MiB ZIP and expansion checks. Real workbook round-trip test exists but was skipped locally because openpyxl is unavailable.
3. **Compress PDF:** Ghostscript optimization with page count/geometry verification and strict smaller-byte check. Real compression fixture test exists but was skipped locally because Ghostscript and ReportLab are unavailable.
4. **Searchable PDF OCR:** Poppler rasterization, Tesseract searchable PDF per page, merged downloadable PDF, language choice and 10-page limit. Real OCR text/geometry fixture test exists but was skipped locally because Poppler and Tesseract are unavailable.

The local browser test uses deterministic backend responses; it verifies forms and downloads but does not establish that the four Python processors produce correct files. Do not merge or deploy until the skipped artifact tests pass inside a build of the production Docker image and the produced PDFs/XLSX are inspected.
