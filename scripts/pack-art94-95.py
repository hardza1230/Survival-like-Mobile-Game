"""v8.2.86: pack art orders 94 (Crown Root / fog / Abyss Brute / rift warning / badges) and 95 (boss twists).
Black-background VFX -> luminance alpha (max channel x1.35, unpremultiplied, <8 transparent). Others keep alpha.
WebP q80 (q75 if > 150 KB). Writes assets/art/<batch>/<key>.webp and scripts/art94-95.json (registry rows)."""
from hashlib import sha256
import json
from pathlib import Path
import numpy as np
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
RATE = {'cr94_burrow': 12, 'cr94_warn_crack': 10, 'cr94_strike': 10.7, 'cr94_crown_head': 10, 'cr94_anchor_break': 14, 'cr94_crown_burst': 16,
        'cr94_crown_hurt': 18, 'fg94_dark_claw': 8, 'sr94_rift_warn': 12, 'fb94_perfect_badge': 20, 'fb94_combo_badge': 20,
        'tw95_root_tile': 10, 'tw95_root_tip': 10, 'tw95_seed_drop': 14, 'tw95_seed_idle': 8, 'tw95_seed_pop': 18, 'tw95_seed_hatch': 16,
        'tw95_fruit_fall': 10.5, 'tw95_fruit_splat': 16, 'tw95_shadow_summon': 14, 'tw95_shadow_aura': 10, 'tw95_frenzy_aura': 12}
out, total = {}, 0
for batch in ['mission94', 'twist95']:
    src = ROOT / 'assets/incoming' / batch; dst = ROOT / 'assets/art' / batch; dst.mkdir(parents=True, exist_ok=True)
    for r in json.loads((src / 'MANIFEST.json').read_text(encoding='utf-8')):
        b = (src / r['file']).read_bytes(); assert len(b) == r['bytes'] and sha256(b).hexdigest() == r['sha256'], r['key']
        im = Image.open(src / r['file']).convert('RGBA'); assert (im.width, im.height) == (r['width'], r['height']), r['key']
        if r.get('background') == 'black':
            a = np.asarray(im).astype(np.float32); al = np.clip(a[..., :3].max(axis=2) * 1.35, 0, 255)
            rgb = np.clip(a[..., :3] * (255 / np.maximum(al, 1))[..., None], 0, 255); al[al < 8] = 0
            im = Image.fromarray(np.dstack([rgb, al]).astype(np.uint8), 'RGBA')
        f = dst / (r['key'] + '.webp'); im.save(f, 'WEBP', quality=80, alpha_quality=85, method=6)
        if f.stat().st_size > 150_000: im.save(f, 'WEBP', quality=75, alpha_quality=85, method=6)
        total += f.stat().st_size
        out[r['key']] = {'url': f'assets/art/{batch}/{r["key"]}.webp', 'fw': r['frameWidth'], 'fh': r['frameHeight'], 'frames': r['frameCount'],
                         'rate': RATE.get(r['key'], 8), 'loop': bool(r.get('loop')), 'anchor': r.get('anchor'), 'extra': r.get('textBox') or r.get('nineSlice') or r.get('actions')}
        print(f"{r['key']:22} {f.stat().st_size/1024:6.1f} KB  {r['width']}x{r['height']}")
(ROOT / 'scripts/art94-95.json').write_text(json.dumps(out, indent=1), encoding='utf-8')
print(len(out), 'files', f'{total/1e6:.2f} MB')
