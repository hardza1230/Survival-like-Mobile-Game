"""Validate and pack the eight-frame hero hit-reaction sprites."""

from hashlib import sha256
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/incoming/hero-hurt3a'
TARGET = ROOT / 'assets/art/hero-hurt3a'


def pack():
    rows = json.loads((SOURCE / 'MANIFEST.json').read_text(encoding='utf8'))
    assert len(rows) == 10
    TARGET.mkdir(parents=True, exist_ok=True)
    for row in rows:
        source = SOURCE / row['file']
        data = source.read_bytes()
        key = row['key']
        assert len(data) == row['bytes'] and sha256(data).hexdigest() == row['sha256'], key
        assert (row['frameWidth'], row['frameHeight'], row['frameCount'], row['columns']) == (128, 128, 8, 8), key
        with Image.open(source) as art:
            assert art.size == (1024, 128) and art.mode == 'RGBA', key
            feet = set()
            hashes = set()
            for i in range(8):
                frame = art.crop((128*i, 0, 128*(i+1), 128))
                box = frame.getchannel('A').getbbox()
                assert box and min(box[0], box[1], 128-box[2], 128-box[3]) >= 4, (key, i, box)
                feet.add(box[3])
                hashes.add(sha256(frame.tobytes()).digest())
            assert len(feet) == 1 and len(hashes) == 8, key
            path = TARGET / (key + '.webp')
            art.save(path, 'WEBP', quality=80, alpha_quality=90, method=6)
            if path.stat().st_size > 150_000:
                art.save(path, 'WEBP', quality=75, alpha_quality=90, method=6)
            print(f'{key}: {path.stat().st_size:,} bytes')


if __name__ == '__main__':
    pack()
