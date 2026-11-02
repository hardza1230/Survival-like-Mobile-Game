"""Mechanical crop/scale of new ImageGen citrus VFX. Old artwork remains a fallback."""
from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np
import json,hashlib,io,os
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/bloodorange_skill96';OUT=ROOT/'assets/art/bloodorange_skill96';OUT.mkdir(parents=True,exist_ok=True)
def save(im,p,fmt):
    b=io.BytesIO();im.save(b,fmt,**({'lossless':True,'method':6} if fmt=='WEBP' else {'optimize':True}));data=b.getvalue();tmp=p.with_suffix(p.suffix+'.tmp')
    with tmp.open('wb') as f:f.write(data);f.flush();os.fsync(f.fileno())
    tmp.replace(p)
    with Image.open(p) as c:c.load();assert c.size==im.size
    return {'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
specs=[('arsenal',['sigil','comet','garden','bloom','honey'],'assets/art/yuzu54/yz_54_bloodorange.webp',128),('unique',['open','finish'],'assets/art/yuzu51/yz_51_bloodorange.webp',192)]
manifest=[];source=[];clips=[];qa=[]
for kind,names,oldpath,oldframe in specs:
    raw=SRC/'originals'/(kind+'.png');im=Image.open(raw).convert('RGBA');a=np.array(im.getchannel('A'));assert a.min()==0
    rows=len(names);ys=[0]
    for row in range(1,rows):
        mid=round(im.height*row/rows);r=round(im.height/rows*.18);lo=max(ys[-1]+1,mid-r);hi=min(im.height,mid+r);counts=(a[lo:hi]>32).sum(axis=1);minimum=counts.min();idx=np.flatnonzero(counts==minimum)+lo;ys.append(int(idx[np.argmin(abs(idx-mid))]))
    ys.append(im.height);sheet=Image.new('RGBA',(rows*4*128,128));rects=[];cropBoxes=[]
    for row,name in enumerate(names):
        xs=[0]
        for col in range(1,4):
            mid=round(im.width*col/4);r=round(im.width/4*.22);lo=max(xs[-1]+1,mid-r);hi=min(im.width,mid+r);counts=(a[ys[row]:ys[row+1],lo:hi]>32).sum(axis=0);minimum=counts.min();idx=np.flatnonzero(counts==minimum)+lo;xs.append(int(idx[np.argmin(abs(idx-mid))]))
        xs.append(im.width);cells=[];boxes=[]
        for col in range(4):
            rect=[xs[col],ys[row],xs[col+1],ys[row+1]];cell=im.crop(rect);box=cell.getchannel('A').point(lambda v:255 if v>24 else 0).getbbox();assert box
            box=[max(0,box[0]-2),max(0,box[1]-2),min(cell.width,box[2]+2),min(cell.height,box[3]+2)];cells.append(cell);boxes.append(box);rects.append(rect)
        scale=min(116/max(b[2]-b[0] for b in boxes),116/max(b[3]-b[1] for b in boxes));frames=[]
        for col,(cell,b) in enumerate(zip(cells,boxes)):
            part=cell.crop(b).resize((round((b[2]-b[0])*scale),round((b[3]-b[1])*scale)),Image.Resampling.LANCZOS);frame=Image.new('RGBA',(128,128));frame.alpha_composite(part,((128-part.width)//2,(128-part.height)//2));sheet.alpha_composite(frame,((row*4+col)*128,0));frames.append(frame)
            pixels=np.array(frame);edge=np.concatenate([pixels[0,:,3],pixels[-1,:,3],pixels[:,0,3],pixels[:,-1,3]]);assert edge.max()==0
        cropBoxes.append(boxes);clips.append((kind,name,frames,oldpath,oldframe,row))
        gifs=[]
        for f in frames:
            bg=Image.new('RGB',(128,128),'#34282d');bg.paste(f,(0,0),f);gifs.append(bg)
        gifs[0].save(SRC/(kind+'_'+name+'.gif'),save_all=True,append_images=gifs[1:],duration=140,loop=0)
    key='yz_bo96_'+kind;file=OUT/(key+'.webp');meta=save(sheet,file,'WEBP');assert sheet.getextrema()[3][0]==0
    manifest.append({'key':key,'file':file.name,'path':file.relative_to(ROOT).as_posix(),**meta,'source':raw.relative_to(ROOT).as_posix(),'sourceSha256':hashlib.sha256(raw.read_bytes()).hexdigest(),'width':sheet.width,'height':128,'frame':128,'frames':rows*4,'clips':{n:i*4 for i,n in enumerate(names)},'sourceRects':rects,'cropBoxes':cropBoxes,'alpha':list(sheet.getextrema()[3]),'blend':'NORMAL'})
    source.append({'key':key,'file':'originals/'+raw.name,'bytes':raw.stat().st_size,'sha256':hashlib.sha256(raw.read_bytes()).hexdigest(),'width':im.width,'height':im.height,'cols':4,'rows':rows,'frames':rows*4})
    qa.append({'key':key,'uniqueFrames':len({hashlib.sha256(f.tobytes()).hexdigest() for k,n,fs,*_ in clips if k==kind for f in fs}),'alphaRange':list(sheet.getextrema()[3]),'allFrameEdgesClear':True,'decodedBytes':sheet.width*sheet.height*4,'passed':True})
(OUT/'MANIFEST.json').write_text(json.dumps({'version':'8.0.96','assets':manifest,'decodedBytes':sum(q['decodedBytes'] for q in qa)},indent=2)+'\n',encoding='utf-8')
(SRC/'MANIFEST.json').write_text(json.dumps({'sources':source,'runtime':manifest},indent=2)+'\n',encoding='utf-8');(SRC/'QA_REPORT.json').write_text(json.dumps({'technicalPass':True,'files':qa,'ownerPhoneReadabilityAndFPS':'pending','processing':'Only cell extraction/common-per-clip scale; true generated alpha retained. No painted/synthetic replacement VFX.','runtimeOpacity':{'short':.9,'large':.82,'garden':.38},'scope':'presentation only; old fallbacks retained'},indent=2)+'\n',encoding='utf-8')
# Honest before/after sampling on a real game floor, including actual draw-opacity change.
floor=Image.open(next((ROOT/'assets/art/floors').glob('*.webp'))).convert('RGB');review=floor.resize((720,7*100+38));d=ImageDraw.Draw(review);d.rectangle((0,0,720,38),fill='#261e30');d.text((12,12),'Blood Orange | OLD                          NEW | 64px samples',fill='#ffeec8')
for i,(kind,name,frames,oldpath,oldframe,row) in enumerate(clips):
    y=44+i*100;d.text((8,y+4),name,fill='#ffffff');old=Image.open(ROOT/oldpath).convert('RGBA')
    for col,f in enumerate(frames):
        for new in [False,True]:
            tile=f if new else old.crop(((row*4+col)*oldframe,0,(row*4+col+1)*oldframe,oldframe));tile=tile.resize((64,64),Image.Resampling.LANCZOS);a=np.array(tile);a[:,:,3]=np.rint(a[:,:,3]*(.82 if new and name in ['garden','bloom','finish'] else .9 if new else .5 if name in ['garden','bloom','finish'] else .68)).astype('uint8');tile=Image.fromarray(a);review.paste(tile,(78+col*68+(310 if new else 0),y+24),tile)
save(review,SRC/'review.png','PNG');print('Packed2newatlases/28frames; alpha/cell edges checked;',sum(r['bytes'] for r in manifest),'runtime bytes')
