"""Pack generated Canopy, Mycelium, Nectar or special-creature sheets without changing authored pose proportions.

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


def extract_poses(image, row_columns=(4, 4, 4, 4)):
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
    count = sum(row_columns)
    main = pieces[:count]
    centers, groups = {}, {i: [] for i in range(count)}
    for component in main:
        x, y = component['sx'] / component['area'], component['sy'] / component['area']
        row = min(3, int(y * 4 / image.height))
        frame = sum(row_columns[:row]) + min(row_columns[row] - 1, int(x * row_columns[row] / image.width))
        assert frame not in centers, ('merged/ambiguous source poses', frame)
        centers[frame] = (x, y)
        groups[frame].append(component)
    assert len(centers) == count
    removed = 0
    for component in pieces[count:]:
        if component['area'] < 4:
            removed += component['area']
            continue
        x, y = component['sx'] / component['area'], component['sy'] / component['area']
        frame = min(centers, key=lambda f: (centers[f][0] - x)**2 + (centers[f][1] - y)**2)
        groups[frame].append(component)
    cells, bounds = [], []
    for frame in range(count):
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
parser.add_argument('--batch', choices=['canopy', 'mycelium', 'nectar', 'elite', 'seasons', 'root'], default='canopy')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
mycelium = args.batch == 'mycelium'
nectar = args.batch == 'nectar'
elite = args.batch == 'elite'
late = {
    'seasons': ('ch2_s4_animations', 'ch2_seasons', ['c24_budling', 'c24_sunscarab', 'c24_leafblade', 'c24_frostbell', 'c24_stormfruit', 'c24_equinox', 'c24_season_wisp']),
    'root': ('ch2_s5_animations', 'ch2_root', ['c25_rootling', 'c25_thorn_charger', 'c25_bramble_assassin', 'c25_sap_oracle', 'c25_seed_bomb', 'c25_bark_guard', 'c25_root_choir']),
}.get(args.batch)
incoming = root / ('assets/incoming/elite_summons' if elite else 'assets/incoming/ch2_s3_animations' if nectar else 'assets/incoming/ch2_s2_animations' if mycelium else 'assets/incoming/ch2_s1_animations')
runtime = root / ('assets/art/elite_summons' if elite else 'assets/art/ch2_nectar' if nectar else 'assets/art/ch2_mycelium' if mycelium else 'assets/art/ch2_canopy')
if late:
    incoming = root / 'assets/incoming' / late[0]
    runtime = root / 'assets/art' / late[1]
(incoming / 'raw').mkdir(parents=True, exist_ok=True)
runtime.mkdir(parents=True, exist_ok=True)
mapping = json.loads(Path(args.source_map).read_text(encoding='utf-8'))
identities = ['c21_crown_sapling', 'mini_jelly', 'c3_elite', 'feast_target', 'mimic_chest'] if elite else ['c23_drone', 'c23_dartwing', 'c23_pollen_sniper', 'c23_honey_bomb', 'c23_wax_guard', 'c23_choir_moth', 'c23_grub'] if nectar else ['c22_drifter', 'c22_hopper', 'c22_sniper', 'c22_mold_sac', 'c22_bulwark', 'c22_oracle', 'c22_sporeling'] if mycelium else ['c21_sprout', 'c21_vine_hunter', 'c21_spore_lantern',
              'c21_fruit_pod', 'c21_root_beetle', 'c21_thorn_oracle']
if late:
    identities = late[2]
assert set(mapping) == set(identities), 'Exactly the selected batch species are required'
atlas = None if elite else Image.open(root / ('assets/ch2_nectar_enemy_atlas.png' if nectar else 'assets/ch2_mycelium_enemy_atlas.png' if mycelium else 'assets/ch2_enemy_atlas.png')).convert('RGBA')
if late:
    atlas = Image.open(root / ('assets/ch2_' + args.batch + '_enemy_atlas.png')).convert('RGBA')
report, previews = {}, {}
baseline = 236
for index, name in enumerate(identities):
    source = Path(mapping[name])
    image = Image.open(source).convert('RGBA')
    # Generated grids can have slight canvas-aspect drift. Extraction uses both
    # source axes; final cells remain exactly square without stretching anatomy.
    assert .90 <= image.width / image.height <= 1.10, (name, image.size)
    shutil.copyfile(source, incoming / 'raw' / (name + '_generated.png'))
    # Mimic delivered six locomotion poses in its first row and four in each
    # remaining row. Select existing authored actions into the final 4x4 grid.
    row_columns = (6, 4, 4, 4) if name == 'mimic_chest' else (4, 4, 4, 4)
    cells, source_bounds, removed = extract_poses(image, row_columns)
    # The lantern generator placed charge in idle slot 7 and release in slot 9.
    # Reorder existing authored poses into the runtime contract without redrawing.
    order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17] if name == 'mimic_chest' else [0, 1, 2, 3, 4, 5, 6, 11, 8, 7, 9, 10, 12, 13, 14, 15] if name == 'c21_spore_lantern' else list(range(16))
    cells = [cells[i] for i in order]
    reference = None
    if elite:
        reference = {'c21_crown_sapling': 'assets/ch2_enemy_atlas.png',
            'mini_jelly': 'assets/art/delve_bosses/delve10_minijelly.webp',
            'c3_elite': 'assets/e_tank.png', 'feast_target': 'assets/e_tank.png',
            'mimic_chest': 'assets/chest.png'}[name]
        old = Image.open(root / reference).convert('RGBA')
        if name == 'c21_crown_sapling':
            old = old.crop((512, 256, 768, 512))
        else:
            old = old.resize((256, 256), Image.Resampling.LANCZOS)
    else:
        atlas_index = [0, 1, 6, 2, 3, 4, 5][index] if args.batch == 'root' else index
        old = atlas.crop((atlas_index % 4 * 256, atlas_index // 4 * 256,
                          (atlas_index % 4 + 1) * 256, (atlas_index // 4 + 1) * 256))
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
    report[name] = {'sourceSize': list(image.size), 'sourceRowColumns': list(row_columns), 'sourceBounds': source_bounds, 'sourceFrameOrder': order,
                    'extraction': 'whole alpha components; detached details assigned to nearest pose',
                    'tinySpeckPixelsRemoved': removed,
                    'oldAtlasFrame': (6 if name == 'c21_crown_sapling' else None) if elite else atlas_index, 'reference': reference, 'oldAtlasBounds': list(old_box),
                    'baseline': baseline, 'scale': scale, 'bounds': bounds}
    previews[name] = frames
(incoming / 'PACKING.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
review = []
for frame in range(16):
    canvas = Image.new('RGB', (256 * len(identities), 256), (35, 39, 48))
    for column, name in enumerate(identities):
        canvas.paste(previews[name][frame], (256 * column, 0), previews[name][frame])
    review.append(canvas)
review[0].save(incoming / (args.batch + '_preview.webp' if late else 'elite_preview.webp' if elite else 'nectar_preview.webp' if nectar else 'mycelium_preview.webp' if mycelium else 'canopy_preview.webp'), save_all=True, append_images=review[1:],
               duration=[125] * 6 + [250] * 2 + [160] * 4 + [100] * 2 + [300] * 2,
               loop=0, quality=85)
print('Packed', len(identities), args.batch, 'sheets with', len(identities) * 16, 'authored poses, alpha and fixed baseline')
