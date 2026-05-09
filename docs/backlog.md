# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story's `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.
- Items routed to a not-yet-drafted future story belong in `docs/1-planning/epics.md` under that story as a **Pre-Spec Notes** entry — not here.
- **Done items are pruned, not preserved** — git log and GitHub PRs/issues are the historical record.

| Date | Story | Type | Status | Notes |
| ---- | ----- | ---- | ------ | ----- |
| 2026-05-08 | 1.3 | UX | Deferred | `$hiddenCount` notice on paginated homepage (page 2+) shows the same site-wide total with no contextual anchor (no link to the hidden articles, no "show withered" toggle). Revisit when pagination UX is redesigned — fixing in isolation is a half-step without the larger UX context. |
