"""Mechanical source-sheet packing and validation; artwork comes from ImageGen."""
from pathlib import Path
import io,json,os,hashlib
from PIL import Image,ImageDraw,ImageFont
import numpy as np
R=Path('assets/incoming/yuzu_forms63');rows=[];qa=[]
def save(im,p):
    stream=io.BytesIO();im.save(stream,format='PNG',optimize=True);b=stream.getvalue();tmp=p.with_suffix('.png.tmp')
    with tmp.open('wb') as f:f.write(b);f.flush();os.fsync(f.fileno())
    tmp.replace(p)
    with Image.open(p) as c:c.load();assert c.size==im.size
    return {'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
def split(im,cols,rs):return [im.crop((round(x*im.width/cols),round(y*im.height/rs),round((x+1)*im.width/cols),round((y+1)*im.height/rs))) for y in range(rs) for x in range(cols)]
def character_cells(im):
    # Generated poses can extend beyond nominal quarter lines. Find actual clear gutters per row
    # before placing each complete authored pose into the exact final4x2 grid.
    result=[];rects=[]
    for row in range(2):
        y0=round(row*im.height/2);y1=round((row+1)*im.height/2);a=np.array(im.getchannel('A'))[y0:y1];counts=(a>16).sum(axis=0);bounds=[0]
        seams=[np.zeros(a.shape[0],dtype=int)]
        for n in [1,2,3]:
            center=round(n*im.width/4);radius=round(im.width/4*.28);lo=max(bounds[-1]+1,center-radius);hi=min(im.width,center+radius)
            minimum=counts[lo:hi].min();candidates=np.flatnonzero(counts[lo:hi]==minimum)+lo
            cut=int(candidates[np.argmin(abs(candidates-center))]);bounds.append(cut)
            # Follow a transparent curved gutter around long shields/capes instead of cutting them.
            cost=(a[:,lo:hi].astype(float)/255)**4*100+abs(np.arange(lo,hi)-center)*.00001
            dp=cost[0].copy();history=[]
            for yy in range(1,len(cost)):
                choices=np.stack([np.pad(dp,(max(0,dx),max(0,-dx)),constant_values=1e12)[max(0,-dx):max(0,-dx)+len(dp)] for dx in range(-3,4)])
                pick=choices.argmin(axis=0);history.append(pick-3);dp=choices.min(axis=0)+cost[yy]
            cur=int(dp.argmin());path=[cur]
            for yy in range(len(history)-1,-1,-1):cur-=int(history[yy][cur]);cur=max(0,min(cur,len(dp)-1));path.append(cur)
            seam=np.array(path[::-1])+lo
            maximum=int(a[np.arange(a.shape[0]),seam].max());assert maximum<160,('Opaque source overlap, regenerate',row,n,maximum)
            seams.append(seam)
        bounds.append(im.width)
        seams.append(np.full(a.shape[0],im.width,dtype=int))
        for col in range(4):
            left,right=seams[col],seams[col+1];x0=int(left.min());x1=int(right.max());cell=im.crop((x0,y0,x1,y1));pixels=np.array(cell);xx=np.arange(x0,x1)[None,:];inside=(xx>=left[:,None])&(xx<right[:,None]);pixels[~inside]=0
            rects.append([x0,y0,x1,y1]);result.append(Image.fromarray(pixels))
    return result,rects
for kind in ['pomelo','lime','bloodorange']:
    for form in [2,3]:
        key=f'yz_{kind}_f{form}';raw=R/'originals'/(key+'.png');im=Image.open(raw).convert('RGBA');assert im.getextrema()[3][0]==0,key
        cells,sourceRects=character_cells(im);boxes=[c.getchannel('A').point(lambda a:255 if a>16 else 0).getbbox() for c in cells];assert all(boxes)
        # One scale across poses preserves authored proportions. Only align each pose's feet and center.
        scale=min(240/max(b[2]-b[0] for b in boxes),240/max(b[3]-b[1] for b in boxes));out=Image.new('RGBA',(1024,512));foot=[];borders=[];hashes=[]
        for i,(cell,box) in enumerate(zip(cells,boxes)):
            part=cell.crop(box).resize((round((box[2]-box[0])*scale),round((box[3]-box[1])*scale)),Image.Resampling.LANCZOS)
            frame=Image.new('RGBA',(256,256));frame.alpha_composite(part,((256-part.width)//2,248-part.height));out.alpha_composite(frame,((i%4)*256,(i//4)*256))
            a=np.array(frame.getchannel('A'));b=frame.getchannel('A').getbbox();foot.append(b[3]);borders.append(int(max(a[0].max(),a[-1].max(),a[:,0].max(),a[:,-1].max())));hashes.append(hashlib.sha256(frame.tobytes()).hexdigest())
        assert len(set(hashes))==8,key
        meta=save(out,R/(key+'.png'));rows.append({'key':key,'file':key+'.png',**meta,'width':1024,'height':512,'frameWidth':256,'frameHeight':256,'frameCount':8,'columns':4,'loop':False,'clips':{'walk':[0,3],'attack':[4,7]},'anchor':{'type':'foot','x':128,'y':248},'background':'transparent','form':form,'baseKey':'yz_'+kind,'source':'originals/'+raw.name,'sourceSha256':hashlib.sha256(raw.read_bytes()).hexdigest(),'packing':{'commonScale':scale,'sourceBoxes':boxes}})
        rows[-1]['packing']['sourceRects']=sourceRects
        qa.append({'key':key,'alphaRange':list(out.getextrema()[3]),'feetBottomExclusive':foot,'edgeAlpha':borders,'uniqueFrames':len(set(hashes)),'pass':all(x==248 for x in foot) and max(borders)==0})
        assert qa[-1]['pass'],qa[-1]
raw=R/'originals/yz_fx_evolve.png';im=Image.open(raw).convert('RGB');cells=split(im,4,2);out=Image.new('RGB',(1024,512),'black')
for i,c in enumerate(cells):
    a=np.array(c.resize((256,256),Image.Resampling.LANCZOS));a[np.max(a,axis=2)<=10]=0
    # Keep a small hard black safety perimeter for independently sampled animation frames.
    a[:3]=0;a[-3:]=0;a[:,:3]=0;a[:,-3:]=0;out.paste(Image.fromarray(a),((i%4)*256,(i//4)*256))
key='yz_fx_evolve';meta=save(out,R/(key+'.png'));rows.append({'key':key,'file':key+'.png',**meta,'width':1024,'height':512,'frameWidth':256,'frameHeight':256,'frameCount':8,'columns':4,'loop':False,'clips':{'once':[0,7]},'anchor':{'type':'center','x':128,'y':128},'background':'black','source':'originals/'+raw.name,'sourceSha256':hashlib.sha256(raw.read_bytes()).hexdigest()});qa.append({'key':key,'background':'#000000','blackPerimeterPx':3,'pass':True})
raw=R/'originals/yz_form_badge.png';im=Image.open(raw).convert('RGBA');assert im.getextrema()[3][0]==0;out=Image.new('RGBA',(192,64))
for i,c in enumerate(split(im,3,1)):
    b=c.getchannel('A').point(lambda a:255 if a>16 else 0).getbbox();assert b
    p=c.crop(b);p.thumbnail((56,56),Image.Resampling.LANCZOS);out.alpha_composite(p,(64*i+(64-p.width)//2,(64-p.height)//2))
key='yz_form_badge';meta=save(out,R/(key+'.png'));rows.append({'key':key,'file':key+'.png',**meta,'width':192,'height':64,'frameWidth':64,'frameHeight':64,'frameCount':3,'columns':3,'loop':False,'clips':{'forms':[0,2]},'anchor':{'type':'center','x':32,'y':32},'background':'transparent','source':'originals/'+raw.name,'sourceSha256':hashlib.sha256(raw.read_bytes()).hexdigest()});qa.append({'key':key,'alphaRange':list(out.getextrema()[3]),'pass':True})
(R/'MANIFEST.json').write_text(json.dumps({'batch':63,'scope':'source_art_only_runtime_integration_pending','assets':rows},indent=2)+'\n',encoding='utf-8')
(R/'QA_REPORT.json').write_text(json.dumps({'technicalPass':all(q['pass'] for q in qa),'assets':qa,'source':'Built-in ImageGen; mechanical crop/scale/alignment only','runtimeIntegration':'pending; pack characters andFX50% and check GPU budget before integration','mobileVisualAndFPS':'pending owner review','poseReview':'Contact sheets and GIFs provided; owner phone motion review remains pending.'},indent=2)+'\n',encoding='utf-8')
# Review on a real stage texture, at the documented mobile display sizes.
floors=list(Path('assets/art/floors').glob('*.webp'));bg=Image.open(floors[0]).convert('RGB') if floors else Image.new('RGB',(360,360),'#332a25');bg=bg.resize((360,700))
d=ImageDraw.Draw(bg);d.rectangle((0,0,360,44),fill='#261e30');d.text((12,10),'YUZU FORMS 63 | base -> form2 -> form3',fill='#ffebbd');d.text((12,26),'Actual mobile-size comparison',fill='#ffebbd')
for row,kind in enumerate(['pomelo','lime','bloodorange']):
    y=75+row*200;d.text((18,y),kind,fill='#ffffff')
    for form in [1,2,3]:
        p=Path('assets/incoming/yuzu_companions')/('yz_'+kind+'.png') if form==1 else R/f'yz_{kind}_f{form}.png';frame=Image.open(p).convert('RGBA').crop((0,0,256,256));size=([68,80,91] if kind=='pomelo' else [54,59,66])[form-1];frame.thumbnail((size,size),Image.Resampling.LANCZOS);x=20+(form-1)*112;bg.paste(frame,(x,y+42),frame);d.text((x,y+145),'form'+str(form)+' | '+str(size)+'px',fill='#fff0ca')
save(bg,R/'review.png')
for kind in ['pomelo','lime','bloodorange']:
    for form in [2,3]:
        key=f'yz_{kind}_f{form}';cells=split(Image.open(R/(key+'.png')).convert('RGBA'),4,2)
        board=Image.new('RGB',(1024,560),'#261e30');board.paste(Image.open(R/(key+'.png')), (0,24),Image.open(R/(key+'.png')));ImageDraw.Draw(board).text((8,5),key+' | walk0-3 / attack4-7',fill='#ffebbd');save(board,R/(key+'_contact.png'))
        for clip,indexes in [('walk',[0,1,2,3]),('attack',[0,4,5,6,7,0])]:
            frames=[]
            for i in indexes:
                b=Image.new('RGB',(256,256),'#332a25');b.paste(cells[i],(0,0),cells[i]);frames.append(b)
            frames[0].save(R/(key+'_'+clip+'.gif'),save_all=True,append_images=frames[1:],duration=110 if clip=='walk' else 120,loop=0)
fxcells=split(Image.open(R/'yz_fx_evolve.png'),4,2);fxcells[0].save(R/'yz_fx_evolve.gif',save_all=True,append_images=fxcells[1:],duration=75,loop=0)
print('Packed and checked8 source files /59frames; previews saved')
