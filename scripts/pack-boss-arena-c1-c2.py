#!/usr/bin/env python3
"""Art order 48 (C1–C2 boss arena mechanics): verify sources vs MANIFEST, copy the 50% WebP
packs (same pipeline as pack-boss-vfx-c3: alpha = max(RGB)*1.35, <8 cut, unpremultiplied; pillar keeps alpha)."""
import hashlib, json, os, shutil
SRC = 'assets/incoming/boss_arena_c1_c2'
rows = json.load(open(os.path.join(SRC, 'MANIFEST.json')))
total = 0
for r in rows:
    p = os.path.join(SRC, r['file']); b = open(p, 'rb').read()
    assert len(b) == r['bytes'], (r['file'], len(b), r['bytes'])
    assert hashlib.sha256(b).hexdigest() == r['sha256'], r['file']
    pv = os.path.join(SRC, 'preview_webp', r['key'] + '.webp'); w = open(pv, 'rb').read()
    assert w[:4] == b'RIFF' and w[8:12] == b'WEBP', pv
    out = 'assets/art/counters' if r['key'].startswith('arena_') else 'assets/art/boss_vfx'
    os.makedirs(out, exist_ok=True); dst = os.path.join(out, r['key'] + '.webp'); shutil.copyfile(pv, dst)
    total += len(w); print(f"{dst} {len(w):,} B  {r['frameWidth']//2}x{r['frameHeight']//2} x{r['frameCount']}")
print(f'{len(rows)} files, {total:,} B')
