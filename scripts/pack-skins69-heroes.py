#!/usr/bin/env python3
"""Order 69 hero skins → assets/art/skins69/<hero>/<key>.webp (owner 11 Nov 2026: put candidates in the game to judge on the phone).
Uses the auto-aligned copies from `scripts/qa-skin69.py <hero> --fix` (assets/incoming/skins69/<hero>/aligned/).
Only heroes whose every file passes qa-skin69 are packed. Usage: python3 scripts/pack-skins69-heroes.py cocoa momo ..."""
import os, re, subprocess, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for hero in sys.argv[1:]:
    r = subprocess.run([sys.executable, os.path.join(ROOT, 'scripts/qa-skin69.py'), hero, '--fix'], capture_output=True, text=True)
    if r.returncode != 0:
        print('SKIP', hero, '(qa-skin69 fails)'); print(r.stdout); continue
    src = os.path.join(ROOT, 'assets/incoming/skins69', hero, 'aligned'); out = os.path.join(ROOT, 'assets/art/skins69', hero); os.makedirs(out, exist_ok=True)
    for f in sorted(os.listdir(src)):
        if not f.endswith('.png') or re.search(r'_v\d+\.png$', f):
            continue
        if f.startswith('char_'): key = f[:-4]
        else:
            m = re.match(r'(card|roster)_' + hero + r'_([a-z]+)\.png$', f); key = m.group(1) + '_' + hero + '__' + m.group(2)
        Image.open(os.path.join(src, f)).convert('RGBA').save(os.path.join(out, key + '.webp'), 'WEBP', quality=90, method=6)
    print('packed', hero, len(os.listdir(out)))
