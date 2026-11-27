"""v8.3.29: pack art order 96 (mission plan phase B) -> assets/art/mission96/<key>.webp.
sha/bytes checked against MANIFEST. Black-background VFX -> luminance alpha (max channel x1.35, unpremultiplied, <8 transparent).
Per-frame resize to <= 2x on-screen size (SCALE); WebP q80 (q75 if > 150 KB)."""
from hashlib import sha256
import json
from pathlib import Path
import numpy as np
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
SRC, DST = ROOT / 'assets/incoming/mission_plan_b96', ROOT / 'assets/art/mission96'
# frame size after packing (shown 72 px objects -> 144, shade 56 -> 112, parts 56 -> 112); others stay
FRAME = {'mo96_escort': 144, 'mo96_hunt': 144, 'mo96_crack': 144, 'mo96_fog_wisp': 144, 'mo96_roots_flower': 144, 'e96_shade_walk': 112, 'gp96_parts': 112}
DST.mkdir(parents=True, exist_ok=True); total = 0; reg = {}
for r in json.loads((SRC / 'MANIFEST.json').read_text(encoding='utf-8')):
    b = (SRC / r['file']).read_bytes(); assert len(b) == r['bytes'] and sha256(b).hexdigest() == r['sha256'], r['key']
    im = Image.open(SRC / r['file']).convert('RGBA'); assert (im.width, im.height) == (r['width'], r['height']), r['key']
    if r.get('background') == 'black':
        a = np.asarray(im).astype(np.float32); al = np.clip(a[..., :3].max(axis=2) * 1.35, 0, 255)
        rgb = np.clip(a[..., :3] * (255 / np.maximum(al, 1))[..., None], 0, 255); al[al < 8] = 0
        im = Image.fromarray(np.dstack([rgb, al]).astype(np.uint8), 'RGBA')
    fw, fh, cols, n = r['frameWidth'], r['frameHeight'], r['columns'], r['frameCount']
    if r['key'] in FRAME:
        nf = FRAME[r['key']]; rows = (n + cols - 1) // cols; out = Image.new('RGBA', (nf * cols, nf * rows), (0, 0, 0, 0))
        for i in range(n):
            x, y = (i % cols) * fw, (i // cols) * fh; out.paste(im.crop((x, y, x + fw, y + fh)).resize((nf, nf), Image.LANCZOS), ((i % cols) * nf, (i // cols) * nf))
        im, fw, fh = out, nf, nf
    f = DST / (r['key'] + '.webp'); im.save(f, 'WEBP', quality=80, alpha_quality=85, method=6)
    if f.stat().st_size > 150_000: im.save(f, 'WEBP', quality=75, alpha_quality=85, method=6)
    total += f.stat().st_size; reg[r['key']] = {'fw': fw, 'fh': fh, 'frames': n, 'rate': r.get('frameRate', 8), 'loop': bool(r.get('loop'))}
    print(f"{r['key']:20} {f.stat().st_size/1024:6.1f} KB  {im.width}x{im.height}  decoded {im.width*im.height*4/1048576:.2f} MiB")
print(len(reg), 'files', f'{total/1e6:.2f} MB')
