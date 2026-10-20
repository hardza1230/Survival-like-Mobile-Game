#!/usr/bin/env python3
"""Pack art order 27 (journal Equipment/Forge UI) and 28 (book page-turn / cover) to WebP.
27: assets/incoming/journal_gear_ui -> assets/art/journal (50% per frame; sources drawn at 2x)
28: assets/incoming/book_transition -> assets/art/book   (80% per frame; delivery README budget)
Frames are resized one by one so the grid stays exact. Writes MANIFEST.json with scaled cells + nineSlice."""
import json, os
from PIL import Image

def pack(src, out, scale):
    os.makedirs(out, exist_ok=True)
    m = json.load(open(os.path.join(src, 'MANIFEST.json')))
    res = []
    for e in m['assets']:
        k = e['key']; im = Image.open(os.path.join(src, e['file'])).convert('RGBA')
        fw, fh, cols, rows = e['frameWidth'], e['frameHeight'], e['columns'], e['rows']
        cw, ch = max(1, round(fw * scale)), max(1, round(fh * scale))
        dst = Image.new('RGBA', (cw * cols, ch * rows), (0, 0, 0, 0))
        for r in range(rows):
            for c in range(cols):
                cell = im.crop((c * fw, r * fh, (c + 1) * fw, (r + 1) * fh))
                dst.paste(cell.resize((cw, ch), Image.LANCZOS), (c * cw, r * ch))
        p = os.path.join(out, k + '.webp')
        if e['background'] == 'opaque': dst.convert('RGB').save(p, 'WEBP', quality=84, method=6)
        else: dst.save(p, 'WEBP', quality=88, method=6)
        ns = [max(1, round(v * scale)) for v in e['nineSlice']] if e.get('nineSlice') else None
        res.append({'key': k, 'file': p, 'cw': cw, 'ch': ch, 'cols': cols, 'rows': rows, 'frames': e['frameCount'], 'nineSlice': ns})
        print(k, dst.size, (cw, ch), ns, os.path.getsize(p) // 1024, 'KB')
    json.dump(res, open(os.path.join(out, 'MANIFEST.json'), 'w'), indent=1)
    tot = sum(os.path.getsize(r['file']) for r in res)
    dec = sum(r['cw'] * r['ch'] * r['cols'] * r['rows'] * 4 for r in res)
    print(out, 'total', tot // 1024, 'KB · decoded', round(dec / 1048576, 2), 'MiB')

pack('assets/incoming/journal_gear_ui', 'assets/art/journal', 0.5)
pack('assets/incoming/book_transition', 'assets/art/book', 0.8)
