"""Remove baked checkerboards and tiny export artifacts from skill icons."""

from pathlib import Path
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, binary_propagation, label


def remove_checkerboard(pixels: np.ndarray) -> bool:
    """Clear the neutral checkerboard connected to the artwork's inner edge."""
    rgb = pixels[:, :, :3].astype(np.int16)
    alpha = pixels[:, :, 3]
    value = rgb.mean(axis=2)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)

    # Generated 128 px icons have 8 px transparent padding around a baked grey
    # checkerboard. Only run this cleanup when that signature is present.
    band = np.zeros(alpha.shape, dtype=bool)
    band[8:120, 8:14] = band[8:120, 114:120] = True
    band[8:14, 8:120] = band[114:120, 8:120] = True
    signature = band & (alpha > 200) & (chroma < 28) & (value > 95) & (value < 240)
    if signature.sum() < 420:
        # Newer cutouts already removed most of the board, but can retain a
        # translucent neutral checker fringe that becomes visible on brown cards.
        translucent = (alpha > 0) & (alpha < 190) & (chroma < 24) & (value > 82) & (value < 248)
        background = binary_propagation(band & translucent, mask=translucent)
        components, count = label(translucent)
        for component_id in range(1, count + 1):
            component = components == component_id
            if component.sum() >= 300:
                background |= component
        if not background.any():
            return False
        pixels[background, 3] = 0
        return True

    neutral = (alpha > 20) & (chroma < 34) & (value > 88) & (value < 244)
    background = binary_propagation(band & neutral, mask=neutral)
    # A curved icon can enclose a second patch of the same checkerboard (for
    # example the hole inside Boomerang Cookie), so clear only large enclosed
    # neutral components. Small silver/white details remain artwork.
    components, count = label(neutral)
    for component_id in range(1, count + 1):
        component = components == component_id
        if component.sum() >= 400:
            background |= component
    # Clear the one-pixel grey fringe, while retaining colorful glow and dark outlines.
    fringe = binary_dilation(background, iterations=1) & (chroma < 25) & (value > 92) & (value < 246)
    pixels[background | fringe, 3] = 0
    return True


def remove_white_islands(pixels: np.ndarray) -> bool:
    components, count = label(pixels[:, :, 3] > 30)
    changed = False
    for component_id in range(1, count + 1):
        ys, xs = np.where(components == component_id)
        if not len(xs) or len(xs) > 300:
            continue
        rgb = pixels[ys, xs, :3]
        if np.all(rgb.mean(axis=0) > 248):
            pixels[ys, xs, 3] = 0
            changed = True
    return changed


def remove_neutral_speckles(pixels: np.ndarray) -> bool:
    """Remove disconnected grey checker crumbs without touching colored sparks."""
    components, count = label(pixels[:, :, 3] > 30)
    changed = False
    for component_id in range(1, count + 1):
        ys, xs = np.where(components == component_id)
        if not len(xs) or len(xs) > 16:
            continue
        rgb = pixels[ys, xs, :3].astype(np.int16)
        chroma = (rgb.max(axis=1) - rgb.min(axis=1)).mean()
        value = rgb.mean()
        if chroma < 18 and 88 < value < 225:
            pixels[ys, xs, 3] = 0
            changed = True
    return changed


def clean_icon(path: Path) -> bool:
    image = Image.open(path).convert("RGBA")
    pixels = np.array(image)
    changed = remove_checkerboard(pixels)
    changed = remove_neutral_speckles(pixels) or changed
    changed = remove_white_islands(pixels) or changed
    if changed:
        Image.fromarray(pixels).save(path)
    return changed


paths = [Path(arg) for arg in sys.argv[1:]] or sorted(Path("assets").glob("ic_*.png"))
for icon_path in paths:
    if clean_icon(icon_path):
        print(f"cleaned {icon_path}")
