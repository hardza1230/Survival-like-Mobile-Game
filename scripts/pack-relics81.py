#!/usr/bin/env python3
"""Pack art order 81 icons -> assets/art/relics81/*.webp (Relic 8 · Modifier 36 · Trade-off 5).
Shown ~64-70 px -> 128x128 (2x), WebP q80 with alpha. The 3 Yuzu portrait Build Path cards
(pathcard80_*) stay in incoming only (owner 15 Nov: order-82 landscape cards already cover Yuzu)."""
import hashlib, json, os
from PIL import Image
SRC='assets/incoming/relics81'; OUT='assets/art/relics81'; os.makedirs(OUT, exist_ok=True)
rows=json.load(open(f'{SRC}/MANIFEST.json'))
assert len(rows)==52, len(rows)
total=0; n=0
for r in rows:
    f=f"{SRC}/{r['file']}"; b=open(f,'rb').read()
    assert len(b)==r['bytes'] and hashlib.sha256(b).hexdigest()==r['sha256'], r['file']
    if r['key'].startswith('pathcard80_'): continue
    assert r['key'].split('_')[0] in ('relic','mod','trade') and (r['width'],r['height'])==(256,256), r['file']
    im=Image.open(f).convert('RGBA').resize((128,128),Image.LANCZOS)
    out=f"{OUT}/{r['key']}.webp"; im.save(out,'WEBP',quality=80,alpha_quality=85,method=6)
    total+=os.path.getsize(out); n+=1
print(f'{n} icons · total {total/1024:.0f} KB · decoded {128*128*4/1024:.0f} KB each')
