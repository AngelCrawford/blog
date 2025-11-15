# Digital Garden Integration Architecture

**Project:** Article Time Digital Garden Transformation
**Date:** 2025-11-15
**Architect:** Winston (BMad Method)
**Owner:** Angel Crawford
**Status:** ✅ Ready for Implementation

---

## Executive Summary

This architecture document defines the technical integration strategy for transforming the existing Article Time Hugo blog into a Digital Garden. The architecture extends the current JAMstack foundation with growth stage tracking, three-tier sorting, anonymous engagement (hearts + webmentions), and automated daily rebuilds—all without breaking existing functionality.

**Key Architectural Principles:**
- **Additive Integration:** Zero breaking changes to existing brownfield Hugo blog
- **Privacy-First Engagement:** Anonymous hearts (Umami) + federated webmentions (IndieWeb)
- **Data Branch Strategy:** Separate automated data commits from code/content commits
- **Client-Side Filtering:** Instant filtering without backend queries
- **Hugo-Native Implementation:** Leverage Hugo's built-in querying and templating

**Scope:** 9 epics, 48 user stories implementing Digital Garden transformation features

---

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| **Data Architecture** | Separate `data-updates` branch for automated commits | - | Epic 2, 3, 4 | Clean main branch, preserves data history, follows PRD specification |
| **Build & Deployment** | Single GitHub Actions workflow (fetch → process → build → deploy) | - | Epic 2, 3, 4 | Atomic operation, simpler debugging, daily cron at 2 AM UTC |
| **API Integration** | Umami Cloud (Bearer auth) + webmention.io (public API) | Node.js 20.x | Epic 2, 3 | Standard REST patterns, secure token management, no auth needed for webmentions |
| **Popularity Scoring** | Calculate in Hugo partial (`popularity-score.html`) | - | Epic 3, 4 | Simpler architecture, fewer scripts, keeps logic in templates |
| **Three-Tier Sorting** | Hugo template queries in `home.html` | - | Epic 4, 5 | Leverages Hugo's native querying, clear structure, easy to debug |
| **Client-Side Filtering** | Vanilla JavaScript with `data-*` attributes | ES2020+ | Epic 5 | No dependencies, aligns with jQuery removal goal, URL state management |
| **Frontmatter Schema** | Add `growth_stage`, `format`, `pinned` fields | - | Epic 1, 4, 5, 8 | Backwards compatible with defaults, simple extensions |
| **Growth Stage Colors** | SCSS variables (seedling/budding/evergreen/withered) | - | Epic 1, 5 | Defined by UX spec, WCAG AA compliant, semantic color system |
| **Component Extension** | Growth badge in card footer (not top corner) | - | Epic 1, 5 | Avoids conflicts with existing badges, additive only |
| **Data Files** | JSON format: `umami_hearts.json`, `webmentions_by_article.json` | - | Epic 2, 3 | Simple structure, easy Hugo data file access |
| **Node.js Scripts** | 3 modular scripts (fetch-umami, fetch-webmentions, process-webmentions) | Node.js 20.x LTS | Epic 2 | Single responsibility, testable independently |
| **Hugo Version** | Pinned to v0.152.2 Extended | 0.152.2 | All epics | Matches production, prevents breaking changes |
| **Deployment** | GitHub Pages with `peaceiris/actions-gh-pages@v3` | v3 | Epic 2, 4 | Existing setup, CNAME: article-time.de |

---

## Project Structure

```
blog/
├── .github/
│   └── workflows/
│       └── daily-rebuild.yml          # NEW: Daily data fetch, build, deploy
│
├── .bmad/                             # EXISTING: BMad Method workflows
│
├── archetypes/
│   ├── articles/index.md              # MODIFY: Add growth_stage, format fields
│   ├── logs/index.md                  # MODIFY: Add growth_stage, format fields
│   ├── links/index.md                 # NEW: Epic 8 - Link format archetype
│   ├── videos/index.md                # NEW: Epic 8 - Video format archetype
│   ├── galleries/index.md             # NEW: Epic 8 - Gallery format archetype
│   └── portfolio/index.md             # NEW: Epic 8 - Portfolio format archetype
│
├── assets/
│   ├── js/
│   │   ├── filter.js                  # NEW: Epic 5 - Client-side filtering logic
│   │   ├── hearts.js                  # NEW: Epic 2 - Heart button click tracking
│   │   ├── main.js                    # EXISTING: Core UI (back-to-top, footer reveal)
│   │   ├── search.js                  # EXISTING: Client-side search
│   │   ├── header.js                  # EXISTING: Dynamic header
│   │   ├── navbar.js                  # EXISTING: Mobile navigation
│   │   ├── gdpr.js                    # EXISTING: Cookie consent
│   │   ├── firework.js                # EXISTING: Special effects
│   │   └── suncalc.js                 # EXISTING: Sunrise/sunset calculations
│   │
│   └── scss/
│       ├── main.scss                  # EXISTING: Entry point
│       ├── vars/
│       │   ├── _colors.scss           # MODIFY: Add growth stage color variables
│       │   └── ...                    # EXISTING: Other variables
│       ├── src/bulma/                 # EXISTING: Bulma framework
│       ├── base/                      # EXISTING: Base component styles
│       ├── elements/
│       │   ├── growth-badge.scss      # NEW: Epic 1 - Growth stage badge component
│       │   ├── filter-bar.scss        # NEW: Epic 5 - Filter UI component
│       │   ├── engagement.scss        # NEW: Epic 2 - Heart button styles
│       │   ├── webmentions.scss       # NEW: Epic 2 - Webmention display styles
│       │   ├── badge.scss             # EXISTING: New/Visited badges
│       │   ├── ribbon.scss            # EXISTING: Category ribbons
│       │   └── ...                    # EXISTING: Other elements
│       └── layout/
│           ├── card.scss              # MODIFY: Epic 1 - Add growth badge slot in footer
│           ├── widgets.scss           # MODIFY: Epic 6 - Add timeline widget variant
│           └── ...                    # EXISTING: Other layouts
│
├── config/
│   └── _default/
│       ├── config.yaml                # EXISTING: Main config
│       └── params.yaml                # MODIFY: Add digital_garden section
│
├── content/
│   ├── articles/                      # EXISTING: Update frontmatter with growth_stage, format
│   ├── logs/                          # EXISTING: Update frontmatter with growth_stage, format
│   ├── links/                         # NEW: Epic 8 - Link content type
│   ├── videos/                        # NEW: Epic 8 - Video content type
│   ├── galleries/                     # NEW: Epic 8 - Gallery content type
│   ├── portfolio/                     # NEW: Epic 8 - Portfolio content type
│   └── pages/                         # EXISTING: Static pages
│
├── data/
│   ├── umami_hearts.json              # NEW: Epic 2 - Generated daily (not committed to main)
│   ├── webmentions_raw.json           # NEW: Epic 2 - Generated daily (not committed to main)
│   └── webmentions_by_article.json    # NEW: Epic 2 - Generated daily (not committed to main)
│
├── docs/                              # EXISTING: BMad Method documentation
│   ├── 0-discovery/                   # Project overview, brainstorming, research
│   ├── 1-planning/                    # PRD, UX spec, epics
│   ├── 2-solutioning/                 # Architecture (this document)
│   └── bmm-workflow-status.yaml       # Workflow tracking
│
├── layouts/
│   ├── _default/
│   │   ├── baseof.html                # EXISTING: Base template
│   │   ├── home.html                  # MODIFY: Epic 4 - Three-tier sorting logic
│   │   ├── list.html                  # EXISTING: List pages
│   │   └── single.html                # MODIFY: Epic 2, 6 - Add hearts, webmentions, timeline
│   │
│   ├── _partials/
│   │   ├── _base/                     # EXISTING: Head, nav, footer, hero, seo
│   │   ├── widgets/                   # EXISTING: Pagination, series, archive
│   │   ├── card.html                  # MODIFY: Epic 1, 5 - Growth badge + data attributes
│   │   ├── popularity-score.html      # NEW: Epic 3 - Popularity calculation partial
│   │   ├── filter-bar.html            # NEW: Epic 5 - Filter UI partial
│   │   ├── growth-badge.html          # NEW: Epic 1 - Growth badge component partial
│   │   ├── heart-button.html          # NEW: Epic 2 - Heart button partial
│   │   ├── webmentions.html           # NEW: Epic 2 - Webmention display partial
│   │   └── timeline-widget.html       # NEW: Epic 6 - History timeline widget partial
│   │
│   ├── _markup/                       # EXISTING: Render hooks (images, links, headings)
│   └── shortcodes/                    # EXISTING: Message, rating, tags, youtube
│
├── scripts/
│   ├── fetch-umami-hearts.js          # NEW: Epic 2 - Fetch heart counts from Umami API
│   ├── fetch-webmentions.js           # NEW: Epic 2 - Fetch webmentions from webmention.io
│   ├── process-webmentions.js         # NEW: Epic 2 - Group webmentions by article URL
│   └── posse-mastodon.js              # NEW: Epic 7 (Phase 3) - POSSE to Mastodon
│
├── static/
│   └── fonts/
│       └── remixicon/                 # EXISTING: Add growth stage icons (seedling, plant, tree, skull)
│
├── package.json                       # MODIFY: Add script dependencies (node-fetch, dotenv)
└── README.md                          # EXISTING: Project documentation
```

