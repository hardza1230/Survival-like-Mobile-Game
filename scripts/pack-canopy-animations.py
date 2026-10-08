"""Pack generated Canopy or Mycelium sheets without changing authored pose proportions.

Usage: python scripts/pack-canopy-animations.py source-map.json [--batch mycelium]
The map contains the selected batch keys and local generated PNG paths. Requires Pillow/NumPy.
Original generated sheets are retained under incoming/raw; runtime is lossless RGBA.
"""
import argparse
import json
import shutil
import statistics
from pathlib import Path
from PIL import Image
import numpy as np


def extract_poses(image):
    """Keep whole transparent components even when a pose crosses a nominal cell edge."""
    rgba = np.array(image)
    mask = rgba[:, :, 3] > 16
    parents, runs, previous = [], [], []

    def find(i):
        while parents[i] != i:
            parents[i] = parents[parents[i]]
            i = parents[i]
        return i

    for y, row in enumerate(mask):
        edges = np.diff(np.concatenate(([False], row, [False])).astype(np.int8))
        current, at = [], 0
        for left, right in zip(np.flatnonzero(edges == 1), np.flatnonzero(edges == -1)):
            left, right = int(left), int(right)
            number = len(parents)
            parents.append(number)
            while at < len(previous) and previous[at][1] < left:
                at += 1
            scan = at
            while scan < len(previous) and previous[scan][0] <= right:
                parents[find(number)] = find(previous[scan][2])
                scan += 1
            current.append((left, right, number))
            runs.append((y, left, right, number))
        previous = current
    components = {}
    for y, left, right, number in runs:
        component = components.setdefault(find(number), {'runs': [], 'area': 0,
            'box': [image.width, image.height, 0, 0], 'sx': 0, 'sy': 0})
        component['runs'].append((y, left, right))
        width = right - left
        component['area'] += width
        component['sx'] += (left + right - 1) * width / 2
        component['sy'] += y * width
        b = component['box']
        b[0], b[1], b[2], b[3] = min(b[0], left), min(b[1], y), max(b[2], right), max(b[3], y + 1)
    pieces = sorted(components.values(), key=lambda c: c['area'], reverse=True)
    main = pieces[:16]
    centers, groups = {}, {i: [] for i in range(16)}
    for component in main:
        x, y = component['sx'] / component['area'], component['sy'] / component['area']
        frame = min(3, int(y * 4 / image.height)) * 4 + min(3, int(x * 4 / image.width))
        assert frame not in centers, ('merged/ambiguous source poses', frame)
        centers[frame] = (x, y)
        groups[frame].append(component)
    assert len(centers) == 16
    removed = 0
    for component in pieces[16:]:
        if component['area'] < 4:
            removed += component['area']
            continue
        x, y = component['sx'] / component['area'], component['sy'] / component['area']
        frame = min(centers, key=lambda f: (centers[f][0] - x)**2 + (centers[f][1] - y)**2)
        groups[frame].append(component)
    cells, bounds = [], []
    for frame in range(16):
        pieces = groups[frame]
        box = [min(c['box'][0] for c in pieces), min(c['box'][1] for c in pieces),
               max(c['box'][2] for c in pieces), max(c['box'][3] for c in pieces)]
        canvas = np.zeros((box[3] - box[1], box[2] - box[0], 4), dtype=np.uint8)
        for component in pieces:
            for y, left, right in component['runs']:
                canvas[y - box[1], left - box[0]:right - box[0]] = rgba[y, left:right]
        cells.append(Image.fromarray(canvas))
        bounds.append(box)
    return cells, bounds, removed

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source_map')
parser.add_argument('--batch', choices=['canopy', 'mycelium'], default='canopy')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
mycelium = args.batch == 'mycelium'
incoming = root / ('assets/incoming/ch2_s2_animations' if mycelium else 'assets/incoming/ch2_s1_animations')
runtime = root / ('assets/art/ch2_mycelium' if mycelium else 'assets/art/ch2_canopy')
(incoming / 'raw').mkdir(parents=True, exist_ok=True)
runtime.mkdir(parents=True, exist_ok=True)
mapping = json.loads(Path(args.source_map).read_text(encoding='utf-8'))
identities = ['c22_drifter', 'c22_hopper', 'c22_sniper', 'c22_mold_sac', 'c22_bulwark', 'c22_oracle', 'c22_sporeling'] if mycelium else ['c21_sprout', 'c21_vine_hunter', 'c21_spore_lantern',
              'c21_fruit_pod', 'c21_root_beetle', 'c21_thorn_oracle']
