"""Real end-to-end artifact HTTP acceptance against a running Convertios backend."""
import io
import json
import os
from pathlib import Path
import sys
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfgen import canvas
from openpyxl import load_workbook
from pypdf import PdfReader

BASE = (sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:3000').rstrip('/')

def post(tool, fields, file=None):
    boundary = 'ConvertiosFixtureBound19Nov'
    buf = io.BytesIO()
    for name, val in fields.items():
        buf.write(('--'+boundary+'\r\nContent-Disposition: form-data; name="'+name+'"\r\n\r\n'+str(val)+'\r\n').encode('utf-8'))
    if file:
        filename, data, mime = file
        buf.write(('--'+boundary+'\r\nContent-Disposition: form-data; name="file"; filename="'+filename+'"\r\nContent-Type: '+mime+'\r\n\r\n').encode())
        buf.write(data)
        buf.write(b'\r\n')
    buf.write(('--'+boundary+'--\r\n').encode())
    req = Request(BASE+'/convert/artifact/'+tool, data=buf.getvalue(), method='POST',
                  headers={'Content-Type':'multipart/form-data; boundary='+boundary})
    try:
        with urlopen(req, timeout=135) as response:
            body=response.read()
            assert response.status==200
            return body
    except HTTPError as e:
        raise AssertionError(f'{tool}: HTTP {e.code}: {e.read()[:250]!r}') from e

def pdf(data):
    assert data.startswith(b'%PDF-'), 'Not a real PDF'
    return PdfReader(io.BytesIO(data))

inv=dict(seller='Acme Inc',customer='Client Ltd',number='INV-42',issued='2026-11-19',due='2026-12-19',currency='USD',
         items=[dict(description='Design work',quantity='3',unitPrice='19.99',taxRate='8.25')])
invoice=post('invoice-generator', {'invoice':json.dumps(inv)})
inv_pdf=pdf(invoice)
assert 'INV-42' in inv_pdf.pages[0].extract_text()
assert '64.92' in inv_pdf.pages[0].extract_text()
print('HTTP invoice PDF:',len(invoice),'bytes; extracted totals correct',flush=True)

xlsx=post('csv-xlsx-converter',{'direction':'csv-xlsx'},('data.csv',b'Name,Value\nAlice,=1+1\nBob,"a,b"\n','text/csv'))
wb=load_workbook(io.BytesIO(xlsx))
assert wb['Data']['B2'].data_type=='s'
assert wb['Data']['B3'].value=='a,b'
csv=post('csv-xlsx-converter',{'direction':'xlsx-csv','sheet':'Data'},('result.xlsx',xlsx,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
assert b"'=1+1" in csv and b'a,b' in csv
print('HTTP CSV/XLSX round trip:',len(xlsx),'bytes; cells and formula protection correct',flush=True)

noise=Image.effect_noise((1800,1800),100).convert('RGB')
image=io.BytesIO(); noise.save(image,format='PNG')
raw=io.BytesIO()
c=canvas.Canvas(raw,pagesize=(595,842)); c.drawInlineImage(noise,20,20,555,800); c.showPage();c.save()
original=raw.getvalue()
compressed=post('compress-pdf',{'preset':'small'},('big.pdf',original,'application/pdf'))
assert len(compressed)<len(original),(len(compressed),len(original))
assert len(pdf(compressed).pages)==1
print('HTTP PDF compression:',len(original),'->',len(compressed),'bytes',flush=True)

image=Image.new('RGB',(1200,1600),'white')
draw=ImageDraw.Draw(image)
font=ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf',60)
draw.text((90,160),'Searchable invoice 2026',font=font,fill='black')
scan=io.BytesIO();image.save(scan,'PDF',resolution=160)
searchable=post('searchable-pdf-ocr',{'lang':'eng'},('scan.pdf',scan.getvalue(),'application/pdf'))
page=pdf(searchable).pages[0]
assert 'Searchable' in page.extract_text(),repr(page.extract_text()[:100])
assert abs(float(page.mediabox.width)-float(pdf(scan.getvalue()).pages[0].mediabox.width))<1
print('HTTP searchable OCR PDF:',len(searchable),'bytes; real selectable text found',flush=True)
print('All four real HTTP artifact workflows passed.',flush=True)
