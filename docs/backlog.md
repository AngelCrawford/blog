# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story's `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.
- **Done items are pruned, not preserved** — git log and GitHub PRs/issues are the historical record.

| Date | Story | Type | Status | Notes |
| ---- | ----- | ---- | ------ | ----- |
| 2026-05-08 | 1.4 | Test | Open | Add unit test for `scripts/validate-frontmatter.js` itself when introducing `withered_*` conditional-required rules |
| 2026-05-08 | 1.1 | Bug | Open | `scripts/validate-frontmatter.js` reads the **working tree** (`readFileSync(absPath)`) instead of the **staged blob** (`git show :path`). A commit can pass validation while the index still contains broken content (or vice-versa) if working-tree and index drift. Fix: read each target via `git show :"$file"` so validation matches what will actually be committed. |
| 2026-05-08 | 1.2 | Test | Deferred | Visual regression snapshots (`toHaveScreenshot()`) for the growth-stage badge. Story 1.2 covers all ACs via structural assertions; visual baselines were intentionally skipped (cross-machine font-rendering drift). Revisit if a regression slips past the structural suite. |
| 2026-05-08 | 1.2 | Test | Deferred | Automated WCAG-AA contrast verification for growth-stage colors. Color values come from the UX spec (verified manually at design time). Reassess as part of the Epic 9 a11y audit (axe-core + contrast tooling). |
| 2026-05-08 | 1.3 | Bug | Deferred | Path traversal guard in `tests/e2e/build-and-serve.mjs` uses `startsWith(ROOT + sep)` — edge cases at Windows drive root. Low risk for localhost-only dev server; revisit if server is ever exposed beyond localhost. |
| 2026-05-08 | 1.3 | Refactor | Deferred | `xlink:href` deprecated in SVG `<use>` elements across all templates. Codebase-wide pattern; migrate to plain `href` in a future cross-cutting sweep. |
| 2026-05-08 | 1.3 | UX | Deferred | `$hiddenCount` notice on paginated homepage (page 2+) shows the same site-wide total with no contextual anchor. Revisit when pagination UX is addressed. |
| 2026-05-08 | 1.3 | Refactor | Open | Extract format-icon colors into named SCSS variables (`$format-article`, `$format-log`, …) in `assets/scss/vars/_colors.scss` parallel to the existing `$growth-*` variables. Currently inline as hex/HSL on `<svg style="fill: …">` in `card.html` and `_base/footer.html`. Epic 8 (Format Expansion) introduces more formats (Link, Video, Gallery, Portfolio) — best timed as a sweep when Story 8.1 lands so all format colors share the same convention. |
