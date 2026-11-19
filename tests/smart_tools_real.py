"""Run inside the backend QA image with native processors and DejaVu Sans installed.

python3 tests/smart_tools_real.py OUTPUT_DIR [IPHONE_13_PRO_MAX_HEIC]
Each invocation uses an isolated temporary working directory per conversion.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont
from pillow_heif import register_heif_opener
from reportlab.pdfgen.canvas import Canvas
import json

register_heif_opener()
root = Path(__file__).resolve().parents[1]
fixtures = Path(sys.argv[1]).resolve()
fixtures.mkdir(exist_ok=True, parents=True)


def worker(tool, ext, inputs, opts=None, expected=None):
    with TemporaryDirectory() as tmp:
        target = Path(tmp) / ("converted." + ext)
        result = subprocess.run([sys.executable, str(root / "backend/smart_tools.py"), tool, str(target),
                                 json.dumps(opts or {}), *map(str, inputs)], cwd=tmp, capture_output=True, text=True,
                                timeout=95, env={**os.environ, 'MALLOC_ARENA_MAX':'2'})
        if expected:
            assert result.returncode and expected in result.stderr, (tool, result.stderr, expected)
            return
        assert result.returncode == 0, (tool, result.stderr)
        output = fixtures / (tool+"."+ext)
        output.write_bytes(target.read_bytes())
        return output


def run():
    sample = fixtures / "sample.heic"
    source = Image.new("RGB", (160, 96), (200, 45, 80))
    source.save(sample, format="HEIF", quality=92)
    jpg = worker("heic-to-jpg", "jpg", [sample])
    with Image.open(jpg) as im:
        assert im.format == "JPEG" and im.size == source.size and im.getpixel((10, 10))[0] > 180
    if len(sys.argv) > 2:
        phone = Path(sys.argv[2]).resolve()
        with Image.open(phone) as im:
            assert "iPhone" in im.getexif().get(272, "")
            original_size = im.size
        jpg = worker("heic-to-jpg", "jpg", [phone])
        with Image.open(jpg) as im:
            assert im.size == original_size and not im.getexif().get(274)
            print("iPhone", original_size, jpg.stat().st_size, flush=True)
    second = fixtures / "portrait.heic"
    Image.new("RGB", (96,160), "blue").save(second, format="HEIF")
    pdf = worker("heic-to-pdf", "pdf", [sample, second])
    info = subprocess.check_output(["pdfinfo","-f","1","-l","2",pdf], text=True)
    import re
    assert re.search(r"Pages:\s+2", info)
    for page, landscape in [(1,True),(2,False)]:
        w,h = re.search(rf"Page\s+{page} size:\s+([\d.]+) x ([\d.]+)",info).groups()
        assert (float(w)>float(h)) == landscape
    avif = fixtures / "alpha.avif"
    Image.new("RGBA", (84,65), (150,35,90,80)).save(avif)
    png = worker("avif-to-png","png",[avif])
    with Image.open(png) as im:
        assert im.format == "PNG" and im.getpixel((30,30))[3] == 80

    def pdf_text(path, text=None):
        doc = Canvas(str(path))
        if text:
            doc.drawString(50, 700, text)
        else:
            doc.drawImage(str(png), 50, 700, 84, 65)
        doc.showPage()
        doc.save()

    digital = fixtures / "digital.pdf"
    pdf_text(digital, "Convertios test 731")
    assert "Convertios test 731" in worker("pdf-to-text","txt",[digital]).read_text()
    scan = fixtures / "scanned.pdf"
    pdf_text(scan)
    worker("pdf-to-text","txt",[scan],expected="NO_TEXT")
    font = ImageFont.truetype("DejaVuSans.ttf",46)
    sentences = {"eng":"The garden opens every morning", "spa":"El jardín abre cada mañana",
                 "por":"O portão está aberto pela manhã", "ara":"مرحبا بكم في مدينة عمان"}
    for lang, sentence in sentences.items():
        photo = Image.new("RGB",(1000,170),"white")
        ImageDraw.Draw(photo).text((30,40),sentence,fill="black",font=font)
        input_path = fixtures / (lang+".png")
        photo.save(input_path)
        out = worker("image-to-text","txt",[input_path],{"lang":lang})
        recognized = " ".join(out.read_text().split())
        print("OCR", lang, repr(recognized), flush=True)
        from difflib import SequenceMatcher
        assert SequenceMatcher(None,sentence,recognized).ratio() >= .85

    gif = fixtures / "motion.gif"
    frames = []
    for i in range(6):
        frame = Image.new("RGBA",(160,100),(0,0,0,0))
        ImageDraw.Draw(frame).rectangle((i*6,11,i*6+32,54),fill="red")
        frames.append(frame)
    timing = [40,80,100,40,160,80]
    frames[0].save(gif,save_all=True,append_images=frames[1:],duration=timing,loop=2,disposal=2,optimize=False)
    smaller = worker("gif-compressor","gif",[gif], {"loss":0})
    with Image.open(smaller) as im:
        assert im.n_frames==6 and im.info["loop"]==2 and smaller.stat().st_size<gif.stat().st_size
        for i in range(6):
            im.seek(i)
            assert im.info["duration"]==timing[i] and im.convert("RGBA").getpixel((159,99))[3]==0
    mp4 = fixtures / "source.mp4"
    subprocess.run(["ffmpeg","-v","error","-y","-f","lavfi","-i","testsrc2=size=320x180:rate=24",
                    "-f","lavfi","-i","sine=frequency=440","-t","3","-c:v","libx264","-crf","10",
                    "-threads","1","-c:a","aac",str(mp4)],check=True)
    out = worker("mp4-to-gif","gif",[mp4],{"start":1,"seconds":1,"width":160,"fps":10})
    with Image.open(out) as im:
        assert im.size == (160,90) and im.n_frames == 10
    video = worker("video-compressor","mp4",[mp4])
    result = json.loads(subprocess.check_output(["ffprobe","-v","error","-show_streams","-of","json",video]))
    assert {s["codec_name"] for s in result["streams"]} == {"h264","aac"} and video.stat().st_size < mp4.stat().st_size
    for tool, ext in [("heic-to-jpg","jpg"),("heic-to-pdf","pdf"),("avif-to-png","png"),("mp4-to-gif","gif"),
                      ("video-compressor","mp4"),("image-to-text","txt"),("pdf-to-text","txt"),("gif-compressor","gif")]:
        for bad in [b"", b"not an image or a document", b"%PDF-1.7\ntruncated"]:
            invalid = fixtures / "invalid.bin"
            invalid.write_bytes(bad)
            worker(tool,ext,[invalid],expected="INVALID_FILE")
    print("All eight native workflows passed.", flush=True)


if __name__ == "__main__":
    run()
