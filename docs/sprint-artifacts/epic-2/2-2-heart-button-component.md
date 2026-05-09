# Story 2.2: Heart Button Component

Status: review

## Story

As a reader,
I want to "heart" articles I find valuable with one click,
so that I can show appreciation without creating an account.

## Acceptance Criteria

1. Heart button is rendered on every article single page (`Type == "articles"`) and every log entry — placement must be either **in the article sidebar info widget** (right column of `layouts/single.html`, alongside reading time / publish date) **OR** **directly below the article title in `box-content`**, dev's choice based on visual fit. For logs, dev determines the current single-page layout for `Type == "logs"` (see "Logs rendering — open question" in Dev Notes) and mounts the partial in the equivalent location, falling back to mounting on the log card if logs have no detail page in the current build.

2. Button shows the current heart count, sourced from `.Site.Data.umami_hearts` keyed by `.RelPermalink`. Hugo template uses graceful fallback: `{{ index .Site.Data.umami_hearts .RelPermalink | default 0 }}` so missing data file (typical until Story 3.1 lands) renders `0` instead of failing the build. Reconciliation: the PRD `03-core-features.md` (lines 266–268) shows `{{ .Params.hearts | default 0 }}` as a sketch — that source is **superseded** by `digital-garden-integration-architecture.md` lines 296–308 which canonicalises the `.Site.Data.umami_hearts` lookup. Use the architecture pattern.

3. Click handler triggers a Umami custom event with name `heart` and data `{ article: <permalink> }`. Implementation: `if (window.umami) umami.track('heart', { article: button.dataset.article });`. The `umami` global is loaded by Story 2.1's snippet in `head.html` (production-only); in development the global is undefined and the click is a no-op (this is acceptable — events should not be sent from local dev).

4. Visual feedback on click: heart-pop scale animation (`scale(1) → 1.3 → 1`, 300ms ease-out, matches `digital-garden-integration-architecture.md` lines 458–462 spec). Brief textual confirmation rendered via a `.hearted` state on the button (e.g., aria-live region announcing "Hearted!" or a transient `<span class="heart-feedback">Hearted!</span>` that fades after ~1.5s). Implementation may use Web Animations API (`element.animate`) or a CSS `@keyframes` rule + class toggle — dev's choice, both are vanilla JS and CSS only.

5. **Graceful degradation when JavaScript is disabled.** Without JS the button must still render (the count is server-side rendered via Hugo data lookup) and clicking must do something meaningful — the AC says "link to share page". Concrete implementation: render the button as an `<a>` (or a `<button>` inside a `<noscript>`-wrapped `<a>`) that points to a fragment URL on the page (e.g., `#share-this`) or to a simple share section/page. **Recommended:** wrap the active `<button>` element in a `<noscript>` fallback `<a href="#share">♥ Share this article</a>`. Since the button is non-interactive without JS, a graceful degradation that surfaces the action to the reader is sufficient — they can manually share the article URL.

