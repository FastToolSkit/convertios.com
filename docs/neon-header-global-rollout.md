# Global neon header rollout — 2026-11-15

## Scope and implementation

This update brings the approved Convertios navy header used on the three homepages to **all 158 published index.html pages** across English, Spanish, and Arabic, plus the public `404.html` error page. The existing standalone design preview and unpublished tool-template fixture are deliberately excluded.

- All pages now load the same `neon-home.css` header styling, use the original Convertios logo with only transparent padding cropped (`neon-convertios-logo.png`), and display the same icon-led desktop navigation.
- Every page uses the localized Home, Image, PDF, Audio, **All Tools** dropdown, Blog, About, and Contact links in that order. The former separate More Tools and All Tools nav entries are consolidated; the old tool submenu links remain available inside All Tools.
- The language selector remains **page-specific**: a visitor on `/es/pdf-to-word/` can still switch directly to `/ar/pdf-to-word/` or `/pdf-to-word/`. The current page and blog section active navigation states are retained.
- The 404 page adopts the header without changing its noindex status, multilingual error content or route handling.
- Existing converter implementations, page content, articles, canons, hreflang, structured data, sitemap, and the Rotate PDF feature are unchanged.
- The new header uses scoped `neon-site-header` classes. Existing `neon-homepage` hero styling is unaffected. No new analytics or third-party network requests.

## Validation performed

- 158 published pages: `node tests/site-check.mjs`, **156 indexable/sitemap URLs, 0 errors, 0 warnings**, with strengthened nav consistency assertions.
- `python tests/semrush-regression.py`: PASS.
- Local Chromium: 84 page/viewport checks covering homepage, PDF tools, All Tools, blog listing, blog article, Rotate PDF, Security; English/Spanish/Arabic, 1536/1280/1024/390 px, no menu collisions or collapsed headers.
- Chromium interaction tests: the All Tools dropdown opens and retains its destination; every language selector points to the same localized tool; public 404 retains noindex.
- Arabic Rotate PDF's load timeout from third-party resources reproduces on the unchanged baseline. Layout tests block external requests and tolerate only the expected absent external `pdfjsLib`; Rotate PDF implementation untouched.
- `scripts/stamp-assets.py --check`, backend and newsroom regression tests run as release gates.

## Deployment

This is a separate review branch. Do not merge or deploy without explicit approval. After deployment verify the three language homepages, one representative tool page and one blog page in live Chromium, and watch for asset caching issues.
