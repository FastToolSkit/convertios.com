"""Stamping must match published Git bytes without rewriting page formatting."""
import contextlib
import hashlib
import importlib.util
import io
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('stamp_assets', ROOT / 'scripts/stamp-assets.py')
stamp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stamp)


class StampingTests(unittest.TestCase):
    def test_windows_and_linux_hash_the_published_bytes(self):
        with tempfile.TemporaryDirectory() as folder, patch.object(stamp, 'ROOT', folder):
            asset = Path(folder) / 'asset.css'
            lf = b'a { color: red; }\nb { color: blue; }\n'
            asset.write_bytes(lf)
            expected = hashlib.sha256(lf).hexdigest()[:8]
            self.assertEqual(stamp.content_hash('/asset.css'), expected)
            asset.write_bytes(lf.replace(b'\n', b'\r\n'))
            self.assertEqual(stamp.content_hash('/asset.css'), expected)
            asset.write_bytes(lf.replace(b'red', b'green'))
            self.assertNotEqual(stamp.content_hash('/asset.css'), expected)
            self.assertIsNone(stamp.content_hash('/missing.css'))

    def test_stale_urls_change_without_other_page_bytes_and_are_idempotent(self):
        with tempfile.TemporaryDirectory() as folder, patch.object(stamp, 'ROOT', folder):
            root = Path(folder)
            (root / 'asset.js').write_bytes(b'const x = 1;\n')
            page = root / 'index.html'
            original = b'<html>\r\n<script src="/asset.js?v=old"></script>\r\n</html>\r\n'
            page.write_bytes(original)
            digest = stamp.content_hash('/asset.js').encode()
            def run(*args):
                with patch.object(sys, 'argv', ['stamp-assets.py', *args]), contextlib.redirect_stdout(io.StringIO()):
                    with self.assertRaises(SystemExit) as result:
                        stamp.main()
                    return result.exception.code
            self.assertEqual(run('--check'), 1)
            self.assertEqual(page.read_bytes(), original)
            self.assertEqual(run(), 0)
            expected = original.replace(b'?v=old', b'?v=' + digest)
            self.assertEqual(page.read_bytes(), expected)
            self.assertEqual(run(), 0)
            self.assertEqual(page.read_bytes(), expected)
            self.assertEqual(run('--check'), 0)

    def test_git_windows_checkout_and_blob_match_hash(self):
        with tempfile.TemporaryDirectory() as folder, patch.object(stamp, 'ROOT', folder):
            root = Path(folder)
            def git(*args):
                return subprocess.check_output(['git', '-C', folder, *args], stderr=subprocess.PIPE)
            git('init', '--quiet')
            git('config', 'core.autocrlf', 'true')
            (root / '.gitattributes').write_bytes((ROOT / '.gitattributes').read_bytes())
            asset = root / 'asset.css'
            asset.write_bytes(b'a { color: red; }\r\n')
            git('add', '.gitattributes', 'asset.css')
            blob = git('show', ':asset.css')
            self.assertNotIn(b'\r\n', blob)
            self.assertEqual(stamp.content_hash('/asset.css'), hashlib.sha256(blob).hexdigest()[:8])
            asset.unlink()  # Exercise a fresh checkout, rather than Git's stat cache.
            git('checkout-index', '--force', '--all')
            self.assertEqual(asset.read_bytes(), blob)


if __name__ == '__main__':
    unittest.main()
