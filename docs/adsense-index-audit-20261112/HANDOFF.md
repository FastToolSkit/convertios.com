# Handoff — Convertios AdSense and indexing repair

Branch: `fix/adsense-readiness-indexing-20261112`, starting from `origin/main` `7cb92f1`. Work is local only; no push, merge, deploy, reset, or AdSense submission was performed. The untracked `ADSENSE-REPAIR-TASK.txt` and `adsense-repair-progress.log` predated this work and were left untouched.

## Changed

- Corrected `og:url` on 22 Spanish pages and added sitewide Open Graph and semantic JSON-LD checks in `tests/site-check.mjs`.
- Replaced inaccurate/generic Link Shortener instructions in EN/ES/AR with the actual provider path, privacy limits and a practical check.
- Corrected Text Formatter workflow guidance and added behavior examples in EN/ES/AR.
- Rewrote EN/ES audio hub guidance and expanded the thin AR hub with task selection, browser/server distinction and video size limit. Added Trim Audio links after confirming that its clean page had only two inbound HTML references.
- Added `tests/browser/seo-smoke.py` for 12 local Chromium flows with a mocked backend.
- Kept all tools, blog URLs, PDF Rotate implementation, sitemap, robots, canonical tags, hreflang and `_redirects` unchanged.

## Verification

| Command / check | Result |
|---|---|
| `npm.cmd test` | 13 backend tests pass; static check: 158 pages, 156 indexable, 156 sitemap URLs, 0 problems, 0 warnings. |
| `python scripts/stamp-assets.py --check` | 0 asset reference problems. |
| `python docs/blog-news-2026-11/verify_editorial.py` | 27 blog pages, including 15 expanded news pages, pass. |
| `python tests/browser/seo-smoke.py` | 12/12 EN/ES/AR local Chromium flows pass; backend mocked. |
| `git diff --check` | Pass. |
| `node tests/browser/run.mjs --suite tools --only link-shortener` | Could not start: Node `playwright` module not installed. Offline npm install failed; no test result from this runner. |
| Direct live HTTP/browser fetch | Unavailable in this environment; Search Console records and user's live 301/200 observations are identified separately in `REPORT.md`. |

## Release review

Review the content edits with native Spanish/Arabic speakers and run the production checks in `REPORT.md` after a separately authorized deployment. Google has old `.html` crawl records; preserve the working redirects while it recrawls. Do not equate Search Console indexing, Semrush warning counts, or a passing local test with AdSense approval.
