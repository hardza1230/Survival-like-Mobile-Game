"""Offline art-order preview assembled exclusively from delivered PNG layers.

This is a mechanical staging proof, not a gameplay capture or runtime player.
Captions and the reserved narration area are review annotations only.
"""
from pathlib import Path
import hashlib
import json
import math
from PIL import Image, ImageChops, ImageDraw, ImageOps

ROOT = Path('assets/incoming/story_motion')
W, H, STORY_BOTTOM = 360, 780, 561


def main():
    records = {}
    for manifest in ROOT.rglob('MANIFEST.json'):
        if '_sources' in manifest.parts:
            continue
        for entry in json.loads(manifest.read_text(encoding='utf-8'))['assets']:
            records[entry['key']] = dict(entry, path=manifest.parent/entry['file'])
    # Existing Ruby narrator pose is explicitly reusable under order45 section A.
    records['ruby_talk_proud'] = dict(path=Path('assets/art/mascot/ruby_talk_proud.webp'),blend='NORMAL')
    cache = {}
    used = set()

    def asset(key, frame=None):
        used.add(key)
        record = records[key]  # Missing work is an explicit error, never a substitute.
        if key not in cache:
            with Image.open(record['path']) as opened:
                cache[key] = opened.convert('RGBA')
        image = cache[key]
        if frame is not None:
            fw, fh = record['frame_width'], record['frame_height']
            frame %= record['frames']
            image = image.crop((frame*fw,0,(frame+1)*fw,fh))
        return image

    def put(canvas,key,center,size,frame=None):
        source = asset(key,frame)
        source = ImageOps.contain(source,size,Image.Resampling.LANCZOS)
        x,y = round(center[0]-source.width/2),round(center[1]-source.height/2)
        if records[key].get('blend') == 'ADD':
            layer=Image.new('RGB',canvas.size)
            layer.paste(source.convert('RGB'),(x,y))
            canvas.paste(ImageChops.add(canvas.convert('RGB'),layer).convert('RGBA'))
        else:
            canvas.alpha_composite(source,(x,y))

    def background(key,t,zoom=1,scroll=False):
        source=asset(key)
        scale=max(W/source.width,H/source.height)*zoom
        resized=source.resize((round(source.width*scale),round(source.height*scale)),Image.Resampling.LANCZOS)
        x=(resized.width-W)//2
        y=round((resized.height-H)*t) if scroll else (resized.height-H)//2
        return resized.crop((x,y,x+W,y+H))

    def scenery(place,t,zoom=1):
        image=background(f'cs_s01_far_{place}',t,zoom)
        image.alpha_composite(background(f'cs_s01_mid_{place}',t,zoom+.015))
        return image

    captions=[('01 / THE PANTRY CRACKS','The starving roots stir beneath Strawberry.'),
              ('02 / THE FALL','The floor gives way. Down into the dark!'),
              ('03 / A STRANGE NEST','Ruby hides as the blank mochi draw near.'),
              ('04 / THE HEART SEED','A sleeping seed waits among the old roots.'),
              ('05 / THE SEED WAKES','Warm pink-gold light answers her touch.'),
              ('06 / THE TRANSFORMATION','The curse breaks around Strawberry.'),
              ('07 / A NEW BEGINNING','Strawberry stands. Ruby is no longer alone.')]
    out=ROOT/'review'
    out.mkdir(exist_ok=True)
    frames=[]
    for shot in range(7):
        for tick in range(16):
            t=tick/15
            if shot==0:
                image=scenery('pantry',t,1.015)
                shake=math.sin(t*60)*3*t
                put(image,'cs_pup_root_tip',(230+shake,430),(130,160))
                put(image,'cs_pup_mochi_berry_idle',(145+shake,350),(150,150))
                put(image,'cs_fx_crack',(180,465),(320,180),min(4,int(t*5)))
            elif shot==1:
                image=background('cs_s01_far_shaft',t,1,True)
                put(image,'cs_fx_speedlines',(180,280),(360,640),tick//2)
                put(image,'cs_pup_mochi_berry_fall',(180,90+350*t),(135,165))
            elif shot==2:
                image=scenery('nest',t,1.02)
                put(image,'cs_pup_ruby_hide',(280,360),(110,120))
                put(image,'cs_pup_blank_mochi_walk',(40+35*t,420),(80,80))
                put(image,'cs_pup_blank_mochi_leap',(100+35*t,435),(75,75))
                put(image,'cs_pup_mochi_berry_scared',(195,385-20*math.sin(t*math.pi)),(140,150))
                if tick<12:
                    put(image,'cs_fx_dust',(190,465),(235,118),min(5,tick//2))
            elif shot==3:
                image=scenery('root_floor',t,1.03+.08*t)
                put(image,'cs_pup_mochi_berry_reach',(120+20*t,350),(230,180))
                put(image,'cs_pup_seed_sleep',(265,402),(75,100))
            elif shot==4:
                image=scenery('root_floor',t,1.1)
                put(image,'cs_pup_mochi_berry_reach',(115,350),(230,180))
                put(image,'cs_pup_seed_wake',(265,382),(85,130))
                put(image,'cs_fx_seed_glow',(265,382),(175,175),tick//2)
                if tick>12:
                    put(image,'cs_fx_flash',(180,280),(360,640),0)
            elif shot==5:
                image=scenery('nest',t,1.1)
                key='cs_pup_mochi_berry_reach' if tick<5 else 'cs_pup_berry_land'
                put(image,key,(180,345),(230,280))
                put(image,'cs_fx_transform',(180,330),(355,355),min(7,tick//2))
            else:
                image=scenery('nest',t,1.1-.08*t)
                put(image,'cs_pup_berry_hero',(170,310),(230,330))
                put(image,'ruby_talk_proud',(290,320+math.sin(t*math.pi*2)*5),(105,110))
                put(image,'cs_fx_sparkle',(70,220),(75,75),tick//2)
            if shot != 1:
                place = 'pantry' if shot==0 else 'root_floor' if shot in (3,4) else 'nest'
                image.alpha_composite(background(f'cs_s01_fg_{place}',t,1.04+.02*t))
            # Review-only labels and reserve exactly the lower28% for narration.
            draw=ImageDraw.Draw(image)
            draw.rectangle((0,STORY_BOTTOM,W,H),fill=(28,15,39,255))
            draw.line((0,STORY_BOTTOM,W,STORY_BOTTOM),fill=(236,184,100),width=2)
            draw.text((20,590),'RUBY / STAGING PROOF',fill='#ffc578',font_size=15)
            draw.text((20,630),captions[shot][0],fill='white',font_size=17)
            words=captions[shot][1].split(); lines=['']
            for word in words:
                if len(lines[-1])+len(word)>34:
                    lines.append('')
                lines[-1]+=(' ' if lines[-1] else '')+word
            draw.multiline_text((20,670),'\n'.join(lines),fill='#e8d8e8',spacing=8,font_size=15)
            draw.text((20,747),'OFFLINE LAYER / FX ASSEMBLY',fill='#a798ab',font_size=12)
            rgb=image.convert('RGB')
            frames.append(rgb)
            if tick==10:
                rgb.save(out/f'S01-shot-{shot+1:02d}-360x780.png')
    frames[0].save(out/'S01-motion.gif',save_all=True,append_images=frames[1:],duration=100,loop=0,optimize=False)
    hashes={key:hashlib.sha256(records[key]['path'].read_bytes()).hexdigest() for key in sorted(used)}
    external={key:dict(path=records[key]['path'].as_posix(),sha256=hashes[key])
              for key in hashes if not key.startswith('cs_')}
    (out/'S01-preview.json').write_bytes((json.dumps(dict(method=__doc__,size=[W,H],frames=len(frames),frame_ms=100,narration_reserved_bottom=219,assets=hashes,external_assets=external),indent=2)+'\n').encode())
    print(json.dumps(dict(frames=len(frames),keyshots=7,assets=len(used),gif=str(out/'S01-motion.gif'))))


if __name__=='__main__':
    main()
