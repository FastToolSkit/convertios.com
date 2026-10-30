# Google indexing audit — 30 October 2026

## Decision

**No active indexing defect was found on the 129 current sitemap pages. Do not rewrite content, change current canonicals, remove intentional noindex directives, or change converters based on the historical exclusion totals.**

One broken historical alias is verified: `https://convertios.com/ai-enhance.html` returns 301 to `https://convertios.com/ai-enhance/`, which returns 404. The old SEO report records that alias as a formerly incorrect AI Image Enhancer canonical. Its current impact on Google is unknown. A narrowly scoped edge redirect is proposed below; it has not been deployed or represented as a tested fix.

This branch contains audit tooling and evidence only. There are no production-code repairs to deploy. All existing HTML, translations, canonicals, redirects, converter code, Rotate PDF implementation, and IndexNow files remain identical to the fetched baseline.

## Baseline and preservation

- Repository: `FastToolSkit/convertios.com`.
- Fetched `origin/main`: `8994e744d2a5d377289d386c35672ae375a065af` (IndexNow merge).
- Branch: `fix/google-indexing-audit-20261030`.
- The supplied workspace was empty and was not a Git checkout. A new clone was created in `repository`; its status was clean before branch creation. No existing local work was overwritten, stashed, reset, or removed.
- No merge, deployment, Search Console submission, IndexNow submission, or edge configuration change was performed.

## Evidence and scope

- [Per-URL matrix](url-matrix.md): 666 distinct URLs, including each URL's observed response, declared canonical, sitemap inclusion, technical eligibility, classification, and proposed action.
- [Machine-readable evidence](evidence.json): response status, Location, canonical, hreflang, robots metadata, X-Robots-Tag, HTTP Link, content type, body digest, internal links, local metadata, and full sitemap/robots text.
- [Validation result](validation.json): 129 sitemap pages, zero sitemap signal issues.
- [Read-only audit tool](../../scripts/audit-indexing.py): `python scripts/audit-indexing.py`; regenerate the matrix without network traffic using `python scripts/audit-indexing.py --report-only`.

The crawl used public GET requests from one network location, six concurrent requests at most, no authentication, and no Googlebot impersonation. Each redirect hop was inspected independently. Results are a snapshot, not proof of what Googlebot previously saw. The supplemental query and verification checks followed the main crawl on the same date. The tool requires Python 3.11 and `curl.exe` on Windows. Re-running it replaces the dated evidence files.

No URL-level Search Console export or URL Inspection evidence was supplied. Therefore **every URL's Search Console exclusion reason and Google-selected canonical is explicitly unavailable**. Observed canonical tags are not Google's selected canonicals. This report cannot identify which audited URLs belong to the historical 116 exclusions, or assert that any historical exclusion has been resolved.

## Verified current behavior

| Check | Result |
|---|---|
| Published sitemap | 129 unique URLs; XML parses; published text matches repository sitemap |
| Language coverage | 43 English, 43 Arabic, 43 Spanish URLs |
| Sitemap page responses | 129/129 direct HTTP 200 |
| Canonicals | 129/129 exactly one absolute HTTPS self-canonical |
| Hreflang | EN/AR/ES/x-default present; HTML and sitemap agree; all targets are sitemap pages; reciprocal groups agree |
| Indexing directives | No sitemap page has observed meta or HTTP noindex; robots.txt allows crawling |
| Conflicting HTTP canonical headers | None observed |
| Published/source metadata | Canonical, hreflang, and robots metadata agree on all 131 published source pages |
| HTTP versions | All 129 sitemap URLs redirect permanently to HTTPS equivalents |
| Explicit index.html versions | All 129 redirect permanently to preferred URLs |
| Slashless directory versions | All 128 non-root sitemap routes redirect permanently to slash URLs |
| Legacy .html variants | All 128 non-root sitemap routes redirect permanently to their current canonical pages |
| Host variants | HTTPS www redirects to HTTPS apex; HTTP www takes two permanent hops via HTTPS www |
| Query variants | Nine samples: home, Rotate PDF, AI Image Enhancer in each language return 200 and canonicalize to query-free URLs |
| Internal page links | No repository link to a missing or redirected page; live HTML adds one distinct email-protection endpoint, discussed below |
| Intentional duplicate directories | /tools/ and /ar/tools/ are 200, noindex/follow, canonicalized to their same-language all-tools pages; absent from sitemap |
| Missing-page response | Invented missing route and unpublished tool-template return genuine 404 with noindex |
| IndexNow key | HTTP 200; published text digest matches source key file |

