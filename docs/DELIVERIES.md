<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.71 — ⚫ Sesame less tanky

**Owner:** Sesame felt much tankier than other heroes → approved the proposed cut.
- Base HP bonus +34 → +15 (Cocoa +46 stays the tank).
- Blue Mantle card: damage reduction cap 45% → 25% (card text updated).
- Shields, mist and blue-orb regen stay (blue's identity).

# Previous delivery: v8.2.70 — ▶ Missions start by themselves

**Owner:** change "Start mission" to automatic.
- `MISSION_AUTO_START=true`: no Start mission button · the mission card shows and the mission begins after 1.2 s (`missionArm`) · set false to bring the button back.
- Bots: missions s5 (Defend Nectar ✓) and s9 (Break Roots ✓) start and finish with no tap · 0 errors.
- Note for owner: the yellow hexagon around heroes is the Forge **Barrier** status (`st_p_barrier`), most likely from the "Overflow Cream" gear mod (overheal → timed barrier).
