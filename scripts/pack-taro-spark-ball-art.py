"""Pack assets/incoming/taro_spark_ball PNGs into runtime WebP (assets/art/taro_spark_ball).
Black-background VFX: luminance alpha (lum x1.35, unpremultiplied) for NORMAL blend. Icons 256 -> 128 into assets/art/build_paths."""
import json, os
from PIL import Image
SRC='assets/incoming/taro_spark_ball'; DST='assets/art/taro_spark_ball'
os.makedirs(DST, exist_ok=True)
ICON={'ic_path_smite_spark':'taro_spark_path','ic_taro_live_current':'taro_live_current','ic_taro_fast_sparks':'taro_fast_sparks','ic_taro_split_spark':'taro_split_spark','ic_taro_piercing_current':'taro_piercing_current'}
man=json.load(open(f'{SRC}/MANIFEST.json')); man=man if isinstance(man,list) else man.get('assets',[])
out=[]
for m in man:
  key=m['file'][:-4]; im=Image.open(f"{SRC}/{m['file']}").convert('RGBA')
  if key in ICON:
    im=im.resize((im.width//2,im.height//2),Image.LANCZOS); dst=f'assets/art/build_paths/{ICON[key]}.webp'
    im.save(dst,'WEBP',lossless=True,method=6)
  else:
    px=im.load()
    for y in range(im.height):
      for x in range(im.width):
        r,g,b,a=px[x,y]; mx=max(r,g,b); al=min(255,int(mx*1.35))
        if al<8: px[x,y]=(0,0,0,0); continue
        k=255/max(al,1); px[x,y]=(min(255,int(r*k)),min(255,int(g*k)),min(255,int(b*k)),al)
    dst=f'{DST}/{key}.webp'; im.save(dst,'WEBP',quality=88,alpha_quality=90,method=6)
  out.append({'key':key,'file':dst,'width':im.width,'height':im.height,'frameWidth':m.get('frame_width'),'frameHeight':m.get('frame_height'),'frames':m.get('frames'),'source_sha256':m.get('sha256')})
json.dump(out,open(f'{DST}/MANIFEST.json','w'),indent=1)
for o in out: print(o['key'],o['width'],o['height'],o['frameWidth'],o['frameHeight'],o['frames'])
