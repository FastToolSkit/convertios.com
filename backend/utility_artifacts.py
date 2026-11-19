"""Bounded artifact processors. Called only with generated paths in a disposable job directory."""
import csv
from datetime import date
from decimal import Decimal, ROUND_HALF_UP
import io
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import zipfile

MIB = 1024 * 1024


class Rejected(ValueError):
    pass


def need(condition, code="INVALID_FILE"):
    if not condition:
        raise Rejected(code)


def run_command(args, timeout=60):
    try:
        subprocess.run(args, check=True, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                       stderr=subprocess.DEVNULL, timeout=timeout)
    except subprocess.TimeoutExpired as exc:
        raise Rejected("TIMEOUT") from exc
    except (subprocess.CalledProcessError, OSError) as exc:
        raise Rejected("INVALID_FILE") from exc


def text(value, limit=200, required=False):
    need(isinstance(value, str) and len(value) <= limit, "BAD_OPTIONS")
    value = value.strip()
    need(not required or bool(value), "BAD_OPTIONS")
    need(not any(ord(c) < 32 and c not in "\n\t" for c in value), "BAD_OPTIONS")
    return value


def money(value, maximum=1_000_000):
    need(isinstance(value, (str, int)) and not isinstance(value, bool), "BAD_OPTIONS")
    raw = str(value)
    need(bool(re.fullmatch(r"\d{1,7}(?:\.\d{1,2})?", raw)), "BAD_OPTIONS")
    amount = Decimal(raw)
    need(amount <= maximum, "BAD_OPTIONS")
    return amount


