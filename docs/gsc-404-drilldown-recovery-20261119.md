# Convertios — exact Google Search Console 404 recovery (2026-11-19)

## Source recovered without requiring another user export

The connected user's local Downloads directory contains the existing official workbook `convertios.com-Coverage-Drilldown-2026-11-19 (1).xlsx`. Its **second worksheet** (`Table`, 9 URL examples) is the missing `Not found (404)` drilldown. The first worksheet is trend data; previous investigations mistakenly inspected only the summary sheet. URL Inspection on the connected OpenSEO property `sc-domain:convertios.com` confirmed all nine historical Google records, with last-crawl dates and referring URLs.

## Nine individual 404 examples — disposition

| Google URL | Source evidence / live finding | Action |
| --- | --- | --- |
| `https://www.convertios.com/convert/images-to-hdr` | Last crawled Nov 3, referred from old `http://www.convertios.com/`; www now redirects to apex. No HDR conversion page exists. | Keep genuine 404; no unrelated redirect. |
| `https://www.convertios.com/convert/images-to-ase` | Last crawled Nov 2, referred from old `www/?p=8`; no ASE conversion page exists. | Keep genuine 404; no unrelated redirect. |
| `https://convertios.com/ar/es/meme-generator/` | Google saw malformed double-language prefix from an ES page, last crawled Sep 12; no current link in repository. | Add 301 to `/ar/meme-generator/`. |
| `https://convertios.com/ar/es/` | Malformed prefix from ES homepage, last crawled Sep 11; no current link. | Add 301 to `/ar/`. |
| `https://convertios.com/ar/es/split-pdf/` | Malformed prefix from Spanish Split PDF, last crawled Sep 10; no current link. | Add 301 to `/ar/split-pdf/`. |
| `https://convertios.com/ai-enhance.html` | Legacy AI enhancement page alias; previously auto-redirected to nonexistent `/ai-enhance/`. | Add explicit 301 to `/ai-image-enhancer/` and also normalize `/ai-enhance/` to it. |
| `https://convertios.com/cdn-cgi/l/email-protection` | Old Cloudflare email helper, crawled June 13, with historic `contact.html` referring URL; currently no internal links. | Preserve 404; not a real content page. |
| `https://convertios.com/\${e.target.result}` | Malformed unexpanded JavaScript interpolation, last crawled June 13; current repository has no such outgoing link. | Preserve 404. |
| `https://convertios.com/remove-background` | Legacy name, crawled June 12 and referred from old `remove-bg.html`. | Add 301 to `/remove-bg/`. |

**Result:** Five exact Google 404 examples have legitimate content replacements and get targeted permanent redirects. Four are unsupported/broken resources that correctly stay 404; these should eventually drop from Google's reporting without being mapped to irrelevant landing pages. This follows Google Search Central guidance for deleted content and permanent moves.

## Implementation and verification
- Updated `_redirects` with explicit exact-match rules *before* the generic `/*.html` fallback.
- Added `tests/gsc-404-recovery.test.js` and integrated it into `npm test` to prevent regressions, assert real existing canonical destinations, and avoid redirecting the four unrelated/malformed paths.
- No SEO canonical, language templates, sitemap, robots, converter logic or other production files changed.
- Post-merge live verification is required to confirm Cloudflare serves the new 301 rules (not inferred from passing static tests).
- GSC URL Inspection data reflects Google's **stored** crawl records, not a new crawl. Reclassification is decided by Google and will lag deployment. The Page indexing screen is a report, not something we can edit.

## Open actions
- Once deployed, independently verify all five new 301s and the 200/canonical on each final destination.
- Reinspect those URLs after Google recrawls; 404s without replacements are **expected**, not additional site bugs.
- `Discovered - currently not indexed` and `Crawled - currently not indexed` require per-URL and crawl evidence; do not force pages into index or turn legitimate exclusions into redirects.
