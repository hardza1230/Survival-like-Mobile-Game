"""Validate and pack the eight-frame Taro sentry and overcharge source atlases."""

from hashlib import sha256
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/incoming/taro-motion3c'
TARGET = ROOT / 'assets/art/taro-motion3c'


def pack():
    entries = json.loads((SOURCE / 'MANIFEST.json').read_text(encoding='utf-8'))
    assert len(entries) == 4
    TARGET.mkdir(parents=True, exist_ok=True)
    for row in entries:
        key = row['key']
        file = SOURCE / row['file']
        data = file.read_bytes()
        assert len(data) == row['bytes'] and sha256(data).hexdigest() == row['sha256'], key
        w, h, cols = row['frameWidth'], row['frameHeight'], row['columns']
        assert row['frameCount'] == 8 and cols in (2, 4)
        with Image.open(file) as image:
            assert image.size == (w * cols, h * (8 // cols)) and image.mode == 'RGBA', key
            hashes = set()
            for i in range(8):
                x, y = i % cols * w, i // cols * h
                frame = image.crop((x, y, x + w, y + h))
                box = frame.getchannel('A').getbbox()
                assert box and min(box[0], box[1], w - box[2], h - box[3]) >= 2, (key, i, box)
                hashes.add(sha256(frame.tobytes()).digest())
            assert len(hashes) == 8, key
            out = TARGET / (key + '.webp')
            image.save(out, 'WEBP', quality=80, alpha_quality=90, method=6)
            if out.stat().st_size > 150_000:
                image.save(out, 'WEBP', quality=75, alpha_quality=90, method=6)
            print(f'{key}: {image.width}x{image.height}, {out.stat().st_size:,} bytes')


if __name__ == '__main__':
    pack()
