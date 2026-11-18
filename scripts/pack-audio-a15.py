#!/usr/bin/env python3
"""A15 — Ruby voice lines for the reworked missions → assets/audio/acting/<key>.mp3 (56 kbps mono, overwrites the old lines)."""
import hashlib, json, os, subprocess
SRC = 'assets/incoming/audio_ruby_a15'
OUT = 'assets/audio/acting'
rows = json.load(open(os.path.join(SRC, 'MANIFEST.json')))
rows = rows if isinstance(rows, list) else rows.get('files') or rows.get('assets')
assert len(rows) == 8, len(rows)
for r in rows:
    p = os.path.join(SRC, r['file']); b = open(p, 'rb').read()
    assert len(b) == r['bytes'] and hashlib.sha256(b).hexdigest() == r['sha256'], r['key']
    dst = os.path.join(OUT, r['key'] + '.mp3')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p, '-ac', '1', '-ar', '44100', '-b:a', '56k', dst], check=True)
    print(f"{r['key']:28} {os.path.getsize(dst)/1024:5.1f} KB  {r['duration_ms']} ms  {r['text']}")
