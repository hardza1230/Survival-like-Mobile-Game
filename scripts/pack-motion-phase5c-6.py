"""v8.2.84: whole-sheet 8/12-frame upgrades from animation phases 5C (Ch3 + Pinnacle boss VFX), 5D (boss shots + counter ring), 6 (menu/Ruby/Expedition).
Atlas clips (keys with '__', e.g. enemy attack8 / boss body idle8) are wired separately.
Writes assets/art/<batch>/<key>.webp and scripts/motion-phase5c-6.json (replaces -> new sheet)."""
from hashlib import sha256
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BATCHES = ['boss-motion-phase5c', 'boss-motion-phase5d', 'menu-motion-phase6']


def pack():
    out = {}
    total = 0
    for batch in BATCHES:
        src = ROOT / 'assets/incoming' / batch
        dst = ROOT / 'assets/art' / batch
        dst.mkdir(parents=True, exist_ok=True)
        for row in json.loads((src / 'MANIFEST.json').read_text(encoding='utf-8')):
            key = row['key']
            if '__' in key or not row.get('replaces'):
                continue
            data = (src / row['file']).read_bytes()
            assert len(data) == row['bytes'] and sha256(data).hexdigest() == row['sha256'], key
            w, h, n, cols = row['frameWidth'], row['frameHeight'], row['frameCount'], row['columns']
            with Image.open(src / row['file']) as im:
                assert im.mode == 'RGBA' and im.width >= w * cols and im.height >= h * ((n + cols - 1) // cols), key
                inplace = key.startswith('ex91_back_')   # keep the menu-lazy expedition91 folder (artClass is URL based)
                f = (ROOT / row['replaces']) if inplace else dst / (key + '.webp')
                im.save(f, 'WEBP', quality=80, alpha_quality=90, method=6)
                if f.stat().st_size > 150_000:
                    im.save(f, 'WEBP', quality=75, alpha_quality=90, method=6)
            total += f.stat().st_size
            out[row['replaces']] = {'url': row['replaces'] if inplace else f'assets/art/{batch}/{key}.webp', 'inPlace': inplace, 'fw': w, 'fh': h, 'frames': n,
                                    'prev': row.get('previousFrameCount'), 'prevRate': row.get('previousRate'),
                                    'rate': row.get('suggestedRate'), 'loop': row.get('loop'), 'keys': row.get('sourceKeys') or [row.get('sourceKey') or key]}
    (ROOT / 'scripts/motion-phase5c-6.json').write_text(json.dumps(out, indent=1), encoding='utf-8')
    print(len(out), 'sheets', f'{total/1e6:.2f} MB')


if __name__ == '__main__':
    pack()
