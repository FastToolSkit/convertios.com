"""Offline tests for the Content Library generator (scripts/content_library.py)."""
import importlib.util
import math
from pathlib import Path
import re
import shutil
import sys
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("content_library", REPO / "scripts/content_library.py")
lib = importlib.util.module_from_spec(spec)
sys.modules["content_library"] = lib
spec.loader.exec_module(lib)


def synthetic(source: str, n: int, status: str = "published") -> str:
    """A unique copy of an existing topic, dated after everything already published."""
    text = re.sub(r"^published: .*$", "published: 2030-01-01", source, count=1, flags=re.M)
    text = re.sub(r"^order: .*$", f"order: {900 + n}", text, count=1, flags=re.M)
    text = re.sub(r"^status: .*$", f"status: {status}", text, count=1, flags=re.M)
    text = re.sub(r"^(title|seo_title): (.*)$", lambda m: f"{m.group(1)}: Synthetic {n} {m.group(2)}"[:110], text, flags=re.M)
    return re.sub(r"^description: (.*)$", lambda m: f"description: Synthetic test copy {n}. {m.group(1)}"[:165], text, flags=re.M)


class ContentLibraryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        shutil.copytree(REPO / "content", self.root / "content")
        shutil.copyfile(REPO / "sitemap.xml", self.root / "sitemap.xml")
        for lang in lib.LANGS:
            for page in (REPO / lib.PREFIX[lang]).glob("*/index.html"):
                if page.parent.name not in {"blog", "es", "ar", "pt-br"}:
                    target = self.root / page.relative_to(REPO)
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(page, target)
        lib.set_root(self.root)
        self.addCleanup(lib.set_root, REPO)
        self.base = (self.root / "content/blog/merge-pdf-files.md").read_text(encoding="utf-8")

    def add(self, count, status="published"):
        for n in range(count):
            (self.root / f"content/blog/synthetic-test-{n}.md").write_text(synthetic(self.base, n, status), encoding="utf-8")

    def test_repository_output_is_in_sync(self):
        lib.set_root(REPO)
        self.assertEqual(lib.check(lib.build()), [])

    def test_pagination_grows_with_content_and_stays_crawlable(self):
        before = len(lib.load_topics())
        self.add(13)
        result = lib.build()
        total = math.ceil((before + 13) / lib.PER_PAGE)
        for lang in lib.LANGS:
            prefix = lib.PREFIX[lang]
            for n in range(2, total + 1):
                self.assertIn(f"{prefix}blog/page/{n}/index.html", result.files)
            self.assertNotIn(f"{prefix}blog/page/{total + 1}/index.html", result.files)
            last = result.files[f"{prefix}blog/page/{total}/index.html"]
            self.assertIn(f'<link rel="canonical" href="https://convertios.com/{prefix}blog/page/{total}/">', last)
            self.assertIn('rel="prev"', last)
            self.assertRegex(last, r'aria-disabled="true">[^<]+<span aria-hidden="true">[→←]</span></span></nav>')  # Next disabled on the last page
            first = result.files[f"{prefix}blog/index.html"]
            self.assertIn(f"/{prefix}blog/synthetic-test-12/", first)  # newest first
            self.assertIn('aria-current="page"', first)
        self.assertIn(f"https://convertios.com/blog/page/{total}/", result.sitemap)

    def test_drafts_are_excluded_from_listings_and_sitemap(self):
        self.add(1, status="draft")
        result = lib.build()
        self.assertNotIn("blog/synthetic-test-0/index.html", result.files)
        self.assertNotIn("synthetic-test-0", result.sitemap)
        self.assertFalse(any("synthetic-test-0" in html for html in result.files.values()))

    def test_rejects_missing_translation_and_unknown_tool(self):
        text = synthetic(self.base, 0)
        (self.root / "content/blog/synthetic-test-0.md").write_text(text.split("=== pt-br ===")[0], encoding="utf-8")
        with self.assertRaises(lib.LibraryError):
            lib.build()
        (self.root / "content/blog/synthetic-test-0.md").write_text(
            re.sub(r"^tools: .*$", "tools: not-a-real-tool", text, count=1, flags=re.M), encoding="utf-8")
        with self.assertRaises(lib.LibraryError):
            lib.build()

    def test_pagination_window_marks_current_page(self):
        html = lib.pagination("en", "blog/", 5, 9)
        self.assertIn('aria-current="page"', html)
        self.assertIn('href="/blog/page/4/"', html)
        self.assertIn('href="/blog/page/9/"', html)
        self.assertIn('rel="next"', html)
        self.assertIn('rel="prev"', html)


if __name__ == "__main__":
    unittest.main()
