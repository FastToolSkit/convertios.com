"""Windows local Convertios newsroom: ChatGPT-authenticated Codex CLI, draft PRs only.

No OpenAI API key is used. This file never merges or publishes anything.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import traceback

REPO = "FastToolSkit/convertios.com"
PREFIX = "automation/local-newsroom-"
ROOT_DEFAULT = Path.home() / "Convertios-Newsroom-Automation"
SAFE_ENV = dict(os.environ, PYTHONDONTWRITEBYTECODE="1", GIT_TERMINAL_PROMPT="0", GH_PROMPT_DISABLED="1", PYTHONIOENCODING="utf-8")


def execute(arguments: list[str], cwd: Path | None = None, timeout: int = 120, capture: bool = True) -> str:
    cmd = [str(x) for x in arguments]
    result = subprocess.run(cmd, cwd=str(cwd) if cwd else None, env=SAFE_ENV,
                            capture_output=capture, text=True, encoding="utf-8",
                            errors="replace", timeout=timeout, check=False)
    if result.returncode:
        tail = ((result.stdout or "") + "\n" + (result.stderr or ""))[-1500:]
        raise RuntimeError(f"Command failed (code {result.returncode}): {cmd[0]} {cmd[1] if len(cmd)>1 else ''}; {tail}")
    return result.stdout or ""


def run(mode: str, base: Path, day: str | None = None) -> dict:
    base.mkdir(parents=True, exist_ok=True)
    now = datetime.now(timezone.utc)
    today = day or now.date().isoformat()
    run_id = now.strftime("%Y%m%dT%H%M%SZ") + f"-{os.getpid()}"
    folder = base / "runs" / run_id
    folder.mkdir(parents=True)
    repo = folder / "repo"
    record = {"run": run_id, "mode": mode, "date": today, "status": "started"}
    def save():
        (folder / "result.json").write_text(json.dumps(record, indent=2, ensure_ascii=False), encoding="utf-8")
    try:
        execute(["codex", "login", "status"], timeout=30) if mode != "dry-run" else None
        execute(["gh", "auth", "status"], timeout=30)
        if mode == "live":
            prs = json.loads(execute(["gh", "pr", "list", "-R", REPO, "--state", "open",
                                     "--limit", "100", "--json", "headRefName,number,url"]))
            pending = [x for x in prs if x["headRefName"].startswith(PREFIX) or x["headRefName"] == "automation/newsroom-drafts"]
            if pending:
                record.update(status="skipped_pending_review", pending=pending)
                save()
                return record
        execute(["gh", "repo", "clone", REPO, str(repo), "--", "--depth", "1", "--branch", "main"], timeout=180)
        intake = repo / "newsroom-intake.json"
        execute([sys.executable, "-B", "scripts/newsroom.py", "collect", "--today", today,
                 "--intake", str(intake)], cwd=repo, timeout=180)
        sources = json.loads(intake.read_text(encoding="utf-8"))
        record["sources"] = len(sources["sources"])
        record["feed_failures"] = sources["failures"][:20]
        if mode == "dry-run" or (mode == "live" and len({s["publisher"] for s in sources["sources"]}) < 2):
            record["status"] = "dry_run_complete" if mode == "dry-run" else "skipped_insufficient_sources"
            save()
            return record
        output = repo / "newsroom-plan.json"
        prompt = (repo / ".github/newsroom/PROMPT.md").read_text(encoding="utf-8")
        if mode == "smoke":
            prompt = 'Return only the valid JSON object {"stories": []}. Do not create or edit any files.'
        else:
            prompt += "\nThis is a LOCAL read-only Codex CLI newsroom run. The collected evidence is the file newsroom-intake.json in the current checkout. Only use that evidence; produce strictly valid JSON."
        # No model write access, no API key, no automatic approvals, no persistence of Codex session.
        with (folder / "codex-output.log").open("w", encoding="utf-8") as log:
            model = subprocess.run(["codex", "exec", "--ignore-user-config", "--ephemeral",
                                    "-s", "read-only", "-C", str(repo),
                                    "--output-schema", str(repo / ".github/newsroom/plan.schema.json"),
                                    "-o", str(output), "-"], input=prompt, cwd=repo,
                                   env=SAFE_ENV, text=True, encoding="utf-8", errors="replace",
                                   stdout=log, stderr=subprocess.STDOUT, timeout=1000, check=False)
        if model.returncode:
            raise RuntimeError(f"Codex exited {model.returncode}. See local codex-output.log; no PR created.")
        if not output.exists():
            raise RuntimeError("Codex did not produce an output plan.")
        execute([sys.executable, "-B", "scripts/newsroom.py", "validate", "--today", today,
                 "--intake", str(intake), "--plan", str(output)], cwd=repo)
        plan = json.loads(output.read_text(encoding="utf-8"))
        count = len(plan["stories"])
        record["stories"] = count
        if mode == "smoke" or count == 0:
            record["status"] = "codex_smoke_pass" if mode == "smoke" else "no_verified_stories"
            save()
            return record
        execute([sys.executable, "-B", "scripts/newsroom.py", "render", "--today", today,
                 "--intake", str(intake), "--plan", str(output)], cwd=repo)
        intake.unlink()
        output.unlink()
        execute([sys.executable, "-B", ".github/newsroom/guard.py"], cwd=repo)
        execute([sys.executable, "-B", "-m", "unittest", "discover", "-s", "tests",
                 "-p", "test_newsroom.py"], cwd=repo, timeout=120)
        execute([sys.executable, "-B", "docs/blog-news-2026-11/verify_editorial.py"], cwd=repo)
        execute(["git", "diff", "--check"], cwd=repo)
        branch = PREFIX + now.strftime("%Y%m%d-%H%M%S") + f"-{os.getpid()}"
        if not re.fullmatch(r"automation/local-newsroom-[0-9]{8}-[0-9]{6}-[0-9]+", branch):
            raise RuntimeError("Invalid branch")
        execute(["git", "switch", "-c", branch], cwd=repo)
        # Stage only rendered news pages and hubs; never stage code, the workflow, or existing articles.
        tracked = execute(["git", "diff", "--name-only"], cwd=repo).splitlines()
        new = execute(["git", "ls-files", "--others", "--exclude-standard"], cwd=repo).splitlines()
        import importlib.util
        spec = importlib.util.spec_from_file_location("guard", repo / ".github/newsroom/guard.py")
        guard = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(guard)
        if guard.check_paths(set(tracked), set(new), repo):
            raise RuntimeError("Generated files failed independent scope guard")
        paths = sorted(set(tracked + new))
        execute(["git", "add", "--"] + paths, cwd=repo)
        execute(["git", "diff", "--cached", "--check"], cwd=repo)
        execute(["git", "-c", "user.name=Convertios Newsroom", "-c",
                 "user.email=newsroom@users.noreply.github.com", "commit", "-m",
                 "Draft sourced multilingual newsroom articles"], cwd=repo)
        execute(["git", "push", "-u", "origin", branch], cwd=repo, timeout=180)
        title = f"Newsroom: {count} sourced stories (EN/ES/AR) — {today}"
        url = execute(["gh", "pr", "create", "-R", REPO, "--base", "main", "--head", branch,
                       "--draft", "--title", title, "--body",
                       "Automatically prepared with local ChatGPT-authenticated Codex CLI. DRAFT ONLY. "
                       "Review every claim, source, originality, translation, links, and publication date "
                       "before merging. No automatic publication."], cwd=repo, timeout=90).strip()
        record.update(status="draft_pr_created", pull_request=url, branch=branch)
        save()
        return record
    except Exception as exc:
        record.update(status="failed", error=f"{type(exc).__name__}: {str(exc)[:600]}")
        save()
        raise


def main():
    parser = argparse.ArgumentParser(description="Convertios local draft-only newsroom")
    parser.add_argument("--mode", choices=["dry-run", "smoke", "live"], default="dry-run")
    parser.add_argument("--root", type=Path, default=ROOT_DEFAULT)
    parser.add_argument("--today", help="UTC YYYY-MM-DD (test override)")
    args = parser.parse_args()
    try:
        result = run(args.mode, args.root.resolve(), args.today)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as exc:
        print(f"Newsroom runner failed: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
