"""Animation phase 4 (enemy attack/windup/flee/walk) + phase 5B boss body clips.
Each source atlas keeps its old frames and gets the new 8/12-frame clips appended in row order,
so idle/walk/hurt/death indices stay valid. Writes assets/art/motion-phase4/<sheet>.webp and
scripts/motion-phase4.json (sourceFile -> {url, clips:{rowKey:{start,count,actions,rates}}})."""
from hashlib import sha256
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DST = ROOT / 'assets/art/motion-phase4'
BATCHES = ['enemy-motion-phase4', 'boss-motion-phase5b']


def pack():
    DST.mkdir(parents=True, exist_ok=True)
    groups = {}
    for batch in BATCHES:
        for r in json.loads((ROOT / 'assets/incoming' / batch / 'MANIFEST.json').read_text(encoding='utf-8')):
            if '__' not in r['key']:
                continue
            src = r.get('sourceFile') or r.get('replaces')
            groups.setdefault(src, []).append((batch, r))
    out, total = {}, 0
    for src, rows in groups.items():
        base = Image.open(ROOT / src).convert('RGBA')
        fw = rows[0][1]['frameWidth']; fh = rows[0][1]['frameHeight']
        cols = base.width // fw; old = cols * (base.height // fh)
        frames, clips = [], {}
        for batch, r in rows:
            data = (ROOT / 'assets/incoming' / batch / r['file']).read_bytes()
            assert len(data) == r['bytes'] and sha256(data).hexdigest() == r['sha256'], r['key']
            assert (r['frameWidth'], r['frameHeight']) == (fw, fh), r['key']
            im = Image.open(ROOT / 'assets/incoming' / batch / r['file']).convert('RGBA'); c = r['columns']
            start = old + len(frames)
            for i in range(r['frameCount']):
                frames.append(im.crop((i % c * fw, i // c * fh, i % c * fw + fw, i // c * fh + fh)))
            clips[r['key']] = {'start': start, 'count': r['frameCount'], 'actions': r['actions'],
                               'rates': r.get('suggestedRates') or {}, 'prev': r.get('previousRates') or {},
                               'sourceKey': r.get('sourceKey'), 'sourceFrames': r.get('sourceFrames')}
        rows_needed = (old + len(frames) + cols - 1) // cols
        sheet = Image.new('RGBA', (cols * fw, rows_needed * fh))
        sheet.paste(base.crop((0, 0, cols * fw, (old // cols) * fh)), (0, 0))
        for i, f in enumerate(frames):
            n = old + i; sheet.paste(f, (n % cols * fw, n // cols * fh))
        name = Path(src).parent.name + '__' + Path(src).stem + '.webp'
        o = DST / name
        sheet.save(o, 'WEBP', quality=80, alpha_quality=90, method=6)
        if o.stat().st_size > 150_000:
            sheet.save(o, 'WEBP', quality=75, alpha_quality=90, method=6)
        total += o.stat().st_size
        out[src] = {'url': f'assets/art/motion-phase4/{name}', 'frame': fw, 'old': old, 'cols': cols, 'clips': clips}
    (ROOT / 'scripts/motion-phase4.json').write_text(json.dumps(out, indent=1), encoding='utf-8')
    print(len(out), 'sheets', sum(len(v['clips']) for v in out.values()), 'clips', f'{total/1e6:.2f} MB')


if __name__ == '__main__':
    pack()
