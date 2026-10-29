# IndexNow for Convertios

This static-site integration sends **canonical** URLs from `sitemap.xml` to the IndexNow API. It is separate from the existing SEO and converter code.

## How it runs
- On a push to `main`, GitHub Actions compares the previous and new commits and submits changed HTML pages that are represented in the current or previous sitemap. It also submits additions/deletions in the sitemap.
- A manual run of **Notify IndexNow of changed URLs** with `all_pages=true` submits all 129 currently listed canonical URLs once, after the verification key is published.
- The action waits for hosting to catch up and checks the public key file before submitting.
- Local verification without a network request: `python scripts/submit-indexnow.py --all --dry-run`.
- Testing a change set: `python scripts/submit-indexnow.py --before <old-sha> --after <new-sha> --dry-run`.

IndexNow HTTP 200 or 202 means received or pending key validation, **not indexed**. Avoid resubmitting unchanged URLs frequently. Monitor the Bing Webmaster Tools IndexNow reporting after initial deployment.
