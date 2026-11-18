"""Independent fail-closed path gate for generated newsroom PR contents."""
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True, encoding="utf-8").splitlines()


LANG = r"(?:(?:es|ar|pt-br)/)?"
NEWS_SLUG = r"[a-z0-9]+(?:-[a-z0-9]+)+-20\d{6}"  # newsroom slugs always end with the event date
# Existing files a news run may touch: the sitemap and generated Content Library listings only.
LISTING = re.compile(rf"^{LANG}blog/(?:index\.html|page/\d+/index\.html|category/[a-z]+(?:-[a-z]+)*/(?:page/\d+/)?index\.html)$")
# New files: the story source, its four localized pages, its cover, and listing pages added by pagination growth.
NEW = re.compile(rf"^(?:content/blog/{NEWS_SLUG}\.md|{LANG}blog/{NEWS_SLUG}/index\.html|assets/blog/editorial/{NEWS_SLUG}-(?:(?:640|960|1440)\.webp|1440\.jpg)|assets/blog/covers/{NEWS_SLUG}\.svg)$")


def check_paths(tracked, new, root=ROOT):
    errors = []
    for path in sorted(tracked | new):
        file = root / path
        if not file.is_file() or file.is_symlink():
            errors.append(f"non-regular file: {path}")
        elif path in tracked and not (path == "sitemap.xml" or LISTING.fullmatch(path)):
            errors.append(f"protected existing file: {path}")
        elif path in new and not (NEW.fullmatch(path) or LISTING.fullmatch(path)):
            errors.append(f"unapproved new file: {path}")
    stories = {path for path in new if path.startswith("content/blog/")}
    if len(stories) > 3 or len(new) > 60 or len(tracked) > 160:
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
    print(f"Newsroom scope valid: {len(new)} new files, {len(tracked)} existing listing/sitemap files")
