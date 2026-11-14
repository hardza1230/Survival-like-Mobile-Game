// v8.1.146 art order 82: Build Path full-card Unique art — sources match MANIFEST, 15 packed (Sesame skipped: no Build Path in rune mode),
// literal URLs, stage-lazy, current hero's 3 loaded per run, full-card hook with the old square picture as fallback.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert'),vm=require('vm');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'game.js'),'utf8');
const rows=JSON.parse(fs.readFileSync(path.join(root,'assets/incoming/pathuq82/MANIFEST.json'),'utf8'));
assert.equal(rows.length,18);
let n=0;
for(const r of rows){ const b=fs.readFileSync(path.join(root,'assets/incoming/pathuq82',r.file)); assert.equal(b.length,r.bytes,r.file); assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.file);
  const url='assets/art/pathuq82/'+r.key+'.webp';
  if(r.key.startsWith('pathuq82_sesame_')){ assert(!src.includes("'"+url+"'"),'sesame not shipped '+r.key); continue; }
  const w=fs.readFileSync(path.join(root,url)); assert.equal(w.toString('ascii',0,4),'RIFF'); assert.equal(w.toString('ascii',8,12),'WEBP');
  assert(src.includes("  "+r.key+":'"+url+"'"),'registered '+r.key); n++; }
assert.equal(n,15);
assert(src.includes("if(/^(?:vault80|forge80|book80|pathcard80|pathuq82)_/.test(k))return 'stage';"),'stage-lazy');
assert(src.includes("map(p=>'pathuq82_'+hh+'_'+p.id)"),'current hero 3 per run');
assert(/const fk=isPath\?'pathuq82_'\+/.test(src)&&src.includes("full=!!(fk&&this.realTex?.(fk))"),'full-card only when loaded');
assert(/else \{ halo=this\.lvlSocket\(/.test(src),'fallback = old square picture');
console.log('Art order 82: 15 Build Path full-card pictures packed, registered, stage-lazy, hooked with fallback passed');
