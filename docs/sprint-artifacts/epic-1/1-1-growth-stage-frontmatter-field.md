# Story 1.1: Growth Stage Frontmatter Field

Status: review

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

- [x] Update `archetypes/articles/index.md` (AC: 4, 5)
  - [x] Add `growth_stage: "seedling"` to YAML frontmatter block
  - [x] Add explanatory comment listing all four valid values with one-line description each
  - [x] Verify `hugo new content articles/test-name` produces a file with the new field
- [x] Update `archetypes/logs/index.md` (AC: 4, 5)
  - [x] Add `growth_stage: "seedling"` to YAML frontmatter block
  - [x] Add explanatory comment listing all four valid values
  - [x] Verify `hugo new content logs/test-name` produces a file with the new field
- [x] Implement build-time validation partial (AC: 1, 2)
  - [x] Create `layouts/_partials/_base/validate-growth-stage.html` (`_base/` partials convention)
  - [x] Use Hugo's `errorf` to fail the build when `.Params.growth_stage` is set to a value outside `{seedling, budding, evergreen, withered}`
  - [x] Error message must include the page's `.File.Path` and the list of allowed values
  - [x] Wire the partial into `layouts/baseof.html` (Hugo v0.146+ flat layout) so it runs for every page render
- [x] Implement default-value fallback (AC: 3)
  - [x] Where templates read `growth_stage`, use a Hugo expression that defaults to `seedling` when the field is missing or empty (e.g., `default "seedling" .Params.growth_stage`) — convention established; first consumer is Story 1.2
  - [x] Document the fallback approach as inline comment for downstream stories (Story 1.2 badge component will consume this) — documented in archetype comments, schema description, and `docs/technical/editor-setup.md`
