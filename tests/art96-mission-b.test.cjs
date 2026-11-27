// v8.3.29 art order 96: packed files, stage/on-demand loading, hooks keep fallbacks
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const s=fs.readFileSync('game.js','utf8'),M=JSON.parse(fs.readFileSync('assets/incoming/mission_plan_b96/MANIFEST.json','utf8'));
assert.equal(M.length,13);
for(const r of M){const src='assets/incoming/mission_plan_b96/'+r.file,b=fs.readFileSync(src);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.key);
  const out='assets/art/mission96/'+r.key+'.webp',w=fs.readFileSync(out);assert.equal(w.slice(0,4).toString(),'RIFF',out);assert(s.includes("'"+out+"'"),r.key+' literal url');}
assert(s.includes("if(/^(?:mo96|e96|gp96|ui96|fx96)_/.test(k))return 'stage';"),'never boot');
for(const k of ['mo96_escort','mo96_hunt','mo96_crack','mo96_fog_wisp','mo96_roots_flower'])assert(new RegExp("key:'"+k+"'").test(s),k+' used by a side object');
assert(s.includes("this.art96Need('fx96_wisp_fly'")&&s.includes("this.art96Need('fx96_root_grow'"),'one-shot intros load on demand');
assert(s.includes("this.realTex?.('e96_shade_walk')&&this.artFollow?.(e,'e96_shade_walk',56)")&&s.includes("e.setTint?.(0x3a2a5a)"),'shade art with tint fallback');
assert(s.includes("this.add.image(x,y,'gp96_parts',(t-1)*5+ki)")&&s.includes("this.add.text(x,y,K.em"),'golem part icons with emoji fallback');
assert(s.includes("if(this.realTex?.('ui96_oven_panel'))")&&s.includes("if(this.realTex?.('fx96_pot_dust'))")&&s.includes("if(this.realTex?.('fx96_vault_ring'))"),'panel / dust / ring with code fallbacks');
console.log('Art 96: 13 packed files, stage + on-demand loading, side objects / fog wisp / root grow / shades / golem parts / oven / dust / ring with fallbacks passed');
