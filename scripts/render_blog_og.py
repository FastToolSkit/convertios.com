#!/usr/bin/env python3
"""Rasterize the social-preview images for the Content Library (assets/blog/og/*.png).
Open Graph images must be PNG/JPG, so the SVG cover style is rendered once per category with Playwright.
Requires the `playwright` Python package and Chromium; output is committed, so this is only rerun when
categories change. Usage: python3 scripts/render_blog_og.py"""
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
import content_library as lib
from playwright.sync_api import sync_playwright

OUT = lib.ROOT / "assets/blog/og"
OUT.mkdir(parents=True, exist_ok=True)
jobs = {c: lib.L10N["en"]["cat"][c] for c in lib.CATEGORIES}
jobs["blog"] = "Convertios Blog"
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1200, "height": 750})
    for name, label in jobs.items():
        cat = name if name in lib.CATEGORIES else "qr-web"
        topic = lib.Topic(f"og-{name}", cat, "guide", None, 0, "published", label, [], [], {}, [], {}, None)
        page.set_content(f'<html><body style="margin:0;line-height:0">{lib.cover_svg(topic)}</body></html>')
        page.screenshot(path=str(OUT / f"{name}.png"), clip={"x": 0, "y": 70, "width": 1200, "height": 630})
    browser.close()
print("rendered", len(jobs), "images to", OUT.relative_to(lib.ROOT))
