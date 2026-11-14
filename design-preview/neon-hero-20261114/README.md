# Convertios Neon Hero — isolated visual prototype

Status: visual design implementation for review. **Not production-ready or a replacement homepage.**

This folder contains a self-contained interactive preview of the exact selected neon design: dark navy/purple-blue background, generated file-format image, live HTML text, top navigation, a large center-aligned search field, and four feature tiles.

## Preview
Open `index.html` in a browser. All CSS, JavaScript, and the 3D-art image are embedded for portable review. No remote resources are required for rendering; navigation and search intentionally point to existing production tool URLs.

## What works in this prototype
- Search suggestions filter a representative tool list; pressing Enter opens the matching existing Convertios tool.
- Navigation dropdowns, language dropdown (English/Spanish/Arabic) and mobile navigation toggle.
- Responsive desktop/mobile layout, RTL text arrangement, accessible search/form markup.
- Decorative artwork is a distinct transparent image (embedded as WebP), not a screenshot of text or controls.

## Before integrating into the actual site
- Preserve and wire the full production tool catalog and existing `js/search.js`/search behavior, language-specific nav routes, and all menu links.
- Use the site's actual Convertios logo asset instead of the CSS approximation.
- Extract shared header as reusable markup/styles and keep it consistent across 159 HTML pages, without breaking existing article/blog pages.
- Preserve production SEO metadata, existing tool sections, SEO descriptions, JavaScript, canonical URLs, sitemaps, and video/PDF fixes.
- Verify all three languages, keyboard accessibility, tool functionality, mobile viewport geometry, Core Web Vitals.
- Work in a distinct follow-up branch, request explicit approval before merging/deploying.

The self-contained prototype intentionally leaves production unchanged.
