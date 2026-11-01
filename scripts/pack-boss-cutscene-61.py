"""Order 61: verify vs MANIFEST · A Fall / C Onward opaque 1080×1920 → 540×960 WebP q84 · B Freed alpha 768×1024 → 384×512 · D black FX → lum×1.35 alpha (unpremultiplied), frames 50% → assets/art/story/boss61/."""
from pathlib import Path
from PIL import Image
import hashlib,json
root=Path(__file__).resolve().parents[1];src=root/'assets/incoming/boss_cutscene61';dst=root/'assets/art/story/boss61';dst.mkdir(parents=True,exist_ok=True)
m=json.loads((src/'MANIFEST.json').read_text());assert m['assets_delivered']==35==len(m['assets'])
total=0;dec=0
for a in m['assets']:
  p=src/a['file'];b=p.read_bytes();assert len(b)==a['bytes'],p;assert hashlib.sha256(b).hexdigest()==a['sha256'],p
  im=Image.open(p).convert('RGBA');assert list(im.size)==a['size'],p
  im=im.resize((im.width//2,im.height//2),Image.LANCZOS);out=dst/(a['key']+'.webp')
  if a['background']=='black':
    px=im.load()
    for y in range(im.height):
      for x in range(im.width):
        r,g,bb,_=px[x,y];al=min(255,int(max(r,g,bb)*1.35))
        if al<8:px[x,y]=(0,0,0,0);continue
        q=255/al;px[x,y]=(min(255,int(r*q)),min(255,int(g*q)),min(255,int(bb*q)),al)
    im.save(out,'WEBP',quality=88,alpha_quality=90,method=6)
  elif a['alpha']:im.save(out,'WEBP',quality=88,alpha_quality=95,method=6)
  else:im.convert('RGB').save(out,'WEBP',quality=84,method=6)
  s=out.stat().st_size;total+=s;dec+=im.width*im.height*4
  print(a['key'],im.size,a.get('frames',1),s)
print('total',total,'bytes · decoded all',round(dec/2**20,1),'MiB (one scene loads ~5 of these)')
