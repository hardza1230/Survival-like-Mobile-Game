"""Order56: mechanical crop/align/pack of original built-in ImageGen donors."""
import hashlib, io, json, os
from collections import deque
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT=Path(__file__).resolve().parents[1]
IN=ROOT/'assets/incoming/yuzu_seedlings'
OUT=ROOT/'assets/art/yuzu_seedlings'
ACTORS=['yzs_seed_bite','yzs_seed_tank','yzs_seed_throw','yzs_seed_pop']
SPECS=[(k,128,8,4,True,'foot','transparent') for k in ACTORS]+[
 ('yzs_pop',128,6,3,False,'center','transparent'),
 ('yzs_regrow',128,6,3,False,'foot','transparent'),
 ('yzs_seed_shot',64,4,4,True,'center','transparent'),
 ('vfx_yzs_sour_burst',256,6,3,False,'center','black'),
 ('ic_yz_seedling',256,1,1,False,'center','transparent')]

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()

def atomic_image(im,path,fmt):
    b=io.BytesIO();im.save(b,fmt,**({'lossless':True,'method':6} if fmt=='WEBP' else {}));data=b.getvalue()
    tmp=path.with_suffix(path.suffix+'.tmp')
    with open(tmp,'wb') as f:f.write(data);f.flush();os.fsync(f.fileno())
    os.replace(tmp,path)
    with Image.open(path) as check:check.load();assert check.size==im.size
    assert path.stat().st_size==len(data)

def bounds(im,black=False):
    a=np.array(im)
    mask=np.max(a[:,:,:3],axis=2)>8 if black else a[:,:,3]>32
    y,x=np.where(mask)
    assert len(x),'empty frame'
    return (int(x.min()),int(y.min()),int(x.max())+1,int(y.max())+1)

