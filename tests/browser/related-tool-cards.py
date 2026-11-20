"""Local Chromium layout, image, and navigation smoke for all 80 related sections."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
SMART = [t["slug"] for t in json.loads((ROOT / "content/smart-tools/catalog.json").read_text("utf-8"))]
UTILITY = ["compress-pdf", "searchable-pdf-ocr", "invoice-generator", "csv-xlsx-converter",
           "json-csv-converter", "bulk-file-renamer", "json-formatter-validator", "regex-tester",
           "utm-campaign-builder", "seo-social-preview"]

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *_): pass

server = ThreadingHTTPServer(("127.0.0.1", 0), partial(Quiet, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_port}"
checked = 0
try:
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe")
        for width in (320, 1280):
            context = browser.new_context(viewport={"width": width, "height": 800})
            context.route("https://**/*", lambda route: route.abort())
            page = context.new_page()
            for prefix in ("", "es/", "ar/", "pt-br/"):
                for slug in SMART + UTILITY:
                    page.goto(f"{base}/{prefix}{slug}/", wait_until="domcontentloaded")
                    page.locator(".more-tools").scroll_into_view_if_needed()
                    page.wait_for_function("[...document.querySelectorAll('.more-tools img')].every(i => i.complete && i.naturalWidth > 0)")
                    data = page.locator(".more-tools").evaluate("""section => ({
                      count: section.querySelectorAll('a.more-tool-card').length,
                      images: [...section.querySelectorAll('img')].map(i => i.complete && i.naturalWidth > 0),
                      columns: getComputedStyle(section.querySelector('.more-tools-grid')).gridTemplateColumns.split(' ').length,
                      overflow: document.documentElement.scrollWidth > innerWidth,
                      dir: document.documentElement.dir
                    })""")
                    assert data["count"] == 4 and all(data["images"]), (width, prefix, slug, data)
                    assert not data["overflow"], (width, prefix, slug, data)
                    assert data["dir"] == ("rtl" if prefix == "ar/" else "ltr"), (width, prefix, slug, data)
                    assert data["columns"] == (2 if width == 320 else 4), (width, prefix, slug, data)
                    checked += 1
            context.close()
        browser.close()
finally:
    server.shutdown()
print(f"PASS: {checked} responsive localized page views, 320 cards and loaded thumbnails")
