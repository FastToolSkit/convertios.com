"""Validate Jekyll's generated instant redirects, not the inert Cloudflare _redirects file."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
BUILT = ROOT / "_site"
TARGETS = {
    "ar/es/index.html": "/ar/",
    "ar/es/meme-generator/index.html": "/ar/meme-generator/",
    "ar/es/split-pdf/index.html": "/ar/split-pdf/",
    "ai-enhance/index.html": "/ai-image-enhancer/",
    "remove-background/index.html": "/remove-bg/",
}
for rel, destination in TARGETS.items():
    file = BUILT / rel
    assert file.exists(), f"missing Jekyll redirect page: {rel}"
    html = file.read_text(encoding="utf-8")
    assert re.search(r'http-equiv\s*=\s*["\']refresh["\']', html, re.I), f"missing instant refresh: {rel}"
    assert re.search(r'content\s*=\s*["\']0\s*;', html, re.I), f"redirect not immediate: {rel}"
    assert destination in html, f"wrong redirect destination: {rel} → {destination}"
    print(f"OK {rel} -> {destination}")
print(f"Verified {len(TARGETS)} Jekyll generated immediate redirects")
