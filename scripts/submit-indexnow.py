#!/usr/bin/env python3
"""Notify IndexNow of changed canonical pages after a successful static-site deployment."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
HOST = "convertios.com"
ORIGIN = f"https://{HOST}"
KEY = "9104e249e3ba8e1f263e715ad699c855"
ENDPOINT = "https://api.indexnow.org/indexnow"
NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


def urls_from_sitemap(xml_bytes):
    root = ET.fromstring(xml_bytes)
    urls = {e.text.strip() for e in root.findall(".//s:url/s:loc", NS) if e.text}
    if not urls or any(not u.startswith(ORIGIN + "/") for u in urls):
        raise ValueError("Sitemap contains no URLs or URLs outside the expected host")
    return urls


def canonical_from_path(path):
    if not path.endswith(".html"):
        return None
    if path == "index.html":
        return ORIGIN + "/"
    if path.endswith("/index.html"):
        return ORIGIN + "/" + path[:-len("index.html")]
    return ORIGIN + "/" + path[:-len(".html")] + "/"


def collect(before, after, all_pages):
    current = urls_from_sitemap((ROOT / "sitemap.xml").read_bytes())
    if all_pages:
        return sorted(current)
    if not before or not after:
        raise ValueError("--before and --after are required unless --all is used")
    # Include URLs removed from a previous sitemap, as deletions also need notification.
    previous = urls_from_sitemap(subprocess.check_output(
        ["git", "show", f"{before}:sitemap.xml"], cwd=ROOT))
    changes = git("diff", "--name-only", "--diff-filter=ACDMRT", before, after).splitlines()
    changed = {canonical_from_path(p) for p in changes}
    candidates = ((current ^ previous) | (changed & (current | previous)))
    return sorted(u for u in candidates if u and u.startswith(ORIGIN + "/"))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--before")
    parser.add_argument("--after")
    parser.add_argument("--all", action="store_true", help="One-time full sitemap submission")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    key_file = ROOT / f"{KEY}.txt"
    if not key_file.exists() or key_file.read_text(encoding="utf-8").strip() != KEY:
        raise ValueError("IndexNow root key file is missing or invalid")
    urls = collect(args.before, args.after, args.all)
    print(f"IndexNow: {len(urls)} canonical URLs selected")
    if args.dry_run:
        print("\n".join(urls))
        return
    if not urls:
        return
    # IndexNow supports up to 10,000 URLs per POST.
    for offset in range(0, len(urls), 10000):
        batch = urls[offset:offset + 10000]
        payload = json.dumps({"host": HOST, "key": KEY, "urlList": batch}).encode("utf-8")
        req = urllib.request.Request(ENDPOINT, data=payload,
            headers={"Content-Type": "application/json; charset=utf-8"}, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                if response.status not in (200, 202):
                    raise RuntimeError(f"Unexpected IndexNow status: {response.status}")
                print(f"IndexNow accepted {len(batch)} URLs (HTTP {response.status})")
        except urllib.error.HTTPError as error:
            print(f"IndexNow failed HTTP {error.code}: {error.read(300)!r}", file=sys.stderr)
            raise


if __name__ == "__main__":
    main()
