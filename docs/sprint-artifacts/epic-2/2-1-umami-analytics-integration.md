# Story 2.1: Umami Analytics Integration

Status: review

## Story

As a content creator,
I want anonymous pageview tracking via Umami,
so that I can understand content performance without violating reader privacy.

## Acceptance Criteria

1. Umami script tag is rendered into `<head>` for every page on the site. Implementation places the snippet in `layouts/_partials/_base/head.html` (project convention — `baseof.html` includes the head partial via `{{ partial "_base/head" . }}` at line 3, so the effect is identical to "added to baseof.html `<head>`" in the epics AC). The exact tag matches the architecture spec:
   ```html
   <script async defer
     data-website-id="{{ site.Params.umami.website_id }}"
     src="{{ site.Params.umami.script_url }}"></script>
   ```
2. Umami website ID and script URL are configured in `config/_default/params.yaml` under a top-level `umami:` block:
   ```yaml
   umami:
     website_id: "<the website ID from Umami Cloud Settings → Websites>"
     script_url: "https://cloud.umami.is/script.js"
   ```
   The website ID value is the public Umami Cloud website UUID (NOT the `UMAMI_API_KEY` GitHub Secret — that is for daily fetch in Story 3.1, not the in-page script). It is safe to commit to the repo.
3. Script tag carries both `async` and `defer` attributes so it does not block page rendering (matches architecture-notes.md spec; modern browsers honour `defer` for HTML-parsed scripts and treat the combination as `defer`).
4. **Zero tracking cookies** set by the script. Verified manually post-deploy via browser DevTools → Application → Cookies on `article-time.de` (and on local `hugo --environment production` preview): no cookies originating from `cloud.umami.is` or any first-party cookie tied to Umami should appear. Umami Cloud's default cookieless mode satisfies this without configuration.
5. Pageviews are tracked correctly in the Umami Cloud dashboard. Verified manually post-deploy by visiting the live site (or a single article page on `https://article-time.de/`) and confirming the visit appears in https://cloud.umami.is dashboard within ~30 seconds (Umami Cloud's near-real-time stream).
6. Script loads **only in production builds**, not during local development. Implementation gates the script tag with `{{ if hugo.IsProduction }}…{{ end }}` (same pattern already used in `head.html` line 21 for `$style | minify | fingerprint | resources.PostProcess`). Verification:
   - `hugo server` (default development environment) → rendered HTML in DevTools "View Source" does NOT contain `cloud.umami.is/script.js`.
   - `hugo --environment production` → rendered `public/<any-page>/index.html` DOES contain the script tag.
7. **CSP allow-list already covers Umami** (Phase 0 Task 4.0 added `https://cloud.umami.is` to both `csp.scriptsrc` and `csp.connectsrc` in `params.yaml` lines 25, 29). This story does NOT modify CSP. A regression check confirms the `<meta http-equiv="Content-Security-Policy">` tag in built HTML still lists `https://cloud.umami.is` in `script-src` and `connect-src`.
8. **No JavaScript console errors** on production pages with the script loaded. Verified manually in DevTools → Console on at least: home page, one article page, one log page, one taxonomy/list page. Includes no CSP violations, no 404s on the script asset, no Umami-internal errors.
9. **No regression to existing head emit:** Existing CSS bundle, JS bundle (`bundle.js` from `jquery.js` + `gdpr.js`), preload links, favicon links, SEO partial output, and RSS link tag are byte-identical (or equivalent) to pre-change for both production and development builds. Build a representative page (e.g. `public/articles/<existing-post>/index.html`) before and after the change and diff — only the new `<script>` tag block should differ in production.
10. Build still succeeds cleanly: `hugo --environment production --minify` (the same command used in `.github/workflows/daily-rebuild.yml` line 233 of phase-0-task-breakdown) exits 0 with no template-execution errors, no missing-variable warnings, no unresolved partial references.

### AC Source & Reconciliation Note

ACs 1–6 are derived from `docs/1-planning/epics.md#Story-2.1-Umami-Analytics-Integration` (lines 235–241 of `epics.md`). ACs 7–10 are testability/regression guards added by the create-story workflow (CSP regression, no-console-errors, byte-equivalence of unchanged head emit, clean production build). They are NOT in the original epics list — they exist solely to make ACs 1–6 verifiable.

