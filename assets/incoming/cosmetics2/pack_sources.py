from pathlib import Path
from PIL import Image
import numpy as np,json,math,hashlib
ROOT=Path(__file__).resolve().parent.parent; A=ROOT/'cosmetics';B=ROOT/'cosmetics2';RES=Image.Resampling.LANCZOS
spec66=[('cos_wing_cream',160,128,6,True),('cos_wing_sugar',160,128,6,True),('cos_wing_ruby',160,128,6,True),('cos_pet_mochi',96,96,6,True),('cos_pet_turtle',96,96,6,True),('cos_pet_bird',96,96,6,True),('cos_trail',48,48,3,False)]
spec67=[('cos_halo_donut',96,64,6,True),('cos_halo_crown',96,64,6,True),('cos_halo_cloud',96,64,6,True),('cos_aura_candy',160,80,8,True),('cos_aura_flower',160,80,8,True),('cos_aura_star',160,80,8,True),('cos_dash_bubble',128,128,6,False),('cos_dash_confetti',128,128,6,False),('cos_dash_cream',128,128,6,False),('cos_pop_heart',96,96,5,False),('cos_pop_sprinkle',96,96,5,False),('cos_pop_star',96,96,5,False),('cos_wing_rainbow',160,128,6,True),('cos_wing_butterfly',160,128,6,True),('cos_pet_bunny',96,96,6,True),('cos_pet_jelly',96,96,6,True),('cos_trail2',48,48,3,False)]

def pack(folder,item):
 key,fw,fh,n,loop=item;black=key.startswith(('cos_dash_','cos_pop_'));src=Image.open(folder/'sources'/(key+'.png')).convert('RGBA');W,H=src.size;pieces=[];bounds=[]
 # This particular source places the five poses in a narrower row rather than five full-width cells.
 if key=='cos_pop_heart':
  centers=[451,773,1086,1400,1725];cuts=[(int(c-145),int(c+145)) for c in centers]
 else:cuts=[(round(i*W/n),round((i+1)*W/n)) for i in range(n)]
 for x0,x1 in cuts:
  a=np.array(src.crop((x0,0,x1,H)));mask=(a[:,:,:3].max(axis=2)>12) if black else a[:,:,3]>32;yy,xx=np.where(mask)
  if not len(xx):pieces.append(None);bounds.append(None);continue
  xlo=max(0,int(xx.min())-5);xhi=min(x1-x0,int(xx.max())+6);ylo=max(0,int(yy.min())-5);yhi=min(H,int(yy.max())+6)
  pieces.append(Image.fromarray(a[ylo:yhi,xlo:xhi]));bounds.append((xlo,ylo,xhi,yhi))
 # Preserve relative vertical motion and relative frame size with a common scale.
 non=[x for x in bounds if x];assert len(non)>=n-1,(key,bounds)
 maxw=max(x[2]-x[0] for x in non);miny=min(x[1] for x in non);maxy=max(x[3] for x in non);maxh=maxy-miny;fraction=.79 if black else .90
 scale=min((fw*fraction)/maxw,(fh*fraction)/maxh);cy=(miny+maxy)/2
 out=Image.new('RGBA',(fw*n,fh),(0,0,0,255) if black else (0,0,0,0)); infos=[]
 for i,(part,b) in enumerate(zip(pieces,bounds)):
  if part is None:infos.append({'index':i,'empty':True});continue
  nw=max(1,round(part.width*scale));nh=max(1,round(part.height*scale));part=part.resize((nw,nh),RES)
  if black:
   arr=np.array(part);arr[:,:,:3][arr[:,:,:3]<4]=0;arr[:,:,3]=255;part=Image.fromarray(arr)
  elif key.startswith('cos_aura_') or key=='cos_wing_sugar' or key=='cos_wing_rainbow':
   factor=.60 if key.startswith('cos_aura_') else .70;part.putalpha(part.getchannel('A').point(lambda x:round(x*factor)))
  x=round((fw-nw)/2);y=round(fh/2+(((b[1]+b[3])/2)-cy)*scale-nh/2);x=max(1,min(fw-nw-1,x));y=max(1,min(fh-nh-1,y));out.alpha_composite(part,(i*fw+x,y));infos.append({'index':i,'sourceBounds':list(b),'placed':[x,y,nw,nh]})
 out.save(folder/(key+'.png'));return {'key':key,'frames':infos,'background':'#000000' if black else 'alpha'}

