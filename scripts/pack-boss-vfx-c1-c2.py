"""Pack assets/incoming/boss_vfx_c1_c2 (art order 22) into runtime WebP under assets/art/boss_vfx/.
Black VFX -> luminance alpha (lum x1.35, unpremultiplied), NORMAL blend. Keys keep vfx_bNN_* names; loaded per stage via STAGE_SHEETS."""
import json, os
from PIL import Image
SRC='assets/incoming/boss_vfx_c1_c2'; DST='assets/art/boss_vfx'
os.makedirs(DST, exist_ok=True)
man=json.load(open(f'{SRC}/MANIFEST.json'))
out=[]
for m in man:
  key=m['key']; im=Image.open(os.path.join(SRC,os.path.basename(m['file']))).convert('RGBA')
  px=im.load()
  for y in range(im.height):
    for x in range(im.width):
      r,g,b,a=px[x,y]; mx=max(r,g,b); al=min(255,int(mx*1.35))
      if al<8: px[x,y]=(0,0,0,0); continue
      q=255/max(al,1); px[x,y]=(min(255,int(r*q)),min(255,int(g*q)),min(255,int(b*q)),al)
  dst=f'{DST}/{key}.webp'; im.save(dst,'WEBP',quality=88,alpha_quality=90,method=6)
  out.append({'key':key,'file':dst,'width':im.width,'height':im.height,'frameWidth':m['frameWidth'],'frameHeight':m['frameHeight'],'frames':m['frameCount'],'loop':m['loop'],'anchor':m['anchor'],'holdFrame':m.get('holdFrame')})
json.dump(out,open(f'{DST}/MANIFEST.json','w'),indent=1)
for o in out: print(o['key'],o['frameWidth'],o['frameHeight'],o['frames'],o['loop'],o['anchor'],o['holdFrame'],os.path.getsize(o['file'])//1024,'KB')