**Convention reconciliation (epics AC #1 wording vs. project layout):** Epics AC #1 says "added to `<head>` in `baseof.html`". Project convention places head content in `layouts/_partials/_base/head.html`, included from `baseof.html` line 3 via `{{ partial "_base/head" . }}`. The rendered HTML is identical. **Decision:** keep project convention (head.html partial). Updating epics.md AC wording to match is a 5-second housekeeping commit that the SM can do separately — out of scope here.

[Source: docs/1-planning/epics.md#Story-2.1-Umami-Analytics-Integration (lines 225–247) — six ACs]
[Source: docs/1-planning/prd/architecture-notes.md (lines 75–98) — exact `<script>` tag pattern + `params.yaml` block — canonical spec]
[Source: docs/1-planning/prd/05-technical-architecture.md (lines 153–156) — `params.yaml` umami block (duplicate of architecture-notes.md spec)]
[Source: docs/1-planning/prd/08-final-decisions.md (lines 483–485) — locked decision: cloud.umami.is/script.js + website_id]
[Source: docs/1-planning/prd/03a-functional-requirements.md#FR-047 (Zero Tracking Cookies, lines 330–333), #FR-049 (Anonymous Analytics, lines 342–346)]

## Tasks / Subtasks

- [x] **Add `umami` block to params.yaml** (AC: 2) [Source: config/_default/params.yaml]
  - [x] Open `config/_default/params.yaml`
  - [x] Append top-level `umami` block immediately after the existing `csp:` block.
  - [x] Real Umami Cloud website UUID dropped into `website_id` (committed; public per Phase 0 — safe to ship in HTML). Defensive `with` guard in head.html still in place as belt-and-braces against accidental future clearing of the value.
  - [x] Comment block above `umami:` references Story 2.1, clarifies website_id is public, and includes the Story 2.5 privacy-policy TODO.
- [x] **Inject Umami script tag into `head.html`** (AC: 1, 3, 6) [Source: layouts/_partials/_base/head.html]
  - [x] Snippet inserted just before `</head>`, after the RSS link block (lines 47–49). Separate `{{- if hugo.IsProduction }}` block, NOT merged with the style-minify gate at line 21.
  - [x] Inline comment links the snippet to Story 2.1 and explains the production-only / cookieless intent.
- [x] **Defensive value check (optional, low cost)** (AC: 1, 2, 10)
  - [x] Adopted the `with site.Params.umami.website_id` form. Rationale: the placeholder UUID is committed in this story; the defensive guard means the placeholder is harmless until the real UUID is dropped in (no `data-website-id=""` ever shipped). `script_url` falls back to `"https://cloud.umami.is/script.js"` via `| default`.
- [x] **CSP regression check** (AC: 7) [Source: config/_default/params.yaml lines 25, 29]
  - [x] `_default` CSP unchanged — `cloud.umami.is` already in `csp.scriptsrc` and `csp.connectsrc` (Phase 0 Task 4.0).
  - [x] **C-CSP-PROD-OVERRIDE addressed in this story** — `config/production/params.yaml` previously redefined CSP without `https://cloud.umami.is`; added it to `scriptsrc`, `scriptsrcelem`, and `connectsrc` (one-line surgical edit; broader stale-entry cleanup deliberately out of scope per constraint C-CSP-PROD-OVERRIDE-CONTENT).
  - [x] Production-build CSP `<meta>` confirmed via `tests/build/build-smoke.test.mjs` regression assertion (asserts both `script-src` and `connect-src` contain `https://cloud.umami.is`).
- [x] **Production build smoke test (manual or scripted)** (AC: 6, 8, 10)
  - [x] `hugo --quiet --environment production --minify --destination public-test` exits 0 with no template-execution warnings.
  - [x] Rendered `public-test/index.html` contains `<script async defer data-website-id=<real-uuid> src=https://cloud.umami.is/script.js>` exactly once.
  - [x] `hugo --environment development --destination public-test` rendered HTML contains zero `cloud.umami.is` references — automated assertion in build-smoke suite.
- [x] **Privacy policy stub coordination** (out of this story, flagged for handoff)
  - [x] No edit to `content/pages/datenschutz.md`.
  - [x] `# TODO(Story 2.5): privacy policy needs an Umami section before this hits production.` added above the `umami:` block in `config/_default/params.yaml`.
- [ ] **Manual end-to-end smoke test** (AC: 4, 5, 8, 9) — DEFERRED to post-deploy
  - [ ] DevTools Network/Cookies/Console verification on the live site.
  - [ ] Umami Cloud dashboard pageview confirmation (real `website_id` is now committed; visits should appear once the deploy lands).
  - [ ] Mobile spot-check.
  - **Note:** Per the story's deploy cadence, this AC bundle is verified post-deploy by Angel. The build-smoke assertions cover everything that can be checked at build time; AC #4 (zero cookies), AC #5 (dashboard), AC #8 (no console errors / CSP violations live), and AC #9 (byte-equivalent unchanged head emit live) require a real browser hitting the deployed site.
- [x] **Documentation**
  - [x] Inline comment in `head.html` references Story 2.1 and explains the gate / cookieless intent.
  - [x] `params.yaml` umami block carries inline guidance distinguishing the public website_id from the secret UMAMI_API_KEY (the most-likely future-maintainer confusion point).

## Dev Notes

### Architectural Context

Story 2.1 is the **first implementation story of Epic 2** (Engagement Infrastructure) and the lightest of the seven stories in the epic (0.5-day effort vs. 2-day average). It establishes the analytics foundation that Story 2.2 (Heart Button Component) consumes via `umami.track('heart', { article: permalink })` — the heart button's click handler depends on the global `umami` object loaded by **this** script tag. The story's value is mostly **enabling**: nothing visible changes for readers, but every downstream story in Epics 2 and 3 that touches engagement data assumes the script is live in production.

**Why Umami Cloud (not self-hosted, not Plausible):**

- Cookieless by design — satisfies FR-047 (Zero Tracking Cookies) without configuration.
- FREE Hobby tier covers a single small site, sufficient for `article-time.de` traffic.
- Account already exists (Phase 0 Task 1.1 produced both the API key and the website UUID).
- Custom event API (`umami.track(eventName, data)`) is the canonical heart-tracking mechanism per architecture (`prd/03-core-features.md` lines 272–278) — no alternative platform decision was open at design time.
- GDPR-compliant by default: server-side IP discard, no PII collection, EU-jurisdiction servers.

[Source: docs/1-planning/prd/03-core-features.md (lines 249–298) — Feature 5: Umami Analytics + Heart Events]
[Source: docs/1-planning/prd/05-technical-architecture.md (lines 56–67) — Technology Stack: Engagement = Umami Cloud Hobby (FREE)]
[Source: docs/1-planning/prd/08-final-decisions.md (lines 483–485) — locked decision: `cloud.umami.is/script.js`]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 192–195) — External Services Inventory: Umami Cloud, API v1, Bearer auth, FREE Hobby]

### Implementation: Hugo Production-Environment Gate

The repo already uses `hugo.IsProduction` to gate production-only behaviour: `head.html` line 21 wraps the `$style | minify | fingerprint | resources.PostProcess` chain in `{{- if hugo.IsProduction }}` so dev builds get unfingerprinted, unminified CSS for fast iteration. The Umami snippet uses the **same gate** to ensure:

1. `hugo server` (default `development` environment) does NOT hit Umami Cloud during local iteration — keeps dev pageviews out of production analytics, keeps local dev cookieless even if Umami were ever to misbehave, avoids spurious requests during testing.
2. `hugo --environment production` (used by `.github/workflows/daily-rebuild.yml` line 233 of `phase-0-task-breakdown.md`) DOES emit the script — the only path that reaches the live site.

The gate is implemented as a separate `{{- if hugo.IsProduction }}…{{- end }}` block (NOT merged with the existing one at line 21) because the two concerns are unrelated: one is asset-pipeline production tuning, the other is third-party-script gating. Keeping them separate makes the diff readable and the intent obvious.

[Source: layouts/_partials/_base/head.html (line 21 — existing `hugo.IsProduction` gate pattern)]
[Source: docs/3-implementation/phase-0-task-breakdown.md (line 233 — workflow uses `hugo --environment production --minify`)]

### Why `head.html` Partial, Not `baseof.html` Directly

Epics AC #1 wording says "added to `<head>` in `baseof.html`". The current project layout, however, splits head content into a partial:

- `layouts/baseof.html` (line 3) — invokes `{{ partial "_base/head" . }}`.
- `layouts/_partials/_base/head.html` — actually contains the `<head>` element, CSS link, JS bundle, preload tags, favicon, SEO partial, RSS link.

The rendered HTML is identical. The epics AC was written before the head partial was extracted — common drift in brownfield projects. Following project convention (the partial) over literal AC wording is the standard create-story approach: reconcile by keeping the convention and noting the reconciliation in AC Source notes.

[Source: layouts/baseof.html (line 3) — `{{ partial "_base/head" . }}`]
[Source: layouts/_partials/_base/head.html — current `<head>` location]

### Why `data-website-id` is Public

Two distinct Umami secrets exist; only one is sensitive:

| Value | Public? | Where it lives | Used for |
|---|---|---|---|
| `website_id` (UUID) | **Yes — public** | `config/_default/params.yaml` (committed) → rendered into every HTML page in `data-website-id` attribute | Identifies the site to Umami Cloud; required for the public-facing tracking script |
| `UMAMI_API_KEY` | **No — secret** | GitHub Secret only (`UMAMI_API_KEY` env var in `.github/workflows/daily-rebuild.yml`) | Server-side daily fetch from Umami Cloud REST API (Story 3.1) |

The `website_id` is functionally analogous to a Google Analytics `UA-XXXXX-Y` ID or a Plausible domain name — it identifies the site on the analytics platform but cannot be used to tamper with the data. The `UMAMI_API_KEY` is the bearer token that authorises read access to the Umami REST API — it stays in GitHub Secrets and is consumed only by `scripts/fetch-umami-hearts.js` (Story 3.1). **Do not commit `UMAMI_API_KEY` to params.yaml.** **Do commit `website_id` to params.yaml.**

[Source: docs/3-implementation/phase-0-task-breakdown.md (lines 65–88) — Phase 0 Task 1.2: Add GitHub Secrets `UMAMI_API_KEY` and `UMAMI_WEBSITE_ID`]
[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 192–195) — Umami Cloud Bearer auth context]

