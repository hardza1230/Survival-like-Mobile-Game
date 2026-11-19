#!/usr/bin/env python3
"""Order 85 — mission placeholder art (Frozen Pantry crates/statues, Mirror shade, Last Light moth+wisp,
trial curse pads 7–8, Siege sapper+supply crate, Herald beam/aura/minion icons) → assets/art/mission85/<key>.webp.
Black-background VFX get luminance alpha (max channel ×1.35, unpremultiplied) like pack-art-fixes84.py.
Minion icons are shown at ~26 px → frames downscaled 96 → 64."""
import hashlib, json, os
import numpy as np
from PIL import Image
SRC, DST = 'assets/incoming/mission85', 'assets/art/mission85'
rows = json.load(open(os.path.join(SRC, 'MANIFEST.json')))
assert len(rows) == 12, len(rows)
os.makedirs(DST, exist_ok=True)
SCALE = {'hh85_minion_icons': 64}
total = dec = 0
for r in rows:
    p = os.path.join(SRC, r['file']); b = open(p, 'rb').read()
    assert len(b) == r['bytes'] and hashlib.sha256(b).hexdigest() == r['sha256'], r['key']
    im = Image.open(p).convert('RGBA'); assert im.size == (r['width'], r['height']), r['key']
    if r['background'] == 'black':
        a = np.asarray(im).astype(np.float32); rgb = a[..., :3]; mx = rgb.max(2)
        al = np.clip(mx * 1.35, 0, 255); safe = np.maximum(al, 1)[..., None] / 255.0
        out = np.clip(rgb / safe, 0, 255); al[al < 8] = 0
        im = Image.fromarray(np.dstack([out, al]).astype(np.uint8), 'RGBA')
    if r['key'] in SCALE:
        f = SCALE[r['key']] / r['frameWidth']; im = im.resize((round(im.width * f), round(im.height * f)), Image.LANCZOS)
    dst = os.path.join(DST, r['key'] + '.webp')
    im.save(dst, 'WEBP', quality=80, alpha_quality=85, method=6)
    if os.path.getsize(dst) > 150_000: im.save(dst, 'WEBP', quality=75, alpha_quality=85, method=6)
    s = os.path.getsize(dst); total += s; dec += im.width * im.height * 4
    print(f"{r['key']:22} {im.width}x{im.height}  {s/1024:6.1f} KB")
print(f'total {total/1024:.1f} KB · decoded {dec/1048576:.2f} MiB')
