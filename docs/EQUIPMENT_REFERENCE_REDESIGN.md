# Equipment redesign — visual concept

Owner requested redesign of 1000031083.jpg, paired with tighter Heroes spacing. ImageGen preview: exec-48665b6b-b75f-4113-ae92-f0a8ae641283.png. This is an approved-for-review concept, not an implemented Equipment view.

- Shared plum header, Back/currency capsules, cream rounded Nunito text and pink/gold primary action.
- One loadout panel: Mint portrait and level/ATK/DEF on left; six labeled equipment slots on right, preserve rarity colors and selected/empty/new states.
- Separate resource/gift controls from inventory selection and Clean/Sell/Scrap tools.
- Compact weapon grid with selected/equipped, level and comparison indicators.
- Opaque detail panel groups item name, rarity, base ATK/level, implicit/affix modifiers and free mod slots.
- Large Enhance action with exact currency cost; Craft and compact Favourite/Protect actions below. Replace duplicate disabled Protected buttons with contextual explanation.

Implementation must reuse actual GEAR/save data, routing, lock/protection/cost rules and stat comparisons. Native text stays separate from raster art. Preserve scroll and minimum readable labels on small phones; no new stat/currency/mechanic. Generate blank chrome only after concept acceptance; use ordinary cropped images compatible with Canvas/WebGL.
