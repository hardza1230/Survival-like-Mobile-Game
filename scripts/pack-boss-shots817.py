"""Mechanical packing of original four-frame painted shot loops, preserving true alpha and legacy bounds."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib,io
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/boss_shots817';OUT=ROOT/'assets/art/boss_shots817';OUT.mkdir(parents=True,exist_ok=True)
groups=json.loads((SRC/'GROUPS.json').read_text())
def sha(b):return hashlib.sha256(b).hexdigest()
def write(p,o):p.write_bytes((json.dumps(o,indent=2)+'\n').encode())
def box(im):return im.getchannel('A').point(lambda v:255 if v>20 else 0).getbbox()
def union(bs):return(min(b[0]for b in bs),min(b[1]for b in bs),max(b[2]for b in bs),max(b[3]for b in bs))
sources=[];assets=[];qa=[];tiles={}
for g in groups:
 p=SRC/(g['group']+'_source.png');raw=p.read_bytes();im=Image.open(p).convert('RGBA');assert im.width==im.height and im.width>=1024;assert im.getchannel('A').getextrema()[0]==0
 sources.append({'group':g['group'],'path':p.relative_to(ROOT).as_posix(),'size':im.size,'bytes':len(raw),'sha256':sha(raw),'alpha':im.getchannel('A').getextrema()});im=im.resize((1024,1024),Image.Resampling.LANCZOS)
 for row,old in enumerate(g['keys']):
  legacy=Image.open(ROOT/'assets/art/boss_vfx'/(old+'.webp')).convert('RGBA');assert legacy.size==(128,128);oldbox=box(legacy);target=(max(4,oldbox[0]),max(4,oldbox[1]),min(124,oldbox[2]),min(124,oldbox[3]));cells=[im.crop((f*256,row*256,(f+1)*256,(row+1)*256))for f in range(4)];bs=[box(c)for c in cells];assert all(bs),old;common=union(bs);scale=min((target[2]-target[0])/(common[2]-common[0]),(target[3]-target[1])/(common[3]-common[1]));size=(max(1,round((common[2]-common[0])*scale)),max(1,round((common[3]-common[1])*scale)));pos=(round(target[2]-size[0]),round((target[1]+target[3]-size[1])/2));sheet=Image.new('RGBA',(512,128));frames=[];hashes=[];key='bshot_anim817_'+old[6:]
  for f,c in enumerate(cells):
   frame=Image.new('RGBA',(128,128));frame.alpha_composite(c.crop(common).resize(size,Image.Resampling.LANCZOS),pos);a=frame.getchannel('A');clear=not any(a.crop(b).getbbox()for b in[(0,0,128,2),(0,126,128,128),(0,0,2,128),(126,0,128,128)]);assert clear;hh=sha(frame.tobytes());hashes.append(hh);qa.append({'key':key,'frame':f,'clearBorder':clear,'alphaBox':a.getbbox(),'sha256':hh});sheet.alpha_composite(frame,(128*f,0));frames.append(frame)
  assert len(set(hashes))==4,old;dest=OUT/(key+'.webp');stream=io.BytesIO();sheet.save(stream,'WEBP',lossless=True,method=6);data=stream.getvalue();dest.write_bytes(data)
  with Image.open(dest)as check:check.load();assert check.size==(512,128)
  assets.append({'old':old,'key':key,'path':dest.relative_to(ROOT).as_posix(),'source':g['group'],'sourceRow':row,'fw':128,'fh':128,'frames':4,'cols':4,'rate':8,'loop':True,'legacyBounds':oldbox,'targetBounds':target,'bytes':len(data),'sha256':sha(data),'decodedBytes':512*128*4});tiles[old]=frames
poster=Image.new('RGBA',(640,4*176),'#261e30');d=ImageDraw.Draw(poster)
for i,(k,frames)in enumerate(tiles.items()):
 x=i%4*160;y=i//4*176;poster.alpha_composite(frames[1],(x+16,y+24));d.text((x+4,y+4),k,fill='#fff0cd')
poster.convert('RGB').save(SRC/'preview.png');seq=[]
for f in range(4):
 out=Image.new('RGBA',poster.size,'#261e30');d=ImageDraw.Draw(out)
 for i,(k,frames)in enumerate(tiles.items()):
  x=i%4*160;y=i//4*176;out.alpha_composite(frames[f],(x+16,y+24));d.text((x+4,y+4),k,fill='#fff0cd')
 seq.append(out.convert('RGB'))
seq[0].save(SRC/'preview.gif',save_all=True,append_images=seq[1:],duration=125,loop=0,disposal=2)
write(SRC/'MANIFEST.json',{'sources':sources,'assets':assets});write(OUT/'MANIFEST.json',{'assets':assets});write(SRC/'QA_REPORT.json',{'shots':16,'authoredFrames':64,'alphaPreserved':True,'clearBorders':True,'method':'retain native1254px generated sources; normalize4x4grid to1024px only during packing, common uniform four-frame transform to original128px bounds/right tip; no repaint/background removal','runtimeBytes':sum(a['bytes']for a in assets),'decodedBytes':sum(a['decodedBytes']for a in assets),'frames':qa,'phoneReview':'owner will test; source frame playback is not gameplay'})
print(json.dumps({'shots':16,'frames':64,'bytes':sum(a['bytes']for a in assets),'decoded':sum(a['decodedBytes']for a in assets)}))
