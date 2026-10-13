# Forge mobile readability — v7.8.6

Owner approved selected changes from the ImageGen preview: one-line results, larger readable/tappable buttons, and only the tier number on the right. This release implements those choices without replacing the game art or changing the crafting rules.

Possible mods show a single short effect label and Tn; flavor names, numeric tier ranges and chance percentages leave the main list. Installed rows retain their actual value with the short effect, plus a tier-only label on the right. Info and Odds retain full effects, values/ranges and weighted chances.

Roll, Tier and Auto are 44px tall. Result-info buttons are 44×44; installed-info buttons have 44px width and the row height. Back and pagination are wider. The smallest portrait layout trims card gaps to preserve a visible result and fixed action footer; landscape omits the redundant footer explanation to avoid overlap. No mod effects, costs, currency balances, migration or paid-choice recovery behavior changed.

Validation: full npm check and build passed. Updated Forge regression covers tier-only labels and enlarged controls. Real Phaser menu QA passed 21 states across seven viewports, text/touch bounds, all-row Roll/Auto/currency charges, old paid-choice recovery, details and modal navigation; no headless combat simulation.
