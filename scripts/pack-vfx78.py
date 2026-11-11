#!/usr/bin/env python3
"""Verify order 78 PNG sources and pack stage and menu flipbooks."""
import hashlib
import io
import json
from pathlib import Path
from runpy import run_path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/incoming/vfx78'
SPECS = {
    'breach_open': (512, 8), 'splinter_pick': (128, 6), 'breach_chest': (256, 8),
    'stone_fuse': (256, 8), 'statue_paint': (192, 6), 'gates_shut': (256, 8),
    'dish_served': (384, 8), 'golem_bake': (384, 8), 'root_cut': (256, 6),
    'siege_break': (512, 8), 'trial_curse': (384, 8), 'trial_take': (256, 6),
    'trial_risk': (256, 6), 'ink_move': (256, 8), 'codex_up': (256, 8),
}
MENU = {'ink_move', 'codex_up'}
LUMINANCE_ALPHA = run_path(str(ROOT / 'scripts/pack-levelup75.py'))['luminance_alpha']


def main():
    rows = json.loads((SOURCE / 'MANIFEST.json').read_text(encoding='utf-8'))
    assert len(rows) == len(SPECS) and {r['key'] for r in rows} == {'vfx78_' + k for k in SPECS}
    items = []
    for row in rows:
        key = row['key']
        name = key.removeprefix('vfx78_')
        fw, count = SPECS[name]
        assert row['file'] == key + '.png'
        assert (row['frameWidth'], row['frameHeight'], row['frameCount'], row['columns']) == (fw, fw, count, count), key
        assert (row['width'], row['height']) == (fw * count, fw), key
        assert row['background'] == 'black' and row['anchor'] == 'center', key
        assert row['loop'] == (name == 'statue_paint'), key
        raw = (SOURCE / row['file']).read_bytes()
        assert len(raw) == row['bytes'] and hashlib.sha256(raw).hexdigest() == row['sha256'], key
        image = Image.open(io.BytesIO(raw))
        assert image.mode == 'RGBA' and image.size == (fw * count, fw), key
        assert image.getchannel('A').getextrema() == (255, 255), key
        items.append((name, key, image, fw, count))

    packed = decoded = 0
    for name, key, image, fw, count in items:
        size = min(fw, 256)
        sheet = Image.new('RGBA', (size * count, size))
        for i in range(count):
            cell = image.crop((i * fw, 0, (i + 1) * fw, fw))
            cell = LUMINANCE_ALPHA(cell)
            if fw != size:
                cell = cell.resize((size, size), Image.Resampling.LANCZOS)
            sheet.paste(cell, (i * size, 0))
        directory = ROOT / 'assets/art' / ('menu74' if name in MENU else 'vfx78')
        directory.mkdir(parents=True, exist_ok=True)
        target = directory / (key + '.webp')
        sheet.save(target, 'WEBP', quality=88, method=6)
        bytes_ = target.stat().st_size
        packed += bytes_
        decoded += sheet.width * sheet.height * 4
        print(f'{target.name}: {size}x{size} x {count}, {bytes_:,} bytes')
    print(f'Packed {len(items)} files, {packed:,} bytes WebP, {decoded:,} bytes decoded')


if __name__ == '__main__':
    main()
