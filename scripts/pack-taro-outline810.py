"""Alpha-preserving mechanical crop/resize/packing of the original ImageGen frames."""
from pathlib import Path
from PIL import Image,ImageDraw
import hashlib,json,io
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/taro_outline810';OUT=ROOT/'assets/art/taro_outline810';OUT.mkdir(parents=True,exist_ok=True)
GROUPS={'arcs':['bolt','hit','spark','burst'],'fields':['core','field','plasma','strike']}
SIZES={k:256 for names in GROUPS.values() for k in names}
LOOPS={'bolt','spark','core','field','plasma'}
def sha(b):return hashlib.sha256(b).hexdigest()
def write(p,o):p.write_bytes((json.dumps(o,indent=2)+'\n').encode())
def save(im,p,kind):
 stream=io.BytesIO();im.save(stream,kind,**({'lossless':True,'method':6} if kind=='WEBP' else {}));b=stream.getvalue();p.write_bytes(b)
 with Image.open(p) as check:check.load();assert check.size==im.size
 return {'path':p.relative_to(ROOT).as_posix(),'bytes':len(b),'sha256':sha(b)}
prior=json.loads((SRC/'MANIFEST.json').read_text()) if (SRC/'MANIFEST.json').exists() else None
sources=[];assets=[];qa=[];clips={}
for group,names in GROUPS.items():
 path=SRC/(group+'_source.png');raw=path.read_bytes();im=Image.open(path).convert('RGBA');assert im.size==(1536,1024);assert im.getchannel('A').getextrema()[0]==0
 if prior:
  expected=next(r for r in prior['sources'] if r['group']==group);assert len(raw)==expected['bytes'] and sha(raw)==expected['sha256']
 sources.append({'group':group,**{'path':path.relative_to(ROOT).as_posix(),'bytes':len(raw),'sha256':sha(raw)},'width':1536,'height':1024,'alpha':im.getchannel('A').getextrema()})
 for row,name in enumerate(names):
  cells=[im.crop((c*256,row*256,(c+1)*256,(row+1)*256)) for c in range(6)];boxes=[c.getchannel('A').point(lambda a:255 if a>20 else 0).getbbox() for c in cells];assert all(boxes)
  common=(min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes));size=SIZES[name];pad=max(4,size//16);sheet=Image.new('RGBA',(size*6,size));tiles=[];hashes=[]
  for frame,cell in enumerate(cells):
   tile=cell.crop(common);tile.thumbnail((size-2*pad,size-2*pad),Image.Resampling.LANCZOS);canvas=Image.new('RGBA',(size,size));canvas.alpha_composite(tile,((size-tile.width)//2,(size-tile.height)//2));alpha=canvas.getchannel('A');border=not alpha.crop((0,0,size,2)).getbbox() and not alpha.crop((0,size-2,size,size)).getbbox() and not alpha.crop((0,0,2,size)).getbbox() and not alpha.crop((size-2,0,size,size)).getbbox();assert border
   visible=Image.new('RGBA',canvas.size);visible.paste(canvas,mask=alpha.point(lambda a:255 if a>20 else 0));h=sha(visible.tobytes());hashes.append(h);qa.append({'clip':name,'frame':frame,'size':size,'alphaBox':alpha.getbbox(),'clearBorder':border,'visibleHash':h});sheet.alpha_composite(canvas,(frame*size,0));tiles.append(canvas)
  assert len(set(hashes))==6,name;clips[name]=tiles;key='bpx_taro810_'+name
  assets.append({'key':key,**save(sheet,OUT/(key+'.webp'),'WEBP'),'fw':size,'fh':size,'frames':6,'cols':6,'rows':1,'rate':12 if name=='snowstorm' else 18 if name in LOOPS else 22,'loop':name in LOOPS,'decodedBytes':sheet.width*sheet.height*4})
order=list(SIZES);poster=Image.new('RGBA',(1024,560),'#261e30');draw=ImageDraw.Draw(poster)
for i,name in enumerate(order):
 x=i%4*256;y=i//4*280;draw.text((x+8,y+5),name.upper(),fill='#fff0cd');poster.alpha_composite(clips[name][2].resize((256,256),Image.Resampling.LANCZOS),(x,y+24))
save(poster,SRC/'preview.png','PNG');gif=[]
for frame in range(6):
 canvas=Image.new('RGBA',(640,360),'#261e30');draw=ImageDraw.Draw(canvas)
 for i,name in enumerate(order):
  x=i%4*160;y=i//4*180;draw.text((x+5,y+3),name.upper(),fill='#fff0cd');canvas.alpha_composite(clips[name][frame].resize((160,160),Image.Resampling.LANCZOS),(x,y+20))
 gif.append(canvas.convert('RGB'))
gif[0].save(SRC/'preview.gif',save_all=True,append_images=gif[1:],duration=90,loop=0,disposal=2)
write(OUT/'MANIFEST.json',{'assets':assets});write(SRC/'MANIFEST.json',{'sources':sources,'runtime':assets});write(SRC/'QA_REPORT.json',{'provider':'built-in ImageGen','frames':48,'clips':8,'alphaPreserved':True,'allBordersClear':all(r['clearBorder'] for r in qa),'decodedBytes':sum(a['decodedBytes'] for a in assets),'framesQA':qa,'ownerPhoneReview':'Visual preference/readability/FPS pending; preview is source-frame playback, not gameplay.'})
print('Taro810:',len(assets),'clips / 48 frames;',sum(a['bytes'] for a in assets),'runtime bytes;',sum(a['decodedBytes'] for a in assets),'decoded bytes')
