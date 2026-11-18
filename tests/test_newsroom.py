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

TODAY = date(2026, 11, 20)


def fixture():
    sources = [
        {"id": "source-a", "url": "https://www.w3.org/news/example", "title": "Synthetic event specification", "source_date": "2026-11-19", "publisher": "www.w3.org", "context": "standards", "license_context": "Research only", "text": "Synthetic evidence " * 100},
        {"id": "source-b", "url": "https://pdfa.org/example", "title": "Synthetic event corroboration", "source_date": "2026-11-19", "publisher": "pdfa.org", "context": "pdf", "license_context": "Research only", "text": "Synthetic evidence " * 100},
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
        versions[lang] = {"cover_alt": "Conceptual illustration of the synthetic specification.", "title": f"Synthetic fictional rendering example for {lang}", "description": f"A fictional fixture description used only for offline testing of the draft newsroom renderer ({lang}).", "dek": "A fictional fixture summary used only to test the multilingual news article page layout.", "sections": sections, "tools": [prefix + "pdf-to-word/", prefix + "pdf-to-jpg/"], "related_slug": "pdf-brotli-2026"}
    plan = {"stories": [{"event_id": "synthetic-rendering-test", "topic": "pdf-documents", "event_date": "2026-11-19", "status": "draft", "source_ids": ["source-a", "source-b"], "versions": versions}]}
    return {"generated_utc": TODAY.isoformat(), "sources": sources, "failures": []}, plan


class NewsroomTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        # A minimal checkout: library sources and templates, the sitemap, every localized tool page
        # (the library reads tool names from them) and the currently generated blog pages.
        shutil.copytree(newsroom.ROOT / "content", self.root / "content")
        shutil.copyfile(newsroom.ROOT / "sitemap.xml", self.root / "sitemap.xml")
        shutil.copytree(newsroom.ROOT / "assets/blog/covers", self.root / "assets/blog/covers")
        shutil.copytree(newsroom.ROOT / "assets/blog/editorial", self.root / "assets/blog/editorial")
        for lang in newsroom.LANGS:
            base = newsroom.ROOT / newsroom.PREFIX[lang]
            for page in base.glob("*/index.html"):
                if page.parent.name not in {"blog", "es", "ar", "pt-br"}:
                    target = self.root / page.relative_to(newsroom.ROOT)
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(page, target)
            shutil.copytree(base / "blog", self.root / newsroom.PREFIX[lang] / "blog")
        for asset in (self.root / "assets/blog/editorial").glob("merge-pdf-files-*"):
            destination = asset.with_name(asset.name.replace("merge-pdf-files", "synthetic-rendering-test-20261119"))
            shutil.copyfile(asset, destination)
        self.intake, self.plan = fixture()

    def test_zero_stories_changes_nothing(self):
        before = (self.root / "sitemap.xml").read_bytes()
        self.assertEqual(newsroom.render({"stories": []}, self.intake, TODAY, self.root), [])
        self.assertEqual((self.root / "sitemap.xml").read_bytes(), before)

    def test_one_story_renders_four_languages_through_the_library(self):
        changed = newsroom.render(self.plan, self.intake, TODAY, self.root)
        slug = "synthetic-rendering-test-20261119"
        self.assertIn(f"content/blog/{slug}.md", changed)
        self.assertIn("sitemap.xml", changed)
        source = (self.root / "content/blog" / f"{slug}.md").read_text(encoding="utf-8")
        self.assertIn("type: news", source)
        self.assertIn("category: pdf-documents", source)
        for lang in newsroom.LANGS:
            prefix = newsroom.PREFIX[lang]
            self.assertIn(f"{prefix}blog/{slug}/index.html", changed)
            self.assertIn(f"{prefix}blog/index.html", changed)  # newest-first listing now leads with the story
            page = (self.root / prefix / "blog" / slug / "index.html").read_text(encoding="utf-8")
            hub = (self.root / prefix / "blog/index.html").read_text(encoding="utf-8")
            self.assertIn(f'<link rel="canonical" href="{newsroom.url_for(lang, slug)}">', page)
            for alt in newsroom.LANGS:
                self.assertIn(f'href="{newsroom.url_for(alt, slug)}"', page)
            self.assertIn('"datePublished": "2026-11-20"', page)
            self.assertIn('"@type": "NewsArticle"', page)
            self.assertIn("https://pdfa.org/example", page)
            self.assertIn(f"/{prefix}blog/{slug}/", hub)
            self.assertIn(f'href="/{prefix}pdf-to-word/"', page)
        sitemap = (self.root / "sitemap.xml").read_text(encoding="utf-8")
        ET.fromstring(sitemap)
        for lang in newsroom.LANGS:
            self.assertIn(newsroom.url_for(lang, slug), sitemap)
        self.assertIn("Synthetic fictional rendering example", (self.root / "blog" / slug / "index.html").read_text(encoding="utf-8"))
        # Existing articles are never rewritten by a news run.
        self.assertFalse([p for p in changed if p.endswith("/index.html") and "/blog/" + slug not in "/" + p
                          and not __import__("re").search(r"blog/(?:index\.html|page/|category/)", p)])

    def test_rejects_markdown_and_mismatched_translations(self):
        injected = copy.deepcopy(self.plan)
        injected["stories"][0]["versions"]["es"]["sections"][0]["paragraphs"][0]["text"] = "## Heading injection " + "x" * 90
        with self.assertRaisesRegex(ValueError, "prose"):
            newsroom.validate(injected, self.intake, TODAY, self.root)
        mismatched = copy.deepcopy(self.plan)
        mismatched["stories"][0]["versions"]["ar"]["related_slug"] = "pdf-html-1-2-2026"
        with self.assertRaisesRegex(ValueError, "same tools"):
            newsroom.validate(mismatched, self.intake, TODAY, self.root)
        missing = copy.deepcopy(self.plan)
        del missing["stories"][0]["versions"]["pt-br"]
        with self.assertRaisesRegex(ValueError, "four translations"):
            newsroom.validate(missing, self.intake, TODAY, self.root)

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
        feed = b'<rss><channel><item><title>Entirely synthetic specification announcement</title><link>https://www.w3.org/news/example</link><pubDate>Thu, 19 Nov 2026 12:00:00 GMT</pubDate></item></channel></rss>'
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
        changed = set(newsroom.render(self.plan, self.intake, TODAY, self.root))
        slug = "synthetic-rendering-test-20261119"
        new = {p for p in changed if slug in p}
        tracked = changed - new
        self.assertEqual(guard.check_paths(tracked, new, self.root), [])
        self.assertTrue(guard.check_paths(tracked | {"scripts/newsroom.py"}, new, self.root))
        self.assertTrue(guard.check_paths(tracked | {"blog/pdf-brotli-2026/index.html"}, new, self.root))
        self.assertTrue(guard.check_paths(tracked | {"content/blog/pdf-brotli-2026.md"}, new, self.root))
        self.assertTrue(guard.check_paths(tracked, new | {".github/workflows/evil.yml"}, self.root))
        self.assertTrue(guard.check_paths(tracked, new | {"blog/not-a-news-slug/index.html"}, self.root))


if __name__ == "__main__":
    unittest.main()