Across all 666 requests: **143 HTTP 200, 518 HTTP 301, five HTTP 404, zero network errors**. These are audit request counts, not indexed or excluded URL counts. The 200 responses include nine query variants and three non-HTML resources. The redirect total includes controls and the historical broken alias. No soft-404 conclusion is inferred from response codes alone, but all sitemap pages also match the expected local metadata and passed static content checks.

## Prioritized findings

### P2 — confirmed broken historical alias; recovery proposed, Google impact unresolved

| URL | Current result | Canonical | Sitemap | Action |
|---|---|---|---|---|
| https://convertios.com/ai-enhance.html | 301 → /ai-enhance/ → 404 | None | No | Proposed direct 301 to /ai-image-enhancer/ |
| https://convertios.com/ai-enhance/ | 404, noindex/follow | None | No | Proposed direct 301 to /ai-image-enhancer/ |

Evidence of historical relevance: `docs/convertios-seo-intelligence-report.md` records `/ai-enhance.html` as the old incorrect canonical. Current `/ai-image-enhancer/` and its Arabic/Spanish counterparts are healthy and self-canonical. No current source page links to the mistaken alias. Thus this is a verified broken historical route, **not a verified cause of today's canonical mismatches or an established traffic loss**.

The public headers identify Cloudflare in front of GitHub Pages. The repository contains `_redirects`, but the currently active edge configuration was not available for inspection. Merely adding a rule to that file would not prove a live hosting correction, so no speculative redirect-file change was made.

Proposed reviewable Cloudflare Single Redirect, before generic extension normalization:

```text
Match expression:
(http.host eq "convertios.com" and
 http.request.uri.path in {"/ai-enhance.html" "/ai-enhance/"})

Target: https://convertios.com/ai-image-enhancer/
Status: 301
Preserve query string: enabled
```

This is a proposed configuration, not an applied or integration-tested rule. Inspect the actual existing rules and obtain deployment approval before applying it. Then test both paths over HTTP and HTTPS, with and without a query string; require a terminal 200, the correct canonical, no loop, and no regression to the 129 existing routes. Do not redirect unrelated 404s to the homepage. [Cloudflare redirect settings](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/settings/).

### No confirmed high-priority defect on current indexable pages

There is no evidence supporting a site-wide canonical rewrite, hreflang rewrite, sitemap pruning, robots change, or SEO-content rewrite. Missing export evidence must be supplied before diagnosing Google's 21 canonical selections or the 25 crawled/discovered exclusions.

## Exclusions and observations requiring no current repair

- Working HTTP, www, slashless, explicit-index, and legacy-extension redirects: keep source URLs out of the sitemap and retain the existing preferred URLs. Redirect-source exclusion is expected.
- `/tools/` and `/ar/tools/`: intentional noindex duplicate directories. Their historical Search Console category is unknown. Preserve their exclusion policy; do not assume they account for either the six noindex or two alternate-page observations.
- `/tool-template/`: deliberately excluded from publication by `_config.yml`, returns 404, and is absent from sitemap/navigation.
- `/404.html` redirects to `/404/`, which returns a genuine noindex 404. The invented `/audit-nonexistent-20261030/` control also correctly returns 404. No repair is warranted for these controls.
- Nine tested tracking-query variants use query-free canonicals. No repair is indicated.
- `/cdn-cgi/l/email-protection`: Cloudflare inserts links to this endpoint into 11 published pages, while the source uses email links. Fetching the endpoint without the email fragment returns 404. It is not a sitemap content page. Do not convert it into an indexable page or classify it as a broken converter route. JavaScript email decoding was not browser-tested in this audit.
- The two noindex duplicate-directory pages retain an EN/AR alternate cluster rather than a full EN/AR/ES cluster. This does not invalidate the separate, complete 129-page indexable clusters. No expansion or removal was made.
- `_headers` declares noindex for XML/text and `.html` patterns, but no X-Robots-Tag was observed in these responses. This is not evidence of an indexing block on canonical pages. Do not enable broad `.html` noindex behavior as a speculative repair.

