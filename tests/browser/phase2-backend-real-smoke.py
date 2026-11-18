"""Minimal synthetic-file production smoke: one request per provider-backed endpoint.
No personal files. Limits 3 calls; does not modify website data.
"""
import io, json, pathlib, subprocess, tempfile, time
import requests
from PIL import Image

BASE="https://convertios-backend-sn5u.onrender.com"
OUT=[]
def check(label,route,field,filename,mime,payload,extra=None,timeout=160):
    start=time.monotonic()
    try:
        with requests.post(BASE+route,
             files={field:(filename,payload,mime)},
             data=extra or {},timeout=timeout,stream=True) as resp:
            content=resp.raw.read(10000000,decode_content=True)
            typ=resp.headers.get("Content-Type","")
            ok=(resp.status_code==200 and bool(content))
            sig={"ai":lambda b:b.startswith((b"\x89PNG",b"\xff\xd8\xff",b"RIFF",b"RIFF")),"mp3":lambda b:b.startswith(b"ID3") or b[:2] in (b"\xff\xfb",b"\xff\xf3"),"webm":lambda b:b.startswith(b"\x1a\x45\xdf\xa3")}
            if ok: ok=bool(sig[label](content))
            OUT.append({"endpoint":route,"http_status":resp.status_code,"content_type":typ,
                        "response_bytes":len(content),"valid_file_signature":ok,
                        "seconds":round(time.monotonic()-start,1),
                        "error_excerpt":None if resp.ok else content[:180].decode("utf-8","replace")})
    except Exception as e:
        OUT.append({"endpoint":route,"error":str(e)[:240],"seconds":round(time.monotonic()-start,1)})
with tempfile.TemporaryDirectory() as tmp:
    video=pathlib.Path(tmp)/"phase2-video.mp4"
    cmd=["ffmpeg","-hide_banner","-loglevel","error","-nostdin","-y","-f","lavfi","-i","color=c=blue:s=160x120:r=12:d=2","-f","lavfi","-i","sine=frequency=440:duration=2","-c:v","mpeg4","-q:v","10","-c:a","aac","-shortest",str(video)]
    gen=subprocess.run(cmd,capture_output=True,text=True,timeout=30)
    if gen.returncode: raise RuntimeError("sample-video-generation-failed: "+gen.stderr[-500:])
    clip=video.read_bytes()
    print("Synthetic test MP4 bytes",len(clip),flush=True)
    check("mp3","/convert/video-to-mp3","file","phase2-video.mp4","video/mp4",clip)
    print("MP3 request complete",flush=True)
    check("webm","/convert/video","file","phase2-video.mp4","video/mp4",clip,{"format":"webm"})
    print("WEBM request complete",flush=True)
    img=Image.new("RGB",(64,64),color=(60,120,180))
    buf=io.BytesIO(); img.save(buf,format="PNG")
    check("ai","/api/enhance-image","image","phase2-image.png","image/png",buf.getvalue(),timeout=150)
print(json.dumps(OUT,indent=2,ensure_ascii=True),flush=True)
