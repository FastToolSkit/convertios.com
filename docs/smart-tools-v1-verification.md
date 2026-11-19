# Smart Tools V1 review

The ten workflows have English, Spanish, Arabic and Brazilian Portuguese pages. Source copy lives in `content/smart-tools/`. Run `python scripts/build-smart-tools.py` after editing it. Generation updates the new pages, their entries in the localized catalogs and the smart-tools block in the sitemap. The newsroom owns its separate sitemap block.

## Product and search decisions

The [planning document](tools-expansion-batch1-20261119.md) records the country-specific search estimates and competition scores available when the batch was selected. Each row below represents one conversion intent and its localized equivalents. Google results included interactive converters for these tasks. The competitors' published interfaces informed scope. Their latency, recognition accuracy and conversion quality were not independently benchmarked.

| Search intent and common follow-up | Existing capability and reason for the new workflow | Comparison point |
|---|---|---|
| HEIC to JPG, batch iPhone photos | The original image converter depends on browser decoding. A dedicated HEIF decoder exports the primary photo and returns each completed JPG separately. | [iLoveIMG describes batch HEIC conversion](https://www.iloveimg.com/blog/heic-jpg-converter-free) |
| HEIC to PDF, arrange photos on A4 pages | The JPG-to-PDF workflow starts with supported raster formats. The new route decodes HEIC, accepts page order and fits each photo to portrait or landscape paper. | [iLoveDesk offers one photo per page and local processing](https://ilovedesk.com/heic-to-pdf/) |
| MP4 to GIF, trim a loop | The existing video converter lacks an animated GIF output. Two FFmpeg passes apply the selected clip, frame rate, dimensions and palette. | [Ezgif video-to-GIF](https://ezgif.com/video-to-gif) |
| Compress MP4 for sharing | Existing MP4 conversion uses fixed encoding settings. The compressor offers three quality levels and checks that the output is smaller. | [FreeConvert offers percentage targets and a larger input allowance](https://www.freeconvert.com/video-compressor) |
| Image to text, edit printed text | Image format conversion does not recognize text. The OCR workflow selects a language model, returns editable text and exports the visitor's corrections. | [OCR.Space includes language and orientation options](https://ocr.space/) |
| Compress animated GIF, preserve timing | Single-image re-encoding cannot retain a GIF timeline. The worker compares frame delays, loop count, dimensions and byte size before returning a result. | [Ezgif offers configurable Gifsicle optimization](https://ezgif.com/optimize) |
| SVG to transparent PNG at a specified width | Browser image conversion alone does not define which SVG features can render safely. This workflow validates a static subset, sets output size and provides a background option. | [SVGtoPNG offers browser-based conversion](https://svgtopng.com/) |
| AVIF to PNG for an editor | Native image decoder availability varies. A dedicated decoder checks for still AVIF and retains the alpha channel in PNG. | [CloudConvert provides a dedicated AVIF-to-PNG workflow](https://cloudconvert.com/avif-to-png) |
| PDF to plain text, distinguish a scan | Existing PDF-to-Word and PDF-to-JPG serve other output needs. Poppler extracts selectable text and the page directs scans to OCR. | [PDFtoText supports batch TXT and ZIP output](https://pdftotext.com/) |
| Remove photo location before sharing | Image compression does not give an explicit metadata guarantee. A fresh, local PNG export drops source EXIF/GPS tags and bakes in display orientation. | [IMGonline documents a JPEG metadata-removal workflow](https://www.imgonline.com.ua/eng/delete-exif.php) |

The page titles use local terminology, including *extraer texto*, *extrair texto*, and *استخراج النص*. Search Console reported no query rows for seven separate substring filters (heic, avif, gif, ocr, metadata, svg, pdf to text) from August 16 through November 16, 2026. This is a baseline for the existing site. The new pages were unpublished. No authenticated Bing query dataset was available.

After an approved release, group canonical URLs by tool and locale in Search Console and Bing Webmaster Tools. Check discovery, index status, impressions, clicks and device mix. Compare 28-day periods once impressions accumulate. Use the existing analytics' page views and the tool upload, attempt, success, failure and download events to distinguish search acquisition from completion. No new event contains source filenames, file contents or extracted text.

## Engineering and real-file verification

| Workflow | Evidence |
|---|---|
| HEIC to JPG | Independently reopened JPEGs from a generated color fixture and a real iPhone 13 Pro Max. The portrait phone photo yielded a 3024 × 4032 JPEG. The browser batch returned two separate downloads. |
| HEIC to PDF | Verified two A4 pages, page orientation and reversed selection order using independent PDF readers. |
| MP4 to GIF | Selected one second starting at second one. The test GIF decoded as ten frames at 160 × 90 pixels. |
| Video compressor | Reopened the smaller MP4 with FFprobe and verified H.264 video and AAC audio. |
| Image OCR | Four clean printed reference sentences, one in each language, matched after whitespace normalization. Browser tests edited and downloaded Arabic text. These samples establish functionality on clean print. Handwriting, photographs of pages and general-purpose accuracy require broader evaluation. |
| GIF compressor | Checked reduced bytes, six frames, nonuniform frame delays, loop count and transparent corners after optimization. |
| SVG to PNG | Chromium, Firefox and WebKit downloaded a 320 × 160 raster with the expected red center and transparent corner. Unsupported linked content was rejected with no outbound request. |
| AVIF to PNG | Verified PNG dimensions and a known partial alpha value. |
| PDF to text | Checked an expected phrase from a text PDF, the explicit no-text response for a scanned page and edited UTF-8 export. Mixed documents only yield text from existing text layers. |
| Photo metadata | Started with JPEG orientation and a GPS IFD. The downloaded PNG had the expected rotated dimensions, no source EXIF and no embedded test marker. Visible identifying details remain. |

Eight native workflows ran with one CPU and a 512 MiB container limit. The isolated API container reached approximately 132 MiB peak memory after the browser fixtures and the portrait iPhone conversion. This sample does not establish peak usage for all supported files. New native jobs reserve the shared processing capacity before uploads. Busy clients receive a retryable response. Video and OCR consume server CPU and temporary disk space. No paid per-file API is involved.

The mobile layout suite visited all 40 pages at 390 pixels in Chromium, Firefox and WebKit. Chromium exercised all ten downloads against a real local API. The other two engines exercised both browser-only exports. The axe WCAG A/AA checks reported zero violations in the new main content across all 40 pages at 360 pixels. These checks complement keyboard and RTL verification and do not certify screen-reader usability on every device.

Nine cold-cache Chromium lab samples covered English HEIC-to-PDF, Arabic MP4-to-GIF and Brazilian Portuguese SVG-to-PNG at 360 pixels, 4× CPU throttling, 100 ms latency and 1.6 Mbps download. Observed LCP ranged from 904 to 1040 ms and CLS from 0.0021 to 0.0262. Analytics and advertising requests were blocked during these measurements. Field Core Web Vitals and physical-device timings are unmeasured.

The existing npm suite passed 13 tests. The site checker validated 506 pages, 504 indexable URLs, canonical and reciprocal alternate links, assets, navigation, markup and sitemap coverage with zero warnings. The PR includes a production Docker build, native fixtures, limits and backwards-compatibility checks, and a real browser download job. The production dependency tree was updated within the existing Node package ranges. The subsequent npm audit reported zero known advisories.

The real phone sample is fetched only during QA and is verified by SHA-256. The workflow pins the source revision and does not publish the photo. [iPhone test fixture](https://github.com/ianare/exif-samples/blob/5332a9cf0220e9c6c93f88a187daa90808051e10/heic/mobile/iphone_13_pro_max.HEIC)

## Review before release

Rehearse a representative mix of uploads on a staging instance with the production resource limits. Measure queue rejections and p95 conversion time, particularly during simultaneous video and OCR requests. Review the localized workflows on physical iOS and Android devices. The draft PR is the review boundary. Production publication and indexing submissions require separate owner approval.
