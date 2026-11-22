"""Validate and pack eight-frame mission monster movement sheets."""

from hashlib import sha256
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/incoming/mission-motion2b'
TARGET = ROOT / 'assets/art/mission-motion2b'


def pack():
    entries = json.loads((SOURCE / 'MANIFEST.json').read_text(encoding='utf-8'))
    assert len(entries) == 9
    TARGET.mkdir(parents=True, exist_ok=True)
    for row in entries:
        file = SOURCE / row['file']
        data = file.read_bytes()
        assert len(data) == row['bytes'] and sha256(data).hexdigest() == row['sha256'], row['key']
        size = row['frameWidth']
        assert row['frameHeight'] == size and row['frameCount'] == row['columns'] == 8
        with Image.open(file) as sheet:
            assert sheet.size == (size * 8, size) and sheet.mode == 'RGBA', row['key']
            hashes = set()
            for i in range(8):
                tile = sheet.crop((i * size, 0, (i + 1) * size, size))
                alpha = tile.getchannel('A')
                box = alpha.getbbox()
                assert box and min(box[0], box[1], size - box[2], size - box[3]) >= 3, (row['key'], i, box)
                hashes.add(sha256(tile.tobytes()).digest())
            assert len(hashes) == 8, row['key']
            dest = TARGET / (row['key'] + '.webp')
            sheet.save(dest, 'WEBP', quality=80, alpha_quality=90, method=6)
            if dest.stat().st_size > 150_000:
                sheet.save(dest, 'WEBP', quality=75, alpha_quality=90, method=6)
            print(f"{row['key']}: {size}px × 8 · {dest.stat().st_size:,} bytes")


if __name__ == '__main__':
    pack()
