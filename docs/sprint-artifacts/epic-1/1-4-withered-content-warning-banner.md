# Story 1.4: Withered Content Warning Banner

Status: ready-for-dev

## Story

As a reader,
I want a clear warning when viewing withered content,
so that I know the information may be outdated or deprecated.

## Acceptance Criteria

1. A warning banner is rendered at the top of every single-page view (`layouts/single.html`) when `growth_stage == "withered"`. The banner appears **above** the article body (above the title/hero region of the article box) so it is the first content the reader sees.
2. The banner includes:
   - **Deprecation date** — formatted from frontmatter field `withered_date` (required when `growth_stage == "withered"`).
   - **Reason** — frontmatter field `withered_reason` (optional). If absent, the reason line is omitted (no empty placeholder).
   - **Replacement link** — frontmatter field `replacement_url` (optional). If absent, the replacement line is omitted. If present, the URL is rendered as a labelled link (e.g., "Aktuelle Version ansehen →").
3. Banner is styled with the existing semantic `$warning` (orange/yellow) palette — Bulma's `is-warning` callout pattern. Background: `$warning` with sufficient WCAG-AA contrast for body text and link text. Skull icon (`ri-skull-line`) on the left for visual consistency with the growth-stage badge family.
4. Banner is dismissible: a close button (`ri-close-line`) sets a **sessionStorage** key (`withered-banner-dismissed:{{.RelPermalink}}`) so the banner stays hidden for that article during the current browser session. **No cookies, no localStorage** — dismissal is per-session only by design (re-shows the warning on next visit). Dismissal is per-article (different withered articles each have their own dismissal state).
5. `withered_date` (frontmatter) populates the banner date. Format: long-form German date (`time.Format ":date_long" $.Site.Language`) to match the existing single-page metadata convention (`layouts/single.html` line 90, 97).
6. `withered_reason` (frontmatter, optional) populates the explanation text. When present, rendered as a plain paragraph (no markdown rendering — content authors should keep it short and prose-only).
7. **Frontmatter schema additions** — `withered_date` (date, required iff `growth_stage == "withered"`), `withered_reason` (string, optional), `replacement_url` (string, optional, URL pattern). Added to `schemas/frontmatter/article.schema.json` as part of this story (extending Story 1.1's schema scaffold). Build-time validation (Story 1.1's `validate-growth-stage.html` partial) is **extended** to also error if `growth_stage == "withered"` is set without `withered_date`.
8. **Archetype updates** — both `archetypes/articles/index.md` and `archetypes/logs/index.md` add **commented-out** examples of the three withered fields with one-line explanations (only relevant when content is being marked withered; uncommented by the author at that time).
9. Banner is accessible:
   - Container has `role="alert"` and `aria-labelledby="withered-banner-title"` so screen readers announce the warning on page load.
   - Dismiss button has `aria-label="Hinweis ausblenden"` and is keyboard-focusable.
   - Replacement link has visible text (not icon-only) and a sensible `title`.
   - axe-core check passes with zero new violations on the rendered banner.
10. Banner respects mobile responsiveness — on `< 600px` the icon, text, and dismiss button stack/wrap gracefully; the replacement link remains tappable (≥44×44 px target).
11. **No regression**: non-withered articles (`seedling`, `budding`, `evergreen`, missing field) render `single.html` exactly as before — the banner partial returns nothing for those pages.
12. Build succeeds cleanly with the existing fixture set (Story 1.1) plus a new withered fixture that includes `withered_date` and `withered_reason`. A second fixture without `replacement_url` confirms the optional-field branch.

## Tasks / Subtasks

