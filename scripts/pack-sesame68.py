"""Order 68 (Sesame runes part 2): verify MANIFEST sha256, pack WebP into assets/art/sesame68/ (black-bg cast seals → luminance alpha). Prints ASSET_FX rows."""
import hashlib,json,pathlib
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/sesame68';OUT=ROOT/'assets/art/sesame68';OUT.mkdir(parents=True,exist_ok=True)
m=json.loads((SRC/'MANIFEST.json').read_text());rows=m if isinstance(m,list) else (m.get('assets') or m.get('files'))
for r in rows:
    b=(SRC/r['file']).read_bytes();assert hashlib.sha256(b).hexdigest()==r['sha256'],r['key']
    im=Image.open(SRC/r['file']).convert('RGBA')
    if r.get('background')!='alpha':
        px=im.load()
        for y in range(im.height):
            for x in range(im.width):
                R,G,B,_=px[x,y];a=max(R,G,B);px[x,y]=(0,0,0,0) if a<6 else (min(255,R*255//a),min(255,G*255//a),min(255,B*255//a),a)
    im.save(OUT/(r['key']+'.webp'),'WEBP',quality=88,method=6,exact=True)
    rate=14 if r['key'].startswith('ses_cast') else 8
    print(f"  {r['key']}:{{url:'assets/art/sesame68/{r['key']}.webp',fw:{r['frameWidth']},fh:{r['frameHeight']},frames:{r['frameCount']},rate:{rate},anchor:'center',loop:{str(bool(r.get('loop'))).lower()}}},")