---

## Epic to Architecture Mapping

| Epic | Components | File Locations | Dependencies |
|------|------------|----------------|--------------|
| **Epic 1: Growth Stage System** | Frontmatter fields, SCSS colors, badge component, card footer | `archetypes/*/index.md`, `vars/_colors.scss`, `elements/growth-badge.scss`, `_partials/growth-badge.html`, `layout/card.scss` | Hugo, Bulma, Remix Icon |
| **Epic 2: Engagement Infrastructure** | Umami integration, webmention.io, scripts, data files, heart button, webmention display | `scripts/fetch-*.js`, `scripts/process-*.js`, `data/*.json`, `assets/js/hearts.js`, `elements/engagement.scss`, `elements/webmentions.scss`, `_partials/heart-button.html`, `_partials/webmentions.html` | Node.js 20.x, Umami Cloud API, webmention.io API |
| **Epic 3: Popularity Scoring Engine** | Popularity calculation partial | `_partials/popularity-score.html` | Depends on Epic 2 data files |
| **Epic 4: Three-Tier Sorting** | Homepage template logic, tier sections | `layouts/_default/home.html` | Depends on Epic 3 (popularity scoring) |
| **Epic 5: Badge & Filter System** | Filter UI, filter JavaScript, badge display | `elements/filter-bar.scss`, `assets/js/filter.js`, `_partials/filter-bar.html` | Vanilla JavaScript ES2020+ |
| **Epic 6: History Timeline** | Timeline widget, frontmatter schema | `_partials/timeline-widget.html`, `layout/widgets.scss`, frontmatter `growth_stage_history` | Hugo template logic |
| **Epic 7: POSSE & Advanced Webmentions** | Mastodon posting script (Phase 3) | `scripts/posse-mastodon.js`, `.github/workflows/daily-rebuild.yml` | Mastodon API, GitHub Secrets |
| **Epic 8: Format Expansion** | New archetypes, content folders, format icons | `archetypes/links/`, `archetypes/videos/`, `archetypes/galleries/`, `archetypes/portfolio/`, `content/links/`, etc. | Hugo archetypes, Remix Icon |
| **Epic 9: Polish & Optimization** | CSS optimization, accessibility, performance | PostCSS, PurgeCSS, WCAG audit tools | Existing build tooling |

---

## Technology Stack Details

### Core Technologies

| Category | Technology | Version | Purpose | Status |
|----------|-----------|---------|---------|--------|
| **Static Site Generator** | Hugo Extended | v0.152.2 (pinned) | Build system, templating, asset pipeline | EXISTING |
| **CSS Framework** | Bulma | v1.0.4 | Responsive design system | EXISTING |
| **CSS Preprocessor** | SCSS/Sass | Built-in Hugo | Style authoring | EXISTING |
| **CSS Optimization** | PostCSS + PurgeCSS | v7.0.2 | Production CSS minification | EXISTING |
| **JavaScript Runtime** | Node.js | v20.x LTS | Script execution for data fetching | NEW |
| **Package Manager** | npm | v10+ | Dependency management | EXISTING |
| **Icon Library** | Remix Icon | v4.x | Icon system (SVG sprites) | EXISTING |
| **Typography** | Google Fonts (Montserrat) | - | Font family | EXISTING |
| **Version Control** | Git | v2+ | Source control | EXISTING |

### New Integrations

| Service | Purpose | API Version | Authentication | Cost |
|---------|---------|-------------|----------------|------|
| **Umami Cloud** | Anonymous heart tracking, analytics | Umami API v1 | Bearer token (API key) | FREE (Hobby plan) |
| **webmention.io** | Federated webmention receiving | webmention.io API | None (public API) | FREE |
| **GitHub Actions** | Daily rebuild automation | - | GitHub token (automatic) | FREE (public repos) |
| **GitHub Pages** | Static site hosting | - | GitHub token (automatic) | FREE |

### Development Tools

- **Primary Editor:** Windsurf (existing)
- **Image Editing:** GIMP (raster), Inkscape (vector)
- **Platform:** Windows (primary), cross-platform compatible

---

## Integration Points

### External API Integration

