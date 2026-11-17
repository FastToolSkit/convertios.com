"""Wire /pt-br/ into existing en/es/ar pages (hreflang + language selector) and the sitemap. Idempotent."""
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
BASE = 'https://convertios.com'
SKIP = {'node_modules', '.git', 'tests', 'test-results', 'backend', 'docs', 'scripts', 'js', 'tool-template', 'design-preview', 'pt-br'}


def pages():
    for p in sorted(REPO.rglob('index.html')):
        rel = p.relative_to(REPO).as_posix()
        if rel.split('/')[0] in SKIP or any(part.startswith('.') for part in rel.split('/')):
            continue
        yield rel


PT = {p.relative_to(REPO / 'pt-br').as_posix()[:-len('index.html')] for p in (REPO / 'pt-br').rglob('index.html')}

changed = 0
for rel in pages():
    stem = re.sub(r'^(ar|es)/', '', rel)[:-len('index.html')]
    path = REPO / rel
    s = path.read_text(encoding='utf-8')
    orig = s
    if stem in PT and 'hreflang="pt-BR"' not in s.split('</head>')[0]:
        s, n = re.subn(r'(<link rel="alternate" hreflang="es" href="[^"]+">)',
                       r'\1' + f'\n<link rel="alternate" hreflang="pt-BR" href="{BASE}/pt-br/{stem}">', s, count=1)
        assert n == 1 or 'noindex' in s, rel
    m = re.search(r'<details class="language-selector.*?</details>', s, re.S)
    if m and 'hreflang="pt-BR"' not in m.group(0):
        if stem in PT:
            target = f'{BASE}/pt-br/{stem}'
        elif stem.startswith('blog/'):
            target = f'{BASE}/pt-br/blog/'
        else:
            target = f'{BASE}/pt-br/all-tools/'
        block = m.group(0)
        es_link = re.search(r'\n(\s*)<a [^>]*hreflang="es"[^>]*>Español</a>', block)
        assert es_link, rel
        new_block = block[:es_link.end()] + f'\n{es_link.group(1)}<a href="{target}" lang="pt-BR" hreflang="pt-BR" role="menuitem">Português</a>' + block[es_link.end():]
        s = s[:m.start()] + new_block + s[m.end():]
    if s != orig:
        path.write_text(s, encoding='utf-8')
        changed += 1
print('updated', changed, 'existing pages')

# sitemap
sm_path = REPO / 'sitemap.xml'
sm = sm_path.read_text(encoding='utf-8')


def add_pt_alt(match):
    block = match.group(0)
    loc = re.search(r'<loc>([^<]+)</loc>', block).group(1)
    stem = re.sub(r'^(ar|es)/', '', loc[len(BASE) + 1:])
    if stem not in PT or 'hreflang="pt-BR"' in block:
        return block
    return re.sub(r'(\n(\s*)<xhtml:link rel="alternate" hreflang="es" href="[^"]+"/>)',
                  r'\1' + f'\n\\2<xhtml:link rel="alternate" hreflang="pt-BR" href="{BASE}/pt-br/{stem}"/>', block, count=1)


sm = re.sub(r'<url>.*?</url>', add_pt_alt, sm, flags=re.S)
records = ''
for stem in sorted(PT):
    loc = f'{BASE}/pt-br/{stem}'
    if f'<loc>{loc}</loc>' in sm:
        continue
    records += (f'<url>\n  <loc>{loc}</loc>\n'
                f'  <xhtml:link rel="alternate" hreflang="en" href="{BASE}/{stem}"/>\n'
                f'  <xhtml:link rel="alternate" hreflang="ar" href="{BASE}/ar/{stem}"/>\n'
                f'  <xhtml:link rel="alternate" hreflang="es" href="{BASE}/es/{stem}"/>\n'
                f'  <xhtml:link rel="alternate" hreflang="pt-BR" href="{loc}"/>\n'
                f'  <xhtml:link rel="alternate" hreflang="x-default" href="{BASE}/{stem}"/>\n'
                '</url>\n\n')
if records:
    sm = sm.replace('</urlset>', records + '</urlset>', 1)
sm_path.write_text(sm, encoding='utf-8')
print('sitemap pt-BR records added:', records.count('<url>'))
