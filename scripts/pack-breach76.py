#!/usr/bin/env python3
"""Verify and pack eight Breach monster sheets to 128 px per frame."""
import hashlib
import io
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/incoming/breach76'
TARGET = ROOT / 'assets/art/breach76'
SPECIES = ('mite', 'maw', 'claw', 'eye')


def main():
    rows = json.loads((SOURCE / 'MANIFEST.json').read_text(encoding='utf-8'))
    assert len(rows) == 8 and {r['key'] for r in rows} == {
        f'brm_{species}_{action}' for species in SPECIES for action in ('walk', 'death')}
    prepared = {}
    for r in rows:
        key = r['key']
        assert r['file'] == key + '.png', key
        raw = (SOURCE / r['file']).read_bytes()
        assert len(raw) == r['bytes'] and hashlib.sha256(raw).hexdigest() == r['sha256'], key
        assert (r['width'], r['height'], r['frameWidth'], r['frameHeight'], r['columns'], r['frameCount']) == (1152, 192, 192, 192, 6, 6), key
        assert r['background'] == 'transparent' and r['anchor'] == 'center', key
        assert r['loop'] == key.endswith('_walk'), key
        image = Image.open(io.BytesIO(raw))
        assert image.mode == 'RGBA' and image.size == (1152, 192), key
        prepared[key] = image.copy()

    for sp in SPECIES:
        walk = prepared[f'brm_{sp}_walk'].crop((0, 0, 192, 192))
        death = prepared[f'brm_{sp}_death'].crop((0, 0, 192, 192))
        assert walk.tobytes() == death.tobytes(), sp + ' first frame must match'

    TARGET.mkdir(parents=True, exist_ok=True)
    packed = 0
    for key, image in prepared.items():
        sheet = Image.new('RGBA', (128 * 6, 128))
        for i in range(6):
            cell = image.crop((i * 192, 0, (i + 1) * 192, 192))
            sheet.paste(cell.resize((128, 128), Image.Resampling.LANCZOS), (i * 128, 0))
        target = TARGET / (key + '.webp')
        sheet.save(target, 'WEBP', lossless=True, method=6)
        size = target.stat().st_size
        packed += size
        print(f'{target.name}: {size:,} bytes')
    print(f'Packed {len(prepared)} sheets, {packed:,} bytes WebP, {128*128*6*4*len(prepared):,} bytes decoded')


if __name__ == '__main__':
    main()
