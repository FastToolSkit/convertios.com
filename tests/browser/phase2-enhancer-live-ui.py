"""Phase 2: live browser checks for AI Enhancer EN/ES/AR, without paid enhancement calls."""
import json, io
from PIL import Image
from playwright.sync_api import sync_playwright

out=[]
image=Image.new("RGB",(64,64),(80,110,140))
buf=io.BytesIO()
image.save(buf,format="PNG")
payload=buf.getvalue()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for lang in ("","es/","ar/"):
  page=browser.new_page(viewport={"width":390,"height":844})
  errors=[]
  page.on("pageerror",lambda e: errors.append(str(e)))
  url=f"https://convertios.com/{lang}ai-image-enhancer/"
  response=page.goto(url,wait_until="domcontentloaded",timeout=45000)
  page.locator("#fileInput").set_input_files({"name":"phase2-test.png","mimeType":"image/png","buffer":payload})
  page.wait_for_timeout(800)
  result={
    "url":url,
    "http_status":response.status,
    "html_lang":page.locator("html").get_attribute("lang"),
    "h1":page.locator("h1").first.inner_text(),
    "canonical":page.locator('link[rel="canonical"]').get_attribute("href"),
    "initial_image_preview_visible":page.locator("#preview").is_visible(),
    "enhance_button_enabled":page.locator("#enhanceBtn").is_enabled(),
    "status_text":page.locator("#status").inner_text(),
    "js_errors":errors,
    "horizontal_overflow":page.evaluate("document.documentElement.scrollWidth>innerWidth"),
  }
  result["pass"]=(result["http_status"]==200 and result["initial_image_preview_visible"] and result["enhance_button_enabled"] and not errors and not result["horizontal_overflow"])
  out.append(result)
  page.close()
 browser.close()
print(json.dumps(out,ensure_ascii=True,indent=2))
if not all(x["pass"] for x in out):raise SystemExit(1)
