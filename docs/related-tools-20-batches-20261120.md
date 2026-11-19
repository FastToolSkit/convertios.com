# Related tool cards for the two recent batches

On 2026-11-20, the 20 recent tools gained the established **Explore more tools** card section in English, Spanish, Arabic, and Brazilian Portuguese: 80 pages and 320 linked cards. The first batch's arrow placeholders were replaced with local illustrated SVG thumbnails; the second batch gained a new section after its guide and FAQ. Each card keeps a localized label and links to an existing tool in the same locale. The Arabic pages retain RTL layout.

`scripts/related_tool_cards.py` supplies the shared renderer, destination icons, and curated recommendations for the utility batch. `scripts/build-smart-tools.py` keeps its existing guide recommendations and calls the renderer. `scripts/build-utility-tools.py` calls it for the utility pages. The generators create the small SVG assets in `assets/related-tools/`; the browser displays them at a fixed 32 × 32 pixels with lazy loading. `smart-tools.css` adds only the image sizing rule. No external image or new library is used.

Validation performed locally:

- Both generators ran twice with identical output across 587 checked page and asset files.
- `npm.cmd test`: 31 tests passed. Site check: 546 pages, 544 indexable, 544 sitemap URLs, zero problems and warnings.
- `tests/related-tool-cards.test.js`: all 80 pages have one section, four unique, live same-locale links, localized labels, valid icon paths, stable image dimensions, and the expected heading. The 320 card links were checked.
- `python tests/browser/related-tool-cards.py`: 160 views at 320 and 1280 pixels passed, with 320 visible thumbnails, two mobile columns, four desktop columns, no horizontal overflow, and correct Arabic direction.
- `python tests/browser/utility-tools.py`: six browser utility workflows passed; `python tests/browser/artifact-tools.py`: 16 artifact page workflows passed.
- Arabic SVG-to-PNG browser smoke produced a 320 × 160 PNG and followed a related image-resizer card successfully.
- The sitemap was unchanged, so its existing lastmod values were preserved. No older tool pages, SEO titles or descriptions, canonical links, hreflang, structured data, ads, or backend handlers were changed.

The full ten-tool smart conversion browser script needs local native backend services and fixture files. This change was additionally checked through all 40 smart page layouts and the local SVG conversion workflow; it did not rerun backend-dependent conversions.
