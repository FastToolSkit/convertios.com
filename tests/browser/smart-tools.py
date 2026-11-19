"""Real browser downloads. Run tests/smart_tools_real.py to create the fixture directory first.

Usage: python tests/browser/smart-tools.py FIXTURES LOCAL_BACKEND [--browser chromium|firefox|webkit]
The backend must be an isolated local instance with the production native dependencies.
Browser requests to the public site and API are routed to loopback. Analytics/ads are blocked.
"""
import argparse
import functools
import io
import json
import http.client
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.parse import urlsplit

from PIL import Image
from playwright.sync_api import sync_playwright
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
CATALOG = json.loads((ROOT/"content/smart-tools/catalog.json").read_text("utf-8"))


class Quiet(SimpleHTTPRequestHandler):
    # Preserve the browser's multipart file bytes. DevTools interception can omit file parts.
    def do_POST(self):
        if not self.path.startswith("/convert/smart/"):
            self.send_error(404)
            return
        connection = http.client.HTTPConnection(self.server.backend, timeout=120)
        try:
            body = self.rfile.read(int(self.headers["Content-Length"]))
            connection.request("POST", self.path, body, {"Content-Type":self.headers["Content-Type"],
                                                       "Origin":"https://convertios.com"})
            response = connection.getresponse()
            payload = response.read()
            self.send_response(response.status)
            self.send_header("Content-Type", response.getheader("Content-Type"))
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        finally:
            connection.close()

    def log_message(self, *args):
        pass


