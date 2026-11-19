#!/usr/bin/env python3
"""A17 — mission music: 8 loops → assets/audio/bgm/missions_a17/<key>.mp3 (80 kbps stereo) · 3 stingers → assets/audio/sfx/a17/<key>.mp3 (96 kbps mono)."""
import hashlib, json, os, subprocess
SRC = 'assets/incoming/audio_a17'
rows = json.load(open(os.path.join(SRC, 'MANIFEST.json')))
rows = rows if isinstance(rows, list) else rows.get('files') or rows.get('assets')
assert len(rows) == 11, len(rows)
for d in ('assets/audio/bgm/missions_a17', 'assets/audio/sfx/a17'): os.makedirs(d, exist_ok=True)
for r in rows:
    p = os.path.join(SRC, r['file']); b = open(p, 'rb').read()
    assert len(b) == r['bytes'] and hashlib.sha256(b).hexdigest() == r['sha256'], r['key']
    bgm = r['key'].startswith('bgm_'); dst = os.path.join('assets/audio/bgm/missions_a17' if bgm else 'assets/audio/sfx/a17', r['key'] + '.mp3')
    args = ['-ac', '2', '-b:a', '80k'] if bgm else ['-ac', '1', '-b:a', '96k']
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p, *args, '-ar', '44100', dst], check=True)
    print(f"{r['key']:22} {os.path.getsize(dst)/1024:6.1f} KB  {r.get('duration_ms')} ms")
