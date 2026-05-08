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

The Playwright e2e suite serves a **dedicated `public-test/` folder** (NOT the regular `public/`) via a tiny Node static server (`tests/e2e/build-and-serve.mjs`) instead of running `hugo server`. The lifecycle:

1. **`webServer.command`** runs `build-and-serve.mjs`, which: writes per-stage fixture page bundles into `content/articles/_test_growth_stage_*`, runs `hugo --environment production --destination public-test`, then serves `public-test/` on port 1314.
2. **Tests run** against the static server — eight parallel workers, no race on shared state.
3. **`globalTeardown`** (`tests/e2e/global-teardown.ts`) removes the fixture page bundles. `.gitignore` excludes the `_test_growth_stage_` prefix as a backstop in case teardown is skipped.

> **Why `public-test/` and not `public/`**: on Windows, hugo's static-file copy step fails with `error copying static files: unlinkat ...\public\articles: The directory is not empty.` if any file in `public/` is held open by another process — typically a developer's running `hugo server`, an editor preview, or Windows' file indexer. Routing test builds to `public-test/` lets developers keep `hugo server` on `public/` while `npm test` runs concurrently. The same isolation applies to `tests/build/build-smoke.test.mjs` — every spawned hugo build passes `--destination public-test`.

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

## Withered Warning Banner (Story 1.4)

Story 1.4 adds the single-page warning banner for `growth_stage: "withered"` content. Coverage spans both layers:

**Build smoke (`tests/build/build-smoke.test.mjs`)**
- **AC #1+#2+#5** — `withered-with-replacement.md` renders `<aside class="withered-banner message is-warning">` (Bulma `message` component with header bar + body) carrying `role="alert"`, `aria-labelledby`, formatted German date (`time.Format ":date_long"`), the reason paragraph, and the replacement link.
- **AC #2+#6** — `withered-minimal.md` (only `withered_date` set) renders the banner WITHOUT `.withered-banner-reason` or `.withered-banner-replacement` — the optional-field branch must not emit empty placeholders.
- **AC #7** — `withered-invalid.md` (`growth_stage: "withered"` without `withered_date`) makes Hugo exit non-zero with a `Missing withered_date` errorf naming the offending file path. Layer 3 build gate, mirrored by the Layer 2 pre-commit `if/then` rule in `schemas/frontmatter/article.schema.json`.
- **AC #11** — non-withered articles (e.g. `valid-evergreen.md`) render WITHOUT any `withered-banner` markup (regression guard).

Fixtures live alongside the Story 1.1 set: `tests/build/fixtures/withered-with-replacement.md`, `withered-minimal.md`, `withered-invalid.md`.

**Playwright e2e (`tests/e2e/withered-banner.spec.ts`)**
- Banner visibility on `_test_withered_banner_full` — date, reason, replacement link content + position above the article box.
- Reuses `_test_growth_stage_withered` (which now includes `withered_date`) as the minimal-banner case — confirms reason/replacement are absent.
- **Dismiss flow** — click hides banner, reload preserves dismissal (sessionStorage), fresh browser context re-shows the banner.
- **Per-article isolation** — dismissing on `withered-banner-full` does NOT affect a separate withered article's banner (different sessionStorage keys).
- **Replacement link click** — navigates to the target fixture (`_test_withered_banner_replacement_target`) with HTTP 200.
- **Structural a11y** — `role="alert"`, `aria-labelledby`, dismiss `aria-label="Hinweis ausblenden"`, decorative skull svg `aria-hidden="true"`, replacement link visible text + sensible `title`. Following Story 1.3's precedent, `@axe-core/playwright` is **not** integrated; structural attribute checks cover the AC #9 claims and the broader a11y audit is held for Epic 9.
- **Mobile (375×667)** — banner stays visible, dismiss tap target ≥20px wide/tall.

**Test infrastructure additions**: `tests/e2e/build-and-serve.mjs` writes two banner-specific page bundles (`_test_withered_banner_full`, `_test_withered_banner_replacement_target`) before hugo runs; `tests/e2e/global-teardown.ts` cleans them via the new `WITHERED_BANNER_FIXTURES` export from `tests/e2e/fixtures.ts`. The pre-existing navbar `#resultsWrapper` overlay (`assets/scss/elements/search.scss`) intercepted pointer events on the dismiss button area; the spec hides it via `page.evaluate` after navigation. Out-of-scope UX quirk — leave for a future cleanup story.

