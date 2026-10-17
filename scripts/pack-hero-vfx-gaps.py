"""Pack assets/incoming/hero_vfx_gaps (art order 20) into runtime WebP under assets/art/hero_vfx/.
Black VFX -> luminance alpha (lum x1.35, unpremultiplied), NORMAL blend. Keys renamed vfx_<hero>_* -> bpx_<hero>_* so they load lazily per hero (artHero).
Unique crescendo 384 -> 256 cells (GPU budget)."""
import json, os
from PIL import Image
SRC='assets/incoming/hero_vfx_gaps'; DST='assets/art/hero_vfx'
os.makedirs(DST, exist_ok=True)
SCALE={'vfx_unique_crescendo':2/3}
man=json.load(open(f'{SRC}/MANIFEST.json')); man=man if isinstance(man,list) else man.get('assets',man.get('files',[]))
out=[]
for m in man:
  src=m['key']; key=src.replace('vfx_','bpx_',1) if src.split('_')[1] in ('cocoa','momo','mint','taro') else src
  try:
    im=Image.open(os.path.join(SRC,os.path.basename(m['file']))).convert('RGBA')
  except OSError as e:
    print('SKIP broken source',m['file'],e); continue
  fw,fh=m['frameWidth'],m['frameHeight']; k=SCALE.get(src,1)
  if k!=1: im=im.resize((round(im.width*k),round(im.height*k)),Image.LANCZOS); fw=round(fw*k); fh=round(fh*k)
  px=im.load()
  for y in range(im.height):
    for x in range(im.width):
      r,g,b,a=px[x,y]; mx=max(r,g,b); al=min(255,int(mx*1.35))
      if al<8: px[x,y]=(0,0,0,0); continue
      q=255/max(al,1); px[x,y]=(min(255,int(r*q)),min(255,int(g*q)),min(255,int(b*q)),al)
  dst=f'{DST}/{key}.webp'; im.save(dst,'WEBP',quality=88,alpha_quality=90,method=6)
  out.append({'key':key,'source':src,'file':dst,'width':im.width,'height':im.height,'frameWidth':fw,'frameHeight':fh,'frames':m.get('frameCount'),'loop':m.get('loop'),'anchor':m.get('anchor')})
json.dump(out,open(f'{DST}/MANIFEST.json','w'),indent=1)
for o in out: print(o['key'],o['width'],o['height'],o['frameWidth'],o['frameHeight'],o['frames'],o['loop'],o['anchor'],os.path.getsize(o['file'])//1024,'KB')
