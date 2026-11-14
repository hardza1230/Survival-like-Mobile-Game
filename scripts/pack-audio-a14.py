#!/usr/bin/env python3
"""Pack audio order A14 (chest opening) -> assets/audio/sfx/chest_a14/*.mp3 · SFX standard: MP3 96 kbps mono 44.1 kHz."""
import hashlib, json, os, subprocess
SRC='assets/incoming/audio_chest_a14'; OUT='assets/audio/sfx/chest_a14'; os.makedirs(OUT, exist_ok=True)
rows=json.load(open(f'{SRC}/MANIFEST.json')); assert len(rows)==8, len(rows)
tot=0
for r in rows:
    f=f"{SRC}/{r['file']}"; b=open(f,'rb').read()
    assert len(b)==r['bytes'] and hashlib.sha256(b).hexdigest()==r['sha256'], r['file']
    out=f"{OUT}/{r['key']}.mp3"
    subprocess.run(['ffmpeg','-nostdin','-y','-loglevel','error','-i',f,'-ac','1','-ar','44100','-b:a','96k',out],check=True)
    n=os.path.getsize(out); tot+=n; print(f"{r['key']}: {r['duration_ms']} ms · {n//1024} KB")
print(f'total {tot//1024} KB')
