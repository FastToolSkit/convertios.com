# Draft-only automated newsroom

This workflow proposes **zero to three stories per run**, each in English, Spanish, and Arabic. The schedule is Monday and Thursday at **08:17 UTC**; GitHub may delay scheduled jobs. Manual dispatch defaults to a source-only dry run. Only the `FastToolSkit` actor can manually run the model path. No content is published by the workflow: the only output is a **draft PR against `main`**. An owner must review and merge it for publication. A pending newsroom draft blocks new proposals so the branch cannot overwrite an unreviewed story.

## How it works

1. `scripts/newsroom.py collect` reads a small allowlist of official RSS/Atom feeds. It accepts recent dated items (ten days), fetches the linked official page, strips markup, limits size, rejects non-HTTPS or off-list redirects, and excludes source URLs already linked from published English blog pages. It stores the source URL, publisher, date, text, and a research-only license note. Feed contents are untrusted data. Failed feeds are reported; missing or thin source pages are excluded.
2. A read-only `openai/codex-action@v1` job receives that snapshot. The API key is passed **only** to this action step. The action uses `:read-only` and `drop-sudo`, and is the last step in its job. Its prompt requires independent primary-source corroboration for the same event, original prose, five editorial sections, factual citations, status and event date, and three translations. It can return an empty `stories` array. It emits JSON constrained by `.github/newsroom/plan.schema.json`, never a patch or executable code.
3. A new job, with no OpenAI secret, validates the JSON against the exact collected source IDs, dates, two independent domains, approved topics and status, existing tool links, all translations, and a maximum of three stories. It uses escaped text to clone the existing news article design, inserts cards into the existing hubs, and appends reciprocal sitemap records. Stable slugs combine the model's event ID and verified event date. It runs the independent path guard and site regressions before `create-pull-request` opens a **draft**. The guard permits only new blog news pages, the three existing blog hubs, and `sitemap.xml` in the PR.

The feed URL is a discovery lead, **not proof**. A primary page's text must support the claim. Two unrelated announcements do not count as corroboration. The model cannot prove its own factual accuracy: the owner must inspect each paragraph's source links, event date, release status, EN/ES/AR meaning, originality, tool claims, and layout before merging. No article text is licensed for republication; generated copy must be independently synthesized. Avoid quotations entirely. Existing concept artwork is reused and labeled as an illustration.

The renderer fills `datePublished` and the visible Convertios date with the UTC draft run date. If the owner merges later, update those dates in all three article pages to the actual publication date before merging. The event date remains the real source event date and does not change.

## Prerequisites and activation

- Add repository secret `OPENAI_API_KEY` from the OpenAI API platform. A local Codex login or ChatGPT subscription does not supply CI credentials. With no secret, scheduled runs stop after a notice and create no PR. Never put a key in the repo, workflow dispatch input, issue, or chat.
- GitHub Actions must be allowed to create pull requests. If the built-in `GITHUB_TOKEN` is blocked by repository policy, this workflow will fail at PR creation; configure repository Actions permissions before activating. The key and PR token are never shared between jobs.
- After merging this implementation, run `workflow_dispatch` with `dry_run=true` and check source counts/failures. Then configure the key and run a supervised `dry_run=false` test. Verify that a draft PR is created only for real, corroborated news. If no verified event is available, zero stories and no PR is the correct result. The scheduled automation is **not active until this branch is merged and configured on GitHub**.

## Local deterministic verification

From the repository root:

```text
python -m unittest discover -s tests -p 'test_newsroom.py'
python docs/blog-news-2026-11/verify_editorial.py
node --test tests/server.test.js
git diff --check
```

The first command uses only synthetic offline fixture data and requires no API key. It tests zero stories, one complete EN/ES/AR story, canonical/hreflang/schema/sitemap, stable rendering, stale dates, duplicate IDs, and unsafe source URLs. `scripts/newsroom.py validate --intake <snapshot> --plan <proposal> --today YYYY-MM-DD` can inspect a proposed JSON artifact without writing pages. The repository's older `docs/blog-news-2026-11/build_editorial.py` is unchanged and continues to maintain the November articles.

The repository-wide `npm test` currently fails on the base production commit because `scripts/stamp-assets.py --check` reports 246 stale asset stamps across existing pages. The newsroom PR gate runs the unaffected server tests and the existing editorial verifier, and the render tests cover the new page changes. The pre-existing asset-stamp backlog is outside this implementation's edit scope.

## Known limits

The current feed list is deliberately small and some providers may change their feed URLs or markup. Intake fails closed per source. The English page parser strips boilerplate but cannot establish copyright permission; hence source text is research only and is never copied into article pages. Independent-source and date checks are structural; human review is required for semantic verification, translations, and newsworthiness. No GitHub-hosted run or end-to-end draft PR is claimed until the workflow is merged, secrets configured, and a supervised test completes.

Security design follows the [official Codex Action security guidance](https://github.com/openai/codex-action/blob/main/docs/security.md) and [permission profile documentation](https://github.com/openai/codex-action/blob/main/README.md#permission-profiles): least privilege, read-only model job, `drop-sudo`, and a new job for privileged follow-up work.

## First live intake check — 14 November 2026

The read-only collector was exercised on a connected Windows laptop against the real official feeds. It produced **4 eligible source records** (W3C/Mozilla); the PDF Association feed responded HTTP 403, and while OpenAI's RSS XML could be read after increasing the bounded limit to 1.5 MB, linked OpenAI news pages were access-restricted. The collector now stops retrying that publisher on an HTTP 401/403/429 rather than repeatedly requesting protected pages. These failures are recorded and excluded; no article is invented or published. This does not establish that the GitHub-hosted scheduled run will have identical results.