def body_bounds(im):
    """Largest connected opaque subject; detached dust/seeds do not move its feet."""
    mask=np.array(im)[:,:,3]>48;seen=np.zeros(mask.shape,bool);largest=[]
    for yy,xx in np.argwhere(mask):
        if seen[yy,xx]:continue
        q=deque([(int(yy),int(xx))]);seen[yy,xx]=True;points=[]
        while q:
            y,x=q.popleft();points.append((y,x))
            for ny,nx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)):
                if 0<=ny<mask.shape[0] and 0<=nx<mask.shape[1] and mask[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;q.append((ny,nx))
        if len(points)>len(largest):largest=points
    a=np.array(largest);bottom=int(a[:,0].max())+1;top=int(a[:,0].min())
    # A lifted foot must not drag the whole body sideways. Center the actor silhouette horizontally.
    center=(float(a[:,1].min())+float(a[:,1].max())+1)/2
    return (int(a[:,1].min()),top,int(a[:,1].max())+1,bottom),center,a

def main():
    OUT.mkdir(parents=True,exist_ok=True);rows=[];runtime=[];review=Image.new('RGBA',(1024,640),'#302438');frames_by_key={};qa=[]
    for key,cell,count,cols,loop,anchor,bg in SPECS:
        source=IN/'sources'/(key+'_source.png')
        if key=='yzs_seed_pop':source=IN/'sources/yzs_seed_pop_refined.png'
        im=Image.open(source).convert('RGBA');rr=(count+cols-1)//cols
        cells=[];rects=[]
        for i in range(count):
            col,row=i%cols,i//cols;box=(round(col*im.width/cols),round(row*im.height/rr),round((col+1)*im.width/cols),round((row+1)*im.height/rr))
            cells.append(im.crop(box));rects.append(box)
        # The generated Throw has draw/release at donors5/6; the ordered attack must release at frame5.
        order=[0,1,2,3,5,6,4,7] if key=='yzs_seed_throw' else list(range(count))
        cells=[cells[i] for i in order];rects=[rects[i] for i in order]
        black=bg=='black';bb=[bounds(c,black) for c in cells]
        body=[body_bounds(c) for c in cells] if key in ACTORS else None
        if body:
            for c,(_,_,points) in zip(cells,body):
                mask=np.zeros((c.height,c.width),dtype=np.uint8);mask[points[:,0],points[:,1]]=255
                keep=np.array(Image.fromarray(mask).filter(ImageFilter.MaxFilter(7)))
                original=np.array(c.getchannel('A'));c.putalpha(Image.fromarray(np.minimum(original,keep)))
            # Remove detached neighboring-cell flecks. Optional slam dust is omitted; the actor stays intact.
            bb=[(max(0,b[0]-2),max(0,b[1]-2),min(c.width,b[2]+2),min(c.height,b[3]+2)) for c,(b,_,_) in zip(cells,body)]
        scale=min(100/max(b[0][3]-b[0][1] for b in body),110/max(b[2]-b[0] for b in bb)) if body else min((cell-16)/max(max(b[2]-b[0],b[3]-b[1]) for b in bb),100/max(b[3]-b[1] for b in bb)) if anchor=='foot' else (cell-20)/max(max(b[2]-b[0],b[3]-b[1]) for b in bb)
        if body:
            reach=max(max(footx-b[0],b[2]-footx) for b,(_,footx,_) in zip(bb,body))
            scale=min(scale,58/reach)
        packed=[];crop_records=[]
        for i,(c,b) in enumerate(zip(cells,bb)):
            # Preserve generated alpha and original color. Only black VFX gets a black background.
            cut=c.crop(b);size=(max(1,round(cut.width*scale)),max(1,round(cut.height*scale)));cut=cut.resize(size,Image.Resampling.LANCZOS)
            frame=Image.new('RGBA',(cell,cell),(0,0,0,255) if black else (0,0,0,0))
            if body:
                bodybox,footx,_=body[i];px=round(cell/2-(footx-b[0])*scale);py=round(120-(bodybox[3]-b[1])*scale)
            elif anchor=='foot':px=round((cell-cut.width)/2);py=120-cut.height
            else:px=round((cell-cut.width)/2);py=round((cell-cut.height)/2)
            assert px>=0 and py>=0 and px+cut.width<=cell and py+cut.height<=cell,(key,i,px,py,size)
            frame.alpha_composite(cut,(px,py));packed.append(frame)
            crop_records.append({'sourceCell':rects[i],'subjectBounds':b,'scale':scale,'paste':[px,py]})
        if key=='yzs_seed_throw':
            # The release seed crosses the donor's regular gutter. Recover that detached painted seed,
            # rather than importing the neighbor's body fragment or synthesizing a projectile.
            seed=im.crop((1163,748,1218,806))
            sb=bounds(seed);seed=seed.crop(sb);seed.thumbnail((12,9),Image.Resampling.LANCZOS)
            packed[5].alpha_composite(seed,(105,78))
            crop_records[5]['releaseSeedSourceCrop']=[1163,748,1218,806]
        sheet=Image.new('RGBA',(cell*count,cell),(0,0,0,255) if black else (0,0,0,0))
        for i,f in enumerate(packed):sheet.alpha_composite(f,(cell*i,0))
        # Black donor pixels must be exactly black outside the effect; runtime uses NORMAL with alpha.
        if black:
            arr=np.array(sheet);near=np.max(arr[:,:,:3],axis=2)<4;arr[near,:3]=0;arr[:,:,3]=255;sheet=Image.fromarray(arr)
        path=IN/(key+'.png');atomic_image(sheet,path,'PNG')
        row={'key':key,'file':path.name,'bytes':path.stat().st_size,'sha256':sha(path),'width':sheet.width,'height':sheet.height,'frameWidth':cell,'frameHeight':cell,'frameCount':count,'columns':count,'loop':loop,'anchor':{'type':anchor,'y':120} if anchor=='foot' else {'type':'center'},'background':bg,'source':source.relative_to(IN).as_posix(),'sourceSha256':sha(source),'crops':crop_records}
        if key in ACTORS:row['clips']={'walk':{'start':0,'frames':4,'loop':True},'attack':{'start':4,'frames':4,'loop':False}}
        rows.append(row)
        run=sheet.resize((sheet.width//2,sheet.height//2),Image.Resampling.LANCZOS)
        if black:
            a=np.array(run,dtype=np.float32);rgb=a[:,:,:3];alpha=np.max(rgb,axis=2);a[:,:,:3]=np.where(alpha[:,:,None]>0,np.minimum(255,rgb*255/np.maximum(1,alpha[:,:,None])),0);a[:,:,3]=alpha;run=Image.fromarray(np.uint8(np.rint(a)))
        path=OUT/(key+'.webp');atomic_image(run,path,'WEBP')
        runtime.append({**{k:v for k,v in row.items() if k not in ['crops','sourceSha256','source']},'file':path.name,'bytes':path.stat().st_size,'sha256':sha(path),'width':run.width,'height':run.height,'frameWidth':cell//2,'frameHeight':cell//2,'background':'transparent','source':row['file'],'sourceSha256':row['sha256']})
        if anchor=='foot':runtime[-1]['anchor']={'type':'foot','y':60}
        frames_by_key[key]=packed
        if key in ACTORS:
            r=ACTORS.index(key)
            for i,f in enumerate(packed):review.alpha_composite(f,(i*128,r*128))
        alpha=np.array(sheet)[:,:,3];edges=np.concatenate([alpha[0],alpha[-1],alpha[:,0],alpha[:,-1]])
        frame_edges=[np.concatenate([np.array(f)[:,:,3][0],np.array(f)[:,:,3][-1],np.array(f)[:,:,3][:,0],np.array(f)[:,:,3][:,-1]]) for f in packed]
        qa.append({'key':key,'decoded':True,'exactSize':True,'alphaMin':int(alpha.min()),'alphaMax':int(alpha.max()),'transparentEdges':bool(np.max(edges)==0) if not black else None,'allFrameEdgesClear':all(int(e.max())==0 for e in frame_edges) if not black else None,'blackCorner':list(sheet.getpixel((0,0))) if black else None,'generatedSourcePreserved':True})
    # Static source-proof/contact sheet only; never a game capture or combat simulation.
    for i,key in enumerate(ACTORS):
        tiny=frames_by_key[key][0].resize((30,30),Image.Resampling.LANCZOS)
        for j,color in enumerate(['#ede2bf','#1c1822']):
            tile=Image.new('RGBA',(100,80),color);tile.alpha_composite(tiny,(35,20));review.alpha_composite(tile,(i*220+j*100,530))
    atomic_image(review,IN/'review.png','PNG')
    gif=[]
    for i in range(8):
        canvas=Image.new('RGBA',(512,128),'#302438')
        for j,key in enumerate(ACTORS):canvas.alpha_composite(frames_by_key[key][i],(j*128,0))
        gif.append(canvas.convert('RGB'))
    gif[0].save(IN/'animation_preview.gif',save_all=True,append_images=gif[1:],duration=[140]*4+[100]*4,loop=0)
    (IN/'MANIFEST.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf8')
    (OUT/'MANIFEST.json').write_text(json.dumps(runtime,indent=2)+'\n',encoding='utf8')
    report={'order':56,'tool':'built-in image_gen','files':qa,'runtimeBytes':sum(r['bytes'] for r in runtime),'runtimeDecodedBytes':sum(r['width']*r['height']*4 for r in runtime),'notes':['All9exact PNG deliverables packed from unmodified retained generated sources','Actor foot line120; uniform per-character scale, no synthetic animation frames','Throw donor attack reordered to release at frame5','Source black VFX converted mechanically to straight alpha for NORMAL blending','Review/GIF are source-art previews, no game screenshots or simulated combat','Owner phone readability/FPS review remains pending']}
    (IN/'QA_REPORT.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf8')
    print(json.dumps({k:report[k] for k in ['runtimeBytes','runtimeDecodedBytes']}))

if __name__=='__main__':main()
