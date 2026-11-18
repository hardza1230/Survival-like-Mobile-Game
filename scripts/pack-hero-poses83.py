#!/usr/bin/env python3
"""Order 83 — hero hurt (4f) + victory (8f) sheets incl. Festival skins.
Source 256 px frames → 128 px frames (same grid), WebP q80 → assets/art/hero_poses83/<key>.webp"""
import hashlib, json, os
from PIL import Image
SRC = 'assets/incoming/hero_poses83'
OUT = 'assets/art/hero_poses83'
os.makedirs(OUT, exist_ok=True)
rows = json.load(open(os.path.join(SRC, 'MANIFEST.json')))
assert len(rows) == 18, len(rows)
total = 0
for r in rows:
    p = os.path.join(SRC, r['file']); b = open(p, 'rb').read()
    assert len(b) == r['bytes'] and hashlib.sha256(b).hexdigest() == r['sha256'], r['key']
    im = Image.open(p).convert('RGBA'); f = r['frameWidth']; cols = r['columns']; n = r['frameCount']; rws = (n + cols - 1) // cols
    assert im.size == (cols * f, rws * f), (r['key'], im.size)
    out = Image.new('RGBA', (cols * 128, rws * 128), (0, 0, 0, 0))
    for i in range(n):
        c, rr = i % cols, i // cols
        out.paste(im.crop((c * f, rr * f, c * f + f, rr * f + f)).resize((128, 128), Image.LANCZOS), (c * 128, rr * 128))
    dst = os.path.join(OUT, r['key'] + '.webp')
    out.save(dst, 'WEBP', quality=80, alpha_quality=85, method=6)
    if os.path.getsize(dst) > 150_000: out.save(dst, 'WEBP', quality=75, alpha_quality=85, method=6)
    s = os.path.getsize(dst); total += s
    print(f"{r['key']:32} {out.size[0]}x{out.size[1]}  {s/1024:6.1f} KB  decoded {out.size[0]*out.size[1]*4/1048576:.2f} MiB")
print(f'total {total/1024:.1f} KB')
