from pathlib import Path
import json,hashlib
r=Path('assets/incoming/story_motion');s=r/'_sources'
prompts={}
old=json.loads((s/'PROMPTS.json').read_text(encoding='utf-8-sig'))
for j in old['jobs']:prompts[j['source']]=j
for p in s.glob('*.json'):
 if p.name in ('CONFIG.json','PROMPTS.json'):continue
 d=json.loads(p.read_text(encoding='utf-8-sig'))
 if 'prompt' in d:prompts[p.stem+'.png']=dict(d,source=p.stem+'.png')
for source,d in prompts.items():
 p=s/source
 if p.exists():d['sha256']=hashlib.sha256(p.read_bytes()).hexdigest();d['bytes']=p.stat().st_size
allprompts=dict(tool='built-in ImageGen',method='Original generated donor PNGs retained. Final assets are mechanical crops, padding, uniform scaling and strip packing; no artwork synthesized by scripts.',jobs=list(prompts.values()))
(r/'PROMPTS.json').write_text(json.dumps(allprompts,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
index=[]
for p in sorted(r.glob('*/MANIFEST.json')):
 if p.parent.name=='_sources':continue
 d=json.loads(p.read_text());src={a['source'].split('/')[-1] for a in d['assets']}
 (p.parent/'PROMPTS.json').write_text(json.dumps(dict(tool='built-in ImageGen',jobs=[prompts[x] for x in sorted(src)]),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 index.append(dict(folder=p.parent.name,manifest=p.relative_to(r).as_posix(),assets=len(d['assets'])))
(r/'ASSET_INDEX.json').write_text(json.dumps(dict(art_order=45,source_only=True,canvas=[1080,1920],background_overscan=[1242,1920],folders=index,total_assets=sum(a['assets'] for a in index),reused_assets=[dict(key='ruby_talk_proud',file='assets/art/mascot/ruby_talk_proud.webp')],canon='docs/STORY_CANON.md draft2 + section7'),indent=2)+'\n')
print(len(prompts),'retained imagegen prompts',sum(a['assets'] for a in index),'assets')
