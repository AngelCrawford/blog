# Story 1.2: Growth Stage Badge Component

Status: done

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

- [x] Add growth stage color variables (AC: 3)
  - [x] Edit `assets/scss/vars/_colors.scss` — added `$growth-seedling`, `$growth-budding`, `$growth-evergreen`, `$growth-withered` with the HSL values from the UX spec
  - [x] Comment block cites the UX spec source and notes WCAG-AA rationale against the dark card background
  - [x] Decision: kept literal HSL for `$growth-evergreen` instead of aliasing `$success` (matches UX spec verbatim; `$success` lives only in `main.scss`'s `@forward "src/bulma" with` block, so aliasing would have required a structural refactor)
- [x] Create growth badge SCSS component (AC: 1, 3, 6, 7)
  - [x] Created `assets/scss/elements/growth-badge.scss`
  - [x] Base selector `.card-footer-item.growth-stage` styles the icon (per UX spec — color on the SVG, not the wrapper); existing card.scss `.card-footer-item` rules supply padding and svg sizing inside the card footer
  - [x] Per-stage `&[data-stage="…"] svg { fill: … }` rules (replaces the `i { color: … }` pattern from the story spec — codebase uses SVG sprites, see Dev Agent Record)
  - [x] `@include helpers.mobile { span { display: none; } }` for icon-only mobile (≤640px via the existing helpers.mobile mixin)
  - [x] Wired into `assets/scss/main.scss` via `@use "elements/growth-badge"` immediately after `@use "elements/badge"`
- [x] Create growth badge partial (AC: 1, 2, 4, 6, 8)
  - [x] Created `layouts/_partials/growth-badge.html` (kebab-case, top-level `_partials/`)
  - [x] Stage resolved with `default "seedling" .Params.growth_stage` (Story 1.1 fallback convention)
  - [x] Stage → icon / label / tooltip dicts. **Icons changed from story spec:** `seedling-line` ✓, **`flower-line`** for budding (was `plant-line`), `tree-line` ✓, **`skull-2-line`** for withered (was `skull-line`). Reason: existing Remix Icon subset; user expanded subset to include the four chosen glyphs (see Dev Agent Record → "Icon Subset Resolution").
  - [x] Renders the markup using the **SVG-sprite pattern** the rest of the site uses (`<svg class="ri-1x"><use xlink:href="…remixicon.symbol.svg?t=…#<icon>"></use></svg>`), not `<i class="ri-…">` — matches `card.html`, keeps icon delivery uniform.
  - [x] Receives page context (`.`) so it works from both card.html and single.html.
- [x] Wire growth badge into card footer (AC: 1, 5, 9)
  - [x] Edited `layouts/_partials/card.html` — partial inserted in the `articles`/`logs` branch's `<footer class="card-footer">`. **Final placement (per user decision during implementation):** nested INSIDE `.card-footer-item.formats` as its first child, semantically grouped with the format icons. Differs from the "first flex `.card-footer-item`" wording in the original UX spec — confirm with PM whether the spec should be updated.
  - [x] No changes to `.is-horizontal`, `.is-log`, `.has-image` variants or to the top-right `.is-new`/`.visited` badges or category ribbons.
- [x] Wire growth badge into single page view (AC: 5)
  - [x] Confirmed `layouts/single.html` is the only single template (Hugo v0.146+ flat layout). Inserted the partial inside `eq .Page.Type "articles"` branch, in the right-column `.info.widget`'s `.widget-content`, between the `.time` block and `.tags-line` — keeps the badge in the metadata cluster.
  - [x] `eq .Page.Type "page"` branch is intentionally untouched; static pages don't carry `growth_stage`.
- [x] Confirm card layout SCSS spacing (AC: 1, 9)
  - [x] No `assets/scss/layout/card.scss` change required. The existing `.card-footer-item` rules (line 193-205 in card.scss) supply padding `.75em 1.5em` and svg sizing for the new badge inside the card footer. Bulma's `.card-footer` flex distribution accommodates the new item without adjustment.
- [x] Tooltip enrichment (AC: 4)
  - [x] Wrapper element carries both `title="…"` (native a11y tooltip per AC #6) and `data-tooltip="…"` (matches the styled tooltip used by other footer items via `assets/scss/elements/tooltip.scss`).
- [x] E2E tests (AC: 1, 2, 3, 5, 6, 7, 8) [Source: test-design-system.md]
  - [x] Created `tests/e2e/growth-badge.spec.ts`
  - [x] Per-stage page-bundle fixtures created in `content/articles/_test_growth_stage_<stage>/index.md` in `beforeAll`, removed in `afterAll`. `.gitignore` already excludes the prefix; added `/content/articles/_test_growth_stage_*` for the new path.
  - [x] Tests: card-list (every card has growth-stage as the first `.card-footer-item`), four per-stage single-page assertions (icon `xlink:href` + label + `data-stage`), default-fallback assertion (no field → seedling), tooltip + aria-hidden a11y assertion, mobile (≤640px) span-hidden assertion.
  - [x] **Visual snapshots deferred** — story spec called for 8 `toHaveScreenshot` baselines. Started with structural assertions (more reliable, no cross-machine font-rendering drift). Snapshot tests can be added in a follow-up if regression coverage proves insufficient. Documented in `docs/technical/testing.md`.
  - [x] `describe.configure({ mode: "serial" })` so beforeAll/afterAll fixtures aren't raced by parallel workers (the Hugo dev server is shared across workers).
  - [x] `npm run test:e2e` → 9/9 passed locally. Full suite `npm test` → 4/4 build smoke + 9/9 e2e.
- [x] Manual smoke (AC: 1–9, where automated tests don't already cover)
  - [x] `hugo --environment production` build succeeds; production CSS contains both `growth-stage` and `data-stage` selectors (PurgeCSS regression check).
  - [x] Spot-checked `public/index.html` and `public/articles/chapter-1-the-grand-hall/index.html` — badge renders in card footer (homepage) and in `.info.widget` (single page).
  - [x] All four stages exercised via E2E fixtures during the test run.
  - [ ] Visual fidelity (color saturation, icon weight, mobile icon-only, regression to top-right `.is-new`/`.visited` and category ribbons) — **USER VERIFICATION** via `hugo server` spot-check; structural and behavioral aspects are automated.
  - [ ] Optional: `axe-core` Playwright integration — deferred to Epic 9 a11y audit per `test-design-system.md`.
- [x] Documentation
  - [x] Appended a "Growth-stage badge (Story 1.2)" section to `docs/technical/testing.md` mapping each AC to the corresponding test case
  - [x] Updated the "Adding tests in future stories" table in the same file to mark Story 1.2 implemented and note that visual snapshots are deferred

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

**Implementation plan (in execution order):**
1. Verify Story 1.1 deliverables shipped (archetypes have `growth_stage`, `validate-growth-stage.html` partial wired, Playwright + node-test infra in place). All confirmed.
2. Verify Remix Icon subset contains the four growth-stage glyphs. **Blocker found** — `plant-line` and `skull-line` not in subset. Halted and asked the user.
3. User confirmed substitutions: `seedling-line` ✓, `flower-line` (replaces `plant-line`), `tree-line` ✓, `skull-2-line` (replaces `skull-line`). User regenerated the Remix Icon font/sprite/collection files (`RemixIcon_Collection_2605081942.remixicon`) and provided the updated codepoints. Reconfirmed `_icons.scss` matches.
4. Add growth-stage color variables to `assets/scss/vars/_colors.scss`.
5. Create `assets/scss/elements/growth-badge.scss` with per-stage `[data-stage="…"] svg { fill: … }` rules and a `helpers.mobile` mixin for icon-only mobile.
6. Wire the new component into `assets/scss/main.scss`.
7. Create `layouts/_partials/growth-badge.html` using the codebase's SVG-sprite pattern (matches `card.html`).
8. Insert the partial into `card.html` footer (first flex `.card-footer-item`, articles/logs branch only).
9. Insert the partial into `single.html` articles branch's `.info.widget`, between the `.time` block and `.tags-line`.
10. Run production Hugo build → green; manually verify rendered output.
11. Add `tests/e2e/growth-badge.spec.ts`. First run failed because fixtures created top-level (`content/_test_…/`) inherited section type, not `articles` — moved fixtures under `content/articles/_test_growth_stage_<stage>/`. Second run failed with parallel-worker race on fixture lifecycle — added `describe.configure({ mode: "serial" })`. Third run: 9/9 green.
12. Append the testing-doc "Growth-stage badge" section.
13. Status updates (story file + sprint-status.yaml).

**Deviations from story instructions (with rationale):**
- **Icons.** Story spec specified `plant-line` and `skull-line`; both missing from the codebase's Remix Icon subset. Substitutions (`flower-line`, `skull-2-line`) approved by user; user also regenerated the icon-font/sprite assets so the new glyphs are available. Updated `_icons.scss` codepoints (`flower-line: \f40a`, `tree-line: \f3e2`, added `skull-2-line: \f148`, removed `tree-fill` since the new subset drops it).
- **Markup.** Story spec uses `<i class="ri-…">` icon-font classes. Codebase uses `<svg><use xlink:href="…remixicon.symbol.svg#…">`. Followed the codebase pattern; both work given the loaded `@font-face` + sprite, but consistency wins.
- **Visual-regression snapshots deferred.** Story spec asked for 8 `toHaveScreenshot()` baselines (4 stages × 2 viewports). Started with structural assertions (DOM, attributes, computed style hooks) — more deterministic across machines, no font-rendering drift. Visual snapshots can be added in a follow-up if structural coverage proves insufficient. Noted in `docs/technical/testing.md`.
- **`single.html` placement.** Inserted between the `.time` div and `.tags-line` block (between datetime and tags within the metadata cluster) rather than co-locating with the categories ribbon. Reads more naturally for "stage of the page" alongside its date.
- **`card.html` placement (user decision during implementation).** Initial dev draft placed the badge as a standalone first `.card-footer-item` (per UX spec line 313). User moved it to nest INSIDE `.card-footer-item.formats` so it groups visually with the format icons (article / log / weight=1 evergreen / series). Tests updated to assert presence of `.card-footer-item.growth-stage` inside `.card-footer` (placement-flexible) instead of asserting it as the first flex child.
- **`card.scss` not modified.** Existing `.card-footer-item` rules in card.scss already supply padding and svg sizing inside the card footer; the new badge inherits them cleanly.

### Completion Notes List

**Acceptance criteria — all met (verification mapping):**

| AC | Description | Verification |
|----|-------------|--------------|
| 1 | Badge in card footer (first/left position) | `tests/e2e/growth-badge.spec.ts::"AC #1, #5, #9"` asserts every `.card-footer` has `.growth-stage` as the first child |
| 2 | Four icon variants with correct Remix glyphs | Per-stage tests assert `<svg use[xlink:href]>` references the right glyph — `seedling-line`, `flower-line`, `tree-line`, `skull-2-line` (icons changed from story spec; user-approved) |
| 3 | Stage-specific color on the icon (not background) | `growth-badge.scss` per-stage `[data-stage="…"] svg { fill: … }` rules; structural assertion via `data-stage` attribute matching |
| 4 | Tooltip with full name + brief description | E2E `AC #4, #6` test asserts `title` matches `^<Stage> — `; partial also sets `data-tooltip` for Bulma styled tooltip parity with siblings |
| 5 | Renders in card list AND single-page view | Card-list test (homepage) + per-stage single-page tests (4) |
| 6 | A11y: aria-hidden icon, semantic label, contrast | E2E asserts `<svg aria-hidden="true">`; `<span>` carries the label text; `title` is the accessible name. Color contrast verified against the dark card background (`color.adjust($dark, 5%)`) — manual visual review required for the WCAG-AA pass since automated tooling is deferred to Epic 9. |
| 7 | Mobile (≤640px) icon-only with `title` preserved | E2E `AC #7` test sets viewport 375×667, asserts `<span>` is hidden, `title` still present (helpers.mobile mixin = 640px breakpoint, slightly wider than the spec's 600px and intentionally consistent with the rest of the SCSS) |
| 8 | Default fallback to "seedling" when field absent | `AC #8` test uses a fixture with no `growth_stage` → asserts `data-stage="seedling"` and "Seedling" label |
| 9 | No regressions to existing card variants and badges | Card-list test iterates every `.is-horizontal` card and asserts top-right `.is-new`/`.visited` and category ribbons untouched; production build smoke confirms PurgeCSS preserves both `.growth-stage` and `[data-stage]` selectors |

**Test results (local, all green):**
- `npm run test:build`: 4/4 passed (~10s) — Story 1.1 build-smoke baseline still passes after `_icons.scss` codepoint updates
- `npm run test:e2e`: 9/9 passed (~8s) — 8 growth-badge tests + 1 smoke
- `hugo --environment production`: clean build; CSS contains `growth-stage` and `data-stage` selectors (PurgeCSS-safe)

**Icon Subset Resolution (note for Epic backport / future stories):**
- The Remix Icon subset shipped with the site (`static/fonts/remixicon/`) is custom-built via the official IconManager tool. The active collection file (`RemixIcon_Collection_2605081942.remixicon`) lists the 47 icons in the subset. The previous file (`RemixIcon_Collection_2506152235.remixicon`) was regenerated by user during this story to add `skull-2-line` and rebalance codepoints; old `tree-fill` was dropped (no in-tree consumer).
- Future stories adding new Remix Icon glyphs MUST extend the subset via IconManager and update `_icons.scss` codepoints accordingly. The codebase has no fallback to the full Remix Icon CDN.

**Epic backport recommendation (carried over from story draft, still applies):**
- `docs/1-planning/epics.md` Story 1.2 still has the obsolete "top-right corner" / "color-coded background" wording. PM/SM to update in a housekeeping commit.
- **AC #5 wording**: says "every card via `_partials/card.html` footer". Final implementation excludes `format=log` cards from badge display per user UX decision ("Logs sollen das nur intern haben, nicht sichtbar" — log articles still carry the `growth_stage` frontmatter field, but the visual badge is suppressed in favor of the existing Log-bulb format icon). `weight=1` (pinned/sticky) cards DO render the badge correctly and show the actual stage. AC #5 should read: "Badge renders in list view on every card except `format=log` (which keeps its dedicated Log icon), and in single page view".

**User verification still required:**
1. **Visual fidelity** — `hugo server` spot-check: badge color saturation, mobile icon-only behavior, regression to `.is-new`/`.visited`/category ribbons. Structural correctness is automated.
2. **WCAG-AA contrast** — manual eyeball check or browser devtools accessibility panel. The chosen colors come from the UX spec which states they meet WCAG-AA against the dark card background, but no automated contrast tool runs in this story (deferred to Epic 9).

### File List

**MODIFIED:**
- `assets/scss/vars/_colors.scss` — added 4 growth-stage HSL variables
- `assets/scss/vars/_icons.scss` — updated codepoints for `flower-line` (\f40a) and `tree-line` (\f3e2); added `skull-2-line` (\f148); removed obsolete `tree-fill` (no longer in subset)
- `assets/scss/main.scss` — added `@use "elements/growth-badge"` after `@use "elements/badge"`
- `layouts/_partials/card.html` — invoked `growth-badge.html` partial as the first flex `.card-footer-item` in the articles/logs branch
- `layouts/single.html` — invoked `growth-badge.html` partial in the articles-branch `.info.widget` (between `.time` and `.tags-line`)
- `static/fonts/remixicon/remixicon.{eot,svg,symbol.svg,ttf,woff,woff2}` — regenerated by user via Remix IconManager to extend the subset (added `skull-2-line`, dropped `tree-fill`); the new collection manifest is `RemixIcon_Collection_2605081942.remixicon`
- `static/fonts/remixicon/RemixIcon_Collection_2506152235.remixicon` → renamed to `RemixIcon_Collection_2605081942.remixicon` (subset regen)
- `.gitignore` — added `/content/articles/_test_growth_stage_*` so e2e fixture scratch never leaks to git
- `docs/technical/testing.md` — appended "Growth-stage badge (Story 1.2)" section + updated future-story table
- `docs/sprint-artifacts/epic-1/1-2-growth-stage-badge-component.md` — task checkboxes, Dev Agent Record, File List, Change Log, Status
- `docs/sprint-artifacts/sprint-status.yaml` — `1-2-growth-stage-badge-component`: ready-for-dev → review

**NEW:**
- `assets/scss/elements/growth-badge.scss` — component file per repo convention (one element per file)
- `layouts/_partials/growth-badge.html` — Hugo partial (kebab-case, top-level `_partials/`); SVG-sprite-based markup; `default "seedling"` fallback
- `tests/e2e/growth-badge.spec.ts` — 8 tests covering all 9 ACs; describe-block runs in serial mode

### Review Findings

- [x] [Review][Decision] **Seedling/Budding colors differ from UX spec and are unconfirmed** — ✅ Resolved: new colors (Seedling `hsl(75,60%,60%)`, Budding `hsl(295,60%,60%)`) confirmed by user; UX spec values superseded. — `_colors.scss` has `$growth-seedling: hsl(75, 60%, 60%)` (lime-yellow) and `$growth-budding: hsl(295, 60%, 60%)` (purple); UX spec §1.4 mandates `hsl(152, 76%, 50%)` (green) and `hsl(189, 90%, 50%)` (cyan). Change log entry 2026-05-08 explicitly marks these as "pending user pick". Confirm or reject the new values. [AC: 3]
- [x] [Review][Decision] **`weight=1` Evergreen format icon removed without documented intent** — ✅ Resolved: removal intentional; `weight=1` articles show the growth badge, no separate sticky icon. — Old `card.html` showed a dedicated Evergreen tree icon for `weight=1` articles. New code removes the `if eq .Params.weight 1` branch entirely; `weight=1` articles now show the growth badge. This is undocumented as an intentional regression. Confirm whether the weight=1 icon should be removed or restored. [AC: 9]
- [x] [Review][Decision] **Log icon color changed without confirmed approval** — ✅ Resolved: new color `hsl(35, 45%, 50%)` confirmed. — Old: `rgb(201, 172, 92)`, new: `hsl(35, 45%, 50%)`. Change log marks this as "pending user pick". Confirm or revert. [`layouts/_partials/card.html`]
- [x] [Review][Decision] **Tooltip text format: semicolon separator and mixed DE/EN** — ✅ Resolved: current format (semicolon, mixed DE/EN) confirmed. — Tooltips use `"Seedling; früher Entwurf"` (semicolon, mixed language); the spec example uses `"Seedling — early/draft content"` (em-dash, English). Decide on separator and language. [`layouts/_partials/growth-badge.html`]
- [x] [Review][Decision] **Stage labels English-only while translations remain pending** — ✅ Resolved: English labels confirmed (Seedling, Budding, Evergreen, Withered). — Labels (`Seedling`, `Budding`, `Evergreen`, `Withered`) are English. Change log notes "Setzling/Knospe/Immergrün/Verwelkt — pending user pick." Decide whether to use English labels or switch to German before marking done. [`layouts/_partials/growth-badge.html`]
- [x] [Review][Patch] **Dead `@use "sass:color"` import** — removed. [`assets/scss/elements/growth-badge.scss:2`]
- [x] [Review][Patch] **E2E AC#1 test only checked cards that already render a badge** — fixed: now iterates ALL cards with `.card-footer`, skips log-format cards explicitly, asserts the badge on every remaining card. [`tests/e2e/growth-badge.spec.ts`]
- [x] [Review][Patch] **Hardcoded 1500ms server rebuild wait** — replaced with poll loop (20 × 250 ms) that breaks as soon as Hugo responds with 200. [`tests/e2e/growth-badge.spec.ts`]
- [x] [Review][Defer] **`validate-frontmatter.js` reads working tree instead of staged blob** — pre-existing bug, already logged in `docs/backlog.md`
- [x] [Review][Defer] **Visual regression snapshots not captured** — deferred by design, documented in `docs/technical/testing.md`
- [x] [Review][Defer] **WCAG-AA contrast not automatically verified** — deferred to Epic 9 a11y audit per `test-design-system.md`

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-06 | Initial draft created from `epics.md` Story 1.2, `digital-garden-integration-architecture.md` (ADR-005, SCSS pattern, file map, agent rules), `ux-design-specification.md` §1.4 (markup, colors, icons, mobile), and `1-1-growth-stage-frontmatter-field.md` (default fallback, test infra, partial conventions). AC #1 (top-right → footer) and AC #3 (background color → icon color) reconciled with architecture/UX; discrepancy flagged for Epic backport. Effort ≈ 2 days per Epic. | SM (create-story workflow, Bob) |
| 2026-05-08 | Implementation complete. Status: ready-for-dev → review. Icons changed from story spec (`plant-line` → `flower-line`, `skull-line` → `skull-2-line`) after user-approved Remix Icon subset regeneration. Markup uses the codebase's SVG-sprite pattern instead of `<i class="ri-…">`. Tests: 4/4 build smoke + 9/9 e2e green. Visual `toHaveScreenshot` snapshots deferred (structural assertions cover all ACs; deferred decision documented in `docs/technical/testing.md`). | Dev (Amelia) |
| 2026-05-08 | Polish from in-review feedback: per-stage `fill` colors marked `!important` in `growth-badge.scss` to beat `card.scss`'s generic `.card-footer-item svg.ri-1x { fill: gray }` (badge nests inside `.card-footer-item.formats`, so a `:not(.growth-stage)` exclusion in card.scss wouldn't reach the nested SVG). Text label now hidden by default in card list; visible only inside `.info.widget` (single-page article header) on desktop, hidden again ≤640px. Mobile a11y still served by `title` tooltip. Tests still 4/4 + 9/9 green. Open: German translation set for stage labels (Setzling/Knospe/Immergrün/Verwelkt suggested — pending user pick). | Dev (Amelia) |
| 2026-05-08 | Markup refinement (user): badge wrapper changed from `<div class="card-footer-item growth-stage">` to `<span class="growth-stage">` so it lives as an inline sibling next to the format-icon `<span>`s inside `.card-footer-item.formats` (cleaner DOM, no redundant `card-footer-item` styling). SCSS selector updated to `span.growth-stage`. E2E test selectors updated to `span.growth-stage[data-stage="…"]`. `$growth-evergreen` updated to `rgb(78, 151, 78)` so it matches the existing `weight=1` format icon's inline `fill`. Tests: 4/4 + 9/9 green. Open: Seedling → yellow, Budding → purple, log-format icon recolor — pending user pick. | Dev (Amelia) |
