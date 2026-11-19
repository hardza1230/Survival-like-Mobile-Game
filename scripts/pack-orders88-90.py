#!/usr/bin/env python3
"""Orders 88 (Pact Relic icons) · 89 (Mission Atlas UI) · 90 (mission event FX) → WebP (skill wire-art §2b).
Frames are resized to ≤2× on-screen size; black-bg VFX get luminance alpha like pack-mission85.py."""
import hashlib, json, os
import numpy as np
from PIL import Image
def lum(im):
    a = np.asarray(im).astype(np.float32); rgb = a[..., :3]; mx = rgb.max(2)
    al = np.clip(mx * 1.35, 0, 255); safe = np.maximum(al, 1)[..., None] / 255.0
    out = np.clip(rgb / safe, 0, 255); al[al < 8] = 0
    return Image.fromarray(np.dstack([out, al]).astype(np.uint8), 'RGBA')
def save(im, dst):
    im.save(dst, 'WEBP', quality=80, alpha_quality=85, method=6)
    if os.path.getsize(dst) > 150_000: im.save(dst, 'WEBP', quality=75, alpha_quality=85, method=6)
    return os.path.getsize(dst)
# key → output frame size (square) or None = keep
FRAME = {'ma89_nodes': 64, 'ma89_emblem': 128, 'ma89_star': 48, 'ev90_arrows': 64, 'ev90_gold_shimmer': 96, 'ev90_reroll': 48, 'ev90_curses': 48}
total = dec = 0
for src, dst_dir, n in (('assets/incoming/relics88', 'assets/art/relics88', 8), ('assets/incoming/atlas89', 'assets/art/atlas89', 5), ('assets/incoming/events90', 'assets/art/events90', 7)):
    rows = json.load(open(os.path.join(src, 'MANIFEST.json'))); assert len(rows) == n, (src, len(rows)); os.makedirs(dst_dir, exist_ok=True)
    for r in rows:
        p = os.path.join(src, r['file']); b = open(p, 'rb').read()
        assert len(b) == r['bytes'] and hashlib.sha256(b).hexdigest() == r['sha256'], r['key']
        im = Image.open(p).convert('RGBA'); assert im.size == (r['width'], r['height']), r['key']
        if r['background'] == 'black': im = lum(im)
        fs = FRAME.get(r['key']) or (128 if src.endswith('relics88') else None)
        if fs:
            fw, fh, c = r['frameWidth'], r['frameHeight'], r['columns']; k = r['frameCount']
            out = Image.new('RGBA', (fs * c, fs * ((k + c - 1) // c)))
            for i in range(k):
                fr = im.crop(((i % c) * fw, (i // c) * fh, (i % c + 1) * fw, (i // c + 1) * fh)).resize((fs, fs), Image.LANCZOS)
                out.paste(fr, ((i % c) * fs, (i // c) * fs))
            im = out
        s = save(im, os.path.join(dst_dir, r['key'] + '.webp')); total += s; dec += im.width * im.height * 4
        print(f"{r['key']:22} {im.width}x{im.height}  {s/1024:6.1f} KB")
print(f'total {total/1024:.1f} KB · decoded {dec/1048576:.2f} MiB')
