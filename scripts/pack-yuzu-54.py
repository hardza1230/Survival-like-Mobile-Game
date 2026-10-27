"""Mechanical alpha-preserving crop/scale/atlas packing; no effect synthesis."""
from pathlib import Path
from PIL import Image
import numpy as np
import hashlib,json,os
root=Path(__file__).resolve().parents[1];src=root/'assets/incoming/yuzu54';out=root/'assets/art/yuzu54';out.mkdir(parents=True,exist_ok=True)
manifest=[];proof=[]
for kind,rows,names in [('pomelo',2,['combo','breaker']),('lime',3,['vault','pin','pierce']),('bloodorange',5,['sigil','comet','garden','bloom','honey'])]:
 p=src/(kind+'_source.png');im=Image.open(p).convert('RGBA');alpha=np.asarray(im)[:,:,3].astype(float);assert alpha.min()==0
 ys=[0]
 for i in range(1,rows):
  mid=im.height*i/rows;lo=max(ys[-1]+1,round(mid-im.height/rows*.14));hi=round(mid+im.height/rows*.14)
  ys.append(lo+int(np.argmin((alpha[lo:hi,:]**2).sum(axis=1))))
 ys.append(im.height);rects=[];crops=[];sheet=Image.new('RGBA',(rows*4*128,128))
 for row in range(rows):
  xs=[0]
  for i in range(1,4):
   mid=im.width*i/4;lo=max(xs[-1]+1,round(mid-im.width/4*.17));hi=round(mid+im.width/4*.17)
   xs.append(lo+int(np.argmin((alpha[ys[row]:ys[row+1],lo:hi]**2).sum(axis=0))))
  xs.append(im.width);cells=[];boxes=[]
  for col in range(4):
   rect=(xs[col],ys[row],xs[col+1],ys[row+1]);rects.append(rect);cell=im.crop(rect);box=cell.getchannel('A').point(lambda a:255 if a>=48 else 0).getbbox();assert box
   box=(max(0,box[0]-3),max(0,box[1]-3),min(cell.width,box[2]+3),min(cell.height,box[3]+3));cells.append(cell);boxes.append(box)
  crops.append(boxes);scale=min(110/max(b[2]-b[0]for b in boxes),110/max(b[3]-b[1]for b in boxes))
  for col,(cell,box) in enumerate(zip(cells,boxes)):
   part=cell.crop(box);part=part.resize((round(part.width*scale),round(part.height*scale)),Image.Resampling.LANCZOS);frame=Image.new('RGBA',(128,128));frame.alpha_composite(part,((128-part.width)//2,(128-part.height)//2));sheet.alpha_composite(frame,((row*4+col)*128,0));proof.append(frame)
 dest=out/('yz_54_'+kind+'.webp');tmp=dest.with_suffix('.tmp.webp');sheet.save(tmp,'WEBP',lossless=True,method=6)
 with tmp.open('r+b')as f:os.fsync(f.fileno())
 tmp.replace(dest)
 with Image.open(dest)as check:check.load();assert check.size==(rows*4*128,128);assert check.getpixel((0,0))[3]==0
 manifest.append(dict(key='yz_54_'+kind,path=dest.relative_to(root).as_posix(),source=p.relative_to(root).as_posix(),source_sha256=hashlib.sha256(p.read_bytes()).hexdigest(),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),bytes=dest.stat().st_size,frame=128,frames=rows*4,clips={n:i*4 for i,n in enumerate(names)},source_rects=rects,cell_crops=crops,alpha=list(sheet.getchannel('A').getextrema())))
(out/'MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf8')
review=Image.new('RGB',(1024,640),(43,39,47))
for i,frame in enumerate(proof):review.paste(frame,((i%8)*128,(i//8)*128),frame.getchannel('A'))
review.save(src/'alpha_review.png')
print(json.dumps(dict(frames=len(proof),bytes=sum(a['bytes']for a in manifest),decoded_bytes=len(proof)*128*128*4)))
