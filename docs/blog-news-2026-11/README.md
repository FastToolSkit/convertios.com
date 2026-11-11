# Convertios news and blog — November 11, 2026

## Initial release

The November release added five news topics in three languages alongside the existing three guides and three hubs, for 27 blog pages. It added the news card layout, AI-generated editorial illustrations, canonical and reciprocal hreflang links, `NewsArticle` data, sitemap records, localized navigation and matching localized footers. The converter implementations and shared CSS were left intact. The illustrations depict concepts; they are not photographs of the reported events.

The original primary sources and event dates are:

- PDF Association Brotli specification, 19 August 2026: https://pdfa.org/no-excuses-brotli-compression-advances-pdf/
- PDF Association PDF/UA-1 notes, 9 September 2026: https://pdfa.org/two-new-technical-notes-addressing-pdf-ua-1-implementations/
- GS1 retail 2D playbook, 11 March 2026; revised 28 May 2026: https://ref.gs1.org/sme-guidance/2d-retail-systems-playbook/archive
- PDF Association PDF-to-HTML algorithm 1.2, 27 September 2026: https://pdfa.org/deriving-pdf-to-html-version-1-2/
- W3C SVG 2 Candidate Recommendation Snapshot, 6 October 2026: https://www.w3.org/news/2026/updated-candidate-recommendation-scalable-vector-graphics-svg-2/

All five Convertios news stories were published on 11 November 2026. A previous browser crawl of the initial release covered 158 pages at 390px and 1280px without page failures. The editorial expansion here needs its own browser run before release; see the checks below.

## Editorial maintenance

The five November 2026 news stories have editable copy in `build_editorial.py`. The script updates their EN, ES and AR article bodies, page metadata and hub cards while preserving the existing navigation, illustrations and footers. Run it from the repository root with `python docs/blog-news-2026-11/build_editorial.py` after changing copy. Review the generated HTML before committing.

## Adding or updating a story

1. Verify the event directly against a dated primary source: a standards body, specification publisher, or the organization making the announcement. Record the event date, revision date and source URL separately. Read the source's status and limitations. Do not rely on a headline or a third-party summary alone.
2. Write original coverage in each language: a short dek; what happened; how it works; implications for ordinary users; a useful checklist; and limitations. Distinguish a draft, specification or industry goal from a shipped feature. Avoid invented quotes, benchmarks and support claims. Quote no more than 25 words from any single source.
3. Add source links inside factual paragraphs and a primary-source list. Include at least two natural links to existing, correctly localized Convertios tools in the body and one relevant blog link. Verify tool behavior in the actual pages or code before naming a capability.
4. Keep the source event date separate from the Convertios publication date. Set `NewsArticle.datePublished` to the actual Convertios publication day in all three versions. Update each page's title, description, canonical, reciprocal hreflang, language switcher, hub card and sitemap entry. Use an honest hero illustration and descriptive alt text; never imply an illustration is a documentary photo.
5. Check each localized page for meaning, reading order and RTL layout. Match its footer to the localized homepage. Preserve conversion-tool markup and scripts.

## Checks

From the repository root:

```text
npm test
python scripts/stamp-assets.py --check
python docs/blog-news-2026-11/verify_editorial.py
node tests/browser/run.mjs --suite pages --widths 390,1280
git diff --check
```

On Windows PowerShell, `npm.cmd test` runs when execution policy blocks `npm.ps1`. The browser suite requires a local Playwright installation. `verify_editorial.py` checks all 27 current blog pages, including internal links written with single or double quotes, images, canonicals, hreflang, localized footer identity, and the five expanded news triples. Extend its slug list and page-count expectation when adding a news story.
