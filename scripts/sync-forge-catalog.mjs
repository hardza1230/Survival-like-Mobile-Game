import {readFileSync,writeFileSync} from 'node:fs';
const rows=JSON.parse(readFileSync('data/forge-mods.json','utf8'));
if(rows.length!==150||new Set(rows.map(m=>m.id)).size!==150)throw Error('Forge requires 150 unique mods');
const source=readFileSync('game.js','utf8'),a=source.indexOf('const FORGE_CATALOG = '),b=source.indexOf(';\n',a),statement='const FORGE_CATALOG = '+JSON.stringify(rows);
if(a<0||b<a)throw Error('Missing Forge catalog');
if(process.argv.includes('--check')){if(source.slice(a,b)!==statement)throw Error('Run node scripts/sync-forge-catalog.mjs');}
else writeFileSync('game.js',source.slice(0,a)+statement+source.slice(b));
console.log('Forge catalog: 150 unique entries; source and runtime match');
