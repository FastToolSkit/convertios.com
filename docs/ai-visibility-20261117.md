# Convertios AI visibility audit — 2026-11-17

## Scope and measurement

Evidence: OpenSEO project `74630f70-020d-4cc8-8595-9c6fb2c92624`, manual run `7923b44b-4990-41aa-9911-8d52207d3df1`, collected Nov 17, 2026, US English, ChatGPT engine, 15 neutral prompts covering file conversion, image conversion and PDF tools. All 15 answered; none failed. Convertios was named 0/15 and cited 0/15. This is a small test sample, **not** general AI search market share or a traffic measure.

Competitor brand mentions in those 15 answers: CloudConvert 6, Smallpdf 5, iLovePDF 4, Online-Convert 2, Zamzar 2. Additional cited domains such as Convertio and FreeConvert are not in the tracked competitor list. Site mentions do not imply endorsement or superior performance.

## Where the gaps occur

- Broad free file-converter prompts cite `https://cloudconvert.com/` in six answers and `https://convertio.co/` in five. Convertios was absent. An independent guide `https://www.itechguides.com/best-free-file-converters-for-common-document-image-and-audio-formats/` appeared in three; listing/eligibility is **not confirmed**.
- PDF task prompts commonly named iLovePDF and Smallpdf; own pages include `/pdf-tools/`, `/jpg-to-pdf/`, `/merge-pdf/`, `/split-pdf/`, `/rotate-pdf/` and `/pdf-to-word/`.
- Privacy/limits prompts often cited competitor security and privacy pages. Convertios already provides tool-specific processing disclosures, a `/security/` page and `/privacy/`; broad site-wide claims should never contradict these details.
- Squoosh and iLoveIMG were cited in some image-related questions. The relevant own pages are `/image-converter/`, `/image-resizer/` and `/compress-image/`.

## Site access and page review

- Live `https://convertios.com/robots.txt` returned HTTP 200 on Nov 17, with `User-agent: *`, `Allow: /`, and the sitemap. No blanket block for AI search bots was seen; **crawler permission does not guarantee indexation or citations**.
- Source pages provide localized EN/ES/AR URLs, canonical and hreflang attributes. Previous indexing work had validated 156 sitemap URLs; this change does not redo that audit.
- Live `/faq/` includes disclosures for server-based PDF/Word and video tools and third-party Cloudinary AI enhancement. Earlier search snippets can be stale; verify live content before suggesting corrections.
- English `/all-tools/` had an absolute reassurance ('without worrying about data leaks or security risks') despite tool-dependent processing methods. That is a credibility issue. The narrow repair changes this wording and adds a direct task-selection guide with links to verified existing tool pages. No fabricated benchmarks, speed rankings, free file-size promises or new security guarantees are added.
- Existing translated All Tools pages remain untouched in this English-language pilot; later localization should be separately reviewed by a fluent reviewer rather than automatically inserted into different page layouts.

## Recommendations in priority order

1. **Clarify what each tool actually does**: ship the limited All Tools guide in this PR, connecting JPG/PNG/WEBP conversion, resizing/compression, JPG-to-PDF, PDF editing workflows, and server-based PDF-to-Word. Preserve existing site design and information architecture. The effect on AI citations is unproven and should be monitored.
2. **Build editorial credibility**: investigate legitimate inclusion in independently maintained file-converter guides (e.g. the iTechGuides URL) and relevant image/PDF software directories. Verify editorial process, audience and whether Convertios qualifies before outreach. Do not purchase spam links or submit misleading claims.
3. **Measure reliably**: retain the same 15 neutral prompts as a baseline; compare future runs only with the same engine and market. Consider expanding to Gemini/Google AI only after evaluating cost and question relevance. Inspect actual clickthrough/referrals in analytics separately from AI mention rate.

## What we deliberately did not do

- No AI crawler-specific rules were added: existing `robots.txt` already allows crawling.
- No bulk AI-written pages or thin 'best converter' comparisons were created.
- No guarantee of ChatGPT inclusion, traffic growth or new rankings is made.
- No existing translations, tools, analytics, advertising, performance repairs, metadata or canonical routes were altered.
- No speculative claim that a third-party guide lists Convertios or accepts submissions.

## Monitoring and acceptance

Confirm static site validation, changed link destinations, the homepage and hub design, and GitHub Pages CI. Following deployment, verify the updated `/all-tools/` live page and compare the next scheduled OpenSEO AI visibility run with this Nov 17 baseline. Do not request immediate indexation for every URL or expect a one-run score change.

OpenSEO AI Visibility Audit skill: https://openseo.so/docs/skills/ai-visibility-audit
