# Search Console exclusions explained — 30 October 2026

Follow-up to Codex's audit in this folder ([README.md](README.md), [url-matrix.md](url-matrix.md)). That audit verified the live site; this one adds what it lacked: Google's own URL-level data, pulled directly from Search Console for `sc-domain:convertios.com`.

## Verdict

**The site is technically healthy. Of the 116 non-indexed URLs, one is a real (minor) defect, 25 are healthy pages Google hasn't caught up with, and 90 are correct exclusions of old or invalid URLs. No page, canonical, hreflang, sitemap or robots change is warranted.**

| Class | Count | Meaning |
|---|---:|---|
| **A — confirmed defect** | 1 | `/ai-enhance.html` → `/ai-enhance/` → 404 |
| **C — eligible, not yet indexed** | 25 | 7 current pages Google still maps to their old `.html` twin + 18 current pages never crawled |
| **B — expected exclusion** | 90 | legacy `.html`/`http://`/`index.html` redirects, intentional noindex, invalid 404 paths, query-template alternates |
| **D — insufficient evidence** | 0 | every URL was retrieved and checked |

The single root cause behind almost all of the noise is the **clean-URL migration timeline**:

- **29 Aug** — pages moved from `/page.html` to `/page/` (commit `3978eef`).
- **29 Aug → 10 Sep** — both versions answered 200 with no redirect, so Google saw two copies of every page.
- **10 Sep** — Cloudflare 301s from `.html` to `/` went in (commits `6bfab3e`, `1bf8d1d`, `d1bf944`).
- Google has been reprocessing the old URLs since; the report data is dated **23 Oct**, and old `.html` URLs are still being recrawled (most "Page with redirect" crawls are 11–24 Oct).

## Evidence collected

| File | What |
|---|---|
| [gsc-export-2026-10-23/](gsc-export-2026-10-23/) | All 116 URLs, one file per reason, with Google's last-crawl date. Report "Last update: 10/23/26". Counts match the dashboard exactly (21+55+7+6+2+7+18 = 116). |
| [url-inspection-2026-10-30.json](url-inspection-2026-10-30.json) | URL Inspection **indexed (stored) results** for 11 URLs: all 7 current canonical mismatches, two legacy twins, one 404, one never-crawled page. No live tests were run. |
| [gsc-exclusions-classified.csv](gsc-exclusions-classified.csv) | Every URL joined to Codex's 666-URL matrix (107 matched; 9 not in the matrix were freshly fetched from the laptop on 30 Oct), with live status, sitemap membership, Google-selected canonical where inspected, and the A/B/C class with reasoning. |

Search Console also shows two prior validations: canonical-mismatch **started 14 Oct, failed 17 Oct**; discovered-not-indexed **passed 9 Jun** (that pass predates the current 18 URLs).

## 1. The 21 canonical mismatches

**14 are legacy `.html` URLs (class B).** All were crawled 23 Jul – 9 Aug, before the migration, and all now 301 to their slash page. Nothing to fix; they drop out as Google recrawls them.

**7 are current pages (class C):**

| Current page (user-declared canonical) | Google-selected canonical | Last crawl |
|---|---|---|
| /text-formatter/ | /text-formatter.html | 14 Oct |
| /trim-audio-online/ | /trim-audio-online.html | 28 Sep |
| /ar/ai-image-enhancer/ | /ar/ai-image-enhancer.html | 26 Sep |
| /ar/image-converter/ | /ar/image-converter.html | 17 Sep |
| /ar/split-pdf/ | /ar/split-pdf.html | 7 Sep |
| /ar/pdf-to-jpg/ | /ar/pdf-to-jpg.html | 1 Sep |
| /ar/webp-to-png/ | /ar/webp-to-png.html | 31 Aug |

In every case Google picked **the page's own old `.html` twin**, not a different page. Inspection confirms the twins are still **indexed** (`/ar/ai-image-enhancer.html` and `/ar/image-converter.html` both "URL is on Google"). So these pages are not missing from Google; they're indexed under the old address. Every twin now returns 301 to the declared canonical (verified live 30 Oct). Once Google recrawls a twin and sees the 301, it consolidates onto the slash URL.

