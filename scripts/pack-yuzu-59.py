"""Mechanically crop the three built-in ImageGen donors; preserve their original alpha."""
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'assets/incoming/yuzu59'
OUT = ROOT / 'assets/art/build_cards/yuzu59'
# Donor gutters are slightly irregular. Measured partitions avoid cutting the character silhouettes.
PARTITIONS = [
    ([0, 330, 623, 915, 1254], [[0, 300, 626, 941, 1254], [0, 316, 626, 935, 1254], [0, 316, 626, 940, 1254], [0, 318, 625, 943, 1254]]),
    ([0, 321, 628, 916, 1254], [[0, 335, 631, 949, 1254], [0, 330, 646, 946, 1254], [0, 330, 630, 950, 1254], [0, 328, 622, 942, 1254]]),
    ([0, 338, 646, 932, 1254], [[0, 343, 647, 951, 1254], [0, 347, 641, 943, 1254], [0, 328, 642, 946, 1254], [0, 329, 641, 943, 1254]])]

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    records = []
    review = Image.new('RGBA', (8 * 112, 6 * 126), '#251a32')
    for group, (ys, rows) in enumerate(PARTITIONS, 1):
        source = SRC / f'icons_{group}_source.png'
        donor = Image.open(source).convert('RGBA')
        assert donor.size == (1254, 1254) and donor.getchannel('A').getextrema() == (0, 255)
        spec = json.loads((SRC / f'icons_{group}_PROMPT.json').read_text(encoding='utf8'))
        for i, name in enumerate(spec['cells']):
            row, col = divmod(i, 4)
            xs = rows[row]
            box = (xs[col], ys[row], xs[col+1], ys[row+1])
            crop = donor.crop(box)
            if name == 'm_splash':
                source = SRC / 'dash_source.png'
                crop = Image.open(source).convert('RGBA')
                box = (0, 0, crop.width, crop.height)
            else:
                source = SRC / f'icons_{group}_source.png'
            # Retain soft source edges; fit into a fixed padded square, never synthesize/repaint pixels.
            bounds = crop.getchannel('A').point(lambda a: 255 if a > 12 else 0).getbbox()
            crop = crop.crop(bounds)
            crop.thumbnail((86, 86), Image.Resampling.LANCZOS)
            icon = Image.new('RGBA', (96, 96))
            icon.alpha_composite(crop, ((96-crop.width)//2, (96-crop.height)//2))
            path = OUT / f'{name}.webp'
            icon.save(path, 'WEBP', lossless=True, method=6)
            j = len(records)
            review.alpha_composite(icon, ((j % 8)*112+8, (j//8)*126+6))
            records.append({'id': name, 'file': path.relative_to(ROOT).as_posix(), 'source': source.relative_to(ROOT).as_posix(), 'sourceSha256': sha(source), 'crop': box, 'alphaBounds': bounds, 'size': [96,96], 'sha256': sha(path)})
    review.convert('RGB').save(SRC / 'contact_sheet.jpg', quality=94)
    manifest = {'generator': 'built-in image_gen', 'packing': 'scripts/pack-yuzu-59.py', 'icons': records, 'decodedBytes': len(records)*96*96*4, 'downloadBytes': sum((ROOT/r['file']).stat().st_size for r in records)}
    (OUT/'MANIFEST.json').write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf8')
    print(f"{len(records)} icons / {manifest['downloadBytes']} bytes / {manifest['decodedBytes']} decoded bytes")

if __name__ == '__main__':
    main()
