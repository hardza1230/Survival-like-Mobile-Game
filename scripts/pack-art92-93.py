"""Pack the feedback FX and mission card artwork from their verified PNG masters."""
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
SIZES = {
    "sg92_muzzle_echo": (180, 120),
    "sg92_double_barrel": (256, 160),
    "sg92_pellet_trail": (64, 32),
    "hn92_target_mark": (128, 128),
    "hn92_bottle_shadow": (64, 32),
    "hn92_poison_puddle": (192, 128),
    "ws92_light_pool": (256, 256),
    "ws92_dark_creep": (128, 128),
    "ws92_tether": (128, 20),
    "cb93_back": (304, 432),
    "cb93_back_shine": (304, 432),
    "cb93_flip": (256, 256),
    "sg_new_primary": (192, 128),
    "hc_new_mouth": (192, 192),
    "hc_new_emerge": (192, 192),
}


def remove_black(frame):
    r, g, b, _ = frame.split()
    lum = ImageChops.lighter(ImageChops.lighter(r, g), b)
    alpha = lum.point(lambda value: min(255, int(value * 1.35)) if value >= 6 else 0)
    colors = []
    for channel in (r, g, b):
        pixels = bytes(min(255, value * 255 // opacity) if opacity else 0
                       for value, opacity in zip(channel.tobytes(), alpha.tobytes()))
        colors.append(Image.frombytes("L", frame.size, pixels))
    return Image.merge("RGBA", (*colors, alpha))


def pack():
    entries = []
    for batch in ("fx92", "card_back93", "feedback_redesign"):
        source = ROOT / "assets/incoming" / batch
        for row in json.loads((source / "MANIFEST.json").read_text(encoding="utf8")):
            data = (source / row["file"]).read_bytes()
            assert len(data) == row["bytes"] and hashlib.sha256(data).hexdigest() == row["sha256"], row["key"]
            entries.append((batch, source, row))
    assert {row["key"] for _, _, row in entries} == set(SIZES) and len(entries) == len(SIZES)
    total = decoded = 0
    for batch, source, row in entries:
        key = row["key"]
        fw, fh, count, cols = (row[field] for field in ("frameWidth", "frameHeight", "frameCount", "columns"))
        width, height = SIZES[key]
        im = Image.open(source / row["file"])
        assert im.mode == "RGBA" and im.size == (fw * cols, fh * ((count + cols - 1) // cols)), key
        sheet = Image.new("RGBA", (width * cols, height * ((count + cols - 1) // cols)))
        for index in range(count):
            col, row_index = index % cols, index // cols
            frame = im.crop((col * fw, row_index * fh, (col + 1) * fw, (row_index + 1) * fh))
            if row["background"] == "black":
                frame = remove_black(frame)
            frame = frame.resize((width, height), Image.Resampling.LANCZOS)
            sheet.paste(frame, (col * width, row_index * height))
        target = ROOT / "assets/art" / batch / f"{key}.webp"
        target.parent.mkdir(parents=True, exist_ok=True)
        sheet.save(target, quality=80, alpha_quality=85, method=6)
        if target.stat().st_size > 150_000:
            sheet.save(target, quality=75, alpha_quality=85, method=6)
        size = target.stat().st_size
        total += size
        decoded += sheet.width * sheet.height * 4
        print(f"{key}: {width}x{height} x{count}, {size:,} bytes")
    print(f"Total: {total:,} bytes WebP, {decoded / 1048576:.2f} MiB decoded")


if __name__ == "__main__":
    pack()