Google explicitly recognizes valid non-indexed duplicates, redirects, intentional noindex pages, and removed pages. Eligibility does not guarantee indexing. [Google Page indexing report guidance](https://support.google.com/webmasters/answer/7440203).

## Historical totals: unresolved mapping

| Supplied historical category | Count | Conclusion without individual URLs |
|---|---:|---|
| Google-selected canonical mismatch | 21 | Unresolved; need inspected and selected URLs, last crawl, and indexed evidence |
| Redirected | 55 | Potentially expected; tested current variants work, but historical membership is unknown |
| HTTP 404 | 7 | Unresolved; do not treat test controls or the historical alias as members without export evidence |
| Noindex | 6 | Potentially intentional; current known duplicate directories are excluded intentionally |
| Alternate with proper canonical | 2 | Normally expected when target is appropriate; exact URLs still needed |
| Crawled, not indexed | 7 | Not proof of a technical defect; inspect exact current pages and Google's stored result |
| Discovered, not indexed | 18 | Not proof of a technical defect; inspect exact URLs and crawl evidence |

The historical 111 indexed / 116 excluded totals and today's 129 sitemap URLs measure different sets and times. Do not subtract them to infer a defect count or promise that all sitemap URLs will be indexed.

## Verification and limitations

- Existing backend tests: **13 passed, zero failed**.
- `npm run check`: passed.
- Existing static suite: **131 pages, 129 indexable, 129 sitemap URLs; zero problems and zero warnings** on a byte-preserving baseline copy.
- Recorded live sitemap/canonical/hreflang checks: **129 passed; zero issues**.
- All production files are unchanged, so old/new canonical behavior is identical by file comparison. EN/AR/ES Rotate PDF source and published metadata are preserved.
- Browser converter workflows were not rerun: this branch changes no converter, HTML, CSS, or browser JavaScript. No new functional regression claim is made beyond the backend/static checks.
- Windows initially blocked `python3` and converted checkout line endings to CRLF, making asset hashes look stale. Verification used `git -c core.autocrlf=false archive origin/main` and mapped the test's `python3` invocation to installed `python` in the validation process only. No assets were restamped and no tests were edited to hide a failure.
- Locked dependency installation reported four existing advisories. Dependencies were not upgraded as part of an indexing audit; this is not an SEO finding.
- Public curl responses cannot establish Google-selected canonicals, Googlebot-specific behavior, ranking effects, or actual indexing. Full edge configuration, backlink evidence, and Search Console exports remain unavailable.

## Search Console validation instructions

1. Export individual URLs for each exclusion reason, with report date and last crawl where provided. For canonical mismatches, capture URL Inspection's indexed result, user-declared canonical, and Google-selected canonical. A live test alone cannot supply Google's indexed canonical decision.
2. Join the exported URLs to `url-matrix.md` by exact URL, retaining scheme, host, query string, and trailing slash. Crawl any URLs not present here. Keep historical reasons separate from fresh HTTP evidence.
3. Inspect representative canonical URLs in EN/AR/ES, including home, AI Image Enhancer, and Rotate PDF. Compare stored crawl dates against relevant deployments and use the live test for current fetchability.
4. Keep the existing `https://convertios.com/sitemap.xml` submission. It already contains the 129 preferred URLs. Do not add redirect sources, noindex directories, query variants, or error routes.
5. Only after an approved repair is deployed and live regression checks pass, use **Validate fix** for the matching affected issue where available. Request indexing for the preferred destination when appropriate, not for redirected aliases or intentionally excluded pages.
6. If a canonical mismatch still appears for a verified healthy URL, compare the exact Google-selected target and its signals before changing anything. Canonicals are signals, not guarantees. [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
7. Track subsequent crawls and performance for important URLs. Do not repeatedly alter working content merely because historical counts lag. Leave the existing IndexNow workflow unchanged; this audit has not submitted anything through it.

Hreflang validation follows Google's requirement for fully qualified alternatives and reciprocal language references. [Google localized versions guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).
