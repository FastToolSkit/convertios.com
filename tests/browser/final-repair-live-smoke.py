"""Live, bounded mobile/desktop performance + basic accessibility smoke; not Lighthouse."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json, time
base="https://convertios.com"
paths=["/","/es/","/ar/","/jpg-to-pdf/","/es/ai-image-enhancer/","/ar/video-to-mp3/"]
results=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True)
    for path in paths:
        for device,width,height in [("mobile",390,844),("desktop",1365,900)]:
            ctx=browser.new_context(viewport={"width":width,"height":height},device_scale_factor=1)
            page=ctx.new_page()
            failures=[]
            page.on("pageerror",lambda err: failures.append(str(err)[:160]))
            started=time.perf_counter()
            try:
                resp=page.goto(base+path,wait_until="domcontentloaded",timeout=30000)
                page.wait_for_timeout(550)
                metrics=page.evaluate("""() => {
                  const nav=performance.getEntriesByType('navigation')[0];
                  const imgs=[...document.images];
                  const buttons=[...document.querySelectorAll('button,input,select,textarea')];
                  const missingLabels=buttons.filter(x=>{
                     if(x.type==='hidden'||x.type==='submit'||x.type==='button'||x.type==='image'||x.type==='reset'||x.disabled) return false;
                     return !(x.getAttribute('aria-label')||x.getAttribute('aria-labelledby')||x.labels?.length||x.getAttribute('title')||x.closest('label')||x.tagName==='BUTTON'&&x.textContent.trim());
                  });
                  return {
                    dom_content_loaded_ms:Math.round(nav?.domContentLoadedEventEnd||0),
                    ttfb_ms:Math.round(nav?.responseStart||0),
                    sideways_overflow_px:Math.max(0, document.documentElement.scrollWidth-innerWidth),
                    image_missing_alt:imgs.filter(x=>!x.hasAttribute('alt')).length,
                    unlabelled_active_controls:missingLabels.length,
                    duplicate_id_count:[...document.querySelectorAll('[id]')].length-new Set([...document.querySelectorAll('[id]')].map(e=>e.id)).size,
                    empty_anchor_count:[...document.querySelectorAll('a')].filter(a=>!a.textContent.trim()&&!a.getAttribute('aria-label')&&!a.getAttribute('title')&&!a.querySelector('img[alt]')).length
                  };
                }""")
                results.append({"path":path,"device":device,"http":resp.status,"elapsed_s":round(time.perf_counter()-started,2),"js_errors":failures,"metrics":metrics})
                print(path,device,resp.status,metrics,flush=True)
            except Exception as exc:
                results.append({"path":path,"device":device,"error":str(exc)[:280]})
                print("FAIL",path,device,str(exc)[:120],flush=True)
            finally:ctx.close()
    browser.close()
out=Path("docs/final-repair-v1-20261113/browser-a11y-perf-smoke.json")
out.write_text(json.dumps({"scope":"12 bounded live Chromium loads: basic labels, layout, DOM timings; NOT Lighthouse, axe, keyboard audit, CrUX or full accessibility certification", "results":results},indent=2),encoding="utf-8")
print("TOTAL",len(results),"http200",sum(x.get("http")==200 for x in results),flush=True)
