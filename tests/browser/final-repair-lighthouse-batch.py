"""Bounded Lighthouse audits for EN, ES, AR landing pages, both emulations."""
from pathlib import Path
import subprocess,os,json,time
root=Path(__file__).resolve().parents[2]
out=root/"docs"/"final-repair-v1-20261113"
env=os.environ.copy()
env["CHROME_PATH"]=r"C:\Program Files\Google\Chrome\Application\chrome.exe"
jobs=[("en","desktop","https://convertios.com/"),("es","mobile","https://convertios.com/es/"),("es","desktop","https://convertios.com/es/"),("ar","mobile","https://convertios.com/ar/"),("ar","desktop","https://convertios.com/ar/")]
for lang,device,url in jobs:
    path=out/f"lighthouse-{lang}-{device}.json"
    command=["npx.cmd","--yes","lighthouse",url,"--quiet","--chrome-flags=--headless=new --no-sandbox --disable-gpu","--only-categories=performance,accessibility,best-practices,seo","--output=json",f"--output-path={path}"]
    if device=="desktop":command.append("--preset=desktop")
    begin=time.monotonic()
    try:
        result=subprocess.run(command,cwd=str(root),env=env,text=True,capture_output=True,timeout=130)
        if result.returncode:print("ERROR",lang,device,result.stderr[-500:],flush=True);continue
        report=json.loads(path.read_text(encoding="utf-8"))
        scores={k:round(v["score"]*100) if v.get("score") is not None else None for k,v in report.get("categories",{}).items()}
        print("PASS",lang,device,scores,"elapsed",round(time.monotonic()-begin,1),flush=True)
    except Exception as e: print("FAILED",lang,device,str(e)[:300],flush=True)
print("DONE",flush=True)
