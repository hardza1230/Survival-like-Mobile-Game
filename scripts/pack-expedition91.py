#!/usr/bin/env python3
"""Order 91 (Temple Expedition scene) → WebP (skill wire-art §2b). Square frames resized to ≤2× on-screen size; hit FX gets luminance alpha."""
import hashlib, json, os
import numpy as np
from PIL import Image
SRC, DST = 'assets/incoming/expedition91', 'assets/art/expedition91'
def lum(im):
    a = np.asarray(im).astype(np.float32); rgb = a[..., :3]; mx = rgb.max(2)
    al = np.clip(mx * 1.35, 0, 255); safe = np.maximum(al, 1)[..., None] / 255.0
    out = np.clip(rgb / safe, 0, 255); al[al < 8] = 0
    return Image.fromarray(np.dstack([out, al]).astype(np.uint8), 'RGBA')
def save(im, dst, lossy_rgb=False):
    if lossy_rgb: im.convert('RGB').save(dst, 'WEBP', quality=75, method=6); return os.path.getsize(dst)
    im.save(dst, 'WEBP', quality=80, alpha_quality=85, method=6)
    if os.path.getsize(dst) > 150_000: im.save(dst, 'WEBP', quality=75, alpha_quality=85, method=6)
    return os.path.getsize(dst)
FRAME = {'ex91_titans': 320, 'ex91_bosses': 448, 'ex91_hit': 160, 'ex91_icons': 48}
rows = json.load(open(os.path.join(SRC, 'MANIFEST.json'))); assert len(rows) == 13, len(rows); os.makedirs(DST, exist_ok=True)
total = dec = 0
for r in rows:
    p = os.path.join(SRC, r['file']); b = open(p, 'rb').read()
    assert len(b) == r['bytes'] and hashlib.sha256(b).hexdigest() == r['sha256'], r['key']
    im = Image.open(p).convert('RGBA'); assert im.size == (r['width'], r['height']), r['key']
    if r['background'] == 'black': im = lum(im)
    fs = FRAME.get(r['key']) or (192 if r['key'].startswith('ex91_back_') else None)
    if fs:
        fw, fh, c, k = r['frameWidth'], r['frameHeight'], r['columns'], r['frameCount']
        out = Image.new('RGBA', (fs * c, fs * ((k + c - 1) // c)))
        for i in range(k):
            fr = im.crop(((i % c) * fw, (i // c) * fh, (i % c + 1) * fw, (i // c + 1) * fh)).resize((fs, fs), Image.LANCZOS)
            out.paste(fr, ((i % c) * fs, (i // c) * fs))
        im = out
    s = save(im, os.path.join(DST, r['key'] + '.webp'), lossy_rgb=r['background'] == 'opaque'); total += s; dec += im.width * im.height * 4
    print(f"{r['key']:20} {im.width}x{im.height}  {s/1024:6.1f} KB")
print(f'total {total/1024:.1f} KB · decoded {dec/1048576:.2f} MiB')
