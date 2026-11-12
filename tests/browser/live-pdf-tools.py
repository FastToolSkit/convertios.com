"""Live external-library (not mocked) PDF conversion browser checks.
Uses a local harmless PDF fixture. Expects accessible production site and CDN.
"""
from playwright.sync_api import sync_playwright
from pathlib import Path
from tempfile import TemporaryDirectory
import os
BASE=os.getenv("SITE_BASE","https://convertios.com/")
def fixture_pdf():
  """Generate a valid one-page PDF with no third-party Python dependencies."""
  objects=[
   "<< /Type /Catalog /Pages 2 0 R >>",
   "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
   "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
   "<< /Length 42 >>\nstream\nBT /F1 18 Tf 72 700 Td (Test PDF) Tj ET\nendstream",
   "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"]
  chunks=[b"%PDF-1.4\n"]; offsets=[]
  for index,obj in enumerate(objects,1):
    offsets.append(sum(map(len,chunks)))
    chunks.append(f"{index} 0 obj\n{obj}\nendobj\n".encode("ascii"))
  xref=sum(map(len,chunks))
  chunks.append(f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n".encode("ascii"))
  chunks.extend(f"{offset:010d} 00000 n \n".encode("ascii") for offset in offsets)
  chunks.append(f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF".encode("ascii"))
  return b"".join(chunks)

FIXTURE_BYTES=fixture_pdf()

failures=[]
with sync_playwright() as p:
 browser=p.chromium.launch()
 context=browser.new_context(accept_downloads=True)
 for locale in ("","es/","ar/"):
  for tool in ("pdf-to-jpg","rotate-pdf"):
   page=context.new_page()
   errors=[]
   page.on("pageerror",lambda e:errors.append(str(e)))
   try:
    page.goto(BASE+locale+tool+"/",wait_until="domcontentloaded",timeout=25000)
    page.wait_for_timeout(1000)
    page.locator("#file-input").set_input_files({"name":"convertios-test.pdf","mimeType":"application/pdf","buffer":FIXTURE_BYTES})
    if tool=="pdf-to-jpg":
     page.locator("#preview a[download]").first.wait_for(timeout=30000)
     with page.expect_download(timeout=10000) as event:page.locator("#preview a[download]").first.click()
     out=Path(event.value.path()).read_bytes()
     assert out.startswith(b"\xff\xd8\xff"),out[:20]
    else:
     page.locator("#preview .rotate-btn").first.wait_for(timeout=30000)
     page.locator("#preview .rotate-btn").first.click()
     with page.expect_download(timeout=15000) as event:page.locator("#downloadBtn").click()
     out=Path(event.value.path()).read_bytes()
     assert out.startswith(b"%PDF-"),out[:20]
    print("PASS",locale or "en",tool,len(out),errors[:2],flush=True)
   except Exception as e:
    failures.append((locale,tool,str(e)[:200],errors[:2]))
    print("FAIL",locale or "en",tool,str(e)[:160],errors[:2],flush=True)
   page.close()
 browser.close()
print("FINAL",6-len(failures),"/6",failures,flush=True)
raise SystemExit(bool(failures))
