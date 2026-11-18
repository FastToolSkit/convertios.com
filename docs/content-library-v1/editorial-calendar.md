# Content Library V1 — 60-topic editorial calendar

Source of truth for published content is `content/blog/<slug>.md` (metadata + en/es/ar/pt-br).
This calendar is the plan; `python3 scripts/content_library.py report` shows what is actually published.
Order = position in the newest-first listing (higher = newer). New topics are dated 2026-11-18 (draft PR date;
update `published` if the owner merges on a later day). Existing topics keep 2026-11-11.

| Order | Slug | Category | Type | Primary intent / target query | Main tool(s) |
|---:|---|---|---|---|---|
| 200 | convert-pdf-to-word-keep-formatting | PDF | guide | convert pdf to word without losing formatting | pdf-to-word |
| 199 | reduce-image-size-without-losing-quality | Images | guide | reduce image file size without losing quality | compress-image |
| 198 | browser-vs-server-file-processing | AI & Tech | comparison | are online converters safe / browser vs server processing | (all) |
| 197 | convert-video-to-mp3 | Audio & Video | tutorial | convert video to audio / mp4 to mp3 | video-to-mp3 |
| 196 | qr-codes-for-business | QR & Web | guide | create qr code for business | qr-generator |
| 195 | strong-password-guide | Productivity | guide | how to create a strong password | password-generator |
| 194 | merge-pdf-files | PDF | tutorial | merge multiple pdfs into one | merge-pdf |
| 193 | lossy-vs-lossless-compression | Images | comparison | lossy vs lossless compression | compress-image |
| 192 | ocr-explained | AI & Tech | guide | how does ocr work | (pdf-to-word) |
| 191 | mp3-vs-wav | Audio & Video | comparison | mp3 vs wav | audio-converter |
| 190 | eu-ai-act-ai-content-labels-2026 | AI & Tech | news | EU AI Act Article 50 AI-generated content marking | — |
| 189 | resize-images-for-websites | Images | guide | resize images for website | image-resizer |
| 188 | split-pdf-extract-pages | PDF | tutorial | extract pages from pdf | split-pdf |
| 187 | remove-background-clean-cutouts | Images | tutorial | remove background from image | remove-bg |
| 186 | ai-upscaling-vs-resizing | AI & Tech | comparison | ai upscaling vs resizing | ai-image-enhancer, image-resizer |
| 185 | trim-voice-recordings | Audio & Video | tutorial | trim audio / cut voice memo | trim-audio-online |
| 184 | qr-code-print-size | QR & Web | guide | minimum qr code size for printing | qr-generator |
| 183 | email-attachment-size-limits | Productivity | guide | file too large to email | compress-image, split-pdf |
| 182 | photos-to-pdf-phone | PDF | tutorial | convert photos to pdf | jpg-to-pdf |
| 181 | compress-image-to-specific-size | Images | tutorial | compress image to 100kb / 50kb | compress-image-to-100kb |
| 180 | jpeg-xl-chrome-155 | Images | news | Chrome 155 JPEG XL support | image-converter |
| 179 | video-formats-compared | Audio & Video | comparison | mp4 vs mov vs webm vs mkv | video-converter |
| 178 | png-to-jpg-transparency | Images | tutorial | png to jpg white background | png-to-jpg |
| 177 | clean-up-pasted-text | Productivity | tutorial | remove extra spaces / change case | text-formatter |
| 176 | rotate-pdf-pages | PDF | tutorial | rotate pdf pages permanently | rotate-pdf |
| 175 | svg-vs-png | Images | comparison | svg vs png | image-converter |
| 174 | improve-image-quality | AI & Tech | guide | how to improve image quality | ai-image-enhancer |
| 173 | make-ringtone-mp3-cutter | Audio & Video | tutorial | make a ringtone from mp3 | mp3-cutter |
| 172 | link-shortener-safety | QR & Web | guide | are link shorteners safe | link-shortener |
| 171 | word-and-character-limits | Productivity | guide | character count limits | word-counter |
| 170 | pdf-vs-docx | PDF | comparison | pdf vs docx | pdf-to-word |
| 169 | image-metadata-exif-privacy | Images | guide | remove exif / photo location privacy | compress-image |
| 168 | how-ai-background-removal-works | AI & Tech | guide | how ai background removal works | remove-bg |
| 167 | av2-video-codec-2026 | Audio & Video | news | AV2 codec released | video-converter |
| 166 | reduce-pdf-file-size | PDF | guide | why is my pdf so large | jpg-to-pdf, compress-image |
| 165 | webp-to-png-when-and-why | Images | tutorial | webp to png | webp-to-png |
| 164 | qr-code-scam-safety | QR & Web | guide | qr code scams / safe scanning | qr-generator |
| 163 | unit-conversion-mistakes | Productivity | guide | common unit conversion mistakes | unit-converter |
| 162 | pdf-to-jpg-when-to-convert | PDF | guide | pdf to jpg | pdf-to-jpg |
| 161 | avif-vs-webp-vs-jpeg-xl | Images | comparison | avif vs webp | image-converter |
| 160 | webassembly-browser-tools | AI & Tech | guide | how in-browser file tools work (WebAssembly) | — |
| 159 | change-audio-speed | Audio & Video | guide | slow down audio for learning | audio-speed-changer |
| 158 | pdf-upload-requirements | PDF | guide | pdf upload requirements for forms | merge-pdf, split-pdf |
| 156 | ai-tools-file-privacy-checklist | AI & Tech | guide | is it safe to upload files to ai tools | — |
| 155 | file-naming-and-organizing | Productivity | guide | file naming conventions | — |
| 154 | reduce-video-size-for-sharing | Audio & Video | guide | video too large to send | video-converter |
| 153 | image-dpi-and-print-size | Images | guide | dpi vs pixels for printing | image-resizer |
| 152 | pdf-a-archiving | PDF | guide | what is pdf/a | — |
| 151 | social-media-image-sizes | Images | guide | social media image sizes | social-media-image-resizer |
| 150 | content-credentials-explained | AI & Tech | guide | what are content credentials (C2PA) | — |
| 149 | pdf-redaction-mistakes | PDF | guide | how to redact a pdf properly | — |
| 148 | prepare-documents-for-ai-assistants | AI & Tech | guide | upload pdf to ai chatbot tips | split-pdf, pdf-to-word |
| 18 | svg-2-standard-2026 | Images | news | (existing, 2026-11-11) | |
| 17 | pdf-html-1-2-2026 | PDF | news | (existing) | |
| 16 | pdf-accessibility-2026 | PDF | news | (existing) | |
| 15 | pdf-brotli-2026 | PDF | news | (existing) | |
| 14 | retail-qr-2027 | QR & Web | news | (existing) | |
| 13 | scanned-pdf-to-word | PDF | guide | (existing, expanded 2026-11-18) | |
| 12 | jpg-png-webp-guide | Images | comparison | (existing, expanded 2026-11-18) | |
| 11 | qr-code-png-vs-svg | QR & Web | comparison | (existing, expanded 2026-11-18) | |

Category totals: PDF 15, Images 15, AI & Tech 10, Audio & Video 8, QR & Web 6, Productivity 6 = 60.
