# Convertios Blog v1 — editorial and publishing notes

Initial draft scope: 3 topic-focused guides, localized into English, Spanish and Arabic (9 articles), plus a blog index in each language (3 hub pages). The homepage footer links to the appropriate localized blog hub.

## Editorial intent
- Answer a specific user question before asking anyone to try a tool.
- Tie claims to actual tool behavior; do not imply PDF-to-Word performs OCR or that short links are automatically safe.
- Verify examples when publishing conversion claims, file limits, or performance measurements.
- Do not invent author names, credentials, testimonials, test results, or publication dates.
- For future posts, prefer annotated screenshots or reproducible examples when they add value.
- Review Spanish and Arabic text with a fluent speaker before publishing.

## Adding another article
1. Draft and edit the original around a real user task and confirm limitations against the source.
2. Prepare EN, ES and AR pages with matching slugs, canonicals and reciprocal hreflang/language switchers.
3. Update all three blog indexes and sitemap URL blocks.
4. Link to relevant tools and related guides where appropriate.
5. Run `python3 scripts/stamp-assets.py --check`, `npm test`, and browser checks.
6. Commit to a PR for human editorial approval; do not mass-publish automatically.

## Tests
- `npm test`: 13 backend tests passed; 143 site pages / 141 indexable sitemap URLs, zero issues.
- 390px browser crawl: 143 pages, zero page/width failures.
- No backend converter code or shared stylesheet changes.

A blog is not a formal AdSense eligibility requirement or a guarantee of approval. The purpose is to help actual visitors understand formats and conversion limitations.
