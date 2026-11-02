"""Mechanical alpha-preserving atlas crop/resize of original ImageGen art."""
from pathlib import Path
from PIL import Image,ImageDraw
import io,json,hashlib
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/sesame_invoker811';OUT=ROOT/'assets/art/sesame_invoker811';OUT.mkdir(parents=True,exist_ok=True)
def save(im,p,fmt):
 b=io.BytesIO();im.save(b,fmt,**({'lossless':True,'method':6} if fmt=='WEBP' else {}));data=b.getvalue();t=p.with_suffix(p.suffix+'.tmp');t.write_bytes(data);t.replace(p)
 with Image.open(p) as chk:chk.load();assert chk.size==im.size
 return {'path':str(p.relative_to(ROOT)).replace('\\','/'),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
def js(p,d):p.write_bytes((json.dumps(d,ensure_ascii=False,indent=2)+'\n').encode())
im=Image.open(SRC/'original.png').convert('RGBA');assert im.getchannel('A').getextrema()==(0,255)
sheet=Image.new('RGBA',(768,768));tiles=[];qa=[]
for i in range(16):
 col,row=i%4,i//4;box=(round(col*im.width/4),round(row*im.height/4),round((col+1)*im.width/4),round((row+1)*im.height/4));tile=im.crop(box);bbox=tile.getchannel('A').point(lambda a:255 if a>20 else 0).getbbox();assert bbox
 tile=tile.crop(bbox);tile.thumbnail((164,164),Image.Resampling.LANCZOS);pad=Image.new('RGBA',(192,192));pad.alpha_composite(tile,((192-tile.width)//2,(192-tile.height)//2));sheet.alpha_composite(pad,(col*192,row*192));tiles.append(pad)
 qa.append({'cell':i,'sourceBox':box,'alphaBox':pad.getchannel('A').getbbox(),'borderClear':not pad.getchannel('A').crop((0,0,192,8)).getbbox() and not pad.getchannel('A').crop((0,184,192,192)).getbbox()})
rows=[{'key':'fx_sesame_invoker811',**save(sheet,OUT/'fx_sesame_invoker811.webp','WEBP'),'frame':192,'frames':16,'cols':4}]
icons={'ember':0,'gale':1,'tide':2,'reach':14,'resonance':15,'pulse':12,'flow':5,'ward':11}
for key,i in icons.items():rows.append({'key':'ic_ses811_'+key,**save(tiles[i].resize((64,64),Image.Resampling.LANCZOS),OUT/('ic_ses811_'+key+'.webp'),'WEBP'),'cell':i})
preview=Image.new('RGBA',(768,800),'#261e30');preview.alpha_composite(sheet,(0,32));ImageDraw.Draw(preview).text((12,8),'Sesame Rune Invoker | original painted motifs',fill='#fff0d2');save(preview,SRC/'preview.png','PNG')
js(OUT/'MANIFEST.json',{'assets':rows});js(SRC/'MANIFEST.json',{'source':{'path':str((SRC/'original.png').relative_to(ROOT)).replace(chr(92),'/'),'bytes':(SRC/'original.png').stat().st_size,'sha256':hashlib.sha256((SRC/'original.png').read_bytes()).hexdigest()},'runtime':rows});js(SRC/'QA_REPORT.json',{'cells':qa,'alphaPreserved':True,'runtimeFrame':192,'decodedAtlasBytes':768*768*4,'allBordersClear':all(q['borderClear'] for q in qa)});assert all(q['borderClear'] for q in qa)
print('Packed16paintedmotifs/eighticons, transparent borders checked;',sum(r['bytes'] for r in rows),'runtime bytes')
