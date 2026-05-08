# Story 1.2: Growth Stage Badge Component

Status: ready-for-dev

## Story

As a reader,
I want to see a visual growth stage indicator on content cards,
so that I can assess content maturity at a glance.

## Acceptance Criteria

1. Badge displays on each card in the **card footer** (first/left position). **NOTE:** This overrides the Epic 1 AC #1 wording ("top-right corner") — see Dev Notes → "AC Discrepancy Resolution". Architecture ADR-005 + UX Spec mandate footer placement.
2. Four badge variants are implemented with Remix Icon `-line` glyphs and a text label:
   - 🌱 Seedling → `ri-seedling-line`
   - 🌿 Budding → `ri-plant-line`
   - 🌳 Evergreen → `ri-tree-line`
   - 💀 Withered → `ri-skull-line`
3. Stage-specific color is applied to the **icon** (not the background) per UX spec:
   - Seedling `$growth-seedling: hsl(152, 76%, 50%)`
   - Budding `$growth-budding: hsl(189, 90%, 50%)`
   - Evergreen `$growth-evergreen: hsl(152, 76%, 33%)` (matches existing `$success`)
   - Withered `$growth-withered: hsl(0, 0%, 50%)`
4. Tooltip shows full stage name + brief description on hover and keyboard focus (e.g., `title="Seedling — early/draft content"`).
5. Badge renders in **list view** (every card via `_partials/card.html` footer) and in **single page view** (article header metadata row, near date/categories).
6. Badge is accessible:
   - Icon marked decorative (`aria-hidden="true"`), text label provides semantics for screen readers.
   - Tooltip exposed via the `title` attribute on the wrapper element (keyboard-focusable not required because badge is non-interactive).
   - WCAG-AA contrast verified against card background.
7. Mobile responsive: text label hidden on `< 600px` (`@include helpers.mobile { span { display: none; } }`); icon-only with `title` tooltip preserves a11y.
8. Default fallback: badge consumes `default "seedling" .Params.growth_stage` (pattern established by Story 1.1) — articles missing the field render as Seedling without error.
9. No regressions to existing card variants: `.is-horizontal`, `.is-log`, `.has-image`, top-right `.is-new` / `.visited` badges, and category ribbons all render unchanged.

## Tasks / Subtasks

- [ ] Add growth stage color variables (AC: 3)
  - [ ] Edit `assets/scss/vars/_colors.scss` — add `$growth-seedling`, `$growth-budding`, `$growth-evergreen`, `$growth-withered` with HSL values from UX spec
  - [ ] Add a comment block above the new vars: WCAG-AA rationale, source reference to UX spec
  - [ ] Consider aliasing `$growth-evergreen: $success` instead of duplicating the value (decide based on `$success` definition)
- [ ] Create growth badge SCSS component (AC: 1, 3, 6, 7)
  - [ ] Create `assets/scss/elements/growth-badge.scss` following the pattern in `digital-garden-integration-architecture.md` lines 619–648
  - [ ] Base selector: `.card-footer-item.growth-stage` — color, font-size 80%, gap, vertical alignment
  - [ ] Per-stage selectors: `&[data-stage="seedling"] i { color: $growth-seedling; }` (and 3 others)
  - [ ] Mobile breakpoint: `@include helpers.mobile { span { display: none; } }` (icon-only, tooltip preserves label)
  - [ ] Import the new file in `assets/scss/main.scss` (place after `elements/badge.scss` to keep elements grouped)
- [ ] Create growth badge partial (AC: 1, 2, 6, 8)
  - [ ] Create `layouts/_partials/growth-badge.html`
  - [ ] Resolve stage with default: `{{ $stage := default "seedling" .Params.growth_stage }}`
  - [ ] Define stage→icon and stage→label dicts:
    - icons: `seedling: ri-seedling-line`, `budding: ri-plant-line`, `evergreen: ri-tree-line`, `withered: ri-skull-line`
    - labels: `Seedling`, `Budding`, `Evergreen`, `Withered`
    - tooltips: `Seedling — early/draft content`, `Budding — developing`, `Evergreen — mature & maintained`, `Withered — deprecated`
  - [ ] Render markup:
    ```html
    <div class="card-footer-item growth-stage" data-stage="{{ $stage }}" title="{{ $tooltip }}">
      <i class="{{ $icon }}" aria-hidden="true"></i>
      <span>{{ $label }}</span>
    </div>
    ```
  - [ ] Pass page context with `.` so the partial works from card and single contexts: `{{ partial "growth-badge.html" . }}`
