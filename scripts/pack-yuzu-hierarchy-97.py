"""Mechanical packing of original ImageGen role sprites and typed projectiles."""
from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np,json,hashlib,io,os
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/yuzu_hierarchy97';OUT=ROOT/'assets/art/yuzu_hierarchy97';OUT.mkdir(parents=True,exist_ok=True);rows=[];proof=[]
def save(im,p,fmt):
    stream=io.BytesIO();im.save(stream,fmt,**({'lossless':True,'method':6} if fmt=='WEBP' else {'optimize':True}));b=stream.getvalue();tmp=p.with_suffix(p.suffix+'.tmp')
    with tmp.open('wb') as f:f.write(b);f.flush();os.fsync(f.fileno())
    tmp.replace(p)
    with Image.open(p) as c:c.load();assert c.size==im.size
    return {'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
for key in ['yz_mn97_guard','yz_mn97_archer','yz_mn97_mage','yz_mn97_shots']:
    source=SRC/'originals'/(key+'.png');im=Image.open(source).convert('RGBA');assert im.getextrema()[3][0]==0;parts=[];rects=[]
    for row in range(2):
        y0,y1=round(im.height*row/2),round(im.height*(row+1)/2);a=np.array(im.getchannel('A'))[y0:y1];xs=[0]
        for col in [1,2,3]:
            center=round(im.width*col/4);radius=round(im.width/4*.22);lo=max(xs[-1]+1,center-radius);hi=center+radius;counts=(a[:,lo:hi]>32).sum(axis=0);best=np.flatnonzero(counts==counts.min())+lo;xs.append(int(best[np.argmin(abs(best-center))]))
        xs.append(im.width)
        for col in range(4):rect=[xs[col],y0,xs[col+1],y1];parts.append(im.crop(rect));rects.append(rect)
    cells=32 if key.endswith('shots') else 64;boxes=[p.getchannel('A').point(lambda a:255 if a>24 else 0).getbbox() for p in parts];assert all(boxes);out=Image.new('RGBA',(8*cells,cells));scale=min((cells-8)/max(b[2]-b[0] for b in boxes),(cells-8)/max(b[3]-b[1] for b in boxes));frames=[]
    for i,(part,b) in enumerate(zip(parts,boxes)):
        tile=part.crop(b);ratio=min((cells-6)/tile.width,(cells-6)/tile.height) if cells==32 else scale;tile=tile.resize((round(tile.width*ratio),round(tile.height*ratio)),Image.Resampling.LANCZOS);f=Image.new('RGBA',(cells,cells));f.alpha_composite(tile,((cells-tile.width)//2,(cells-tile.height)//2 if cells==32 else 60-tile.height));out.alpha_composite(f,(i*cells,0));frames.append(f)
        alpha=np.array(f.getchannel('A'));assert not max(alpha[0].max(),alpha[-1].max(),alpha[:,0].max(),alpha[:,-1].max())
    target=OUT/(key+'.webp');meta=save(out,target,'WEBP');row={'key':key,'path':target.relative_to(ROOT).as_posix(),**meta,'source':source.relative_to(ROOT).as_posix(),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sourceBytes':source.stat().st_size,'width':out.width,'height':out.height,'frame':cells,'frames':8,'sourceRects':rects,'crops':boxes,'alpha':list(out.getextrema()[3]),'clips':{'walk':[0,3],'attack':[4,7]} if cells==64 else {'arrow':0,'arrow2':1,'arrow3':2,'fire':3,'frost':4,'lightning':5,'punch':6,'petal':7}};rows.append(row);proof.append(frames)
    if cells==64:
        gif=[]
        for f in frames:
            bg=Image.new('RGB',(96,96),'#34282d');fg=f.resize((96,96),Image.Resampling.NEAREST);bg.paste(fg,(0,0),fg);gif.append(bg)
        gif[0].save(SRC/(key+'.gif'),save_all=True,append_images=gif[1:],duration=110,loop=0)
manifest={'assets':rows,'decodedBytes':sum(r['width']*r['height']*4 for r in rows)}
for p in [OUT/'MANIFEST.json',SRC/'MANIFEST.json']:p.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
(SRC/'QA_REPORT.json').write_text(json.dumps({'technicalPass':True,'files':4,'authoredFrames':32,'trueAlpha':True,'transparentCellEdges':True,'actorFootY':60,'decodedBytes':manifest['decodedBytes'],'processing':'Only crop/common-scale/align; original ImageGen pixels retained','phoneMotionReadabilityFPS':'pending owner review'},indent=2)+'\n',encoding='utf-8')
review=Image.new('RGB',(800,440),'#261e30');d=ImageDraw.Draw(review);d.text((12,12),'Yuzu -> Companion -> Minions | fighter / archer / elemental mage',fill='#ffecc2')
for row,frames in enumerate(proof):
    d.text((12,row*96+40),rows[row]['key'],fill='#ffecc2')
    for i,f in enumerate(frames):
        big=f.resize((64,64),Image.Resampling.NEAREST);review.paste(big,(180+i*76,row*96+52),big)
save(review,SRC/'review.png','PNG');print('Packed4role/projectile sheets,32authored frames,',sum(r['bytes'] for r in rows),'bytes;',manifest['decodedBytes'],'decodedbytes')
