"""Pack authored hero sprite sheets without masking or per-frame retouching."""
from PIL import Image,ImageDraw
from pathlib import Path
import hashlib,json,io
root=Path(__file__).resolve().parents[1];src=root/'assets/incoming/hero_motion823';out=root/'assets/art/hero_motion823';out.mkdir(parents=True,exist_ok=True)
names=['mint_clean','cocoa','taro_clean','sesame_clean','yuzu_combo','sniper','mint_run','titan_run','rocket','sniper_charge'];assets=[];checks=[]
for name in names:
 p=src/(name+'_source.png');raw=p.read_bytes();im=Image.open(io.BytesIO(raw)).convert('RGBA');assert im.size==(1774,887);w,h=im.size;sheet=Image.new('RGBA',(1024,128));frames=[];tiles=[];rects=[]
 for i in range(8):
  col=i%4;row=i//4;rect=(round(col*w/4),round(row*h/2),round((col+1)*w/4),round((row+1)*h/2));tile=im.crop(rect);a=tile.getchannel('A').point(lambda x:255 if x>=16 else 0)
  assert a.getbbox(),(name,i,'empty');assert not any(a.crop(b).getbbox() for b in [(0,0,tile.width,2),(0,tile.height-2,tile.width,tile.height),(0,0,2,tile.height),(tile.width-2,0,tile.width,tile.height)]),(name,i,'source seam')
  tiles.append(tile.resize((128,128),Image.Resampling.LANCZOS));rects.append(rect)
 boxes=[t.getchannel('A').point(lambda x:255 if x>=16 else 0).getbbox()for t in tiles];b=boxes[0];cx=(b[0]+b[2])/2;foot=b[3];left=min(q[0]for q in boxes);top=min(q[1]for q in boxes);right=max(q[2]for q in boxes);bottom=max(q[3]for q in boxes)
 desired={'mint_clean':1.17,'cocoa':1.13,'taro_clean':1,'sesame_clean':1,'yuzu_combo':1,'sniper':1,'mint_run':1.12,'titan_run':1.35,'rocket':1.2,'sniper_charge':1}[name]
 limits=[desired,(64-3)/max(.01,cx-left),(125-64)/max(.01,right-cx),(121-3)/max(.01,foot-top)]
 if bottom>foot:limits.append((125-121)/(bottom-foot))
 scale=min(limits);size=round(128*scale);effective=size/128;dx=round(64-cx*effective);dy=round(121-foot*effective)
 for i,tile in enumerate(tiles):
  f=Image.new('RGBA',(128,128));f.paste(tile.resize((size,size),Image.Resampling.LANCZOS),(dx,dy));alpha=f.getchannel('A').point(lambda x:255 if x>=16 else 0)
  assert not any(alpha.crop(z).getbbox()for z in [(0,0,128,1),(0,127,128,128),(0,0,1,128),(127,0,128,128)]),(name,i,'output edge')
  frames.append(hashlib.sha256(f.tobytes()).hexdigest());sheet.paste(f,(i*128,0));checks.append({'name':name,'frame':i,'sourceRect':rects[i],'sourceBorderAlphaBelow16':True,'frameSha256':frames[-1]})
 assert len(set(frames))==8,(name,'duplicate frames');dest=out/(name+'.webp');sheet.save(dest,'WEBP',lossless=True,exact=True,method=6)
 with Image.open(dest)as dec:assert dec.convert('RGBA').tobytes()==sheet.tobytes()
 assets.append({'name':name,'source':p.relative_to(root).as_posix(),'sourceBytes':len(raw),'sourceSha256':hashlib.sha256(raw).hexdigest(),'path':dest.relative_to(root).as_posix(),'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'frame':128,'frames':8,'cols':8,'uniformScale':effective,'uniformOffset':[dx,dy]})
preview=Image.new('RGBA',(1024,len(names)*160),'#261e30');draw=ImageDraw.Draw(preview)
for row,item in enumerate(assets):
 draw.text((2,row*160),item['name'],fill='#ffffff');sheet=Image.open(root/item['path']).convert('RGBA');preview.alpha_composite(sheet,(0,row*160+20))
preview.convert('RGB').save(src/'contact.png');(src/'MANIFEST.json').write_text(json.dumps({'assets':assets},indent=2)+'\n',encoding='utf8');(src/'QA_REPORT.json').write_text(json.dumps({'frames':checks,'sourceSeamsChecked':True,'noMasks':True,'runtimeBytes':sum(a['bytes']for a in assets)},indent=2)+'\n',encoding='utf8');print(json.dumps({'sheets':len(assets),'frames':len(checks),'bytes':sum(a['bytes']for a in assets)}))
