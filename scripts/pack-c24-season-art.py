"""Pack assets/incoming/c24_seasons_vfx (art order 19) into runtime WebP under assets/art/c24_seasons/.
Black VFX -> luminance alpha (lum x1.35, unpremultiplied), NORMAL blend. Alpha sheets (Bloom Sprout, HUD icons) copied as-is.
Projectiles upscaled 64 -> 128 cells so they share proj_foe's 128px body. Large full-screen/boss sheets downscaled for GPU budget."""
import json, os
from PIL import Image
SRC='assets/incoming/c24_seasons_vfx'; DST='assets/art/c24_seasons'
os.makedirs(DST, exist_ok=True)
SCALE={'vfx_c24_season_shift_spring':.625,'vfx_c24_season_shift_summer':.625,'vfx_c24_season_shift_autumn':.625,'vfx_c24_season_shift_winter':.625,
       'vfx_c24_time_break':.75,'vfx_c24_metamorph':.75,'proj_c24_frost_shard':2,'proj_c24_autumn_leaf':2}
man=json.load(open(f'{SRC}/MANIFEST.json')); man=man if isinstance(man,list) else man.get('assets',[])
out=[]
for m in man:
  key=m['key']; im=Image.open(m['file']).convert('RGBA'); fw,fh=m['frameWidth'],m['frameHeight']
  k=SCALE.get(key,1)
  if k!=1: im=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS); fw=round(fw*k); fh=round(fh*k)
  if m.get('background')!='alpha':
    px=im.load()
    for y in range(im.height):
      for x in range(im.width):
        r,g,b,a=px[x,y]; mx=max(r,g,b); al=min(255,int(mx*1.35))
        if al<8: px[x,y]=(0,0,0,0); continue
        q=255/max(al,1); px[x,y]=(min(255,int(r*q)),min(255,int(g*q)),min(255,int(b*q)),al)
  dst=f'{DST}/{key}.webp'; im.save(dst,'WEBP',quality=88,alpha_quality=90,method=6)
  out.append({'key':key,'file':dst,'width':im.width,'height':im.height,'frameWidth':fw,'frameHeight':fh,'frames':m.get('frameCount'),'source_sha256':m.get('sha256')})
json.dump(out,open(f'{DST}/MANIFEST.json','w'),indent=1)
for o in out: print(o['key'],o['width'],o['height'],o['frameWidth'],o['frameHeight'],o['frames'],os.path.getsize(o['file'])//1024,'KB')
