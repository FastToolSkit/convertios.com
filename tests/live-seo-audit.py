"""Read-only HTTP audit of every sitemap page; no Google indexing claims.

Run: python tests/live-seo-audit.py --output <private-report.json>
Checks server-rendered signals without executing page JavaScript.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
from pathlib import Path
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser
import xml.etree.ElementTree as ET

BASE = 'https://convertios.com/'


class Signals(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.canonical, self.alternates, self.links = [], {}, []
        self.robots, self.lang, self.direction = '', '', ''
        self.h1 = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html':
            self.lang, self.direction = a.get('lang', ''), a.get('dir', '')
        if tag == 'h1':
            self.h1 += 1
        if tag == 'meta' and a.get('name', '').lower() in ('robots', 'googlebot'):
            self.robots += ' ' + a.get('content', '').lower()
        if tag == 'link':
            rel = a.get('rel', '').lower().split()
            if 'canonical' in rel:
                self.canonical.append(a.get('href', ''))
            if 'alternate' in rel and 'hreflang' in a:
                self.alternates[a['hreflang']] = a.get('href', '')
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'ConvertiosReadOnlyAudit/1.0'})
    try:
        response = urllib.request.build_opener(NoRedirect).open(request, timeout=25)
    except urllib.error.HTTPError as error:
        response = error
    except (urllib.error.URLError, OSError) as error:
        return {'url': url, 'status': None, 'error': str(error)}, ''
    with response:
        return {'url': url, 'status': response.code,
                'location': response.headers.get('Location'),
                'x_robots_tag': response.headers.get('X-Robots-Tag', '')}, response.read().decode('utf-8', errors='replace')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True)
    parser.add_argument('--check-url', action='append', default=[], help='Additional same-origin URL to record, e.g. a legacy alias')
    args = parser.parse_args()
    sitemap_result, xml = fetch(BASE + 'sitemap.xml')
    if sitemap_result['status'] != 200:
        raise SystemExit(f'Sitemap unavailable: {sitemap_result}')
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = [e.text for e in ET.fromstring(xml).findall('s:url/s:loc', ns)]
    if not urls or any(not url.startswith(BASE) for url in urls + args.check_url):
        raise SystemExit('Refusing empty sitemap or URLs outside the audited origin')
    robots_result, robots_text = fetch(BASE + 'robots.txt')
    robots = urllib.robotparser.RobotFileParser()
    robots.parse(robots_text.splitlines())
    problems, rows, parsed = [], [], {}
    if len(urls) != len(set(urls)):
        problems.append({'type': 'duplicate-sitemap-urls'})
    if robots_result['status'] != 200:
        problems.append({'type': 'robots-unavailable', **robots_result})
    with ThreadPoolExecutor(max_workers=4) as pool:
        for row, body in pool.map(fetch, urls):
            url = row['url']
            signals = Signals()
            signals.feed(body)
            row.update(canonical=signals.canonical, alternates=signals.alternates,
                       robots=signals.robots.strip(), lang=signals.lang, direction=signals.direction,
                       h1=signals.h1, allowed_googlebot=robots.can_fetch('Googlebot', url))
            parsed[url] = signals
            rows.append(row)
            checks = {
                'status': row['status'] == 200,
                'self-canonical': signals.canonical == [url],
                'indexable': not any(x in (signals.robots + ' ' + row.get('x_robots_tag', '')).lower().replace(',', ' ').split() for x in ('noindex', 'none')),
                'robots-allowed': row['allowed_googlebot'],
                'one-h1': signals.h1 == 1,
                'normalized-url': url.startswith(BASE) and url.endswith('/') and not urllib.parse.urlsplit(url).query,
            }
            lang = 'ar' if '/ar/' in url else 'es' if '/es/' in url else 'en'
            checks['language'] = signals.lang.split('-')[0] == lang
            checks['rtl'] = lang != 'ar' or signals.direction == 'rtl'
            for check, ok in checks.items():
                if not ok:
                    problems.append({'url': url, 'type': check})
    sitemap_set = set(urls)
    inbound = {url: set() for url in urls}
    extra = {}
    for url, signals in parsed.items():
        for lang in ('en', 'es', 'ar', 'x-default'):
            target = signals.alternates.get(lang)
            if target not in parsed or parsed[target].alternates != signals.alternates:
                problems.append({'url': url, 'type': 'hreflang-reciprocity', 'language': lang, 'target': target})
        for href in signals.links:
            target = urllib.parse.urldefrag(urllib.parse.urljoin(url, href))[0]
            if target in inbound and target != url:
                inbound[target].add(url)
            elif target.startswith(BASE) and target not in sitemap_set:
                extra.setdefault(target, set()).add(url)
    with ThreadPoolExecutor(max_workers=4) as pool:
        extra_rows = [row for row, _ in pool.map(fetch, sorted(extra))]
    for row in extra_rows:
        row['source_urls'] = sorted(extra[row['url']])
        if row['status'] is None or row['status'] >= 400:
            problems.append({'type': 'internal-link-target', **row})
    for row in rows:
        row['inbound_pages'] = len(inbound[row['url']])
        if not row['inbound_pages']:
            problems.append({'url': row['url'], 'type': 'no-inbound-sitemap-page-links'})
    with ThreadPoolExecutor(max_workers=4) as pool:
        additional = [row for row, _ in pool.map(fetch, args.check_url)]
    report = {'checked_at': datetime.now(timezone.utc).isoformat(),
              'scope': 'HTTP sitemap audit, not Google live inspection or Core Web Vitals',
              'robots': robots_result, 'robots_text': robots_text, 'sitemap': sitemap_result,
              'pages': rows, 'extra_link_targets': extra_rows, 'additional_urls': additional, 'problems': problems}
    Path(args.output).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'pages': len(rows), 'extra_targets': len(extra_rows), 'problems': problems}, ensure_ascii=False))
    raise SystemExit(bool(problems))


if __name__ == '__main__':
    main()