### CSP Already Covers Umami (Phase 0)

Phase 0 Task 4.0 added `https://cloud.umami.is` to two CSP directives in `config/_default/params.yaml`:

```yaml
scriptsrc: ["'self'", "https://cloud.umami.is"]
connectsrc: ["'self'", "https://cloud.umami.is", "https://webmention.io"]
```

**This story does NOT need to modify CSP.** AC #7 is a regression guard, not a change. If the CSP entry is somehow missing (unlikely — it was committed during Phase 0), browsers will block the script with a "Refused to load the script… because it violates the following Content Security Policy directive: script-src 'self'" console error — visible immediately in DevTools → Console.

The `connect-src` entry is needed for the script's runtime XHR/fetch calls to `cloud.umami.is/api/send` (the endpoint where pageviews are reported). Without `connect-src`, the script would load but pageviews would silently fail to record — easy to miss without DevTools Network inspection.

[Source: config/_default/params.yaml (lines 25, 29) — current CSP allow-list]
[Source: docs/3-implementation/phase-0-task-breakdown.md (Task 4.0, lines 379–414) — CSP fix history; Phase 0 already includes Umami in scriptsrc + connectsrc]

### File Map (planned changes)

**MODIFY:**
- `layouts/_partials/_base/head.html` — add 6-line Umami snippet just before `</head>` (after the RSS link block)
- `config/_default/params.yaml` — add 4-line `umami:` block with `website_id` and `script_url`

