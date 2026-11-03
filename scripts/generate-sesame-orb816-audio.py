"""Original ElevenLabs fire/wind taps; preserve the approved blue cue byte-for-byte."""
from pathlib import Path
import importlib.util,json
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('orb_sound_pipeline',ROOT/'scripts/generate-sesame-invoker-audio.py')
pipeline=importlib.util.module_from_spec(spec);spec.loader.exec_module(pipeline)
pipeline.OUT=ROOT/'assets/incoming/sesame_orb816_audio'
pipeline.RUN=ROOT/'assets/audio/sfx/sesame_orb816'
pipeline.JOBS=[
 ('tap_p',.18,'One tiny FIRE ignition: FWOFF, flame flaring with a crackling ember tail. Immediate warm midrange fire texture, clear on phone speakers. No wood, drum, bell or chime. One compact gesture finishing in 170 milliseconds.'),
 ('tap_m',.20,'One tiny WIND spell: airy SHWISH of rushing air with a quick upward gust and smooth taper. Light and agile, clear on phone speakers. No crackle, percussion, metal, bell or chime. One gesture finishing in 190 milliseconds.')]
if __name__=='__main__':
 pipeline.main()
 for path in [pipeline.OUT/'PROMPTS.json',pipeline.OUT/'MANIFEST.json',pipeline.RUN/'MANIFEST.json',pipeline.OUT/'QA_REPORT.json']:
  data=json.loads(path.read_text());rows=data.get('assets',data.get('generations',data.get('files',[])))
  for row in rows:
   row['key']=row['key'].replace('sfx_ses811_','sfx_ses816_')
   if 'path' in row:row['path']=row['path'].replace('sesame_invoker811/','sesame_orb816/')
  pipeline.js(path,data)
 manifest=json.loads((pipeline.RUN/'MANIFEST.json').read_text());qa=json.loads((pipeline.OUT/'QA_REPORT.json').read_text())
 for row,quality in zip(manifest['assets'],qa['files']):
  path=ROOT/row['path'];sound=pipeline.decode(path)
  sound*=min(.07/max(1e-8,float(np.sqrt(np.mean(sound*sound)))),.65/max(1e-8,float(np.max(np.abs(sound)))))
  packed=pipeline.ff(['-v','error','-f','f32le','-ar','44100','-ac','1','-i','pipe:0','-c:a','libmp3lame','-b:a','128k','-write_xing','0','-f','mp3','pipe:1'],sound.astype('<f4').tobytes())
  pipeline.save(path,packed);sound=pipeline.decode(path)
  row.update(bytes=len(packed),sha256=pipeline.sha(path),duration=len(sound)/44100)
  quality.update(peak=float(np.max(np.abs(sound))),rms=float(np.sqrt(np.mean(sound*sound))),dc=float(np.mean(sound)))
  assert quality['peak']<.85 and abs(quality['dc'])<.02
 qa['processing']+=' Level matching targets RMS0.07 with pre-encode peak cap0.65.'
 blue=ROOT/'assets/audio/sfx/sesame_orb815/ses811_tap_b.mp3'
 assert pipeline.sha(blue)=='842376fa71dec652d0961ac4abedc25ca27e47369d5c08acf0138406e1a61f9a'
 qa['approvedBlueUnchanged']={'path':str(blue.relative_to(ROOT)).replace('\\','/'),'sha256':pipeline.sha(blue)}
 pipeline.js(pipeline.RUN/'MANIFEST.json',manifest);pipeline.js(pipeline.OUT/'MANIFEST.json',manifest);pipeline.js(pipeline.OUT/'QA_REPORT.json',qa)
 samples=[]
 for path in [ROOT/r['path'] for r in manifest['assets']]+[blue]:samples.extend([pipeline.decode(path),np.zeros(round(.3*44100),dtype='<f4')])
 preview=pipeline.ff(['-v','error','-f','f32le','-ar','44100','-ac','1','-i','pipe:0','-c:a','libmp3lame','-b:a','128k','-f','mp3','pipe:1'],np.concatenate(samples).astype('<f4').tobytes())
 pipeline.save(pipeline.OUT/'audition.mp3',preview)
 print('Original fire/wind taps packed; approved blue unchanged; phone listening pending',flush=True)
