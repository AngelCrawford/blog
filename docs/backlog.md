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
| 2026-05-08 | 1.2 | Test | Deferred | Visual regression snapshots (`toHaveScreenshot()`) for the growth-stage badge. Story 1.2 covers all ACs via structural assertions; visual baselines were intentionally skipped (cross-machine font-rendering drift). Revisit if a regression slips past the structural suite. |
| 2026-05-08 | 1.3 | UX | Deferred | `$hiddenCount` notice on paginated homepage (page 2+) shows the same site-wide total with no contextual anchor. Revisit when pagination UX is addressed. |
| 2026-05-09 | 1.5 | Test | Deferred | Sitemap XSD-schema validation (against `sitemap-0.9.xsd`) was listed as optional in the story tasks and skipped — current coverage is a structural well-formedness probe plus Hugo build success. Add when CI-grade strictness is needed. |
| 2026-05-09 | — | Feature | Open | **Maintenance mode (Option A):** Add `maintenance_mode: false` to `config/_default/params.yaml`. In `layouts/baseof.html` render a static maintenance page (headline + "Bald wieder da" message) when the flag is `true`. Toggle by changing the param and pushing — GitHub Actions deploys automatically. No new infrastructure needed. Consider making the maintenance copy configurable via params (title, message, expected-back text). |
