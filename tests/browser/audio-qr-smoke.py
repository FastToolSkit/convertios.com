"""Real local audio/QR downloads in three languages; CDN access required."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from io import BytesIO
import math
import struct
import wave
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
fixture = BytesIO()
with wave.open(fixture, 'wb') as wav:
    wav.setparams((1, 2, 44100, 44100, 'NONE', 'not compressed'))
    wav.writeframes(b''.join(struct.pack('<h', int(8000 * math.sin(2 * math.pi * 440 * i / 44100))) for i in range(44100)))


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
        context = browser.new_context(accept_downloads=True)
        for locale in ('', 'es/', 'ar/'):
            page = context.new_page()
            page.goto(f'{base}/{locale}audio-converter/', wait_until='networkidle')
            page.locator('#audioFile').set_input_files({'name': 'tone.wav', 'mimeType': 'audio/wav', 'buffer': fixture.getvalue()})
            page.wait_for_function('typeof audioBuffer !== "undefined" && audioBuffer !== null')
            for fmt in ('wav', 'mp3'):
                page.locator('#format').select_option(fmt)
                with page.expect_download() as event:
                    page.locator('[onclick="convertAudio()"]').click()
                data = Path(event.value.path()).read_bytes()
                if fmt == 'wav':
                    with wave.open(BytesIO(data), 'rb') as wav:
                        assert 0.99 <= wav.getnframes() / wav.getframerate() <= 1.01
                        assert wav.getnchannels() == 1
                else:
                    assert len(data) > 1000 and (data[:3] == b'ID3' or data[0] == 255 and data[1] & 224 == 224)
                count += 1
                print('PASS', locale or 'en', fmt, len(data), flush=True)
            page.goto(f'{base}/{locale}qr-generator/', wait_until='networkidle')
            page.locator('#text').fill('https://convertios.com/')
            page.locator('[onclick="generateQR()"]').click()
            assert page.locator('#qrcode canvas').count() == 1
            with page.expect_download() as event:
                page.locator('#downloadBtn').click()
            data = Path(event.value.path()).read_bytes()
            assert data.startswith(b'\x89PNG\r\n\x1a\n') and len(data) > 1000
            count += 1
            print('PASS', locale or 'en', 'qr-png', len(data), flush=True)
            page.close()
        browser.close()
    print(f'PASS {count}/9 real audio/QR download checks; MP3 and PNG signatures, WAV duration/channels verified')
finally:
    server.shutdown()
