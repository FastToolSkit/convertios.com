# Convertios Content Library V1

The blog at `/blog/`, `/es/blog/`, `/ar/blog/` and `/pt-br/blog/` is generated from one Markdown file per topic.
Nothing under those folders is edited by hand.

| Path | Purpose |
| --- | --- |
| `content/blog/<slug>.md` | One topic: shared metadata plus English, Spanish, Arabic and Brazilian Portuguese versions. |
| `content/blog/_templates/<lang>.html` | Page shells (header, navigation, footer, AdSense, analytics) taken from the existing site. |
| `scripts/content_library.py` | Generator and validator (Python standard library only). |
| `assets/blog/library.css` | Blog styles, loaded after the existing site styles. |
| `assets/blog/covers/<slug>.svg` | Legacy SVG assets. Published article covers use the responsive editorial artwork. |
| `assets/blog/editorial/` | AI editorial covers shared across translations, with three WebP sizes and a JPEG fallback. Published topics require `cover_image` and localized `cover_alt`. |
| `assets/blog/og/*.png` | Social preview images per category (`scripts/render_blog_og.py`, needs Playwright). |
| `docs/content-library-v1/inventory.md` | Generated inventory (`python3 docs/content-library-v1/make_inventory.py`). |
| `docs/content-library-v1/editorial-calendar.md` | The 60-topic plan. |

## Commands

```
python3 scripts/content_library.py build     # write pages, listings, categories, covers, sitemap block; then stamp assets
python3 scripts/content_library.py check     # fail if any generated file or the sitemap block is out of date
python3 scripts/content_library.py preview   # also render drafts, noindex, into _preview/ (git-ignored)
python3 scripts/content_library.py report    # counts and word counts per language
python3 -m unittest tests.test_content_library tests.test_newsroom
node tests/site-check.mjs
```

## Adding an article

1. Copy an existing file in `content/blog/` to `content/blog/<new-slug>.md`. The slug is permanent: it becomes the URL in all four languages.
2. Set the metadata: `category` (`pdf-documents`, `images-formats`, `ai-technology`, `audio-video`, `qr-web`, `productivity`), `type` (`guide`, `tutorial`, `comparison`, `news`), `published` (the real publication date), `order` (higher sorts first on the same day), `status: draft` while writing, `cover` (a short label for the cover graphic), `tools` (existing tool slugs), `related` (published topic slugs), `keyword` and `intent`.
3. News also needs `event_date`, `news_status` (`released`, `candidate`, `draft`, `proposal`, `policy`, `updated`) and at least one `source: Title | https://url | YYYY-MM-DD` line. Write the article in your own words, credit every source, and state whether Convertios supports the technology.
4. Write all four language blocks (`=== en ===`, `=== es ===`, `=== ar ===`, `=== pt-br ===`), each with `title`, optional `seo_title`, `description` (50–170 characters, unique), `dek`, then `---` and the body.
5. Run `preview`, review the draft pages, then set `status: published` and run `build`, `check` and the tests.

Body syntax: `##`/`###` headings, paragraphs, `-` and `1.` lists (indent two spaces to nest), `> ` notes, pipe tables, `**bold**`, `` `code` ``, and links: `[text](tool:merge-pdf)` for tools, `[text](blog:other-slug)` for published articles (checked at build), and full `https://` links for sources.

The build refuses a published topic if a language is missing, a tool page or linked article does not exist, a description or title is duplicated or out of range, or a version is below the minimum length (EN 450, ES 350, AR 270, PT-BR 350 words).

## Listings and pagination

- Newest first, 12 per page: `/blog/`, `/blog/page/2/`, … and `/blog/category/<category>/`, `/blog/category/<category>/page/2/`, … in every language.
- Pages are created and removed automatically as articles are added; nothing is hard-coded. Article pages are never deleted by the generator.
- Each listing has a self-canonical, reciprocal `hreflang`, `rel="prev"`/`rel="next"`, numbered links with the current page marked, and disabled Previous/Next at the ends. Everything works without JavaScript.
- The sitemap's blog records live between the `content-library:start` and `content-library:end` markers and are regenerated on every build.

## Newsroom

`scripts/newsroom.py render` turns each approved story into `content/blog/<event>-<YYYYMMDD>.md` and runs the build, so news appears in listings, categories, pagination and the sitemap exactly like any other article. Runs still end in a draft pull request; see `docs/newsroom/README.md`.

## Publication

Merging to `main` publishes through GitHub Pages and triggers the existing IndexNow workflow for changed URLs. Merge only after review; nothing here submits URLs to Google Search Console.
