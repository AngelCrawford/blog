# Testing Strategy

This is the **operational** test guide for `blog`. The authoritative test plan — including ASR-001..ASR-008, the visual-regression strategy, and the rationale for every tool choice — lives in [`docs/2-solutioning/test-design-system.md`](../2-solutioning/test-design-system.md). Read that first if you need the *why*; this page covers the *how* and *what runs where*.

## Layers

| Layer | Tool | What it covers | When it runs |
|---|---|---|---|
| Build smoke | `node --test` + Hugo | Hugo build pass/fail under valid / invalid / missing-field frontmatter | `npm run test:build` (local + CI) |
| E2E smoke | Playwright (chromium) | Homepage HTTP 200, Hugo generator meta present (Hugo-update canary) | `npm run test:e2e` (local + CI) |
| Pre-commit | git hook + ajv | JSON-Schema validation of staged content frontmatter | every `git commit` |
| Build (Hugo) | Hugo `errorf` | `growth_stage` enum enforcement | every Hugo build |

`npm test` runs the build smoke suite then the e2e suite. Both are required for branch protection on `main`.

## Running locally

```bash
# Build smoke only (fast, ~9s).
npm run test:build

# E2E only — Playwright's webServer config will spin up `hugo server`
# automatically if it isn't already running.
npm run test:e2e

# Full pipeline.
npm test
```

If you've never run Playwright on this machine before, install the browser once:

```bash
npx playwright install chromium
```

CI runs the equivalent `npx playwright install --with-deps chromium` step.

## What goes where

`tests/build/` — Node-test-runner suites that spawn Hugo via `child_process.spawnSync`. Use this layer when:
- You need to assert build-time behavior (errorf trips, partial outputs, exit codes).
- Putting a `.md` fixture in `tests/build/fixtures/` and copying it into a temp `content/_test_*/` folder is enough to exercise the path.

`tests/e2e/` — Playwright specs. Use this layer when:
- The behavior is browser-observable (DOM, navigation, headers).
- You want to catch regressions from Hugo upgrades or template refactors.
- You need visual or accessibility checks (Story 1.2+ will add `toHaveScreenshot()` and `axe-core`).

`scripts/validate-frontmatter.js` — pre-commit script. Edit the JSON Schema at `schemas/frontmatter/article.schema.json`; the script auto-picks up changes.

## Growth-stage badge (Story 1.2)

`tests/e2e/growth-badge.spec.ts` covers the badge component end-to-end. It creates per-stage page-bundle fixtures under `content/articles/_test_growth_stage_<stage>/index.md` (one per stage + one with no `growth_stage` for the default-fallback path), exercises a real Hugo render at `/articles/_test_growth_stage_<stage>/`, and removes the fixtures in `afterAll`. The prefix is excluded from `.gitignore` so failed runs never leak into the working tree.

Coverage maps to the story ACs:

- **AC #1, #5, #9** — Homepage cards: every `.card-footer` has `.card-footer-item.growth-stage` as its first child; existing top-right `.is-new` / `.visited` and category ribbons remain intact (regression).
- **AC #2** — Per-stage single-page fixtures assert `<svg use[xlink:href]>` references the right glyph: `seedling-line`, `flower-line`, `tree-line`, `skull-2-line`.
- **AC #3** — Per-stage `data-stage` attribute is the CSS selector hook for the icon-fill rules in `assets/scss/elements/growth-badge.scss`. Computed-color assertion is implicit via the snapshot of the `data-stage` value.
- **AC #4, #6** — `title` attribute matches `^<Stage> — `; `<svg aria-hidden="true">` confirms decorative-icon convention.
- **AC #7** — At viewport 375×667, `.card-footer-item.growth-stage span` is hidden via the `helpers.mobile` mixin (≤640px) while `title` still surfaces the accessible name.
- **AC #8** — A fixture without a `growth_stage` field renders `data-stage="seedling"` and the "Seedling" label (default fallback inherited from Story 1.1's `default "seedling" .Params.growth_stage` convention).

The describe block runs in `mode: "serial"` because beforeAll/afterAll manage fixture lifecycle on a single shared Hugo dev server; parallel workers would race on fixture creation/teardown.

To regenerate the fixtures or update assertions, run `npm run test:e2e -- --grep "Growth-stage"`.

## Adding tests in future stories

Per `test-design-system.md`:

| Story / Epic | Test additions |
|---|---|
| Story 1.2 (badge component) | ✅ Implemented — see "Growth-stage badge (Story 1.2)" above. Pure structural assertions; visual snapshots deferred (cross-machine font-rendering noise). |
| Story 1.4 (warning banner) | E2E assertion that withered pages emit the warning banner |
| Epic 5 (filter UI) | Journey test: load list, click filter, verify filtered results; client-side JS coverage |
| Epic 9 (a11y audit) | `@axe-core/playwright` integrated into the e2e suite |

Don't pre-build the full matrix in earlier stories — add tests when the feature ships.

## Local GitHub Actions debugging (optional)

`act` (https://github.com/nektos/act) lets you run `.github/workflows/test.yml` locally with Docker:

```bash
act -j build-smoke
act -j e2e
```

Listed as optional in `test-design-system.md` because the CI feedback loop is short. Reach for `act` if a job behaves differently in CI than locally.
