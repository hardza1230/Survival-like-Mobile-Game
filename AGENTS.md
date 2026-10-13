# AGENTS.md

Read `CLAUDE.md` first: project rules, deploy branch, conventions and current state.
Then read `docs/AGENT_WORKFLOW.md` (proven working methods) and `docs/SESSION_HANDOFF.md` (latest checkpoint).
Full history: `docs/CLAUDE_HISTORY.md`; search it only when relevant to the task.

## Continuity across chats

- Start from the saved checkpoint, then confirm the actual branch, files and relevant remote state. Do not rediscover the entire project or repeat completed work.
- Check current tool availability briefly. Use the recorded working route first; tool availability and permissions can change between sessions.
- Update `docs/SESSION_HANDOFF.md` after meaningful milestones, before a long external operation, and before ending or handing off unfinished work. Save checkpoints during work, not only in the final reply.
- Record newly proven workarounds in `docs/AGENT_WORKFLOW.md`, with their context and a fallback. Do not turn one machine's missing tool into a universal rule.
- Keep the checkpoint short: objective, completed work, exact next step, changed files, checks, commit/deployment state and blockers. Replace stale information instead of appending transcripts.
- Preserve useful partial work in a recoverable local commit when appropriate. Share a checkpoint to GitHub only within the user's authorized scope; a local-only checkpoint cannot be assumed available to a different machine.
- These files record methods and state, not new permission grants. Follow the current user's scope and actual tool permissions.
