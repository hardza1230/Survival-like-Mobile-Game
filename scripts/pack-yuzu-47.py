"""Mechanical crop, common scale, alpha-preserving packing of approved ImageGen assets."""
from pathlib import Path
from PIL import Image
import hashlib,json,os
root=Path(__file__).resolve().parents[1];src=root/'assets/incoming/yuzu47';out=root/'assets/art/yuzu47';out.mkdir(parents=True,exist_ok=True)
rows=[]
for kind in ['pomelo','lime','bloodorange','attacks']:
 p=src/(kind+'_source_v2.png')
 if not p.exists():p=src/(kind+'_source.png')
 im=Image.open(p).convert('RGBA');assert im.getchannel('A').getextrema()==(0,255)
 cols=2 if kind=='attacks' else 4;n=4 if kind=='attacks' else 8
 cells=[im.crop((round(x*im.width/cols),round(y*im.height/2),round((x+1)*im.width/cols),round((y+1)*im.height/2)))for y in range(2)for x in range(cols)]
 boxes=[c.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox() for c in cells];assert all(boxes)
 common=(min(b[0]for b in boxes),min(b[1]for b in boxes),max(b[2]for b in boxes),max(b[3]for b in boxes))
 sheet=Image.new('RGBA',(1024,256 if kind=='attacks' else 512))
 for i,c in enumerate(cells):
  box=boxes[i]if kind=='attacks' else common;part=c.crop(box);scale=min(232/part.width,232/part.height);part=part.resize((round(part.width*scale),round(part.height*scale)),Image.Resampling.LANCZOS)
  frame=Image.new('RGBA',(256,256));frame.alpha_composite(part,((256-part.width)//2,(256-part.height)//2 if kind=='attacks' else 248-part.height))
  sheet.alpha_composite(frame,((i%4)*256,(i//4)*256))
 key='yz_47_'+kind;dest=out/(key+'.webp');temp=dest.with_suffix('.tmp.webp');sheet.save(temp,'WEBP',lossless=True,method=6)
 with temp.open('r+b')as f:os.fsync(f.fileno())
 temp.replace(dest)
 with Image.open(dest)as check:check.load();assert check.size==sheet.size
 rows.append(dict(key=key,path=dest.relative_to(root).as_posix(),source=p.relative_to(root).as_posix(),source_sha256=hashlib.sha256(p.read_bytes()).hexdigest(),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),bytes=dest.stat().st_size,frames=n,frame=256,source_grid=[cols,2],common_crop=common,alpha=list(sheet.getchannel('A').getextrema())))
(out/'MANIFEST.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf8')
print(json.dumps(dict(sheets=len(rows),frames=sum(r['frames']for r in rows),bytes=sum(r['bytes']for r in rows))))
