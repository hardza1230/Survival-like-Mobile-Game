"""Verify Frozen Pantry PNG masters and pack the mission's four-frame WebP sheets."""

import hashlib
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/incoming/frozen-pantry"
TARGET = ROOT / "assets/art/frozen-pantry"
ROLES = ("basic", "fast", "dasher", "shooter", "tank", "captain", "general")
FRAME = 128
COUNT = 4


def pack():
    rows = json.loads((SOURCE / "MANIFEST.json").read_text(encoding="utf-8"))
    assert [row["key"] for row in rows] == ["fp_new_" + role for role in ROLES]
    TARGET.mkdir(parents=True, exist_ok=True)
    for row in rows:
        key = row["key"]
        p = SOURCE / row["file"]
        original = p.read_bytes()
        assert len(original) == row["bytes"], key
        assert hashlib.sha256(original).hexdigest() == row["sha256"], key
        assert (row["frameWidth"], row["frameHeight"], row["frameCount"], row["columns"]) == (
            FRAME, FRAME, COUNT, COUNT
        ), key
        with Image.open(p) as sheet:
            assert sheet.size == (FRAME * COUNT, FRAME) and sheet.mode == "RGBA", key
            for i in range(COUNT):
                alpha = sheet.getchannel("A").crop((FRAME * i, 0, FRAME * (i + 1), FRAME))
                box = alpha.getbbox()
                assert alpha.getextrema() == (0, 255) and box is not None, (key, i)
                assert min(box[0], box[1], FRAME - box[2], FRAME - box[3]) >= 6, (key, i, box)
                assert box[3] == 118, (key, i, box)
            out = TARGET / (key + ".webp")
            sheet.save(out, "WEBP", quality=80, alpha_quality=90, method=6)
            if out.stat().st_size > 150_000:
                sheet.save(out, "WEBP", quality=75, alpha_quality=90, method=6)
            print(f"{key}: {out.stat().st_size:,} bytes")


if __name__ == "__main__":
    pack()
