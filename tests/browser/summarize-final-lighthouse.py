from pathlib import Path
import json
root=Path(__file__).resolve().parents[2]
out=root/"docs"/"final-repair-v1-20261113"
rows=[]
for lang in ("en","es","ar"):
 for mode in ("mobile","desktop"):
  d=json.loads((out/f"lighthouse-{lang}-{mode}.json").read_text(encoding="utf-8"))
  audit=d["audits"]
  row={"language":lang,"device":mode,"scores":{k:round(v["score"]*100) if v.get("score") is not None else None for k,v in d["categories"].items()},"metrics":{k:audit[k].get("numericValue") for k in ("first-contentful-paint","largest-contentful-paint","total-blocking-time","cumulative-layout-shift","speed-index") if k in audit},"failed_accessibility":[{"id":a["id"],"nodes":[{"selector":i.get("node",{}).get("selector"),"explanation":i.get("node",{}).get("explanation")} for i in audit[a["id"]].get("details",{}).get("items",[])][:15]} for a in d["categories"]["accessibility"]["auditRefs"] if audit[a["id"]].get("score")==0]}
  rows.append(row)
  print(lang,mode,row["scores"],[(x["id"],[n["selector"] for n in x["nodes"]]) for x in row["failed_accessibility"]],flush=True)
(out/"lighthouse-summary.json").write_text(json.dumps(rows,indent=2,ensure_ascii=True),encoding="utf-8")
