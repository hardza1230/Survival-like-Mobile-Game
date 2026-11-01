"""Order 60: verify vs MANIFEST · A black VFX → lum×1.35 alpha (unpremultiplied) · B bullets kept 128px (same size as boss_orb → hitbox unchanged) → assets/art/boss_vfx/."""
from pathlib import Path
from PIL import Image
import hashlib,json
root=Path(__file__).resolve().parents[1];src=root/'assets/incoming/boss60';dst=root/'assets/art/boss_vfx';m=json.loads((src/'MANIFEST.json').read_text())
for a in m['assets']:
  p=src/a['file'];b=p.read_bytes();assert len(b)==a['bytes'],p
  if a.get('sha256'):assert hashlib.sha256(b).hexdigest()==a['sha256'],p
  im=Image.open(p).convert('RGBA');assert im.size==(a['width'],a['height'])
  if a['background']=='black':
    px=im.load()
    for y in range(im.height):
      for x in range(im.width):
        r,g,bb,_=px[x,y];al=min(255,int(max(r,g,bb)*1.35))
        if al<8:px[x,y]=(0,0,0,0);continue
        q=255/al;px[x,y]=(min(255,int(r*q)),min(255,int(g*q)),min(255,int(bb*q)),al)
    im.save(dst/(a['key']+'.webp'),'WEBP',quality=88,alpha_quality=90,method=6)
  else:
    im.save(dst/(a['key']+'.webp'),'WEBP',quality=90,alpha_quality=100,method=6)
  print(a['key'],a['width']//a['frames'],a['height'],a['frames'],(dst/(a['key']+'.webp')).stat().st_size)
