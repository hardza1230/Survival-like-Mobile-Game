"""Source-art contract and offline layout proofs for order 33. No game runtime changes."""
from PIL import Image,ImageDraw,ImageFont,ImageOps
from pathlib import Path
import json,hashlib,struct,zlib,numpy as np

ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'assets/incoming/lobby_ui';Q=P/'qa';Q.mkdir(exist_ok=True)
M=json.loads((P/'MANIFEST.json').read_text());by={m['key']:m for m in M}
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def font(n,bold=False):return ImageFont.truetype(BOLD if bold else FONT,n)
def load(k,n=0):
 m=by[k];im=Image.open(P/m['file']).convert('RGBA');w,h=m['frameWidth'],m['frameHeight'];x=n%m['columns'];y=n//m['columns'];return im.crop((x*w,y*h,(x+1)*w,(y+1)*h))
def panel(k,size,n=0):
 im=load(k,n);m=by[k]
 if 'nineSlice' not in m:return im.resize(size,Image.Resampling.LANCZOS)
 l,t,r,b=m['nineSlice'];w,h=im.size;ow,oh=size
 # Source edges are 2x display pixels; preserve their intended display size.
 dl,dt,dr,db=[v//2 for v in (l,t,r,b)]
 if not t and not b:
  xs=[0,l,w-r,w];dx=[0,dl,ow-dr,ow];out=Image.new('RGBA',size)
  for i in range(3):out.alpha_composite(im.crop((xs[i],0,xs[i+1],h)).resize((dx[i+1]-dx[i],oh),Image.Resampling.LANCZOS),(dx[i],0))
  return out
 xs=[0,l,w-r,w];ys=[0,t,h-b,h];dx=[0,dl,ow-dr,ow];dy=[0,dt,oh-db,oh];out=Image.new('RGBA',size)
 for y in range(3):
  for x in range(3):out.alpha_composite(im.crop((xs[x],ys[y],xs[x+1],ys[y+1])).resize((dx[x+1]-dx[x],dy[y+1]-dy[y]),Image.Resampling.LANCZOS),(dx[x],dy[y]))
 return out
def text(im,xy,s,n=12,fill='#fff2d5',bold=False,anchor='mm',stroke=0):
 ImageDraw.Draw(im).text(xy,s,font=font(n,bold),fill=fill,anchor=anchor,stroke_width=stroke,stroke_fill='#432712')
def place(im,k,box,n=0):
 x,y,w,h=map(round,box);im.alpha_composite(panel(k,(w,h),n),(x,y))
def cover(path,size):return ImageOps.fit(Image.open(path).convert('RGBA'),size,Image.Resampling.LANCZOS)

def lobby(W,H,stage):
 im=cover(ROOT/f'assets/incoming/menu_stage_cards/stage_card_s{stage:02}.png',(W,H))
 shade=Image.new('RGBA',(W,H));d=ImageDraw.Draw(shade)
 for y in range(H):
  a=round(85*max(0,1-y/160)+170*max(0,(y-H*.57)/(H*.43)))
  d.line((0,y,W,y),fill=(24,10,31,min(210,a)))
 im.alpha_composite(shade)
 pw=W-128;place(im,'lb_profile_frame',(8,10,pw,72))
 hero=Image.open(ROOT/'assets/character_cards/card_momo.png').convert('RGBA')
 bb=hero.getchannel('A').getbbox();hero=hero.crop(bb)
 avatar=ImageOps.fit(hero.crop((0,0,hero.width,int(hero.height*.5))),(52,52))
 im.alpha_composite(avatar,(16,20));place(im,'lb_avatar_ring',(11,15,64,64))
 text(im,(82,27),'Momo',15,bold=True,anchor='lm');text(im,(pw-6,27),'Lv. 3',12,bold=True,anchor='rm')
 d=ImageDraw.Draw(im);d.rounded_rectangle((82,41,pw-7,47),3,fill='#130d1d');d.rounded_rectangle((82,41,82+(pw-89)*.4,47),3,fill='#83dec2')
 text(im,(82,61),'Power 154   ·   Rank 0',10,anchor='lm')
 place(im,'lb_currency_pill',(W-112,12,104,34));text(im,(W-74,28),'1,118',12,bold=True)
 text(im,(W-98,29),'◆',14,fill='#ff8560')
 d=ImageDraw.Draw(im);d.rounded_rectangle((W-40,51,W-8,83),8,fill='#291c36',outline='#c69c53',width=1)
 text(im,(W-24,67),'⚙',19)
 for i,(k,label) in enumerate([('inbox','Inbox'),('news','News'),('daily','Daily'),('awards','Awards')]):
  x,y=W-64,102+i*62;place(im,'lb_side_btn',(x,y,56,56));place(im,'ic_side_'+k,(x+12,y+3,32,32));text(im,(x+28,y+44),label,10,bold=True)
 place(im,'lb_side_btn',(8,102,56,56));place(im,'ic_side_codex',(20,105,32,32));text(im,(36,146),'Codex',10,bold=True)
 sy=H-260;hy=180;hh=sy-hy-8;hw=min(W-86,round(hh*hero.width/hero.height));hh=round(hw*hero.height/hero.width)
 place(im,'lb_hero_shadow',((W-180)/2,sy-26,180,36))
 im.alpha_composite(hero.resize((hw,hh),Image.Resampling.LANCZOS),((W-hw)//2,sy-hh-8))
 sw=W-70;place(im,'lb_stage_panel',(35,sy,sw,100));place(im,'lb_arrow_btn',(4,sy+25,27,48))
 right=panel('lb_arrow_btn',(27,48)).transpose(Image.Transpose.FLIP_LEFT_RIGHT);im.alpha_composite(right,(W-31,sy+25))
 text(im,(W/2,sy+15),'CHAPTER 1',10,bold=True)
 text(im,(W/2-44,sy+42),'C1-1',34,bold=True)
 for n in range(3):place(im,'lb_star',(W/2+24+n*21,sy+31,21,21),0 if n<2 else 1)
 text(im,(W/2,sy+65),'The Sour Ant Nest',12)
 place(im,'lb_power_pill',((W-196)//2,sy+76,196,21));text(im,(W/2,sy+86),'154 / 130  ·  Strong',11,fill='#8fe6be',bold=True)
 bw=min(340,W-60);bx=(W-bw)//2;byy=H-150
 place(im,'lb_battle_btn',(bx,byy,bw,84));place(im,'ic_lb_battle',(bx+48,byy+15,48,48));text(im,(W/2+29,byy+42),'BATTLE',29,fill='#57300f',bold=True)
 ny=H-62;place(im,'lb_nav_bg',(0,ny,W,62));aw=120 if W==360 else 132;other=(W-aw)/4
 place(im,'lb_nav_active',(2,ny+3,aw-4,56));centers=[aw/2]+[aw+(i+.5)*other for i in range(4)]
 for i,(k,label) in enumerate([('home','Home'),('heroes','Heroes'),('play','Play'),('gear','Gear'),('activities','Activities')]):
  cx=centers[i]
  if i==2:
   ImageDraw.Draw(im).ellipse((cx-24,ny-11,cx+24,ny+37),fill='#9d3b66',outline='#ddb46a',width=1)
  place(im,'ic_nav_'+k,(cx-18,ny+(0 if i==2 else 4),36,36));text(im,(cx,ny+47),label,10,fill='#533018' if i==0 else '#f9ecd1',bold=True)
  if i>0:place(im,'lb_nav_divider',(aw+(i-1)*other,ny+12,2,40))
 name=f'lobby_{W}x{H}_s{stage:02}.png';im.convert('RGB').save(Q/name,optimize=True)
 return name

proofs=[lobby(w,h,s) for w,h in [(360,780),(412,915)] for s in [1,11]]
# Native size icons, on both light and dark backgrounds.
icons=[m['key'] for m in M if m['key'].startswith('ic_')]
gallery=Image.new('RGB',(990,320),'#271a36')
for i,k in enumerate(icons):
 x=i*90
 for y,bg in [(0,'#271a36'),(160,'#f5dfb7')]:
  ImageDraw.Draw(gallery).rectangle((x,y,x+90,y+159),fill=bg)
  for sz,dy in [(28,30),(56,75)]:
   a=load(k).resize((sz,sz),Image.Resampling.LANCZOS);gallery.paste(a,(x+(90-sz)//2,y+dy),a)
  ImageDraw.Draw(gallery).text((x+2,y+8),k.replace('ic_','').replace('side_','').replace('nav_',''),font=font(9),fill='#fff1d5' if y==0 else '#382338')
gallery.save(Q/'icons_28_56_light_dark.png',optimize=True)
# Required stretch matrix at real display size, plus white-text contrast specimens.
canvas=Image.new('RGBA',(820,580),'#766376')
for k,sizes,y in [('lb_stage_panel',[(260,90),(340,110)],10),('lb_battle_btn',[(260,76),(340,92)],150),('lb_nav_active',[(120,56),(160,60)],275)]:
 x=20
 for w,h in sizes:
  canvas.alpha_composite(panel(k,(w,h)),(x,y));text(canvas,(x+w/2,y+h/2),f'{w} × {h}',12,bold=True,stroke=1);x+=w+40
for i,k in enumerate(['lb_stage_panel','lb_battle_btn','lb_power_pill']):
 x=20+i*265;canvas.alpha_composite(panel(k,(250,84)),(x,380));text(canvas,(x+125,404),'White 12px sample',12,fill='white',stroke=1);text(canvas,(x+125,442),'154',34,fill='white',bold=True,stroke=1)
text(canvas,(410,510),'Honey surface: use dark brown text or a 1px dark outline for white text.',13)
text(canvas,(410,540),'Protected painted endcaps stay fixed; only the plain center expands.',13)
canvas.convert('RGB').save(Q/'stretch_and_text.png',optimize=True)
# Full state contact sheet on neutral contrasting background.
contact=Image.new('RGB',(1000,1700),'#796475');d=ImageDraw.Draw(contact)
for i,m in enumerate(M):
 x=i%3*330;y=i//3*185;im=Image.open(P/m['file']).convert('RGBA');im.thumbnail((310,145),Image.Resampling.LANCZOS);contact.paste(im,(x+(320-im.width)//2,y+25),im);d.text((x+8,y+4),m['key'],font=font(11),fill='white')
contact.save(Q/'asset_contact.png',optimize=True)

checks=[];memory=0
for m in M:
 p=P/m['file'];data=p.read_bytes();im=Image.open(p);im.load();assert im.mode=='RGBA',p
 assert im.size==(m['width'],m['height']);assert len(data)==m['bytes'];assert hashlib.sha256(data).hexdigest()==m['sha256']
 pos=8;chunks=[]
 while pos<len(data):
  ln=struct.unpack('>I',data[pos:pos+4])[0];typ=data[pos+4:pos+8];body=data[pos+8:pos+8+ln];crc=struct.unpack('>I',data[pos+8+ln:pos+12+ln])[0]
  assert zlib.crc32(typ+body)&0xffffffff==crc;chunks.append(typ);pos+=ln+12
 assert chunks[-1]==b'IEND' and pos==len(data)
 arr=np.array(im);alpha=arr[:,:,3];frames=[]
 for n in range(m['frames']):
  f=load(m['key'],n);a=np.array(f)
  frames.append(dict(index=n,alphaRange=[int(a[:,:,3].min()),int(a[:,:,3].max())],bbox=f.getchannel('A').point(lambda x:255 if x>32 else 0).getbbox()))
 if m['background']=='transparent':assert int(alpha.min())==0
 else:
  assert int(alpha.min())==255
  assert (arr[0,0,:3]==0).all()
 if m['key'].startswith('ic_'):
  bb=frames[0]['bbox'];assert min(bb[0],bb[1],256-bb[2],256-bb[3])>=16
 mem=(im.width//2)*(im.height//2)*4;memory+=mem
 checks.append(dict(file=p.name,bytes=len(data),sha256=m['sha256'],pngStream='complete; CRC checked',frames=frames,packedDecodedBytes=mem))
assert len(M)==26 and memory<=6*1048576
report=dict(order=33,scope='Source delivery only; offline PIL compositions, not game/browser screenshots.',tool='built-in image_gen',
 assets=26,frames=sum(m['frames'] for m in M),sourceBytes=sum(m['bytes'] for m in M),packedDecodedBytes=memory,packedDecodedMiB=memory/1048576,budgetMiB=6,
 proofs=proofs+['icons_28_56_light_dark.png','stretch_and_text.png','asset_contact.png'],
 layout='Header, hero, mission, battle and nav occupy separate bands in both exact-size source compositions. The hero/background are existing repository assets.',
 textPolicy='Asset PNGs contain no text; all labels and numbers in proofs are runtime-text specimens. White text on honey requires dark stroke; dark brown recommended for BATTLE.',
 nineSlice='Stretch centers flattened from native painted columns; transitions feathered within protected endcaps. Center top ornament on stage frame removed to avoid stretching its star; code may overlay a small four-point star.',
 reviewPending=['Owner phone visual/touch/FPS review','Runtime 50% packing, TEMPLE_UI/ASSET_FX binding and Lobby-only lazy loading; preserve fallback'],
 checks=checks)
(P/'QA_REPORT.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:report[k] for k in ['assets','frames','packedDecodedMiB','sourceBytes']}))
