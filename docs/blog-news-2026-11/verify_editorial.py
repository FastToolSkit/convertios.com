"""Check the 27 localized blog pages and the five expanded news triples."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[2]
SLUGS = ("pdf-brotli-2026", "pdf-accessibility-2026", "retail-qr-2027", "pdf-html-1-2-2026", "svg-2-standard-2026")
ERRORS = []

class Refs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.images = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and "href" in attrs:
            self.links.append(attrs["href"])
        if tag == "img" and "src" in attrs:
            self.images.append((attrs["src"], attrs.get("alt")))

def local_exists(url):
    path = unquote(urlparse(url).path).lstrip("/")
    target = ROOT / path
    return target.is_file() or (target / "index.html").is_file()

for lang in ("en", "es", "ar"):
    prefix = "" if lang == "en" else lang + "/"
    home = (ROOT / prefix / "index.html").read_text(encoding="utf-8")
    home_footer = re.search(r"<footer\b[\s\S]*?</footer>", home).group()
    pages = sorted((ROOT / prefix / "blog").rglob("index.html"))
    if len(pages) < 9:
        ERRORS.append(f"{lang}: expected at least 9 blog pages, found {len(pages)}")
    for path in pages:
        text = path.read_text(encoding="utf-8")
        rel = path.relative_to(ROOT).as_posix()
        footer = re.search(r"<footer\b[\s\S]*?</footer>", text)
        if not footer or footer.group() != home_footer:
            ERRORS.append(f"{rel}: footer differs from localized homepage")
        refs = Refs(); refs.feed(text)
        for href in refs.links:
            if href.startswith("/") and not href.startswith("//") and not local_exists(href):
                ERRORS.append(f"{rel}: broken internal link {href}")
        for src,alt in refs.images:
            if src.startswith("/") and not local_exists(src):
                ERRORS.append(f"{rel}: broken image {src}")
            if alt is None:
                ERRORS.append(f"{rel}: image missing alt attribute {src}")
        url = "https://convertios.com/" + rel.removesuffix("index.html")
        if f'<link rel="canonical" href="{url}">' not in text:
            ERRORS.append(f"{rel}: incorrect canonical")
        for alt_lang,alt_prefix in (("en",""),("es","es/"),("ar","ar/")):
            stem = rel.removeprefix(prefix).removesuffix("index.html")
            alternate = f'<link rel="alternate" hreflang="{alt_lang}" href="https://convertios.com/{alt_prefix}{stem}">'
            if alternate not in text:
                ERRORS.append(f"{rel}: missing equivalent {alt_lang} hreflang")
    for slug in SLUGS:
        rel = f"{prefix}blog/{slug}/index.html"
        text = (ROOT / rel).read_text(encoding="utf-8")
        article = re.search(r"<article\b[\s\S]*?</article>", text).group()
        body = article.split("<section class='news-sources'>")[0]
        paras = re.findall(r"<p(?:\s[^>]*)?>(.*?)</p>", body, re.S)
        paragraph_html = " ".join(paras)
        tool_links = [href for href in re.findall(r"<a\s[^>]*href=['\"]([^'\"]+)", paragraph_html) if href.startswith("/" + prefix) and "/blog/" not in href and href != "/" + prefix + "blog/"]
        blog_links = [href for href in re.findall(r"<a\s[^>]*href=['\"]([^'\"]+)", paragraph_html) if "/blog/" in href and not href.endswith("/blog/")]
        if len(tool_links) < 2 or not blog_links:
            ERRORS.append(f"{rel}: needs two contextual tool links and a related blog link")
        if not re.search(r"<a\s[^>]*href=['\"]https?://", paragraph_html):
            ERRORS.append(f"{rel}: source not cited in a paragraph")
        if len(re.findall(r"<section>", article)) != 5:
            ERRORS.append(f"{rel}: expected five editorial sections")
        schema = re.search(r'<script type="application/ld\+json">(.*?)</script>', text).group(1)
        data = json.loads(schema)
        if data.get("datePublished") != "2026-11-11" or data.get("inLanguage") != lang:
            ERRORS.append(f"{rel}: NewsArticle date or language incorrect")
        if lang == "en":
            words = len(re.sub(r"<[^>]*>", " ", article).split())
            if not 450 <= words <= 700:
                ERRORS.append(f"{rel}: English article {words} words, expected 450–700")

print("localized blog pages checked; 15 original expanded news pages checked")
for error in ERRORS:
    print(error)
raise SystemExit(1 if ERRORS else 0)
