"""Mechanically trim, pad and halve original transparent HUD art; never mask/repaint."""
from pathlib import Path
from PIL import Image,ImageDraw
import io,json,hashlib,math
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/incoming/hud_ink820';OUT=ROOT/'assets/art/hud_ink820'
def digest(b):return hashlib.sha256(b).hexdigest()
def solid(im):return im.getchannel('A').point(lambda a:255 if a>=16 else 0)
def write(p,j):p.write_text(json.dumps(j,indent=2)+'\n',encoding='utf8')
def main():
    OUT.mkdir(parents=True,exist_ok=True);raw=(SRC/'source.png').read_bytes();im=Image.open(io.BytesIO(raw)).convert('RGBA');assert im.size==(1536,1024);assert im.getchannel('A').getextrema()[0]==0
    items=[];cuts=[];panels=[]
    for row,key in enumerate(['hud_top_panel','hud_mission_card','hud_boss_plate']):
        cell=im.crop((0,row*256,1536,(row+1)*256));box=solid(cell).getbbox();assert box
        x0,y0,x1,y1=box;rect=(max(0,x0-8),max(0,y0-8),min(1536,x1+8),min(256,y1+8));tile=cell.crop(rect)
        for edge in [(0,0,tile.width,2),(0,tile.height-2,tile.width,tile.height),(0,0,2,tile.height),(tile.width-2,0,tile.width,tile.height)]:assert not solid(tile.crop(edge)).getbbox(),(key,'painted cut')
        size=(2*math.ceil((tile.width+8)/2),2*math.ceil((tile.height+8)/2));source=Image.new('RGBA',size);source.paste(tile,(4,4));panels.append(source)
        items.append((key,source,1,[48,16,48,16]));cuts.append({'key':key,'sourceRect':[rect[0],rect[1]+row*256,rect[2],rect[3]+row*256],'sourceBorderAlphaBelow16':True})
    cells=[im.crop((x-128,768,x+128,1024))for x in [256,768,1280]];boxes=[solid(c).getbbox()for c in cells];l=min(b[0]for b in boxes);t=min(b[1]for b in boxes);rr=max(b[2]for b in boxes);bb=max(b[3]for b in boxes);side=2*math.ceil((max(rr-l,bb-t)+12)/2);ox=math.floor((l+rr-side)/2);oy=math.floor((t+bb-side)/2)
    source=Image.new('RGBA',(side*3,side))
    for i,c in enumerate(cells):
        f=c.crop((ox,oy,ox+side,oy+side));assert solid(f).getbbox();source.paste(f,(i*side,0))
        for edge in [(0,0,side,2),(0,side-2,side,side),(0,0,2,side),(side-2,0,side,side)]:assert not solid(f.crop(edge)).getbbox()
        cuts.append({'key':'hud_round_btn','frame':i,'sourceRect':[128+i*512+ox,768+oy,128+i*512+ox+side,768+oy+side],'sourceBorderAlphaBelow16':True})
    items.append(('hud_round_btn',source,3,None));manifest=[]
    for key,source,cols,nine in items:
        stream=io.BytesIO();source.save(stream,'PNG');data=stream.getvalue();(SRC/(key+'.png')).write_bytes(data)
        runtime=source.resize((source.width//2,source.height//2),Image.Resampling.LANCZOS);stream=io.BytesIO();runtime.save(stream,'WEBP',lossless=True,exact=True,method=6);packed=stream.getvalue();dest=OUT/(key+'.webp');dest.write_bytes(packed)
        with Image.open(dest)as check:assert check.convert('RGBA').tobytes()==runtime.tobytes()
        manifest.append({'key':key,'file':key+'.png','width':source.width,'height':source.height,'frames':cols,'columns':cols,'frame_width':source.width//cols,'frame_height':source.height,'bytes':len(data),'sha256':digest(data),'background':'transparent','runtime_file':dest.relative_to(ROOT).as_posix(),'runtime_bytes':len(packed),'runtime_sha256':digest(packed),'nineSlice':nine})
    write(SRC/'MANIFEST.json',manifest);write(SRC/'QA_REPORT.json',{'original':{'file':'source.png','bytes':len(raw),'sha256':digest(raw),'size':im.size},'transparent':True,'sourceCutAlphaThreshold':16,'cuts':cuts,'method':'source-only mechanical trim at clear alpha gutters, uniform half-size packing, no masks or repaint','runtimeBytes':sum(a['runtime_bytes']for a in manifest),'decodedBytes':sum(a['width']//2*(a['height']//2)*4 for a in manifest)})
    preview=Image.new('RGBA',(768,420),'#261e30');d=ImageDraw.Draw(preview)
    for row,(key,source,cols,nine)in enumerate(items):
        d.text((8,row*100+2),key,fill='#fff0dc');tile=source.copy();tile.thumbnail((744,70));preview.alpha_composite(tile,(12,row*100+20))
    preview.convert('RGB').save(SRC/'preview.png');print(json.dumps({'assets':4,'runtimeBytes':sum(a['runtime_bytes']for a in manifest)}))
if __name__=='__main__':main()