- [ ] **Frontmatter schema extension** (AC: 7) [Source: schemas/frontmatter/article.schema.json (created in Story 1.1)]
  - [ ] Add three properties to the JSON Schema:
    - `withered_date`: `{"type": "string", "format": "date"}`
    - `withered_reason`: `{"type": "string", "maxLength": 280}`
    - `replacement_url`: `{"type": "string", "format": "uri-reference"}`
  - [ ] Add a `if/then` block: `if growth_stage == "withered" then required: ["withered_date"]`
  - [ ] Verify the Husky pre-commit hook (Story 1.1) catches a withered article missing `withered_date`
  - [ ] **If Story 1.1 has not yet landed** when this story is picked up: defer the schema task until 1.1 lands, OR coordinate by adding the schema in this story's PR — note the dependency clearly in the PR description
- [ ] **Archetype updates** (AC: 8)
  - [ ] Edit `archetypes/articles/index.md` — add a commented-out block (after the existing growth_stage line from Story 1.1):
    ```yaml
    # Withered metadata (uncomment when growth_stage: "withered")
    # withered_date: "" # YYYY-MM-DD when this content was deprecated
    # withered_reason: "" # Optional: brief explanation (e.g., "Framework deprecated")
    # replacement_url: "" # Optional: link to replacement content (e.g., "/articles/new-version/")
    ```
  - [ ] Apply the same commented-out block to `archetypes/logs/index.md` (Story 1.1 also added `growth_stage` there)
  - [ ] Verify `hugo new content articles/test-name` produces a file with the commented block
- [ ] **Extend build-time validation partial** (AC: 7)
  - [ ] Edit `layouts/_partials/_base/validate-growth-stage.html` (created in Story 1.1)
  - [ ] After the enum check, add: if `.Params.growth_stage == "withered"` AND `.Params.withered_date` is empty → `errorf` with message including `.File.Path` and field name
  - [ ] Match the existing error-message style (single line, includes file path) per Story 1.1's pattern
- [ ] **Create the withered banner partial** (AC: 1, 2, 5, 6, 9, 11)
  - [ ] Create `layouts/_partials/withered-banner.html`:
    ```go-html-template
    {{/*
      Renders a warning banner for withered content.
      No-op if growth_stage != "withered".
      Inputs: page context (.).
      Reads: .Params.growth_stage, .Params.withered_date, .Params.withered_reason, .Params.replacement_url.
      Dismissal: sessionStorage keyed by .RelPermalink (hydrated by withered-banner.js).
    */}}
    {{ if eq .Params.growth_stage "withered" }}
      {{ $date := .Params.withered_date }}
      {{ $reason := .Params.withered_reason }}
      {{ $replacement := .Params.replacement_url }}
      <aside class="withered-banner notification is-warning"
             role="alert"
             aria-labelledby="withered-banner-title"
             data-banner-key="withered-banner-dismissed:{{ .RelPermalink }}">
        <button class="delete withered-banner-dismiss"
                type="button"
                aria-label="Hinweis ausblenden"></button>
        <h2 id="withered-banner-title" class="withered-banner-heading">
          <i class="ri-skull-line" aria-hidden="true"></i>
          Verwelkter Inhalt
        </h2>
        <p class="withered-banner-date">
          Als veraltet markiert am
          <time datetime="{{ $date }}">
            {{ (time $date).Format "2. January 2006" }}
          </time>.
        </p>
        {{ with $reason }}<p class="withered-banner-reason">{{ . }}</p>{{ end }}
        {{ with $replacement }}
          <p class="withered-banner-replacement">
            <a href="{{ . | relURL }}">Aktuelle Version ansehen →</a>
          </p>
        {{ end }}
      </aside>
    {{ end }}
    ```
  - [ ] Note the partial uses Bulma's `notification is-warning` class so it picks up themed warning colors automatically; the `withered-banner-*` classes layer on minor adjustments only.
