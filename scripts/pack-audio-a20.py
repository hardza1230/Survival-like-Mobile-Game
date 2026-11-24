#!/usr/bin/env python3
"""A20 — Ruby stage entry: 7 SFX → assets/audio/sfx/a20/ (96k mono) · 19 Ruby lines → assets/audio/acting/ (56k mono)."""
import hashlib, json, os, subprocess
SRC = 'assets/incoming/audio_a20'
rows = json.load(open(os.path.join(SRC, 'MANIFEST.json'))); rows = rows if isinstance(rows, list) else rows.get('files') or rows.get('assets')
assert len(rows) == 26, len(rows)
for d in ('assets/audio/sfx/a20',): os.makedirs(d, exist_ok=True)
for r in rows:
    p = os.path.join(SRC, r['file']); b = open(p, 'rb').read()
    assert len(b) == r['bytes'] and hashlib.sha256(b).hexdigest() == r['sha256'], r['key']
    k = r['key']; vo = k.startswith('vo_'); bgm = k.startswith('bgm_')
    dst = os.path.join('assets/audio/acting' if vo else 'assets/audio/sfx/a20' if bgm else 'assets/audio/sfx/a20', k + '.mp3')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p] + (['-ac', '2', '-b:a', '80k'] if bgm else ['-ac', '1', '-b:a', '56k' if vo else '96k']) + ['-ar', '44100', dst], check=True)
    print(f"{k:28} {os.path.getsize(dst)/1024:6.1f} KB  {r.get('duration_ms')} ms  {r.get('text','')}")
