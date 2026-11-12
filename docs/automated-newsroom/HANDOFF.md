# Handoff

Implementation branch: `feat/automated-newsroom-v1`, starting at `origin/main` commit `7cb92f1`.

This worktree implementation adds the scheduled/manual draft-only workflow, official feed discovery, a structured editorial prompt and validator, escaped static page renderer, optional capped image generation, duplicate PR gate, verification, and offline tests. The existing site has not been published or altered outside the local branch.

Before enabling scheduled runs, the repository owner must add the two required secrets described in `README.md` and approve the fine-grained PR token. A manual run with default `dry_run: true` is the first integration check. The owner must inspect the draft PR's claims, sources, translations, links, and images before any merge. The workflow does not merge.

Expected safe exits: no valid recent feed entries, blocked official feeds, no API key, missing PR token, duplicate source in published pages or open PRs, malformed JSON, failed validation or tests, and no resulting changed files. Feed availability and Codex output quality are external dependencies. The editor should close drafts with unsupported claims rather than publish them.
