"""Mechanical frame crop, alpha-preserving resize and atlas packing of original ImageGen sheets."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib,io
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/sesame_vfx817';OUT=ROOT/'assets/art/sesame_vfx817';OUT.mkdir(parents=True,exist_ok=True)
F=256;PAD=16
CLIPS={'water':['ppb','pbb','bbb','mbb'],'offense':['ppp','ppm','mmm','mmb'],'prism':['pmb','pmm','flare','impact']}
def sha(b):return hashlib.sha256(b).hexdigest()
def save(im,p,fmt):
 b=io.BytesIO();im.save(b,fmt,**({'lossless':True,'method':6} if fmt=='WEBP' else {}));data=b.getvalue();tmp=p.with_suffix(p.suffix+'.tmp');tmp.write_bytes(data);tmp.replace(p)
 with Image.open(p) as check:check.load();assert check.size==im.size
 return {'path':p.relative_to(ROOT).as_posix(),'bytes':len(data),'sha256':sha(data)}
def js(p,d):p.write_bytes((json.dumps(d,indent=2)+'\n').encode())
expected={r['group']:r for r in json.loads((SRC/'MANIFEST.json').read_text())['sources']}
assets=[];sources=[];qa=[];cliptiles={}
for group,names in CLIPS.items():
 path=SRC/(group+'_source.png');raw=path.read_bytes();assert len(raw)==expected[group]['bytes'] and sha(raw)==expected[group]['sha256'];im=Image.open(path).convert('RGBA');assert im.size==(1536,1024);assert im.getchannel('A').getextrema()[0]==0
 sources.append({'group':group,'path':path.relative_to(ROOT).as_posix(),'bytes':len(raw),'sha256':sha(raw),'width':im.width,'height':im.height,'alpha':im.getchannel('A').getextrema()})
 atlas=Image.new('RGBA',(6*F,4*F))
 for row,name in enumerate(names):
  cells=[im.crop((c*256,row*256,(c+1)*256,(row+1)*256)) for c in range(6)]
  boxes=[c.getchannel('A').point(lambda a:255 if a>20 else 0).getbbox() for c in cells];assert all(boxes)
  common=(min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes));tiles=[];hashes=[]
  for col,cell in enumerate(cells):
   # The shockwave requires a constant outer silhouette; other clips preserve row anchors.
   box=boxes[col] if name=='pmb' else common
   tile=cell.crop(box);tile.thumbnail((F-2*PAD,F-2*PAD),Image.Resampling.LANCZOS);pad=Image.new('RGBA',(F,F));pad.alpha_composite(tile,((F-tile.width)//2,(F-tile.height)//2))
   alpha=pad.getchannel('A');border=not alpha.crop((0,0,F,8)).getbbox() and not alpha.crop((0,F-8,F,F)).getbbox() and not alpha.crop((0,0,8,F)).getbbox() and not alpha.crop((F-8,0,F,F)).getbbox();assert border
   # Hash visible content, not hidden RGB under alpha-zero pixels.
   visible=Image.new('RGBA',(F,F));visible.paste(pad,mask=alpha.point(lambda a:255 if a>20 else 0));hashes.append(sha(visible.tobytes()));tiles.append(pad);atlas.alpha_composite(pad,(col*F,row*F))
   qa.append({'clip':name,'frame':col,'sourceBox':box,'runtimeAlphaBox':alpha.getbbox(),'clearBorder':border,'visibleHash':hashes[-1]})
  assert len(set(hashes))==6,name+' contains duplicate visible frames';cliptiles[name]=tiles
 assets.append({'key':'fx_sesame_vfx817_'+group,**save(atlas,OUT/('fx_sesame_vfx817_'+group+'.webp'),'WEBP'),'frame':F,'frames':24,'cols':6,'rows':4,'clips':names,'decodedBytes':atlas.width*atlas.height*4})
preview=Image.new('RGBA',(768,1120),'#261e30');draw=ImageDraw.Draw(preview)
order=['ppp','ppm','ppb','pbb','mmm','mmb','pmb','pmm','bbb','mbb','flare','impact']
for i,name in enumerate(order):
 x=(i%3)*256;y=(i//3)*280;draw.text((x+12,y+6),name.upper(),fill='#fff0cd');preview.alpha_composite(cliptiles[name][3],(x,y+24))
save(preview,SRC/'preview.png','PNG')
gif=[]
for frame in range(6):
 canvas=Image.new('RGBA',(480,720),'#261e30');draw=ImageDraw.Draw(canvas)
 for i,name in enumerate(order):
  x=(i%3)*160;y=(i//3)*180;draw.text((x+8,y+3),name.upper(),fill='#fff0cd');canvas.alpha_composite(cliptiles[name][frame].resize((160,160),Image.Resampling.LANCZOS),(x,y+20))
 gif.append(canvas.convert('RGB'))
gif[0].save(SRC/'preview.gif',save_all=True,append_images=gif[1:],duration=90,loop=0,disposal=2)
js(OUT/'MANIFEST.json',{'assets':assets});js(SRC/'MANIFEST.json',{'sources':sources,'runtime':assets})
js(SRC/'QA_REPORT.json',{'provider':'built-in ImageGen','sourceSheets':3,'clips':12,'frames':72,'runtimeFrame':F,'alphaPreserved':True,'allBordersClear':all(r['clearBorder'] for r in qa),'decodedBytes':sum(r['decodedBytes'] for r in assets),'framesQA':qa,'ownerPhoneReview':'Animation preference, readability and FPS pending; preview GIF is source-frame playback, not gameplay.'})
print('Packed 12 original six-frame clips:',sum(r['bytes'] for r in assets),'runtime bytes;',sum(r['decodedBytes'] for r in assets),'decoded bytes')
