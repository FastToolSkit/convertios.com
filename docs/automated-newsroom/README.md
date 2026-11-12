# Automated Convertios newsroom (draft only)

The workflow runs Tuesday and Friday at 08:00 UTC (11:00 in Jordan), or by manual `workflow_dispatch`. Manual runs default to `dry_run: true`: they research, draft, and validate but do not create a PR. A scheduled run can create **one draft PR** with up to three distinct stories, each in English, Spanish, and Arabic. Nothing merges or publishes automatically.

## Owner setup

1. In repository Actions secrets, set `OPENAI_API_KEY` for `openai/codex-action@v1`.
2. Create a **fine-grained** GitHub token with access to this repository and **Contents: read/write** plus **Pull requests: read/write**, approve it manually, and save it as `NEWSROOM_PR_TOKEN`. This is the only credential used to push the proposal branch and open the draft PR. It is never present in the research or image jobs. GitHub Actions' default token remains read-only.
3. Optionally set a separate `OPENAI_IMAGE_API_KEY`. The image job uses `gpt-image-1-mini`, low quality, at most one image per story and three paid calls per run. With no image key, existing AI illustrations are reused and labeled as archive illustrations. Review image pricing before enabling this optional key.
4. Enable GitHub Actions and scheduled workflows in repository settings. The workflow file must reach the default branch before GitHub will schedule it.

Missing `OPENAI_API_KEY` or zero recent verified sources ends the research job without a draft. Missing `NEWSROOM_PR_TOKEN` ends the proposal job without a PR. A malformed draft, failed test, duplicate source, or content validation error fails closed. No `GITHUB_TOKEN` write permission is requested.

## Editorial process

`scripts/newsroom/discover.py` reads allowlisted official RSS/Atom feeds from W3C, PDF Association, Google Developers Blog, Adobe Blog, and GS1. Unavailable or blocked feeds are skipped. Every article fetch has a strict timeout, two retries, a byte bound, a same-allowlist redirect check, and HTML stripping. Feed publication dates must be no older than 21 days. Old page source URLs are excluded. The resulting bounded source text is untrusted data, not an instruction to Codex.

Codex receives only fetched source data and the checked-out site. The prompt demands independent editorial analysis with concrete implications, checklists, caveats, citations, and natural links to two real localized Convertios tools. It returns JSON only. The trusted Python validator requires exactly matching source metadata, short evidence excerpts found in the fetched body, evidence IDs on factual paragraphs, unique slugs and source URLs, a 25-word evidence excerpt budget, and a 12-word anti-copy check. It rejects old dates and broken tool paths. Validation cannot prove every paraphrased claim is true; **the owner must verify each claim and translation against the linked primary source before merging the draft PR**. If that review fails, close or revise the PR. The workflow itself never merges.

`build.py` escapes all text and renders the three article pages using existing localized headers, footers, and newsroom styles. It updates each localized hub's lead and latest sections, plus sitemap, canonical, reciprocal hreflang, language selector, NewsArticle schema, OG and Twitter metadata. It touches no non-blog page or shared CSS. The first selected story is the lead; all selected stories enter Latest. Images are conceptual illustrations, never represented as event photography.

The separate proposal job checks `npm test`, `python scripts/stamp-assets.py --check`, the existing editorial checker, offline newsroom unit tests, and the new page verifier before creating a PR. It queries open PR bodies and aborts if any selected source URL already has a draft. Published pages and open PRs are the duplicate record, so there is no mutable external database. The PR body contains source URLs for this check.

## Local checks

```sh
npm test
python -m unittest discover -s tests -p 'test_newsroom.py'
python scripts/stamp-assets.py --check
python docs/blog-news-2026-11/verify_editorial.py
```

To exercise discovery against live feeds, run `python scripts/newsroom/discover.py --output .newsroom/sources.json`. To render a validated draft, run `python scripts/newsroom/build.py --draft .newsroom/draft.json --sources .newsroom/sources.json`, followed by `python scripts/newsroom/verify.py --draft .newsroom/draft.json`. The `.newsroom` directory is an ephemeral workspace artifact and must not be committed.

## Source and API references

- [W3C official blog feed reference](https://design-system.w3.org/components/rss.html)
- [OpenAI Codex action usage and permission profile](https://github.com/openai/codex-action/blob/main/README.md)
- [OpenAI Images API](https://developers.openai.com/api/reference/resources/images/methods/generate)