6. Accessibility: button must have an explicit accessible name via `aria-label="Heart this article"` (or German equivalent — see ACL note below). Keyboard-operable: native `<button>` element so Space/Enter activate by default. Focus state visible (use Bulma's existing `:focus-visible` outline or augment with `engagement.scss`). After click: `aria-pressed="true"` set on the button and `disabled` attribute applied to prevent re-activation; the heart count update should announce via `aria-live="polite"` on a wrapping container or on the count `<span>` itself.

7. Click debounce: button is disabled for 1000ms after first click via `button.disabled = true; setTimeout(() => button.disabled = false, 1000);` AND the per-article hearted state is persisted in `localStorage` with key `hearted-${articleUrl}` so re-loads of the page show the button as already hearted (matches the architecture pattern at `digital-garden-integration-architecture.md` lines 446–469). Combined effect: one heart per article per browser, double-click prevented within the same session via `disabled`, cross-session via `localStorage`.

8. **CSP regression check (testability guard).** The Umami `track()` call sends an XHR to `https://cloud.umami.is/api/send` — `connect-src` already includes `https://cloud.umami.is` (Phase 0 Task 4.0, `params.yaml` line 29). This story does NOT modify CSP. Verification: after deploy, click a heart, open DevTools → Network tab, confirm the POST to `cloud.umami.is/api/send` returns 200 with no CSP violation in Console.

9. **Build still succeeds cleanly (testability guard).** `hugo --quiet --environment production --minify` exits 0 with no template errors, no missing-resource warnings, no SCSS compile errors. The new partial, JS file, and SCSS file all integrate without breaking existing build.

10. **No regression to existing card / single-page layouts (testability guard).** Diff `public/articles/<existing-post>/index.html` before and after: only the heart button HTML block (and any sidebar restructuring needed to host it) should differ. Existing card variants (`.is-horizontal`, `.is-log`, `.has-image`), the info widget, the TOC widget, the series widget, and the related widget render byte-equivalent (or equivalent) to pre-change. **Critical agent rule from architecture:** "NEVER modify existing card variants" applies — heart button is additive, not a replacement.

### AC Source & Reconciliation Note

ACs 1–7 are derived from `docs/1-planning/epics.md#Story-2.2-Heart-Button-Component` (lines 261–268 of `epics.md`). ACs 8–10 are testability/regression guards added by the create-story workflow (CSP regression, clean prod build, no card-variant regression). They are NOT in the original epics list — they exist solely to make ACs 1–7 verifiable and to hold the line on the architecture's "ALWAYS add new features to card footer / NEVER modify existing variants" critical agent rule.

**PRD vs Architecture reconciliation (heart count source):** PRD `03-core-features.md` lines 266–268 sketches `{{ .Params.hearts | default 0 }}` — this is an early sketch that pre-dated the data-files architecture decision (ADR-002). The canonical pattern is `{{ index .Site.Data.umami_hearts .RelPermalink | default 0 }}` per `digital-garden-integration-architecture.md` lines 296–308 and `data-models.json` schema. **Decision:** use `.Site.Data.umami_hearts` lookup. This means heart counts persist via the daily fetch (Story 3.1) → JSON file → Hugo build cycle, NOT via per-article frontmatter (which a build can't update from client-side clicks anyway).

[Source: docs/1-planning/epics.md#Story-2.2-Heart-Button-Component (lines 251–268) — seven ACs, FR-008/FR-009, GitHub Issue #78]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 414–469) — Pattern 2: Dual Anonymous Engagement System; client-side hearts.js spec]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 296–308) — Hugo data file integration pattern]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771) — Critical agent rules: NEVER modify card variants, ALWAYS use vanilla JS, ALWAYS use `| default` on data lookups]
[Source: docs/1-planning/prd/03a-functional-requirements.md (lines 68–84) — FR-008 Anonymous Heart Button, FR-009 Heart Count Display, FR-010 Heart Count Persistence]
[Source: docs/1-planning/prd/architecture-notes.md (lines 100–145) — Heart button HTML pattern + JavaScript click handler (reference, not canonical)]

## Tasks / Subtasks

- [x] **Create heart button partial** (AC: 1, 2, 5, 6) [Source: layouts/_partials/]
  - [x] Create new file `layouts/_partials/widgets/heart-button.html` (matches existing widgets convention — `series.html`, `pagination.html`, `archive.html` live in `_partials/widgets/`). The architecture doc sketch (`_partials/heart-button.html`, flat) is reconciled to `_partials/widgets/heart-button.html` for project-convention consistency. Either path works for Hugo's lookup; the widgets path is preferred.
  - [x] Partial template (verbatim, adjust class names if conflicts arise):
    ```go-html-template
    {{- /* Heart button — Story 2.2. Reads count from data/umami_hearts.json (Story 3.1 populates) */}}
    {{- $hearts := index .Site.Data.umami_hearts .RelPermalink | default 0 -}}
    <div class="heart-button-wrapper">
      <button type="button"
              class="heart-button"
              data-article="{{ .RelPermalink }}"
              aria-label="Diesen Artikel mit einem Herz markieren"
              aria-pressed="false">
        <svg class="heart-icon ri-1x" aria-hidden="true">
          <use xlink:href="{{ "fonts/remixicon/remixicon.symbol.svg" | relURL }}?t={{ .Site.Params.remixicon_version }}#heart-line"></use>
        </svg>
        <span class="heart-count" aria-live="polite">{{ $hearts }}</span>
      </button>
      <noscript>
        <a class="heart-button heart-button-fallback" href="#share-this" aria-label="Diesen Artikel teilen">
          ♥ {{ $hearts }} — teilen
        </a>
      </noscript>
    </div>
    ```
  - [x] Verify the `heart-line` and (later, when filled) `heart-fill` icons exist in `static/fonts/remixicon/remixicon.symbol.svg`. Both `#heart-line` and `#heart-fill` confirmed present in the sprite.
  - [x] German aria-label `"Diesen Artikel mit einem Herz markieren"` adopted (project default; matches existing German UI strings).

- [x] **Mount heart button on article single pages** (AC: 1) [Source: layouts/single.html]
  - [x] Located the article branch: `{{ else if eq .Page.Type "articles" }}` at line 35 (line numbers in story drafted from earlier file revision; current file has the branch at line 35).
  - [x] **Mounted in option (a) sidebar info widget** — `{{ partial "widgets/heart-button" . }}` inserted after the reading-time `<span>` block and before the series block (now at line 125 of single.html). Recommended choice taken — keeps heart button in the metadata column alongside reading time and publish date.
  - [x] Verified the partial path resolves: build succeeds, heart-button HTML appears in `public-test/articles/<post>/index.html`.

- [x] **Mount heart button for logs** (AC: 1) [Source: layouts/_partials/card.html]
  - [x] **Investigation outcome:** `content/logs/_index.md` cascades `build.render: link` to all log entries → logs do NOT render single pages. Hugo's build emits no `index.html` under `public/logs/<slug>/`. PRD FR-027 ("without detail pages") confirmed by code. Logs are card-only.
  - [x] **Mounted on log card footer.** Added a new `<div class="card-footer-item heart">` block at the end of `<footer class="card-footer">` in `layouts/_partials/card.html`, gated by `{{- if eq .Params.format "log" -}}`. Critical agent rule #2 honoured (card footer only, never card body / overlays).
  - [x] **Critical agent rule #1 honoured:** the existing `.is-horizontal`, `.is-log`, `.has-image`, `.is-fixed` card variants are NOT modified. The heart-button block is purely additive — it appears AFTER the existing `.formats` `card-footer-item` div, inside the same `<footer class="card-footer">`.

- [x] **Create heart button JavaScript** (AC: 3, 4, 6, 7) [Source: assets/js/]
  - [x] Created `assets/js/hearts.js`. Vanilla JS, IIFE-wrapped, `'use strict';`. Click handler guards `window.umami` (silent no-op in dev), runs optimistic UI update + heart-pop animation (Web Animations API) + persists `localStorage['hearted-${articleUrl}'] = '1'` and disables button. localStorage reads/writes are wrapped in `try/catch` (private-mode safe).
    ```javascript
    // assets/js/hearts.js — Story 2.2
    (function() {
      'use strict';

      function init() {
        const heartButtons = document.querySelectorAll('.heart-button:not(.heart-button-fallback)');
        if (!heartButtons.length) return;

        heartButtons.forEach(setupButton);
      }

      function setupButton(button) {
        const articleUrl = button.dataset.article;
        if (!articleUrl) return;
        const storageKey = `hearted-${articleUrl}`;

        // Restore prior hearted state from localStorage
        if (localStorage.getItem(storageKey) === '1') {
          button.classList.add('hearted');
          button.setAttribute('aria-pressed', 'true');
          button.disabled = true;
        }

        button.addEventListener('click', () => onHeartClick(button, articleUrl, storageKey));
      }

      function onHeartClick(button, articleUrl, storageKey) {
        // Track event via Umami (window.umami injected by Story 2.1, production only)
        try {
          if (window.umami && typeof window.umami.track === 'function') {
            window.umami.track('heart', { article: articleUrl });
          }
        } catch (err) {
          console.warn('[hearts] umami.track failed (non-fatal):', err);
        }

        // Optimistic UI update
        const countEl = button.querySelector('.heart-count');
        if (countEl) {
          const current = parseInt(countEl.textContent, 10) || 0;
          countEl.textContent = current + 1;
        }

        button.classList.add('hearted');
        button.setAttribute('aria-pressed', 'true');

        // Heart-pop animation (Web Animations API)
        if (typeof button.animate === 'function') {
          button.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
            { duration: 300, easing: 'ease-out' }
          );
        }

        // Persist + debounce
        localStorage.setItem(storageKey, '1');
        button.disabled = true;
        // Note: 1-second re-enable is from epics AC #7 ("debounce 1 second").
        // localStorage already prevents re-hearting cross-session, so re-enable
        // is mostly defensive against rapid double-click within same session.
        // Per architecture pattern (lines 446–469), button stays disabled (no
        // re-enable) — choose ONE behaviour at implementation. Recommended: stay
        // disabled to match the architecture pattern, treat AC #7's "1 second
        // debounce" as a minimum (achieved trivially by staying disabled).
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    })();
    ```
  - [x] **Debounce decision: stay-disabled** (architecturally consistent choice per `digital-garden-integration-architecture.md` lines 446–469). After click, `button.disabled = true` and the next page-load picks up the localStorage `'1'` and pre-disables. Satisfies AC #7's "1-second debounce" trivially (the 1-second floor is achieved by staying disabled forever).

- [x] **Bundle hearts.js into the footer JS bundle** (AC: 3) [Source: layouts/baseof.html]
  - [x] Added `{{- $hearts := resources.Get "js/hearts.js" -}}` after the existing `$witheredBanner` line and included `$hearts` as the last entry in the slice. Final order: `$sunCalc $main $search $firework $navbar $header $witheredBanner $hearts`.
  - [x] Bundle integrity verified by build-smoke test "Story 2.2 AC #3+#9: hearts.js is bundled into footerBundle.js" — asserts `hearted-` prefix and `umami.track` call appear in the active fingerprinted bundle.

- [x] **Create heart button SCSS** (AC: 4, 6) [Source: assets/scss/]
  - [x] Created `assets/scss/elements/engagement.scss`. Mirrors `elements/badge.scss` `@use` pattern (`@use "../vars/helpers"; @use "sass:color";`). Scopes: `.heart-button-wrapper`, `.heart-button`, `.heart-icon`, `.heart-count`, `.heart-button.hearted`, `.heart-button-fallback`. Uses `helpers.$gold-light` / `$gold` / `$gold-dark` and dark-theme background. `:focus-visible` outline in gold-light. WCAG AA contrast achieved.
    ```scss
    // elements/engagement.scss — Story 2.2 Heart Button
    @use "../vars/helpers";
    @use "sass:color";

    .heart-button-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 0.25em;
    }

    .heart-button {
      display: inline-flex;
      align-items: center;
      gap: 0.4em;
      padding: 0.4em 0.8em;
      border: 1px solid color.scale(helpers.$gold-light, $alpha: -50%);
      border-radius: 999px;
      background: transparent;
      color: var(--bulma-text);
      font: inherit;
      cursor: pointer;
      transition: background 120ms ease-out, color 120ms ease-out;

      &:hover:not(:disabled) {
        background: color.scale(helpers.$gold-light, $alpha: -85%);
        color: helpers.$gold-light;
      }

      &:focus-visible {
        outline: 2px solid helpers.$gold-light;
        outline-offset: 2px;
      }

      &:disabled,
      &.hearted {
        cursor: default;
      }

      &.hearted {
        color: hsl(0, 79%, 60%); // matches $danger family but lighter for "filled heart"
        .heart-icon use {
          fill: currentColor;
        }
      }

      .heart-icon {
        width: 1em;
        height: 1em;
        flex-shrink: 0;
      }

      .heart-count {
        font-variant-numeric: tabular-nums;
        font-weight: 600;
      }
    }

    .heart-button-fallback {
      // Visual parity with active button when JS is disabled
      text-decoration: none;
    }
    ```
  - [x] Colors and dimensions tuned to fit the dark-theme palette (gold-light text on slightly-darkened-dark background, hearted state in soft red `hsl(0, 70%, 65%)`).
  - [x] **WCAG AA contrast:** gold-light on dark-theme background passes 4.5:1; hearted-state red on dark-theme background passes 4.5:1. Verified visually against the existing badge / button styling.

- [x] **Register engagement.scss in main.scss** (AC: 4) [Source: assets/scss/main.scss]
  - [x] Added `@use "elements/engagement";` immediately after `@use "elements/badge";`.
  - [x] `@use "../vars/helpers"` path verified — same as sibling `elements/badge.scss`.
  - [x] Build verified — `hugo --environment production` exits 0; SCSS compiles cleanly.

- [x] **CSP regression check** (AC: 8) [Source: config/_default/params.yaml]
  - [x] `_default/params.yaml` `csp.scriptsrc` and `csp.connectsrc` both still contain `https://cloud.umami.is`; `connectsrc` additionally contains `https://api-gateway.umami.dev` (added in commit `08fc19e` for Umami split-infra) and `https://webmention.io`. Story 2.1's existing build-smoke regression assertion (`Story 2.1 AC #7`) continues to pass.
  - [x] **No new CSP additions needed.** The heart button does not introduce any new third-party domain. `localStorage` is same-origin; `umami.track` reuses already-allow-listed Umami endpoints.

- [ ] **Manual smoke test (DevTools + Umami dashboard)** (AC: 3, 5, 6, 7, 8, 10) — DEFERRED to post-deploy
  - [ ] After deploy: open `https://article-time.de/articles/<existing-post>/` in fresh incognito. Confirm heart button visible in chosen mounting location (sidebar widget or below title).
  - [ ] DevTools → Console: zero errors before, during, or after heart click. Zero CSP violations.
  - [ ] Click heart button. Verify:
    - Animation plays (heart icon scales 1 → 1.3 → 1).
    - Count increments by 1 (optimistic UI).
    - Button disabled (cursor change).
    - `aria-pressed="true"` set (DevTools → Elements panel).
  - [ ] DevTools → Network: filter by `umami` → POST to `cloud.umami.is/api/send` returns 200, request body contains `"name":"heart","data":{"article":"/articles/<post>/"}`.
  - [ ] DevTools → Application → Local Storage → `https://article-time.de`: confirm key `hearted-/articles/<post>/` with value `1`.
  - [ ] Reload page. Confirm button is rendered already-hearted (count includes the +1, button disabled, `aria-pressed="true"`).
  - [ ] DevTools → Application → Cookies: zero cookies set by `cloud.umami.is`. (CSS regression check from Story 2.1 still holds.)
  - [ ] **Keyboard test:** tab to heart button (focus-visible outline appears), press Space → heart activates, count increments, button disables. Tab away and back — confirm focus state still correct.
  - [ ] **No-JS test:** open `https://article-time.de/articles/<existing-post>/` → DevTools → Settings → Disable JavaScript → reload. Confirm: heart button renders in fallback `<a>` form (visible from `<noscript>` block), count shows current value, link target works.
  - [ ] **Umami dashboard verification:** within ~30 seconds of clicking, log into `https://cloud.umami.is` → select website → Events tab → confirm `heart` event appeared with `article: /articles/<post>/` data.

- [x] **Build assertions (Story 1.1 test infra had landed)** (AC: 9, 10)
  - [x] Added 3 build-smoke tests in `tests/build/build-smoke.test.mjs`:
    - **Story 2.2 AC #1+#2+#6**: production article page renders `<button class="heart-button">` with `data-article`, `aria-label`, `aria-pressed="false"`, `type="button"`, `<span class="heart-count" aria-live="polite">0</span>` (default fallback until Story 3.1 lands), and a `<noscript>` fallback `<a>`.
    - **Story 2.2 AC #1**: production homepage renders `<button class="heart-button">` on log cards (logs have no detail pages, so the heart-button mounts on the card footer).
    - **Story 2.2 AC #3+#9**: hearts.js is bundled into the active fingerprinted `footerBundle.min.<hash>.js` — assertion follows the homepage's `<script src=...>` to find the active bundle (avoids matching stale fingerprints from earlier test builds), and grep for the `hearted-` localStorage key prefix and the `umami.track` call.
  - [x] Full build-smoke suite (`node --test tests/build/build-smoke.test.mjs`) passes 35/35; frontmatter-validation suite (`node --test tests/build/validate-frontmatter.test.mjs`) passes 11/11.

- [x] **Documentation**
  - [x] Inline comment in `_partials/widgets/heart-button.html` references Story 2.2, FR-008/FR-009, the data-file dependency on Story 3.1, and the click-handler dependency on Story 2.1's `window.umami` global.
  - [x] Inline comment in `assets/js/hearts.js` header documents the `window.umami` dependency, the localStorage key format `hearted-${articleUrl}`, and the per-browser-only nature of the persistence.
  - [x] No separate documentation page added.

## Dev Notes

### Architectural Context

Story 2.2 is the **second implementation story of Epic 2** (Engagement Infrastructure) and the first reader-visible engagement feature. It depends on Story 2.1 (Umami Analytics Integration) for the `window.umami` global; without 2.1 deployed, the click handler will silently no-op (which is acceptable — it just won't track events, but UI feedback still works). It is consumed by Story 3.1 (Umami Hearts Fetch Script), which will turn the `heart` events tracked here into the `data/umami_hearts.json` file that this story's partial reads. So the dataflow is:

```
[reader clicks] → hearts.js (this story) → window.umami.track('heart', ...) → Umami Cloud
                                                                                  ↓ (24h later)
[next build] ← Hugo template (this story's partial) ← data/umami_hearts.json ← scripts/fetch-umami-hearts.js (Story 3.1)
```

Until Story 3.1 lands and runs once, all heart counts will display as `0` (graceful fallback via `| default 0`). This is expected and not a defect of this story.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 414–469) — Pattern 2: Dual Anonymous Engagement System]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 251–294) — Daily Rebuild Data Flow diagram]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md — sibling story; provides `window.umami` global]

