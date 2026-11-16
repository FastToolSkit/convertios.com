# Convertios mobile performance and CLS investigation — 16 November 2026

Updated: 2026-11-16T23:50:03.548344+03:00 (Asia/Amman). Draft PR: https://github.com/FastToolSkit/convertios.com/pull/287.

**A smaller navigation CLS cause is confirmed and repaired. The severe intermittent body CLS incident is NOT confirmed as fixed. Mobile loading targets remain unmet consistently. Nothing was merged or deployed.**

## Executive outcome

The final change adds the existing `dropdown-trigger` class to the four homepage navigation spans in each of English, Spanish and Arabic, so the final CSS geometry exists before first paint. Previously the deferred navigation script added that class after rendering, expanding controls and sometimes changing header height. The same JavaScript still initializes accessibility and interactions.

The stylesheet-delivery experiment was rejected. Combining the existing CSS saved only 588 compressed bytes in EN/ES and 1,070 bytes in AR, with no meaningful repeatable mobile LCP gain across five paired samples per language. It also duplicates styles that are already shared and cached across tools. The original CSS files, stylesheet links, loading method, cache sharing and early mobile CSS remain unchanged.

The approved design, responsive artwork, converters, translations, SEO, newsroom, analytics, AdSense priority hint and scroll handler are preserved. The repair does not postpone, remove or block monetization or tracking.

## Repository and safety

- Fetched baseline: `e3b0788829c3648b98233a2c6cfd0edcb14852dd`, including merged PRs #284, #285 and #286. They were reviewed: deterministic stamps, responsive image/preload improvements, and low priority on asynchronous AdSense remain intact.
- Branch: `perf/mobile-cls-root-cause-20261116`.
- Worktree: `C:\Users\ASUS\OneDrive\ドキュメント\ChatGPT\Convertios\mobile-performance-20261116`.
- Implementation commit at report generation: `4209e4382851dcf3eaa52649a0f13b43c6f9b7a8`. Final delivery HEAD is recorded in `delivery-status.json`.
- Changed product files: only `index.html`, `es/index.html` and `ar/index.html`, four class attributes each.
- Regression protection: `tests/site-check.mjs` requires those four classes in homepage HTML. The PR Pages workflow runs the static checker before building.
- This report is stored in `docs/mobile-performance-2026-11-16/README.md`.
- `final-proof.json` verifies each homepage differs from baseline only by those four class attributes. Original CSS/JS/backend/sitemap/robots bytes are unchanged.
- All 202 pre-existing changed files in the original checkout retain identical bytes and status; other existing workspace worktrees retain their status. No reset, force push, deletion of unrelated work, merge or deployment occurred.

## Exact PageSpeed evidence retained

