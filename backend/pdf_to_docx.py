import sys
from pdf2docx import Converter


def main():
    if len(sys.argv) != 3:
        raise SystemExit("Usage: pdf_to_docx.py INPUT.pdf OUTPUT.docx")
    source, destination = sys.argv[1], sys.argv[2]
    converter = Converter(source)
    try:
        converter.convert(destination)
    finally:
        converter.close()


if __name__ == "__main__":
    main()
