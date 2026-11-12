"""Optional capped conceptual images; use existing archive illustrations on failure."""
import argparse
import base64
import datetime as dt
import json
import os
from pathlib import Path
from urllib.request import Request, urlopen

from build import ROOT, validate

MAX_CALLS = 3
MODEL = "gpt-image-1-mini"


def create_images(draft, sources, root=ROOT):
    stories = validate(draft, sources, dt.datetime.now(dt.timezone.utc).date(), root)
    key = os.environ.get("OPENAI_IMAGE_API_KEY")
    if not key:
        print("no image key; using labeled archive illustrations")
        return 0
    count = 0
    for story in stories[:MAX_CALLS]:
        prompt = ("Create an editorial conceptual illustration for a technology news analysis. "
                  "Abstract clean vector-like visual, no text, logos, people, screenshots, "
                  "documentary scene or claims of a real event. Topic: " + story["locales"]["en"]["title"][:140])
        request = Request("https://api.openai.com/v1/images/generations",
            data=json.dumps({"model": MODEL, "prompt": prompt, "n": 1, "size": "1536x1024", "quality": "low", "output_format": "png"}).encode(),
            headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"}, method="POST")
        try:
            with urlopen(request, timeout=90) as response:
                result = json.load(response)
            image = base64.b64decode(result["data"][0]["b64_json"], validate=True)
            if not image.startswith(b"\x89PNG\r\n\x1a\n") or len(image) > 8_000_000:
                raise ValueError("invalid returned PNG")
            path = root / "assets/blog/newsroom" / (story["slug"] + ".png")
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(image)
            count += 1
        except (OSError, ValueError, KeyError, IndexError) as exc:
            print(f"image unavailable for {story['slug']}: {type(exc).__name__}; using archive")
    print(f"generated {count} conceptual images; paid call cap {MAX_CALLS}")
    return count


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--draft", required=True)
    ap.add_argument("--sources", required=True)
    args = ap.parse_args()
    create_images(json.loads(Path(args.draft).read_text(encoding="utf-8")), json.loads(Path(args.sources).read_text(encoding="utf-8")))