[Exact PSI report](https://pagespeed.web.dev/analysis/https-convertios-com/ysve2x3hbt?hl=en&form_factor=mobile), Lighthouse **13.6.0**, remains authoritative for that run:

| Metric | Mobile | Desktop |
|---|---:|---:|
| Performance | 49 | 71 |
| CLS | 0.884205 | 1.000293 |
| LCP | 4.781s | 1.209s |

The mobile audit attributes approximately 0.881417 to movement of `body.neon-homepage`, and approximately 0.002788 to navigation. The desktop audit attributes 1.0 to body movement. These are shifted elements, not proof that body CSS, ads, artwork or the scroll handler caused the movement.

Both original extracted reports and the three prior investigations were read and retained in `prior/`. No fresh low-CLS measurement invalidates those earlier high-CLS reports.

## Confirmed root cause: navigation initialization

Reproduction:

1. Open a cold homepage at 412×823 / DPR 1.75, or 1350×940 desktop, in Chrome 157.
2. Observe layout-shift entries before/around DOMContentLoaded. The existing deferred `script.min.js` adds `dropdown-trigger` to bare navigation spans.
3. Existing `style.min.css` gives that class full width, flex alignment and 44px target geometry on mobile. For example, an English trigger expanded from about 56.8px to 125.3px.
4. In a browser-only control that adds the same class in the HTML before paint, the English and Spanish navigation shift disappears without changing CSS or JavaScript behavior.

| Instrumented mobile control | Baseline CLS | Static-class control CLS |
|---|---:|---:|
| English | 0.002712 | 0 |
| Spanish | 0.034788 | 0 |
| Arabic | 0.009538 | 0.006831 |

Arabic retains a small Cairo font-swap contribution; its existing `display=swap` import and approved typography were not altered. This is distinct from the severe English PSI body incident.

The report does **not** claim the navigation class explains CLS 0.884/1.000.

## Severe CLS investigation and isolation

There are 33 instrumented sessions: repeated full mobile/desktop navigation in all three languages plus browser-only ad blocking, analytics blocking, both blocked, delayed neon CSS, delayed navigation script, delayed hero image, and static-navigation controls. Each records:

- PerformanceObserver layout shifts, session-window CLS, timestamps, source labels and previous/current rectangles;
- body/root styles and position, header/nav/art geometry, body children, scroll and viewport;
- mutation, insertion/removal, attribute and resize events;
- image/resource/script loading, LCP/paint/long-task timing, font events and iframe/AdSense geometry;
- network initiator/priority information and screenshots; representative Chrome traces are retained.

The largest CLS among those direct sessions was **0.034788**, not the severe PSI incident. The load-triggered scroll hypothesis was already independently controlled in prior evidence and was not pointlessly repeated as a speculative repair. Its handler remains unchanged.

Nine additional production Lighthouse mobile runs and four English mobile/desktop runs with the PSI category set were recorded using Lighthouse 13.6.0 and Chrome 157. These also did not reproduce CLS ≥0.1. The all-category check specifically tests whether the differing Lighthouse gather configuration explains the incident.

The observer persists beyond Lighthouse's navigation trace. It recorded large later shifts when Lighthouse restored emulation/viewport during cleanup. Those events are retained in `*.observations.json`; they are not reclassified as production CLS or substituted for the Lighthouse navigation metric. Some early Puppeteer observation files serialized source DOMRects as empty objects; later files explicitly serialize rectangle fields, and the direct Playwright records and Chrome traces retain geometry.

**Severe root cause remains unconfirmed.** No body-position override, guessed ad spacer, scroll removal or unverified ad/analytics delay was shipped.

## Fresh production variability

These are real production navigations with third-party services enabled, not candidate deployment results. Mobile PSI viewport/throttling settings were reused where practical.

| Language | Variant | n | Performance median (range) | FCP median | LCP median (range) | CLS median (max) |
|---|---|---:|---:|---:|---:|---:|
| en | production | 3 | 90 (81–98) | 0.918s | 3.211s (2.287–4.228) | 0.00271 (0.01938) |
| es | production | 3 | 93 (87–94) | 0.917s | 3.162s (3.111–3.218) | 0.03479 (0.03479) |
| ar | production | 3 | 79 (75–87) | 2.684s | 4.728s (3.822–4.904) | 0.00000 (0.00417) |

The separate exact-category English runs are retained in `lighthouse/exact/` and summarized in `analysis.json`. They do not establish a permanent score or eliminate a field incident.

## Final candidate: controlled before/after Lighthouse

The following cold-cache local HTTP comparisons use real compressed responses, unmodified real external scripts, the same Lighthouse 13.6.0 version, the same machine and viewport/throttling configuration, fresh Chrome profiles and alternating baseline/candidate order. Mobile has three samples per variant/language; desktop has two. No ads or analytics were blocked in this comparison.

These isolate the first-party markup change. Local hosting, HTTP/1 delivery, provider responses, geographic ad delivery and machine calibration differ from Google's PSI/CDN environment; they cannot certify a production score or monetization outcome.

### Mobile

| Language | Variant | n | Performance median (range) | FCP median | LCP median (range) | CLS median (max) |
|---|---|---:|---:|---:|---:|---:|
| en | baseline | 3 | 90 (82–90) | 2.817s | 3.008s (2.992–3.849) | 0.00271 (0.00271) |
| en | candidate | 3 | 83 (83–83) | 3.072s | 3.781s (3.776–3.803) | 0.00000 (0.00000) |
| es | baseline | 3 | 90 (82–90) | 2.700s | 3.022s (2.992–3.850) | 0.03479 (0.03479) |
| es | candidate | 3 | 83 (83–83) | 3.068s | 3.781s (3.758–3.804) | 0.00000 (0.00000) |
| ar | baseline | 3 | 77 (77–84) | 3.298s | 4.523s (3.806–4.577) | 0.00000 (0.00000) |
| ar | candidate | 3 | 83 (77–84) | 2.867s | 3.835s (3.832–4.592) | 0.00000 (0.00000) |

### Desktop

| Language | Variant | n | Performance median (range) | FCP median | LCP median (range) | CLS median (max) |
|---|---|---:|---:|---:|---:|---:|
| en | baseline | 2 | 97.5 (97–98) | 0.892s | 1.032s (1.022–1.042) | 0.00014 (0.00028) |
| en | candidate | 2 | 98 (98–98) | 0.872s | 1.033s (1.026–1.040) | 0.00000 (0.00000) |
| es | baseline | 2 | 97 (97–97) | 0.922s | 1.037s (1.019–1.055) | 0.00000 (0.00000) |
| es | candidate | 2 | 97 (97–97) | 0.898s | 1.048s (1.038–1.057) | 0.00000 (0.00000) |
| ar | baseline | 2 | 96 (96–96) | 0.936s | 1.203s (1.198–1.207) | 0.00158 (0.00158) |
| ar | candidate | 2 | 96 (96–96) | 0.933s | 1.203s (1.199–1.206) | 0.00136 (0.00136) |

The change removes the repeatable navigation shift where it occurs. Score and LCP variability remain; no loading-speed gain is claimed for this class-only repair. Desktop timings stay in the same approximate range, with no meaningful consistent regression demonstrated by these small samples. Literal CSS/JS bytes and settled visual geometry are unchanged.

**90+ mobile performance and LCP <2.5s are not consistently achieved.** The tested CLS values are below 0.1, but that is not certification that the earlier intermittent incident is resolved.

## CSS and critical-path experiment — not shipped

The original two homepage stylesheets remain render blocking. Arabic also retains its RTL stylesheet and Google Cairo import. The early mobile CSS contains older generic hero rules; it was reviewed but left intact rather than introducing unverified asynchronous styling or FOUC.

A private candidate combined the same style rules while preserving order and the Arabic font import. It had settled visual/computed-style parity, but five paired mobile samples per locale showed:

| Language | Existing median LCP | CSS-bundle median LCP | Median performance before/after |
|---|---:|---:|---:|
| English | 3.786s | 3.757s | 83 / 83 |
| Spanish | 3.789s | 3.779s | 83 / 83 |
| Arabic | 4.428s | 4.461s | 78 / 79 |

This is too small and inconsistent a benefit to justify duplicated cached CSS and a new build dependency. The experiment, raw results and reconstruction sources are in `experimental-source/` and `lighthouse/local/`; no bundle or bundle-building code remains in the repair branch.

Twelve initial experimental desktop attempts failed before measurement because the copied desktop config inherited `screenEmulation.mobile=true`. Those errors are retained as harness failures, not website failures. The final desktop comparison explicitly sets mobile=false and produces valid measurements.

## Advertising, analytics and other loading factors

- AdSense async script, publisher ID and PR #286's `fetchpriority=low` hint are unchanged.
- Analytics initialization, delayed/idle loader, measurement ID and tracking script are unchanged.
- Diagnostic blocked-network variants are labeled and confined to private browser contexts.
- Existing evidence's 86-with-ads-blocked versus 74-with-ads-enabled is suggestive of third-party loading cost, not proof that ads caused the large CLS.
- Fresh raw reports include ad/analytics request records, resource transfer sizes and timing. Third-party delivery still contributes variability; ads being present does not prove an actual auction rendered in a localhost/headless test.
- Responsive hero/logo candidates and high-priority image preloads remain unchanged. Artwork is still the principal LCP element.
- No external webfont is added on EN/ES. Arabic's existing Cairo network/font swap remains a separate small layout/loading cost.
- CDN/browser TTL configuration and server infrastructure were not changed. The two baseline CSS cache keys remain shared with converter pages.

## Regression results and caveats

- `npm test`: **13/13 backend tests**, 158 static pages / 156 indexable / 156 sitemap URLs, **0 problems, 0 warnings**.
- `python tests/stamp-assets.test.py`: **3/3 PASS**; asset-stamp check **0 problems**.
- `git diff --check`: PASS.
- Browser coverage: Chromium, Firefox, WebKit × EN/ES/AR × 412px/1350px. All 18 cases exercised successful image loading, dropdown open/Escape close, language menu open/Escape close, search suggestions/submission, actual tool-link navigation, no overflow, SEO metadata equality, unchanged advertising/analytics presence and no page errors.
- Settled styles and screenshots are compared baseline versus candidate. The final strict screenshot batch had 17 exact passes and one Arabic Chromium desktop snapshot difference. Its computed styles/interactions already passed. A dedicated probe waits again for fonts after the asynchronous tracker is present, logs FontFace status and geometry, and produced **zero differing pixels**. The original differing screenshot and result are retained; no CSS was changed to conceal it.
- Earlier CSS-experiment checks retained four 1–4-pixel Firefox differences and six WebKit navigation-wait harness races. Independent A/A and isolated variant controls, and the corrected navigation-event wait, are retained. They are not silently overwritten or labeled converter failures.
- No converter implementation changed. Existing functional repair evidence is retained; the 31-tool audit was not restarted.
- No physical iPhone/Android or macOS Safari test, field CrUX improvement, ad revenue effect or universal 90+ score is certified.

## Evidence and resumption

Machine-readable files: `analysis.json`, `lighthouse-results.csv`, raw Lighthouse JSON, `instrument/*.json`, Chrome trace JSON/gzip, regression JSON/screenshots, `font-probe.json`, `final-proof.json`, and `delivery-status.json`.

Evidence directory: `C:\Users\ASUS\OneDrive\ドキュメント\ChatGPT\Convertios\mobile-performance-evidence-20261116`. All prior evidence remains in its original locations.

Executed commands (from this evidence directory, with the saved preview server running):

```powershell
python instrument.py --chrome
python instrument.py --chrome --variants nav-static
node lighthouse-bench.mjs production 3
node lighthouse-bench.mjs local 5
node lighthouse-bench.mjs final-nav 3
node lighthouse-bench.mjs exact 2 en
python regression.py --final
python font-probe.py
python analyze.py
python verify-final.py
```

Do not blindly rerun the rejected CSS experiment or overwrite raw evidence. The `local` reports describe the rejected CSS candidate at that time; `final-nav` reports describe the actual retained class-only repair. The module location can be supplied with `CONVERTIOS_LIGHTHOUSE_MODULES`. Source quality gates run from the worktree:

```powershell
npm test
python tests/stamp-assets.test.py
python scripts/stamp-assets.py --check
git diff --check
```

## Recommended rollout

1. Review this narrow navigation repair and its passing source/build checks. The PR is not an incident-closure or performance-90 release.
2. Merge/deploy only after owner review; neither action is performed by this mission.
3. After an approved release, repeat PSI with full ads/analytics and inspect actual navigation CLS, LCP distribution and monetization. Do not cherry-pick the best score.
4. If the severe body shift recurs, retain the actual browser trace and before/after source rectangles/mutations. A separately reviewed, privacy-minimized sampled RUM diagnostic could capture the real user/advertising conditions; no such production collector was added here.
5. Keep the severe incident and mobile loading targets open until causal evidence and repeated/field measurements support closure.
