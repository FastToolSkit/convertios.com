"""Verify direct public email links without JavaScript, including mobile RTL.

Uses an isolated local server; never opens an email client or sends messages.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'
count = 0
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width in (390, 1365):
            context = browser.new_context(java_script_enabled=False, viewport={'width': width, 'height': 900})
            context.route('**/*', lambda route: route.continue_() if route.request.url.startswith(base + '/') else route.abort())
            page = context.new_page()
            for locale in ('', 'es/', 'ar/'):
                for slug in ('contact', 'privacy', 'terms'):
                    page.goto(f'{base}/{locale}{slug}/', wait_until='domcontentloaded')
                    link = page.locator('a[href="mailto:convertios.contact@gmail.com"]')
                    assert link.count() == 1
                    assert link.inner_text().strip() == 'convertios.contact@gmail.com'
                    assert link.is_visible()
                    assert page.locator('a[href*="/cdn-cgi/l/email-protection"]').count() == 0
                    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1')
                    if locale == 'ar/':
                        assert page.locator('html').get_attribute('dir') == 'rtl'
                    count += 1
                page.goto(f'{base}/{locale}blog/', wait_until='domcontentloaded')
                assert page.locator('h1').count() == 1
                assert page.locator(f'a[href="/{locale}blog/jpg-png-webp-guide/"]').count() >= 1
                assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1')
                count += 1
                if locale:
                    page.goto(f'{base}/{locale}about/', wait_until='domcontentloaded')
                    assert 'convertios.contact@gmail.com' in page.locator('body').inner_text()
                    assert page.locator('a[href*="/cdn-cgi/l/email-protection"]').count() == 0
                    count += 1
            context.close()
        browser.close()
    print(f'PASS {count}/28 desktop/mobile email and newsroom checks, JavaScript disabled')
finally:
    server.shutdown()
