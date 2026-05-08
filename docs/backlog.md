# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story's `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.
- **Done items are pruned, not preserved** — git log and GitHub PRs/issues are the historical record.

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
| ---- | ----- | ---- | ---- | -------- | ----- | ------ | ----- |
| 2026-05-08 | 1.4 | 1 | Test | Med | TBD | Open | Add unit test for `scripts/validate-frontmatter.js` itself when introducing `withered_*` conditional-required rules |
| 2026-05-08 | 1.1 | 1 | Bug | Med | TBD | Open | `scripts/validate-frontmatter.js` reads the **working tree** (`readFileSync(absPath)`) instead of the **staged blob** (`git show :path`). A commit can pass validation while the index still contains broken content (or vice-versa) if working-tree and index drift. Fix: read each target via `git show :"$file"` so validation matches what will actually be committed. |
| 2026-05-08 | 1.2 | 1 | Test | Low | TBD | Deferred | Visual regression snapshots (`toHaveScreenshot()`) for the growth-stage badge. Story 1.2 covers all ACs via structural assertions; visual baselines were intentionally skipped (cross-machine font-rendering drift). Revisit if a regression slips past the structural suite. |
| 2026-05-08 | 1.2 | 9 | Test | Low | TBD | Deferred | Automated WCAG-AA contrast verification for growth-stage colors. Color values come from the UX spec (verified manually at design time). Reassess as part of the Epic 9 a11y audit (axe-core + contrast tooling). |