- [ ] Wire growth badge into card footer (AC: 1, 5, 9)
  - [ ] Edit `layouts/_partials/card.html` — locate the existing `<footer class="card-footer">` block
  - [ ] Insert `{{ partial "growth-badge.html" . }}` as the **first** footer item (before format/author per UX spec line 313)
  - [ ] Do NOT modify `.is-horizontal`, `.is-log`, `.has-image` variants or the top-right badge / ribbon markup (architecture critical rule line 764)
  - [ ] Verify Bulma's `.card-footer-item` flex behavior accommodates the new item (likely no SCSS change needed)
- [ ] Wire growth badge into single page view (AC: 5)
  - [ ] Read `layouts/single.html` first to confirm article header structure (Hugo v0.146+ flat layout — no `_default/single.html`)
  - [ ] Add `{{ partial "growth-badge.html" . }}` in the article header metadata row, near date/categories — placement decision: inline in `single.html` unless a dedicated article-header partial already exists in `_partials/_base/`
  - [ ] If `layouts/_partials/_base/hero.html` is reused for article headers, verify it before placing the badge there
- [ ] Confirm card layout SCSS spacing (AC: 1, 9)
  - [ ] Edit `assets/scss/layout/card.scss` only if the new footer item visibly disrupts spacing in any variant
  - [ ] Manual visual check of `.is-horizontal`, `.is-log`, `.has-image` cards with the badge active
- [ ] Tooltip enrichment (AC: 4)
  - [ ] Use `title` attribute on the wrapper `div` for the long description (native browser tooltip, no JS)
  - [ ] If keyboard-focus tooltip is desired later, evaluate `assets/scss/elements/tooltip.scss` patterns — out of scope for this story unless trivial
- [ ] Visual regression tests (AC: 1, 2, 3, 5, 7) [Source: test-design-system.md]
  - [ ] Create `tests/e2e/growth-badge.spec.ts`
  - [ ] Test cases: 4 stages × {desktop @1280×800, mobile @375×667} = 8 baseline screenshots
  - [ ] Add a card-list assertion (homepage) and a single-page assertion (one article per stage)
  - [ ] Add an assertion for missing-field article → renders Seedling badge (default fallback path)
  - [ ] Commit baseline screenshots under `tests/e2e/growth-badge.spec.ts-snapshots/`
  - [ ] Verify the test runs locally via `npm run test:e2e` (Playwright config from Story 1.1)
- [ ] Manual smoke test (AC: 1–9)
  - [ ] `hugo server` → spot-check homepage cards: every card has a badge, correct icon and color
  - [ ] Toggle a test article through all 4 stages → badge updates correctly
  - [ ] Inspect a card without `growth_stage` → renders Seedling
  - [ ] Resize viewport `< 600px` → icon-only layout, tooltip still surfaces label
  - [ ] Single-page view for each stage → badge appears in header
  - [ ] Run `axe-core` (Playwright) on a representative page → no new a11y issues
  - [ ] Verify `.is-new` / `.visited` top-right badges and category ribbons still render correctly (regression)
- [ ] Documentation
  - [ ] Append a short "Growth Badge" section to `docs/technical/testing.md` (created in Story 1.1) describing the visual-regression test
  - [ ] Optional: add a small ASCII or screenshot reference in the story Completion Notes

## Dev Notes

### Architectural Context

This story implements the **first visible UI component** of the Digital Garden transformation, building directly on Story 1.1's frontmatter foundation. The badge component is consumed by:

- Card layouts (Epic 1, this story)
- Filter UI (Epic 5, Story 5.3 — same icons + colors)
- Three-tier sorting visualization (Epic 4)
- Withered SEO/RSS treatment (Story 1.5, Epic 9.6)

Get the SCSS variables, partial signature, and `data-stage` attribute right here — downstream stories reuse them.

### ⚠️ AC Discrepancy Resolution (Important)

**Conflict:** Epic 1 (`docs/1-planning/epics.md` lines 125–131) AC #1 says "Badge displays on card (top-right corner)". Architecture ADR-005 (`digital-garden-integration-architecture.md` lines 1400–1428) and UX Spec §1.4 (`ux-design-specification.md` lines 193–345) explicitly mandate **card footer (first/left position)**.

**Resolution:** Follow the architecture. Top-right is reserved for the existing `.is-new` and `.visited` badges (UX spec lines 102–103). ADR-005 explicitly rejected top-right placement on this rationale ("Top-right badge → Rejected (conflicts with New/Visited)").

**Action taken in this story:**
- AC #1 is rewritten to read "card footer".
- AC #3's "color-coded background" is rewritten to "color-coded icon" — UX spec applies the color to the icon, not the badge background, for a tone-on-tone aesthetic. Both treatments satisfy the underlying intent ("readers can distinguish stages at a glance").

