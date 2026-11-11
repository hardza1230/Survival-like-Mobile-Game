#!/usr/bin/env python3
"""Pack order 77 one-shots to the same frame size as the existing idle art."""
import hashlib
import io
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/incoming/motion77'
TARGET = ROOT / 'assets/art/motion77'
IDLES = {
    'hh_herald': ('league72', 256), 'gg_golem': ('league73', 384),
    'hs_warlord': ('league73', 384), 'hm_hand_lord': ('league72', 384),
    'hm_breachlord': ('league72', 512), 'msn71_stalker_captain': ('missions71', 256),
}


def main():
    rows = json.loads((SOURCE / 'MANIFEST.json').read_text(encoding='utf-8'))
    index = json.loads((ROOT / 'assets/art/missions71_74_index.json').read_text(encoding='utf-8'))
    keys = {base + '_' + action for base in IDLES for action in ('attack', 'death')}
    assert len(rows) == 12 and {r['key'] for r in rows} == keys
    prepared = []
    for r in rows:
        key = r['key']
        base, action = key.rsplit('_', 1)
        batch, size = IDLES[base]
        count = 6 if action == 'attack' else 8
        assert r['file'] == key + '.png', key
        assert (r['frameWidth'], r['frameHeight'], r['columns'], r['frameCount']) == (size, size, count, count), key
        assert (r['width'], r['height']) == (size * count, size), key
        assert r['background'] == 'transparent' and r['anchor'] == 'center' and not r['loop'], key
        raw = (SOURCE / r['file']).read_bytes()
        assert len(raw) == r['bytes'] and hashlib.sha256(raw).hexdigest() == r['sha256'], key
        image = Image.open(io.BytesIO(raw))
        assert image.mode == 'RGBA' and image.size == (size * count, size), key
        original = Image.open(ROOT / 'assets/incoming' / batch / (base + '.png')).crop((0, 0, size, size))
        assert image.crop((0, 0, size, size)).tobytes() == original.tobytes(), key
        if action == 'attack':
            assert image.crop((size * (count - 1), 0, size * count, size)).tobytes() == original.tobytes(), key
        info = next(row for row in index[batch] if row['key'] == base)
        assert info['fw'] == info['fh'], base
        packed_size = info['fw']
        existing = Image.open(ROOT / 'assets/art' / batch / (base + '.webp')).convert('RGBA')
        assert existing.height == packed_size, base
        idle = existing.crop((0, 0, packed_size, packed_size))
        prepared.append((key, action, image, size, count, packed_size, idle))

    TARGET.mkdir(parents=True, exist_ok=True)
    packed_bytes = decoded_bytes = 0
    for key, action, image, size, count, packed_size, idle in prepared:
        sheet = Image.new('RGBA', (packed_size * count, packed_size))
        for i in range(count):
            if i == 0 or action == 'attack' and i == count - 1:
                cell = idle
            else:
                cell = image.crop((i * size, 0, (i + 1) * size, size))
                if size != packed_size:
                    cell = cell.resize((packed_size, packed_size), Image.Resampling.LANCZOS)
            sheet.paste(cell, (i * packed_size, 0))
        target = TARGET / (key + '.webp')
        sheet.save(target, 'WEBP', lossless=True, exact=True, method=6)
        n = target.stat().st_size
        packed_bytes += n
        decoded_bytes += sheet.width * sheet.height * 4
        print(f'{target.name}: {n:,} bytes')
    print(f'Packed {len(prepared)} sheets, {packed_bytes:,} bytes WebP, {decoded_bytes:,} bytes decoded')


if __name__ == '__main__':
    main()
