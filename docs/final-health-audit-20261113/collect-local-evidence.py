"""Collect read-only, reproducible source evidence for the final health audit."""
from collections import Counter, defaultdict
from datetime import datetime, timezone
from hashlib import sha256
from html import unescape
from pathlib import Path
import json
import re
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).with_name('evidence.json')
BASE = 'https://convertios.com'
SKIP = {'.git', 'docs', 'tests', 'backend', 'scripts', 'tool-template', 'node_modules'}
pages = sorted(p for p in ROOT.rglob('index.html') if not set(p.relative_to(ROOT).parts) & SKIP)
sitemap = ET.parse(ROOT / 'sitemap.xml').getroot()
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls = [node.text for node in sitemap.findall('s:url/s:loc', ns)]

titles = defaultdict(list)
descriptions = defaultdict(list)
noindex = []
asset_stamp_mismatches = Counter()
git_blob_stamp_mismatches = Counter()
line_ending_only_mismatches = Counter()
asset_missing = []
href_re = re.compile(r'(?:href|src)="(/[A-Za-z0-9_./-]+\.(?:css|js))(?:\?v=([A-Za-z0-9]+))?"')
for page in pages:
    source = page.read_text(encoding='utf-8')
    rel = page.relative_to(ROOT).as_posix()
    title = re.search(r'<title[^>]*>(.*?)</title>', source, re.I | re.S)
    description = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', source, re.I)
    robots = re.search(r'<meta\s+name="robots"\s+content="([^"]*)"', source, re.I)
    if robots and 'noindex' in robots.group(1).lower():
        noindex.append(rel)
    if title:
        titles[unescape(title.group(1)).strip()].append(rel)
    if description:
        descriptions[unescape(description.group(1)).strip()].append(rel)
    for match in href_re.finditer(source):
        asset = ROOT / match.group(1).lstrip('/')
        if not asset.is_file():
            asset_missing.append({'page': rel, 'asset': match.group(1)})
            continue
        expected = sha256(asset.read_bytes()).hexdigest()[:8]
        if match.group(2) != expected:
            asset_stamp_mismatches[(match.group(1), match.group(2) or '', expected)] += 1
            blob = subprocess.check_output([
                'git', '-c', f'safe.directory={ROOT.as_posix()}', 'show',
                f'HEAD:{asset.relative_to(ROOT).as_posix()}'
            ], cwd=ROOT)
            blob_hash = sha256(blob).hexdigest()[:8]
            if match.group(2) != blob_hash:
                git_blob_stamp_mismatches[(match.group(1), match.group(2) or '', blob_hash)] += 1
            elif asset.read_bytes().replace(b'\r\n', b'\n') == blob:
                line_ending_only_mismatches[match.group(1)] += 1

prior_path = ROOT / 'docs/indexing-recovery-20261112/live-http.json'
prior = json.loads(prior_path.read_text(encoding='utf-8'))
prior_pages = prior['pages']
prior_summary = {
    'source': prior_path.relative_to(ROOT).as_posix(),
    'checked_at': prior['checked_at'],
    'page_count': len(prior_pages),
    'sitemap_url_set_matches_local': {p['url'] for p in prior_pages} == set(urls),
    'status_200': sum(p['status'] == 200 for p in prior_pages),
    'self_canonical': sum(p['canonical'] == [p['url']] for p in prior_pages),
    'unexpected_noindex': sum('noindex' in (p['robots'] + ' ' + p['x_robots_tag']).lower() for p in prior_pages),
    'problems': prior['problems'],
}

report = {
    'collected_at': datetime.now(timezone.utc).isoformat(),
    'source_baseline': subprocess.check_output([
        'git', '-c', f'safe.directory={ROOT.as_posix()}', 'merge-base', 'origin/main', 'HEAD'
    ], cwd=ROOT, text=True).strip(),
    'scope': 'Local source inventory plus summary of separately timestamped prior production HTTP evidence; no fresh production fetch',
    'canonical_sitemap_urls': urls,
    'sitemap_url_count': len(urls),
    'sitemap_unique_url_count': len(set(urls)),
    'local_html_index_count': len(pages),
    'local_noindex_pages': noindex,
    'duplicate_titles': {key: value for key, value in titles.items() if len(value) > 1},
    'duplicate_descriptions': {key: value for key, value in descriptions.items() if len(value) > 1},
    'missing_local_css_js_assets': asset_missing,
    'asset_stamp_mismatches': [
        {'asset': asset, 'actual_stamp': actual, 'expected_stamp': expected, 'references': count}
        for (asset, actual, expected), count in sorted(asset_stamp_mismatches.items())
    ],
    'git_blob_stamp_mismatches': [
        {'asset': asset, 'actual_stamp': actual, 'git_blob_hash': expected, 'references': count}
        for (asset, actual, expected), count in sorted(git_blob_stamp_mismatches.items())
    ],
    'working_tree_line_ending_only_stamp_mismatches': dict(sorted(line_ending_only_mismatches.items())),
    'prior_production_http': prior_summary,
}
OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({
    'sitemap_urls': len(urls), 'local_pages': len(pages), 'local_noindex': noindex,
    'duplicate_titles': len(report['duplicate_titles']), 'duplicate_descriptions': len(report['duplicate_descriptions']),
    'missing_css_js': len(asset_missing), 'working_tree_stamp_mismatches': sum(asset_stamp_mismatches.values()),
    'git_blob_stamp_mismatches': sum(git_blob_stamp_mismatches.values()),
    'line_ending_only_mismatches': sum(line_ending_only_mismatches.values()),
    'prior_production_http': prior_summary,
}, ensure_ascii=False))
