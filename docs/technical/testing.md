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

## E2E architecture: static export, not hugo server

The Playwright e2e suite serves the production-built `public/` folder via a tiny Node static server (`tests/e2e/build-and-serve.mjs`) instead of running `hugo server`. The lifecycle:

1. **`webServer.command`** runs `build-and-serve.mjs`, which: writes per-stage fixture page bundles into `content/articles/_test_growth_stage_*`, runs `hugo --environment production`, then serves `public/` on port 1314.
2. **Tests run** against the static server — eight parallel workers, no race on shared state.
3. **`globalTeardown`** (`tests/e2e/global-teardown.ts`) removes the fixture page bundles. `.gitignore` excludes the `_test_growth_stage_` prefix as a backstop in case teardown is skipped.

Why this is better than `hugo server` for tests:

- **Deterministic on Windows** — Hugo's fsnotify watcher unreliably detects newly-created article subdirs, which made fixtures sporadically invisible in CI.
- **PurgeCSS is exercised** — `hugo server` runs in dev mode and skips PurgeCSS; the static-export build runs with `--environment production`, catching over-purge regressions before deploy.
- **Faster** — one build, then tests share a static server (no re-rendering per test).

## Growth-stage badge (Story 1.2)

`tests/e2e/growth-badge.spec.ts` covers the badge component end-to-end. Fixtures (one per stage + one with no `growth_stage` for the default-fallback path) are created by `build-and-serve.mjs` and exercised at `/articles/_test_growth_stage_<stage>/` URLs.

Coverage maps to the story ACs:

- **AC #1, #5, #9** — Homepage cards: every `.card-footer` has `.card-footer-item.growth-stage` as its first child; existing top-right `.is-new` / `.visited` and category ribbons remain intact (regression).
- **AC #2** — Per-stage single-page fixtures assert `<svg use[xlink:href]>` references the right glyph: `seedling-line`, `flower-line`, `tree-line`, `skull-2-line`.
- **AC #3** — Per-stage `data-stage` attribute is the CSS selector hook for the icon-fill rules in `assets/scss/elements/growth-badge.scss`. Computed-color assertion is implicit via the snapshot of the `data-stage` value.
- **AC #4, #6** — `title` attribute matches `^<Stage> — `; `<svg aria-hidden="true">` confirms decorative-icon convention.
- **AC #7** — At viewport 375×667, `.card-footer-item.growth-stage span` is hidden via the `helpers.mobile` mixin (≤640px) while `title` still surfaces the accessible name.
- **AC #8** — A fixture without a `growth_stage` field renders `data-stage="seedling"` and the "Seedling" label (default fallback inherited from Story 1.1's `default "seedling" .Params.growth_stage` convention).

Parallel workers are safe because fixtures are created **once** by `build-and-serve.mjs` before any worker starts — no per-worker race.

To regenerate the fixtures or update assertions, run `npm run test:e2e -- --grep "Growth-stage"`.

## Withered Content Default Hiding (Story 1.3)

Story 1.3 introduces the first behavioural consumer of `growth_stage` — listings filter out withered pages by default while direct URLs keep working. Coverage lives entirely in `tests/build/build-smoke.test.mjs`: each assertion copies `tests/build/fixtures/withered-article.md` into a unique `content/articles/_test_withered_<slug>/` bundle, runs `hugo --logLevel error --environment production`, and asserts against the rendered `public/`:

- **AC #1** — `public/index.html` does NOT reference the withered fixture's permalink.
- **AC #4** — `public/articles/_test_withered_ac4/index.html` exists and contains the fixture title (direct URL still renders).
- **AC #5** — `public/index.json` still references the withered fixture (search index is intentionally unfiltered per the search-discoverability AC).
- **AC #6** — `public/index.html` contains a `.withered-hidden-notice` element with text matching `\d+ verwelkte`.
- **AC #6 a11y** — the notice declares `role="status"` and `aria-live="polite"`, and the decorative `<svg>` carries `aria-hidden="true"` so the count is announced politely without leaking icon noise to assistive tech.
- **AC #8** — `public/404.html` does NOT link to the withered fixture (the recent-articles widget filters it out).
- **AC #11** — homepage still emits the `article.card.is-horizontal` markup; the withered filter excludes cards, it doesn't replace them.

A Playwright spec was prototyped but **dropped intentionally**: Hugo's fsnotify watcher on Windows does not reliably pick up newly-created article subdirectories without a server restart. Build smoke uses a clean production build (no watcher) and is fully deterministic across platforms. If we ever migrate to a fixture-in-repo or a globalSetup-based bootstrap, the browser-level confirmation of AC #6 (rendered notice visibility, screen-reader semantics) and AC #8 (404 widget) can be added back — for now the rendered-HTML assertions cover the same ground without the flake surface.

`@axe-core/playwright` was not introduced — the role/aria-live/aria-hidden assertions are a single-pattern HTML check, not worth a new devDependency. Revisit during the Epic 9 a11y pass when broader axe coverage is on the table.

Pure-function partials `withered-filter.html` (filter) and `withered-count.html` (count) are consumed by `home.html`, `list.html`, `page/archive.html`, `_partials/widgets/archive.html`, `_partials/_base/footer.html`, `404.html`, `single.html` (series + related), and `_partials/card.html` (taxonomy term count). Future stories that list pages and need to hide withered MUST go through these partials rather than re-inlining the predicate.

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
