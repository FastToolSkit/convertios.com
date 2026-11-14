# Convertios Newsroom — ChatGPT Codex CLI (no OpenAI API)

## Operational design

**GitHub Actions** checks official RSS/Atom news sources every Monday and Thursday at 08:17 UTC (11:17 Jordan time), records a source snapshot, and uses read-only repository permissions. This workflow never calls an AI model or needs an OpenAI API key.

**Windows Task Scheduler** on the authorized ASUS laptop runs a separate *local* Codex CLI process every Monday and Thursday at **11:45 Jordan local time**. It independently fetches the latest source material using the existing `scripts/newsroom.py` collector (it does not consume the GitHub artifact). It uses the user's existing `codex login` ChatGPT authentication, with **no OpenAI API billing key**. The local runner is `scripts/local_newsroom_runner.py`, installed at:

`C:\Users\ASUS\Convertios-Newsroom-Automation\local_newsroom_runner.py`

The runner clones `main` fresh into a unique per-run directory, obtains official source evidence, and invokes `codex exec --ignore-user-config --ephemeral -s read-only --output-schema ...` against the checked-in schema and prompt. It never grants Codex write access to the repository. Python separately validates and renders at most three verified news events in English, Spanish and Arabic, runs tests and a strict changed-file path guard, then uses authenticated GitHub CLI to open a **DRAFT pull request** against `main`. No workflow, scheduled job, or script merges or publishes the draft. Owner approval and manual merging remain mandatory.

**Conservative source verification**: The prompt requires two distinct collected official publisher domains reporting the *same* event. Source failure, inability to corroborate, missing usage budget, or no new event legitimately results in **zero stories**, no PR. Copied source passages, stale or duplicate events, unsafe URLs and attempts to edit tools/old articles are rejected. Editorial review of any resulting draft remains essential.

The runner refuses to create another PR while an earlier automated newsroom draft is open, to preserve owner reviews.

## Laptop prerequisites

- Windows laptop powered on, awake, connected to the internet **and the ASUS user logged in** at the scheduled time. The scheduled task uses Windows InteractiveToken authentication to reuse the existing Codex and GitHub CLI logins without storing a password.
- Codex CLI authenticated with ChatGPT (`codex login status`); usage limits apply. GitHub CLI authenticated (`gh auth status`) with permission to push branches and create draft PRs.
- Python 3.11 or compatible, Git, and Windows Task Scheduler. The task is configured to run only one instance at a time, start if missed, and operate when on battery.
- No `OPENAI_API_KEY` is required, requested, or stored by this design.
- The local installed file needs to be updated when the versioned runner in GitHub changes. The project should not assume it silently auto-updates itself.

## First-run and diagnostics

The setup was validated on November 14, 2026 using three local modes:

```
python scripts/local_newsroom_runner.py --mode dry-run
python scripts/local_newsroom_runner.py --mode smoke
python scripts/local_newsroom_runner.py --mode live
```

The dry run collected four eligible source candidates. The authenticated Codex smoke produced a schema-valid empty JSON proposal. The first *real* live Codex run also concluded with zero verified stories (no fake PR). Those two runs are not a demonstration of successful draft PR creation; that remains to be proven with the first genuinely corroborated event.

Source feeds can fail: PDF Association and OpenAI article pages denied programmatic access in one live attempt. The collector records and skips denied sources; it does not override access restrictions.

Per-run reports and Codex output logs (which may contain source text) are stored under `C:\Users\ASUS\Convertios-Newsroom-Automation\runs\<run-id>\`. Do not publish the logs or source text verbatim.

The local task is named `Convertios-Newsroom-Local`. To inspect without changing its settings, open Windows Task Scheduler, select the task, and review Last Run Result/History; inspect the latest `result.json` for `draft_pr_created`, `no_verified_stories`, `skipped_pending_review` or `failed`.

## Publication policy

Draft PRs must be reviewed for accurate event dates, direct sources, substantive originality, translated meaning, linked tools, layout, and correct actual publication date. They require explicit owner approval to merge. There is **no automatic publication**.

## Related files

- `.github/workflows/newsroom-drafts.yml`: GitHub read-only source-collection job.
- `.github/newsroom/PROMPT.md` and `.github/newsroom/plan.schema.json`: local Codex constraints.
- `.github/newsroom/guard.py`: independent generation-path allowlist.
- `scripts/newsroom.py`: official source intake, validation and HTML rendering.
- `scripts/local_newsroom_runner.py`: ChatGPT-authenticated local scheduler entry point.
- `tests/test_newsroom.py`: deterministic editorial validation tests.
