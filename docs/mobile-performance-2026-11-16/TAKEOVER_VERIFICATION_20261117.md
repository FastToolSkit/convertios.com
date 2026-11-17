# Takeover verification — 17 November 2026

[PR #287](https://github.com/FastToolSkit/convertios.com/pull/287) already existed at takeover. Its source repair and original report were committed and pushed. This continuation recovered and independently checked that delivery; it did not repeat the CLS investigation or rewrite the repair.

## Recovery inventory

| Item | Recovered state |
|---|---|
| Branch | `perf/mobile-cls-root-cause-20261116` |
| Worktree | `C:\Users\ASUS\OneDrive\ドキュメント\ChatGPT\Convertios\mobile-performance-20261116` |
| Refreshed origin/main and merge base | `e3b0788829c3648b98233a2c6cfd0edcb14852dd` |
| Recovered delivery commit | `d71c6fdb7322fbf3d2056f569e4ae8e49378e0ea` |
| Original implementation commit | `4209e4382851dcf3eaa52649a0f13b43c6f9b7a8` |
| Candidate working-tree changes | None at recovery |
| Stashes | None in the recovered repository |
| Original checkout work | 202 changed files; all hashes and status match the saved pre-mission baseline |
| Other registered worktrees | Status matches the saved baseline; none modified by takeover |
| Existing PR | #287, open draft at recovery, two commits ahead of current main |
| Product changes | Four `dropdown-trigger` classes in each of `index.html`, `es/index.html`, `ar/index.html` |
| Supporting changes | Static guard, PR Pages validation step, original technical report |
| Missing delivery details | Explicit TBT summary and a takeover inventory; keyboard Enter/Space coverage independently completed |

Both GitHub and Remote Desktop Commander were tested successfully. The exact original worktree was used after discovery; the separate older `C:\Users\ASUS\convertios.com` checkout was left unchanged.

## Repair and scope

The deferred initializer previously added dropdown classes after paint, changing navigation widths and sometimes header height. Initializing those existing classes in HTML establishes their final CSS geometry before paint. Existing CSS, JavaScript, accessibility initialization and interactions are retained.

The three homepage files were independently compared with the refreshed baseline: the twelve class attributes are their only changes. Existing source stylesheets, navigation scripts, backend, sitemap and robots files retain their recorded hashes. No CSS consolidation, CSS delivery experiment, new bundle or unrelated tool/SEO/translation/design modification is included.

The measured navigation control improved English CLS 0.002712 → 0 and Spanish 0.034788 → 0. Arabic retains its separately documented small Cairo font-swap effect.

## Verification and evidence integrity

- Original quality-gate logs are intact: `npm test` passed 13/13 backend tests and the static checker reported 158 pages / 156 sitemap URLs, zero problems or warnings. Asset-stamping suite passed 3/3; stamp check found zero problems.
- Existing PR CI run [43953867084](https://github.com/FastToolSkit/convertios.com/actions/runs/43953867084) independently confirmed successful static navigation guard, official Pages build and published asset-byte validation for recovered commit `d71c6fd`.
- Existing browser coverage remains valid for the unchanged product source: all 18 Chromium/Firefox/WebKit × EN/ES/AR × mobile/desktop cases exercised navigation, search, real tool links, images, SEO metadata, AdSense and analytics presence, and no page errors or overflow.
- Strict visual batch: 17 exact screenshot passes and one Arabic Chromium desktop screenshot difference. The original failure remains recorded. The saved later settled-font probe has zero changed pixels, independently recomputed during takeover. This is not reported as 18 first-pass screenshot passes.
- New keyboard-only verification: **18/18 PASS**, all four dropdowns with Enter and Space activation and Escape dismissal, plus keyboard language-menu open/dismiss, across the same three browsers, languages and 412px/1350px widths. Chromium 148.0.7778.96; Firefox 150.0.2; WebKit 26.4. Browser emulation, not physical-device certification.
- **368/369** original filesystem manifest entries match. The sole exception is `package.log`: the ZIP packager appended its completion stdout six seconds after its manifest snapshot. It contains no test results and was excluded from the final tar archive by the original packager.
- **370/370** final tar archive members verify against the embedded SHA-256 manifest. All 30 final-navigation Lighthouse result rows match their raw JSON performance score, FCP, LCP, CLS and TBT.
- No investigation, Lighthouse collection or full regression matrix was rerun. Only the missing keyboard check and evidence/source integrity checks were performed.

Machine-readable takeover results: [takeover-verification.json](takeover-verification.json), [takeover-keyboard.json](takeover-keyboard.json). The original [technical report](README.md) retains the failed attempts, detailed ranges, controls and rejected experiment.

## Recovered Lighthouse results, including TBT

These tables are calculated directly from saved JSON; no fresh benchmark or selected best score is substituted. FCP/LCP are seconds; TBT is milliseconds; CLS is unitless. Values are medians unless labeled otherwise.

### Final class-only candidate against baseline

| Device | Language | Variant | n | Score median (range) | FCP median, s | LCP median, s | CLS median | TBT median, ms |
|---|---|---|---:|---:|---:|---:|---:|---:|
| desktop | ar | baseline | 2 | 96 (96–96) | 0.936 | 1.203 | 0.00158 | 7.00 |
| desktop | ar | candidate | 2 | 96 (96–96) | 0.933 | 1.203 | 0.00136 | 15.50 |
| desktop | en | baseline | 2 | 97.5 (97–98) | 0.892 | 1.032 | 0.00014 | 3.25 |
| desktop | en | candidate | 2 | 98 (98–98) | 0.872 | 1.033 | 0.00000 | 9.00 |
| desktop | es | baseline | 2 | 97 (97–97) | 0.922 | 1.037 | 0.00000 | 12.50 |
| desktop | es | candidate | 2 | 97 (97–97) | 0.898 | 1.048 | 0.00000 | 0.00 |
| mobile | ar | baseline | 3 | 77 (77–84) | 3.298 | 4.523 | 0.00000 | 41.50 |
| mobile | ar | candidate | 3 | 83 (77–84) | 2.867 | 3.835 | 0.00000 | 23.50 |
| mobile | en | baseline | 3 | 90 (82–90) | 2.817 | 3.008 | 0.00271 | 11.50 |
| mobile | en | candidate | 3 | 83 (83–83) | 3.072 | 3.781 | 0.00000 | 18.00 |
| mobile | es | baseline | 3 | 90 (82–90) | 2.700 | 3.022 | 0.03479 | 15.50 |
| mobile | es | candidate | 3 | 83 (83–83) | 3.068 | 3.781 | 0.00000 | 0.00 |

EN/ES mobile candidate samples have lower scores and higher LCP than baseline in this batch. This evidence supports navigation CLS stabilization; it does not demonstrate improved loading speed. No causal loading-speed attribution is established by these small samples.

### Original production mobile samples

| Device | Language | Variant | n | Score median (range) | FCP median, s | LCP median, s | CLS median | TBT median, ms |
|---|---|---|---:|---:|---:|---:|---:|---:|
| mobile | ar | production | 3 | 79 (75–87) | 2.684 | 4.728 | 0.00000 | 33.50 |
| mobile | en | production | 3 | 90 (81–98) | 0.918 | 3.211 | 0.00271 | 59.50 |
| mobile | es | production | 3 | 93 (87–94) | 0.917 | 3.162 | 0.03479 | 32.00 |

Environment: Windows, Chrome 157, Lighthouse 13.6.0, simulated throttling; mobile 412×823 / DPR 1.75, 150ms RTT, 1638.4Kbps throughput, CPU slowdown multiplier **1.2** as recorded in the original reports. Desktop 1350×940 / DPR 1, 40ms RTT, 10240Kbps, CPU multiplier 1. Final-navigation runs use fresh profiles with storage reset enabled; external advertising/analytics requests are unblocked. The mobile calibration differs from a generic 4× CPU preset and does not certify a Google PSI production score. Local comparisons use compressed HTTP responses; production/CDN/third-party conditions differ.

The rejected CSS experiment remains excluded: five paired samples per language yielded median LCP changes −29ms EN, −10ms ES and +33ms AR. Original reconstruction files and measurements remain in the evidence archive.

## Remaining limitations and release boundary

The severe PSI body CLS 0.884 mobile / 1.000 desktop is **unresolved**. Its cause was not reproduced or conclusively identified. Consistent mobile Performance 90+ and LCP below 2.5 seconds remain **unproven**. Third-party advertising/analytics variability remains possible; no ad-revenue or field-CrUX improvement is certified.

This takeover stops at the verified PR. No merge, deployment, production configuration change or production diagnostics collector is authorized or performed.

## Exact evidence locations

- Evidence root: `C:\Users\ASUS\OneDrive\ドキュメント\ChatGPT\Convertios\mobile-performance-evidence-20261116`.
- Original Markdown report: `MOBILE_PERFORMANCE_CLS_REPORT_20261116.md`.
- Raw measurements: `lighthouse/final-nav/*.json`, `lighthouse/production/*.json`, `lighthouse/exact/`, `lighthouse-final-nav-results.json`, `lighthouse-production-results.json`, `analysis.json`, `lighthouse-results.csv`.
- Browser records/screenshots: `regression-final-results.json`, `regression-final/*.png`, `font-probe.json`.
- Instrumented shifts/traces: `instrument/`; prior reports: `prior/`; rejected CSS reconstruction: `experimental-source/`.
- Source/test proofs: `final-proof.json`, `npm-test-final.log`, `stamping-tests-final.log`, `asset-stamps-final.log`, `ci-results.json`.
- New checks: `takeover-verify-20261117.py`, `takeover-verification-20261117.json`, `takeover-keyboard-20261117.py`, `takeover-keyboard-20261117.json`.
- Original complete evidence archive: [CONVERTIOS_MOBILE_PERFORMANCE_CLS_EVIDENCE_20261116.tar.xz](https://chatgpt.com/library?file_id=libfile_1c3b7df9b8708191a34bc016bb43ecdc&account_id=personal). New takeover checks are linked separately above; the original archive was preserved.
