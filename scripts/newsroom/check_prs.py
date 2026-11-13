"""Abort the whole run if an open PR already covers any selected primary URL."""
import argparse
import json
from pathlib import Path
import re
from discover import normalized_url

def duplicates(draft, prs):
    covered = {normalized_url(url) for pr in prs for url in re.findall(r'https://[^\s<>]+', pr.get("body") or "")}
    return [story["source_url"] for story in draft["stories"] if normalized_url(story["source_url"]) in covered or any(story["slug"] in (pr.get("body") or "") for pr in prs)]


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--draft", required=True)
    ap.add_argument("--prs", required=True)
    args = ap.parse_args()
    draft = json.loads(Path(args.draft).read_text(encoding="utf-8"))
    prs = json.loads(Path(args.prs).read_text(encoding="utf-8"))
    repeated = duplicates(draft, prs)
    if repeated:
        raise SystemExit(f"story already in an open PR: {repeated[0]}")
