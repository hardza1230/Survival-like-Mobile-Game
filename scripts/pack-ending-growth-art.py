"""Normalize generated end-screen backgrounds, 15 story panels and 3 growth sheets.
Usage: python scripts/pack-ending-growth-art.py sources.json
"""
import json,shutil,sys,hashlib
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
root=Path(__file__).resolve().parents[1]
mapping=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8-sig'))
incoming=root/'assets/incoming/ending_growth';(incoming/'raw').mkdir(parents=True,exist_ok=True)
report={'results':{},'epilogues':{},'growth':{}}
for key,path in mapping.items():
    source=Image.open(path).convert('RGBA');raw=incoming/'raw'/f'{key}_generated.png'
    if Path(path).resolve()!=raw.resolve():shutil.copyfile(path,raw)
    if key.startswith('result_'):
        runtime=root/'assets/ui/results';runtime.mkdir(parents=True,exist_ok=True)
        normalized=ImageOps.fit(source.convert('RGB'),(768,1152),Image.Resampling.LANCZOS)
        normalized.save(runtime/f'{key}.webp',quality=91,method=6)
        normalized.save(incoming/f'{key}.png');report['results'][key]={'originalSize':source.size,'runtimeSize':normalized.size}
    elif key.startswith('epilogue_'):
        chapter=int(key[-1]);runtime=root/'assets/story/epilogues';runtime.mkdir(parents=True,exist_ok=True)
        for i in range(5):
            col,row=i%2,i//2;bounds=(round(col*source.width/2),round(row*source.height/3),round((col+1)*source.width/2),round((row+1)*source.height/3))
            panel=ImageOps.fit(source.crop(bounds).convert('RGB'),(768,432),Image.Resampling.LANCZOS)
            name=f'epilogue_s{(chapter-1)*5+i+1}'
            panel.save(runtime/f'{name}.webp',quality=92,method=6);panel.save(incoming/f'{name}.png')
            report['epilogues'][name]={'chapter':chapter,'sourceCell':i,'sourceBounds':bounds,'runtimeSize':panel.size}
    else:
        alpha_min,alpha_max=source.getchannel('A').getextrema()
        assert alpha_min==0 and alpha_max>=200,(key,'true alpha required')
        runtime=root/'assets/vfx';runtime.mkdir(parents=True,exist_ok=True);sheet=Image.new('RGBA',(2048,256));hashes=set();frames=[]
        for i in range(8):
            col,row=i%4,i//4;bounds=(round(col*source.width/4),round(row*source.height/2),round((col+1)*source.width/4),round((row+1)*source.height/2))
            cell=ImageOps.contain(source.crop(bounds),(216,216),Image.Resampling.LANCZOS)
            tile=Image.new('RGBA',(256,256));tile.alpha_composite(cell,((256-cell.width)//2,(256-cell.height)//2))
            box=tile.getbbox();assert box and box[0]>=19 and box[1]>=19 and box[2]<=237 and box[3]<=237,(key,i,box)
            digest=hashlib.sha256(tile.tobytes()).hexdigest();assert digest not in hashes,(key,'duplicate authored frame',i);hashes.add(digest)
            sheet.alpha_composite(tile,(i*256,0));frames.append({'frame':i,'sourceBounds':bounds,'packedBounds':box})
        sheet.save(incoming/f'{key}_sheet.png');sheet.save(runtime/f'{key}.webp',lossless=True,method=6)
        report['growth'][key]={'originalSize':source.size,'sheetSize':sheet.size,'frameSize':256,'uniqueFrames':len(hashes),'frames':frames}
(incoming/'PACKING.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
outputs=root.parents[1]/'outputs';outputs.mkdir(exist_ok=True)
preview=Image.new('RGB',(960,1560),(26,18,37));draw=ImageDraw.Draw(preview)
for i,key in enumerate(['result_victory','result_defeat']):
    if key in mapping:
        im=Image.open(incoming/f'{key}.png');im.thumbnail((460,480));preview.paste(im,(i*480+(480-im.width)//2,0));draw.text((i*480+15,484),key,fill='white')
for i in range(15):
    file=incoming/f'epilogue_s{i+1}.png'
    if file.exists():
        im=Image.open(file);im.thumbnail((300,169));x=(i%3)*320+10;y=520+(i//3)*200;preview.paste(im,(x,y));draw.text((x,y+173),f'Stage {i+1}',fill='white')
preview.save(outputs/'ending-story-preview.png');preview.save(incoming/'ending-story-contact.png')
if len(report['growth'])==3:
    clips=[Image.open(incoming/f'{key}_sheet.png') for key in report['growth']];frames=[]
    for i in range(8):
        frame=Image.new('RGB',(768,290),(26,18,37));d=ImageDraw.Draw(frame)
        for n,(key,clip) in enumerate(zip(report['growth'],clips)):
            cell=clip.crop((i*256,0,(i+1)*256,256));frame.paste(cell,(n*256,0),cell);d.text((n*256+16,263),key,fill='white')
        frames.append(frame)
    frames[0].save(outputs/'growth-effects-preview.gif',save_all=True,append_images=frames[1:],duration=83,loop=0,disposal=2)
print('Packed',len(report['results']),'result backgrounds,',len(report['epilogues']),'story panels and',len(report['growth']),'eight-frame growth sheets')
