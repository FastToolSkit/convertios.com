# Convertios — Google crawling and indexing readiness follow-up
**Audit date:** 2026-11-19  
**Site:** https://convertios.com  
**Source:** Google Search Console property `sc-domain:convertios.com` (OpenSEO), the user's local GSC XLSX exports and latest production repository.

## Scope and baseline
The November 19 coverage workbook reports **117 indexed / 139 not indexed** as of November 16; this applies to Google's 256 known URLs at that point, not all 504 current sitemap URLs. Its exclusions include 38 `Discovered - currently not indexed` and seven `Crawled - currently not indexed`.

A historic October 30 **Discovered - currently not indexed** drilldown provided **18 exact URLs**. Re-inspection on November 19 confirms:
- **8 indexed**: `/ar/pdf-tools/`, `/ar/video-to-mp3/`, `/es/ai-image-enhancer/`, `/es/merge-pdf/`, `/es/pdf-to-jpg/`, `/es/pdf-tools/`, `/es/security/`, and `/security/`.
- **10 not yet indexed** (Google either reports discovered/not indexed or URL unknown): `/ar/jpg-to-pdf/`, `/ar/video-converter/`, `/es/jpg-to-pdf/`, `/es/link-shortener/`, `/es/text-formatter/`, `/es/video-converter/`, `/es/video-to-mp3/`, `/jpg-to-pdf/`, `/video-converter/`, `/video-to-mp3/`.
- All 13 previously prioritized older pages separately checked live returned HTTP 200, self-canonicals, exactly one H1 and crawl-allowing robots directives. Legacy `.html` crawl exclusions from the earlier **Crawled - currently not indexed** export correctly redirect to slash URLs (PRs #294–#296).
- Exact *current* 38 + 7 example URL lists were not supplied by the uploaded November 19 workbooks. Do not conflate the old October 18/7 examples with current counts.

## Confirmed site-side discovery weakness and change
Before repair, an ordinary HTML-anchor crawl beginning at the English homepage could reach only **126 of 504** indexable pages (the English subset); homepage language counterparts were discoverable via XML sitemap and `hreflang`, but the homepage did not contain clickable HTML anchors to the other language homepages. The ten newly published tools in each language had only three inbound links and were two clicks away via relevant hubs.

Changes in this branch:
1. Add four visible language homepage anchors to the footer of **each of the four homepages** (EN, ES, AR, PT-BR), preserving language codes and Arabic RTL.
2. Add a compact, translated list linking directly to **all 10 new Smart Tools** from the homepage in each language, with no new CSS/JS assets or tool functionality changes.
3. Add `tests/discovery-links.test.js` to the existing test suite to enforce all **40 homepage-to-tool links**, all **16 homepage-to-homepage language links**, and **every sitemap URL reachable by ordinary HTML anchors from root**.

After repair, a local HTML-anchor BFS from the English homepage can reach **all 504/504 indexable sitemap URLs**; the three remaining inaccessible local `index.html` files are intentionally excluded `noindex` pages. The new-tool homepage links reduce their home-language depth from two clicks to one.

## Verification
- `npm test` includes full backend tests, 40 Smart Tool guide checks, newly added discovery checks, and static site audit (no SEO problems).
- Chromium at **390px mobile width** tested all four homepages (all 10 discovery anchors, all four footer language anchors, no horizontal overflow); preserved the current approved neon home theme.
- `robots.txt` allows Googlebot; `sitemap.xml` includes 504 canonical URLs (126 per language), published with reciprocal `hreflang`; no robots or sitemap changes required.
- 404 issue actions are already deployed under PRs #297–#299. Working redirects must remain, and intentionally excluded URLs should not be artificially indexed.

## What Google can and cannot be made to do
These changes improve discoverability/crawl paths. They **do not guarantee indexing**; Google independently chooses whether and when to crawl and index a page. Google Search Console URL Inspection is read-only through the connected OpenSEO action; Google's standard API does not provide a general Request Indexing endpoint for ordinary converters/articles. The Google Indexing API is limited to supported special content types, so we do not misuse it for general tool pages. IndexNow is already configured for Bing and other supported engines, with submissions on merge.

Future checks should track the **same URLs** with date and last crawl, Google-selected canonical, impressions, clicks and indexing state; don't equate 504 sitemap URLs with 504 Google-indexed URLs. If Google still declines pages after crawling, further work should evaluate original content quality, server reliability and actual query demand rather than churning URLs or artificial redirects.
