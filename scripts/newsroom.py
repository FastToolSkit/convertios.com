"""Draft-only newsroom intake and deterministic page renderer. Python standard library only."""
from __future__ import annotations

import argparse
from datetime import date, datetime, timezone
from email.utils import parsedate_to_datetime
from html import escape, unescape
from html.parser import HTMLParser
import hashlib
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit, urlunsplit
from urllib.error import HTTPError
from urllib.request import Request, build_opener, HTTPRedirectHandler
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
FEEDS = {
    "w3c-news": ("https://www.w3.org/blog/news/feed/", "www.w3.org", "standards"),
    "w3c-blog": ("https://www.w3.org/blog/feed/", "www.w3.org", "standards"),
    "pdf-association": ("https://pdfa.org/feed/", "pdfa.org", "pdf"),
    "openai-news": ("https://openai.com/news/rss.xml", "openai.com", "ai"),
    "google-developer-news": ("https://blog.google/technology/developers/rss/", "blog.google", "tools"),
    "mozilla-hacks": ("https://hacks.mozilla.org/feed/", "hacks.mozilla.org", "web"),
    "mdn-blog": ("https://developer.mozilla.org/en-US/blog/rss.xml", "developer.mozilla.org", "web"),
    "mozilla": ("https://blog.mozilla.org/en/feed/", "blog.mozilla.org", "web"),
}
HOSTS = {v[1] for v in FEEDS.values()} | {"w3.org", "www.pdfa.org", "www.openai.com", "blog.google", "web.dev", "gs1.org", "www.gs1.org"}
TOPICS = {"ai-tools", "pdf-documents", "images-formats", "qr-web", "audio-video"}
ART = {"ai-tools": "image-formats.png", "pdf-documents": "accessibility.png", "images-formats": "image-formats.png", "qr-web": "barcode.png", "audio-video": "image-formats.png"}
STATUS_LABELS = {"en": "Status", "es": "Estado", "ar": "الحالة"}
STATUS_VALUES = {"released": ("released", "publicado", "صدر"), "candidate": ("candidate", "candidato", "مرشح"), "draft": ("draft", "borrador", "مسودة"), "proposal": ("proposal", "propuesta", "مقترح"), "policy": ("policy", "política", "سياسة")}
LANGS = ("en", "es", "ar")
LABELS = {
    "en": ("Technology News", "What happened", "Why it matters", "What users should know", "What to check", "Limits and status", "Primary sources", "More coverage", "Source date", "Published by Convertios", "Original source"),
    "es": ("Noticias de tecnología", "Qué ocurrió", "Por qué importa", "Qué deben saber los usuarios", "Qué comprobar", "Límites y estado", "Fuentes primarias", "Más noticias", "Fecha de la fuente", "Publicado por Convertios", "Fuente original"),
    "ar": ("أخبار التقنية", "ما الذي حدث", "لماذا يهم", "ما الذي ينبغي للمستخدم معرفته", "ما الذي ينبغي التحقق منه", "الحدود والحالة", "المصادر الأصلية", "المزيد من التغطية", "تاريخ المصدر", "نشرته Convertios", "المصدر الأصلي"),
}


def canonical_url(url: str) -> str:
    parts = urlsplit(url)
    host = (parts.hostname or "").lower()
    if parts.scheme != "https" or host not in HOSTS or parts.username or parts.password or parts.port:
        raise ValueError(f"unapproved source URL: {url[:120]}")
    if not parts.path.startswith("/") or "\\" in parts.path or any(x in parts.path for x in ("..", "%")):
        raise ValueError("invalid source path")
    return urlunsplit(("https", host, parts.path.rstrip("/") or "/", "", ""))


class SafeRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, msg, headers, newurl):
        canonical_url(newurl)
        return super().redirect_request(request, fp, code, msg, headers, newurl)


def fetch(url: str, limit: int = 1_500_000) -> bytes:
    canonical_url(url)
    with build_opener(SafeRedirect).open(Request(url, headers={"User-Agent": "ConvertiosNewsroom/1.0 (editorial research)", "Accept": "application/rss+xml, application/atom+xml, text/html, application/xml"}), timeout=12) as response:
        canonical_url(response.url)
        content_type = response.headers.get_content_type()
        if content_type not in {"text/html", "application/xhtml+xml", "application/rss+xml", "application/atom+xml", "text/xml", "application/xml"}:
            raise ValueError("unsupported source media type")
        body = response.read(limit + 1)
        if len(body) > limit:
            raise ValueError("oversized source")
        return body


