# Convertios neon homepage integration — 2026-11-15

## Change scope
- Production homepage HTML only: `/index.html`, `/es/index.html`, `/ar/index.html`.
- Shared CSS and JS for the homepage via `neon-home.css`, `neon-home.js`, and separate `neon-formats.webp` (85 KB).
- Existing localized homepage search input and suggestion element IDs remain unchanged, so the existing tool catalog drives results.
- Desktop navigation on the homepages combines the original More Tools dropdown with the All Tools link inside the dropdown, and reorders Blog before About and Contact. Existing destination URLs remain available. Other pages keep their existing header for now.
- Shared search routing in `script.js` and `script.min.js` now localizes both Spanish and Arabic links. Asset content-hash versions are restamped to avoid browsers using stale scripts; the remaining pages differ only in version parameters.
- Existing tool pages, blog articles, metadata, SEO guides and the Rotate PDF implementation are preserved.
- Production audit scripts skip `design-preview/`, which is a nonindexable standalone design fixture; previously this fixture caused false failures in both SEO audits.
- Sitemap `<lastmod>` updated for only EN/ES/AR homepages.

## Usability and technical notes
- Desktop hero: approximately 610 px tall, compact centered search 760 × 58 px, button 117 × 44 px.
- Real image-format artwork, 85 KB embedded as a separate WebP file, is decorative; interactive transparent link hotspots on the image retain access to corresponding tool category pages.
- All hero content (headline, paragraphs, search, benefits, links) remains HTML, accessible to screen readers and indexable.
- The 390 px mobile view uses a full-width 52 px search field.
- Existing translations are preserved and the new hero labels are localized.

## Verified on branch
- Chromium responsive checks at 1536, 1280, 1024, 768 and 390 px, EN/ES/AR; no overflow.
- Header overlap tests: 1101, 1280, 1440 and 1536 px EN/ES/AR; no overlapping interactive navigation elements.
- Search suggestions and submission: single match navigates to localized tool, multiple matches remain visible, no matches fall back to localized All Tools page.
- SEO audit: 156 indexable sitemap URLs, no missing canonical/hreflang, zero errors.
- `python scripts/stamp-assets.py --check`, `node tests/site-check.mjs`, `python tests/semrush-regression.py` pass.
- `node --test tests/server.test.js` and `python -m unittest discover -s tests -p test_newsroom.py` pass.

## Release gating
This is a dedicated development branch and PR. No merge or production deployment before owner review.
After approval, confirm the live page in Chromium across browsers, monitor speed on mobile, and ensure navigation parity across subsequent tool/blog pages before considering a site-wide header rollout.
