# Convertios indexing investigation — November 19, 2026

## Evidence and scope
- Search Console coverage workbook (snapshot through November 16): **117 indexed, 139 not indexed** among 256 Google-known URLs. Exclusion groups: 56 redirects, 38 discovered/not indexed, 21 different Google canonical, 9 404, 7 crawled/not indexed, 6 noindex and 2 alternate with canonical. The export contains no example-URL list for each group, so counts cannot identify the nine 404 pages or all 21 canonical selections.
- Live site: **504 sitemap URLs** (126 each in EN, ES, AR and PT-BR), checked in a complete HTTP crawl on November 19. All had status 200, correct self-canonicals, robot access, one H1, reciprocal 5-way hreflang, and at least one inbound sitemap-page link. The site has 0 broken internal link targets. Full live evidence was generated locally at `docs/indexing-live-audit-20261119.json` (not committed due to size).
- Legacy redirects sampled: `/ar/pdf-to-jpg.html` and `/text-formatter.html` correctly return **301** to their slash URLs. A request to `/cdn-cgi/l/email-protection` returns **404**, but no internal page currently links to it; do not redirect or index it.
- Seven older clean URLs inspected in Search Console still show Google-selected `.html` canonicals (five Arabic plus EN Text Formatter and Trim Audio). Most last-crawl timestamps predate new redirects. The Arabic Image Converter clean page was recrawled November 19 but Google still reports its historical alias. This is not proof of a current server error.
- Latest newly published tools inspected in Search Console report “URL is unknown to Google”; they were published November 19, not blocked by robots or canonical on live pages.
- IndexNow was **already** submitted automatically after recent merges: Content Library 292 URLs on November 18, then 40 tool pages after each of PR #292 and #293. GitHub logs confirm HTTP 200 acknowledgements, which do not establish indexing. No duplicate manual IndexNow submission was made.

## Real fix
The existing `tests/live-seo-audit.py` was out of date: it classified all 126 Brazilian Portuguese URLs as wrong-language pages and did not require pt-BR in reciprocal hreflang checks. Updated the audit to recognize `lang="pt-BR"` and check all four languages plus x-default. Repeat **504-page** live crawl now passes with **zero problems**.

## Deliberately not changed
- Do **not** remove or rewrite valid permanent redirects to make Google Page Indexing exclusions count fall.
- Do **not** force index the two intentionally canonicalized alternate pages or six intentional noindex URLs without actual per-URL evidence.
- Do **not** submit all 504 unchanged URLs to IndexNow again; automatic workflow already sends additions and changes.
- Do **not** describe “unknown to Google” as a ranking penalty, nor assume newly published URL counts are included in the November 16 coverage snapshot.
- Google does not support general-purpose URL indexing requests through its standard Search Console API; URL Inspection has a manual Request Indexing action and Google decides whether to index.

## Remaining actions requiring URL-level evidence
1. From Search Console's **Page indexing > Not found (404) > Examples**, export all nine current example URLs. Audit each against expected intent (genuine removed page = keep 404/410, moved content = one-hop 301 to specific relevant destination, live content = fix routing).
2. Export example URLs for **Duplicate, Google chose different canonical than user** (21); compare selected Google canonical, canonical tags, internal links, redirects and last crawls. The seven known historical aliases do not warrant replacing functioning redirects.
3. For **Discovered — currently not indexed** (38), prioritize older non-indexed tool pages; the 40 new tool pages and 240 new articles need crawl time and genuine internal links.
4. In Search Console, verify `https://convertios.com/sitemap.xml` is submitted and recently read. Use **URL Inspection > Test live URL > Request indexing** sparingly for representative high-value canonical URLs that are still missing after normal discovery. This operation cannot be invoked through the current connected OpenSEO tools.
5. Follow the already-running weekly indexing recovery monitoring; compare like-for-like report dates and pages. Search Console indexing status lags live changes.

## Independent reading
- Google Search Central: [Canonicalization troubleshooting](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting), [Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Request recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
- Reddit: [canonical selection discussion](https://www.reddit.com/r/TechSEO/comments/1b2qoop), [new pages not crawled](https://www.reddit.com/r/TechSEO/comments/1wgc4zn/update_new_urls_still_not_crawled_after_more_than/). These are anecdotal, not evidence for Convertios.
