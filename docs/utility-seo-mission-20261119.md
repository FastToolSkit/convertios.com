# Convertios SEO expansion mission, 19 Nov 2026
WORKTREE C:\Users\ASUS\convertios-utility-seo
BRANCH seo/utility-batch2-content-indexing-20261119 (isolated, created from latest origin/main a795756f after merged PR #303)
Do NOT reset, force-push, merge, or deploy. Preserve unrelated local edits in the original worktree.

User explicitly requests "SEO boost and descriptions needs fix then update sitemap then reindex new stuff" for TEN NEW TOOLS introduced by merged PR#303:
compress-pdf, searchable-pdf-ocr, invoice-generator, csv-xlsx-converter, json-csv-converter, bulk-file-renamer, json-formatter-validator, regex-tester, utm-campaign-builder, seo-social-preview.
All EN, ES, AR RTL and PT-BR = 40 pages. The generator scripts/build-utility-tools.py owns the output (imports scripts/artifact_content.py) so edits MUST be generator-owned and reproducible. Focus meaningful and honest SEO improvements, not keyword stuffing or artificially inflated page counts.

Inspect the exact real features and limits by reading backend/utility_artifacts.py, js/utility-tools.js and js/artifact-tools.js, existing copy generators; never invent functionality, automation or server-side page inspection (SEO Social Preview is manual). Preserve privacy claims: six tools client-side, four backend. Do not claim secure handling that is unproven.

Deliver:
1. Unique natural search-intent titles (<~65 chars preferred, never truncate clarity), focused EN/ES/AR/PT-BR, localized engaging meta descriptions (~115-155 chars ideally, not arbitrary rule), honest capabilities, no boilerplate "Try" only. Avoid exact same descriptions across locales.
2. Significantly improved *useful, original on-page content* for each of ten tools in each locale: a clear 3-5-step localized "How to use" section, tool-specific helpful example/use case, key options, what output means, and 2-3 genuinely useful FAQs per tool. Highlight actual limitations, processing boundary. No fake testimonials, rankings, claims of indexing or legal invoice compliance; distinguish graphics signature vs crypto etc not relevant. Don't fill empty generic text. Make natural Arabic and Brazilian Portuguese, proper RTL.
3. Preserve existing page form, scripts, config JSON, accessibility, structured data, canonical, x-default and hreflang. Update WebApplication description/schema and any OG description consistently; add FAQPage schema only if visible question/answers shown and compliant; no FAQ rich-result guarantees. Tool directory cards use improved descriptions; do not damage homepage.
4. Change sitemap generation to include accurate <lastmod>2026-11-19</lastmod> for precisely these 40 updated tool URLs. Do not falsify lastmod for other URLs. Sitemap stay at 544 indexable URLs with original 504 retained; preserve URLs, links and sitemap index/alternates. Ensure XML valid.
5. Add focused regression tests for SEO titles/descriptions per locale (no duplicates, no mojibake, metadata escaping), hreflang, schema parseability, FAQ content, generator idempotency and sitemap exact lastmods, keep original 544. npm.cmd test, Python tests, asset stamp tests when feasible, browser smoke or basic Playwright if practical.
6. Document progress, exact change scope, tests, and post-merge Google Search Console sitemap resubmission vs Bing IndexNow for changed 40 URLs in docs/utility-batch2-seo-20261119.md, plus a manifest of exactly these 40 canonical URLs for post-deployment IndexNow. Do not actually make IndexNow submissions from repo code or claim Google has indexed them.

Execute NOW with actual file edits, testing. Keep working until done. Aim for quality per tool in all locales rather than repetitive fluff. You can generate separate code-owned SEO content dictionary and integrate into generator to avoid editing giant legacy dictionaries.
At end give summary of files and tests, leave worktree changes for assistant to commit if Git sandbox ownership prevents commit. Do not merge/push/deploy.
