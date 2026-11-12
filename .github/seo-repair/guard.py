"""Restrict the SEO agent's staged, unstaged and new changes before draft-PR creation."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]

def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True, encoding="utf-8").splitlines()

paths = sorted(set(git("diff", "--name-only", "HEAD") + git("ls-files", "--others", "--exclude-standard")))
problems = []
for name in paths:
    path = name.replace(chr(92), "/")
    file = ROOT / path
    if not file.is_file() or file.is_symlink():
        problems.append((path, "deleted, missing, symlink, or non-regular file"))
    elif path.startswith((".github/", ".git/")):
        problems.append((path, "protected configuration"))
    elif path.startswith("docs/seo-repairs/") and path.endswith(".md"):
        pass
    elif path.startswith("tests/") and path.endswith((".py", ".mjs", ".js")):
        pass
    elif not path.startswith(("docs/", "scripts/", "tests/", ".")) and path.endswith((".html", ".js", ".css")):
        pass
    else:
        problems.append((path, "unapproved file/path"))
if len(paths) > 20:
    problems.append(("files", "more than 20 files modified"))
if problems:
    for path, why in problems:
        print("DENY", path, why, file=sys.stderr)
    sys.exit(1)
print("SEO patch scope valid:", len(paths), "files")
for path in paths:
    print(" ", path)
