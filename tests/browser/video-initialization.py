"""CV-001 real-file regression. No success responses or media outputs are mocked.

Requires npm ci, Python Playwright+browsers, Pillow, FFmpeg/FFprobe.
Local mode serves this checkout and runs its unchanged Node/FFmpeg backend.
  python tests/browser/video-initialization.py --ffmpeg /path/to/ffmpeg
  --fixtures-dir DIR reuses the November audit's video.mp4 and corrupt.mp4.
  --evidence-dir DIR keeps logs/screenshots/downloads outside published source.
  --live-backend-preview privately serves only the six patched HTML responses
  at their production URLs; six real production backend requests, no deployment.
"""
import argparse
import array
import contextlib
import hashlib
import io
import json
import math
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

from PIL import Image, ImageStat
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
PRODUCTION = 'https://convertios.com'
API = 'https://convertios-backend-sn5u.onrender.com'
FORMATS = ['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v', 'mpg', 'mpeg', 'flv', 'wmv', '3gp', 'ogv', 'ts']


def command(args):
    return subprocess.run([str(x) for x in args], capture_output=True, check=True, timeout=40).stdout


def validate_media(file, video, ffmpeg, ffprobe):
    probe = json.loads(command([ffprobe, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]))
    streams = probe['streams']
    duration = float(probe['format']['duration'])
    assert abs(duration - 3) < 0.25, duration
    audio = [s for s in streams if s['codec_type'] == 'audio']
    visual = [s for s in streams if s['codec_type'] == 'video']
    assert audio and audio[0]['codec_name'] == ('opus' if video else 'mp3'), streams
    if video:
        assert visual and visual[0]['codec_name'] == 'vp9', streams
        assert (visual[0]['width'], visual[0]['height']) == (320, 240), streams
        frame = command([ffmpeg, '-v', 'error', '-i', file, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'])
        image = Image.open(io.BytesIO(frame))
        image.load()
        assert max(ImageStat.Stat(image.convert('RGB')).stddev) > 5, 'Blank video frame'
        file.with_suffix('.frame.png').write_bytes(frame)
    else:
        assert not visual, streams
    # Decode the whole file, not just the container header or first frame.
    command([ffmpeg, '-v', 'error', '-i', file, '-f', 'null', '-'])
    pcm = command([ffmpeg, '-v', 'error', '-i', file, '-vn', '-ac', '1', '-ar', '8000', '-f', 's16le', '-'])
    samples = array.array('h', pcm)
    if sys.byteorder != 'little':
        samples.byteswap()
    rms = math.sqrt(sum(x * x for x in samples) / len(samples))
    crossings = sum(a <= 0 < b for a, b in zip(samples, samples[1:]))
    frequency = crossings / (len(samples) / 8000)
    assert rms > 100 and abs(frequency - 440) < 10, (rms, frequency)
    return {'duration': duration, 'streams': streams, 'rms': rms, 'test_tone_hz': frequency,
            'full_decode': 'PASS', 'bytes': file.stat().st_size,
            'sha256': hashlib.sha256(file.read_bytes()).hexdigest()}


class QuietFiles(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


@contextlib.contextmanager
def backend(origin, ffmpeg, log):
    env = {**os.environ, 'EXTRA_ALLOWED_ORIGINS': origin,
           'PATH': str(ffmpeg.parent) + os.pathsep + os.environ.get('PATH', '')}
    code = "const {app}=require(process.argv[1]);const s=app.listen(0,'127.0.0.1',()=>console.log(JSON.stringify({port:s.address().port})));"
    with log.open('w', encoding='utf-8') as errors:
        process = subprocess.Popen(['node', '-e', code, str(ROOT / 'server.js')], env=env,
                                   stdout=subprocess.PIPE, stderr=errors, text=True, encoding='utf-8')
        try:
            ready = json.loads(process.stdout.readline())
            yield f'http://127.0.0.1:{ready["port"]}'
        finally:
            process.terminate()
            process.wait(timeout=10)


def geometry(page):
    return page.evaluate('''()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
      header:!!document.querySelector('header .logo'),footer:!!document.querySelector('footer .footer-container'),
      dir:document.documentElement.dir,mode:document.body.dataset.videoMode,locale:document.body.dataset.locale,
      canonical:document.querySelector('link[rel=canonical]').href,
      hiddenControls:[...document.querySelectorAll('.video-action,.video-settings select')].filter(e=>{
       let r=e.getBoundingClientRect();return !r.width||!r.height||r.left< -2||r.right>innerWidth+2}).map(e=>e.id)})''')


def seo_snapshot(page):
    return page.evaluate('''()=>({title:document.title,
      meta:[...document.querySelectorAll('head meta[name],head meta[property]')].map(e=>e.outerHTML),
      links:[...document.querySelectorAll('head link[rel=canonical],head link[rel=alternate]')].map(e=>e.outerHTML),
      schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>e.textContent)})''')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ffmpeg', default=shutil.which('ffmpeg'))
    parser.add_argument('--fixtures-dir', type=Path)
    parser.add_argument('--evidence-dir', type=Path, default=ROOT / 'test-results/cv-001')
    parser.add_argument('--live-backend-preview', action='store_true')
    args = parser.parse_args()
    assert args.ffmpeg, 'Supply --ffmpeg or add FFmpeg to PATH'
    ffmpeg = Path(args.ffmpeg).resolve()
    ffprobe = ffmpeg.with_name('ffprobe' + ffmpeg.suffix)
    evidence = args.evidence_dir.resolve()
    evidence.mkdir(parents=True, exist_ok=True)
    fixtures = args.fixtures_dir.resolve() if args.fixtures_dir else evidence / 'fixtures'
    fixtures.mkdir(parents=True, exist_ok=True)
    video = fixtures / 'video.mp4'
    if not video.exists():
        command([ffmpeg, '-v', 'error', '-nostdin', '-y', '-f', 'lavfi', '-i',
                 'testsrc=size=320x240:rate=15:duration=3', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=3',
                 '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest', video])
    corrupt = evidence / 'corrupt.mp4'
    corrupt.write_bytes(b'\x00\x00\x00\x18ftypmp42invalid')
    unsupported = evidence / 'unsupported.txt'
    unsupported.write_text('Disposable CV-001 invalid video fixture.', encoding='utf-8')
    (evidence / 'fixture.json').write_text(json.dumps({'path': str(video), 'sha256': hashlib.sha256(video.read_bytes()).hexdigest(),
        'probe': json.loads(command([ffprobe, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', video]))}, indent=2))

    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietFiles, directory=str(ROOT)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    local = f'http://127.0.0.1:{server.server_port}'
    records = []
    engines = ['chromium'] if args.live_backend_preview else ['chromium', 'firefox', 'webkit']
    viewports = [(1536, 768)] if args.live_backend_preview else [(1536, 768), (390, 844)]
    try:
        with sync_playwright() as playwright:
            for engine in engines:
                browser = getattr(playwright, engine).launch()
                for width, height in viewports:
                    for lang in ['en', 'es', 'ar']:
                        prefix = '' if lang == 'en' else lang + '/'
                        group = evidence / engine / f'{width}x{height}' / lang
                        group.mkdir(parents=True, exist_ok=True)
                        # Fresh local limiter state per pair: 2 valid + 2 corrupt requests < 10/15min.
                        with (contextlib.nullcontext(None) if args.live_backend_preview else
                              backend(local, ffmpeg, group / 'backend.log')) as local_api:
                            context = browser.new_context(accept_downloads=True,
                                viewport={'width': width, 'height': height}, has_touch=width < 768)
                            if local_api:
                                # Configure only the test response's backend origin. A route.fetch
                                # relay can lose binary multipart data; let the browser upload directly.
                                ui = (ROOT / 'js/tool-ui.js').read_text(encoding='utf-8')
                                assert ui.count(API) == 1
                                configured_ui = ui.replace(API, local_api)
                                context.route(local + '/js/tool-ui.js*', lambda route:
                                    route.fulfill(status=200, content_type='text/javascript; charset=utf-8', body=configured_ui))
                                context.route(API + '/**', lambda route: route.abort('blockedbyclient'))
                            elif args.live_backend_preview:
                                def preview(route):
                                    relative = route.request.url.removeprefix(PRODUCTION + '/').split('?')[0]
                                    route.fulfill(status=200, content_type='text/html; charset=utf-8',
                                                  body=(ROOT / relative / 'index.html').read_bytes())
                                for slug in ['video-converter', 'video-to-mp3']:
                                    context.route(PRODUCTION + '/' + prefix + slug + '/', preview)
                            for slug, mode in [('video-converter', 'video'), ('video-to-mp3', 'mp3')]:
                                page = context.new_page()
                                page.set_default_timeout(20000)
                                page.set_default_navigation_timeout(35000)
                                url = (PRODUCTION if args.live_backend_preview else local) + '/' + prefix + slug + '/'
                                rec = {'tool': slug, 'language': lang, 'browser': engine, 'version': browser.version,
                                       'viewport': [width, height], 'url': url,
                                       'backend': 'real production' if args.live_backend_preview else 'real local Node/FFmpeg',
                                       'private_patched_preview': args.live_backend_preview, 'checks': {}}
                                errors, downloads, requests = [], [], []
                                page.on('pageerror', lambda error: errors.append(str(error)))
                                page.on('download', lambda download: downloads.append(download.suggested_filename))
                                page.on('request', lambda request: requests.append({'url': request.url, 'method': request.method}) if request.url.startswith(API) or (local_api and request.url.startswith(local_api)) else None)
                                try:
                                    assert page.goto(url, wait_until='domcontentloaded').status == 200
                                    page.wait_for_function("typeof ConvertiosUI !== 'undefined'")
                                    assert page.locator('body').get_attribute('data-video-mode') == mode
                                    assert page.locator('body').get_attribute('data-locale') == lang
                                    assert page.locator('#videoConvert').is_disabled()
                                    if mode == 'video':
                                        assert page.locator('#videoFormat option').evaluate_all('(els)=>els.map(x=>x.value)') == FORMATS
                                    else:
                                        assert page.locator('#videoFormat').count() == 0
                                    rec['checks']['initialization'] = 'PASS'
                                    header = page.locator('header').inner_html()
                                    footer = page.locator('footer').inner_html()
                                    head = seo_snapshot(page)
                                    layouts = []
                                    for w, h in [(1536, 768), (1366, 768), (768, 1024), (390, 844), (360, 800)]:
                                        page.set_viewport_size({'width': w, 'height': h})
                                        data = geometry(page)
                                        assert data['overflow'] <= 2 and data['header'] and data['footer'] and not data['hiddenControls'], data
                                        assert data['canonical'] == PRODUCTION + '/' + prefix + slug + '/', data
                                        if lang == 'ar':
                                            assert data['dir'] == 'rtl'
                                        layouts.append({'viewport': [w, h], **data})
                                    rec['checks']['layouts'] = layouts
                                    page.set_viewport_size({'width': width, 'height': height})

                                    page.locator('#videoFile').set_input_files(str(unsupported))
                                    assert page.locator('#videoConvert').is_disabled()
                                    page.locator('#toolMessage').wait_for(state='visible')
                                    rejection = page.locator('#toolMessage').inner_text()
                                    assert rejection == page.evaluate("ConvertiosUI.t('badType')"), rejection
                                    assert not downloads
                                    rec['checks']['unsupported_file'] = rejection
                                    if not args.live_backend_preview:
                                        page.locator('#videoFile').set_input_files(str(corrupt))
                                        assert not page.locator('#videoConvert').is_disabled()
                                        page.locator('#videoConvert').click()
                                        page.locator('#toolMessage .tool-retry-button').wait_for(timeout=45000)
                                        page.wait_for_function("!document.getElementById('videoConvert').disabled")
                                        assert not downloads, downloads
                                        assert not page.locator('#videoProgress').is_visible()
                                        rec['checks']['corrupt_file'] = page.locator('#toolMessage').inner_text()

                                    page.locator('#videoFile').set_input_files(str(video))
                                    assert not page.locator('#videoConvert').is_disabled()
                                    if mode == 'video':
                                        page.locator('#videoFormat').select_option('webm')
                                    with page.expect_download(timeout=180000) as pending:
                                        page.locator('#videoConvert').click()
                                    output = group / (slug + '-' + pending.value.suggested_filename)
                                    pending.value.save_as(output)
                                    assert output.suffix == ('.webm' if mode == 'video' else '.mp3'), output
                                    rec['checks']['output'] = validate_media(output, mode == 'video', ffmpeg, ffprobe)
                                    page.wait_for_function("!document.getElementById('videoConvert').disabled")
                                    assert len(downloads) == 1, downloads
                                    assert page.locator('header').inner_html() == header
                                    assert page.locator('footer').inner_html() == footer
                                    assert seo_snapshot(page) == head
                                    assert not errors, errors
                                    rec['checks']['chrome_and_metadata_unchanged'] = 'PASS'
                                    rec['status'] = 'PASS'
                                except Exception as error:
                                    rec.update(status='FAIL', error=str(error))
                                rec.update(page_errors=errors, backend_requests=requests)
                                try:
                                    page.evaluate('()=>{window.scrollTo(0,0)}')
                                    page.screenshot(path=str(group / (slug + '.png')), full_page=True)
                                except Exception:
                                    pass
                                (group / (slug + '.json')).write_text(json.dumps(rec, ensure_ascii=False, indent=2), encoding='utf-8')
                                records.append(rec)
                                (evidence / 'results.json').write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
                                print(rec['status'], engine, width, lang, slug, rec.get('error', ''), flush=True)
                                page.close()
                            context.close()
                browser.close()
    finally:
        server.shutdown()
        server.server_close()
    failures = sum(rec['status'] != 'PASS' for rec in records)
    print(f'{len(records) - failures}/{len(records)} real-file workflows passed', flush=True)
    return bool(failures)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    raise SystemExit(main())
