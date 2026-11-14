#!/usr/bin/env python3
"""Pack art order 82 (Build Path full-card Unique art) -> assets/art/pathuq82/*.webp
Shown full-card ~360x150 on a 390-wide phone -> packed 720x298 (2x), WebP q80 (q75 if >150 KB).
Sesame rows are skipped: Sesame plays the Rune Invoker and never picks a Build Path."""
import hashlib, json, os
from PIL import Image
SRC='assets/incoming/pathuq82'; OUT='assets/art/pathuq82'; os.makedirs(OUT, exist_ok=True)
rows=json.load(open(f'{SRC}/MANIFEST.json'))
assert len(rows)==18, len(rows)
total=0
for r in rows:
    f=f"{SRC}/{r['file']}"; b=open(f,'rb').read()
    assert len(b)==r['bytes'] and hashlib.sha256(b).hexdigest()==r['sha256'], r['file']
    assert (r['width'],r['height'])==(1024,424), r['file']
    if r['key'].startswith('pathuq82_sesame_'): continue
    im=Image.open(f).convert('RGB').resize((720,298),Image.LANCZOS)
    out=f"{OUT}/{r['key']}.webp"
    im.save(out,'WEBP',quality=80,method=6)
    if os.path.getsize(out)>150_000: im.save(out,'WEBP',quality=75,method=6)
    n=os.path.getsize(out); total+=n; print(f"{r['key']}: {n//1024} KB")
print(f'total {total/1024:.0f} KB · decoded {720*298*4/1048576:.2f} MB each (3 per run)')
