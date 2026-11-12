# Convertios Semrush repair, November 12, 2026

## Inputs and scope
- Semrush "Site Audit: Issues", generated November 11, 2026 (10 pages). The PDF reports overall issue counts, **not a per-URL or per-property issue export**.
- Google official Software app markup requirements: https://developers.google.com/search/docs/appearance/structured-data/software-app
- Original static source: GitHub main commit `551acb7` after PR #257; prior SEO/content corrections in PR #256 were retained.
- Current fixes prepared on separate branch `fix/semrush-verified-repairs-20261112`.

## Confirmed repairs

| Reported finding | Root cause and action | New code-verification result |
| --- | --- | --- |
| 62 invalid structured data items | Source has 84 `WebApplication` nodes across 3 languages with free-price offers but **no genuine ratings or reviews**, a required Google software-app rich-result field. Without making up reviews, remove app-rich-result candidates from all 84 pages; preserve WebPage and BreadcrumbList (plus FAQPage where applicable). This is a **likely** explanation of the 62 Semrush findings, not proof of exact Semrush URLs (PDF omits them). | 0 unrated WebApplication candidates remain; all 150 JSON-LD blocks parse. |
| 2 H1/title duplicates | Same text in Arabic and Spanish Contact page title and H1. Make unique useful titles. | 0 title/H1 exact duplicates among 159 HTML pages. |
| Thin Arabic audio-tools hub | Improved in earlier merged PR #256. | Page retains its helpful workflow content. |
| 11 heading hierarchy skips (from postdeploy OpenSEO audit) | Insert meaningful localized H2 section labels above the first H3 while keeping cards and visual layout unchanged. | 0 heading skips in the 11 identified pages. |
| 3 short Arabic descriptions / 1 long Arabic title | Improve the text on `ar/compress-image-to-20kb/`, `ar/merge-pdf/`, `ar/split-pdf/` and shorten `ar/image-tools/` title. | Updated on source, without modifying canonical or hreflang. |
| 328 unminified CSS/JS references | 160 pages referenced `style.css` and `script.js`, accounting for 320 shared references (the prior report's 328 is crawl-specific). Create maintained `style.min.css` and `script.min.js`; switch all 160 HTML pages (including 404) to version-stamped minified files. Original readable sources remain in place. | 160 HTML files now use two minified assets, with no shared unminified references. |
| Additional CSS defects | CSS minifier exposed a stray closing brace, an unclosed `.tool-hero p` selector and orphan declarations; fix all three. | Clean CSS minification without parser warnings. |

### Other original Semrush categories

- **9 broken internal links:** a complete offline link target resolver across 159 HTML pages found **zero local missing links**. The previous post-deploy HTTP audit confirmed all 156 sitemap URLs reachable with HTTP 200. However, the Semrush PDF provides no broken source/target URL pairs, so **the 9 historical alerts cannot be individually matched or definitively closed**. On re-crawl, export the issue details and verify any remaining 4xx, including possible Cloudflare email-obfuscation URL crawl artifacts.
- **1 reported 4xx:** no exact URL in the PDF; must confirm after new crawl. The site's 404 response for non-existing pages is appropriate, but any broken internal path should be corrected.
- All other zero-count categories (sitemap, robots, hreflang, HTTPS, etc.) are not changed.

## Measured asset effect
- `style.css` source ~61 KB -> `style.min.css` ~47 KB (about 23% smaller).
- `script.js` source ~15 KB -> `script.min.js` ~10 KB (about 36% smaller).
- With the two shared assets, each page loads approximately 19 KB fewer uncompressed bytes. Compression/network impact can differ; this is not a measured Core Web Vitals result.

## Regression evidence
- `npm test`: 13 backend tests passed; site check 158 pages, 156 indexable and 156 sitemap URLs, 0 errors/warnings.
- `python tests/semrush-regression.py`: 159 HTML pages, all JSON-LD blocks valid, no app-rich-result candidates, 0 exact title/H1 matches, 11 heading checks clean, shared minified bundles found.
- Real browser Playwright against an **isolated local copy**, using real downloadable files, passed 12/12 checks: JPG-to-PDF, Image Converter, PDF-to-JPG and Rotate PDF across English, Spanish and Arabic. It did not modify production.
- `git diff --check` passed after consistent LF normalization.

## Regenerate minified files (source files remain readable)

```sh
npx --yes clean-css-cli@5.6.3 -o style.min.css style.css
npx --yes terser@5.51.2 script.js --compress --mangle --output script.min.js
python scripts/stamp-assets.py
npm test
python tests/semrush-regression.py
```

On Windows, `stamp-assets.py` can write CRLF in modified HTML; normalize line endings before `git diff --check` to avoid unrelated diffs. Do **not** edit minified files manually.

## What cannot be marked complete yet
- A fresh complete **Semrush site-wide recrawl and per-URL issues export**. This report does not contain that data. It is not accurate to claim all 62 original Semrush issues were individually proven or eliminated until that recrawl.
- Google Search Console indexing: Google decides which URLs to index; code cleanup doesn't force 47 historical exclusions to index.
- AdSense: still under review/rejected until Google approves it; no automatic resubmission.
- Optional performance improvements to other third-party/local assets must be based on actual waterfall data; this batch targets the 320 most common shared references.

## Deployment controls
- All changes remain on a dedicated branch until code review; no production/backend/server/Rotate PDF behavior was intentionally changed.
- Recheck live URL responses, canonicals, hreflangs and a small real-file browser sample after deployment.