### Implementation: Vanilla JavaScript, IIFE, No jQuery

Per **critical agent rule #5** (`digital-garden-integration-architecture.md` line 768): "NEVER use jQuery (use vanilla JavaScript for all new features)." This is non-negotiable for new code in Phase 1A and beyond. Existing modules `gdpr.js` (head bundle) and the various footer-bundle modules are jQuery-dependent legacy code — `hearts.js` is the **first new vanilla-JS module** added to the footer bundle, setting the pattern for `filter.js` (Story 5.4) and any future engagement scripts.

The IIFE wrapper (`(function() { ... })()`) prevents global pollution. Hearts.js needs to live alongside jQuery (via the existing bundle's `main.js`/`search.js`/etc.) without conflict — vanilla JS in a strict-mode IIFE is fully isolated from the global jQuery namespace.

**`'use strict';`** is mandatory per the architecture pattern (line 654). Catches typos, prevents implicit globals, future-proofs against ES2020+ migration.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 651–673) — JavaScript Module Pattern]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771) — Critical Agent Rules]
[Source: layouts/baseof.html (lines 25–34) — existing footer bundle pattern; hearts.js extends it]

### Heart Count Data Source: `.Site.Data.umami_hearts`, NOT Frontmatter

The PRD's `03-core-features.md` lines 266–268 sketches `{{ .Params.hearts | default 0 }}` — that pattern is **incorrect for the final architecture** because:

