# Regression report — 12 November 2026

Baseline: `4242bbf1f7ed661acf1b8a325957b337042243f3`. Candidate changes: email opt-out comments on 11 pages, audit/test tooling and evidence documents. No conversion logic, translations, CSS, shared JavaScript, sitemap, robots, or redirect changes.

| Check | Result | Scope / limitation |
|---|---|---|
| `node --check server.js` | PASS | Syntax only |
| `node --test tests/server.test.js` | 13/13 PASS on connected Windows environment | Real local HTTP mock server; no external provider calls. Initial restricted sandbox run failed six requests due to its networking; the identical suite passed outside that environment without code changes. |
| `node tests/site-check.mjs` | PASS, 158 pages / 156 indexable / 156 sitemap URLs; zero problems or warnings | Titles, descriptions, one H1, canonicals, reciprocal hreflang, language navigation/RTL, links/assets, sitemap, robots, handlers, structured-data consistency and historical alias rules |
| `python tests/semrush-regression.py` | PASS, 159 HTML pages and 150 JSON-LD blocks | Existing schema/minification and heading checks retained |
| `python tests/browser/seo-smoke.py` | 12/12 PASS | Local EN/ES/AR Text Formatter, Link Shortener and two video tool flows. Backend and external scripts mocked; not video codec/provider validation. |
| `python tests/browser/live-pdf-tools.py` | 6/6 PASS | Production read-only page visits, synthetic local PDF processed in browser; PDF-to-JPG and Rotate PDF in EN/ES/AR. Real downloads, PDF/JPEG signatures. No backend uploads. Does not assert resulting PDF rotation metadata. |
| `python tests/browser/live-local-tools.py` | 6/6 PASS | Production page visits, synthetic image processed in browser; JPG-to-PDF and Image Converter in EN/ES/AR. Real PDF/JPEG downloads. |
| `python tests/browser/audio-qr-smoke.py` | 9/9 PASS | Isolated candidate local server; real WAV/MP3 audio downloads and QR PNG in EN/ES/AR. WAV duration/channels checked, MP3 and PNG signatures checked. No MP3 perceptual-quality or QR decode assertion. |
| `python tests/browser/contact-email-smoke.py` | 28/28 PASS | Candidate pages at 390px and 1365px, JavaScript disabled: visible correct mailto links, Arabic RTL, no horizontal overflow on nine email-link pages and three newsroom hubs; plain email preserved on ES/AR About. No email client opened or message sent. |
| Full independent HTTP crawl | 156/156 page signals PASS; one known helper target FAIL from 11 pages | Live production remains unmodified. Every page is 200, self-canonical, allowed, correct-language, with reciprocal alternates and inbound sitemap-page links. Expected existing email helper 404 remains until deployment. |
| Legacy redirect checks | 7/7 selected .html aliases PASS | All one-hop 301 to the corresponding audited 200 page; no loop in checked chains |
| `git diff --check` | PASS | No whitespace errors |
| Production build | Baseline Pages build succeeded; candidate production build NOT RUN | There is no npm build script; static HTML is copied by GitHub Pages/Jekyll. Syntax/static/browser checks run locally. No deployment permitted; candidate Jekyll environment was not reproduced. |

## Remaining risks / untested areas

- Cloudflare's deployed processing of the new comments cannot be verified before deployment. The comments are the vendor-documented mechanism. Verify the raw live HTML on all 11 pages after approval and deployment.
- The email is intentionally public; opting these instances out makes it easier to scrape. No global Cloudflare setting is changed.
- No actual Googlebot live fetch, new Rich Results Test, CrUX field metrics, or Lighthouse run. Local crawler accessibility is not proof of Google's rendering or indexing decision.
- No full historical GSC Page Indexing export was available. The 170-row matrix is complete for its stated URLs, not every historical URL in the property.
- No provider-backed video conversion, AI enhancement, or PDF-to-Word conversion was invoked during this mission. Their code is unchanged, backend unit coverage and mocked video UI flows passed.
- No sitewide native-speaker editorial review. Existing translated content and Claude's 36-page rewrite are preserved byte-for-byte outside the small public email markup.
- New browser tests use the existing Python Playwright installation. The legacy Node browser suite was not run because its Playwright module is unavailable; Python checks above provide the stated coverage.

## Reproduce after an approved deployment

Run the static suites and the three local Python smoke tests above. Run `tests/live-seo-audit.py --output <private-path.json>` for live response verification. The helper target should disappear from every page's outgoing internal links; do not turn the helper into an indexable page to satisfy the check.

Review the resulting Google records separately after Google recrawls. A passing HTTP audit and successful indexing request do not guarantee inclusion or higher rankings.
