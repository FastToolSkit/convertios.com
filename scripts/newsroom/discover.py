"""Fetch bounded, dated primary-source material for offline editorial drafting."""
import argparse
import datetime as dt
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import time
from urllib.parse import urljoin, urlparse
from urllib.request import Request, HTTPRedirectHandler, build_opener
import xml.etree.ElementTree as ET

# Verified official RSS endpoints (November 2026). Unavailable feeds are skipped.
FEEDS = {
    "www.w3.org": ["https://www.w3.org/news/feed/", "https://www.w3.org/blog/feed/"],
    "blog.google": ["https://blog.google/innovation-and-ai/technology/ai/rss/"],
    "hacks.mozilla.org": ["https://hacks.mozilla.org/feed/"],
    "github.blog": ["https://github.blog/feed/"],
    "blog.cloudflare.com": ["https://blog.cloudflare.com/rss/"],
    "pdfa.org": ["https://pdfa.org/feed/"],  # May return HTTP 403
}
ALLOWED = tuple(FEEDS) + ("w3.org", "gs1.org", "www.pdfa.org")
MAX_AGE_DAYS = 21


def equivalent_hosts(domain):
    return {"www.w3.org", "w3.org"} if domain == "www.w3.org" else {"www.gs1.org", "gs1.org"} if domain == "www.gs1.org" else {"www.pdfa.org", "pdfa.org"} if domain == "pdfa.org" else {domain}


def allowed(url):
    if not isinstance(url, str) or len(url) > 2048 or any(ord(char) < 33 or ord(char) == 127 for char in url):
        return False
    p = urlparse(url)
    return p.scheme == "https" and p.hostname in ALLOWED and not p.username and not p.password and not p.port


def normalized_url(url):
    p = urlparse(url)
    host = p.hostname.removeprefix("www.") if p.hostname in {"www.w3.org", "www.gs1.org", "www.pdfa.org"} else p.hostname
    return f"{p.scheme}://{host}{p.path.rstrip('/')}"


class SafeRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not allowed(newurl):
            raise ValueError("redirect left primary-source allowlist")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def fetch(url, retries=2, article=False, max_bytes=180_000):
    if not allowed(url):
        raise ValueError("source URL outside allowlist")
    opener = build_opener(SafeRedirect())
    for attempt in range(retries + 1):
        try:
            with opener.open(Request(url, headers={"User-Agent": "ConvertiosNewsroom/1.0 (+https://convertios.com/blog/)"}), timeout=8) as r:
                if not allowed(r.url):
                    raise ValueError("final URL outside allowlist")
                if article and r.headers.get_content_type() not in {"text/html", "application/xhtml+xml"}:
                    raise ValueError("article is not HTML")
                data = r.read(max_bytes + 1)
                if len(data) > max_bytes:
                    raise ValueError("source too large")
                return r.url, data.decode("utf-8", "replace")
        except (OSError, ValueError):
            if attempt == retries:
                raise
            time.sleep(attempt + 1)


class Body(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts, self.blocked, self.depth = [], 0, 0

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style", "nav", "footer", "header", "aside", "form"}:
            self.blocked += 1
        if tag in {"article", "main"}:
            self.depth += 1
        if tag in {"p", "h1", "h2", "h3", "li"}:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if tag in {"script", "style", "nav", "footer", "header", "aside", "form"}:
            self.blocked = max(0, self.blocked - 1)
        if tag in {"article", "main"}:
            self.depth = max(0, self.depth - 1)

    def handle_data(self, data):
        if not self.blocked:
            self.parts.append(data)


def clean_body(raw):
    parser = Body()
    parser.feed(raw)
    return re.sub(r"[ \t]+", " ", html.unescape("".join(parser.parts)))[:7000].strip()


def date_of(value):
    from email.utils import parsedate_to_datetime
    try:
        return dt.datetime.fromisoformat(value.replace("Z", "+00:00")).date()
    except ValueError:
        try:
            return parsedate_to_datetime(value).date()
        except (ValueError, TypeError, IndexError):
            return None


def feed_items(raw, feed_url):
    root = ET.fromstring(raw)
    for item in list(root.iter()):
        if item.tag.rsplit("}", 1)[-1] not in {"item", "entry"}:
            continue
        fields = {c.tag.rsplit("}", 1)[-1]: c for c in item}
        link = fields.get("link")
        url = (link.get("href") if link is not None and link.get("href") else link.text if link is not None else "") or ""
        title = fields.get("title")
        published = next((fields[k] for k in ("published", "pubDate", "updated") if k in fields), None)
        if title is None or published is None:
            continue
        yield {"url": urljoin(feed_url, url), "title": "".join(title.itertext()).strip()[:180], "source_date": date_of(published.text or "")}


def discover(today, existing_urls=()):
    out, seen = [], {normalized_url(url) for url in existing_urls}
    for domain, feeds in FEEDS.items():
        for feed in feeds:
            try:
                _, raw = fetch(feed, max_bytes=400_000)
                for entry in list(feed_items(raw, feed))[:8]:
                    url, day = entry["url"], entry["source_date"]
                    if not allowed(url) or urlparse(url).hostname not in equivalent_hosts(domain) or not day or not 1 <= (today - day).days <= MAX_AGE_DAYS or normalized_url(url) in seen:
                        continue
                    try:
                        final, page = fetch(url, article=True, max_bytes=800_000)
                    except (OSError, ValueError) as exc:
                        print(f"skip source {urlparse(url).hostname}: {type(exc).__name__}")
                        continue
                    if urlparse(final).hostname not in equivalent_hosts(domain):
                        continue
                    body = clean_body(page)
                    if len(body) < 400 or normalized_url(final) in seen:
                        continue
                    seen.add(normalized_url(final))
                    out.append({**entry, "url": final, "source_date": day.isoformat(), "publisher": domain, "body": body})
            except (OSError, ValueError, ET.ParseError) as exc:
                print(f"skip feed {domain}: {type(exc).__name__}")
    out.sort(key=lambda item: (item["source_date"], item["title"]), reverse=True)
    per_publisher, diverse = {}, []
    for item in out:
        domain = item["publisher"]
        if per_publisher.get(domain, 0) >= 4:
            continue
        per_publisher[domain] = per_publisher.get(domain, 0) + 1
        diverse.append(item)
        if len(diverse) >= 12:
            break
    return diverse


def existing_source_urls(root):
    from pathlib import Path
    urls = set()
    for path in (root / "blog").glob("*/index.html"):
        text = path.read_text(encoding="utf-8")
        for match in re.findall(r'<a\s[^>]*href=[\'"](https://[^\'"]+)[\'"]', text):
            if allowed(match):
                urls.add(match)
    return urls


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--output", required=True)
    args = ap.parse_args()
    root = Path(__file__).resolve().parents[2]
    stories = discover(dt.datetime.now(dt.timezone.utc).date(), existing_source_urls(root))
    Path(args.output).write_text(json.dumps({"retrieved_at": dt.datetime.now(dt.timezone.utc).isoformat(), "sources": stories}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"verified recent primary sources: {len(stories)}")
