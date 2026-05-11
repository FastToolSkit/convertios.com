# Arabic Rollout Report

## Translated pages in this initial rollout

The first Arabic rollout includes 20 high-value pages under `/ar/`:

1. `/ar/`
2. `/ar/all-tools.html`
3. `/ar/image-tools.html`
4. `/ar/pdf-tools.html`
5. `/ar/audio-tools.html`
6. `/ar/png-to-jpg.html`
7. `/ar/jpg-to-png.html`
8. `/ar/webp-to-png.html`
9. `/ar/image-converter.html`
10. `/ar/image-resizer.html`
11. `/ar/compress-image.html`
12. `/ar/social-media-image-resizer.html`
13. `/ar/ai-image-enhancer.html`
14. `/ar/pdf-to-word.html`
15. `/ar/pdf-to-jpg.html`
16. `/ar/jpg-to-pdf.html`
17. `/ar/merge-pdf.html`
18. `/ar/split-pdf.html`
19. `/ar/rotate-pdf.html`
20. `/ar/mp3-cutter.html`

## Missing translations for future phases

- Utility tools: QR generator, password generator, word counter, text formatter, unit converter, meme generator, link shortener.
- Additional image pages: remove background and size-specific compression pages.
- Additional audio pages: audio converter, audio speed changer, trim audio.
- Spanish pages were not translated into Arabic because they are separate localized URLs.
- Policy/support pages: about, contact, FAQ, privacy, terms, security.

## Pages needing manual review

- Tool pages currently provide Arabic SEO copy, Arabic navigation, hreflang, canonical, and internal Arabic links. Full Arabic tool-control parity should be reviewed before the next rollout for every converter that has complex client-side controls.
- API-backed pages such as AI image enhancer and PDF to Word should be reviewed for Arabic error handling, upload limits, and service downtime messages.
- Audio and PDF tools should be tested on mobile in RTL layout.

## RTL issues found and addressed

- Added `/ar/rtl.css` for RTL direction, text alignment, dropdown alignment, list indentation, related-tool cards, and mobile language-switcher spacing.
- Arabic pages use `lang="ar"` and `dir="rtl"` directly on the `<html>` element.
- Arabic pages use absolute root asset paths so CSS, icons, logo, favicon files, and scripts resolve correctly from `/ar/`.

## Hreflang/canonical notes

- The implementation uses `https://convertios.com` to match the existing project canonicals and sitemap domain.
- Every Arabic page has a self canonical.
- Every Arabic page includes `hreflang="ar"`, `hreflang="en"`, and `hreflang="x-default"` tags.
- The sitemap was regenerated with English and Arabic URLs for the translated pairs using `xhtml:link` alternates.


## Premium copy refinement

- Refined the Arabic homepage and five priority pages: `/ar/compress-image.html`, `/ar/image-resizer.html`, `/ar/social-media-image-resizer.html`, `/ar/pdf-to-word.html`, and `/ar/mp3-cutter.html`.
- Replaced mechanical phrases such as “أداة عربية” with natural product copy focused on speed, clarity, trust, and practical workflows.
- Reworked the header language control into an accessible dropdown-style selector and improved RTL spacing/visual hierarchy in `/ar/rtl.css`.
