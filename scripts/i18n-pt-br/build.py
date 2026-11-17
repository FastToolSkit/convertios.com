"""Build /pt-br/ pages from the /es/ templates using the reviewed es->pt-BR dictionary."""
import json
import re
import sys
from ptlib import REPO, WORK, scope_pages, TOKEN, TRANS_ATTRS, META_TRANS, JSON_KEYS, is_text, js_strings

_strings = json.load(open(WORK / 'strings.json', encoding='utf-8'))
_tr = []
for _f in sorted((WORK / 'translations').glob('*.json'), key=lambda f: int(f.stem)):
    _tr += json.load(open(_f, encoding='utf-8'))
assert len(_tr) == len(_strings), 'translations out of sync with strings.json'
D = {x['es']: t for x, t in zip(_strings, _tr)}
D.setdefault('Português', 'Português')  # selector entry already present in the es templates
BASE = 'https://convertios.com'
missing = []


def tr(s, page):
    if s in D:
        return D[s]
    missing.append((page, s))
    return s


def tr_text(tok, page):
    core = tok.strip()
    if not is_text(core):
        return tok
    lead = tok[:len(tok) - len(tok.lstrip())]
    trail = tok[len(tok.rstrip()):]
    return lead + tr(core, page) + trail


def walk_json(node, page):
    if isinstance(node, dict):
        out = {}
        for k, v in node.items():
            if isinstance(v, str) and k in JSON_KEYS and is_text(v):
                out[k] = tr(v, page)
            elif k == 'inLanguage' and v == 'es':
                out[k] = 'pt-BR'
            else:
                out[k] = walk_json(v, page)
        return out
    if isinstance(node, list):
        return [walk_json(v, page) for v in node]
    if isinstance(node, str):
        return node.replace(BASE + '/es/', BASE + '/pt-br/')
    return node


def en_literals(rel):
    p = REPO / rel
    if not p.exists():
        return set()
    s = p.read_text(encoding='utf-8')
    lits = set()
    for code in re.findall(r'<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>(.*?)</script>', s, re.S):
        lits.update(l for _, _, l in js_strings(code))
    return lits


def tr_tag(tok, page):
    m = META_TRANS.match(tok)
    if m and is_text(m.group(2)):
        tok = tok.replace('content="%s"' % m.group(2), 'content="%s"' % tr(m.group(2), page), 1)
    for a in TRANS_ATTRS:
        def rep(mm):
            v = mm.group(2)
            return mm.group(1) + (tr(v, page) if is_text(v) else v) + '"'
        tok = re.sub(r'(\s%s=")([^"]*)"' % re.escape(a), rep, tok)
    v = re.search(r'<input[^>]*type="(?:button|submit)"[^>]*value="([^"]*)"', tok)
    if v and is_text(v.group(1)):
        tok = tok.replace('value="%s"' % v.group(1), 'value="%s"' % tr(v.group(1), page), 1)
    return tok


