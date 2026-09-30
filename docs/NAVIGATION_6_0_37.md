# v6.0.37

- Bazaar and Heroes tabs share painted navigation art. Active tabs have a gold outline; inactive tabs remain readable.
- Bazaar Refresh has a dedicated row below the tab bar and above products. Tests use the real portrait header shift (30px) and verify Refresh does not overlap any tab at 320×568, 390×844 and 768×390.
- Story stage cards start immediately at the baseline difficulty. There is no Normal/Hard/Hell screen or curse ticket. Special Endgame mode rules are retained. Old difficulty entry routes forward directly to the same story start method.
- Equipment comparison uses one `ATK 1-2` row instead of separate Base ATK minimum and maximum lines. Combat values remain unchanged.
- Card selection no longer renders or accepts Reroll/Banish actions. Unused saved perk data is preserved.

## Art

Runtime file: `assets/art/ui/painted_nav_button.png`.
Generated with the built-in imagegen tool. Prompt: one transparent, front-facing hand-painted candy fantasy RPG button with a deep plum enamel face, cream mochi bevel and brushed gold rim; tiny pink gem at the left and mint accent at the right; empty center, no text, no letters, no watermark or background shadow. Designed for navigation tabs 80–130 pixels wide.

The source image is kept unchanged. Phaser slices the button frame at x=93, y=135, width=1985, height=425; labels are rendered as game text.

## Validation

`npm run check` and `npm run build:www` pass, including compact ATK formatting, direct story entry, removal of card actions, and small-screen Refresh separation. Physical mobile-device visual testing has not been performed.
