"""Real browser smoke for the five local utility pages. Run: python tests/browser/utility-tools.py"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread
from zipfile import ZipFile
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_): pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'

try:
    with TemporaryDirectory() as temp, sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe')
        context = browser.new_context(accept_downloads=True)
        context.route('https://**/*', lambda route: route.abort())
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))

        page.goto(base + '/json-formatter-validator/')
        page.locator('#source').fill('{"a": 1}')
        page.locator('#utility-form button[type=submit]').click()
        assert '"a": 1' in page.locator('#utility-output textarea').input_value()
        with page.expect_download() as info: page.get_by_role('button', name='Download').click()
        download = info.value
        target = Path(temp) / download.suggested_filename
        download.save_as(target)
        assert target.read_text('utf-8') == '{\n  "a": 1\n}'
        page.locator('#source').fill('{\n"a": }')
        page.locator('#utility-form button[type=submit]').click()
        assert 'line 2' in page.locator('#utility-status').inner_text()

        page.goto(base + '/json-csv-converter/')
        page.locator('#source').fill('[{"name":"A,B","nested":{"x":2},"formula":"=1+1"}]')
        page.locator('#utility-form button[type=submit]').click()
        assert '"A,B"' in page.locator('#utility-output textarea').input_value()
        assert "'=1+1" in page.locator('#utility-output textarea').input_value()
        page.locator('#direction').select_option('csv-json')
        page.locator('#source').fill('a,b\n1,2')
        page.locator('#utility-form button[type=submit]').click()
        assert '"a": "1"' in page.locator('#utility-output textarea').input_value()

        page.goto(base + '/regex-tester/')
        page.locator('#pattern').fill('(?<word>\\w+)')
        page.locator('#source').fill('one two')
        page.locator('#replacement').fill('[$<word>]')
        page.locator('#utility-form button[type=submit]').click()
        page.locator('#utility-output ol li').first.wait_for()
        assert page.locator('#utility-output ol li').count() == 2
        assert page.locator('#utility-output textarea').input_value() == '[one] [two]'
        page.locator('#pattern').fill('(a+)+$')
        page.locator('#source').fill('a' * 10000 + 'X')
        page.locator('#replacement').fill('')
        page.locator('#utility-form button[type=submit]').click()
        page.locator('#utility-status').get_by_text('Pattern exceeded 250 ms', exact=False).wait_for(timeout=3000)

        page.goto(base + '/utm-campaign-builder/')
        page.locator('#url').fill('https://example.com/a?x=1#part')
        for key, text in [('utm_source','social ads'),('utm_medium','email'),('utm_campaign','winter + spring')]: page.locator('#'+key).fill(text)
        page.locator('#utility-form button[type=submit]').click()
        assert 'utm_source=social+ads' in page.locator('#utility-output').inner_text()
        assert '#part' in page.locator('#utility-output').inner_text()

        page.goto(base + '/seo-social-preview/')
        page.locator('#url').fill('https://example.com/article')
        page.locator('#title').fill('A title')
        page.locator('#description').fill('A description')
        page.locator('#utility-form button[type=submit]').click()
        assert page.locator('.utility-preview').count() == 2
        assert 'No remote metadata was fetched' in page.locator('#utility-status').inner_text()

        page.goto(base + '/bulk-file-renamer/')
        page.locator('#files').set_input_files([
            {'name':'Photo.txt','mimeType':'text/plain','buffer':b'first'},
            {'name':'Photo.txt','mimeType':'text/plain','buffer':b'second'},
        ])
        page.locator('#find').fill('Photo')
        page.locator('#replace').fill('item')
        page.locator('#utility-form button[type=submit]').click()
        assert 'item (2).txt' in page.locator('#utility-output').inner_text()
        with page.expect_download() as info: page.get_by_role('button', name='Download ZIP').click()
        zip_path = Path(temp) / 'renamed-files.zip'
        info.value.save_as(zip_path)
        with ZipFile(zip_path) as archive:
            assert archive.namelist() == ['item.txt','item (2).txt']
            assert archive.read('item.txt') == b'first'
            assert archive.read('item (2).txt') == b'second'

        page.goto(base + '/ar/json-formatter-validator/')
        assert page.locator('html').get_attribute('dir') == 'rtl'
        page.locator('#source').fill('{"a":1}')
        page.locator('#utility-form button[type=submit]').click()
        assert page.locator('#utility-output textarea').input_value().startswith('{')
        page.set_viewport_size({'width': 390, 'height': 844})
        assert page.locator('body').evaluate('(body) => body.scrollWidth <= innerWidth + 1'), 'mobile horizontal overflow'
        for slug in ['json-csv-converter','regex-tester','utm-campaign-builder','seo-social-preview','bulk-file-renamer']:
            page.goto(base + '/' + slug + '/')
            assert page.locator('body').evaluate('(body) => body.scrollWidth <= innerWidth + 1'), slug + ' mobile horizontal overflow'
        assert not errors, errors
        browser.close()
    print('Utility browser smoke passed: six tools, JSON and ZIP downloads, error, Arabic RTL')
finally:
    server.shutdown()
