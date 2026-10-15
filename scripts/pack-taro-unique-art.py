"""Pack assets/incoming/taro_unique_needle PNGs (order 18 extensions E-I) into runtime WebP (assets/art/taro_unique).
Black VFX -> luminance alpha (lum x1.35, unpremultiplied), NORMAL blend. Plasma ring 512 -> 384 cells (GPU budget). Icons 256 -> 128 into build_paths."""
import json, os
from PIL import Image
SRC='assets/incoming/taro_unique_needle'; DST='assets/art/taro_unique'
os.makedirs(DST, exist_ok=True)
ICON={'ic_taro_plasma_field':'taro_plasma_field','ic_taro_overcharge':'taro_overcharge','ic_taro_arc_overload':'taro_arc_overload'}
SCALE={'vfx_taro_plasma_ring':.75}
man=json.load(open(f'{SRC}/MANIFEST.json')); man=man if isinstance(man,list) else man.get('assets',[])
out=[]
for m in man:
  key=m['key']; im=Image.open(m['file']).convert('RGBA'); fw,fh=m['frameWidth'],m['frameHeight']
  if key in ICON:
    im=im.resize((im.width//2,im.height//2),Image.LANCZOS); dst=f'assets/art/build_paths/{ICON[key]}.webp'; im.save(dst,'WEBP',lossless=True,method=6); fw//=2; fh//=2
  else:
    k=SCALE.get(key,1)
    if k!=1: im=im.resize((int(im.width*k),int(im.height*k)),Image.LANCZOS); fw=int(fw*k); fh=int(fh*k)
    px=im.load()
    for y in range(im.height):
      for x in range(im.width):
        r,g,b,a=px[x,y]; mx=max(r,g,b); al=min(255,int(mx*1.35))
        if al<8: px[x,y]=(0,0,0,0); continue
        q=255/max(al,1); px[x,y]=(min(255,int(r*q)),min(255,int(g*q)),min(255,int(b*q)),al)
    dst=f'{DST}/{key}.webp'; im.save(dst,'WEBP',quality=88,alpha_quality=90,method=6)
  out.append({'key':key,'file':dst,'width':im.width,'height':im.height,'frameWidth':fw,'frameHeight':fh,'frames':m.get('frameCount'),'source_sha256':m.get('sha256')})
json.dump(out,open(f'{DST}/MANIFEST.json','w'),indent=1)
for o in out: print(o['key'],o['width'],o['height'],o['frameWidth'],o['frameHeight'],o['frames'])