**1. Umami Cloud API**

```javascript
// scripts/fetch-umami-hearts.js
const UMAMI_API_URL = 'https://cloud.umami.is/api';
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;
const UMAMI_API_KEY = process.env.UMAMI_API_KEY;

const response = await fetch(`${UMAMI_API_URL}/websites/${UMAMI_WEBSITE_ID}/stats`, {
  headers: {
    'Authorization': `Bearer ${UMAMI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
// Output: data/umami_hearts.json
```

**Authentication:** Bearer token via GitHub Secrets
**Rate Limits:** Not documented (Free tier)
**Retry Strategy:** Fail workflow on error (manual retry)

**2. webmention.io API**

```javascript
// scripts/fetch-webmentions.js
const DOMAIN = 'article-time.de';
const API_URL = 'https://webmention.io/api/mentions.jf2';

const response = await fetch(`${API_URL}?domain=${DOMAIN}&per-page=999`);
const data = await response.json();
// Output: data/webmentions_raw.json
```

**Authentication:** None required (public API)
**Rate Limits:** Generous (no documented limits)
**Pagination:** Use `per-page=999` to get all mentions

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                Daily Rebuild Data Flow                       │
└─────────────────────────────────────────────────────────────┘

External Services              GitHub Repository
┌──────────────┐              ┌─────────────────────┐
│ Umami Cloud  │──API Fetch──>│   main branch       │
│ (Heart data) │              │   - Code/Content    │
└──────────────┘              │   - Layouts         │
                              └─────────────────────┘
┌──────────────┐                       │
│ Webmention   │──API Fetch──>┌────────▼─────────────┐
│    .io       │              │  data-updates branch │
│ (Mentions)   │              │  - *.json files      │
└──────────────┘              └──────┬───────────────┘
                                     │
               ┌─────────────────────▼────────────────┐
               │   GitHub Actions (Daily 2 AM UTC)    │
               │  1. Fetch Umami hearts               │
               │  2. Fetch webmentions                │
               │  3. Process webmentions (group)      │
               │  4. Commit to data-updates branch    │
               │  5. Copy data to workspace (temp)    │
               │  6. Build Hugo with data files       │
               │  7. Deploy to GitHub Pages           │
               └───────────────┬──────────────────────┘
                               │
                               ▼
               ┌─────────────────────────────────┐
               │       GitHub Pages              │
               │  - article-time.de              │
               │  - HTTPS (Let's Encrypt)        │
               └────────────┬────────────────────┘
                            │
                            ▼
               ┌─────────────────────────────────┐
               │         Users                   │
               │  - Browse, filter               │
               │  - Click hearts                 │
               │  - Send webmentions             │
               └─────────────────────────────────┘
```

### Hugo Data File Integration

Hugo reads JSON files from `data/` directory:

```hugo
<!-- Access in templates -->
{{ $hearts := .Site.Data.umami_hearts }}
{{ $webmentions := .Site.Data.webmentions_by_article }}

<!-- Lookup by permalink -->
{{ $myHearts := index $hearts .RelPermalink | default 0 }}
{{ $myMentions := index $webmentions .RelPermalink | default (slice) }}
```

---

## Novel Architectural Patterns

### Pattern 1: Three-Tier Hybrid Sorting Algorithm

**Purpose:** Combine manual curation (pinned) + time-based freshness (grace period) + quality-based popularity (established) in a single homepage view.

**Problem Solved:** Traditional blogs show only newest content. Digital gardens need to surface quality content regardless of age while still rewarding updates.

**Components:**
1. **Pinned Tier** - Manual curation slot (max 3)
2. **Grace Period Tier** - Time-based visibility boost (28 days)
3. **Established Tier** - Popularity-based long-tail discovery

**Implementation:**

```hugo
<!-- layouts/_default/home.html -->
{{ define "main" }}
  {{ $graceCutoff := now.AddDate 0 0 -28 }}

  <!-- Tier 1: Pinned (Manual Curation) -->
  {{ $pinned := where .Site.RegularPages "Params.pinned" true }}
  {{ $pinned = $pinned | first 3 }}

  <!-- Tier 2: Grace Period (Freshness Boost) -->
  {{ $inGrace := where .Site.RegularPages ".Lastmod" "ge" $graceCutoff }}
  {{ $inGrace = where $inGrace "Params.growth_stage" "ne" "withered" }}
  {{ $inGrace = where $inGrace "Params.pinned" "ne" true }}

  <!-- Split by popularity score threshold -->
  {{ $earlyPromoted := slice }}
  {{ $regular := slice }}
  {{ range $inGrace }}
    {{ $score := partial "popularity-score.html" . }}
    {{ if ge $score 20 }}
      {{ $earlyPromoted = $earlyPromoted | append (dict "page" . "score" $score) }}
    {{ else }}
      {{ $regular = $regular | append . }}
    {{ end }}
  {{ end }}

  <!-- Sort early promoted by score DESC -->
  {{ $earlyPromoted = sort $earlyPromoted "score" "desc" }}

  <!-- Sort regular by date DESC -->
  {{ $regular = $regular.ByLastmod.Reverse }}

  <!-- Tier 3: Established (Popularity-Based) -->
  {{ $established := where .Site.RegularPages ".Lastmod" "lt" $graceCutoff }}
  {{ $established = where $established "Params.growth_stage" "ne" "withered" }}
  {{ $established = where $established "Params.pinned" "ne" true }}

  <!-- Calculate and sort by popularity score -->
  {{ $establishedScored := slice }}
  {{ range $established }}
    {{ $score := partial "popularity-score.html" . }}
    {{ $establishedScored = $establishedScored | append (dict "page" . "score" $score) }}
  {{ end }}
  {{ $establishedScored = sort $establishedScored "score" "desc" }}

  <!-- Render tiers -->
  <section class="tier-pinned">
    <h2>📍 Pinned</h2>
    {{ range $pinned }}
      {{ partial "card.html" . }}
    {{ end }}
  </section>

  <section class="tier-grace">
    <h2>🌱 Recently Tended</h2>
    <div class="subsection-early-promoted">
      <h3>⭐ Early Promoted (20+ points)</h3>
      {{ range $earlyPromoted }}
        {{ partial "card.html" .page }}
      {{ end }}
    </div>
    <div class="subsection-regular">
      <h3>📅 Regular</h3>
      {{ range $regular }}
        {{ partial "card.html" . }}
      {{ end }}
    </div>
  </section>

  <section class="tier-established">
    <h2>🌳 Established Garden</h2>
    {{ range $establishedScored }}
      {{ partial "card.html" .page }}
    {{ end }}
  </section>
{{ end }}
```

**Edge Cases:**
- If >3 pinned articles exist: Take most recent 3
- If article is pinned AND in grace period: Show in Tier 1 only (no duplication)
- Withered content: Excluded from all tiers (requires explicit filter opt-in)

**Affected Epics:** Epic 4 (Three-Tier Sorting)

---

### Pattern 2: Dual Anonymous Engagement System

**Purpose:** Combine anonymous engagement (hearts) with federated social engagement (webmentions) in a privacy-first, GDPR-compliant way.

**Problem Solved:** Traditional analytics require cookies/tracking. Social engagement is siloed on platforms. This pattern enables engagement without surveillance while connecting to the IndieWeb.

**Components:**
1. **Anonymous Hearts** - Umami event tracking (no cookies)
2. **Federated Webmentions** - IndieWeb protocol (cross-site replies)
3. **Daily Aggregation** - Server-side data consolidation
4. **Popularity Scoring** - Combined signal for content quality

**Data Flow:**

```
User Click → Umami Event → Daily Fetch → JSON → Hugo Build → Display

User Reply on Mastodon → Bridgy → webmention.io → Daily Fetch → JSON → Hugo Build → Display
```

**Implementation:**

**Client-Side (Heart Button):**

```javascript
// assets/js/hearts.js
document.addEventListener('DOMContentLoaded', () => {
  const heartButtons = document.querySelectorAll('.heart-btn');

  heartButtons.forEach(button => {
    const articleUrl = button.dataset.articleId;
    const storageKey = `hearted-${articleUrl}`;

    // Check if already hearted
    if (localStorage.getItem(storageKey)) {
      button.classList.add('hearted');
      button.disabled = true;
    }

    button.addEventListener('click', async () => {
      // Send Umami event
      if (window.umami) {
        umami.track('heart', { article: articleUrl });
      }

      // Optimistic UI update
      const countSpan = button.querySelector('.heart-count');
      countSpan.textContent = parseInt(countSpan.textContent) + 1;
      button.classList.add('hearted');
      button.disabled = true;

      // Prevent duplicate hearts
      localStorage.setItem(storageKey, 'true');
    });
  });
});
```

**Server-Side (GitHub Actions):**

```yaml
# .github/workflows/daily-rebuild.yml
name: Daily Rebuild with Engagement Data

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
  workflow_dispatch:

jobs:
  fetch-build-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout main
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.152.2'
          extended: true

      - name: Install dependencies
        run: npm ci

      - name: Fetch engagement data
        env:
          UMAMI_API_KEY: ${{ secrets.UMAMI_API_KEY }}
          UMAMI_WEBSITE_ID: ${{ secrets.UMAMI_WEBSITE_ID }}
        run: |
          node scripts/fetch-umami-hearts.js
          node scripts/fetch-webmentions.js
          node scripts/process-webmentions.js

      - name: Commit to data-updates branch
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"
          git checkout -B data-updates
          git add data/*.json
          git commit -m "chore: update engagement data $(date +%Y-%m-%d) [skip ci]" || echo "No changes"
          git push origin data-updates --force
          git checkout main

      - name: Copy data from data-updates (temporary)
        run: |
          git fetch origin data-updates
          git checkout origin/data-updates -- data/

      - name: Build Hugo site
        run: hugo --environment production --minify

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          cname: article-time.de
```

**Hugo Template (Popularity Score):**

```hugo
<!-- layouts/_partials/popularity-score.html -->
{{ $hearts := index .Site.Data.umami_hearts .RelPermalink | default 0 }}
{{ $webmentions := index .Site.Data.webmentions_by_article .RelPermalink | default (slice) | len }}
{{ $weight := .Params.weight | default 0 }}

{{ $score := add (mul $hearts 1) (add (mul $webmentions 3) (mul $weight 2)) }}
{{ return $score }}
```

**Edge Cases:**
- API failures: Workflow fails, no stale data used (fail-fast approach)
- Missing data files: Hugo templates use `| default` to handle gracefully
- Duplicate hearts: LocalStorage prevents (per-browser, not perfect but acceptable)

**Affected Epics:** Epic 2 (Engagement Infrastructure), Epic 3 (Popularity Scoring)

---

## Implementation Patterns

### Naming Conventions

**All AI agents MUST follow these naming rules:**

**Components & Templates:**
- Hugo partials: PascalCase (e.g., `GrowthBadge.html`, `PopularityScore.html`)
- SCSS files: kebab-case (e.g., `growth-badge.scss`, `filter-bar.scss`)
- JavaScript files: kebab-case (e.g., `filter.js`, `hearts.js`)

**Data & Configuration:**
- Data files: snake_case (e.g., `umami_hearts.json`, `webmentions_by_article.json`)
- Frontmatter fields: snake_case (e.g., `growth_stage`, `last_significant_update`, `pinned`)
- Config parameters: snake_case (e.g., `grace_period_days`, `enable_hearts`)

**CSS:**
- Classes: kebab-case (e.g., `.card-footer-item`, `.growth-stage`, `.filter-btn`)
- BEM when needed: `.block__element--modifier`
- Data attributes: kebab-case (e.g., `data-growth-stage`, `data-article-id`)

**JavaScript:**
- Variables: camelCase (e.g., `articleUrl`, `heartCount`)
- Functions: camelCase (e.g., `filterCards`, `updateCount`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `UMAMI_API_URL`, `GRACE_PERIOD_DAYS`)

### File Organization

**Tests:**
- Co-located with scripts: `fetch-umami-hearts.test.js` (same directory as `fetch-umami-hearts.js`)
- Test data fixtures: `scripts/__fixtures__/` directory

**Partials:**
- By function, not by feature: `_partials/growth-badge.html` (not `_partials/growth-stage/badge.html`)
- Flat structure preferred over deep nesting

**SCSS:**
- By type: `elements/` for components, `layout/` for compositions
- One component per file
- Import in `main.scss` in logical order (vars → base → elements → layout)

**Scripts:**
- Root `scripts/` directory
- One script per responsibility
- No subdirectories unless >10 scripts

### Code Organization Patterns

**Hugo Template Partials:**

```hugo
<!-- CORRECT: Reusable partial with clear input/output -->
{{ $score := partial "popularity-score.html" . }}

<!-- INCORRECT: Inline calculation duplicated everywhere -->
{{ $score := add (mul $hearts 1) ... }}
```

**SCSS Component Structure:**

```scss
// elements/growth-badge.scss
.card-footer-item.growth-stage {
  // Base styles
  color: $light;
  font-size: 80%;

  // Icon styles
  i {
    font-size: 1.2em;
    line-height: 1;
  }

  // Stage-specific colors (BEM-ish)
  &[data-stage="seedling"] {
    i { color: $growth-seedling; }
  }

  &[data-stage="budding"] {
    i { color: $growth-budding; }
  }

  // Responsive
  @include helpers.mobile {
    span { display: none; } // Icon-only on mobile
  }
}
```

**JavaScript Module Pattern:**

```javascript
// filter.js - IIFE to avoid global pollution
(function() {
  'use strict';

  // Private variables
  let currentStage = 'all';
  let currentFormat = 'all';

  // Private functions
  function filterCards(stage, format) {
    // Implementation
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Setup event listeners
  }
})();
```

### Error Handling

**Hugo Build Errors:**
- Workflow fails immediately (default behavior)
- No partial builds deployed
- Error logs available in GitHub Actions

**API Fetch Errors:**
```javascript
// scripts/fetch-umami-hearts.js
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Umami API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  await fs.writeFile('data/umami_hearts.json', JSON.stringify(data, null, 2));
} catch (error) {
  console.error('Failed to fetch Umami hearts:', error.message);
  process.exit(1); // Fail workflow
}
```

**Missing Data Files (Hugo):**
```hugo
<!-- Always use | default for data file access -->
{{ $hearts := index .Site.Data.umami_hearts .RelPermalink | default 0 }}
{{ $webmentions := index .Site.Data.webmentions_by_article .RelPermalink | default (slice) }}

<!-- Never assume data exists -->
{{ if .Site.Data.umami_hearts }}
  <!-- Safe to proceed -->
{{ else }}
  <!-- Graceful fallback -->
{{ end }}
```

**Client-Side JavaScript Errors:**
```javascript
// hearts.js - Non-blocking errors
try {
  if (window.umami) {
    umami.track('heart', { article: articleUrl });
  }
} catch (error) {
  console.warn('Failed to track heart:', error);
  // Continue anyway - don't break UX
}
```

### Logging Strategy

**GitHub Actions:**
- All script output automatically captured
- Use descriptive `console.log()` messages
- Prefix with context: `console.log('[fetch-umami] Successfully fetched hearts')`

**Client-Side JavaScript:**
- Development: `console.log()` for debugging
- Production: Can be stripped (not critical for static site)
- Errors: Always `console.error()` for issues

**Hugo Build:**
- Hugo's built-in logging (verbose with `--verbose` flag)
- No custom logging needed

### Consistency Rules

**Date/Time Handling:**
- Always use ISO 8601 format: `2025-11-15T10:00:00+01:00`
- Hugo: Use `.Date`, `.Lastmod` with `dateFormat` function
- JavaScript: Use `new Date().toISOString()`
- Display: Use Hugo's `dateFormat "Jan 2, 2006"` for human-readable

**Permalinks:**
- Always include trailing slash: `/articles/my-post/` (not `/articles/my-post`)
- Hugo config: `permalinks: articles: /articles/:filename/`

**Data Formats:**
- API responses: Always JSON
- Process raw data into structured JSON
- Store both raw (`*_raw.json`) and processed (`*_by_article.json`) when useful

**Icon Usage:**
- Always use Remix Icon `-line` style (not `-fill`) for consistency
- Exception: Filled variant for active/selected states (e.g., `ri-heart-fill` when clicked)

**CRITICAL AGENT RULES:**

1. **NEVER modify existing card variants** (`.is-horizontal`, `.is-log`, `.has-image`, etc.)
2. **ALWAYS add new features to card footer** (not top, sides, or overlays)
3. **NEVER commit data/*.json files to main branch** (only to data-updates branch)
4. **ALWAYS use the `popularity-score.html` partial** (don't recalculate score inline)
5. **NEVER use jQuery** (use vanilla JavaScript for all new features)
6. **ALWAYS add `| default` when accessing data files** (graceful fallback)
7. **ALWAYS pin Hugo version in GitHub Actions** (use `hugo-version: '0.152.2'`)

---

## Data Architecture

### Data Models

**Frontmatter Schema:**

```yaml
---
# EXISTING REQUIRED FIELDS
title: "Article Title"
date: 2025-11-15T10:00:00+01:00
author: "angel"
categories: ["category-name"]
tags: ["tag1", "tag2"]
draft: false

# NEW REQUIRED FIELDS
growth_stage: "seedling"  # seedling | budding | evergreen | withered
format: "article"          # article | log | link | video | gallery | portfolio

# NEW OPTIONAL FIELDS
pinned: false              # true for top 3 homepage pins (max 3 total)
last_significant_update: 2025-11-15  # Date of last major update (triggers grace period)

# Growth stage history (optional)
growth_stage_history:
  - date: 2025-11-15
    stage: seedling
    note: "Initial planting"
  - date: 2025-12-01
    stage: budding
    note: "Added examples and refined structure"

# Manual weight for popularity boost (1-10 scale)
weight: 5  # Default: 0

# Withered metadata (if applicable)
withered_date: 2026-01-15     # When marked as withered
withered_reason: "Framework deprecated, see new article"
replacement_url: "/articles/new-version/"  # Link to replacement content
---
```

**Default Values:**
- `growth_stage`: `"seedling"` (if missing)
- `format`: `"article"` (if missing)
- `pinned`: `false` (if missing)
- `weight`: `0` (if missing)

**Validation:**
- Hugo will fail build if `growth_stage` has invalid value (not one of 4 options)
- Format field should match archetype (article/log/link/video/gallery/portfolio)

### JSON Data Files

**1. umami_hearts.json** (Generated daily)

```json
{
  "/articles/digital-garden-transformation/": 42,
  "/articles/hugo-tips-and-tricks/": 17,
  "/logs/week-45-2025/": 3
}
```

- Key: Article permalink (with trailing slash)
- Value: Aggregated heart count (integer)

**2. webmentions_raw.json** (Generated daily)

```json
{
  "children": [
    {
      "type": "entry",
      "author": {
        "type": "card",
        "name": "Jane Doe",
        "photo": "https://example.com/avatar.jpg",
        "url": "https://example.com"
      },
      "url": "https://example.com/reply/123",
      "published": "2025-11-15T10:00:00Z",
      "wm-received": "2025-11-15T10:05:00Z",
      "wm-id": 12345,
      "wm-source": "https://example.com/reply/123",
      "wm-target": "https://article-time.de/articles/my-post/",
      "wm-property": "in-reply-to",
      "content": {
        "text": "Great post!",
        "html": "<p>Great post!</p>"
      }
    }
  ]
}
```

**3. webmentions_by_article.json** (Processed daily)

```json
{
  "/articles/my-post/": [
    {
      "type": "like",
      "author": "Jane Doe",
      "author_url": "https://example.com",
      "author_photo": "https://example.com/avatar.jpg",
      "url": "https://example.com/like/123",
      "published": "2025-11-15T10:00:00Z"
    },
    {
      "type": "reply",
      "author": "Bob Smith",
      "author_url": "https://mastodon.social/@bob",
      "author_photo": "https://mastodon.social/avatar.jpg",
      "content": "Great post!",
      "url": "https://mastodon.social/@bob/12345",
      "published": "2025-11-15T11:30:00Z"
    },
    {
      "type": "repost",
      "author": "Alice Chen",
      "author_url": "https://micro.blog/alice",
      "url": "https://micro.blog/alice/repost/456",
      "published": "2025-11-15T12:00:00Z"
    }
  ]
}
```

### Data Relationships

```
Article (Content)
  ├── has frontmatter fields
  │   ├── growth_stage → determines badge display
  │   ├── format → determines archetype and layout
  │   ├── pinned → determines Tier 1 placement
  │   ├── lastmod → determines Grace Period (Tier 2)
  │   └── weight → contributes to popularity score
  │
  ├── has hearts (via permalink lookup)
  │   └── umami_hearts.json[permalink] → integer
  │
  ├── has webmentions (via permalink lookup)
  │   └── webmentions_by_article.json[permalink] → array
  │
  └── has calculated popularity_score
      └── popularity-score.html partial → integer
          Formula: (hearts × 1) + (webmentions × 3) + (weight × 2)
```

---

## API Contracts

### Umami Cloud API

**Endpoint:** `https://cloud.umami.is/api/websites/{WEBSITE_ID}/stats`

**Authentication:** Bearer token

**Request:**
```http
GET /api/websites/{WEBSITE_ID}/stats HTTP/1.1
Host: cloud.umami.is
Authorization: Bearer {UMAMI_API_KEY}
Content-Type: application/json
```

**Response (Simplified):**
```json
{
  "pageviews": {
    "value": 1234,
    "prev": 1100
  },
  "visitors": {
    "value": 567,
    "prev": 500
  },
  "events": [
    {
      "name": "heart",
      "data": {
        "article": "/articles/my-post/"
      },
      "count": 42
    }
  ]
}
```

**Rate Limits:** Not documented (assumed generous for Free tier)

**Error Handling:**
- 401: Invalid API key → Fail workflow
- 403: Rate limit exceeded → Retry after delay (not implemented, just fail)
- 500: Server error → Fail workflow

### webmention.io API

**Endpoint:** `https://webmention.io/api/mentions.jf2?domain={DOMAIN}`

**Authentication:** None (public API)

**Request:**
```http
GET /api/mentions.jf2?domain=article-time.de&per-page=999 HTTP/1.1
Host: webmention.io
```

**Response:** (See `webmentions_raw.json` structure above)

**Pagination:**
- `per-page=999` gets all mentions (site unlikely to exceed this)
- If needed: Use `page` parameter for pagination

**Rate Limits:** Not documented (generous)

**Error Handling:**
- 500: Server error → Fail workflow
- Timeout: Retry once, then fail

---

## Security Architecture

### JAMstack Security Benefits

✅ **No server-side vulnerabilities:**
- No PHP/Python/Ruby execution
- No database to attack
- No admin panel to compromise

✅ **Reduced attack surface:**
- Static files only
- No dynamic processing at runtime
- No user input on server

### Authentication & Secrets Management

**GitHub Secrets (via Repository Settings):**

```
UMAMI_API_KEY          # Umami Cloud API token (Bearer auth)
UMAMI_WEBSITE_ID       # Umami website identifier
MASTODON_TOKEN         # Mastodon API token (Phase 3)
MASTODON_INSTANCE_URL  # E.g., https://mastodon.social (Phase 3)
```

**Access Control:**
- Only GitHub Actions workflows can access secrets
- Secrets never logged or exposed in build output
- API keys rotated if leaked

### Content Security

- **Git-based:** All changes versioned and traceable
- **No database:** No SQL injection risk
- **Static output:** No code execution vulnerabilities
- **HTTPS only:** Enforced by GitHub Pages

### Security Headers

Configured in `config/_default/config.yaml`:

```yaml
server:
  headers:
    "/**":
      X-Content-Type-Options: "nosniff"
      X-Frame-Options: "DENY"
      X-XSS-Protection: "1; mode=block"
      Referrer-Policy: "strict-origin-when-cross-origin"
      Permissions-Policy: "camera=(), microphone=(), geolocation=()"
```

**Recommended Addition (Epic 9):**
- Content Security Policy (CSP) header
- Subresource Integrity (SRI) for external scripts

### Client-Side Considerations

⚠️ **No cookies for analytics:** Umami uses cookieless tracking (GDPR-compliant)

⚠️ **LocalStorage for heart tracking:** Not secure, but acceptable for non-sensitive engagement data

⚠️ **XSS protection:** Hugo templates auto-escape by default, manual HTML sanitization for webmention content

---

## Performance Considerations

### Build Performance

**Current (31 articles):** ~2-5 seconds
**Expected (500 articles):** ~10-15 seconds
**Hugo Optimizations:** Parallel processing, caching, incremental builds

**Build Time Factors:**
- Number of articles
- Image processing (WebP conversion, resizing)
- SCSS compilation + PostCSS + PurgeCSS
- Template complexity (three-tier sorting adds minimal overhead)

### Runtime Performance

**Static HTML Benefits:**
- Instant page loads (no server processing)
- CDN-friendly (fully cacheable)
- Low bandwidth (optimized assets)

**Client-Side Filtering:**
- Performance: O(n) where n = number of cards on page
- Expected: <50ms for 500 cards (modern browsers)
- Debouncing: Not needed (instant filtering is acceptable)

**CSS Optimization:**
- PurgeCSS removes unused styles (production only)
- Bulma CSS trimmed from ~200KB to ~50KB (typical)
- Critical CSS inlined (not currently implemented, Epic 9)

**Image Optimization:**
- WebP conversion (Hugo built-in)
- Responsive images with `srcset`
- Lazy loading: `loading="lazy"` (existing)

**JavaScript Bundle Size:**
- Current: ~30KB (jQuery + custom scripts)
- After jQuery removal: ~5KB (vanilla JS only)
- Filter.js: ~2KB (minimal overhead)
- Hearts.js: ~1KB

### Performance Metrics (Expected)

- **First Contentful Paint (FCP):** < 1s (CDN)
- **Time to Interactive (TTI):** < 2s
- **Total Page Size:** < 500KB (optimized)
- **Lighthouse Score:** 95+ (Performance, Accessibility)

### Scalability Considerations

**Content Scalability:**
- Current: ~31 articles
- Expected capacity: 1000+ articles without issues
- Hugo handles thousands of pages efficiently

**Search Scalability:**
- Client-side search has limits (~500 articles)
- Consider server-side search (Algolia, Pagefind) at scale
- Current JSON index: ~50KB (acceptable)

**Data File Size:**
- `umami_hearts.json`: ~2KB per 100 articles
- `webmentions_by_article.json`: ~5-10KB per 100 articles
- Total overhead: Negligible (<50KB for 500 articles)

---

## Deployment Architecture

### Hosting

**Platform:** GitHub Pages (FREE)
**Domain:** article-time.de
**SSL:** Let's Encrypt (automatic via GitHub Pages)
**CDN:** GitHub's global CDN (automatic)

### Deployment Process

**Automated (Daily):**
1. GitHub Actions cron trigger (2 AM UTC)
2. Fetch engagement data (Umami + webmentions)
3. Process and commit to `data-updates` branch
4. Copy data to workspace (temporary, not committed to main)
5. Build Hugo site (`hugo --environment production --minify`)
6. Deploy to `gh-pages` branch (peaceiris/actions-gh-pages@v3)
7. GitHub Pages serves from `gh-pages` branch

**Manual (On-Demand):**
- Push to `main` branch triggers rebuild (optional workflow)
- Manual workflow dispatch via GitHub Actions UI

### Branch Strategy

**main:**
- Code, content, layouts, config
- Human commits only (features, fixes, content updates)
- Protected branch (no force push)

**data-updates:**
- Generated data files only (`data/*.json`)
- Automated commits (daily via GitHub Actions)
- Not merged into main (data copied during build)

**gh-pages:**
- Deployed static site (public/ directory)
- Auto-generated by GitHub Actions
- Never manually edited

### Rollback Strategy

**Code/Content Rollback:**
- Revert commit on `main` branch
- Trigger manual rebuild

**Data Rollback:**
- Check out previous commit on `data-updates` branch
- Trigger manual rebuild

**Full Site Rollback:**
- Revert `gh-pages` branch to previous commit
- GitHub Pages serves instantly

---

## Development Environment

### Prerequisites

**Required Software:**

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| Hugo Extended | v0.152.2 | Static site generator | https://gohugo.io/installation/ |
| Node.js | v20.x LTS | JavaScript runtime for scripts | https://nodejs.org/ |
| npm | v10+ | Package manager | Included with Node.js |
| Git | v2+ | Version control | https://git-scm.com/ |

**Optional Tools:**
- Windsurf (code editor)
- GIMP (image editing)
- Inkscape (vector editing)

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/AngelCrawford/blog.git
cd blog

# 2. Install Node.js dependencies
npm install

# 3. Create .env file for local testing (DO NOT COMMIT)
cat > .env << EOF
UMAMI_API_KEY=your_test_key
UMAMI_WEBSITE_ID=your_website_id
EOF

# 4. Fetch data manually (optional, for testing)
node scripts/fetch-umami-hearts.js
node scripts/fetch-webmentions.js
node scripts/process-webmentions.js

# 5. Run Hugo development server
hugo server --environment development

# Server running at http://localhost:1313/
# Live reload enabled
# Drafts visible
```

### Testing Locally

**Test Three-Tier Sorting:**
1. Create test articles with different `lastmod` dates
2. Set some `pinned: true`
3. Manually edit `data/*.json` files with test data
4. Run `hugo server` and check homepage tier layout

**Test Client-Side Filtering:**
1. Add `data-growth-stage` and `data-format` to test cards
2. Open browser console and test `filterCards()` function
3. Verify URL state updates (`?stage=evergreen&format=article`)

**Test Popularity Scoring:**
1. Add test data to `data/umami_hearts.json` and `data/webmentions_by_article.json`
2. Create test articles with various `weight` values
3. Check that `{{ partial "popularity-score.html" . }}` returns correct scores
4. Verify sorting in Tier 2 (Early Promoted) and Tier 3 (Established)

### GitHub Actions Testing

**Test Workflow Locally (act):**

```bash
# Install act (GitHub Actions local runner)
# https://github.com/nektos/act

# Test daily-rebuild workflow
act schedule -s UMAMI_API_KEY=test -s UMAMI_WEBSITE_ID=test

# Dry-run (no actual deployment)
act schedule --dryrun
```

**Test Manually on GitHub:**
1. Go to Actions tab → daily-rebuild workflow
2. Click "Run workflow" → "Run workflow" button
3. Monitor logs in real-time
4. Check data-updates branch for commits
5. Verify site deployment on article-time.de

---

## Architecture Decision Records (ADRs)

### ADR-001: Data Branch Strategy

**Status:** Accepted
**Date:** 2025-11-15
**Deciders:** Angel Crawford, Winston (Architect)

**Context:**
Daily automated data fetches create daily commits. We need to decide where to commit these files.

**Decision:**
Use a separate `data-updates` branch for automated data commits. Copy data to workspace during build without committing to `main`.

**Rationale:**
- Keeps `main` branch clean (only human commits)
- Preserves data history in separate branch
- Standard practice for automated updates
- Easy disaster recovery (revert data-updates branch)

**Consequences:**
- ✅ Clean commit history on main
- ✅ Data versioning preserved
- ⚠️ Slightly more complex workflow (acceptable)
- ❌ Data files not visible in main (intentional)

---

### ADR-002: Popularity Scoring in Hugo Partial

**Status:** Accepted
**Date:** 2025-11-15
**Deciders:** Angel Crawford, Winston (Architect)

**Context:**
The popularity score formula `(hearts × 1) + (webmentions × 3) + (weight × 2)` needs to be calculated. Options: Node.js script (pre-calculate) vs. Hugo template (calculate on build).

**Decision:**
Calculate popularity score in Hugo partial (`layouts/_partials/popularity-score.html`), not in Node.js script.

**Rationale:**
- Simpler architecture (one less script to maintain)
- Hugo is fast enough for this calculation
- Keeps scoring logic in templates (easier to modify)
- No need to parse markdown frontmatter in Node.js

**Consequences:**
- ✅ Fewer dependencies (3 scripts instead of 4)
- ✅ Easier local testing (just run Hugo)
- ⚠️ Hugo template math is verbose (but hidden in partial)
- ⚠️ Calculated on every build (negligible performance impact)

**Alternatives Considered:**
- Pre-calculate in `scripts/calculate-popularity.js` → Rejected (unnecessary complexity)

---

### ADR-003: Client-Side Filtering (Vanilla JS)

**Status:** Accepted
**Date:** 2025-11-15
**Deciders:** Angel Crawford, Winston (Architect)

**Context:**
Users need to filter articles by Growth Stage and Format. Options: jQuery (existing), Vanilla JS (modern), or build-time filtering (Hugo generates static pages).

**Decision:**
Use vanilla JavaScript with `data-*` attributes for client-side filtering. No jQuery dependency.

**Rationale:**
- Aligns with PRD goal of removing jQuery
- Modern, clean JavaScript (ES2020+)
- No external dependencies
- URL state management for shareable filtered views
- Instant filtering (better UX than page reloads)

**Consequences:**
- ✅ No jQuery dependency for new features
- ✅ Modern JavaScript (future-proof)
- ✅ URL state allows sharing filtered views
- ⚠️ Requires JavaScript enabled (acceptable, graceful degradation)

**Alternatives Considered:**
- Use existing jQuery → Rejected (technical debt, going away)
- Build-time filtering (Hugo static pages) → Rejected (poor UX, hundreds of pages)

---

### ADR-004: Three-Tier Sorting in Hugo Templates

**Status:** Accepted
**Date:** 2025-11-15
**Deciders:** Angel Crawford, Winston (Architect)

**Context:**
The three-tier sorting algorithm (Pinned → Grace Period → Established) needs to be implemented. Options: Hugo template queries, Node.js pre-sorting, or client-side JavaScript sorting.

**Decision:**
Implement three-tier sorting using Hugo template queries in `layouts/_default/home.html`.

**Rationale:**
- Hugo is BUILT for content querying and sorting
- Leverages native Hugo functions (`where`, `sort`, date arithmetic)
- No external dependencies
- Clear structure (one file, easy to debug)
- Calculated at build time (no client-side performance impact)

**Consequences:**
- ✅ Leverages Hugo's strengths
- ✅ Build-time sorting (no runtime overhead)
- ⚠️ Verbose template code (but only in one file)
- ✅ Easy to modify sorting rules

**Alternatives Considered:**
- Pre-sort in Node.js script → Rejected (duplicates Hugo's work, requires parsing frontmatter)
- Client-side JavaScript → Rejected (poor performance, SEO issues)

---

### ADR-005: Growth Badge Placement (Card Footer)

**Status:** Accepted
**Date:** 2025-11-15
**Deciders:** Angel Crawford (via UX spec), Winston (Architect)

**Context:**
Growth stage badges need to be displayed on cards. Options: Top corner, top-left/right ribbon, card footer, or background tint.

**Decision:**
Place growth stage badge in card footer (first position, left side), not top corner.

**Rationale:**
- Avoids conflicts with existing top badges (New, Visited)
- Avoids conflicts with category ribbons
- Semantic location (metadata with format/author)
- Accessible (icon + text label)
- Works in all card variants and responsive sizes

**Consequences:**
- ✅ Zero breaking changes to existing cards
- ✅ Accessible (icon + text)
- ✅ Responsive (icon-only on mobile)
- ⚠️ Footer gets slightly more crowded (acceptable)

**Alternatives Considered:**
- Top-left badge → Rejected (conflicts with ribbons)
- Top-right badge → Rejected (conflicts with New/Visited)
- Colored border → Rejected (subtle, conflicts with pinned gold border)

---

### ADR-006: API Failure Strategy (Fail-Fast)

**Status:** Accepted
**Date:** 2025-11-15
**Deciders:** Angel Crawford, Winston (Architect)

**Context:**
Daily GitHub Actions workflow fetches engagement data from Umami Cloud API and webmention.io API. We need to decide what happens if these APIs are unreachable during the scheduled rebuild.

**Decision:**
Implement **Fail-Fast** strategy. If Umami or webmention.io API fails, the workflow fails and does NOT deploy. Email alert sent to repository owner.

**Rationale:**
- Publishing frequency is low (~2 articles/month), so missed builds are acceptable
- Data accuracy is critical for three-tier sorting and popularity features
- Stale engagement data could surface wrong content (incorrect "Early Promotion")
- Fail-fast catches configuration errors immediately (e.g., expired API keys)
- Manual override available via `workflow_dispatch` for urgent publishing
- Aligns with "quality over recency" principle from PRD

**Consequences:**
- ✅ Always accurate engagement data (no stale popularity scores)
- ✅ Immediate alerts when APIs fail (catch errors fast)
- ✅ Prevents user confusion ("why didn't my heart count update?")
- ✅ Simpler code (no fallback logic needed)
- ❌ Site won't rebuild during API outages (previous build stays live)
- ⚠️ Requires manual `workflow_dispatch` trigger for urgent publishing during outages

**Implementation Details:**
```yaml
# .github/workflows/daily-rebuild.yml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:
    inputs:
      skip_data_fetch:
        description: 'Skip API data fetch (emergency override)'
        type: boolean
        default: false

jobs:
  build:
    steps:
      - name: Fetch Umami Hearts
        if: ${{ !inputs.skip_data_fetch }}
        run: node scripts/fetch-umami-hearts.js
        # Fails workflow if API unreachable (no continue-on-error)

      - name: Fetch Webmentions
        if: ${{ !inputs.skip_data_fetch }}
        run: node scripts/fetch-webmentions.js
        # Fails workflow if API unreachable (no continue-on-error)

      - name: Build and Deploy
        run: hugo --minify && deploy
        # Only runs if data fetch succeeded (or skipped via manual trigger)
```

**Error Handling in Scripts:**
```javascript
// scripts/fetch-umami-hearts.js
try {
  const response = await fetch(UMAMI_API_URL, { headers: { Authorization: `Bearer ${API_KEY}` } });
  if (!response.ok) throw new Error(`Umami API failed: ${response.status}`);
  const data = await response.json();
  await fs.writeFile('data/umami_hearts.json', JSON.stringify(data));
  console.log('✅ Umami data fetched successfully');
} catch (error) {
  console.error('❌ Umami API fetch failed:', error.message);
  process.exit(1); // Fail workflow (send email alert)
}
```

**Alternatives Considered:**
- **Use-Stale-Data:** Continue build with previous day's data if API fails → Rejected (risk of stale data for weeks if configuration error)
- **Hybrid (Fail-Smart):** Tolerate stale data up to 3 days, then fail → Rejected (unnecessary complexity for low-frequency publishing)

---

## Implementation Checklist

Before starting Epic 1 implementation, ensure:

- [x] Architecture document reviewed and approved
- [ ] GitHub Secrets configured (UMAMI_API_KEY, UMAMI_WEBSITE_ID)
- [ ] Umami Cloud account created and website added
- [ ] webmention.io account created for article-time.de
- [ ] `data-updates` branch created in repository
- [ ] Node.js v20.x installed locally
- [ ] Hugo v0.152.2 Extended installed locally
- [ ] Local .env file created (for testing, not committed)
- [ ] Team familiar with naming conventions and consistency rules

**First Implementation Story:**
- Epic 1, Story 1.1: Add `growth_stage` frontmatter field to archetypes
- Update existing articles with `growth_stage: "seedling"` (migration task)

---

**Next Steps:**

1. Review this architecture document with the team
2. Create first implementation story (Epic 1, Story 1.1)
3. Begin Phase 1A implementation (Growth Stage System)
4. Update workflow status to mark architecture as completed

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 2025-11-15_
_For: Angel Crawford_
_Architect: Winston (BMad Method)_
