"""Remove tiny near-white export artifacts disconnected from skill icon artwork."""

from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import label


def clean_icon(path: Path) -> bool:
    image = Image.open(path).convert("RGBA")
    pixels = np.array(image)
    components, count = label(pixels[:, :, 3] > 30)
    changed = False

    for component_id in range(1, count + 1):
        ys, xs = np.where(components == component_id)
        if not len(xs) or len(xs) > 300:
            continue
        rgb = pixels[ys, xs, :3]
        # The faulty atlas slicer left pure-white registration marks near the
        # cell edges. Real sparkles are tinted and therefore remain intact.
        if np.all(rgb.mean(axis=0) > 248):
            pixels[ys, xs, 3] = 0
            changed = True

    if changed:
        Image.fromarray(pixels).save(path)
    return changed


for icon_path in sorted(Path("assets").glob("ic_*.png")):
    if clean_icon(icon_path):
        print(f"cleaned {icon_path}")
