# C2-2 Mycelium Marsh — QA Gate

Version: 4.40.0  
Stage index: 6  
Status: playable (`ready:true`)

## Automated release checks

- Game JavaScript parses successfully.
- Web and Android workflows run the shared validator before packaging.
- Required background, enemy atlas, miniboss sheet and boss sheet are registered and dimension-checked.
- C2-2 is ready while C2-3 through C2-5 remain locked.
- Boss transition gates remain at 68% and 34% HP and use invulnerability.
- Heavy attacks retain named telegraphs.
- Chapter-aware objectives remain enabled.

## Balance audit against C2-1

| Metric | C2-2 target locked in runtime |
|---|---:|
| Regular enemy HP | approximately ×1.35 |
| Regular enemy damage | approximately ×1.30 |
| Movement speed | +8% |
| Live enemy ceiling | 104 |
| Miniboss transition | 50% HP |
| Boss transitions | 68% and 34% HP |

The 104-enemy ceiling is a mobile safety budget. C2-2 pressure comes from faster batches, the Clean Air movement rule, predictive attacks, Bulwark protection, Mold Sac splitting and stronger individual monsters rather than raising the final-wave population indefinitely.

## Unlock and save behavior

Players who clear C2-1 advance to global stage index 6. Saves that already recorded that progression can enter Mycelium Marsh immediately after this release. C2-3 and later stages remain blocked by the shared readiness guard.

## Remaining QA scope

Chapter-wide Normal/Hard/Hell tuning, reward progression, cross-device performance and final art compression remain scheduled for commits 10 and 11.
