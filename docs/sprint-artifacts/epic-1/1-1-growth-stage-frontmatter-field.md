# Story 1.1: Growth Stage Frontmatter Field

Status: ready-for-dev

## Story

As a content creator,
I want to assign a growth stage to each article via frontmatter,
so that I can explicitly communicate content maturity.

## Acceptance Criteria

1. `growth_stage` field accepts exactly four values: `seedling`, `budding`, `evergreen`, `withered`.
2. Invalid `growth_stage` values trigger a Hugo build error with a clear message identifying the offending file and the allowed values.
3. Default value resolves to `seedling` when the field is omitted from frontmatter (consumed by templates with a fallback).
4. Archetype templates `archetypes/articles/index.md` and `archetypes/logs/index.md` include `growth_stage: "seedling"` by default.
5. Field is documented in archetype comments with all four allowed options explained (seedling = early/draft, budding = developing, evergreen = mature/maintained, withered = deprecated).

[Source: docs/1-planning/epics.md#Story-1.1-Growth-Stage-Frontmatter-Field]

## Tasks / Subtasks

- [ ] Update `archetypes/articles/index.md` (AC: 4, 5)
  - [ ] Add `growth_stage: "seedling"` to YAML frontmatter block
  - [ ] Add explanatory comment listing all four valid values with one-line description each
  - [ ] Verify `hugo new content articles/test-name` produces a file with the new field
- [ ] Update `archetypes/logs/index.md` (AC: 4, 5)
  - [ ] Add `growth_stage: "seedling"` to YAML frontmatter block
  - [ ] Add explanatory comment listing all four valid values
  - [ ] Verify `hugo new content logs/test-name` produces a file with the new field
- [ ] Implement build-time validation partial (AC: 1, 2)
  - [ ] Create `layouts/_partials/_base/validate-growth-stage.html` (`_base/` partials convention)
  - [ ] Use Hugo's `errorf` to fail the build when `.Params.growth_stage` is set to a value outside `{seedling, budding, evergreen, withered}`
  - [ ] Error message must include the page's `.File.Path` and the list of allowed values
  - [ ] Wire the partial into `layouts/baseof.html` (Hugo v0.146+ flat layout) so it runs for every page render
- [ ] Implement default-value fallback (AC: 3)
  - [ ] Where templates read `growth_stage`, use a Hugo expression that defaults to `seedling` when the field is missing or empty (e.g., `default "seedling" .Params.growth_stage`)
  - [ ] Document the fallback approach as inline comment for downstream stories (Story 1.2 badge component will consume this)
- [ ] **NEW — Layer 1 (Editor): JSON Schema + Zed integration** (AC: 1, 2)
  - [ ] Create `schemas/frontmatter/article.schema.json` — JSON Schema draft-07 defining the full target frontmatter shape (existing fields + `growth_stage` enum + future-additive fields documented as optional)
  - [ ] Define `growth_stage` as `enum: ["seedling", "budding", "evergreen", "withered"]` with default `"seedling"`
  - [ ] Configure `.zed/settings.json` (workspace-level) so the YAML language server applies the schema to `content/articles/**/*.md` and `content/logs/**/*.md`
  - [ ] Add fallback `# yaml-language-server: $schema=...` modeline guidance in archetype comments (works in any YAML-aware editor that doesn't read workspace settings)
  - [ ] Document Zed extension/setup steps in `docs/technical/editor-setup.md` (one-pager, ~30 lines max)
  - [ ] Manually verify in Zed: invalid `growth_stage` value shows a red squiggle in the editor before save
- [ ] **NEW — Layer 2 (Pre-commit): Husky + schema validation hook** (AC: 1, 2)
  - [ ] Add `husky` and `ajv-cli` (or equivalent JSON-Schema validator) as devDependencies in `package.json`
  - [ ] Run `npx husky init` to create `.husky/` directory and the standard pre-commit hook scaffold
  - [ ] Create `scripts/validate-frontmatter.js` — Node script that: (a) reads staged `.md` files via `git diff --cached --name-only --diff-filter=ACM`, (b) extracts YAML frontmatter using `gray-matter` (or equivalent), (c) validates against `schemas/frontmatter/article.schema.json`, (d) exits non-zero with a per-file error report on failure
  - [ ] Wire `.husky/pre-commit` to call `node scripts/validate-frontmatter.js`
  - [ ] Hook MUST be skip-aware: if no `.md` files are staged in `content/`, exit 0 silently
  - [ ] Manually verify: stage a file with invalid `growth_stage` → `git commit` is blocked with the validator's error message
- [ ] **NEW — Layer 3 (Build): Hugo `errorf`** — already covered above (build-time validation partial task)
- [ ] **NEW — Build smoke tests** (AC: 1-3, regression coverage for Hugo updates)
  - [ ] Create `tests/build/` directory with fixture-based test articles: `tests/build/fixtures/valid-evergreen.md`, `valid-missing-field.md`, `invalid-stage.md`
  - [ ] Create `tests/build/build-smoke.test.mjs` (or `.spec.mjs`) — Node test runner script that: (a) copies fixtures into a temp `content/_test/` directory, (b) runs `hugo --quiet --environment production`, (c) asserts exit code (0 for valid fixtures, non-zero for invalid), (d) cleans up temp content
  - [ ] Add npm script `"test:build": "node --test tests/build/"` to `package.json`
  - [ ] Run locally to confirm passes/fails as expected
- [ ] **NEW — Playwright bootstrap** (foundation for downstream stories per `test-design-system.md`)
  - [ ] Add `@playwright/test` as devDependency
  - [ ] Run `npx playwright install --with-deps chromium` (single browser is sufficient for smoke; full matrix in CI later)
  - [ ] Create minimal `playwright.config.ts` with `webServer` config that runs `hugo server` on port 1313
  - [ ] Create `tests/e2e/smoke.spec.ts` with ONE smoke test: homepage loads with HTTP 200 and contains expected meta tag (e.g., `<meta name="generator" content="Hugo">`) — this catches breaking Hugo updates in CI
  - [ ] Add npm scripts: `"test:e2e": "playwright test"` and `"test": "npm run test:build && npm run test:e2e"`
  - [ ] Document in `docs/technical/testing.md`: when to add visual-regression / journey tests (Story 1.2 onwards) per the test-design plan
- [ ] **NEW — CI integration** (AC: 1, 2 — automated guard)
  - [ ] Add a GitHub Actions step (in existing or new workflow) running `npm run test:build` on every push / PR
  - [ ] Add a separate Playwright job running `npm run test:e2e` (matrix-light: chromium only initially)
  - [ ] Confirm both jobs are required for branch protection (manual config; document in PR description)
- [ ] Manual smoke testing (AC: 1-5, end-to-end sanity check)
  - [ ] Create a real test article with `growth_stage: "evergreen"` → build succeeds, editor shows no errors
  - [ ] Create a test article with `growth_stage: "invalid"` → editor underlines, pre-commit blocks, build would fail
  - [ ] Create a test article with no `growth_stage` field → build succeeds, downstream consumers see `seedling`
  - [ ] Run `hugo --environment production` to confirm validation runs in production build path
  - [ ] Delete all test articles after verification (do not commit fixtures other than the ones inside `tests/build/fixtures/`)
- [ ] Documentation (AC: 5)
  - [ ] Update archetype comments to be self-explanatory for future content creators
  - [ ] Cross-link `docs/technical/editor-setup.md` and `docs/technical/testing.md` from project README or `docs/index.md` (if present)

## Dev Notes

### Architectural Context

This story is the **first implementation story** of the Digital Garden transformation and the foundation for Epic 1 (Growth Stage System). All downstream stories in Epic 1 (badge component 1.2, default hiding 1.3, warning banner 1.4, RSS/SEO 1.5) and several stories in Epic 4 (3-tier sorting), Epic 5 (filter UI), and Epic 9 (withered SEO) consume the `growth_stage` field. Get the schema right here.

**Frontmatter Schema (target state):**

```yaml
growth_stage: "seedling"  # seedling | budding | evergreen | withered
```

Defaults defined by architecture:
- `growth_stage`: `"seedling"` if missing
- Other fields added in later stories: `format`, `pinned`, `last_significant_update`, `weight`, `withered_date`, `withered_reason`, `replacement_url`

[Source: docs/2-solutioning/digital-garden-integration-architecture.md#Frontmatter-Schema]

### Hybrid Validation Approach (3 Layers)

Hugo has no native frontmatter schema validation. Architecture decision: **defense-in-depth** with three independent layers, all driven by the same JSON Schema as single source of truth.

```
┌──────────────────────────────────────────────────────────────┐
│ Layer 1 — Editor (Zed + JSON Schema)                         │
│  Live feedback while typing. Red squiggle on invalid value.  │
│  Source: schemas/frontmatter/article.schema.json             │
│  Wired via: .zed/settings.json (workspace-level)             │
│  Bypass: trivial (close editor) → not a security boundary,   │
│          a productivity layer.                               │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ Layer 2 — Pre-commit (Husky + ajv-cli)                       │
│  Blocks invalid commits before they reach the repo.          │
│  Source: same schemas/frontmatter/article.schema.json        │
│  Wired via: .husky/pre-commit → scripts/validate-frontmatter │
│  Bypass: `git commit --no-verify` (acceptable escape hatch)  │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ Layer 3 — Build (Hugo errorf in baseof.html)                 │
│  Final safety net: invalid value halts the production build  │
│  AND blocks deployment.                                      │
│  Source: hardcoded enum in validate-growth-stage.html        │
│  Bypass: NONE (build must pass before deploy).               │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ Layer 4 — CI (build smoke tests + Playwright)                │
│  Catches Hugo-version regressions and template breakage.     │
│  Runs on every push/PR, gates merge to main.                 │
└──────────────────────────────────────────────────────────────┘
```

**Why three layers for the schema:** Editor and pre-commit catch issues fast (cheap signal during authoring), build is the non-negotiable gate. The schema file is shared so adding/changing fields means editing **one** file (the schema) — the other layers pick up the change automatically.

**Hugo `errorf` pattern** (Layer 3):

```go-html-template
{{- $allowed := slice "seedling" "budding" "evergreen" "withered" -}}
{{- $stage := .Params.growth_stage -}}
{{- if $stage -}}
  {{- if not (in $allowed $stage) -}}
    {{- errorf "Invalid growth_stage %q in %s — allowed: seedling, budding, evergreen, withered" $stage .File.Path -}}
  {{- end -}}
{{- end -}}
```

`errorf` halts the Hugo build and prints the message. The partial MUST be invoked from `layouts/baseof.html` (Hugo v0.146+ flat layout — NOT `_default/baseof.html`) so every page is checked. The pattern mirrors the existing `errorf` usage in `layouts/_partials/card.html:89` for the missing-summary check — keep error-message style consistent.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md#Decision-Summary, layouts/_partials/card.html line 89]

### Zed Editor Integration Caveat

YAML language servers historically validate `.yaml`/`.yml` files only — not YAML frontmatter inside `.md` files. Zed's YAML LSP support for embedded frontmatter is improving but may not be fully automatic in all setups. **Implementation expectation:** the workspace setting + the modeline-style fallback comment in archetypes should give visible feedback in Zed; if it doesn't, document the limitation in `docs/technical/editor-setup.md` and rely on Layer 2 (pre-commit) as the actual safety net. Don't block Story 1.1 on this — the pre-commit hook is the authoritative gate.

### Default-Value Fallback (AC #3)

AC #3 says "Default value is `seedling` if field omitted." This is **not** about archetype defaults (covered by AC #4) — it's about template consumers. Implementation: every template that reads the field should use `default "seedling" .Params.growth_stage`. This convention should be established now so Story 1.2 (badge) and downstream stories pick it up consistently.

### File List (planned changes)

**Frontmatter & Hugo:**
- **MODIFY:** `archetypes/articles/index.md` — add `growth_stage` field + comment
- **MODIFY:** `archetypes/logs/index.md` — add `growth_stage` field + comment
- **NEW:** `layouts/_partials/_base/validate-growth-stage.html` — build-time validation partial
- **MODIFY:** `layouts/baseof.html` — invoke validation partial (NOTE: actual path is `layouts/baseof.html` per Hugo v0.146+ flat layout, not `layouts/_default/baseof.html`)

**Schema & Editor (Layer 1):**
- **NEW:** `schemas/frontmatter/article.schema.json` — JSON Schema (draft-07) defining frontmatter shape
- **NEW:** `.zed/settings.json` — Zed workspace settings mapping schema to `content/**/*.md`
- **NEW:** `docs/technical/editor-setup.md` — one-pager on enabling editor validation

**Pre-commit (Layer 2):**
- **MODIFY:** `package.json` — add `husky` and `ajv-cli` (or equivalent) + npm script `"prepare": "husky"`
- **NEW:** `.husky/pre-commit` — hook entry point
- **NEW:** `scripts/validate-frontmatter.js` — Node script: extracts YAML frontmatter from staged `.md` files and validates against schema

**Tests (Layer 4) & Documentation:**
- **NEW:** `tests/build/fixtures/` — fixture articles (valid + invalid + missing field)
- **NEW:** `tests/build/build-smoke.test.mjs` — Hugo build smoke tests (Node test runner)
- **NEW:** `playwright.config.ts` — Playwright config (chromium, webServer = `hugo server`)
- **NEW:** `tests/e2e/smoke.spec.ts` — minimal homepage-200 smoke test
- **NEW:** `docs/technical/testing.md` — test strategy doc, references `test-design-system.md`
- **MODIFY:** `package.json` — npm scripts `test:build`, `test:e2e`, `test`
- **MODIFY:** `.github/workflows/*.yml` (existing or new) — CI steps for `test:build` and `test:e2e`

[Source: docs/2-solutioning/digital-garden-integration-architecture.md#Project-Structure, docs/2-solutioning/test-design-system.md]

### Project Structure Notes

- **Partials convention:** This project uses `_partials/_base/` for core layout/init partials (head, nav, footer, seo). Validation logic that runs once per page belongs there, not in `_partials/widgets/` (feature widgets) or `_partials/` (top-level component partials like `card.html`).
- **No `unified-project-structure.md` exists** — partials structure is inferred from `docs/2-solutioning/architecture.md#Component-Architecture` (Template Hierarchy section) and observation of the existing `layouts/_partials/` tree.
- **Naming convention:** Partials use kebab-case file names (`validate-growth-stage.html`), frontmatter fields use snake_case (`growth_stage`). Both consistent with existing codebase.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md#Component-Architecture, docs/2-solutioning/digital-garden-integration-architecture.md (Naming conventions section, line ~569-594)]

### Existing Archetype State (before this story)

- `archetypes/articles/index.md` has rich frontmatter (title, date, draft, weight, categories, tags, series, authors, summary, params.SEO.*) — `growth_stage` is **additive**, no existing fields modified.
- `archetypes/logs/index.md` is minimal (title, date, draft, categories, tags, authors) — also additive.
- Both archetypes use Hugo template syntax in defaults (e.g., `date: {{ .Date }}`) — `growth_stage` is a static string `"seedling"`, no template syntax needed.

### Test Strategy

The project's authoritative test plan is `docs/2-solutioning/test-design-system.md` (Test Architect Murat, 2025-11-15). It supersedes the older `architecture.md` line "No Automated Tests Found" — that line described the **brownfield baseline before** the digital-garden transformation. As of test-design-system.md, the chosen stack is:

- **Playwright** (E2E + visual regression + accessibility via axe-core)
- **Node test runner** (`node --test`) for build-time and script unit tests
- **`act`** for local GitHub Actions testing (optional)

**Story 1.1 is the first implementation story** and is therefore responsible for **bootstrapping the test infrastructure** so subsequent stories can add tests cheaply:

1. **Build smoke tests** (`tests/build/`) — fixture-based, validate Hugo build behavior under valid / invalid / missing-field inputs (AC #1-3 automated coverage).
2. **Playwright bootstrap** (`tests/e2e/`) — minimal config + ONE smoke test (homepage HTTP 200). Foundational; visual-regression and journey tests come in Story 1.2 (badge rendering) and Epic 5 (filter UI) per the test-design plan.
3. **CI integration** — both test suites run on every push/PR; required for branch protection.

**Why this matters beyond Story 1.1:** Hugo updates can silently change template-rendering output or selector behavior. The Playwright smoke test (homepage loads + Hugo generator meta tag present) is a 30-second canary that catches "Hugo update broke production". This is exactly the use case the user (you) flagged for needing automated tests.

**Manual testing is still required** for end-to-end sanity checks (editor squiggle, pre-commit hook UX), but it's no longer the only test layer.

[Source: docs/2-solutioning/test-design-system.md (Test Architecture, Visual Regression section), docs/2-solutioning/architecture.md#Testing-Strategy (brownfield baseline)]

### Out of Scope (deferred elsewhere)

- Visual badge rendering — Story 1.2
- Hiding withered content from homepage — Story 1.3
- Warning banner on withered pages — Story 1.4
- RSS/sitemap deprecation signals — Story 1.5 + 9.6
- `format`, `pinned`, `last_significant_update`, `weight`, `withered_*` fields — added by later stories as needed
- **Migration of existing ~31 articles** to assign meaningful `growth_stage` values — manual content task, tracked in `docs/todo.md` ("Manuelle Aufgabe: Growth-Stage-Migration bestehender Inhalte"). The fallback (AC #3) keeps existing content building cleanly without this work.
- Full Playwright test matrix (multiple browsers, visual regression, axe-core a11y, journey tests) — bootstrap only in this story; expansion happens in Story 1.2 (badge visual regression) and downstream stories per `test-design-system.md`.

### References

- [Source: docs/1-planning/epics.md#Epic-1-Growth-Stage-System] — Story 1.1 acceptance criteria, prerequisites, effort estimate
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md#Decision-Summary] — Frontmatter schema decision (additive, backwards compatible)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md#Frontmatter-Schema] — Full frontmatter target state with growth_stage example and default values
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md#Epic-to-Architecture-Mapping] — Epic 1 component & file mapping
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md] (lines 1527-1528) — Story 1.1 explicitly named as First Implementation Story
- [Source: docs/2-solutioning/test-design-system.md] — **authoritative test plan** (Playwright + axe-core + node --test); supersedes brownfield-baseline "no tests" line
- [Source: docs/2-solutioning/architecture.md#Component-Architecture] — Existing partial structure (`_partials/_base/`)
- [Source: docs/2-solutioning/architecture.md#Testing-Strategy] — Brownfield-baseline (pre-transformation) testing approach
- [Source: layouts/_partials/card.html line 89] — Existing `errorf` usage pattern to mirror
- [Source: archetypes/articles/index.md], [Source: archetypes/logs/index.md] — Current archetype state (additive change baseline)
- [Source: docs/todo.md "Manuelle Aufgabe: Growth-Stage-Migration"] — Existing-content migration task (out of scope for this story)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-1-growth-stage-frontmatter-field.context.xml

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-04-30 | Initial draft created from epics.md + integration architecture | SM (create-story workflow) |
| 2026-04-30 | Status → ready-for-dev (story-context generated) | story-context workflow |
| 2026-04-30 | **Scope expansion** — added 3-layer hybrid validation (JSON Schema + Zed editor + Husky pre-commit + Hugo errorf), test infrastructure bootstrap (build smoke tests + Playwright), CI integration. Migration of existing articles moved to `docs/todo.md`. Effort estimate revised from 1d → ~2-3d. | SM (per user feedback: tests + pre-commit) |
| 2026-04-30 | Status → drafted (reset for fresh story-context regeneration after scope expansion) | user |
| 2026-04-30 | Story-Context regenerated with verified codebase state (NO `_default/baseof.html`, NO existing `.github/workflows/`, package.json minimal). Status → ready-for-dev. | story-context workflow |
