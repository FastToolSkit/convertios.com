"""Offline, synthetic tests for the draft-only newsroom pipeline."""
import copy
from datetime import date
import importlib.util
import json
from pathlib import Path
import shutil
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import newsroom

guard_spec = importlib.util.spec_from_file_location("newsroom_guard", Path(__file__).resolve().parents[1] / ".github/newsroom/guard.py")
guard = importlib.util.module_from_spec(guard_spec)
guard_spec.loader.exec_module(guard)

TODAY = date(2026, 11, 14)


def fixture():
    sources = [
        {"id": "source-a", "url": "https://www.w3.org/news/example", "title": "Synthetic event specification", "source_date": "2026-11-13", "publisher": "www.w3.org", "context": "standards", "license_context": "Research only", "text": "Synthetic evidence " * 100},
        {"id": "source-b", "url": "https://pdfa.org/example", "title": "Synthetic event corroboration", "source_date": "2026-11-13", "publisher": "pdfa.org", "context": "pdf", "license_context": "Research only", "text": "Synthetic evidence " * 100},
    ]
    versions = {}
    for lang in newsroom.LANGS:
        prefix = "/" if lang == "en" else f"/{lang}/"
        sections = []
        for section in range(5):
            paragraphs = []
            for index in range(2):
                number = section * 2 + index
                text = f"Synthetic fixture paragraph {number} describes a fictional event only for deterministic offline tests. " + "This example explains how a proposed article keeps page structure and source links while using harmless synthetic words. " * 3
                paragraphs.append({"text": text, "evidence": ["source-a", "source-b"]})
            sections.append({"paragraphs": paragraphs})
        versions[lang] = {"title": f"Synthetic fictional rendering example for {lang}", "description": "A fictional fixture description used only for offline testing of the draft newsroom renderer.", "dek": "A fictional fixture summary used only to test the multilingual news article page layout.", "sections": sections, "tools": [prefix + "pdf-to-word/", prefix + "pdf-to-jpg/"], "related_slug": "pdf-brotli-2026"}
    plan = {"stories": [{"event_id": "synthetic-rendering-test", "topic": "pdf-documents", "event_date": "2026-11-13", "status": "draft", "source_ids": ["source-a", "source-b"], "versions": versions}]}
    return {"generated_utc": TODAY.isoformat(), "sources": sources, "failures": []}, plan


class NewsroomTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for lang in newsroom.LANGS:
            prefix = Path() if lang == "en" else Path(lang)
            for relative in (Path("blog/pdf-brotli-2026/index.html"), Path("blog/index.html")):
                source = newsroom.ROOT / prefix / relative
                target = self.root / prefix / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, target)
            for tool in ("pdf-to-word", "pdf-to-jpg"):
                target = self.root / prefix / tool / "index.html"
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text("fixture", encoding="utf-8")
        shutil.copyfile(newsroom.ROOT / "sitemap.xml", self.root / "sitemap.xml")
        self.intake, self.plan = fixture()

    def test_zero_stories_changes_nothing(self):
        before = (self.root / "sitemap.xml").read_bytes()
        self.assertEqual(newsroom.render({"stories": []}, self.intake, TODAY, self.root), [])
        self.assertEqual((self.root / "sitemap.xml").read_bytes(), before)

    def test_one_story_renders_three_languages_and_hubs(self):
        changed = newsroom.render(self.plan, self.intake, TODAY, self.root)
        self.assertEqual(len(changed), 7)
        slug = "synthetic-rendering-test-20261113"
        for lang in newsroom.LANGS:
            prefix = "" if lang == "en" else lang + "/"
            page = (self.root / prefix / "blog" / slug / "index.html").read_text(encoding="utf-8")
            hub = (self.root / prefix / "blog/index.html").read_text(encoding="utf-8")
            self.assertIn(f'<link rel="canonical" href="{newsroom.url_for(lang, slug)}">', page)
            for alt in newsroom.LANGS:
                self.assertIn(f'hreflang="{alt}" href="{newsroom.url_for(alt, slug)}"', page)
            self.assertIn('"datePublished": "2026-11-14"', page)
            self.assertIn('"inLanguage": "' + lang + '"', page)
            self.assertIn("https://pdfa.org/example", page)
            self.assertIn(slug, hub)
            self.assertIn(f'href="/{prefix}pdf-to-word/"', page)
        sitemap = (self.root / "sitemap.xml").read_text(encoding="utf-8")
        ET.fromstring(sitemap)
        for lang in newsroom.LANGS:
            self.assertIn(newsroom.url_for(lang, slug), sitemap)
        self.assertIn("Synthetic fictional rendering example", (self.root / "blog" / slug / "index.html").read_text(encoding="utf-8"))

    def test_rejects_stale_event_and_missing_independent_source(self):
        stale = copy.deepcopy(self.plan)
        stale["stories"][0]["event_date"] = "2026-10-01"
        with self.assertRaisesRegex(ValueError, "stale"):
            newsroom.validate(stale, self.intake, TODAY, self.root)
        same_domain = copy.deepcopy(self.intake)
        same_domain["sources"][1]["publisher"] = "www.w3.org"
        same_domain["sources"][1]["url"] = "https://www.w3.org/news/other-example"
        with self.assertRaisesRegex(ValueError, "independent"):
            newsroom.validate(self.plan, same_domain, TODAY, self.root)

    def test_rejects_duplicate_and_unsafe_source_urls(self):
        duplicate = copy.deepcopy(self.plan)
        duplicate["stories"] *= 2
        with self.assertRaises(ValueError):
            newsroom.validate(duplicate, self.intake, TODAY, self.root)
        for url in ("http://pdfa.org/example", "https://evil.example/news", "https://pdfa.org/../../secret", "https://pdfa.org@evil.example/news"):
            with self.subTest(url=url), self.assertRaises(ValueError):
                newsroom.canonical_url(url)

    def test_rejects_copied_source_passage(self):
        copied = copy.deepcopy(self.plan)
        copied["stories"][0]["versions"]["en"]["sections"][0]["paragraphs"][0]["text"] = "Synthetic evidence " * 15
        with self.assertRaisesRegex(ValueError, "copied"):
            newsroom.validate(copied, self.intake, TODAY, self.root)

    def test_collect_offline_feed_and_published_dedupe(self):
        feed = b'<rss><channel><item><title>Entirely synthetic specification announcement</title><link>https://www.w3.org/news/example</link><pubDate>Fri, 13 Nov 2026 12:00:00 GMT</pubDate></item></channel></rss>'
        page = b'<html><body><main><p>' + b'Synthetic official page. ' * 30 + b'</p></main></body></html>'
        def fake_fetch(url):
            if url in {item[0] for item in newsroom.FEEDS.values()}:
                return feed
            return page
        result = newsroom.collect(TODAY, self.root, fake_fetch)
        self.assertEqual(len(result["sources"]), 1)
        self.assertEqual(result["sources"][0]["url"], "https://www.w3.org/news/example")
        (self.root / "blog/pdf-brotli-2026/index.html").write_text('<a href="https://www.w3.org/news/example">old</a>', encoding="utf-8")
        self.assertEqual(newsroom.collect(TODAY, self.root, fake_fetch)["sources"], [])

    def test_pr_guard_rejects_code_and_existing_articles(self):
        slug = "synthetic-rendering-test-20261113"
        newsroom.render(self.plan, self.intake, TODAY, self.root)
        new_pages = {f"{'' if lang == 'en' else lang + '/'}blog/{slug}/index.html" for lang in newsroom.LANGS}
        hubs = {f"{'' if lang == 'en' else lang + '/'}blog/index.html" for lang in newsroom.LANGS} | {"sitemap.xml"}
        self.assertEqual(guard.check_paths(hubs, new_pages, self.root), [])
        self.assertTrue(guard.check_paths(hubs | {"scripts/newsroom.py"}, new_pages, self.root))
        self.assertTrue(guard.check_paths(hubs | {"blog/pdf-brotli-2026/index.html"}, new_pages, self.root))
        self.assertTrue(guard.check_paths(hubs, new_pages | {".github/workflows/evil.yml"}, self.root))


if __name__ == "__main__":
    unittest.main()
