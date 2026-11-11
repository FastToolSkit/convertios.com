# Convertios News & Blog expansion — November 11, 2026

## Scope
- Replaces truncated, inconsistent blog footers with the identical, localized footer from the corresponding homepage (all 27 blog pages).
- Adds a visible **Blog** pill in the English, Spanish and Arabic homepage navigation, in addition to existing footer links.
- Turns the previous three-guide blog into a five-story, source-linked news feed plus three practical guides, localized to EN/ES/AR.
- Adds AI-generated editorial illustration to every article and a visual news-card grid above the guides; illustrative images are not photographs of real events.
- Adds five topics × three locales = **15 new article pages**, for 27 blog pages including three localized hubs and nine existing guide translations.
- Creates 15 new canonical sitemap records, language-specific navigation links, reciprocal hreflang, NewsArticle schema and source/publication date labeling.
- Keeps the original converter implementations, current tools, URLs, and shared CSS unchanged.

## News sources, original publication dates
- PDF Brotli compression, Aug 19: https://pdfa.org/no-excuses-brotli-compression-advances-pdf/
- PDF/UA-1 accessibility notes, Sep 9: https://pdfa.org/two-new-technical-notes-addressing-pdf-ua-1-implementations/
- GS1 retail 2D barcode playbook, Mar 2026: https://ref.gs1.org/sme-guidance/2d-retail-systems-playbook/
- PDF-to-HTML derivation 1.2, Sep 27: https://pdfa.org/deriving-pdf-to-html-version-1-2/
- SVG 2 Candidate Recommendation, Oct 6: https://www.w3.org/news/2026/updated-candidate-recommendation-scalable-vector-graphics-svg-2/

All five are news summaries **published by Convertios on November 11, 2026**. Source dates are clearly differentiated. Neither news items nor metadata imply Convertios has implemented the emerging standards.

## Verified
- npm test: 13 backend passes and site checker: 158 pages, 156 indexable/sitemap URLs, zero issues and zero warnings.
- Asset version stamps: zero issues.
- Browser layout crawl: 158 pages at both 390px and 1280px, zero page failures (before final copy/date/nav polish; no layout structure changed since).
- Targeted audit: 27 localized blog pages with correct matching footers, article imagery, 5 source-linked NewsArticle entries per language, valid cross-language routes, zero failures.
- Original non-blog tools and unrelated local checkout edits preserved.

## Ongoing editorial workflow
Do not scrape or republish full third-party articles. Select substantive primary-source standards announcements, verify dates and limits, summarize what changed and why it matters for ordinary users, add an original use-case analysis, clear source link and topical Convertios tool link, generate an appropriate illustration, translate accurately, and review in a PR before deployment. Do not backdate stories or imply an experimental standard is universally supported. Google AdSense approval is not guaranteed by page count.
