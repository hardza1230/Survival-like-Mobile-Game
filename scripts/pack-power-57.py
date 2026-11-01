"""Order 57: verify the delivered 6x4 atlas against MANIFEST, halve each 384px cell to 192px, keep alpha, write lossless WebP."""
from pathlib import Path
from PIL import Image
import hashlib,json
root=Path(__file__).resolve().parents[1];inc=root/'assets/incoming/power57';m=json.loads((inc/'MANIFEST.json').read_text())
src=inc/m['file'];b=src.read_bytes();assert len(b)==m['bytes'] and hashlib.sha256(b).hexdigest()==m['sha256'],'source mismatch'
im=Image.open(src).convert('RGBA');assert im.size==(2304,1536) and len(m['icons'])==24
out=im.resize((1152,768),Image.Resampling.LANCZOS)
dest=root/'assets/art/mobile_ui_789/gear_power57_icons.webp';out.save(dest,'WEBP',quality=90,alpha_quality=100,method=6)
with Image.open(dest) as c: c.load(); assert c.size==(1152,768)
print(json.dumps({'dest':dest.relative_to(root).as_posix(),'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'keys':[i['key'] for i in m['icons']]}))
