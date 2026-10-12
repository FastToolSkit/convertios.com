#!/usr/bin/env python3
"""Generates the Convertios test fixture set into tests/fixtures/files/.

Needs Python 3 with Pillow, plus ffmpeg on PATH for the audio/video fixtures.
Run: python3 tests/fixtures/make-fixtures.py
"""
import math
import os
import shutil
import struct
import subprocess
import wave

from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'files')
os.makedirs(OUT, exist_ok=True)


def path(name):
    return os.path.join(OUT, name)


def photo(w, h, seed=1):
    """A busy, photo-like RGB image (gradients plus shapes) that does not compress trivially."""
    img = Image.new('RGB', (w, h))
    px = img.load()
    for y in range(h):
        for x in range(w):
            px[x, y] = (
                int(128 + 127 * math.sin((x * 0.013 + seed) + y * 0.004)),
                int(128 + 127 * math.sin(y * 0.017 + seed * 2)),
                int(128 + 127 * math.cos((x + y) * 0.009 + seed)),
            )
    d = ImageDraw.Draw(img)
    for i in range(60):
        r = 10 + (i * 37) % 90
        cx, cy = (i * 197) % w, (i * 131) % h
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=((i * 53) % 255, (i * 97) % 255, (i * 29) % 255))
    d.text((w // 3, h // 2), 'CONVERTIOS TEST', fill=(0, 0, 0))
    return img


def transparent_png(w, h):
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([w * 0.2, h * 0.2, w * 0.8, h * 0.8], fill=(230, 57, 70, 255))
    d.rectangle([w * 0.05, h * 0.05, w * 0.3, h * 0.3], fill=(29, 53, 87, 128))
    return img


def make_images():
    photo(640, 480).save(path('small.jpg'), quality=90)
    photo(3000, 2000, seed=3).save(path('large.jpg'), quality=92)
    photo(1200, 1800, seed=5).save(path('portrait.jpg'), quality=90)
    photo(1000, 1000, seed=7).save(path('square.jpg'), quality=90)
    transparent_png(800, 600).save(path('transparent.png'))
    photo(800, 600, seed=9).save(path('photo.png'))
    photo(800, 600, seed=11).save(path('photo.webp'), quality=85)
    photo(400, 300, seed=13).convert('P', palette=Image.ADAPTIVE).save(path('image.gif'))
    photo(400, 300, seed=15).save(path('image.bmp'))
    # Landscape pixels tagged with EXIF orientation 6 (rotate 90° CW): should display as portrait 300x400.
    exif = Image.Exif()
    exif[0x0112] = 6
    photo(400, 300, seed=17).save(path('rotated-exif.jpg'), quality=90, exif=exif)


def make_pdf(pages, name):
    objects = ['<< /Type /Catalog /Pages 2 0 R >>']
    kids = ' '.join(f'{3 + i * 2} 0 R' for i in range(pages))
    objects.append(f'<< /Type /Pages /Kids [{kids}] /Count {pages} >>')
    font_obj = 3 + pages * 2
    for i in range(pages):
        stream = f'BT /F1 48 Tf 72 700 Td (Page {i + 1}) Tj ET'
        objects.append(f'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents {4 + i * 2} 0 R /Resources << /Font << /F1 {font_obj} 0 R >> >> >>')
        objects.append(f'<< /Length {len(stream)} >>\nstream\n{stream}\nendstream')
    objects.append('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
    out = '%PDF-1.4\n'
    offsets = []
    for index, obj in enumerate(objects):
        offsets.append(len(out))
        out += f'{index + 1} 0 obj\n{obj}\nendobj\n'
    xref = len(out)
    out += f'xref\n0 {len(objects) + 1}\n0000000000 65535 f \n' + ''.join(f'{o:010d} 00000 n \n' for o in offsets)
    out += f'trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF'
    with open(path(name), 'w', encoding='latin-1') as fh:
        fh.write(out)


def make_wav(name, seconds=4, rate=44100):
    with wave.open(path(name), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(rate)
        frames = bytearray()
        for i in range(seconds * rate):
            left = int(12000 * math.sin(2 * math.pi * 440 * i / rate))
            right = int(6000 * math.sin(2 * math.pi * 660 * i / rate))
            frames += struct.pack('<hh', left, right)
        w.writeframes(bytes(frames))


def ffmpeg(*args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True)


def make_media():
    make_wav('audio.wav')
    if not shutil.which('ffmpeg'):
        print('ffmpeg not found: skipping MP3/video fixtures')
        return
    ffmpeg('-i', path('audio.wav'), '-c:a', 'libmp3lame', '-b:a', '192k', path('audio.mp3'))
    src = ['-f', 'lavfi', '-i', 'testsrc=size=320x240:rate=15:duration=3', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=3']
    ffmpeg(*src, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest', path('video.mp4'))
    ffmpeg(*src, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest', path('video.mov'))
    ffmpeg(*src, '-c:v', 'mpeg4', '-c:a', 'libmp3lame', '-shortest', path('video.avi'))


def make_text():
    with open(path('text-samples.txt'), 'w', encoding='utf-8') as fh:
        fh.write('hello wORLD, this is a TEST.\n'
                 'مرحبا بالعالم. هذا اختبار للنص العربي 123.\n'
                 'Ñandú está aquí: ¿qué tal? él, ÁRBOL y canción.\n')


if __name__ == '__main__':
    make_images()
    make_pdf(1, 'simple.pdf')
    make_pdf(4, 'multipage.pdf')
    make_media()
    make_text()
    for name in sorted(os.listdir(OUT)):
        print(f'{name:22} {os.path.getsize(path(name)):>9} bytes')
