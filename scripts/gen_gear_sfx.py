"""Deterministic short candy equipment sounds. Run with Python standard library only."""
import math, random, struct, wave
from pathlib import Path
RATE=44100
OUT=Path(__file__).resolve().parents[1]/'assets/audio/sfx/gear'
SPECS={
 'equip':(.14,[(0,660,.08,.30),(.055,990,.08,.30)]),
 'lock':(.12,[(0,440,.065,.30),(.045,330,.07,.28)]),
 'unlock':(.15,[(0,330,.08,.28),(.065,660,.08,.30)]),
 'enhance_success':(.29,[(0,659,.12,.30),(.075,988,.12,.30),(.15,1319,.14,.32)]),
 'enhance_break':(.20,[(0,392,.10,.32),(.085,294,.11,.28)]),
 'enhance_destroy':(.32,[(0,220,.14,.32),(.085,147,.14,.30),(.18,98,.14,.28)]),
 'dismantle':(.19,[(0,880,.08,.28),(.055,587,.08,.28),(.11,392,.08,.30)]),
 'sell':(.20,[(0,1047,.10,.28),(.085,1319,.11,.30)])}

def generate():
 OUT.mkdir(parents=True,exist_ok=True)
 for name,(duration,notes) in SPECS.items():
  rng=random.Random(17);samples=[]
  for i in range(round(duration*RATE)):
   t=i/RATE;v=0
   for delay,freq,length,gain in notes:
    u=t-delay
    if 0<=u<length:
     env=min(1,u/.003)*(1-u/length)**2
     v+=gain*env*(math.sin(2*math.pi*freq*u)+.18*math.sin(2*math.pi*freq*2.01*u))
   if name=='tick' and t<.012:v+=rng.uniform(-1,1)*.035*(1-t/.012)**2
   samples.append(max(-.9,min(.9,v)))
  with wave.open(str(OUT/('gear_'+name+'.wav')),'wb') as w:
   w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes(b''.join(struct.pack('<h',round(v*32767)) for v in samples))
if __name__=='__main__':generate()
