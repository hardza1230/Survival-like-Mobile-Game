"""Mechanical packing of original built-in ImageGen Stage Clear donors. No synthesized art."""
from pathlib import Path
from PIL import Image
import hashlib,json,os
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'assets/incoming/stage_clear44'; OUT=ROOT/'assets/art/stage_clear';OUT.mkdir(parents=True,exist_ok=True)
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def save(im,p,**kw):
 t=p.with_suffix(p.suffix+'.tmp');im.save(t,format='WEBP',**kw)
 with t.open('r+b') as f: os.fsync(f.fileno())
 t.replace(p)
 with Image.open(p) as q: q.load();assert q.size==im.size
rows=[]
for name in ['background','frame']:
 donor=SRC/(name+'_source.png'); im=Image.open(donor).convert('RGBA');bounds=None
 if name=='frame':
  alpha=im.getchannel('A');assert alpha.getextrema()==(0,255);bounds=alpha.point(lambda a:255 if a>=16 else 0).getbbox();bounds=(max(0,bounds[0]-2),max(0,bounds[1]-2),min(im.width,bounds[2]+2),min(im.height,bounds[3]+2));im=im.crop(bounds);im=im.resize((1008,round(im.height*1008/im.width)),Image.Resampling.LANCZOS)
  assert im.getpixel((im.width//2,im.height//2))[3]>=240
 else: assert im.getchannel('A').getextrema()==(255,255);im=im.convert('RGB')
 dest=OUT/('sc44_'+name+'.webp');save(im,dest,**({'lossless':True,'method':6} if name=='frame' else {'quality':92,'method':6}))
 rows.append(dict(key='sc44_'+name,source=donor.relative_to(ROOT).as_posix(),source_sha256=sha(donor),source_crop=bounds,path=dest.relative_to(ROOT).as_posix(),width=im.width,height=im.height,sha256=sha(dest),bytes=dest.stat().st_size,alpha=name=='frame'))
(OUT/'MANIFEST.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf-8')
print(json.dumps(rows))