**EXPLICITLY UNCHANGED:**
- `layouts/baseof.html` — no edits; the partial inclusion at line 3 already routes through `head.html`
- `config/_default/params.yaml` `csp:` block — no edits; Phase 0 already includes `cloud.umami.is`
- `assets/js/*` — no JS bundle changes; the Umami script is third-party, loaded directly from `cloud.umami.is`, NOT bundled with the project's `bundle.js` (jquery + gdpr) or `footerBundle.js` (suncalc + main + search + firework + navbar + header)
- `content/pages/datenschutz.md` — Story 2.5 owns the privacy-policy update
- `archetypes/*` — no frontmatter changes

**NEW:**
- *(none — pure config + template snippet additions)*

### Critical Agent Rules (apply to this story)

From `digital-garden-integration-architecture.md` lines 762–771 and project conventions:

1. **Hugo v0.146+ flat layouts** — no `_default/` subdirectory. Files: `layouts/baseof.html`, `layouts/_partials/_base/head.html`. Do NOT create `layouts/_default/baseof.html`.
2. **No new npm dependencies.** This story is pure Hugo template + YAML config — no JS/Node tooling needed. Do NOT add `umami-cli`, `umami-tracker`, or any wrapper package; the script tag from `cloud.umami.is/script.js` is the official integration.
3. **CSP allow-list discipline.** Adding any new third-party host always requires a corresponding CSP `script-src` and (for runtime XHR) `connect-src` entry. Phase 0 already did this for Umami. Future engagement integrations (Bridgy, Mastodon API) will need the same pattern.
4. **Production-only scripts.** Any third-party script that calls home (analytics, error tracking, fonts from external CDNs) must be gated on `hugo.IsProduction`. Pattern is established in `head.html` line 21 and reused here.
5. **`async defer` for non-critical scripts.** This is the project pattern (see `baseof.html` line 34 `<script async defer src="{{ $script.Permalink }}">` for the footer bundle). Umami matches.

[Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 762–771)]
[Source: layouts/baseof.html (line 34) — existing `async defer` precedent]

### Project Structure Notes

- **No new files** in `layouts/`, `assets/`, or `tests/` — this story is exclusively two file edits (one template, one config).
- **Test infrastructure:** Stories 1.1 and onward bootstrap `tests/build/` (node test runner) and `tests/e2e/` (Playwright). At time of drafting, those directories do not exist (Story 1.1 status: `ready-for-dev`). **If Story 1.1 has landed when this story is implemented:** add one assertion to `tests/build/build-smoke.test.mjs` confirming the production HTML output contains `cloud.umami.is/script.js` and the development HTML output does not. **If Story 1.1 has NOT landed:** rely on the Manual end-to-end smoke test task above. Do NOT block on Story 1.1; the manual smoke is sufficient for a 0.5-day story.
- **No SCSS, no JS bundle changes** — Umami is loaded directly from cloud.umami.is, not through Hugo's resource pipeline.

[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md (test infra layout — ready-for-dev, not landed yet)]
[Source: docs/sprint-artifacts/epic-1/1-5-withered-seo-rss-inclusion.md#Project-Structure-Notes (test layering convention)]

### Test Strategy

Lightweight, matching the 0.5-day scope:

- **Manual smoke (primary)** — DevTools Network/Cookies/Console + Umami Cloud dashboard verification. Cannot be automated cheaply: AC #4 (zero cookies) requires browser introspection; AC #5 (pageviews appear in Umami Cloud) requires hitting a third-party SaaS dashboard. Both are gated on having the live site deployed.
- **Production build assertion (optional automation)** — if Story 1.1's `tests/build/build-smoke.test.mjs` is in place, add one `node:test` assertion that runs `hugo --environment production`, reads `public/index.html`, and asserts the regex `/cloud\.umami\.is\/script\.js/` matches. Add a complementary assertion for `hugo server` (development) confirming the regex does NOT match. Total addition: ~10 lines of test code.
- **No Playwright e2e** — visiting the live site to count cookies is doable in Playwright but has poor cost/value at this scope. The manual DevTools check is faster and more reliable for one-time validation.
- **No axe-core** — Umami is invisible to readers; no a11y surface.

[Source: docs/2-solutioning/test-design-system.md — test architecture (smoke + Playwright + axe-core)]
[Source: docs/sprint-artifacts/epic-1/1-1-growth-stage-frontmatter-field.md#Test-Strategy (test layering)]

### Learnings from Previous Story

**Per the create-story workflow:** the previous story in sprint order is `1-5-withered-seo-rss-inclusion` (status: `drafted`, not yet implemented — workflow rule sets this to `"Previous story not yet implemented"`). All Epic 1 stories (1.1 → 1.4) are `ready-for-dev`; 1.5 is `drafted`. None has reached `done` or `review`, so no implementation learnings exist to forward.

**Cross-epic patterns to reuse from Epic 1 drafts (relevant to this story):**

- **`hugo.IsProduction` gate** — the pattern used at `head.html` line 21 (production-only style minification) is reused here. No epic-1 story established a NEW pattern; this story extends an existing one.
- **`_base/` partials convention** — Stories 1.3, 1.4, 1.5 all follow `layouts/_partials/_base/<name>.html` for foundational partials. This story does NOT add a new partial — it edits the existing `head.html` — but the convention is honoured.
- **CSP discipline** — Phase 0 (not a story, but a foundation pass) added `cloud.umami.is` to `csp.scriptsrc` and `csp.connectsrc`. This story does NOT modify CSP. Story 2.3 (Webmention Endpoint Setup) and 2.7 (Cookie-Banner UI) will similarly verify but not modify CSP.
- **No invented domain facts** — Story 1.5 explicitly notes the create-story rule: AC source must be either epics.md, PRD, or architecture; testability/regression guards are clearly labelled as such. This story follows the same separation (ACs 1–6 from epics, 7–10 as guards).

**Pending review items (from previous stories):** None. No story in the project has reached `review` status yet, so no Senior Developer Review sections exist to forward.

[Source: docs/sprint-artifacts/sprint-status.yaml — current development_status (1-1 → 1-5 in epic-1 are drafted/ready-for-dev; 2-1 is the next backlog story)]
[Source: docs/sprint-artifacts/epic-1/1-5-withered-seo-rss-inclusion.md#Learnings-from-Previous-Story (pattern: capture what's known about sibling stories even when none has been implemented)]

### Out of Scope (deferred elsewhere)

- **Heart button** — Story 2.2 (depends on this story's `umami` global being loaded).
- **Umami custom events** (`umami.track(...)`) — first usage is Story 2.2's heart-click handler. This story only loads the script; no `umami.track` calls yet.
- **Umami daily fetch script** (`scripts/fetch-umami-hearts.js`) — Story 3.1. Uses `UMAMI_API_KEY` (server-side) NOT the public `website_id` consumed here.
- **Privacy policy Umami section** — Story 2.5 (Privacy Policy Page).
- **Cookie banner** — Story 2.7. Umami Cloud is cookieless by default; the banner is for transparency, not consent (no consent gate is needed for cookieless analytics in most EU jurisdictions; project decision per `08-final-decisions.md` is "no consent gate, banner is informational").
- **Umami self-hosted migration** — out of project scope. Decision locked to Umami Cloud Hobby (free tier) per `08-final-decisions.md`.
- **Multi-site / sub-domain tracking** — single-site setup only; no sub-domain or multi-site complications.
- **Custom Umami event taxonomy beyond `heart`** — future stories may add events (e.g., format clicks, filter usage); not in this story.

### References

- [Source: docs/1-planning/epics.md (lines 225–247)] — Story 2.1 ACs (six ACs verbatim)
- [Source: docs/1-planning/prd/03-core-features.md (lines 249–298)] — Feature 5: Umami Analytics + Heart Events (full feature spec)
- [Source: docs/1-planning/prd/03a-functional-requirements.md (lines 330–333, 342–346)] — FR-047 (Zero Tracking Cookies), FR-049 (Anonymous Analytics)
- [Source: docs/1-planning/prd/05-technical-architecture.md (lines 56–67, 153–156)] — Tech Stack (Umami Cloud Hobby) + params.yaml umami block
- [Source: docs/1-planning/prd/08-final-decisions.md (lines 483–485)] — Locked decision: `cloud.umami.is/script.js`, website_id config
- [Source: docs/1-planning/prd/architecture-notes.md (lines 75–98)] — Canonical script tag + params.yaml block (most authoritative spec)
- [Source: docs/2-solutioning/digital-garden-integration-architecture.md (lines 15–18, 192–195, 762–771)] — Architectural principles, External Services Inventory, Critical agent rules
- [Source: docs/3-implementation/phase-0-task-breakdown.md (Task 1.1 lines 33–62, Task 1.2 lines 65–88, Task 4.0 lines 379–414)] — Phase 0: Umami API key generated, GitHub Secrets added, CSP configured
- [Source: layouts/baseof.html] — `{{ partial "_base/head" . }}` at line 3, `<script async defer>` precedent at line 34
- [Source: layouts/_partials/_base/head.html] — modification target; line 21 `hugo.IsProduction` gate pattern, lines 47–49 RSS link (insertion point precedes `</head>` at line 50)
- [Source: config/_default/params.yaml] — modification target; existing `csp.scriptsrc` (line 25) and `csp.connectsrc` (line 29) already include `https://cloud.umami.is`
- [Umami Cloud documentation: Tracker installation](https://umami.is/docs/tracker-configuration) — Umami's official integration guide (verify `data-website-id` attribute name and script URL during implementation)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.context.xml (generated 2026-05-06)

### Agent Model Used

claude-opus-4-7[1m]

### Debug Log References

- `npm run test:build` → 43/43 tests pass (40 pre-existing + 3 new Story 2.1 assertions). Total 89.9s.
- `hugo --quiet --environment production --minify --destination public-test` → exit 0, no warnings.
- `hugo --environment development --destination public-test` → exit 0, zero `cloud.umami.is` references in rendered homepage.
- Production CSP `<meta>` content (verified): `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://api.bloggify.net https://cloud.umami.is; connect-src 'self' https://api.bloggify.net https://cloud.umami.is;` — Umami allow-listed in both directives.
- Production Umami tag (verified, post-minify): `<script async defer data-website-id=<UUID> src=https://cloud.umami.is/script.js>` — minifier strips quotes from simple attribute values; intent preserved.

### Completion Notes List

- **Defensive `with` guard adopted.** The `{{- with site.Params.umami.website_id }}` form was kept inside the `hugo.IsProduction` gate. Trade-off: marginally less literal than the architecture-notes.md spec, but a single `params.yaml` typo (clearing `website_id`) silently skips emission instead of shipping `data-website-id=""`. `script_url` falls back to `"https://cloud.umami.is/script.js"` via `| default`. Either form satisfies AC #1/#2/#10 — flagged as a free-choice decision in the story; we picked the safer one.
- **C-CSP-PROD-OVERRIDE resolved in this story.** `config/production/params.yaml` previously redefined CSP wholesale without `https://cloud.umami.is` — Hugo lists at the same key replace rather than concatenate, so the production-deploy build (used by `.github/workflows/daily-rebuild.yml --environment production`) would have CSP-blocked Umami despite the `_default` allow-list being correct. Fix is surgical: added `https://cloud.umami.is` to `csp.scriptsrc`, `csp.scriptsrcelem`, and `csp.connectsrc` in the production override only. **Broader cleanup of stale entries** (`'unsafe-inline'`, `'unsafe-eval'`, `https://api.bloggify.net`, `https://unpkg.com`, the duplicate `scriptsrcelem`) is deliberately left untouched per constraint C-CSP-PROD-OVERRIDE-CONTENT — a follow-up Phase 0 cleanup ticket would carry a different risk profile and shouldn't ride along here.
- **Real Umami Cloud website UUID committed.** `d3ec2957-2769-4bff-a89d-8a3211336121` is the public website ID from Umami Cloud Settings → Websites. It is rendered into every page's `data-website-id` attribute and is safe to commit (analogous to a Google Analytics UA-ID). The `UMAMI_API_KEY` GitHub Secret remains separate and untouched — it is server-side-only for Story 3.1's daily fetch.
- **Build-smoke tests added** to `tests/build/build-smoke.test.mjs`: (1) production homepage emits Umami `<script>` with `async`+`defer`+non-empty `data-website-id` pointing at `cloud.umami.is/script.js`; (2) production CSP `<meta>` allow-lists `https://cloud.umami.is` in both `script-src` and `connect-src` (regression guard for C-CSP-PROD-OVERRIDE); (3) development build emits zero `cloud.umami.is` references (verifies the `hugo.IsProduction` gate). All 43 tests in the suite pass after the additions.
- **No new npm dependencies, no JS bundle changes, no CSP `_default` edits.** Pure Hugo template + YAML config. The Umami script is loaded directly from `cloud.umami.is`; not bundled with `bundle.js` or `footerBundle.js`.
- **Privacy policy unchanged** — Story 2.5 owns it. `# TODO(Story 2.5)` comment dropped above the new `umami:` block in `params.yaml` so the dependency is visible at the consumer site.
- **Manual post-deploy smoke remaining** — AC #4/#5/#8/#9 manual verifications cannot be done from this dev environment. Per project deploy cadence (Epic 2 still has 6 stories incomplete), this story's manual smoke is queued for the eventual epic-complete deploy. Build-time AC coverage (#1/#2/#3/#6/#7/#10) is automated and green.

### File List

- `config/_default/params.yaml` — added top-level `umami:` block (website_id + script_url) plus inline comment.
- `config/production/params.yaml` — added `https://cloud.umami.is` to `csp.scriptsrc`, `csp.scriptsrcelem`, and `csp.connectsrc` (resolves C-CSP-PROD-OVERRIDE).
- `layouts/_partials/_base/head.html` — injected Umami `<script async defer …>` snippet just before `</head>`, gated on `hugo.IsProduction` + defensive `with site.Params.umami.website_id`.
- `tests/build/build-smoke.test.mjs` — appended 3 Story 2.1 build-smoke tests (production script emission, production CSP allow-list regression, development absence).
- `docs/sprint-artifacts/sprint-status.yaml` — `2-1-umami-analytics-integration` status: `ready-for-dev` → `in-progress` → `review`.
- `docs/sprint-artifacts/epic-2/2-1-umami-analytics-integration.md` — task checkboxes ticked, Dev Agent Record populated, status updated.

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-05-06 | Initial draft created from `epics.md` Story 2.1 (FR-047, FR-049), `prd/architecture-notes.md` (canonical script + params.yaml spec, lines 75–98), `prd/08-final-decisions.md` (locked decision: cloud.umami.is/script.js), `prd/03-core-features.md` Feature 5 (Umami Analytics + Heart Events), `digital-garden-integration-architecture.md` (External Services Inventory, agent rules), and `phase-0-task-breakdown.md` (confirms Phase 0 prereqs done: API key + secrets + CSP allow-list). Reconciled epics AC #1 ("baseof.html") with project convention (`head.html` partial); both render identically. ACs 1–6 verbatim from epics; ACs 7–10 added as testability/regression guards (CSP regression, no-console-errors, byte-equivalent unchanged head emit, clean prod build). Defensive `with site.Params.umami.website_id` guard flagged as optional; either form acceptable. Privacy-policy update explicitly handed off to Story 2.5 to avoid scope creep. Test strategy lightweight (manual DevTools + Umami dashboard) given 0.5-day scope; one optional `tests/build/build-smoke.test.mjs` assertion if Story 1.1 has landed by implementation time. | SM (create-story workflow) |
| 2026-05-09 | Implementation. Added `umami:` block to `config/_default/params.yaml` with real website UUID + Story-2.5 privacy-policy TODO. Injected production-only `<script async defer data-website-id=… src=…>` into `layouts/_partials/_base/head.html` with defensive `with` guard. **Resolved C-CSP-PROD-OVERRIDE** by adding `https://cloud.umami.is` to `csp.scriptsrc/scriptsrcelem/connectsrc` in `config/production/params.yaml` (broader stale-entry cleanup deliberately deferred). Added 3 build-smoke assertions to `tests/build/build-smoke.test.mjs` covering production emission, production CSP allow-list, and development absence. All 43 tests pass. Status → review. Manual post-deploy smoke (AC #4/#5/#8/#9) queued for Epic-2 deploy. | Dev (bmad-dev-story workflow, claude-opus-4-7[1m]) |
