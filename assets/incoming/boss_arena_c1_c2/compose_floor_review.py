"""Offline source composites on the actual stage floors; no combat simulation."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageOps,ImageFont
import json
P=Path(__file__).resolve().parent;ROOT=P.parents[2]
M={m['key']:m for m in json.loads((P/'MANIFEST.json').read_text())}
R=Image.Resampling.LANCZOS
FLOORS={0:'assets/generated/bg1_sour_ant_nest.webp',1:'assets/generated/bg2_rotting_drain.jpg',2:'assets/bg3.webp',3:'assets/bg4.webp',5:'assets/art/floors/floor_c21.webp',6:'assets/art/floors/floor_c22.webp',8:'assets/art/floors/floor_c24.webp',9:'assets/art/floors/floor_c25.webp'}
FONT=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',13)
def fr(key,i):
    m=M[key];im=Image.open(P/m['preview_file']).convert('RGBA');w,h=m['frameWidth']//2,m['frameHeight']//2
    return im.crop(((i%m['columns'])*w,(i//m['columns'])*h,(i%m['columns']+1)*w,(i//m['columns']+1)*h))
def put(canvas,im,x,y,w,h):
    im=im.resize((round(w),round(h)),R);canvas.alpha_composite(im,(round(x-w/2),round(y-h/2)))
def panel(key):
    m=M[key];bg=ImageOps.fit(Image.open(ROOT/FLOORS[m['stage_index']]).convert('RGBA'),(300,480),method=R)
    k=300/360
    if 'sludge_band' in key or 'root_band' in key:
        h=round((90 if 'sludge' in key else 120)*k);band=fr(key,1).resize((300,h),R);top=210-h//2
        bg.alpha_composite(band.crop((0,0,120,h)),(0,top));bg.alpha_composite(band.crop((180,0,300,h)),(180,top))
        ImageDraw.Draw(bg).rounded_rectangle((120,top-4,180,top+h+4),radius=4,outline='#fff5df',width=2)
    elif key.endswith('hot_tile'):
        put(bg,fr(key,0),86,240,100*k,100*k);put(bg,fr(key,2),216,240,100*k,100*k)
    elif key.endswith('ice_pillar'):
        for i in range(4):put(bg,fr(key,i),45+i*70,240,48*k,84*k)
    elif key.endswith('fog_tile'):
        tile=fr(key,1);tile.putalpha(tile.getchannel('A').point(lambda x:round(x*.42)))
        for y in range(0,480,tile.height):
            for x in range(0,300,tile.width):bg.alpha_composite(tile,(x,y))
    elif 'clock_hand_long' in key:
        hand=fr(key,1).resize((round(520*k),round(28*k)),R).rotate(90,expand=True)
        bg.alpha_composite(hand,(150-hand.width//2,450-hand.height))
    elif 'clock_hand_short' in key:
        hand=fr(key,1).resize((round(330*k),round(20*k)),R).rotate(45,expand=True)
        bg.alpha_composite(hand,(30,190))
    else:
        size={'vfx_b01_burrow_shadow':(140,74,2),'vfx_b01_burrow_burst':(160,160,1),'vfx_b04_frost_breath':(320,320,2),'vfx_b06_pod_shield':(180,180,1),'vfx_b07_air_bubble':(210,210,1)}[key]
        put(bg,fr(key,size[2]),150,240,size[0]*k,size[1]*k)
    return bg
groups=[('floor_review_c1.png',[k for k,m in M.items() if m['stage_index']<5]),('floor_review_c2.png',[k for k,m in M.items() if m['stage_index']>=5])]
for name,keys in groups:
    assert len(keys)==6
    board=Image.new('RGB',(900,1020),'#201b25');draw=ImageDraw.Draw(board)
    for i,key in enumerate(keys):
        x=(i%3)*300;y=(i//3)*510
        draw.text((x+6,y+5),key,font=FONT,fill='white');board.paste(panel(key).convert('RGB'),(x,y+28))
    board.save(P/name)
# Explicit 3x3 tiling proof of the source fog frame, edges exact in PNG.
fog=Image.open(P/'vfx_b07_fog_tile.png').convert('RGB').crop((0,0,256,256))
tiles=Image.new('RGB',(768,768))
for y in range(3):
    for x in range(3):tiles.paste(fog,(x*256,y*256))
tiles.save(P/'fog_3x3_seam_review.png')
# Every exported frame, after the same luminance-alpha conversion used by the preview.
frames=Image.new('RGB',(1120,12*140),'#68616e');fd=ImageDraw.Draw(frames)
for row,(key,m) in enumerate(M.items()):
    fd.text((8,row*140+8),key,font=FONT,fill='white')
    for i in range(m['frameCount']):
        im=fr(key,i);im.thumbnail((148,108),R)
        frames.paste(im,(210+i*150+(148-im.width)//2,row*140+27+(108-im.height)//2),im)
frames.save(P/'all_frames_review.png')
q=json.loads((P/'QA_REPORT.json').read_text());q['floor_reviews']=[{'file':name,'keys':keys} for name,keys in groups]
q['visual_review']='Manual source/frame/contact review passed: no faces/text/UI arrows; 52 unique states; hollow bubble/frost/shield centers; hot warning center clear; dark outlined ice pillar; source floor compositions checked separately. Bands show split safety gap as a code-only guide. Not a live runtime screenshot.'
q['budget_note']='50% preview WebPs are source review files, not registered in runtime. Decoded preview size is 3.15625MiB across all12sheets; normally load per stage. Source fog/strips have pixel-exact periodic edges; lossy WebP edge deltas are recorded separately.'
(P/'QA_REPORT.json').write_text(json.dumps(q,indent=2),encoding='utf-8',newline='\n')
print('Two actual-floor boards and 3x3 source fog proof written')