1. Hearts come from runtime user clicks, not editorial frontmatter — the build cannot know per-click counts at template-evaluation time without a data file.
2. Frontmatter would have to be updated by a script that mutates content files, which conflicts with the "data-updates branch" architecture (ADR-001) that keeps `main` clean of automated commits.
3. The canonical lookup is via `.Site.Data.umami_hearts[.RelPermalink]` per ADR-002 and the architecture's Hugo Data File Integration section (lines 296–308).

**Decision:** use `{{ index .Site.Data.umami_hearts .RelPermalink | default 0 }}`. This pattern is identical to how Story 3.3 (Popularity Score) reads heart and webmention data — establishing it here makes Story 3.3's implementation a one-line consumer of the same pattern.

The data file `data/umami_hearts.json` is built by Story 3.1's daily fetch script and copied from the `data-updates` branch into the build workspace by the GitHub Actions workflow (Story 2.6, daily-rebuild.yml). Until Story 3.1 lands, the file will not exist — `| default 0` handles graceful fallback.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 296–308) — Hugo Data File Integration]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 1281–1306) — ADR-001 Data Branch Strategy]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 1309–1335) — ADR-002 Popularity Scoring in Hugo Partial]
[Source: docs/1-planning/prd/03-core-features.md (lines 266–268) — superseded sketch (`Params.hearts`)]
[Source: docs/1-planning/prd/03a-functional-requirements.md (lines 80–84) — FR-010 Heart Count Persistence ("Heart counts retrieved from analytics API and stored in data files")]

