# Convertios Website Report

_Last updated: May 9, 2026_

## 1. Current Website Structure

### Main / informational pages
- `index.html` — homepage with hero search, popular tools, category cards, trust messaging, and SEO content.
- `tools.html` — grouped tool directory page.
- `all-tools.html` — alternate all-tools listing page.
- `about.html` — About page.
- `contact.html` — Contact page.
- `faq.html` — FAQ page.
- `privacy.html` — Privacy Policy page.
- `terms.html` — Terms of Service page.
- `security.html` — Security page.
- `google2353a03ef25ef782.html` — Google verification file.
- `tool-template.html` — internal template file for creating consistent tool pages.

### Category pages
- `image-tools.html` — image tools category page.
- `pdf-tools.html` — PDF tools category page.
- `audio-tools.html` — audio tools category page.
- `other-tools.html` — utility/other tools category page.

## 2. Tool Inventory by Category

### Image tools
- `png-to-jpg.html` — PNG to JPG.
- `jpg-to-png.html` — JPG to PNG.
- `webp-to-png.html` — WEBP to PNG.
- `image-converter.html` — general image converter.
- `image-resizer.html` — image resizing.
- `compress-image.html` — image compression.
- `compress-image-to-20kb.html` — target-size image compression to 20KB.
- `compress-image-to-50kb.html` — target-size image compression to 50KB.
- `compress-image-to-100kb.html` — target-size image compression to 100KB.
- `social-media-image-resizer.html` — social media image resizing.
- `remove-bg.html` — background removal.
- `ai-image-enhancer.html` — AI Image Enhancer for improving image quality, sharpness, and clarity.
- `ai-enhance.html` — legacy/alternate AI enhancement page exists; the live page referenced by current work is `ai-image-enhancer.html`.

### PDF tools
- `pdf-to-word.html` — PDF to Word.
- `pdf-to-jpg.html` — PDF to JPG.
- `jpg-to-pdf.html` — JPG to PDF.
- `merge-pdf.html` — merge PDF files.
- `split-pdf.html` — split PDF files.
- `rotate-pdf.html` — rotate PDF files.

### Audio tools
- `mp3-cutter.html` — MP3 cutter.
- `trim-audio-online.html` — trim audio online.
- `audio-converter.html` — audio converter.
- `audio-speed-changer.html` — audio speed changer.

### Other / utility tools
- `qr-generator.html` — QR code generator.
- `link-shortener.html` — link shortener.
- `password-generator.html` — password generator.
- `word-counter.html` — word counter.
- `text-formatter.html` — text formatter.
- `unit-converter.html` — unit converter.
- `meme-generator.html` — meme generator.

## 3. AI Image Enhancer Placement Status

The active AI Image Enhancer page is `ai-image-enhancer.html`.

Current placement improvements:
- Added to image dropdown navigation across site pages that include the shared Image menu.
- Added to `image-tools.html` as an image category card.
- Added to `tools.html` in the Image Tools section.
- Added to `all-tools.html` in the complete tools grid.
- Added to `index.html` in the Popular Tools area.
- Added to related image-tool sections on existing image tool pages.
- Added a dedicated FAQ section and FAQPage JSON-LD on `ai-image-enhancer.html`.

## 4. SEO Status Summary

Completed / present:
- Most top-level pages have canonical URLs, page titles, and meta descriptions.
- Main pages and tool pages now include Open Graph and Twitter Card metadata.
- JSON-LD exists for `Organization`, `WebSite`, `WebPage`, `WebApplication`, `BreadcrumbList`, and FAQ pages where applicable.
- `faq.html` has FAQ content and FAQPage JSON-LD.
- `ai-image-enhancer.html` now has page-specific FAQ content and FAQPage JSON-LD.

Known SEO issues / follow-ups:
- `ai-enhance.html` appears to be a legacy/alternate AI enhancer page. Decide whether to keep, redirect, canonicalize, or remove it from navigation strategy later.
- `all-tools.html` and `tools.html` overlap as directory pages. Consider consolidating or clarifying their roles to avoid duplicate directory intent.
- Some descriptions are generic across tool pages and could be improved with more unique, tool-specific copy.
- Sitemap and robots files were not modified in this pass; confirm they include the preferred live tool URLs during a separate sitemap review.

## 5. UX / Accessibility Status Summary

Completed / present:
- Site pages include a skip-to-content link.
- Main content targets are present for skip-link navigation.
- Shared CSS includes visible focus states.
- Dropdown behavior is enhanced via `script.js` with ARIA attributes and keyboard support.
- Dropzones receive keyboard-accessible behavior through shared script support.
- Header logo images include width and height attributes on updated pages to reduce layout shift.

Known UX/accessibility issues / follow-ups:
- Navigation dropdown triggers are still mostly `<span>` elements enhanced by JavaScript; a future markup pass should replace them with actual `<button>` elements page-wide.
- Several tools still use inline JavaScript and inline CSS. A future refactor could reduce duplication, but should be done carefully tool by tool.
- Some dynamic preview images are created at runtime; verify generated image elements include meaningful alt text where applicable.

## 6. Performance Notes

Completed / present:
- Shared `script.js` is loaded with `defer` on updated pages.
- Header logo dimensions reduce CLS risk.
- Ad containers reserve minimum space in CSS without removing ads.
- `ai-image-enhancer.html` includes preconnect hints for Cloudinary and the n8n endpoint used by that tool.

Known performance follow-ups:
- Many pages still contain inline styles and inline scripts, which limits caching efficiency.
- Some pages may benefit from lazy-loading non-critical images beyond the header/logo.
- A future pass should audit image sizes and ensure generated or static preview images do not cause layout shift.

## 7. Known Issues

- `ai-image-enhancer.html` requires real Cloudinary configuration values before the live enhancement flow can work:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_UPLOAD_PRESET`
- `ai-enhance.html` exists alongside `ai-image-enhancer.html`, which can confuse maintenance and internal linking.
- `tools.html` and `all-tools.html` both function as tool directory pages and may need a clear canonical/internal-link strategy.
- Some tool error states are still implemented individually and may be inconsistent across tools.
- Some file-size limits depend on browser memory, Cloudinary preset settings, or third-party services and are not uniformly documented.

## 8. Missing Pages or Missing Improvements

No missing page is proven from the current repo alone, but these improvements are candidates:
- A single preferred AI enhancer URL strategy (`ai-image-enhancer.html` is current live page).
- A dedicated status/help note for third-party tools that depend on external services.
- More tool-specific FAQ sections for high-value tools.
- A consolidated component approach for repeated navigation and footer markup.
- Sitemap review after deciding which duplicate/legacy pages should remain indexed.

## 9. Recommended Next Tasks

1. Configure `ai-image-enhancer.html` with the live Cloudinary cloud name and unsigned upload preset.
2. Decide whether `ai-enhance.html` should be redirected, removed from navigation, or canonicalized to `ai-image-enhancer.html`.
3. Review `tools.html` vs. `all-tools.html` and choose a primary directory page.
4. Replace dropdown trigger spans with real buttons in shared navigation markup.
5. Add tool-specific FAQ sections to the most important conversion tools.
6. Run a sitemap/canonical audit after finalizing preferred URLs.
7. Gradually move repeated inline CSS/JS into shared assets where safe.
