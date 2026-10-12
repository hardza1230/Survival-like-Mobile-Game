# Equipment redesign — visual concept

Owner requested redesign of 1000031083.jpg, paired with tighter Heroes spacing. ImageGen preview: exec-48665b6b-b75f-4113-ae92-f0a8ae641283.png. This was the initial visual concept. Owner then requested minimal variant exec-58c5a0e3-4574-46ec-b474-4d2013aeff11.png and approved selected elements for implementation in v7.7.21.

- Shared plum header, Back/currency capsules, cream rounded Nunito text and pink/gold primary action.
- One loadout panel: Mint portrait and level/ATK/DEF on left; six labeled equipment slots on right, preserve rarity colors and selected/empty/new states.
- Separate resource/gift controls from inventory selection and Clean/Sell/Scrap tools.
- Compact weapon grid with selected/equipped, level and comparison indicators.
- Opaque detail panel groups item name, rarity, base ATK/level, implicit/affix modifiers and free mod slots.
- Large Enhance action with exact currency cost; Craft and compact Favourite/Protect actions below. Replace duplicate disabled Protected buttons with contextual explanation.

Implementation must reuse actual GEAR/save data, routing, lock/protection/cost rules and stat comparisons. Native text stays separate from raster art. Preserve scroll and minimum readable labels on small phones; no new stat/currency/mechanic. Generate blank chrome only after concept acceptance; use ordinary cropped images compatible with Canvas/WebGL.

## Implemented v7.7.21
Shared Heroes header/buttons; matte darkened existing backdrop, thin rarity/selected borders, labeled equipment slots and compact avatar, four-column readable inventory and independent management controls, grouped native-text item details, preserved original modifier comparisons and upgrade/craft/protection/sell/scrap callbacks. Duplicate disabled Protected buttons replaced with one state-specific explanation. Landscape keeps existing route. No new assets or game mechanics.

Live loading follow-up v7.7.22: restrict Equipment group readiness/lazy loading to current portrait, owned/equipped item artwork and used shared header/button keys. New loot enters the owned set on the next menu rebuild. Other screens keep their original groups. Loadout columns scale with screen width; narrow hero captions wrap.
