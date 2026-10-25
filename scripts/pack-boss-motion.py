"""Mechanically pack approved original boss Motion Comic backgrounds; never synthesize art."""
from pathlib import Path
from PIL import Image
import hashlib,json,os
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/boss_motion45';OUT=ROOT/'assets/art/story/boss45';OUT.mkdir(parents=True,exist_ok=True)
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
rows=[]
for i in range(15):
 d=SRC/('b%02d'%i);p=d/'background_source_v2.png'
 if not p.exists():p=d/'background_source.png'
 im=Image.open(p);im.load();original=im.size;im=im.convert('RGB');im=im.resize((768,1152),Image.Resampling.LANCZOS)
 key='cs_boss_%02d_memory'%i;dest=OUT/(key+'.webp');tmp=dest.with_suffix('.webp.tmp');im.save(tmp,'WEBP',quality=89,method=6)
 with tmp.open('r+b')as f:os.fsync(f.fileno())
 tmp.replace(dest)
 with Image.open(dest)as check:check.load();assert check.size==(768,1152)
 rows.append(dict(key=key,scene='b%02d'%i,source=p.relative_to(ROOT).as_posix(),source_sha256=sha(p),source_size=original,path=dest.relative_to(ROOT).as_posix(),width=768,height=1152,sha256=sha(dest),bytes=dest.stat().st_size,tool='built-in image_gen'))
(OUT/'MANIFEST.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf-8')
print(json.dumps(dict(backgrounds=len(rows),bytes=sum(x['bytes']for x in rows),decoded_per_scene=768*1152*4)))
