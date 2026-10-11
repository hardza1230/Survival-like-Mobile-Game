// v7.6.2 ก่อนลบ texture ต้องตัดทุกอ็อบเจกต์ (active + ใน pool + ใน container) ออกจากภาพ/อนิเมชันนั้น — กัน 'reading sourceSize' ตอนเปลี่ยนด่าน
const fs=require('fs'),vm=require('vm'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
function method(n){const at=src.indexOf('  '+n+'('),tail=src.slice(at+1),nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return src.slice(at,at+1+nx.index);}
const Scene=vm.runInNewContext('class S{'+method('texDetach')+'}S',{});
const mk=(key,anim)=>({texture:{key},active:true,visible:true,setTexture(k){this.texture={key:k};return this;},setVisible(v){this.visible=v;return this;},anims:anim?{currentAnim:{frames:[{textureKey:anim,frame:{}}]},currentFrame:{},stop(){this.stopped=true;}}:null});
const s=new Scene();const pooled=mk('boss5','boss5'),player=mk('char_momo','char_momo_run'),inBox=mk('stage_card_s05'),keep=mk('bg6','e_c21');pooled.active=false;
s.children={list:[player,{list:[inBox]},keep]};s.enemies={children:{entries:[pooled]},getChildren(){return [pooled];}};
s.texDetach(new Set(['boss5','char_momo_run','stage_card_s05']));
assert.equal(pooled.texture.key,'__DEFAULT');assert.equal(pooled.anims.currentAnim,null);assert(pooled.anims.stopped);
assert.equal(player.texture.key,'char_momo','core texture untouched');assert.equal(player.anims.currentAnim,null,'stale run anim cleared');
assert.equal(inBox.texture.key,'__DEFAULT');assert.equal(inBox.visible,false);
assert.equal(keep.texture.key,'bg6');assert(keep.anims.currentAnim,'unrelated anim kept');
assert(/this\.texDetach\(drop\); for\(const a of all\)if/.test(src)&&/this\.texDetach\(drop\); for\(const a of all\)\{/.test(src),'both texEvict and freeOtherStageArt detach first');
console.log('Texture detach: pooled/container/active objects released from dropped textures and anims, unrelated kept, both free paths wired passed');
