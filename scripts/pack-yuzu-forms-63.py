"""Verify order63 sources, pack128px lossless frames; no authored pixels repainted."""
import hashlib,io,json,os
from pathlib import Path
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/yuzu_forms63';OUT=ROOT/'assets/art/yuzu_forms63'
OUT.mkdir(parents=True,exist_ok=True);rows=[]
for row in json.loads((SRC/'MANIFEST.json').read_text(encoding='utf-8'))['assets']:
    source=SRC/row['file'];data=source.read_bytes();assert len(data)==row['bytes'] and hashlib.sha256(data).hexdigest()==row['sha256'],row['key']
    im=Image.open(source).convert('RGBA');assert im.size==(row['width'],row['height'])
    fw=row['frameWidth'];cols=row['columns'];frames=row['frameCount'];out=Image.new('RGBA',(im.width//2,im.height//2))
    for i in range(frames):
        x,y=i%cols*fw,i//cols*fw;cell=im.crop((x,y,x+fw,y+fw))
        if row['background']=='black':
            a=np.array(cell,dtype=np.float32);rgb=a[:,:,:3];alpha=np.max(rgb,axis=2);alpha[alpha<8]=0
            a[:,:,:3]=np.where(alpha[:,:,None]>0,np.minimum(255,rgb*255/np.maximum(1,alpha[:,:,None])),0);a[:,:,3]=alpha;cell=Image.fromarray(np.uint8(np.rint(a)))
        cell=cell.resize((fw//2,fw//2),Image.Resampling.LANCZOS);out.alpha_composite(cell,(i%cols*(fw//2),i//cols*(fw//2)))
    stream=io.BytesIO();out.save(stream,'WEBP',lossless=True,method=6);data=stream.getvalue();target=OUT/(row['key']+'.webp');tmp=target.with_suffix('.webp.tmp')
    with tmp.open('wb') as f:f.write(data);f.flush();os.fsync(f.fileno())
    tmp.replace(target)
    with Image.open(target) as check:check.load();assert check.size==out.size and check.getextrema()[3][0]==0
    rows.append({'key':row['key'],'file':target.name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'width':out.width,'height':out.height,'frame':fw//2,'frames':frames,'cols':cols,'source':str(source.relative_to(ROOT)).replace('\\','/'),'sourceSha256':row['sha256'],'blend':'NORMAL','footY':124 if row.get('form') else None})
(OUT/'MANIFEST.json').write_text(json.dumps({'order':63,'scale':.5,'assets':rows,'decodedBytes':sum(r['width']*r['height']*4 for r in rows)},indent=2)+'\n',encoding='utf-8')
print('Packed',len(rows),'sheets;',sum(r['bytes'] for r in rows),'bytes;',sum(r['width']*r['height']*4 for r in rows),'decoded bytes (battle-only Yuzu art)')