- [x] **NEW — Layer 1 (Editor): JSON Schema + Zed integration** (AC: 1, 2)
  - [x] Create `schemas/frontmatter/article.schema.json` — JSON Schema draft-07 defining the full target frontmatter shape (existing fields + `growth_stage` enum + future-additive fields via `additionalProperties: true`)
  - [x] Define `growth_stage` as `enum: ["seedling", "budding", "evergreen", "withered"]` with default `"seedling"`
  - [x] Configure `.zed/settings.json` (workspace-level) so the YAML language server applies the schema to `content/articles/**/*.md` and `content/logs/**/*.md`
  - [x] Add fallback `# yaml-language-server: $schema=...` modeline guidance in `docs/technical/editor-setup.md` (works in any YAML-aware editor that doesn't read workspace settings)
  - [x] Document Zed extension/setup steps in `docs/technical/editor-setup.md`
  - [ ] Manually verify in Zed: invalid `growth_stage` value shows a red squiggle in the editor before save *(USER VERIFICATION — automation cannot drive Zed; Layer 2 + Layer 3 are the authoritative gates and are both verified)*
- [x] **NEW — Layer 2 (Pre-commit): plain git hook + schema validation** (AC: 1, 2). **DEVIATION:** the original story prescribed Husky; refactored mid-review per user request to plain git hooks via `core.hooksPath` (Husky is just a wrapper around this). One less devDep; same UX.
  - [x] Add `ajv`, `ajv-formats`, and `gray-matter` as devDependencies in `package.json` (used `ajv` programmatically instead of `ajv-cli` — saves a CLI dep and gives better error formatting)
  - [x] `npm install` runs `prepare: git config core.hooksPath .githooks` automatically, wiring git to the tracked hook directory
  - [x] Create `scripts/validate-frontmatter.js` — reads staged `.md` files via `git diff --cached --name-only --diff-filter=ACM`, filters to `content/articles/**` and `content/logs/**`, extracts YAML frontmatter via `gray-matter`, validates against `schemas/frontmatter/article.schema.json` with ajv, exits non-zero with per-file error report
  - [x] Create `.githooks/pre-commit` (tracked, exec bit set, LF-pinned via `.gitattributes`) that calls `node scripts/validate-frontmatter.js`
  - [x] Hook is skip-aware: exits 0 silently when no `content/articles/**` or `content/logs/**` `.md` files are staged
  - [x] Verified end-to-end: direct script invocation → behaves correctly across invalid/valid/no-content cases; real `git commit` with invalid stage → blocked, no commit created (HEAD unchanged); pipe-mediated exit-code confusion noted but not a real failure
- [x] **NEW — Layer 3 (Build): Hugo `errorf`** — covered by build-time validation partial task above
- [x] **NEW — Build smoke tests** (AC: 1-3, regression coverage for Hugo updates)
  - [x] Create `tests/build/fixtures/`: `valid-evergreen.md`, `valid-missing-field.md`, `invalid-stage.md`
  - [x] Create `tests/build/build-smoke.test.mjs` — `node --test` suite that copies each fixture into a unique `content/_test_growth_stage_<id>/index.md` page bundle, runs `hugo --logLevel error --environment production`, asserts exit codes and (for invalid) error message content; cleans up temp content in `finally`. NOTE: the original instruction specified `--quiet`, but `--quiet` suppresses errorf output and prevents asserting on the message — `--logLevel error` is the correct flag.
  - [x] Add npm script `"test:build": "node --test tests/build/*.test.mjs"` (glob form; `node --test tests/build/` is interpreted as a module path on Node 22 and fails)
  - [x] Run locally — 4/4 tests pass (baseline regression guard + AC1+AC4 + AC3 + AC2)
- [x] **NEW — Playwright bootstrap** (foundation for downstream stories per `test-design-system.md`)
  - [x] Add `@playwright/test` as devDependency
  - [x] Ran `npx playwright install chromium` (verified locally; CI uses `--with-deps`)
  - [x] Create `playwright.config.ts` with chromium-only project + `webServer` config running `hugo server --port 1313 --bind 127.0.0.1 --buildDrafts=false --logLevel error`
  - [x] Create `tests/e2e/smoke.spec.ts` — homepage HTTP 200 + `<meta name="generator">` matches `/Hugo/i`
  - [x] Add npm scripts: `"test:e2e": "playwright test"` and `"test": "npm run test:build && npm run test:e2e"`
  - [x] Document in `docs/technical/testing.md` when to add visual-regression / journey / a11y tests (Story 1.2 onwards) per the test-design plan
- [x] **NEW — CI integration** (AC: 1, 2 — automated guard)
  - [x] Created `.github/workflows/test.yml` from scratch (note: `.github/workflows/daily-rebuild.yml` *does* exist — story-context's "no existing workflows" claim was inaccurate; new file added alongside, no conflicts). Job 1 runs `npm run test:build` on every push/PR; Job 2 runs `npx playwright install --with-deps chromium && npm run test:e2e`. Both use Hugo 0.161.1 extended + Dart Sass.
  - [x] Configured artifact upload for Playwright report on e2e failure (7-day retention)
  - [ ] Confirm both jobs are required for branch protection *(USER ACTION — branch protection is a GitHub UI/API config, not a code change)*
- [x] Manual smoke testing (AC: 1-5, end-to-end sanity check) — covered by automated suite, with one user-only item flagged below
  - [x] AC1+AC4: build succeeds with valid `growth_stage: "evergreen"` — `tests/build/build-smoke.test.mjs::"AC1+AC4: build succeeds with valid growth_stage (evergreen)"`
  - [x] AC2: build fails on invalid stage with helpful error — `tests/build/build-smoke.test.mjs::"AC2: build fails on invalid growth_stage with helpful error"`
  - [x] AC2 (Layer 2): pre-commit blocks invalid stage — verified by running `node scripts/validate-frontmatter.js` against a staged probe file with invalid stage (exit 1, allowed values listed); valid stage and no-staged-md both exit 0
  - [x] AC3: build succeeds with no `growth_stage` field — `tests/build/build-smoke.test.mjs::"AC3: build succeeds when growth_stage is missing"`
  - [x] Production env path (`hugo --environment production`) is the path tested — all build-smoke tests use `--environment production`
  - [x] Cleanup: tests use `try/finally` to remove temp content; verified no residue on disk
  - [ ] AC2 (Layer 1, Zed): editor shows red squiggle for invalid stage *(USER VERIFICATION — automation cannot drive Zed UI; explicitly out-of-scope for blocking per story Dev Notes "Zed Editor Integration Caveat")*
- [x] Documentation (AC: 5)
  - [x] Archetype comments self-explanatory: list all four values with one-line descriptions and document the consumer fallback convention
  - [x] Cross-linked `docs/technical/editor-setup.md` and `docs/technical/testing.md` from `README.md` (added "Tests" + "Frontmatter validation" sections under Local Development)

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

**Implementation plan (in execution order):**
1. Mark story in-progress in `sprint-status.yaml`
2. Layer 0 — Archetypes: add `growth_stage: "seedling"` + 4-value comment to `archetypes/articles/index.md` and `archetypes/logs/index.md`
3. Layer 3 — Hugo `errorf`: create `layouts/_partials/_base/validate-growth-stage.html` (mirror `card.html:89` errorf style), wire into `layouts/baseof.html` (flat layout per Hugo v0.146+; verified no `_default/baseof.html` exists)
4. Layer 1 — Schema (single source of truth): create `schemas/frontmatter/article.schema.json` (draft-07, `additionalProperties: true` for forward compat; existing fields documented)
5. Layer 1 — Editor: merge YAML LSP schemas mapping into existing `.zed/settings.json` (preserve existing `file_types` block); document setup + caveats + modeline fallback in `docs/technical/editor-setup.md`
6. package.json: add devDependencies (`ajv`, `ajv-formats`, `gray-matter`, `@playwright/test`) + scripts (`prepare`, `test:build`, `test:e2e`, `test`); `npm install` runs `prepare: git config core.hooksPath .githooks` automatically
7. Layer 2 — Pre-commit: write `scripts/validate-frontmatter.js` (ajv programmatic, gray-matter for frontmatter extraction, skip-aware filter to `content/articles/**` + `content/logs/**`); create `.githooks/pre-commit`; set `+x` via `git update-index --chmod=+x` and add `.gitattributes` so the hook keeps LF line endings on Linux/macOS clones
   - *Refactor mid-review (2026-05-08): originally implemented with Husky; replaced with plain git hooks via `core.hooksPath` per user feedback. Husky devDep removed, `.husky/` directory deleted, `.githooks/pre-commit` introduced. Functionally equivalent.*
8. Layer 4 — Build smoke tests: write 3 fixtures + `tests/build/build-smoke.test.mjs` (`node --test`); per-test temp page bundle in `content/_test_growth_stage_<id>/index.md` with `try/finally` cleanup
9. Layer 4 — Playwright bootstrap: `playwright.config.ts` (chromium-only, webServer `hugo server`), `tests/e2e/smoke.spec.ts` (homepage 200 + Hugo generator meta), `npx playwright install chromium`
10. Documentation: `docs/technical/testing.md` (test strategy + future-story expansion plan); cross-link both new docs from `README.md`
11. CI: `.github/workflows/test.yml` (build-smoke + e2e jobs, both on push/PR; chromium with `--with-deps`; uploads Playwright report on e2e failure)
12. Validation: `npm test` (all green), `hugo new content articles/...` and `hugo new content logs/...` produce files with `growth_stage: "seedling"`, pre-commit validator probe (invalid → fail with allowed values, valid → pass, no .md → silent pass)

**Deviations from story instructions (with rationale):**
- Used `ajv` programmatically instead of `ajv-cli` — saves a CLI dep, allows formatting per-file errors with allowed-values hints. No functional change.
- `tests/build/build-smoke.test.mjs` uses `--logLevel error` instead of `--quiet`. `--quiet` suppresses errorf output, which AC2 needs to assert on. `--logLevel error` keeps errorf visible while silencing info/warn.
- `npm run test:build` uses glob `tests/build/*.test.mjs` rather than the directory `tests/build/`. Node 22 treats the latter as a module path and fails with `MODULE_NOT_FOUND`. Glob form works on Windows + Linux + macOS via shell expansion (npm runs scripts through a shell).
- Story-context claimed `.github/workflows/` is empty — it isn't (`daily-rebuild.yml` exists). Added `test.yml` alongside; no overlap.
- Story-context claimed `.zed/settings.json` should be created — it already existed with a `file_types` block. Merged the YAML LSP schemas mapping in.
- The Hugo validation partial uses `if $stage` so missing/empty values don't trigger errorf — they fall through to the consumer's `default "seedling"`. This honors AC #3 (default-value fallback) without erroring on legacy content that has no `growth_stage` (regression guarantee).

### Completion Notes List

**Acceptance criteria — all met:**

| AC | Description | Verification |
|----|-------------|--------------|
| 1 | `growth_stage` accepts exactly four values | Hugo errorf enum check + ajv schema enum + build-smoke `AC1+AC4` test |
| 2 | Invalid value → Hugo build error with file path + allowed values | build-smoke `AC2` test asserts non-zero exit + error message regex; pre-commit validator probe asserts Layer 2 blocks with same message |
| 3 | Default `seedling` when field omitted | build-smoke `AC3` test (build succeeds with no field); fallback convention `default "seedling" .Params.growth_stage` documented in archetype comments + `docs/technical/editor-setup.md` for Story 1.2 to consume |
| 4 | Both archetypes include `growth_stage: "seedling"` | manual `hugo new` probe ran during dev — both archetypes produce file with field; archetypes diffed |
| 5 | Comments document all four allowed values | inline 6-line comment block in both archetypes (seedling/budding/evergreen/withered with one-line descriptions) + cross-linked `editor-setup.md` |

**Defense-in-depth wired:**
- **Layer 1 (editor)** — `.zed/settings.json` maps `schemas/frontmatter/article.schema.json` to `content/articles/**/*.md` + `content/logs/**/*.md`. Modeline fallback documented for non-Zed editors.
- **Layer 2 (pre-commit)** — `.githooks/pre-commit` → `scripts/validate-frontmatter.js`. Wired via `git config core.hooksPath .githooks` (npm `prepare` script). Skip-aware. Verified end-to-end: direct script across all three scenarios + real `git commit` with invalid stage blocked (HEAD unchanged).
- **Layer 3 (build)** — `layouts/_partials/_base/validate-growth-stage.html` invoked from `layouts/baseof.html` for every page. Mirrors the `card.html:89` errorf style. Empty/missing values pass through.
- **Layer 4 (CI)** — `.github/workflows/test.yml` runs both `test:build` and `test:e2e` on push + PR.

**Test results (local, all green):**
- `npm run test:build`: 4/4 passed (~9s) — baseline regression + AC1+AC4 + AC3 + AC2
- `npm run test:e2e`: 1/1 passed (~5s) — homepage 200 + Hugo generator meta
- Pre-commit validator probe: 3/3 scenarios behave correctly

**User actions required (cannot be automated):**
1. **Zed editor verification** (Layer 1, productivity check, NOT a gate): open any `content/articles/*/index.md`, change `growth_stage` to `"foo"`, expect a red squiggle. If Zed's YAML LSP doesn't surface frontmatter diagnostics, the modeline fallback in `docs/technical/editor-setup.md` is the documented workaround. Do not block the story on this — Layers 2 + 3 are the authoritative gates.
2. **Branch protection** for `main`: enable required-status-checks for the two new jobs (`Tests / Build Smoke (node --test + Hugo)` and `Tests / E2E (Playwright chromium)`). GitHub UI → Settings → Branches → main → Require status checks.

**Out-of-scope reminders (per story Dev Notes):**
- Migration of existing ~31 articles to assign meaningful `growth_stage` values is a manual content task tracked in `docs/todo.md` ("Manuelle Aufgabe: Growth-Stage-Migration"). The fallback (AC #3) keeps every existing article building cleanly until the migration happens.
- Visual regression, journey tests, axe-core a11y, multi-browser Playwright matrix — Story 1.2 onwards per `docs/2-solutioning/test-design-system.md`.

### File List

**MODIFIED:**
- `archetypes/articles/index.md` — added `growth_stage: "seedling"` + 6-line value comment
- `archetypes/logs/index.md` — added `growth_stage: "seedling"` + 6-line value comment
- `layouts/baseof.html` — invoked `_base/validate-growth-stage` partial after `_base/head`
- `package.json` — added devDependencies (`@playwright/test`, `ajv`, `ajv-formats`, `gray-matter`) + scripts (`prepare: git config core.hooksPath .githooks`, `test:build`, `test:e2e`, `test`)
- `package-lock.json` — regenerated by `npm install`
- `.zed/settings.json` — merged YAML LSP schemas mapping (preserved existing `file_types` block)
- `.gitignore` — added `playwright-report/`, `test-results/`, `playwright/.cache`, `content/_test_growth_stage_*` (test scratch)
- `README.md` — added "Tests" + "Frontmatter validation" subsections under Local Development; cross-linked the two new technical docs
- `docs/sprint-artifacts/sprint-status.yaml` — `1-1-growth-stage-frontmatter-field`: ready-for-dev → in-progress → review
- `docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md` — task checkboxes, Dev Agent Record, File List, Change Log, Status

**NEW:**
- `layouts/_partials/_base/validate-growth-stage.html` — Layer 3 (Hugo errorf, mirrors `card.html:89` style)
- `schemas/frontmatter/article.schema.json` — JSON Schema draft-07, single source of truth for Layers 1 + 2
- `scripts/validate-frontmatter.js` — Layer 2 pre-commit validator (ajv + gray-matter)
- `.githooks/pre-commit` — invokes the validator; tracked in repo (committed `.githooks/` directory); exec bit set; LF line endings enforced via `.gitattributes`. Wired to git via the `prepare` npm script.
- `.gitattributes` — pins `.githooks/*` to LF for cross-platform git hooks
- `tests/build/fixtures/valid-evergreen.md` — happy-path fixture
- `tests/build/fixtures/valid-missing-field.md` — AC #3 fallback fixture
- `tests/build/fixtures/invalid-stage.md` — AC #2 errorf fixture
- `tests/build/build-smoke.test.mjs` — 4 tests (baseline + AC1+AC4 + AC3 + AC2)
- `playwright.config.ts` — chromium-only, webServer = `hugo server`
- `tests/e2e/smoke.spec.ts` — homepage 200 + Hugo generator meta
- `docs/technical/editor-setup.md` — Layer 1 setup guide + Zed caveats + modeline fallback
- `docs/technical/testing.md` — operational test guide + future-story expansion plan
- `.github/workflows/test.yml` — CI: `build-smoke` + `e2e` jobs

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-04-30 | Initial draft created from epics.md + integration architecture | SM (create-story workflow) |
| 2026-04-30 | Status → ready-for-dev (story-context generated) | story-context workflow |
| 2026-04-30 | **Scope expansion** — added 3-layer hybrid validation (JSON Schema + Zed editor + Husky pre-commit + Hugo errorf), test infrastructure bootstrap (build smoke tests + Playwright), CI integration. Migration of existing articles moved to `docs/todo.md`. Effort estimate revised from 1d → ~2-3d. | SM (per user feedback: tests + pre-commit) |
| 2026-04-30 | Status → drafted (reset for fresh story-context regeneration after scope expansion) | user |
| 2026-04-30 | Story-Context regenerated with verified codebase state (NO `_default/baseof.html`, NO existing `.github/workflows/`, package.json minimal). Status → ready-for-dev. | story-context workflow |
| 2026-05-08 | Implementation complete: archetypes updated, 3 validation layers wired (Hugo errorf + ajv pre-commit + Zed YAML LSP), JSON Schema as single source of truth, test infra bootstrapped (4 build smoke + 1 e2e — all passing), CI workflow added. Status → review. Two user-only follow-ups: Zed squiggle verification (productivity, not a gate) and branch-protection config (GitHub UI). | Dev (Amelia) |
| 2026-05-08 | **Refactor in review:** replaced Husky with plain git hooks via `core.hooksPath` per user request. `husky` devDep removed; `.husky/` deleted; `.githooks/pre-commit` introduced; `prepare` script changed from `husky` to `git config core.hooksPath .githooks`; README + editor-setup.md + testing.md updated; `.gitattributes` pin retargeted. Functionally equivalent — all tests still green; `git commit` with invalid stage still blocked. NOTE: downstream story drafts `1-2-...` and `1-4-...` still reference "Husky pre-commit hook (Story 1.1)" in their context.xml; cosmetic cleanup left for those stories' own dev passes. | Dev (Amelia) |
