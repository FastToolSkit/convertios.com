"""Bounded native processors for the smart tool routes. Inputs have generated names."""
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import warnings

from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

MIB = 1024 ** 2
Image.MAX_IMAGE_PIXELS = 16_000_000
warnings.simplefilter("error", Image.DecompressionBombWarning)
register_heif_opener(decode_threads=1, thumbnails=False, depth_images=False, aux_images=False)
os.environ.update(OMP_THREAD_LIMIT="1", OPENBLAS_NUM_THREADS="1")


class Rejected(ValueError):
    pass


def require(ok, code="INVALID_FILE"):
    if not ok:
        raise Rejected(code)


def integer(options, key, default, low, high):
    value = str(options.get(key, default))
    require(re.fullmatch(r"[0-9]{1,6}", value), "BAD_OPTIONS")
    number = int(value)
    require(low <= number <= high, "BAD_OPTIONS")
    return number


def command(*args, stdout=None, timeout=75):
    subprocess.run(args, check=True, stdin=subprocess.DEVNULL, stdout=stdout or subprocess.DEVNULL,
                   stderr=subprocess.DEVNULL, timeout=timeout)


def read_info(*args):
    with open("probe", "w+b") as stream:
        command(*args, stdout=stream, timeout=12)
        require(stream.tell() < MIB)
        stream.seek(0)
        return stream.read().decode("utf-8", "replace")


def open_still(path, formats, primary=False):
    image = Image.open(path, formats=formats)
    if primary and image.format == "HEIF":
        image.seek(image.info.get("primary_index", image.tell()))
    else:
        require(getattr(image, "n_frames", 1) == 1, "ANIMATED")
    require(image.width * image.height <= Image.MAX_IMAGE_PIXELS, "LIMIT")
    image.load()
    return image


def write_jpeg(source, destination, quality):
    with open_still(source, ["HEIF"], primary=True) as image:
        rgb = image.convert("RGB")
        rgb.info.clear()
        rgb.save(destination, "JPEG", quality=quality)
        return rgb.size


def heic_pdf(inputs, out):
    from reportlab.lib.pagesizes import A4, landscape
    from reportlab.pdfgen import canvas
    document = canvas.Canvas(str(out), pagesize=A4, pageCompression=1)
    for i, source in enumerate(inputs):
        photo = Path(f"page-{i}.jpg")
        width, height = write_jpeg(source, photo, 87)
        pw, ph = landscape(A4) if width > height else A4
        scale = min((pw - 48) / width, (ph - 48) / height)
        w, h = width * scale, height * scale
        document.setPageSize((pw, ph))
        document.drawImage(str(photo), (pw - w) / 2, (ph - h) / 2, w, h)
        document.showPage()
    document.save()


def gif_timing(path, max_frame_pixels=36_000_000):
    with Image.open(path, formats=["GIF"]) as image:
        frames = []
        for i in range(301):
            try:
                image.seek(i)
            except EOFError:
                break
            require(i < 300 and image.width * image.height * (i + 1) <= max_frame_pixels, "LIMIT")
            image.load()
            frames.append(image.info.get("duration", 0))
        return image.size, frames, image.info.get("loop")


def optimize_gif(source, out, opts):
    original = gif_timing(source)
    amount = integer(opts, "loss", 30, 0, 100)
    command("gifsicle", "-O2", "--no-warnings", "--optimize=keep-empty",
            f"--lossy={amount}", str(source), "-o", str(out))
    require(gif_timing(out) == original, "NO_GAIN")
    require(out.stat().st_size < source.stat().st_size, "NO_GAIN")


def iso_brand(path, brands):
    with path.open("rb") as stream:
        header = stream.read(256)
    size = int.from_bytes(header[:4], "big")
    require(header[4:8] == b"ftyp" and 16 <= size <= len(header))
    return any(header[i:i+4] in brands for i in [8, *range(16, size, 4)])


