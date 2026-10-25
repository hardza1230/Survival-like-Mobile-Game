// Presentation contracts only: no combat simulation or balance tuning.
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),crypto=require('crypto'),{EventEmitter}=require('events');
const src=fs.readFileSync('game.js','utf8'),rows=JSON.parse(fs.readFileSync('assets/art/combat_readability/MANIFEST.json','utf8'));
assert.equal(rows.length,7);for(const r of rows){const path='assets/art/combat_readability/'+r.key+'.webp',b=fs.readFileSync(path);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256);assert(src.includes(r.key+":'"+path+"'"));assert.equal(b.toString('ascii',12,16),'VP8L');const n=b.readUInt32LE(21);assert.equal((n&0x3fff)+1,r.width);assert.equal(((n>>>14)&0x3fff)+1,r.height);assert(n&(1<<28),'alpha');}
const bolt=rows.find(r=>r.key==='cr_foe_bolt');for(const p of ['proj_foe','proj_enemy']){const b=fs.readFileSync('assets/generated/'+p+'.png');assert.equal(b.readUInt32BE(16),bolt.width);assert.equal(b.readUInt32BE(20),bolt.height);}assert.equal(bolt.width,128);
for(const k of ['cr_player_ring','cr_warning_rim'])assert(rows.find(r=>r.key===k).centerAlpha<.035);
function method(n){const i=src.indexOf('  '+n+'(');assert(i>=0,n);const m=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(i+1));assert(m,n);return src.slice(i,i+1+m.index);}
const Save={data:{settings:{vfx:1}}},Phaser={BlendModes:{ADD:1},Math:{Between:()=>0}};
const methods=['combatReadSprite','combatReadSpark','tickPlayerReadability','tickEnemyReadability','combatFxAlpha','makeHazardReadability','trackArtVfx','clearArtVfx','foeShot','showPickupCue','hidePickupCue','spawnDropBeam','updatePickupReadability','popDmg'];
const C=vm.runInNewContext('(class{'+methods.map(method).join('\n')+'})',{Save,Phaser,Sfx:{eventLoopStop(){}},COMBAT_WARN_FILL:rows.find(r=>r.key==='cr_warning_rim').hardFill});
class Node extends EventEmitter{constructor(x=0,y=0,k=''){super();Object.assign(this,{x,y,key:k,active:true,visible:true,alpha:1,width:128,height:128,scaleX:1,scaleY:1,ops:[]});}
 setDisplaySize(w,h){this.displayWidth=w;this.displayHeight=h;return this;}setDepth(v){this.depth=v;return this;}setAlpha(v){this.alpha=v;return this;}setPosition(x,y){this.x=x;this.y=y;return this;}setScale(x,y=x){this.scaleX=x;this.scaleY=y;return this;}setVisible(v){this.visible=v;return this;}setActive(v){this.active=v;return this;}setTexture(k,f){this.key=k;this.frame=f;return this;}setOrigin(x,y=x){this.originX=x;this.originY=y;return this;}setRotation(v){this.rotation=v;return this;}setFlipX(v){this.flipX=v;return this;}setTintFill(){return this;}setBlendMode(){return this;}setTint(){return this;}clearTint(){return this;}setVelocity(){return this;}setText(v){this.text=v;return this;}setColor(){return this;}setFontSize(v){this.fontSize=v;return this;}setStroke(){return this;}setShadow(){return this;}
 clear(){this.ops=[];return this;}lineStyle(){return this;}strokeCircle(x,y,r){this.ops.push(['circle',r]);return this;}beginPath(){return this;}arc(x,y,r,a,b){this.ops.push(['arc',r,a,b]);return this;}strokePath(){return this;}destroy(){if(!this.active)return;this.active=false;this.emit('destroy');}}
