"""Local Playwright smoke test for indexed tool workflows in EN, ES and AR.

Run: python tests/browser/seo-smoke.py
The conversion backend and third-party scripts are mocked. No production request is made.
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


server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()
base = f"http://127.0.0.1:{server.server_port}"
passed = 0

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)
        requests = []

        def route_request(route):
            url = route.request.url
            if url.startswith(base):
                route.continue_()
            elif "/api/shorten-url" in url:
                requests.append(("shorten", route.request.post_data))
                route.fulfill(status=200, headers={"Access-Control-Allow-Origin": "*"},
                              content_type="application/json",
                              body='{"shortUrl":"https://tinyurl.com/seo-smoke"}')
            elif "/convert/video-to-mp3" in url:
                requests.append(("mp3", url))
                route.fulfill(status=200, headers={"Access-Control-Allow-Origin": "*"},
                              content_type="audio/mpeg", body=b"ID3\x04\x00\x00\x00\x00\x00\x00test")
            elif "/convert/video" in url:
                requests.append(("video", url))
                route.fulfill(status=200, headers={"Access-Control-Allow-Origin": "*"},
                              content_type="video/mp4", body=b"\x00\x00\x00\x18ftypmp42test")
            elif url.endswith("/health"):
                route.fulfill(status=200, headers={"Access-Control-Allow-Origin": "*"},
                              content_type="application/json", body='{"status":"ok"}')
            else:
                route.fulfill(status=200, content_type="text/javascript", body="")

        context.route("**/*", route_request)
        for language in ("", "es/", "ar/"):
            page = context.new_page()
            page.goto(f"{base}/{language}text-formatter/")
            page.locator("#text").fill("  First   line  \n\n\n Second  line ")
            page.locator('[onclick="removeSpaces()"]').click()
            assert page.locator("#text").input_value() == "First line\n\nSecond line"
            passed += 1
            page.close()

            page = context.new_page()
            page.goto(f"{base}/{language}link-shortener/")
            page.locator("#url").fill("https://example.com/public-product?ref=flyer")
            page.locator("#shortenBtn").click()
            page.wait_for_function("document.querySelector('#result').value === 'https://tinyurl.com/seo-smoke'")
            assert "example.com/public-product" in requests[-1][1]
            assert requests[-1][0] == "shorten"
            passed += 1
            page.close()

            for slug, expected in (("video-to-mp3", "mp3"), ("video-converter", "video")):
                page = context.new_page()
                page.goto(f"{base}/{language}{slug}/")
                page.locator("#videoFile").set_input_files({
                    "name": "sample.mp4", "mimeType": "video/mp4", "buffer": b"test video",
                })
                assert page.locator("#videoConvert").is_enabled()
                with page.expect_download() as event:
                    page.locator("#videoConvert").click()
                download = event.value
                assert download.suggested_filename.endswith(".mp3" if expected == "mp3" else ".mp4")
                assert requests[-1][0] == expected
                passed += 1
                page.close()
        browser.close()
finally:
    server.shutdown()

print(f"{passed}/12 local Playwright tool flows passed (backend mocked)")