def video(source, out, opts, gif):
    require(iso_brand(source, {b"isom", b"iso2", b"mp41", b"mp42", b"avc1", b"M4V ", b"iso5", b"iso6"}))
    common = ["-protocol_whitelist", "file", "-f", "mov", "-enable_drefs", "0"]
    fields = "stream=codec_type,codec_name,width,height,avg_frame_rate:format=duration"
    info = json.loads(read_info("ffprobe", "-v", "error", *common, "-show_entries", fields, "-of", "json", str(source)))
    streams = [s for s in info["streams"] if s.get("codec_type") == "video"]
    require(len(streams) == 1 and streams[0]["codec_name"] in {"h264", "hevc", "mpeg4", "av1", "vp9"})
    stream = streams[0]
    duration = float(info["format"]["duration"])
    require(0 < duration <= 300 and 0 < stream["width"] * stream["height"] <= 8_400_000, "LIMIT")
    args = ["ffmpeg", "-nostdin", "-v", "error", "-xerror", "-threads", "1", "-filter_threads", "1",
            "-filter_complex_threads", "1"]
    if gif:
        start = integer(opts, "start", 0, 0, 299)
        seconds = integer(opts, "seconds", 3, 1, 8)
        fps = integer(opts, "fps", 10, 2, 15)
        width = integer(opts, "width", 320, 64, 640)
        colors = integer(opts, "colors", 128, 16, 256)
        require(start < duration and min(seconds, duration-start)*fps >= 2, "BAD_OPTIONS")
        # Two short passes avoid buffering the entire decoded clip for palette generation.
        clip = [*args, "-ss", str(start), "-t", str(seconds), *common, "-i", str(source)]
        filters = (f"fps={fps},scale={width}:{width}:force_original_aspect_ratio=decrease")
        command(*clip, "-vf", f"{filters},palettegen=max_colors={colors}", "-frames:v", "1",
                "-threads", "1", "palette.png")
        command(*clip, "-i", "palette.png", "-filter_complex",
                f"[0:v:0]{filters}[clip];[clip][1:v]paletteuse=dither=bayer[out]",
                "-map", "[out]", "-an", "-threads", "1", "-loop", "0", str(out))
        require(len(gif_timing(out, max_frame_pixels=640*640*15*8)[1]) >= 2)
    else:
        crf = {"light": 23, "balanced": 28, "small": 33}.get(opts.get("preset", "balanced"))
        require(crf, "BAD_OPTIONS")
        command(*args, *common, "-i", str(source), "-map", "0:v:0", "-map", "0:a:0?", "-map_metadata", "-1",
                "-vf", "scale=w='min(1280,iw)':h='min(1280,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1",
                "-fpsmax", "30", "-c:v", "libx264", "-threads", "1", "-pix_fmt", "yuv420p", "-preset", "veryfast",
                "-crf", str(crf), "-c:a", "aac", "-ac", "2", "-b:a", "96k", "-movflags", "+faststart", str(out))
        require(out.stat().st_size < source.stat().st_size, "NO_GAIN")
        require(iso_brand(out, {b"isom", b"mp42"}))


def extract_text(tool, source, out, opts):
    if tool == "pdf-to-text":
        with source.open("rb") as handle:
            require(handle.read(5) == b"%PDF-")
        info = read_info("pdfinfo", str(source))
        pages = re.search(r"^Pages:\s+(\d+)", info, re.M)
        require(pages and 0 < int(pages[1]) <= 200, "LIMIT")
        command("pdftotext", "-enc", "UTF-8", "-layout", str(source), str(out))
    else:
        lang = opts.get("lang", "eng")
        require(lang in {"eng", "spa", "ara", "por"}, "BAD_OPTIONS")
        with open_still(source, ["JPEG", "PNG"]) as image:
            ImageOps.exif_transpose(image).convert("RGB").save("ocr.png")
        command("tesseract", "ocr.png", str(out.with_suffix("")), "-l", lang, "--psm", "3", "txt")
    require(0 <= out.stat().st_size <= 2*MIB, "LIMIT")
    require(out.read_text(encoding="utf-8").strip(), "NO_TEXT")


def run(tool, out, opts, inputs):
    source = inputs[0]
    if tool.startswith("heic-to-"):
        for item in inputs:
            require(iso_brand(item, {b"heic", b"heix", b"hevc", b"hevx"}))
        if tool == "heic-to-pdf":
            heic_pdf(inputs, out)
        else:
            write_jpeg(source, out, integer(opts, "quality", 88, 50, 95))
    elif tool == "avif-to-png":
        require(iso_brand(source, {b"avif"}))
        with open_still(source, ["AVIF"]) as image:
            result = ImageOps.exif_transpose(image)
            result.info.clear()
            result.save(out, "PNG")
    elif tool in {"pdf-to-text", "image-to-text"}:
        extract_text(tool, source, out, opts)
    elif tool == "gif-compressor":
        optimize_gif(source, out, opts)
    elif tool in {"mp4-to-gif", "video-compressor"}:
        video(source, out, opts, tool == "mp4-to-gif")
    else:
        raise Rejected("BAD_OPTIONS")
    require(0 < out.stat().st_size <= 50 * MIB, "LIMIT")


if __name__ == "__main__":
    try:
        if sys.platform.startswith("linux"):
            import resource
            for key, limit in [(resource.RLIMIT_CPU, 85), (resource.RLIMIT_FSIZE, 52*MIB),
                               (resource.RLIMIT_AS, 768*MIB)]:
                resource.setrlimit(key, (limit, limit))
        tool, output, options, *files = sys.argv[1:]
        run(tool, Path(output), json.loads(options), list(map(Path, files)))
    except Rejected as error:
        sys.exit(str(error))
    except subprocess.TimeoutExpired:
        sys.exit("TIMEOUT")
    except (Image.DecompressionBombError, Image.DecompressionBombWarning, MemoryError):
        sys.exit("LIMIT")
    except (OSError, ValueError, KeyError, RuntimeError, EOFError, subprocess.CalledProcessError):
        sys.exit("INVALID_FILE")