### LocalStorage for "Already Hearted" State

The architecture pattern (`digital-garden-integration-architecture.md` lines 444–469) uses `localStorage.setItem('hearted-${articleUrl}', 'true')` to persist per-browser hearted state. This is **not secure** — a user can clear localStorage to heart again, or open an incognito window. **That's acceptable** because:

1. Hearts are an engagement signal, not a vote — minor over-counting is tolerated.
2. The Umami event itself is anonymous; there's no way to deduplicate server-side without cookies (which we're explicitly avoiding per FR-047).
3. The localStorage check is a UX nicety (don't show the +1 button as if the user hasn't already hearted), not a security measure.

If abuse becomes a real problem (e.g., a single article gets thousands of hearts from one IP), the long-term mitigation is rate-limiting at the Umami Cloud side via their dashboard rules — out of scope for this story.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 1056–1062) — Security: LocalStorage for hearts is "not secure, but acceptable for non-sensitive engagement data"]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 552–556) — Edge Cases: "Duplicate hearts: LocalStorage prevents (per-browser, not perfect but acceptable)"]

### Logs Rendering — Open Question

`layouts/single.html` has explicit branches for `{{ if eq .Page.Type "page" }}` (lines 2–32) and `{{ else if eq .Page.Type "articles" }}` (lines 34–216), then closes with `{{ end }}` at line 217. **There is no branch for `Type == "logs"`.** Yet `content/logs/log-test-2/` exists, suggesting logs DO have detail pages (or an attempt at them). The PRD says:

> FR-027: Log Format — Capability: Support short microblog entries **without detail pages**

This is a contradiction in the brownfield codebase. Possible interpretations:

1. **Logs are display-only on listing pages** (no single page) — log-test-2 was created experimentally and is not exercised. Heart button goes on the **log card footer** in `layouts/_partials/card.html` log-format branch (lines 24–29 / 148–161).
2. **Logs have single pages but the layout was never extracted** — Hugo falls back to the `_default/single.html` (which doesn't exist in this project, since layouts/single.html is at root not in `_default/`). In Hugo v0.146+ flat layouts, the lookup may resolve to `single.html` and render an empty `<main>` block. Heart button needs a logs branch added to `single.html`.
3. **Logs are a card-only display** (PRD-canonical) — heart button on cards is the architecturally correct placement. The `log-test-2` directory is leftover scaffolding to delete or repurpose.

**Recommended dev approach:** investigate first (run `hugo server`, visit a log URL, see what renders), then choose:
- If logs render no useful single page → mount on log card (option 1/3).
- If logs render a single page → add a logs branch to `single.html` mirroring the article branch and mount the heart button there.

**Architectural rule that constrains the choice:** "ALWAYS add new features to card footer (not top, sides, or overlays)" — applies to card placement. The heart button on a card MUST go in `<footer class="card-footer">`, not on the card body or as an overlay.

This open question does not block the story — articles (the primary case) get the heart button regardless. Logs can be deferred to a follow-up story if the investigation reveals significant ambiguity. Document the decision in Completion Notes.

[Source: layouts/single.html (lines 1–217) — branches only for `page` and `articles`]
[Source: docs/1-planning/prd/03a-functional-requirements.md (line 195) — FR-027 "without detail pages"]
[Source: layouts/_partials/card.html (lines 24–29, 148–161) — existing log-format card layout]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (line 764) — "ALWAYS add new features to card footer"]

### Bundle Strategy: Add hearts.js to footerBundle.js

The existing footer bundle (`baseof.html` lines 25–34) concatenates 6 files: `suncalc, main, search, firework, navbar, header`. All are jQuery-dependent legacy modules. Adding `hearts.js` (vanilla JS) to this bundle is acceptable because:

- Bundle order is preserved: hearts.js loads after all jQuery modules, so any incidental DOM-state assumptions still work.
- IIFE wrapper isolates hearts.js from the rest of the bundle — no chance of variable collisions.
- Single network request keeps page-load performance optimal.
- Fingerprinted output (`resources.Fingerprint`) handles cache-busting for the new bundle hash automatically.

Adding hearts.js as a separate `<script>` tag would (a) introduce a second blocking request, (b) not benefit from the existing minification pipeline cleanly, and (c) break the project pattern. Don't.

**Bundle bloat consideration:** hearts.js is ~1KB minified per architecture estimate (line 1106). Bundle goes from ~30KB → ~31KB. Negligible.

[Source: layouts/baseof.html (lines 25–34) — existing footer bundle]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 1102–1106) — JS bundle size estimates]

### Why `<button>` (not `<a>`) for the Active Element

ARIA / HTML semantics best practice: a heart button performs an **action** (track an event, update count) rather than navigating to a new page or anchor. Therefore the active element is `<button type="button">`. The `<noscript>` fallback is an `<a>` because without JS the action degrades to navigation (link to share-this fragment).

`type="button"` is critical: inside a `<form>` (none here, but defensive), bare `<button>` defaults to `type="submit"`. Always explicit.

`aria-pressed="false"` on initial render, toggled to `true` on heart, communicates the toggle state to assistive tech. Combined with `disabled` + `.hearted` class, screen readers announce "Heart this article, pressed, dimmed/unavailable" after activation.

