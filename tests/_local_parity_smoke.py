"""Run local layout comparison with established tool page. No public API requests."""
import functools, json, threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
catalog=json.loads((ROOT/"content/smart-tools/catalog.json").read_text("utf-8"))
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(("127.0.0.1",0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f"http://127.0.0.1:{server.server_port}"
with sync_playwright() as p:
    browser=p.chromium.launch(channel="chrome",headless=True)
    context=browser.new_context(viewport={"width":390,"height":844})
    context.route("https://**/*",lambda route: route.abort())
    page=context.new_page()
    issues=[]
    page.goto(base+"/jpg-to-png/")
    ref=page.locator(".tool-info-block").evaluate("(e)=>getComputedStyle(e).display")
    for lang,prefix in [("en",""),("es","es/"),("ar","ar/"),("pt-BR","pt-br/")]:
        for tool in catalog:
            u=base+"/"+prefix+tool["slug"]+"/"
            resp=page.goto(u,wait_until="domcontentloaded")
            try:
                assert resp.status==200
                assert page.locator(".tool-info-grid > div").count()==6
                assert page.locator(".more-tool-card").count()==4
                assert page.locator(".page-guide h3").count()==3
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), "horizontal overflow"
                assert page.locator(".tool-info-block").is_visible()
                assert page.locator(".tool-description").is_visible()
                assert page.locator(".more-tools").is_visible()
                assert page.locator(".tool-info-block").evaluate("(e)=>getComputedStyle(e).display") == ref
            except Exception as e:issues.append((lang,tool["slug"],str(e)))
    print("Legacy tool computed display:",ref)
    print("Tested:",40,"pages, mobile viewport 390px; issues:",issues,flush=True)
    assert not issues
    context.close();browser.close()
server.shutdown()