- [ ] **Wire the banner into `layouts/single.html`** (AC: 1, 11)
  - [ ] Read `layouts/single.html` first (Hugo v0.146+ flat layout) — confirmed the file has two branches: `eq .Page.Type "page"` and `eq .Page.Type "articles"`. Both render an `<article class="box ...">` element.
  - [ ] Insert `{{ partial "withered-banner.html" . }}` at the top of **both** branches' `column is-12*` wrappers, **before** the `<article class="box">` opens — so the banner is visually above the article box but inside the column.
  - [ ] Decision: also wire the banner for log-type single pages. Logs use the **same** `single.html` template — they fall through the `eq .Page.Type "articles"` test for log content? Verify: the existing footer-statistics counts split articles vs logs (`layouts/_partials/_base/footer.html`), but `single.html` only has two `Page.Type` branches: `page` and `articles`. **Action during implementation:** check `hugo server` rendering of a log page to confirm which branch it hits; if logs render via a different layout (e.g., `layouts/logs/single.html` if it exists), insert the partial there too, otherwise the existing `articles` branch covers logs implicitly.
- [ ] **Create the SCSS component** (AC: 3, 9, 10)
  - [ ] Create `assets/scss/elements/withered-banner.scss`:
    ```scss
    @use "../vars/helpers";
    @use "sass:color";

    .withered-banner.notification {
      // Bulma's .notification.is-warning provides the orange/yellow background and AA-contrast text — we layer on layout adjustments only.
      margin-bottom: 1.5rem;
      padding-right: 3rem; // room for the .delete dismiss button (Bulma standard)

      .withered-banner-heading {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 .5rem;
        display: flex;
        align-items: center;
        gap: .5rem;

        i {
          font-size: 1.4em;
          color: helpers.$growth-withered; // gray skull, contrasts on warning bg
        }
      }

      .withered-banner-date,
      .withered-banner-reason,
      .withered-banner-replacement {
        margin: .35rem 0;
      }

      .withered-banner-replacement a {
        font-weight: 600;
        text-decoration: underline;
      }

      // Hidden state controlled by JS; CSS prevents flash if JS sets attribute synchronously
      &[hidden] { display: none; }

      @include helpers.mobile {
        .withered-banner-heading { font-size: 1.1rem; }
        // Bulma .delete already meets 24×24 default; bump tap target for touch comfort
        .delete.withered-banner-dismiss {
          min-width: 1.75rem;
          min-height: 1.75rem;
        }
      }
    }
    ```
  - [ ] Add `@use "elements/withered-banner";` to `assets/scss/main.scss` after the existing `elements/badge` import (keep elements grouped).
  - [ ] **Reuse `$growth-withered`** from Story 1.2's color variables (`assets/scss/vars/_colors.scss`). If Story 1.2 has not yet landed when this story is implemented, inline `hsl(0, 0%, 50%)` with a `// TODO(1.2): replace with $growth-withered` comment.
  - [ ] Confirm AA contrast for body text (`$light` on `$warning`) and for the replacement link — Bulma's `is-warning` defaults are tested but the underline + weight reinforces visibility.
- [ ] **Vanilla JS dismiss behavior** (AC: 4) [Architecture rule: no jQuery]
  - [ ] Create `assets/js/withered-banner.js`:
    ```js
    (function () {
      const banner = document.querySelector('.withered-banner[data-banner-key]');
      if (!banner) return;

      const key = banner.getAttribute('data-banner-key');

      // Hide if previously dismissed in this session
      try {
        if (sessionStorage.getItem(key) === '1') {
          banner.hidden = true;
          return;
        }
      } catch (_) { /* sessionStorage may be unavailable in some contexts */ }

      const dismiss = banner.querySelector('.withered-banner-dismiss');
      if (!dismiss) return;
      dismiss.addEventListener('click', function () {
        banner.hidden = true;
        try { sessionStorage.setItem(key, '1'); } catch (_) { /* ignore */ }
      });
    })();
    ```
  - [ ] Add `withered-banner.js` to the footer bundle in `layouts/baseof.html` (lines 26–34) — append it to the `slice` before `resources.Concat`. Place it after `$main` so it has the same load timing as other UI scripts.
  - [ ] **Do NOT** wrap the script in jQuery's `$(document).ready` — vanilla IIFE only, runs on `defer`-loaded bundle which guarantees DOM-ready timing.
  - [ ] Defensive: wrap `sessionStorage` access in try/catch — some browser privacy modes throw on `sessionStorage` access.
