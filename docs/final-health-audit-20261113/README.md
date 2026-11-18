# Convertios final health audit — 13 November 2026

## Decision

**Close the repair loop and start traffic-growth work.** This audit found no confirmed active critical or moderate defect and makes no site-code change. The source has 156 unique canonical sitemap URLs and 158 public `index.html` pages; the two extra directory aliases (`/tools/`, `/ar/tools/`) deliberately have `noindex`. The owner's postdeployment 156-page HTTP pass reportedly found zero problems after PR #261. This run could not independently repeat that live pass, so the release decision rests on the owner-provided postdeployment result, the prior timestamped HTTP evidence, and the current local checks. It is not a new production uptime or Core Web Vitals certification.

The exact 156 URLs and reproducible source inventory are in [evidence.json](evidence.json). Baseline: `89ebfdc4b32ad1299f425576dd0e37373d783070`, the local `origin/main` when work began. Work stayed on the clean isolated `audit/final-health-check-20261113` branch. PR #262 was not touched.

## Coverage and results

| Check | Result | What it proves / limit |
| --- | --- | --- |
| Sitemap and source signals | 156 unique URLs; 156 indexable source pages; zero duplicate titles or descriptions; zero unexpected noindex | `tests/site-check.mjs` checked language, canonical, reciprocal hreflang, internal links, local CSS/JS/image references, H1, metadata, structured data, basic image alt, navigation, robots and legacy redirect rules. Its only failure was the Windows asset-byte check explained below. Source checks do not prove live HTTP status. |
| Prior full production HTTP evidence | 156/156 HTTP 200, 156/156 self-canonical, no unexpected noindex; exact URL set matches this sitemap | `docs/indexing-recovery-20261112/live-http.json`, timestamped **12 Nov 20:44 UTC**, is **before** PR #261 deployment and still records 11 pages linking to Cloudflare's 404 email helper. The deployed email repair and clean postdeployment 156-page pass are supplied in the mission background, not independently captured here. |
| Exclusions and redirects | `/tools/` and `/ar/tools/` intentionally noindex; `.html` aliases have 301 rules | Local source/rules and prior targeted live redirect evidence. Current live redirect chains were not retested. An intentional 404 or legacy alias is not counted as a broken canonical URL. |
| Repository tests | `node --test tests/server.test.js`: **13/13 pass**; `python tests/semrush-regression.py`: **pass**; `node --check server.js`: **pass** | Backend tests use local mocks; no provider-backed production conversion. Semrush regression covered 159 HTML files including template material and 150 JSON-LD blocks. |
| Browser workflows | `tests/browser/seo-smoke.py`: **12/12 pass** at default desktop width, then **12/12 pass** at 390px mobile by running the same test with a temporary in-memory viewport substitution. `tests/browser/contact-email-smoke.py`: **28/28 pass** at 390px and 1365px. | Local pages. Shortener/video backend responses and third-party scripts are mocked in `seo-smoke.py`; the tests establish UI flow, not codec/provider success. Email checks used JavaScript disabled and verified visible mailto links, blog links, RTL and no sideways overflow on sampled pages. Prior PR #262 non-mocked synthetic conversion evidence was reused and not repeated. |
| Asset version test | `node tests/site-check.mjs`: **1 failure category**, 246 working-tree hash warnings | All 246 references across 19 assets have stamps matching the **committed Git blob** hashes. Windows checkout converted LF to CRLF in those assets, changing only working-tree bytes. Zero Git-blob stamp mismatches and zero missing local CSS/JS assets. No production cache defect is established. Do not mass-stamp or deploy these checkout-only differences. |
| Lighthouse / Core Web Vitals | **Unverified** | Lighthouse CLI/package was unavailable; browser access host and direct network were unavailable. No Lighthouse score or CrUX field result is claimed. |

## Findings and disposition

| Classification / severity | Affected URL or scope | Reproduction evidence | Smallest safe action, expected impact, deployment |
| --- | --- | --- | --- |
| Confirmed critical bug: **none** | — | No material defect reproduced. | No fix or deployment. |
| Confirmed moderate bug: **none** | — | No material defect reproduced. | No fix or deployment. |
| Noncritical improvement: local test portability | Local `tests/site-check.mjs` / 19 CSS/JS assets; no production URL demonstrated affected | 246 `stamp-assets.py --check` warnings; `collect-local-evidence.py` confirms every stamped value matches the Git blob and all differences are CRLF conversion. | Later make asset checking independent of checkout line endings or run it in a LF-preserving checkout. Improves audit reliability; no site deployment. |
| Indexing only: historical Google selection/discovery | The 13 older tool URLs, 27 recent blog URLs and seven legacy-canonical cases enumerated in `docs/indexing-recovery-20261112/INDEXING-MATRIX.md` | 12 Nov GSC snapshot; prior live HTTP showed these canonical pages served 200 and indexable. The owner's newer note says Spanish AI Enhancer is now indexed. | Monitor current GSC coverage and selected canonicals; use one live test/request for selected clean URLs when useful. No code fix demonstrated, no deployment, and no indexing outcome guaranteed. |
| Audit limitation: fresh production HTTP | All 156 canonical URLs; legacy aliases, live image/asset targets | Python HTTPS request failed with `WinError 10013`; web fetch could not retrieve the site; browser access host was unavailable. | A future read-only rerun of `tests/live-seo-audit.py` can refresh status, redirect, canonical, robots, hreflang and internal-link evidence when normal access exists. No deployment. |
| Audit limitation: performance and broader accessibility | Representative EN/ES/AR URLs | No Lighthouse/CrUX result. Source image-alt/heading checks and sampled browser layouts passed, but no axe/screen-reader audit was run. | Obtain one representative mobile/desktop Lighthouse run per language and review any material finding. No change or deployment now. |

The November 12 OpenSEO 50/156 crawl limit was a tool page cap, not a website defect. The predeployment Cloudflare email-helper 404 is historical evidence; local repaired markup is present and the owner reports its deployment. The two noindex directory aliases and legacy `.html` redirects should remain excluded from indexing requests.

## Boundaries and next step

No files were deleted, no conversion code, SEO page, translation, blog, newsroom, sitemap, robots rule or redirect was edited, and no production action was taken. No merge, deployment, publishing, settings change or indexing request was made. GitHub CLI authentication is invalid, and this sandbox cannot create `.git/index.lock`, so no draft PR or local commit was possible. The three audit files remain untracked in this isolated checkout; the branch and `origin/main` still point to the baseline. Traffic-growth work can start from the indexed priority pages and real query/conversion data while routine monitoring continues.

From a normal checkout session with Git write access and authenticated GitHub CLI, the review handoff is:

```powershell
git add docs/final-health-audit-20261113/README.md docs/final-health-audit-20261113/evidence.json docs/final-health-audit-20261113/collect-local-evidence.py
git commit -m "docs: record final Convertios health audit"
git push -u origin audit/final-health-check-20261113
gh pr create --draft --base main --head audit/final-health-check-20261113 --title "Final Convertios health audit (reports only)" --body "Read-only final health audit. No site code changes, merge, or deployment. See docs/final-health-audit-20261113/README.md."
```
