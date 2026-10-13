# Forge mod readability — v7.8.4

The previous list reused one icon for every mod in a row. It now uses cached Canvas icons: a pictogram for the effect, a category color, and a small catalog seal for the individual identity. All 150 catalog entries have separate texture keys; the existing 78 active / 72 gated split is unchanged. Icons are created only when shown and reused on redraw, without extra downloads.

Result rows lead with the effect and retain the flavor name underneath. Tracking adds a check without replacing the mod icon. Installed mods and paid Sustain options use the same pictograms. Installed values appear before the effect so truncation cannot hide the value. Installed rows have an information button; empty rows retain their selection arrow.

Details wrap the full effect, show the preview-tier value, weighted chance and the mod being replaced. Current-row information selects that row before calculating the preview. The numeric value uses the existing mod formatter; no combat behavior, tier bands, costs or saves are changed.

Validation: full `npm run check`, `npm run build:www`, 150 icon identities / core semantic distinctions / cached texture reuse. Real Phaser Canvas menu QA at seven viewports (21 Power, Sustain and Utility states), text and touch bounds, paid Choose, Equip, Roll and Tier, targets and navigation. Details also checked at each Power viewport. Menu-only synthetic saves; no headless gameplay simulation. Physical phone feel remains user QA.
