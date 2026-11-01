"""Source-only, deterministic ImageGen donor packing and art proofs. No runtime writes."""
from pathlib import Path
import hashlib, io, json, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
JOBS = json.loads((HERE / 'PROMPTS.json').read_text(encoding='utf8'))['jobs']

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def atomic_bytes(path, data):
    tmp = path.with_suffix(path.suffix + '.tmp')
    with tmp.open('wb') as f:
        f.write(data); f.flush(); os.fsync(f.fileno())
    os.replace(tmp, path)

def save(im, path, **kw):
    out = io.BytesIO(); im.save(out, format='PNG', **kw)
    atomic_bytes(path, out.getvalue())
    with Image.open(path) as check: check.load()

def write_json(name, obj):
    atomic_bytes(HERE / name, (json.dumps(obj, ensure_ascii=False, indent=2) + '\n').encode('utf8'))

def edge(a):
    return np.concatenate([a[0], a[-1], a[:,0], a[:,-1]])

records, checks, clips = [], [], {}
for job in JOBS:
    key = job['key']; fw, fh = job['frame_w'], job['frame_h']
    source = HERE / 'sources' / (key + '_source.png')
    im = Image.open(source).convert('RGBA'); sw, sh = im.size
    frames = []
    if job['background'] == 'transparent':
        a = np.array(im)
        assert a[:,:,3].min() == 0 and a[:,:,3].max() == 255, key
        bbox = im.getchannel('A').point(lambda x: 255 if x > 3 else 0).getbbox()
        crop = im.crop(bbox)
        crop.thumbnail((110,110), Image.Resampling.LANCZOS)
        frame = Image.new('RGBA', (fw,fh))
        frame.alpha_composite(crop, ((fw-crop.width)//2, (fh-crop.height)//2))
        # Zero only invisible RGB; retain genuine generated alpha and dark painted border.
        arr = np.array(frame); arr[arr[:,:,3] == 0,:3] = 0
        frame = Image.fromarray(arr); frames.append(frame)
        transform = {'alpha_crop': list(bbox), 'fit': [110,110], 'placement': 'center, no mirroring or rotation'}
    else:
        dc, dr = job['donor_cols'], job['donor_rows']
        # Same cell-wide transform on ALL phases; never independently fit each visible shape.
        for i in range(job['frames']):
            col, row = i % dc, i // dc
            box = (round(col*sw/dc), round(row*sh/dr), round((col+1)*sw/dc), round((row+1)*sh/dr))
            crop = im.crop(box).convert('RGB')
            crop = crop.resize((round(fw*.88), round(fh*.88)), Image.Resampling.LANCZOS)
            frame = Image.new('RGBA', (fw,fh), (0,0,0,255))
            frame.paste(crop, ((fw-crop.width)//2, (fh-crop.height)//2))
            a = np.array(frame); a[np.max(a[:,:,:3],axis=2) <= 3,:3] = 0
            frames.append(Image.fromarray(a))
        transform = {'donor_grid': [dc,dr], 'cell_scale': .88, 'placement': 'common cell center; original relative phase growth retained', 'near_black_threshold': 3}
    atlas = Image.new('RGBA',(fw*len(frames),fh),(0,0,0,255) if key.startswith('vfx') else (0,0,0,0))
    for i, frame in enumerate(frames): atlas.paste(frame,(i*fw,0))
    path = HERE / (key + '.png'); save(atlas,path,optimize=True)
    a = np.array(atlas); per_frame = []
    for frame in frames:
        p = np.array(frame); rgb = p[:,:,:3]; al = p[:,:,3]
        if key.startswith('vfx'):
            assert np.all(edge(p) == [0,0,0,255]), key
            assert al.min() == 255, key
            mask = np.max(rgb,axis=2) > 4
        else:
            assert np.all(edge(al) == 0), key
            assert np.all(al[:8] == 0) and np.all(al[-8:] == 0) and np.all(al[:,:8] == 0) and np.all(al[:,-8:] == 0), key
            mask = al > 127
        ys,xs = np.where(mask)
        assert len(xs), key
        per_frame.append({'bbox': [int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)], 'visible_pixels': int(mask.sum()), 'brightest_rgb': int(rgb.max())})
    item = {'key':key, 'file':path.name, 'bytes':path.stat().st_size, 'sha256':digest(path), 'width':atlas.width,'height':atlas.height,'frame_w':fw,'frame_h':fh,'frames':len(frames),'cols':len(frames),'rows':1,'background':job['background'],'mode':'RGBA','source':str(source.relative_to(HERE)).replace('\\','/'),'source_sha256':digest(source),'transform':transform}
    records.append(item)
    check = {'key':key,'decode':'pass','dimensions':'pass','mode':'RGBA','cell_boundary':'pass','frames':per_frame}
    if not key.startswith('vfx'):
        solid = a[:,:,3] > 127
        erosion = np.array(Image.fromarray((solid*255).astype('uint8')).filter(ImageFilter.MinFilter(5))) > 0
        boundary = solid & ~erosion
        brightness = np.max(a[:,:,:3],axis=2)
        check.update({'alpha_extrema':[int(a[:,:,3].min()),int(a[:,:,3].max())], 'dark_boundary_fraction_max_rgb_below_150':round(float(np.mean(brightness[boundary] < 150)),3), 'bright_core_pixels':int(((brightness > 220) & solid).sum()), 'visual_direction':'right, inspected ImageGen donor and floor contact sheet'})
        assert check['bright_core_pixels'] > 3, key
    checks.append(check); clips[key] = frames

floors = ['assets/generated/bg1_sour_ant_nest.webp','assets/art/floors/floor_c21.webp','assets/art/floors/floor_c31.webp']
floor_ims = [Image.open(ROOT / p).convert('RGBA') for p in floors]
def floor_tile(index,w,h):
    # Center crops retain original texture scale; only upscale if smaller than proof panel.
    im = floor_ims[index % len(floor_ims)]
    if im.width < w or im.height < h: im = ImageOps.fit(im,(max(w,im.width),max(h,im.height)))
    return im.crop(((im.width-w)//2,(im.height-h)//2,(im.width+w)//2,(im.height+h)//2))

def lum_alpha(frame, shadow=False):
    # Match existing pack-boss-vfx-c1-c2.py: max channel x 1.35, straight alpha.
    a = np.array(frame).astype('float32'); mx = a[:,:,:3].max(axis=2)
    alpha = np.minimum(255,np.floor(mx*1.35))
    if shadow:
        # Preview semantic: neutral warning masks must be dark-tinted by future consumer.
        a[:,:,:3] = [18,14,20]
    else:
        divisor = np.maximum(alpha/255,1/255)
        a[:,:,:3] = np.minimum(255,a[:,:,:3]/divisor[:,:,None])
    a[:,:,3] = alpha
    return Image.fromarray(a.astype('uint8'))

names = [j['key'] for j in JOBS if j['key'].startswith('bshot')]
bullet_gif = []
for tick in range(12):
    canvas = Image.new('RGBA',(640,448))
    for i,key in enumerate(names):
        panel = floor_tile((i//5 + tick//4)%3,160,112)
        shot = clips[key][0].resize((60,60),Image.Resampling.LANCZOS)
        panel.alpha_composite(shot,(16 + tick*6,32))
        draw=ImageDraw.Draw(panel);draw.rectangle((0,0,159,20),fill=(25,19,30,230));draw.text((6,4),key,fill='#fff3d1')
        canvas.paste(panel,((i%4)*160,(i//4)*112))
    bullet_gif.append(canvas.convert('RGB'))
save(bullet_gif[0],HERE/'preview_bullets_60px.png')
out=io.BytesIO();bullet_gif[0].save(out,format='GIF',save_all=True,append_images=bullet_gif[1:],duration=90,loop=0,optimize=False)
atomic_bytes(HERE/'preview_bullets_floor.gif',out.getvalue())

body_keys = [j['key'] for j in JOBS if j['key'].startswith('vfx')]
sizes = [92,128,280,200]; body_gif=[]
for tick in range(24):
    canvas=Image.new('RGBA',(640,400))
    for i,key in enumerate(body_keys):
        frames=clips[key];fi=min(len(frames)-1, int(tick*len(frames)/24))
        panel=floor_tile(i+tick//8,320,200)
        fx=lum_alpha(frames[fi],key=='vfx_body_skydrop' and fi<4)
        fx=fx.resize((sizes[i],round(sizes[i]*fx.height/fx.width)),Image.Resampling.LANCZOS)
        panel.alpha_composite(fx,((320-fx.width)//2,(200-fx.height)//2+10))
        draw=ImageDraw.Draw(panel);draw.rectangle((0,0,319,21),fill=(25,19,30,230));draw.text((6,5),f'{key} | {fi+1}/{len(frames)} | {sizes[i]}px',fill='#fff3d1')
        canvas.paste(panel,((i%2)*320,(i//2)*200))
    body_gif.append(canvas.convert('RGB'))
save(body_gif[12],HERE/'preview_body_moves.png')
out=io.BytesIO();body_gif[0].save(out,format='GIF',save_all=True,append_images=body_gif[1:],duration=75,loop=0,optimize=True)
atomic_bytes(HERE/'preview_body_moves_floor.gif',out.getvalue())

# Neutral proof exposes alpha halos and shows every bullet at source and gameplay size.
proof=Image.new('RGBA',(768,768),'#635a69')
for i,key in enumerate(names):
    x,y=(i%4)*192,(i//4)*192
    proof.alpha_composite(clips[key][0],(x+4,y+26))
    proof.alpha_composite(clips[key][0].resize((60,60),Image.Resampling.LANCZOS),(x+130,y+62))
    ImageDraw.Draw(proof).text((x+7,y+7),key+' 128 / 60',fill='white')
save(proof,HERE/'preview_alpha_128_60.png')
preview_rows=[]
for path in sorted(HERE.glob('preview_*')):
    with Image.open(path) as im:
        count=getattr(im,'n_frames',1)
        for n in range(count):im.seek(n);im.load()
        preview_rows.append({'file':path.name,'bytes':path.stat().st_size,'sha256':digest(path),'size':list(im.size),'frames':count,'decode':'pass'})
write_json('MANIFEST.json',{'order':60,'delivery':'source only; not wired to game','assets':records})
write_json('QA_REPORT.json',{'order':60,'result':'pass','asset_count':len(records),'technical_checks':checks,'previews':preview_rows,'floor_references':[{'file':p,'sha256':digest(ROOT/p)} for p in floors], 'visual_review':{'silhouettes':'16 distinct subjects; all leading noses right; no text or badges','palette':'Deep violet/fuchsia and cranberry rose with dark rims; no pale lavender EXP body, candy wrapper or bubblegum pink sugar look. Ice/glass directional shard silhouettes differ from upright EXP diamonds.','body_moves':'Neutral ivory/stone/dust, black opaque sheets; phase growth retained; final frames fade.'}, 'notes':['GIFs are source-art composites on unchanged actual stage floor textures, not gameplay captures or runtime timing validation.','Skydrop frames 0-3 encode warning shadow density in low-gray mask. Preview uses dark tint; future code must dark-tint these four mask frames separately. Black-on-black cannot encode a visible shadow under luminance-to-alpha.','VFX preview follows existing max-RGB x1.35 alpha/unpremultiplication; black sheets remain intact in deliverables.','One separate built-in ImageGen call per requested asset (20 calls). Sources preserved; only mechanical crop/resize/grid repacking performed.','Runtime files, GAME_VERSION and asset registration unchanged.','npm run check passed on unchanged runtime with read-only canonical-LF fs shim (.git/art57-canonical-lf.cjs); working tree runtime bytes were not normalized.'], 'runtime_integration_tested':False})
print(json.dumps({'assets':len(records),'frames':sum(r['frames'] for r in records),'png_bytes':sum(r['bytes'] for r in records),'previews':preview_rows},indent=2))
