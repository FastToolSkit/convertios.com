# Convertios SEO Codex repair automation (V1)

This automation works with the **existing ChatGPT Monday indexing monitor**. The ChatGPT monitor reads OpenSEO/Google Search Console, and, when it finds a **verified, actionable defect**, creates an issue authored by `FastToolSkit` with the label `seo-audit-ready` in this repository. This label is the bridge to the GitHub workflow. Merely being excluded by Google does not justify a repair.

The GitHub action listens for that label and also supports a manual `workflow_dispatch` dry run with an owner-authored issue number. It validates the issue owner, treats its body as untrusted data, and runs official `openai/codex-action@v1` only when configured. Codex can edit a small allowed subset of site code. Tests and a protected-file guard must pass before the workflow creates a **draft**, review-only repair PR. No automatic merge or deployment. Zero changes means zero repair PR.

## Recipient and credentials

- Notification recipient configured in GitHub Actions variable: `SEO_ALERT_TO=mohamed.escape93@gmail.com`.
- **Required for Codex:** repository secret `OPENAI_API_KEY` (an API key; the ChatGPT subscription or laptop Codex login does not supply it).
- **Required for direct email:** `SEO_SMTP_USERNAME` and `SEO_SMTP_APP_PASSWORD` repository secrets. Gmail sender account must allow an app password with two-step verification. The normal Gmail login password is not suitable. Never paste these into issues or chat.
- **Optional:** `SEO_PR_TOKEN` GitHub token with repo contents and PR permissions if the built-in GitHub Actions token cannot create PRs. GitHub may require enabling 'Allow GitHub Actions to create and approve pull requests' in Settings > Actions > General. Built-in token is attempted first.
- On a run without the API key, the job validates issue data and skips Codex; it does **not** make changes.
- On a run without sender secrets, email is skipped with a GitHub Actions warning. The recipient address alone cannot send email.

## Test and activation

1. Run `Convertios SEO Codex Repair` with a trusted test issue and `dry_run=true`. Verify successful preflight and the report in Actions summary.
2. Set the three secrets in GitHub repo Settings > Secrets and variables > Actions. Never publish secret values.
3. Repeat with a *verified fixable test issue*, `dry_run=false`, and inspect the resulting DRAFT PR. Do not merge without human review. Validate notification delivery in the email inbox.
4. Existing ChatGPT weekly monitor continues reporting on Mondays; it can create a labeled issue only after independent verification. The GitHub workflow does not have GSC credentials and **does not directly run the OpenSEO connector**.
5. Track API credit consumption and keep max one action at a time. Use `workflow_dispatch` for manual reproductions, not untrusted PR events.

## Safety and limitations

- Owner-authored issue only; no issue comments or external PR bodies trigger Codex.
- Existing site content may contain untrusted material; Codex prompt rejects embedded commands.
- Local source changes restricted by `.github/seo-repair/guard.py`, max 20 files.
- Independent regression gates: `npm test`, asset stamp and blog content tests.
- False positives (unindexed but technically correct) produce no code edits. AdSense approval isn't automated.
- Email delivery isn't available until authenticated SMTP secrets are configured.
