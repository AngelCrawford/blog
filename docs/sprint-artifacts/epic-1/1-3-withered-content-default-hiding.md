# Story 1.3: Withered Content Default Hiding

Status: ready-for-dev

## Story

As a reader,
I want withered content hidden from homepage and listings by default,
so that I see current, maintained content without clutter.

## Acceptance Criteria

1. Homepage content query (`layouts/home.html`) excludes pages with `growth_stage: "withered"` by default.
2. Section list pages (e.g. `/articles/`, `/logs/`) and taxonomy term pages (categories, tags) exclude withered content by default. **Implemented in `layouts/list.html`.**
3. Archive page (`layouts/page/archive.html`) and the archive sidebar widget (`layouts/_partials/widgets/archive.html`) exclude withered content from the listings and from the year-grouped counts.
4. Withered content remains accessible via direct URL — `layouts/single.html` renders withered pages normally; deep links and bookmarks continue to work.
5. Withered content remains included in the search index `layouts/index.json` (AC requires search to keep working as today; no filter applied there).
6. A count of hidden withered items is rendered on the homepage and on filtered list pages, e.g. `💀 3 verwelkte Inhalte ausgeblendet`. The badge is screen-reader accessible (`aria-live="polite"`) and only renders when the hidden count is > 0.
7. Footer statistics block (`layouts/_partials/_base/footer.html` lines 42–63) displays counts split between **published** (non-withered) and **withered**; total entry count remains accurate. Pattern: `Momentan befinden sich N Einträge — davon X verwelkt`.
8. The `404.html` "recent articles" widget (line 18) excludes withered content (no organic discovery of withered via 404 page).
9. Single-page prev/next navigation and related-articles widget (`layouts/single.html` lines 154, 162, 183–184) exclude withered content so withered pages are not surfaced via organic adjacent-page navigation. (Direct URL still works per AC #4.)
10. RSS feed (`layouts/rss.xml`) is **out of scope for this story** — withered handling for RSS is owned by Story 1.5.
11. No regressions to the existing `weight` ordering in `home.html` (lines 13–25): the three weight-buckets continue to work; withered is filtered out before bucketing.
12. Build succeeds cleanly with the existing fixture mix (Story 1.1 test fixtures + at least one new withered fixture).

## Tasks / Subtasks

- [ ] Create reusable filter partial (AC: 1, 2, 3, 8, 9)
  - [ ] Create `layouts/_partials/withered-filter.html`:
    ```go-html-template
    {{/*
      Returns the input page collection minus pages with growth_stage="withered".
      Pages without the field default to "seedling" via Story 1.1 convention,
      so they are NOT filtered out by this partial.
      Usage: {{ $visible := partial "withered-filter.html" .Site.RegularPages }}
    */}}
    {{ return (where . "Params.growth_stage" "ne" "withered") }}
    ```
  - [ ] Verify `where ... "ne" "withered"` retains pages where the field is **absent** (Hugo behaviour: `ne` includes nil). Add a comment confirming this.
- [ ] Create reusable count partial (AC: 6, 7)
  - [ ] Create `layouts/_partials/withered-count.html`:
    ```go-html-template
    {{/*
      Returns the integer count of withered pages in the input collection.
      Usage: {{ $hiddenCount := partial "withered-count.html" .Site.RegularPages }}
    */}}
    {{ return (len (where . "Params.growth_stage" "eq" "withered")) }}
    ```
- [ ] Create the "hidden count" badge partial (AC: 6)
  - [ ] Create `layouts/_partials/withered-hidden-notice.html`:
    ```go-html-template
    {{/* Renders an inline notice "💀 N verwelkte Inhalte ausgeblendet" if N > 0.
         Input: integer (the hidden count). */}}
    {{ $n := . }}
    {{ if gt $n 0 }}
      <p class="withered-hidden-notice" role="status" aria-live="polite">
        <i class="ri-skull-line" aria-hidden="true"></i>
        <span>{{ $n }} verwelkte {{ if eq $n 1 }}Inhalt ist{{ else }}Inhalte sind{{ end }} ausgeblendet</span>
      </p>
    {{ end }}
    ```
  - [ ] Add minimal SCSS in `assets/scss/elements/withered-notice.scss` (gray text, small font, italic, top/bottom margin). Import in `assets/scss/main.scss` after `elements/growth-badge.scss` (or its placeholder, if Story 1.2 has not landed yet).
  - [ ] Use the existing `$growth-withered: hsl(0, 0%, 50%)` SCSS variable established by Story 1.2 if available; otherwise inline the value with a TODO referencing 1.2.
- [ ] Update `layouts/home.html` (AC: 1, 6, 11)
  - [ ] Replace `where .Site.RegularPages "Type" "in" (slice "articles" "logs")` with a chained filter:
    ```go-html-template
    {{ $all := where .Site.RegularPages "Type" "in" (slice "articles" "logs") }}
    {{ $visible := partial "withered-filter.html" $all }}
    {{ $hiddenCount := partial "withered-count.html" $all }}
    {{ $paginator := .Paginate $visible }}
    ```
  - [ ] Keep the three weight-bucket `range` blocks unchanged — they now operate on `$paginator.Pages` (already withered-filtered). Verify no regression.
  - [ ] Render the hidden notice **after the pagination partial** (so it's visible on every page of the paginator):
    ```go-html-template
    {{ partial "widgets/pagination" . }}
    {{ partial "withered-hidden-notice.html" $hiddenCount }}
    ```
- [ ] Update `layouts/list.html` (AC: 2, 6)
  - [ ] In the section/term branch (the `{{ else }}` clause around line 135), filter `.Pages` before `range`:
    ```go-html-template
    {{ $visible := partial "withered-filter.html" .Pages }}
    {{ $hiddenCount := partial "withered-count.html" .Pages }}
    {{ range $visible.ByPublishDate.Reverse }}
      {{ partial "card" . }}
    {{ end }}
    ```
  - [ ] After the closing `</div>` of the grid, render the hidden notice: `{{ partial "withered-hidden-notice.html" $hiddenCount }}`.
  - [ ] **Do not filter** the `taxonomy` branch (lines 124–134) — that branch lists term cards, not regular pages. Term-page counts shown in the cards (`{{ len .Pages }}` in `card.html` line 240) **should** be filtered too — see Task: card.html count adjustment below.
- [ ] Update `layouts/page/archive.html` (AC: 3, 6)
  - [ ] In the `$combinedPages` accumulator (lines 35–41), filter each section's pages through the partial before append:
    ```go-html-template
    {{ $combinedPages := slice }}
    {{ range (where .Site.Pages "Type" "articles") }}
      {{ $visible := partial "withered-filter.html" .Pages }}
      {{ $combinedPages = $combinedPages | append $visible }}
    {{ end }}
    {{ range (where .Site.Pages "Type" "logs") }}
      {{ $visible := partial "withered-filter.html" .Pages }}
      {{ $combinedPages = $combinedPages | append $visible }}
    {{ end }}
    ```
  - [ ] Compute and render the hidden notice once at the top of the year-grouped section (before the first `<h2>`).
- [ ] Update `layouts/_partials/widgets/archive.html` (AC: 3)
  - [ ] Apply the same filter pattern to the `$combinedPages` accumulator (lines 4–10). The widget's per-year counts must reflect non-withered entries.
  - [ ] **No** hidden notice in the widget (it's a sidebar — too visually noisy). Counts alone are correct.
- [ ] Update `layouts/_partials/_base/footer.html` (AC: 7)
  - [ ] Replace the three counters in `_partials/_base/footer-content` (lines 42, 45, 55):
    ```go-html-template
    {{ $allEntries := where .Site.RegularPages "Type" "in" (slice "articles" "logs") }}
    {{ $visibleEntries := partial "withered-filter.html" $allEntries }}
    {{ $witheredCount := partial "withered-count.html" $allEntries }}
    <p>Momentan befinden sich {{ len $visibleEntries }} <a href="{{ .Site.Home.RelPermalink }}" title="Artikel">Einträge</a> auf dieser Seite{{ if gt $witheredCount 0 }} — davon {{ $witheredCount }} verwelkt{{ end }}.</p>
    ```
  - [ ] Apply the same `partial "withered-filter.html"` pattern to `$countA` (articles count) and `$countM` (logs count).
  - [ ] **Do NOT** add a separate "withered" stat row — Story 1.4 / 1.5 / 9.6 own withered-specific UX. This story only ensures the existing public counters are accurate.
- [ ] Update `layouts/404.html` (AC: 8)
  - [ ] Filter the recent-articles loop (line 18):
    ```go-html-template
    {{ $recent := where .Site.RegularPages "Section" "articles" }}
    {{ $recent = partial "withered-filter.html" $recent }}
    {{ range first 4 $recent.ByDate.Reverse }}
      {{ partial "card" . }}
    {{ end }}
    ```
- [ ] Update `layouts/single.html` prev/next/related (AC: 9)
  - [ ] Read `layouts/single.html` first to confirm the exact pattern used at lines 154, 162, 183–184 (Hugo v0.146+ flat layout — no `_default/single.html`).
  - [ ] Wrap `.Site.RegularPages.ByDate` with the filter partial before computing prev/next: `{{ $candidates := partial "withered-filter.html" .Site.RegularPages }}` then iterate `$candidates.ByDate`.
  - [ ] For Related: `{{ $related := (partial "withered-filter.html" .Site.RegularPages).Related . }}` (verify `Related` is callable on a `Pages` collection — if not, filter the result of `.Related`).
  - [ ] Acceptance check: from a non-withered article, prev/next never lands on a withered article; from a withered article (direct URL), prev/next is intentionally allowed to skip withered (so visitors are guided to maintained content).
- [ ] Update `layouts/_partials/card.html` taxonomy term card count (AC: 2)
  - [ ] At line 240 (`{{ len .Pages }} Artikel`), filter:
    ```go-html-template
    {{ $visible := partial "withered-filter.html" .Pages }}
    {{ len $visible }} Artikel
    ```
  - [ ] Spot-check that this only triggers on the tag/category card branch (line 205 onwards) and does not affect the article/log branch.
- [ ] Confirm `layouts/index.json` is **NOT modified** (AC: 5)
  - [ ] Add a single comment at the top: `{{/* NOTE: Search index intentionally includes withered content per Story 1.3 AC #5. Do not filter here. */}}`
- [ ] Test fixtures and build smoke tests (AC: 12)
  - [ ] Add fixtures under `tests/build/fixtures/` (created in Story 1.1):
    - `withered-article.md` — `growth_stage: "withered"`, valid summary/title
    - (Optional) update `valid-evergreen.md` if Story 1.1 left it incomplete
  - [ ] Extend `tests/build/build-smoke.test.mjs` (Story 1.1) with a new test:
    - "homepage HTML excludes withered article permalink"
    - "withered article direct URL builds and is reachable in `public/`"
    - Assertion mechanic: after `hugo --quiet --environment production`, read `public/index.html` and assert it does NOT contain the withered article's permalink; read the withered article's `public/<path>/index.html` and assert it exists and is non-empty.
- [ ] Playwright e2e tests (AC: 1, 4, 6, 8)
  - [ ] Add `tests/e2e/withered-hiding.spec.ts`:
    - Test 1: navigate to `/` → assert no link with text matching the withered fixture's title appears.
    - Test 2: navigate directly to the withered fixture's permalink → assert HTTP 200 and the article body renders (no banner test here — that's Story 1.4).
    - Test 3: navigate to `/` → assert the hidden notice element (`.withered-hidden-notice`) is visible with text matching `/\d+ verwelkte/`.
    - Test 4: navigate to `/404.html` (or trigger a 404) → assert recent-articles list does not contain the withered fixture.
  - [ ] Run via `npm run test:e2e` (Playwright config from Story 1.1).
  - [ ] Commit any new screenshot baselines.
- [ ] axe-core a11y check (AC: 6)
  - [ ] Add an axe assertion in `withered-hiding.spec.ts` for the homepage with the notice rendered. No new violations.
- [ ] Manual smoke test (AC: 1–9)
  - [ ] `hugo server` → spot-check homepage: withered fixture absent from cards, notice visible.
  - [ ] Visit `/articles/` (section), a category page, a tag page → each excludes withered; notice visible if hidden count > 0.
  - [ ] Visit the withered fixture directly → page renders (no banner expected — that's Story 1.4).
  - [ ] Visit `/pages/archiv/` → year groupings exclude withered; sidebar widget counts match.
  - [ ] Inspect footer statistics → article/log counts exclude withered; total reflects withered count appropriately.
  - [ ] Visit a withered single page → prev/next link to non-withered articles only.
  - [ ] `curl /index.json` → confirm withered article entry is present (search index intact).
- [ ] Documentation
  - [ ] Append a "Withered Content Default Hiding (Story 1.3)" subsection to `docs/technical/testing.md` describing the new fixtures and the e2e spec.
  - [ ] Add a one-line comment in `layouts/home.html` and `layouts/list.html` referencing this story so a future maintainer understands the filter intent.

## Dev Notes

### Architectural Context

Story 1.3 implements **the first behavioural consumer** of `growth_stage`. Story 1.1 added the field. Story 1.2 added the visual badge. This story enforces the digital-garden product principle that **withered content is archived, not promoted** — it must be discoverable (search, direct URL) but never surfaced through organic listing/discovery flows.

This story creates two foundational partials (`withered-filter.html`, `withered-count.html`) that downstream stories will reuse:

- **Epic 4, Story 4.4** (Homepage Layout Refactor) replaces `home.html` with the three-tier sort — its three tier queries already exclude withered (architecture lines 338, 361). The Story 4.4 work should call `withered-filter.html` rather than re-implementing the predicate.
- **Epic 5, Story 5.3** (Growth Stage Filter UI) introduces a client-side filter that can opt-IN to showing withered. The filter UI's "include withered" checkbox toggles a CSS class that re-displays withered cards (already in the DOM if filter present) — but on first paint, the partial governs visibility.
- **Epic 9, Story 9.6** (Withered SEO Integration) requires withered to remain in the sitemap and structured data despite being hidden from listings — this story does NOT touch sitemap/structured data, so 9.6 has clean room.

Architecture authority: `digital-garden-integration-architecture.md` line 408 — *"Withered content: Excluded from all tiers (requires explicit filter opt-in)"*.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 336–408)]
[Source: docs/1-planning/epics.md#Story-1.3-Withered-Content-Default-Hiding]

### Hugo `where` Semantics for `"ne"` and Missing Fields

Hugo's `where collection "Params.growth_stage" "ne" "withered"` returns:
- pages where `growth_stage` is set to any value ≠ `"withered"` (seedling, budding, evergreen)
- **AND** pages where `growth_stage` is **absent / nil** — Hugo treats `nil != "withered"` as true.

This is intentional and aligns with the Story 1.1 default-fallback convention (`default "seedling" .Params.growth_stage`). Articles missing the field continue to render normally.

**Verification step:** the build smoke test fixture `valid-missing-field.md` (created in Story 1.1) MUST appear on the homepage after this story lands — confirm in the e2e test.

[Source: docs/sprint-artifacts/1-1-growth-stage-frontmatter-field.md#Default-Value-Fallback-AC-3]

### Reusable Partial Pattern (`return`)

Hugo supports returning values from partials via `{{ return X }}`. This is the cleanest pattern for shared filtering across many templates:

```go-html-template
{{/* layouts/_partials/withered-filter.html */}}
{{ return (where . "Params.growth_stage" "ne" "withered") }}
```

Caller:
```go-html-template
{{ $visible := partial "withered-filter.html" .Site.RegularPages }}
```

`return` partials evaluate eagerly and do NOT emit HTML; treat them as pure functions over `Pages` / collections.

**Convention for this story:** all withered-filtering goes through `withered-filter.html`. Any future template that lists pages and needs to hide withered must use this partial — do not inline the predicate.

### File Map (planned changes)

**NEW:**
- `layouts/_partials/withered-filter.html` — pure filter partial (`return`)
- `layouts/_partials/withered-count.html` — pure count partial (`return`)
- `layouts/_partials/withered-hidden-notice.html` — small visual badge
- `assets/scss/elements/withered-notice.scss` — minimal styling for the notice
- `tests/build/fixtures/withered-article.md` — fixture for build smoke + e2e tests
- `tests/e2e/withered-hiding.spec.ts` — Playwright tests for hide/show behaviour

**MODIFY:**
- `layouts/home.html` — wrap homepage query in filter; render hidden notice
- `layouts/list.html` — wrap section/term `.Pages` in filter; render hidden notice
- `layouts/page/archive.html` — wrap year-grouping accumulator in filter
- `layouts/_partials/widgets/archive.html` — wrap sidebar widget accumulator in filter
- `layouts/_partials/_base/footer.html` — adjust three count expressions (lines 42, 45, 55)
- `layouts/404.html` — wrap recent-articles loop (line 18) in filter
- `layouts/single.html` — wrap prev/next/related queries (lines 154, 162, 183–184) in filter
- `layouts/_partials/card.html` — adjust taxonomy term card count at line 240
- `assets/scss/main.scss` — `@import "elements/withered-notice"`
- `tests/build/build-smoke.test.mjs` — add homepage-excludes-withered + direct-URL-still-200 assertions
- `docs/technical/testing.md` — append Story 1.3 section

**EXPLICITLY UNCHANGED:**
- `layouts/index.json` — search index keeps withered (AC #5; comment added)
- `layouts/rss.xml` — Story 1.5 owns RSS withered handling
- `archetypes/**`, `schemas/frontmatter/article.schema.json` — schema is fixed; no field changes here

### Critical Agent Rules (apply to this story)

From `digital-garden-integration-architecture.md` lines 762–771 and project conventions:

1. **Never modify existing card variants** (`.is-horizontal`, `.is-log`, `.has-image`) — this story only filters which cards render; it does not touch `card.html`'s article/log markup.
2. **Never use jQuery** — withered notice is CSS + Hugo template only.
3. **Hugo v0.146+ flat layouts** — paths are `layouts/home.html`, `layouts/list.html`, `layouts/single.html` (no `_default/`).
4. **Pure-function partials with `return`** — `withered-filter.html` and `withered-count.html` MUST not emit HTML.
5. **Component reuse over duplication** — Epic 4 and Epic 5 will reuse the partials introduced here. Get the signatures right.

### Project Structure Notes

- Filter/count partials live at `layouts/_partials/` (top-level component partials), consistent with the `card.html` placement convention.
- The visual notice partial also lives at `layouts/_partials/`; it's a component, not a layout-init partial (those are under `_partials/_base/`).
- SCSS file under `assets/scss/elements/` — same directory as the (planned) `growth-badge.scss` from Story 1.2.
- Frontmatter snake_case (`growth_stage`), HTML class kebab-case (`withered-hidden-notice`), partial filenames kebab-case — consistent with codebase.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md#Component-Architecture]
[Source: docs/sprint-artifacts/1-1-growth-stage-frontmatter-field.md#Project-Structure-Notes]

### Test Strategy

The project's authoritative test plan is `docs/2-solutioning/test-design-system.md` (Playwright + node test runner). Story 1.1 bootstrapped both. This story uses them:

- **Build smoke tests** (`tests/build/`) — assert the rendered `public/index.html` after `hugo --quiet` does/does not contain specific permalinks. Cheap and deterministic.
- **Playwright e2e** (`tests/e2e/`) — assert visible behaviour: notice rendered, withered URL still 200s, no organic discovery in 404/related.
- **axe-core** — confirm the new notice has no a11y issues (`role="status"`, `aria-live="polite"`, label text not just decorative icon).

[Source: docs/2-solutioning/test-design-system.md]
[Source: docs/sprint-artifacts/1-1-growth-stage-frontmatter-field.md#Test-Strategy]

### Learnings from Previous Story (Story 1-2)

Per workflow: Story 1.2 status is `drafted` (file exists at `docs/sprint-artifacts/1-2-growth-stage-badge-component.md` but implementation has not started), so its implementation learnings do not yet exist. **Patterns/decisions from the 1.2 draft that affect this story:**

- **Growth-stage SCSS variables.** Story 1.2 will introduce `$growth-seedling`, `$growth-budding`, `$growth-evergreen`, `$growth-withered`. This story should reuse `$growth-withered` for the notice icon color. If 1.2 is not yet implemented when this story is picked up, inline `hsl(0, 0%, 50%)` and add a TODO referencing 1.2.
- **Remix Icon glyphs.** Story 1.2 establishes `ri-skull-line` for withered. The notice partial uses the same glyph for visual consistency.
- **Card-footer placement convention.** Story 1.2's growth-badge takes the first card-footer-item slot. This story adds **no** new card-level UI; nothing to coordinate at the card level.
- **Default fallback `default "seedling" .Params.growth_stage`** is from Story 1.1 — consumed indirectly here through `where ... "ne" "withered"` (which keeps absent-field pages visible).

**Coordination risk:** Story 1.3 might be implemented before Story 1.2's SCSS variables land. The remediation (inline hex with TODO) keeps Story 1.3 unblocked.

[Source: docs/sprint-artifacts/1-2-growth-stage-badge-component.md#Color-Palette-UX-Spec-authoritative]
[Source: docs/sprint-artifacts/1-1-growth-stage-frontmatter-field.md#Default-Value-Fallback-AC-3]

### Out of Scope (deferred elsewhere)

- **Withered warning banner on single pages** — Story 1.4.
- **RSS feed handling for withered** — Story 1.5 (`[Withered Nov 2025]` title suffix, prepended description).
- **Sitemap / Schema.org / SEO for withered** — Story 9.6.
- **"Show withered" filter UI** (opt-in toggle) — Story 5.3 (`data-filter-stage="withered"` filter button per UX spec line 387).
- **Three-tier sort with score-based promotion** — Epic 4. The homepage query in this story is intentionally simple; Epic 4 will replace it but will reuse `withered-filter.html`.
- **Hide withered from `_partials/widgets/series.html`** — series widgets render related articles in a series; if a series contains a withered article, hiding it might confuse readers. **Decision: leave series widget as-is for this story.** Re-evaluate during Epic 6 (history timeline).

### References

- [Source: docs/1-planning/epics.md#Story-1.3-Withered-Content-Default-Hiding] — AC + prerequisites + effort
- [Source: docs/1-planning/prd/03-core-features.md] — FR-004 functional requirement
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md] (lines 336–408) — three-tier sort; line 408 explicit "Withered content: Excluded from all tiers"
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md#Frontmatter-Schema] (lines 786–824) — growth_stage enum + defaults
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md] (lines 762–771) — critical agent rules
- [Source: docs/1-planning/ux-design-specification.md] (lines 386–388, 642–645) — Withered filter button (Story 5.3, downstream consumer)
- [Source: docs/2-solutioning/test-design-system.md] — test architecture (Playwright + node --test)
- [Source: docs/sprint-artifacts/1-1-growth-stage-frontmatter-field.md] — frontmatter field, default fallback, build smoke + Playwright bootstrap
- [Source: docs/sprint-artifacts/1-2-growth-stage-badge-component.md] — SCSS variables, Remix icons, partial conventions (drafted, not yet implemented)
- [Source: layouts/home.html] — homepage modification target
- [Source: layouts/list.html] — section/term page modification target
- [Source: layouts/page/archive.html] — archive page modification target
- [Source: layouts/_partials/widgets/archive.html] — sidebar archive widget modification target
- [Source: layouts/_partials/_base/footer.html] (lines 42, 45, 55) — footer counters
- [Source: layouts/404.html] (line 18) — 404 recent articles
- [Source: layouts/single.html] (lines 154, 162, 183–184) — prev/next/related queries
- [Source: layouts/_partials/card.html] (line 240) — taxonomy term card count
- [Source: layouts/index.json] — search index (intentionally unchanged)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-1/1-3-withered-content-default-hiding.context.xml

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-06 | Initial draft created from `epics.md` Story 1.3 (FR-004), `digital-garden-integration-architecture.md` (three-tier sort line 408 — withered excluded from all tiers), `ux-design-specification.md` (filter UI downstream consumer in Story 5.3), and Story 1.1/1.2 conventions (default-fallback semantics, SCSS variables, partial structure). Test approach uses build smoke + Playwright e2e + axe-core per `test-design-system.md`. Search index (`index.json`) and RSS (`rss.xml`) explicitly out of scope — Story 1.5 / 9.6 own those. | SM (create-story workflow, Bob) |
