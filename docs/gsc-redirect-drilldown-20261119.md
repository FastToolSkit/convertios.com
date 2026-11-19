# Search Console redirect drilldown — November 19, 2026

## Uploaded report evidence
- `convertios.com-Coverage-Drilldown-2026-11-19 (3).xlsx` identifies **56** exact URLs under **Page with redirect**. All 56 are retained verbatim in `tests/fixtures/gsc-redirects-20261119.json`.
- `convertios.com-Coverage-Drilldown-2026-11-19 (2).xlsx` identifies **21** exact URLs under **Duplicate, Google chose different canonical than user**; this is the same set previously verified in PR #295. It is not an extra 21 unique problems.

## Live verification
**56/56 source URLs** returned a **single HTTP 301** to the expected canonical HTTPS, trailing-slash URL; all **56 destinations returned 200**, with no redirects to errors or loops.

The two nonstandard entries were checked rather than assumed:
- `http://convertios.com/` returned **301 → https://convertios.com/**, then 200.
- `https://convertios.com/all-tools.html?q=%7Bsearch_term_string%7D` returned **301 → https://convertios.com/all-tools/?q=%7Bsearch_term_string%7D**, then 200; the query was preserved.

The 54 other entries are historical `.html` URLs (including `/index.html` and `/ar/index.html`) whose working redirects are desirable canonical consolidation. They should **remain excluded** under Page with redirect; the indexable pages are their clean destinations. Attempting to eliminate all 56 exclusions would require breaking correct 301 behavior.

## Change in this branch
Adds a small, standalone read-only regression command:

`python tests/gsc-redirects.py`

It checks all 56 source URLs for the expected one-hop 301 target and rejects missing/misrouted aliases. The historical list is stored with its original issue name and date. No production redirect or website files are modified.

## Scope boundary / remaining evidence
- Exported category **Not found (404)** (9), **Discovered — currently not indexed** (38) and **Crawled — currently not indexed** (7) still need their exact GSC drilldown examples if repair is necessary. The uploaded files do **not** include these lists.
- Google may retain old crawl records even when redirect behavior is healthy today. Search Console count is not a target to drive to zero; non-indexable redirect sources should stay non-indexable.
- IndexNow runs already submitted newly changed pages to supported search engines. Google has no general-purpose automatic indexing endpoint for these ordinary URLs.
