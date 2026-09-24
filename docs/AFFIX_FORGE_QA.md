# Affix Forge QA

Version: 4.46.0

Status: automated validation and web build pass; real-device portrait verification remains part of release QA.

## Visual acceptance

- The screen title is **Affix Forge** and the `Gear → Affix → Roll` rail is visible without scrolling.
- The dedicated confectionery workshop background remains subdued behind every panel.
- Equipped slot tabs use production gear art when available; emoji appears only as a missing-art fallback.
- Base quality is labelled separately from affix capacity, for example `Epic base · 2/4 affixes`.
- The selected affix line has a strong gold outline and the random roll pool stays readable at portrait width.
- Offense uses orange, Defense uses blue and Utility uses mint consistently in affix lines, pool cards and the roulette reveal.
- Large compatible pools show at most six preview cards in portrait mode plus an explicit hidden-result count.
- A successful action shows a before-and-after result strip before the primary roll button.
- The four utility actions remain visible in a 2×2 grid at 360×800 and 393×873 logical viewports.

## Functional matrix

| Case | Expected result |
|---|---|
| Empty Common line | Spark Sugar rolls one compatible stat and promotes the craft state to Magic |
| Empty Magic line | Spark Sugar rolls one compatible stat into the second line |
| Filled Magic line | Twist Cream replaces only the selected line |
| Full two-line Magic item | Crown Icing unlocks four-line capacity without changing existing affixes |
| Empty Rare line | Wish Candy rolls one compatible stat into the selected empty line |
| Filled Rare line | Wild Jam replaces only the selected line |
| Crystal Glaze | Consumes 3, keeps the stat and tier, and rerolls only its value |
| Fading Gumdrop | First tap requests confirmation; second tap within three seconds removes the selected line |
| Plain Dough | First tap requests confirmation; second tap within three seconds clears all affixes and returns one-line capacity |
| Locked item | Every modifying action remains blocked |
| Insufficient currency | No data changes and the banner reports the required material |
| Roulette reveal | Input is disabled, three result cards cycle, timing slows down, and the center card locks to the saved affix |
| Boss DMG | Increases damage against bosses and minibosses only |
| Low-HP DMG | Increases outgoing damage while player HP is below 40% |
| HP on Kill | Heals on kill and respects the existing heal-effect multiplier/cooldown |
| Emergency Guard | Reduces contact, projectile and hazard damage while player HP is below 40% |
| EXP Gain | Multiplies experience collected without altering orb spawn values |
| Dash Recovery | Shortens dash cooldown and keeps the cooldown ring denominator in sync |

## Regression checks

- Switching item, slot or affix line clears stale result highlights and destructive confirmations.
- No compatible stat can duplicate a stat already present on another line.
- Every equipment slot exposes at least four compatible mods, so a four-line Rare item can be completed without duplicate affixes.
- Gear UID, lock state, item level, base quality and existing affixes survive menu navigation and save reload.
- `npm run check` and `npm run build:www` both pass before release.
