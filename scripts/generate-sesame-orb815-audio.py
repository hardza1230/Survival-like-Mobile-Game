"""Generate three sharply differentiated original ElevenLabs rune taps with retained donor provenance."""
from pathlib import Path
import importlib.util,json
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('orb_sound_pipeline',ROOT/'scripts/generate-sesame-invoker-audio.py')
pipeline=importlib.util.module_from_spec(spec);spec.loader.exec_module(pipeline)
pipeline.OUT=ROOT/'assets/incoming/sesame_orb815_audio'
pipeline.RUN=ROOT/'assets/audio/sfx/sesame_orb815'
pipeline.JOBS=[
 ('tap_p',.16,'ONE firm low-mid wooden drum TOK with a crunchy fiery snap. Dry percussive attack, warm 300 to 700 Hz body, not a bell, no airy wash. Must be recognizable on phone speakers. Finish in 150 milliseconds.'),
 ('tap_m',.18,'ONE clean bright high metallic TING from a tiny triangle. Immediate high pitched attack around 1500 to 2500 Hz and short sharply damped ring. Not a low thump or a water drop. Finish in 170 milliseconds.'),
 ('tap_b',.20,'ONE rounded watery PLOOP with an obvious downward pitch bend, liquid bubble body around 600 to 1000 Hz. Immediate onset, not a bell and not a wooden knock. Clear on phone speakers. Finish in 190 milliseconds.')]
if __name__=='__main__':
 pipeline.main()
 for path in [pipeline.OUT/'PROMPTS.json',pipeline.OUT/'MANIFEST.json',pipeline.RUN/'MANIFEST.json',pipeline.OUT/'QA_REPORT.json']:
  data=json.loads(path.read_text());rows=data.get('assets',data.get('generations',data.get('files',[])))
  for row in rows:
   row['key']=row['key'].replace('sfx_ses811_','sfx_ses815_')
   if 'path' in row:row['path']=row['path'].replace('sesame_invoker811/','sesame_orb815/')
  pipeline.js(path,data)
 # Mechanical preview assembly only; sound content is the original ElevenLabs generations.
 import numpy as np
 manifest=json.loads((pipeline.RUN/'MANIFEST.json').read_text())
 qa=json.loads((pipeline.OUT/'QA_REPORT.json').read_text())
 for row,quality in zip(manifest['assets'],qa['files']):
  path=ROOT/row['path'];sound=pipeline.decode(path)
  rms=max(1e-8,float(np.sqrt(np.mean(sound*sound))));peak=max(1e-8,float(np.max(np.abs(sound))))
  sound*=min(.07/rms,.65/peak)
  packed=pipeline.ff(['-v','error','-f','f32le','-ar','44100','-ac','1','-i','pipe:0','-c:a','libmp3lame','-b:a','128k','-write_xing','0','-f','mp3','pipe:1'],sound.astype('<f4').tobytes())
  pipeline.save(path,packed);sound=pipeline.decode(path)
  row.update(bytes=len(packed),sha256=pipeline.sha(path),duration=len(sound)/44100)
  quality.update(peak=float(np.max(np.abs(sound))),rms=float(np.sqrt(np.mean(sound*sound))),dc=float(np.mean(sound)))
  assert quality['peak']<.85
 qa['processing']+=' Additional level matching targets RMS0.07 with pre-encode peak cap0.65.'
 pipeline.js(pipeline.RUN/'MANIFEST.json',manifest);pipeline.js(pipeline.OUT/'MANIFEST.json',manifest);pipeline.js(pipeline.OUT/'QA_REPORT.json',qa)
 samples=[]
 for name,_,_ in pipeline.JOBS:
  samples.extend([pipeline.decode(pipeline.RUN/('ses811_'+name+'.mp3')),np.zeros(round(.3*44100),dtype='<f4')])
 data=pipeline.ff(['-v','error','-f','f32le','-ar','44100','-ac','1','-i','pipe:0','-c:a','libmp3lame','-b:a','128k','-f','mp3','pipe:1'],np.concatenate(samples).astype('<f4').tobytes())
 pipeline.save(pipeline.OUT/'audition.mp3',data)
 print('Three differentiated rune taps ready; semantic phone listening pending',flush=True)
