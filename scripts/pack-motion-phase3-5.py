"""Pack whole-sheet frame upgrades from animation phases 3 (heroes) and 5A/5B (boss VFX).
Atlas clips (keys with '__', e.g. enemy attack8 / boss body idle8) are wired separately.
Writes assets/art/<batch>/<key>.webp and scripts/motion-phase3-5.json (replaces -> new sheet)."""
from hashlib import sha256
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BATCHES = ['hero-motion-phase3', 'boss-motion-phase5a', 'boss-motion-phase5b']


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
                f = dst / (key + '.webp')
                im.save(f, 'WEBP', quality=80, alpha_quality=90, method=6)
                if f.stat().st_size > 150_000:
                    im.save(f, 'WEBP', quality=75, alpha_quality=90, method=6)
            total += f.stat().st_size
            out[row['replaces']] = {'url': f'assets/art/{batch}/{key}.webp', 'fw': w, 'fh': h, 'frames': n,
                                    'prev': row.get('previousFrameCount'), 'prevRate': row.get('previousRate'),
                                    'rate': row.get('suggestedRate'), 'loop': row.get('loop'), 'keys': row.get('sourceKeys') or [row.get('sourceKey') or key]}
    (ROOT / 'scripts/motion-phase3-5.json').write_text(json.dumps(out, indent=1), encoding='utf-8')
    print(len(out), 'sheets', f'{total/1e6:.2f} MB')


if __name__ == '__main__':
    pack()
