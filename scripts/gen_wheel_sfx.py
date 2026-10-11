"""v7.5.1 casino prize-wheel SFX (deterministic, numpy). Outputs assets/audio/sfx/wheel/*.mp3 via ffmpeg.
clack  = wooden peg hitting the flapper (sharp transient + two body resonances + tiny low knock)
roll   = snare/drum roll that swells (plays while the wheel slows down)
win    = casino bell ding-ding + coin shower sparkle
"""
import numpy as np, subprocess, wave
from pathlib import Path
R=44100
OUT=Path(__file__).resolve().parents[1]/'assets/audio/sfx/wheel'
rng=np.random.default_rng(7)
def t(d): return np.arange(int(d*R))/R
def bp_noise(n,lo,hi):
  x=rng.standard_normal(n); X=np.fft.rfft(x); f=np.fft.rfftfreq(n,1/R); X[(f<lo)|(f>hi)]=0; y=np.fft.irfft(X,n); return y/(np.abs(y).max()+1e-9)
def clack():
  d=.11; tt=t(d); n=len(tt)
  hit=bp_noise(n,1800,6500)*np.exp(-tt/0.0035)*0.9
  body=(np.sin(2*np.pi*1650*tt)*0.55+np.sin(2*np.pi*2730*tt)*0.3)*np.exp(-tt/0.018)
  wood=np.sin(2*np.pi*420*tt)*np.exp(-tt/0.012)*0.45
  knock=np.sin(2*np.pi*160*tt)*np.exp(-tt/0.02)*0.35
  y=hit+body+wood+knock; y*=np.minimum(1,tt/0.0006); return y
def roll():
  d=2.4; tt=t(d); y=np.zeros(len(tt)); hit=bp_noise(int(.05*R),900,7000)
  rate0,rate1=14,30; ph=0.0; i=0
  while True:
    p=i/R
    if p>=d-0.06: break
    k=int(p*R); g=0.25+0.75*(p/d)**1.6; seg=hit*np.exp(-np.arange(len(hit))/R/0.012)*g*(0.85+0.3*rng.random())
    e=min(len(y),k+len(seg)); y[k:e]+=seg[:e-k]
    r=rate0+(rate1-rate0)*(p/d); i+=int(R/r)
  tom=np.sin(2*np.pi*(90+60*tt/d)*tt)*0.18*(tt/d)**2; y+=tom
  y*=np.minimum(1,(d-tt)/0.05); return y
def win():
  d=1.6; tt=t(d); y=np.zeros(len(tt))
  def bell(at,f,g):
    k=int(at*R); u=tt[:len(tt)-k]; s=(np.sin(2*np.pi*f*u)+0.55*np.sin(2*np.pi*f*2.76*u)+0.3*np.sin(2*np.pi*f*5.4*u))*np.exp(-u/0.45)*g; y[k:]+=s
  bell(0,1568,0.42); bell(0.14,2093,0.42); bell(0.28,2637,0.36)
  for _ in range(26):
    at=0.2+rng.random()*1.0; f=3200+rng.random()*2600; k=int(at*R); u=tt[:min(len(tt)-k,int(.09*R))]
    y[k:k+len(u)]+=np.sin(2*np.pi*f*u)*np.exp(-u/0.025)*0.12
  return y
def write(name,y,peak=0.85):
  y=y/(np.abs(y).max()+1e-9)*peak; OUT.mkdir(parents=True,exist_ok=True); wav=OUT/(name+'.wav')
  with wave.open(str(wav),'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(R); w.writeframes((y*32767).astype('<i2').tobytes())
  subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(wav),'-codec:a','libmp3lame','-b:a','96k',str(OUT/(name+'.mp3'))],check=True); wav.unlink()
if __name__=='__main__':
  write('wheel_clack',clack(),0.9); write('wheel_roll',roll(),0.7); write('wheel_win',win(),0.8)
