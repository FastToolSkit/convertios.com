"""Write a fixed PR review template with escaped, validated source URLs."""
import argparse
import json
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--draft", required=True)
ap.add_argument("--output", required=True)
args = ap.parse_args()
draft = json.loads(Path(args.draft).read_text(encoding="utf-8"))
lines = ["Automated editorial draft for human review. **Do not merge until each factual claim, translation, and practical recommendation has been checked against its primary source.**", "", "Source URLs (also used for duplicate PR detection):", ""]
for story in draft["stories"]:
    lines.append(f"- {story['source_url']} — {story['source_date']} — {story['slug']}")
lines += ["", "Validation: npm test; asset stamp check; existing editorial check; new page verification.", "Images, when present, are conceptual AI illustrations; otherwise existing archive illustrations are reused and labeled."]
Path(args.output).write_text("\n".join(lines) + "\n", encoding="utf-8")
