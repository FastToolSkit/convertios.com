# CODEX IMPLEMENTATION — Convertios Utility Expansion Batch 2 (approved by owner, 19 Nov 2026)

You are working in an **already-existing production website**. Repository: FastToolSkit/convertios.com. Branch: feat/utility-expansion-batch2-20261119. Worktree: C:\Users\ASUS\convertios-utility-batch2. Base: latest fetched origin/main commit 819e626c. The owner explicitly APPROVED building these 10 tools, expanding into new categories rather than QR scanning or image cropping.

## Ten approved genuinely working products
1. Compress PDF — real measurable compression including sensible options; report actual output bytes; warn/retain source if nothing smaller.
2. Searchable PDF OCR — scanned PDF => downloadable searchable PDF with selectable text layer correctly located, not just text extraction.
3. Invoice Generator — logo, client, line items, taxes, currencies, invoice number/dates, correct PDF download.
4. CSV <-> Excel Converter — both CSV to XLSX and XLSX to CSV; encoding, delimiters, sheet choice where possible, safe spreadsheet formulas.
5. JSON <-> CSV Converter — both directions, nested flattening and clear data-shape handling.
6. Bulk File Renamer — preview, replace, case, sequence rules, duplicate collision handling, ZIP with renamed files.
7. JSON Formatter and Validator — parse errors with location, minify/pretty-print, optional collapsible viewer, clipboard/download.
8. Regex Tester — matches, captures, flags, safe bounded input and pattern, timeout or no catastrophic hangs, substitutions where safe.
9. UTM Campaign Builder — source/medium/campaign etc, proper URL encoding preserving query & fragments, repeatable rows/copy.
10. SEO and Social Preview — URL or manual metadata input, Google snippet and social card previews; never claim to fetch remote metadata where CORS blocks; safe server-side metadata inspection if feasible with SSRF protections.

## Nonnegotiable
- **No placeholders, empty buttons, mock conversions, misleading claims, invented backend capabilities, or partially functioning production pages.** If a tool is too complex, leave it unshipped and note precise blockers; deliver independently working tools first.
- Inspect existing code/dependencies/repo structure and existing tool slugs before change. Do NOT duplicate existing tools.
- Preserve all 504 sitemap URLs, live tools, Content Library, homepage design, Arabic RTL, proper ES/PT-BR, navigation, SEO signals, IndexNow workflows, 301s, tests. Work only in this isolated branch; do NOT merge or deploy.
- Use honest browser/server file handling; show privacy and actual server processing limitations. Uploaded files must not be persisted; safe limits, anti-zip-slip, no executable uploads, avoid SSRF and unbounded memory/CPU.
- New categories: Business Tools (invoice), Spreadsheet & Data (CSV/Excel, JSON/CSV), Developer Tools (JSON validator, regex), Marketing & SEO (UTM, SEO social previews), File Management (bulk renamer); add PDF tools to existing PDF category. Existing All Tools directory, localized homepages etc must show tools in correct categories.
- All tools EN/ES/AR/PT-BR, accessible responsive high-quality UI consistent with existing Convertios neon design, proper canonical / sitemap / hreflang / meta OG / structured data, actual explanatory content (not mass generic placeholders), updated navigation and inbound links. New pages only when feature actually functional. New smart-tool section should not regress.
- Apply existing architecture generators where applicable (scripts/build-smart-tools.py); avoid manually patching generated source if generator overwrites changes. Don't overstuff homepage.
- Test actual generated artifacts with fixtures, not just mocked API. Run npm test and browser smoke where feasible; tests for failure modes/corner cases; record reproducible QA report in docs/utility-expansion-batch2-20261119.md.
- Commit logical stages to this branch. Leave worktree clean after committing. Don't push/PR until actual validated implementation; no forced pushes, resets, deletes or unrelated modifications. If full set proves impossible in available resources, prioritize a tested subset and document remaining tools honestly; never treat plan as finished.

## Execution
First inventory existing capabilities and tool generation. Then develop real working code plus tests. Continue as far as possible. At end write concise implementation/QA status and commit(s), with exact completed tools and exact incomplete blockers. Code quality matters much more than raw 10 count.