class VisibleText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.hidden = 0
    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style", "nav", "footer", "header", "svg"}:
            self.hidden += 1
        if tag in {"p", "h1", "h2", "h3", "li"}:
            self.parts.append(" ")
    def handle_endtag(self, tag):
        if tag in {"script", "style", "nav", "footer", "header", "svg"} and self.hidden:
            self.hidden -= 1
    def handle_data(self, data):
        if not self.hidden:
            self.parts.append(data)


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", unescape(value)).strip()


def feed_items(body: bytes):
    root = ET.fromstring(body)
    for node in root.findall(".//item") + root.findall("{http://www.w3.org/2005/Atom}entry"):
        title = node.findtext("title") or node.findtext("{http://www.w3.org/2005/Atom}title") or ""
        link = node.findtext("link") or ""
        if not link:
            for item in node.findall("{http://www.w3.org/2005/Atom}link"):
                if item.attrib.get("rel", "alternate") == "alternate":
                    link = item.attrib.get("href", "")
                    break
        raw_date = (node.findtext("pubDate") or node.findtext("{http://www.w3.org/2005/Atom}published") or node.findtext("{http://www.w3.org/2005/Atom}updated") or "")
        try:
            published = datetime.fromisoformat(raw_date.replace("Z", "+00:00")).date() if re.match(r"\d{4}-\d{2}-\d{2}T", raw_date) else parsedate_to_datetime(raw_date).date()
        except (ValueError, TypeError, IndexError):
            continue
        yield clean_text(title), link, published


def published_sources(root: Path = ROOT) -> set[str]:
    urls = set()
    for page in (root / "blog").glob("*/index.html"):
        text = page.read_text(encoding="utf-8")
        for url in re.findall(r'https://[^"\'<>\s]+', text):
            try:
                urls.add(canonical_url(unescape(url)))
            except ValueError:
                pass
    return urls


def collect(today: date, root: Path = ROOT, fetcher=fetch) -> dict:
    seen = published_sources(root)
    entries, failures = [], []
    for name, (feed, host, context) in FEEDS.items():
        try:
            data = fetcher(feed)
            items = list(feed_items(data))
        except (OSError, ValueError, ET.ParseError) as exc:
            failures.append(f"{name}: {type(exc).__name__}")
            continue
        for title, link, published in items[:20]:
            if not (0 <= (today - published).days <= 10) or len(title) < 15:
                continue
            try:
                url = canonical_url(link)
                if url in seen:
                    continue
                page = fetcher(url)
                parser = VisibleText(); parser.feed(page.decode("utf-8", "replace"))
                body = clean_text("".join(parser.parts))[:12_000]
                if len(body) < 300:
                    continue
            except (OSError, ValueError) as exc:
                failures.append(f"{name} page: {type(exc).__name__}")
                if isinstance(exc, HTTPError) and exc.code in {401, 403, 429}:
                    break  # Respect access controls and rate limits; do not hammer this publisher.
                continue
            seen.add(url)
            entries.append({"id": hashlib.sha256(url.encode()).hexdigest()[:16], "url": url, "title": title[:200], "source_date": published.isoformat(), "publisher": host, "context": context, "license_context": "Research only; no article text licensed for republication. Write original synthesis and link to the source.", "text": body})
    return {"generated_utc": today.isoformat(), "sources": entries[:40], "failures": failures}


