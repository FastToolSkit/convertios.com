# Brazilian Portuguese (pt-BR) build

`/pt-br/` pages are generated from the `/es/` templates so layout, scripts and tool markup stay identical
across locales. Text comes from a reviewed Spanish → Portuguese (Brazil) dictionary.

| File | Purpose |
| --- | --- |
| `strings.json` | Every translatable Spanish string found in the in-scope `/es/` pages (text, attributes, meta, JSON-LD, inline JS literals). |
| `translations/NNN.json` | Portuguese for `strings.json`, in the same order (file name = index of its first entry). |
| `build.py` | Writes `/pt-br/**/index.html`: translation, `lang="pt-BR"`, canonical/OG/JSON-LD URLs, hreflang cluster, language selector, guides-only blog hub. Fails if any Spanish string has no translation. |
| `link_pt.py` | Adds the reciprocal `pt-BR` alternate and the "Português" selector link to en/es/ar pages, and pt-BR records to `sitemap.xml`. Idempotent. |
| `js_pt.py` | One-time insertion of `pt` dictionaries into the shared tool scripts (already applied). |
| `extract.py` | Re-collects strings after `/es/` changes. |

Scope: every `/es/` page except dated news posts (the newsroom publishes en/es/ar only). The Portuguese
blog hub lists the three evergreen guides and links to the English and Spanish news.

After a Spanish page changes:

```
python3 scripts/i18n-pt-br/build.py        # lists every Spanish string that has no translation yet
# add those strings to the end of strings.json and their Portuguese to a new translations/<index>.json, then:
python3 scripts/i18n-pt-br/build.py
python3 scripts/i18n-pt-br/link_pt.py
python3 scripts/stamp-assets.py
npm test
```

`extract.py` regenerates `strings.json` from scratch (page order); only use it together with a full re-alignment of `translations/`.
