"""Pack original character animation frames; retain genuine alpha and original projected body bounds."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib,io
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/boss_body816';OUT=ROOT/'assets/art/boss_body816';OUT.mkdir(parents=True,exist_ok=True)
legacy=json.loads((SRC/'LEGACY.json').read_text());pairs=json.loads((SRC/'PAIRS.json').read_text())
def sha(b):return hashlib.sha256(b).hexdigest()
def write(p,o):p.write_bytes((json.dumps(o,indent=2)+'\n').encode())
def box(im):return im.getchannel('A').point(lambda v:255 if v>20 else 0).getbbox()
def union(bs):return(min(b[0]for b in bs),min(b[1]for b in bs),max(b[2]for b in bs),max(b[3]for b in bs))
sources=[];assets=[];qa=[];thumbs={}
for gi,keys in enumerate(pairs):
 group='pair'+str(gi+1).zfill(2);p=SRC/(group+'_source.png');raw=p.read_bytes();im=Image.open(p).convert('RGBA');assert im.size==(1536,1024);assert im.getchannel('A').getextrema()[0]==0,group
 sources.append({'group':group,'path':p.relative_to(ROOT).as_posix(),'bytes':len(raw),'sha256':sha(raw),'size':im.size,'alpha':im.getchannel('A').getextrema()})
 for half,base in enumerate(keys if gi<10 else keys[:1]):
  spec=legacy[base];old=Image.open(ROOT/spec['url']).convert('RGBA');fw=spec['frame'];cols=old.width//fw;oldb=union([b for f in range(old.width//fw*(old.height//fw))if(b:=box(old.crop((f%cols*fw,f//cols*fw,(f%cols+1)*fw,(f//cols+1)*fw))))]);ratio=256/fw;target=(max(4,oldb[0]*ratio),max(4,oldb[1]*ratio),min(252,oldb[2]*ratio),min(252,oldb[3]*ratio))
  rows=list(range(4))if gi==10 else[half*2,half*2+1];cells=[im.crop((f*256,r*256,(f+1)*256,(r+1)*256))for r in rows for f in range(6)];bounds=[box(c)for c in cells];assert all(bounds),base;common=union(bounds);scale=min((target[2]-target[0])/(common[2]-common[0]),(target[3]-target[1])/(common[3]-common[1]));size=(max(1,round((common[2]-common[0])*scale)),max(1,round((common[3]-common[1])*scale)));pos=(round((target[0]+target[2]-size[0])/2),round(target[3]-size[1]));sheet=Image.new('RGBA',(1536,len(rows)*256));frames=[];hashes=[]
  for f,c in enumerate(cells):
   tile=c.crop(common).resize(size,Image.Resampling.LANCZOS);frame=Image.new('RGBA',(256,256));frame.alpha_composite(tile,pos);a=frame.getchannel('A');clear=not any(a.crop(b).getbbox()for b in[(0,0,256,2),(0,254,256,256),(0,0,2,256),(254,0,256,256)]);assert clear,base;hh=sha(frame.tobytes());hashes.append(hh);qa.append({'key':'boss_ink816_'+base,'frame':f,'alphaBox':a.getbbox(),'clearBorder':clear,'sha256':hh});sheet.alpha_composite(frame,(f%6*256,f//6*256));frames.append(frame)
  assert len(set(hashes))==len(cells),base
  dest=OUT/('boss_ink816_'+base+'.webp');stream=io.BytesIO();sheet.save(stream,'WEBP',lossless=True,method=6);data=stream.getvalue();dest.write_bytes(data)
  with Image.open(dest)as chk:chk.load();assert chk.size==sheet.size
  stage=14 if base=='boss_pinnacle'else 10+int(base[-1])-1 if base.startswith('c3_')else list(legacy).index(base)
  assets.append({'base':base,'key':'boss_ink816_'+base,'stage':stage,'path':dest.relative_to(ROOT).as_posix(),'source':group,'sourceRows':rows,'frame':256,'frames':len(cells),'cols':6,'rows':len(rows),'oldFrame':fw,'frameRatio':ratio,'originalBounds':oldb,'packedBounds':target,'bytes':len(data),'sha256':sha(data),'decodedBytes':1536*len(rows)*256*4});thumbs[base]=frames
keys=list(thumbs);nrows=(len(keys)+3)//4;poster=Image.new('RGBA',(1024,nrows*272),'#261e30');draw=ImageDraw.Draw(poster)
for i,k in enumerate(keys):
 x=i%4*256;y=i//4*272;poster.alpha_composite(thumbs[k][9],(x,y+16));draw.text((x+4,y+2),k,fill='#fff0cd')
poster.convert('RGB').save(SRC/'preview.png');seq=[]
for f in range(12):
 out=Image.new('RGBA',(640,nrows*176),'#261e30');d=ImageDraw.Draw(out)
 for i,k in enumerate(keys):
  x=i%4*160;y=i//4*176;tile=thumbs[k][f].resize((156,156),Image.Resampling.LANCZOS);out.alpha_composite(tile,(x+2,y+18));d.text((x+2,y+2),k,fill='#fff0cd')
 seq.append(out.convert('RGB'))
seq[0].save(SRC/'preview.gif',save_all=True,append_images=seq[1:],duration=130,loop=0,disposal=2)
write(SRC/'MANIFEST.json',{'sources':sources,'assets':assets});write(OUT/'MANIFEST.json',{'assets':assets});write(SRC/'QA_REPORT.json',{'characters':len(assets),'forms':22,'authoredFrames':len(qa),'alphaPreserved':True,'clearBorders':True,'method':'one common uniform crop/scale per actor, original projected root/foot anchor; true alpha retained; no repaint/background removal','runtimeBytes':sum(a['bytes']for a in assets),'decodedBytes':sum(a['decodedBytes']for a in assets),'frames':qa,'phoneReview':'owner will test; source playback is not gameplay'})
print(json.dumps({'characters':len(assets),'frames':len(qa),'bytes':sum(a['bytes']for a in assets),'decoded':sum(a['decodedBytes']for a in assets)}))
