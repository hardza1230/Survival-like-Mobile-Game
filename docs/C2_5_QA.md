# Chapter 2-5 Root Throne QA

Version: 4.44.0
Stage index: 9  
Status: implementation complete, playable and unlocked; manual mobile pass pending

## Scope

- Five-wave Chapter 2 finale in the Root Throne living cathedral.
- Four attackable Crown Root anchors for the `breakRoots` objective.
- Recurring throne pulses and Crown Recall arena events.
- Seven root enemy roles with a mobile live-enemy cap of 88.
- Ancient Root Knight miniboss.
- The True Rootmother four-phase boss encounter.
- Chapter 2 finale epilogue.

## Automated gates

- Root enemy atlas: 1024×512 PNG with alpha and valid PNG chunks/image stream.
- Ancient Root Knight sheet: 1024×256 PNG with alpha.
- True Rootmother sheet: 1024×512 PNG with alpha and valid PNG chunks/image stream.
- Root Throne background exists.
- Stage is `chapterStage:5, ready:true`.
- Root balance values remain HP ×1.16, damage ×1.12, speed ×1.08, max live 88.
- Boss phase gates remain 75%, 42%, and 18%.
- Objective, arena director, miniboss, boss, finale, and asset registration contracts are present.

## Manual mobile pass checklist

1. Clear all five waves without objective arrows pointing off-screen.
2. Verify every Crown Root can be targeted and destroyed.
3. Check throne pulse warning circles remain readable under projectile load.
4. Check Crown Recall never traps the player at the arena center.
5. Confirm Bark Bulwark protection and Root Choir fan fire are readable.
6. Confirm the Ancient Root Knight's cleave, bastion, charge, and summon warnings leave a safe response.
7. Fight the True Rootmother through all four phases.
8. During each phase transition, confirm damage cannot skip the next phase gate.
9. Confirm Thorn Cleave, Sap Eruption, Crown Cage, Root Choir, World-Root Spiral, and Memory Eclipse each preserve a visible escape route.
10. Confirm the death sequence, reward flow, and “Memories Choose Their Own Shape” epilogue play once.
11. Watch frame rate and enemy count on a representative low/mid-range Android device.
12. Re-test pause, level-up, chest, death, and resume during both miniboss and boss encounters.

## Follow-up commits

- Chapter 2 full-run balance and mobile performance QA.

## Final art/readability pass — completed in v4.44.0

- Replaced the malformed Root Throne enemy atlas and True Rootmother sheet with valid transparent production art.
- Standardized every cell to 256×256 with a consistent bottom ground line and mobile-readable silhouette.
- Preserved role colors: gold for critical warning shapes, magenta for memory/root danger, and dark bark for mass.
- Added PNG chunk CRC and image-stream validation so corrupt art fails `npm run check` before deployment.
