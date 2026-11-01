"""Order 62 status effects: verify vs MANIFEST · loops/one-shots → 96px frames (black bg → lum×1.35 alpha, unpremultiplied) · st_icons 128px cells → 64px → assets/art/status_fx/."""
from pathlib import Path
from PIL import Image
import hashlib,json
root=Path(__file__).resolve().parents[1];src=root/'assets/incoming/status62';dst=root/'assets/art/status_fx';dst.mkdir(parents=True,exist_ok=True)
m=json.loads((src/'MANIFEST.json').read_text());assert len(m['files'])==17
total=0;dec=0
for a in m['files']:
  p=src/a['file'];b=p.read_bytes();assert len(b)==a['bytes'],p;assert hashlib.sha256(b).hexdigest()==a['sha256'],p
  im=Image.open(p).convert('RGBA');assert im.size==(a['width'],a['height']),p
  cell=64 if a['key']=='st_icons' else 96;cols=a['columns'];rows=a['frameCount']//cols if a['key']=='st_icons' else 1
  out=Image.new('RGBA',(cell*cols,cell*rows),(0,0,0,0))
  for i in range(cols*rows):
    c,r=i%cols,i//cols;fr=im.crop((c*a['frameWidth'],r*a['frameHeight'],(c+1)*a['frameWidth'],(r+1)*a['frameHeight'])).resize((cell,cell),Image.LANCZOS);out.paste(fr,(c*cell,r*cell))
  if a['background']=='black':
    px=out.load()
    for y in range(out.height):
      for x in range(out.width):
        r_,g,bb,_=px[x,y];al=min(255,int(max(r_,g,bb)*1.35))
        if al<8:px[x,y]=(0,0,0,0);continue
        q=255/al;px[x,y]=(min(255,int(r_*q)),min(255,int(g*q)),min(255,int(bb*q)),al)
  f=dst/(a['key']+'.webp');out.save(f,'WEBP',quality=88,alpha_quality=92,method=6)
  s=f.stat().st_size;total+=s;dec+=out.width*out.height*4;print(a['key'],out.size,a['frameCount'],a['loop'],s)
print('total',total,'bytes · decoded',round(dec/2**20,2),'MiB')