def build(rel):
    page = 'es/' + rel
    s = (REPO / page).read_text(encoding='utf-8')
    en_lits = en_literals(rel)
    out = []
    for tok in TOKEN.split(s):
        if not tok:
            continue
        if tok.startswith('<!--') or tok.startswith('<style'):
            out.append(tok)
        elif tok.startswith('<script'):
            open_tag = re.match(r'<script\b[^>]*>', tok).group(0)
            body = tok[len(open_tag):-len('</script>')]
            if 'ld+json' in open_tag:
                data = walk_json(json.loads(body), page)
                lead = body[:len(body) - len(body.lstrip())]
                trail = body[len(body.rstrip()):]
                body = lead + json.dumps(data, ensure_ascii=False, indent=2).replace('</', '<\\/') + trail
            else:
                pieces, last = [], 0
                for a, b, lit in js_strings(body):
                    pieces.append(body[last:a])
                    pieces.append(lit if lit in en_lits else tr(lit, page))
                    last = b
                pieces.append(body[last:])
                body = ''.join(pieces)
            out.append(open_tag + body + '</script>')
        elif tok.startswith('<'):
            out.append(tr_tag(tok, page))
        else:
            out.append(tr_text(tok, page))
    h = ''.join(out)

    # language, locale and URL rewrites
    h = re.sub(r'<html lang="es"', '<html lang="pt-BR"', h, count=1)
    h = h.replace('data-locale="es"', 'data-locale="pt-BR"')
    h = h.replace('content="es_ES"', 'content="pt_BR"')
    h = h.replace(BASE + '/es/', BASE + '/pt-br/')
    h = re.sub(r'((?:href|action|content)=")/es/', r'\1/pt-br/', h)
    h = re.sub(r'(href=")/es"', r'\1/pt-br/"', h)

    h = h.replace('<!-- <input aria-label="Buscar herramientas" type="file"> -->', '<!-- <input aria-label="Buscar ferramentas" type="file"> -->')

    # hreflang cluster: keep en/ar/es, add pt-BR right after es
    h = re.sub(r'\n<link rel="alternate" hreflang="pt-BR" href="[^"]+">', '', h)
    stem = rel[:-len('index.html')]
    pt_url = f'{BASE}/pt-br/{stem}'
    h = re.sub(r'(<link rel="alternate" hreflang="es" href="[^"]+">)',
               r'\1' + f'\n<link rel="alternate" hreflang="pt-BR" href="{pt_url}">', h, count=1)
    # the es self-alternate was rewritten to /pt-br/ by the URL pass; restore it to /es/
    h = h.replace(f'<link rel="alternate" hreflang="es" href="{pt_url}">',
                  f'<link rel="alternate" hreflang="es" href="{BASE}/es/{stem}">')

    # language selector
    sel = (
        '<details class="language-selector" dir="ltr">\n'
        '  <summary aria-label="Mudar idioma"><span class="language-selector__globe" aria-hidden="true">🌐</span>'
        '<span class="language-selector__label">Português</span></summary>\n'
        '  <div class="language-selector__menu" role="menu" aria-label="Opções de idioma">\n'
        f'    <a href="{BASE}/{stem}" lang="en" hreflang="en" role="menuitem">English</a>\n'
        f'    <a href="{BASE}/ar/{stem}" lang="ar" hreflang="ar" role="menuitem" dir="rtl">العربية</a>\n'
        f'    <a href="{BASE}/es/{stem}" lang="es" hreflang="es" role="menuitem">Español</a>\n'
        f'    <a href="{pt_url}" lang="pt-BR" hreflang="pt-BR" role="menuitem" aria-current="page">Português</a>\n'
        '  </div>\n'
        '</details>'
    )
    h, n = re.subn(r'<details class="language-selector[^>]*>.*?</details>', sel, h, count=1, flags=re.S)
    assert n == 1, rel
    if rel == 'blog/index.html':
        # Portuguese has no news articles (the newsroom publishes en/es/ar only): the hub lists the guides.
        h, n1 = re.subn(r'<header class="editorial-masthead">.*?</header>',
            '<header class="editorial-masthead"><span class="masthead-rule" aria-hidden="true"></span>'
            '<p class="masthead-eyebrow">Convertios <span aria-hidden="true">/</span> Guias</p>'
            '<h1>Blog da Convertios: guias práticos</h1>'
            '<p>Guias para escolher o formato certo, entender o que cada ferramenta faz e conferir o resultado. '
            'As notícias de tecnologia do blog são publicadas em <a href="/blog/" hreflang="en" lang="en">inglês</a> '
            'e em <a href="/es/blog/" hreflang="es" lang="es">espanhol</a>.</p></header>', h, count=1, flags=re.S)
        h, n2 = re.subn(r'<section class="lead-section".*?</section>\s*', '', h, count=1, flags=re.S)
        h, n3 = re.subn(r'<div class="coverage-layout">.*?</aside></div>\s*', '', h, count=1, flags=re.S)
        assert (n1, n2, n3) == (1, 1, 1), (n1, n2, n3)
    dest = REPO / 'pt-br' / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(h, encoding='utf-8')


pages = scope_pages()
for rel in pages:
    build(rel)
print('built', len(pages), 'pages')
if missing:
    print('MISSING', len(missing))
    for p, s in missing[:40]:
        print(' ', p, repr(s[:90]))
    sys.exit(1)
