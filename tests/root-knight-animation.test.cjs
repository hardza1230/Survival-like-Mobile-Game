const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const source=fs.readFileSync('game.js','utf8');
const helper=source.slice(source.indexOf('function registerRootKnightAnimations(scene){'),source.indexOf('function isArtKey(k)'));
const context={};vm.createContext(context);const register=vm.runInContext(helper+'\nregisterRootKnightAnimations',context),defs=new Map();const scene={textures:{exists:()=>true},anims:{exists:k=>defs.has(k),create:d=>defs.set(d.key,d)}};register(scene);register(scene);assert.equal(defs.size,5);assert.deepEqual(Array.from(defs.get('mb10_ancient_root_knight_cleave').frames,f=>f.frame),[8,9,10,11]);for(const d of defs.values())assert(d.frames.every(f=>f.frame>=0&&f.frame<16));
const start=source.indexOf('  rootKnightMotion(b){'),end=source.indexOf('  rootKnightAttack(b){',start);const ctx={Phaser:{Math:{Clamp:(n,a,b)=>Math.max(a,Math.min(b,n))}}};vm.createContext(ctx);const C=vm.runInContext('class Scene{'+source.slice(start,end)+'}Scene',ctx);const s=new C(),timers=[],plays=[];Object.assign(s,{time:{now:1000,delayedCall(ms,fn){timers.push(fn);}},anims:{exists:()=>true}});const b={active:true,hp:100,texture:{key:'mb10_ancient_root_knight'},body:{velocity:{x:30,y:0}},play(k){plays.push(k);},anims:{stop(){}},setFrame(){}};
s.rootKnightMotion(b);assert.equal(plays.at(-1),'mb10_ancient_root_knight_walk');b.body.velocity.x=0;s.rootKnightMotion(b);assert.equal(plays.at(-1),'mb10_ancient_root_knight_idle');
s.rootKnightPose(b,1,1000);assert.equal(plays.at(-1),'mb10_ancient_root_knight_cleave');const count=plays.length;s.rootKnightMotion(b);assert.equal(plays.length,count);s.rootKnightPose(b,2,1200);timers[0]();assert.equal(plays.at(-1),'mb10_ancient_root_knight_bastion');s.time.now=2300;timers[1]();assert.equal(plays.at(-1),'mb10_ancient_root_knight_idle');
s.rootKnightPose(b,'charge',1000);assert.equal(plays.at(-1),'mb10_ancient_root_knight_charge');const n=plays.length;b.texture.key='other';timers.at(-1)();assert.equal(plays.length,n);b.texture.key='mb10_ancient_root_knight';b.hp=0;s.rootKnightMotion(b);assert.equal(plays.length,n);
assert(source.includes("anim:{start:4,frames:4,rate:7}"));assert(source.includes("deathFrame=e.texture.key==='mb10_ancient_root_knight'?15:"));assert(source.includes("if(keys.includes('mb10_ancient_root_knight'))registerRootKnightAnimations(this)"));
console.log('Root Knight: boot/lazy registration, distinct motion/attacks, timer interruption, pooled/dead guards and defeat frame passed');
// Decode the production PNG to catch cutouts touching cell edges or neighboring scraps.
const png=fs.readFileSync('assets/mb10_ancient_root_knight_sheet.png'),chunks=[];let pos=8;
while(pos<png.length){const n=png.readUInt32BE(pos),tag=png.toString('ascii',pos+4,pos+8);if(tag==='IDAT')chunks.push(png.subarray(pos+8,pos+8+n));pos+=12+n;}
assert.equal(png.readUInt32BE(16),1024);assert.equal(png.readUInt32BE(20),1024);assert.equal(png[25],6);
const raw=require('node:zlib').inflateSync(Buffer.concat(chunks)),stride=4096,pixels=Buffer.alloc(1024*stride);let at=0;
const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
for(let y=0;y<1024;y++){const filter=raw[at++];for(let x=0;x<stride;x++){const index=y*stride+x,a=x>=4?pixels[index-4]:0,b=y?pixels[index-stride]:0,c=y&&x>=4?pixels[index-stride-4]:0;pixels[index]=(raw[at++]+(filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):filter===4?paeth(a,b,c):0))&255;}}
const hashes=new Set(),feet=[];
for(let f=0;f<16;f++){const mask=new Uint8Array(65536),cell=Buffer.alloc(65536*4);let bottom=0;
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){const index=((Math.floor(f/4)*256+y)*1024+(f%4)*256+x)*4,i=y*256+x;pixels.copy(cell,i*4,index,index+4);const alpha=pixels[index+3];if(x<18||x>=238||y<18||y>=238)assert.equal(alpha,0,'cell gutter '+f);if(alpha>=32){mask[i]=1;bottom=Math.max(bottom,y);}}
 hashes.add(require('node:crypto').createHash('sha256').update(cell).digest('hex'));feet.push(bottom);
 const parts=[];for(let i=0;i<65536;i++)if(mask[i]){const stack=[i];mask[i]=0;let size=0;while(stack.length){const p=stack.pop();size++;for(const n of [p%256?p-1:-1,p%256<255?p+1:-1,p>=256?p-256:-1,p<65280?p+256:-1])if(n>=0&&mask[n]){mask[n]=0;stack.push(n);}}parts.push(size);}
 parts.sort((a,b)=>b-a);assert(parts[0]>3000,'nonempty sprite '+f);assert((parts[1]||0)<parts[0]*.015,'detached neighboring fragment '+f);
}
assert.equal(hashes.size,16);assert(Math.max(...feet.slice(0,8))-Math.min(...feet.slice(0,8))<=2,'stable foot baseline');
console.log('Root Knight atlas: 16 unique frames, clear gutters, no substantial detached scraps and stable gait baseline passed');
