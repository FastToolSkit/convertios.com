# Independent live HTTP verification — 12 November 2026

The initial Codex sandbox could not reach convertios.com directly. A subsequent independent read-only HTTP check using the authorized Windows laptop verified the following live URLs:

| URL path | Observed HTTP result |
|---|---|
| /jpg-to-pdf/ | 200 |
| /es/ai-image-enhancer/ | 200 |
| /es/pdf-to-jpg/ | 200 |
| /video-converter/ | 200 |
| /ar/ai-image-enhancer.html | 301 redirect to /ar/ai-image-enhancer/ |

Earlier independent checks on the same laptop also verified the seven Google-selected legacy .html aliases currently redirect 301 to clean URLs, and the clean destinations return 200. This evidence **supersedes the statement in REPORT.md that live checks were unavailable** (that limitation applied to Codex's own sandbox). These were HTTP-only requests, not live conversion tests, not Googlebot fetches, and not proof that the Search Console records have updated.

No changes were made to redirect rules in this branch. Continue with human Spanish and Arabic editorial review and provider-backed file conversion tests before merging.
