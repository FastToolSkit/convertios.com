"""Browser form/download smoke with deterministic backend responses.

The Python artifact tests separately parse files produced by the actual processors.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread
from zipfile import ZipFile
import json

from playwright.sync_api import sync_playwright
from pypdf import PdfWriter

ROOT = Path(__file__).resolve().parents[2]
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *_): pass

pdf_buffer = BytesIO()
writer = PdfWriter(); writer.add_blank_page(width=595, height=842); writer.write(pdf_buffer)
pdf_bytes = pdf_buffer.getvalue()
xlsx_buffer = BytesIO()
with ZipFile(xlsx_buffer, 'w') as archive:
    archive.writestr('xl/workbook.xml', '<workbook/>')
xlsx_bytes = xlsx_buffer.getvalue()
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'

try:
    with TemporaryDirectory() as temp, sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe')
        context = browser.new_context(accept_downloads=True)
        def respond(route):
            url = route.request.url
            headers = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type'}
            if url.endswith('/xlsx-sheets'):
                route.fulfill(status=200, content_type='application/json', headers=headers, body=json.dumps(['Data','Other']))
            elif url.endswith('/csv-xlsx-converter'):
                if b'xlsx-csv' in route.request.post_data_buffer:
                    route.fulfill(status=200, content_type='text/csv', headers=headers, body=b"Name,Value\r\nAlice,'=1+1\r\n")
                else:
                    route.fulfill(status=200, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers=headers, body=xlsx_bytes)
            elif url.endswith('/compress-pdf') and b'light' in route.request.post_data_buffer:
                route.fulfill(status=422, content_type='application/json', headers=headers, body='{"code":"NO_GAIN"}')
            else:
                route.fulfill(status=200, content_type='application/pdf', headers=headers, body=pdf_bytes)
        context.route('https://**/*', lambda route: route.abort())
        context.route('https://convertios-backend-sn5u.onrender.com/convert/artifact/**', respond)
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))

        page.goto(base + '/invoice-generator/')
        page.locator('#seller').fill('Acme LLC')
        page.locator('#customer').fill('Client Ltd')
        page.locator('#number').fill('INV-42')
        page.locator('#issued').fill('2026-11-19')
        page.locator('.invoice-row [name=description]').fill('Design work')
        page.locator('.invoice-row [name=quantity]').fill('3')
        page.locator('.invoice-row [name=unitPrice]').fill('19.99')
        page.locator('.invoice-row [name=taxRate]').fill('8.25')
        assert '64.92' in page.locator('#invoice-totals').inner_text()
        page.locator('#artifact-form button[type=submit]').click()
        page.locator('#artifact-result a').wait_for()
        with page.expect_download() as info: page.locator('#artifact-result a').click()
        target = Path(temp) / info.value.suggested_filename
        info.value.save_as(target)
        assert target.read_bytes().startswith(b'%PDF-')

        page.goto(base + '/csv-xlsx-converter/')
        page.locator('#file').set_input_files({'name':'table.csv','mimeType':'text/csv','buffer':b'Name,Value\nAlice,=1+1'})
        page.locator('#artifact-form button[type=submit]').click()
        page.locator('#artifact-result a').wait_for()
        with page.expect_download() as info: page.locator('#artifact-result a').click()
        target = Path(temp) / 'converted.xlsx'; info.value.save_as(target)
        with ZipFile(target) as archive: assert 'xl/workbook.xml' in archive.namelist()
        page.locator('#direction').select_option('xlsx-csv')
        page.locator('#file').set_input_files({'name':'table.xlsx','mimeType':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','buffer':xlsx_bytes})
        page.locator('#sheet option').first.wait_for(state='attached')
        page.locator('#sheet').select_option('Other')
        page.locator('#artifact-form button[type=submit]').click()
        page.locator('#artifact-result a').wait_for()
        with page.expect_download() as info: page.locator('#artifact-result a').click()
        target = Path(temp) / 'converted.csv'; info.value.save_as(target)
        assert "'=1+1" in target.read_text('utf-8')

        page.goto(base + '/compress-pdf/')
        page.locator('#file').set_input_files({'name':'original.pdf','mimeType':'application/pdf','buffer':pdf_bytes + b' ' * 200})
        page.locator('#preset').select_option('light')
        page.locator('#artifact-form button[type=submit]').click()
        page.locator('#artifact-status').get_by_text('No smaller', exact=False).wait_for()
        assert page.locator('#artifact-result a').count() == 0
        page.locator('#preset').select_option('small')
        page.locator('#artifact-form button[type=submit]').click()
        page.locator('#artifact-result a').wait_for()
        with page.expect_download() as info: page.locator('#artifact-result a').click()
        target = Path(temp) / 'compressed.pdf'; info.value.save_as(target)
        assert target.read_bytes().startswith(b'%PDF-')
        assert 'bytes' in page.locator('#artifact-result').inner_text()

        page.goto(base + '/searchable-pdf-ocr/')
        page.locator('#file').set_input_files({'name':'scan.pdf','mimeType':'application/pdf','buffer':pdf_bytes})
        page.locator('#lang').select_option('ara')
        page.locator('#artifact-form button[type=submit]').click()
        page.locator('#artifact-result a').wait_for()
        with page.expect_download() as info: page.locator('#artifact-result a').click()
        target = Path(temp) / 'searchable.pdf'; info.value.save_as(target)
        assert target.read_bytes().startswith(b'%PDF-')

        page.set_viewport_size({'width':390,'height':844})
        for locale in ('','es/','ar/','pt-br/'):
            for slug in ('invoice-generator','csv-xlsx-converter','compress-pdf','searchable-pdf-ocr'):
                page.goto(base + '/' + locale + slug + '/')
                assert page.locator('html').get_attribute('dir') == ('rtl' if locale == 'ar/' else 'ltr')
                assert page.locator('body').evaluate('(body) => body.scrollWidth <= innerWidth + 1'), (locale,slug)
        assert not errors, errors
        browser.close()
    print('Artifact browser smoke passed: 16 pages, forms, downloads, sheet choice, no-gain message')
finally:
    server.shutdown()
