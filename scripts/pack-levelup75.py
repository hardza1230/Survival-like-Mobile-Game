#!/usr/bin/env python3
"""Verify and pack order 75 card templates without changing their slice coordinates."""
import hashlib
import io
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
INCOMING = ROOT / 'assets/incoming/levelup75'
OUTPUT = ROOT / 'assets/art/levelup'
PANELS = {'lvl_tpl_' + kind for kind in ('normal', 'mutation', 'relic', 'unique')}
EFFECTS = {'lvl_tpl_fx_' + kind for kind in ('mutation', 'relic', 'unique')}


def luminance_alpha(image):
    rgba = []
    for r, g, b in image.convert('RGB').getdata():
        alpha = min(255, int(max(r, g, b) * 1.35))
        if alpha < 8:
            rgba.append((0, 0, 0, 0))
        else:
            rgba.append(tuple(min(255, v * 255 // alpha) for v in (r, g, b)) + (alpha,))
    image = Image.new('RGBA', image.size)
    image.putdata(rgba)
    return image


def main():
    rows = json.loads((INCOMING / 'MANIFEST.json').read_text(encoding='utf-8'))
    assert len(rows) == 8 and {row['key'] for row in rows} == PANELS | EFFECTS | {'lvl_tpl_crest'}
    images = {}
    for row in rows:
        key = row['key']
        assert row['file'] == key + '.png', key
        source = (INCOMING / row['file']).read_bytes()
        assert len(source) == row['bytes'] and hashlib.sha256(source).hexdigest() == row['sha256'], key
        spec = (96, 96, 4) if key == 'lvl_tpl_crest' else (384, 150, 6 if key in EFFECTS else 1)
        fw, fh, count = spec
        assert (row['frameWidth'], row['frameHeight'], row['frameCount']) == spec, key
        assert (row['width'], row['height'], row['columns']) == (fw * count, fh, count), key
        assert row['background'] == ('black' if key in EFFECTS else 'transparent'), key
        assert row['loop'] == (key in EFFECTS), key
        if key in PANELS:
            assert row['nineSlice'] == [32, 28, 32, 28], key
        image = Image.open(io.BytesIO(source))
        assert image.mode == 'RGBA' and image.size == (fw * count, fh), key
        images[key] = luminance_alpha(image) if key in EFFECTS else image.copy()

    OUTPUT.mkdir(parents=True, exist_ok=True)
    packed_bytes = 0
    decoded_bytes = 0
    for key, image in images.items():
        target = OUTPUT / (key + '.webp')
        image.save(target, 'WEBP', quality=90, method=6)
        size = target.stat().st_size
        packed_bytes += size
        decoded_bytes += image.width * image.height * 4
        print(f'{target.name}: {image.width}x{image.height}, {size:,} bytes')
    print(f'Packed {len(images)} files, {packed_bytes:,} bytes WebP, {decoded_bytes:,} bytes decoded')


if __name__ == '__main__':
    main()
