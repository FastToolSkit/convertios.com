"""Regression checks for the ten generator-owned utility SEO guides."""
from hashlib import sha256
from html import unescape
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import sys
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
spec = importlib.util.spec_from_file_location('build_utility_tools', ROOT / 'scripts/build-utility-tools.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)
from utility_seo_content import SEO_CONTENT

LANG_PATH = {'en': '', 'es': 'es/', 'ar': 'ar/', 'pt-BR': 'pt-br/'}
SITEMAP_NS = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9',
              'x': 'http://www.w3.org/1999/xhtml'}
BASELINE_504_URL_DATES = 'c6708c9c14b96554957bfdef601d7738aa4f8b9a59aa64694117267c4a524dff'


def attr(html, expression):
    match = re.search(expression, html)
    if not match:
        raise AssertionError(expression)
    return unescape(match.group(1))


class UtilitySEOTests(unittest.TestCase):
    def test_copy_and_generated_metadata(self):
        self.assertEqual(len(SEO_CONTENT), 10)
        descriptions = []
        titles = []
        for slug, languages in SEO_CONTENT.items():
            self.assertEqual(set(languages), set(LANG_PATH))
            for lang, seo in languages.items():
                with self.subTest(slug=slug, lang=lang):
                    page = (ROOT / LANG_PATH[lang] / slug / 'index.html').read_text('utf-8')
                    self.assertLessEqual(len(seo['title'] + ' | Convertios'), 65)
                    titles.append(seo['title'])
                    self.assertGreaterEqual(len(seo['description']), 105)
                    self.assertLessEqual(len(seo['description']), 170)
                    descriptions.append(seo['description'])
                    self.assertEqual(attr(page, r'<title>(.*?)</title>'), seo['title'] + ' | Convertios')
                    meta = attr(page, r'<meta name="description" content="([^"]*)"')
                    og = attr(page, r'<meta property="og:description" content="([^"]*)"')
                    self.assertEqual(meta, seo['description'])
                    self.assertEqual(og, meta)
                    self.assertNotRegex(page, r'Ã.|Â.|Ø.|Ù.')
                    self.assertIn(f'<html lang="{lang}" dir="{"rtl" if lang == "ar" else "ltr"}">', page)
                    self.assertEqual(attr(page, r'<link rel="canonical" href="([^"]+)"'), builder.url(lang, slug))
                    for alt_lang in [*LANG_PATH, 'x-default']:
                        self.assertIn(f'hreflang="{alt_lang}" href="{builder.url(alt_lang if alt_lang != "x-default" else "en", slug)}"', page)
                    schema = json.loads(attr(page, r'<script type="application/ld\+json">(.*?)</script>'))
                    app, crumb = schema['@graph']
                    self.assertEqual(app['@type'], 'WebApplication')
                    self.assertEqual(app['description'], meta)
                    self.assertEqual(app['url'], builder.url(lang, slug))
                    self.assertEqual(crumb['@type'], 'BreadcrumbList')
                    self.assertEqual(page.count('<li>'), len(seo['steps']))
                    for step in seo['steps']:
                        self.assertIn(step, unescape(page))
                    for paragraph in (seo['example'], seo['output'], *seo['faq']):
                        self.assertIn(paragraph, unescape(page))
                    self.assertEqual(page.count('<details class="smart-faq">'), 2)
                    directory = (ROOT / LANG_PATH[lang] / 'all-tools/index.html').read_text('utf-8')
                    self.assertIn(f'<h3>{seo["title"]}</h3><p>{seo["description"]}</p>', unescape(directory))
        self.assertEqual(len(set(descriptions)), 40)
        self.assertEqual(len(set(titles)), 40)

    def test_metadata_is_escaped_in_html_and_schema(self):
        original = SEO_CONTENT['regex-tester']['en']
        SEO_CONTENT['regex-tester']['en'] = {**original, 'title': 'A & B <C>',
                                             'description': 'An "example" & <tag> in metadata.'}
        try:
            rendered = builder.render('regex-tester', 'en')
        finally:
            SEO_CONTENT['regex-tester']['en'] = original
        self.assertIn('<title>A &amp; B &lt;C&gt; | Convertios</title>', rendered)
        self.assertIn('content="An &quot;example&quot; &amp; &lt;tag&gt; in metadata."', rendered)
        schema = json.loads(attr(rendered, r'<script type="application/ld\+json">(.*?)</script>'))
        self.assertEqual(schema['@graph'][0]['description'], 'An "example" & <tag> in metadata.')
        self.assertNotIn('</script><tag>', rendered)

    def test_sitemap_and_indexnow_manifest_are_exact(self):
        root = ET.parse(ROOT / 'sitemap.xml').getroot()
        entries = root.findall('s:url', SITEMAP_NS)
        self.assertEqual(len(entries), 544)
        expected = {builder.url(lang, slug) for slug in SEO_CONTENT for lang in LANG_PATH}
        changed = {}
        all_urls = set()
        retained = []
        for entry in entries:
            loc = entry.findtext('s:loc', namespaces=SITEMAP_NS)
            self.assertNotIn(loc, all_urls)
            all_urls.add(loc)
            lastmod = entry.findtext('s:lastmod', namespaces=SITEMAP_NS)
            if lastmod == '2026-11-19':
                changed[loc] = entry
            if loc in expected:
                self.assertEqual(lastmod, '2026-11-19')
                links = {(link.attrib['hreflang'], link.attrib['href'])
                         for link in entry.findall('x:link', SITEMAP_NS)}
                slug = loc.rstrip('/').split('/')[-1]
                self.assertEqual(links, {(lang, builder.url(lang, slug)) for lang in LANG_PATH} |
                                 {('x-default', builder.url('en', slug))})
            else:
                retained.append((loc, lastmod or ''))
        self.assertEqual(set(changed), expected)
        self.assertEqual(len(all_urls - expected), 504)
        retained_digest = sha256('\n'.join(url + '|' + date for url, date in sorted(retained)).encode()).hexdigest()
        self.assertEqual(retained_digest, BASELINE_504_URL_DATES)
        manifest = (ROOT / 'docs/utility-batch2-indexnow-urls-20261119.txt').read_text('utf-8').splitlines()
        self.assertEqual(len(manifest), 40)
        self.assertEqual(set(manifest), expected)

    def test_generator_is_idempotent(self):
        targets = [ROOT / LANG_PATH[lang] / slug / 'index.html'
                   for slug in SEO_CONTENT for lang in LANG_PATH]
        targets += [ROOT / LANG_PATH[lang] / name / 'index.html'
                    for lang in LANG_PATH for name in ('all-tools', '')]
        targets += [ROOT / 'sitemap.xml', ROOT / 'docs/utility-batch2-indexnow-urls-20261119.txt']
        before = {path: sha256(path.read_bytes()).digest() for path in targets}
        subprocess.run([sys.executable, str(ROOT / 'scripts/build-utility-tools.py')],
                       cwd=ROOT, check=True)
        self.assertEqual(before, {path: sha256(path.read_bytes()).digest() for path in targets})


if __name__ == '__main__':
    unittest.main()
