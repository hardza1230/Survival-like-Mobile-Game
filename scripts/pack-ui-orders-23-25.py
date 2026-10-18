"""Pack art orders 23 (level-up cards), 24 (pause) and 25 (hub motion) into runtime WebP.
UI pieces were drawn at 2x on-screen -> 50% (cells <=160px stay full size for sharp icons).
VFX on black -> luminance alpha (lum x1.35, unpremultiplied).
Hub layers share a 1080x1920 canvas -> scaled to the old hub background width (941); soft glow layers at half of that.
Writes MANIFEST.json per folder with scaled cells / nineSlice and (hub) canvas rect + origin in 1080 space."""
import json, os
from PIL import Image
JOBS=[('levelup_cards_ui','levelup'),('pause_ui','pause'),('hub_motion','hub_motion')]
HUB=941/1080
SOFT={'hub_sky_glow','hub_window_lights','hub_cloud_sheet'}
HALF_VFX={'vfx_hub_logo_shine','vfx_hub_play_shimmer','vfx_hub_wand_sparkle'}   # soft light sheets: half size keeps boot GPU under budget
def lum_alpha(im):
    px=im.load()
    for y in range(im.height):
        for x in range(im.width):
            r,g,b,a=px[x,y]; mx=max(r,g,b); al=min(255,int(mx*1.35))
            if al<8: px[x,y]=(0,0,0,0); continue
            q=255/max(al,1); px[x,y]=(min(255,int(r*q)),min(255,int(g*q)),min(255,int(b*q)),al)
for src,dst in JOBS:
    S=f'assets/incoming/{src}'; D=f'assets/art/{dst}'; os.makedirs(D,exist_ok=True)
    out=[]
    for e in json.load(open(f'{S}/MANIFEST.json')):
        k=e['key']; im=Image.open(f'{S}/{k}.png').convert('RGBA')
        fw,fh,cols,rows=e['frameWidth'],e['frameHeight'],e['columns'],e['rows']
        vfx=e.get('background')=='#000000'
        if dst=='hub_motion': s=.5 if k in HALF_VFX else (HUB*(.5 if k in SOFT else 1) if not (vfx or k.endswith('_anim')) else 1)
        elif vfx or max(fw,fh)<=160: s=1
        else: s=.5
        if vfx: lum_alpha(im)
        cw,ch=max(1,round(fw*s)),max(1,round(fh*s))
        out_im=Image.new('RGBA',(cw*cols,ch*rows),(0,0,0,0))
        for r in range(rows):
            for c in range(cols):
                cell=im.crop((c*fw,r*fh,(c+1)*fw,(r+1)*fh))
                out_im.paste(cell if s==1 else cell.resize((cw,ch),Image.LANCZOS),(c*cw,r*ch))
        p=f'{D}/{k}.webp'
        if e.get('background')=='opaque': out_im.convert('RGB').save(p,'WEBP',quality=86,method=6)
        else: out_im.save(p,'WEBP',quality=90,alpha_quality=92,method=6)
        ns=[max(1,round(v*s)) for v in e['nineSlice']] if e.get('nineSlice') else None
        o={'key':k,'file':p,'cw':cw,'ch':ch,'cols':cols,'rows':rows,'frames':e.get('frameCount',cols*rows),'nineSlice':ns,'vfx':vfx,'loop':bool(e.get('loop')),'tintable':bool(e.get('tintable'))}
        if dst=='hub_motion':
            o.update({'x':e.get('canvasX',0),'y':e.get('canvasY',0),'w':fw,'h':fh,'z':e.get('z',0)})
            if e.get('pivotX') is not None: o.update({'ox':round(e['pivotX']/fw,4),'oy':round(e['pivotY']/fh,4)})
            if e.get('anchorX') is not None: o.update({'ax':e['anchorX'],'ay':e['anchorY']})
        out.append(o); print(dst,k,cw*cols,ch*rows,'cell',cw,ch,ns,os.path.getsize(p)//1024,'KB')
    json.dump(out,open(f'{D}/MANIFEST.json','w'),indent=1)
