"""Read-only public SEO crawl. Run with Python 3.11; uses curl for Windows TLS."""
import concurrent.futures as futures
import datetime
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess
import sys
import urllib.parse as url
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'indexing-audit-2026-10-30'
OUT.mkdir(parents=True, exist_ok=True)
BASE = 'https://convertios.com'
NS = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'x': 'http://www.w3.org/1999/xhtml'}

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.canonical, self.alternates, self.links, self.robots = [], {}, [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical.append(a.get('href'))
        if tag == 'link' and a.get('hreflang'): self.alternates[a['hreflang']] = a.get('href')
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag == 'meta' and a.get('name', '').lower() in ('robots', 'googlebot'): self.robots.append(a.get('content', ''))

def fetch(address):
    key = hashlib.sha256(address.encode()).hexdigest()[:20]
    headers, body = OUT / (key + '.headers'), OUT / (key + '.body')
    p = subprocess.run(['curl.exe', '-sS', '--max-time', '40', '--retry', '1', '-D', str(headers), '-o', str(body), '-w', '%{http_code}', address], capture_output=True, text=True)
    h = headers.read_text(encoding='utf-8', errors='replace') if headers.exists() else ''
    text = body.read_text(encoding='utf-8', errors='replace') if body.exists() else ''
    parsed = Page(text)
    hd = {}
    for line in h.splitlines():
        if ':' in line:
            k, v = line.split(':', 1)
            hd[k.lower()] = v.strip()
    result = {'url': address, 'status': int(p.stdout or 0), 'error': p.stderr.strip(), 'location': hd.get('location'), 'canonical': parsed.canonical, 'hreflang': parsed.alternates, 'robots': parsed.robots, 'x_robots_tag': hd.get('x-robots-tag'), 'http_link': hd.get('link'), 'content_type': hd.get('content-type'), 'body_sha256': hashlib.sha256(text.encode()).hexdigest(), 'links': parsed.links}
    if address.endswith(('sitemap.xml', 'robots.txt')): result['body'] = text
    headers.unlink(missing_ok=True)
    body.unlink(missing_ok=True)
    return result

def main():
    sitemap = fetch(BASE + '/sitemap.xml')
    tree = ET.fromstring(sitemap['body'])
    entries = {e.find('s:loc', NS).text: {a.attrib['hreflang']: a.attrib['href'] for a in e.findall('x:link', NS)} for e in tree}
    addresses = set(entries)
    local = {}
    excluded = {'.git', 'node_modules', 'docs', 'tests', 'scripts', 'backend', 'tool-template'}
    for file in ROOT.rglob('index.html'):
        rel = file.relative_to(ROOT)
        if any(p in excluded for p in rel.parts): continue
        address = BASE + '/' + rel.as_posix().removesuffix('index.html')
        parsed = Page(file.read_text(encoding='utf-8'))
        local[address] = {'canonical': parsed.canonical, 'hreflang': parsed.alternates, 'robots': parsed.robots}
        addresses.add(address)
        for link in parsed.links:
            target = url.urljoin(address, link).split('#')[0]
            if url.urlparse(target).netloc == 'convertios.com': addresses.add(target)
    for address in entries:
        addresses.add(address.replace('https:', 'http:'))
        addresses.add(address + 'index.html')
        if address != BASE + '/':
            addresses.add(address.rstrip('/'))
            addresses.add(address.rstrip('/') + '.html')
    addresses.update(BASE + p for p in ['/robots.txt', '/404.html', '/tool-template/', '/audit-nonexistent-20261030/', '/ai-enhance.html', '/9104e249e3ba8e1f263e715ad699c855.txt'])
    for language in ['', 'ar/', 'es/']:
        for slug in ['', 'rotate-pdf/', 'ai-image-enhancer/']:
            addresses.add(BASE + '/' + language + slug + '?utm_source=indexing-audit')
    addresses.update(['https://www.convertios.com/', 'http://www.convertios.com/'])
    rows = [sitemap]
    with futures.ThreadPoolExecutor(max_workers=6) as pool:
        for i, row in enumerate(pool.map(fetch, sorted(addresses)), 1):
            rows.append(row)
            if i % 30 == 0: print(f'{i}/{len(addresses)} checked', flush=True)
    # Also inspect links injected into published HTML (for example email protection).
    seen = {r['url'] for r in rows}
    live_links = {url.urljoin(r['url'], href).split('#')[0] for r in rows if r['url'] in local for href in r['links']}
    live_links = {u for u in live_links - seen if url.urlparse(u).netloc == 'convertios.com'}
    with futures.ThreadPoolExecutor(max_workers=6) as pool: rows.extend(pool.map(fetch, sorted(live_links)))
    # Follow all observed redirect destinations, retaining each hop as its own record.
    for _ in range(5):
        seen = {r['url'] for r in rows}
        targets = {url.urljoin(r['url'], r['location']) for r in rows if r['location']} - seen
        targets = {u for u in targets if url.urlparse(u).netloc in ('convertios.com', 'www.convertios.com')}
        if not targets: break
        with futures.ThreadPoolExecutor(max_workers=6) as pool: rows.extend(pool.map(fetch, sorted(targets)))
    output = {'checked_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'sitemap': entries, 'local': local, 'responses': rows}
    (OUT / 'evidence.json').write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Saved {len(rows)} responses', flush=True)

def report():
    data = json.loads((OUT / 'evidence.json').read_text(encoding='utf-8'))
    rows = {r['url']: r for r in data['responses']}
    sitemap = data['sitemap']
    issues = []
    for address, alternates in sitemap.items():
        r = rows[address]
        for valid, label in [
            (r['status'] == 200, 'HTTP status'),
            (r['canonical'] == [address], 'self canonical'),
            (r['hreflang'] == alternates, 'HTML/sitemap hreflang'),
            (not any('noindex' in x.lower() for x in r['robots'] + [r['x_robots_tag'] or '']), 'indexing directive'),
            (address in data['local'], 'published source'),
        ]:
            if not valid: issues.append(address + ': ' + label)
        for target in alternates.values():
            if target not in sitemap or rows[target]['hreflang'] != alternates:
                issues.append(address + ': hreflang reciprocity ' + target)
    text = ['# Per-URL indexing evidence', '',
            'All Search Console reasons and Google-selected canonicals are unavailable: no URL-level export was supplied. “Eligible” describes observed technical signals, not Google indexing or ranking. Redirect rows show the source canonical separately from the terminal response. No URL here is claimed to belong to a historical exclusion category.', '',
            '| URL | GSC reason | HTTP / terminal | Declared canonical | Google-selected canonical | Sitemap | Eligibility | Classification | Proposed repair |',
            '|---|---|---|---|---|---|---|---|---|']
    for address, r in sorted(rows.items()):
        terminal, seen = r, set()
        while terminal['location'] and terminal['url'] not in seen:
            seen.add(terminal['url'])
            target = url.urljoin(terminal['url'], terminal['location'])
            if target not in rows: break
            terminal = rows[target]
        canonical = ', '.join(r['canonical']) or 'None'
        http = str(r['status'])
        if r['location']: http += ' → ' + str(terminal['status']) + ' ' + terminal['url']
        repair = 'None'
        if '/ai-enhance' in address and '/ai-image-enhancer' not in address:
            eligible, classification = 'No: terminal 404', 'Confirmed broken historical alias; GSC impact unresolved'
            repair = 'Proposed edge 301 to /ai-image-enhancer/; deployment approval required'
        elif '/cdn-cgi/' in address:
            eligible, classification = 'No: 404 endpoint', 'Expected Cloudflare email-protection endpoint; not a content page'
        elif r['status'] == 404 or address.endswith('/404.html'):
            eligible, classification = 'No: 404', 'Intentional missing/internal/error-page control'
        elif r['status'] in (301, 302, 307, 308):
            eligible, classification = 'Source not eligible; target assessed separately', 'Intentional canonical normalization'
        elif any('noindex' in x.lower() for x in r['robots'] + [r['x_robots_tag'] or '']):
            eligible, classification = 'No: noindex', 'Intentional duplicate-directory exclusion'
        elif r['status'] == 200 and r['canonical']:
            eligible, classification = 'Eligible preferred canonical' if r['canonical'] == [address] else 'Duplicate; canonical target preferred', 'No defect observed; historical GSC status unresolved'
        elif r['status'] == 200:
            eligible, classification = 'Not an HTML content candidate', 'Intentional sitemap/robots/verification resource'
        else:
            eligible, classification, repair = 'Unknown', 'Unresolved response', 'Investigate response failure'
        values = [address, 'Unavailable', http, canonical, 'Unavailable', 'Yes' if address in sitemap else 'No', eligible, classification, repair]
        text.append('| ' + ' | '.join(v.replace('|', '\\|') for v in values) + ' |')
    (OUT / 'url-matrix.md').write_text('\n'.join(text) + '\n', encoding='utf-8')
    (OUT / 'validation.json').write_text(json.dumps({'sitemap_urls': len(sitemap), 'responses': len(rows), 'sitemap_signal_issues': issues}, indent=2) + '\n', encoding='utf-8')
    print(f'{len(sitemap)} sitemap pages; {len(issues)} signal issues; {len(rows)} URL records')
    if issues: raise SystemExit(1)

if __name__ == '__main__':
    if '--report-only' not in sys.argv: main()
    report()
