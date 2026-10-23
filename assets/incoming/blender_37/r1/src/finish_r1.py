"""Mechanical PNG export, offline proofs and measurable QA for Blender Art37 R1."""
from pathlib import Path
import sys,json,hashlib,os,io,zlib,struct
import numpy as np
from PIL import Image,ImageDraw,ImageFont
OUT=Path(sys.argv[1]).resolve(); RAW=OUT/'raw'
def write_bytes(p,data):
    tmp=p.with_suffix(p.suffix+'.tmp')
    with open(tmp,'wb') as f:f.write(data);f.flush();os.fsync(f.fileno())
    os.replace(tmp,p)
    assert p.read_bytes()==data
def png(im,p):
    b=io.BytesIO();im.save(b,format='PNG',optimize=True);write_bytes(p,b.getvalue())
def js(p,data):write_bytes(p,(json.dumps(data,indent=2,ensure_ascii=False)+'\n').encode())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def png_crc(p):
    b=p.read_bytes();assert b[:8]==b'\x89PNG\r\n\x1a\n';k=8
    while k<len(b):
        n=struct.unpack('>I',b[k:k+4])[0];tag=b[k+4:k+8];data=b[k+8:k+8+n]
        assert zlib.crc32(tag+data)&0xffffffff==struct.unpack('>I',b[k+8+n:k+12+n])[0]
        k+=n+12
        if tag==b'IEND':break
    assert k==len(b)
    with Image.open(p) as im:im.verify()
def resized(im,wh):
    # Pillow premultiplied RGBa filtering prevents bright/dark fringe contamination.
    return im.convert('RGBa').resize(wh,Image.Resampling.LANCZOS).convert('RGBA')
floor=Image.open(RAW/'floor_c11.png').convert('RGB').resize((1024,1024),Image.Resampling.LANCZOS)
a=np.array(floor);raw=a.copy()
# Pixel-center samples differ by one pixel even for a mathematically periodic render.
# A single-pixel averaged guard makes the requested opposite-edge equality exact.
v=np.rint((a[:,0].astype(float)+a[:,-1])/2).astype('uint8');a[:,0]=v;a[:,-1]=v
v=np.rint((a[0].astype(float)+a[-1])/2).astype('uint8');a[0]=v;a[-1]=v
edge_delta=int(abs(a.astype(int)-raw.astype(int)).max())
floor=Image.fromarray(a);png(floor,OUT/'floor_c11.png')
keys=['dirt_mound','acid_crystal','seed_shell','crumb','ant_hole','leaf_bit','acid_puddle','pebble']
assets=[];checks={}
common={'sunDir':'top-left 60deg','sun':{'elevationDeg':60,'azimuthDeg':-135,'energy':2.1,'angularDiameterDeg':24},'renderEngine':'eevee','blenderVersion':'5.2.3 LTS','colorManagement':'Standard','stylePreset':'src/style_preset.blend'}
def entry(key,part,size,blend):
    p=OUT/(key+'.png')
    return dict(key=key,file=p.name,part=part,stage=0,width=size,height=size,alpha=part=='B',seamless=part=='A',camera={'type':'ortho','elevationDeg':90 if part=='A' else 55,'orthoScale':10 if part=='A' else 5.15},blend=blend,sha256=sha(p),bytes=p.stat().st_size,**common)
assets.append(entry('floor_c11','A',1024,'src/c11_floor.blend'))
for k in keys:
    key='dec_c11_'+k;im=resized(Image.open(RAW/(key+'.png')),(256,256));p=OUT/(key+'.png');png(im,p)
    arr=np.array(im);al=arr[:,:,3];bb=Image.fromarray(al).getbbox();solid=Image.fromarray((al>32).astype('uint8')*255).getbbox()
    margin=min(bb[0],bb[1],256-bb[2],256-bb[3]);height=solid[3]-solid[1]
    assert margin>=16,(key,bb,margin)
    assert height<=154,(key,height)
    assert al.min()==0 and al.max()==255
    # White halo check: no near-white pixels in any partially transparent edge.
    edge=(al>0)&(al<255);white=np.all(arr[:,:,:3]>235,axis=2)&edge
    assert white.sum()==0
    checks[key]={'mode':im.mode,'alphaMin':int(al.min()),'alphaMax':int(al.max()),'transparentPixels':int((al==0).sum()),'partialAlphaPixels':int(edge.sum()),'alphaBBox':bb,'marginPx':margin,'objectHeightAlphaOver32Px':height,'objectHeightFraction':round(height/256,4),'nearWhiteFringePixels':int(white.sum())}
    assets.append(entry(key,'B',256,'src/c11_'+k+'.blend'))
# Proofs are offline compositions, not gameplay screenshots.
tile3=Image.new('RGB',(3072,3072))
for y in range(3):
    for x in range(3):tile3.paste(floor,(x*1024,y*1024))
png(tile3.resize((1024,1024),Image.Resampling.LANCZOS),OUT/'_preview_floor_c11_3x3.png')
def tiled(w,h):
    t=floor.resize((819,819),Image.Resampling.LANCZOS);im=Image.new('RGBA',(w,h))
    for y in range(-120,h,819):
        for x in range(-220,w,819):im.paste(t,(x,y))
    return im
