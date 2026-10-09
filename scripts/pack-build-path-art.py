"""Pack assets/incoming/build_path_art PNGs into runtime WebP (assets/art/build_path).
Character sheets: 256px cells -> 128px cells (same layout). Black-background VFX:
luminance alpha (lum x1.35, unpremultiplied) so they render with NORMAL blend."""
import json, os, sys
from PIL import Image
SRC='assets/incoming/build_path_art'; DST='assets/art/bp_fx'
os.makedirs(DST, exist_ok=True)
meta=[]
for root,_,files in os.walk(SRC):
  for f in sorted(files):
    if not f.endswith('.png') or root==SRC: continue
    key=f[:-4]; im=Image.open(os.path.join(root,f)).convert('RGBA')
    if key.endswith('_sheet'):
      im=im.resize((im.width//2, im.height//2), Image.LANCZOS); cell=128
      im.save(f'{DST}/{key}.webp','WEBP',lossless=True,method=6)
    else:
      cell=128 if key.startswith('vfx_impale_stack') else 256
      px=im.load(); black=sum(1 for x in range(0,im.width,16) for y in range(0,im.height,16) if px[x,y][3]>200 and max(px[x,y][:3])<12)>20
      if black:
        for y in range(im.height):
          for x in range(im.width):
            r,g,b,a=px[x,y]; m=max(r,g,b); al=min(255,int(m*1.35))
            if al<8: px[x,y]=(0,0,0,0); continue
            k=255/max(al,1); px[x,y]=(min(255,int(r*k)),min(255,int(g*k)),min(255,int(b*k)),al)
      im.save(f'{DST}/{key}.webp','WEBP',quality=88,alpha_quality=90,method=6)
    meta.append((key,im.width,im.height,cell))
for m in meta: print(*m)
