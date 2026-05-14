# Digital Garden Transformation - Epic & Story Breakdown

**Project:** Article Time Digital Garden
**Version:** 1.0
**Date:** 2025-11-14
**Owner:** Angel Crawford
**Product Manager:** Mary (via John)

---

## Document Purpose

This document breaks down the Digital Garden transformation into **9 epics** and **48 user stories** with detailed acceptance criteria. Each story:
- Follows user story format: "As a [role], I want [goal], so that [benefit]"
- Maps to Functional Requirements (FRs) from PRD
- Includes numbered acceptance criteria
- Specifies dependencies and effort estimates
- Represents AI-agent-sized work (2-4 hour implementation sessions)

---

## GitHub Issues Mapping

Stories mit einem `**GitHub Issue:**`-Eintrag schließen das verlinkte Issue, sobald die Story den Status `done` erreicht. Bei mehreren Stories pro Issue (z. B. #145 deckt 2.3 + 2.4) Issue erst nach der **letzten** zugehörigen Story schließen. Epic-Umbrella-Issues (z. B. #59, #147) werden nach Abschluss aller Stories im Epic geschlossen.

**Vollständige Mapping-Übersicht:**

| Issue | State | Story / Epic | Hinweis |
|---|---|---|---|
| [#49](https://github.com/AngelCrawford/blog/issues/49) Needed Sites (Privacy Policy) | OPEN | Story 2.5 | direkt |
| [#59](https://github.com/AngelCrawford/blog/issues/59) Possible Formats | OPEN | Epic 8 (umbrella) | nach allen 8.x |
| [#67](https://github.com/AngelCrawford/blog/issues/67) Merge and Deploy | OPEN | Story 2.6 | teilweise (GH Actions Setup) |
| [#70](https://github.com/AngelCrawford/blog/issues/70) Analytics | OPEN | Story 2.1 | direkt |
| [#78](https://github.com/AngelCrawford/blog/issues/78) Like Button | OPEN | Story 2.2 | direkt |
| [#95](https://github.com/AngelCrawford/blog/issues/95) If no JavaScript | OPEN | Story 9.3 | direkt |
| [#116](https://github.com/AngelCrawford/blog/issues/116) Open Graph (Share Images) | OPEN | Story 9.1 | direkt |
| [#124](https://github.com/AngelCrawford/blog/issues/124) IndieWeb (umbrella) | OPEN | Epic 2 + Epic 7 | nach #145 + #147 |
| [#145](https://github.com/AngelCrawford/blog/issues/145) Webmentions & Pingbacks | OPEN | Stories 2.3 + 2.4 | erst nach beiden |
| [#147](https://github.com/AngelCrawford/blog/issues/147) IndieWeb - POSSE | OPEN | Epic 7 (umbrella) | nach allen 7.x |
| [#158](https://github.com/AngelCrawford/blog/issues/158) Format Filter | OPEN | Story 5.5 | direkt |
| [#173](https://github.com/AngelCrawford/blog/issues/173) Schema | OPEN | Story 9.2 | direkt |
| [#32](https://github.com/AngelCrawford/blog/issues/32) Link Preview for Posts | OPEN | Story 8.2 | direkt |
| [#60](https://github.com/AngelCrawford/blog/issues/60) Headline Anchors | OPEN | Story 9.9 | direkt |
| [#94](https://github.com/AngelCrawford/blog/issues/94) Cookie-Banner UI | OPEN | Story 2.7 | direkt |
| [#115](https://github.com/AngelCrawford/blog/issues/115) Most-Loved Widget | OPEN | Story 3.6 | direkt |
| [#170](https://github.com/AngelCrawford/blog/issues/170) robots.txt Layout | OPEN | Story 9.8 | gemeinsam mit #171, #172 |
| [#171](https://github.com/AngelCrawford/blog/issues/171) sitemap.xml Layout | OPEN | Story 9.8 | gemeinsam mit #170, #172 |
| [#172](https://github.com/AngelCrawford/blog/issues/172) sitemap priorities | OPEN | Story 9.8 | gemeinsam mit #170, #171 |

**Offene Issues, die NICHT von Stories abgedeckt werden** (separat zu entscheiden — eigenes Backlog oder Epic-Erweiterung):

| Issue | Thema | Empfehlung |
|---|---|---|
| [#185](https://github.com/AngelCrawford/blog/issues/185) Add Claude Code Skills | Meta-Tooling | außerhalb Digital Garden Scope |
| [#183](https://github.com/AngelCrawford/blog/issues/183) Adjust article date in URL | URL-Verhalten beim Edit | evtl. Erweiterung Epic 6 |
| [#182](https://github.com/AngelCrawford/blog/issues/182) AI translation to EN | i18n | eigenes zukünftiges Epic |
| [#176](https://github.com/AngelCrawford/blog/issues/176) Tests after deploy | CI/Smoke-Tests | evtl. zu Epic 9 ergänzen |
| [#146](https://github.com/AngelCrawford/blog/issues/146) IndieWeb - Webring | Webring | evtl. zu Epic 7 ergänzen |
| [#46](https://github.com/AngelCrawford/blog/issues/46) Error/Info Notifications | neues Format auf Homepage | überschneidet sich nicht direkt mit Stories |
| [#41](https://github.com/AngelCrawford/blog/issues/41) Contact | Kontaktseite | wie #49 — separate Page-Story möglich |
| [#38](https://github.com/AngelCrawford/blog/issues/38) Security Headers | CSP, HSTS etc. | evtl. zu Epic 9 ergänzen |
| [#31](https://github.com/AngelCrawford/blog/issues/31) Add RSS Feed | RSS-Validierung | überschneidet sich teilweise mit 1.5/9.6 |

---

## Epic Overview

| Epic | Focus | Stories | Phase | Weeks | FR Coverage |
|------|-------|---------|-------|-------|-------------|
| Epic 1 | Growth Stage System | 5 | 1A | Week 3 | FR-001 to FR-007 |
| Epic 2 | Engagement Infrastructure | 8 | 1A | Week 1-2 | FR-008 to FR-013, FR-047, FR-048, FR-049 |
| Epic 3 | Popularity Scoring Engine | 6 | 1A | Week 4-5 | FR-010, FR-013, FR-018, FR-019, FR-035 to FR-037 |
| Epic 4 | Three-Tier Sorting | 4 | 1A | Week 4-5 | FR-014 to FR-017, FR-020, FR-050, FR-051 |
| Epic 5 | Badge & Filter System | 7 | 1A | Week 6 | FR-003, FR-005, FR-024, FR-025, FR-032, FR-033 |
| Epic 6 | History Timeline | 3 | 2 | Week 10 | FR-021 to FR-023 |
| Epic 7 | POSSE & Advanced Webmentions | 5 | 3 | Week 12-13 | FR-038 to FR-041 |
| Epic 8 | Format Expansion | 8 | 1B | Week 7-9 | FR-028 to FR-033 |
| Epic 9 | Polish & Optimization | 12 | 2 | Week 10-11 | FR-006, FR-007, FR-013, FR-042 to FR-046, FR-048 |

**Total:** 58 stories across 9 epics

---

# Epic 1: Growth Stage System [Phase 1A, Week 3]

**Goal:** Visual content maturity indicators that help readers assess quality at a glance

**Value:** Transparent content quality signaling, foundation for digital garden mental model

**FR Coverage:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007

---

## Story 1.1: Growth Stage Frontmatter Field

**As a** content creator
**I want to** assign a growth stage to each article via frontmatter
**So that** I can explicitly communicate content maturity

**FR Coverage:** FR-001

**Acceptance Criteria:**
1. `growth_stage` field accepts exactly four values: `seedling`, `budding`, `evergreen`, `withered`
2. Invalid growth stage values trigger Hugo build error with clear message
3. Default value is `seedling` if field omitted
4. Archetype templates (`archetypes/articles/index.md`, `archetypes/logs/index.md`) include `growth_stage: "seedling"` by default
5. Field documented in archetype comments with all four options explained

**Prerequisites:** None (foundation story)

**Dependencies:** None

**Effort:** 1 day

---

## Story 1.2: Growth Stage Badge Component

**As a** reader
**I want to** see a visual growth stage indicator on content cards
**So that** I can assess content maturity at a glance

**FR Coverage:** FR-002

**Acceptance Criteria:**
1. Badge displays on card (top-right corner)
2. Four badge designs implemented: 🌱 (seedling), 🌿 (budding), 🌳 (evergreen), 💀 (withered)
3. Badge has color-coded background per stage (green, teal, forest, gray)
4. Tooltip shows full stage name on hover
5. Badge visible on both list view (homepage/archives) and single page view (below title)
6. Badge accessible (ARIA label, keyboard-focusable if interactive)

**Prerequisites:** Story 1.1 (frontmatter field must exist)

**Dependencies:** None

**Effort:** 2 days

---

## Story 1.3: Withered Content Default Hiding

**As a** reader
**I want** withered content hidden from homepage by default
**So that** I see current, maintained content without clutter

**FR Coverage:** FR-004

**Acceptance Criteria:**
1. Homepage content query excludes `growth_stage: "withered"` by default
2. Archive pages exclude withered by default
3. Category/tag pages exclude withered by default
4. Withered content still accessible via direct URL
5. Withered content included in search index (existing search feature)
6. Count of hidden withered items displayed (e.g., "3 withered items hidden")

**Prerequisites:** Story 1.1, Story 1.2

**Dependencies:** None

**Effort:** 1 day

---

## Story 1.4: Withered Content Warning Banner

**As a** reader
**I want** a clear warning when viewing withered content
**So that** I know the information may be outdated or deprecated

**FR Coverage:** FR-002, FR-007

**Acceptance Criteria:**
1. Warning banner displays at top of withered content single pages
2. Banner includes: deprecation date, reason (if provided), link to replacement (if provided)
3. Banner styled with alert colors (orange/yellow background)
4. Banner includes dismissible option (session storage, no cookies)
5. `withered_date` field in frontmatter populates banner date
6. `withered_reason` field (optional) populates explanation text

**Prerequisites:** Story 1.1, Story 1.3

**Dependencies:** None

**Effort:** 1 day

---

## Story 1.5: Withered SEO & RSS Inclusion

**As a** content creator
**I want** withered content indexed by search engines and RSS readers
**So that** historical content remains discoverable with deprecation context

**FR Coverage:** FR-006

**Acceptance Criteria:**
1. RSS feed includes withered items with title suffix: `[Withered Nov 2025]`
2. RSS description prepends: `⚠️ This content is deprecated as of [DATE]. Reason: [REASON]`
3. Sitemap includes withered content
4. Sitemap sets `<lastmod>` to `withered_date` for withered items
5. Sitemap sets `<priority>` to 0.3 for withered items (vs 0.8 for evergreen)
6. Schema.org markup includes deprecation metadata

**Prerequisites:** Story 1.1, Story 1.4

**Dependencies:** None

**Effort:** 2 days

---

# Epic 2: Engagement Infrastructure [Phase 1A, Week 1-2]

**Goal:** Anonymous engagement tracking (hearts + webmentions) without cookies

**Value:** Privacy-respecting engagement signals for popularity scoring

**FR Coverage:** FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-047, FR-048, FR-049

**Umbrella GitHub Issues** (close after ALL related stories done): [#124 IndieWeb](https://github.com/AngelCrawford/blog/issues/124), [#145 Webmentions & Pingbacks](https://github.com/AngelCrawford/blog/issues/145) (after Stories 2.3 + 2.4)

---

## Story 2.1: Umami Analytics Integration

**As a** content creator
**I want** anonymous pageview tracking via Umami
**So that** I can understand content performance without violating privacy

**FR Coverage:** FR-047, FR-049

**GitHub Issue:** [#70 Analytics](https://github.com/AngelCrawford/blog/issues/70)

**Acceptance Criteria:**
1. Umami script tag added to `<head>` in `baseof.html`
2. Umami website ID configured in `config/_default/params.yaml`
3. Script loads asynchronously (doesn't block page render)
4. No tracking cookies set (verified with browser dev tools)
5. Pageviews tracked correctly in Umami Cloud dashboard
6. Script loads only in production environment (not during `hugo server`)

**Prerequisites:** Phase 0 (Umami API key generated, secret added to GitHub)

**Dependencies:** None

**Effort:** 0.5 days

---

## Story 2.2: Heart Button Component

**As a** reader
**I want to** "heart" articles I find valuable with one click
**So that** I can show appreciation without creating an account

**FR Coverage:** FR-008, FR-009

**GitHub Issue:** [#78 Like Button for the articles?](https://github.com/AngelCrawford/blog/issues/78)

**Acceptance Criteria:**
1. Heart button visible on all article and log pages (below title or in sidebar)
2. Button shows current heart count (from data file)
3. Click triggers Umami custom event: `{event: "heart", article: permalink}`
4. Visual feedback on click: animation (heart pop), temporary "Hearted!" message
5. Button works without JavaScript (graceful degradation: link to share page)
6. Button accessible (keyboard navigation, screen reader label)
7. Button prevents double-clicks (debounce 1 second)

**Prerequisites:** Story 2.1

**Dependencies:** None

**Effort:** 2 days

---

## Story 2.3: Webmention Endpoint Setup

**As a** content creator
**I want** my site to receive webmentions from other blogs
**So that** I can see federated engagement and replies

**FR Coverage:** FR-011

**GitHub Issue:** [#145 IndieWeb - Webmentions & Pingbacks](https://github.com/AngelCrawford/blog/issues/145) (gemeinsam mit Story 2.4)

**Acceptance Criteria:**
1. Webmention endpoint link added to `<head>`: `<link rel="webmention" href="https://webmention.io/article-time.de/webmention" />`
2. Webmention.io account created and verified for article-time.de domain
3. Test webmention received successfully (manual test from webmention.rocks)
4. Webmention.io API token stored in GitHub Secrets
5. Documentation added to privacy policy explaining webmentions

**Prerequisites:** Phase 0 (webmention.io account setup)

**Dependencies:** None

**Effort:** 0.5 days

---

## Story 2.4: Webmention Display Component

**As a** reader
**I want to** see replies and mentions from other websites
**So that** I can follow federated conversations

**FR Coverage:** FR-012

**GitHub Issue:** [#145 IndieWeb - Webmentions & Pingbacks](https://github.com/AngelCrawford/blog/issues/145) (gemeinsam mit Story 2.3 — Issue erst schließen wenn beide done)

**Acceptance Criteria:**
1. "Replies & Mentions" section added to article footer
2. Webmentions grouped by type: Replies, Reposts, Mentions, Likes
3. Each webmention shows: author name, avatar (if provided), reply text (if applicable), source link
4. Webmentions load from `data/webmentions_by_article.json` (generated daily)
5. If no webmentions, section shows: "No replies yet. Send a webmention!"
6. External links open in new tab with rel="noopener"
7. Webmention count displayed below article title (e.g., "3 replies")

**Prerequisites:** Story 2.3

**Dependencies:** Epic 3, Story 3.2 (webmention processing script) — **soft dependency** (siehe `docs/todo.md` → Cross-Epic Dependencies)

**Implementation Note (Mock Data):** Datei `data/webmentions_by_article.json` existiert noch nicht — wird erst von Story 3.2 erzeugt. Während der Implementierung **Fixture-Datei mit Sample-Webmentions** anlegen (1–2 Replies, 1 Like, 1 Mention, 1 Repost — alle Typ-Gruppierungen aus AC2 abdecken). AC5 („No replies yet")-Pfad mit leerem `{}` testen. Echte Daten fließen automatisch ein, sobald 3.2 läuft. Fixture-Datei vor Merge entweder löschen oder als `.example` umbenennen.

**Effort:** 2 days

---

## Story 2.5: Privacy Policy Page

**As a** reader
**I want** to understand what data is collected
**So that** I can trust the site respects my privacy

**FR Coverage:** FR-048

**GitHub Issue:** [#49 Needed Sites (Legal Notice, Privacy Policy)](https://github.com/AngelCrawford/blog/issues/49)

**Acceptance Criteria:**
1. Privacy policy page created at `/pages/privacy/`
2. Policy explains: Umami (anonymous analytics), hearts (event tracking), webmentions (public data)
3. Policy states: No tracking cookies, no personal data collection, no third-party ads
4. Policy links from footer on all pages
5. Policy includes contact information for privacy questions
6. Policy dated and versioned

**Prerequisites:** None

**Dependencies:** None

**Effort:** 1 day

---

## Story 2.6: Daily Rebuild GitHub Actions Workflow

**As a** content creator
**I want** the site to rebuild daily with fresh engagement data
**So that** popularity scores and sorting stay current

**FR Coverage:** FR-034

**GitHub Issue:** [#67 Merge and Deploy](https://github.com/AngelCrawford/blog/issues/67) (teilweise — GitHub Actions Setup; ältere Punkte des Issues evtl. schon erledigt)

**Acceptance Criteria:**
1. GitHub Actions workflow file created: `.github/workflows/daily-rebuild.yml`
2. Workflow triggers daily at 2 AM UTC via cron schedule
3. Workflow includes manual trigger option (`workflow_dispatch`)
4. Workflow steps: Checkout, Setup Node/Hugo, Fetch engagement data (placeholder), Build Hugo, Deploy to GitHub Pages
5. Workflow runs successfully on schedule
6. Build failures send email notification to repository owner
7. Workflow sets proper Git user for commits

**Prerequisites:** Phase 0 (GitHub Pages configured, secrets added)

**Dependencies:** Epic 3 (engagement fetch scripts added later) — **soft dependency** (siehe `docs/todo.md` → Cross-Epic Dependencies)

**Implementation Note (Placeholder Step):** AC4 „Fetch engagement data" wird in dieser Story als **No-Op-Placeholder** implementiert, z.B.:
```yaml
- name: Fetch engagement data (placeholder)
  run: echo "Engagement fetch placeholder — wird von Epic 3 (Stories 3.1, 3.2) befüllt"
```
Damit der Workflow bereits jetzt grün durchläuft (AC5: „runs successfully on schedule"). Echte `node scripts/fetch-umami-hearts.js` und `node scripts/fetch-webmentions.js` Aufrufe ersetzen den Placeholder in Stories 3.1 / 3.2 (oder per separatem PR im Rahmen von Epic 3).

**Effort:** 1 day

---

## Story 2.7: Cookie-Banner UI

**As a** reader concerned about privacy
**I want** a clear notice about minimal data collection on first visit
**So that** I understand the site's privacy posture and can dismiss the notice

**FR Coverage:** FR-048 (extends Privacy Policy 2.5)

**GitHub Issue:** [#94 Cookie-Banner UI](https://github.com/AngelCrawford/blog/issues/94)

**Source:** Restoration of `blog-old/themes/article/layouts/partials/cookie-banner.html` (see `docs/0-discovery/feature-gap-blog-old.md` → Privacy / DSGVO).

**Acceptance Criteria:**
1. Banner partial created at `layouts/_partials/_base/cookie-banner.html` (matches existing `_base/` partials convention)
2. Banner appears once per session on first visit and is dismissible via close button (sessionStorage flag, NO cookies)
3. Banner text explains: cookieless analytics (Umami), no tracking cookies, link to Privacy Policy (Story 2.5)
4. Banner integrates with existing `assets/js/gdpr.js` (already imported in head bundle)
5. Banner styled non-intrusive (bottom-fixed, semi-transparent, matches site theme)
6. Banner accessible (keyboard-dismissible, ARIA `role="dialog"`, screen-reader friendly)
7. Banner suppressed in noindex contexts and via `@media print`

**Prerequisites:** Story 2.5 (Privacy Policy must exist for link target)

**Dependencies:** None (uses existing `gdpr.js`)

**Effort:** 0.5 days

---

## Story 2.8: Bridgy.fed Setup & Verification

**As a** content creator
**I want** Mastodon (and Fediverse) replies, boosts, and likes to flow into my site as webmentions
**So that** federated engagement actually shows up in the webmention display, not just the small IndieWeb-blog subset

**FR Coverage:** FR-011 (extends Webmention Endpoint Setup) — Bridgy.fed is the bridge that makes my webmention.io endpoint receive non-Indie traffic. Without it, the receive-side stories (2.3, 2.4, 3.2) only see mentions from blogs that natively send webmentions.

**GitHub Issue:** [#145 IndieWeb - Webmentions & Pingbacks](https://github.com/AngelCrawford/blog/issues/145) (gemeinsam mit Stories 2.3 + 2.4 — issue erst schließen wenn alle drei done sind)

**Source:** Gap identified during Story 2.5 implementation review. `ux-design-specification.md` lines 711–712, 947, 1624 reference Bridgy as planned infrastructure for "Mastodon → Webmention conversion", but no story implements the setup. Epic 7 covers OUTGOING POSSE (my site → Mastodon), not INCOMING bridging. Bridgy.fed (`https://fed.brid.gy/`) is the canonical IndieWeb bridge for incoming federated engagement.

**Acceptance Criteria:**
1. Bridgy Fed account connected to a chosen Mastodon (or Bluesky) handle representing article-time.de — handle and instance documented in `docs/technical/runbook.md` or equivalent so a future operator knows where the bridge lives.
2. Domain verification with Bridgy Fed completed (rel="me" link or `.well-known/webfinger` — choose whichever Bridgy currently requires; document the chosen path).
3. End-to-end smoke test: a public Mastodon post that mentions or links to an article on article-time.de produces a webmention visible in the webmention.io dashboard within Bridgy's documented latency window. Document the test post URL + observed latency.
4. Privacy policy (`content/pages/datenschutz.md` → `## Webmentions` section) extended to disclose Bridgy.fed as an additional processor sitting between the originating Fediverse instance and webmention.io. Mention the operator (Ryan Barrett / Bridgy) and the data flow (public Fediverse activity → Bridgy → webmention.io → my site).
5. README or runbook entry documents how to disconnect / pause the bridge if needed (account suspension, abuse handling, opt-out for harassed mentions).
6. CSP review: confirm no new `connect-src` / `img-src` allow-list entries are required (Bridgy posts to webmention.io which is already allow-listed; sender avatars come from arbitrary federated instances which are already covered by `img-src https:`).
7. Bridgy operational status page link added to the runbook (if Bridgy goes down, mentions queue or are dropped — operator needs visibility).

**Prerequisites:** Story 2.3 (webmention endpoint must exist for Bridgy to POST to)

**Dependencies:** Story 3.2 (webmention processing script) — **soft dependency**: Bridgy can be wired up before 3.2 lands; mentions accumulate at webmention.io and are surfaced once 3.2's fetch-and-write loop runs.

**Implementation Note:** Setup at `https://fed.brid.gy/` is largely UI-driven (~5 minutes of clicks). The story-card weight is in (a) deciding the Fediverse identity (which Mastodon instance or Bluesky handle to claim), (b) updating the privacy policy honestly, (c) writing the runbook entry so this isn't a one-person tribal-knowledge item, and (d) the smoke test that proves the loop actually closes. This is an **infrastructure-only story** — no code change to the Hugo site is strictly required (privacy-policy update is content-only). The Bridgy account itself is the deliverable.

**Out of Scope:**
- Bridgy classic (Twitter) — Twitter killed Bridgy's API access; service is defunct. Don't attempt.
- Bluesky bridging — Bridgy supports it, but choose Mastodon-only for the initial story to keep the AC list tractable. Bluesky can be a follow-up note in completion notes.
- Outgoing POSSE (mein Blog → Mastodon-Posts) — that's Epic 7's territory (Stories 7.1, 7.2). Story 2.8 is incoming-only.

**Effort:** 0.5 days

---

## Story 2.9: Epic 2 Hardening & Follow-ups

**As a** maintainer
**I want** the security, robustness, and CI/UX gaps that Epic 2 reviews tagged `[Review][Defer]` closed in one bundled story
**So that** the engagement infrastructure shipped in 2.1–2.6 is hardened against known edge cases without each fix dragging its own ad-hoc PR or being forgotten

**FR Coverage:** None directly — bundled hardening story collecting deferred review items from done-stories 2.2, 2.4, and 2.6.

**Source:** Items collected from Epic 2 done-stories' Review Findings that were tagged `[Review][Defer]` and explicitly out-of-scope at original-story implementation time (each story scoped to 0.5–1 day; security/robustness/CI follow-ups bundled here instead of expanding scope per-story). Originating entries: `2-2-heart-button-component.md` (items "reflect.IsMap" and "storageKey baseURL"), `2-4-webmention-display-component.md` (adversarial XSS fixture), `2-6-daily-rebuild-github-actions-workflow.md` (javascript:-URI XSS in webmention links, issue dedup, failing-step name, context.sha for cron, markdown injection).

**Acceptance Criteria:**
1. **Security: `javascript:` / `data:` URI guard for webmention author + source links.** `layouts/_partials/widgets/webmention-group.html` (currently around lines 20–34) emits `<a href="{{ .author_url }}">` and `<a href="{{ .url }}">` without scheme filtering — Hugo's auto-escape covers HTML injection but **not** protocol injection, so a webmention.io payload with `author_url: "javascript:alert(1)"` would render as an executable link in production. Add an allowlist filter that emits `href` only if the URL scheme is `http://`, `https://`, or `mailto:`; otherwise fall through to the plain-text/`<span>` branch already established by Story 2.4's review patch. Add a build-smoke assertion covering the guard (a fixture entry with `author_url: "javascript:alert(1)"` must render as a `<span>`, not an `<a href>`).

2. **Robustness: heart-button `reflect.IsMap` future-proofing.** `layouts/_partials/widgets/heart-button.html:27` currently branches on `{{ if reflect.IsMap . }}` to detect the dict-context card-invocation pattern (vs. single-page Page-context invocation). In a future Hugo version, `reflect.IsMap` may return true for Page objects, causing wrong-branch render and broken cards. Replace with a stricter positive check that the context actually carries the expected dict keys — e.g. `{{ if and (reflect.IsMap .) (isset . "page") }}` — so only true dict contexts hit the card branch.

3. **Robustness: hearts.js `storageKey` baseURL-independence.** `assets/js/hearts.js` (around line 25) builds the localStorage key from `data-article` which is rendered as `$page.RelPermalink`. If `baseURL` ever changes (subpath deploy, custom-domain migration, prod→staging mirror), `RelPermalink` shifts and every existing `hearted-…` entry silently orphans → users lose visible hearted-state. Stabilise the key: either use `window.location.pathname` directly (browser-side resolved, never carries baseURL prefix), or strip a known prefix from the stored `data-article` before use. Add a code comment explaining the design intent so future-maintainer doesn't "fix" it back to the simpler raw form.

4. **CI: GitHub Issue deduplication for persistent workflow failures.** `.github/workflows/daily-rebuild.yml` and `.github/workflows/third-party-asset-monitor.yml` currently create a new GitHub Issue on every failed run — persistent failures spawn one issue per cron tick (daily / weekly). Add search-first-or-reopen logic: query for an open issue with the same title (e.g. `daily-rebuild failed: <date>` → match on `daily-rebuild failed`); if found, append a comment ("Failure recurred on `<date>`, run: `<url>`") instead of opening a duplicate. If the existing issue is closed, reopen + comment. Net effect: an issue tracker that surfaces *one* item per persistent failure mode, not N items per N days.

5. **CI: Failure-notification body quality.** Two improvements to the Notify-on-failure step bodies in both workflows:
   - **Include the failing step name** (not just "check the run logs"). Capture via `${{ steps.<id>.conclusion }}` or the GitHub API call. Goal: the issue body shows e.g. "Failed step: `Build Hugo site`", short-circuiting the operator's drill-down from issue → run → step.
   - **Use the actually-built commit SHA, not `context.sha`.** For cron builds the workflow checks out the latest tag, but `context.sha` resolves to HEAD-of-main at schedule time — misleading when investigating a build failure against tag content. Resolve the actual checkout SHA (`steps.checkout.outputs.commit` or equivalent) and embed that instead.

6. **CI: Markdown-injection sanitization in issue bodies.** `FAILED_LIST` and failure messages in `.github/workflows/third-party-asset-monitor.yml`'s Notify-on-drift script are embedded verbatim — URLs with Markdown control chars (`_`, `*`, backticks, `[]`) render as unintended formatting in the rendered issue. Wrap embedded URLs in backticks (or run a small escape pass over Markdown control chars) so they render literally. Cosmetic; no security impact (operator-curated URLs, not attacker-controlled).

7. **Test quality: adversarial XSS fixture for webmention build-smoke test.** `tests/build/build-smoke.test.mjs` (around line 1661 — Story 2.4 AC #8 XSS auto-escape test) currently uses clean fixture data with no HTML payloads, so the assertion "Hugo auto-escape is active" is technically unverified. Add one fixture entry to `data/webmentions_by_article.json` with `content: "<script>alert(1)</script>"` (and an analogous payload for `author`) and explicit assertions that the rendered HTML contains the escaped form `&lt;script&gt;alert(1)&lt;/script&gt;` and does **NOT** contain the raw `<script>` tag. Note: Story 2.4's [Defer] entry routed this to "Playwright / Story 3.2"; the build-smoke fixture is a strictly additive layer that does not block the Playwright/3.2 work.

**Prerequisites:** Stories 2.2, 2.4, 2.6 (all `done`).

**Dependencies:** None — all changes are localised to files already shipped; no new infra, no new external dependencies.

**Implementation Note:** All seven ACs are independent and can ship in any order. Suggested PR-splitting if Angel prefers smaller PRs:
- **(a)** AC #1 (security — javascript: URI guard) — should ship first; it's the only security-grade item.
- **(b)** ACs #2 + #3 (heart-button + hearts.js robustness) — same file family, small.
- **(c)** ACs #4 + #5 + #6 (workflow notification quality) — same files (`.github/workflows/*.yml`), need a `workflow_dispatch` validation run per change.
- **(d)** AC #7 (build-smoke fixture) — touches only `tests/` and `data/`, independent.
All seven fit in one PR if Angel prefers a single Epic-2-hardening commit cluster.

**Out of Scope** (each tracked in `docs/backlog.md` — not for this story):
- Heart visual design unification (backlog row "Design für Heart an allen Stellen") — UX redesign, not a hardening fix.
- Webmention visual design unification (backlog row "Design für Webmentions an allen Stellen") — same reasoning.
- Shared Hugo-build test fixture (backlog row "Redundant full hugo production builds") — test-infra refactor, not hardening.
- GitHub Actions version drift (backlog row "GitHub Actions version drift in `daily-rebuild.yml`") — dependency-bump cluster, validated per-action via `workflow_dispatch`, separate effort.
- Lighthouse audit (backlog row "Lighthouse Check und Anpassungen") — audit/measurement story.
- i18n migration (backlog row "Site-wide audit + migration of hardcoded UI strings to Hugo i18n") — cross-cutting refactor, not Epic-2-scoped.
- TOC frontmatter toggle (backlog row "TOC frontmatter toggle") — unrelated to Epic 2.

**Effort:** 1–1.5 days (seven small fixes spanning ~6 files: `webmention-group.html`, `heart-button.html`, `hearts.js`, `daily-rebuild.yml`, `third-party-asset-monitor.yml`, `build-smoke.test.mjs`, fixture `data/webmentions_by_article.json`).

---

# Epic 3: Popularity Scoring Engine [Phase 1A, Week 4-5]

**Goal:** Calculate and store engagement-based popularity scores

**Value:** Data-driven content sorting reflecting reader engagement

**FR Coverage:** FR-010, FR-013, FR-018, FR-019, FR-035, FR-036, FR-037

---

## Story 3.1: Umami Hearts Fetch Script

**As a** content creator
**I want** daily heart counts fetched from Umami API
**So that** heart engagement data is current

**FR Coverage:** FR-010, FR-035

**Acceptance Criteria:**
1. Node.js script created: `scripts/fetch-umami-hearts.js`
2. Script reads Umami API credentials from environment variables
3. Script fetches "heart" event counts grouped by article permalink
4. Script outputs `data/umami_hearts.json` with format: `{"/articles/post/": 42}`
5. Script handles API errors gracefully (retry 3x, fail with clear error)
6. Script execution time < 10 seconds
7. Script added to GitHub Actions workflow (runs before build)

**Prerequisites:** Epic 2, Story 2.1, Story 2.2

**Dependencies:** None

**Effort:** 1.5 days

**Pre-Spec Notes (from prior-story reviews):**
- **Key-format validation (from Story 2.2 review, 2026-05-09).** `layouts/_partials/widgets/heart-button.html` looks up counts via `index hugo.Data.umami_hearts .RelPermalink` (e.g. `/articles/my-post/`). This script MUST write keys in exactly that format — trailing slash, no `baseURL` prefix, no leading scheme/host. Add an explicit validation step in the script (or a smoke test) that asserts every emitted key matches `^/[^?#]*/$` before writing `data/umami_hearts.json`, so a key-format drift breaks the fetch loudly rather than silently zeroing out heart counts on the live site.
- **Phase-1/Phase-3 permalink-prefix split (from domain-migration ADR, Story 9.15 AC16).** Heart custom-events tracked by Umami carry the article permalink. Hearts accrued during Phase 1 (live on `article-time.de`) are tagged with `https://article-time.de/...`-prefixed permalinks in Umami; hearts after Story 9.15 cutover are tagged with `https://angel-crawford.de/...`. The fetch-and-aggregate logic MUST normalize permalinks to a domain-agnostic form (parse → use `URL.pathname` only) before grouping per article — otherwise the same article shows two separate heart counts. This normalization step is independent of and additive to the key-format validation above (the output `^/[^?#]*/$` shape is identical; only the input parsing differs). Acceptable to implement as: read raw permalink from Umami event → strip scheme + host → enforce trailing slash → that becomes the aggregation key. If Story 9.15 (Cutover) has not yet happened at Story 3.1 implementation time, the input-normalization logic still applies (defensive against the upcoming switch).

---

## Story 3.2: Webmention Processing Script

**As a** content creator
**I want** webmentions fetched and processed daily
**So that** comment engagement data is current

**FR Coverage:** FR-013, FR-035

**Acceptance Criteria:**
1. Webmentions fetched via curl: `curl "https://webmention.io/api/mentions.jf2?domain=article-time.de" -o data/webmentions_raw.json`
2. Node.js script created: `scripts/process-webmentions.js`
3. Script groups webmentions by target article URL
4. Script counts webmentions per article (all types)
5. Script outputs `data/webmentions_by_article.json` with format: `{"/articles/post/": [{type, author, content}]}`
6. Script filters spam based on simple rules (optional: trusted domains only if spam detected)
7. Script execution time < 10 seconds
8. Script added to GitHub Actions workflow

**Prerequisites:** Epic 2, Story 2.3

**Dependencies:** None

**Effort:** 2 days

**Pre-Spec Notes (from prior-story reviews):**
- **Key-format validation for `webmentions_by_article.json` (from Story 2.4 review, 2026-05-09).** `layouts/_partials/widgets/webmention-group.html` looks up grouped mentions via `index hugo.Data.webmentions_by_article .RelPermalink` (e.g. `/articles/my-post/`). This script MUST emit keys in exactly that format — trailing slash, no `baseURL` prefix, no leading scheme/host. Add an explicit validation step (or smoke test) asserting every emitted key matches `^/[^?#]*/$` before writing `data/webmentions_by_article.json`, so a key drift breaks the build loudly rather than silently zeroing out webmention groups on the live site. Mirrors the same convention captured for `umami_hearts.json` in Story 3.1's Pre-Spec.
- **Adversarial XSS fixture for webmention content (from Story 2.4 review, 2026-05-09).** Story 2.4's AC #8 XSS smoke test validates Hugo auto-escape only against clean fixture data — no HTML payloads in `data/webmentions_by_article.json`, so the test cannot confirm escape is active. When this script lands (or at the latest when Playwright is set up under Epic 9), include at least one adversarial fixture entry (e.g. `content` containing `<script>alert(1)</script>` or `<img onerror=…>`) so the display path actually exercises the escape.

---

## Story 3.3: Popularity Score Calculation Script

**As a** content creator
**I want** popularity scores calculated from hearts, webmentions, and manual weight
**So that** content sorting reflects multi-factor quality

**FR Coverage:** FR-018, FR-036

**Acceptance Criteria:**
1. Node.js script created: `scripts/calculate-popularity.js`
2. Script reads: `data/umami_hearts.json`, `data/webmentions_by_article.json`, content frontmatter (for weight)
3. Script calculates popularity per article: `(hearts × 1) + (webmentions × 3) + (weight × 2)`
4. Script outputs `data/popularity_scores.json` with format: `{"/articles/post/": 42}`
5. Script handles missing data gracefully (0 if no hearts/webmentions/weight)
6. Script execution time < 5 seconds
7. Script added to GitHub Actions workflow (runs after fetch scripts)

**Prerequisites:** Story 3.1, Story 3.2

**Dependencies:** None

**Effort:** 1 day

---

## Story 3.4: Data Commits to data-updates Branch

**As a** content creator
**I want** engagement data committed to separate branch
**So that** main branch stays clean and data history is preserved

**FR Coverage:** FR-037

**Acceptance Criteria:**
1. GitHub Actions workflow creates/switches to `data-updates` branch
2. Workflow commits `data/*.json` files with message: `"chore: update popularity scores YYYY-MM-DD [skip ci]"`
3. Workflow pushes to `data-updates` branch with force flag
4. Workflow switches back to `main` branch
5. Workflow copies data from `data-updates` to `main` workspace (not committed to main)
6. Data history visible in `data-updates` branch commits
7. Main branch commit history remains clean (no daily data commits)

**Prerequisites:** Story 3.1, Story 3.2, Story 3.3

**Dependencies:** None

**Effort:** 1 day

---

## Story 3.5: Early Promotion Logic

**As a** reader
**I want** high-engagement content promoted to top of established tier
**So that** fast-rising quality content gets extra visibility

**FR Coverage:** FR-019

**Acceptance Criteria:**
1. Hugo template checks popularity score for each article in Tier 3
2. Articles with popularity ≥ 20 sorted to top of Tier 3 (before lower-scored articles)
3. Within high-engagement group, sorted by popularity descending
4. Early promotion threshold configurable in `params.yaml`
5. Visual indicator (optional badge) for promoted content

**Prerequisites:** Story 3.3, Epic 4 (Three-Tier Sorting)

**Dependencies:** Epic 4, Story 4.3

**Effort:** 0.5 days

---

## Story 3.6: Most-Loved Widget

**As a** reader
**I want** a sidebar widget showing the most-loved articles
**So that** I can quickly discover the community's favorites

**FR Coverage:** FR-019 (extends Early Promotion logic 3.5)

**GitHub Issue:** [#115 Most-Loved Widget](https://github.com/AngelCrawford/blog/issues/115)

**Source:** Restoration of `blog-old/themes/article/layouts/partials/widget-mostloved.html` (see `docs/0-discovery/feature-gap-blog-old.md` → Page-Level Features).

**Acceptance Criteria:**
1. Widget partial created at `layouts/_partials/widgets/most-loved.html`
2. Widget reads `data/popularity_scores.json` (output of Story 3.3)
3. Widget displays top 5 articles by popularity score (descending), excluding withered content
4. Each entry shows: title (linked), engagement count (hearts + webmentions), permalink
5. Empty-state: widget hides itself if fewer than 3 articles have a non-zero popularity score
6. Widget styled to match existing sidebar widgets (archive, series, related)
7. Widget includable on any page via `{{ partial "widgets/most-loved.html" . }}`
8. Widget renders without JavaScript (server-side data lookup at build time)

**Prerequisites:** Story 3.3 (popularity scores)

**Dependencies:** None

**Effort:** 1 day

---

# Epic 4: Three-Tier Sorting [Phase 1A, Week 4-5]

**Goal:** Homepage sorted by quality + freshness (Pinned, Grace Period, Established)

**Value:** Quality content naturally rises, updates rewarded with visibility

**FR Coverage:** FR-014, FR-015, FR-016, FR-017, FR-020, FR-050, FR-051

---

## Story 4.1: Pinned Content (Tier 1)

**As a** content creator
**I want to** pin up to 3 flagship articles to homepage top
**So that** I can manually curate best content

**FR Coverage:** FR-014, FR-051

**Acceptance Criteria:**
1. Articles with `weight: 10` appear in Tier 1 (Pinned)
2. Template enforces exactly 3 pinned articles maximum (`.| first 3`)
3. If more than 3 articles have `weight: 10`, only first 3 (by date) shown
4. Pinned articles sorted by date descending (newest first) within tier
5. Visual separator between Tier 1 and Tier 2
6. Tier 1 labeled "Pinned" or with visual indicator

**Prerequisites:** None

**Dependencies:** None

**Effort:** 1 day

---

## Story 4.2: Grace Period (Tier 2)

**As a** content creator
**I want** recently updated content boosted to prominent tier for 28 days
**So that** content updates are rewarded with visibility

**FR Coverage:** FR-015, FR-016, FR-050

**Acceptance Criteria:**
1. Articles with `last_significant_update` within past 28 days appear in Tier 2
2. Grace period duration configurable: `digital_garden.grace_period_days` in `params.yaml`
3. Tier 2 articles exclude pinned articles (don't appear in both tiers)
4. Tier 2 articles sorted by `last_significant_update` descending (most recent first)
5. Visual separator between Tier 2 and Tier 3
6. Tier 2 labeled "Recently Updated" or with visual indicator
7. Archetype templates include `last_significant_update: {{ .Date }}` by default

**Prerequisites:** None

**Dependencies:** None

**Effort:** 2 days

---

## Story 4.3: Established Content (Tier 3)

**As a** reader
**I want** remaining content sorted by popularity score
**So that** quality content rises to top over time

**FR Coverage:** FR-017

**Acceptance Criteria:**
1. Articles not in Tier 1 or Tier 2 appear in Tier 3
2. Tier 3 articles sorted by popularity score descending (highest first)
3. Popularity score loaded from `data/popularity_scores.json`
4. If no popularity data, fallback to date descending
5. If articles have equal popularity, secondary sort by date descending
6. Tier 3 labeled "Established" or with visual indicator (optional)

**Prerequisites:** Epic 3, Story 3.3

**Dependencies:** None

**Effort:** 1.5 days

---

## Story 4.4: Homepage Layout Refactor

**As a** reader
**I want** clear visual hierarchy of three tiers
**So that** I understand content organization mental model

**FR Coverage:** FR-020

**Acceptance Criteria:**
1. Homepage template refactored to show three distinct sections
2. Each tier has header/label (Pinned, Recently Updated, Established)
3. Visual separators between tiers (horizontal rule, spacing, or background color change)
4. Tier 1 uses prominent card style (larger, featured)
5. Tier 2 uses standard card style with "Updated" badge
6. Tier 3 uses standard card style
7. Responsive: Tier layout works on mobile (stacked vertically)

**Prerequisites:** Story 4.1, Story 4.2, Story 4.3

**Dependencies:** None

**Effort:** 2 days

---

# Epic 5: Badge & Filter System [Phase 1A, Week 6]

**Goal:** Visual badges (New, Updated) + dual filtering UI (format + stage)

**Value:** Enhanced discoverability, reader control over content display

**FR Coverage:** FR-003, FR-005, FR-024, FR-025, FR-032, FR-033

---

## Story 5.1: New Badge Implementation

**As a** reader
**I want** recently published content marked with "New" badge
**So that** I can spot fresh content

**FR Coverage:** FR-024

**Acceptance Criteria:**
1. "New" badge displays on content published within last 28 days
2. Badge positioned top-left corner of card
3. Badge calculation: `if (now - date) < 28 days`
4. Badge disappears automatically after 28 days
5. Badge styled with bright accent color
6. Badge accessible (ARIA label "Published recently")

**Prerequisites:** None

**Dependencies:** None

**Effort:** 0.5 days

---

## Story 5.2: Updated Badge Implementation

**As a** reader
**I want** recently updated content marked with "Updated" badge
**So that** I know content has been refreshed

**FR Coverage:** FR-025

**Acceptance Criteria:**
1. "Updated" badge displays on content in grace period (last_significant_update < 28 days)
2. Badge positioned top-left corner, below "New" badge if both present
3. Badge disappears after grace period ends
4. Badge styled with secondary accent color (different from "New")
5. Badge shows update date on hover (tooltip)
6. Badge accessible (ARIA label "Updated recently")

**Prerequisites:** Epic 4, Story 4.2 (grace period logic)

**Dependencies:** None

**Effort:** 0.5 days

---

## Story 5.3: Growth Stage Filter UI

**As a** reader
**I want to** filter content by growth stage
**So that** I can focus on specific maturity levels

**FR Coverage:** FR-003, FR-005

**Acceptance Criteria:**
1. Filter UI added to homepage (above content grid, below header)
2. Filter buttons for: All (default), 🌱 Seedling, 🌿 Budding, 🌳 Evergreen, 💀 Show Withered
3. "All" option excludes withered by default
4. "Show Withered" button shows count of hidden items (e.g., "Show Withered (3)")
5. Filter active state styled distinctly (bold, background color, border)
6. Filter accessible (keyboard navigation, ARIA labels)

**Prerequisites:** Epic 1 (Growth Stage System)

**Dependencies:** Story 5.4 (JavaScript filter logic)

**Effort:** 1 day

**Pre-Spec Notes (from prior-story reviews):**
- **Replace static `withered-hidden-notice` with the interactive AC #4 button (from Story 1.3 review, 2026-05-08).** `layouts/_partials/withered-hidden-notice.html` currently renders a passive count ("X verwelkte Einträge sind ausgeblendet") at the bottom of `home.html` and `list.html`. The notice has no contextual anchor and shows the same site-wide total on every paginated page (page 1, page 2, …). AC #4's "Show Withered (3)" button is the proper home for this count — wire it to the same `withered-count.html` data source, then delete the standalone notice partial and remove the `{{ partial "withered-hidden-notice.html" $hiddenCount }}` calls from `home.html` and `list.html`.

---

## Story 5.4: Client-Side Filter JavaScript

**As a** reader
**I want** instant filtering without page reload
**So that** I can explore content quickly

**FR Coverage:** FR-003, FR-032, FR-033

**Acceptance Criteria:**
1. JavaScript file created: `assets/js/filter.js`
2. Each card has data attributes: `data-format`, `data-stage`
3. Filter buttons trigger JavaScript function `filterCards(format, stage)`
4. Filtering uses CSS `display: none` to hide non-matching cards
5. Filter state saved to sessionStorage (persists across page navigations)
6. Filter count updates (e.g., "Showing 12 of 45 articles")
7. Graceful degradation: If JavaScript disabled, all content shown

**Prerequisites:** Story 5.3

**Dependencies:** None

**Effort:** 1.5 days

---

## Story 5.5: Format Filter UI

**As a** reader
**I want to** filter content by format type
**So that** I can view specific content types (e.g., only videos)

**FR Coverage:** FR-032

**GitHub Issue:** [#158 Format Filter](https://github.com/AngelCrawford/blog/issues/158)

**Acceptance Criteria:**
1. Format filter UI added to homepage (next to growth stage filter)
2. Filter buttons for: All (default), Article, Log, Link (Phase 1B), Video (Phase 1B), Gallery (Phase 1B), Portfolio (Phase 1B)
3. Initially shows only Article + Log filters (Phase 1A), expands in Phase 1B
4. Format filter uses same JavaScript logic as stage filter
5. Filter active state styled distinctly
6. Filter accessible (keyboard navigation, ARIA labels)

**Prerequisites:** Story 5.4

**Dependencies:** None

**Effort:** 1 day

---

## Story 5.6: Combined Filter Logic

**As a** reader
**I want to** apply both format AND stage filters simultaneously
**So that** I can find specific content (e.g., "evergreen videos")

**FR Coverage:** FR-033

**Acceptance Criteria:**
1. Both filters apply with AND logic (both conditions must match)
2. Filter count updates correctly for combined filters (e.g., "Showing 3 of 45 articles")
3. Resetting one filter maintains the other filter's state
4. "Clear All Filters" button resets both to default (All formats, All stages except withered)
5. URL query parameters store filter state (optional, for sharing filtered views)
6. Filter state persists across page navigations (sessionStorage)

**Prerequisites:** Story 5.4, Story 5.5

**Dependencies:** None

**Effort:** 1 day

---

## Story 5.7: Format-Icons via `contains`-Taxonomy

**As a** reader
**I want** small format icons (Instagram, Twitter, YouTube, image, gallery, code) on cards
**So that** I can recognize the type of embedded content at a glance

**FR Coverage:** FR-024 (badge system extension; complements FR-032 Format Filter)

**GitHub Issue:** [#158 Format Filter](https://github.com/AngelCrawford/blog/issues/158) (visual layer to the filter)

**Source:** Restoration of the legacy `contains`-Taxonomie from `blog-old` (see `docs/0-discovery/feature-gap-blog-old.md` → Content-Formate / `contains`-Taxonomie). Old taxonomy reactivated solely to drive icon mapping on cards.

**Acceptance Criteria:**
1. `contains` taxonomy reactivated in `config/_default/config.yaml`
2. Frontmatter `contains: ["youtube", "image", ...]` accepts predefined values: `instagram`, `twitter`, `youtube`, `image`, `gallery`, `code`
3. `layouts/_partials/card.html` renders matching Remix Icon glyph(s) per `contains` entry
4. Icons positioned in card footer (consistent with growth-badge ADR-005 — no top-corner placement)
5. Icons accessible (ARIA labels: "Contains YouTube video", "Contains image", etc.)
6. Multiple icons supported (e.g., article with `["image", "youtube"]` shows both)
7. No icons rendered when `contains` field is absent (no clutter for plain text articles)

**Prerequisites:** None

**Dependencies:** None

**Effort:** 1 day

---

# Epic 6: History Timeline [Phase 2, Week 10]

**Goal:** Transparent content evolution tracking with visual timeline

**Value:** Learning in public, content maintenance transparency

**FR Coverage:** FR-021, FR-022, FR-023

---

## Story 6.1: History Frontmatter Field

**As a** content creator
**I want to** record history of significant content updates
**So that** readers see content evolution

**FR Coverage:** FR-021

**Acceptance Criteria:**
1. `history` field accepts array of objects: `[{date, note}]`
2. Archetype templates include example history entry
3. History entries sorted chronologically (oldest first or newest first, configurable)
4. History field optional (not all content needs history)
5. History field documented in archetype comments

**Prerequisites:** None

**Dependencies:** None

**Effort:** 0.5 days

---

## Story 6.2: Recent History Sidebar Widget

**As a** reader
**I want to** see recent content updates in sidebar
**So that** I know content is actively maintained

**FR Coverage:** FR-022

**Acceptance Criteria:**
1. Widget partial created: `layouts/_partials/widgets/history.html`
2. Widget displays 3 most recent history entries (sorted by date descending)
3. Each entry shows: date, note
4. Widget only displays if history exists (conditional rendering)
5. Widget includes "View full history" link to footer timeline
6. Widget styled to match sidebar design

**Prerequisites:** Story 6.1

**Dependencies:** None

**Effort:** 1 day

---

## Story 6.3: Full History Timeline (Article Footer)

**As a** reader
**I want to** see complete content history in article footer
**So that** I understand full evolution over time

**FR Coverage:** FR-023

**Acceptance Criteria:**
1. Full timeline section added to article footer (above webmentions)
2. Timeline displays all history entries with visual connection lines (CSS timeline)
3. Each entry shows: date, note, icon (optional: 📅 or timeline dot)
4. Timeline styled with vertical line connecting entries
5. Timeline responsive (adapts to mobile screens)
6. Timeline only displays if history exists

**Prerequisites:** Story 6.1

**Dependencies:** None

**Effort:** 1.5 days

---

# Epic 7: POSSE & Advanced Webmentions [Phase 3, Week 12-13]

**Goal:** Federated content distribution (Mastodon, Threads) + advanced webmention features

**Value:** Reach federated audience, drive traffic, federated conversations

**FR Coverage:** FR-038, FR-039, FR-040, FR-041

**Umbrella GitHub Issue** (close after ALL stories in epic done): [#147 IndieWeb - Posse](https://github.com/AngelCrawford/blog/issues/147)

---

## Story 7.1: Mastodon API Integration

**As a** content creator
**I want** new articles automatically posted to Mastodon
**So that** I reach federated audience without manual work

**FR Coverage:** FR-038

**Acceptance Criteria:**
1. Node.js script created: `scripts/posse-mastodon.js`
2. Script reads Mastodon credentials from environment variables (MASTODON_TOKEN, MASTODON_INSTANCE_URL)
3. Script posts new articles (published within last 24 hours) with format: `🌱 New article: [TITLE]\n\n[SUMMARY]\n\n🔗 [URL]\n\n#DigitalGarden #Hugo`
4. Script uses Mastodon API to create status (POST /api/v1/statuses)
5. Script handles API errors gracefully (logs error, doesn't fail build)
6. Script execution time < 10 seconds
7. Script added to GitHub Actions workflow (runs after build)
8. Script tracks posted articles to avoid duplicates (stores permalink in data file)

**Prerequisites:** Phase 3 (Mastodon API token generated, secret added)

**Dependencies:** None

**Effort:** 2 days

---

## Story 7.2: Threads API Integration (If Available)

**As a** content creator
**I want** new articles automatically posted to Threads if API permits
**So that** I reach Meta ecosystem audience

**FR Coverage:** FR-039

**Acceptance Criteria:**
1. Node.js script created: `scripts/posse-threads.js`
2. Script reads Threads credentials from environment variables (THREADS_TOKEN)
3. Script posts new articles with similar format to Mastodon
4. Script uses Threads API (if available and functional)
5. Script handles API errors gracefully
6. Script configurable: `posse.threads.enabled: true/false` in `params.yaml`
7. If Threads API not functional, script logs warning and exits gracefully

**Prerequisites:** Phase 3 (Threads API evaluation complete)

**Dependencies:** Story 7.1 (similar implementation)

**Effort:** 2 days (if API available)

---

## Story 7.3: Manual POSSE Documentation

**As a** content creator
**I want** clear guide for manually posting to Facebook and Reddit
**So that** I can reach those platforms despite API restrictions

**FR Coverage:** FR-040

**Acceptance Criteria:**
1. Documentation page created: `docs/posse-manual-guide.md`
2. Facebook section: Step-by-step for personal profile posting, OG preview tips
3. Reddit section: Subreddit rules, 10:1 engagement ratio, context guidelines
4. Screenshots of posting process included
5. Templates for post text provided
6. Documentation linked from main docs index

**Prerequisites:** None

**Dependencies:** None

**Effort:** 1 day

---

## Story 7.4: Syndication Links Display

**As a** reader
**I want to** see links to syndicated copies on other platforms
**So that** I can join conversations on my preferred platform

**FR Coverage:** FR-041

**Acceptance Criteria:**
1. "Syndicated to" section added to article footer
2. Frontmatter fields for syndication links: `syndication: {mastodon: "URL", threads: "URL", facebook: "URL", reddit: "URL"}`
3. Icons/buttons for each platform (only if URL provided)
4. External links open in new tab with rel="noopener"
5. Section responsive (stacks on mobile)
6. Section only displays if at least one syndication link exists

**Prerequisites:** Story 7.1, Story 7.2 (or manual posting)

**Dependencies:** None

**Effort:** 1 day

---

## Story 7.5: Advanced Webmention Threading

**As a** reader
**I want** webmention replies nested as conversations
**So that** I can follow federated discussions

**FR Coverage:** FR-012 (enhanced)

**Acceptance Criteria:**
1. Webmentions grouped by conversation thread (in-reply-to chain)
2. Nested replies indented visually (CSS hierarchy)
3. Author avatars displayed for each webmention
4. Reply context shown (quoted text from parent mention)
5. Timestamps relative (e.g., "2 days ago") with absolute tooltip
6. Threading works even if intermediate replies not webmentioned

**Prerequisites:** Epic 2, Story 2.4

**Dependencies:** None

**Effort:** 2 days

---

# Epic 8: Format Expansion [Phase 1B, Week 7-9]

**Goal:** Implement 4 new content formats (Link, Video, Gallery, Portfolio)

**Value:** Content diversity, richer blog experience, multiple creative outlets

**FR Coverage:** FR-028, FR-029, FR-030, FR-031, FR-032, FR-033

**Umbrella GitHub Issue** (close after ALL stories in epic done): [#59 Possible Formats](https://github.com/AngelCrawford/blog/issues/59)

---

## Story 8.1: Link Format - Archetype & Frontmatter

**As a** content creator
**I want to** create link posts with external URLs and commentary
**So that** I can curate valuable resources

**FR Coverage:** FR-028

**Acceptance Criteria:**
1. Archetype created: `archetypes/links/index.md`
2. Frontmatter includes: `format: "link"`, `url: ""`, `domain: ""`, `summary: ""`
3. Archetype template documented with comments explaining link format
4. Command works: `hugo new content links/my-bookmark`
5. Domain auto-extracted from URL (optional helper script)

**Prerequisites:** None

**Dependencies:** None

**Effort:** 0.5 days

**Pre-Spec Notes (from prior-story reviews):**
- **Format-icon SCSS variables sweep (from Story 1.3 review, 2026-05-08).** Extract format-icon colors into named SCSS variables (`$format-article`, `$format-log`, …) in `assets/scss/vars/_colors.scss` parallel to the existing `$growth-*` variables. Currently inline as hex/HSL on `<svg style="fill: …">` in `card.html` and `_base/footer.html`. Time as a sweep when this story lands so all format colors share the same convention from the start (Link, Video, Gallery, Portfolio added in Epic 8).

---

## Story 8.2: Link Format - Card & Template

**As a** reader
**I want to** see link cards with domain and external icon
**So that** I know it's curated content

**FR Coverage:** FR-028

**GitHub Issue:** [#32 Link Preview for Posts](https://github.com/AngelCrawford/blog/issues/32) (Rich-Snippet-Vorschau für Links)

**Acceptance Criteria:**
1. Link card partial created: `layouts/_partials/cards/link.html`
2. Card shows: title, domain (e.g., "→ example.com"), summary, external link icon ↗
3. Card click behavior: Opens external URL in new tab
4. Single page template: `layouts/links/single.html` shows commentary + prominent external link button
5. Link format integrated into homepage content query
6. Format filter includes "Link" option

**Prerequisites:** Story 8.1

**Dependencies:** Epic 5 (Filter System)

**Effort:** 1.5 days

---

## Story 8.3: Video Format - Archetype & Frontmatter

**As a** content creator
**I want to** create video posts with YouTube/Vimeo embeds
**So that** I can share video content with commentary

**FR Coverage:** FR-029

**Acceptance Criteria:**
1. Archetype created: `archetypes/videos/index.md`
2. Frontmatter includes: `format: "video"`, `video_url: ""`, `video_id: ""`, `platform: "youtube"`, `duration: ""`
3. Archetype documented with examples for YouTube and Vimeo
4. Command works: `hugo new content videos/my-video`

**Prerequisites:** None

**Dependencies:** None

**Effort:** 0.5 days

---

## Story 8.4: Video Format - Card & Embed

**As a** reader
**I want to** see video cards with thumbnails and play on single page
**So that** I can watch embedded videos

**FR Coverage:** FR-029

**Acceptance Criteria:**
1. Video card partial created: `layouts/_partials/cards/video.html`
2. Card shows: video thumbnail (from YouTube API), play icon ▶ overlay, duration badge, title, summary
3. Thumbnail fetched via: `https://img.youtube.com/vi/{video_id}/maxresdefault.jpg`
4. Single page template: `layouts/videos/single.html` embeds responsive 16:9 video player
5. Embed supports YouTube and Vimeo
6. Video format integrated into homepage content query
7. Format filter includes "Video" option

**Prerequisites:** Story 8.3

**Dependencies:** Epic 5 (Filter System)

**Effort:** 2 days

---

## Story 8.5: Gallery Format - Archetype & Structure

**As a** content creator
**I want to** create photo galleries with multiple images
**So that** I can share photo essays and travel logs

**FR Coverage:** FR-030

**Acceptance Criteria:**
1. Archetype created: `archetypes/galleries/index.md`
2. Frontmatter includes: `format: "gallery"`, `title: ""`, `summary: ""`
3. Images stored in page bundle (same folder as index.md)
4. Cover image designated via `cover: "image.jpg"` or first image
5. Command works: `hugo new content galleries/iceland-trip`

**Prerequisites:** None

**Dependencies:** None

**Effort:** 0.5 days

---

## Story 8.6: Gallery Format - Card & Lightbox

**As a** reader
**I want to** see gallery previews and browse full-size images
**So that** I can enjoy photo collections

**FR Coverage:** FR-030

**Acceptance Criteria:**
1. Gallery card partial created: `layouts/_partials/cards/gallery.html`
2. Card shows: 2×2 or 3×3 image grid preview, photo count badge (e.g., "24 photos")
3. Single page template: `layouts/galleries/single.html` uses masonry grid layout
4. Lightbox/modal for full-size image viewing (click image → modal)
5. Lightbox supports: keyboard navigation (arrow keys), swipe on mobile, ESC to close
6. Images lazy-loaded for performance
7. Gallery format integrated into homepage content query
8. Format filter includes "Gallery" option

**Prerequisites:** Story 8.5

**Dependencies:** Epic 5 (Filter System)

**Effort:** 3 days

---

## Story 8.7: Portfolio Format - Archetype & Frontmatter

**As a** content creator
**I want to** create portfolio project showcases
**So that** I can display work samples and case studies

**FR Coverage:** FR-031

**Acceptance Criteria:**
1. Archetype created: `archetypes/portfolio/index.md`
2. Frontmatter includes: `format: "portfolio"`, `project_url: ""`, `github_url: ""`, `tech_stack: []`, `role: ""`, `year: ""`
3. Archetype documented with example tech stack values
4. Command works: `hugo new content portfolio/my-project`

**Prerequisites:** None

**Dependencies:** None

**Effort:** 0.5 days

---

## Story 8.8: Portfolio Format - Card & Case Study

**As a** reader
**I want to** see portfolio projects with tech stack and demos
**So that** I can explore the creator's work

**FR Coverage:** FR-031

**Acceptance Criteria:**
1. Portfolio card partial created: `layouts/_partials/cards/portfolio.html`
2. Card shows: project screenshot, tech stack badges/pills, role, year, links (demo, GitHub)
3. Single page template: `layouts/portfolio/single.html` has sections: Overview, Tech Stack, Solution, Results, Gallery
4. Tech stack displays with icons (use SVG sprite or CDN like Simple Icons)
5. Case study layout includes: problem statement, approach, outcomes, lessons learned
6. Portfolio format integrated into homepage content query
7. Format filter includes "Portfolio" option

**Prerequisites:** Story 8.7

**Dependencies:** Epic 5 (Filter System)

**Effort:** 2.5 days

---

# Epic 9: Polish & Optimization [Phase 2, Week 10-11]

**Goal:** Visual polish, SEO optimization, accessibility, performance

**Value:** Professional quality, discoverability, inclusive design

**FR Coverage:** FR-006, FR-007, FR-042, FR-043, FR-044, FR-045, FR-046, FR-048

**Implementation order — Identity-Unification chain (Stories 9.13–9.16):** `9.16 → 9.13 → 9.14 → 9.15`. These four stories form a hard-prerequisite chain driven by [`adr-domain-migration.md`](../2-solutioning/adr-domain-migration.md) and [`adr-multi-author-to-coauthor.md`](../2-solutioning/adr-multi-author-to-coauthor.md). Story 9.16 defines `params.identity`; 9.13 populates the h-card from it; 9.14 prepares the domain+brand cutover; 9.15 executes it. Do NOT create stories out of this order. Stories 9.1–9.12 are independent and can be sequenced freely within Epic 9.

---

## Story 9.1: OG Image Template & Generation

**As a** content creator
**I want** unique OG images for each article with growth stage badge
**So that** social media previews are rich and branded

**FR Coverage:** FR-042

**GitHub Issue:** [#116 Open Graph (Share Images)](https://github.com/AngelCrawford/blog/issues/116)

**Acceptance Criteria:**
1. OG image template created: `assets/images/og-template.png` (1200×630)
2. Growth stage badge overlays added: `assets/images/badges/*.png`
3. Hugo image processing partial: `layouts/_partials/og-image-generator.html`
4. OG image generation uses Hugo's `images.Filter` with text overlay (title) and badge overlay
5. Generated OG images cached in `/resources/_gen/images/`
6. OG meta tags updated: `<meta property="og:image" content="{{ $img.Permalink }}" />`
7. Build time impact < 1 minute for full site (30-60 seconds for all OG images)

**Prerequisites:** None

**Dependencies:** None

**Effort:** 2 days

---

## Story 9.2: Schema.org Structured Data

**As a** content creator
**I want** rich search results with article metadata
**So that** content is discoverable and trustworthy in search

**FR Coverage:** FR-043

**GitHub Issue:** [#173 Schema](https://github.com/AngelCrawford/blog/issues/173)

**Acceptance Criteria:**
1. JSON-LD structured data added to article pages
2. Schema includes: Article type, headline, author, datePublished, dateModified, description, image
3. Custom property for growth stage (if schema allows extension)
4. Structured data validates with Google Rich Results Test
5. Breadcrumbs schema for navigation
6. Organization schema in site footer

**Prerequisites:** None

**Dependencies:** None

**Effort:** 1 day

**Pre-Spec Notes (from prior-story reviews):**
- **BlogPosting multi-author duplicate-key bug — structurally obsolete by ADR multi-author → coauthor.** Originally flagged in Story 1.5 review (2026-05-09): `seo.html` BlogPosting emitted multiple top-level `"author":` keys when an article had multiple authors. **Resolved structurally by [`adr-multi-author-to-coauthor.md`](../2-solutioning/adr-multi-author-to-coauthor.md) (Accepted 2026-05-12) / Story 9.16:** new schema has at most one main author + optional coauthors array → single `"author":` key (value scalar or array, never duplicate). No fix needed in Story 9.2 scope.
- **`safeJS`/`jsonify` double-escape sweep (from Story 1.5 review, 2026-05-09).** `| safeJS` after `| jsonify` only applied to the BlogPosting JSON-LD block in `seo.html`. Same double-escape risk applies to any other `<script>` block using `jsonify` in the codebase — sweep when adding more JSON-LD types in this story.

---

## Story 9.3: No-JavaScript Fallback Banner

**As a** reader with JavaScript disabled
**I want** a notice that some features require JS
**So that** I understand why filters don't work

**FR Coverage:** FR-044

**GitHub Issue:** [#95 If no JavaScript](https://github.com/AngelCrawford/blog/issues/95)

**Acceptance Criteria:**
1. `<noscript>` banner added to header/top of page
2. Banner text: "Some features (filters, heart button) require JavaScript. Content is fully accessible without JS."
3. Banner styled with informational colors (blue background)
4. Banner non-intrusive (dismissible with CSS-only checkbox, no JS)
5. All content readable without JavaScript (progressive enhancement verified)

**Prerequisites:** None

**Dependencies:** None

**Effort:** 0.5 days

---

## Story 9.4: Accessibility Audit & Fixes

**As a** user with disabilities
**I want** full keyboard navigation and screen reader support
**So that** I can access all content

**FR Coverage:** FR-045, FR-046

**Acceptance Criteria:**
1. All interactive elements keyboard-navigable (Tab, Enter, Space, Arrow keys)
2. Focus indicators visible and high-contrast
3. No keyboard traps detected
4. ARIA labels added to all buttons, links, and interactive components
5. Landmark regions defined: header, nav, main, aside, footer
6. Screen reader testing passes (NVDA on Windows, VoiceOver on Mac)
7. Color contrast ratio meets WCAG AA standards (4.5:1 for text, 3:1 for UI)
8. Headings hierarchical (no skipping levels)

**Prerequisites:** All UI components implemented

**Dependencies:** None

**Effort:** 2 days

**Pre-Spec Notes (from prior-story reviews):**
- **Automated WCAG-AA contrast verification for growth-stage colors (from Story 1.2 review, 2026-05-08).** Color values come from the UX spec (verified manually at design time). Include in this audit using axe-core + contrast tooling so the structural Story 1.2 suite gets an automated complement.

---

## Story 9.5: Performance Optimization

**As a** reader
**I want** fast page loads
**So that** I have smooth browsing experience

**FR Coverage:** Implied (non-functional performance requirement)

**Acceptance Criteria:**
1. Lighthouse performance score ≥ 90
2. Image lazy loading implemented for below-fold images
3. PurgeCSS removes unused CSS (production build only)
4. Critical CSS inlined in `<head>`
5. JavaScript deferred or async where possible
6. Resource hints added: preconnect to external domains (fonts, analytics)
7. Minification enabled for HTML, CSS, JS (production build)

**Prerequisites:** None

**Dependencies:** None

**Effort:** 1.5 days

---

## Story 9.6: Withered Content SEO Integration

**As a** content creator
**I want** withered content properly indexed with deprecation signals
**So that** search engines understand content status

**FR Coverage:** FR-006, FR-007

**Acceptance Criteria:**
1. RSS feed includes withered with title suffix: `[Withered Nov 2025]`
2. RSS description prepends deprecation warning
3. Sitemap includes withered with `<lastmod>` = withered_date
4. Sitemap sets `<priority>` to 0.3 for withered (vs 0.8 for evergreen)
5. Withered reason displayed on single page with warning banner
6. Replacement content link (if provided in frontmatter) prominent

**Prerequisites:** Epic 1, Story 1.4

**Dependencies:** None

**Effort:** 1 day

---

## Story 9.7: Twitter-Cards Meta-Tags

**As a** content creator
**I want** Twitter Card meta-tags on every article
**So that** links shared on Twitter/X render with rich previews

**FR Coverage:** FR-042 (extends OG image work in Story 9.1)

**Source:** Restoration of legacy `[params.seo].twitterHandle` + `twitter:*` meta tags from `blog-old` (see `docs/0-discovery/feature-gap-blog-old.md` → Social).

**Acceptance Criteria:**
1. `<meta name="twitter:card" content="summary_large_image">` added to `layouts/_partials/_base/seo.html`
2. `twitter:title`, `twitter:description`, `twitter:image` populated from page params with sensible fallbacks
3. `twitter:site` and `twitter:creator` configurable in `config/_default/params.yaml` via a new `twitterHandle` key (under `params.seo`)
4. Pages without OG image still produce a valid `summary` Twitter card (not `summary_large_image`)
5. Validation: pasting a published article URL into Twitter's Card Validator renders correctly with title, description, image
6. Backwards compatible: existing OpenGraph tags remain unchanged
7. CSP allowlist updated if needed (no new external script — meta tags only)

**Prerequisites:** None (Story 9.1 OG images preferred but not blocking — graceful fallback)

**Dependencies:** None

**Effort:** 0.5 days

---

## Story 9.8: Custom robots.txt and sitemap.xml Templates

**As a** content creator
**I want** custom `robots.txt` and `sitemap.xml` templates
**So that** I can control crawler directives and sitemap content (especially for withered/deprecated pages)

**FR Coverage:** FR-006 (extends Story 9.6 Withered SEO Integration)

**GitHub Issue:** [#170](https://github.com/AngelCrawford/blog/issues/170), [#171](https://github.com/AngelCrawford/blog/issues/171), [#172](https://github.com/AngelCrawford/blog/issues/172) (covered together)

**Source:** Restoration of `blog-old/themes/article/layouts/robots.txt` and `sitemap.xml` (see `docs/0-discovery/feature-gap-blog-old.md` → SEO / Output-Formate).

**Acceptance Criteria:**
1. `layouts/robots.txt` created with: User-agent rules, Sitemap directive (absolute URL), optional Crawl-delay
2. `layouts/sitemap.xml` created with: full URL set, `<lastmod>`, `<changefreq>`, `<priority>` per page type
3. Withered content `<priority>` set to 0.3 (per Story 9.6); evergreen 0.8; default 0.5
4. `robots.txt` excludes draft preview paths and asset internals (`/resources/_gen/`)
5. Sitemap validates against the sitemaps.org schema (XML well-formed, all URLs absolute)
6. `outputs.home`/`outputs.section` config retains XML sitemap output
7. Generated `robots.txt` accessible at `https://article-time.de/robots.txt`

**Prerequisites:** None

**Dependencies:** Story 9.6 (Withered SEO Integration) — completes the SEO trio

**Effort:** 1 day

---

## Story 9.9: Headline-Hash Auto-Anchor

**As a** reader
**I want** clickable anchor links next to article headings
**So that** I can copy a direct link to a specific section

**FR Coverage:** FR-045 (accessibility / usability polish)

**GitHub Issue:** [#60 Headline Anchors](https://github.com/AngelCrawford/blog/issues/60)

**Source:** Restoration of `blog-old/themes/article/layouts/partials/single-pages/headline-hash.html` (see `docs/0-discovery/feature-gap-blog-old.md` → Page-Level Features).

**Acceptance Criteria:**
1. Heading render-hook updated at `layouts/_markup/render-heading.html` to inject anchor `<a>` after `<h2>`/`<h3>`/`<h4>`
2. Anchor uses heading slug as `id` and `href="#slug"`
3. Anchor displays a Remix Icon link/anchor glyph
4. Anchor visually subtle (low opacity), revealed on heading hover via CSS only
5. Anchor accessible (keyboard-focusable, ARIA label "Permalink to section: [heading text]")
6. Optional polish: click-to-copy URL behavior in vanilla JS (no framework dependency)
7. Anchors NOT rendered on `<h1>` (page title) — only `<h2>` through `<h4>`

**Prerequisites:** None

**Dependencies:** None

**Effort:** 0.5 days

**Pre-Spec Notes (from prior-story reviews):**
- **Replace, don't add.** `layouts/_markup/render-heading.html` already exists and injects an anchor `<a class="anchor-link">` with a Remix `links-fill` `<svg class="remix">` after the heading text. The current state is visually broken — no `.anchor-link` / `.remix` CSS exists in `assets/scss/`, so the chain-link glyph renders at the SVG's intrinsic size (oversized, always visible, no opacity/hover behaviour) right next to every `<h2>`/`<h3>` on every page (visible on `/pages/datenschutz/` per 2026-05-09 screenshot review). This story must **replace** the existing markup or add the missing styles — do NOT assume a clean slate. Confirm AC #7 (no anchors on `<h1>`) by adding `{{ if gt $level 1 }}` or similar guard, since the current implementation injects on ALL levels.

---

## Story 9.10: Author-Box with Socials on Single-Page

**As a** reader
**I want** a rich author-box at the end of articles showing the author's bio, avatar, and social links
**So that** I can learn more about the writer and follow them elsewhere

**FR Coverage:** FR-045 (UX polish)

**Source:** Restoration of `blog-old/themes/article/layouts/partials/single-pages/author-box.html` (see `docs/0-discovery/feature-gap-blog-old.md` → Page-Level Features → Author-Box).

**Acceptance Criteria:**
1. Partial created at `layouts/_partials/widgets/author-box.html`
2. Box displays main author: avatar (`params.identity.photo`), name (`params.identity.name`), bio (`params.identity.bio` — long form), social links (`params.identity.socials`). NO taxonomy term lookup — sources are `params.identity` from `config/_default/params.yaml` per [`adr-multi-author-to-coauthor.md`](../2-solutioning/adr-multi-author-to-coauthor.md).
3. Box rendered at end of `layouts/single.html` for articles + logs (after webmentions, before related-articles)
4. Co-author block: if article frontmatter has a `coauthors:` array, render an additional compact block per entry below the main author block — name + optional u-url link only (no avatar, no bio, since co-authors are external IndieWeb identities pointing to their own sites). No collapse/toggle UI — `coauthors` is bounded to small N in practice.
5. Social-icons use Remix Icon glyphs (matching existing icon system)
6. Box hidden if author has no bio AND no socials
7. Box responsive (stacks on mobile)
8. Box accessible (ARIA landmark `<aside>` with label, descriptive link text)

**Prerequisites:** None (uses existing author taxonomy)

**Dependencies:** None

**Effort:** 1 day

---

## Story 9.11: Rich `index.json` — Webmentions Count Field

**As a** search-feature consumer
**I want** each article in `index.json` to include a `webmentionsCount` field
**So that** search results can surface engagement signals alongside textual matches

**FR Coverage:** FR-013 (webmention integration with search index)

**Source:** Partial restoration of legacy rich `index.json` from `blog-old/themes/article/layouts/_default/index.json` (see `docs/0-discovery/feature-gap-blog-old.md` → Such-Index). Legacy `image` and `commentsCount` fields explicitly OUT of scope; `commentsCount` is replaced by `webmentionsCount` because Staticman comments are dropped in favor of webmentions.

**Acceptance Criteria:**
1. `layouts/index.json` (existing search-index template) extended to include `webmentionsCount` per page entry
2. Count derived from `data/webmentions_by_article.json` via permalink lookup; default 0 when no match
3. `webmentionsCount` is an integer summing all webmention types (replies + reposts + mentions + likes)
4. Field present for all article-like content types (articles, logs, links, videos, galleries, portfolio)
5. Build still succeeds when `data/webmentions_by_article.json` is missing (graceful fallback to 0)
6. Existing search-index fields (title, summary, tags, permalink, date) remain untouched

**Prerequisites:** Story 3.2 (Webmention Processing Script) — provides the data source

**Dependencies:** None

**Effort:** 0.5 days

---

## Story 9.12: Social-Follow Icon Row (Header & Footer)

**As a** reader
**I want** small icons in the header and footer linking to the author's social profiles (Mastodon, GitHub, RSS, etc.)
**So that** I can follow the author's content beyond this site

**FR Coverage:** FR-045 (UX polish, navigation)

**Source:** Restoration of `blog-old/themes/article/layouts/partials/social-follow.html` plus the legacy `[[params.social]]`-Array (see `docs/0-discovery/feature-gap-blog-old.md` → Social). New repo currently has only an RSS entry in a `follow`-Block.

**Acceptance Criteria:**
1. `params.social` array (re)structured in `config/_default/params.yaml` with entries per network: `name`, `url`, `icon`, `inHeader: true|false`, `inFooter: true|false`
2. Partial created at `layouts/_partials/social-follow.html` rendering an icon row, filtering entries by a `location` argument (`"header"` or `"footer"`)
3. Header invocation wired: `{{ partial "social-follow.html" (dict "ctx" . "location" "header") }}` in `layouts/_partials/_base/navigation.html` (or hero/header partial)
4. Footer invocation wired: `{{ partial "social-follow.html" (dict "ctx" . "location" "footer") }}` in `layouts/_partials/_base/footer.html`
5. Icons use Remix Icon glyphs (matching existing icon system); fallback to a generic icon if the named glyph is missing
6. External links open in new tab with `rel="noopener noreferrer"` and a descriptive `aria-label` (e.g., "Follow on Mastodon")
7. Existing RSS-only `follow`-Block in footer migrated into the new `params.social` array (no duplicate RSS link)
8. Empty array (or zero entries with the matching location flag) gracefully renders nothing — no empty container

**Prerequisites:** None

**Dependencies:** None

**Effort:** 0.5 days

**Pre-Spec Notes:**
- **Replace/remove the temporary `rel="me"` link in `layouts/_partials/_base/head.html`.** Story 2.3 added `<link rel="me" href="https://github.com/AngelCrawford" />` to the head as a one-line shim required by webmention.io's IndieAuth signup flow (the only `rel="me"` markup site-wide). Story 9.12's `params.social`-driven render replaces this with a structured set (Mastodon, Threads, GitHub, …). When wiring 9.12, **delete** the hardcoded line in `head.html` (and its 6-line preceding comment block) so the only source of `rel="me"` links is the social-follow partial — avoids duplicate GitHub `rel="me"` entries and keeps the IndieAuth identity surface in one place.
- **No orphaned `rel="me"` test to clean up (from Story 2.3 review, 2026-05-09).** Story 2.3's review flagged the absence of an automated `rel="me"`-presence test. Adding one was deliberately deferred because this story removes the shim being tested — a test added at 2.3 would have created churn here. When 9.12 lands and the shim is deleted, no test cleanup is required; the absence is correct. Add a fresh assertion targeting the new `params.social`-driven output if AC coverage demands one.

---

## Story 9.13: Representative h-card in Base Layout

**As a** site owner
**I want** a full h-card microformat in the base layout (rendered site-wide via the footer partial)
**So that** IndieWeb tooling (webmention.io, Bridgy.fed, Mastodon rel="me" verification, indiewebify.me) treats the personal-identity domain as a coherent IndieWeb identity surface

**FR Coverage:** None directly — IndieWeb identity infrastructure that the engagement/POSSE epics depend on. Closest match: FR-011, FR-012 (webmentions assume identity coherence).

**GitHub Issue:** TBD (fits under [#124 IndieWeb](https://github.com/AngelCrawford/blog/issues/124) umbrella).

**Source:** Gap identified in `docs/2-solutioning/adr-domain-migration.md` § Follow-up task. ADR concluded that no existing story (9.2 Schema.org JSON-LD, 9.10 Author-Box on article pages, 9.12 Social-Follow icon row) covers full h-card microformat markup site-wide. Codebase verification on 2026-05-12 confirmed: no h-card markup exists anywhere in the repo. This story is first-time creation, not migration. The blog-side h-card is the artefact that replaces the old profile card on `angel-crawford.de` during the Phase 3 cutover (Story 9.15). Without it, Phase 3 ships an h-card-less site under the personal-identity domain.

**Acceptance Criteria:**
1. h-card markup added to base layout (rendered on every page via footer-partial). Block contains: display name, profile photo, short bio, canonical self-link.
2. Display name marked with `class="p-name"`.
3. Profile photo marked with `class="u-photo"`. NEW ASSET: site currently has no personal avatar — the Article Time clock-logo (`static/images/header/clock_small.webp`) is brand artwork, not a personal photo. A new Angel Crawford avatar must be added (path stored in `params.identity.photo` per AC7). Acceptable interim: a placeholder avatar can be used during implementation if a final photo isn't ready, with a TODO in completion notes to swap to final asset before Story 9.15 cutover.
4. Short bio marked with `class="p-note"`.
5. Canonical self-link rendered as `<a class="u-url" rel="me" href="{{ .Site.BaseURL }}">…</a>`. Phase 1: Hugo resolves to `article-time.de`. Phase 3: after `baseURL` update in Story 9.15, automatically resolves to `angel-crawford.de`. No code-touch in 9.15 required for this link.
6. Markup lives in `layouts/_partials/_base/footer.html` OR a new sub-partial `layouts/_partials/_base/h-card.html` included by the footer. Existing footer "Article Time" identity column (`footer.html` lines 24–34) is the coordination point — extend, wrap, or sit adjacent. Implementer-choice; no visual redesign required.
7. Content (name, bio text, photo path) sourced from `config/_default/params.yaml` (new `params.identity` block with keys: `name`, `photo`, `note`, `url`) — NOT hardcoded in the template.
8. `indiewebify.me` h-card test passes against any page URL during implementation (validates the markup, not the live domain).
9. No CSP changes required (no new external dependencies).

**Prerequisites:** Story 9.16 (Multi-Author Schema Migration) — defines `params.identity` block that this story populates.

**Dependencies:**
- Soft coordination with Story 9.12 (Social-Follow Icon Row). Once 9.12 lands, the `params.social`-driven `rel="me"` silo links should sit INSIDE the h-card wrapper to count as h-card-relative `rel="me"` links. If 9.13 lands before 9.12: implement only the canonical self-link (AC5); the silo `rel="me"` links are added by 9.12 inside the same wrapper.
- Soft coordination with Story 9.10 (Author-Box on article pages). 9.10 renders an author block at article footer (`<aside>`), not site-wide — no direct conflict. If 9.10 ALSO adopts h-card classes for the per-article author, that is valid microformats2 (multiple h-cards per site are allowed).

**Effort:** 0.5 days

**Pre-Spec Notes:**
- **Codebase verification 2026-05-12.** Grep for `h-card|p-name|u-photo|p-note|u-url|h-entry|p-author|microformat` returned no real matches (only Bulma `button.scss` class names and unrelated BMAD tooling). Story is first-time h-card creation, not refactor.
- **Single-author identity surface.** The site-wide h-card identifies the ONE site owner. This story is unaffected by the separate Multi-Author → Co-Author decision (deferred to its own ADR) — per-article co-author markup is a property of the h-entry on article pages (Story 9.10 / 9.2 territory), not of this site-wide h-card.
- **Self-link absolute via `baseURL`, not relative.** AC5 must use `{{ .Site.BaseURL }}`, not `/`. Microformats2 parsers and IndieWeb tooling do resolve relative URLs in most cases, but `rel="me"` round-trip validators have known issues with relative `href` — absolute keeps the verification path robust AND lets Story 9.15's `baseURL` switch carry the domain change automatically.
- **Brand vs. person separation.** The h-card identifies the person (Angel Crawford), not the site brand (currently "Article Time", transitioning to "Angel Crawford" per ADR § Brand Identity Transition). h-card content is sourced from `params.identity` (the person), not from `Site.Title` (the brand). This makes the h-card stable across the brand transition — no AC change required in 9.15. During Phase 1/2 the site brand says "Article Time" while the h-card identifies "Angel Crawford"; this is a tolerated interim mismatch per ADR.

---

## Story 9.14: Domain & Brand Migration Preparation

**As a** site owner
**I want** all preparatory work for the article-time.de → angel-crawford.de cutover AND the "Article Time" → "Angel Crawford" brand transition done BEFORE the cutover window
**So that** Story 9.15 (the actual cutover) is a deterministic execution of pre-staged changes, not live problem-solving under maintenance-mode pressure

**FR Coverage:** None — operational migration story per ADR.

**GitHub Issue:** TBD (fits under [#124 IndieWeb](https://github.com/AngelCrawford/blog/issues/124) umbrella).

**Source:** `docs/2-solutioning/adr-domain-migration.md` § Phase 2 (Cutover Preparation) AND § Brand Identity Transition.

**Acceptance Criteria:**

**Domain track:**
1. **Maintenance-mode parking page prepared.** Static `index.html` written for post-cutover `article-time.de`. Plain HTML, no Hugo, no JS, no external deps. Copy per resolved ADR Open Question #3 (see AC8). File stored per AC7-decision location.
2. **Hardcoded-URL audit.** Sweep the repo for hardcoded `article-time.de` strings; commit inventory to `docs/2-solutioning/adr-domain-migration.md` Implementation Tracking section. Per match: file path, line number(s), whether re-pointing is required at cutover or handled automatically by `baseURL`/`absURL`/`absLangURL`. Inventory must cover at least: `config/_default/config.yaml` (baseURL), `CNAME`, Hugo data files, templates with absolute URLs, content frontmatter with absolute `permalink`/`canonical`, `static/robots.txt`, webmention.io endpoint string in `layouts/_partials/_base/head.html`, and any `static/` HTML referencing `article-time.de`. Inventory must also cover **Umami-bound config**: `params.umami.website_id` and `params.umami.script_url` in `config/_default/params.yaml` (and any environment overrides) — note whether the Umami-Cloud website-Eintrag is being kept (same `website_id`) or replaced (new `website_id` requires config edit). If Story 3.1's `scripts/fetch-umami-hearts.js` has been implemented at audit time, flag its domain-filter parameter (if any) for re-pointing.
3. **Inventory cross-checked against epics-encoded AC URLs.** Stories 2.3 (AC1, AC2), 2.8 (AC1, AC3), 3.2 (AC1), 9.8 (AC7) reference `article-time.de` literally in `epics.md`. Inventory marks these as "epic-doc references — DO NOT edit retroactively; runtime re-pointing in Story 9.15." (See ADR § Consequences > Neutral.)
4. **GitHub Pages custom-domain change procedure documented.** Step-list (and/or screenshots) for `Settings → Pages → Custom domain` on both repos (blog repo AND `angel-crawford.de` profile-card repo) committed to the ADR.
5. **`CNAME` change procedure documented.** Current `CNAME` file location in blog repo recorded; target content (`angel-crawford.de`) noted.

**Brand track:**
6. **Final brand decisions recorded in ADR.** ADR § Brand Identity Transition captures:
   - Final Site Title: exact string (e.g., `Angel Crawford`; optional tagline captured separately if desired).
   - Footer slogan replacement copy: replaces `footer.html` lines 18–19 ("Du willst schreiben…Be a part of Article Time!"). Final wording approved.
   - Logo policy: clock-logo (`static/images/header/clock_small.webp`) replacement or removal decided; replacement asset path identified if applicable.
   - Personal avatar asset for `params.identity.photo` (Story 9.13 AC7): final Angel Crawford photo produced or sourced; path captured.
7. **Profile-card repo decision finalized.** ADR Open Question #1 resolved: archive read-only / delete entirely / repurpose as parking-page source. Decision + rationale recorded; determines parking-page hosting location (AC1).
8. **Parking-page copy approved.** Final wording recorded in ADR (Open Question #3 closed).

**Validation:**
9. **Pre-cutover validation in preview branch.** Build a preview/branch with: new Site Title, new logo (if any), new avatar, `params.identity` fully populated. Run `indiewebify.me` h-card test against the preview URL — confirms brand-transition assets do not break h-card markup from Story 9.13.

**Prerequisites:** Story 9.13 (Representative h-card in Base Layout) — DONE.

**Dependencies:** None.

**Effort:** 0.5–1 days (depending on whether brand-asset creation — new logo/avatar design — happens inside or outside this story; external design work, if needed, is outside-scope time).

**Out of Scope:**
- The cutover itself (Story 9.15).
- Retroactive edits to existing Story-2.x or Story-3.2 ACs in `epics.md` (Story 9.15 re-points them at the code level only).
- DNS work (both domains already resolve via GitHub Pages — per ADR).
- 301 redirect setup (no inbound URLs to preserve — per ADR).

---

## Story 9.15: Domain & Brand Migration Cutover

**As a** site owner
**I want** the blog deployment switched from article-time.de to angel-crawford.de AND the site brand switched from "Article Time" to "Angel Crawford" in one deterministic execution window
**So that** the IndieWeb identity becomes coherent (one domain = one brand = one person) and the old profile-card site is retired in the same act

**FR Coverage:** None — operational migration story per ADR.

**GitHub Issue:** TBD (fits under [#124 IndieWeb](https://github.com/AngelCrawford/blog/issues/124) umbrella).

**Source:** `docs/2-solutioning/adr-domain-migration.md` § Phase 3 AND § Brand Identity Transition.

**Acceptance Criteria:** *(execution order matters — follow numbered sequence)*

**Pre-flight:**
1. **Activate maintenance-mode on blog.** `echo "" > .maintenance && git tag → push` (per README → Maintenance Mode). Verify maintenance page renders on `article-time.de` before proceeding.

**Domain config (single commit):**
2. **Update `baseURL`.** `config/_default/config.yaml` → `baseURL: "https://angel-crawford.de"`.
3. **Update `CNAME` file.** Blog repo top-level `CNAME` → `angel-crawford.de`.

**Brand config (same commit as 2 + 3 is acceptable):**
4. **Update Site Title.** `config/_default/config.yaml` → `title: "Angel Crawford"` (or final string per Story 9.14 AC6).
5. **Replace footer slogan.** `layouts/_partials/_base/footer.html` lines 18–19 ("Du willst schreiben…Be a part of Article Time!") → final copy per 9.14 AC6.
6. **Swap logo asset (if decided in 9.14 AC6).** Replace/remove `static/images/header/clock_small.webp` and any references; ensure new logo path is wired into templates (`footer.html` line 26 and any other usage).
7. **Verify `params.identity` populated.** Story 9.13's `params.identity.photo` must point at final Angel Crawford avatar from 9.14 AC6 (not placeholder).

**Re-point hardcoded `article-time.de` in active code (inventory from 9.14 AC2):**
8. **Apply re-point inventory.** Walk the inventory committed in Story 9.14 AC2 and edit each flagged code location. Specifically (non-exhaustive — full list lives in ADR Implementation Tracking):
   - `layouts/_partials/_base/head.html` — webmention.io endpoint URL (the code instance of Story 2.3 AC1).
   - `scripts/fetch-webmentions.js` (or equivalent) — `domain=article-time.de` curl param (code instance of Story 3.2 AC1, when that story is implemented).
   - Any other code locations flagged by the inventory.
9. **Epic-doc references intentionally untouched.** Story 2.3/2.8/3.2/9.8 ACs in `epics.md` still reference `article-time.de` literally. Per ADR § Consequences > Neutral, this is intentional — `epics.md` is a planning snapshot, not a runtime artifact. Git history is the audit trail; no retroactive edit.

**Deployment switch:**
10. **GitHub Pages custom-domain change (blog repo).** `Settings → Pages → Custom domain` → `angel-crawford.de`. Wait for green "DNS check successful".
11. **Retire old profile-card repo.** Execute the route chosen in Story 9.14 AC7 (archive / delete / repurpose-as-parking-page-source).
12. **Re-register webmention.io endpoint.** Log into webmention.io, register `angel-crawford.de` (new endpoint: `https://webmention.io/angel-crawford.de/webmention`). Update endpoint URL anywhere it's hardcoded post-AC8. Per ADR: dropping `article-time.de` webmention.io history is acceptable (no live mentions to preserve).
13. **Update Bridgy.fed domain verification.** Re-verify Bridgy account against `angel-crawford.de`. Document the new verification artifact (`rel="me"` or webfinger path) in the runbook.

**Engagement-tracking switch:**
14. **Update Umami-Cloud website registration.** Sign into Umami Cloud, locate the `article-time.de` website entry, choose route:
    - **Route A (preferred):** edit the existing website's domain field to `angel-crawford.de`. `website_id` unchanged → no `params.umami.website_id` edit needed.
    - **Route B (if Umami doesn't support domain edit):** create new website for `angel-crawford.de`, capture the new `website_id`, update `params.umami.website_id` in `config/_default/params.yaml` (same commit as AC2/3/4). Archive the old `article-time.de` website (Umami Cloud's "Archive" or equivalent action — do NOT delete; the historical data is the only remaining evidence of Phase-1 traffic).
    Document the chosen route + outcome in the runbook entry.
15. **Verify Umami script tag.** Re-check `params.umami.script_url` against Umami Cloud's currently-served URL (per `feedback_third_party_drift.md` — Umami has silently changed script URLs before). If drift is detected, update in the same commit as AC2/3/4.
16. **Heart-events permalink-prefix split awareness.** Story 3.1's fetch-script does not yet exist (backlog). When it lands, it must handle the case where hearts may exist under two permalink prefixes (`https://article-time.de/...` Phase-1 + `https://angel-crawford.de/...` post-cutover). This is a Story 3.1 implementation concern, NOT a 9.15 AC — Story 3.1 has a Pre-Spec Note covering it. No 9.15 action required.

**Deployment finish:**
17. **Deploy parking page to `article-time.de`.** Whichever GitHub Pages repo serves `article-time.de` now → confirm parking-page `index.html` from Story 9.14 AC1 is live. `article-time.de` shows "moved" copy.

**Post-flight:**
18. **Deactivate maintenance-mode on blog.** Remove `.maintenance` toggle, tag/push per README.
19. **Validation pass:**
    - Mastodon `rel="me"` verification still green on `norden.social/@Angel_Crawford_ftw` (target domain unchanged from Mastodon's side — should be transparent).
    - `indiewebify.me` h-card AND h-entry tests both pass on `https://angel-crawford.de/`.
    - Blog loads at `https://angel-crawford.de/`, returns 200, content renders, h-card self-link `href` is `https://angel-crawford.de/` (auto-resolved from new `baseURL` per Story 9.13 AC5).
    - `https://article-time.de/` returns the parking page.
    - Smoke test: send a test webmention from webmention.rocks targeting an article on `angel-crawford.de` → arrives in webmention.io dashboard within minutes.
    - Umami pageview event from a live page on `https://angel-crawford.de/` registers in Umami Cloud under the new website entry (AC14).
20. **Update ADR status.** `docs/2-solutioning/adr-domain-migration.md` → Status: `Accepted` → `Implemented`, with implementation date.

**Prerequisites:**
- Story 9.13 (Representative h-card in Base Layout) — DONE.
- Story 9.14 (Domain & Brand Migration Preparation) — DONE; all preparatory artifacts in place (parking page, inventory, brand assets, decisions).

**Dependencies:** None — but coordinate with Epic 7 (POSSE) if it's in flight: any Mastodon-API integration must target `angel-crawford.de` post-cutover.

**Effort:** 0.5–1 days (execution window; preparatory work all in Story 9.14).

**Implementation Note:** This is a coordinated execution story, not a code-design story. "Coding" is small (text edits per AC2–8); weight is in the deterministic execution sequence + validation pass at AC16. Recommend low-traffic window (weekend morning German time).

**Out of Scope:**
- 301 redirects from `article-time.de/*` to `angel-crawford.de/*` — per ADR, no inbound links to preserve. If this changes between now and cutover (some external link points at an `article-time.de` URL), the parking page can be enhanced post-cutover with `<meta refresh>` or per-URL redirects.
- `article-time.de` domain registration changes — domain stays registered per ADR § Consequences > Negative.

---

## Story 9.16: Multi-Author Schema Migration → Single + Optional Co-Author

**As a** site owner
**I want** the multi-author taxonomy model retired in favour of a single-author default with optional inline co-author objects
**So that** the data model matches the project reality (single-author digital garden) and the IndieWeb identity story has a single canonical source

**FR Coverage:** None — schema/identity refactor driven by ADR.

**GitHub Issue:** TBD (fits under [#124 IndieWeb](https://github.com/AngelCrawford/blog/issues/124) umbrella).

**Source:** `docs/2-solutioning/adr-multi-author-to-coauthor.md` (Accepted 2026-05-12).

**Acceptance Criteria:** *(all atomic in one PR)*

1. **`params.identity` block defined in `config/_default/params.yaml`** with final shape: `name`, `photo`, `note` (short bio for h-card `p-note`), `bio` (longer paragraph for Author-Box / about page), `url` (leave empty → resolves via `baseURL`), `socials` (array migrated from `content/authors/angel/_index.md`).
2. **`taxonomies.author: authors` removed** from `config/_default/config.yaml`.
3. **`content/authors/` directory deleted** (all three files: `_index.md`, `angel/_index.md`, `jdksaj/_index.md`). No redirects, no backwards compatibility — site is in maintenance mode (per ADR Resolved Open Question #4).
4. **Frontmatter migration** in all four content files:
   - `content/articles/rss-test/index.md`, `content/logs/log-test-2/index.md`, `content/logs/log-testing/index.md`: remove `authors:` line entirely (defaults to `params.identity.name`).
   - `content/articles/test/index.md`: replace `authors: ["jdksaj", "angel"]` with `coauthors:` array — single entry `{name: "HJKHJ Udsanhjs", url: "https://en.wikipedia.org/wiki/Bruce_Willis"}` (preserves the test-render path Angel wants).
5. **`layouts/single.html` line 212 author render block refactored.** Main author rendered from `params.identity` (or `.Params.author` override if set); `coauthors` array (if present) rendered as additional `p-author h-card` blocks per entry (name + optional u-url link).
6. **`layouts/_partials/_base/seo.html` line 111 JSON-LD author field refactored.** Emit single `"author":` key with value = scalar (main author only) OR array (main + coauthors). Structurally impossible to emit duplicate top-level `"author":` keys — incidentally retires Story 9.2's flagged multi-author duplicate-key bug.
7. **`layouts/_partials/_base/footer.html` line 102 copyright refactored.** Fallback chain `or .Site.Params.author.name .Site.Params.default_author_name .Site.Title` collapses to `.Site.Params.identity.name`.
8. **Cleanup:** remove `params.author` and `params.default_author_name` entries from `config/_default/params.yaml` and any environment overrides. Remove any unused `.Site.Params.author.*` references found by grep.
9. **Build-smoke regression check:** existing test suite passes without modification. Any test that asserted on the old schema must be updated as part of this PR.
10. **Documentation:** completion notes record that `/authors/<slug>/` URLs (formerly: `/authors/angel/`, `/authors/jdksaj/`) now return 404. Acceptable per ADR Resolved Open Question #4.

**Prerequisites:** None (Foundation Story).

**Dependencies:** Soft coordination with Story 9.13 (h-card in Base Layout). Story 9.13 has 9.16 as hard prerequisite per ADR. If 9.13 is in flight when 9.16 starts, pause 9.13.

**Effort:** ~1 day.

**Pre-Spec Notes:**
- **Long-form bio on `/about/` is a follow-up content task, NOT in this story's scope.** Create the `content/pages/about.md` file as a separate effort once `params.identity.bio` (short) is in place. Birthdate (`05.02.1987`) and other long-bio context live ONLY in `/about/` per ADR Resolved Open Question #3 — not in `params.identity`.
- **Final logo and avatar assets** are produced/sourced in Story 9.14 (Domain & Brand Migration Preparation). This story can ship `params.identity.photo` with a placeholder path; Story 9.14 swaps in the final asset.
- **Coordination with Story 9.13.** If 9.13's `params.identity` shape (`name`, `photo`, `note`, `url`) was already committed before 9.16 lands, this story EXTENDS that block (`bio`, `socials`); it does not redefine the keys 9.13 introduced.

**Out of Scope:**
- `/about/` page creation (follow-up content task).
- 301 redirects for retired `/authors/*` URLs (ADR-decided: none).
- Story 9.2 implementation (Story 9.2 itself is unchanged; only its Pre-Spec Note is updated to reflect the structural fix).
- Story 9.10 implementation (Story 9.10 ACs are updated in this course-correction; the story itself ships later).

---

# Epic Summary Table

| Epic | Stories | Phase | Duration | FR Count | Effort (Days) |
|------|---------|-------|----------|----------|---------------|
| Epic 1: Growth Stage System | 5 | 1A | Week 3 | 7 | 7 |
| Epic 2: Engagement Infrastructure | 9 | 1A | Week 1-2 | 9 | 10 |
| Epic 3: Popularity Scoring Engine | 6 | 1A | Week 4-5 | 7 | 7 |
| Epic 4: Three-Tier Sorting | 4 | 1A | Week 4-5 | 7 | 6.5 |
| Epic 5: Badge & Filter System | 7 | 1A | Week 6 | 6 | 6.5 |
| Epic 6: History Timeline | 3 | 2 | Week 10 | 3 | 3 |
| Epic 7: POSSE & Advanced Webmentions | 5 | 3 | Week 12-13 | 4 | 8 |
| Epic 8: Format Expansion | 8 | 1B | Week 7-9 | 6 | 11.5 |
| Epic 9: Polish & Optimization | 16 | 2 | Week 10-11 | 10 | 15.5 |
| **TOTAL** | **63** | **All** | **14 weeks** | **52** | **75 days** |

---

## Story Sequencing Notes

**Foundation Stories (No Dependencies):**
- Story 1.1 (Growth Stage Frontmatter)
- Story 2.1 (Umami Integration)
- Story 2.3 (Webmention Setup)
- Story 4.1 (Pinned Content)
- Story 5.7 (Format-Icons via `contains`-Taxonomy)
- Story 9.7 (Twitter-Cards Meta-Tags)
- Story 9.9 (Headline-Hash Auto-Anchor)
- Story 9.10 (Author-Box with Socials)
- Story 9.12 (Social-Follow Icon Row)
- Story 9.16 (Multi-Author Schema Migration)
- All archetype stories (8.1, 8.3, 8.5, 8.7)

**Critical Path:**
Epic 2 → Epic 3 → Epic 4 → Epic 5

**Parallel Tracks:**
- Epic 1 can develop parallel to Epic 2
- Epic 6 can develop parallel to Epic 8
- Epic 7 independent, only needs Epic 2 complete

**Intra-epic chains:**
- Epic 9 Identity-Unification: `9.16 → 9.13 → 9.14 → 9.15` (hard prerequisites; driven by ADRs `adr-domain-migration.md` + `adr-multi-author-to-coauthor.md`). Stories 9.1–9.12 are independent.

**No Forward Dependencies:** Validated - all stories only depend on previous work, never on future stories.

---

## Next Steps

1. ✅ **Epics & Stories defined** - All 48 stories with AC and FR coverage
2. ⏭️ **Create FR traceability matrix** - Map all FRs to stories
3. ⏭️ **Move technical details to architecture** - Clean PRD of HOW, keep WHAT
4. ⏭️ **Re-validate PRD** - Ensure critical failures resolved
5. ⏭️ **Architecture phase** - Design HOW to implement these stories

---

**Document Version:** 1.0
**Last Updated:** 2025-11-14
**Status:** Ready for Sprint Planning
