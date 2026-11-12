#!/usr/bin/env python3
"""Art order 79 → assets/art/results79/<key>.webp (v8.1.108).
Checks MANIFEST bytes/sha first. sc79_rays is on black → luminance alpha (max channel ×1.35, unpremultiply, <8 → 0).
Sizes kept (header plate is 9-slice, medallion ~132px on screen at 2× density, Heart Seed ≤420px wide)."""
import hashlib, json, os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets/incoming/results79'); OUT = os.path.join(ROOT, 'assets/art/results79'); os.makedirs(OUT, exist_ok=True)

def lum_alpha(im):
    px = im.convert('RGB').load(); w, h = im.size; out = Image.new('RGBA', (w, h)); po = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]; m = max(r, g, b); a = min(255, int(m * 1.35))
            po[x, y] = (0, 0, 0, 0) if a < 8 else (min(255, r * 255 // max(a, 1)), min(255, g * 255 // max(a, 1)), min(255, b * 255 // max(a, 1)), a)
    return out

rows = json.load(open(os.path.join(SRC, 'MANIFEST.json'))); assert len(rows) == 6
total = dec = 0
for r in rows:
    raw = open(os.path.join(SRC, r['file']), 'rb').read()
    assert len(raw) == r['bytes'] and hashlib.sha256(raw).hexdigest() == r['sha256'], r['file']
    im = Image.open(os.path.join(SRC, r['file'])).convert('RGBA')
    assert im.size == (r['width'], r['height']), r['key']
    if r.get('background') == 'black': im = lum_alpha(im)
    out = os.path.join(OUT, r['key'] + '.webp'); im.save(out, 'WEBP', quality=88, method=6)
    sz = os.path.getsize(out); total += sz; dec += im.size[0] * im.size[1] * 4
    print(r['key'], im.size, sz // 1024, 'KB')
print('packed 6 ·', total // 1024, 'KB webp ·', round(dec / 1e6, 1), 'MB decoded')
