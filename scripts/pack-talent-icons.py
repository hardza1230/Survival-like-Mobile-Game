"""Pack authored Talent atlas icons; preserve whole alpha components and source proportions.
Usage: python scripts/pack-talent-icons.py inventory.json source-map.json
"""
import json, shutil, sys
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np

def extract_poses(image, row_columns):
    """Keep whole transparent components even when a pose crosses a nominal cell edge."""
    rgba = np.array(image)
    mask = rgba[:, :, 3] > 16
    parents, runs, previous = [], [], []

    def find(i):
        while parents[i] != i:
            parents[i] = parents[parents[i]]
            i = parents[i]
        return i

    for y, row in enumerate(mask):
        edges = np.diff(np.concatenate(([False], row, [False])).astype(np.int8))
        current, at = [], 0
        for left, right in zip(np.flatnonzero(edges == 1), np.flatnonzero(edges == -1)):
            left, right = int(left), int(right)
            number = len(parents)
            parents.append(number)
            while at < len(previous) and previous[at][1] < left:
                at += 1
            scan = at
            while scan < len(previous) and previous[scan][0] <= right:
                parents[find(number)] = find(previous[scan][2])
                scan += 1
            current.append((left, right, number))
            runs.append((y, left, right, number))
        previous = current
    components = {}
    for y, left, right, number in runs:
        component = components.setdefault(find(number), {'runs': [], 'area': 0,
            'box': [image.width, image.height, 0, 0], 'sx': 0, 'sy': 0})
        component['runs'].append((y, left, right))
        width = right - left
        component['area'] += width
        component['sx'] += (left + right - 1) * width / 2
        component['sy'] += y * width
        b = component['box']
        b[0], b[1], b[2], b[3] = min(b[0], left), min(b[1], y), max(b[2], right), max(b[3], y + 1)
    pieces = sorted(components.values(), key=lambda c: c['area'], reverse=True)
    count = sum(row_columns)
    main = sorted(pieces[:count], key=lambda c: c['sy']/c['area'])
    ordered = []
    at = 0
    for columns in row_columns:
        ordered.extend(sorted(main[at:at+columns], key=lambda c: c['sx']/c['area']))
        at += columns
    main = ordered
    centers, groups = {}, {i: [] for i in range(count)}
    for frame, component in enumerate(main):
        x, y = component['sx'] / component['area'], component['sy'] / component['area']
        assert frame not in centers, ('merged/ambiguous source poses', frame)
        centers[frame] = (x, y)
        groups[frame].append(component)
    assert len(centers) == count
    removed = 0
    for component in pieces[count:]:
        if component['area'] < 4:
            removed += component['area']
            continue
        x, y = component['sx'] / component['area'], component['sy'] / component['area']
        frame = min(centers, key=lambda f: (centers[f][0] - x)**2 + (centers[f][1] - y)**2)
        groups[frame].append(component)
    cells, bounds = [], []
    for frame in range(count):
        pieces = groups[frame]
        box = [min(c['box'][0] for c in pieces), min(c['box'][1] for c in pieces),
               max(c['box'][2] for c in pieces), max(c['box'][3] for c in pieces)]
        canvas = np.zeros((box[3] - box[1], box[2] - box[0], 4), dtype=np.uint8)
        for component in pieces:
            for y, left, right in component['runs']:
                canvas[y - box[1], left - box[0]:right - box[0]] = rgba[y, left:right]
        cells.append(Image.fromarray(canvas))
        bounds.append(box)
    return cells, bounds, removed

root = Path(__file__).resolve().parents[1]
inventory = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8-sig'))
mapping = json.loads(Path(sys.argv[2]).read_text(encoding='utf-8-sig'))
incoming = root/'assets/incoming/talent_icons'
runtime = root/'assets/art/talents'
(incoming/'raw').mkdir(parents=True,exist_ok=True)
runtime.mkdir(parents=True,exist_ok=True)
report = {}
review = Image.new('RGB',(6*160,42*160),(31,25,43))
draw = ImageDraw.Draw(review)
review_row=0
for hero in inventory:
    name,nodes=hero['hero'],hero['nodes']
    if name not in mapping: continue
    image = Image.open(mapping[name]).convert('RGBA')
    assert image.getchannel('A').getextrema()==(0,255),(name,'true transparency required')
    raw = incoming/'raw'/f'{name}_generated.png'
    if Path(mapping[name]).resolve() != raw.resolve():
        shutil.copyfile(mapping[name],raw)
    rows=[6]*(len(nodes)//6)+([len(nodes)%6] if len(nodes)%6 else [])
    cells,bounds,removed=extract_poses(image,rows)
    sheet = Image.new('RGBA',(768,896))
    records=[]
    for i,(node,cell) in enumerate(zip(nodes,cells)):
        scale=min(112/cell.width,112/cell.height)
        size=(max(1,round(cell.width*scale)),max(1,round(cell.height*scale)))
        cell=cell.resize(size,Image.Resampling.LANCZOS)
        tile=Image.new('RGBA',(128,128));tile.alpha_composite(cell,((128-size[0])//2,(128-size[1])//2))
        sheet.alpha_composite(tile,((i%6)*128,(i//6)*128))
        x,y=(i%6)*160,(review_row+i//6)*160
        review.paste(tile,(x+16,y+10),tile)
        draw.text((x+6,y+139),name+' / '+node['name'][:20],fill=(245,235,255))
        records.append(dict(node,frame=i,sourceBounds=bounds[i],packedBounds=tile.getbbox()))
    sheet.save(incoming/f'{name}_talents.png')
    sheet.save(runtime/f'{name}_talents.webp',lossless=True,method=6)
    report[name]={'originalSize':image.size,'sheetSize':sheet.size,'frameSize':128,'columns':6,'rows':7,'removedTinyAlphaPixels':removed,'nodes':records}
    review_row+=len(rows)
(incoming/'PACKING.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
review=review.crop((0,0,960,review_row*160))
review.save(incoming/'talent-contact.png')
outputs=root.parents[1]/'outputs';outputs.mkdir(exist_ok=True)
review.save(outputs/'talent-icons-preview.png')
print('Packed',sum(len(x['nodes']) for x in report.values()),'distinct Talent icons in',len(report),'hero atlases')
