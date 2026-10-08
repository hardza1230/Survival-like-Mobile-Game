# Illustrated endings and growth — v6.56.1

Built-in imagegen created two result environments, three story-panel atlases with five illustrations each, and three eight-frame growth effects.

- raw/: unmodified generated PNGs
- result_*.png: normalized 768×1152 result backgrounds
- epilogue_s1..15.png: 768×432 individual story illustrations, matching original stage epilogue events
- growth_*_sheet.png: 2048×256 transparent strips, eight 256px frames
- PROMPTS.json: exact generation prompts
- PACKING.json: normalization and source frame bounds
- SOURCES.json: reproducible repo-relative source map

Runtime: assets/ui/results (victory/defeat), assets/story/epilogues (15 panels), assets/vfx (levelup/mastery/unlock). Original summary panel remains, story words and callbacks remain, Rift skips story as before. Growth uses NORMAL alpha, world effects are tracked and throttled per kind; summary effects are owned by the overlay and cancelled on navigation/redraw/shutdown. Missing art uses original background/FX fallback. Stage loading includes both result backgrounds and its own epilogue.

Original EXP, TP, reward amounts, revive rules, mastery/unlock gating and save progress remain. Owner phone visual/FPS review pending. Reward reveal/Jackpot effects and crafting art are outside this delivery.
