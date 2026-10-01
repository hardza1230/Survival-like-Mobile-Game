"""Deterministic short candy forge sounds. Run with Python standard library only."""
import math, random, struct, wave
from pathlib import Path
RATE=44100
OUT=Path(__file__).resolve().parents[1]/'assets/audio/sfx/craft'
SPECS={
 'start':(.16,[(0,620,.10,.32),(.05,930,.10,.30)]),
 'tick':(.035,[(0,1250,.03,.30)]),
 'slow':(.13,[(0,780,.07,.30),(.05,620,.075,.28)]),
 'common':(.19,[(0,784,.10,.32),(.065,988,.12,.30)]),
 'rare':(.29,[(0,784,.12,.30),(.065,988,.13,.30),(.13,1175,.15,.32)]),
 'jackpot':(.38,[(0,784,.12,.30),(.065,988,.13,.30),(.13,1175,.14,.32),(.195,1568,.18,.34)]),
 'near':(.23,[(0,880,.09,.28),(.065,1047,.09,.28),(.13,880,.09,.25)]),
 'cancel':(.15,[(0,660,.075,.28),(.06,440,.085,.25)]),
 'capacity':(.25,[(0,523,.11,.30),(.065,784,.12,.30),(.13,1047,.12,.32)]),
 'reroll':(.21,[(0,988,.075,.28),(.055,740,.075,.28),(.11,1175,.10,.30)]),
 'remove':(.16,[(0,880,.08,.28),(.065,440,.09,.28)]),
 'reset':(.25,[(0,740,.10,.28),(.075,494,.10,.28),(.15,247,.10,.30)]),
 'exhaust':(.19,[(0,330,.09,.30),(.085,220,.10,.28)])}

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
  with wave.open(str(OUT/('craft_'+name+'.wav')),'wb') as w:
   w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes(b''.join(struct.pack('<h',round(v*32767)) for v in samples))
if __name__=='__main__':generate()
