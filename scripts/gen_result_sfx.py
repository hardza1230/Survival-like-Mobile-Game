"""Deterministic short candy results sounds. Run with Python standard library only."""
import math, random, struct, wave
from pathlib import Path
RATE=44100
OUT=Path(__file__).resolve().parents[1]/'assets/audio/sfx/results'
SPECS={
 'open':(.25,[(0,659,.13,.28),(.10,988,.15,.30)]),
 'count':(.035,[(0,1175,.03,.24)]),
 'reveal':(.13,[(0,1047,.07,.26),(.045,1319,.08,.28)]),
 'important':(.38,[(0,784,.12,.28),(.075,988,.13,.28),(.15,1175,.13,.30),(.225,1568,.15,.30)]),
 'double':(.29,[(0,988,.12,.28),(.075,1319,.13,.28),(.15,1568,.14,.30)])}

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
  with wave.open(str(OUT/('result_'+name+'.wav')),'wb') as w:
   w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes(b''.join(struct.pack('<h',round(v*32767)) for v in samples))
if __name__=='__main__':generate()
