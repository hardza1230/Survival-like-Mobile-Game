"""Mechanical alpha-preserving VFX row packing from original ImageGen donors."""
from pathlib import Path
from PIL import Image
import hashlib,json,os
root=Path(__file__).resolve().parents[1];src=root/'assets/incoming/yuzu49';out=root/'assets/art/yuzu49';out.mkdir(parents=True,exist_ok=True)
rows=[]
for donor,names in [('pomelo',['peel','slam']),('lime',['volley','rain']),('bloodorange',['sweet','sour','spicy'])]:
 p=src/(donor+'_source.png');im=Image.open(p).convert('RGBA');assert im.getchannel('A').getextrema()[0]==0
 for row,kind in enumerate(names):
  rects=[(round(i*im.width/4),round(row*im.height/len(names)),round((i+1)*im.width/4),round((row+1)*im.height/len(names)))for i in range(4)]
  cells=[im.crop(b)for b in rects];boxes=[c.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()for c in cells];assert all(boxes)
  common=(max(0,min(b[0]for b in boxes)-3),max(0,min(b[1]for b in boxes)-3),min(cells[0].width,max(b[2]for b in boxes)+3),min(cells[0].height,max(b[3]for b in boxes)+3))
  scale=min(236/(common[2]-common[0]),236/(common[3]-common[1]));sheet=Image.new('RGBA',(1024,256))
  for i,c in enumerate(cells):
   part=c.crop(common);part=part.resize((round(part.width*scale),round(part.height*scale)),Image.Resampling.LANCZOS);sheet.alpha_composite(part,(i*256+(256-part.width)//2,(256-part.height)//2))
  key='yz_49_'+kind;dest=out/(key+'.webp');tmp=dest.with_suffix('.tmp.webp');sheet.save(tmp,'WEBP',lossless=True,method=6)
  with tmp.open('r+b')as f:os.fsync(f.fileno())
  tmp.replace(dest)
  with Image.open(dest)as chk:chk.load();assert chk.size==(1024,256)
  rows.append(dict(key=key,path=dest.relative_to(root).as_posix(),source=p.relative_to(root).as_posix(),source_sha256=hashlib.sha256(p.read_bytes()).hexdigest(),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),bytes=dest.stat().st_size,frames=4,frame=256,source_rects=rects,common_crop=common,alpha=list(sheet.getchannel('A').getextrema())))
(out/'MANIFEST.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf8');print(json.dumps(dict(clips=len(rows),frames=28,bytes=sum(a['bytes']for a in rows))))
