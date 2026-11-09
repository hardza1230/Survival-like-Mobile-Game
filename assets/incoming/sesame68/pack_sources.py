from pathlib import Path
from PIL import Image
import numpy as np,json,hashlib,math
P=Path(__file__).resolve().parent;S=P/'sources';R=Image.Resampling.LANCZOS
spec=[('ses_rune_btn',128,128,9,False,'alpha'),('ses_orb_p',64,64,6,True,'alpha'),('ses_orb_m',64,64,6,True,'alpha'),('ses_orb_b',64,64,6,True,'alpha'),('ses_spell_icons',128,128,10,False,'alpha')]+[('ses_cast_'+x,192,192,6,False,'#000000') for x in ['ppp','mmm','bbb','ppm','ppb','pmm','mmb','pbb','mbb','pmb']]+[('ses_talent_icons',128,128,10,False,'alpha')]

def bounds(a,black=False):
 m=(a[:,:,:3].max(axis=2)>12) if black else (a[:,:,3]>40);y,x=np.where(m)
 if not len(x):return None
 return (int(x.min()),int(y.min()),int(x.max())+1,int(y.max())+1)
def splits(alpha,parts,axis,band):
 N=alpha.shape[axis];out=[0]
 for i in range(1,parts):
  c=round(i*N/parts);lo=max(out[-1]+1,c-band);hi=min(N,c+band);z=alpha[lo:hi,:].sum(axis=1) if axis==0 else alpha[:,lo:hi].sum(axis=0);out.append(lo+int(np.argmin(z)))
 return out+[N]
def fit(part,w,h,pad):
 part.thumbnail((w-2*pad,h-2*pad),R);out=Image.new('RGBA',(w,h),(0,0,0,0));out.alpha_composite(part,((w-part.width)//2,(h-part.height)//2));return out

def grid(key,cols,rows,cell):
 a=np.array(Image.open(S/(key+'.png')).convert('RGBA'));H,W=a.shape[:2];ys=splits(a[:,:,3],rows,0,70);out=Image.new('RGBA',(cols*rows*cell,cell));cuts=[]
 for y in range(rows):
  sub=a[ys[y]:ys[y+1]];xs=splits(sub[:,:,3],cols,1,65)
  for x in range(cols):
   tile=sub[:,xs[x]:xs[x+1]];b=bounds(tile);assert b is not None,(key,x,y);l,t,r,bot=b;pad=4;l=max(0,l-pad);t=max(0,t-pad);r=min(tile.shape[1],r+pad);bot=min(tile.shape[0],bot+pad);img=Image.fromarray(tile[t:bot,l:r]);out.alpha_composite(fit(img,cell,cell,3),((y*cols+x)*cell,0));cuts.append({'frame':y*cols+x,'sourceRect':[xs[x]+l,ys[y]+t,xs[x]+r,ys[y]+bot]})
 return out,cuts

def linear(key,n,cell,black=False):
 source=key+('_redo' if key in ('ses_orb_m','ses_orb_b') else '');im=Image.open(S/(source+'.png')).convert('RGBA');a=np.array(im);H,W=a.shape[:2];items=[];bs=[]
 for i in range(n):
  x0=round(i*W/n);x1=round((i+1)*W/n);tile=a[:,x0:x1];b=bounds(tile,black);assert b is not None,(key,i);l,t,r,bot=b;pad=5;l=max(0,l-pad);t=max(0,t-pad);r=min(tile.shape[1],r+pad);bot=min(H,bot+pad);items.append(Image.fromarray(tile[t:bot,l:r]));bs.append((l,t,r,bot))
 maxw=max(b[2]-b[0] for b in bs);miny=min(b[1] for b in bs);maxy=max(b[3] for b in bs);scale=min((cell*.85)/maxw,(cell*.85)/(maxy-miny));cy=(miny+maxy)/2;out=Image.new('RGBA',(n*cell,cell),(0,0,0,255) if black else (0,0,0,0));placed=[]
 for i,(part,b) in enumerate(zip(items,bs)):
  nw=max(1,round(part.width*scale));nh=max(1,round(part.height*scale));part=part.resize((nw,nh),R)
  if black:
   v=np.array(part);v[:,:,:3][v[:,:,:3]<4]=0;v[:,:,3]=255;part=Image.fromarray(v)
  x=max(2,min(cell-nw-2,round((cell-nw)/2)));y=max(2,min(cell-nh-2,round(cell/2+((b[1]+b[3])/2-cy)*scale-nh/2)));out.alpha_composite(part,(i*cell+x,y));placed.append({'frame':i,'sourceBounds':list(b),'placed':[x,y,nw,nh]})
 return out,placed

rows=[];detail=[]
for key,fw,fh,n,loop,bg in spec:
 if key=='ses_rune_btn':im,cut=grid(key,3,3,fw)
 elif key in ('ses_spell_icons','ses_talent_icons'):im,cut=grid(key,5,2,fw)
 else:im,cut=linear(key,n,fw,bg=='#000000')
 path=P/(key+'.png');im.save(path);b=path.read_bytes();v=np.array(im);assert im.size==(fw*n,fh) and im.mode=='RGBA';frames=[]
 for i in range(n):
  f=v[:,i*fw:(i+1)*fw];bound=bounds(f,bg=='#000000');assert bound is not None,(key,i);assert (f[0,0,3]==0 if bg=='alpha' else tuple(f[0,0])==(0,0,0,255)),(key,i);frames.append({'frame':i,'bounds':list(bound),'cornerRGBA':f[0,0].tolist()})
 row={'key':key,'file':path.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'width':im.width,'height':im.height,'frameWidth':fw,'frameHeight':fh,'frameCount':n,'columns':n,'loop':loop,'background':bg,'frames':frames}
 labels={'ses_rune_btn':['P normal','P pressed','P cooldown','M normal','M pressed','M cooldown','B normal','B pressed','B cooldown'],'ses_spell_icons':['ppp','mmm','bbb','ppm','ppb','pmm','mmb','pbb','mbb','pmb'],'ses_talent_icons':['rune_attunement','heavy_runes','giant_breaker','swift_runes','quick_weave','warded_body','binding_grip','overload','perpetual_motion','threefold_mastery']}
 if key in labels:row['frameNames']=labels[key]
 rows.append(row);detail.append({'key':key,'sourceFrames':cut})
(P/'MANIFEST.json').write_text(json.dumps({'assets':rows},ensure_ascii=False,indent=2)+'\n',encoding='utf8');gen=json.loads((P/'GENERATION.json').read_text(encoding='utf8'));(P/'PROMPTS.json').write_text(json.dumps({'generator':'built-in ImageGen','references':['assets/art/sesame_invoker811/fx_sesame_invoker811.webp','assets/art/sesame_vfx817/fx_sesame_vfx817_prism.webp','assets/art/lobby_hero/sesame/lh_sesame_idle.webp'],'generations':gen,'selectedOrbs':'ses_orb_m_redo and ses_orb_b_redo; initial drafts retained','processing':'pack_sources.py separates imagegen grid panels and packs aligned frames, transparent or black as specified.'},ensure_ascii=False,indent=2)+'\n',encoding='utf8');(P/'QA_REPORT.json').write_text(json.dumps({'technical':'RGBA dimensions, frame count, empty pixels and corners verified','failed':[],'assets':rows,'sourceFramePacking':detail,'humanReview':'Visual sheet reviewed; live game animation, contrast and phone performance remain untested.'},ensure_ascii=False,indent=2)+'\n',encoding='utf8');print('Packed',len(rows),'assets')