**Recommendation:** PM/SM to backport these corrections to `docs/1-planning/epics.md` Story 1.2 in a follow-up housekeeping commit so the Epic and the implementation stay aligned.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md#ADR-005-Growth-Badge-Placement-Card-Footer]
[Source: docs/1-planning/ux-design-specification.md#1.4-Growth-Stage-Integration-Strategy]

### Color Palette (UX Spec authoritative)

| Stage | SCSS Variable | HSL | Hex | Notes |
|---|---|---|---|---|
| Seedling | `$growth-seedling` | `hsl(152, 76%, 50%)` | `#4ade80` | Light green — fresh/new |
| Budding | `$growth-budding` | `hsl(189, 90%, 50%)` | `#16d4f0` | Cyan — developing |
| Evergreen | `$growth-evergreen` | `hsl(152, 76%, 33%)` | `#118855` | Deep green — matches existing `$success` |
| Withered | `$growth-withered` | `hsl(0, 0%, 50%)` | `#808080` | Gray — archived |

[Source: docs/1-planning/ux-design-specification.md (lines 283–292)]

### Markup Pattern (UX Spec authoritative)

```html
<div class="card-footer-item growth-stage"
     data-stage="seedling"
     title="Seedling — early/draft content">
  <i class="ri-seedling-line" aria-hidden="true"></i>
  <span>Seedling</span>
</div>
```

[Source: docs/1-planning/ux-design-specification.md (lines 229–241, 244–280)]

### SCSS Component Pattern (Architecture authoritative)

```scss
// assets/scss/elements/growth-badge.scss
.card-footer-item.growth-stage {
  color: $light;
  font-size: 80%;

  i {
    font-size: 1.2em;
    line-height: 1;
  }

  &[data-stage="seedling"] i { color: $growth-seedling; }
  &[data-stage="budding"]   i { color: $growth-budding; }
  &[data-stage="evergreen"] i { color: $growth-evergreen; }
  &[data-stage="withered"]  i { color: $growth-withered; }

  @include helpers.mobile {
    span { display: none; }
  }
}
```

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 619–648)]

### Default Value Consumption (from Story 1.1)

Story 1.1 established the convention `default "seedling" .Params.growth_stage`. This story is the **first consumer** — the badge partial MUST use it so missing-field articles render Seedling without error. Build-time validation (Story 1.1) guarantees only valid enum values reach the template.

[Source: docs/sprint-artifacts/1-1-growth-stage-frontmatter-field.md#Default-Value-Fallback-AC-3]

### Component Inventory Position

| Component | File | Position | Status |
|---|---|---|---|
| Top badges (New / Visited) | `assets/scss/elements/badge.scss` | Top-right (existing) | UNCHANGED |
| Category ribbons | `assets/scss/elements/ribbon.scss` | Top-left (existing) | UNCHANGED |
| Growth stage badge | `assets/scss/elements/growth-badge.scss` | Card footer (NEW) | **This story** |

The growth badge does not modify or extend `badge.scss`. They are independent components.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 79–92, 1400–1428)]

### Critical Agent Rules (apply to this story)

From `digital-garden-integration-architecture.md` lines 762–771:

1. **Never modify existing card variants** (`.is-horizontal`, `.is-log`, `.has-image`).
2. **Always add new features to card footer** (this story complies).
3. **Never use jQuery** — vanilla CSS-only badge in this story; no JS needed.

### Project Structure Notes

- Partial naming: kebab-case (`growth-badge.html`). Architecture line 568 mentions PascalCase for partials — that line is inconsistent with the actual codebase, which uses kebab-case (verified: `card.html`, `_base/head.html`, etc.). Following codebase convention.
- SCSS file: `assets/scss/elements/growth-badge.scss` per architecture line 84.
- Frontmatter field `growth_stage` (snake_case) — already established by Story 1.1.
- HTML class `.growth-stage` (kebab-case) per architecture line 578.
- Data attribute `data-stage` per architecture line 580 + UX spec markup.
- Hugo v0.146+ flat layout: `layouts/single.html`, `layouts/baseof.html` — no `_default/` subdirectory.

### Learnings from Previous Story

**From Story 1-1-growth-stage-frontmatter-field (Status: ready-for-dev)**

