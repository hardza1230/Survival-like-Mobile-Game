from pathlib import Path
from PIL import Image
import hashlib,json
root=Path(__file__).resolve().parents[1]; src=root/'assets/incoming/boss_victory46/wayseed_key_source.png'; dest=root/'assets/art/boss_victory/bv46_key.webp';dest.parent.mkdir(parents=True,exist_ok=True)
im=Image.open(src).convert('RGBA');assert im.getchannel('A').getextrema()==(0,255)
im.thumbnail((256,256),Image.Resampling.LANCZOS);im.save(dest,'WEBP',lossless=True,method=6)
with Image.open(dest) as chk:chk.load();assert chk.getchannel('A').getextrema()==(0,255)
row=dict(key='bv46_key',source=src.relative_to(root).as_posix(),source_sha256=hashlib.sha256(src.read_bytes()).hexdigest(),path=dest.relative_to(root).as_posix(),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),bytes=dest.stat().st_size,size=im.size,tool='built-in image_gen')
(dest.parent/'MANIFEST.json').write_text(json.dumps(row,indent=2)+'\n',encoding='utf8');print(json.dumps(row))
