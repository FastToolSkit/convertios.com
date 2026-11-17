"""Collect every translatable Spanish string in the in-scope /es/ pages."""
import json
import re
from collections import OrderedDict
from ptlib import REPO, WORK, scope_pages, TOKEN, TRANS_ATTRS, META_TRANS, JSON_KEYS, is_text, js_strings

found = OrderedDict()


def add(s, page, kind):
    if s not in found:
        found[s] = {'pages': set(), 'kind': kind}
    found[s]['pages'].add(page)


def walk_json(node, page):
    if isinstance(node, dict):
        for k, v in node.items():
            if isinstance(v, str) and k in JSON_KEYS and is_text(v):
                add(v, page, 'jsonld')
            else:
                walk_json(v, page)
    elif isinstance(node, list):
        for v in node:
            walk_json(v, page)


def en_literals(rel):
    p = REPO / rel
    if not p.exists():
        return set()
    s = p.read_text(encoding='utf-8')
    lits = set()
    for code in re.findall(r'<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>(.*?)</script>', s, re.S):
        lits.update(l for _, _, l in js_strings(code))
    return lits


for rel in scope_pages():
    page = 'es/' + rel
    s = (REPO / page).read_text(encoding='utf-8')
    en_lits = en_literals(rel)
    for tok in TOKEN.split(s):
        if not tok:
            continue
        if tok.startswith('<!--') or tok.startswith('<style'):
            continue
        if tok.startswith('<script'):
            body = re.sub(r'^<script\b[^>]*>|</script>$', '', tok)
            if 'ld+json' in tok[:80]:
                walk_json(json.loads(body), page)
            else:
                for _, _, lit in js_strings(body):
                    if lit not in en_lits:
                        add(lit, page, 'js')
            continue
        if tok.startswith('<'):
            m = META_TRANS.match(tok)
            if m and is_text(m.group(2)):
                add(m.group(2), page, 'meta')
            for a in TRANS_ATTRS:
                for v in re.findall(r'\s%s="([^"]*)"' % re.escape(a), tok):
                    if is_text(v):
                        add(v, page, 'attr')
            v = re.search(r'<input[^>]*type="(?:button|submit)"[^>]*value="([^"]*)"', tok)
            if v and is_text(v.group(1)):
                add(v.group(1), page, 'attr')
            continue
        if is_text(tok):
            add(tok.strip(), page, 'text')

out = [{'es': k, 'kind': v['kind'], 'n': len(v['pages']), 'first': sorted(v['pages'])[0]} for k, v in found.items()]
(WORK / 'strings.json').write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
print(len(out), 'unique strings;', sum(len(x['es']) for x in out), 'chars')
from collections import Counter
print(Counter(x['kind'] for x in out))