This is not a near-duplicate-content problem (Google chose the same page's old URL, not a sibling tool), so rewriting content would not help. It also explains the 14 Oct validation failure: it was started before Google had recrawled the twins.

## 2. The 25 crawled/discovered exclusions

**Crawled – currently not indexed (7): all legacy `.html` URLs** (`jpg-to-pdf.html`, `compress-image-to-50kb.html`, `compress-image-to-100kb.html`, `text-formatter.html`, `trim-audio-online.html`, `ar/merge-pdf.html`, `ar/pdf-tools.html`), last crawled 24 May – 7 Sep. All now 301. Class B. No current page is in this bucket.

**Discovered – currently not indexed (18): all current sitemap pages Google has never fetched** (last crawl "N/A"): EN/AR/ES Video Converter and Video to MP3 (6), JPG to PDF (EN/AR/ES), PDF Tools (AR/ES), Security (EN/ES), and ES AI Image Enhancer, Link Shortener, Merge PDF, PDF to JPG, Text Formatter. Class C.

All 18 return 200, are self-canonical, indexable, in the sitemap, and have 44–48 internal links each (the site median is 47). So they're discoverable; Google simply hasn't scheduled the crawl. The video pages are also the newest on the site. This is normal for a small, young domain and is a crawl-priority signal, not a technical fault.

## 3. The other 70

| Reason | Count | Finding | Class |
|---|---:|---|---|
| Page with redirect | 55 | 53 legacy `.html` URLs (incl. `index.html`), `http://convertios.com/`, and `all-tools.html?q={search_term_string}`. All 301 to the correct page. | B |
| Not found (404) | 7 | see below | 1 A, 6 B |
| Excluded by noindex | 6 | `/tools/`, `/ar/tools/`, `/tools.html` (intentional noindex hub duplicates) + three Arabic `.html` URLs crawled in May, now 301 | B |
| Alternate with proper canonical | 2 | `?q={search_term_string}` URLs generated from the homepage SearchAction schema; they canonicalise to the clean page as intended | B |

**404s:**

| URL | Finding | Class |
|---|---|---|
| /ai-enhance.html | 301 → /ai-enhance/ → 404. A former (wrong) canonical for the AI Image Enhancer. | **A** |
| /ar/es/, /ar/es/meme-generator/, /ar/es/split-pdf/ | Malformed language paths crawled 10–12 Sep, during the migration window; Google lists `/es/` as referrer. No current source link resolves to `/ar/es/` (checked across all repo HTML). A 404 is the correct response. | B |
| /cdn-cgi/l/email-protection | Cloudflare email-obfuscation endpoint; 404 without its fragment is normal. | B |
| /${e.target.result} | A JavaScript template literal Google parsed as a link in June; no longer in source. | B |
| /remove-background | Name of a backend POST endpoint, never a page; not linked. | B |

## 4. Confirmed defect and prepared repair

**`/ai-enhance.html` and `/ai-enhance/`** — Codex's finding is confirmed by Google (404 bucket, crawled 4 Sep). Impact is small: one URL, not linked anywhere, not a cause of any canonical mismatch. The fix is still worth making because it's a former canonical that may carry old links.

The 301s on this site are issued by **Cloudflare**, not GitHub Pages (the redirect responses carry no GitHub headers; the repo's `_redirects` file is not read by GitHub Pages). So the fix must be a Cloudflare rule. The Cloudflare dashboard requires sign-in, so I could not inspect the existing rules and **made no change**. Add this Single Redirect, ordered **before** the generic `.html → /` rule:

```text
Name:     Legacy AI enhancer alias
Match:    (http.host eq "convertios.com" and http.request.uri.path in {"/ai-enhance.html" "/ai-enhance/" "/ai-enhance"})
Action:   Static redirect → https://convertios.com/ai-image-enhancer/
Status:   301
Preserve query string: on
```

After applying, verify with:

```powershell
foreach($u in 'https://convertios.com/ai-enhance.html','https://convertios.com/ai-enhance/','https://convertios.com/ai-enhance','http://convertios.com/ai-enhance.html','https://convertios.com/ai-enhance.html?x=1'){ curl.exe -s -L -o NUL -w "$u -> %{http_code} %{url_effective} hops=%{num_redirects}`n" $u }
```

Expected: every line ends `200 https://convertios.com/ai-image-enhancer/` (query preserved on the last), with 1 hop (2 for `http://`). Then re-run `python scripts/audit-indexing.py` to confirm the 129 sitemap URLs are unchanged.

No other repair is warranted, so **no source-code changes were made** and no regression run was needed beyond the read-only checks above.

## 5. Search Console actions

Do these only in this order, and only once:

1. **Now (no deployment needed):** URL Inspection → **Request indexing** for the 7 current canonical-mismatch pages listed in section 1. They're eligible canonical destinations, and a fresh crawl of the page plus its hreflang/internal links is the fastest way to get Google to revisit the twins. Do not request indexing for the `.html` twins themselves.
2. **Optionally**, request indexing for the most valuable of the 18 never-crawled pages (e.g. `/video-converter/`, `/video-to-mp3/`, `/jpg-to-pdf/`). The daily quota is small; don't submit all 18 at once and don't resubmit unchanged pages.
3. **After the Cloudflare rule is live and verified:** Not found (404) → **Validate fix**. Expect it to report the six correct 404s as still failing; that's fine, they're supposed to 404.
4. **Wait ~3–4 weeks** (until the canonical-mismatch "Last crawl" dates for the 7 pages are after 10 Sep and their twins show "Page with redirect"), then **Validate fix** on "Duplicate, Google chose different canonical". Starting it earlier will fail again, as it did on 17 Oct.
5. Leave "Page with redirect", "Excluded by noindex", "Alternate page" and "Crawled – not indexed" alone. They are correct and will shrink or stay as Google ages out old URLs. A persistent "Page with redirect" count is healthy, not a problem.

A request being accepted does not mean a page is indexed; confirm with a later inspection.

## 6. Limitations

- Cloudflare configuration could not be read (sign-in required); the redirect rule is prepared, not tested.
- Search Console data is Google's 23 Oct snapshot; URL Inspection shows stored (indexed) results only. No live tests were run.
- Live checks were made from one Windows client with `curl.exe`; the cloud and Linux sandboxes could not reach convertios.com.
- Referring pages for old 404s are Google's historical observations and could not be reproduced on today's site.

## 7. Technical SEO health

Healthy. Every current sitemap page returns 200, is self-canonical, indexable, and part of a complete EN/AR/ES hreflang cluster; every legacy alias redirects in one hop; noindex is applied only to the intended duplicate hubs. The exclusion count is dominated by the August migration and will fall on its own as Google recrawls.

## 8. Recommendations that don't risk current traffic

- **Apply the one Cloudflare rule above.** That's the only repair.
- **Stop making structural SEO changes for now.** Canonicals, redirects and sitemap are correct. Further URL or canonical churn would restart Google's consolidation and delay the fix.
- **Watch, don't react:** recheck the canonical-mismatch list and the 18 discovered URLs in mid-November.
- **Lowest-priority, optional cleanup:** the homepage SearchAction (`?q={search_term_string}`) produces the two "Alternate" entries and one redirect entry. Google retired the sitelinks search box in 2024, so removing that block is harmless, but it isn't hurting anything either.
- **Content, not technical:** Trim Audio and the Compress-to-20/50/100 KB variants have far fewer internal links (5–7) than the rest of the site (median 47) and overlap with sibling pages, as the earlier repair report noted. If they still struggle after the migration settles, strengthening their distinct content or linking is the lever, not canonical changes.

## Full inventory

See [gsc-exclusions-classified.csv](gsc-exclusions-classified.csv) for all 116 rows with reasoning. Summary by reason and class:

| Reason | A | B | C | Total |
|---|---:|---:|---:|---:|
| Duplicate, Google chose different canonical | 0 | 14 | 7 | 21 |
| Page with redirect | 0 | 55 | 0 | 55 |
| Not found (404) | 1 | 6 | 0 | 7 |
| Excluded by noindex | 0 | 6 | 0 | 6 |
| Alternate page with proper canonical | 0 | 2 | 0 | 2 |
| Crawled – currently not indexed | 0 | 7 | 0 | 7 |
| Discovered – currently not indexed | 0 | 0 | 18 | 18 |
| **Total** | **1** | **90** | **25** | **116** |
