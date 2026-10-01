"""Deterministic short candy progression sounds. Run with Python standard library only."""
import math, random, struct, wave
from pathlib import Path
RATE=44100
OUT=Path(__file__).resolve().parents[1]/'assets/audio/sfx/progress'
SPECS={
 'core':(.18,[(0,740,.09,.30),(.065,1110,.11,.30)]),
 'talent':(.19,[(0,880,.10,.28),(.075,1175,.11,.30)]),
 'overcap':(.30,[(0,659,.12,.30),(.075,988,.12,.30),(.15,1480,.15,.32)]),
 'promotion':(.40,[(0,523,.14,.30),(.08,659,.14,.30),(.16,784,.14,.30),(.24,1047,.16,.32)]),
 'perk':(.18,[(0,587,.09,.30),(.07,880,.11,.28)]),
 'ancient':(.38,[(0,494,.12,.28),(.075,740,.13,.28),(.15,988,.13,.30),(.225,1480,.15,.30)]),
 'daily':(.26,[(0,784,.11,.28),(.065,1047,.12,.28),(.13,1319,.13,.30)]),
 'achievement':(.34,[(0,659,.12,.28),(.065,831,.12,.28),(.13,988,.12,.30),(.195,1319,.14,.30)]),
 'quest':(.25,[(0,740,.10,.28),(.065,988,.11,.28),(.13,1175,.12,.30)]),
 'claim':(.18,[(0,988,.10,.28),(.065,1319,.11,.30)])}

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
  with wave.open(str(OUT/('progress_'+name+'.wav')),'wb') as w:
   w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes(b''.join(struct.pack('<h',round(v*32767)) for v in samples))
if __name__=='__main__':generate()