def prepare_invoice(data):
    need(isinstance(data, dict), "BAD_OPTIONS")
    seller = text(data.get("seller", ""), 500, True)
    customer = text(data.get("customer", ""), 500, True)
    number = text(data.get("number", ""), 60, True)
    currency = text(data.get("currency", "USD"), 3)
    need(bool(re.fullmatch(r"[A-Z]{3}", currency)), "BAD_OPTIONS")
    issued = text(data.get("issued", ""), 10, True)
    due = text(data.get("due", ""), 10)
    try:
        date.fromisoformat(issued)
        if due:
            need(date.fromisoformat(due) >= date.fromisoformat(issued), "BAD_OPTIONS")
    except ValueError as exc:
        raise Rejected("BAD_OPTIONS") from exc
    items = data.get("items")
    need(isinstance(items, list) and 1 <= len(items) <= 40, "BAD_OPTIONS")
    prepared = []
    subtotal = tax_total = Decimal("0.00")
    for item in items:
        need(isinstance(item, dict), "BAD_OPTIONS")
        desc = text(item.get("description", ""), 160, True)
        quantity = money(item.get("quantity", ""), 10000)
        need(quantity > 0, "BAD_OPTIONS")
        unit = money(item.get("unitPrice", ""))
        tax = money(item.get("taxRate", "0"), 100)
        line = (quantity * unit).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        line_tax = (line * tax / 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        subtotal += line
        tax_total += line_tax
        prepared.append((desc, quantity, unit, tax, line, line_tax))
    need(subtotal + tax_total <= 10_000_000, "BAD_OPTIONS")
    notes = text(data.get("notes", ""), 500)
    return seller, customer, number, currency, issued, due, prepared, subtotal, tax_total, notes


def invoice(data, logo, output):
    from PIL import Image, ImageFile
    from reportlab.lib.utils import ImageReader
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.pdfgen import canvas

    seller, customer, number, currency, issued, due, prepared, subtotal, tax_total, notes = prepare_invoice(data)

    # Production uses the Noto fonts installed in Docker; local QA can supply
    # equivalent fonts without modifying system directories.
    font_root = Path("/usr/share/fonts/truetype/noto")
    latin = Path(os.environ.get("CONVERTIOS_LATIN_FONT", str(font_root / "NotoSans-Regular.ttf")))
    arabic = Path(os.environ.get("CONVERTIOS_ARABIC_FONT", str(font_root / "NotoNaskhArabic-Regular.ttf")))
    need(latin.is_file() and arabic.is_file(), "FONT_UNAVAILABLE")
    pdfmetrics.registerFont(TTFont("InvoiceLatin", str(latin)))
    pdfmetrics.registerFont(TTFont("InvoiceArabic", str(arabic)))
    import arabic_reshaper
    from bidi.algorithm import get_display

    def shaped(value):
        value = str(value)
        is_arabic = bool(re.search(r"[\u0600-\u06ff]", value))
        return (get_display(arabic_reshaper.reshape(value)) if is_arabic else value,
                "InvoiceArabic" if is_arabic else "InvoiceLatin")

    def draw(c, value, x, y, size=10, align="left"):
        value, font = shaped(value)
        c.setFont(font, size)
        if align == "right":
            c.drawRightString(x, y, value)
        else:
            c.drawString(x, y, value)

    def wrap(value, width, size, maximum):
        lines = []
        for paragraph in value.splitlines():
            current = ""
            for word in paragraph.split():
                candidate = (current + " " + word).strip()
                display, font = shaped(candidate)
                if pdfmetrics.stringWidth(display, font, size) <= width:
                    current = candidate
                else:
                    need(bool(current), "BAD_OPTIONS")
                    lines.append(current)
                    current = word
                    display, font = shaped(current)
                    need(pdfmetrics.stringWidth(display, font, size) <= width, "BAD_OPTIONS")
            lines.append(current)
        need(len(lines) <= maximum, "BAD_OPTIONS")
        return lines

    c = canvas.Canvas(str(output), pagesize=(595.28, 841.89), pageCompression=1)
    c.setTitle("Invoice " + number)
    y = 790
    draw(c, "INVOICE", 40, y, 22)
    if logo:
        Image.MAX_IMAGE_PIXELS = 2_000_000
        ImageFile.LOAD_TRUNCATED_IMAGES = False
        try:
            with Image.open(logo) as image:
                need(image.format in {"PNG", "JPEG"} and image.width * image.height <= 2_000_000)
                image.load()
                rgb = image.convert("RGB")
                rgb.thumbnail((600, 180))
                c.drawImage(ImageReader(rgb), 420, 754, width=130, height=48, preserveAspectRatio=True, anchor="c")
        except (OSError, ValueError) as exc:
            raise Rejected("INVALID_FILE") from exc
    y -= 46
    for label, value in (("Invoice #", number), ("Issued", issued), ("Due", due or "—"), ("Currency", currency)):
        draw(c, label, 40, y, 9)
        draw(c, value, 180, y, 10)
        y -= 19
    y -= 15
    draw(c, "FROM", 40, y, 9)
    draw(c, "BILL TO", 310, y, 9)
    left, right = wrap(seller, 245, 10, 5), wrap(customer, 245, 10, 5)
    for i in range(max(len(left), len(right))):
        y -= 17
        if i < len(left):
            draw(c, left[i], 40, y)
        if i < len(right):
            draw(c, right[i], 310, y)
    y -= 38

    def heading():
        nonlocal y
        c.setFillColorRGB(.92, .95, .97)
        c.rect(40, y - 6, 515, 25, stroke=0, fill=1)
        c.setFillColorRGB(0, 0, 0)
        for label, x, align in (("Description", 45, "left"), ("Qty", 312, "right"),
                                ("Unit", 378, "right"), ("Tax %", 442, "right"), ("Amount", 548, "right")):
            draw(c, label, x, y + 2, 8, align)
        y -= 30

    heading()
    for desc, qty, unit, rate, line, _line_tax in prepared:
        description_lines = wrap(desc, 255, 9, 3)
        if y < 115:
            c.showPage()
            y = 790
            heading()
        for index, description_line in enumerate(description_lines):
            draw(c, description_line, 45, y - index * 13, 9)
        draw(c, str(qty), 312, y, 9, "right")
        draw(c, f"{unit:.2f}", 378, y, 9, "right")
        draw(c, str(rate), 442, y, 9, "right")
        draw(c, f"{line:.2f}", 548, y, 9, "right")
        y -= max(22, len(description_lines) * 13 + 7)
    if y < 145:
        c.showPage()
        y = 790
    y -= 14
    for label, amount in (("Subtotal", subtotal), ("Tax", tax_total), ("Total", subtotal + tax_total)):
        draw(c, label, 380, y, 10)
        draw(c, f"{currency} {amount:.2f}", 548, y, 10, "right")
        y -= 21
    if notes:
        y -= 18
        draw(c, "Notes", 40, y, 9)
        for line in wrap(notes, 510, 9, 8):
            y -= 17
            if y < 50:
                c.showPage()
                y = 790
            draw(c, line, 40, y, 9)
    c.save()


def check_xlsx(path):
    need(path.stat().st_size <= 6 * MIB)
    try:
        with zipfile.ZipFile(path) as archive:
            entries = archive.infolist()
            need(0 < len(entries) <= 200 and any(i.filename == "xl/workbook.xml" for i in entries))
            need(sum(i.file_size for i in entries) <= 24 * MIB, "LIMIT")
            for item in entries:
                need(not item.flag_bits & 1 and item.file_size <= 12 * MIB, "LIMIT")
                need(item.compress_size > 0 or item.file_size == 0, "LIMIT")
                need(item.file_size <= max(item.compress_size, 1) * 100, "LIMIT")
                need(not item.filename.startswith("/") and ".." not in Path(item.filename).parts)
                need(not item.filename.startswith("xl/externalLinks/") and not item.filename.endswith("vbaProject.bin"))
    except zipfile.BadZipFile as exc:
        raise Rejected("INVALID_FILE") from exc


def workbook(source, output, options, list_only=False):
    from openpyxl import Workbook, load_workbook
    direction = options.get("direction", "csv-xlsx")
    delimiter = {"comma": ",", "semicolon": ";", "tab": "\t"}.get(options.get("delimiter", "comma"))
    encoding = {"utf-8": "utf-8-sig", "windows-1252": "cp1252"}.get(options.get("encoding", "utf-8"))
    need(delimiter and encoding, "BAD_OPTIONS")
    if direction == "csv-xlsx":
        need(not list_only and source.stat().st_size <= 4 * MIB)
        try:
            content = source.read_text(encoding=encoding)
        except UnicodeError as exc:
            raise Rejected("ENCODING") from exc
        reader = csv.reader(io.StringIO(content, newline=""), delimiter=delimiter, strict=True)
        book = Workbook(write_only=True)
        sheet = book.create_sheet("Data")
        rows = 0
        try:
            for row in reader:
                rows += 1
                need(rows <= 10000 and len(row) <= 100 and sum(map(len, row)) <= 100000, "LIMIT")
                need(all(len(cell) <= 32767 for cell in row), "LIMIT")
                from openpyxl.cell import WriteOnlyCell
                cells = []
                for value in row:
                    cell = WriteOnlyCell(sheet, value=value)
                    cell.data_type = "s"  # Never turn user CSV into executable formulas.
                    cells.append(cell)
                sheet.append(cells)
        except csv.Error as exc:
            raise Rejected("INVALID_FILE") from exc
        need(rows > 0)
        book.save(output)
    elif direction == "xlsx-csv":
        check_xlsx(source)
        # Multer stores uploads under extensionless generated names. A byte stream
        # avoids openpyxl's filename-extension check after ZIP validation.
        book = load_workbook(io.BytesIO(source.read_bytes()), read_only=True, data_only=True, keep_links=False)
        try:
            if list_only:
                output.write_text(json.dumps(book.sheetnames, ensure_ascii=False), encoding="utf-8")
                return
            selected = text(options.get("sheet", ""), 100)
            need(selected in book.sheetnames, "BAD_OPTIONS")
            sheet = book[selected]
            # Streaming XLSX producers may omit worksheet dimension metadata.
            # Enforce limits against actual rows and columns as we read them.
            if sheet.max_row is not None:
                need(sheet.max_row <= 10000, "LIMIT")
            if sheet.max_column is not None:
                need(sheet.max_column <= 100, "LIMIT")
            with output.open("w", encoding=encoding, newline="") as handle:
                writer = csv.writer(handle, delimiter=delimiter)
                row_count = 0
                for row in sheet.iter_rows(values_only=True):
                    row_count += 1
                    need(row_count <= 10000 and len(row) <= 100, "LIMIT")
                    values = []
                    for value in row:
                        cell = "" if value is None else str(value)
                        need(len(cell) <= 32767, "LIMIT")
                        if re.match(r"^[\s\ufeff\x00-\x1f]*[=+\-@]", cell):
                            cell = "'" + cell
                        values.append(cell)
                    writer.writerow(values)
            need(output.stat().st_size <= 8 * MIB, "LIMIT")
        finally:
            book.close()
    else:
        raise Rejected("BAD_OPTIONS")


def pdf_pages(source, maximum):
    from pypdf import PdfReader
    need(source.read_bytes()[:5] == b"%PDF-")
    reader = PdfReader(str(source), strict=True)
    need(not reader.is_encrypted and 0 < len(reader.pages) <= maximum, "LIMIT")
    for page in reader.pages:
        width, height = float(page.mediabox.width), float(page.mediabox.height)
        need(0 < width <= 2000 and 0 < height <= 2000 and width * height <= 3_200_000, "LIMIT")
    return reader


def compress_pdf(source, output, options):
    original = pdf_pages(source, 50)
    preset = options.get("preset", "balanced")
    dpi = {"light": 150, "balanced": 120, "small": 96}.get(preset)
    need(dpi is not None, "BAD_OPTIONS")
    run_command(["gs", "-q", "-dSAFER", "-dBATCH", "-dNOPAUSE", "-sDEVICE=pdfwrite",
                 "-dCompatibilityLevel=1.6", "-dDetectDuplicateImages=true", "-dCompressFonts=true",
                 "-dSubsetFonts=true", "-dAutoRotatePages=/None", "-dDownsampleColorImages=true",
                 f"-dColorImageResolution={dpi}", "-dDownsampleGrayImages=true",
                 f"-dGrayImageResolution={dpi}", "-dDownsampleMonoImages=true",
                 f"-dMonoImageResolution={max(200, dpi * 2)}", "-sOutputFile=" + str(output), str(source)], 70)
    result = pdf_pages(output, 50)
    need(len(original.pages) == len(result.pages))
    for before, after in zip(original.pages, result.pages):
        need(abs(float(before.mediabox.width) - float(after.mediabox.width)) < 1)
        need(abs(float(before.mediabox.height) - float(after.mediabox.height)) < 1)
    need(output.stat().st_size < source.stat().st_size, "NO_GAIN")


def searchable_pdf(source, output, options):
    from pypdf import PdfReader, PdfWriter
    original = pdf_pages(source, 10)
    lang = options.get("lang", "eng")
    need(lang in {"eng", "spa", "ara", "por"}, "BAD_OPTIONS")
    writer = PdfWriter()
    for index, page in enumerate(original.pages, 1):
        image = Path(f"ocr-{index}")
        run_command(["pdftoppm", "-f", str(index), "-l", str(index), "-r", "160", "-singlefile",
                     "-png", str(source), str(image)], 20)
        png = image.with_suffix(".png")
        need(png.is_file() and png.stat().st_size <= 24 * MIB, "LIMIT")
        run_command(["tesseract", str(png), str(image), "--dpi", "160", "-l", lang, "--psm", "1", "pdf"], 25)
        layer = PdfReader(str(image.with_suffix(".pdf"))).pages[0]
        need(bool(layer.extract_text().strip()), "NO_TEXT")
        # Tesseract's PDF renderer positions an invisible text layer over the same page pixels.
        writer.add_page(layer)
        png.unlink(missing_ok=True)
        image.with_suffix(".pdf").unlink(missing_ok=True)
    with output.open("wb") as handle:
        writer.write(handle)
    need(output.stat().st_size <= 40 * MIB)


def main():
    tool, out_name, options_json, *names = sys.argv[1:]
    options = json.loads(options_json)
    need(isinstance(options, dict), "BAD_OPTIONS")
    output = Path(out_name)
    files = list(map(Path, names))
    if tool == "invoice-generator":
        raw = options.get("invoice", "")
        need(isinstance(raw, str) and len(raw) <= 20000, "BAD_OPTIONS")
        invoice(json.loads(raw), files[0] if files else None, output)
    elif tool in {"csv-xlsx-converter", "xlsx-sheets"}:
        need(len(files) == 1)
        workbook(files[0], output, options, tool == "xlsx-sheets")
    elif tool == "compress-pdf":
        need(len(files) == 1)
        compress_pdf(files[0], output, options)
    elif tool == "searchable-pdf-ocr":
        need(len(files) == 1)
        searchable_pdf(files[0], output, options)
    else:
        raise Rejected("BAD_OPTIONS")
    need(output.is_file() and 0 < output.stat().st_size <= 40 * MIB, "LIMIT")


if __name__ == "__main__":
    try:
        if sys.platform.startswith("linux"):
            import resource
            for key, limit in ((resource.RLIMIT_CPU, 85), (resource.RLIMIT_FSIZE, 42 * MIB),
                               (resource.RLIMIT_AS, 768 * MIB)):
                resource.setrlimit(key, (limit, limit))
        main()
    except Rejected as exc:
        sys.exit(str(exc))
    except (ValueError, OSError, KeyError, TypeError, zipfile.BadZipFile, MemoryError):
        if os.environ.get("CONVERTIOS_ARTIFACT_DEBUG") == "1":
            import traceback
            traceback.print_exc()
        sys.exit("INVALID_FILE")
