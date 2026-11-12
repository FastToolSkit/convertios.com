"""Validate editorial JSON and render only escaped data into existing static templates."""
import argparse
import datetime as dt
import html
import json
from pathlib import Path
import re
from urllib.parse import urlparse

from discover import allowed, normalized_url, MAX_AGE_DAYS

ROOT = Path(__file__).resolve().parents[2]
LANGS = ("en", "ar", "es")
THEMES = {"pdf": "accessibility.png", "image": "image-formats.png", "qr": "barcode.png", "web": "barcode.png", "audio": "image-formats.png", "ai": "image-formats.png"}
LABELS = {
    "en": ("Technology News", "News", "Source date", "Published by Convertios", "Original source", "Illustration from the Convertios archive; AI-generated, not a documentary image", "Primary source", "Practical checklist", "Caveats"),
    "es": ("Noticias de tecnología", "Noticia", "Fecha de la fuente", "Publicado por Convertios", "Fuente original", "Ilustración del archivo de Convertios; generada con IA, no es una fotografía documental", "Fuente primaria", "Lista práctica", "Limitaciones"),
    "ar": ("أخبار التقنية", "خبر", "تاريخ المصدر", "نُشر في Convertios", "المصدر الأصلي", "رسم من أرشيف Convertios مولّد بالذكاء الاصطناعي، وليس صورة وثائقية", "المصدر الأصلي", "قائمة عملية", "القيود"),
}


def fail(message):
    raise ValueError(message)


def required_text(value, field, low=1, high=2000):
    if not isinstance(value, str) or not low <= len(value.strip()) <= high or "<" in value or ">" in value or any(ord(char) < 32 or ord(char) == 127 for char in value):
        fail(f"invalid {field}")
    return value.strip()


def url_for(lang, slug):
    return f"https://convertios.com/{'' if lang == 'en' else lang + '/'}blog/{slug}/"


