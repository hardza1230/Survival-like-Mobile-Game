#!/usr/bin/env python3
"""Order 84 — fixed sheets (no edge clipping, skin poses at run height, monsters shrunk 0.898 to fit).
Same size/grid as the originals → overwrite the shipped WebP at MANIFEST `replaces` (keys unchanged).
Black-background VFX get luminance alpha (max channel ×1.35, unpremultiplied) like scripts/pack-boss-vfx-c3.py."""
import hashlib, json, os
import numpy as np
from PIL import Image
SRC = 'assets/incoming/art_fixes84'
rows = json.load(open(os.path.join(SRC, 'MANIFEST.json')))
assert len(rows) == 27, len(rows)
total = 0
for r in rows:
    p = os.path.join(SRC, r['file']); b = open(p, 'rb').read()
    assert len(b) == r['bytes'] and hashlib.sha256(b).hexdigest() == r['sha256'], r['key']
    im = Image.open(p).convert('RGBA'); dst = r['replaces']
    assert im.size == Image.open(dst).size, (r['key'], im.size)
    if r['background'] == 'black':
        a = np.asarray(im).astype(np.float32); rgb = a[..., :3]; mx = rgb.max(2)
        al = np.clip(mx * 1.35, 0, 255); safe = np.maximum(al, 1)[..., None] / 255.0
        out = np.clip(rgb / safe, 0, 255); al[al < 8] = 0
        im = Image.fromarray(np.dstack([out, al]).astype(np.uint8), 'RGBA')
    im.save(dst, 'WEBP', quality=80, alpha_quality=85, method=6)
    if os.path.getsize(dst) > 150_000: im.save(dst, 'WEBP', quality=75, alpha_quality=85, method=6)
    s = os.path.getsize(dst); total += s
    print(f"{r['key']:34} → {dst}  {s/1024:6.1f} KB")
print(f'total {total/1024:.1f} KB')
