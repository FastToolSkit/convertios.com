# Visual approval checkpoint

Recovered on 2026-11-18 from `f6ad7d8c` in the existing
`feat/content-library-v1` worktree. PR #290 stays a draft; no merge or production
deployment is authorized.

## Owner requirement and approval boundary

The final deliverable requires premium, topic-specific AI editorial cover art
for **all 60 topics**, shared across their 240 localized articles. Eight samples
are present for visual approval; the remaining 52 SVG covers are temporary and
are not an acceptable final result. Explicit owner approval of the visual
direction is required before extending the artwork to those 52 topics.

Preserve the Content Library architecture, six categories, numbered pagination,
four languages, newsroom integration, and sitemap generation.

## Art direction

- Cinematic technology editorial imagery, with rich depth, lighting and color.
- Each composition must express its specific article subject, with a strong
  focal point that survives card and header crops.
- No generic SVG placeholders, simple gradients, plain icons, repeated templates,
  or unrelated technology artwork in the finished library.
- News images must be clearly conceptual illustrations, with no fake official
  photography, fabricated product screenshots, or implied documentary evidence.
- Keep the existing localized illustration disclosure and descriptive image alt
  text. Use consistent 16:10 artwork, responsive 640/960/1440 WebP versions and a
  JPEG fallback, with explicit dimensions and lazy loading outside the lead.

## Preview

The recovered server on port 8890 did not respond. A separate loopback-only
preview on port 8891 serves this same worktree, without altering the old process:

- Comparison: http://127.0.0.1:8891/docs/content-library-visual-review/
- Blog: http://127.0.0.1:8891/blog/
- Article: http://127.0.0.1:8891/blog/convert-pdf-to-word-keep-formatting/
- Arabic: http://127.0.0.1:8891/ar/blog/

`screenshots/` contains the recovered before/after desktop and mobile evidence,
including article, category, pagination, Arabic RTL and the original main-branch
blog. It has not been regenerated during the takeover. The comparison page and
live blog opened successfully in the laptop's in-app browser.

## Verification notes

- `browser-results.json` is the recovered completed browser crawl: 292 pages at
  390px and 1440px, 584 checks, zero recorded failures. It checks overflow, local
  links, anchors, images, RTL and navigation. Third-party requests were blocked;
  these results are not production CWV measurements.
- The generator check passes with the installed Python 3.14. The generator at
  the inherited HEAD already requires Python 3.12+ f-string parsing; default
  Python 3.11 fails before reaching the visual changes.
- The site validator initially reported 24 false cross-language links because
  it classified shared JPEG image URLs as English pages. Its image-language
  exemption now recognizes JPEG/WebP; image existence checks remain enabled.
- A recovery ZIP and SHA-256 manifest were saved outside the worktree before
  takeover edits, preserving all 377 modified and untracked files.

### Completed takeover checks

- Generator: 0 problems, 60 published topics (Python 3.14).
- Content Library and newsroom: 16 unit tests passed.
- Static site: 466 pages, 464 indexable pages and sitemap URLs, 0 problems and
  0 warnings. Asset stamps: 0 problems. `git diff --check`: clean.
- `verify-http.cjs` / `http-results.json`: 18 fresh real-HTTP checks across nine
  routes at 390px and 1440px, including all four languages, article, category,
  page 2 and the review page. Zero HTTP failures, broken images, page exceptions,
  horizontal overflow or incorrect Arabic direction. Maximum observed CLS was
  0.0567, with external services excluded; not a production performance guarantee.
- All 32 cover variants retained their recovery SHA-256 hashes and 16:10 aspect
  ratio. WebP sizes range from 25.1-44.5 KiB at 640px to 57.2-148.7 KiB at 1440px.
- A repeat of the full disk-backed crawl was interrupted by a browser closure;
  its prior complete 584-check report was retained, not overwritten or presented
  as a new pass. The fresh HTTP smoke test subsequently completed through the
  connected laptop. All production page/source/artwork bytes remain identical
  to the recovered preview.

## After explicit visual approval

1. Review/retain suitable existing high-quality art, and complete topic-specific
   editorial covers for all remaining topics; inspect every card/header crop.
2. Complete the newsroom artwork workflow: generate a topic-specific illustration
   from the story brief, review its relevance and truthfulness, optimize variants,
   attach `cover_image` and localized alt text, and validate before publication.
   Future articles must not silently fall back to generic covers. This final
   enforcement is pending the approved full rollout, not claimed complete here.
3. Run full regression and image/performance checks, then update the existing
   draft PR. Stop before merging or deploying.