> **Side fix shipped with Story 1.4**: `layouts/baseof.html` and `layouts/_partials/_base/head.html` switched the JS bundle `<script src>` from `$script.Permalink` to `$script.RelPermalink`. Permalink emits the production absolute URL (`https://article-time.de/...`) which the page's `script-src 'self'` CSP blocks when the page is served from a different origin (e.g. the e2e static server on `localhost:1314`). Same-origin in production, no behavioral change there. Fixed because the dismiss handler IIFE silently never attached when the head bundle (jQuery) was blocked and the footer bundle's main.js threw `$ is not defined`, halting bundle execution before reaching the withered-banner IIFE.

## Withered SEO & RSS (Story 1.5)

Story 1.5 surfaces deprecation context to off-site consumers — RSS subscribers and search engines — without removing withered articles from indexing. Coverage is split between build smoke and a single Playwright check.

**Build smoke (`tests/build/build-smoke.test.mjs`)** — `Story 1.5 AC #…` tests:

- **AC #1 (RSS title suffix)** — withered RSS items end with ` [Verwelkt Mon. YYYY]` (German month abbreviation built from a literal slice in `layouts/rss.xml`; locale-aware `time.Format` does not localize literal layout strings).
- **AC #2 (RSS description prepend)** — `<description>` is prefixed with `⚠️ Dieser Inhalt ist als veraltet markiert seit <long-date>.` after content sanitization. When `withered_reason` is present, ` Grund: <reason>` is appended; absent reason → no `Grund:` label.
- **AC #4 (sitemap lastmod)** — withered URLs emit `<lastmod>` derived from `withered_date` (ISO-8601); non-withered URLs continue to use Hugo's computed `.Lastmod`.
- **AC #5 (sitemap priority)** — withered URLs override to `<priority>0.3</priority>`; non-withered URLs inherit the site-default `0.8` newly added to `config/_default/config.yaml`. The `cascade.sitemap.priority: 0.5` previously set in `content/articles/_index.md` was removed in this story so the site-default applies (the homepage's explicit `0.9` cascade still wins for `_index.md`).
- **AC #6 (Schema.org JSON-LD)** — withered `BlogPosting` objects include `"creativeWorkStatus": "Obsolete"`, `"dateModified"` set to `withered_date`, and a `"description"` prefixed with `Veraltet seit DATE[: REASON] — `. Without `withered_reason` the prefix collapses to `Veraltet seit DATE — ` (no orphaned colon). Tests `JSON.parse` the rendered `<script type="application/ld+json">` block, which required adding `| safeJS` to all `jsonify` filters in `layouts/_partials/_base/seo.html` to suppress the html/template double-escape inside `<script>` tags (a pre-existing bug exposed by the new tests).
- **AC #7 (regression)** — non-withered RSS items, sitemap entries, and JSON-LD remain unchanged: no `[Verwelkt …]` suffix, no warning prepend, no `creativeWorkStatus`, no description prefix.

**XML well-formedness** is asserted via structural probes (`assertWellFormedXml` helper in the test file): XML declaration present, root element open + close, no unescaped ampersands. `xmllint` is intentionally NOT a CI dependency — Hugo's templates produce well-formed output by construction whenever the build exits 0, so the probes serve as a regression guard rather than a parser.

**Playwright e2e (`tests/e2e/withered-banner.spec.ts`)** — one cross-cutting check confirms the RSS endpoint is reachable AND the `[Verwelkt …]` marker survives the live serving pipeline (`page.request.get("/index.xml")`). Build smoke covers the byte-exact rendered XML.

**Manual smoke gates** — before marking the story done, drop `public/index.xml` into the W3C feed validator (`https://validator.w3.org/feed/`) and `public/sitemap.xml` into Google Search Console "Test sitemap" (or `https://www.xml-sitemaps.com/validate-xml-sitemap.html`) and confirm no new errors versus the pre-change baseline.

## Adding tests in future stories

Per `test-design-system.md`:

| Story / Epic | Test additions |
|---|---|
| Story 1.2 (badge component) | ✅ Implemented — see "Growth-stage badge (Story 1.2)" above. Pure structural assertions; visual snapshots deferred (cross-machine font-rendering noise). |
| Story 1.4 (warning banner) | ✅ Implemented — see "Withered Warning Banner (Story 1.4)" above. |
| Story 1.5 (SEO & RSS) | ✅ Implemented — see "Withered SEO & RSS (Story 1.5)" above. |
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