- **Frontmatter field is in place:** `growth_stage` enum {seedling, budding, evergreen, withered}, default `"seedling"` via `default "seedling" .Params.growth_stage`. **First consumer of this pattern is this story — use it everywhere the badge reads the field.**
- **Build-time validation is in place:** `layouts/_partials/_base/validate-growth-stage.html` halts builds on invalid values. The badge does not need to re-validate.
- **JSON Schema as single source of truth:** `schemas/frontmatter/article.schema.json`. If future stories need the enum in JS (e.g., filter UI), they should import from the schema, not duplicate.
- **Editor (Zed) and pre-commit (git hook + ajv) layers exist** — do not bypass.
- **Test infrastructure is bootstrapped:** Playwright + node test runner from Story 1.1. Add visual-regression tests under `tests/e2e/` directly; no infra setup needed.
- **Partial convention:**
  - `_partials/_base/` — layout-init partials (head, nav, footer, seo, hero, validate-growth-stage)
  - `_partials/` (top-level) — component partials (card.html, and now growth-badge.html)
- **Hugo v0.146+ flat layouts:** templates live at `layouts/baseof.html`, `layouts/single.html` — Task 5 (single-page wiring) targets `layouts/single.html`.
- **Confirm `.github/workflows/test.yml` (or similar) exists** before adding CI steps for new tests — Story 1.1 may have created it.

[Source: docs/sprint-artifacts/1-1-growth-stage-frontmatter-field.md#Dev-Notes]

### File List (planned changes)

**SCSS:**
- **NEW:** `assets/scss/elements/growth-badge.scss`
- **MODIFY:** `assets/scss/vars/_colors.scss` — add 4 growth stage variables
- **MODIFY:** `assets/scss/main.scss` — `@import "elements/growth-badge"` after badge import
- **MODIFY (only if needed):** `assets/scss/layout/card.scss` — footer flex spacing

**Hugo Templates:**
- **NEW:** `layouts/_partials/growth-badge.html`
- **MODIFY:** `layouts/_partials/card.html` — invoke growth-badge partial as first footer item
- **MODIFY:** `layouts/single.html` — invoke growth-badge partial in article header metadata row (path confirmed via Task 5 read-first step)

**Tests:**
- **NEW:** `tests/e2e/growth-badge.spec.ts`
- **NEW:** `tests/e2e/growth-badge.spec.ts-snapshots/` (Playwright baselines, committed)

**Documentation:**
- **MODIFY:** `docs/technical/testing.md` — append visual-regression section for growth badge

### Out of Scope (deferred elsewhere)

- Filter UI integration with badges — Epic 5, Story 5.3
- Withered-specific styling on the warning banner — Story 1.4
- Three-tier sorting visualization — Epic 4
- Migration of existing articles to assign meaningful `growth_stage` values — manual content task tracked in `docs/todo.md`. Default fallback (`seedling`) keeps existing articles building cleanly.

### References

- [Source: docs/1-planning/epics.md#Story-1.2-Growth-Stage-Badge-Component] — Story 1.2 acceptance criteria
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md#ADR-005-Growth-Badge-Placement-Card-Footer] — Footer placement decision (overrides Epic AC1)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md] (lines 79–92, 131–150) — File map for Epic 1 components
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md] (lines 619–648) — Authoritative SCSS pattern
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md] (lines 762–771) — Critical agent rules: card footer placement, no jQuery, no card-variant modifications
- [Source: docs/1-planning/ux-design-specification.md#1.4-Growth-Stage-Integration-Strategy] (lines 193–345) — Full design spec
- [Source: docs/1-planning/ux-design-specification.md] (lines 283–292) — Color palette (HSL/hex)
- [Source: docs/1-planning/ux-design-specification.md] (lines 294–297) — Remix Icon mapping
- [Source: docs/1-planning/ux-design-specification.md] (lines 305–318) — Card layout positioning ASCII diagram
- [Source: docs/sprint-artifacts/1-1-growth-stage-frontmatter-field.md#Default-Value-Fallback-AC-3] — Default `seedling` consumption pattern
- [Source: docs/sprint-artifacts/1-1-growth-stage-frontmatter-field.md#Test-Strategy] — Playwright + visual regression infrastructure
- [Source: docs/2-solutioning/test-design-system.md] — Test architecture for visual regression
- [Source: layouts/_partials/card.html] — Existing card partial (modification target)
- [Source: layouts/single.html] — Existing single-page template (modification target — read first)
- [Source: assets/scss/elements/badge.scss] — Existing top-right badge (reference for separation, NOT modified)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-1/1-2-growth-stage-badge-component.context.xml

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-06 | Initial draft created from `epics.md` Story 1.2, `digital-garden-integration-architecture.md` (ADR-005, SCSS pattern, file map, agent rules), `ux-design-specification.md` §1.4 (markup, colors, icons, mobile), and `1-1-growth-stage-frontmatter-field.md` (default fallback, test infra, partial conventions). AC #1 (top-right → footer) and AC #3 (background color → icon color) reconciled with architecture/UX; discrepancy flagged for Epic backport. Effort ≈ 2 days per Epic. | SM (create-story workflow, Bob) |
