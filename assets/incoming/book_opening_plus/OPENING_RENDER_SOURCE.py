from PIL import Image,ImageDraw,ImageFilter,ImageChops
from pathlib import Path
import numpy as np,json,shutil,hashlib
R=Path(__file__).resolve().parents[3];D=Path(__file__).resolve().parent;(D/'raw').mkdir(exist_ok=True)
src=Image.open(R/'assets/incoming/book_transition/bk_cover_closed.png').convert('RGBA')
plainpath=D/'raw/plain_cover.png'
# Generated clean leather donor is retained in raw/.
plain=Image.open(plainpath).convert('RGBA').resize(src.size,Image.Resampling.LANCZOS)
# The generated clean plate contributes only the removed-emblem region; preserve original outside it.
mask=Image.new('L',src.size,0);ImageDraw.Draw(mask).rounded_rectangle((100,360,1015,1440),radius=80,fill=255);mask=mask.filter(ImageFilter.GaussianBlur(24))
# Limit soft-mask tail so all original corners/outer stitch/spine pixels stay exact.
mask=mask.point(lambda a:0 if a<2 else a)
clean=Image.composite(plain,src,mask);clean.save(D/'bk_cover_clean_plate.png',optimize=True)
W,H=432,768;front=src.resize((W,H),Image.Resampling.LANCZOS);reverse=plain.resize((W,H),Image.Resampling.LANCZOS)
def warp(im,quad):
 target=np.array(quad,dtype=float);source=np.array([(0,0),(W,0),(W,H),(0,H)],dtype=float);A=[];b=[]
 for (x,y),(u,v) in zip(target,source):
  A.append([x,y,1,0,0,0,-u*x,-u*y]);b.append(u)
  A.append([0,0,0,x,y,1,-v*x,-v*y]);b.append(v)
 c=np.linalg.solve(np.array(A),np.array(b))
 return im.transform((W,H),Image.Transform.PERSPECTIVE,c,Image.Resampling.BICUBIC)
widths=[432,428,414,383,338,280,216,151,94,47,15,0];lifts=[0,1,3,7,12,18,20,18,14,9,3,0]
sheet=Image.new('RGBA',(W*4,H*3));data=[]
for i,(width,lift) in enumerate(zip(widths,lifts)):
 if i==0:frame=front.copy()
 elif width:
  quad=[(0,0),(width,lift),(width,H-lift),(0,H)]
  frame=warp(front,quad)
  # The inner leather thickness becomes visible as the rigid cover tilts, no extra back cover/page beneath.
  if 2<=i<=6:
   rev=warp(reverse,quad);edge=Image.new('L',(W,H));ImageDraw.Draw(edge).polygon([(width-max(2,width*.045),lift),(width,lift),(width,H-lift),(width-max(2,width*.045),H-lift)],fill=210)
   frame=Image.composite(rev,frame,edge)
  shade=1-.12*(i/10)
  r,g,b,a=frame.split();frame=Image.merge('RGBA',(r.point(lambda v:int(v*shade)),g.point(lambda v:int(v*shade)),b.point(lambda v:int(v*shade)),a))
 else:
  frame=Image.new('RGBA',(W,H));d=ImageDraw.Draw(frame)
  for x in range(4):d.line((x,0,x,H),fill=(65,34,17,18-x*5))
 sheet.paste(frame,(i%4*W,i//4*H));data.append(dict(frame=i,width=width,farEdgeInset=lift,hinge=[0,0,0,H],alphaBBox=frame.getchannel('A').getbbox()))
sheet.save(D/'bk_open_long.png',optimize=True)
(D/'OPENING_GEOMETRY.json').write_text(json.dumps(dict(method='Rigid perspective projections from the existing closed-cover pixels; generated inside-leather material for thin edge only. Discarded AI full-sheet candidate because ornament identity and hinge alignment drifted.',original='assets/incoming/book_transition/bk_cover_closed.png',originalSHA256=hashlib.sha256((R/'assets/incoming/book_transition/bk_cover_closed.png').read_bytes()).hexdigest(),frame0ExactResizedSource=front.tobytes()==sheet.crop((0,0,W,H)).tobytes(),frames=data,cleanPlate='bk_cover_clean_plate.png',cleanPlatePurpose='Optional helper behind animated emblem; static gold is baked into the original cover.',pendingPhoneReview=True),indent=2),encoding='utf-8')
print('12-frame source-pixel opening and clean plate saved')
