"""Shared, localized Explore more tools cards for the two recent tool batches."""
from html import escape, unescape
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
PREFIX = {"en": "", "es": "es/", "ar": "ar/", "pt-BR": "pt-br/"}
HEADINGS = {
    "en": "Explore more tools",
    "es": "Explora más herramientas",
    "ar": "اكتشف المزيد من الأدوات",
    "pt-BR": "Explore mais ferramentas",
}

# Four next steps per workflow. Batch 1 uses the existing guide recommendations.
UTILITY_RELATED = {
    "compress-pdf": ["searchable-pdf-ocr", "merge-pdf", "split-pdf", "pdf-to-word"],
    "searchable-pdf-ocr": ["compress-pdf", "pdf-to-text", "image-to-text", "pdf-to-word"],
    "invoice-generator": ["csv-xlsx-converter", "merge-pdf", "jpg-to-pdf", "compress-pdf"],
    "csv-xlsx-converter": ["json-csv-converter", "json-formatter-validator", "invoice-generator", "bulk-file-renamer"],
    "json-csv-converter": ["csv-xlsx-converter", "json-formatter-validator", "regex-tester", "text-formatter"],
    "bulk-file-renamer": ["image-resizer", "image-metadata-remover", "csv-xlsx-converter", "compress-image"],
    "json-formatter-validator": ["json-csv-converter", "regex-tester", "text-formatter", "csv-xlsx-converter"],
    "regex-tester": ["text-formatter", "json-formatter-validator", "json-csv-converter", "utm-campaign-builder"],
    "utm-campaign-builder": ["seo-social-preview", "regex-tester", "text-formatter", "json-formatter-validator"],
    "seo-social-preview": ["utm-campaign-builder", "social-media-image-resizer", "image-resizer", "compress-image"],
}

# Short marks, plus file/media/data pictograms and color, give each destination a
# recognizable local SVG thumbnail at a fraction of the weight of a raster image.
ICONS = {
    "heic-to-jpg": ("HE", "image", "#2563eb"), "heic-to-pdf": ("HP", "document", "#7c3aed"),
    "mp4-to-gif": ("GIF", "play", "#db2777"), "video-compressor": ("VC", "play", "#0d9488"),
    "image-to-text": ("OCR", "image", "#9333ea"), "gif-compressor": ("GC", "play", "#e11d48"),
    "svg-to-png": ("SVG", "image", "#0891b2"), "avif-to-png": ("AV", "image", "#16a34a"),
    "pdf-to-text": ("TXT", "document", "#b45309"), "image-metadata-remover": ("EX", "image", "#475569"),
    "compress-pdf": ("PDF", "document", "#dc2626"), "searchable-pdf-ocr": ("OCR", "document", "#7c3aed"),
    "invoice-generator": ("INV", "document", "#0284c7"), "csv-xlsx-converter": ("XLS", "table", "#15803d"),
    "json-csv-converter": ("CSV", "table", "#0f766e"), "bulk-file-renamer": ("RN", "document", "#4f46e5"),
    "json-formatter-validator": ("{}", "code", "#6d28d9"), "regex-tester": (".*", "code", "#be185d"),
    "utm-campaign-builder": ("UTM", "link", "#c2410c"), "seo-social-preview": ("SEO", "link", "#0369a1"),
    "compress-image": ("IMG", "image", "#059669"), "jpg-to-pdf": ("JPG", "document", "#e11d48"),
    "image-resizer": ("SZ", "image", "#7c3aed"), "merge-pdf": ("+", "document", "#dc2626"),
    "pdf-to-jpg": ("JPG", "image", "#ea580c"), "video-converter": ("VID", "play", "#2563eb"),
    "video-to-mp3": ("MP3", "play", "#9333ea"), "audio-converter": ("AUD", "play", "#0f766e"),
    "text-formatter": ("Aa", "code", "#475569"), "image-converter": ("IMG", "image", "#0284c7"),
    "png-to-jpg": ("PNG", "image", "#d97706"), "webp-to-png": ("WEB", "image", "#0891b2"),
    "pdf-to-word": ("DOC", "document", "#2563eb"), "split-pdf": ("÷", "document", "#e11d48"),
    "remove-bg": ("BG", "image", "#16a34a"), "social-media-image-resizer": ("SOC", "image", "#db2777"),
}

MOTIFS = {
    "image": '<rect x="8" y="7" width="16" height="13" rx="2" fill="none" stroke="white" stroke-width="2"/><circle cx="13" cy="11" r="1.5" fill="white"/><path d="m9 18 4-4 3 3 2-2 5 4" fill="none" stroke="white" stroke-width="1.5"/>',
    "document": '<path d="M10 6h10l4 4v11H10z" fill="none" stroke="white" stroke-width="2"/><path d="M20 6v4h4M13 14h8M13 17h8" fill="none" stroke="white" stroke-width="1.5"/>',
    "play": '<rect x="7" y="7" width="18" height="14" rx="3" fill="none" stroke="white" stroke-width="2"/><path d="m14 11 6 3-6 3z" fill="white"/>',
    "table": '<rect x="7" y="7" width="18" height="14" rx="2" fill="none" stroke="white" stroke-width="2"/><path d="M7 12h18M13 12v9M19 12v9" stroke="white" stroke-width="1.5"/>',
    "code": '<path d="m13 8-5 6 5 6m6-12 5 6-5 6m-2-13-2 14" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>',
    "link": '<path d="M13 10h-2a5 5 0 0 0 0 10h5m3-10h2a5 5 0 0 1 0 10h-5m-5-5h10" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>',
}


def ensure_icons():
    target = ROOT / "assets" / "related-tools"
    target.mkdir(parents=True, exist_ok=True)
    for slug, (mark, motif, color) in ICONS.items():
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">'
               f'<rect width="48" height="48" rx="11" fill="{color}"/>'
               f'<g transform="translate(8 2)">{MOTIFS[motif]}</g>'
               f'<text x="24" y="40" fill="white" font-family="Arial,sans-serif" font-size="10" '
               f'font-weight="700" text-anchor="middle">{escape(mark)}</text></svg>\n')
        path = target / f"{slug}.svg"
        if not path.exists() or path.read_text("utf-8") != svg:
            path.write_text(svg, encoding="utf-8", newline="\n")


def title(lang, slug):
    path = ROOT / PREFIX[lang] / slug / "index.html"
    source = path.read_text("utf-8")
    match = re.search(r"<h1\b[^>]*>(.*?)</h1>", source, re.S)
    if not match:
        raise ValueError(f"Missing localized title: {path}")
    return unescape(re.sub(r"<[^>]+>", "", match[1])).strip()


def render(slug, lang, recommendations):
    if len(recommendations) != 4 or len(set(recommendations)) != 4 or slug in recommendations:
        raise ValueError(f"Invalid recommendations for {slug}")
    cards = []
    for related in recommendations:
        if related not in ICONS:
            raise ValueError(f"No icon for {related}")
        label = escape(title(lang, related))
        cards.append(f'<a href="/{PREFIX[lang]}{related}/" class="more-tool-card">'
                     f'<span class="more-tool-icon" aria-hidden="true"><img src="/assets/related-tools/{related}.svg" '
                     f'alt="" width="32" height="32" loading="lazy" decoding="async"></span>'
                     f'<span>{label}</span></a>')
    return (f'<section class="more-tools" aria-labelledby="more-tools-heading">'
            f'<h2 id="more-tools-heading">{escape(HEADINGS[lang])}</h2>'
            f'<div class="more-tools-grid">{"".join(cards)}</div></section>')
