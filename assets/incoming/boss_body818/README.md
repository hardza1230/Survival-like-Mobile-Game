# Boss sheet repair — 8.1.18

Owner reported unfinished and poorly cut boss animation sheets. The old816packer cut rigid256px source cells before adding output padding. Some source drawings straddle that nominal grid: output padding hid truncated parts and included pieces of neighboring poses. A clean output border did not prove a correct source cut.

The new packer finds actual transparent source gutters, requires at least five clear pixels at a split, and checks two empty pixels on every source-cell edge BEFORE resizing. Variable crops are placed in common nominal coordinates, then receive one shared uniform transform per actor. Alpha is preserved; no background masking, repainting or per-frame scaling is performed. The original21body drawings remain in boss_body816. Their exact prompts are in ../boss_body816/PROMPTS.json. Source-cell rectangles, content counts and hashes are recorded here.

Five additional original ImageGen atlases supply108selected frames for9earlier minibosses. Four C1 minibosses were still single static images; five others had limited pose sheets. The original Ancient Root Knight has16complete walk/attack frames and five dedicated animations, so that production sheet is retained. The new draft of that knight in pair16's bottom rows is not selected for runtime. GENERATED.json records this explicitly.

Runtime:30sheets /31visual forms /372frames,28,292,916bytes; these include21repaired actors plus9newly animated earlier minibosses. Stage-lazy logical texture keys are retained; literal URLs point to assets/art/boss_body818. Original boss identities, physical size, circles, AI, damage and attack intervals remain. Earlier miniboss pose hooks enter the existing owned animation clock; old four-pose frame1 is translated to an attack instead of idle.

Source QA decodes all384source cells, including the unused knight draft. The selected372frames recover1111painted pixels clipped by rigid source cuts and exclude1111neighboring pixels assigned to the wrong cell (717of each in the original21actors). Every selected runtime frame has been viewed in source compositions. Independent PNG alpha/seam tests verify the real sources; transport hashes and output padding alone are insufficient.

Rebuild: scripts/pack-boss-body818.py. preview.png /preview.gif and all_attack_frames.png are source compositions, not gameplay recordings. Owner will perform phone testing himself.