def validate(data, sources, today, root=ROOT):
    if set(data) != {"stories"} or not isinstance(data["stories"], list) or len(data["stories"]) > 3:
        fail("expected at most three stories")
    source_map = {s["url"]: s for s in sources["sources"]}
    seen_urls, seen_slugs = set(), set()
    for story in data["stories"]:
        if set(story) != {"slug", "category", "source_url", "source_date", "source_title", "source_publisher", "evidence", "image_theme", "locales"}:
            fail("unexpected story fields")
        slug = story["slug"]
        if not isinstance(slug, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) or len(slug) > 65 or slug in seen_slugs:
            fail("invalid or repeated slug")
        if any((root / ("" if l == "en" else l) / "blog" / slug).exists() for l in LANGS):
            fail("slug already published")
        seen_slugs.add(slug)
        source = source_map.get(story["source_url"])
        if not source or not allowed(story["source_url"]) or normalized_url(story["source_url"]) in seen_urls:
            fail("unverified or duplicate source URL")
        seen_urls.add(normalized_url(story["source_url"]))
        date = dt.date.fromisoformat(story["source_date"])
        if story["source_date"] != source["source_date"] or not 1 <= (today - date).days <= MAX_AGE_DAYS:
            fail("source is outside recent verified date window")
        if story["source_title"] != source["title"] or story["source_publisher"] != source["publisher"]:
            fail("source metadata differs from discovery")
        required_text(story["category"], "category", 3, 60)
        if story["image_theme"] not in THEMES:
            fail("unknown image theme")
        ev = story["evidence"]
        if not isinstance(ev, list) or not 2 <= len(ev) <= 6:
            fail("need two to six source evidence snippets")
        ids = set()
        for item in ev:
            if set(item) != {"id", "quote"} or not re.fullmatch(r"e[1-6]", item["id"]) or item["id"] in ids:
                fail("invalid evidence ID")
            ids.add(item["id"])
            quote = required_text(item["quote"], "evidence quote", 12, 140)
            if " ".join(quote.split()).casefold() not in " ".join(source["body"].split()).casefold():
                fail("evidence not found in fetched source body")
        if sum(len(e["quote"].split()) for e in ev) > 25:
            fail("source evidence exceeds 25 words")
        if set(story["locales"]) != set(LANGS):
            fail("all three locales required")
        for lang in LANGS:
            loc = story["locales"][lang]
            if set(loc) != {"title", "description", "category", "sections", "checklist", "caveats"}:
                fail("unexpected locale fields")
            required_text(loc["title"], "title", 20, 140)
            required_text(loc["description"], "description", 60, 200)
            required_text(loc["category"], "category", 3, 60)
            if not isinstance(loc["sections"], list) or len(loc["sections"]) != 3:
                fail("three editorial sections required")
            tool_links, fact_count, article_words = set(), 0, 0
            for section in loc["sections"]:
                if set(section) != {"heading", "paragraphs"}:
                    fail("unexpected section fields")
                required_text(section["heading"], "heading", 5, 100)
                if not isinstance(section["paragraphs"], list) or not 1 <= len(section["paragraphs"]) <= 3:
                    fail("invalid paragraph count")
                for p in section["paragraphs"]:
                    if set(p) != {"text", "kind", "evidence", "links"} or p["kind"] not in {"fact", "analysis"}:
                        fail("unexpected paragraph fields")
                    content = required_text(p["text"], "paragraph", 80, 1200)
                    article_words += len(content.split())
                    if not isinstance(p["evidence"], list) or any(e not in ids for e in p["evidence"]):
                        fail("invalid paragraph evidence")
                    if p["kind"] == "fact":
                        fact_count += 1
                        if not p["evidence"]:
                            fail("factual paragraph lacks source evidence")
                    elif p["evidence"]:
                        fail("analysis paragraph must be clearly distinct from source facts")
                    if not isinstance(p["links"], list) or len(p["links"]) > 3:
                        fail("invalid links")
                    for link in p["links"]:
                        if set(link) != {"anchor", "path"}:
                            fail("invalid link fields")
                        anchor = required_text(link["anchor"], "anchor", 6, 100)
                        path = link["path"]
                        prefix = "/" if lang == "en" else f"/{lang}/"
                        if content.count(anchor) != 1 or not isinstance(path, str) or not re.fullmatch(r"/(?:[a-z0-9-]+/)+", path) or not path.startswith(prefix) or "/blog/" in path or not (root / path.lstrip("/") / "index.html").is_file():
                            fail("link anchor or localized tool path invalid")
                        tool_links.add(path)
            if fact_count < 1 or len(tool_links) < 2 or article_words < (250 if lang == "en" else 140):
                fail("article lacks sourced facts, depth, or two distinct tool links")
            if not isinstance(loc["checklist"], list) or not 3 <= len(loc["checklist"]) <= 5:
                fail("practical checklist required")
            for item in loc["checklist"]:
                required_text(item, "checklist item", 25, 250)
            required_text(loc["caveats"], "caveats", 100, 900)
            # Prevent long exact copying even when it is not entered as evidence.
            source_words = re.findall(r"\w+", source["body"].casefold())
            article_words_list = re.findall(r"\w+", " ".join(p["text"] for s in loc["sections"] for p in s["paragraphs"]).casefold())
            source_ngrams = {tuple(source_words[i:i+12]) for i in range(max(0, len(source_words)-11))}
            if any(tuple(article_words_list[i:i+12]) in source_ngrams for i in range(max(0, len(article_words_list)-11))):
                fail("article copies a 12-word source passage")
            short_ngrams = {}
            for index in range(max(0, len(source_words) - 4)):
                short_ngrams.setdefault(tuple(source_words[index:index+5]), []).append(index)
            copied, index = 0, 0
            while index <= len(article_words_list) - 5:
                best = 0
                for source_index in short_ngrams.get(tuple(article_words_list[index:index+5]), []):
                    length = 5
                    while index + length < len(article_words_list) and source_index + length < len(source_words) and article_words_list[index+length] == source_words[source_index+length]:
                        length += 1
                    best = max(best, length)
                if best:
                    copied += best
                    index += best
                else:
                    index += 1
            if copied > 25:
                fail("article copies over 25 source words")
    return data["stories"]


def esc(value):
    return html.escape(value, quote=True)


def para_html(p, source_url, publisher):
    content = p["text"]
    spans = sorted(((content.index(link["anchor"]), link) for link in p["links"]), key=lambda x: x[0])
    out, offset = [], 0
    for pos, link in spans:
        if pos < offset:
            fail("overlapping anchors")
        out.append(esc(content[offset:pos]))
        out.append(f'<a href="{esc(link["path"])}">{esc(link["anchor"])}</a>')
        offset = pos + len(link["anchor"])
    out.append(esc(content[offset:]))
    if p["kind"] == "fact":
        out.append(f' <a href="{esc(source_url)}" rel="noopener noreferrer">{esc(publisher)}</a>')
    return "<p>" + "".join(out) + "</p>"


def replace_tag(text, pattern, replacement):
    updated, count = re.subn(pattern, lambda _: replacement, text, count=1)
    if count != 1:
        fail(f"template marker missing: {pattern}")
    return updated


