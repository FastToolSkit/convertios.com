# Google Search Console canonical drilldown — 19 November 2026

## Uploaded exports inspected
- `convertios.com-Coverage-Drilldown-2026-11-19.xlsx`: issue is **Duplicate, Google chose different canonical than user**, with 21 exact example URLs in the Table sheet.
- `convertios.com-Coverage-2026-11-19(1).xlsx`: aggregate snapshot reports **117 indexed / 139 not indexed**; the 139 comprise 56 redirected, 38 discovered-not-indexed, 21 different canonical, 9 not found, 7 crawled-not-indexed, 6 noindex and 2 alternate-with-canonical. This workbook **does not** list individual 404 URLs.

## Exact 21 URLs audited
Seven clean URLs: `/ar/webp-to-png/`, `/text-formatter/`, `/trim-audio-online/`, `/ar/ai-image-enhancer/`, `/ar/image-converter/`, `/ar/split-pdf/`, and `/ar/pdf-to-jpg/`. Each currently returns 200 and is included in the sitemap with a self-canonical; Google still reports an older .html-selected canonical for these.

Fourteen legacy .html URLs: `/ar/faq.html`, `/ar/compress-image-to-50kb.html`, `/ar/remove-bg.html`, `/ar/about.html`, `/ar/word-counter.html`, `/ar/privacy.html`, `/ar/audio-converter.html`, `/ar/security.html`, `/ar/password-generator.html`, `/ar/compress-image-to-100kb.html`, `/ar/qr-generator.html`, `/ar/audio-speed-changer.html`, `/ar/other-tools.html`, and `/ar/terms.html`. All 14 currently return one-hop 301 to their existing trailing-slash URLs.

**Outcome:** 21/21 HTTP checks match the intended URL consolidation. There is no confirmed live redirect or canonical error to repair within these 21. Changing these redirects merely to erase an exclusion total risks weakening canonicalization.

**Intermittent availability evidence:** An initial 504-page live crawl saw a single 503 for `/ar/heic-to-pdf/`; four immediate independent follow-up requests returned 200 with normal Arabic RTL HTML. This does not establish a persistent canonical/HTML defect, but does warrant monitoring edge/server 5xx logs. The crawler now makes up to two bounded retries for transient 429/502/503/504 responses and records the attempt count rather than misclassifying a temporary server error as absent hreflang or noindex markup.

## Regression protection
The existing read-only `tests/live-seo-audit.py` now checks all **21** drilldown examples: 7 clean canonical URLs through the full sitemap crawl, plus their old .html aliases and the 14 listed historic .html URLs as explicit 301-to-clean targets. The same audit checks language consistency, self canonicals, reciprocal hreflang, robots and inbound internal links for the 504 current sitemap pages.

## Remaining evidence and Google actions
- **404:** obtain Google Search Console > Page indexing > Not found (404) > Examples > Export. The overall coverage workbook does not disclose these 9 paths. One old `/cdn-cgi/l/email-protection` helper is known from November 12 history; it was not linked by the latest crawl and should not be turned into a new landing page.
- **Validation:** The canonical drilldown's status is “Started” — this is Google's revalidation state, not a failed deploy or a completed index.
- **Newly launched content:** automated IndexNow submissions to Bing-compatible engines already returned HTTP 200. Google's URL Inspection read state is “unknown” for all 40 new localized tool pages on publication day, not grounds for mass rerouting or duplicated submissions.
- **Google indexing requests:** Standard Search Console API can inspect status but cannot request indexing of arbitrary pages; manual Request indexing is available in the URL Inspection interface, subject to Google's limits and decisions.

No production site files, redirects, robots rules, or new tools were modified by this PR. Do not claim the GSC coverage count will become zero: intentional redirects, noindex and alternate canonical exclusions should remain. 
