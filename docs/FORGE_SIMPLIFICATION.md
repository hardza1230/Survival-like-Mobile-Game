# Simpler Affix Forge — v7.8.5

Owner feedback: Back looped between Forge and Gear & Power; differing row acquisition and targeted Utility families felt too complex/easy; mod text was too long.

Back now truncates history at Gear & Power and sets the current menu before rebuilding. This prevents the generic forward-navigation code from recording Forge again.

Every row installs one weighted random compatible mod immediately for one corresponding currency: Power / Spark Sugar, Sustain / Twist Cream, Utility / Wild Jam. Utility includes all enabled compatible families, regardless of stale family selection. Row identity and item-slot restrictions remain. Auto uses the selected row and currency. Tier retention, tier rerolls, existing mod effects and currency balances remain.

Only old saves can still have paid Sustain choices: those retain the recovery UI and consume no extra currency when chosen. New Sustain rolls create no choice.

Lists and installed rows use short effect labels; information panels retain the full condition, preview values and chances. 150 catalog / 78 active / 72 gated remains.

Validation: full npm run check and npm run build:www passed. Real Phaser menu QA passed 21 states across seven viewports, including one-result Sustain/Utility rolls, all-row Auto currency/target results, paid-choice recovery, details and text/hit bounds. A separate real-menu navigation check used the native buildMenuScreen bookkeeping and confirmed Forge → Gear & Power → Hub. No headless combat simulation; owner phone feel remains manual QA.
