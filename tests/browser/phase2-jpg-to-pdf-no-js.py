"""Verify important JPG-to-PDF page signals in a JavaScript-disabled browser."""
from playwright.sync_api import sync_playwright
import json
paths=["/jpg-to-pdf/","/es/jpg-to-pdf/","/ar/jpg-to-pdf/"]
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for path in paths:
  context=browser.new_context(java_script_enabled=False,viewport={"width":390,"height":844},user_agent="Mozilla/5.0 (Linux; Android 13; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36")
  page=context.new_page()
  response=page.goto("https://convertios.com"+path,wait_until="domcontentloaded",timeout=40000)
  info={
   "url":page.url,"status":response.status,
   "lang":page.locator("html").get_attribute("lang"),
   "canonical":page.locator('link[rel="canonical"]').get_attribute("href") if page.locator('link[rel="canonical"]').count() else None,
   "h1_count":page.locator("h1").count(),
   "h1_text":page.locator("h1").first.inner_text(timeout=3000) if page.locator("h1").count() else None,
   "meta_robots":page.locator('meta[name="robots"]').get_attribute("content") if page.locator('meta[name="robots"]').count() else None,
   "hreflang_count":page.locator('link[rel="alternate"][hreflang]').count(),
   "document_title":page.title(),
   "main_count":page.locator("main").count(),
   "visible_body_text_words":len(page.locator("body").inner_text(timeout=3000).split()),
   "visible_anchor_count":page.locator("body a[href]").count(),
   "no_horizontal_overflow":page.evaluate("document.documentElement.scrollWidth <= innerWidth")
  }
  info["pass"]=info["status"]==200 and info["canonical"]=="https://convertios.com"+path and info["h1_count"]==1 and info["visible_body_text_words"]>=150 and info["hreflang_count"]==4 and info["no_horizontal_overflow"] and "noindex" not in str(info["meta_robots"])
  results.append(info)
  context.close()
 browser.close()
print(json.dumps(results,indent=2,ensure_ascii=True))
if not all(r["pass"] for r in results):raise SystemExit(1)
