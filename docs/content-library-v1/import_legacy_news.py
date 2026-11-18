"""One-time import of the five November 2026 news stories (en/es/ar) into content/blog/<slug>.md.
Bodies are copied verbatim from the reviewed pages so their editorial copy, citations and links are preserved."""
from html import unescape
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
NEWS = {  # slug: (order, event_date, cover, tools)
    "svg-2-standard-2026": (18, "2026-10-06", "SVG 2", "image-converter, webp-to-png"),
    "pdf-html-1-2-2026": (17, "2026-09-27", "PDF → HTML", "pdf-to-word, pdf-to-jpg"),
    "pdf-accessibility-2026": (16, "2026-09-09", "PDF/UA-1", "pdf-to-word, split-pdf"),
    "pdf-brotli-2026": (15, "2026-08-19", "Brotli PDF", "merge-pdf, compress-image"),
    "retail-qr-2027": (14, "2026-03-11", "GS1 2D", "qr-generator, image-resizer"),
}
CATEGORY = {"svg-2-standard-2026": "images-formats", "retail-qr-2027": "qr-web"}
PREFIX = {"en": "", "es": "es/", "ar": "ar/"}

def text(s):
    return re.sub(r"\s+", " ", unescape(re.sub(r"<[^>]+>", "", s))).strip()

for slug, (order, event, cover, tools) in NEWS.items():
    out = ["---", f"category: {CATEGORY.get(slug, 'pdf-documents')}", "type: news", "published: 2026-11-11",
           f"order: {order}", "status: published", f"cover: {cover}", f"tools: {tools}", f"event_date: {event}",
           "body_format: html", "imported_from: docs/blog-news-2026-11 (reviewed November 2026 copy)"]
    en = (ROOT / "blog" / slug / "index.html").read_text(encoding="utf-8")
    for href, label in re.findall(r'<section class="news-sources">.*?</section>', en, re.S) and re.findall(r'<li><a href="(https://[^"]+)"[^>]*>(.*?)</a>', re.search(r'<section class="news-sources">.*?</section>', en, re.S).group(0)):
        out.append(f"source: {text(label)} | {href}")
    out.append("---")
    for lang, prefix in PREFIX.items():
        page = (ROOT / prefix / "blog" / slug / "index.html").read_text(encoding="utf-8")
        title = text(re.search(r"<h1>(.*?)</h1>", page, re.S).group(1))
        seo = text(re.search(r"<title>(.*?)</title>", page, re.S).group(1)).removesuffix(" | Convertios")
        desc = unescape(re.search(r'<meta name="description" content="([^"]*)"', page).group(1))
        dek = text(re.search(r'<p class="article-standfirst">(.*?)</p>', page, re.S).group(1))
        body = re.search(r'<div class="article-body">(.*?)</div><aside', page, re.S).group(1)
        body = re.sub(r"</section>\s*<", "</section>\n<", body).strip()
        alt = unescape(re.search(r'<img alt="([^"]*)" class="news-hero"', page).group(1))
        out += [f"=== {lang} ===", f"title: {title}"] + ([f"seo_title: {seo}"] if seo != title else []) + [f"description: {desc}", f"dek: {dek}", "---", body, ""]
    (ROOT / "content" / "blog" / f"{slug}.md").write_text("\n".join(out) + "\n", encoding="utf-8")
    print("imported", slug)
