# Art order 18 J — Storm Mark button icon

Delivered: `ic_taro_storm_mark.png`, exactly 256×256, PNG32 with real alpha, 62,345 bytes. Golden target reticle + central downward lightning bolt + three inward violet/cyan sparks; no text or button frame. Built-in ImageGen prompt and source SHA-256 retained in PROMPTS.json.

QA: complete PNG/CRC/zlib checks, exact pixel round-trip after lossless encoding, transparent border, and visual review at 52px on five backgrounds (QA_52px.png). Final SHA-256: `74790e1120974531f3b9e3ec107c06d167acd255e63abb8cf398ec38edf44430`.

Source delivery only. Runtime code and current game version are unchanged. Pack 256→128 to `assets/art/build_paths/taro_storm_mark.webp` using the existing Taro icon pipeline, register/resolve `ASSET_IMAGES.ic_taro_storm_mark`, then verify the Spark Unique button on phone. Preserve current Storm Mark behavior; historical six-second duration in the old brief is not a request to change gameplay.

Full game tests were not run because the execution environment is offline. No game code, build scripts, runtime textures or balance changed. UPLOAD_VERIFICATION.json records byte-for-byte GitHub readback.
