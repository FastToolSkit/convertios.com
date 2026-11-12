# Handoff

Implementation branch: `feat/automated-newsroom-v1`, starting at `origin/main` commit `7cb92f1`.

This worktree implementation adds the scheduled/manual draft-only workflow, official feed discovery, a structured editorial prompt and validator, escaped static page renderer, optional capped image generation, duplicate PR gate, verification, and offline tests. The existing site has not been published or altered outside the local branch.

Before enabling scheduled runs, the repository owner must add the two required secrets described in `README.md` and approve the fine-grained PR token. A manual run with default `dry_run: true` is the first integration check. The owner must inspect the draft PR's claims, sources, translations, links, and images before any merge. The workflow does not merge.

Expected safe exits: no valid recent feed entries, blocked official feeds, no API key, missing PR token, duplicate source in published pages or open PRs, malformed JSON, failed validation or tests, and no resulting changed files. Feed availability and Codex output quality are external dependencies. The editor should close drafts with unsupported claims rather than publish them.

## Independent verification on 12 November 2026
- After the initial Codex commit, confirmed six offline newsroom unit tests pass.
- Existing npm test: 13/13 backend tests; static checker 158 pages, 156 indexable/sitemap, zero problems/warnings.
- Asset stamp check and existing 27-blog-page editorial verifier pass.
- YAML workflow parsed: Tue/Fri 08:00 UTC, only research/images/proposal jobs, final action explicitly creates a DRAFT PR.
- Live official feed test: 12 recent source candidates from W3C, Google, GitHub and Cloudflare; max 7000 characters/article source input. Inaccessible PDF Association feed is skipped.
- NO paid Codex API run, NO GitHub Action invocation, NO draft article from a production run and NO live deployment have occurred in this branch. Owner must configure API and PR-token secrets, then trial via manual dry_run.
