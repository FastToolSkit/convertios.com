#!/usr/bin/env python3
"""Stamps every reference to a local CSS/JS asset with a short hash of the file's content.

    /style.css  ->  /style.css?v=3f9a1c2b

Run after editing any shared CSS/JS file:   python3 scripts/stamp-assets.py
`--check` only reports stale or missing stamps (used by tests/site-check.mjs and CI).
Browsers and Cloudflare cache assets by full URL, so a changed file gets a new URL on the next deploy,
while unchanged files keep their cache.
"""
import hashlib
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {'node_modules', '.git', 'tests', 'test-results', 'backend', 'docs', 'scripts'}
REF = re.compile(r'''((?:href|src)=")(/[A-Za-z0-9_./-]+\.(?:css|js))(?:\?v=[A-Za-z0-9]+)?(")''')


def content_hash(rel):
    path = os.path.join(ROOT, rel.lstrip('/'))
    if not os.path.isfile(path):
        return None
    with open(path, 'rb') as fh:
        return hashlib.sha256(fh.read()).hexdigest()[:8]


def html_files():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            if name.endswith('.html'):
                yield os.path.join(dirpath, name)


def main():
    check = '--check' in sys.argv
    hashes = {}
    problems = []
    changed = 0
    for path in html_files():
        with open(path, encoding='utf-8') as fh:
            text = fh.read()

        def stamp(match):
            rel = match.group(2)
            if rel not in hashes:
                hashes[rel] = content_hash(rel)
            digest = hashes[rel]
            if digest is None:
                problems.append(f'{os.path.relpath(path, ROOT)}: {rel} does not exist')
                return match.group(0)
            wanted = f'{match.group(1)}{rel}?v={digest}{match.group(3)}'
            if match.group(0) != wanted:
                problems.append(f'{os.path.relpath(path, ROOT)}: {rel} stamp is stale or missing')
            return wanted

        new = REF.sub(stamp, text)
        if new != text and not check:
            with open(path, 'w', encoding='utf-8') as fh:
                fh.write(new)
            changed += 1
    if check:
        for line in problems[:50]:
            print(line)
        print(f'{len(problems)} asset reference problem(s)')
        sys.exit(1 if problems else 0)
    missing = [p for p in problems if 'does not exist' in p]
    for line in missing:
        print(line)
    print(f'stamped assets in {changed} file(s); {len(hashes)} distinct assets')
    sys.exit(1 if missing else 0)


if __name__ == '__main__':
    main()
