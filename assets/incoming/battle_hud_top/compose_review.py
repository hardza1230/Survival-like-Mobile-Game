"""Offline UI asset composition over the owner's exact reference screenshot."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import json
P=Path(__file__).resolve().parent
ROOT=P.parents[2]
M={x['key']:x for x in json.loads((P/'MANIFEST.json').read_text())}
R=Image.Resampling.LANCZOS
FONT='C:/Windows/Fonts/arialbd.ttf'

def asset(k,fr=0):
    im=Image.open(P/(k+'.png')).convert('RGBA');m=M[k]
    return im.crop((fr*m['frame_width'],0,(fr+1)*m['frame_width'],m['frame_height']))

def panel(k,w,h):
    im=asset(k);l,t,r,b=M[k]['nineSlice'];sw,sh=im.size
    # Margins are source pixels; scale them 50% to logical display pixels.
    dl,dt,dr,db=[max(1,round(v/2)) for v in (l,t,r,b)]
    xs=[0,l,sw-r,sw];ys=[0,t,sh-b,sh]
    xd=[0,dl,w-dr,w];yd=[0,dt,h-db,h]
    out=Image.new('RGBA',(w,h))
    for y in range(3):
        for x in range(3):
            if xd[x+1]<=xd[x] or yd[y+1]<=yd[y]:continue
            tile=im.crop((xs[x],ys[y],xs[x+1],ys[y+1])).resize((xd[x+1]-xd[x],yd[y+1]-yd[y]),R)
            out.alpha_composite(tile,(xd[x],yd[y]))
    return out

def proof(w,h,boss=False):
    ref=Image.open(ROOT/'docs/art_orders/ref/47_hud_ref.webp').convert('RGBA')
    out=ImageOps.fit(ref,(w,h),method=R)
    def put(k,x,y,ww,hh,fr=0,slice=False):
        im=panel(k,ww,hh) if slice else asset(k,fr).resize((ww,hh),R)
        out.alpha_composite(im,(x,y))
    def text(s,x,y,size=12,anchor=None,fill='#fff0cb'):
        ImageDraw.Draw(out).text((x,y),s,font=ImageFont.truetype(FONT,size),fill=fill,anchor=anchor,stroke_width=1,stroke_fill='#24162e')
    # Reference already contains baked HUD. A code-rendered header underlay hides it
    # at the screen edges, without painting or altering the reference artwork.
    ImageDraw.Draw(out).rectangle((0,0,w,64),fill='#26172e')
    put('hud_top_panel',10,8,w-20,54,slice=True)
    put('hud_level_badge',17,15,47,25,slice=True);text('Lv 2',40,28,12,'mm')
    bw=w-218;put('hud_exp_frame',78,21,bw,11,slice=True)
    fill=asset('hud_exp_fill').resize((bw-8,5),R);out.alpha_composite(fill.crop((0,0,round((bw-8)*.72),5)),(82,24))
    for x,fr,s in [(w-119,1,'x2'),(w-81,0,None),(w-43,0,None)]:
        put('hud_round_btn',x,13,34,34,fr)
        if s:
            put('hud_speed_ring',x,13,34,34,1);text(s,x+17,30,12,'mm')
        else:put('hud_ic_pause' if x==w-81 else 'hud_ic_sound',x+8,21,18,18)
    for x,k,s in [(17,'hud_ic_kill','24'),(w-87,'hud_ic_sugar','27')]:
        put('hud_counter_pill',x,41,69,19,slice=True);put(k,x+6,42,16,16);text(s,x+43,50,12,'mm')
    put('hud_mission_card',10,68,w-20,73,slice=True)
    text('Wave 1/5  ·  15s',w//2,83,13,'mm')
    for i in range(5):put('hud_wave_pips',w//2-35+i*15,93,10,10,1 if i==0 else 2)
    text('Clear 24/50',w//2,113,13,'mm')
    put('hud_mission_bar_frame',65,125,w-130,8,slice=True)
    bar=asset('hud_mission_bar_fill').resize((w-142,4),R)
    out.alpha_composite(bar.crop((0,0,round(bar.width*.48),4)),(71,127))
    if boss:
        put('hud_boss_plate',30,147,w-60,43,slice=True)
        text('Queen of the Nest',w//2,158,12,'mm',fill='#ffc3d2')
        put('hud_boss_bar_frame',43,169,w-86,15,slice=True)
        red=asset('hud_boss_bar_fill').resize((w-105,8),R)
        out.alpha_composite(red.crop((0,0,round(red.width*.68),8)),(53,172))
    out.save(P/f'proof_{w}x{h}.png')
    return {'size':[w,h],'state':'boss' if boss else 'normal','header':[10,8,w-20,54],'mission':[10,68,w-20,73],'boss_plate':[30,147,w-60,43] if boss else None,'note':'Offline source composition over owner screenshot; text drawn separately. A code-rendered solid header underlay covers the screenshot baked HUD at the outer edges. Lower gameplay and controls are from reference. Not a live runtime capture.'}

proofs=[proof(360,780),proof(412,915,True)]
qa=json.loads((P/'QA_REPORT.json').read_text())
qa.update({'visual_review':'Manual inspection: no baked text/numerals/watermarks; blank panel/button centers; correct icon states and transparent exterior. Sprite states checked over neutral gray.','text_free':'Manual visual check passed; not an OCR guarantee.','proofs':proofs,'nine_slice':'All 11 panel/bar assets carry source-pixel margins. Two viewport compositions exercise 9-slice.','speed_ring':'Frame1 intentionally empty; frames2-4 show one/two/three arcs. Common round-button scale preserves disc size despite active glow.'})
qa['all_pass']=len(qa['assets'])==18 and all(x['size_pass'] and x['transparent_pixels']>0 and x['alpha_max']==255 for x in qa['assets'])
(P/'QA_REPORT.json').write_text(json.dumps(qa,indent=2),encoding='utf-8')
print('Proofs and QA complete:',qa['all_pass'])
