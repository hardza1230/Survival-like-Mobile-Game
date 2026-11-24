// v8.2.86: art orders 94 (Crown Root, fog, Abyss Brute, rift warning, badges) + 95 (boss twists) — packed, stage-lazy, hooked with the code-drawn fallback kept.
const fs=require('fs'),assert=require('assert'),crypto=require('crypto');const R=__dirname+'/../',src=fs.readFileSync(R+'game.js','utf8');
const J=JSON.parse(fs.readFileSync(R+'scripts/art94-95.json','utf8'));assert.equal(Object.keys(J).length,28);
for(const b of ['mission94','twist95'])for(const r of JSON.parse(fs.readFileSync(R+'assets/incoming/'+b+'/MANIFEST.json','utf8'))){const f=R+'assets/incoming/'+b+'/'+r.file;if(fs.existsSync(f)){const x=fs.readFileSync(f);assert.equal(x.length,r.bytes,r.key);assert.equal(crypto.createHash('sha256').update(x).digest('hex'),r.sha256,r.key);}
  const v=J[r.key];assert(v,r.key);const w=fs.readFileSync(R+v.url);assert.equal(w.toString('latin1',8,12),'WEBP',r.key);assert(src.includes("  "+r.key+":"+(v.frames>1||!/fog_tile|lantern_edge|vignette|chip/.test(r.key)?"{url:'"+v.url+"'":"'"+v.url+"'")),r.key+' registered');}
assert(src.includes("if(/^(?:cr94|fg94|hc94|sr94|fb94|tw95)_/.test(k))return 'stage';"),'stage-lazy, never boot');
assert(src.includes("A('fb94_'); if(idx>=5){ A('tw95_'); A('sr94_'); } if(idx===9||has('breakRoots'))A('cr94_'); if(idx===6||has('cleanAir'))A('fg94_'); if(has('capture'))A('hc94_');"),'loaded with the stages that use them');
for(const h of ["this.a94Once?.('cr94_warn_crack'","this.a94Once?.('cr94_strike'","this.a94Once?.('cr94_anchor_break'","this.artFollow?.(e,'cr94_crown_head',130)","'cr94_crown_hurt'","this.a94Once?.('cr94_crown_burst'","this.a94Badge?.('fb94_perfect_badge'","this.a94Badge?.('fb94_combo_badge'",
  "key:'fg94_fog_tile'","'fg94_lantern_edge'","'fg94_dark_claw'","this.artFollow?.(e,'hc94_abyss_brute',110)","this.a94Loop?.('sr94_rift_warn'","R.warnT=SR_EVENT_WARN;",
  "'tw95_chip'","'tw95_icons'","'tw95_dark_vignette'","'tw95_root_tile'","this.a94Loop?.('tw95_root_tip'","'tw95_seed_drop'","'tw95_seed_idle'","'tw95_seed_pop'","'tw95_seed_hatch'","'tw95_fruit_fall'","'tw95_fruit_splat'","'tw95_frenzy_aura'","'tw95_shadow_summon'","'tw95_shadow_aura'"])assert(src.includes(h),h);
// fallbacks kept
for(const h of ["const D=CL?null:this.cleanAirDarkBrush?.();","else { e.tintColor=B.tint; e.setTint?.(B.tint); }","else if(kind==='dark'&&this.add?.rectangle&&this.camUI)","if(!q.spr){ T.g?.fillStyle?.(0x4a8a2a,.9);","else { T.g?.lineStyle?.(10,0x5a3a22,.9);"])assert(src.includes(h),'fallback '+h);
assert(src.includes('this.bossTwistEnd?.(false); this.seedRiftEventEnd?.(false);'),'cleanup at stage end');
console.log('Art 94/95: 28 packed sheets, stage-lazy, Crown Root/fog/brute/rift/badge/twist hooks with fallbacks passed');
