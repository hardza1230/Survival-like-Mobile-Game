"""Mechanical packing/QA for generated menu art orders50-54; no runtime edits."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageOps,ImageFont
import numpy as np
import json,hashlib,os,sys,math
ROOT=Path(__file__).resolve().parent.parent
P=ROOT/'assets/incoming'/sys.argv[1]
CFG=json.loads((P/'PROMPTS.json').read_text(encoding='utf-8-sig'));J=CFG['jobs']
R=Image.Resampling.LANCZOS
(P/'preview_webp').mkdir(exist_ok=True)
FONT=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',13)

def save(im,path,fmt='PNG',**kw):
    tmp=path.with_suffix('.tmp'+path.suffix)
    with tmp.open('wb') as f:im.save(f,format=fmt,**kw);f.flush();os.fsync(f.fileno())
    tmp.replace(path)
    with Image.open(path) as v:v.verify()

def box(im,black=False,threshold=16):
    a=np.asarray(im.convert('RGBA'));mask=a[:,:,:3].max(2)>threshold if black else a[:,:,3]>threshold
    y,x=np.where(mask)
    return (int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1)) if len(x) else None

def boundaries(im,n,axis,black):
    a=np.asarray(im.convert('RGBA'));mask=a[:,:,:3].max(2)>12 if black else a[:,:,3]>16
    on=mask.any(axis=0 if axis=='x' else 1);z=[];start=None
    for i,v in enumerate(list(~on)+[False]):
        if v and start is None:start=i
        if not v and start is not None:
            if i-start>=3:z.append((start+i)//2)
            start=None
    out=[0];size=len(on)
    for i in range(1,n):
        ideal=size*i/n;c=[v for v in z if abs(v-ideal)<size/n*.2]
        out.append(min(c,key=lambda v:abs(v-ideal)) if c else round(ideal))
    return out+[size]

def lum(im):
    a=np.asarray(im.convert('RGB'),dtype=np.float32);alpha=np.minimum(255,np.floor(a.max(2)*1.35));alpha[alpha<8]=0
    rgb=np.minimum(255,np.floor(a*255/np.maximum(1,alpha[:,:,None])))
    out=np.dstack([rgb,alpha]).astype(np.uint8);out[alpha==0]=0
    return Image.fromarray(out,'RGBA')

def slice9(im,w,h,ns):
    l,t,r,b=ns;sw,sh=im.size;k=min(h/sh,w/max(1,l+r));xs=[0,l,sw-r,sw];ys=[0,t,sh-b,sh]
    xd=[0,round(l*k),w-round(r*k),w];yd=[0,round(t*k),h-round(b*k),h];out=Image.new('RGBA',(w,h))
    for y in range(3):
        for x in range(3):
            ww,hh=xd[x+1]-xd[x],yd[y+1]-yd[y]
            if ww>0 and hh>0:out.alpha_composite(im.crop((xs[x],ys[y],xs[x+1],ys[y+1])).resize((ww,hh),R),(xd[x],yd[y]))
    return out

manifest=[];qa=[];logs=[];frames_by_key={}
for j in J:
    key=j['key'];fw,fh,n=j['fw'],j['fh'],j['n'];black=j.get('black',False);opaque=j.get('opaque',False)
    raw=Image.open(P/'originals'/(key+'.png')).convert('RGBA');dc,dr=j['donor_cols'],j['donor_rows']
    gx=boundaries(raw,dc,'x',black) if not opaque else [0,raw.width]
    gy=boundaries(raw,dr,'y',black) if not opaque else [0,raw.height]
    cells=[]
    for i in range(n):
        c=raw.crop((gx[i%dc],gy[i//dc],gx[i%dc+1],gy[i//dc+1]))
        if black or opaque:
            flat=Image.new('RGBA',c.size,'black' if black else '#f5e5ca');flat.alpha_composite(c);c=flat
        cells.append(c)
    cw=max(c.width for c in cells);ch=max(c.height for c in cells)
    cells=[c.resize((cw,ch),R) for c in cells]
    boxes=[box(c,black) for c in cells];assert all(boxes),key+' empty donor frame'
    union=(min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes))
    pieces=[c.crop(union) for c in cells];scale=min((fw-8)/pieces[0].width,(fh-8)/pieces[0].height)
    out_frames=[]
    for piece in pieces:
        frame=Image.new('RGBA',(fw,fh),(0,0,0,255) if black or opaque else (0,0,0,0))
        if j.get('ns') or j.get('panel'):
            piece=piece.resize((fw-4,fh-4),R);x=y=2
        elif opaque:piece=piece.resize((fw,fh),R);x=y=0
        else:
            piece=piece.resize((max(1,round(piece.width*scale)),max(1,round(piece.height*scale))),R);x=(fw-piece.width)//2;y=(fh-piece.height)//2
        frame.alpha_composite(piece,(x,y));out_frames.append(frame)
    sheet=Image.new('RGBA',(j['cols']*fw,j['rows']*fh),(0,0,0,255) if black or opaque else (0,0,0,0))
    for i,f in enumerate(out_frames):sheet.paste(f,(i%j['cols']*fw,i//j['cols']*fh))
    dest=P/(key+'.png');save(sheet,dest)
    converted=[lum(f) if black else f for f in out_frames];frames_by_key[key]=converted
    preview=Image.new('RGBA',(sheet.width//2,sheet.height//2))
    for i,f in enumerate(converted):preview.paste(f.resize((fw//2,fh//2),R),(i%j['cols']*(fw//2),i//j['cols']*(fh//2)))
    wp=P/'preview_webp'/(key+'.webp');save(preview,wp,'WEBP',quality=88,alpha_quality=90,method=6)
    m={'key':key,'file':dest.name,'width':sheet.width,'height':sheet.height,'frameWidth':fw,'frameHeight':fh,'frameCount':n,'columns':j['cols'],'rows':j['rows'],'background':'#000000' if black else 'opaque' if opaque else 'transparent','loop':j.get('loop',False),'blend':j.get('blend','NORMAL'),'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'display_px':j.get('display'),'preview_file':wp.relative_to(P).as_posix(),'preview_bytes':wp.stat().st_size,'preview_sha256':hashlib.sha256(wp.read_bytes()).hexdigest(),'preview_scale':.5}
    if j.get('ns'):m['nineSlice']=j['ns']
    manifest.append(m)
    centers=[]
    for i,f in enumerate(converted):
        a=np.asarray(f)[:,:,3];center=float(a[int(fh*.37):int(fh*.63),int(fw*.37):int(fw*.63)].mean()/255);centers.append(round(center,5))
        if j.get('hollow') or i in j.get('hollowFrames',[]):assert center<.035,key+' center must be transparent frame'+str(i)
    if not black and not opaque:assert sheet.getchannel('A').getextrema()==(0,255),key+' missing alpha'
    qa.append({'key':key,'RGBA':sheet.mode=='RGBA','dimensions_ok':sheet.size==(fw*j['cols'],fh*j['rows']),'alpha_extrema':sheet.getchannel('A').getextrema(),'center_alpha_mean':centers,'frame_bounds':[box(f,False,40) for f in converted],'unique_frames':len({hashlib.sha256(f.tobytes()).hexdigest() for f in converted})})
    logs.append({'key':key,'donor_size':raw.size,'donor_grid_x':gx,'donor_grid_y':gy,'donor_cell_normalized':[cw,ch],'union_crop':union,'common_scale':scale,'operation':'Common crop/scale preserves effect motion and state alignment; panels stretch mechanically to exact source dimensions.'})

def write_json(name,obj):(P/name).write_text(json.dumps(obj,indent=2),encoding='utf-8',newline='\n')
write_json('MANIFEST.json',manifest);write_json('CROP_LOG.json',logs)
write_json('QA_REPORT.json',{'order':CFG['order'],'all_pass':True,'scope':'Source art only; no runtime/phone gameplay claim.','assets':qa,'preview_bytes':sum(m['preview_bytes'] for m in manifest),'decoded_preview_bytes':sum(m['width']*m['height'] for m in manifest),'visual_review':'Pending contact/readability/stretch review.','count_note':CFG.get('count_note')})
board=Image.new('RGB',(1080,math.ceil(len(J)/3)*220),'#6d6573');d=ImageDraw.Draw(board)
for k,j in enumerate(J):
    x=k%3*360;y=k//3*220;f=frames_by_key[j['key']][j['n']//2 if j.get('black') else 0].copy();f.thumbnail((332,175),R)
    d.text((x+8,y+6),j['key'],font=FONT,fill='white');board.paste(f,(x+(360-f.width)//2,y+32+(175-f.height)//2),f)
save(board,P/'contact_sheet.png')
states=Image.new('RGB',(1100,len(J)*150),'#6d6573');d=ImageDraw.Draw(states)
for row,j in enumerate(J):
    d.text((8,row*150+5),j['key'],font=FONT,fill='white')
    for i,f in enumerate(frames_by_key[j['key']]):
        f=f.copy();f.thumbnail((84,115),R);states.paste(f,(220+i*86+(84-f.width)//2,row*150+28+(115-f.height)//2),f)
save(states,P/'states_review.png')
ns_jobs=[j for j in J if j.get('ns')]
if ns_jobs:
    review=Image.new('RGB',(1080,len(ns_jobs)*210),'#6d6573');d=ImageDraw.Draw(review)
    for row,j in enumerate(ns_jobs):
        d.text((8,row*210+5),j['key']+' / native half + stretched',font=FONT,fill='white')
        for i,f in enumerate(frames_by_key[j['key']]):
            w,h=j['display'];f=slice9(f,round(w*1.2),min(170,h),j['ns']);review.paste(f,(12+i*260,row*210+30),f)
    save(review,P/'stretch_review.png')
anim=[j for j in J if j.get('black') or j.get('loop')]
if anim:
    images=[];steps=max(j['n'] for j in anim)
    for t in range(steps):
        b=Image.new('RGB',(720,math.ceil(len(anim)/3)*230),'#312837');d=ImageDraw.Draw(b)
        for k,j in enumerate(anim):
            x=k%3*240;y=k//3*230;d.text((x+6,y+5),j['key'],font=FONT,fill='white')
            i=t%j['n'] if j.get('loop') else min(t,j['n']-1);f=frames_by_key[j['key']][i].copy();f.thumbnail((210,190),R);b.paste(f,(x+(240-f.width)//2,y+30+(190-f.height)//2),f)
        images.append(b)
    images[0].save(P/'animation_review.gif',save_all=True,append_images=images[1:],duration=140,loop=0,optimize=False)
print('Order',CFG['order'],':',len(manifest),'files /',sum(j['n'] for j in J),'frames; preview',sum(m['preview_bytes'] for m in manifest),'bytes')