qa66=[pack(A,x) for x in spec66];qa67=[pack(B,x) for x in spec67]
# The store icons are cropped from the corresponding painted animation, never from unrelated assets.
def icon(folder,key,frame,fw,fh,black=False):
 im=Image.open(folder/(key+'.png')).convert('RGBA').crop((frame*fw,0,(frame+1)*fw,fh));a=np.array(im)
 if black:
  lum=a[:,:,:3].max(axis=2);a[:,:,3]=lum;rgb=a[:,:,:3].astype(np.float32);den=np.maximum(lum[:,:,None],1);a[:,:,:3]=np.minimum(255,rgb*255/den).astype('uint8');im=Image.fromarray(a)
 a=np.array(im);yy,xx=np.where(a[:,:,3]>20)
 if not len(xx):raise ValueError(key)
 im=im.crop((max(0,int(xx.min())-2),max(0,int(yy.min())-2),min(fw,int(xx.max())+3),min(fh,int(yy.max())+3)));im.thumbnail((110,110),RES);o=Image.new('RGBA',(128,128));o.alpha_composite(im,((128-im.width)//2,(128-im.height)//2));return o
icons66=[('cos_wing_cream',2,160,128,False),('cos_wing_sugar',2,160,128,False),('cos_wing_ruby',2,160,128,False),('cos_pet_mochi',0,96,96,False),('cos_pet_turtle',0,96,96,False),('cos_pet_bird',0,96,96,False),('cos_trail',0,48,48,False),('cos_trail',1,48,48,False),('cos_trail',2,48,48,False)]
icons67=[('cos_halo_donut',0,96,64,False),('cos_halo_crown',1,96,64,False),('cos_halo_cloud',0,96,64,False),('cos_aura_candy',0,160,80,False),('cos_aura_flower',3,160,80,False),('cos_aura_star',0,160,80,False),('cos_dash_bubble',1,128,128,True),('cos_dash_confetti',2,128,128,True),('cos_dash_cream',1,128,128,True),('cos_pop_heart',2,96,96,True),('cos_pop_sprinkle',2,96,96,True),('cos_pop_star',1,96,96,True),('cos_wing_rainbow',2,160,128,False),('cos_wing_butterfly',0,160,128,False),('cos_pet_bunny',0,96,96,False),('cos_pet_jelly',0,96,96,False),('cos_trail2',0,48,48,False),('cos_trail2',1,48,48,False),('cos_trail2',2,48,48,False)]
for folder,name,items in [(A,'cos_icons',icons66),(B,'cos_icons2',icons67)]:
 o=Image.new('RGBA',(len(items)*128,128));
 for i,(key,frame,fw,fh,black) in enumerate(items):o.alpha_composite(icon(folder,key,frame,fw,fh,black),(i*128,0))
 o.save(folder/(name+'.png'))
for folder,spec,info,icons,name in [(A,spec66,qa66,icons66,'cos_icons'),(B,spec67,qa67,icons67,'cos_icons2')]:
 rows=[];spec=spec+[(name,128,128,len(icons),False)];gen=json.loads((folder/'GENERATION.json').read_text(encoding='utf8'))
 for key,fw,fh,n,loop in spec:
  p=folder/(key+'.png');b=p.read_bytes();im=Image.open(p);assert im.mode=='RGBA' and im.size==(fw*n,fh),(key,im.size,im.mode);arr=np.array(im);bg='#000000' if key.startswith(('cos_dash_','cos_pop_')) else 'alpha';fr=[]
  for i in range(n):
   f=arr[:,i*fw:(i+1)*fw];vis=(f[:,:,:3].max(axis=2)>12) if bg=='#000000' else f[:,:,3]>10;yy,xx=np.where(vis);empty=len(xx)==0
   assert not empty or (key=='cos_pop_star' and i==4),(key,i)
   if bg=='#000000':assert np.all(f[:,:,3]==255) and f[0,0,:3].tolist()==[0,0,0],(key,i)
   else:assert f[0,0,3]==0,(key,i)
   fr.append({'frame':i,'empty':empty,'bounds':None if empty else [int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1)]})
  row={'key':key,'file':p.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'width':im.width,'height':im.height,'frameWidth':fw,'frameHeight':fh,'frameCount':n,'columns':n,'loop':loop,'background':bg,'frames':fr}
  if key in ('cos_icons','cos_icons2'):
   tails=['trail_heart','trail_star','trail_sugar'] if key=='cos_icons' else ['trail_note','trail_bubble','trail_flower']
   row['icons']=[{'index':i,'key':(tails[z[1]] if z[0] in ('cos_trail','cos_trail2') else z[0].removeprefix('cos_'))} for i,z in enumerate(icons)]
  rows.append(row)
 (folder/'MANIFEST.json').write_text(json.dumps({'assets':rows},ensure_ascii=False,indent=2)+'\n',encoding='utf8');(folder/'PROMPTS.json').write_text(json.dumps({'generator':'built-in ImageGen','references':['assets/incoming/login_daily/states_review.png'],'generations':gen,'iconAtlas':'Assembled from representative frames of the corresponding generated art; black effects converted to alpha for store icon display.','packing':'cosmetics2/pack_sources.py crops individual frames, preserves relative motion, scales and assembles sheets; aura and translucent wing alpha adjusted.'},ensure_ascii=False,indent=2)+'\n',encoding='utf8');(folder/'QA_REPORT.json').write_text(json.dumps({'assets':rows,'technical':'PNG RGBA dimensions, per-frame visible bounds, alpha or black corners checked. Last star-pop frame is intentionally black as a fade-out.','remaining':'Animation smoothness, tint appearance, gameplay visibility and mobile performance need in-game human review.'},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 print(folder.name,'packed',len(rows),'assets')