const sc=new C(),nodes=[],tweens=[];sc.state='play';sc.camWorld=o=>o;sc.events={once(){}};sc.textures={exists:()=>true};sc.add={image:(...a)=>{const o=new Node(...a);nodes.push(o);return o;},graphics:()=>{const o=new Node();nodes.push(o);return o;},text:(x,y,t)=>{const o=new Node(x,y);o.text=t;nodes.push(o);return o;}};sc.time={now:1000};sc.tweens={add(c){const tw={config:c,remove(){this.removed=true;}};tweens.push(tw);return tw;},killTweensOf(){}};
// Same pooled physics sprite, transform, velocity, damage and lifetime; art changes only the texture.
const bullet=new Node();bullet.body={width:128,height:128,offset:{x:0,y:0},velocity:{},setAllowGravity(){}};const before=JSON.stringify({w:bullet.body.width,h:bullet.body.height,offset:bullet.body.offset});sc.foeBullets={getFirstDead:()=>bullet};sc.physics={velocityFromRotation(a,s,v){v.x=Math.cos(a)*s;v.y=Math.sin(a)*s;}};sc.stageIndex=3;sc.foeShot(10,20,.4,205,13,0,1.05);assert.equal(bullet.key,'cr_foe_bolt');assert.equal(JSON.stringify({w:bullet.body.width,h:bullet.body.height,offset:bullet.body.offset}),before);assert.equal(bullet.dmg,13);assert.equal(bullet.life,3);assert.equal(bullet.scaleX,1.05*.34);assert.equal(bullet.body.velocity.x,Math.cos(.4)*205);
// Exact warning boundary and monotonic countdown; page/scene clear removes the clock tween too.
const warning=sc.makeHazardReadability(12,30,86,760),g=nodes.findLast(n=>n.ops.length),tw=tweens.at(-1);assert.equal(tw.config.duration,760);tw.config.targets.p=.5;tw.config.onUpdate();assert(g.ops.filter(x=>x[0]==='circle').every(x=>x[1]===86));assert.equal(g.ops.at(-1)[1],86);warning.kill();assert(tw.removed&&!g.active);
const hazard=method('spawnHazard');assert(hazard.includes('delayedCall(760'));assert(hazard.includes('this.dist(this.player.x,this.player.y,x,y)<r+8'));assert(hazard.includes('this.hurtPlayer(dmg,0.5)'));
// Two player markers reuse art/frame and never modify the physics actor.
sc.player={active:true,x:30,y:40,texture:{key:'char_momo'},frame:{name:2},originX:.5,originY:.5,scaleX:.5,scaleY:.5,rotation:.2,flipX:true,depth:40,body:{radius:18},alpha:1};const ps=JSON.stringify(sc.player);sc.tickPlayerReadability();const ring=sc._readPlayerRing,edge=sc._readPlayerEdge,count=nodes.length;sc.tickPlayerReadability();assert.equal(nodes.length,count);assert.equal(JSON.stringify(sc.player),ps);assert.equal(edge.frame,2);assert.equal(ring.y,71);
// Run the production presentation ordering only (no combat simulation). Upward movement
// used to leave the outline at the prior, higher Y depth, in front of the hero.
const presentationStart=src.indexOf('    this.tickCocoaFlicker(dt);this.updatePose(dt);this.animatePlayer(dt);');
const presentationEnd=src.indexOf('    if(!this.dashReady)',presentationStart);
assert(presentationStart>=0&&presentationEnd>presentationStart);
const present=vm.runInNewContext('(function(dt){'+src.slice(presentationStart,presentationEnd)+'})');
sc.tickCocoaFlicker=()=>{};sc.drawShadows=()=>{};
sc.player=new Node(30,100);Object.assign(sc.player,{texture:{key:'char_momo'},frame:{name:0},originX:.5,originY:.7});
let pose=0;
sc.updatePose=()=>{sc.player.texture={key:pose%2?'char_momo_run':'char_momo'};sc.player.frame={name:pose%12};};
sc.animatePlayer=()=>{Object.assign(sc.player,{scaleX:.4+pose*.001,scaleY:.5,rotation:pose*.01,flipX:!!(pose%2),alpha:pose%3?.7:1});};
for(const iso of [true,false]){sc.iso=iso;sc.player.depth=100;
 for(const y of [100,99,80,40,-20,-21,0,40,100,100]){pose++;sc.player.y=y;const priorDepth=sc.player.depth;present.call(sc,1/60);
  const p=sc.player;assert.equal(p.depth,iso?y:priorDepth);assert.equal(edge.depth,p.depth-.05);assert(edge.depth<p.depth,'outline must stay behind hero');assert(ring.depth<edge.depth);
  assert.equal(edge.key,p.texture.key);assert.equal(edge.frame,p.frame.name);assert.equal(edge.x,p.x);assert.equal(edge.y,p.y);assert.equal(ring.y,p.y+31);
  assert.equal(edge.scaleX,p.scaleX*1.055);assert.equal(edge.scaleY,p.scaleY*1.055);assert.equal(edge.rotation,p.rotation);assert.equal(edge.flipX,p.flipX);assert.equal(edge.originY,p.originY);assert.equal(edge.alpha,.48*p.alpha);
 }
}
assert.equal(nodes.length,count,'movement reuses both markers');
// Elite cap and windup edge-trigger, including pooled ordinary-enemy reuse.
for(let i=0;i<15;i++)sc.tickEnemyReadability({active:true,isElite:true,x:i,y:50,body:{halfHeight:25},frozen:0});assert.equal(sc._readElites.size,12);
const enemy={active:true,x:1,y:2,isElite:false,frozen:0,_enemyAction:{state:'windup'}};sc.tickEnemyReadability(enemy);const n=nodes.length;sc.tickEnemyReadability(enemy);assert.equal(nodes.length,n,'one flash per windup');enemy._enemyAction=null;sc.tickEnemyReadability(enemy);enemy._enemyAction={state:'windup'};sc.tickEnemyReadability(enemy);assert(nodes.length>n);
assert.equal(sc.combatFxAlpha('fx_mint_storm',300,1),.68);assert.equal(sc.combatFxAlpha('vfx_b10_memory_eclipse',900,.9),.58);assert.equal(sc.combatFxAlpha('vfx_b04_warn',300,1),1);assert.equal(sc.combatFxAlpha('bpx_momo_hit',70,.8),.8);
const common={dropType:'gear',lootTier:'common'},currency={dropType:'currency'};const pre=nodes.length;sc.spawnDropBeam(common,1);sc.spawnDropBeam(currency,1);assert.equal(nodes.length,pre);const rare=new Node(0,0);Object.assign(rare,{dropType:'gear',lootTier:'epic',depth:80000});sc.spawnDropBeam(rare,1);const gl=rare._pickupGlint;assert(gl&&rare._dropBeam);sc.hidePickupCue(rare);assert(!gl.active&&rare._pickupGlint===null);
// Crowded critical numbers are throttled separately; forced numbers retain the original bypass.
sc.enemies={countActive:()=>80};sc.dmgPool=[];sc.viewZoom=1;sc.popDmg(10,0,0,true);const first=sc._critNumAt;sc.time.now+=10;const nt=nodes.length;sc.popDmg(11,0,0,true);assert.equal(nodes.length,nt);assert.equal(sc._critNumAt,first);sc.popDmg(12,0,0,true,true);assert(nodes.length>nt);assert(!src.includes("const str = crit ? ('💥 '+n)"));
sc.clearArtVfx();assert(!ring.active&&!edge.active);assert.equal(sc._readElites.size,0);assert.equal(sc._readSparks.size,0);
console.log('Combat readability:7 source-verified alpha sprites,128px projectile body/velocity parity, exact warning radius/760ms, reused player markers, bounded Elite/windup/sparks, cleanup, opacity gates, loot hierarchy and critical-number throttling passed');
