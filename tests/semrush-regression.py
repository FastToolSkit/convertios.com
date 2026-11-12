#!/usr/bin/env python3
"""Standard-library-only checks for Semrush structural and minification regressions."""
from pathlib import Path
import html
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SKIP = {".git", "docs", "node_modules", "tests", "backend", "scripts", "test-results"}
PAGES = sorted(p for p in ROOT.rglob("index.html") if not set(p.relative_to(ROOT).parts) & SKIP)
assert len(PAGES) >= 156
problems = []
jsonld_count = 0
app_count = 0
title_matches = []
assets = {"style.min.css": 0, "script.min.js": 0}
def plain(source):
    return html.unescape(re.sub(r"<[^>]+>", "", source)).strip().casefold()

for page in PAGES:
    rel = page.relative_to(ROOT).as_posix()
    source = page.read_text(encoding="utf-8")
    title = re.search(r"<title[^>]*>(.*?)</title>", source, re.I | re.S)
    h1 = re.search(r"<h1\b[^>]*>(.*?)</h1>", source, re.I | re.S)
    if title and h1 and plain(title.group(1)) == plain(h1.group(1)):
        title_matches.append(rel)
    for block in re.findall(r'<script\s+type="application/ld\+json"[^>]*>(.*?)</script>', source, re.I | re.S):
        jsonld_count += 1
        parsed = json.loads(block)
        roots = parsed if isinstance(parsed, list) else [parsed]
        nodes = [node for root in roots for node in (root.get("@graph", [root]) if isinstance(root, dict) else [])]
        for node in nodes:
            if node.get("@type") == "WebApplication":
                app_count += 1
                if not (node.get("aggregateRating") or node.get("review")):
                    problems.append((rel, "Unrated Software App rich-result candidate"))
    for asset in assets:
        if re.search(r'(?:href|src)="/' + re.escape(asset) + r'\?v=[0-9a-f]{8}"', source):
            assets[asset] += 1
        else:
            problems.append((rel, f"missing minified asset: {asset}"))
    if 'href="/style.css' in source or 'src="/script.js' in source:
        problems.append((rel, "legacy shared unminified asset referenced"))

heading_pages = (
    "about/index.html", "all-tools/index.html", "audio-tools/index.html",
    "ar/all-tools/index.html", "ar/audio-tools/index.html", "ar/faq/index.html",
    "ar/other-tools/index.html", "ar/pdf-tools/index.html", "ar/security/index.html",
    "ar/unit-converter/index.html", "ar/word-counter/index.html",
)
for name in heading_pages:
    source = (ROOT / name).read_text(encoding="utf-8")
    levels = [int(n) for n in re.findall(r"<h([1-6])(?:\s|>)", source)]
    for left, right in zip(levels, levels[1:]):
        if right > left + 1:
            problems.append((name, f"H{left} -> H{right} jump"))

for name, extension in [("style", "css"), ("script", "js")]:
    original = ROOT / f"{name}.{extension}"
    minified = ROOT / f"{name}.min.{extension}"
    if not minified.exists() or minified.stat().st_size >= original.stat().st_size:
        problems.append((str(minified), "minified asset missing or larger than source"))

if title_matches:
    problems.append(("title/H1", "identical title/H1: " + ", ".join(title_matches)))
if app_count:
    problems.append(("JSON-LD", f"{app_count} unsupported unrated WebApplication entries"))
if any(count != len(PAGES) for count in assets.values()):
    problems.append(("assets", "not every HTML page uses minified shared assets"))
try:
    subprocess.check_output(["node", "--check", str(ROOT / "script.min.js")], stderr=subprocess.STDOUT)
except subprocess.CalledProcessError as error:
    problems.append(("JS syntax", error.output.decode(errors="replace")[:500]))

print("PAGES", len(PAGES), "JSON_LD_BLOCKS", jsonld_count, "WEBAPPLICATION", app_count)
print("ASSET_REFS", assets, "MATCHING_TITLE_H1", len(title_matches), "HEADING_CHECKS", len(heading_pages))
for name, detail in problems[:40]:
    print("FAIL", name, detail)
if problems:
    raise SystemExit(f"{len(problems)} Semrush regression failures")
print("PASS Semrush regression checks")
