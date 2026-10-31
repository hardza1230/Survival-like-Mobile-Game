const assert=require('assert'),fs=require('fs');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
assert(/\['🎁','Rewards','rewards','ic_side_daily'\]/.test(src),'Lobby has one Rewards button');
assert(!/\['🏆','Awards','achievements','ic_side_awards'\]/.test(src)&&!/\['📋','Daily','daily','ic_side_daily'\]/.test(src),'old Daily/Awards side buttons removed');
assert(/else if\(s==='rewards'\)\{/.test(src),'rewards route');
assert(/rewardsTabs\(active\)\{/.test(src)&&/'rw_'\+k/.test(src),'tab strip with tags');
assert(/rewardsTabs\?\.\('daily'\)/.test(src)&&/rewardsTabs\?\.\('achievements'\)/.test(src),'both pages draw tabs');
assert(/target==='rewards'\)return this\.hasTargetBadge\('daily'\)\|\|this\.hasTargetBadge\('achievements'\)/.test(src),'badge');
assert(/rewards:1/.test(src)&&/rewards:'side_rewards'/.test(src),'feature open + reveal target');
console.log('Rewards hub: one Lobby button, Login/Daily/Awards tabs, badge and feature reveal passed');
