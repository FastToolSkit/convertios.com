# Indexing request tracker

Follow-up to [GSC-FINDINGS.md](GSC-FINDINGS.md). Covers the 18 "Discovered – currently not indexed" pages and the 7 current pages with a canonical mismatch. Per-URL detail: [indexing-requests-2026-10-30.csv](indexing-requests-2026-10-30.csv).

**Rule for this file:** one row per request. Never resubmit a URL listed under "Requested" unless its page content changes; Google states that resubmitting "will not change its queue position or priority". A request being accepted does not mean the page is indexed.

## Request log

All requests were made in Search Console URL Inspection (`sc-domain:convertios.com`), each immediately after a passing live test. Times are Amman (UTC+3).

| # | Date | URL | Stored status before | Live test | Google's response |
|---:|---|---|---|---|---|
| 1 | 30 Oct 04:08 | /video-converter/ | Discovered – not indexed | available; can be indexed | Indexing requested |
| 2 | 30 Oct 04:10 | /video-to-mp3/ | Discovered – not indexed | available; can be indexed | Indexing requested |
| 3 | 30 Oct 04:10 | /jpg-to-pdf/ | Discovered – not indexed | available; can be indexed | Indexing requested |
| 4 | 30 Oct 04:11 | /ar/webp-to-png/ | Canonical mismatch (Google: `.html`); last crawl 31 Aug | available; can be indexed | Indexing requested |
| 5 | 30 Oct 04:11 | /ar/pdf-to-jpg/ | Canonical mismatch; last crawl 1 Sep | available; can be indexed | Indexing requested |
| 6 | 30 Oct 04:12 | /ar/split-pdf/ | Canonical mismatch; last crawl 7 Sep | available; can be indexed | Indexing requested |
| 7 | 30 Oct 04:12 | /es/video-converter/ | URL is unknown to Google | available; can be indexed | Indexing requested |
| 8 | 30 Oct 04:13 | /ar/video-converter/ | Discovered – not indexed | available; can be indexed | Indexing requested |
| 9 | 30 Oct 04:13 | /es/video-to-mp3/ | Discovered – not indexed | available; can be indexed | Indexing requested |
| 10 | 30 Oct 04:14 | /ar/video-to-mp3/ | URL is unknown to Google | available; can be indexed | Indexing requested |
| 11 | 30 Oct 04:14 | /es/jpg-to-pdf/ | URL is unknown to Google | available; can be indexed | Indexing requested |
| 12 | 30 Oct 04:15 | /ar/jpg-to-pdf/ | Discovered – not indexed | available; can be indexed | **Quota Exceeded**: "try submitting this again tomorrow". Not submitted. |

Every accepted response read: *"Indexing requested — URL was added to a priority crawl queue. Submitting a page multiple times will not change its queue position or priority."* The property's daily request quota was reached after 11 accepted requests.

All 23 not-yet-indexed pages were also fetched from the laptop on 30 Oct: each returned 200 with a self-canonical, `index, follow` (or no robots meta, which also means indexable) and the full hreflang set.

## Final status, 30 Oct 2026

### Requested (11): wait for a crawl, don't resubmit
/video-converter/, /video-to-mp3/, /jpg-to-pdf/, /es/video-converter/, /ar/video-converter/, /es/video-to-mp3/, /ar/video-to-mp3/, /es/jpg-to-pdf/, /ar/webp-to-png/, /ar/pdf-to-jpg/, /ar/split-pdf/

### Already indexed (2): no action
/ar/pdf-tools/ and /es/pdf-tools/ moved from "Discovered" (23 Oct report) to **"URL is on Google"**.

### Awaiting crawl, not requested (11)
- **Canonical mismatch, crawled after the 10 Sep redirects (4):** /text-formatter/ (14 Oct), /trim-audio-online/ (28 Sep), /ar/ai-image-enhancer/ (26 Sep), /ar/image-converter/ (17 Sep). Google already fetched these with the redirects in place; what's pending is a recrawl of their `.html` twins. A request for the slash URL adds little, so these were deliberately ranked below never-crawled pages.
- **Discovered, lower value (7):** /es/ai-image-enhancer/, /es/pdf-to-jpg/, /es/merge-pdf/, /es/text-formatter/, /es/link-shortener/, /security/, /es/security/.

### Requires further action (1)
- **/ar/jpg-to-pdf/**: request indexing on **31 Oct or later** (quota). This is the only remaining high-priority page.

## Next steps

| When | Action |
|---|---|
| 31 Oct or later | Request /ar/jpg-to-pdf/. If quota remains, request /es/ai-image-enhancer/, /es/pdf-to-jpg/, /es/merge-pdf/ in that order. Log each here. |
| ~6–13 Nov | Re-inspect the 11 requested URLs. "Last crawl" should be on or after 30 Oct. For the three Arabic mismatch pages, check Google-selected canonical = the slash URL. Do not resubmit. |
| Mid-Nov | Check the Page indexing report. If the four post-redirect mismatch pages still point to `.html`, inspect each `.html` twin: it should show "Page with redirect". Only then start **Validate fix** on the canonical-mismatch issue. |
| Not needed | /security/ and /es/security/ are policy pages; leave them to normal crawling. |

## Links and content review of the 18 pages

Checked from the repo source (identical to the live site per #246) and the 666-URL link graph.

- **Internal linking: no weakness.** Each page has 43–45 internal inbound links, 40–42 of them from same-language pages. That includes the language homepage and the all-tools hub, plus the relevant category hub for tool pages. That's in line with the site median of 47, and inbound links aren't what's holding these pages back.
- **Titles, H1s and descriptions are present and unique**, in the right language. The descriptions run 96–152 characters. `/ar/pdf-tools/` has the shortest (73 characters), but that page is already indexed.
- **Content depth: adequate.** The tool pages carry roughly 320–490 words of original guide and FAQ text (site median 418). The video pages, for example, cover output formats, how-to steps, privacy and an FAQ. The two Security pages (220–265 words) are policy pages and don't need more.
- **Observation, no action required:** on the six video pages the `<main>` element closes after the upload widget, so the guide and FAQ sections sit just outside it. Google indexes the whole page, so this doesn't affect crawling or indexing. If those templates are touched for another reason, moving `</main>` below the FAQ would tidy the semantics.
- **Hub pages are thin by design** (`/ar/pdf-tools/` 80 words, `/es/pdf-tools/` 61), but both are now indexed, so no change is recommended.

**No genuine weakness justifies a content or code change.** The likeliest reason these pages weren't crawled is that they're new (the video tools) or language variants on a young domain with limited crawl priority. Neither is fixable on-page.

## Observations

- Google's stored status for never-crawled pages flips between "Discovered – currently not indexed" and "URL is unknown to Google" between inspections minutes apart (e.g. /video-converter/, /es/jpg-to-pdf/). Both mean "not yet crawled"; the difference is not meaningful.
- Several inspections showed the sitemap as "Temporary processing error" while others in the same session showed `sitemap.xml`. This is a Search Console display issue, not a sitemap fault; the sitemap was verified intact in #246.
- No website code, sitemap, canonical, redirect, hreflang, IndexNow or converter file was changed.
