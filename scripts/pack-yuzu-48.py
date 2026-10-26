"""Mechanical alignment/encoding for approved animation donors; no art synthesis."""
from pathlib import Path
from PIL import Image
import hashlib,json,os
root=Path(__file__).resolve().parents[1];src=root/'assets/incoming/yuzu48';out=root/'assets/art/yuzu48';out.mkdir(parents=True,exist_ok=True)
rows=[]
def bbox(im):return im.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
def subject_box(im):
 # Select the connected body for the crop; neighboring-row edge scraps are outside this rectangle.
 w,h=im.size;mask=bytearray(1 if a>=32 else 0 for a in im.getchannel('A').getdata());best=(0,None)
 for start in range(w*h):
  if not mask[start]:continue
  mask[start]=0;stack=[start];area=0;left=w;top=h;right=bottom=0
  while stack:
   q=stack.pop();x=q%w;y=q//w;area+=1;left=min(left,x);top=min(top,y);right=max(right,x+1);bottom=max(bottom,y+1)
   for n in ([q-1]if x else [])+([q+1]if x+1<w else [])+([q-w]if y else [])+([q+w]if y+1<h else []):
    if mask[n]:mask[n]=0;stack.append(n)
  if area>best[0]:best=(area,(left,top,right,bottom))
 return best[1]
for kind in ['pomelo','lime','bloodorange']:
 p=src/(kind+'_source_v2.png')
 if not p.exists():p=src/(kind+'_source.png')
 im=Image.open(p).convert('RGBA');assert im.getchannel('A').getextrema()==(0,255)
 cells=[im.crop((round(x*im.width/4),round(y*im.height/4),round((x+1)*im.width/4),round((y+1)*im.height/4)))for y in range(4)for x in range(4)]
 boxes=[subject_box(c)for c in cells];assert all(boxes)
 left=max(0,min(b[0]for b in boxes)-3);right=min(cells[0].width,max(b[2]for b in boxes)+3)
 tallest=max(b[3]-b[1]+6 for b in boxes);scale=min(236/(right-left),236/tallest)
 sheet=Image.new('RGBA',(1024,1024));rects=[]
 for i,(c,b)in enumerate(zip(cells,boxes)):
  # Keep common horizontal axis/scale, align each painted foot rather than the donor's uneven cell bottom.
  rect=(left,max(0,b[1]-3),right,min(c.height,b[3]+3));rects.append(rect);part=c.crop(rect)
  part=part.resize((round(part.width*scale),round(part.height*scale)),Image.Resampling.LANCZOS)
  cell=Image.new('RGBA',(256,256));cell.alpha_composite(part,((256-part.width)//2,248-bbox(part)[3]));sheet.alpha_composite(cell,((i%4)*256,(i//4)*256))
 ref=Image.open(root/('assets/art/yuzu_companions/yz_'+kind+'.webp')).convert('RGBA').crop((0,0,256,256))
 rb=bbox(ref);nb=bbox(sheet.crop((0,0,256,256)));paint_scale=round((rb[3]-rb[1])/(nb[3]-nb[1]),4)
 key='yz_48_'+kind;dest=out/(key+'.webp');tmp=dest.with_suffix('.tmp.webp');sheet.save(tmp,'WEBP',lossless=True,method=6)
 with tmp.open('r+b')as f:os.fsync(f.fileno())
 tmp.replace(dest)
 with Image.open(dest)as test:test.load();assert test.size==(1024,1024)
 rows.append(dict(key=key,path=dest.relative_to(root).as_posix(),source=p.relative_to(root).as_posix(),source_sha256=hashlib.sha256(p.read_bytes()).hexdigest(),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),bytes=dest.stat().st_size,frames=16,frame=256,foot_y=248,source_rects=rects,source_scale=scale,paint_scale=paint_scale,alpha=list(sheet.getchannel('A').getextrema()),walk=list(range(8)),attack=list(range(8,16)),release=12))
(out/'MANIFEST.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf8');print(json.dumps(dict(sheets=len(rows),frames=48,bytes=sum(a['bytes']for a in rows),paint_scale={a['key']:a['paint_scale']for a in rows})))
