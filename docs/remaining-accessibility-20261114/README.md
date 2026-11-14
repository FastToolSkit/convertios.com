# Remaining accessibility findings — 2026-11-14

Branch: `fix/remaining-accessibility-20261114` from production `main` at `89ebfdc`. The worktree was clean before changes. Draft PR #264's homepage icon contrast change is separate and was not copied or modified here.

## Findings and decisions

1. **Language selector: confirmed.** Before the fix, a local Chromium/Playwright run loaded both the actual `script.js` and `script.min.js` on EN, ES, and AR JPG-to-PDF pages. The visible labels were `English`, `Español`, and `العربية`; the matching `aria-label` values were only `Change language`, `Cambiar idioma`, and `اختيار اللغة`. The scripts overwrite the static page markup on `DOMContentLoaded`. Both script variants now use the visible language followed by the localized action, for example `English — Change language`. No link or menu behavior changed. The repository has no script minifier or source generation command; the matching function in the checked-in minified file was edited directly and browser tested alongside the source.
2. **English JPG-to-PDF empty anchor: false positive in its initial state.** `#downloadLink` starts with no `href` and no text. In Chromium it is absent from link role queries and skipped by keyboard Tab. After image selection and PDF creation, the existing `js/jpg-to-pdf.js` code gives it a blob URL, `Download PDF` text, and button styling. Playwright confirmed the resulting link has an accessible name and receives keyboard focus. No JPG-to-PDF code change was needed.

## Asset versions

`script.min.js` changed from hash `323e764c` to `4fbefbce`. A targeted byte replacement updated only `/script.min.js?v=...` in the 158 published index pages plus `404.html` and the template (160 HTML files). A comparison against `HEAD`, ignoring checkout line endings, confirmed that this token is the only HTML difference. This cache bust is needed for the changed shared script to reach browsers.

The general `scripts/stamp-assets.py --check` already reported **246 stale or missing asset references** on the untouched baseline, in other CSS/JS assets. It still reports exactly 246 after this fix, with no stale `script.min.js` references. Running the stamp writer would also rewrite those unrelated references, so it was not run.

## Validation

- `python tests/browser/remaining-accessibility.py`: pass in Chromium 148. It loads both script variants on EN/ES/AR pages, checks the computed Chromium accessibility-tree name, tests Enter and Escape on the selector, checks all three language destinations, and tests the JPG-to-PDF link before and after generation. The PDF library is stubbed only to exercise the page's own completion code.
- `node --check script.js` and `node --check script.min.js`: pass.
- `python tests/semrush-regression.py`: pass; 159 published pages still use minified shared assets.
- `npm.cmd test`: 13 server tests pass; the site check fails solely on the pre-existing 246 asset version problems. `node tests/site-check.mjs` confirms one problem category and no other warnings.
- `git diff --check`: pass.
- Repository Node browser runner: unavailable because the `playwright` Node package is not installed. Python Playwright was available and used for the focused real-browser test. Lighthouse was not available locally, so no Lighthouse score is claimed.

No merge, deployment, production edit, or force push was performed.
