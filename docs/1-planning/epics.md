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
| Epic 2 | Engagement Infrastructure | 7 | 1A | Week 1-2 | FR-008 to FR-013, FR-047, FR-048, FR-049 |
| Epic 3 | Popularity Scoring Engine | 6 | 1A | Week 4-5 | FR-010, FR-013, FR-018, FR-019, FR-035 to FR-037 |
| Epic 4 | Three-Tier Sorting | 4 | 1A | Week 4-5 | FR-014 to FR-017, FR-020, FR-050, FR-051 |
| Epic 5 | Badge & Filter System | 7 | 1A | Week 6 | FR-003, FR-005, FR-024, FR-025, FR-032, FR-033 |
| Epic 6 | History Timeline | 3 | 2 | Week 10 | FR-021 to FR-023 |
| Epic 7 | POSSE & Advanced Webmentions | 5 | 3 | Week 12-13 | FR-038 to FR-041 |
| Epic 8 | Format Expansion | 8 | 1B | Week 7-9 | FR-028 to FR-033 |
| Epic 9 | Polish & Optimization | 12 | 2 | Week 10-11 | FR-006, FR-007, FR-013, FR-042 to FR-046, FR-048 |

**Total:** 57 stories across 9 epics

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
- **BlogPosting multi-author duplicate-key bug (from Story 1.5 review, 2026-05-09).** `layouts/_partials/_base/seo.html` BlogPosting emits multiple top-level `"author":` keys when an article has multiple authors (duplicate-key JSON; parsers pick last/first inconsistently, Schema.org consumers see only one). Fix: build a `[]` of author objects in the `range`, `jsonify` once.
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

---

## Story 9.10: Author-Box with Socials on Single-Page

**As a** reader
**I want** a rich author-box at the end of articles showing the author's bio, avatar, and social links
**So that** I can learn more about the writer and follow them elsewhere

**FR Coverage:** FR-045 (UX polish)

**Source:** Restoration of `blog-old/themes/article/layouts/partials/single-pages/author-box.html` (see `docs/0-discovery/feature-gap-blog-old.md` → Page-Level Features → Author-Box).

**Acceptance Criteria:**
1. Partial created at `layouts/_partials/widgets/author-box.html`
2. Box displays: avatar, name, bio (from author taxonomy term content), social links from term frontmatter (website, mastodon, github, etc.)
3. Box rendered at end of `layouts/single.html` for articles + logs (after webmentions, before related-articles)
4. Multiple authors: all displayed; if more than 3, collapse with "+N more" toggle
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

---

# Epic Summary Table

| Epic | Stories | Phase | Duration | FR Count | Effort (Days) |
|------|---------|-------|----------|----------|---------------|
| Epic 1: Growth Stage System | 5 | 1A | Week 3 | 7 | 7 |
| Epic 2: Engagement Infrastructure | 7 | 1A | Week 1-2 | 9 | 8 |
| Epic 3: Popularity Scoring Engine | 6 | 1A | Week 4-5 | 7 | 7 |
| Epic 4: Three-Tier Sorting | 4 | 1A | Week 4-5 | 7 | 6.5 |
| Epic 5: Badge & Filter System | 7 | 1A | Week 6 | 6 | 6.5 |
| Epic 6: History Timeline | 3 | 2 | Week 10 | 3 | 3 |
| Epic 7: POSSE & Advanced Webmentions | 5 | 3 | Week 12-13 | 4 | 8 |
| Epic 8: Format Expansion | 8 | 1B | Week 7-9 | 6 | 11.5 |
| Epic 9: Polish & Optimization | 12 | 2 | Week 10-11 | 10 | 12.5 |
| **TOTAL** | **57** | **All** | **14 weeks** | **52** | **70 days** |

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
- All archetype stories (8.1, 8.3, 8.5, 8.7)

**Critical Path:**
Epic 2 → Epic 3 → Epic 4 → Epic 5

**Parallel Tracks:**
- Epic 1 can develop parallel to Epic 2
- Epic 6 can develop parallel to Epic 8
- Epic 7 independent, only needs Epic 2 complete

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
