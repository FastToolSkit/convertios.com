# Utility batch 2 SEO and indexing handoff — 19 November 2026

## Scope and progress

The ten tools from PR #303 have new, generator-owned English, Spanish, Arabic RTL, and Brazilian Portuguese copy: 40 canonical pages. The source is `scripts/utility_seo_content.py`; `scripts/build-utility-tools.py` renders the pages, updates four tool directories and the four existing homepage tool-link labels, writes `sitemap.xml`, and writes the 40-URL manifest. The main homepage sections and tool behavior were not changed.

Each page now has a tool-specific title and description, three localized steps, a practical example, an explanation of the output, existing options and limits, and two visible FAQs. The `WebApplication` description matches the meta and Open Graph descriptions. Canonical, reciprocal hreflang including `x-default`, breadcrumb schema, form, config JSON, scripts, and accessibility hooks remain in the generator. No FAQPage schema was added; the visible FAQ details are sufficient without implying rich-result eligibility.

The six browser tools are JSON formatter, JSON/CSV converter, regex tester, UTM campaign builder, bulk file renamer, and SEO/social preview. The four server-processed tools are invoice generator, CSV/XLSX converter, PDF compressor, and searchable PDF OCR. The copy describes real limits and transformations, including manual-only social metadata entry, OCR rasterization, possible PDF compression with no gain, cached Excel formula values, and invoice tax limitations. It makes no ranking, indexing, or legal-compliance promise.

## Sitemap and verification

The XML sitemap remains at **544 indexable URLs**: the original 504 plus these 40. Precisely these 40 have `<lastmod>2026-11-19</lastmod>`, because their main content and metadata changed. Existing dates or absent dates for other URLs are preserved. The per-URL language alternates remain intact. `docs/utility-batch2-indexnow-urls-20261119.txt` is the exact canonical URL set for deployment handoff; it is not a submission script.

Run `python scripts/build-utility-tools.py` whenever copy changes. `python -m unittest tests.test_utility_seo -v` checks metadata uniqueness and escaping, localized sections and FAQs, schema, canonical and hreflang, exact sitemap dates and manifest, and repeatable generation.

Verification on this worktree: the SEO suite passed all four tests; `npm.cmd test` passed 29 tests and its site check reported 544 indexable pages and 544 sitemap URLs with no problems or warnings; `python -m unittest discover -s tests -p 'test_*.py'` passed 27 tests with four existing skips; `python tests/stamp-assets.test.py` passed three tests; `python tests/browser/utility-tools.py` and `python tests/browser/artifact-tools.py` both passed. The browser checks covered forms, downloads, no-gain behavior, and Arabic RTL.

## After merge and deployment

1. Confirm the deployed 40 pages and `https://convertios.com/sitemap.xml` return successfully, have the intended canonical and hreflang links, and expose the new content. Check that the deployed sitemap still lists 544 URLs and the 40 dates match the manifest.
2. In the verified Google Search Console property, submit or resubmit the sitemap URL in the Sitemaps report and monitor retrieval and errors. Google treats a sitemap and `<lastmod>` as crawl hints; submission does **not** mean the 40 pages have been crawled or indexed. Google recommends dates that reflect significant page changes. See [Google Search Central sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
3. For Bing and other participating IndexNow engines, use the existing authorized IndexNow integration or a verified key hosted for this domain, then submit only the **40 URLs in the manifest** after deployment. Check receipt in Bing Webmaster Tools. IndexNow notification likewise does not guarantee crawling or indexing. See [Bing's IndexNow setup](https://www.bing.com/indexnow/getstarted).
4. Monitor Search Console page indexing and Bing Webmaster Tools after discovery. Investigate individual canonical, crawl, or rendering errors instead of repeatedly changing dates or claiming index coverage.

No deployment, Search Console submission, or IndexNow request is performed by this change.
