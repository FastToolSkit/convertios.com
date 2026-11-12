# Convertios indexing recovery — 12 November 2026

## Decision

Keep the current multilingual URLs, canonicals, redirects, indexing directives, and Claude's page content. A fresh inspection of all **156 sitemap URLs** found **109 indexed, 9 discovered but not indexed, 31 unknown to Google, and 7 historical canonical mismatches**. Of the 31 unknown URLs, 27 are recently published blog pages; four are older tool pages. These observations do not establish why Google has deferred crawling or indexing.

The verified repair is small: **11 live pages expose an email-protection link that returns 404**. Nine have mailto links and two have plain email text that Cloudflare turns into links. This branch wraps only that existing public email markup in Cloudflare's documented `email_off` comments. All visible copy, email destinations, layout, tools, blog and newsroom remain intact. Expected benefit: remove broken crawler-visible contact links and preserve email access without JavaScript. This is **not a demonstrated cause of the 47 unindexed sitemap URLs**, and no traffic or indexing increase is promised.

## Repository baseline and preservation

- Original checkout: `content/adsense-tool-guides-20261030`, `fe9239e`. Initial status listed 202 paths; substantive Git diff: 42 files, 370 insertions and 3,232 deletions, plus two untracked files. No original edit was discarded or staged.
- Direct sandbox fetch failed (`getaddrinfo() thread failed to start`). Fetch succeeded through the connected Windows environment. Fresh `origin/main`: `4242bbf1f7ed661acf1b8a325957b337042243f3`; original HEAD is 31 commits behind, with no unique committed changes.
- New isolated worktree and branch: `fix/indexing-recovery-20261112`, based on that exact `origin/main`. Original dirty checkout retained unchanged.
- Reviewed Claude commit `5418a91`: distinct guides for 12 tools in EN/ES/AR (36 pages), plus additive Rotate PDF behavior. No guide or rotation code changed here.
- Reviewed merged PR #256 (content accuracy, localized metadata, navigation, indexing evidence), #257 (guarded repair workflow), and #260 (schema candidates, heading fixes, shared minification). Their changes are preserved; historical Semrush findings are not reapplied blindly.
- GitHub Pages build/deployment for baseline `4242bbf` succeeded: https://github.com/FastToolSkit/convertios.com/actions/runs/43288852949. This is a pre-existing deployment, not an action by this mission. Frontend responses identify GitHub Pages behind Cloudflare; backend `render.yaml` enables Render auto-deployment. No hosting settings changed.

## Prioritized diagnosis

| Priority | Confirmed observation | Affected URLs | Action / expected effect |
|---|---|---|---|
| P1 monitoring | Seven stored Google canonicals select old .html aliases. Every alias currently returns one-hop 301 to its clean 200 destination. | AR AI Enhancer, Image Converter, PDF-to-JPG, Split PDF, WEBP-to-PNG; EN Text Formatter and Trim Audio | Preserve working redirects. Live-test clean URLs in Search Console and request recrawl once if appropriate. Verify later canonical convergence; no new redirect code. |
| P2 repair | Live HTML links to `/cdn-cgi/l/email-protection`, which returns 404. Google also records that helper as Not found. | EN contact/privacy/terms; ES and AR about/contact/privacy/terms (11 pages) | Scoped email markup comments. Post-deployment HTTP verification remains required. |
| P2 investigation | Thirteen older tool pages have no returned crawl timestamp: nine discovered, four unknown. All are live, linked, indexable, and self-canonical. | Enumerated individually in INDEXING-MATRIX.md | Retain pages. Prioritize JPG-to-PDF and video workflows; use GSC live test and assess actual tool usefulness. No proven technical blocker. |
| P3 monitoring | All 27 new blog URLs are unknown in the inspection snapshot. | EN/ES/AR blog hubs and eight articles each | Preserve useful articles and links; monitor discovery. Do not delete or rewrite based on an early exclusion. |
| Preserve | Five initial traffic-priority URLs are indexed, Google canonical equals declared canonical. | EN/ES MP3 Cutter, AR Link Shortener, EN Audio Converter, ES JPG-to-PNG | Protect existing content and behavior. Ranking/CTR opportunity is separate from indexing recovery. |

All seven canonical-mismatch pages are class A (should be indexed); their legacy aliases are class B (should stay excluded). The two `/tools/` duplicate hubs intentionally remain noindex. The edge email helper should never be indexed. Unknown root causes remain explicitly unresolved; the matrix does not turn an inference into a diagnosis.

## Search opportunity, actual GSC data

Current connected-property query for 13 October–9 November 2026 reproduces the supplied figures. The window avoids the latest incomplete reporting days. Average position is Google's aggregate, not a live point-in-time rank.

| Page | Impressions | Clicks | Average position |
|---|---:|---:|---:|
| `/mp3-cutter/` | 1,146 | 5 | 48.9 |
| `/es/mp3-cutter/` | 464 | 5 | 45.7 |
| `/ar/link-shortener/` | 257 | 2 | 38.6 |
| `/audio-converter/` | 238 | 4 | 46.1 |
| `/es/jpg-to-png/` | 170 | 1 | 47.2 |

No keyword-volume, revenue, penalty, or additional-traffic estimate was invented. No broad content rewrite is justified by this technical investigation. Examine query intent and real conversion success before changing already-indexed high-impression pages.

## Evidence coverage and technical checks

