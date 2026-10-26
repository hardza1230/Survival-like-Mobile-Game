"""Mechanical cell crop/scale/alpha-preserving packing of original ImageGen effects."""
from pathlib import Path
from PIL import Image
import hashlib, json, os

root = Path(__file__).resolve().parents[1]
src = root / 'assets/incoming/yuzu51'
out = root / 'assets/art/yuzu51'
out.mkdir(parents=True, exist_ok=True)
rows = []
for kind in ['pomelo', 'lime', 'bloodorange']:
    p = src / (kind + '_source.png')
    im = Image.open(p).convert('RGBA')
    assert im.size == (1536, 1024), im.size
    assert im.getchannel('A').getextrema()[0] == 0
    sheet = Image.new('RGBA', (8 * 192, 192))
    rects, crops, centers = [], [], []
    # Observed empty inter-row gutters, rather than assuming the generated art is pixel-gridded.
    divider = {'pomelo': 500, 'lime': 580, 'bloodorange': 480}[kind]
    # Alpha-energy valleys measured between painted subjects; some peak frames exceed nominal cells.
    seams = {'pomelo': [[0,374,758,1174,1536],[0,320,741,1220,1536]],
             'lime': [[0,390,758,1158,1536],[0,326,760,1158,1536]],
             'bloodorange': [[0,402,742,1142,1536],[0,362,755,1196,1536]]}[kind]
    for row in range(2):
        cells = []
        for col in range(4):
            rect = (seams[row][col], 0 if row == 0 else divider, seams[row][col+1], divider if row == 0 else 1024)
            rects.append(rect)
            cells.append(im.crop(rect))
        boxes = [c.getchannel('A').point(lambda a: 255 if a >= 48 else 0).getbbox() for c in cells]
        assert all(boxes)
        boxes = [(max(0,b[0]-3),max(0,b[1]-3),min(c.width,b[2]+3),min(c.height,b[3]+3)) for c,b in zip(cells,boxes)]
        crops.append(boxes)
        scale = min(172/max(b[2]-b[0] for b in boxes), 172/max(b[3]-b[1] for b in boxes))
        for col, cell in enumerate(cells):
            part = cell.crop(boxes[col])
            part = part.resize((round(part.width*scale), round(part.height*scale)), Image.Resampling.LANCZOS)
            sheet.alpha_composite(part, ((row*4+col)*192+(192-part.width)//2, (192-part.height)//2))
            a = part.getchannel('A')
            b = a.crop((a.width//2-8, a.height//2-8, a.width//2+8, a.height//2+8))
            centers.append(round(sum(b.getdata())/256, 2))
    dest = out / ('yz_51_'+kind+'.webp')
    tmp = dest.with_suffix('.tmp.webp')
    sheet.save(tmp, 'WEBP', lossless=True, method=6)
    with tmp.open('r+b') as f:
        os.fsync(f.fileno())
    tmp.replace(dest)
    with Image.open(dest) as check:
        check.load()
        assert check.size == (1536, 192)
        assert check.getpixel((0, 0))[3] == 0
    rows.append(dict(key='yz_51_'+kind, path=dest.relative_to(root).as_posix(),
                     source=p.relative_to(root).as_posix(), source_sha256=hashlib.sha256(p.read_bytes()).hexdigest(),
                     sha256=hashlib.sha256(dest.read_bytes()).hexdigest(), bytes=dest.stat().st_size,
                     frames=8, frame=192, source_rects=rects, common_crops=crops,
                     alpha=list(sheet.getchannel('A').getextrema()), center_alpha_mean=centers))
(out/'MANIFEST.json').write_text(json.dumps(rows, indent=2)+'\n', encoding='utf8')
print(json.dumps(dict(atlases=3, frames=24, decoded_bytes=3*1536*192*4, bytes=sum(a['bytes'] for a in rows), centers={a['key']: a['center_alpha_mean'] for a in rows})))

# Source QA only: matte compositing demonstrates true alpha, not a gameplay screenshot.
review = Image.new('RGB', (1536, 576), (45, 42, 48))
for i, kind in enumerate(['pomelo', 'lime', 'bloodorange']):
    im = Image.open(out / ('yz_51_'+kind+'.webp'))
    review.paste(im, (0, i*192), im.getchannel('A'))
review.save(src / 'alpha_review.png')