- [ ] **Test fixtures** (AC: 12) [Source: tests/build/fixtures/ created in Story 1.1, extended in Story 1.3]
  - [ ] Add `tests/build/fixtures/withered-with-replacement.md` — `growth_stage: "withered"`, `withered_date`, `withered_reason`, `replacement_url`.
  - [ ] Add `tests/build/fixtures/withered-minimal.md` — `growth_stage: "withered"`, `withered_date` only (no reason, no replacement). This exercises the optional-field branch.
  - [ ] Add `tests/build/fixtures/withered-invalid.md` — `growth_stage: "withered"` but **no** `withered_date`. Expected: build FAILS (Hugo `errorf`).
- [ ] **Build smoke test extensions** (AC: 1, 2, 7, 11, 12)
  - [ ] Extend `tests/build/build-smoke.test.mjs` (Story 1.1) with cases:
    - "withered fixture builds and `public/<path>/index.html` contains `class=\"withered-banner\"` and the formatted date string"
    - "withered-minimal fixture builds and the rendered HTML does NOT contain `withered-banner-reason` or `withered-banner-replacement`"
    - "withered-invalid fixture causes `hugo --quiet --environment production` to exit non-zero with the expected error message about missing `withered_date`"
    - "non-withered fixture (`valid-evergreen.md`) does NOT contain `class=\"withered-banner\"`"
