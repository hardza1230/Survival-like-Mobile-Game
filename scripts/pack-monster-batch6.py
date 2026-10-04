import json,statistics
from pathlib import Path
from PIL import Image
import numpy as np
from scipy.ndimage import label
import argparse
parser=argparse.ArgumentParser(description='Pack generated batch 6 sheets and optional repaired action strips; requires Pillow, NumPy, SciPy')
parser.add_argument('source_map',help='JSON mapping species stems to generated PNG paths')
parser.add_argument('--repair-map',help='Optional JSON mapping stems to 4-column action strips')
args=parser.parse_args()
ROOT=Path(__file__).resolve().parents[1]
incoming=ROOT/'assets/incoming/monster_batch6'; incoming.mkdir(parents=True,exist_ok=True)
runtime=ROOT/'assets/art/monster_batch6'; runtime.mkdir(parents=True,exist_ok=True)
mapping=json.loads(Path(args.source_map).read_text())
report={}; previews={}
repairs=json.loads(Path(args.repair_map).read_text()) if args.repair_map else {}
def main_height(cell):
 mask=np.array(cell.getchannel('A'))>24;labels,count=label(mask);sizes=np.bincount(labels.ravel());sizes[0]=0
 ys,xs=np.where(labels==sizes.argmax());return int(ys.max()-ys.min()+1)
def clear_boundary_scraps(cell):
 mask=np.array(cell.getchannel('A'))>24;labels,count=label(mask);sizes=np.bincount(labels.ravel());sizes[0]=0
 alpha=np.array(cell.getchannel('A'));removed=0
 for k in range(1,count+1):
  if sizes[k]>=sizes.max()*.1:continue
  ys,xs=np.where(labels==k)
  if len(xs) and (xs.min()<=2 or xs.max()>=cell.width-3) and xs.max()-xs.min()<cell.width*.15:
   alpha[max(0,ys.min()-2):min(cell.height,ys.max()+3),max(0,xs.min()-2):min(cell.width,xs.max()+3)]=0;removed+=1
 cell.putalpha(Image.fromarray(alpha));return cell,removed
for name,path in mapping.items():
 im=Image.open(path).convert('RGBA'); cw,ch=im.width//4,im.height//4
 cells=[];removed_scraps=0
 for i in range(16):
  cell=im.crop((i%4*cw,i//4*ch,(i%4+1)*cw,(i//4+1)*ch))
  cell,removed=clear_boundary_scraps(cell);removed_scraps+=removed
  box=cell.getchannel('A').point(lambda a:255 if a>24 else 0).getbbox()
  assert box,(name,i)
  cells.append(cell.crop(box))
 repair_scale=None
 if name in repairs:
  strip=Image.open(repairs[name]).convert('RGBA');rw=strip.width//4
  pieces=[strip.crop((i*rw,0,(i+1)*rw,strip.height)) for i in range(4)]
  old11=im.crop((3*cw,2*ch,4*cw,3*ch))
  repair_scale=main_height(old11)/main_height(pieces[3])
  folder=incoming/'repairs';folder.mkdir(exist_ok=True);strip.save(folder/(name+'_actions.png'))
  for i,piece in enumerate(pieces):
   piece,removed=clear_boundary_scraps(piece);removed_scraps+=removed
   alpha=piece.getchannel('A');piece.putalpha(alpha.point(lambda a:0 if a<=24 else a))
   box=piece.getchannel('A').getbbox();piece=piece.crop(box)
   cells[8+i]=piece.resize((round(piece.width*repair_scale),round(piece.height*repair_scale)),Image.Resampling.LANCZOS)
 c3=name.startswith('c3_'); native=128 if c3 else 256
 old=Image.open(ROOT/('assets/art/ch3_enemies/c3_e_'+name[3:]+'_walk.png' if c3 else 'assets/e_'+name[3:]+'_sheet.png')).convert('RGBA')
 oldboxes=[old.crop((i*native,0,(i+1)*native,native)).getchannel('A').point(lambda a:255 if a>24 else 0).getbbox() for i in range(4)]
 targetw=statistics.median(b[2]-b[0] for b in oldboxes)*256/native
 targeth=statistics.median(b[3]-b[1] for b in oldboxes)*256/native
 baseline=round(statistics.median(b[3] for b in oldboxes)*256/native) if c3 else 236
 walkw=statistics.median(c.width for c in cells[:6]); walkh=statistics.median(c.height for c in cells[:6])
 scale=min(targetw/walkw,targeth/walkh,236/max(c.width for c in cells),(baseline-10)/max(c.height for c in cells))
 sheet=Image.new('RGBA',(1024,1024)); bounds=[]; frames=[]
 for i,c in enumerate(cells):
  c=c.resize((round(c.width*scale),round(c.height*scale)),Image.Resampling.LANCZOS)
  x=round((256-c.width)/2);y=baseline-c.height
  frame=Image.new('RGBA',(256,256));frame.alpha_composite(c,(x,y));frames.append(frame)
  sheet.alpha_composite(frame,(i%4*256,i//4*256));bounds.append([x,y,c.width,c.height])
 sheet.save(incoming/(name+'_sheet.png'))
 if c3:sheet=sheet.resize((512,512),Image.Resampling.LANCZOS)
 sheet.save(runtime/(name+'_sheet.webp'),lossless=True,method=6)
 report[name]={'nativeFrame':native,'baseline':baseline,'scale':scale,'repairNormalization':repair_scale,'boundaryScrapsRemoved':removed_scraps,'oldWalkBounds':oldboxes,'targetWalkSize':[targetw,targeth],'bounds':bounds}
 previews[name]=frames
(incoming/'PACKING.json').write_text(json.dumps(report,indent=2)+'\n')
for prefix in ['s5','c3']:
 names=[n for n in previews if n.startswith(prefix)];out=[]
 for i in range(16):
  frame=Image.new('RGB',(256*5,256),(35,39,48))
  for j,n in enumerate(names): frame.paste(previews[n][i],(256*j,0),previews[n][i])
  out.append(frame)
 out[0].save(incoming/(prefix+'_preview.webp'),save_all=True,append_images=out[1:],duration=[125]*6+[250]*2+[160]*4+[100]*2+[300]*2,loop=0,quality=85)
print('Packed',len(report),'sheets')
