"""Check exact Google Search Console 'Page with redirect' examples; read-only."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
import json

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "tests/fixtures/gsc-redirects-20261119.json"
ORIGIN = "https://convertios.com"
class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

def expected_target(url):
    parts = urlsplit(url)
    if parts.scheme == "http":
        return ORIGIN + "/"
    assert parts.hostname == "convertios.com" and parts.path.endswith(".html"), url
    if parts.path.endswith("/index.html"):
        target = parts.path.removesuffix("index.html")
    else:
        target = parts.path.removesuffix(".html") + "/"
    return ORIGIN + target + (("?" + parts.query) if parts.query else "")

def verify(source):
    expected = expected_target(source)
    req = Request(source, headers={"User-Agent": "ConvertiosReadOnlyAudit/1.0"})
    try:
        result = build_opener(NoRedirect).open(req, timeout=25)
    except HTTPError as error:
        result = error
    except (URLError, OSError) as error:
        return {"source": source, "error": str(error)}
    with result:
        status, location = result.status, result.headers.get("Location")
    return {"source": source, "status": status, "location": location,
            "expected": expected, "pass": status == 301 and location == expected}

def main():
    data = json.loads(FIXTURE.read_text(encoding="utf-8"))
    urls = data["urls"]
    if len(urls) != 56 or len(set(urls)) != len(urls):
        raise ValueError("GSC redirect fixture must contain the 56 unique source URLs")
    with ThreadPoolExecutor(max_workers=5) as pool:
        rows = list(pool.map(verify, urls))
    failed = [row for row in rows if not row.get("pass")]
    print(json.dumps({"checked": len(rows), "correct_301": len(rows)-len(failed),
                      "failed": failed}, ensure_ascii=False, indent=2))
    if failed:
        raise SystemExit(1)

if __name__ == "__main__":
    main()
