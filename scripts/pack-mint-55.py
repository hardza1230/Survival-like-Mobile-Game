"""Mechanical crop/foot alignment/alpha-preserving packing of original ImageGen poses."""
from pathlib import Path
from PIL import Image
import numpy as np
import hashlib,json,os
root=Path(__file__).resolve().parents[1];src=root/'assets/incoming/mint55';out=root/'assets/art/mint55';out.mkdir(parents=True,exist_ok=True)
im=Image.open(src/'charge_source.png').convert('RGBA');raw=np.asarray(im);assert raw[:,:,3].min()==0
# Empty-gutter valleys locate the three generated rows. Each row has eight character cells.
a=raw[:,:,3].astype(float);ys=[0]
for j in [1,2]:
 mid=im.height*j/3;lo=round(mid-im.height/3*.12);hi=round(mid+im.height/3*.12);ys.append(lo+int(np.argmin((a[lo:hi]**2).sum(axis=1))))
ys.append(im.height)
cells=[]
def body_box(alpha):
 h,w=alpha.shape;mask=bytearray((alpha>=48).astype('uint8').flatten());best=(0,None)
 for start in range(w*h):
  if not mask[start]:continue
  mask[start]=0;stack=[start];count=0;left=w;top=h;right=bottom=0
  while stack:
   q=stack.pop();x=q%w;y=q//w;count+=1;left=min(left,x);top=min(top,y);right=max(right,x+1);bottom=max(bottom,y+1)
   for n in ([q-1]if x else [])+([q+1]if x+1<w else [])+([q-w]if y else [])+([q+w]if y+1<h else []):
    if mask[n]:mask[n]=0;stack.append(n)
  if count>best[0]:best=(count,(left,top,right,bottom))
 return best[1]
for row in range(3):
 for col in range(8):
  rect=(round(col*im.width/8),ys[row],round((col+1)*im.width/8),ys[row+1]);cell=im.crop(rect);arr=np.asarray(cell);alpha=arr[:,:,3];box=body_box(alpha);assert box
  # Body-colored pixels anchor the character, independent of a long blue lance on either side.
  body=(alpha>=80)&(arr[:,:,1].astype(float)>=arr[:,:,2]*.97)
  xx=np.where(body)[1];anchor=float(np.median(xx))if len(xx)>20 else (box[0]+box[2])/2
  box=(max(0,box[0]-2),max(0,box[1]-2),min(cell.width,box[2]+2),min(cell.height,box[3]+2));cells.append(dict(rect=rect,cell=cell,box=box,anchor=anchor))
scale=min(110/max(c['box'][3]-c['box'][1]for c in cells),116/max(c['box'][2]-c['box'][0]for c in cells))
manifest=[];frames=[]
for row,name in enumerate(['charge','move','release']):
 sheet=Image.new('RGBA',(1024,128));records=[]
 for col,c in enumerate(cells[row*8:row*8+8]):
  b=c['box'];part=c['cell'].crop(b);part=part.resize((round(part.width*scale),round(part.height*scale)),Image.Resampling.LANCZOS)
  x=(128-part.width)//2;y=122-part.height;assert x>=0 and x+part.width<=128 and y>=0
  frame=Image.new('RGBA',(128,128));frame.alpha_composite(part,(x,y));sheet.alpha_composite(frame,(col*128,0));frames.append(frame)
  records.append(dict(source_rect=c['rect'],subject_crop=b,body_anchor=c['anchor'],destination=[x,y,part.width,part.height]))
 key='char_mint_impaler_'+name;dest=out/(key+'.webp');tmp=dest.with_suffix('.tmp.webp');sheet.save(tmp,'WEBP',lossless=True,method=6)
 with tmp.open('r+b')as f:os.fsync(f.fileno())
 tmp.replace(dest)
 with Image.open(dest)as check:check.load();assert check.size==(1024,128);assert check.getpixel((0,0))[3]==0
 manifest.append(dict(key=key,path=dest.relative_to(root).as_posix(),source='assets/incoming/mint55/charge_source.png',source_sha256=hashlib.sha256((src/'charge_source.png').read_bytes()).hexdigest(),original_sha256=hashlib.sha256((src/'charge_original.png').read_bytes()).hexdigest(),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),bytes=dest.stat().st_size,frames=8,frame=128,foot_baseline=122,paint_scale=1,source_scale=scale,cells=records,alpha=list(sheet.getchannel('A').getextrema())))
(out/'MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf8')
proof=Image.new('RGB',(1024,384),(43,39,47))
for i,f in enumerate(frames):proof.paste(f,((i%8)*128,(i//8)*128),f.getchannel('A'))
proof.save(src/'alpha_review.png')
preview=[]
for i in range(8):
 canvas=Image.new('RGB',(384,128),(43,39,47))
 for row in range(3):canvas.paste(frames[row*8+i],(row*128,0),frames[row*8+i].getchannel('A'))
 preview.append(canvas)
preview[0].save(src/'pose_preview.gif',save_all=True,append_images=preview[1:],duration=110,loop=0)
print(json.dumps(dict(frames=24,bytes=sum(a['bytes']for a in manifest),decoded_bytes=24*128*128*4,paint_scale=1)))
