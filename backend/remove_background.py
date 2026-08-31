import sys
from pathlib import Path
from rembg import new_session, remove


def main():
    if len(sys.argv) != 3:
        raise SystemExit("Usage: remove_background.py INPUT OUTPUT.png")
    source, destination = map(Path, sys.argv[1:3])
    session = new_session("u2netp")
    destination.write_bytes(remove(source.read_bytes(), session=session))


if __name__ == "__main__":
    main()
