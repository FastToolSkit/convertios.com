"""Independent fail-closed path gate for generated newsroom PR contents."""
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True, encoding="utf-8").splitlines()


def check_paths(tracked, new, root=ROOT):
    allowed_tracked = {"blog/index.html", "es/blog/index.html", "ar/blog/index.html", "sitemap.xml"}
    new_page = re.compile(r"^(?:blog|es/blog|ar/blog)/[a-z0-9]+(?:-[a-z0-9]+)+/index\.html$")
    errors = []
    for path in sorted(tracked | new):
        file = root / path
        if not file.is_file() or file.is_symlink():
            errors.append(f"non-regular file: {path}")
        elif path in tracked and path not in allowed_tracked:
            errors.append(f"protected existing file: {path}")
        elif path in new and not new_page.fullmatch(path):
            errors.append(f"unapproved new file: {path}")
    if len(new) > 9 or len(tracked) > 4:
        errors.append("too many changed files")
    return errors


if __name__ == "__main__":
    tracked = set(git("diff", "--name-only", "HEAD"))
    new = set(git("ls-files", "--others", "--exclude-standard"))
    errors = check_paths(tracked, new)
    if errors:
        for error in errors:
            print("DENY", error, file=sys.stderr)
        raise SystemExit(1)
    print(f"Newsroom scope valid: {len(new)} new pages, {len(tracked)} existing hub/sitemap files")
