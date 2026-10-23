# In progress - v7.9.97 reward discovery theater

Owner requests redesign and runtime integration of new-item/feature reveal backgrounds (screenshot orange oversized combat glow over Lobby). Base6ae5a85,v7.9.96;no concurrent remote updates on initial fetch.

Created built-in ImageGen portrait confectionery theater,original.png and exact PROMPT.txt retained in assets/incoming/reveal_theater/. Runtime512x768 WebP in assets/art/mobile_ui_789/reveal_theater.webp,manifest retained. Opaque plum/cream/gold arch and pedestal replaces Lobby bleed and orange vortex. Integrated shared background with lazy load/fallback/late-callback guard into feature reveal,Gacha,Bazaar/trade-in result and stage reward. Feature Ruby panel refined;rewards/glow scale bounded;icon anchors above pedestal. Existing reward mutations/claim/fly destinations preserved. Version7.9.97.

Required npm run check and build passed on final runtime (.git/reveal-final-check.log,.git/reveal-final-build.log),1936 runtime assets. New runtime49,122bytes;decoded1.5MiB. Actual production feature and Gacha result captured at320x568,360x780,412x915;feature text bounds and page-error checks passed. All six proofs in asset source folder. Review fixture now preloads the actual discovery,mascot,glow,dot and first-gear textures. No combat simulation.

Next: publish exact staged tree to expected6ae5a8525babbec64be4ebd668b2c52e99ec5bf9 via GitHub connector;verify Pages/Android/live7.9.97 and new runtime SHA256. No concurrent remote changes on latest fetch. Not yet deployed.
