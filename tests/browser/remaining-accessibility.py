"""Focused browser check for the shared language selector and JPG-to-PDF placeholder.

Run: python tests/browser/remaining-accessibility.py
"""
import base64
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[2]
LANGUAGES = {
    "en": ("/jpg-to-pdf/", "English", "change language"),
    "es": ("/es/jpg-to-pdf/", "Español", "cambiar idioma"),
    "ar": ("/ar/jpg-to-pdf/", "العربية", "اختيار اللغة"),
}


def main():
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(ROOT), **kwargs)

        def log_message(self, *_args):
            pass

    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    failures = []
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            try:
                for script in ("script.js", "script.min.js"):
                    context = browser.new_context()
                    context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(base) else route.abort())
                    context.route("**/script.min.js*", lambda route, _request, source=script: route.fulfill(
                        status=200, content_type="text/javascript; charset=utf-8", body=(ROOT / source).read_bytes()
                    ))
                    for lang, (path, visible, action) in LANGUAGES.items():
                        page = context.new_page()
                        page.goto(base + path, wait_until="load")
                        summary = page.locator(".site-header .language-selector summary").first
                        summary.wait_for()
                        text = summary.locator(".language-selector__label").inner_text().strip()
                        name = summary.get_attribute("aria-label") or ""
                        print(f"{script} {lang}: visible={text!r}, accessible={name!r}")
                        if text != visible or visible not in name or action not in name.lower():
                            failures.append(f"{script} {lang}: accessible name does not include visible language and action")
                        ax = context.new_cdp_session(page).send("Accessibility.getFullAXTree")["nodes"]
                        disclosure_names = [
                            node.get("name", {}).get("value") for node in ax
                            if node.get("role", {}).get("value") == "DisclosureTriangle"
                        ]
                        if name not in disclosure_names:
                            failures.append(f"{script} {lang}: browser accessibility tree lacks {name!r}")
                        page.locator(".site-header .faq-link-block").focus()
                        page.keyboard.press("Tab")
                        if not summary.evaluate("el => document.activeElement === el"):
                            failures.append(f"{script} {lang}: Tab did not reach the language selector")
                        page.keyboard.press("Enter")
                        if not page.locator(".site-header .language-selector").first.evaluate("el => el.open"):
                            failures.append(f"{script} {lang}: Enter did not open language menu")
                        links = page.locator(".site-header .language-selector__menu a")
                        targets = {link.get_attribute("hreflang"): link.get_attribute("href") for link in links.all()}
                        for target_lang, (target_path, _, _) in LANGUAGES.items():
                            if targets.get(target_lang) != "https://convertios.com" + target_path:
                                failures.append(f"{script} {lang}: {target_lang} link is {targets.get(target_lang)!r}")
                        page.keyboard.press("Escape")
                        if page.locator(".site-header .language-selector").first.evaluate("el => el.open"):
                            failures.append(f"{script} {lang}: Escape did not close language menu")
                        if lang == "en":
                            placeholder = page.locator("#downloadLink")
                            page.locator("button.main-button").first.focus()
                            page.keyboard.press("Tab")
                            state = placeholder.evaluate("el => ({href: el.hasAttribute('href'), text: el.textContent, keyboardFocused: document.activeElement === el})")
                            in_ax = page.get_by_role("link").evaluate_all("els => els.some(el => el.id === 'downloadLink')")
                            print(f"JPG-to-PDF placeholder: {state}, mentioned_in_accessibility_snapshot={in_ax}")
                            if state["href"] or state["text"] or state["keyboardFocused"] or in_ax:
                                failures.append(f"{script}: JPG-to-PDF empty anchor is exposed")
                            page.evaluate("""() => {
                                window.PDFLib = {PDFDocument: {create: async () => ({
                                    embedPng: async () => ({width: 1, height: 1}),
                                    addPage: () => ({drawImage: () => {}}),
                                    save: async () => new Uint8Array([37, 80, 68, 70])
                                })}};
                            }""")
                            png = base64.b64decode(
                                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLytQAAAABJRU5ErkJggg=="
                            )
                            page.locator("#file-input").set_input_files({
                                "name": "one.png", "mimeType": "image/png", "buffer": png
                            })
                            page.locator("button.main-button").first.click()
                            page.locator('#downloadLink[href^="blob:"]').wait_for()
                            download_name = placeholder.inner_text().strip()
                            named_link = page.get_by_role("link", name="Download PDF").evaluate_all(
                                "els => els.some(el => el.id === 'downloadLink')"
                            )
                            print(f"JPG-to-PDF generated link: name={download_name!r}, named_link={named_link}")
                            if download_name != "Download PDF" or not named_link:
                                failures.append(f"{script}: generated JPG-to-PDF link has no accessible name")
                            page.locator("button.main-button").first.focus()
                            page.keyboard.press("Tab")
                            if not placeholder.evaluate("el => document.activeElement === el"):
                                failures.append(f"{script}: generated JPG-to-PDF link is not keyboard reachable")
                        page.close()
                    context.close()
            finally:
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
    if failures:
        raise SystemExit("\n".join(failures))
    print("Focused browser accessibility checks passed")


if __name__ == "__main__":
    main()
