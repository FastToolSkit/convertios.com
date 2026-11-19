# Utility expansion batch 2 — implementation and QA

Branch: `feat/utility-expansion-batch2-20261119` from `819e626c`. No deployment, push, PR or merge was performed.

**Commit status:** implementation and QA are complete, but this execution environment cannot write Git metadata. The worktree's `.git` points to `C:/Users/ASUS/convertios.com/.git/worktrees/convertios-utility-batch2`, outside its only writable root. `git add` and `git commit` both failed to create `index.lock` with "Permission denied". Files are left in the working tree for a writable session to commit; the worktree is therefore not clean. No remote commit was attempted because pushing was explicitly excluded.

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

`scripts/build-utility-tools.py` owns these 24 pages, localized homepage discovery links, categorized All Tools sections, and sitemap entries. It is idempotent and does not edit the existing smart-tool generator. Each page has a canonical, reciprocal hreflang set, OG metadata, WebApplication and BreadcrumbList structured data, accessible form controls, localized guidance, and a link back to All Tools. Existing homepage smart-tool cards remain as they were.

## QA performed

Reproduce from the repository root on Windows:

```powershell
python scripts/build-utility-tools.py
npm.cmd test
python tests/browser/utility-tools.py
git -c safe.directory=C:/Users/ASUS/convertios-utility-batch2 diff --check
```

- `npm.cmd test`: 29 tests passed; static validator reports **530 pages, 528 indexable, 528 sitemap URLs, zero problems and zero warnings**.
- Browser smoke used headless Chrome against a local static HTTP server. It exercised all six tools, a real JSON download, a real ZIP download opened with Python `zipfile` and checked for original bytes, JSON syntax failure, a catastrophic regex stopped by the 250 ms timeout, Arabic RTL, and mobile horizontal overflow checks on all six pages. Passed.
- The original sitemap contained 504 URLs; all 504 are still present, with 24 new localized URLs. Generator rerun left checked output hashes unchanged.
- Existing redirect, Content Library, IndexNow and server files were not changed.

When Git metadata is writable, commit the implementation and this QA record on the current branch. The untracked `docs/utility-expansion-batch2-mission.md` is the owner-approved brief and belongs with the QA record.

## Approved tools not shipped

The remaining four have **no production page, sitemap entry, or claimed endpoint**:

1. **Compress PDF:** the current deployment has no bounded PDF optimization pipeline with controlled image recompression, preservation checks, measured before/after bytes and source retention when the result is larger. PDF to text is a different existing operation.
2. **Searchable PDF OCR:** existing Tesseract use extracts text from images. It does not create a selectable, correctly positioned PDF text layer. This needs a page rasterization/OCR/PDF overlay pipeline plus multilingual scanned-PDF fixtures and page alignment checks.
3. **Invoice Generator:** the repository has ReportLab but no invoice data model and PDF renderer covering validated totals, taxes, currency, logo and embedded fonts for the four languages (especially Arabic). A print-only page would not meet the PDF download requirement.
4. **CSV ↔ Excel Converter:** the deployment has no XLSX dependency or safe bounded workbook parser/writer. This needs sheet selection, encoding/delimiter controls, formula-safe cells, ZIP bomb limits and real workbook artifact tests in both directions.

These tools should be implemented and tested before adding their categories or pages. Business Tools is therefore not shown as an empty category.
