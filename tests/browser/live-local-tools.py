"""Live non-mocked browser conversion smoke; uploads a synthetic public-domain test image.
Avoids API/backend paid provider calls. Run: python tests/browser/live-local-tools.py
"""
from playwright.sync_api import sync_playwright
from urllib.parse import urljoin
import os
from pathlib import Path
from io import BytesIO
from tempfile import TemporaryDirectory
import traceback
LOCALES=("", "es/", "ar/")
BASE=os.getenv("SITE_BASE","https://convertios.com/")
issues=[]
with sync_playwright() as p:
  b=p.chromium.launch(headless=True)
  context=b.new_context(accept_downloads=True, ignore_https_errors=False)
  imgpage=context.new_page()
  imgpage.goto('data:text/html,<body style="background:#da31a3"><div style="height:180px;background:white">Convertios test fixture</div></body>')
  image_bytes=imgpage.screenshot(type='png')
  imgpage.close()
  print("TEST PNG length",len(image_bytes),flush=True)
  for lang in LOCALES:
    for tool in ("jpg-to-pdf","image-converter"):
      page=context.new_page()
      console_errors=[]
      page.on("pageerror",lambda e:console_errors.append(str(e)))
      url=urljoin(BASE,lang+tool+"/")
      try:
        page.goto(url,wait_until="domcontentloaded",timeout=30000)
        page.wait_for_timeout(1100)
        if tool=="jpg-to-pdf":
          page.locator("#file-input").set_input_files({"name":"convertios-test.png","mimeType":"image/png","buffer":image_bytes})
          page.locator('button[onclick="createPDF()"]').click()
          page.locator('#downloadLink[href^="blob:"]').wait_for(timeout=25000)
          with page.expect_download(timeout=12000) as ev: page.locator("#downloadLink").click()
          download=ev.value
          path=download.path()
          data=Path(path).read_bytes()
          assert data.startswith(b"%PDF-"),("PDF signature",data[:16])
          print("PASS",lang or "en",tool,download.suggested_filename,len(data),"page errors",console_errors[:2],flush=True)
        else:
          page.locator("#upload").set_input_files({"name":"convertios-test.png","mimeType":"image/png","buffer":image_bytes})
          page.locator("#format").select_option("image/jpeg")
          page.locator('button[onclick="convertImage()"]').click()
          page.locator("#downloadMenu").wait_for(state="visible",timeout=20000)
          with page.expect_download(timeout=12000) as ev:page.evaluate("downloadImages()")
          download=ev.value
          data=Path(download.path()).read_bytes()
          assert data.startswith(b"\xff\xd8\xff"),("JPEG signature",data[:16])
          print("PASS",lang or "en",tool,download.suggested_filename,len(data),"page errors",console_errors[:2],flush=True)
      except Exception as e:
        issues.append((lang,tool,str(e)[:450],console_errors[:3]))
        print("FAIL",lang or "en",tool,str(e)[:180],"page errors",console_errors[:2],flush=True)
      finally:
        page.close()
  b.close()
print("RESULT",6-len(issues),"/6 passed; issues",issues,flush=True)
raise SystemExit(bool(issues))
