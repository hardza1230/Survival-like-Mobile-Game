const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file));
const source=read('game.js').toString('utf8');
const rows=JSON.parse(read('assets/incoming/motion77/MANIFEST.json'));
const sizes={hh_herald:256,gg_golem:384,hs_warlord:384,hm_hand_lord:384,hm_breachlord:512,msn71_stalker_captain:256};
const keys=Object.keys(sizes).flatMap(base=>['attack','death'].map(action=>base+'_'+action));
assert.deepEqual(rows.map(row=>row.key).sort(),keys.sort());

const first=source.indexOf('const STAGE_DECOR={'),last=source.indexOf('\n};',first)+3;
const ctx={navigator:{},localStorage:{getItem:()=>null},console,location:{search:'',href:'http://x/'},document:{},Phaser:{}};
ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(source.slice(first,last)+'\n'+source.slice(source.indexOf('const ASSET_IMAGES ='),source.indexOf('class Boot extends'))+
  ';this.assets={ASSET_FX,artClass,lazyArt,bootKeep};',ctx);
const {ASSET_FX,artClass,lazyArt,bootKeep}=ctx.assets;
for(const row of rows){
  const {key,file,bytes,sha256}=row;
  const base=key.replace(/_(attack|death)$/,''),count=key.endsWith('_attack')?6:8,size=sizes[base];
  const png=read('assets/incoming/motion77/'+file);
  assert.equal(png.length,bytes);
  assert.equal(crypto.createHash('sha256').update(png).digest('hex'),sha256);
  assert.deepEqual([png.readUInt32BE(16),png.readUInt32BE(20),png[25]],[size*count,size,6]);
  const {url,fw,fh,frames,rate,loop}=ASSET_FX[key];
  assert.equal(url,'assets/art/motion77/'+key+'.webp');
  const webp=read(url);
  assert.equal(webp.toString('ascii',0,4),'RIFF');
  assert.equal(webp.toString('ascii',8,12),'WEBP');
  assert.deepEqual([fw,fh,frames,rate,!!loop],[ASSET_FX[base].fw,ASSET_FX[base].fh,count,12,false]);
  assert.equal(artClass(key),'stage');
  assert(lazyArt(key,url,'momo')&&!bootKeep(key));
}

function method(name){
  const start=source.indexOf('\n  '+name+'(')+1;
  assert(start>0,name);
  const end=source.slice(start).search(/\n  (?:[\w$]+\(|\/[/*])/);
  return source.slice(start,start+end).trimEnd();
}
const m=vm.runInContext('({'+['artFollow','artFollowAct','artFollowDeath','artFollowTick','artFollowClear','missionArtKeys'].map(method).join(',')+'})',ctx);
for(const name of ['hhTick','ggTick','hdTick'])assert(method(name).includes('this.artFollowAct?.('));
assert(method('sigOnKill').includes('this.artFollowDeath?.(e)'));
assert(method('artFollowTick').includes('this.artFollowDeath?.(e,s)'));
for(const [stage,base] of [[0,'hh_herald'],[1,'hm_hand_lord'],[1,'hm_breachlord'],[4,'gg_golem'],[14,'msn71_stalker_captain']]){
  const art=m.missionArtKeys.call({},stage);
  assert(art.includes(base+'_attack')&&art.includes(base+'_death'));
}
const delve=m.missionArtKeys.call({recipeMode:true},5);
assert(delve.includes('hs_warlord_attack')&&delve.includes('hs_warlord_death'));

function fixture(base){
  const events=new Map(),played=[],spawned=[],created=new Map(),changed=[];
  const enemy={active:true,x:30,y:40,alpha:1,body:{velocity:{x:-20}},setAlpha(v){this.alpha=v;}};
  const sprite={
    active:true,x:30,y:40,setPosition(x,y){this.x=x;this.y=y;return this;},setDepth(){return this;},
    setFlipX(v){this.flipX=v;},setTexture(key,frame){changed.push([key,frame]);},
    once(ev,fn){events.set(ev,fn);},play(key){played.push(key);},destroy(){this.active=false;}
  };
  const s=Object.assign({},m,{
    loaded:new Set([base,base+'_attack',base+'_death']),player:{x:50,y:40},time:{now:100},
    textures:{exists:key=>s.loaded.has(key)},dist:(x,y,a,b)=>Math.hypot(x-a,y-b),
    artSpr(key,x,y,px,frame,opts){assert.equal(key,base);assert.equal(opts.sig,false);return sprite;},
    anims:{
      exists:key=>created.has(key),create(data){created.set(data.key,data);},
      generateFrameNumbers:(key,{end})=>Array.from({length:end+1},(_,i)=>({key,frame:i}))
    },
    artFx(key,x,y,size){
      spawned.push({key,x,y,size});
      return {setFlipX(v){spawned.at(-1).flip=v;}};
    }
  });
  assert.equal(s.artFollow(enemy,base,120),sprite);
  return {s,sprite,enemy,events,played,spawned,created,changed};
}
{
  const base='hh_herald',f=fixture(base),{s,sprite,enemy,events,played,created,spawned}=f;
  s.artFollowTick();
  assert.equal(played.length,0,'proximity waits after spawn');
  assert.equal(enemy.alpha,.01);
  assert(sprite.flipX);
  assert(s.artFollowAct(enemy),'skill cue plays immediately');
  assert.equal(played.at(-1),base+'_attack');
  assert.equal(created.get(base+'_attack').repeat,0);
  assert.equal(created.get(base+'_attack').frameRate,12);
  assert.equal(created.get(base+'_attack').frames.length,6);
  assert.equal(s.artFollowAct(enemy),false,'no overlapping attack');
  events.get('animationcomplete-'+base+'_attack')();
  assert.equal(played.at(-1),base);
  assert.equal(s.artFollowAct(enemy),false,'explicit cue cooldown');
  s.time.now=2600;
  s.artFollowTick();
  assert.equal(played.at(-1),base+'_attack');
  s.artFollowDeath(enemy);
  assert.deepEqual(spawned,[{key:base+'_death',x:30,y:40,size:120,flip:true}]);
  assert(enemy._missionDeathArt);
  enemy.active=false;
  s.artFollowTick();
  assert.equal(spawned.length,1,'one death animation');
  assert(!sprite.active&&enemy._artOv===null&&enemy.alpha===1);
}
{
  const base='msn71_stalker_captain',{s,enemy,sprite,events,changed,spawned}=fixture(base);
  assert(s.artFollowAct(enemy));
  events.get('animationcomplete-'+base+'_attack')();
  assert.deepEqual(changed,[[base,0]]);
  enemy.active=false;
  s.artFollowTick();
  assert.equal(spawned[0].key,base+'_death');
  assert(!sprite.active);
}
{
  const base='gg_golem',{s,enemy,sprite,played,spawned}=fixture(base);
  s.loaded.delete(base+'_attack');s.loaded.delete(base+'_death');
  assert.equal(s.artFollowAct(enemy),false);
  enemy.active=false;s.artFollowTick();
  assert.equal(played.length+spawned.length,0);
  assert(!sprite.active&&!enemy._missionDeathArt);
}
console.log('Order 77: twelve source hashes, equal idle geometry, staged routes, skill and proximity attacks, one-shot death and fallback passed');
