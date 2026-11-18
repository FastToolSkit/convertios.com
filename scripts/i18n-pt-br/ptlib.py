"""Shared helpers for building /pt-br/ pages from the /es/ templates."""
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
WORK = Path(__file__).resolve().parent

NEWS_POSTS = {'pdf-accessibility-2026', 'pdf-brotli-2026', 'pdf-html-1-2-2026', 'retail-qr-2027', 'svg-2-standard-2026'}


def scope_pages():
    out = []
    for p in sorted((REPO / 'es').rglob('index.html')):
        rel = p.relative_to(REPO / 'es').as_posix()
        parts = rel.split('/')
        if parts[0] == 'blog':
            # The whole blog (hub, listings, categories and every article) is generated in all four
            # languages by scripts/content_library.py from content/blog/*.md; never translate it here.
            continue
        out.append(rel)
    return out


TOKEN = re.compile(r'(<!--.*?-->|<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>|<[^>]+>)', re.S)
TRANS_ATTRS = ('alt', 'title', 'aria-label', 'placeholder', 'data-label', 'data-placeholder')
META_TRANS = re.compile(r'<meta\s+(?:name|property)="(description|keywords|og:title|og:description|twitter:title|twitter:description|og:image:alt)"\s+content="([^"]*)"')
LETTER = re.compile(r'[A-Za-zÀ-ÿ]')
JSON_KEYS = {'name', 'description', 'headline', 'text', 'alternateName', 'about', 'keywords', 'articleSection', 'caption'}
JS_STR = re.compile(r'''("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)''')


def is_text(s):
    s = s.strip()
    if not s or not LETTER.search(s):
        return False
    if re.fullmatch(r'[A-Z0-9 →▾/·•.+\-–—|&;#()]+', s) and len(s) < 12:
        # short all-caps tokens like "PDF ▾", "JPG", "FAQ"
        return False
    return True


def js_strings(code):
    """Return user-facing looking string literals in a JS block."""
    out = []
    for m in JS_STR.finditer(code):
        lit = m.group(0)
        inner = lit[1:-1]
        if not LETTER.search(inner):
            continue
        out.append((m.start(), m.end(), lit))
    return out