assert set(mapping) == set(identities), 'Exactly the selected batch species are required'
atlas = Image.open(root / ('assets/ch2_mycelium_enemy_atlas.png' if mycelium else 'assets/ch2_enemy_atlas.png')).convert('RGBA')
report, previews = {}, {}
baseline = 236
for index, name in enumerate(identities):
    source = Path(mapping[name])
    image = Image.open(source).convert('RGBA')
    # Generated grids can have slight canvas-aspect drift. Extraction uses both
    # source axes; final cells remain exactly square without stretching anatomy.
    assert .95 <= image.width / image.height <= 1.05, (name, image.size)
    shutil.copyfile(source, incoming / 'raw' / (name + '_generated.png'))
    cells, source_bounds, removed = extract_poses(image)
    # The lantern generator placed charge in idle slot 7 and release in slot 9.
    # Reorder existing authored poses into the runtime contract without redrawing.
    order = [0, 1, 2, 3, 4, 5, 6, 11, 8, 7, 9, 10, 12, 13, 14, 15] if name == 'c21_spore_lantern' else list(range(16))
    cells = [cells[i] for i in order]
    old = atlas.crop((index % 4 * 256, index // 4 * 256,
                      (index % 4 + 1) * 256, (index // 4 + 1) * 256))
    old_box = old.getchannel('A').point(lambda a: 255 if a > 24 else 0).getbbox()
    target_width, target_height = old_box[2] - old_box[0], old_box[3] - old_box[1]
    scale = min(target_width / statistics.median(c.width for c in cells[:6]),
                target_height / statistics.median(c.height for c in cells[:6]),
                236 / max(c.width for c in cells),
                (baseline - 10) / max(c.height for c in cells))
    sheet = Image.new('RGBA', (1024, 1024))
    bounds, frames = [], []
    for frame, cell in enumerate(cells):
        cell = cell.resize((max(1, round(cell.width * scale)), max(1, round(cell.height * scale))),
                           Image.Resampling.LANCZOS)
        x, y = round((256 - cell.width) / 2), baseline - cell.height
        packed = Image.new('RGBA', (256, 256))
        packed.alpha_composite(cell, (x, y))
        frames.append(packed)
        sheet.alpha_composite(packed, (frame % 4 * 256, frame // 4 * 256))
        bounds.append([x, y, cell.width, cell.height])
    sheet.save(incoming / (name + '_sheet.png'))
    sheet.save(runtime / (name + '_sheet.webp'), lossless=True, method=6)
    report[name] = {'sourceSize': list(image.size), 'sourceBounds': source_bounds, 'sourceFrameOrder': order,
                    'extraction': 'whole alpha components; detached details assigned to nearest pose',
                    'tinySpeckPixelsRemoved': removed,
                    'oldAtlasFrame': index, 'oldAtlasBounds': list(old_box),
                    'baseline': baseline, 'scale': scale, 'bounds': bounds}
    previews[name] = frames
(incoming / 'PACKING.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
review = []
for frame in range(16):
    canvas = Image.new('RGB', (256 * len(identities), 256), (35, 39, 48))
    for column, name in enumerate(identities):
        canvas.paste(previews[name][frame], (256 * column, 0), previews[name][frame])
    review.append(canvas)
review[0].save(incoming / ('mycelium_preview.webp' if mycelium else 'canopy_preview.webp'), save_all=True, append_images=review[1:],
               duration=[125] * 6 + [250] * 2 + [160] * 4 + [100] * 2 + [300] * 2,
               loop=0, quality=85)
print('Packed', len(identities), args.batch, 'sheets with', len(identities) * 16, 'authored poses, alpha and fixed baseline')
