"""Build runtime assets from the approved Flavorbound concept atlases."""

from pathlib import Path
import sys

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets"


def extract(cell: Image.Image, size=128, dark_backdrop=False) -> Image.Image:
    rgba = np.array(cell.convert("RGBA"))
    if dark_backdrop:
        rgb = rgba[:, :, :3].astype(np.float32)
        lum = rgb.max(axis=2)
        chroma = rgb.max(axis=2) - rgb.min(axis=2)
        signal = np.clip(np.maximum((lum - 18) / 52, chroma / 48), 0, 1)
        rgba[:, :, 3] = (rgba[:, :, 3].astype(np.float32) * signal).astype(np.uint8)
    image = Image.fromarray(rgba)
    bbox = image.getbbox()
    if not bbox:
        return Image.new("RGBA", (size, size))
    image = image.crop(bbox)
    scale = min((size - 10) / image.width, (size - 10) / image.height)
    image = image.resize((max(1, round(image.width * scale)), max(1, round(image.height * scale))), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size))
    canvas.alpha_composite(image, ((size - image.width) // 2, (size - image.height) // 2))
    return canvas


def split_grid(source: Path, columns: int, rows: int, names, dark_backdrop=False):
    atlas = Image.open(source).convert("RGBA")
    cell_w, cell_h = atlas.width // columns, atlas.height // rows
    for index, name in enumerate(names):
        col, row = index % columns, index // columns
        cell = atlas.crop((col * cell_w, row * cell_h, (col + 1) * cell_w, (row + 1) * cell_h))
        extract(cell, dark_backdrop=dark_backdrop).save(OUT / name)


def character_sheet(source: Path, output: str):
    atlas = Image.open(source).convert("RGBA")
    cell_w, cell_h = atlas.width // 4, atlas.height // 2
    strip = Image.new("RGBA", (128 * 8, 128))
    for index in range(8):
        col, row = index % 4, index // 4
        cell = atlas.crop((col * cell_w, row * cell_h, (col + 1) * cell_w, (row + 1) * cell_h))
        strip.alpha_composite(extract(cell), (index * 128, 0))
    strip.save(OUT / output)


def main(paths):
    donut, skills, passives, talent, taro, sesame = map(Path, paths)
    split_grid(donut, 2, 2, ["ic_bear_donut.png", "proj_bear_donut.png", "vfx_choco_glaze.png", "vfx_bear_shockwave.png"], True)
    split_grid(skills, 3, 2, ["ic_mirror.png", "ic_memory.png", "ic_thread.png", "ic_decoy.png", "ic_triseal.png", "ic_echo_step.png"], True)
    split_grid(passives, 2, 2, ["ic_flavor_core.png", "ic_memory_thread.png", "ic_bitter_resolve.png", "ic_returning_taste.png"], True)
    character_sheet(taro, "char_taro_awakened_sheet.png")
    character_sheet(sesame, "char_sesame_awakened_sheet.png")
    bg = Image.open(talent).convert("RGB")
    bg.thumbnail((720, 1280), Image.Resampling.LANCZOS)
    bg.save(OUT / "ui_talent_hall.webp", "WEBP", quality=88, method=6)


if __name__ == "__main__":
    if len(sys.argv) != 7:
        raise SystemExit("usage: process_flavorbound_assets.py DONUT SKILLS PASSIVES TALENT TARO SESAME")
    main(sys.argv[1:])
