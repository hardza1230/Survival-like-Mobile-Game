from PIL import Image
from pathlib import Path
import json,hashlib
P=Path(__file__).resolve().parent; S=P/'sources'; R=Image.Resampling.LANCZOS

def load(n): return Image.open(S/(n+'.png')).convert('RGBA')
def box(im,threshold=32):return im.getchannel('A').point(lambda x:255 if x>threshold else 0).getbbox()
def fit(im,w,h,pad=0):
 im=im.copy();im.thumbnail((w-2*pad,h-2*pad),R);o=Image.new('RGBA',(w,h));o.alpha_composite(im,((w-im.width)//2,(h-im.height)//2));return o
def singles(name,w,h):
 im=load(name);b=box(im);im=im.crop((max(0,b[0]-4),max(0,b[1]-4),min(im.width,b[2]+4),min(im.height,b[3]+4)));return fit(im,w,h,2)
def sheet(name,count,cell,output,black=False):
 im=load(name);w,h=im.size;out=Image.new('RGBA',(cell*count,cell),(0,0,0,255) if black else (0,0,0,0))
 for j in range(count):
  x0=round(j*w/count);x1=round((j+1)*w/count);part=im.crop((x0,0,x1,h));
  if black:
   pw=part.width;cy=h//2;part=part.crop((0,cy-pw//2,pw,cy+(pw-pw//2))).convert('RGB').resize((cell,cell),R).convert('RGBA')
  else:
   if name=='cell':
    a=part.getchannel('A');a.paste(0,(0,0,8,h));a.paste(0,(part.width-8,0,part.width,h));part.putalpha(a)
   b=box(part);part=part.crop(b);part=fit(part,cell,cell,2)
  out.alpha_composite(part,(j*cell,0))
 out.save(P/output)
# Crop the panel to its visible bounds, then extend only its blank central region.
im=load('panel');b=box(im);im=im.crop((b[0]-3,b[1]-3,b[2]+3,b[3]+3));ht=844;wd=round(im.width*ht/im.height);im=im.resize((wd,ht),R);edge=64;left=im.crop((0,0,edge,ht));right=im.crop((wd-edge,0,wd,ht));mid=im.crop((edge,0,wd-edge,ht)).resize((668-2*edge,ht),R);out=Image.new('RGBA',(672,848));out.alpha_composite(left,(2,2));out.alpha_composite(mid,(2+edge,2));out.alpha_composite(right,(670-edge,2));out.save(P/'l30_panel.png')
singles('header',600,150).save(P/'l30_header.png');singles('ruby',256,256).save(P/'l30_ruby.png');singles('stamp',96,96).save(P/'l30_stamp.png');singles('reward30',192,192).save(P/'l30_reward30.png')
sheet('cell',4,96,'l30_cell.png');sheet('cell30',2,96,'l30_cell30.png');sheet('reward',6,96,'l30_reward.png');sheet('today_fx',6,160,'l30_today_fx.png',True);sheet('claim_burst',8,192,'l30_claim_burst.png',True)
im=load('button');out=Image.new('RGBA',(480,184));
for j in range(2):
 part=im.crop((0,j*im.height//2,im.width,(j+1)*im.height//2));part=part.crop(box(part));out.alpha_composite(fit(part,480,92,1),(0,j*92))
out.save(P/'l30_button.png')
print('Packed 11 required assets')
