"""Prepare one conceptual AI illustration per verified newsroom story."""
import base64
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import urllib.request

from newsroom import slug_for, strict_date


def prepare(story):
    slug = slug_for(story["event_id"], strict_date(story["event_date"]))
    directory = Path(__file__).resolve().parents[1] / "assets/blog/editorial"
    suffixes = ("640.webp", "960.webp", "1440.webp", "1440.jpg")
    if all((directory / f"{slug}-{suffix}").is_file() for suffix in suffixes):
        return
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("Set OPENAI_API_KEY or prepare the story's editorial cover variants before rendering.")
    version = story["versions"]["en"]
    prompt = ("Create a cinematic conceptual illustration for a technology magazine. "
              "Use a strong central subject and rich physical depth, navy shadows, and motivated colored light. "
              "Compose for a 16:10 crop. No lettering, logos, official screenshots, or documentary photography. "
              f"Story: {version['title']}. Subject: {version['dek']}. Depict: {version['cover_alt']}")
    request = urllib.request.Request("https://api.openai.com/v1/images/generations",
        data=json.dumps({"model": os.environ.get("NEWSROOM_IMAGE_MODEL", "gpt-image-1"),
                         "prompt": prompt, "size": "1536x1024", "n": 1}).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    with urllib.request.urlopen(request, timeout=300) as response:
        encoded = json.load(response)["data"][0]["b64_json"]
    with tempfile.TemporaryDirectory() as temp:
        master = Path(temp) / "master.png"
        master.write_bytes(base64.b64decode(encoded, validate=True))
        subprocess.run([sys.executable, str(Path(__file__).with_name("prepare_editorial_cover.py")),
                        str(master), slug], check=True)


if __name__ == "__main__":
    for item in json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))["stories"]:
        prepare(item)