- **OpenSEO** audit `d8f58724-46a9-4adc-b073-7e2260ec4c32` completed 12 November at 19:43 UTC: 50 pages, all reported 200/indexable; only warning was the page cap, with 106 uncrawled. It was not a full-site pass and had no Lighthouse results. Existing project context/research log and report list were empty.
- **Independent full HTTP audit:** all 156 sitemap pages returned 200 without redirects, declared exactly their own canonical, allowed Googlebot under live robots.txt, and had no meta/header noindex. Raw HTML had one H1, correct EN/ES/AR language, Arabic RTL, reciprocal EN/ES/AR/x-default alternates, and inbound links from other sitemap pages. No orphan within that graph. This reads server-delivered HTML without user interaction; it is not a Googlebot live test.
- **Sitemap:** valid XML, 156 unique HTTPS trailing-slash URLs; local checker matches indexable routes and language clusters. It is a committed static sitemap, not a runtime-generated endpoint. Root robots.txt allows crawling and references it.
- **Redirects:** seven selected .html aliases, `/index.html`, and slashless `/merge-pdf` return 301 to existing canonical pages. No loop in these checked chains. Historical noindex/crawled-not-indexed labels on aliases refer to old Google crawls, not today's HTTP response.
- **Structured data:** 150 JSON-LD blocks parse; current source retains WebPage, BreadcrumbList, articles and other supported types. PR #260 already removed unrated WebApplication candidates. Parsing is not equivalent to Google's full rich-result validation.
- **Semrush PDF (11 Nov):** 62 schema issues, nine broken internal links, one 4xx, 328 unminified resource references, two H1/title duplicates and one low-word-count page. These are historical counts. The **12 Nov mega CSV is a Semrush issue export**, not a GSC export: 100 URL rows and 62 schema-flagged pages. It identifies `/cdn-cgi/l/email-protection` as the 4xx and nine referring source pages. All nine historical source pages are among the 11 sources reproduced today; AR/ES privacy add two more current sources. CSV does not identify the exact invalid schema property. Fresh Semrush rich-result validation remains unavailable.
- **Performance/mobile:** existing shared minification retained; mobile/desktop layout checks passed on the affected email pages and blog hubs. No CrUX field data or new Lighthouse run was collected, so no Core Web Vitals pass or performance improvement is claimed.
- **Duplicates/thin content:** no new duplicated titles/descriptions or missing canonical problems in static checks. Intentional duplicate directories remain excluded. Full editorial and semantic similarity review across all languages was not performed; word-count warnings alone do not justify filler.

## Google exclusion categories

| Category requested | Actual evidence in this run | Treatment |
|---|---|---|
| Crawled, currently not indexed | Two legacy aliases, Text Formatter and Trim Audio | B; retain their 301s, focus on clean destination |
| Discovered, currently not indexed | Nine sitemap pages | A; investigate crawl scheduling, retain valid signals |
| Duplicate without user-selected canonical | Not observed in sampled variants or 156-page sweep | Unknown category coverage; no invented count |
| Duplicate, Google chose different canonical | Seven clean sitemap pages | A; existing one-hop redirects and correct declared canonicals preserved |
| Alternate page with proper canonical | Not observed in this sweep | No category-wide claim; retain legitimate alternate exclusions |
| Page with redirect | `/index.html` in GSC | B; expected |
| Soft 404 | Not observed in inspected records | No confirmed defect; Google UI coverage export still needed for exhaustive historical URLs |
| Not found | Email helper, GSC and live 404 | B helper; repair its source links |
| Blocked by robots.txt | Not observed; live sitemap pages allowed | No directive change |
| Excluded by noindex | Two duplicate hubs and two stale legacy alias records | B; preserve hubs, aliases now redirect |
| Server errors | None among 156 current live page responses | No evidence of persistent server error; not an uptime guarantee |

The November 12 **GSC coverage export itself was not found** among the named uploaded evidence. Direct GSC URL Inspection provides actual per-URL records, but cannot enumerate all historical excluded URLs outside the sitemap. Scope is 156 sitemap URLs plus 14 targeted variants/helpers, not the whole property's historical coverage inventory. `?q=pdf` and `/404.html` are exploratory samples and are unknown to Google; their inclusion is not evidence of a Google defect.

## Approval boundary and verification after deployment

This branch changes no redirects, public routes, indexing directives, DNS, hosting, tools or shared assets. It makes the already-public support email available in raw HTML, so it may be easier for email harvesters to read. Cloudflare documents the scoped opt-out; it does not disable protection elsewhere.

After explicit approval to merge/deploy, rerun `python tests/live-seo-audit.py --output <private-json-path>`. Confirm the 11 email source pages expose no helper link and preserve usable email markup. Until that deployment, the live audit is expected to report the existing helper 404. Do not change its status merely to clear a crawler warning.

In Google Search Console, live-test selected clean nonindexed URLs, request indexing once where appropriate, then monitor crawl dates and selected canonicals. Repeated unchanged requests do not accelerate crawling and requests do not guarantee indexing. This mission made no submission, merge or deployment.

## Files and sources

- `INDEXING-MATRIX.md`: desired index state, actual Google state, cause/uncertainty, action, priority, verification and crawl date per inspected URL.
- `google-inspection.json`: 166 original per-URL Google records; `additional-inspection.json`: four targeted variants.
- `live-http.json`: 156 current HTTP page checks, 11 helper-link sources, and 12 additional response checks.
- `search-performance.json`: connected GSC page-level data for the stated window.
- `REGRESSION.md`: tests, build limitations and residual risk.
- Cloudflare scoped email handling: https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/
- Google recrawl guidance: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- Historical audits: `docs/adsense-index-audit-20261112/` and `docs/semrush-20261112/`.