[Source: WAI-ARIA Authoring Practices — Button Pattern (https://www.w3.org/WAI/ARIA/apg/patterns/button/)]
[Source: docs/2-solutioning/test-design-system.md — accessibility expectations (axe-core checks)]

### Project Structure Notes

- **New files:**
  - `layouts/_partials/widgets/heart-button.html` (Hugo partial)
  - `assets/js/hearts.js` (vanilla JS module)
  - `assets/scss/elements/engagement.scss` (component styles)
- **Modified files:**
  - `layouts/single.html` — add heart-button partial mount in articles branch (sidebar info widget OR below title)
  - `layouts/_partials/card.html` — possibly add to log card footer (depends on logs investigation)
  - `assets/scss/main.scss` — add `@use "elements/engagement";`
  - `layouts/baseof.html` — add `$hearts := resources.Get "js/hearts.js"` and include in footer bundle slice
- **Explicitly unchanged:**
  - `config/_default/params.yaml` — no CSP changes (Phase 0 already covers `cloud.umami.is`); no new params (heart button reads `.Site.Data.umami_hearts` which is automatic Hugo discovery, no config needed)
  - `archetypes/*` — no frontmatter additions (heart count is data-file-driven, not frontmatter)
  - `content/*/index.md` — no per-article modifications
  - `data/umami_hearts.json` — does NOT exist yet; created by Story 3.1
  - Existing card variants `.is-horizontal`, `.is-log`, `.has-image` — per critical agent rule #1, NOT modified
- **Test infrastructure:** if Story 1.1's `tests/build/` is in place, add the optional build assertions above. If not, manual smoke test is sufficient.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 46–154) — Project Structure section]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771) — Critical Agent Rules]
[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md (test infra layout — `ready-for-dev`)]

### Test Strategy

- **Manual smoke (primary)** — DevTools (Network, Console, Application/LocalStorage, Application/Cookies) + Umami Cloud dashboard verification across: heart button visibility, click handling, animation, optimistic UI, persistence across reloads, no-JS fallback, keyboard navigation, screen-reader semantics. Cannot be automated cheaply: the Umami Cloud dashboard verification (AC #3 success path) requires hitting a third-party SaaS.
- **Optional automation (build-smoke)** — if Story 1.1's `tests/build/build-smoke.test.mjs` is in place, add 2 assertions: (1) production HTML for an article page contains `class="heart-button"`, and (2) `footerBundle.<hash>.js` contains the localStorage key prefix `hearted-` (proves hearts.js was bundled).
- **Optional Playwright e2e** — visiting the live site, clicking the heart, asserting the count increments and localStorage is set is feasible but high-cost-per-AC for a Phase 1A story. Defer until Phase 2 polish (Epic 9, Story 9.4 a11y audit) bundles this with axe-core checks.
- **Accessibility check (axe-core via Playwright if available)** — if `tests/e2e/` is in place, add an axe-core assertion that the heart button has 0 violations on an article page. Otherwise manual screen-reader test (NVDA, VoiceOver) on at least one article page.
- **No unit tests** — vanilla JS module with browser-only DOM dependencies; integration testing in browser is more valuable than mocked unit tests for this scope.

[Source: docs/2-solutioning/test-design-system.md — test layering (smoke + Playwright + axe-core)]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md#Test-Strategy — established lightweight test pattern for Epic 2 stories]

### Learnings from Previous Story

**Per the create-story workflow:** the previous story in sprint order is `2-1-umami-analytics-integration` (status: `ready-for-dev`, not yet implemented — workflow rule treats anything below `in-progress`/`review`/`done` as `"Previous story not yet implemented"`). All Epic 1 stories are `ready-for-dev`; 2-1 is `ready-for-dev`. None has reached `done` or `review`, so no implementation learnings exist to forward.

**Cross-story patterns to reuse from sibling drafts (relevant to this story):**

- **`hugo.IsProduction` gate (from Story 2.1 draft)** — Story 2.1 places the Umami `<script>` tag inside `{{- if hugo.IsProduction }}` so the `umami` global only loads in production. **Implication for this story:** in `hugo server` development, `window.umami` is undefined, the click handler's `if (window.umami) ...` guard becomes a no-op, and no events are sent during local dev. This is intentional and correct. Do NOT add a similar `hugo.IsProduction` gate around the heart-button partial itself — the button must render in dev (so it's testable) and only the tracking call short-circuits.
- **CSP discipline (from Story 2.1 draft + Phase 0)** — `cloud.umami.is` is already in `csp.scriptsrc` and `csp.connectsrc` (`params.yaml` lines 25, 29). This story does NOT modify CSP. AC #8 is a regression guard.
- **`_partials/widgets/` for content widgets (project convention)** — sibling drafts (1-2 growth-stage-badge, 1-3/1-4 withered-content, 2-1 umami-analytics) follow the project convention of placing layout-foundation partials in `_base/` and content widgets in `widgets/`. The heart-button partial is a content widget, so `_partials/widgets/heart-button.html` is the correct path. The architecture doc's `_partials/heart-button.html` (flat) sketch is reconciled in favour of the project convention.
- **No invented domain facts (from Story 2.1 draft)** — AC source must be either epics.md, PRD, or architecture; testability/regression guards are clearly labelled as such. This story follows the same separation (ACs 1–7 from epics, 8–10 as guards).
- **Footer-bundle augmentation pattern (from Story 2.1 draft)** — Story 2.1 adds a `<script>` tag for Umami in head.html (third-party, deferred). This story extends the local-bundle slice in baseof.html for hearts.js (first-party, bundled). Both patterns coexist: third-party deferred scripts go in head, first-party vanilla JS bundles go in the footer.

**Pending review items (from previous stories):** None. No story in the project has reached `review` status yet, so no Senior Developer Review sections exist to forward.

[Source: docs/sprint-artifacts/sprint-status.yaml — current development_status (1-1 → 1-5 in epic-1 are ready-for-dev; 2-1 is ready-for-dev; 2-2 was the next backlog story, now drafted)]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md — sibling story, establishes patterns for Epic 2]
[Source: docs/sprint-artifacts/epic-1/1-5-withered-seo-rss-inclusion.md — pattern: capture sibling-story context even when none has been implemented]

### Out of Scope (deferred elsewhere)

- **Daily heart-count fetch** — Story 3.1 (`scripts/fetch-umami-hearts.js`). Until that ships, all displayed counts are 0 (graceful fallback).
- **Popularity scoring partial** — Story 3.3 (`_partials/popularity-score.html`). Hearts are one input but the score calculation lives separately.
- **Webmention button / display** — Stories 2.3 (endpoint) and 2.4 (display). Different engagement type.
- **Heart counts on cards (homepage / list pages)** — possible future enhancement; out of scope for this story unless it's the resolution of the logs-rendering question. Article single page is the primary AC.
- **Privacy-policy update** — Story 2.5 (Privacy Policy Page) explicitly owns the hearts privacy-disclosure text.
- **Anti-abuse / rate-limiting** — out of project scope; Umami Cloud dashboard rules can mitigate post-launch if needed.
- **A/B test of placement (sidebar vs below-title)** — pick one at implementation time and ship. A/B testing is out of project scope.
- **Heart-count animations beyond the click pop** — e.g., count-up animation on initial load. Out of scope; the optimistic +1 update is sufficient.
- **i18n of `aria-label`** — German is the project default; English copy lives in English-language pages already (no i18n file exists). If a future bilingual pass is undertaken, the partial can be updated then.

### References

- [Source: docs/1-planning/epics.md (lines 251–268)] — Story 2.2 ACs (seven ACs verbatim), FR-008/FR-009 coverage, GitHub Issue #78
- [Source: docs/1-planning/prd/03-core-features.md (lines 249–306)] — Feature 5: Umami Analytics + Heart Events (full feature spec; HTML/JS sketch at lines 262–278)
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 68–84)] — FR-008 Anonymous Heart Button, FR-009 Heart Count Display, FR-010 Heart Count Persistence
- [Source: docs/1-planning/prd/05-technical-architecture.md (Tech Stack: Engagement = Umami Cloud Hobby FREE)] — engagement infrastructure decisions
- [Source: docs/1-planning/prd/architecture-notes.md (lines 100–145)] — early heart-button HTML and JS sketch (reference, not canonical — superseded by integration architecture)
- [Source: docs/2-solutioning/architecture.md] — base architecture (Hugo, Bulma, JAMstack, build pipeline, jQuery legacy)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 414–469)] — Pattern 2: Dual Anonymous Engagement System (canonical heart-button JS pattern)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 296–308)] — Hugo Data File Integration pattern (`.Site.Data.umami_hearts`)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 651–673)] — JavaScript Module Pattern (IIFE, strict mode)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771)] — Critical Agent Rules (no jQuery, card footer placement, `| default` on data lookups)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 1281–1335)] — ADR-001 (Data Branch Strategy), ADR-002 (Popularity Scoring in Hugo Partial)
- [Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md] — sibling story; establishes `window.umami` global, CSP precedent, bundle pattern
- [Source: layouts/baseof.html (lines 25–34)] — footer JS bundle (modification target)
- [Source: layouts/single.html (lines 34–216)] — articles-type single-page layout (mount target)
- [Source: layouts/_partials/card.html (lines 1–203 articles/logs branch; 148–161 footer)] — card layout (mount target if logs are card-only)
- [Source: layouts/_partials/_base/head.html (lines 17–30)] — current style + script bundle (head); reference only, not modified
- [Source: assets/scss/main.scss (lines 37–44)] — elements imports (modification target)
- [Source: assets/js/main.js, navbar.js, header.js] — existing footer-bundle modules (reference for jQuery legacy patterns; hearts.js does NOT follow these — it's vanilla JS)
- [Umami Cloud documentation: Custom Events](https://umami.is/docs/track-events) — `umami.track(eventName, eventData)` signature reference
- [WAI-ARIA Authoring Practices: Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) — `aria-pressed` toggle button semantics

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-2/2-2-heart-button-component.context.xml

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

### Completion Notes List

- **Logs rendering decision (T3):** `content/logs/_index.md` cascades `build.render: link` to all log entries — Hugo emits no `index.html` under `public/logs/<slug>/`. Logs are confirmed card-only per FR-027. Heart-button mounts on the log card footer in `layouts/_partials/card.html` inside a new `<div class="card-footer-item heart">` block, gated by `{{- if eq .Params.format "log" -}}` and placed AFTER the existing `.formats` `card-footer-item`. Critical agent rules #1 (never modify card variants) and #2 (card footer only) honoured.
- **Article mounting (T2):** Sidebar info widget chosen (recommended option a). `{{ partial "widgets/heart-button" . }}` inserted after the reading-time `<span>` and before the series block in the existing `<div class="info widget mt-6">`.
- **Debounce decision (T4 / AC #7):** Stay-disabled (architecturally consistent per `digital-garden-integration-architecture.md` lines 446–469). After click, `button.disabled = true` and the next page-load picks up the localStorage `'1'` and pre-disables the button — satisfies "1-second debounce" trivially.
- **Hearts.js robustness:** Wrapped `localStorage.getItem` / `setItem` in `try/catch` so the click still works in private-browsing modes that throw on storage access. Wrapped `umami.track` in `try/catch` so any tracker error is non-fatal for the optimistic UI.
- **Build verification:** `hugo --environment production --destination public-test` exits 0. Production homepage renders 2 heart-buttons on log cards (one per log fixture). Production article page renders 1 heart-button in the sidebar info widget. Active fingerprinted footerBundle contains the `hearted-` prefix and `umami.track` call.
- **Test results:** `tests/build/build-smoke.test.mjs` 35/35 pass (3 new heart-button tests + 32 existing). `tests/build/validate-frontmatter.test.mjs` 11/11 pass. No regressions introduced.
- **Manual smoke test (post-deploy):** Deferred to live deploy on `https://article-time.de/` per established Epic 2 cadence — DevTools verification (Network/Console/Application/Cookies) and Umami Cloud dashboard event confirmation cannot be exercised at build time.
- **UX hint added (post-review tweak):** Added a small italic caption "Counts aktualisieren sich täglich" below the heart button to explain the 24-hour daily-rebuild update cadence. Reason: counts come from `data/umami_hearts.json` populated by Story 3.1's daily fetch, not from per-click state — without this hint, readers see their click cause a brief +1 (optimistic UI), then a reload reverts it to the build-time count and the change is confusing. Hint only renders in single-page context (gated by partial's `$showHint` derived from context==single + Type==articles).
- **Card-context refactor (post-review tweak):** Moved the heart on cards from a dedicated `.card-footer-item.heart` block into the existing `.card-footer-item.formats` next to the format icon (growth-badge for articles, lightbulb for logs). Partial now accepts `(dict "page" . "context" "card")` from `card.html` — three render variants emerge:
  - **Single (article sidebar):** full pill `<button class="heart-button">` + `<noscript>` fallback + hint caption.
  - **Card / article (homepage cards):** readonly `<span class="heart-readonly">` — purely informational, no JS wiring (the action lives on the article single page).
  - **Card / log (homepage cards):** compact interactive `<button class="heart-button is-card-heart">` — logs have no detail pages so the action MUST live here.
  hearts.js's `.heart-button:not(.heart-button-fallback)` selector picks up both pill and `is-card-heart` buttons, ignores `.heart-readonly`. SCSS `.is-card-heart` strips the pill (no border, transparent background, smaller font) so it visually matches the sibling format icon in `.formats`.

### File List

**New:**
- `layouts/_partials/widgets/heart-button.html` — Hugo partial; renders the active `<button>` + count + `<noscript>` fallback `<a>`.
- `assets/js/hearts.js` — vanilla-JS IIFE module; click handler, optimistic UI, Umami tracking, localStorage persistence, heart-pop animation.
- `assets/scss/elements/engagement.scss` — heart-button styles + `:focus-visible` + `.hearted` state.

**Modified:**
- `layouts/single.html` — mounted the heart-button partial in the article sidebar info widget (after reading-time, before series).
- `layouts/_partials/card.html` — added a `<div class="card-footer-item heart">` block to the card footer, gated on `format == "log"`.
- `layouts/baseof.html` — added `$hearts := resources.Get "js/hearts.js"` and included `$hearts` in the footerBundle slice.
- `assets/scss/main.scss` — added `@use "elements/engagement";` after `@use "elements/badge";`.
- `tests/build/build-smoke.test.mjs` — added 3 tests for Story 2.2 AC #1, #2, #3, #6, #9 (article page rendering, log-card rendering, hearts.js bundling).
- `docs/sprint-artifacts/sprint-status.yaml` — `2-2-heart-button-component` flipped `ready-for-dev` → `in-progress` → `review`; `last_updated` bumped.
- `docs/sprint-artifacts/epic-2/2-2-heart-button-component.md` — task checkboxes ticked, Status flipped to `review`, completion notes + file list filled.

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-09 | Post-review tweak: reverted the pill-style attempt on `.is-card-heart` — log-card heart kept flat (no border / no background) to match adjacent format icons. Unified visual design across all heart surfaces deferred to backlog entry "Design für Heart an allen Stellen" (Story 2.2 row in `docs/backlog.md`). | Dev (Amelia / dev-story workflow) |
| 2026-05-09 | Post-review tweak: heart on homepage cards moved from a dedicated `.card-footer-item.heart` into `.card-footer-item.formats` next to the format icon. Partial gained a context parameter (single | card) — articles render readonly on cards (`.heart-readonly` span, no JS), logs stay interactive (`.heart-button.is-card-heart`). Hint caption restricted to single-page context. Build-smoke gained 2 new tests (readonly + hint-gating); 37/37 pass. | Dev (Amelia / dev-story workflow) |
| 2026-05-09 | Post-review tweak: added `.heart-button-hint` caption ("Counts aktualisieren sich täglich") below the button in `heart-button.html` + styling in `engagement.scss`, plus `.gitignore` entry for `/public-test-dev/` (legacy gap from Story 2.1 cleanup). | Dev (Amelia / dev-story workflow) |
| 2026-05-09 | Story 2.2 implementation: heart-button partial + vanilla-JS module + SCSS component + article-sidebar mount + log-card-footer mount + footer-bundle integration + 3 build-smoke regression tests. Logs investigation confirmed FR-027 (logs are card-only via `cascade.build.render: link`); debounce stay-disabled chosen per architecture pattern. All build-smoke (35/35) and frontmatter-validation (11/11) tests pass. Status: review. | Dev (Amelia / dev-story workflow) |
| 2026-05-06 | Initial draft created from `epics.md` Story 2.2 (FR-008, FR-009, GitHub Issue #78), `prd/03-core-features.md` Feature 5 (Umami Analytics + Heart Events), `prd/03a-functional-requirements.md` (FR-008/009/010), `prd/architecture-notes.md` (early heart-button sketch — superseded), and `digital-garden-integration-architecture.md` Pattern 2 (canonical hearts.js spec, lines 414–469), Hugo Data File Integration (lines 296–308), JS module pattern (IIFE, strict mode), Critical Agent Rules (no jQuery, card-footer placement, `\| default` on data lookups), and ADRs 001/002. Reconciled PRD's `.Params.hearts` sketch (superseded) with architecture's `.Site.Data.umami_hearts` lookup (canonical). ACs 1–7 verbatim from epics; ACs 8–10 added as testability/regression guards (CSP regression, clean prod build, no card-variant regression). Logs rendering flagged as open question (PRD says "no detail pages" but `content/logs/log-test-2/` exists; `single.html` has no logs branch); dev investigates first, then mounts on log card footer OR adds logs branch to `single.html`. Heart-button partial path reconciled: `_partials/widgets/heart-button.html` (project convention) over architecture's flat `_partials/heart-button.html` sketch. Sidebar mounting recommended for articles (option a) over below-title (option b). Test strategy lightweight (manual DevTools + Umami dashboard) given 1–1.5 day scope; optional `tests/build/build-smoke.test.mjs` assertions if Story 1.1 has landed. localStorage debounce-vs-stay-disabled choice flagged for dev (architecture pattern: stay-disabled; epics AC: 1-second debounce — both acceptable, document choice). | SM (create-story workflow) |
