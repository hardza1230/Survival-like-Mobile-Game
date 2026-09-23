# Affix Forge QA

Version: 4.45.0

Status: automated validation and web build pass; real-device portrait verification remains part of release QA.

## Visual acceptance

- The screen title is **Affix Forge** and the `Gear → Affix → Roll` rail is visible without scrolling.
- The dedicated confectionery workshop background remains subdued behind every panel.
- Equipped slot tabs use production gear art when available; emoji appears only as a missing-art fallback.
- Base quality is labelled separately from affix capacity, for example `Epic base · 2/4 affixes`.
- The selected affix line has a strong gold outline and the random roll pool stays readable at portrait width.
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

## Regression checks

- Switching item, slot or affix line clears stale result highlights and destructive confirmations.
- No compatible stat can duplicate a stat already present on another line.
- Gear UID, lock state, item level, base quality and existing affixes survive menu navigation and save reload.
- `npm run check` and `npm run build:www` both pass before release.