def check_blob(tool, data):
    if tool in {"heic-to-jpg","avif-to-png","svg-to-png","image-metadata-remover","gif-compressor","mp4-to-gif"}:
        with Image.open(io.BytesIO(data)) as im:
            im.load()
            if tool == "heic-to-jpg":
                assert im.format == "JPEG" and im.size == (160,96)
            elif tool == "avif-to-png":
                assert im.format == "PNG" and im.getpixel((5,5))[3] == 80
            elif tool == "svg-to-png":
                assert im.size == (320,160) and im.getpixel((0,0))[3] == 0 and im.getpixel((160,80))[0] > 230
            elif tool == "image-metadata-remover":
                assert im.format == "PNG" and not im.getexif() and im.size == (96,160)
                assert b"GPSMarker" not in data
            elif tool == "gif-compressor":
                assert im.n_frames == 6 and im.info["loop"] == 2
            else:
                assert im.n_frames > 1 and im.format == "GIF"
    elif tool == "heic-to-pdf":
        pages = PdfReader(io.BytesIO(data)).pages
        assert len(pages) == 2 and pages[0].mediabox.height > pages[0].mediabox.width
    elif tool in {"pdf-to-text","image-to-text"}:
        assert data.decode("utf-8") == "Edited · تم التحقق"
    else:
        assert data[4:8] == b"ftyp"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("fixtures",type=Path)
    parser.add_argument("backend")
    parser.add_argument("--browser", default="chromium", choices=["chromium","firefox","webkit"])
    parser.add_argument("--screenshots", type=Path)
    args = parser.parse_args()
    assert urlsplit(args.backend).hostname in {"localhost","127.0.0.1"}
    server = ThreadingHTTPServer(("127.0.0.1",0),functools.partial(Quiet,directory=str(ROOT)))
    server.backend = urlsplit(args.backend).netloc
    threading.Thread(target=server.serve_forever,daemon=True).start()
    site = f"http://127.0.0.1:{server.server_address[1]}"
    cases = {"heic-to-jpg":["sample.heic","sample.heic"],"heic-to-pdf":["sample.heic","portrait.heic"],
             "mp4-to-gif":["source.mp4"],"video-compressor":["source.mp4"],"image-to-text":["ara.png"],
             "gif-compressor":["motion.gif"],"svg-to-png":["drawing.svg"],"avif-to-png":["alpha.avif"],
             "pdf-to-text":["digital.pdf"],"image-metadata-remover":["metadata.jpg"]}
    with TemporaryDirectory() as tmp, sync_playwright() as pw:
        local = Path(tmp)
        (local/"drawing.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><circle cx="50" cy="25" r="12" fill="red"/></svg>')
        exif = Image.Exif()
        exif[274], exif[270], exif[34853] = 6, "GPSMarker", {1:"N",2:(31,57,0),3:"E",4:(35,55,0)}
        source = Image.new("RGB",(160,96),"green")
        source.save(local/"metadata.jpg",exif=exif)
        with Image.open(local/"metadata.jpg") as before:
            assert before.getexif().get_ifd(34853)[1]=="N"
        browser = getattr(pw,args.browser).launch()
        ctx = browser.new_context(viewport={"width":390,"height":844},accept_downloads=True)
        external = []
        def route_request(route):
            u = urlsplit(route.request.url)
            if u.hostname not in {"www.googletagmanager.com","pagead2.googlesyndication.com"}:
                external.append(u.hostname)
            route.abort()
        ctx.route("https://**/*",route_request)
        ctx.add_init_script("""const browserFetch = window.fetch.bind(window);
            window.fetch = (url, options) => browserFetch(typeof url === 'string'
                ? url.replace('https://convertios-backend-sn5u.onrender.com', location.origin) : url, options);""")
        page = ctx.new_page()
        page.set_default_timeout(35000)
        errors = []
        page.on("pageerror",lambda err: errors.append(str(err)))
        for lang, prefix in [("en",""),("ar","ar/"),("pt-BR","pt-br/"),("es","es/")]:
            for tool in CATALOG:
                path = 'https://convertios.com/'+prefix+tool["slug"]+'/'
                assert page.goto(path.replace('https://convertios.com',site)).status == 200
                assert page.locator("h1").inner_text() == tool["copy"][lang]["title"]
                assert page.locator('link[rel="canonical"]').get_attribute("href") == path
                assert page.locator('link[hreflang]').count() == 5
                assert page.locator("html").get_attribute("dir") == ("rtl" if lang=="ar" else "ltr")
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), path
                assert page.locator("#smart-run").bounding_box()["height"] >= 44
        print("40 mobile pages passed on",args.browser, flush=True)
        for tool,names in cases.items():
            if args.browser != "chromium" and tool not in {"svg-to-png","image-metadata-remover"}:
                continue
            page.goto(site+"/ar/"+tool+"/")
            paths = [str((local/name if (local/name).exists() else args.fixtures/name).resolve()) for name in names]
            page.locator("input[type=file]").set_input_files(paths)
            if tool == "heic-to-pdf":
                page.locator("#queue li").nth(1).locator("button").first.click()
            if tool == "svg-to-png":
                page.locator("input[name=width]").fill("320")
            page.locator("#smart-run").focus()
            page.keyboard.press("Enter")
            page.wait_for_function("!document.querySelector('fieldset').disabled && document.querySelector('#smart-status').textContent.length > 0",timeout=150000)
            links = page.locator("#results a[download]")
            assert links.count() == (2 if tool=="heic-to-jpg" else 1), (tool,page.locator("#results").inner_text())
            if tool in {"pdf-to-text","image-to-text"}:
                editor = page.locator("#results textarea")
                assert ("731" if tool=="pdf-to-text" else "عمان") in editor.input_value()
                editor.fill("Edited · تم التحقق")
            with page.expect_download() as event:
                links.first.click()
            out = local/("browser-"+tool)
            event.value.save_as(out)
            check_blob(tool,out.read_bytes())
            print("Download validated:",tool,out.stat().st_size,flush=True)
        page.goto(site+"/ar/svg-to-png/")
        for bad in [b"",b"wrong file",b'<svg xmlns="http://www.w3.org/2000/svg"><image href="https://example.invalid/a"/></svg>', b"x"*(1048576+1)]:
            page.locator("[type=file]").set_input_files({"name":"invalid.svg","mimeType":"image/svg+xml","buffer":bad})
            if 0 < len(bad) <= 1048576:
                page.locator("#smart-run").click()
                page.wait_for_selector("#results p")
            assert not page.locator("#results a").count()
        if args.screenshots:
            args.screenshots.mkdir(exist_ok=True,parents=True)
            page.goto(site+"/ar/mp4-to-gif/")
            page.screenshot(path=str(args.screenshots/(args.browser+"-mobile.png")))
            page.set_viewport_size({"width":1366,"height":768})
            page.goto(site+"/heic-to-pdf/")
            page.screenshot(path=str(args.screenshots/(args.browser+"-desktop.png")))
        print("Unexpected hosts:", sorted(set(external)), "page errors:", errors,flush=True)
        assert not errors and "example.invalid" not in external
        browser.close()
    server.shutdown()


if __name__ == "__main__":
    main()
