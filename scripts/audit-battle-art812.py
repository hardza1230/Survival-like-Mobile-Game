"""Read-only asset inspection and mechanical source contact sheets; never a gameplay capture."""
from pathlib import Path
from PIL import Image,ImageDraw
import json,hashlib,re,subprocess
ROOT=Path(__file__).resolve().parents[1]
registry_script=r"""const fs=require('node:fs'),vm=require('node:vm'),s=fs.readFileSync('game.js','utf8'),o={};for(const n of ['ASSET_IMAGES','ASSET_SHEETS','ASSET_FX']){const a=s.indexOf('const '+n+' = {'),b=s.indexOf('\n};',a);o[n]=vm.runInNewContext(s.slice(a,b+3)+';'+n);}o.bossTextures=vm.runInNewContext(s.match(/^const BOSS_MOTION_TEX=.*$/m)[0]+';BOSS_MOTION_TEX');process.stdout.write(JSON.stringify(o));"""
R=json.loads(subprocess.check_output(['node','-e',registry_script],cwd=ROOT))
OUT=ROOT/'docs/design/battle_art_audit812';OUT.mkdir(parents=True,exist_ok=True)
rows=[]
def inspect(key,spec,kind):
 path=ROOT/(spec if isinstance(spec,str) else spec['url']);im=Image.open(path).convert('RGBA');im.load();fw=spec.get('frame',spec.get('fw',im.width)) if isinstance(spec,dict) else im.width;fh=spec.get('fh',fw) if isinstance(spec,dict) else im.height
 n=(im.width//fw)*(im.height//fh);boxes=[];hashes=[]
 for i in range(n):
  x=i%(im.width//fw)*fw;y=i//(im.width//fw)*fh;tile=im.crop((x,y,x+fw,y+fh));boxes.append(tile.getchannel('A').point(lambda a:255 if a>20 else 0).getbbox());hashes.append(hashlib.sha256(tile.tobytes()).hexdigest())
 return {'key':key,'kind':kind,'path':path.relative_to(ROOT).as_posix(),'width':im.width,'height':im.height,'frameWidth':fw,'frameHeight':fh,'cells':n,'distinctCellPixels':len(set(hashes)),'emptyCells':sum(b is None for b in boxes),'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'alpha':im.getchannel('A').getextrema(),'registeredAnim':spec.get('anim') if isinstance(spec,dict) else None},im
body=[];fx=[];shots=[];minor=[]
for idx,k in enumerate(R['bossTextures']):
 row,im=inspect(k,R['ASSET_SHEETS'][k],'boss-body');row['boss']=idx+1;rows.append(row);body.append((row,im))
for k,spec in R['ASSET_SHEETS'].items():
 if re.match(r'^c3_mini[1-5]$',k):row,im=inspect(k,spec,'mini-body');rows.append(row);minor.append((row,im))
for k,spec in R['ASSET_FX'].items():
 if re.match(r'^vfx_(b\d\d_|bpin_|body_)',k):row,im=inspect(k,spec,'boss-vfx');rows.append(row);fx.append((row,im))
for k,spec in R['ASSET_IMAGES'].items():
 if re.match(r'^bshot_(\d\d|pin)$',k):row,im=inspect(k,spec,'boss-shot');rows.append(row);shots.append((row,im))
def preview(items,name,cols=5,cw=220,ch=244):
 out=Image.new('RGBA',(cols*cw,((len(items)+cols-1)//cols)*ch),'#261e30');d=ImageDraw.Draw(out)
 for i,(r,im) in enumerate(items):
  x=i%cols*cw;y=i//cols*ch;fw=r['frameWidth'];fh=r['frameHeight'];f=min(2,r['cells']-1);sx=f%(im.width//fw)*fw;sy=f//(im.width//fw)*fh;t=im.crop((sx,sy,sx+fw,sy+fh));t.thumbnail((cw-20,ch-55),Image.Resampling.LANCZOS);out.alpha_composite(t,(x+(cw-t.width)//2,y+30+(ch-60-t.height)//2));d.text((x+7,y+4),r['key'],fill='#fff0cd');d.text((x+7,y+ch-18),f"{r['cells']} cells | {r['frameWidth']}px/frame",fill='#c7bfce')
 out.convert('RGB').save(OUT/name)
preview(body,'boss_bodies.png');preview(minor,'chapter3_minis.png');preview(shots,'boss_shots.png',4,210,220)
for chapter,lo,hi in [('ch1',1,5),('ch2',6,10),('ch3',11,15)]:
 items=[(r,i) for r,i in fx if (m:=re.match(r'vfx_b(\d\d)_',r['key'])) and lo<=int(m.group(1))<=hi];preview(items,chapter+'_effects.png',5,200,218)
preview([(r,i) for r,i in fx if r['key'].startswith('vfx_body_')],'shared_body_fx.png',4,220,220)
report={'scope':'15 main bosses,5 Chapter3 minibosses,registered boss VFX and16 painted shots','method':'actual registered raster decode/dimensions/alpha/cell uniqueness and source contact sheets; no combat, no visual/FPS claim','counts':{'bodies':len(body),'chapter3Minis':len(minor),'bossVfx':len(fx),'shots':len(shots),'emptyCells':sum(r['emptyCells']for r in rows)},'assets':rows}
(OUT/'INVENTORY.json').write_bytes((json.dumps(report,indent=2)+'\n').encode());print(json.dumps({'counts':report['counts'],'bodies':[{k:r[k]for k in ['boss','key','cells','distinctCellPixels','emptyCells']}for r,_ in body]}))
