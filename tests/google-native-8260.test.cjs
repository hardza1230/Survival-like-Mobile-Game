// v8.2.60 owner: Google sign-in with a new account was slow on the Google web pages (Custom Tab).
// Native Credential Manager first (account sheet, no browser) → Supabase signInWithIdToken · fall back to the Custom Tab · pull = 1 query.
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const a=src.indexOf('const Cloud = {'),b=src.indexOf('\n};',a)+3;
const mk=(clientId,SL)=>{ const calls=[];const ctx={console,Date,Math,Array,Uint8Array,TextEncoder,String,URLSearchParams,crypto:require('crypto').webcrypto,GOOGLE_WEB_CLIENT_ID:clientId,Tele:{ev:(n,d)=>calls.push(['tele',n,d])},
  window:{supabase:{},Capacitor:{isNativePlatform:()=>true,Plugins:{SocialLogin:SL,Browser:{open:async o=>calls.push(['tab',o.url]),close:async()=>{}},App:{addListener(){}}}}},CLOUD_URL:'u',CLOUD_KEY:'k',localStorage:{getItem(){return null},setItem(){}}};
  vm.createContext(ctx);vm.runInContext(src.slice(a,b).replace('const Cloud =','this.Cloud =')+';',ctx);const C=ctx.Cloud;
  C.sb={auth:{signInWithIdToken:async o=>{calls.push(['idtoken',o]);return {data:{user:{id:'u1',app_metadata:{provider:'google'}}}};},signInWithOAuth:async()=>({data:{url:'https://x/auth'}}),getSession:async()=>({data:{session:null}})}};C._onLogin=()=>calls.push(['onLogin']);
  return {C,calls}; };
(async()=>{
  // native path
  { const SL={initialize:async()=>{},login:async o=>{ assert.ok(/^[0-9a-f]{64}$/.test(o.options.nonce),'hashed nonce to Google'); return {result:{idToken:'jwt'}}; }};
    const {C,calls}=mk('web-client.apps.googleusercontent.com',SL); const r=await C.signInGoogle();
    assert.ok(r.ok&&r.done,'native sign-in done'); const it=calls.find(c=>c[0]==='idtoken'); assert.ok(it&&it[1].token==='jwt'&&/^[0-9a-f]{32}$/.test(it[1].nonce),'raw nonce to Supabase');
    assert.ok(calls.some(c=>c[0]==='onLogin')&&!calls.some(c=>c[0]==='tab'),'no browser'); assert.ok(calls.some(c=>c[0]==='tele'&&c[2].way==='native'&&c[2].res==='ok')); }
  // no client id → Custom Tab
  { const {C,calls}=mk('',{initialize:async()=>{},login:async()=>({})}); const r=await C.signInGoogle(); assert.ok(r.ok&&calls.some(c=>c[0]==='tab'),'fallback to Custom Tab'); }
  // plugin error → Custom Tab
  { const {C,calls}=mk('id',{initialize:async()=>{},login:async()=>{throw new Error('No credentials')}}); const r=await C.signInGoogle(); assert.ok(r.ok&&calls.some(c=>c[0]==='tab'),'error falls back'); }
  // cancel → stop
  { const {C,calls}=mk('id',{initialize:async()=>{},login:async()=>{throw new Error('User cancelled')}}); const r=await C.signInGoogle(); assert.ok(!r.ok&&!calls.some(c=>c[0]==='tab'),'cancel does not open the browser'); }
  assert.ok(src.includes("select('data,stats')"),'pull is one query');
  console.log('Google native 8.2.60: Credential Manager → signInWithIdToken (nonce), Custom Tab fallback, cancel stops, single pull passed');
})().catch(e=>{console.error(e);process.exit(1);});
