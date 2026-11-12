"""Post-render checks for new localized pages and hub/sitemap references."""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlparse

from build import ROOT, LANGS, url_for


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag == "img":
            self.images.append((attrs.get("src", ""), attrs.get("alt")))


def verify(draft, root=ROOT):
    errors = []
    sitemap = (root / "sitemap.xml").read_text(encoding="utf-8")
    for story in draft["stories"]:
        slug = story["slug"]
        for lang in LANGS:
            prefix = "" if lang == "en" else lang + "/"
            path = root / prefix / "blog" / slug / "index.html"
            if not path.is_file():
                errors.append(f"{lang}/{slug}: missing page")
                continue
            text = path.read_text(encoding="utf-8")
            canonical = url_for(lang, slug)
            if f'<link rel="canonical" href="{canonical}">' not in text or canonical not in sitemap:
                errors.append(f"{lang}/{slug}: canonical or sitemap missing")
            for alternate in LANGS:
                url = url_for(alternate, slug)
                if f'hreflang="{alternate}" href="{url}"' not in text or f'hreflang="{alternate}" href="{url}"' not in sitemap or f'href="{url}" lang="{alternate}"' not in text:
                    errors.append(f"{lang}/{slug}: {alternate} language target missing")
            if any(f'<meta name="twitter:{key}"' not in text for key in ("card", "title", "description", "image")) or '<meta property="og:title"' not in text or '<meta property="og:description"' not in text:
                errors.append(f"{lang}/{slug}: social tags missing")
            schema_match = re.search(r'<script type="application/ld\+json">(.*?)</script>', text)
            if not schema_match:
                errors.append(f"{lang}/{slug}: NewsArticle schema missing")
            else:
                schema = json.loads(schema_match.group(1))
                if schema.get("@type") != "NewsArticle" or schema.get("mainEntityOfPage") != canonical or schema.get("inLanguage") != lang or schema.get("citation") != story["source_url"]:
                    errors.append(f"{lang}/{slug}: NewsArticle schema invalid")
            refs = Links(); refs.feed(text)
            for link in refs.links:
                if link.startswith("/") and not (root / link.lstrip("/") / "index.html").is_file() and not (root / link.lstrip("/")).is_file():
                    errors.append(f"{lang}/{slug}: broken link {link}")
            for image, alt in refs.images:
                if image.startswith("/") and not (root / image.lstrip("/")).is_file():
                    errors.append(f"{lang}/{slug}: broken image {image}")
                if alt is None:
                    errors.append(f"{lang}/{slug}: missing image alt")
            hub = (root / prefix / "blog/index.html").read_text(encoding="utf-8")
            if f'href="/{prefix}blog/{slug}/"' not in hub:
                errors.append(f"{lang}/{slug}: hub link missing")
            if story["source_url"] not in text or story["source_date"] not in text:
                errors.append(f"{lang}/{slug}: source attribution missing")
    return errors


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--draft", required=True)
    args = ap.parse_args()
    errors = verify(json.loads(Path(args.draft).read_text(encoding="utf-8")))
    for error in errors:
        print(error)
    print(f"{len(errors)} newsroom validation error(s)")
    sys.exit(bool(errors))
