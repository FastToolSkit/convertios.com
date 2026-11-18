"""Draft-only newsroom intake and deterministic page renderer. Python standard library only."""
from __future__ import annotations

import argparse
from datetime import date, datetime, timezone
from email.utils import parsedate_to_datetime
from html import escape, unescape
from html.parser import HTMLParser
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import subprocess
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
# Plan topics map onto Content Library categories ("ai-tools" is the legacy name kept for old plans).
TOPICS = {"ai-tools": "ai-technology", "ai-technology": "ai-technology", "pdf-documents": "pdf-documents",
          "images-formats": "images-formats", "qr-web": "qr-web", "audio-video": "audio-video", "productivity": "productivity"}
STATUSES = ("released", "candidate", "draft", "proposal", "policy")
LANGS = ("en", "es", "ar", "pt-br")
PREFIX = {"en": "", "es": "es/", "ar": "ar/", "pt-br": "pt-br/"}
MIN_WORDS = {"en": 400, "es": 350, "ar": 250, "pt-br": 350}
# Section headings, in the site's normal news order.
LABELS = {
    "en": ("What happened", "Why it matters", "What users should know", "What to check", "Limits and status"),
    "es": ("Qué ocurrió", "Por qué importa", "Qué deben saber los usuarios", "Qué comprobar", "Límites y estado"),
    "ar": ("ما الذي حدث", "لماذا يهم", "ما الذي ينبغي للمستخدم معرفته", "ما الذي ينبغي التحقق منه", "الحدود والحالة"),
    "pt-br": ("O que aconteceu", "Por que importa", "O que os usuários devem saber", "O que verificar", "Limites e status"),
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
    for page in [*(root / "blog").glob("*/index.html"), *(root / "content" / "blog").glob("*.md")]:
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
    # Plain single-line prose only: no HTML, URLs, line breaks or Markdown syntax that could restructure the page.
    if (not isinstance(value, str) or not lower <= len(value.strip()) <= upper or any(c in value for c in "<>\n\r`|[]")
            or "http" in value.lower() or "**" in value or re.match(r"\s*(?:#|>|[-*+]\s|\d+[.)]\s|=== )", value)):
        raise ValueError("invalid prose field")
    return value.strip()


def tool_slug(path: str, lang: str) -> str:
    prefix = "/" if lang == "en" else f"/{lang}/"
    if not isinstance(path, str) or not path.startswith(prefix) or not path.endswith("/") or "/blog/" in path:
        raise ValueError("invalid localized tool path")
    slug = path[len(prefix):].strip("/")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        raise ValueError("invalid localized tool path")
    return slug


def library_topic(root: Path, slug: str) -> bool:
    path = root / "content" / "blog" / f"{slug}.md"
    return path.is_file() and re.search(r"^status: published$", path.read_text(encoding="utf-8").split("\n=== ", 1)[0], re.M) is not None


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
        if story["topic"] not in TOPICS or story["status"] not in STATUSES:
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
        if (root / "content" / "blog" / f"{slug}.md").exists() or any((root / PREFIX[lang] / "blog" / slug / "index.html").exists() for lang in LANGS):
            raise ValueError("story slug already published")
        if any(url_for(lang, slug) in (root / "sitemap.xml").read_text(encoding="utf-8") for lang in LANGS):
            raise ValueError("story URL already in sitemap")
        versions = story["versions"]
        if not isinstance(versions, dict) or set(versions) != set(LANGS):
            raise ValueError("all four translations required (en, es, ar, pt-br)")
        tool_sets, related_slugs = set(), set()
        for lang in LANGS:
            version = versions[lang]
            if set(version) != {"title", "description", "dek", "sections", "tools", "related_slug", "cover_alt"}:
                raise ValueError("unexpected translation fields")
            if lang != "en":
                for field in ("title", "description", "dek", "cover_alt"):
                    if version[field].strip().casefold() == versions["en"][field].strip().casefold():
                        raise ValueError(f"{lang}: translate {field} before generating a draft")
                english_paragraphs = {p["text"].strip().casefold() for section in versions["en"]["sections"]
                                      for p in section["paragraphs"]}
                if any(p["text"].strip().casefold() in english_paragraphs for section in version["sections"]
                       for p in section["paragraphs"]):
                    raise ValueError(f"{lang}: an article paragraph duplicates the English version")
            prose(version["cover_alt"], 12, 300)
            prose(version["title"], 20, 130); prose(version["description"], 60, 165); prose(version["dek"], 60, 300)
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
            if len(re.findall(r"\w+", " ".join(paragraph_texts))) < MIN_WORDS[lang]:
                raise ValueError("article is below editorial length")
            if len({source_map[i]["publisher"] for i in cited}) < 2:
                raise ValueError("both independent sources must be cited in each language")
            tools = version["tools"]
            if not isinstance(tools, list) or len(tools) != 2 or len(set(tools)) != 2:
                raise ValueError("two existing localized tool links required")
            slugs = tuple(tool_slug(t, lang) for t in tools)
            if any(not (root / PREFIX[lang] / t / "index.html").is_file() for t in slugs):
                raise ValueError("two existing localized tool links required")
            tool_sets.add(slugs)
            related = version["related_slug"]
            if not isinstance(related, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", related) or not library_topic(root, related):
                raise ValueError("related blog page missing")
            related_slugs.add(related)
        # The library stores one tool list and one related article per topic, shared by all languages.
        if len(tool_sets) != 1 or len(related_slugs) != 1:
            raise ValueError("every language must use the same tools and related article")
    return plan["stories"]


def slug_for(event: str, event_date: date) -> str:
    return f"{event}-{event_date:%Y%m%d}"


def url_for(lang: str, slug: str) -> str:
    return f"https://convertios.com/{PREFIX[lang]}blog/{slug}/"


def library():
    spec = importlib.util.spec_from_file_location("content_library", Path(__file__).resolve().parent / "content_library.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules.setdefault("content_library", module)
    spec.loader.exec_module(module)
    return module


def topic_markdown(story, intake, today: date, order: int) -> str:
    """Serialise one validated story as a Content Library source file (content/blog/<slug>.md)."""
    citations = {s["id"]: s for s in intake["sources"]}
    number = {source_id: n + 1 for n, source_id in enumerate(story["source_ids"])}
    en = story["versions"]["en"]
    tools = ", ".join(tool_slug(t, "en") for t in en["tools"])
    lines = ["---", f"category: {TOPICS[story['topic']]}", "type: news", f"published: {today.isoformat()}", f"order: {order}",
             "status: published", f"cover: News · {story['event_date']}", f"tools: {tools}", f"related: {en['related_slug']}",
             f"event_date: {story['event_date']}", f"news_status: {story['status']}", f"keyword: {story['event_id'].replace('-', ' ')}",
             "intent: news", "generated_by: scripts/newsroom.py"]
    lines.append("cover_image: " + slug_for(story["event_id"], strict_date(story["event_date"])))
    for source_id in story["source_ids"]:
        source = citations[source_id]
        title = re.sub(r"[|\n\r]+", " ", f"{source['publisher']}: {source['title']}").strip()
        lines.append(f"source: {title} | {source['url']} | {source['source_date']}")
    lines.append("---")
    for lang in LANGS:
        version = story["versions"][lang]
        lines += [f"=== {lang} ===", f"cover_alt: {version['cover_alt'].strip()}", f"title: {version['title'].strip()}", f"description: {version['description'].strip()}",
                  f"dek: {version['dek'].strip()}", "---"]
        for heading, section in zip(LABELS[lang], version["sections"]):
            lines += [f"## {heading}", ""]
            for paragraph in section["paragraphs"]:
                refs = ", ".join(f"[{number[i]}]({citations[i]['url']})" for i in paragraph["evidence"])
                lines += [f"{paragraph['text'].strip()} ({refs})", ""]
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def render(plan, intake, today: date, root: Path = ROOT):
    """Write validated stories as Content Library topics and rebuild listings, categories and the sitemap."""
    stories = validate(plan, intake, today, root)
    if not stories:
        return []
    content = root / "content" / "blog"
    orders = [int(m.group(1)) for p in content.glob("*.md") for m in [re.search(r"^order: (\d+)$", p.read_text(encoding="utf-8"), re.M)] if m]
    order = max(orders, default=0)
    written = []
    for story in stories:
        order += 1
        slug = slug_for(story["event_id"], strict_date(story["event_date"]))
        path = content / f"{slug}.md"
        path.write_text(topic_markdown(story, intake, today, order), encoding="utf-8", newline="\n")
        written.append(path)
    lib = library()
    lib.set_root(root)
    try:
        changed = lib.write(lib.build())
    except lib.LibraryError as exc:
        for path in written:
            path.unlink()
        raise ValueError(f"content library rejected the story: {exc}") from None
    stamper = root / "scripts" / "stamp-assets.py"
    if stamper.is_file():
        subprocess.run([sys.executable, str(stamper)], cwd=root, check=True, stdout=subprocess.DEVNULL)
    return sorted({*changed, *(str(p.relative_to(root)).replace("\\", "/") for p in written)})


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
