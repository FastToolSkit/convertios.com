# Brazilian Portuguese release review — 2026-11-17

Scope: PR #289, base c3cfbe3, feature branch feat/pt-br-localization-20261117.

## Findings and adjustments
- Reviewed representative pt-BR homepage, all-tools, PDF, image, video and blog titles, H1 and descriptions.
- Existing shared script displayed English names inside the Portuguese homepage live search. Added Portuguese labels for all 25 searchable tools; kept existing EN/ES/AR labels unchanged.
- Localized the shared default dropzone aria-label for pt-BR without changing existing-language behavior.
- Updated script.min.js via terser 5 and versioned HTML asset references via scripts/stamp-assets.py.
- Removed generated Python bytecode from the localization source folder.
- Added a focused Playwright search smoke test across EN, ES, AR and pt-BR.

## Checks
- npm test: 13 backend tests pass; 205 pages, 203 indexable, 203 sitemap URLs, 0 problems and 0 warnings.
- Playwright new search smoke: all four language checks pass; Portuguese search returns "Juntar PDF" and navigates to /pt-br/merge-pdf/.
- Wider local browser tool suite: 124 cases, 72 failures. Of these, 60 resulted from missing local fixture files, 12 QR PNG decoding checks could not invoke Python correctly on this Windows environment. Running QR checks on untouched origin/main reproduced the same failure on all three existing locales. This is NOT a passing independent end-to-end suite.
- Earlier PR author report documented offline-vendor 124/124 tool checks and 20/20 PDF downloads; those were not reproduced in this environment.
- Browser mobile-width overflows previously documented in the PR remain; not introduced by this change.

## Release and indexing
- GitHub Pages source: main branch, root.
- Merging PR #289 publishes pt-br pages and updated sitemap; no manual GSC, Bing, or IndexNow submission performed during review.
- After merge: verify live homepage, tools, language switcher, sitemaps and cache-busted scripts; monitor GitHub Pages deployment.
- Native Brazilian Portuguese editorial review and empirical Brazil keyword metrics remain recommended; no fabricated search volumes used.
