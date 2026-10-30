# AdSense readiness: "Low value content" investigation, 30 Oct 2026

Branch `adsense/low-value-audit-20261030` (from `origin/main` 8994e74, which includes the work audited in #246/#247). Nothing has been merged or deployed, and no AdSense review has been requested.

## Verdict

**Not ready to resubmit yet.** The site is in much better shape than when Google reviewed it, but resubmitting now risks a second rejection, for two reasons:

1. **User interest is still low**, and Google's notice lists it as a criterion. This can't be fixed with code; it needs time.
2. **45 tool pages (15 per language) still use the original generic template.** These are the pages most likely to read as "low value", and they include the site's most-visited page.

The rejection itself predates most of the current site. Since then, broken tools have been fixed and the duplicate-URL problem has been resolved. A resubmission in about 4–8 weeks, after the fixes below are merged and the highest-traffic template pages are rewritten, has a realistic chance. Resubmitting today does not.

## What Google said and when

From the AdSense **Sites** page (read-only, 30 Oct):

| Field | Value |
|---|---|
| Status | Needs attention: **Low value content** |
| Last updated | **9 Sep 2026, 18:49 (GMT+3)** |
| Ads.txt status | Not found |
| Google's stated criteria | "provide substantial unique value, establish a consistent presence on the web, and show a level of user interest". Before resubmitting, ensure the site "provides authentic, high-quality information, tools, or services", "exhibits ongoing curation and structural maintenance" and "generates and sustains genuine user interest". |

Google's published policy behind this ([AdSense minimum content requirements](https://support.google.com/adsense/answer/81904?hl=en); [screens without publisher content](https://support.google.com/publisherpolicies/answer/11112688); [replicated content](https://support.google.com/publisherpolicies/answer/11190248?hl=en)) objects to pages with too little original content, template-only or under-construction pages, auto-generated content without human curation, navigation-only or dead-end screens carrying ads, and copied content. **Non-indexed pages are not themselves an AdSense violation**, and they were not treated as one here.

## What the site looked like on 9 September

| Date | State |
|---|---|
| 29 Aug – 10 Sep | Every page answered at both `/page.html` and `/page/` without redirects (the URL migration window), so Google saw two copies of the whole site |
| 1 Sep | Video tools added (8 days before review) |
| **9 Sep** | **AdSense review** |
| 10 Sep | `.html` redirects deployed; hub and About pages strengthened |
| 12 Oct | Production repair: AI Image Enhancer and Link Shortener had been **completely broken**; Image Converter's BMP/GIF output was a renamed PNG; several compressors, QR, meme and JPG-to-PDF defects fixed; 12 tool pages × 3 languages given page-specific guides; trust pages rewritten |
| 12 Oct – 30 Oct | Further copy fixes, IndexNow, indexing work (#246, #247) |

So the reviewer saw a site with broken flagship tools, a fully duplicated URL space and a large share of generic template pages.

## Confirmed weaknesses (with evidence)

### 1. Generic template content on 45 tool pages (high impact)
15 tools in each language still use the original "Free X Tool / What this tool does / How to use / Benefits / Use cases / FAQ" template. Their text is unique at the phrase level (no 8-word overlap with other pages), but formulaic: interchangeable marketing claims such as "fast and reliable", "no installation required", "works on mobile, tablet, and desktop", "ideal for businesses, marketers, students", and the identical FAQ answer "Yes, the tool is completely free with no hidden costs." on 9 English pages. They give little that is specific to the tool.

| Language | Template pages (main-content words) |
|---|---|
| EN | password-generator (188, now fixed), text-formatter, unit-converter, word-counter, qr-generator, link-shortener, pdf-to-jpg, remove-bg, meme-generator, webp-to-png, **pdf-to-word**, image-resizer, image-converter, audio-speed-changer, audio-converter |
| ES | same 15 tools under `/es/`, including **/es/pdf-to-word/ (44% of all page views in the last 28 days)** |
| AR | same 15 tools under `/ar/` |

The other 28 tool pages per language were rewritten on 12 Oct and read well. For example, JPG to PDF has a page-size table, document-photo tips and accurate notes on recompression.

### 2. Misleading claim on PDF to Word (EN/ES/AR): **fixed on branch**
All three pages said the tool converts **scanned** PDFs into editable Word files. The backend uses pdf2docx, which has no OCR. **Live test:** an image-only PDF converted "successfully" into a DOCX containing **0 characters of text** (only the page as a picture). This was on the site's most-visited page.

### 3. Overclaims on trust pages: **fixed on branch**
- FAQ (EN/AR): "No one can access your data" and "never used for … any external purpose", although the AI Image Enhancer uploads to Cloudinary and the Link Shortener sends URLs to TinyURL/is.gd.
- Security (EN/ES/AR): files are "never … exposed to any external systems", and the infrastructure is "designed to handle high workloads". In reality the backend is a Render instance that runs **2 jobs at a time** (`/health`: `maxActiveJobs: 2`) and cold-starts.
- Privacy (EN/ES/AR): described the AI enhancer as sending images to "an automated enhancement workflow" (the retired n8n flow; it now uses Cloudinary AI effects), and omitted the is.gd fallback for short links.

### 4. Ad code on navigation-only duplicate pages: **fixed on branch**
`/tools/` and `/ar/tools/` are orphaned, `noindex` duplicates of All Tools that only list links, yet they loaded the AdSense script. Google has crawled `/tools/` (it's in the Search Console noindex report). Google's policy excludes "navigation" screens from ads.

### 5. Native `alert()` popups in five tools: **fixed on branch**
Merge PDF, Rotate PDF, Split PDF, PDF to JPG and Password Generator (×3 languages, 15 places) still used blocking browser popups, while every other tool uses the site's accessible inline message.

### 6. Low genuine user interest (high impact, can't be fixed in code)
- **Search Console** (25 Mar – 27 Oct 2026): 362 clicks from 16.8K impressions, average position 47. **179 of those clicks (49%) were the brand query "convertios"**, and 231 (64%) landed on the homepage. No non-brand query has more than 4 clicks.
- **Analytics** (2 – 29 Oct): 615 active users, 1,165 page views, 45 s average engagement per user, 1.9 views per user. **/es/pdf-to-word/ alone has 513 views (44%)**, mostly from Latin America and Spain. In the last 7 days, 88 of 153 users came from **Bing**, versus 8 from Google organic.
- These figures include the owner's own testing: Analytics flags a 12 Oct spike of 203 page views from Jordan and 136 from the US (the production QA day), with no internal-traffic filter.
- No event records whether a tool was actually *used* (only page_view, session_start, user_engagement, first_visit, scroll), so real tool usage can't currently be shown.

Impressions are not visits. Real visits are a few hundred a month, concentrated on one page.

## Potential concerns that need verification

| Concern | Why it's uncertain | How to verify |
|---|---|---|
| AdSense "Ads.txt: Not found" | `https://convertios.com/ads.txt` returns **200** with the correct line (`google.com, pub-8386549343296072, DIRECT, f08c47fec0942fa0`); the file has existed since 28 Mar. The status is probably stale from the 9 Sep review. | Check the status again in AdSense after a few days. If it stays "Not found", check Cloudflare's bot settings (Bot Fight Mode / Super Bot Fight Mode / WAF) for blocks on Google's ads crawlers. **Cloudflare was not accessible (sign-in required).** |
| Cloudflare blocking AdSense's crawler | A request with the `Mediapartners-Google` user agent got 200 from a residential IP, but Cloudflare's bot rules judge by IP and fingerprint, not user agent. | Cloudflare → Security → Bots / Events: filter for `Mediapartners-Google` and `Google-adstxt`. |
| Thin "About" identity | About explains the project well but names no person or business and no country; Contact is a Gmail address. Google doesn't require this, but it's a common trust signal. | Your decision. Adding a real operator name or business name and country to About would help. |
| Mobile header | On phones the full menu (about 9 links plus the language switcher) is always expanded, using the top 338 px of an 812 px screen. The upload area is still visible on the first screen, and the header scrolls away normally. | Consider a collapsible menu. This is UX polish, not a policy issue. |
| Arabic and Spanish wording | Copy is idiomatic in the samples read, but I'm not a native reviewer. The new Password Generator and claim fixes in AR/ES should be checked by a native speaker. | Native-speaker read-through of changed AR/ES paragraphs. |

## Already resolved by recent development (not current weaknesses)

- **Duplicate content between sibling pages.** The 12 Oct report measured 45–59% overlap (e.g. png-to-jpg vs jpg-to-png, compress-20kb vs 50kb, mp3-cutter vs trim-audio). Measured again today with 8-word shingles, excluding navigation and footer: **0.00–0.16**. Across all 129 pages, the median main text is 422 words, of which about 1% is site-wide boilerplate, and **no same-language pair shares 30% or more** of its non-boilerplate text.
- **Duplicate URL space.** All `.html` addresses now 301 to one canonical URL (#246).
- **Broken tools.** All fixed on 12 Oct and re-verified below.
- **Privacy claims vs behaviour.** Each tool's "Tool Information" block now matches its code. Only AI Enhancer, PDF to Word, Link Shortener, Video Converter and Video to MP3 use a server, and they say so. Remove Background really runs in the browser (IMG.LY model).
- **Trust pages.** About (548 words), Contact (specific reporting guidance, response time), Privacy (943 words, per-tool file handling) and Terms (539 words) exist in all three languages.
- **Crawler access.** `robots.txt` allows everything; there is no `noindex` on any sitemap page; there are no ads on the 404 page; and the sitemap exactly matches the indexable pages.

## Tool reliability (tested 30 Oct)

| Test | Result |
|---|---|
| Live production backend, real files | Video to MP3: MP4 → valid 3.0 s MP3. Video Converter: MOV → valid WebM (VP9 + Opus). PDF to Word: 3-page PDF → valid DOCX. Each took 2–4 s (server warm). |
| Live backend error handling | Unsupported output → `400 UNSUPPORTED_OUTPUT`; JPG sent to PDF to Word → `415 "Uploaded file must be a PDF."` |
| Live backend, scanned PDF | "Succeeds" with no editable text, hence fix #2 |
| Browser tool suite (`tests/browser`, 390 px touch phone profile, EN/AR/ES, real fixture files, backend mocked) | See [tool-suite.log](tool-suite.log) |
| New regression check (`tests/browser/inline-messages.mjs`) | **15/15 passed**: every former `alert()` now shows the inline message in the right language, with no native dialog and no page errors |
| Static site checker (`tests/site-check.mjs`) | **131 pages, 129 indexable, 129 sitemap URLs: 0 problems, 0 warnings** |

## Changes on this branch

| # | Change | Files | Expected user benefit |
|---|---|---|---|
| 1 | PDF to Word: replace scanned-PDF claim with an accurate explanation and a 5-second self-check | `pdf-to-word`, `es/…`, `ar/…` | Users with scanned PDFs know what they'll get instead of receiving an uneditable DOCX |
| 2 | Password Generator: replace generic template with an accurate guide covering how it generates (Web Crypto, unbiased selection, guaranteed types), a strength table (77/103/128 bits at 12/16/20 characters), and safe-use advice | `password-generator`, `es/…`, `ar/…` | Explains why the tool is trustworthy and how to choose a length; main content goes from about 190 generic words to 470–510 specific ones per language |
| 3 | Security / FAQ / Privacy: replace overclaims with accurate statements of what is processed where | `security`, `faq`, `privacy` (+ ES/AR where affected); Privacy date set to 30 Oct | Trust pages that match reality |
| 4 | Remove AdSense script from `/tools/` and `/ar/tools/` | 2 files | No ads on navigation-only duplicates |
| 5 | Replace 15 `alert()` popups with the inline message | 5 tools × 3 languages | Non-blocking, accessible, translated feedback |

No URL, canonical, redirect, hreflang, sitemap, IndexNow, ads.txt or converter-logic file was changed (except removing the two blocking popups from the PDF tools' input checks).

## Prioritized improvements still to do

| Priority | Work | Pages | Expected benefit |
|---|---|---|---|
| **P1** | Rewrite **PDF to Word** with page-specific guidance: what converts well (text PDFs, simple tables) and what doesn't (scans, complex multi-column layouts, unusual fonts), the 25 MB limit, cold-start wait, and what to do with scanned files | `/es/pdf-to-word/` first (44% of views), then EN, AR | Highest-traffic page becomes genuinely useful; the most likely page for a reviewer to see |
| **P1** | Same treatment for the next template pages by evidence of demand: **Image Converter** (19 clicks), **Audio Converter** (17 clicks, 1,069 impressions), **Link Shortener** (AR: 7 clicks, 534 impressions), **Audio Speed Changer**, **QR Generator** | ×3 languages | Replaces the most-seen generic copy |
| P2 | Remaining template pages: Text Formatter, Unit Converter, Word Counter, PDF to JPG, Remove Background, Meme Generator, WEBP to PNG, Image Resizer | ×3 languages | Removes the last template pages |
| P2 | Add an Analytics event when a conversion finishes (no file names or content), and exclude your own IP from Analytics | site-wide | Shows real usage to yourself, and later to reviewers; stops your testing inflating figures |
| P3 | Add operator identity (name or business, country) to About | 3 pages | Trust signal |
| P3 | Collapsible mobile menu | site-wide | Faster access to tools on phones |

Each rewrite should state **real behaviour** (check it against the tool's code, as done for Password Generator), explain the decisions a user faces (options, limits, failure cases), and drop the generic Benefits / Use cases lists. **Don't** add filler or articles; length isn't the goal.

## Regression tests for these and future changes

1. `node tests/site-check.mjs`: canonicals, hreflang, titles, one H1, JSON-LD validity, sitemap/indexable parity, AdSense tag on every indexable page.
2. `node tests/browser/run.mjs --suite tools`: all tool flows in EN/AR/ES on a phone profile.
3. `node tests/browser/inline-messages.mjs`: no native dialogs on the five tools.
4. `node tests/browser/run.mjs --suite pages`: 131 pages × 6 widths for overflow, JS errors and broken links (slow, about 25 min).
5. After deploying: `curl -sI` each changed URL (expect 200, unchanged canonical), and re-check `ads.txt`.

## When to resubmit

1. Review and merge this branch, then deploy.
2. Do the P1 rewrites (PDF to Word, then the next five tools).
3. Wait until the AdSense ads.txt status shows "Authorized", and give traffic a few weeks to settle on the fixed site.
4. Then tick "I confirm I have fixed the issues" and request review **once**. Repeated quick resubmissions don't help.
