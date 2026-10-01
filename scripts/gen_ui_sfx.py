"""Deterministic short candy UI sounds. Run with Python standard library only."""
import math, random, struct, wave
from pathlib import Path
RATE=44100
OUT=Path(__file__).resolve().parents[1]/'assets/audio/sfx/ui'
SPECS={'click':(.075,[(0,1050,.05,.45)]),'back':(.12,[(0,880,.09,.38),(.035,620,.075,.25)]),'confirm':(.17,[(0,880,.07,.36),(.045,1320,.09,.38)]),'error':(.15,[(0,260,.08,.42),(.065,195,.07,.32)])}
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
   if name=='click' and t<.012:v+=rng.uniform(-1,1)*.035*(1-t/.012)**2
   samples.append(max(-.9,min(.9,v)))
  with wave.open(str(OUT/('ui_'+name+'.wav')),'wb') as w:
   w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes(b''.join(struct.pack('<h',round(v*32767)) for v in samples))
if __name__=='__main__':generate()
