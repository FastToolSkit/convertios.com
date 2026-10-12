"""Find/replace the long-form content blocks of a tool page (used for page-specific copy)."""
import re

CLASSES = ('seo-content', 'tool-description', 'seo-section')


def _block_end(s, start, tag):
    depth = 0
    for m in re.compile(r'<(/?)%s\b[^>]*>' % tag).finditer(s, start):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return m.end()
    raise ValueError('unbalanced ' + tag)


def content_blocks(s):
    out = []
    for m in re.finditer(r'<(div|section)\b[^>]*class="([^"]*)"[^>]*>', s):
        classes = m.group(2).split()
        if any(c in CLASSES for c in classes) and not any(m.start() < e and m.start() >= b for b, e in out):
            out.append((m.start(), _block_end(s, m.start(), m.group(1))))
    return sorted(out)


def replace_content(s, new_html):
    blocks = content_blocks(s)
    if not blocks:
        raise ValueError('no content block')
    first = blocks[0][0]
    for b, e in reversed(blocks):
        s = s[:b] + s[e:]
    return s[:first] + new_html + s[first:]
