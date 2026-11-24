#!/usr/bin/env python3
"""Verify A22 masters, then pack 20 SFX (96k) and eight Ruby lines (56k)."""
import hashlib,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'assets/incoming/audio_a22'
rows=json.loads((SRC/'MANIFEST.json').read_text(encoding='utf-8'))
assert len(rows)==28 and sum(r['kind']=='voice' for r in rows)==8
total=0
for r in rows:
    src=SRC/r['file'];data=src.read_bytes()
    assert len(data)==r['bytes'] and hashlib.sha256(data).hexdigest()==r['sha256'],r['key']
    voice=r['kind']=='voice';dst=ROOT/'assets/audio'/('acting' if voice else 'sfx/a22')/(r['key']+'.mp3')
    dst.parent.mkdir(parents=True,exist_ok=True)
    subprocess.run(['ffmpeg','-y','-v','error','-i',str(src),'-ac','1','-ar','44100','-c:a','libmp3lame','-b:a','56k' if voice else '96k','-map_metadata','-1',str(dst)],check=True)
    total+=dst.stat().st_size
    print(r['key'],dst.stat().st_size,'bytes')
print('A22 runtime total:',total,'bytes')
