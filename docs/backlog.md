# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story's `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.
- **Done items are pruned, not preserved** — git log and GitHub PRs/issues are the historical record.

| Date | Story | Type | Status | Notes |
| ---- | ----- | ---- | ------ | ----- |
| 2026-05-08 | 1.2 | Test | Deferred | Visual regression snapshots (`toHaveScreenshot()`) for the growth-stage badge. Story 1.2 covers all ACs via structural assertions; visual baselines were intentionally skipped (cross-machine font-rendering drift). Revisit if a regression slips past the structural suite. |
| 2026-05-08 | 1.2 | Test | Deferred | Automated WCAG-AA contrast verification for growth-stage colors. Color values come from the UX spec (verified manually at design time). Reassess as part of the Epic 9 a11y audit (axe-core + contrast tooling). |
| 2026-05-08 | 1.3 | Bug | Deferred | Path traversal guard in `tests/e2e/build-and-serve.mjs` uses `startsWith(ROOT + sep)` — edge cases at Windows drive root. Low risk for localhost-only dev server; revisit if server is ever exposed beyond localhost. |
| 2026-05-08 | 1.3 | UX | Deferred | `$hiddenCount` notice on paginated homepage (page 2+) shows the same site-wide total with no contextual anchor. Revisit when pagination UX is addressed. |
| 2026-05-08 | 1.3 | Refactor | Open | Extract format-icon colors into named SCSS variables (`$format-article`, `$format-log`, …) in `assets/scss/vars/_colors.scss` parallel to the existing `$growth-*` variables. Currently inline as hex/HSL on `<svg style="fill: …">` in `card.html` and `_base/footer.html`. Epic 8 (Format Expansion) introduces more formats (Link, Video, Gallery, Portfolio) — best timed as a sweep when Story 8.1 lands so all format colors share the same convention. |
| 2026-05-09 | 1.5 | Bug | Deferred | `layouts/_partials/_base/seo.html` BlogPosting emits multiple top-level `"author":` keys when an article has multiple authors (duplicate-key JSON; parsers pick last/first inconsistently, Schema.org consumers see only one). Fix: build a `[]` of author objects in the `range`, jsonify once. Best routed to Story 9.2 (Schema.org Structured Data). |
| 2026-05-09 | 1.5 | Refactor | Deferred | `\| safeJS` after `\| jsonify` only applied to the BlogPosting JSON-LD block in `seo.html`. Same double-escape risk applies to any other `<script>` block using `jsonify` in the codebase — sweep when adding more JSON-LD types or before the next Schema.org-touching story. |
| 2026-05-09 | 1.5 | Test | Deferred | Sitemap XSD-schema validation (against `sitemap-0.9.xsd`) was listed as optional in the story tasks and skipped — current coverage is a structural well-formedness probe plus Hugo build success. Add when CI-grade strictness is needed. |
| 2026-05-09 | — | Feature | Open | **Maintenance mode (Option A):** Add `maintenance_mode: false` to `config/_default/params.yaml`. In `layouts/baseof.html` render a static maintenance page (headline + "Bald wieder da" message) when the flag is `true`. Toggle by changing the param and pushing — GitHub Actions deploys automatically. No new infrastructure needed. Consider making the maintenance copy configurable via params (title, message, expected-back text). |
