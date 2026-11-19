#!/usr/bin/env python3
"""A18 — 8 Ruby lines → assets/audio/acting/<key>.mp3 (56 kbps mono) · 10 SFX → assets/audio/sfx/a18/<key>.mp3 (96 kbps mono)."""
import hashlib, json, os, subprocess
SRC = 'assets/incoming/audio_a18'
rows = json.load(open(os.path.join(SRC, 'MANIFEST.json')))
rows = rows if isinstance(rows, list) else rows.get('files') or rows.get('assets')
assert len(rows) == 18, len(rows)
os.makedirs('assets/audio/sfx/a18', exist_ok=True)
for r in rows:
    p = os.path.join(SRC, r['file']); b = open(p, 'rb').read()
    assert len(b) == r['bytes'] and hashlib.sha256(b).hexdigest() == r['sha256'], r['key']
    vo = r['key'].startswith('vo_'); dst = os.path.join('assets/audio/acting' if vo else 'assets/audio/sfx/a18', r['key'] + '.mp3')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p, '-ac', '1', '-ar', '44100', '-b:a', '56k' if vo else '96k', dst], check=True)
    print(f"{r['key']:28} {os.path.getsize(dst)/1024:5.1f} KB  {r.get('duration_ms')} ms  {r.get('text','')}")
