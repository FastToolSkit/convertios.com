"""Artifact checks. Run in the production Python image to exercise every processor."""
import importlib.util
import os
from pathlib import Path
import shutil
import sys
from tempfile import TemporaryDirectory
import unittest
from zipfile import ZipFile, ZIP_DEFLATED

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'backend'))
from utility_artifacts import Rejected, check_xlsx, compress_pdf, invoice, pdf_pages, prepare_invoice, searchable_pdf, workbook


class ArtifactTests(unittest.TestCase):
    def setUp(self):
        self.temp = TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def sample_invoice(self):
        return dict(seller='Acme LLC\nAmman', customer='Client Ltd\nMadrid', number='INV-2026-42',
                    issued='2026-11-19', due='2026-12-19', currency='USD',
                    items=[dict(description='Design work', quantity='3', unitPrice='19.99', taxRate='8.25'),
                           dict(description='Fractional work', quantity='0.25', unitPrice='0.10', taxRate='10')])

    def test_invoice_cent_rounding_and_validation(self):
        values = prepare_invoice(self.sample_invoice())
        self.assertEqual(str(values[7]), '60.00')
        self.assertEqual(str(values[8]), '4.95')
        self.assertEqual(str(values[7] + values[8]), '64.95')
        bad = self.sample_invoice()
        bad['items'][0]['unitPrice'] = '1.001'
        with self.assertRaises(Rejected): prepare_invoice(bad)
        bad = self.sample_invoice()
        bad['due'] = '2026-01-01'
        with self.assertRaises(Rejected): prepare_invoice(bad)

    @unittest.skipUnless(importlib.util.find_spec('reportlab') and importlib.util.find_spec('arabic_reshaper')
                         and (Path('/usr/share/fonts/truetype/noto/NotoNaskhArabic-Regular.ttf').is_file()
                              or (os.environ.get('CONVERTIOS_LATIN_FONT') and os.environ.get('CONVERTIOS_ARABIC_FONT')
                                  and Path(os.environ['CONVERTIOS_LATIN_FONT']).is_file()
                                  and Path(os.environ['CONVERTIOS_ARABIC_FONT']).is_file())),
                         'PDF renderer and suitable fonts unavailable locally')
    def test_invoice_pdf_text_geometry_totals_and_logo(self):
        from PIL import Image
        from pypdf import PdfReader
        logo = self.root / 'logo.png'
        Image.new('RGB', (100, 40), 'navy').save(logo)
        data = self.sample_invoice()
        data['seller'] += '\nشركة عربية'
        output = self.root / 'invoice.pdf'
        invoice(data, logo, output)
        self.assertTrue(output.read_bytes().startswith(b'%PDF-'))
        doc = PdfReader(output)
        self.assertEqual(len(doc.pages), 1)
        page = doc.pages[0]
        content = page.extract_text()
        for word in ('INV-2026-42', 'Design work', 'Subtotal', '60.00', '4.95', '64.95'):
            self.assertIn(word, content)
        self.assertAlmostEqual(float(page.mediabox.width), 595.28, places=1)
        self.assertAlmostEqual(float(page.mediabox.height), 841.89, places=1)
        positions = []
        page.extract_text(visitor_text=lambda _txt, _cm, tm, _font, _size: positions.append((tm[4], tm[5])))
        self.assertTrue(positions)
        self.assertTrue(all(-1 <= x <= 596 and -1 <= y <= 842 for x,y in positions))
        self.assertTrue(page.images)

    def test_xlsx_zip_expansion_and_external_links_rejected(self):
        bomb = self.root / 'bomb.xlsx'
        with ZipFile(bomb, 'w', ZIP_DEFLATED) as archive:
            archive.writestr('xl/workbook.xml', b'0' * (2 * 1024 * 1024))
        with self.assertRaises(Rejected): check_xlsx(bomb)
        external = self.root / 'external.xlsx'
        with ZipFile(external, 'w', ZIP_DEFLATED) as archive:
            archive.writestr('xl/workbook.xml', 'x')
            archive.writestr('xl/externalLinks/externalLink1.xml', 'x')
        with self.assertRaises(Rejected): check_xlsx(external)

    @unittest.skipUnless(importlib.util.find_spec('openpyxl'), 'openpyxl unavailable locally')
    def test_real_workbook_and_sheet_csv(self):
        from openpyxl import load_workbook
        source = self.root / 'source.csv'
        source.write_text('Name,Value\nAlice,=1+1\nBob,"a,b"\n', encoding='utf-8')
        xlsx = self.root / 'result.xlsx'
        workbook(source, xlsx, {'direction':'csv-xlsx'})
        self.assertEqual(xlsx.read_bytes()[:2], b'PK')
        book = load_workbook(xlsx)
        self.assertEqual(book['Data']['B2'].value, '=1+1')
        self.assertEqual(book['Data']['B2'].data_type, 's')
        self.assertEqual(book['Data']['B3'].value, 'a,b')
        # The writer uses streaming mode: imported worksheet dimensions may be absent.
        stream_roundtrip = self.root / 'stream-roundtrip.csv'
        workbook(xlsx, stream_roundtrip, {'direction':'xlsx-csv','sheet':'Data'})
        self.assertIn("'=1+1", stream_roundtrip.read_text('utf-8-sig'))
        book.create_sheet('Other')['A1'] = '=HYPERLINK("https://example.com")'
        book.save(xlsx)
        # Production multer uploads have generated names with no .xlsx extension.
        upload = self.root / 'upload-without-extension'
        upload.write_bytes(xlsx.read_bytes())
        listing = self.root / 'sheets.json'
        workbook(upload, listing, {'direction':'xlsx-csv'}, list_only=True)
        self.assertIn('Other', listing.read_text('utf-8'))
        csv = self.root / 'result.csv'
        workbook(upload, csv, {'direction':'xlsx-csv','sheet':'Data'})
        self.assertIn("'=1+1", csv.read_text('utf-8-sig'))
        with self.assertRaises(Rejected): workbook(xlsx, csv, {'direction':'xlsx-csv','sheet':'missing'})

    @unittest.skipUnless(importlib.util.find_spec('pypdf'), 'pypdf unavailable')
    def test_pdf_page_limits(self):
        from pypdf import PdfWriter
        pdf = self.root / 'source.pdf'
        writer = PdfWriter()
        writer.add_blank_page(width=300, height=400)
        writer.write(pdf)
        self.assertEqual(len(pdf_pages(pdf, 10).pages), 1)
        with self.assertRaises(Rejected): pdf_pages(pdf, 0)
        huge = self.root / 'huge.pdf'
        writer = PdfWriter()
        writer.add_blank_page(width=10000, height=10000)
        writer.write(huge)
        with self.assertRaises(Rejected): pdf_pages(huge, 10)

    @unittest.skipUnless(importlib.util.find_spec('reportlab') and shutil.which('gs'),
                         'Ghostscript/ReportLab unavailable locally')
    def test_compression_measures_gain_and_preserves_pages(self):
        from PIL import Image
        from reportlab.pdfgen import canvas
        from pypdf import PdfReader
        image = self.root / 'large.png'
        Image.effect_noise((1800, 1800), 100).convert('RGB').save(image)
        original = self.root / 'image.pdf'
        c = canvas.Canvas(str(original), pagesize=(595,842))
        c.drawImage(str(image), 20, 20, 555, 800)
        c.showPage(); c.save()
        output = self.root / 'small.pdf'
        compress_pdf(original, output, {'preset':'small'})
        self.assertLess(output.stat().st_size, original.stat().st_size)
        self.assertEqual(len(PdfReader(output).pages), 1)
        self.assertAlmostEqual(float(PdfReader(output).pages[0].mediabox.width), 595, places=0)

    @unittest.skipUnless(importlib.util.find_spec('pypdf') and shutil.which('pdftoppm') and shutil.which('tesseract'),
                         'Poppler/Tesseract unavailable locally')
    def test_scanned_pdf_becomes_searchable(self):
        from PIL import Image, ImageDraw, ImageFont
        from pypdf import PdfReader
        image = Image.new('RGB', (1200, 1600), 'white')
        draw = ImageDraw.Draw(image)
        font = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf', 60)
        for y, line in ((130, 'Searchable invoice 2026'), (310, 'Customer Acme Company'),
                        (490, 'Total amount 125 dollars')):
            draw.text((90, y), line, fill='black', font=font)
        source = self.root / 'scan.pdf'
        image.save(source, 'PDF', resolution=160)
        output = self.root / 'searchable.pdf'
        old = Path.cwd()
        try:
            os.chdir(self.root)
            searchable_pdf(source, output, {'lang':'eng'})
        finally:
            os.chdir(old)
        page = PdfReader(output).pages[0]
        self.assertIn('Searchable', page.extract_text())
        self.assertAlmostEqual(float(page.mediabox.width), float(PdfReader(source).pages[0].mediabox.width), delta=1)
        self.assertAlmostEqual(float(page.mediabox.height), float(PdfReader(source).pages[0].mediabox.height), delta=1)


if __name__ == '__main__': unittest.main()
