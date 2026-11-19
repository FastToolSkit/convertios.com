# Convertios — New Tools Expansion (Batch 1)
Date: 2026-11-19
Base: origin/main at 0f95e6fbf2856cabca8e325152b050f18f9616ac
Branch: feat/tools-expansion-batch1
Status: Discovery and implementation plan; NO tools claimed implemented.

## Safety and scope
- Existing project only. Preserve all tools, site design, localizations, blog, analytics, indexing behavior, and production configuration.
- Do not merge, deploy, publish, submit IndexNow URLs, or change live infrastructure without owner approval.
- Work in isolated worktree C:/Users/ASUS/convertios-tools-expansion. Original main worktree has unrelated local modifications; do not touch them.
- For every tool implement EN, ES, AR (RTL), pt-BR; add consistent navigation, sitemap, canonical, hreflang and OG metadata only after functional checks.
- Avoid SEO-only clones of existing general tools. Shared converter engine is preferred; standalone pages must give a distinct, functional task workflow.

## Actual baseline audit
Existing tools include general Image Converter, Video Converter, MP3 Cutter, PDF to JPG, JPG to PDF, PNG to JPG, JPG to PNG, WEBP to PNG, PDF to Word, audio conversion, image resizing/compression, PDF merge/split/rotate, background removal.
Video Converter already accepts MOV and WEBM inputs and supports MP4 output via FFmpeg: do NOT create MOV-to-MP4 or WebM-to-MP4 as separate engines. A dedicated UI is optional only when genuine workflow differentiation and search intent justify it.
Current browser image converter decodes via Image element/canvas; HEIC input decoding is NOT guaranteed on browsers. Do not reuse it for HEIC without actual decoding support and fixture tests.
Backend uses Node/Express and FFmpeg, 50 MB video limit, 2 default concurrent jobs, and currently offers video conversion without GIF output. Additional CPU-intensive tools require capacity and security review.

## Google market evidence (DataForSEO via OpenSEO 2026-11-19)
Numbers are country-specific estimated monthly Google searches, NOT traffic forecasts, NOT Bing data; KD is provider score and may be uncertain.
- HEIC to JPG: US 246,000 KD41; ES 14,800 KD8; BR 22,200 KD0
- MP4 to GIF: US 110,000 KD30; ES 8,100 KD0; BR 2,900 KD0
- Video compressor: US 90,500 KD59; ES 33,100 KD3; BR 90,500 KD7
- Image to text: US 60,500 KD37; ES 6,600 KD15; BR 12,100 KD0
- HEIC to PDF: US 40,500 KD14; ES 2,400 KD0; BR 2,900 KD0
- GIF compressor: US 40,500 KD27; ES 2,400 KD0
- SVG to PNG: US 40,500 KD9
- AVIF to PNG: US 27,100 KD8
- PDF to text: US 8,100 KD11
- Remove metadata from photo: US 2,900 KD18
- JSON to CSV: US 5,400 KD7
Bing Webmaster Tools demand is NOT yet connected/verified. Do not claim Bing volumes.

## First ten functional tool candidates (provisional ranking)
1. HEIC to JPG — requires reliable HEIC decoder; batch, EXIF rotation, size/memory limits; independent JPEG magic-byte test.
2. HEIC to PDF — reuse HEIC decoder and proper document generator; multi-photo order and pagination.
3. MP4 to GIF — FFmpeg output, duration/fps/size guardrails, accurate animated GIF content.
4. Video Compressor — quality presets, realistic file-size claims, server capacity caps, before/after size.
5. Image to Text OCR — multilingual EN/ES/AR/PT, Arabic sample benchmarks; declare processing/privacy.
6. GIF Compressor — preserve animation, frame count/timing/transparency; reject false image-only output.
7. SVG to PNG — secure SVG sanitization, prevent scripts/external asset fetching; transparent background.
8. AVIF to PNG — decode support matrix, alpha preservation, genuine PNG output.
9. PDF to Text — distinguish digital text from scanned PDFs and offer OCR when needed.
10. Image Metadata Remover — EXIF/GPS removal verified in output; clarify effect on formats/color profiles.
Alternative low-cost utility: JSON to CSV (rank after format research).
MOV to MP4 and WebM to MP4: already supported through Video Converter; reserve distinct landing pages only if unique UX is justified, not as new engine count.

## Delivery gates for EVERY tool
1. Document user problem, Google keyword intent, competitor gaps, and supported input/output formats.
2. Add genuine conversion functionality with failure handling; do not spoof file extensions.
3. Validate file signatures, enforce size/time/memory constraints, protect against malicious files, and clean up temporary files.
4. Test actual conversion with fixtures plus invalid, empty, oversized and corrupted inputs.
5. Ensure keyboard, screen reader, mobile UX, no visual regression, and actual four-language localized text including RTL.
6. Verify canonical/hreflang reciprocity, sitemap inclusion, robots behavior, page title/description, links and analytics.
7. Run npm test, targeted browser tests, and manually verify downloaded file bytes and content.
8. Commit small reviewable increments and open a DRAFT PR; no merge/deployment without owner approval.
9. Record backend CPU/memory implications before enabling video/AI workloads.
10. Avoid false privacy, browser-only, unlimited-size, or zero-cost claims.

## Sequence
A. Technical spikes: HEIC decoder compatibility + sample HEIC fixture, FFmpeg GIF pipeline and resource limits, browser AVIF support, safe SVG path.
B. Implement first verified low-risk tool after passing the spike, across EN/ES/AR/PT-BR.
C. Add remaining tools in grouped, independent commits or multiple draft PRs if the review diff becomes too large.
D. Reassess keyword relevance, existing functionality, hosting costs, and Bing data before any public rollout.

## Current execution record
- Verified connected Desktop Commander device and GitHub access.
- Fetched latest origin/main and created isolated clean worktree.
- Inspected tools catalog, browser image converter, video backend, dependency list and existing localization architecture.
- Prepared this specification; functionality is not implemented or tested yet.
