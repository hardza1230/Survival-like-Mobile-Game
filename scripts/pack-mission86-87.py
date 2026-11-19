#!/usr/bin/env python3
"""Orders 86 (mission card faces) + 87 (mission monsters round 2) → WebP.
Multi-row sheets are split into one key per kind so they drop in for the old sheets:
st87_trees → st87_tree_{hive,golden,mimic} (2 frames like msn71_tree) · cr87_root_mothers → cr87_root_{fast,thick,split} (2 frames like cr_root_mother)
sr87_carriers → sr87_carrier_{fast,armored,split} (4-frame run). Black-bg VFX get luminance alpha like pack-mission85.py."""
import hashlib, json, os
import numpy as np
from PIL import Image
def rows_of(d):
    m = json.load(open(os.path.join(d, 'MANIFEST.json'))); return m if isinstance(m, list) else (m.get('assets') or m.get('files'))
def lum(im):
    a = np.asarray(im).astype(np.float32); rgb = a[..., :3]; mx = rgb.max(2)
    al = np.clip(mx * 1.35, 0, 255); safe = np.maximum(al, 1)[..., None] / 255.0
    out = np.clip(rgb / safe, 0, 255); al[al < 8] = 0
    return Image.fromarray(np.dstack([out, al]).astype(np.uint8), 'RGBA')
def save(im, dst):
    im.save(dst, 'WEBP', quality=80, alpha_quality=85, method=6)
    if os.path.getsize(dst) > 150_000: im.save(dst, 'WEBP', quality=75, alpha_quality=85, method=6)
    return os.path.getsize(dst)
SPLIT = {'st87_trees': ['st87_tree_hive', 'st87_tree_golden', 'st87_tree_mimic'], 'cr87_root_mothers': ['cr87_root_fast', 'cr87_root_thick', 'cr87_root_split'], 'sr87_carriers': ['sr87_carrier_fast', 'sr87_carrier_armored', 'sr87_carrier_split']}
total = dec = 0
for src, dst_dir, n in (('assets/incoming/mission_cards86', 'assets/art/mission86', 1), ('assets/incoming/mission87', 'assets/art/mission87', 12)):
    rows = rows_of(src); assert len(rows) == n, (src, len(rows)); os.makedirs(dst_dir, exist_ok=True)
    for r in rows:
        p = os.path.join(src, r['file']); b = open(p, 'rb').read()
        assert len(b) == r['bytes'] and hashlib.sha256(b).hexdigest() == r['sha256'], r['key']
        im = Image.open(p).convert('RGBA'); assert im.size == (r['width'], r['height']), r['key']
        if r['background'] == 'black': im = lum(im)
        parts = [(r['key'], im)]
        if r['key'] in SPLIT:
            fh = r['frameHeight']; parts = [(k, im.crop((0, i * fh, im.width, (i + 1) * fh))) for i, k in enumerate(SPLIT[r['key']])]
        for k, part in parts:
            s = save(part, os.path.join(dst_dir, k + '.webp')); total += s; dec += part.width * part.height * 4
            print(f"{k:24} {part.width}x{part.height}  {s/1024:6.1f} KB")
print(f'total {total/1024:.1f} KB · decoded {dec/1048576:.2f} MiB')