mobile=tiled(360,780);d=ImageDraw.Draw(mobile);d.ellipse((150,360,209,419),fill='#ff6eb4')
png(mobile.convert('RGB'),OUT/'_preview_floor_c11_ingame.png')
sheet=tiled(640,300)
for i,k in enumerate(keys):
    im=resized(Image.open(OUT/('dec_c11_'+k+'.png')),(60,60));sheet.alpha_composite(im,(50+(i%4)*160,45+(i//4)*140))
png(sheet.convert('RGB'),OUT/'_sheet_c11.png')
try:font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',20);small=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',16)
except OSError:font=ImageFont.load_default();small=font
review=Image.new('RGB',(1120,800),'#ede6da');d=ImageDraw.Draw(review)
d.text((32,20),'SOUR ANT NEST  /  R1 STYLE PROOF',fill='#493c2a',font=font)
d.text((32,53),'Blender  /  55 degree orthographic  /  shared upper-left light  /  3.25px outline',fill='#6d5a40',font=small)
for i,k in enumerate(keys):
    x=16+(i%4)*280;y=92+(i//4)*330
    bg=Image.new('RGBA',(256,256),'#584a36' if i%2==0 else '#f4f0e7')
    bg.alpha_composite(Image.open(OUT/('dec_c11_'+k+'.png')))
    review.paste(bg.convert('RGB'),(x,y));d.text((x+5,y+262),k.replace('_',' '),fill='#493c2a',font=font)
png(review,OUT/'_review_c11.png')
# Light/dark edge checks at both native and in-game 60px canvas size.
edges=Image.new('RGB',(1024,320),'#eee8dc')
for i,k in enumerate(keys):
    for j,color in enumerate(('#27221e','#f7f2e9')):
        bg=Image.new('RGBA',(128,128),color);im=resized(Image.open(OUT/('dec_c11_'+k+'.png')),(128,128));bg.alpha_composite(im);edges.paste(bg.convert('RGB'),(i*128,j*160))
png(edges,OUT/'_alpha_edges_c11.png')
js(OUT/'MANIFEST.json',assets)
lum=(a[:,:,0]*.2126+a[:,:,1]*.7152+a[:,:,2]*.0722)/255
assert .25<=lum.mean()<=.4,float(lum.mean())
assert np.array_equal(a[:,0],a[:,-1]) and np.array_equal(a[0],a[-1])
for p in OUT.glob('*.png'):png_crc(p)
payload=[]
for p in sorted(OUT.rglob('*')):
    if p.is_file() and 'raw' not in p.parts and not p.name.endswith(('.blend1','.tmp')) and p.name not in ('QA_REPORT.json','UPLOAD_VERIFICATION.json'):
        payload.append({'file':p.relative_to(OUT).as_posix(),'sha256':sha(p),'bytes':p.stat().st_size})
qa={'round':'R1','scope':'floor_c11 + eight dec_c11 assets only; owner approval required before R2','status':'technical_pass_owner_visual_review_pending','assetCount':9,'pngStreamCrc':'all delivered PNG chunks and IEND verified','floor':{'dimensions':[1024,1024],'mode':'RGB','meanSrgbRec709LumaPercent':round(float(lum.mean())*100,4),'meanRgbPercent':round(float(a.mean())/255*100,4),'contrastSrgbLumaStdPercent':round(float(lum.std())*100,4),'leftRightPixelExact':True,'topBottomPixelExact':True,'seamMaxChannelDifference':0,'exportEdgeGuardMaxChange8bit':edge_delta,'export':'Blender 2048 render -> Lanczos 1024; opposing edge pixel-center samples averaged, one-pixel guard only','periodicConstruction':'10-unit integer-harmonic terrain/color field; shared geometry copies in 3x3 grid'},'decor':checks,'sharedStyle':dict(outlinePxAt256=3.25,decorCameraElevationDeg=55,floorCameraElevationDeg=90,**common),'visualReview':{'status':'pending author inspection of offline proofs, then owner acceptance','proofs':['_preview_floor_c11_3x3.png','_preview_floor_c11_ingame.png','_sheet_c11.png','_review_c11.png','_alpha_edges_c11.png'],'ingameProof':'offline 360x780; 1024 floor at 0.8 (819px), bright 60px proxy circle','sheet':'eight sprites on own floor, each canvas 60px; no game launched'},'source':{'allGeometryNativeBlender':True,'externalTextures':False,'texturesPacked':'pack_all called; no external textures to pack','rebuild':'blender --background --python src/build_r1.py -- OUTPUT_DIR; then python src/finish_r1.py OUTPUT_DIR'},'upload':{'status':'pending','hashesBelow':'payload files excluding QA_REPORT and later upload-proof metadata; self hashes cannot be embedded in the same file'},'files':payload}
js(OUT/'QA_REPORT.json',qa)
print(json.dumps({'assets':len(assets),'floorLuma':qa['floor'],'checks':checks,'payloadFiles':len(payload)},indent=2))
