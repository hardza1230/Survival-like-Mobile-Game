// v8.3.31 owner round: Boss Rage off, code-drawn VFX count as ready (no second loading screen), no stage ambience, New Discovery not rebuilt mid-reveal
const assert=require('node:assert/strict'),fs=require('node:fs'),s=fs.readFileSync('game.js','utf8');
assert(s.includes('const BOSS_RAGE_ON=false;')&&s.includes("if(typeof BOSS_RAGE_ON==='undefined'||BOSS_RAGE_ON)for(let i=1;i<tiers.length;i++)"),'rage tiers never apply');
assert(s.includes("else this.showBanner('⚠️ Boss incoming',st.boss,2600);"),'plain boss warning');
assert(s.includes("realTex(k){ if(!this.textures.exists(k))return false; const t=this.textures.get(k); if(t&&t._codeTex)return true;"),'code VFX textures are ready');
assert(s.includes('const STAGE_AMBIENT_ON=false;')&&s.includes("if(!STAGE_AMBIENT_ON){ if(this._a23AmbientKey){ Sfx.eventLoopStop?.(this._a23AmbientKey);"),'ambience off and stopped');
assert(s.includes("buildMenuScreen(){ if(this.state==='menu'&&(this.menuScreen||'hub')==='hub'&&((this._featC&&this._featC.active)||this._featFly)){ this._featRebuild=true; return; }"),'no lobby rebuild during a feature reveal');
console.log('Owner 8.3.31: rage off, single loading screen, no ambience, one New Discovery at a time passed');
