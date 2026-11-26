"""Pack the original twelve-frame loading illustration without redrawing any frame."""
from pathlib import Path
from PIL import Image
import json,hashlib
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'assets/incoming/loading_transition836'
m=json.loads((SOURCE/'MANIFEST.json').read_text(encoding='utf-8'))
p=SOURCE/m['file'];data=p.read_bytes()
assert len(data)==m['bytes'] and hashlib.sha256(data).hexdigest()==m['sha256']
im=Image.open(p)
assert im.mode=='RGBA' and im.size==(m['frameWidth']*4,m['frameHeight']*3) and m['frameCount']==12
out=ROOT/m['runtime']['path'];out.parent.mkdir(parents=True,exist_ok=True)
im.convert('RGB').save(out,'WEBP',quality=80,method=6)
if out.stat().st_size>153600:im.convert('RGB').save(out,'WEBP',quality=75,method=6)
data=out.read_bytes();m['runtime'].update(bytes=len(data),sha256=hashlib.sha256(data).hexdigest())
(SOURCE/'MANIFEST.json').write_text(json.dumps(m,indent=2)+'\n',encoding='utf-8',newline='\n')
print('Loading transition: 12 original frames,',len(data),'runtime bytes, DOM-only rendering')
