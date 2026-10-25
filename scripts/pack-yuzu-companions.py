"""Mechanical ImageGen sprite packing: alpha retained, no painted replacement art."""
from pathlib import Path
from PIL import Image, ImageDraw
import hashlib,json,io,os
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'assets/incoming/yuzu_companions';OUT=ROOT/'assets/art/yuzu_companions'
OUT.mkdir(parents=True,exist_ok=True)
def save(im,path,fmt='PNG'):
    b=io.BytesIO();im.save(b,format=fmt,**({'lossless':True,'method':6} if fmt=='WEBP' else {}));data=b.getvalue()
    tmp=path.with_suffix(path.suffix+'.tmp')
    with tmp.open('wb') as f:f.write(data);f.flush();os.fsync(f.fileno())
    tmp.replace(path)
    with Image.open(path) as check:check.load();assert check.size==im.size
    return {'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
manifest=[];board=Image.new('RGB',(1024,3*300),'#282030');d=ImageDraw.Draw(board)
for row,key in enumerate(['pomelo','lime','bloodorange']):
    source=SRC/'originals'/(key+'.png');im=Image.open(source).convert('RGBA');assert im.getextrema()[3][0]==0
    cells=[im.crop((round(x*im.width/4),round(y*im.height/2),round((x+1)*im.width/4),round((y+1)*im.height/2))) for y in range(2) for x in range(4)]
    # One common bounding rectangle and scale preserves pose size and locomotion.
    boxes=[c.getchannel('A').point(lambda a:255 if a>100 else 0).getbbox() for c in cells];assert all(boxes)
    box=(max(0,min(b[0] for b in boxes)-3),max(0,min(b[1] for b in boxes)-3),min(cells[0].width,max(b[2] for b in boxes)+3),min(cells[0].height,max(b[3] for b in boxes)+3))
    packed=Image.new('RGBA',(1024,512));scale=min(244/(box[2]-box[0]),244/(box[3]-box[1]))
    for i,c in enumerate(cells):
        part=c.crop(box).resize((round((box[2]-box[0])*scale),round((box[3]-box[1])*scale)),Image.Resampling.LANCZOS)
        frame=Image.new('RGBA',(256,256));frame.alpha_composite(part,((256-part.width)//2,250-part.height));packed.alpha_composite(frame,((i%4)*256,(i//4)*256))
        preview=frame.resize((128,128),Image.Resampling.LANCZOS);board.paste(preview,((i%8)*128,row*300+55),preview)
    meta=save(packed,OUT/('yz_'+key+'.webp'),'WEBP');save(packed,SRC/('yz_'+key+'.png'))
    manifest.append({'key':'yz_'+key,'file':'yz_'+key+'.webp','width':1024,'height':512,'frame':256,'frames':8,'source':str(source.relative_to(ROOT)).replace('\\','/'),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'crop':list(box),'alpha':list(packed.getextrema()[3]),**meta})
    d.text((12,row*300+15),key+' | walk 0-3 / attack 4-7 | 256px native cells',fill='#fff0c9')
vfx=SRC/'originals/vfx.png'
if vfx.exists():
    im=Image.open(vfx).convert('RGBA');assert im.getextrema()[3][0]==0
    # The donor uses a wider third slam. Explicit observed boundaries preserve that entire ring.
    boundaries=[[0,.235,.478,.799,1],[0,.25,.5,.785,1],[0,.25,.5,.75,1],[0,.25,.5,.75,1]]
    for row,key in enumerate(['slam','rain','infusion','shield']):
        rects=[(round(boundaries[row][i]*im.width),round(row*im.height/4),round(boundaries[row][i+1]*im.width),round((row+1)*im.height/4)) for i in range(4)]
        parts=[im.crop(b) for b in rects];scale=min(248/max(p.width for p in parts),248/max(p.height for p in parts));packed=Image.new('RGBA',(1024,256))
        for i,part in enumerate(parts):
            part=part.resize((round(part.width*scale),round(part.height*scale)),Image.Resampling.LANCZOS);packed.alpha_composite(part,(i*256+(256-part.width)//2,(256-part.height)//2))
        meta=save(packed,OUT/('yz_fx_'+key+'.webp'),'WEBP');save(packed,SRC/('yz_fx_'+key+'.png'))
        manifest.append({'key':'yz_fx_'+key,'file':'yz_fx_'+key+'.webp','width':1024,'height':256,'frame':256,'frames':4,'source':str(vfx.relative_to(ROOT)).replace('\\','/'),'sourceSha256':hashlib.sha256(vfx.read_bytes()).hexdigest(),'sourceRects':rects,'alpha':list(packed.getextrema()[3]),**meta})
save(board,SRC/'review.png')
for p in [SRC/'MANIFEST.json',OUT/'MANIFEST.json']:p.write_text(json.dumps(manifest,indent=2),encoding='utf8')
(SRC/'QA_REPORT.json').write_text(json.dumps({'sourceVisualReview':'passed: three distinct fruit companions, 4x2 grids, eight poses each','alpha':'true generated alpha retained','packing':'common crop/scale and shared foot anchor; lossless WebP','phoneVisualAndFPS':'pending owner review','assets':manifest},indent=2),encoding='utf8')
print('Packed',len(manifest),'alpha sheets /',sum(x['frames'] for x in manifest),'frames /',sum(x['bytes'] for x in manifest),'runtime bytes')
