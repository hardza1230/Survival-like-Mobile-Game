"""Mechanical 360x780 keyshot proofs from delivered story-motion PNG layers."""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageDraw, ImageOps, ImageChops

ROOT=Path('assets/incoming/story_motion')
SCENES=[
 ('S00-curse','cs_s00_far_city','The Crown steals the kingdom\'s flavor.',[
  ('cs_s00_mid_city',180,390,360,780),('cs_pup_crowd_mochi',180,400,330,150),
  ('cs_fx_curse_smoke',180,345,330,330,2),('cs_fx_flavor_ribbon',185,210,330,100,2),('cs_s00_fg_city',180,390,360,780)]),
 ('S02-jar','cs_s02_far_drains','Grandma\'s jar carries one last clue.',[
  ('cs_s02_mid_drains',180,390,360,780),('cs_s02_prop_jam_jar',185,355,180,200),
  ('cs_s02_prop_recipe_rolled',240,300,100,100),('cs_fx_sparkle',180,240,80,80,3)]),
 ('S04-GrandmaFrozen','cs_s04_far_prison','Grandma waits inside the frozen sugar.',[
  ('cs_s04_mid_prison',180,390,360,780),('cs_pup_grandma_mochi_frozen',180,340,230,330),
  ('cs_pup_ruby_hide',290,430,105,110)]),
 ('S12-Hunger','cs_s12_far_garden','The roots gather into something larger.',[
  ('cs_s12_mid_garden',180,390,360,780),('cs_s12_chr_hunger',180,300,330,390),
  ('cs_fx_flavor_ribbon',180,460,330,100,3),('cs_s12_fg_garden',180,390,360,780)]),
 ('S15-memorymirrors','cs_s15_far_glasshall','A broken mirror remembers her family.',[
  ('cs_s15_prop_memory_town',75,210,120,150),('cs_s15_prop_memory_grandma',280,205,120,155),
  ('cs_s15_prop_memory_family',180,330,190,200),('cs_pup_berry_look',85,440,135,180)]),
 ('S16-GrandmaRuby','cs_s16_far_clearing','Grandma and Ruby are together again.',[
  ('cs_s16_prop_young_tree',265,240,190,290),('cs_pup_planter_old',290,360,110,180),
  ('cs_s16_chr_grandma_ruby_hug',145,365,250,310)]),
 ('S17-team','cs_s17_far_delve','Together, they face the sleeping darkness.',[
  ('cs_s17_chr_team_back',180,395,345,265)])]


def main():
    records={}
    for p in ROOT.rglob('MANIFEST.json'):
        if '_sources' not in p.parts:
            for a in json.loads(p.read_text(encoding='utf-8'))['assets']:
                records[a['key']]=dict(a,path=p.parent/a['file'])
    out=ROOT/'review'
    out.mkdir(exist_ok=True)
    outputs=[]
    used=set()
    for name,bg,caption,layers in SCENES:
        used.add(bg)
        canvas=ImageOps.fit(Image.open(records[bg]['path']).convert('RGBA'),(360,780),method=Image.Resampling.LANCZOS)
        for layer in layers:
            key,x,y,w,h,*frame=layer
            used.add(key)
            record=records[key]
            with Image.open(record['path']) as im:
                image=im.convert('RGBA')
            if frame:
                fw,fh=record['frame_width'],record['frame_height']
                image=image.crop((frame[0]*fw,0,(frame[0]+1)*fw,fh))
            image=ImageOps.contain(image,(w,h),Image.Resampling.LANCZOS)
            at=(round(x-image.width/2),round(y-image.height/2))
            if record.get('blend')=='ADD':
                black=Image.new('RGB',canvas.size)
                black.paste(image.convert('RGB'),at)
                canvas=ImageChops.add(canvas.convert('RGB'),black).convert('RGBA')
            else:
                canvas.alpha_composite(image,at)
        draw=ImageDraw.Draw(canvas)
        draw.rectangle((0,561,360,780),fill='#1c0f27')
        draw.line((0,561,360,561),fill='#ecb864',width=2)
        draw.text((20,590),'RUBY / STAGING PROOF',fill='#ffc578',font_size=15)
        draw.text((20,630),name.replace('-',' / ',1),fill='white',font_size=17)
        lines=['']
        for word in caption.split():
            if len(lines[-1])+len(word)>33:
                lines.append('')
            lines[-1]+=(' ' if lines[-1] else '')+word
        draw.multiline_text((20,670),'\n'.join(lines),fill='#e8d8e8',spacing=8,font_size=15)
        draw.text((20,747),'OFFLINE LAYER / FX ASSEMBLY',fill='#a798ab',font_size=12)
        path=out/f'{name}-360x780.png'
        canvas.convert('RGB').save(path)
        outputs.append(path.name)
    report=dict(method=__doc__,size=[360,780],narration_reserved_bottom=219,outputs=outputs,
                assets={key:hashlib.sha256(records[key]['path'].read_bytes()).hexdigest() for key in sorted(used)})
    (out/'SCENES-preview.json').write_bytes((json.dumps(report,indent=2)+'\n').encode())
    print(json.dumps(dict(keyshots=len(outputs),assets=len(used))))


if __name__=='__main__':
    main()
