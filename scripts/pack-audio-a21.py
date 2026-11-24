#!/usr/bin/env python3
"""A21 — hero attack + material/critical hit variations: 69 SFX → assets/audio/sfx/a21/ (96k mono)."""
import hashlib, json, os, subprocess
SRC = 'assets/incoming/audio_combat_a21'
rows = json.load(open(os.path.join(SRC, 'MANIFEST.json'))); rows = rows if isinstance(rows, list) else rows.get('files') or rows.get('assets')
assert len(rows) == 69, len(rows)
os.makedirs('assets/audio/sfx/a21', exist_ok=True)
total = 0
for r in rows:
    p = os.path.join(SRC, r['file']); b = open(p, 'rb').read()
    assert len(b) == r['bytes'] and hashlib.sha256(b).hexdigest() == r['sha256'], r['key']
    dst = os.path.join('assets/audio/sfx/a21', r['key'] + '.mp3')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p, '-ac', '1', '-b:a', '96k', '-ar', '44100', dst], check=True)
    total += os.path.getsize(dst)
print(len(rows), 'files', f'{total/1024:.0f} KB')
