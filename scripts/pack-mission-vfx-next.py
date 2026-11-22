"""Validate and pack the Seed Rift feed and Mirror Path charge sprites."""

from hashlib import sha256
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'assets/incoming/mission-vfx-next'
DST = ROOT / 'assets/art/mission-vfx-next'
FRAMES = {'vfx_seed_rift_feed': 12, 'vfx_mirror_path_lock': 8}
SIZE = 192


def pack():
    rows = json.loads((SRC / 'MANIFEST.json').read_text(encoding='utf8'))
    assert {row['key'] for row in rows} == set(FRAMES)
    DST.mkdir(parents=True, exist_ok=True)
    for row in rows:
        key = row['key']
        count = FRAMES[key]
        path = SRC / row['file']
        data = path.read_bytes()
        assert len(data) == row['bytes'] and sha256(data).hexdigest() == row['sha256'], key
        assert (row['frameCount'], row['columns'], row['rate']) == (count, count, 24), key
        with Image.open(path) as art:
            assert art.mode == 'RGBA' and art.size == (SIZE * count, SIZE), key
            alpha = art.getchannel('A')
            for frame in range(count):
                box = alpha.crop((SIZE * frame, 0, SIZE * (frame + 1), SIZE)).getbbox()
                assert box is not None, (key, frame)
                assert min(box[0], box[1], SIZE - box[2], SIZE - box[3]) >= 6, (key, frame, box)
            out = DST / (key + '.webp')
            art.save(out, 'WEBP', quality=80, alpha_quality=90, method=6)
            if out.stat().st_size > 150_000:
                art.save(out, 'WEBP', quality=75, alpha_quality=90, method=6)
            print(f'{key}: {count} frames, {out.stat().st_size:,} bytes')


if __name__ == '__main__':
    pack()
