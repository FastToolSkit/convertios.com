# Arabic Rollout Report

## Production-approved scope

Only Arabic image-tool pages are approved for indexing and production discovery in this phase:

1. `/ar/image-tools.html`
2. `/ar/image-converter.html`
3. `/ar/compress-image.html`
4. `/ar/compress-image-to-20kb.html`
5. `/ar/compress-image-to-50kb.html`
6. `/ar/compress-image-to-100kb.html`
7. `/ar/image-resizer.html`
8. `/ar/png-to-jpg.html`
9. `/ar/jpg-to-png.html`
10. `/ar/webp-to-png.html`
11. `/ar/remove-bg.html`
12. `/ar/social-media-image-resizer.html`
13. `/ar/ai-image-enhancer.html`

## Approved image pages ready

- The approved image pages retain `lang="ar"` and `dir="rtl"`, Arabic titles/descriptions, self canonicals, and English/Arabic hreflang pairs.
- Header navigation on approved image pages is limited to image tools; Arabic PDF, audio, and utility pages are not linked from those image headers.
- Static QA confirmed each approved image page keeps the same core tool IDs as its English counterpart, including upload/select controls, action buttons, result/preview areas, and download targets where the English page provides them.
- Language selectors on approved image pages map the Arabic URL to the matching English URL without replacing the Arabic tool interface.

## Image pages needing manual browser test

Manual browser testing is still required before final production sign-off for:

- `/ar/remove-bg.html` because it depends on the backend `remove-bg` endpoint and third-party background-removal service behavior.
- `/ar/ai-image-enhancer.html` because it uploads through Cloudinary and sends the image URL to the enhancement workflow.
- `/ar/social-media-image-resizer.html` because ZIP generation and multiple preset downloads should be checked in a real browser.
- Converter and compressor pages should receive a quick smoke test with at least one JPG, PNG, and WEBP file to confirm canvas download behavior across browsers.

## Non-image Arabic pages marked noindex

The following Arabic pages exist from the initial rollout but are not approved for indexing in this phase and are marked with `<meta name="robots" content="noindex, nofollow">`:

- `/ar/`
- `/ar/all-tools.html`
- `/ar/audio-tools.html`
- `/ar/pdf-tools.html`
- `/ar/pdf-to-word.html`
- `/ar/pdf-to-jpg.html`
- `/ar/jpg-to-pdf.html`
- `/ar/merge-pdf.html`
- `/ar/split-pdf.html`
- `/ar/rotate-pdf.html`
- `/ar/mp3-cutter.html`

No Arabic URLs are currently present in `sitemap.xml`, so no sitemap removal was needed in this audit.

## Copy and navigation QA

- Removed the previously over-broad category navigation from approved image pages so the rollout does not promote unfinished Arabic PDF, audio, or utility sections.
- Checked for the disallowed spammy Arabic phrases listed in the audit request and removed the remaining occurrence from Arabic page copy.
- Remaining English product/file-format terms are intentional where they are brand names, file formats, code identifiers, endpoint names, or required UI values such as JPG, PNG, WEBP, ZIP, PDF, Cloudinary, and Convertios.

## Remaining risks

- Some approved pages still use inline scripts inherited from English pages. Static syntax checks pass, but browser QA is needed for drag/drop, canvas export, ZIP export, and API-backed flows.
- API-backed Arabic status messages may still surface provider error text in English if the upstream service returns an English error.
- The non-image Arabic pages remain in the repository as noindex placeholders to avoid merge conflicts; they should not be promoted until their real tool UIs and copy pass QA.