def story_image(story, root=ROOT):
    generated = root / "assets/blog/newsroom" / (story["slug"] + ".png")
    if generated.is_file():
        data = generated.read_bytes()
        if not data.startswith(b"\x89PNG\r\n\x1a\n") or len(data) > 8_000_000:
            fail("invalid generated image")
        return f'/assets/blog/newsroom/{story["slug"]}.png', True
    return f"/assets/blog/{THEMES[story['image_theme']]}", False


def render_article(story, lang, today, root=ROOT):
    slug = story["slug"]
    loc = story["locales"][lang]
    prefix = "" if lang == "en" else lang + "/"
    template = (root / prefix / "blog/pdf-brotli-2026/index.html").read_text(encoding="utf-8")
    head, rest = template.split("</head>", 1)
    before, footer = rest.split("<main ", 1)[0], rest.split("</main>", 1)[1]
    head = head.replace("pdf-brotli-2026", slug)
    before = before.replace("pdf-brotli-2026", slug)
    image, generated = story_image(story, root)
    title, description = esc(loc["title"]), esc(loc["description"])
    canonical = url_for(lang, slug)
    for pattern, value in [
        (r"<title>.*?</title>", f"<title>{title} | Convertios</title>"),
        (r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{description}">'),
        (r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{title}">'),
        (r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{description}">'),
        (r'<meta property="og:image" content="[^"]*">', f'<meta property="og:image" content="https://convertios.com{image}">'),
        (r'<meta property="article:published_time" content="[^"]*">', f'<meta property="article:published_time" content="{today}">'),
    ]:
        head = replace_tag(head, pattern, value)
    head = replace_tag(head, r'<meta name="twitter:card" content="[^"]*">',
        f'<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="{title}">\n<meta name="twitter:description" content="{description}">\n<meta name="twitter:image" content="https://convertios.com{image}">')
    schema = {"@context": "https://schema.org", "@type": "NewsArticle", "headline": loc["title"], "description": loc["description"], "datePublished": today.isoformat(), "mainEntityOfPage": canonical, "image": "https://convertios.com" + image, "inLanguage": lang, "publisher": {"@type": "Organization", "name": "Convertios", "url": "https://convertios.com/"}, "citation": story["source_url"]}
    head = replace_tag(head, r'<script type="application/ld\+json">.*?</script>', '<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False).replace("<", "\\u003c") + '</script>')
    labels = LABELS[lang]
    caption = labels[5] if not generated else {"en": "AI-generated conceptual illustration; not a documentary image", "es": "Ilustración conceptual generada con IA; no es una fotografía documental", "ar": "رسم توضيحي مولّد بالذكاء الاصطناعي؛ ليس صورة وثائقية"}[lang]
    body = [f'<main class="page-content newsroom-article" id="main-content"><article class="editorial-article news-article"><nav class="article-breadcrumb" aria-label="Blog"><a href="/{prefix}blog/">{labels[0]}</a></nav>',
        f'<header class="article-header"><span class="editorial-kicker">{labels[1]} <span aria-hidden="true">/</span> {esc(loc["category"])}</span><h1>{title}</h1><p class="article-standfirst">{description}</p><div class="article-facts"><p><span>{labels[2]}</span><strong>{esc(story["source_date"])}</strong></p><p><span>{labels[3]}</span><strong>{today.isoformat()}</strong></p><p><span>{labels[4]}</span><a href="{esc(story["source_url"])}" rel="noopener noreferrer">{esc(story["source_publisher"])}</a></p></div></header>',
        f'<figure class="article-figure"><img class="news-hero" src="{image}" alt="{esc(caption)}" width="1536" height="1024"><figcaption>{esc(caption)}</figcaption></figure><div class="article-body">']
    for section in loc["sections"]:
        body.append(f'<section><h2>{esc(section["heading"])}</h2>')
        body.extend(para_html(p, story["source_url"], story["source_publisher"]) for p in section["paragraphs"])
        body.append('</section>')
    body.append(f'<section><h2>{labels[7]}</h2><ul>' + "".join(f'<li>{esc(i)}</li>' for i in loc["checklist"]) + '</ul></section>')
    body.append(f'<section><h2>{labels[8]}</h2><p>{esc(loc["caveats"])}</p></section>')
    body.append(f'<section class="news-sources"><h2>{labels[6]}</h2><ul><li><a href="{esc(story["source_url"])}" rel="noopener noreferrer">{esc(story["source_title"])}</a> ({esc(story["source_date"])})</li></ul></section></div></article></main>')
    return head + '</head>' + before + "".join(body) + footer


def render_hub(text, stories, lang, today, root=ROOT):
    prefix = "" if lang == "en" else lang + "/"
    cards = []
    for story in stories:
        loc = story["locales"][lang]
        href = f'/{prefix}blog/{story["slug"]}/'
        cards.append((href, loc, story))
    if not cards:
        return text
    def lead(card):
        href, loc, story = card
        image, _ = story_image(story, root)
        return f'<section class="lead-section" aria-label="{esc(LABELS[lang][0])}"><a class="lead-story" href="{href}"><span class="lead-image"><img src="{image}" alt="" width="1536" height="1024" loading="eager"></span><div class="lead-copy"><span class="editorial-kicker">{LABELS[lang][1]} <span aria-hidden="true">/</span> {esc(loc["category"])}</span><h2>{esc(loc["title"])}</h2><p class="lead-dek">{esc(loc["description"])}</p><p class="story-meta">{LABELS[lang][2]}: {story["source_date"]}<br>{LABELS[lang][3]}: {today.isoformat()}<br>{LABELS[lang][4]}: {esc(story["source_publisher"])}</p></div></a></section>'
    prior_lead = re.search(r'<section class="lead-section".*?</section>', text, re.S)
    if not prior_lead:
        fail("lead story template missing")
    prior_href = re.search(r'<a class="lead-story" href="([^"]+)"', prior_lead.group())
    prior_title = re.search(r'<h2>(.*?)</h2>', prior_lead.group(), re.S)
    text = replace_tag(text, r'<section class="lead-section".*?</section>', lead(cards[0]))
    new_rails = [(href, f'<a class="rail-story" href="{href}"><div class="story-copy"><span class="editorial-kicker">{LABELS[lang][1]} <span aria-hidden="true">/</span> {esc(loc["category"])}</span><h3>{esc(loc["title"])}</h3><span class="story-meta">{LABELS[lang][2]}: {story["source_date"]} · {esc(story["source_publisher"])}</span></div></a>') for href, loc, story in cards]
    latest = re.search(r'<div class="latest-list">.*?</div></aside>', text, re.S)
    if not latest:
        fail("latest list template missing")
    previous = []
    if prior_href and prior_title:
        previous.append((prior_href.group(1), f'<a class="rail-story" href="{prior_href.group(1)}"><div class="story-copy"><h3>{prior_title.group(1)}</h3></div></a>'))
    previous.extend((match.group(1), match.group(0)) for match in re.finditer(r'<a class="rail-story" href="([^"]+)">.*?</a>', latest.group(), re.S))
    seen, retained = set(), []
    for href, card in new_rails + previous:
        if href not in seen and len(retained) < 10:
            seen.add(href)
            retained.append(card)
    return text[:latest.start()] + '<div class="latest-list">' + "".join(retained) + '</div></aside>' + text[latest.end():]


def render_sitemap(text, stories):
    entries = []
    for story in stories:
        slug = story["slug"]
        alternates = "\n".join(f' <xhtml:link rel="alternate" hreflang="{lang}" href="{url_for(lang, slug)}"/>' for lang in LANGS)
        alternates += f'\n <xhtml:link rel="alternate" hreflang="x-default" href="{url_for("en", slug)}"/>'
        for lang in LANGS:
            entries.append(f'<url><loc>{url_for(lang, slug)}</loc>\n{alternates}</url>')
    return text.replace('</urlset>', "\n" + "\n".join(entries) + '\n</urlset>')


def build(data, sources, today, root=ROOT):
    stories = validate(data, sources, today, root)
    if not stories:
        return 0
    rendered = {}
    for lang in LANGS:
        prefix = "" if lang == "en" else lang + "/"
        for story in stories:
            rendered[root / prefix / "blog" / story["slug"] / "index.html"] = render_article(story, lang, today, root)
        hub = root / prefix / "blog/index.html"
        rendered[hub] = render_hub(hub.read_text(encoding="utf-8"), stories, lang, today, root)
    sitemap = root / "sitemap.xml"
    rendered[sitemap] = render_sitemap(sitemap.read_text(encoding="utf-8"), stories)
    for path, content in rendered.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
    return len(stories)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--draft", required=True)
    ap.add_argument("--sources", required=True)
    args = ap.parse_args()
    draft = json.loads(Path(args.draft).read_text(encoding="utf-8"))
    sources = json.loads(Path(args.sources).read_text(encoding="utf-8"))
    count = build(draft, sources, dt.datetime.now(dt.timezone.utc).date())
    print(f"rendered {count} validated story triples")
