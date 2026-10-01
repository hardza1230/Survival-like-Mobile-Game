"""Pack an imagegen 4x4 RGBA atlas into isolated 256px runtime cells.
No color keying: preserve the generated alpha; uniformly resample each cell.
"""
from pathlib import Path
from PIL import Image
import argparse
p=argparse.ArgumentParser();p.add_argument('source');args=p.parse_args()
im=Image.open(args.source).convert('RGBA')
assert im.width==im.height,'Expected square four-by-four atlas'
cells=[];bounds=[]
for i in range(16):
 x,y=i%4,i//4
 cell=im.crop((round(x*im.width/4),round(y*im.height/4),round((x+1)*im.width/4),round((y+1)*im.height/4)))
 # Bounds only: faint generated alpha noise does not define the sprite footprint.
 bbox=cell.getchannel('A').point(lambda a:255 if a>=32 else 0).getbbox()
 assert bbox and min(bbox[:2])>=4 and bbox[2]<=cell.width-4 and bbox[3]<=cell.height-4,('Source frame crosses gutter',i,bbox)
 cells.append(cell);bounds.append(bbox)
baseline=max(b[3] for b in bounds)
normalized=[];aligned=[]
for cell,b in zip(cells,bounds):
 dy=baseline-b[3];canvas=Image.new('RGBA',(max(c.width for c in cells),max(c.height for c in cells)+baseline));canvas.paste(cell,(0,dy));normalized.append(canvas);aligned.append((b[0],b[1]+dy,b[2],b[3]+dy))
cells=normalized
shared=(min(b[0] for b in aligned)-5,min(b[1] for b in aligned)-5,max(b[2] for b in aligned)+5,max(b[3] for b in aligned)+5)
scale=220/max(shared[2]-shared[0],shared[3]-shared[1])
size=(round((shared[2]-shared[0])*scale),round((shared[3]-shared[1])*scale))
out=Image.new('RGBA',(1024,1024))
for i,cell in enumerate(cells):
 cell=cell.crop(shared).resize(size,Image.Resampling.LANCZOS)
 out.paste(cell,((i%4)*256+(256-size[0])//2,(i//4)*256+238-size[1]))
root=Path(__file__).resolve().parents[1]
out.save(root/'assets/mb10_ancient_root_knight_sheet.png',optimize=True)
# QA contact sheet on a bright stage-like backdrop, deliberately not runtime art.
preview=Image.new('RGBA',out.size,'#b6c99c');preview.alpha_composite(out);preview.convert('RGB').save('/tmp/root-knight-preview.jpg')
