"""Mechanically arrange retained ImageGen FX pixels; no synthesized artwork.

Run from the repository root after every fx_*.png donor is available.
All frames in a sequence share one scale, preserving painted growth and decay.
"""
import hashlib
import io
import json
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

ROOT = Path('assets/incoming/story_motion')
SPECS = [
    ('speed', 'speedlines', 4, 1080, 1920, 4, 1, 'ADD'),
    ('flash', 'flash', 1, 1080, 1920, 1, 1, 'NORMAL'),
    ('transform', 'transform', 8, 768, 768, 4, 2, 'ADD'),
    ('seed', 'seed_glow', 6, 384, 384, 3, 2, 'ADD'),
    ('ribbon', 'flavor_ribbon', 6, 1024, 256, 3, 2, 'ADD'),
    ('crack', 'crack', 5, 1080, 600, 3, 2, 'NORMAL'),
    ('dust', 'dust', 6, 512, 256, 3, 2, 'NORMAL'),
    ('frost', 'frost_shatter', 6, 768, 768, 3, 2, 'NORMAL'),
    ('smoke', 'curse_smoke', 6, 768, 768, 3, 2, 'NORMAL'),
    ('sparkle', 'sparkle', 6, 256, 256, 3, 2, 'ADD'),
]


def main():
    # Validate availability first so an incomplete generation never overwrites
    # only half the delivered batch or silently inserts a substitute frame.
    for source, *_ in SPECS:
        path = ROOT / '_sources' / f'fx_{source}.png'
        with Image.open(path) as check:
            check.verify()
    dest = ROOT / 'shared_fx'
    dest.mkdir(exist_ok=True)
    assets = []
    contact_rows = []
    for source, name, count, fw, fh, cols, rows, blend in SPECS:
        path = ROOT / '_sources' / f'fx_{source}.png'
        donor = Image.open(path).convert('RGBA')
        boxes = [[round((i % cols)*donor.width/cols), round((i//cols)*donor.height/rows),
                  round((i % cols+1)*donor.width/cols), round((i//cols+1)*donor.height/rows)]
                 for i in range(count)]
        if source == 'crack':
            boxes[3:] = [[0, 512, 535, 1024], [535, 512, 1160, 1024]]
        scale = min((fw-16)/max(b[2]-b[0] for b in boxes),
                    (fh-16)/max(b[3]-b[1] for b in boxes))
        strip = Image.new('RGBA', (fw*count, fh), (0,0,0,255) if blend == 'ADD' else (0,0,0,0))
        thumbrow = Image.new('RGB', (1200, 185), '#777777')
        draw = ImageDraw.Draw(thumbrow)
        draw.text((8, 6), f'cs_fx_{name} | {count} x {fw}x{fh} | {blend}', fill='white')
        placements = []
        for i, box in enumerate(boxes):
            cell = donor.crop(box)
            size = (max(1,round(cell.width*scale)), max(1,round(cell.height*scale)))
            cell = cell.resize(size, Image.Resampling.LANCZOS)
            x, y = (fw-cell.width)//2, (fh-cell.height)//2
            strip.alpha_composite(cell, (i*fw+x,y))
            placements.append([x,y,cell.width,cell.height])
            frame = strip.crop((i*fw,0,(i+1)*fw,fh))
            preview = ImageOps.contain(frame, (min(140,1180//count),140), Image.Resampling.LANCZOS)
            tx = 8+i*(1180//count)
            thumbrow.paste(preview,(tx,30),preview)
            draw.text((tx,170), str(i+1), fill='white')
        key = f'cs_fx_{name}'
        output = dest / f'{key}.png'
        buffer = io.BytesIO()
        strip.save(buffer, format='PNG', optimize=True)
        raw = buffer.getvalue()
        tmp = output.with_suffix('.tmp')
        tmp.write_bytes(raw)
        os.replace(tmp,output)
        with Image.open(output) as check:
            check.verify()
        assets.append(dict(key=key,file=output.name,width=fw*count,height=fh,
                           frames=count,frame_width=fw,frame_height=fh,blend=blend,
                           pivot=[.5,.5],padding=8,sha256=hashlib.sha256(raw).hexdigest(),
                           bytes=len(raw),source='../_sources/'+path.name,
                           source_sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
                           source_boxes=boxes,common_scale=scale,frame_placements=placements,
                           method='Uniform shared scale of complete donor cells; centered with >=8px clear gutters; original RGBA retained for NORMAL; black composite for ADD'))
        contact_rows.append(thumbrow)
    manifest = dict(canvas=[1080,1920],assets=assets)
    (dest/'MANIFEST.json').write_bytes((json.dumps(manifest,indent=2)+'\n').encode('utf-8'))
    contact = Image.new('RGB',(1200,185*len(contact_rows)),'#777777')
    for i,row in enumerate(contact_rows):
        contact.paste(row,(0,i*185))
    contact.save(dest/'FX_CONTACT.jpg',quality=94)
    print(json.dumps(dict(files=len(assets),bytes=sum(a['bytes'] for a in assets),contact=str(dest/'FX_CONTACT.jpg'))))


if __name__ == '__main__':
    main()
