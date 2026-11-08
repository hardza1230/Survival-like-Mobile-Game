"""Order 65 (Daily Login 30): verify sources, keep source size (2x of on-screen; cells are only ~46px so halving would blur), WebP into assets/art/login30/.
Black-background FX keep black (game draws them with ADD blend). Prints MENU_ORDER_ART rows."""
import hashlib,json,pathlib
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/login30';OUT=ROOT/'assets/art/login30';OUT.mkdir(parents=True,exist_ok=True)
rows=json.loads((SRC/'MANIFEST.json').read_text())['assets'] if isinstance(json.loads((SRC/'MANIFEST.json').read_text()),dict) else json.loads((SRC/'MANIFEST.json').read_text())
total=0;art={}
for r in rows:
    b=(SRC/r['file']).read_bytes();assert len(b)==r['bytes'] and hashlib.sha256(b).hexdigest()==r['sha256'],r['key']
    im=Image.open(SRC/r['file']).convert('RGBA');fw,fh=r['frameWidth'],r['frameHeight']
    black=r.get('background')!='alpha'
    if black:im=im.convert('RGB')
    dest=OUT/(r['key']+'.webp');im.save(dest,'WEBP',quality=88,method=6);n=dest.stat().st_size;total+=n
    ns=list(r['nineSlice']) if r.get('nineSlice') else None
    art[r['key']]=[fw,fh,r['frameCount'],ns,r['columns'],bool(r.get('loop')),'ADD' if black else 'NORMAL']
    print(f"{r['key']:18} {im.width}x{im.height} {n:>7} B  decoded {im.width*im.height*4/1048576:.2f} MiB")
print('total',total,'bytes');print(json.dumps(art,separators=(',',':')))
