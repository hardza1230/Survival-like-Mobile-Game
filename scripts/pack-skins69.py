"""Order 69: verify MANIFEST sha256 of DELIVERED files only (candidates are not accepted yet) and pack WebP into assets/art/cosmetics/.
HD pets + skin icon atlas -> ASSET_FX rows; banner -> ASSET_IMAGES row. Hero skin sheets/cards wait until the art side marks them delivered."""
import hashlib,json,pathlib
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/skins69';OUT=ROOT/'assets/art/cosmetics';OUT.mkdir(parents=True,exist_ok=True)
m=json.loads((SRC/'MANIFEST.json').read_text());rows=[];total=0
for r in m['delivered']:
    p=SRC/r['file'];b=p.read_bytes();assert hashlib.sha256(b).hexdigest()==r['sha256'],r['key']
    im=Image.open(p);im=im.convert('RGB' if r.get('background')=='opaque' else 'RGBA')
    assert im.size==(r['width'],r['height']),r['key']
    dest=OUT/(r['key']+'.webp');im.save(dest,'WEBP',quality=84 if r.get('background')=='opaque' else 88,method=6);n=dest.stat().st_size;total+=n
    if r['frameCount']>1: rows.append(f"  {r['key']}:{{url:'assets/art/cosmetics/{r['key']}.webp',fw:{r['frameWidth']},fh:{r['frameHeight']},frames:{r['frameCount']},rate:8,anchor:'center',loop:{str(bool(r.get('loop'))).lower()}}},")
    else: rows.append(f"  {r['key']}:'assets/art/cosmetics/{r['key']}.webp',")
    print(f"{r['key']:20} {im.width}x{im.height} {n:>7} B")
print('total',total);print("\n".join(rows))
