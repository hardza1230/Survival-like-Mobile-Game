#!/usr/bin/env python3
"""Art orders 70–74 → assets/art/<batch>/<key>.webp (v8.1.93).
Checks MANIFEST bytes/sha first. Black-background VFX → luminance alpha (max channel ×1.35, unpremultiply, <8 → 0).
Frames ≥512px are halved (shown ≤400px); rings that the code scales up (hm_rim) and Patrol layers keep full size."""
import hashlib, json, os, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BATCHES = ['league72', 'missions71', 'trial74', 'league73', 'patrol70']
KEEP = {'hm_rim'}

def lum_alpha(im):
    px = im.convert('RGB').load(); w, h = im.size; out = Image.new('RGBA', (w, h)); po = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]; m = max(r, g, b); a = min(255, int(m * 1.35))
            po[x, y] = (0, 0, 0, 0) if a < 8 else (min(255, r * 255 // max(a, 1)), min(255, g * 255 // max(a, 1)), min(255, b * 255 // max(a, 1)), a)
    return out

total = 0; dec = 0; rows_out = {}
for b in (sys.argv[1:] or BATCHES):
    d = os.path.join(ROOT, 'assets/incoming', b); m = json.load(open(d + '/MANIFEST.json')); L = m if isinstance(m, list) else (m.get('files') or m.get('assets'))
    od = os.path.join(ROOT, 'assets/art', b); os.makedirs(od, exist_ok=True); rows_out[b] = []
    for r in L:
        raw = open(os.path.join(d, r['file']), 'rb').read()
        assert len(raw) == r['bytes'] and hashlib.sha256(raw).hexdigest() == r['sha256'], r['file']
        im = Image.open(os.path.join(d, r['file'])).convert('RGBA')
        if r.get('background') == 'black': im = lum_alpha(im)
        fw, fh = r.get('frameWidth') or im.size[0], r.get('frameHeight') or im.size[1]
        k = 0.5 if (max(fw, fh) >= 512 and r['key'] not in KEEP and not b.startswith('patrol')) else 1.0
        if k != 1.0: im = im.resize((round(im.size[0] * k), round(im.size[1] * k)), Image.LANCZOS)
        out = os.path.join(od, r['key'] + '.webp'); im.save(out, 'WEBP', quality=88, method=6)
        sz = os.path.getsize(out); total += sz; dec += im.size[0] * im.size[1] * 4
        rows_out[b].append({'key': r['key'], 'w': im.size[0], 'h': im.size[1], 'fw': round(fw * k), 'fh': round(fh * k), 'frames': r.get('frameCount', 1), 'loop': bool(r.get('loop')), 'anchor': r.get('anchor', 'center'), 'black': r.get('background') == 'black'})
json.dump(rows_out, open(os.path.join(ROOT, 'assets/art/missions71_74_index.json'), 'w'), indent=0)
print('packed', sum(len(v) for v in rows_out.values()), 'files ·', round(total / 1024), 'KB webp ·', round(dec / 1e6, 1), 'MB decoded')
