# Story 2.7: Cookie-Banner UI

Status: ready-for-dev

## Story

As a reader concerned about privacy,
I want a clear, dismissible notice on first visit explaining that this site uses cookieless analytics and sets no tracking cookies,
so that I understand the site's privacy posture without being interrupted on every page load.

## Acceptance Criteria

1. **Banner partial created at `layouts/_partials/_base/cookie-banner.html`** (matches existing `_base/` partials convention — siblings: `head.html`, `seo.html`, `navigation.html`, `hero.html`, `footer.html`). The partial renders a single `<div id="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-text">` containing: a title (`<strong id="cookie-banner-title">`), a body paragraph (`<p id="cookie-banner-text">`), a close button (`<button class="cookie-banner-close" aria-label="Hinweis schließen">` with a remix-icon `close-line` glyph), and a link to the privacy policy. Hidden by default (`hidden` attribute on the wrapper) so there is no flash-of-banner before the JS decides whether to show it (FOUC avoidance — same pattern Story 2.4's webmention component will use). Partial is **included from `layouts/baseof.html`** as the last child of `<body>` (after `<button id="back-to-top">`, before the footer-bundle `<script>` tag), gated by `{{- if not .Params.robotsdisallow -}}{{ partial "_base/cookie-banner" . }}{{- end -}}` (AC #7 noindex suppression).

2. **Banner appears once per session on first visit and is dismissible via close button.** Dismissal state stored as `sessionStorage.setItem('cookie-banner-dismissed', '1')` (NOT a cookie — AC literal "NO cookies"). The flag clears automatically when the browser tab/session ends (sessionStorage scope), so a returning visitor in a fresh session sees the banner again — this is the AC's literal "once per session". JavaScript flow on page load: (a) read `sessionStorage.getItem('cookie-banner-dismissed')`; (b) if truthy → leave banner hidden, return; (c) else → remove `hidden` attribute and add `is-visible` class to trigger CSS slide-in transition. Close-button click: set the sessionStorage flag, add `is-dismissing` class for slide-out transition, remove `is-visible`, then `setTimeout(() => banner.remove(), 300)` to drop the node from DOM after the transition completes. **Edge case:** sessionStorage may be unavailable (private-mode quirks, storage quota exceeded, disabled by user). Wrap reads/writes in `try { … } catch (e) { /* ignore — banner shows every page-load, which is acceptable degraded behaviour */ }`.

3. **Banner text explains: cookieless analytics (Umami), no tracking cookies, link to Privacy Policy.** Suggested German baseline (informal `Du`-form to match `datenschutz.md`, `impressum.md`, and the rest of the site copy):
   ```html
   <strong id="cookie-banner-title">Hinweis zur Datenverarbeitung</strong>
   <p id="cookie-banner-text">
     Diese Seite nutzt <a href="https://umami.is" rel="external noreferrer">Umami</a> für anonyme,
     <strong>cookielose</strong> Reichweitenmessung. Es werden <strong>keine Tracking-Cookies</strong>
     gesetzt und keine personenbezogenen Daten erhoben. Details und Deine Rechte findest Du in der
     <a href="/pages/datenschutz/">Datenschutzerklärung</a>.
   </p>
   ```
   **URL reconciliation (AC #3 vs Story 2.5):** epics AC #3 names "Privacy Policy (Story 2.5)" — Story 2.5's reconciliation pinned the actual URL to `/pages/datenschutz/` (German slug, existing footer-menu wired) rather than the originally-named `/pages/privacy/`. This story uses `/pages/datenschutz/` to match. Same German-language reconciliation pattern Stories 2.2 / 2.4 / 2.5 followed. Verification at implementation time: confirm `content/pages/datenschutz.md` resolves to `/pages/datenschutz/` (e.g., `hugo --quiet && grep "datenschutz" public/sitemap.xml` or open the rendered home page and inspect the footer's "Datenschutz" link). If Story 2.5 has landed and shifted the slug for some reason, follow the actual deployed URL.

4. **Banner integrates with existing `assets/js/gdpr.js` (already imported in head bundle).** Implementation **adds vanilla-JavaScript** banner logic to `assets/js/gdpr.js`. **Critical Agent Rule #5 reconciliation:** the architecture rule "NEVER use jQuery (use vanilla JavaScript for all new features)" (digital-garden-integration-architecture.md line 768) overrides the AC's allusion to "existing gdpr.js" — `gdpr.js` already mixes vanilla helpers (`getCookie`, `setCookie`, `deleteCookie`) with a jQuery `$(document).ready` block (visited-articles handler, lines 114–149 of current `gdpr.js`). The new banner code adds **only vanilla JS** (no `$(...)` calls); the legacy jQuery handler is grandfathered (out of scope for this story). Specifically: add a new `(function () { /* banner init */ })();` IIFE near the top of `gdpr.js` (above the existing helpers) that runs on `DOMContentLoaded`, queries `document.getElementById('cookie-banner')`, and wires the show/dismiss logic per AC #2. The bundle wiring at `layouts/_partials/_base/head.html` lines 26–30 (`$jQuery $gdpr | resources.Concat "js/bundle.js" | resources.Minify | resources.Fingerprint`) is **unchanged** — `gdpr.js` is already in the head bundle, so the new code ships automatically with the next build. Replace the `<!-- TODO: gdpr.js mit Cookie Consent verbinden -->` comment at head.html line 28 with a one-line note pointing to `cookie-banner.html` partial as the wiring (or remove the TODO entirely since the work is now done).

5. **Banner styled non-intrusive (bottom-fixed, semi-transparent, matches site theme).** New SCSS module at `assets/scss/elements/cookie-banner.scss` (matches `assets/scss/elements/{badge,box,button,pagination,ribbon,search,tooltip}.scss` ITCSS-inspired convention per `architecture.md` lines 233–241). Wired into `assets/scss/main.scss` via a new `@use "elements/cookie-banner";` line in the "Elements" block (after `@use "elements/tooltip";`). Style baseline:
   - `position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;` — site uses `z-index: 999999` for `#back-to-top` (main.scss line 205) so 100 stays comfortably below it (back-to-top must remain clickable when banner is visible).
   - `background-color: rgba(helpers.$dark, 0.95);` with a `backdrop-filter: blur(6px);` for the semi-transparent effect (matches dark theme — `helpers.$dark` is the project's primary surface variable).
   - `padding: 1rem 1.5rem;` and `max-width: 960px; margin: 0 auto;` to align with site content width on desktop.
   - Close button styled as a small icon button in the upper-right corner (using `remixicon` `close-line` per project convention; same icon system as `_base/footer.html` line 30 et al).
   - Slide-up entry transition: starts at `translateY(100%)`, transitions to `translateY(0)` when `.is-visible` class added (300ms ease-out). Mirror slide-down on `.is-dismissing`.
   - Mobile (`@media (max-width: 640px)`): stack title/text/close vertically; padding reduced; full-width.
   - **Print suppression (AC #7):** add `@media print { #cookie-banner { display: none !important; } }` block. The `!important` is justified because `.is-visible` is the dynamic show-state and `display: none` from a print-media rule must beat it.
   - Do **NOT** restore the legacy `blog-old/themes/article/assets/scss/15-cookiebanner.scss` styling verbatim — it was a 3-button consent flow (Accept / Reject / Open) that this story does NOT implement. Borrow only the bottom-fixed positioning idea.

6. **Banner accessible (keyboard-dismissible, ARIA `role="dialog"`, screen-reader friendly).**
   - **Keyboard dismissal:** add a global `keydown` listener that closes the banner on `Escape` (only while the banner is visible, to avoid stealing Escape from other dialogs). Close button is keyboard-focusable by default (it's a `<button>`) and triggers the same dismissal logic on `Enter`/`Space`.
   - **Focus management:** when the banner becomes visible on first paint, do NOT auto-focus the close button (would steal focus from the page content during pageload — bad UX for screen-reader users who want to read the article first). Instead, ensure the close button has a logical tab-order position (visually upper-right, last in DOM order so Tab from page bottom reaches it). Document this decision in completion notes.
   - **ARIA:** `role="dialog"` per AC #6 literal text. `aria-modal="false"` because the banner is non-blocking (the page behind remains interactive — user can read articles, click links, scroll without dismissing). `aria-labelledby="cookie-banner-title"` and `aria-describedby="cookie-banner-text"` link to the H-equivalent and body text for screen reader announcement. The close button has `aria-label="Hinweis schließen"` (German, matches Story 2.2 / 2.4's German UI string convention).
   - **Reduced motion:** add `@media (prefers-reduced-motion: reduce) { #cookie-banner { transition: none; } }` so users with the OS-level "Reduce motion" preference don't see the slide animation.
   - **Screen-reader announcement on first show:** because `role="dialog"` paired with `aria-modal="false"` does not always trigger an automatic SR announcement on visibility change (browser/SR variation), add `aria-live="polite"` to the wrapper as a belt-and-braces — polite live regions announce content additions without interrupting current speech. Do NOT use `assertive` (would interrupt the user).

7. **Banner suppressed in noindex contexts and via `@media print`.**
   - **Noindex contexts:** the partial is **not rendered at all** when `.Params.robotsdisallow` is true on the current page. Implementation: gate the `partial "_base/cookie-banner" .` call in `baseof.html` with `{{- if not .Params.robotsdisallow -}}…{{- end -}}`. This means pages like `content/pages/datenschutz.md` (which has `robotsdisallow: true` set per Story 2.5's reconciliation), `content/pages/impressum.md`, and any other transparency pages will NOT show the banner. Rationale: those pages are themselves the privacy-disclosure content; showing a meta-notice about privacy on the privacy page itself is redundant and creates a paradox (banner says "see Datenschutz" while the user is already on Datenschutz). Verification: build, open `public/pages/datenschutz/index.html`, grep for `cookie-banner` — should yield zero matches.
   - **`@media print`:** the SCSS `@media print { #cookie-banner { display: none !important; } }` rule (AC #5) handles this. Verification: open browser print preview on a sample article — banner not visible in the preview.
   - The two suppression mechanisms are **independent and complementary** (server-side template gate for noindex pages; client-side CSS rule for print). A page with `robotsdisallow: false` printed by the user still hides the banner via CSS even though the partial is rendered into the DOM.

8. **No regression to existing layouts, scripts, or build outputs** (testability guard). Diff `public/index.html`, `public/articles/<sample-post>/index.html`, `public/pages/datenschutz/index.html`, `public/pages/impressum/index.html` before and after the change:
   - Home, articles, log pages: should now contain the new `<div id="cookie-banner" hidden …>` block as the last child of `<body>` (before footer scripts), AND the bundle.js fingerprint hash should change (because `gdpr.js` has new code, the concatenated bundle has a new hash → new filename).
   - Pages with `robotsdisallow: true` (`datenschutz`, `impressum`): the `cookie-banner` block should NOT appear in the rendered HTML.
   - Bundle.js content change is expected; CSS bundle (`style.<hash>.css`) hash also changes due to new SCSS `@use`. Both are normal fingerprint refresh, not regressions.
   - All other body content remains byte-equivalent. Sitemap unchanged. RSS feed unchanged. Footer menu unchanged.
   - **Critical Agent Rule reminders (digital-garden-integration-architecture.md lines 762–771) applied here:**
     - Rule #1 (don't modify card variants) — N/A (no card edits).
     - Rule #5 (no jQuery) — APPLIES; new banner JS is vanilla per AC #4 reconciliation.
     - Rules #2–4, #6–7 — N/A for this story.

9. **Automated regression tests added** (testability guard, **consistency with Epic-2 done-stories**). Test infrastructure landed with Story 1.1 (now `done`); every done-story in Epic 2 (2.1, 2.2, 2.3, 2.4, 2.5, 2.6) has dedicated assertions in `tests/build/build-smoke.test.mjs`. This story follows the same pattern — skipping tests would make 2.7 the only Epic-2 story without regression coverage. Add to `tests/build/build-smoke.test.mjs`:
   - **AC #1+#7 (banner rendered on indexable pages):** production homepage and a production article page both contain a `<div id="cookie-banner" hidden role="dialog" aria-modal="false" …>` block exactly once. Pattern: regex match against `public/index.html` and `public/articles/<sample>/index.html`, mirroring the Story 2.3 webmention-`<link>` test (`build-smoke.test.mjs:1080–1106`).
   - **AC #7 (banner suppressed on noindex pages):** `public/pages/datenschutz/index.html` and `public/pages/impressum/index.html` contain **zero** matches for `id="cookie-banner"`. Pattern: assert `!html.includes('id="cookie-banner"')`. Mirror Story 2.5's noindex/sitemap-exclusion test (`build-smoke.test.mjs:1817–1841`).
   - **AC #2+#4 (banner JS bundled into head bundle):** `public/js/bundle.<hash>.js` contains the string `cookie-banner-dismissed` (proves the new vanilla-JS IIFE survived minification + concatenation). Mirror Story 2.2's hearts-bundle smoke test pattern (`build-smoke.test.mjs:1359–1400`).
   - **AC #6 (ARIA wiring regression guard):** the banner block on `public/index.html` contains all of `role="dialog"`, `aria-modal="false"`, `aria-labelledby="cookie-banner-title"`, `aria-describedby="cookie-banner-text"`, `aria-live="polite"`. Single regex match against the captured banner element.
   - **OPTIONAL Playwright spec** at `tests/e2e/cookie-banner.spec.ts` (~30 lines, mirror `tests/e2e/withered-banner.spec.ts` structure) covering: (a) banner appears on first visit to home page, (b) banner stays dismissed within the same session after close-button click + page reload, (c) banner does NOT appear on `/pages/datenschutz/`. Add only if the 0.5-day estimate has headroom — build-smoke tests above are the must-have; Playwright is the nice-to-have. Per `feedback_no_redundant_test_runs.md` memory: one full `npm test` after all tests are wired, not after each individual addition.

### AC Source & Reconciliation Note

ACs 1–7 are derived verbatim from `docs/1-planning/epics.md#Story-2.7-Cookie-Banner-UI` (lines 392–417 of `epics.md`). ACs 8–9 are testability/regression guards added by the create-story workflow (no-regression to layouts/build outputs, no-automated-tests scope-limit). They are NOT in the original epics list — they exist solely to make ACs 1–7 verifiable and to prevent scope creep into Phase 1A test-infrastructure (Story 1.1's territory).

**Convention reconciliation (AC #3 wording — Privacy Policy URL):** Epics AC #3 says "link to Privacy Policy (Story 2.5)". Story 2.5's reconciliation pinned the privacy page to the existing German slug `/pages/datenschutz/` (not the originally-named `/pages/privacy/`). This story follows the actual deployed URL. Same German-language reconciliation pattern Stories 2.2 / 2.4 / 2.5 used.

**Convention reconciliation (AC #4 wording — "integrates with existing `gdpr.js`"):** The legacy `gdpr.js` mixes vanilla helpers and jQuery. Critical Agent Rule #5 (no jQuery for new features) overrides the AC's literal "existing" framing — the new banner code is **vanilla JS** appended to `gdpr.js`. The AC's intent (use the same file, ship via the existing head bundle) is fully preserved; the implementation detail (vanilla vs jQuery) follows the architecture rule.

**Convention reconciliation (AC #6 wording — `role="dialog"`):** The AC literally specifies `role="dialog"`. A non-modal session notice could semantically use `role="region"` or `role="status"`, but following the AC verbatim with `aria-modal="false"` (since this is a non-blocking notice, not a modal interrupt) satisfies both the AC text and the underlying ARIA-correctness requirement. Documented for the reviewer's awareness.

[Source: docs/1-planning/epics.md (lines 392–417) — seven ACs verbatim, FR-048 coverage extension, GitHub Issue #94, prerequisite Story 2.5, source-restoration reference to `blog-old/themes/article/layouts/partials/cookie-banner.html`]
[Source: docs/1-planning/prd/03a-functional-requirements.md (lines 330–340) — FR-047 (Zero Tracking Cookies), FR-048 (Privacy Policy Publication) — this story extends FR-048's surfacing into the runtime UI]
[Source: docs/2-solutioning/architecture.md (lines 210–229) — JS module pattern: gdpr.js exists in jQuery-based modules list; "GDPR: localStorage persistence" baseline (sessionStorage substitution per AC #2 is a tighter scoping)]
[Source: docs/2-solutioning/architecture.md (lines 233–241) — SCSS ITCSS-inspired structure: `assets/scss/elements/` is the correct home for new component styles]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771) — Critical Agent Rules; #5 (no jQuery) drives AC #4 reconciliation]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 1056–1062) — Client-Side Considerations: cookieless analytics, no cookies for analytics; informs banner copy (AC #3)]
[Source: docs/0-discovery/feature-gap-blog-old.md (lines 24–30) — "Cookie-Banner UI: gdpr.js wurde ins neue Repo übernommen, Aber: Banner-Partial fehlt"; this story closes that gap]
[Source: blog-old/themes/article/layouts/partials/cookie-banner.html — legacy reference, structural inspiration only (do not restore the 3-button Accept/Reject/Open flow)]
[Source: blog-old/themes/article/assets/scss/15-cookiebanner.scss — legacy style reference (bottom-fixed, dark surface) — borrow positioning idea, simplify rest]
[Source: layouts/_partials/_base/head.html (lines 26–30) — gdpr.js bundle wiring; "TODO: gdpr.js mit Cookie Consent verbinden" comment closed by this story]
[Source: layouts/baseof.html (lines 1–47) — partial inclusion site for the new cookie-banner partial]
[Source: assets/js/gdpr.js — current state (vanilla helpers + commented-out jQuery banner code + active jQuery visited-articles handler)]
[Source: config/_default/params.yaml (CSP block at lines 32–44) — CSP scriptsrc/stylesrc allow self-hosted bundle; no CSP changes needed for this story]
[Source: docs/sprint-artifacts/epic-2/2-5-privacy-policy-page.md (AC #1 reconciliation) — privacy page URL is `/pages/datenschutz/`; consumed by AC #3 link target]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md (AC #4) — Umami cookieless mode; informs banner copy "cookielose Reichweitenmessung"]

## Tasks / Subtasks

- [ ] **Audit current state of `assets/js/gdpr.js`, `layouts/baseof.html`, and `layouts/_partials/_base/head.html`** (AC: 1, 4) [Source: assets/js/gdpr.js, layouts/baseof.html, layouts/_partials/_base/head.html]
  - [ ] Re-read all three files at implementation time. The files may have been edited by sibling stories (2.1, 2.2, 2.3, 2.4) between this story's drafting and implementation — reconcile actual current state, not the snapshot in this story's draft.
  - [ ] Confirm `gdpr.js` still has the legacy commented-out jQuery banner block (lines 1–54 of current file) and the active jQuery visited-articles handler (lines 114–149). The new vanilla banner code goes at the top of the file (above the helpers, around line 56) so it lives in a single visually distinct block.
  - [ ] Confirm `baseof.html` still ends with the back-to-top button (lines 20–24) + footer block (lines 26–28) + footer-bundle script tag (lines 30–41 of current file). The footer-bundle has grown since 2-7 was drafted — it now concatenates 8 JS files (`suncalc`, `main`, `search`, `firework`, `navbar`, `header`, `withered-banner`, `hearts`). The new partial inclusion goes between the `</footer>` close (~line 28) and the `<!-- Footer Scripts -->` comment (~line 30). Re-check line numbers at implementation time — `baseof.html` is a high-churn file.
  - [ ] Confirm `head.html` line 28 still has the `<!-- TODO: gdpr.js mit Cookie Consent verbinden -->` comment. Replace it (or remove it) as part of this story's edits.

- [ ] **Create the `cookie-banner.html` partial** (AC: 1, 3, 6) [Source: AC #1 baseline structure, AC #3 baseline copy, AC #6 ARIA spec; layouts/_partials/_base/footer.html (icon usage pattern)]
  - [ ] Create new file `layouts/_partials/_base/cookie-banner.html` matching the `_base/` partial naming convention.
  - [ ] Implement the markup per AC #1 / AC #3 baseline:
    ```html
    <div id="cookie-banner" hidden role="dialog" aria-modal="false"
         aria-labelledby="cookie-banner-title"
         aria-describedby="cookie-banner-text"
         aria-live="polite">
      <div class="cookie-banner-inner">
        <strong id="cookie-banner-title">Hinweis zur Datenverarbeitung</strong>
        <p id="cookie-banner-text">
          Diese Seite nutzt <a href="https://umami.is" rel="external noreferrer">Umami</a>
          für anonyme, <strong>cookielose</strong> Reichweitenmessung. Es werden
          <strong>keine Tracking-Cookies</strong> gesetzt und keine personenbezogenen
          Daten erhoben. Details und Deine Rechte findest Du in der
          <a href="/pages/datenschutz/">Datenschutzerklärung</a>.
        </p>
      </div>
      <button type="button" class="cookie-banner-close" aria-label="Hinweis schließen">
        <svg class="icon ri-1x">
          <use xlink:href="{{ "fonts/remixicon/remixicon.symbol.svg" | relURL }}?t={{ .Site.Params.remixicon_version }}#close-line"></use>
        </svg>
      </button>
    </div>
    ```
  - [ ] Confirm at implementation time the privacy URL `/pages/datenschutz/` resolves correctly (`hugo --quiet && cat public/pages/datenschutz/index.html` exists).
  - [ ] Use the `.Site.Params.remixicon_version` cache-busting pattern that footer/navigation already use — keeps the icon-symbol URL pattern consistent.

- [ ] **Wire the partial into `layouts/baseof.html`** (AC: 1, 7) [Source: layouts/baseof.html lines 1–47, AC #7 noindex gate]
  - [ ] Add the partial inclusion as the last child of `<body>`, **before** the `<!-- Footer Scripts -->` block (currently at line 30 of `baseof.html` — verify at implementation time, this file churns):
    ```go-html-template
        {{- if not .Params.robotsdisallow }}
            {{ partial "_base/cookie-banner" . }}
        {{- end }}

        <!-- Footer Scripts -->
    ```
  - [ ] Verify partial is not rendered on pages with `robotsdisallow: true` (e.g., `content/pages/datenschutz.md`, `content/pages/impressum.md`, `content/pages/archiv/index.md` if present).

- [ ] **Add vanilla-JS banner logic to `assets/js/gdpr.js`** (AC: 2, 4, 6) [Source: AC #2 sessionStorage flow, AC #4 vanilla-JS reconciliation, AC #6 keyboard dismissal; digital-garden-integration-architecture.md line 768 (Critical Agent Rule #5)]
  - [ ] Add a new IIFE block at the top of `gdpr.js` (above the existing `getCookie` helper at current line 58). Suggested implementation:
    ```js
    // Cookie banner (Story 2.7) — vanilla JS, no jQuery.
    // Architecture rule: see digital-garden-integration-architecture.md Critical Agent Rule #5.
    (function () {
      function init() {
        var banner = document.getElementById('cookie-banner');
        if (!banner) return;
        try {
          if (sessionStorage.getItem('cookie-banner-dismissed') === '1') return;
        } catch (e) { /* sessionStorage unavailable — show banner anyway */ }

        banner.removeAttribute('hidden');
        // Defer the .is-visible class one frame so the CSS transition triggers.
        requestAnimationFrame(function () { banner.classList.add('is-visible'); });

        function dismiss() {
          try { sessionStorage.setItem('cookie-banner-dismissed', '1'); } catch (e) { /* ignore */ }
          banner.classList.remove('is-visible');
          banner.classList.add('is-dismissing');
          setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 300);
        }

        var closeBtn = banner.querySelector('.cookie-banner-close');
        if (closeBtn) closeBtn.addEventListener('click', dismiss);

        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && banner.classList.contains('is-visible')) dismiss();
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    })();
    ```
  - [ ] Do **NOT** uncomment the legacy jQuery banner block (lines 1–54 of `gdpr.js`) — keep it commented as historical reference, or remove it entirely (cleaner; the new vanilla code supersedes it). Document the choice (keep-as-comment vs delete) in completion notes.
  - [ ] Do NOT touch the existing jQuery `$(document).ready` visited-articles handler (lines 114–149) — it's grandfathered out of scope for this story.
  - [ ] Verify the bundle still concatenates cleanly: `hugo --quiet && grep -c cookie-banner-dismissed public/js/bundle.*.js` should return `1` or higher.

- [ ] **Replace the head.html TODO comment** (AC: 4) [Source: layouts/_partials/_base/head.html line 28]
  - [ ] At `layouts/_partials/_base/head.html` line 28, the comment `<!-- TODO: gdpr.js mit Cookie Consent verbinden -->` is now closed. Either:
    - **Option A (recommended):** delete the comment entirely.
    - **Option B:** replace with `<!-- gdpr.js: cookie banner wired via _base/cookie-banner.html partial (Story 2.7) -->`.
  - [ ] Document the choice in completion notes.

- [ ] **Create the SCSS module `assets/scss/elements/cookie-banner.scss`** (AC: 5, 7) [Source: AC #5 styling baseline, AC #7 print-media rule, assets/scss/main.scss Elements block at lines 37–50 (grown since 2-7 was drafted — now also imports `article-info`, `engagement`, `growth-badge`, `withered-banner`, `withered-notice`, `webmentions`), assets/scss/elements/{engagement,article-info,badge,box,button}.scss (sibling pattern), assets/scss/vars/_colors.scss (variable usage)]
  - [ ] Create new file `assets/scss/elements/cookie-banner.scss`. Suggested baseline (refine theme variables for actual project tokens at implementation time — read `assets/scss/vars/_colors.scss` and `_helpers.scss` first):
    ```scss
    @use "sass:color";
    @use "../vars/helpers";

    #cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;            // below #back-to-top (z-index 999)
      max-width: 960px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      background-color: rgba(helpers.$dark, 0.95);
      backdrop-filter: blur(6px);
      color: helpers.$light;
      border-top: 1px solid rgba(helpers.$gold, 0.3);
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      transform: translateY(100%);
      transition: transform 300ms ease-out;

      &.is-visible {
        transform: translateY(0);
      }

      &.is-dismissing {
        transform: translateY(100%);
      }

      .cookie-banner-inner {
        flex: 1;
        font-size: 0.95rem;
      }

      strong { color: helpers.$gold; }
      a { color: helpers.$gold-light; text-decoration: underline; }

      .cookie-banner-close {
        background: transparent;
        border: 1px solid rgba(helpers.$gold, 0.3);
        border-radius: 50%;
        width: 36px;
        height: 36px;
        flex: 0 0 auto;
        cursor: pointer;
        color: helpers.$light;

        &:hover { border-color: helpers.$gold; }
        &:focus-visible {
          outline: 2px solid helpers.$gold;
          outline-offset: 2px;
        }
      }

      @media (max-width: 640px) {
        flex-direction: column;
        padding: 0.75rem 1rem;
      }
    }

    @media print {
      #cookie-banner { display: none !important; }
    }

    @media (prefers-reduced-motion: reduce) {
      #cookie-banner { transition: none; }
    }
    ```
  - [ ] **Verified at drafting time** against `assets/scss/vars/_colors.scss` (forwarded by `_helpers.scss`): `$dark`, `$light`, `$gold`, `$gold-light`, `$gold-dark` exist. The token `$text` does NOT exist (the project uses `$light` for text on dark surfaces — see existing pattern in `assets/scss/elements/engagement.scss` and `assets/scss/elements/article-info.scss`). The SCSS baseline above already uses the correct `helpers.$light`. Re-verify at implementation time only if `_colors.scss` has changed since draft.
  - [ ] Wire into `assets/scss/main.scss` by adding `@use "elements/cookie-banner";` to the Elements block. Current block runs lines 37–50; append at end (after `@use "elements/webmentions";` on line 50) or alphabetically — order within `@use` block does not affect compilation. Re-verify line numbers at implementation time.
  - [ ] Verify SCSS compiles: `hugo --quiet --environment production --minify` exits 0; `public/style.<hash>.css` contains `#cookie-banner`.

- [ ] **Manual QA across browsers and contexts** (AC: 1, 2, 5, 6, 7, 8) [Source: ACs above]
  - [ ] **First-visit show:** Open the home page in an incognito/private window. Banner slides up from bottom within 300ms of pageload. Content matches AC #3 baseline (Umami mention, cookieless emphasis, link to Datenschutz).
  - [ ] **Dismiss + same-session check:** Click the close button. Banner slides down + disappears. Reload the same tab. Banner does NOT reappear. Open a different article in the same tab. Banner still does NOT reappear.
  - [ ] **New-session check:** Close the tab/window completely (or open a fresh incognito window). Visit the home page. Banner reappears (sessionStorage cleared with the session).
  - [ ] **Keyboard dismissal:** Reload incognito. Press Tab until the close button is focused (focus ring visible — AC #6 `:focus-visible` style). Press Enter. Banner dismisses. Reload. Press Escape — banner dismisses immediately.
  - [ ] **Screen-reader announcement:** Test with NVDA (Windows) or VoiceOver (macOS). On pageload, the SR should announce the title + body text once (via `aria-live="polite"` + `role="dialog"`). The close button should be reachable via Tab and announced as "Hinweis schließen, button".
  - [ ] **Reduced-motion check:** In Windows Settings → Accessibility → Visual effects, toggle "Animation effects" off (or in browser DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`). Reload. Banner appears without slide animation (just a hard show).
  - [ ] **Noindex page check (AC #7):** Visit `/pages/datenschutz/` in a fresh incognito window. Banner does NOT appear. Inspect page source — no `<div id="cookie-banner">` element rendered.
  - [ ] **Print preview (AC #7):** On the home page, browser → File → Print Preview (or `Ctrl+P`). Banner does NOT appear in the print rendering.
  - [ ] **Mobile responsive (AC #5):** Resize the viewport to 375px wide (iPhone SE). Banner stacks vertically (text on top, close button below or in a corner), padding reduced, full width.
  - [ ] **No-JS fallback:** Disable JavaScript in browser. Reload home page. Banner is rendered with `hidden` attribute → not visible. **Acceptable degraded state:** no-JS visitors don't see the privacy notice. Document this in completion notes; if later deemed unacceptable, a future story can render the banner visible-by-default and have JS hide it on dismiss (inverted logic) — but this story scopes to the JS-on case per the epics AC.

- [ ] **Build regression check** (AC: 8) [Source: AC #8 baseline]
  - [ ] Run `hugo --quiet --environment production --minify` before applying any changes. Save `public/index.html`, `public/articles/<sample>/index.html`, `public/pages/datenschutz/index.html`, `public/pages/impressum/index.html` to a temp folder.
  - [ ] Apply all this story's edits; rebuild.
  - [ ] Diff each saved file against its rebuilt counterpart:
    - Home + articles: only the new `<div id="cookie-banner" …>` block at end-of-body and the bundle.js / style.css fingerprint hash should differ.
    - Pages with `robotsdisallow: true` (datenschutz, impressum): no `cookie-banner` element should appear; only the bundle.js / style.css hashes change (because the bundle bytes changed, even though *this* page doesn't render the banner — the bundle is shared).
  - [ ] Confirm sitemap and RSS feed are unchanged (`diff public/sitemap.xml.before public/sitemap.xml` → empty; same for any RSS feeds under `public/`).
  - [ ] Document the diff outcome in completion notes (line counts changed, file paths affected).

- [ ] **Documentation updates** (AC: all)
  - [ ] In completion notes, record:
    - The PR/commit hash adding the partial + JS + SCSS.
    - Whether the legacy commented-out jQuery banner code was deleted or kept as historical reference.
    - The head.html TODO-comment resolution (deleted vs replaced — Option A or B from Tasks above).
    - Any SCSS variable adjustments required (the suggested template uses `helpers.$gold`, `$gold-light`, `$dark`, `$text` — list the actual variables used).
    - Any browser-specific SR announcement quirks observed.
    - Confirmation that `/pages/datenschutz/` resolves and is the link target used.
    - Build regression diff outcome (file paths affected, hash deltas).
    - Manual QA outcomes per browser tested (Chrome, Firefox, Safari if accessible).
  - [ ] Close GitHub Issue [#94 Cookie-Banner UI](https://github.com/AngelCrawford/blog/issues/94) when story is `done`. The issue is direct (no umbrella) per epics.md line 44.
  - [ ] If `docs/0-discovery/feature-gap-blog-old.md` is updated by another process, the "Cookie-Banner UI" gap entry (lines 26–30 of that file) can be marked closed in a follow-up todo edit — out of scope for this story.

## Dev Notes

### Architectural Context

Story 2.7 is a **small, self-contained UI addition** in Epic 2 — one new partial (`cookie-banner.html`), one new SCSS module (`elements/cookie-banner.scss`), and one new vanilla-JS IIFE appended to the existing `assets/js/gdpr.js`. No new dependencies, no new GitHub Secrets, no config changes, no template changes outside `baseof.html` (single line gating the partial inclusion) and `head.html` (a TODO-comment edit). The story closes the gap documented in `feature-gap-blog-old.md` lines 26–30 ("Banner-Partial fehlt" — gdpr.js was migrated, the partial was not).

**This is the FIRST runtime UI element this site shows that is not page-content** (the back-to-top button is content-adjacent, navigation/header/footer are chrome). The cookie banner is a **transient overlay** with its own session-state. Treat the design choices (sessionStorage flag, role="dialog" with aria-modal=false, slide-up animation) as setting a precedent for future overlays (e.g., Story 9.3's no-JS fallback banner, any future cookie-consent flow if the site ever introduces a service that requires consent).

The banner sits at `z-index: 100` to remain below the back-to-top button (`z-index: 999999`, see `assets/scss/main.scss` line 205). Site-wide z-index conventions are loose — there is no `_z-index.scss` stack documentation; this story's choice of `100` for "above content, below page-chrome" sets a reusable precedent.

[Source: docs/2-solutioning/architecture.md (lines 210–229) — JS module pattern showing gdpr.js exists]
[Source: docs/2-solutioning/architecture.md (lines 233–241) — SCSS ITCSS-inspired structure: elements/ is the home for component styles]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 50–80) — Project structure showing `_base/` partials and `gdpr.js` location]
[Source: docs/0-discovery/feature-gap-blog-old.md (lines 24–30) — gap this story closes]

### Privacy Posture (User-Facing Copy)

The banner is a **notice, not a consent gate**. Because the site uses Umami in cookieless mode (Story 2.1) and sets no tracking cookies (FR-047), there is **no consent to collect** under DSGVO Art. 6 lit. f (legitimate-interest basis already covers the anonymous analytics — see Story 2.5 AC #2 Umami section). The banner serves transparency, not legal compliance. Two consequences:

1. **No "Accept" / "Reject" buttons.** Only a "dismiss" close button. Adding accept/reject would create a fake choice (there's nothing functional to accept or reject — Umami runs regardless because it doesn't drop cookies; the user's only meaningful opt-out is `Do Not Track` or browser-level script blocking, both noted in `datenschutz.md`).
2. **Banner content is informational.** It points readers to the Datenschutzerklärung where they find the actual data-flow descriptions. The banner's job is "you are seen and we are honest about it" — a 1-paragraph trust signal — not a legal disclosure.

This privacy-posture framing is what justifies the simplification from `blog-old`'s 3-button consent flow (which was itself probably over-engineered for a cookieless analytics setup; the legacy site at the time used Google Analytics + Disqus comments + Spotify embeds, all of which DID drop cookies and DID require consent — those services are removed in the new site).

[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md (AC #4) — Umami cookieless mode]
[Source: docs/sprint-artifacts/epic-2/2-5-privacy-policy-page.md (AC #2 Umami section) — DSGVO Art. 6 lit. f legal basis already documented in privacy policy]
[Source: docs/1-planning/prd/03a-functional-requirements.md (lines 330–335) — FR-047 Zero Tracking Cookies — informs "this banner is not a consent flow" framing]

### Project Structure Notes

- **New files:** `layouts/_partials/_base/cookie-banner.html`, `assets/scss/elements/cookie-banner.scss` (two files, both in well-established convention paths).
- **Modified files:** `layouts/baseof.html` (+3 lines for partial inclusion gate), `layouts/_partials/_base/head.html` (-1 line: TODO comment removed/replaced), `assets/js/gdpr.js` (+~30 lines: new IIFE at top), `assets/scss/main.scss` (+1 line: `@use "elements/cookie-banner";`).
- **No changes to:** `config/`, `content/`, any other `layouts/` file, any `data/` file, GitHub Actions workflows, package.json, npm dependencies, or GitHub Secrets.
- **No new fonts, no new icon glyphs** — `close-line` from `remixicon` is already loaded site-wide via `fonts/remixicon/remixicon.symbol.svg` (existing pattern in footer/navigation).
- **Bundle impact:** `js/bundle.js` grows by ~30 lines minified (~700 bytes); `style.css` grows by ~50 lines minified (~1.2 KB). Both negligible for the page-weight budget.
- **CSP impact: none.** The new JS lives in `assets/js/gdpr.js` which is concatenated into `js/bundle.js` and served from `'self'` — already allowed by `params.yaml` line 40 `scriptsrc: ["'self'", "https://cloud.umami.is"]`. No inline scripts, no inline event handlers, no new external hosts.
- **Test infrastructure status:** Story 1.1 is `done`; `tests/build/build-smoke.test.mjs` (~1900 lines) and `tests/e2e/*.spec.ts` are the established suites. This story DOES add automated tests per AC #9 (4 build-smoke assertions + optional Playwright spec).
- **Maintenance-mode interaction:** `--environment maintenance` renders `_base/maintenance.html` via the `maintenance_mode` branch at lines 1–2 of `baseof.html`, which short-circuits the entire normal `<body>` render. The cookie-banner partial is **auto-excluded** in maintenance mode without any extra gate. Verify post-deploy: `hugo --environment maintenance --destination public-maintenance` → grep `cookie-banner` → zero hits.
- **Diff-friendliness:** the change is small enough for a single PR/commit. ~80 lines added, ~2 lines removed.

[Source: layouts/baseof.html — modification site for partial gating]
[Source: layouts/_partials/_base/head.html — modification site for TODO comment]
[Source: assets/js/gdpr.js — modification site for vanilla-JS IIFE]
[Source: assets/scss/main.scss — modification site for SCSS @use]
[Source: config/_default/params.yaml (CSP block at lines 32–44) — CSP allowlist (no changes needed)]
[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md — test infrastructure layout (not landed yet)]

### Test Strategy

Aligned with the 0.5-day epics estimate (epics.md line 417). Scope is one new partial + small JS + small SCSS + verification work:

- **Local Hugo build (primary):** `hugo --quiet --environment production --minify` should exit 0; `public/index.html` should contain `<div id="cookie-banner" hidden …>` (because home has `robotsdisallow: false`); `public/pages/datenschutz/index.html` should NOT.
- **Manual QA matrix (primary):** see Tasks section "Manual QA across browsers and contexts" — 9 distinct test scenarios covering AC #1 (render), AC #2 (session flow), AC #5 (responsive), AC #6 (a11y), AC #7 (suppression), AC #8 (no regression).
- **Browser coverage:** Chrome (primary), Firefox (secondary), Safari if available (sessionStorage and `prefers-reduced-motion` are well-supported across all modern browsers — no special concerns).
- **Screen reader spot-check (AC #6):** NVDA on Windows or VoiceOver on macOS — confirm the banner is announced once on first paint and the close button is reachable + labeled.
- **No automated tests added** — test infrastructure not yet landed; revisit after Story 1.1 + relevant Playwright scaffolding ships.
- **External-effect verification:** none — this story doesn't touch GitHub Actions, GitHub Issues, external APIs, or email.

### Learnings from Previous Stories

**Status update at 2026-05-10 spec refresh:** Stories 2.1, 2.2, 2.3, 2.4, 2.5, **and 2.6 are all `done`** (per `sprint-status.yaml`). Test infrastructure (Story 1.1) is also `done`. Implementation learnings from those reviews are load-bearing for this story — they reshape AC #9 (tests are now expected, not skipped) and inform the patterns below.

**From Story 2.6 (Daily Rebuild GitHub Actions Workflow) — Status: done.**

- **Maintenance-mode awareness:** Story 2.6 introduced `--environment maintenance` which renders a self-contained `_base/maintenance.html` body (Umami, SEO, all `<body>`-level partials including the cookie banner are bypassed). **No special gate needed in `baseof.html` for maintenance mode** — the maintenance partial branch (line 1–2 of current `baseof.html`) short-circuits the entire normal render path. Verify post-implementation: `hugo server --environment maintenance` → confirm the cookie-banner block does NOT appear in rendered HTML.
- **Force-test-inject placement (`feedback_force_test_inject_position.md` memory):** Inject force-test fixtures at pipeline START, not mid-pipeline. Not directly applicable to this story (no data-fixture injection), but a guardrail to remember if any banner-related test fixture is added later.
- **Hugo-comment whitespace trim (from 2.3 review, repeated in 2.6):** when adding inline Hugo comments to templates, use `{{- /* … */ -}}` (trim-both) consistently. A stray `*/}}` (no right-trim) can render as a literal `>` in HTML. Applies if any inline comments are added inside `cookie-banner.html` partial.

**Sibling-implementation patterns from Stories 2.1–2.6 (all done) — directly load-bearing:**

- **Verbatim-from-epics + testability-guards pattern (Stories 2.1–2.6, all done):** ACs 1–7 are sourced verbatim from epics.md; ACs 8–9 are workflow-added regression/scope-limit guards labelled at the top of the AC Source & Reconciliation block. Same convention applied here.
- **Architecture-vs-implementation reconciliation pattern (Stories 2.1–2.6 reviews):** when an AC's wording disagrees with the project state or with a Critical Agent Rule, document the divergence in a "Convention reconciliation" sub-block, follow the rule/state, and note any architecture-doc cleanup as a separate todo. Applied here for: (a) AC #3 privacy URL (`/pages/privacy/` epics text vs `/pages/datenschutz/` actual deployed slug — same reconciliation Story 2.5 made); (b) AC #4 "existing gdpr.js" (jQuery legacy vs Critical Agent Rule #5 vanilla-JS mandate); (c) AC #6 `role="dialog"` (literal AC vs ARIA-precise alternatives — followed AC verbatim with `aria-modal="false"` to satisfy both).
- **Build-smoke regression test pattern (Stories 2.1, 2.2, 2.3, 2.4, 2.5):** every Epic-2 done-story adds a dedicated test block to `tests/build/build-smoke.test.mjs` with assertions tied to specific AC numbers (e.g. `test("Story 2.3 AC #1+#7: production homepage emits <link rel=\"webmention\"> …")`). This story's AC #9 follows that pattern verbatim — see updated AC #9 above for the four planned tests.
- **XSS auto-escape regression guard (Story 2.4 review):** banner template must NOT use `safeHTML` on any input. Banner copy is hardcoded German strings — no user input — so the concern is dormant, but worth memorialising: if a future iteration adds a Hugo-template-rendered banner-copy block, do not wrap it in `safeHTML`.
- **Privacy-policy contradiction-prevention (Story 2.5 review patch):** the banner copy says "keine Tracking-Cookies gesetzt" and "keine personenbezogenen Daten erhoben". The privacy policy says the same. **Keep both copies in sync** — Story 2.5's review patched a contradiction between datenschutz.md sections; the banner adds a third surface where the no-cookies claim is repeated. If a future change ever loosens the "no cookies" stance (unlikely), update both banner and policy in one PR.
- **No-jQuery for new code (Critical Agent Rule #5; surfaced by sibling reviews):** the legacy `gdpr.js` mixes vanilla and jQuery. New code in this file MUST be vanilla. The legacy jQuery visited-articles handler is grandfathered out of scope.
- **German-language UI string convention (Stories 2.2 / 2.4 / 2.5 drafts):** banner copy uses informal `Du`-form, German vocabulary, and matches the privacy-policy page's voice. Same convention applied to the close-button `aria-label` ("Hinweis schließen") and banner title ("Hinweis zur Datenverarbeitung").
- **`robotsdisallow: true` page suppression pattern (Story 2.5 + this story extension):** Story 2.5 retains `robotsdisallow: true` on `datenschutz.md` to keep the privacy policy out of search indexes. This story extends the meaning of that frontmatter flag to also gate the cookie banner (don't show a privacy notice on a privacy page). Sets a precedent: `robotsdisallow: true` is a "this is a meta/transparency page, don't decorate it with site-meta UI" signal, not just an SEO flag.
- **sessionStorage vs cookies (NEW pattern, established by this story):** the banner's dismissal flag is in sessionStorage (not localStorage, not cookies) so it auto-clears on session end. This matches the AC literal "NO cookies" and is consistent with the heart-button's localStorage-flag pattern (Story 2.2 — different scope: localStorage = persistent per-device, sessionStorage = per-tab-session). Sets a precedent for any future "dismiss this notice for the session" UI.
- **Session-scope dismissal is INTENTIONAL — not a violation of "engagement-state clarity":** the user-feedback memory `engagement-state clarity` directs one-shot engagement actions (heart/like/vote) toward **permanent stay-disabled** rather than partial debounce timers. The cookie banner is NOT a one-shot engagement action — it is a recurring trust signal that should return next session (different browser/device → different person who may not yet know the privacy posture; or same person months later → a refresher is reasonable transparency). If a reviewer challenges this and asks "why not localStorage so it stays dismissed forever", point to this entry: session-scope is by design, not oversight.
- **No-fallback-required for no-JS visitors (NEW decision, established by this story):** with JS disabled, the banner stays hidden (the partial renders with `hidden` attribute; no JS to remove it). Acceptable degraded state — no-JS users miss the trust-signal UI but don't see broken content. Story 9.3 "No-JavaScript Fallback Banner" is a separate, future scope concern (different banner — that one tells no-JS users that interactive features are degraded; this banner is just a privacy notice).

**Pending review items (from previous stories):** None blocking. All Epic-2 done-stories (2.1–2.6) closed their review patches. Recurring review themes worth scanning the 2-7 PR for: (a) Hugo-comment trim style `*/ -}}` not `*/}}` (2.3 review); (b) test fixtures must not silently regress when source data is empty (2.4 review — empty `published` field check); (c) no half-baked stub copy left in production strings (2.5 review — placeholder `Stand: TT.MM.JJJJ`).

[Source: docs/sprint-artifacts/sprint-status.yaml — at 2026-05-10 spec refresh: epic-1 all stories done; epic-2 stories 2-1 through 2-6 done, 2-7 ready-for-dev, 2-8 ready-for-dev; epic-1-retrospective done; test infrastructure (Story 1.1) done]
[Source: docs/sprint-artifacts/epic-2/2-6-daily-rebuild-github-actions-workflow.md — sibling story; established multi-pattern Learnings section structure used here]
[Source: docs/sprint-artifacts/epic-2/2-5-privacy-policy-page.md — sibling story; established `/pages/datenschutz/` URL reconciliation, `robotsdisallow: true` retention]
[Source: docs/sprint-artifacts/epic-2/2-2-heart-button-component.md — sibling story; localStorage-flag pattern (per-device persistence, contrast with this story's per-session sessionStorage)]
[Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md — sibling story; Umami cookieless setup informs banner copy (AC #3)]

### References

- [Source: docs/1-planning/epics.md (lines 392–417)] — Story 2.7 ACs (seven verbatim, FR-048 extension, GitHub Issue #94, source-restoration reference, prerequisite Story 2.5)
- [Source: docs/1-planning/epics.md (lines 213–222)] — Epic 2 header (Engagement Infrastructure)
- [Source: docs/1-planning/epics.md (lines 32–48)] — GitHub Issue #94 ("Cookie-Banner UI") direct reference (no umbrella)
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 330–335)] — FR-047 (Zero Tracking Cookies) — informs banner-copy honesty (no-cookies claim)
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 336–340)] — FR-048 (Privacy Policy Publication) — this story extends FR-048's surface into the runtime UI
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 342–346)] — FR-049 (Anonymous Analytics) — informs banner-copy "Umami" mention
- [Source: docs/1-planning/prd/10-appendices.md (line 142)] — FR-048 → Epic 2 → Story 2.5 mapping (this story extends 2.5's coverage to the banner UI surface)
- [Source: docs/2-solutioning/architecture.md (lines 210–229)] — JS module pattern showing gdpr.js exists; "GDPR: localStorage persistence" baseline (sessionStorage for this story)
- [Source: docs/2-solutioning/architecture.md (lines 233–241)] — SCSS ITCSS-inspired structure (elements/ home for component styles)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 50–80)] — Project structure: `_partials/_base/` and `assets/js/gdpr.js` locations
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771)] — Critical Agent Rules (#5 no jQuery — drives AC #4 reconciliation)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 1056–1062)] — Client-Side Considerations (cookieless analytics; "No cookies for analytics" — informs banner-copy honesty)
- [Source: docs/0-discovery/feature-gap-blog-old.md (lines 24–30)] — "Cookie-Banner UI: Banner-Partial fehlt" — gap closed by this story
- [Source: blog-old/themes/article/layouts/partials/cookie-banner.html] — legacy reference (markup structure inspiration only — do NOT restore the 3-button consent flow)
- [Source: blog-old/themes/article/assets/scss/15-cookiebanner.scss] — legacy style reference (bottom-fixed, dark surface positioning idea)
- [Source: blog-old/themes/article/assets/js/gdpr.js] — legacy reference (jQuery banner logic; do NOT restore — vanilla-JS rewrite per Critical Agent Rule #5)
- [Source: layouts/baseof.html (lines 1–47)] — partial inclusion site
- [Source: layouts/_partials/_base/head.html (lines 26–30)] — gdpr.js bundle wiring; line 28 TODO comment closed by this story
- [Source: layouts/_partials/_base/footer.html (line 30)] — remixicon usage pattern (`#close-line` glyph for close button)
- [Source: assets/js/gdpr.js (current state)] — legacy commented jQuery banner block (lines 1–54); active jQuery visited-articles handler (lines 114–149); vanilla helpers (lines 58–84)
- [Source: assets/scss/main.scss (Elements block at lines 37–50)] — `@use "elements/cookie-banner";` wiring site
- [Source: assets/scss/elements/badge.scss, button.scss] — sibling SCSS module convention
- [Source: assets/scss/vars/_helpers.scss, _colors.scss] — variable tokens for theme colors (read at implementation time before authoring the cookie-banner SCSS)
- [Source: config/_default/params.yaml (CSP block at lines 32–44)] — CSP allowlist (no changes needed; bundle is `'self'`-served)
- [Source: docs/sprint-artifacts/epic-2/2-5-privacy-policy-page.md (AC #1 reconciliation)] — privacy page URL `/pages/datenschutz/` (link target for AC #3)
- [Source: docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md (AC #4)] — Umami cookieless mode (informs banner copy)
- [Source: docs/sprint-artifacts/epic-2/2-2-heart-button-component.md] — sibling story; localStorage-flag pattern (contrast with sessionStorage in this story)
- [Source: docs/sprint-artifacts/epic-2/2-6-daily-rebuild-github-actions-workflow.md] — previous story (drafted); established Learnings-section structure
- [https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/] — ARIA Authoring Practices Guide: dialog pattern (informs `role="dialog"` + `aria-modal="false"` choice for non-modal notice)
- [https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage] — sessionStorage spec (per-tab session lifecycle, AC #2 mechanism)
- [https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion] — prefers-reduced-motion media query (AC #6 reduced-motion handling)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-2/2-7-cookie-banner-ui.context.xml

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-06 | Initial draft created from `epics.md` Story 2.7 (lines 392–417, FR-048 extension, GitHub Issue #94, source-restoration of `blog-old/themes/article/layouts/partials/cookie-banner.html`), `prd/03a-functional-requirements.md` (FR-047 Zero Tracking Cookies, FR-048 Privacy Policy, FR-049 Anonymous Analytics), `prd/10-appendices.md` (FR-traceability), `architecture.md` (JS module pattern, SCSS ITCSS structure), `digital-garden-integration-architecture.md` (Critical Agent Rule #5 no-jQuery — drives AC #4 reconciliation; Client-Side Considerations cookieless analytics — informs banner copy), `feature-gap-blog-old.md` (lines 24–30 — gap this story closes), and current `layouts/baseof.html`, `layouts/_partials/_base/head.html`, `assets/js/gdpr.js`, `assets/scss/main.scss`, `config/_default/params.yaml`. Reconciled epics AC #3 ("link to Privacy Policy (Story 2.5)") with Story 2.5's URL pin (`/pages/datenschutz/` not `/pages/privacy/`) — same German-slug pattern Stories 2.2/2.4/2.5 used. Reconciled epics AC #4 ("integrates with existing gdpr.js") with Critical Agent Rule #5 (no jQuery for new features) — new banner code is vanilla JS appended to gdpr.js; legacy commented-out jQuery banner block kept as historical reference (deletion choice deferred to implementation). Reconciled AC #6 `role="dialog"` literal text with ARIA-correctness via `aria-modal="false"` (non-blocking notice) plus `aria-live="polite"` belt-and-braces for SR announcement. ACs 1–7 verbatim from epics; ACs 8–9 added as testability/regression guards (no-regression to layouts/build outputs, no-automated-tests scope-limit). Two new files (`layouts/_partials/_base/cookie-banner.html`, `assets/scss/elements/cookie-banner.scss`); four modified files (`layouts/baseof.html` partial inclusion, `layouts/_partials/_base/head.html` TODO comment removal, `assets/js/gdpr.js` vanilla-JS IIFE, `assets/scss/main.scss` @use wiring). No CSP changes (bundle is `'self'`-served). No new GitHub Secrets, npm deps, or config changes. No automated tests (test infra not yet landed — Story 1.1 status: ready-for-dev). Manual QA matrix covers 9 scenarios across browsers, sessions, keyboard/screen-reader/reduced-motion accessibility, noindex-page suppression, print suppression, mobile responsive, and no-JS degradation. Sets precedents: sessionStorage-for-session-dismissal (contrast with Story 2.2 localStorage-for-device-dismissal), `robotsdisallow: true` extended-meaning (also gates cookie banner — don't decorate transparency pages with site-meta UI), `z-index: 100` for "above content, below page-chrome" overlays (below back-to-top's `z-index: 999`). | SM (create-story workflow) |
| 2026-05-10 | **Spec refresh** to align with state of the repo and sibling done-stories. Six categories of edits: (1) AC #9 rewritten — test infrastructure (Story 1.1) is now `done` and every Epic-2 done-story has dedicated build-smoke assertions; added 4 concrete build-smoke tests + optional Playwright spec mirroring established patterns. (2) SCSS token fix — `helpers.$text` → `helpers.$light` (the project does not define `$text`; `engagement.scss` / `article-info.scss` use `$light` for text on dark surfaces; verified against `assets/scss/vars/_colors.scss`). (3) Line-number refresh — `baseof.html` 1–38 → 1–47 (footer-bundle grew to 8 JS files: `suncalc`, `main`, `search`, `firework`, `navbar`, `header`, `withered-banner`, `hearts`); `params.yaml` CSP block 17–29 → 32–44; `main.scss` Elements block 38–44 → 37–50 (new entries: `article-info`, `engagement`, `growth-badge`, `withered-banner`, `withered-notice`, `webmentions`); back-to-top z-index `999` → `999999` (line 199 → 205); footer-scripts marker now at baseof.html ~line 30. (4) Learnings section rewrite — Stories 2.1–2.6 are all `done` (not `drafted` as the original draft assumed); replaced "no implementation learnings exist" framing with concrete cross-story patterns (build-smoke regression pattern from 2.1/2.2/2.3/2.4/2.5; XSS-auto-escape guard from 2.4; privacy-policy contradiction-prevention from 2.5; maintenance-mode awareness from 2.6; Hugo-comment trim style from 2.3 + 2.6). (5) Maintenance-mode interaction — added explicit note that `--environment maintenance` bypasses `baseof.html`'s normal render via the `maintenance_mode` branch, so the cookie-banner partial is auto-excluded; no additional gate needed. (6) Engagement-state-clarity memo — recorded the rationale for session-scope dismissal (banner is a recurring trust signal, not a one-shot engagement action; the `engagement-state clarity` user-feedback memory directs one-shot actions toward permanent stay-disabled, but does NOT apply to recurring trust signals like the cookie banner). No AC semantic changes; all reconciliation decisions preserved. | SM (create-story workflow, spec-refresh pass) |