def strict_date(value: str) -> date:
    if not isinstance(value, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        raise ValueError("invalid date")
    return date.fromisoformat(value)


def prose(value, lower=25, upper=1800):
    if not isinstance(value, str) or not lower <= len(value) <= upper or "<" in value or ">" in value or "http" in value.lower():
        raise ValueError("invalid prose field")
    return value.strip()


def copied_passage(paragraph: str, source_text: str, words=12) -> bool:
    """Reject substantial contiguous reuse of source wording, ignoring punctuation."""
    source = re.findall(r"\w+", source_text.casefold())
    written = re.findall(r"\w+", paragraph.casefold())
    if len(written) < words:
        return False
    samples = {tuple(source[i:i + words]) for i in range(len(source) - words + 1)}
    return any(tuple(written[i:i + words]) in samples for i in range(len(written) - words + 1))


def validate(plan: dict, intake: dict, today: date, root: Path = ROOT) -> list[dict]:
    if not isinstance(intake, dict) or intake.get("generated_utc") != today.isoformat() or not isinstance(intake.get("sources"), list):
        raise ValueError("intake is missing or stale")
    if not isinstance(plan, dict) or set(plan) != {"stories"} or not isinstance(plan["stories"], list) or len(plan["stories"]) > 3:
        raise ValueError("expected zero to three stories")
    for source in intake["sources"]:
        if not isinstance(source, dict) or not isinstance(source.get("id"), str) or not re.fullmatch(r"[a-f0-9]{16}|source-[a-z]", source["id"]):
            raise ValueError("invalid source identifier")
        url = canonical_url(source.get("url", ""))
        if source.get("publisher") != urlsplit(url).hostname or not 0 <= (today - strict_date(source.get("source_date"))).days <= 10 or len(source.get("text", "")) < 300:
            raise ValueError("invalid source metadata")
    source_map = {s["id"]: s for s in intake["sources"]}
    if len(source_map) != len(intake["sources"]):
        raise ValueError("duplicate intake IDs")
    already_published = published_sources(root)
    used_events, used_sources = set(), set()
    for story in plan["stories"]:
        if set(story) != {"event_id", "topic", "event_date", "status", "source_ids", "versions"}:
            raise ValueError("unexpected story fields")
        event = story["event_id"]
        if not isinstance(event, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+){2,8}", event) or event in used_events:
            raise ValueError("invalid or duplicate event ID")
        used_events.add(event)
        if story["topic"] not in TOPICS or story["status"] not in {"released", "candidate", "draft", "proposal", "policy"}:
            raise ValueError("invalid topic or status")
        event_date = strict_date(story["event_date"])
        if not 0 <= (today - event_date).days <= 10:
            raise ValueError("event is stale or future dated")
        ids = story["source_ids"]
        if not isinstance(ids, list) or not 2 <= len(ids) <= 6 or len(ids) != len(set(ids)) or any(i not in source_map for i in ids):
            raise ValueError("at least two collected sources required")
        if len({source_map[i]["publisher"] for i in ids}) < 2:
            raise ValueError("independent source domains required")
        if any(abs((strict_date(source_map[i]["source_date"]) - event_date).days) > 10 for i in ids):
            raise ValueError("source dates do not match event")
        if any(source_map[i]["url"] in already_published for i in ids):
            raise ValueError("event source was already published")
        if any(i in used_sources for i in ids):
            raise ValueError("source reused by another story")
        used_sources.update(ids)
        slug = slug_for(event, event_date)
        if any((root / ("" if lang == "en" else lang) / "blog" / slug / "index.html").exists() for lang in LANGS):
            raise ValueError("story slug already published")
        if any(url_for(lang, slug) in (root / "sitemap.xml").read_text(encoding="utf-8") for lang in LANGS):
            raise ValueError("story URL already in sitemap")
        versions = story["versions"]
        if not isinstance(versions, dict) or set(versions) != set(LANGS):
            raise ValueError("all three translations required")
        for lang in LANGS:
            version = versions[lang]
            if set(version) != {"title", "description", "dek", "sections", "tools", "related_slug"}:
                raise ValueError("unexpected translation fields")
            prose(version["title"], 20, 130); prose(version["description"], 60, 220); prose(version["dek"], 60, 300)
            if len(version["sections"]) != 5:
                raise ValueError("five sections required")
            paragraph_count = 0
            cited = set()
            paragraph_texts = []
            for section in version["sections"]:
                if set(section) != {"paragraphs"} or not 1 <= len(section["paragraphs"]) <= 3:
                    raise ValueError("invalid section")
                for paragraph in section["paragraphs"]:
                    if set(paragraph) != {"text", "evidence"}:
                        raise ValueError("invalid paragraph")
                    prose(paragraph["text"], 80, 1200)
                    if not isinstance(paragraph["evidence"], list) or not paragraph["evidence"] or any(i not in ids for i in paragraph["evidence"]):
                        raise ValueError("every paragraph needs collected evidence")
                    cited.update(paragraph["evidence"])
                    if any(copied_passage(paragraph["text"], source_map[i]["text"]) for i in ids):
                        raise ValueError("substantial passage copied from a source")
                    paragraph_count += 1
                    paragraph_texts.append(paragraph["text"])
            if paragraph_count < 7:
                raise ValueError("article too short")
            if len(set(paragraph_texts)) != len(paragraph_texts):
                raise ValueError("repeated article paragraphs")
            if len(re.findall(r"\w+", " ".join(paragraph_texts))) < {"en": 400, "es": 350, "ar": 250}[lang]:
                raise ValueError("article is below editorial length")
            if len({source_map[i]["publisher"] for i in cited}) < 2:
                raise ValueError("both independent sources must be cited in each language")
            tools = version["tools"]
            prefix = "/" if lang == "en" else f"/{lang}/"
            if not isinstance(tools, list) or len(tools) != 2 or len(set(tools)) != 2 or any(not isinstance(t, str) or not t.startswith(prefix) or not (root / t.lstrip("/") / "index.html").is_file() or "/blog/" in t for t in tools):
                raise ValueError("two existing localized tool links required")
            related = version["related_slug"]
            if not isinstance(related, str) or not re.fullmatch(r"[a-z0-9-]+", related) or not (root / prefix.lstrip("/") / "blog" / related / "index.html").is_file():
                raise ValueError("related blog page missing")
    return plan["stories"]


def slug_for(event: str, event_date: date) -> str:
    return f"{event}-{event_date:%Y%m%d}"


def url_for(lang: str, slug: str) -> str:
    return f"https://convertios.com/{'' if lang == 'en' else lang + '/'}blog/{slug}/"


def replace_once(text: str, pattern: str, replacement: str, flags=0) -> str:
    result, n = re.subn(pattern, lambda _: replacement, text, count=1, flags=flags)
    if n != 1:
        raise ValueError(f"template marker missing: {pattern[:70]}")
    return result


def render_page(story, lang, intake, today, root=ROOT):
    slug = slug_for(story["event_id"], strict_date(story["event_date"]))
    version = story["versions"][lang]
    template = (root / ("" if lang == "en" else lang) / "blog/pdf-brotli-2026/index.html").read_text(encoding="utf-8")
    page = template.replace("pdf-brotli-2026", slug)
    title, description, dek = (escape(version[k], quote=True) for k in ("title", "description", "dek"))
    page = replace_once(page, r"<title>.*?</title>", f"<title>{title} | Convertios</title>")
    page = replace_once(page, r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{description}">')
    page = replace_once(page, r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{title}">')
    page = replace_once(page, r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{description}">')
    page = replace_once(page, r'<meta property="article:published_time" content="[^"]*">', f'<meta property="article:published_time" content="{today.isoformat()}">')
    art = ART[story["topic"]]
    page = replace_once(page, r'<meta property="og:image" content="[^"]*">', f'<meta property="og:image" content="https://convertios.com/assets/blog/{art}">')
    schema = {"@context": "https://schema.org", "@type": "NewsArticle", "headline": version["title"], "description": version["description"], "datePublished": today.isoformat(), "mainEntityOfPage": url_for(lang, slug), "image": f"https://convertios.com/assets/blog/{art}", "inLanguage": lang, "publisher": {"@type": "Organization", "name": "Convertios", "url": "https://convertios.com/"}, "citation": [next(s["url"] for s in intake["sources"] if s["id"] == i) for i in story["source_ids"]]}
    page = replace_once(page, r'<script type="application/ld\+json">.*?</script>', '<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False).replace("<", "\\u003c") + '</script>', re.S)
    label = LABELS[lang]
    prefix = "/" if lang == "en" else f"/{lang}/"
    citations = {s["id"]: s for s in intake["sources"]}
    sections = []
    for index, section in enumerate(version["sections"]):
        paragraphs = []
        for p in section["paragraphs"]:
            links = " ".join(f'<a href="{escape(citations[i]["url"], quote=True)}" rel="noopener noreferrer">[{j + 1}]</a>' for j, i in enumerate(p["evidence"]))
            paragraphs.append(f'<p>{escape(p["text"])} {links}</p>')
        sections.append(f'<section><h2>{label[index + 1]}</h2>{"".join(paragraphs)}</section>')
    source_links = "".join(f'<li><a href="{escape(citations[i]["url"], quote=True)}" rel="noopener noreferrer">{escape(citations[i]["publisher"])}: {escape(citations[i]["title"])}</a> ({escape(citations[i]["source_date"])})</li>' for i in story["source_ids"])
    tools = " ".join(f'<a href="{escape(t, quote=True)}">{escape(t.strip("/").split("/")[-1].replace("-", " "))}</a>' for t in version["tools"])
    related = f'{prefix}blog/{version["related_slug"]}/'
    main = (f'<main class="page-content newsroom-article" id="main-content"><article class="editorial-article news-article">'
            f'<nav class="article-breadcrumb" aria-label="Blog"><a href="{prefix}blog/">{label[0]}</a></nav>'
            f'<header class="article-header"><span class="editorial-kicker">News / {escape(story["topic"].replace("-", " & "))}</span><h1>{title}</h1><p class="article-standfirst">{dek}</p>'
            f'<div class="article-facts"><p><span>{label[8]}</span><strong>{story["event_date"]}</strong></p><p><span>{label[9]}</span><strong>{today.isoformat()}</strong></p><p><span>{label[10]}</span><a href="{escape(citations[story["source_ids"][0]]["url"], quote=True)}">{escape(citations[story["source_ids"][0]]["publisher"])}</a></p><p><span>{STATUS_LABELS[lang]}</span><strong>{STATUS_VALUES[story["status"]][LANGS.index(lang)]}</strong></p></div></header>'
            f'<figure class="article-figure"><img alt="{escape(version["title"], quote=True)}" class="news-hero" height="1024" src="/assets/blog/{art}" width="1536"><figcaption>Convertios editorial illustration</figcaption></figure>'
            f'<div class="article-body">{"".join(sections)}<p>{tools}</p><section class="news-sources"><h2>{label[6]}</h2><ul>{source_links}</ul></section></div>'
            f'<aside class="related-coverage"><h2>{label[7]}</h2><ul><li><a href="{related}">{escape(version["related_slug"].replace("-", " "))}</a></li></ul></aside></article></main>')
    page = replace_once(page, r'<main class="page-content newsroom-article".*?</main>', main, re.S)
    return page


def render(plan, intake, today: date, root: Path = ROOT):
    stories = validate(plan, intake, today, root)
    if not stories:
        return []
    changes = {}
    for story in stories:
        slug = slug_for(story["event_id"], strict_date(story["event_date"]))
        for lang in LANGS:
            path = root / ("" if lang == "en" else lang) / "blog" / slug / "index.html"
            changes[path] = render_page(story, lang, intake, today, root)
    for lang in LANGS:
        path = root / ("" if lang == "en" else lang) / "blog/index.html"
        hub = path.read_text(encoding="utf-8")
        cards = ""
        for story in stories:
            slug = slug_for(story["event_id"], strict_date(story["event_date"]))
            v = story["versions"][lang]
            href = f"/{'' if lang == 'en' else lang + '/'}blog/{slug}/"
            art = ART[story["topic"]]
            cards += f'<a class="secondary-story" href="{href}"><span class="story-image"><img src="/assets/blog/{art}" alt="" width="1536" height="1024" loading="lazy"></span><div class="story-copy"><span class="editorial-kicker">News</span><h3>{escape(v["title"])}</h3><p>{escape(v["dek"])}</p><span class="story-meta">{story["event_date"]}</span></div></a>'
        changes[path] = replace_once(hub, r'<div class="secondary-grid">', '<div class="secondary-grid">' + cards)
    path = root / "sitemap.xml"
    sitemap = path.read_text(encoding="utf-8")
    records = ""
    for story in stories:
        slug = slug_for(story["event_id"], strict_date(story["event_date"]))
        for lang in LANGS:
            records += f'<url><loc>{url_for(lang, slug)}</loc>\n'
            for alternative in (*LANGS, "x-default"):
                records += f'  <xhtml:link rel="alternate" hreflang="{alternative}" href="{url_for("en" if alternative == "x-default" else alternative, slug)}"/>\n'
            records += '</url>\n'
    changes[path] = replace_once(sitemap, r'</urlset>', records + '</urlset>')
    for path, content in changes.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
    return [str(p.relative_to(root)).replace("\\", "/") for p in changes]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=("collect", "validate", "render"))
    parser.add_argument("--intake", type=Path, default=Path("newsroom-intake.json"))
    parser.add_argument("--plan", type=Path, default=Path("newsroom-plan.json"))
    parser.add_argument("--today", type=date.fromisoformat, default=datetime.now(timezone.utc).date())
    args = parser.parse_args()
    if args.command == "collect":
        args.intake.write_text(json.dumps(collect(args.today), ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Collected intake at {args.intake}")
        return
    intake = json.loads(args.intake.read_text(encoding="utf-8"))
    plan = json.loads(args.plan.read_text(encoding="utf-8"))
    if args.command == "validate":
        print(f"Validated {len(validate(plan, intake, args.today))} stories")
    else:
        print("Rendered:", ", ".join(render(plan, intake, args.today)))


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, TypeError, json.JSONDecodeError) as exc:
        print(f"Newsroom rejected: {exc}", file=sys.stderr)
        raise SystemExit(1)
