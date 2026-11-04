"""Mechanical alpha-preserving retargeting to the existing boss FX frame/footprint geometry."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib,io
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/boss_outline814';OUT=ROOT/'assets/art/boss_outline814';OUT.mkdir(parents=True,exist_ok=True)
C=json.loads((SRC/'CLIPS.json').read_text());registry=json.loads((SRC/'LEGACY.json').read_text())
def sha(b):return hashlib.sha256(b).hexdigest()
def write(p,o):p.write_bytes((json.dumps(o,indent=2)+'\n').encode())
def union(boxes):return(min(b[0]for b in boxes),min(b[1]for b in boxes),max(b[2]for b in boxes),max(b[3]for b in boxes))
def box(im):return im.getchannel('A').point(lambda a:255 if a>20 else 0).getbbox()
sources=[];assets=[];qa=[];tiles={}
for group,names in C['groups'].items():
 p=SRC/(group+'_source.png');raw=p.read_bytes();im=Image.open(p).convert('RGBA');assert im.size==(1536,1024);assert im.getchannel('A').getextrema()[0]==0,(group,'missing true alpha')
 sources.append({'group':group,'path':p.relative_to(ROOT).as_posix(),'bytes':len(raw),'sha256':sha(raw),'size':im.size,'alpha':im.getchannel('A').getextrema()})
 for row,name in enumerate(names):
  spec=next(c for c in C['clips']if c['name']==name);old=registry[spec['old']];w=spec['fw'];h=spec['fh'];ref=Image.open(ROOT/old['url']).convert('RGBA');cols=ref.width//w
  oldboxes=[box(ref.crop((f%cols*w,f//cols*h,f%cols*w+w,f//cols*h+h)))for f in range(old['frames'])];oldbox=union([b for b in oldboxes if b]);target=(max(4,oldbox[0]),max(4,oldbox[1]),min(w-4,oldbox[2]),min(h-4,oldbox[3]));tw=target[2]-target[0];th=target[3]-target[1];assert tw>0 and th>0
  cells=[im.crop((f*256,row*256,(f+1)*256,(row+1)*256))for f in range(6)];boxes=[box(c)for c in cells];assert all(boxes),name;common=union(boxes);sheet=Image.new('RGBA',(w*6,h));frames=[];hashes=[]
  for f,cell in enumerate(cells):
   # One shared crop and transform for all six drawings preserves authored growth/pivot.
   tile=cell.crop(common).resize((tw,th),Image.Resampling.LANCZOS);canvas=Image.new('RGBA',(w,h));canvas.alpha_composite(tile,(target[0],target[1]));a=canvas.getchannel('A');edges=not any(a.crop(b).getbbox()for b in [(0,0,w,2),(0,h-2,w,h),(0,0,2,h),(w-2,0,w,h)]);assert edges
   visible=Image.new('RGBA',canvas.size);visible.paste(canvas,mask=a.point(lambda v:255 if v>20 else 0));hh=sha(visible.tobytes());hashes.append(hh);qa.append({'key':spec['key'],'frame':f,'clearBorder':edges,'alphaBox':a.getbbox(),'visibleHash':hh});sheet.alpha_composite(canvas,(f*w,0));frames.append(canvas)
  assert len(set(hashes))==6,name;tiles[name]=frames;b=io.BytesIO();sheet.save(b,'WEBP',lossless=True,method=6);data=b.getvalue();dest=OUT/(spec['key']+'.webp');dest.write_bytes(data)
  with Image.open(dest)as check:check.load();assert check.size==(w*6,h)
  assets.append({**spec,'path':dest.relative_to(ROOT).as_posix(),'frames':6,'cols':6,'rows':1,'bytes':len(data),'sha256':sha(data),'legacyFootprint':oldbox,'packedFootprint':target,'decodedBytes':w*h*6*4})
def thumb(im,n):
 t=im.copy();t.thumbnail((n,n),Image.Resampling.LANCZOS);return t
order=list(tiles);cols=4;rows=(len(order)+cols-1)//cols;poster=Image.new('RGBA',(1024,rows*280),'#261e30');d=ImageDraw.Draw(poster)
for i,name in enumerate(order):
 x=i%cols*256;y=i//cols*280;t=thumb(tiles[name][2],240);poster.alpha_composite(t,(x+(256-t.width)//2,y+24+(256-t.height)//2));d.text((x+6,y+4),name,fill='#fff0cd')
poster.convert('RGB').save(SRC/'preview.png');gif=[]
for f in range(6):
 p=Image.new('RGBA',(640,rows*180),'#261e30');d=ImageDraw.Draw(p)
 for i,name in enumerate(order):
  x=i%cols*160;y=i//cols*180;t=thumb(tiles[name][f],150);p.alpha_composite(t,(x+(160-t.width)//2,y+22+(150-t.height)//2));d.text((x+4,y+3),name,fill='#fff0cd')
 gif.append(p.convert('RGB'))
gif[0].save(SRC/'preview.gif',save_all=True,append_images=gif[1:],duration=100,loop=0,disposal=2)
write(SRC/'MANIFEST.json',{'sources':sources,'runtime':assets});write(OUT/'MANIFEST.json',{'assets':assets});write(SRC/'QA_REPORT.json',{'provider':'built-in ImageGen','clips':len(assets),'authoredFrames':len(qa),'alphaPreserved':True,'clearBorders':True,'runtimeBytes':sum(a['bytes']for a in assets),'decodedBytes':sum(a['decodedBytes']for a in assets),'method':'shared six-frame crop, mechanical resize to legacy visible FX projection; original alpha retained; no repaint/background subtraction','frames':qa,'phoneReview':'pending; preview is source frame playback, not gameplay'})
print(json.dumps({'clips':len(assets),'frames':len(qa),'bytes':sum(a['bytes']for a in assets),'decoded':sum(a['decodedBytes']for a in assets)}))
