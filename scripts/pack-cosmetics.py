"""Orders 66+67 (Wardrobe): verify MANIFEST sha256, pack WebP into assets/art/cosmetics/.
Black-background FX (dash/pop) become luminance-alpha so they draw with NORMAL blend and can be dyed. Prints ASSET_FX rows."""
import hashlib,json,pathlib
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1];OUT=ROOT/'assets/art/cosmetics';OUT.mkdir(parents=True,exist_ok=True)
rows_out=[];total=0
for batch in ['cosmetics','cosmetics2']:
    SRC=ROOT/'assets/incoming'/batch;m=json.loads((SRC/'MANIFEST.json').read_text());rows=m if isinstance(m,list) else (m.get('assets') or m.get('files'))
    for r in rows:
        b=(SRC/r['file']).read_bytes();assert hashlib.sha256(b).hexdigest()==r['sha256'],r['key']
        im=Image.open(SRC/r['file']).convert('RGBA')
        if r.get('background')!='alpha':
            px=im.load()
            for y in range(im.height):
                for x in range(im.width):
                    R,G,B,_=px[x,y];a=max(R,G,B)
                    px[x,y]=(0,0,0,0) if a<6 else (min(255,R*255//a),min(255,G*255//a),min(255,B*255//a),a)
        dest=OUT/(r['key']+'.webp');im.save(dest,'WEBP',quality=88,method=6,exact=True);n=dest.stat().st_size;total+=n
        rate=14 if r['key'].startswith(('cos_dash','cos_pop')) else 8
        rows_out.append(f"  {r['key']}:{{url:'assets/art/cosmetics/{r['key']}.webp',fw:{r['frameWidth']},fh:{r['frameHeight']},frames:{r['frameCount']},rate:{rate},anchor:'center',loop:{str(bool(r.get('loop'))).lower()}}},")
        print(f"{r['key']:20} {im.width}x{im.height} {n:>7} B")
print('total',total)
print("\n".join(rows_out))