- [ ] **Playwright e2e tests** (AC: 1, 4, 9, 10, 11)
  - [ ] Add `tests/e2e/withered-banner.spec.ts`:
    - Test 1: visit the withered fixture's permalink directly → assert `[role="alert"].withered-banner` is visible, contains the formatted date and reason.
    - Test 2: visit the withered-minimal permalink → assert banner is visible BUT `.withered-banner-reason` and `.withered-banner-replacement` are absent.
    - Test 3: dismiss flow — click `.withered-banner-dismiss` → assert banner becomes `hidden`, reload page (same browser context preserves sessionStorage) → assert banner is still hidden. Then open a NEW context (clean session) → assert banner reappears.
    - Test 4: visit a non-withered fixture (e.g., evergreen) → assert no `.withered-banner` element exists.
    - Test 5: replacement link present → click it → assert navigation succeeds (target page returns 200).
  - [ ] Add an axe-core assertion on the withered fixture page → assert no new a11y violations (per Story 1.2's pattern with axe).
- [ ] **Manual smoke test** (AC: 1–12)
  - [ ] `hugo server` → visit a withered article directly → banner appears at the top with correct date, reason, replacement link.
  - [ ] Click dismiss → banner hides; refresh page → still hidden; close tab and reopen the page in a new tab → banner reappears.
  - [ ] Visit a withered article without `withered_reason` → banner shows date only, no empty paragraph.
  - [ ] Visit a withered article without `replacement_url` → banner has no replacement link.
  - [ ] Visit a non-withered article → no banner.
  - [ ] Resize viewport `< 600px` → banner remains readable, dismiss button still tappable.
  - [ ] Run `axe-core` (Playwright) on the withered article page → no new a11y issues.
- [ ] **Documentation**
  - [ ] Append a "Withered Warning Banner (Story 1.4)" subsection to `docs/technical/testing.md` (created in Story 1.1) describing the new fixtures and Playwright spec.
  - [ ] Update `docs/technical/editor-setup.md` (created in Story 1.1) with a one-paragraph note about the three optional withered fields and when to fill them.

## Dev Notes

### Architectural Context

Story 1.4 implements the **second behavioural consumer** of `growth_stage` (after Story 1.3's listing filter). Where 1.3 hides withered from organic discovery surfaces, 1.4 ensures that readers who *do* arrive at a withered page (via direct URL, search engine, RSS, social link) are immediately and unambiguously informed that the content is deprecated.

The banner is a **single-page concern** — it does NOT render on cards, listings, archives, or RSS. RSS deprecation messaging is owned by Story 1.5; sitemap/SEO deprecation signals are owned by Story 9.6.

This story extends the frontmatter schema with three withered-specific fields (`withered_date`, `withered_reason`, `replacement_url`) per the architecture's frontmatter target state. It also extends the Story 1.1 build-time validation to enforce that withered articles must specify a `withered_date` (the only required field of the three).

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 810–815) — withered metadata fields in Frontmatter Schema]
[Source: docs/1-planning/epics.md#Story-1.4-Withered-Content-Warning-Banner — AC + prerequisites + effort]
[Source: docs/1-planning/prd/03a-functional-requirements.md#FR-007 — Withered Reason Documentation rationale]
[Source: docs/1-planning/prd/03-core-features.md (lines 83–88) — Withered Handling product spec]

### Frontmatter Schema Extension

The architecture defines three fields for withered metadata (lines 810–815):

```yaml
# Withered metadata (if applicable)
withered_date: 2026-01-15     # When marked as withered
withered_reason: "Framework deprecated, see new article"
replacement_url: "/articles/new-version/"  # Link to replacement content
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `withered_date` | date (YYYY-MM-DD) | **Required when `growth_stage == "withered"`** | Populates banner date |
| `withered_reason` | string (≤280 chars) | Optional | One-paragraph explanation; no markdown |
| `replacement_url` | URL or rel-path | Optional | Resolved via `relURL` to allow internal/external links |

**Schema integration:** The conditional-required pattern (`if growth_stage == "withered" then required: [withered_date]`) is JSON Schema draft-07 compatible (Story 1.1's chosen schema version) and runs in both Husky pre-commit and Hugo build-time layers.

### ⚠️ AC Discrepancy Resolution

**AC #2 (epics.md):** "link to replacement (if provided)" — does not name the frontmatter field.

**Architecture (line 813):** explicit field name `replacement_url`.

**Resolution:** This story uses `replacement_url` (snake_case, matching the architecture and the project's frontmatter field convention per `digital-garden-integration-architecture.md` line 574). Recommend PM/SM backport this field name into `epics.md` Story 1.4 AC #2 for clarity in a follow-up housekeeping commit.

### ⚠️ Single-Layout Coverage for Logs vs Articles

`layouts/single.html` (Hugo v0.146+ flat layout) has only **two `Page.Type` branches**: `"page"` and `"articles"`. Logs do not have a dedicated single-page layout — they fall through to one of these branches.

**Verification step during implementation:** start `hugo server`, visit a withered log page directly, and confirm which branch renders. Most likely: logs render via the `articles` branch (since they share the regular-page rendering pipeline). If logs render via a separate layout discovered at implementation time (e.g., `layouts/logs/single.html`), the partial must be wired there too. **Do not assume — check `hugo server` output.**

[Source: layouts/single.html — two `Page.Type` branches confirmed; flat layout per Hugo v0.146+]

### Dismissal Pattern: sessionStorage Per Article

AC #4 mandates **sessionStorage, no cookies**. This is intentional product behavior:

- A reader who dismisses the warning shouldn't be re-warned every scroll-up of the same article in the same session.
- A reader who returns *next session* SHOULD be re-warned — the warning is the entire reason the banner exists.
- The dismissal is **per-article**, keyed by `RelPermalink`. Dismissing one withered article does NOT dismiss banners on other withered articles.

The architecture's "vanilla JavaScript = no framework-specific test setup" principle (test-design-system.md line 47) reinforces the no-jQuery choice. Existing `assets/js/main.js` and `assets/js/gdpr.js` use jQuery patterns (`$(document).ready`); **do not extend that style here** — vanilla IIFE only.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771) — critical agent rules: no jQuery]
[Source: docs/2-solutioning/test-design-system.md (line 47) — vanilla JavaScript]

### File Map (planned changes)

**NEW:**
- `layouts/_partials/withered-banner.html` — banner partial (no-ops on non-withered)
- `assets/scss/elements/withered-banner.scss` — minor layout adjustments over Bulma `.notification.is-warning`
- `assets/js/withered-banner.js` — vanilla JS dismiss handler with sessionStorage
- `tests/build/fixtures/withered-with-replacement.md`
- `tests/build/fixtures/withered-minimal.md`
- `tests/build/fixtures/withered-invalid.md`
- `tests/e2e/withered-banner.spec.ts`

**MODIFY:**
- `schemas/frontmatter/article.schema.json` — add `withered_date`, `withered_reason`, `replacement_url` + conditional required (extends Story 1.1)
- `archetypes/articles/index.md` — commented-out withered fields block
- `archetypes/logs/index.md` — commented-out withered fields block
- `layouts/_partials/_base/validate-growth-stage.html` — extend to require `withered_date` when `growth_stage == "withered"`
- `layouts/single.html` — invoke `withered-banner.html` partial in both `Page.Type` branches (verify log layout coverage at implementation time)
- `assets/scss/main.scss` — `@use "elements/withered-banner";`
- `layouts/baseof.html` — append `withered-banner.js` to footer bundle slice (line 33)
- `tests/build/build-smoke.test.mjs` — add 4 banner-related assertions
- `docs/technical/testing.md` — Story 1.4 subsection
- `docs/technical/editor-setup.md` — note about withered fields

**EXPLICITLY UNCHANGED:**
- `layouts/index.json` — search index; Story 1.3 left it untouched, this story does the same
- `layouts/rss.xml` — Story 1.5 owns RSS withered handling
- `layouts/_partials/card.html` — banner is single-page only, no card-level UI
- Sitemap, structured data — Story 9.6 owns SEO withered handling

### Critical Agent Rules (apply to this story)

From `digital-garden-integration-architecture.md` lines 762–771 and project conventions:

1. **No jQuery** — use vanilla JS for the dismiss button. Existing jQuery in `main.js`/`gdpr.js` is legacy; do not extend it.
2. **Hugo v0.146+ flat layouts** — modify `layouts/single.html` and `layouts/baseof.html` directly; no `_default/` subdirectory.
3. **Component reuse** — use Bulma's `.notification.is-warning` rather than re-implementing alert backgrounds. Reuse `$growth-withered` SCSS variable from Story 1.2 for the icon color.
4. **No new npm dependencies** — the dismiss script is ~15 lines of vanilla JS; do not pull in a banner/notification library.
5. **Frontmatter snake_case** (`withered_date`, `withered_reason`, `replacement_url`); HTML class kebab-case (`withered-banner`, `withered-banner-dismiss`, `withered-banner-heading`); JS camelCase per architecture line 583.

### Project Structure Notes

- **Partial placement:** `layouts/_partials/withered-banner.html` (top-level component partial, like `card.html` and the partials Story 1.3 introduces). NOT under `_partials/_base/` — that directory is for layout-init partials (head, nav, footer, seo, validate-growth-stage).
- **SCSS placement:** `assets/scss/elements/withered-banner.scss` — same directory as `badge.scss`, `box.scss`, and the planned `growth-badge.scss` from Story 1.2.
- **JS placement:** `assets/js/withered-banner.js` — flat structure under `assets/js/`, consistent with `main.js`, `header.js`, `navbar.js`, `gdpr.js`, etc.
- **Footer bundle:** `layouts/baseof.html` line 33 already concatenates JS via `resources.Concat "js/footerBundle.js"`. Append the new file to the slice rather than adding a separate `<script>` tag.
- **Test fixtures:** `tests/build/fixtures/` — directory bootstrapped by Story 1.1.
- **Test specs:** `tests/e2e/` — directory bootstrapped by Story 1.1; pattern follows Story 1.2's `growth-badge.spec.ts` and Story 1.3's `withered-hiding.spec.ts`.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md#Component-Architecture]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 567–605) — naming conventions and file organization]

### Test Strategy

The project's authoritative test plan is `docs/2-solutioning/test-design-system.md` (Playwright + node test runner). Story 1.1 bootstraps both. This story uses them:

- **Build smoke tests** (`tests/build/`) — assert rendered `public/<path>/index.html` contains/excludes `class="withered-banner"`, the formatted date, the reason paragraph, and the replacement link. Includes a *negative* case (invalid fixture must fail the build).
- **Playwright e2e** (`tests/e2e/`) — assert visible behavior: banner renders, dismiss flow works, sessionStorage persists across reload but resets across contexts, no banner on non-withered.
- **axe-core** — confirm the banner has no a11y issues (`role="alert"`, labelled heading, dismiss has accessible label, AA contrast).

[Source: docs/2-solutioning/test-design-system.md]
[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md#Test-Strategy]

### Learnings from Previous Story

Per workflow: Story 1.3 status is `drafted` — its implementation has not started, so its **implementation** learnings do not yet exist. **Patterns/decisions from the 1.3 draft that affect this story:**

- **Filter/count partials introduced by 1.3** (`withered-filter.html`, `withered-count.html`, `withered-hidden-notice.html`) live at `layouts/_partials/`. The new `withered-banner.html` lives in the same directory — keep the filename convention consistent (kebab-case, `withered-` prefix for the family of withered-related components).
- **1.3 explicitly defers the warning banner to this story** (1.3 Out of Scope: "Withered warning banner on single pages — Story 1.4"). No coordination conflict.
- **Story 1.3's e2e test (`tests/e2e/withered-hiding.spec.ts` Test 2)** asserts that visiting the withered fixture URL "renders the article body (no banner test here — that's Story 1.4)". This story should add the banner assertion as a separate spec rather than modifying 1.3's spec.
- **Test fixture `tests/build/fixtures/withered-article.md`** is introduced by 1.3. This story adds **additional** withered fixtures (`withered-with-replacement.md`, `withered-minimal.md`, `withered-invalid.md`) to exercise the new fields and validation paths. Keep 1.3's fixture if it lands first; do not rename it.
- **From Story 1.2 (status `ready-for-dev`):** `$growth-withered` SCSS variable, `ri-skull-line` icon. Reuse both for visual consistency.
- **From Story 1.1 (status `ready-for-dev`):** JSON Schema at `schemas/frontmatter/article.schema.json` with conditional-required support; build-time validation partial `layouts/_partials/_base/validate-growth-stage.html`; Playwright + node-test infra under `tests/`. **All three are extended (not recreated) by this story.**

**Coordination risk:** if Story 1.4 is implemented before Stories 1.1, 1.2, or 1.3 land, defer or stage the dependent work:
- 1.1 must land first (or co-land) — schema, archetype `growth_stage`, validation partial, test infra.
- 1.2 SCSS variable can be inlined with a TODO if 1.2 hasn't landed.
- 1.3 fixtures and e2e patterns are nice-to-have references; banner work doesn't strictly depend on 1.3.

[Source: docs/sprint-artifacts/epic-1/1-3-withered-content-default-hiding.md (Out of Scope, File Map)]
[Source: docs/sprint-artifacts/epic-1/1-2-growth-stage-badge-component.md (Color Palette)]
[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md (Schema, validation partial, test infra)]

### Out of Scope (deferred elsewhere)

- **RSS feed deprecation messaging** (`[Withered DATE]` title suffix, prepended description) — Story 1.5.
- **Sitemap and Schema.org deprecation metadata** — Story 9.6.
- **Listing-page withered hiding and "hidden N items" notice** — Story 1.3.
- **"Show withered" filter UI / opt-in toggle** — Story 5.3.
- **Three-tier sorting** — Epic 4 (the banner only renders on direct single-page visits, independent of homepage tiers).
- **Migration of existing articles to set `withered_date` / `withered_reason`** — manual content task tracked in `docs/todo.md` ("Manuelle Aufgabe: Growth-Stage-Migration"). The conditional-required validation only fires for articles whose author actively sets `growth_stage: "withered"` — it does not retroactively force-fill metadata for not-yet-withered content.
- **Localized banner text (English)** — banner copy is German-only in this story (matches existing site language). i18n is a future concern (see `docs/0-discovery/Digital-garden.md` and the open issue #182 "AI translation to EN" — out of scope per the project's offline issue triage).

### References

- [Source: docs/1-planning/epics.md#Story-1.4-Withered-Content-Warning-Banner] — AC + prerequisites + effort
- [Source: docs/1-planning/prd/03-core-features.md (lines 56–88)] — Withered definition + product handling
- [Source: docs/1-planning/prd/03a-functional-requirements.md#FR-002] — Growth Stage Visibility (banner is the single-page expression of stage visibility)
- [Source: docs/1-planning/prd/03a-functional-requirements.md#FR-007] — Withered Reason Documentation
- [Source: docs/1-planning/prd/07-implementation-phases.md (line 51)] — Week 3 deliverable
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 810–815)] — Withered metadata fields
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771)] — Critical agent rules: card footer, no jQuery, no card-variant modifications
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md#Naming-Conventions (lines 567–605)] — naming + file organization
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md#Color-Palette-Quick-Reference (lines 1908–1928)] — `$warning`, `$growth-withered`
- [Source: docs/2-solutioning/test-design-system.md] — test architecture (Playwright + node --test + axe-core)
- [Source: docs/1-planning/ux-design-specification.md (lines 290–297)] — Growth-stage color palette + Remix Icon mapping for withered
- [Source: docs/1-planning/ux-design-specification.md (lines 1392–1400)] — `notification`-style banner pattern (no-js-banner reference)
- [Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md] — schema, validation partial, archetype edits, test infra
- [Source: docs/sprint-artifacts/epic-1/1-2-growth-stage-badge-component.md] — `$growth-withered` variable, `ri-skull-line` icon, partial conventions
- [Source: docs/sprint-artifacts/epic-1/1-3-withered-content-default-hiding.md] — sibling story; banner is its explicit out-of-scope handoff
- [Source: layouts/single.html] — modification target (two `Page.Type` branches)
- [Source: layouts/baseof.html (lines 26–34)] — footer JS bundle composition
- [Source: assets/scss/main.scss (line 17)] — Bulma `$warning` customization (`hsl(41, 77%, 37%)`)
- [Source: assets/scss/elements/box.scss] — existing element-level component pattern reference

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-1/1-4-withered-content-warning-banner.context.xml

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-06 | Initial draft created from `epics.md` Story 1.4 (FR-002, FR-007), `digital-garden-integration-architecture.md` (frontmatter schema lines 810–815, no-jQuery rule, naming conventions), `prd/03-core-features.md` (Withered handling spec), `ux-design-specification.md` (color palette, icon mapping, notification pattern), and Story 1.1/1.2/1.3 conventions (schema extension, validation partial, SCSS variables, partial placement, fixture/test infra). Frontmatter field name `replacement_url` reconciled with epics AC #2's "link to replacement" phrasing — discrepancy flagged for Epic backport. Test approach: build smoke (incl. negative-case for missing `withered_date`) + Playwright e2e (incl. cross-context sessionStorage check) + axe-core. RSS, sitemap, and schema.org deprecation signals explicitly out of scope (Story 1.5 / 9.6). | SM (create-story workflow, Bob) |
