#!/usr/bin/env python3
"""Optimize reviewed artwork (not image generation). Requires Pillow.

python scripts/prepare_editorial_cover.py source.png topic-slug [--crop x y right bottom]
Produces 16:10 WebP sizes and a JPEG fallback. Never overwrites the source master.
"""
import argparse
from pathlib import Path
import re
from PIL import Image, ImageOps

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('slug')
    parser.add_argument('--crop', type=int, nargs=4)
    args = parser.parse_args()
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', args.slug):
        parser.error('slug must contain lowercase letters, numbers and hyphens only')
    image = ImageOps.exif_transpose(Image.open(args.source)).convert('RGB')
    if args.crop:
        image = image.crop(tuple(args.crop))
    target = Path(__file__).resolve().parents[1] / 'assets/blog/editorial'
    target.mkdir(parents=True, exist_ok=True)
    for width in (640, 960, 1440):
        frame = ImageOps.fit(image, (width, width * 10 // 16), Image.Resampling.LANCZOS)
        frame.save(target / f'{args.slug}-{width}.webp', quality=84, method=6)
        if width == 1440:
            frame.save(target / f'{args.slug}-{width}.jpg', quality=88, optimize=True, progressive=True)
    print(f'{args.slug}: responsive WebP + JPEG ready')

if __name__ == '__main__':
    main()
