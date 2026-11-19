"""Integration checks against a fresh local API using fixtures from smart_tools_real.py."""
import concurrent.futures
import http.client
import io
import json
import sys
import time
from pathlib import Path
from urllib.parse import urlsplit
from zipfile import ZipFile

fixtures = Path(sys.argv[1])
host = urlsplit(sys.argv[2])
assert host.hostname in {"127.0.0.1", "localhost"}
MIB = 1024 ** 2


def request(method, path, body=None, headers=None):
    session = http.client.HTTPConnection(host.netloc, timeout=120)
    try:
        session.request(method, path, body=body, headers=headers or {})
        response = session.getresponse()
        return response.status, response.read()
    finally:
        session.close()


def upload(path, data, name="input"):
    boundary = "ConvertiosFileBoundary"
    prefix = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{name}\"\r\n"
              "Content-Type: application/octet-stream\r\n\r\n").encode()
    extra = (f'\r\n--{boundary}\r\nContent-Disposition: form-data; name="format"\r\n\r\nmp4'.encode()
             if path == "/convert/video" else b"")
    body = prefix + data + extra + f"\r\n--{boundary}--\r\n".encode()
    return request("POST", path, body, {"Content-Type":f"multipart/form-data; boundary={boundary}"})


def jobs():
    return json.loads(request("GET", "/health")[1])["activeJobs"]


def main():
    for slug, filename in {"heic-to-jpg":"sample.heic","heic-to-pdf":"sample.heic","avif-to-png":"alpha.avif",
                           "mp4-to-gif":"source.mp4","video-compressor":"source.mp4","image-to-text":"eng.png",
                           "pdf-to-text":"digital.pdf","gif-compressor":"motion.gif"}.items():
        data = (fixtures/filename).read_bytes()[:22]
        status, body = upload("/convert/smart/"+slug,data,filename)
        assert status == 422 and json.loads(body)["code"] == "INVALID_FILE", (slug,status,body)
    status, body = upload("/convert/smart/pdf-to-text",b"")
    assert status == 400 and json.loads(body)["code"] == "INVALID_FILE"
    for slug,limit in [("image-to-text",10),("pdf-to-text",20),("mp4-to-gif",50)]:
        status,body = upload("/convert/smart/"+slug, bytes(limit*MIB+1))
        assert status == 413 and json.loads(body)["code"] == "LIMIT", (slug,status)
    phone = (fixtures/"iphone.heic").read_bytes()
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
        future = pool.submit(upload,"/convert/smart/heic-to-jpg",phone)
        deadline = time.monotonic()+10
        while jobs()==0 and time.monotonic()<deadline and not future.done():
            time.sleep(.015)
        status,body = upload("/convert/smart/pdf-to-text",(fixtures/"digital.pdf").read_bytes())
        assert status == 503 and json.loads(body)["code"]=="BUSY"
        status,body = future.result()
        assert status==200 and body.startswith(b"\xff\xd8")
    assert jobs()==0
    # Existing routes use the same job counter, multipart parser and Python dependency environment.
    status,body = upload("/convert/video",(fixtures/"source.mp4").read_bytes(),"clip.mp4")
    assert status == 200 and body[4:8] == b"ftyp", (status,body[:200])
    status,body = upload("/convert/pdf-to-word",(fixtures/"digital.pdf").read_bytes(),"document.pdf")
    assert status == 200, (status,body[:200])
    with ZipFile(io.BytesIO(body)) as doc:
        assert b"731" in doc.read("word/document.xml")
    assert jobs()==0
    print("Eight truncated formats, empty input, 10/20/50 MiB caps, concurrent job rejection, recovery, legacy MP4 and DOCX passed.")


if __name__ == "__main__":
    main()
