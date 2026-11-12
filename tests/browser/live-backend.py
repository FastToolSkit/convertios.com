"""Manual, non-mocked production backend smoke using synthetic files.
Run only intentionally: python tests/browser/live-backend.py
Requires ffmpeg and requests; uses 1-second synthetic MP4 and a minimal PDF.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
import io, subprocess, os, requests, zipfile
API=os.getenv("CONVERTIOS_BACKEND","https://convertios-backend-sn5u.onrender.com")
TIMEOUT=65
def pdf_bytes():
    contents=b'BT /F1 18 Tf 72 700 Td (Convertios test) Tj ET'
    obj=[
      b'<< /Type /Catalog /Pages 2 0 R >>',
      b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
      f'<< /Length {len(contents)} >>\nstream\n'.encode()+contents+b'\nendstream',
      b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>']
    chunks=[b'%PDF-1.4\n'];offsets=[]
    for i,o in enumerate(obj,1):
        offsets.append(sum(map(len,chunks)))
        chunks.append(f'{i} 0 obj\n'.encode()+o+b'\nendobj\n')
    start=sum(map(len,chunks))
    chunks.append(f'xref\n0 {len(obj)+1}\n0000000000 65535 f \n'.encode())
    chunks.extend(f'{x:010d} 00000 n \n'.encode() for x in offsets)
    chunks.append(f'trailer\n<< /Size {len(obj)+1} /Root 1 0 R >>\nstartxref\n{start}\n%%EOF'.encode())
    return b''.join(chunks)
def post(path,files,data=None):
    r=requests.post(API+path, files=files, data=data, timeout=TIMEOUT)
    if not r.ok:raise RuntimeError(f'{path} returned HTTP {r.status_code} {r.text[:200]}')
    return r
r=requests.get(API+'/health',timeout=TIMEOUT)
r.raise_for_status()
print('BACKEND HEALTH',r.status_code,r.json().get('version'),flush=True)
doc=post('/convert/pdf-to-word',{'file':('convertios-test.pdf',pdf_bytes(),'application/pdf')})
assert doc.content[:2]==b'PK'
with zipfile.ZipFile(io.BytesIO(doc.content)) as z:
    assert 'word/document.xml' in z.namelist()
print('PASS real backend PDF to Word',len(doc.content),flush=True)
with TemporaryDirectory() as d:
    vid=Path(d)/'qa.mp4'
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-nostdin','-y',
                    '-f','lavfi','-i','color=c=blue:s=160x90:r=10:d=1',
                    '-f','lavfi','-i','sine=frequency=440:sample_rate=44100:duration=1',
                    '-c:v','libx264','-pix_fmt','yuv420p','-c:a','aac','-shortest',str(vid)],
                  check=True,timeout=25)
    data=vid.read_bytes()
    print('SYNTHETIC MP4',len(data),flush=True)
    audio=post('/convert/video-to-mp3',{'file':('qa.mp4',data,'video/mp4')})
    assert audio.content[:3]==b'ID3' or audio.content[:2]==b'\xff\xfb'
    print('PASS real backend video to MP3',len(audio.content),flush=True)
    video=post('/convert/video',{'file':('qa.mp4',data,'video/mp4')},data={'format':'webm'})
    assert video.content[:4]==b'\x1a\x45\xdf\xa3',video.content[:20]
    print('PASS real backend video to WebM',len(video.content),flush=True)
print('ALL BACKEND REAL-FILE CHECKS PASSED')
