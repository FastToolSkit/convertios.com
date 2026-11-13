#!/usr/bin/env python3
"""Read-only static SEO discovery audit for the 13 priority tool URLs."""
from html.parser import HTMLParser
from pathlib import Path
from collections import defaultdict
from urllib.parse import urlparse, unquote
import json, re, sys, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://convertios.com"
TARGETS = [
    "/ar/jpg-to-pdf/", "/ar/video-converter/", "/ar/video-to-mp3/",
    "/es/ai-image-enhancer/", "/es/jpg-to-pdf/", "/es/link-shortener/",
    "/es/pdf-to-jpg/", "/es/text-formatter/", "/es/video-converter/",
    "/es/video-to-mp3/", "/jpg-to-pdf/", "/video-converter/", "/video-to-mp3/",
]

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links, self.alternates, self.canonical = [], {}, []
        self.text, self.title, self.h1 = [], [], []
        self.stack = []
        self.robots = []
        self.lang = ""
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html": self.lang = a.get("lang", "")
        if tag == "a" and a.get("href"): self.links.append(a["href"])
        if tag == "link" and a.get("rel", "").lower() == "canonical":
            self.canonical.append(a.get("href", ""))
        if tag == "link" and a.get("rel", "").lower() == "alternate" and a.get("hreflang"):
            self.alternates[a["hreflang"]] = a.get("href", "")
        if tag == "meta" and a.get("name", "").lower() == "robots":
            self.robots.append(a.get("content", ""))
        if tag in ("script","style","title","h1"):
            self.stack.append(tag)
    def handle_endtag(self, tag):
        if tag in ("script","style","title","h1") and tag in self.stack:
            self.stack.remove(tag)
    def handle_data(self, data):
        value = data.strip()
        if not value: return
        if "title" in self.stack: self.title.append(value)
        elif "h1" in self.stack: self.h1.append(value)
        elif "script" not in self.stack and "style" not in self.stack:
            self.text.append(value)

def route_for_link(href, current):
    if href.startswith(("#", "mailto:", "tel:", "javascript:")): return None
    if href.startswith("//"): return None
    if href.startswith("https://") or href.startswith("http://"):
        parsed = urlparse(href)
        if parsed.netloc not in ("convertios.com", "www.convertios.com"): return None
        path = parsed.path
    elif href.startswith("/"): path = urlparse(href).path
    else:
        from urllib.parse import urljoin
        path = urlparse(urljoin(BASE + current, href)).path
    return path if path.endswith("/") else path + "/" if "." not in path.rsplit("/", 1)[-1] else path

def read_page(route):
    p = ROOT / route.lstrip("/") / "index.html"
    if route == "/": p = ROOT / "index.html"
    if not p.is_file(): return None
    page = Page()
    page.feed(p.read_text(encoding="utf-8"))
    return page

def main():
    sitemap = ET.parse(ROOT / "sitemap.xml")
    urls = {node.text.strip() for node in sitemap.iter() if node.tag.endswith("loc") and node.text}
    routes = [urlparse(u).path for u in urls if urlparse(u).netloc == "convertios.com"]
    inbound = defaultdict(set)
    pages = {}
    for route in routes:
        page = read_page(route)
        if page is None: continue
        pages[route] = page
        for link in page.links:
            dest = route_for_link(link, route)
            if dest: inbound[dest].add(route)
    findings = []
    for route in TARGETS:
        page = pages.get(route)
        problems = []
        if page is None:
            findings.append({"url": BASE+route, "issues": ["missing source page"]})
            continue
        if BASE+route not in urls: problems.append("not in sitemap")
        if page.canonical != [BASE+route]: problems.append("canonical mismatch")
        if any("noindex" in tag.lower() for tag in page.robots): problems.append("noindex")
        if len(page.title) == 0 or len(page.h1) == 0: problems.append("missing title or h1")
        if len(page.alternates) < 3: problems.append("missing language alternates")
        if len(inbound[route]) == 0: problems.append("orphan in sitemap graph")
        words = len(re.findall(r"\w+", " ".join(page.text), flags=re.UNICODE))
        if words < 150: problems.append("less than 150 rendered HTML words; review manually")
        findings.append({"url":BASE+route, "lang":page.lang, "words_approx":words,
                         "inbound_sitemap_pages":len(inbound[route]),
                         "sample_referrers":sorted(inbound[route])[:5],
                         "canonical":page.canonical, "alternates":len(page.alternates),
                         "issues":problems})
    print(json.dumps({"sitemap_urls":len(urls),"inspected_urls":len(findings),
                      "with_issues":sum(bool(x["issues"]) for x in findings),
                      "pages":findings},indent=2,ensure_ascii=False))
    return int(any(x["issues"] for x in findings))
if __name__ == "__main__": sys.exit(main())
