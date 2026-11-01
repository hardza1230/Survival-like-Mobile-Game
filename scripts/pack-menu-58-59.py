"""Orders 58 + 59: verify sources against MANIFEST, halve, keep alpha, write WebP into assets/art/mobile_ui_789/."""
from pathlib import Path
from PIL import Image
import hashlib,json
root=Path(__file__).resolve().parents[1];out=root/'assets/art/mobile_ui_789';tot=0
def chk(p,b,h):
  d=p.read_bytes();assert len(d)==b and hashlib.sha256(d).hexdigest()==h,p
for a in json.loads((root/'assets/incoming/power58/MANIFEST.json').read_text()):
  src=root/'assets/incoming/power58'/a['file'];chk(src,a['bytes'],a['sha256']);im=Image.open(src).convert('RGBA');im=im.resize((im.width//2,im.height//2),Image.Resampling.LANCZOS)
  d=out/(a['key']+'.webp');im.save(d,'WEBP',quality=90,alpha_quality=100,method=6);tot+=d.stat().st_size;print(a['key'],im.size,d.stat().st_size)
m=json.loads((root/'assets/incoming/menu59/MANIFEST.json').read_text());src=root/'assets/incoming/menu59'/m['file'];chk(src,m['bytes'],m['sha256'])
im=Image.open(src).convert('RGBA');assert im.size==(2304,1536);im=im.resize((1152,768),Image.Resampling.LANCZOS);d=out/'menu59_icons.webp';im.save(d,'WEBP',quality=90,alpha_quality=100,method=6);tot+=d.stat().st_size
print('menu59_icons',d.stat().st_size,'total',tot)
