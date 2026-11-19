# Utility expansion batch 2 — implementation and QA

Branch: `feat/utility-expansion-batch2-20261119`. Draft PR #303 contains all ten approved tools. Production has **not** been merged or deployed.

**Current state (November 19):** all 40 localized tool pages have been implemented, the static SEO validator passes for 544 indexable sitemap URLs, and all seven Linux PDF/XLSX fixture tests pass without skips. The real HTTP integration suite has also successfully generated and inspected invoice PDF, CSV/XLSX round-trip, compressed PDF, and searchable PDF through the Express backend. The original six browser utilities have independent unit/browser verification. The existing production Docker regression job is the remaining workflow check before considering release.

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

## Four additional server-backed tools — verified

1. **Invoice Generator:** ReportLab PDF with Decimal totals, taxes, currencies, dates, logo, Noto fonts and Arabic shaping. Verified actual downloaded PDF and extracted totals.
2. **CSV ↔ XLSX:** streaming spreadsheet import/export with sheet selection, encodings, delimiter control, formula-safe cells and ZIP expansion limits. Tested both API directions; fixed extensionless multer uploads and missing streaming worksheet dimensions.
3. **Compress PDF:** Ghostscript processing with measured byte-size gain, unchanged page count/geometry and no-gain error. Passed Linux fixture test and actual HTTP PDF download.
4. **Searchable PDF OCR:** Poppler rasterization and Tesseract invisible searchable text layer, 4 OCR languages and bounded page counts. Passed Linux real-fixture text extraction/geometry test and actual HTTP download.

For complete CI setup and security gates, see [the stage 2 QA report](utility-expansion-stage2-qa.md). **Do not merge or deploy without explicit approval.**
