# Product Requirements Document: Digital Garden Transformation

**Product Name:** Article Time Digital Garden
**Version:** 1.0
**Date:** 2025-11-13
**Owner:** Angel Crawford
**Business Analyst:** Mary
**Status:** Ready for Implementation

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-13 | Mary (Business Analyst) | Initial PRD from brainstorming + codebase analysis |

**Related Documents:**
- [Brainstorming Session Results](brainstorming-session-results-2025-11-13.md)
- [Current State Analysis](current-state-analysis-2025-11-13.md)
- [Gap Analysis](gap-analysis-github-issues-vs-digital-garden.md)
- [Gap Analysis Corrections](gap-analysis-corrections-2025-11-13.md)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Current State](#current-state)
4. [Goals & Success Metrics](#goals--success-metrics)
5. [User Personas](#user-personas)
6. [Core Features](#core-features)
7. [Technical Architecture](#technical-architecture)
8. [Epic Breakdown](#epic-breakdown)
9. [Implementation Phases](#implementation-phases)
10. [Dependencies & Risks](#dependencies--risks)
11. [Open Questions](#open-questions)
12. [Appendices](#appendices)

---

## Executive Summary

### What We're Building

Transforming "Article Time" from a traditional date-sorted blog into a **Digital Garden** - a living, evolving knowledge ecosystem that prioritizes quality, growth, and engagement over recency.

### Why Now

The current blog structure encourages publishing and forgetting. Old but valuable content becomes invisible, and there's no incentive to refine or update articles. This creates a "graveyard of old posts" rather than a "growing garden."

### The Transformation

**From:** Traditional blog (newest = most visible)
**To:** Digital Garden (quality + freshness = most visible)

**Key Changes:**
1. **Content Lifecycle:** Articles mature through growth stages (🌱 Seedling → 🌿 Budding → 🌳 Evergreen → 💀 Withered)
2. **Quality-Based Sorting:** Popularity score (hearts + comments + weight) determines visibility
3. **Grace Period System:** Updated content gets 4-week visibility boost
4. **Transparent Evolution:** History timeline shows how articles grow
5. **Federated Engagement:** Anonymous hearts (Umami) + webmentions (no cookies, GDPR-compliant)

### Expected Impact

- **Writer:** Incentivized to tend existing content (updates boost visibility)
- **Reader:** Discover high-quality content regardless of publish date
- **Content:** Lives and breathes, never becomes stale
- **Philosophy:** Anti-doom-scroll, intentional discovery, learning in public

### Investment Summary

**Development Effort:** ~8-12 weeks (4 phases)
**Technical Complexity:** Medium (API integrations, sorting logic, GitHub Actions)
**Risk Level:** Low (additive changes, minimal refactoring)
**ROI:** High (unique positioning, sustainable content model)

---

## Product Vision

### Vision Statement

> Create a digital space where knowledge grows organically, quality content naturally rises to the surface, and continuous refinement is rewarded over constant publishing.

### Core Philosophy

**Digital Garden Principles:**
1. **Growth Over Publishing** - Tending existing content is as valuable as creating new
2. **Quality Over Recency** - Old but evergreen beats new but shallow
3. **Transparency Over Polish** - Show the messy middle, learning in public
4. **Community Over Metrics** - Federated engagement, not vanity stats
5. **Intentionality Over Scrolling** - Three-tier mental model, not infinite feeds

**Anti-Patterns We're Rejecting:**
- ❌ Infinite scroll (doom-scrolling)
- ❌ Publish-and-forget mentality
- ❌ Newest = most visible
- ❌ Tracking cookies and surveillance
- ❌ Vanity metrics (views, likes without context)

### Target Outcome

**For Angel (Content Creator):**
- Motivated to update old articles (grace period visibility)
- Can mark content maturity (seedling → evergreen)
- Transparent about content state (draft → polished)
- Track evolution over time (history field)
- Curate quality via manual weight (0-10)

**For Readers:**
- Discover quality content by popularity, not date
- See content maturity at a glance (growth badges)
- Trust evergreen content is maintained
- Know when content is withered/deprecated
- Engage without cookies (anonymous hearts)

**For the Web:**
- IndieWeb-compliant (own your data)
- Federated (webmentions, POSSE)
- Privacy-respecting (no tracking)
- Accessible (progressive enhancement)
- Sustainable (static generation)

---

## Current State

### What Exists Today

**Article Time Blog** (article-time.de)
- Hugo static site (v0.147)
- Bulma CSS framework (v1.0.4)
- 2 content types: Articles (full posts) + Logs (microblog)
- Basic 3-tier sorting: Pinned (weight > 0) → Date-sorted (weight ≤ 0) → Unsorted
- Responsive card layout with category ribbons
- Taxonomy system: Categories, tags, authors, series
- Image optimization: WebP conversion, lazy loading
- SEO basics: Meta tags, sitemap, robots.txt, canonical URLs
- Related posts: Hugo built-in with weighted indices

**What's NOT Implemented:**
- ❌ No analytics or engagement tracking
- ❌ No webmentions or IndieWeb features
- ❌ No deployment automation (GitHub Actions)
- ❌ No growth stages or content lifecycle
- ❌ No popularity scoring
- ❌ No grace period or updated content boosting
- ❌ No history/evolution tracking
- ❌ No format filtering

**Technical Debt:** Minimal - Three redesigns cleaned house. Current codebase is lean.

**Open Issues:** 20 GitHub issues (mostly enhancements, not bugs)

### Foundation Strengths

✅ **Sorting System Ready:** Already has 3-tier concept, just needs enhancement
✅ **Card System Extensible:** Supports badges, ribbons, format indicators
✅ **Frontmatter Clean:** Easy to add new fields (growth_stage, history, etc.)
✅ **Build Pipeline Modern:** PostCSS + PurgeCSS + Hugo pipes
✅ **Image Pipeline Solid:** WebP, responsive, EXIF stripping

**Assessment:** HIGH readiness for digital garden transformation. Mostly additive work.

---

## Goals & Success Metrics

### Primary Goals

#### 1. Incentivize Content Refinement
**Goal:** Make updating old content as rewarding as publishing new content.

**Success Metrics:**
- 50% of published articles updated within 6 months
- Average of 3+ history entries per article
- 30% of homepage visibility goes to updated content (grace period)

**Measurement:**
- Track `last_significant_update` frequency
- Count history array entries
- Analyze grace period tier composition

---

#### 2. Surface Quality Content
**Goal:** High-quality content (by engagement) becomes more visible than recent content.

**Success Metrics:**
- Top 5 homepage articles average 15+ popularity points
- 70% of "Established" tier sorted by popularity (not date)
- Evergreen articles get 2x more traffic than seedlings

**Measurement:**
- Popularity score distribution
- Traffic analytics (Umami pageviews)
- Engagement rate by growth stage

---

#### 3. Transparent Learning Journey
**Goal:** Show content evolution visibly, normalize imperfection.

**Success Metrics:**
- 80% of articles have visible history timelines
- Growth stage badges displayed on 100% of cards
- Withered articles clearly marked (0% confusion)

**Measurement:**
- History field population rate
- Badge display validation
- User feedback on clarity

---

#### 4. Privacy-Respecting Engagement
**Goal:** Track engagement without cookies, GDPR-compliant.

**Success Metrics:**
- 0 tracking cookies
- Anonymous heart events functional
- Webmentions integrated (federated engagement)
- 100% GDPR compliance

**Measurement:**
- Cookie audit (expect: 0)
- Umami event tracking validation
- Webmention count per article
- Privacy policy compliance review

---

### Secondary Goals

#### 5. Community Discovery
**Goal:** Enable readers to find content by maturity and type.

**Success Metrics:**
- Dual filter UI functional (format + growth stage)
- 40% of sessions use filters
- Improved time-on-site (+20%)

**Measurement:**
- Umami event tracking (filter interactions)
- Session duration analytics
- Bounce rate by landing source

---

#### 6. Federated Presence
**Goal:** Syndicate content to Mastodon, accept webmentions.

**Success Metrics:**
- 100% of new articles auto-posted to Mastodon (POSSE)
- 10+ webmentions per popular article
- Cross-site conversations visible

**Measurement:**
- POSSE automation success rate
- Webmention count per article
- Reply context display validation

---

### Success Criteria for Launch

**Minimum Viable Garden (Phase 1 Complete):**
- [x] Three-tier sorting functional (Pinned → Grace → Established)
- [x] Growth stages implemented (🌱 🌿 🌳 💀)
- [x] Popularity scoring working (hearts + comments + weight)
- [x] Grace period logic (4 weeks after last_significant_update)
- [x] Umami analytics + heart events
- [x] Webmentions integrated
- [x] GitHub Actions daily rebuild
- [x] Dual filter UI (format + growth stage)
- [x] Badge system (New/Updated)

**Launch Readiness:**
- [ ] All Phase 1 features tested
- [ ] Privacy policy updated (Umami + webmentions)
- [ ] At least 10 articles with growth_stage assigned
- [ ] History field populated on 5+ articles
- [ ] Daily rebuild tested for 1 week
- [ ] Webmention receiving verified
- [ ] Umami heart events validated

---

## User Personas

### Primary Persona: Angel (Content Creator)

**Demographics:**
- Full-time web developer
- Limited time for personal projects
- Values quality over quantity
- German/English bilingual

**Goals:**
- Build sustainable content practice (not burnout cycle)
- Maintain evergreen content, not just publish
- Show learning journey transparently
- Own my data (IndieWeb philosophy)

**Pain Points:**
- Old articles become invisible (date-sorted graveyard)
- No incentive to update/refine existing content
- Traditional blogs reward publishing, not tending
- Tracking cookies conflict with privacy values

**How Digital Garden Helps:**
- Grace period boosts updated content visibility
- Growth stages normalize "work in progress"
- Popularity sorting surfaces quality regardless of date
- History field shows transparent evolution
- Anonymous hearts respect privacy

**User Stories:**
1. "I want to update an old article and have it visible on the homepage again."
2. "I want to mark articles as 'seedling' while I refine them publicly."
3. "I want to see which articles readers value most (without tracking them)."
4. "I want to deprecate outdated content gracefully (withered stage)."
5. "I want my content to syndicate to Mastodon automatically."

---

### Secondary Persona: Engaged Reader (Anna)

**Demographics:**
- Tech-savvy knowledge worker
- Values depth over breadth
- Prefers curated over algorithmic feeds
- Privacy-conscious

**Goals:**
- Find high-quality, maintained content
- Avoid outdated tutorials/info
- Support creators without being tracked
- Discover related concepts, not just tags

**Pain Points:**
- Search results prioritize SEO spam over quality
- Old blog posts often outdated (no update indicators)
- Can't trust content freshness
- Engagement requires giving up privacy (cookies)

**How Digital Garden Helps:**
- Popularity sorting surfaces quality
- Growth stages signal content maturity
- Evergreen badge = actively maintained
- Withered badge = deprecated warning
- Anonymous hearts (no cookies needed)

**User Stories:**
1. "I want to find evergreen content that's actively maintained."
2. "I want to know if an article is a draft or polished."
3. "I want to see how an article evolved over time."
4. "I want to support creators without tracking cookies."
5. "I want to filter content by type (article vs log) and maturity."

---

### Tertiary Persona: Casual Visitor (Markus)

**Demographics:**
- Arrives via search engine
- Skims content quickly
- Mobile-first
- Low technical knowledge

**Goals:**
- Quick answer to specific question
- Trust content is current
- Easy navigation
- No intrusive popups/tracking

**Pain Points:**
- Outdated content wastes time
- Cookie banners everywhere
- Infinite scroll rabbit holes
- Can't tell draft from final

**How Digital Garden Helps:**
- Growth badges set expectations instantly
- Three-tier structure (no infinite scroll)
- No cookie banner needed (anonymous tracking)
- Withered articles warn upfront
- Mobile-optimized cards

**User Stories:**
1. "I want to know immediately if content is outdated."
2. "I want to navigate without infinite scrolling."
3. "I want to browse without cookie consent nagging."
4. "I want clear visual signals of content quality."
5. "I want fast-loading pages (static generation)."

---

## Core Features

### Feature 1: Growth Stage System

**Description:**
Articles progress through lifecycle stages that signal maturity and maintenance status.

**Stages:**
- 🌱 **Seedling** - New ideas, early drafts, work in progress
- 🌿 **Budding** - Developing content, gaining shape, not final
- 🌳 **Evergreen** - Mature, polished, actively maintained
- 💀 **Withered** - Deprecated, outdated, kept for historical record

**Implementation:**
```yaml
# Frontmatter
growth_stage: "seedling"  # Options: seedling, budding, evergreen, withered
```

**UI Display:**
- Badge on card (icon + color-coded)
- Filter button (client-side filtering)
- Single page indicator
- OG image badge (social shares)

**Behavior:**
- Author manually sets stage (via frontmatter)
- No automatic stage transitions (intentional curation)
- Withered articles show deprecation warning
- Filter defaults to hiding withered content

**Acceptance Criteria:**
- [ ] Frontmatter field recognized by Hugo
- [ ] Archetypes include growth_stage with default "seedling"
- [ ] Card partial displays stage badge
- [ ] 4 distinct badge designs (seedling, budding, evergreen, withered)
- [ ] Withered articles show warning banner
- [ ] Filter UI includes growth stage buttons
- [ ] OG images include stage badge

---

### Feature 2: Three-Tier Sorting Algorithm

**Description:**
Homepage articles sorted into three tiers with distinct logic, replacing pure date sorting.

**Tiers:**

**Tier 1: Pinned** (Top Priority)
- Articles with `weight: 10` (max weight)
- Manual curation by author
- Limit: 3 articles maximum
- Sort: By weight (descending)
- Use case: Flagship content, current projects

**Tier 2: Grace Period** (Recently Updated)
- Articles where `last_significant_update` < 4 weeks ago
- Excludes pinned articles
- Sort: By popularity score (descending)
- Badge: "Updated" if older than 4 weeks since original publish
- Use case: Reward content refinement

**Tier 3: Established** (Evergreen Catalog)
- All other articles (grace period expired)
- Sort: By popularity score (descending)
- No special badges
- Use case: Quality content discovery

**Early Promotion:**
- If grace period article reaches ≥20 popularity points → promoted to top of tier
- Signals exceptional engagement during update window

**Implementation:**
```html
<!-- Pseudo-logic for layouts/home.html -->
{{ $pinned := where .Pages "Params.weight" "eq" 10 | first 3 }}
{{ $gracePeriod := /* last_significant_update < 4 weeks */ }}
{{ $established := /* everyone else */ }}

<!-- Tier 1: Pinned (by weight) -->
{{ range $pinned }}
  {{ partial "card" . }}
{{ end }}

<!-- Tier 2: Grace Period (by popularity) -->
{{ $graceEarly := where $gracePeriod ".Params.popularity_score" "ge" 20 }}
{{ $graceNormal := where $gracePeriod ".Params.popularity_score" "lt" 20 }}

{{ range $graceEarly.ByParam "popularity_score" reverse }}
  {{ partial "card" . }} <!-- "Updated" badge -->
{{ end }}

{{ range $graceNormal.ByParam "popularity_score" reverse }}
  {{ partial "card" . }}
{{ end }}

<!-- Tier 3: Established (by popularity) -->
{{ range $established.ByParam "popularity_score" reverse }}
  {{ partial "card" . }}
{{ end }}
```

**Acceptance Criteria:**
- [ ] Three tiers render in correct order
- [ ] Pinned tier limited to 3 articles (weight: 10)
- [ ] Grace period calculated from last_significant_update
- [ ] Grace period = 4 weeks (28 days)
- [ ] Early promotion works (≥20 points)
- [ ] Popularity score used for sorting (not date)
- [ ] "Updated" badge shows on grace period articles
- [ ] Pagination works across all tiers

---

### Feature 3: Popularity Score Formula

**Description:**
Composite score combining engagement (hearts + comments) and manual curation (weight).

**Formula:**
```
popularity_score = (hearts × 1) + (comments × 3) + (weight × 2)
```

**Components:**

**Hearts** (Umami Events) - Weight: 1x
- Anonymous "like" clicks
- Tracked via Umami custom event: `umami.track('heart', {article: 'slug'})`
- Fetched daily via GitHub Actions from Umami API
- No cookies, GDPR-compliant

**Comments** (Webmentions) - Weight: 3x
- Federated replies via webmention.io
- Counts only "reply" type (not likes/reposts)
- Fetched daily via webmention.io API
- Requires webmention endpoint setup

**Weight** (Manual Curation) - Weight: 2x
- Author-assigned importance (1-10 scale)
- Frontmatter: `weight: 5`
- Allows editorial control
- Use case: Boost strategically important content

**Example Calculations:**
```
Article A: 10 hearts, 2 comments, weight 5
= (10 × 1) + (2 × 3) + (5 × 2) = 10 + 6 + 10 = 26 points

Article B: 50 hearts, 0 comments, weight 1
= (50 × 1) + (0 × 3) + (1 × 2) = 50 + 0 + 2 = 52 points

Article C: 5 hearts, 10 comments, weight 3
= (5 × 1) + (10 × 3) + (3 × 2) = 5 + 30 + 6 = 41 points
```

**Storage:**
- Calculated at build time (Hugo data file)
- Stored in: `data/popularity_scores.json`
- Format: `{"article-slug": {"hearts": 10, "comments": 2, "score": 26}}`
- Accessed in templates via: `.Site.Data.popularity_scores`

**Update Frequency:**
- Daily rebuild via GitHub Actions
- Fetch Umami API → fetch webmention.io → calculate scores → rebuild

**Acceptance Criteria:**
- [ ] Umami heart events tracked correctly
- [ ] Webmention comments counted (replies only)
- [ ] Weight field respected (1-10 range)
- [ ] Formula calculated correctly
- [ ] Scores stored in data/popularity_scores.json
- [ ] Daily GitHub Actions workflow functional
- [ ] Scores accessible in Hugo templates
- [ ] Sorting uses popularity_score field

---

### Feature 4: Grace Period Logic

**Description:**
4-week visibility boost for significantly updated content, incentivizing refinement.

**Trigger Field:**
```yaml
# Frontmatter
last_significant_update: 2025-11-13
```

**Definition of "Significant Update":**
- Author manually sets this field (not automatic)
- Represents meaningful content changes (not typo fixes)
- Examples: New section, updated data, revised argument, expanded tutorial

**Grace Period Rules:**
1. **Duration:** 28 days (4 weeks) from `last_significant_update`
2. **Placement:** Article moves to Tier 2 (Grace Period)
3. **Badge:** Shows "Updated" if article is older than 4 weeks since `date`
4. **Early Promotion:** If popularity ≥20 during grace → top of Tier 2
5. **Expiration:** After 28 days → moves to Tier 3 (Established)

**Calculation:**
```go
// Pseudo-code
gracePeriodEnd := last_significant_update + 28 days
inGracePeriod := now < gracePeriodEnd

showUpdatedBadge := (last_significant_update - date) > 28 days
```

**UI Indicators:**
- "Updated" badge (green badge with pencil icon)
- Optional: Subtle highlight on card border
- History sidebar shows update in timeline

**Manual Override:**
- Author can set `weight: 10` to pin (overrides grace period)
- Author can set `weight: 0` to deprioritize (even during grace)

**Acceptance Criteria:**
- [ ] last_significant_update field recognized
- [ ] 28-day grace period calculated correctly
- [ ] Articles move to Tier 2 during grace
- [ ] "Updated" badge displays when appropriate
- [ ] Badge only shows if article > 4 weeks old
- [ ] Early promotion works (≥20 points)
- [ ] Grace period expiration moves to Tier 3
- [ ] Manual weight overrides grace period

---

### Feature 5: Umami Analytics + Heart Events

**Description:**
Privacy-respecting analytics with anonymous heart engagement tracking.

**Umami Setup:**
- Self-hosted or Umami Cloud
- JavaScript snippet in `<head>`
- No cookies, GDPR-compliant
- Tracks: Pageviews, referrers, browsers, countries (all anonymous)

**Heart Event Implementation:**
```html
<!-- On article cards and single pages -->
<button class="heart-button" data-slug="{{ .Params.slug }}">
  <svg class="heart-icon">...</svg>
  <span class="heart-count">{{ .Params.hearts_count }}</span>
</button>

<script>
// assets/js/heart.js
document.querySelectorAll('.heart-button').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const slug = e.currentTarget.dataset.slug;

    // Track event in Umami
    if (typeof umami !== 'undefined') {
      umami.track('heart', { article: slug });
    }

    // Visual feedback (temporary +1 until next build)
    const countEl = e.currentTarget.querySelector('.heart-count');
    countEl.textContent = parseInt(countEl.textContent) + 1;
    e.currentTarget.classList.add('hearted');
  });
});
</script>
```

**Data Flow:**
1. User clicks heart → Umami tracks event
2. GitHub Actions daily cron → Fetch Umami API
3. Parse events → Count hearts per article slug
4. Store in `data/popularity_scores.json`
5. Hugo rebuild → Display updated counts

**Umami API Integration:**
```bash
# .github/workflows/daily-rebuild.yml
# Fetch heart events from Umami API
curl -X POST https://umami.example.com/api/websites/{id}/events \
  -H "Authorization: Bearer $UMAMI_API_KEY" \
  -d '{"event_name": "heart"}' \
  > data/umami_hearts.json

# Parse and aggregate by article slug
node scripts/calculate-popularity.js
```

**Privacy Compliance:**
- No cookies stored
- No personal data collected
- IP addresses not logged (Umami setting)
- Anonymous event tracking only
- GDPR-compliant by design

**Acceptance Criteria:**
- [ ] Umami installed and configured
- [ ] JavaScript snippet in <head>
- [ ] Heart button component created
- [ ] Click event tracks to Umami
- [ ] Visual feedback on click
- [ ] GitHub Actions fetches Umami data
- [ ] Heart counts aggregated per article
- [ ] Counts displayed on cards
- [ ] No cookies used
- [ ] Privacy policy updated

---

### Feature 6: Webmention Integration

**Description:**
Federated commenting via IndieWeb webmentions, enabling cross-site conversations.

**Webmention Flow:**
1. **Receive:** Article accepts webmentions at `https://article-time.de/articles/slug`
2. **Endpoint:** Use webmention.io (free service)
3. **Verification:** webmention.io validates mentions
4. **Storage:** Fetch mentions via webmention.io API
5. **Display:** Show comment count + excerpts on article

**Setup:**
```html
<!-- In <head> of single.html -->
<link rel="webmention" href="https://webmention.io/article-time.de/webmention" />
<link rel="pingback" href="https://webmention.io/article-time.de/xmlrpc" />
```

**Data Fetching:**
```bash
# GitHub Actions daily cron
curl "https://webmention.io/api/mentions.jf2?domain=article-time.de&per-page=1000" \
  -o data/webmentions.json

# Parse by article URL
node scripts/process-webmentions.js
# Output: data/webmentions_by_article.json
# Format: {"article-slug": [mentions], ...}
```

**Comment Counting:**
```js
// scripts/calculate-popularity.js
const webmentions = require('./data/webmentions_by_article.json');

for (const [slug, mentions] of Object.entries(webmentions)) {
  // Count only "reply" type (not likes/reposts)
  const comments = mentions.filter(m => m.type === 'reply').length;

  // Use in popularity formula
  scores[slug].comments = comments;
}
```

**Display on Article:**
```html
<!-- layouts/single.html -->
{{ $mentions := index .Site.Data.webmentions_by_article .Params.slug }}
{{ $comments := where $mentions "type" "reply" }}

<section class="webmentions">
  <h3>Responses ({{ len $comments }})</h3>

  {{ range $comments }}
    <div class="mention">
      <img src="{{ .author.photo }}" alt="{{ .author.name }}">
      <p><strong>{{ .author.name }}</strong> replied:</p>
      <blockquote>{{ .content.text | truncate 280 }}</blockquote>
      <a href="{{ .url }}">View original</a>
    </div>
  {{ end }}
</section>
```

**Mention Types:**
- **reply:** Comments on article (count toward popularity)
- **like:** Hearts/favorites (informational only)
- **repost:** Shares/retweets (informational only)
- **bookmark:** Saves (informational only)

**Acceptance Criteria:**
- [ ] webmention.io account created
- [ ] Webmention endpoint in <head>
- [ ] Pingback endpoint in <head>
- [ ] GitHub Actions fetches mentions daily
- [ ] Mentions parsed by article URL
- [ ] Comment count calculated (replies only)
- [ ] Comments displayed on article page
- [ ] Author avatars displayed
- [ ] Links to original mentions work
- [ ] Spam filtering (manual moderation queue)

---

### Feature 7: Dual Filter System

**Description:**
Client-side filtering by format AND growth stage, independent dimensions.

**Filter UI:**
```html
<div class="filter-controls">
  <div class="filter-group">
    <label>Filter by Format:</label>
    <button class="filter-btn" data-filter="format" data-value="all">All</button>
    <button class="filter-btn" data-filter="format" data-value="article">Article</button>
    <button class="filter-btn" data-filter="format" data-value="log">Log</button>
    <button class="filter-btn" data-filter="format" data-value="link">Link</button>
  </div>

  <div class="filter-group">
    <label>Filter by Growth Stage:</label>
    <button class="filter-btn" data-filter="stage" data-value="all">All</button>
    <button class="filter-btn" data-filter="stage" data-value="seedling">🌱 Seedling</button>
    <button class="filter-btn" data-filter="stage" data-value="budding">🌿 Budding</button>
    <button class="filter-btn" data-filter="stage" data-value="evergreen">🌳 Evergreen</button>
    <button class="filter-btn" data-filter="stage" data-value="withered">💀 Withered</button>
  </div>
</div>
```

**Data Attributes on Cards:**
```html
<article class="card"
         data-format="{{ .Params.format | default "article" }}"
         data-stage="{{ .Params.growth_stage | default "seedling" }}">
  <!-- Card content -->
</article>
```

**JavaScript Filtering:**
```js
// assets/js/filter.js
let activeFilters = {
  format: 'all',
  stage: 'all'
};

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const filterType = e.target.dataset.filter;
    const filterValue = e.target.dataset.value;

    // Update active filters
    activeFilters[filterType] = filterValue;

    // Apply combined filters
    applyFilters();

    // Update UI
    updateActiveButtons();
  });
});

function applyFilters() {
  document.querySelectorAll('.card').forEach(card => {
    const format = card.dataset.format;
    const stage = card.dataset.stage;

    const formatMatch = activeFilters.format === 'all' || format === activeFilters.format;
    const stageMatch = activeFilters.stage === 'all' || stage === activeFilters.stage;

    if (formatMatch && stageMatch) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}
```

**Filter Combinations:**
- "All Articles" (format=article, stage=all)
- "Evergreen Articles" (format=article, stage=evergreen)
- "All Seedlings" (format=all, stage=seedling)
- "Budding Logs" (format=log, stage=budding)

**Default State:**
- Format: All
- Stage: All (shows everything including withered)
- Optional: Hide withered by default, require explicit toggle

**Analytics Tracking:**
```js
// Track filter usage
btn.addEventListener('click', (e) => {
  if (typeof umami !== 'undefined') {
    umami.track('filter_click', {
      type: filterType,
      value: filterValue
    });
  }
});
```

**Acceptance Criteria:**
- [ ] Two filter groups rendered (format + stage)
- [ ] Data attributes on all cards
- [ ] Click toggles filter state
- [ ] Combined filtering works (AND logic)
- [ ] Active button highlighted
- [ ] Filtered cards hidden (display: none)
- [ ] Filter state resets on page load
- [ ] Umami tracks filter usage
- [ ] Mobile-responsive layout
- [ ] Keyboard accessible

---

### Feature 8: Badge System

**Description:**
Visual indicators for content state: growth stage + freshness (New/Updated).

**Badge Types:**

**Growth Stage Badges** (always visible)
- 🌱 Seedling - Green, sprout icon
- 🌿 Budding - Yellow-green, leaf icon
- 🌳 Evergreen - Dark green, tree icon
- 💀 Withered - Gray, skull icon

**Freshness Badges** (conditional)
- **New** - Blue badge, "NEW" text
  - Shows if: `date` < 4 weeks ago
  - AND: not in grace period (no last_significant_update)

- **Updated** - Orange badge, "UPDATED" text
  - Shows if: in grace period (last_significant_update < 4 weeks)
  - AND: article > 4 weeks old (date > 4 weeks ago)

**Badge Placement:**
```html
<!-- On card -->
<article class="card">
  <div class="badges">
    <!-- Growth stage (always) -->
    <span class="badge stage-{{ .Params.growth_stage }}">
      <span class="icon">{{ partial "icons/stage" .Params.growth_stage }}</span>
      {{ .Params.growth_stage | title }}
    </span>

    <!-- Freshness (conditional) -->
    {{ if /* NEW logic */ }}
      <span class="badge badge-new">NEW</span>
    {{ else if /* UPDATED logic */ }}
      <span class="badge badge-updated">UPDATED</span>
    {{ end }}
  </div>

  <!-- Card content -->
</article>
```

**Badge Logic:**
```go
// Hugo template pseudo-code
$age := now.Sub .Date
$isNew := lt $age (mul 28 86400) // < 4 weeks
$hasUpdate := isset .Params.last_significant_update

$graceAge := 0
{{ if $hasUpdate }}
  $graceAge = now.Sub .Params.last_significant_update
{{ end }}
$inGrace := lt $graceAge (mul 28 86400)

{{ if and $isNew (not $hasUpdate) }}
  <!-- Show NEW badge -->
{{ else if and $inGrace (gt $age (mul 28 86400)) }}
  <!-- Show UPDATED badge -->
{{ end }}
```

**CSS Styling:**
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.stage-seedling { background: #4ade80; color: #166534; }
.badge.stage-budding { background: #fbbf24; color: #78350f; }
.badge.stage-evergreen { background: #10b981; color: #064e3b; }
.badge.stage-withered { background: #6b7280; color: #1f2937; }

.badge-new { background: #3b82f6; color: white; }
.badge-updated { background: #f97316; color: white; }
```

**OG Image Integration:**
- Generate social share images with growth stage badge
- Use Hugo image processing or external service (Cloudinary, Imgix)
- Cache generated images

**Acceptance Criteria:**
- [ ] 4 growth stage badges designed
- [ ] 2 freshness badges designed
- [ ] Badge logic implemented correctly
- [ ] Badges display on cards
- [ ] Badges display on single pages
- [ ] OG images include stage badge
- [ ] Mobile-responsive sizing
- [ ] Accessible (ARIA labels)
- [ ] Color contrast meets WCAG AA

---

### Feature 9: History Timeline

**Description:**
Visible content evolution tracking via `history` array field and sidebar widget.

**Frontmatter Schema:**
```yaml
history:
  - date: 2025-11-13
    note: "Initial planting 🌱 - First draft published"

  - date: 2025-12-01
    note: "Updated examples, fixed typos"

  - date: 2025-12-15
    note: "Expanded section on implementation details"

  - date: 2026-01-10
    note: "Promoted to Evergreen 🌳 - Comprehensive and stable"

  - date: 2026-06-01
    note: "Marked as Withered 💀 - Framework deprecated, see new article"
```

**Sidebar Widget** (3 most recent entries)
```html
<!-- layouts/_partials/widgets/history.html -->
{{ if .Params.history }}
  <aside class="widget history-timeline">
    <h3>Recent Updates</h3>
    <ol class="timeline">
      {{ range first 3 (.Params.history | reverse) }}
        <li>
          <time datetime="{{ .date }}">{{ .date | dateFormat "Jan 2, 2006" }}</time>
          <p>{{ .note }}</p>
        </li>
      {{ end }}
    </ol>

    {{ if gt (len .Params.history) 3 }}
      <a href="#full-history" class="see-more">See full history ↓</a>
    {{ end }}
  </aside>
{{ end }}
```

**Full History Section** (article footer)
```html
<!-- layouts/single.html -->
{{ if .Params.history }}
  <section id="full-history" class="content-history">
    <h2>Content Evolution</h2>
    <p>This article has been updated {{ len .Params.history }} times. Transparency is key to learning in public!</p>

    <ol class="timeline-full">
      {{ range .Params.history | reverse }}
        <li>
          <time datetime="{{ .date }}">{{ .date | dateFormat "January 2, 2006" }}</time>
          <div class="note">{{ .note | markdownify }}</div>
        </li>
      {{ end }}
    </ol>
  </section>
{{ end }}
```

**RSS Exclusion:**
```xml
<!-- layouts/rss.xml -->
<!-- Do NOT include history field in RSS feed -->
<!-- Keep feed clean, only main content -->
```

**Best Practices Guide:**
- Add entry when updating content significantly
- Be honest about changes (bugs fixed, rewrites, etc.)
- Include growth stage transitions
- Keep notes concise (1-2 sentences)
- Use emojis sparingly (growth stage icons)

**Archetype Template:**
```yaml
# archetypes/articles/index.md
history:
  - date: {{ .Date }}
    note: "Initial planting 🌱"
```

**Acceptance Criteria:**
- [ ] history field in frontmatter schema
- [ ] Sidebar widget shows 3 recent entries
- [ ] Full history section in article footer
- [ ] Timeline styling implemented
- [ ] Dates formatted correctly
- [ ] Markdown in notes supported
- [ ] RSS excludes history
- [ ] Archetypes include history template
- [ ] "See full history" link works
- [ ] Mobile-responsive layout

---

### Feature 10: GitHub Actions Daily Rebuild

**Description:**
Automated daily workflow to fetch engagement data and rebuild site.

**Workflow File:**
```yaml
# .github/workflows/daily-rebuild.yml
name: Daily Rebuild with Engagement Data

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
  workflow_dispatch:  # Manual trigger

jobs:
  fetch-and-rebuild:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.147.0'
          extended: true

      - name: Fetch Umami heart data
        env:
          UMAMI_API_KEY: ${{ secrets.UMAMI_API_KEY }}
          UMAMI_WEBSITE_ID: ${{ secrets.UMAMI_WEBSITE_ID }}
        run: |
          node scripts/fetch-umami-hearts.js

      - name: Fetch webmention data
        run: |
          curl "https://webmention.io/api/mentions.jf2?domain=article-time.de&per-page=1000" \
            -o data/webmentions_raw.json
          node scripts/process-webmentions.js

      - name: Calculate popularity scores
        run: |
          node scripts/calculate-popularity.js

      - name: Build Hugo site
        run: |
          npm install
          hugo --environment production --minify

      - name: Deploy to hosting
        uses: # Your hosting provider action
        # (e.g., Netlify, Vercel, GitHub Pages, etc.)
```

**Fetch Scripts:**

**scripts/fetch-umami-hearts.js**
```js
const fs = require('fs');

const UMAMI_API_URL = 'https://umami.example.com/api';
const API_KEY = process.env.UMAMI_API_KEY;
const WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

async function fetchHearts() {
  const response = await fetch(`${UMAMI_API_URL}/websites/${WEBSITE_ID}/events`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_name: 'heart',
      start_at: 0,  // All time
      end_at: Date.now()
    })
  });

  const data = await response.json();

  // Aggregate by article slug
  const heartsByArticle = {};
  for (const event of data.events) {
    const slug = event.properties.article;
    heartsByArticle[slug] = (heartsByArticle[slug] || 0) + 1;
  }

  fs.writeFileSync('data/umami_hearts.json', JSON.stringify(heartsByArticle, null, 2));
}

fetchHearts();
```

**scripts/process-webmentions.js**
```js
const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('data/webmentions_raw.json', 'utf8'));

// Group by target URL
const byArticle = {};
for (const mention of raw.children) {
  // Extract slug from target URL
  const url = new URL(mention['wm-target']);
  const slug = url.pathname.split('/').filter(Boolean).pop();

  if (!byArticle[slug]) byArticle[slug] = [];
  byArticle[slug].push(mention);
}

fs.writeFileSync('data/webmentions_by_article.json', JSON.stringify(byArticle, null, 2));
```

**scripts/calculate-popularity.js**
```js
const fs = require('fs');

const hearts = JSON.parse(fs.readFileSync('data/umami_hearts.json', 'utf8'));
const webmentions = JSON.parse(fs.readFileSync('data/webmentions_by_article.json', 'utf8'));

// Get all articles from content/articles/
const articles = /* read frontmatter for weight */;

const scores = {};
for (const article of articles) {
  const slug = article.slug;
  const heartCount = hearts[slug] || 0;

  // Count only reply-type webmentions
  const mentions = webmentions[slug] || [];
  const commentCount = mentions.filter(m => m['wm-property'] === 'in-reply-to').length;

  const weight = article.weight || 0;

  // Formula: (hearts × 1) + (comments × 3) + (weight × 2)
  const score = (heartCount * 1) + (commentCount * 3) + (weight * 2);

  scores[slug] = {
    hearts: heartCount,
    comments: commentCount,
    weight: weight,
    score: score
  };
}

fs.writeFileSync('data/popularity_scores.json', JSON.stringify(scores, null, 2));
```

**Secrets Configuration:**
```
GitHub Repository Settings > Secrets and Variables > Actions

UMAMI_API_KEY - Umami API bearer token
UMAMI_WEBSITE_ID - Umami website ID
```

**Acceptance Criteria:**
- [ ] Workflow file created in .github/workflows/
- [ ] Cron schedule set (2 AM UTC daily)
- [ ] Manual trigger works (workflow_dispatch)
- [ ] Umami API fetch script works
- [ ] Webmention fetch script works
- [ ] Popularity calculation script works
- [ ] Hugo build succeeds
- [ ] Deploy step configured
- [ ] Secrets properly stored
- [ ] Workflow runs successfully for 7 days
- [ ] Error handling and logging
- [ ] Build failure notifications

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Digital Garden System                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Umami      │      │ Webmention   │      │   GitHub     │
│  Analytics   │──────│     .io      │──────│   Actions    │
│              │      │              │      │              │
│ Heart Events │      │  Comments    │      │ Daily Cron   │
└──────────────┘      └──────────────┘      └──────┬───────┘
                                                    │
                                                    │ Fetch Data
                                                    ▼
                                            ┌──────────────┐
                                            │  Build-time  │
                                            │  Processing  │
                                            │              │
                                            │ • Fetch APIs │
                                            │ • Calculate  │
                                            │ • Generate   │
                                            └──────┬───────┘
                                                   │
                                                   │ Data Files
                                                   ▼
                                            ┌──────────────┐
                                            │     Hugo     │
                                            │    Builder   │
                                            │              │
                                            │ • Sort       │
                                            │ • Template   │
                                            │ • Generate   │
                                            └──────┬───────┘
                                                   │
                                                   │ Static HTML
                                                   ▼
                                            ┌──────────────┐
                                            │   Hosting    │
                                            │   (CDN)      │
                                            │              │
                                            │ Netlify/     │
                                            │ Vercel/etc   │
                                            └──────┬───────┘
                                                   │
                                                   │ Serve
                                                   ▼
                                            ┌──────────────┐
                                            │    Users     │
                                            │              │
                                            │ • Browse     │
                                            │ • Click ❤️   │
                                            │ • Comment    │
                                            └──────────────┘
```

### Technology Stack

**Core Platform:**
- Hugo 0.147 Extended (static site generator)
- Bulma 1.0.4 (CSS framework)
- PostCSS + PurgeCSS (CSS optimization)
- Node.js 20 (build scripts)

**Engagement Tracking:**
- Umami Analytics (privacy-respecting analytics)
- webmention.io (federated comments)
- GitHub Actions (automation)

**Hosting:**
- TBD: Netlify / Vercel / Cloudflare Pages / GitHub Pages
- CDN for static assets
- HTTPS enforced

**Development:**
- Git + GitHub (version control)
- Windsurf / VS Code (editor)
- Hugo server (local development)

### Data Flow

**Daily Rebuild Cycle:**
```
1. GitHub Actions Cron (2 AM UTC)
   ↓
2. Fetch Umami API → umami_hearts.json
   ↓
3. Fetch webmention.io → webmentions_raw.json
   ↓
4. Process webmentions → webmentions_by_article.json
   ↓
5. Calculate popularity → popularity_scores.json
   ↓
6. Hugo build (reads data files)
   ↓
7. Generate static HTML with updated scores
   ↓
8. Deploy to hosting
```

**User Interaction:**
```
1. User loads homepage
   ↓
2. See three-tier sorted articles (from static HTML)
   ↓
3. Click filter buttons (client-side JS)
   ↓
4. Click heart button
   ↓
5. Umami tracks event (no page reload)
   ↓
6. Visual feedback (+1 count, temporary)
   ↓
7. Next day: Daily rebuild includes heart in score
```

### File Structure

```
blog/
├── .github/
│   └── workflows/
│       └── daily-rebuild.yml
│
├── archetypes/
│   ├── articles/
│   │   └── index.md (includes growth_stage, history)
│   └── logs/
│       └── index.md
│
├── assets/
│   ├── js/
│   │   ├── heart.js (heart button interaction)
│   │   └── filter.js (dual filter logic)
│   └── scss/
│       └── (Bulma + custom styles)
│
├── config/
│   ├── _default/
│   ├── development/
│   └── production/
│
├── content/
│   ├── articles/ (with growth_stage, history, weight)
│   └── logs/
│
├── data/
│   ├── popularity_scores.json (generated daily)
│   ├── umami_hearts.json (generated daily)
│   ├── webmentions_raw.json (generated daily)
│   └── webmentions_by_article.json (generated daily)
│
├── layouts/
│   ├── _partials/
│   │   ├── card.html (includes badges, filters)
│   │   └── widgets/
│   │       └── history.html (timeline widget)
│   ├── home.html (three-tier sorting)
│   └── single.html (history section, webmentions)
│
├── scripts/
│   ├── fetch-umami-hearts.js
│   ├── process-webmentions.js
│   └── calculate-popularity.js
│
└── static/
    └── (fonts, images, etc.)
```

### Security Considerations

**Privacy:**
- No tracking cookies
- Anonymous analytics only
- GDPR-compliant by design
- Privacy policy updated

**Headers:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: restrictive

**API Secrets:**
- Umami API key in GitHub Secrets
- No API keys in client-side code
- Build-time data fetching only

**Webmention Spam:**
- Manual moderation queue (Phase 2)
- Domain reputation filtering
- Rate limiting on webmention.io

---

## Epic Breakdown

### Epic 1: Engagement Infrastructure
**Goal:** Enable anonymous engagement tracking (hearts + comments)

**User Stories:**
1. As a reader, I want to click a heart button to show appreciation without cookies
2. As Angel, I want to see which articles resonate with readers
3. As a reader, I want to leave federated comments via webmentions
4. As Angel, I want daily engagement data updates without manual work

**Features:**
- Umami Analytics setup
- Heart button component
- Umami event tracking
- Webmention endpoint setup
- webmention.io integration
- GitHub Actions daily rebuild

**Acceptance Criteria:**
- [ ] Umami installed and tracking pageviews
- [ ] Heart button clickable on all articles
- [ ] Hearts tracked as Umami events
- [ ] Webmention endpoint in <head>
- [ ] Webmentions received and validated
- [ ] Daily GitHub Actions workflow functional

**Dependencies:**
- Umami account (self-hosted or cloud)
- webmention.io account
- GitHub repository with Actions enabled

**Effort:** 2-3 weeks
**Priority:** CRITICAL (blocks popularity scoring)

---

### Epic 2: Growth Stage System
**Goal:** Implement content lifecycle stages and visual indicators

**User Stories:**
1. As Angel, I want to mark articles as seedling/budding/evergreen/withered
2. As a reader, I want to see content maturity at a glance
3. As a reader, I want to filter articles by growth stage
4. As a reader, I want warnings on deprecated (withered) content

**Features:**
- growth_stage frontmatter field
- 4 growth stage badges (🌱 🌿 🌳 💀)
- Badge display on cards
- Growth stage filter UI
- Withered article warnings
- OG image badges

**Acceptance Criteria:**
- [ ] Frontmatter field recognized
- [ ] Archetypes include growth_stage
- [ ] 4 distinct badge designs
- [ ] Badges display on cards and single pages
- [ ] Filter UI functional
- [ ] Withered warnings display
- [ ] OG images include stage badge

**Dependencies:**
- None (can start immediately)

**Effort:** 1-2 weeks
**Priority:** HIGH

---

### Epic 3: Popularity Scoring Engine
**Goal:** Calculate and apply popularity scores for quality-based sorting

**User Stories:**
1. As Angel, I want articles sorted by engagement, not just date
2. As a reader, I want to discover quality content easily
3. As the system, I want to combine hearts, comments, and weight into a score
4. As the system, I want daily score recalculation

**Features:**
- Popularity formula implementation
- Data aggregation scripts
- popularity_scores.json generation
- Hugo template score access
- Sorting by popularity_score

**Acceptance Criteria:**
- [ ] Formula calculates correctly: (hearts × 1) + (comments × 3) + (weight × 2)
- [ ] Scores stored in data file
- [ ] Scores accessible in templates
- [ ] Sorting uses scores (not dates)
- [ ] Daily recalculation works

**Dependencies:**
- Epic 1 (Engagement Infrastructure) must be complete
- Requires Umami hearts and webmention comments

**Effort:** 1-2 weeks
**Priority:** CRITICAL

---

### Epic 4: Three-Tier Sorting
**Goal:** Replace date sorting with tiered quality/freshness model

**User Stories:**
1. As Angel, I want to pin up to 3 flagship articles
2. As Angel, I want updated content to get visibility boost (grace period)
3. As a reader, I want quality content to surface naturally
4. As a reader, I want clear mental model (not infinite scroll)

**Features:**
- Tier 1: Pinned (weight: 10, max 3)
- Tier 2: Grace Period (last_significant_update < 4 weeks)
- Tier 3: Established (sorted by popularity)
- Grace period logic (28 days)
- Early promotion (≥20 points)
- last_significant_update field

**Acceptance Criteria:**
- [ ] Three tiers render in correct order
- [ ] Pinned tier limited to 3 articles
- [ ] Grace period calculated correctly (28 days)
- [ ] Early promotion works (≥20 points)
- [ ] Updated badge displays
- [ ] Pagination works across tiers

**Dependencies:**
- Epic 3 (Popularity Scoring) must be complete
- Requires popularity scores for sorting

**Effort:** 2 weeks
**Priority:** CRITICAL

---

### Epic 5: Badge & Filter System
**Goal:** Visual indicators and client-side filtering

**User Stories:**
1. As a reader, I want to see "New" or "Updated" badges on fresh content
2. As a reader, I want to filter by format (article, log, link)
3. As a reader, I want to filter by growth stage (seedling, evergreen, etc.)
4. As a reader, I want to combine filters (e.g., "Evergreen Articles")

**Features:**
- New/Updated badge logic
- Dual filter UI (format + stage)
- Client-side filtering JavaScript
- Data attributes on cards
- Umami filter tracking

**Acceptance Criteria:**
- [ ] New badge shows on articles < 4 weeks old
- [ ] Updated badge shows on grace period articles
- [ ] Format filter works (article, log, link)
- [ ] Growth stage filter works (seedling, budding, evergreen, withered)
- [ ] Combined filtering works (AND logic)
- [ ] Filter usage tracked in Umami

**Dependencies:**
- Epic 2 (Growth Stages) for stage filter
- Epic 4 (Three-Tier Sorting) for Updated badge

**Effort:** 1 week
**Priority:** HIGH

---

### Epic 6: History Timeline
**Goal:** Visible content evolution tracking

**User Stories:**
1. As Angel, I want to document how articles evolve over time
2. As a reader, I want to see recent updates in sidebar
3. As a reader, I want to read full history in article footer
4. As a reader, I want transparency in learning process

**Features:**
- history frontmatter array
- Sidebar widget (3 recent entries)
- Full history section (article footer)
- Archetype template
- Timeline styling

**Acceptance Criteria:**
- [ ] history field in frontmatter
- [ ] Sidebar shows 3 most recent
- [ ] Full history in footer
- [ ] Timeline styled appropriately
- [ ] Archetypes include history template
- [ ] RSS excludes history

**Dependencies:**
- None (can start anytime)

**Effort:** 1 week
**Priority:** MEDIUM

---

### Epic 7: POSSE & Advanced Webmentions
**Goal:** Federated content distribution and conversation threading

**User Stories:**
1. As Angel, I want new articles auto-posted to Mastodon
2. As a reader, I want to see webmention replies in context
3. As a reader, I want to follow conversations across sites
4. As the system, I want to syndicate updates automatically

**Features:**
- POSSE automation (Mastodon)
- Advanced webmention display
- Reply threading
- Conversation context
- Syndication links

**Acceptance Criteria:**
- [ ] New articles post to Mastodon automatically
- [ ] Webmention replies display with context
- [ ] Author avatars shown
- [ ] Links to original mentions work
- [ ] Syndication links in footer

**Dependencies:**
- Epic 1 (Webmentions) must be complete
- Requires webmention.io setup

**Effort:** 2 weeks
**Priority:** LOW (Phase 3)

---

### Epic 8: Polish & Optimization
**Goal:** Final touches and performance optimization

**User Stories:**
1. As a reader, I want fast page loads
2. As a reader, I want accessible interface
3. As a crawler, I want complete SEO metadata
4. As Angel, I want legal compliance (privacy policy)

**Features:**
- Open Graph share images with badges
- Schema.org structured data updates
- Privacy policy updates
- Contact page
- No-JS banner
- Performance optimization
- Accessibility audit

**Acceptance Criteria:**
- [ ] OG images generate with stage badges
- [ ] Schema includes garden metadata
- [ ] Privacy policy updated (Umami + webmentions)
- [ ] Contact page functional
- [ ] No-JS banner displays
- [ ] Lighthouse score >90
- [ ] WCAG AA compliance

**Dependencies:**
- All previous epics complete

**Effort:** 2 weeks
**Priority:** MEDIUM (Phase 2)

---

## Implementation Phases

### Phase 0: Foundation Cleanup
**Duration:** 1 week
**Goal:** Clean house, complete open control issues

**Tasks:**
1. Validate security headers (#38)
2. Validate RSS feed (#31)
3. Add privacy policy (#49)
4. Add contact page (#41)
5. Validate schema markup (#173)
6. Set up GitHub Actions infrastructure

**Deliverables:**
- [ ] All "control" issues closed
- [ ] Legal pages published
- [ ] GitHub Actions ready

---

### Phase 1: Core Garden (MVP)
**Duration:** 6-8 weeks
**Goal:** Build minimum viable digital garden

**Epics:**
- Epic 1: Engagement Infrastructure (2-3 weeks)
- Epic 2: Growth Stage System (1-2 weeks)
- Epic 3: Popularity Scoring Engine (1-2 weeks)
- Epic 4: Three-Tier Sorting (2 weeks)
- Epic 5: Badge & Filter System (1 week)

**Week-by-Week Breakdown:**

**Week 1-2: Engagement Setup**
- Set up Umami Analytics
- Implement heart button component
- Set up webmention.io endpoint
- Create GitHub Actions workflow skeleton

**Week 3: Growth Stages**
- Add growth_stage frontmatter field
- Design 4 growth stage badges
- Implement badge display on cards
- Update archetypes

**Week 4-5: Popularity Scoring**
- Write Umami fetch script
- Write webmention processing script
- Implement popularity formula
- Test GitHub Actions daily rebuild

**Week 6-7: Three-Tier Sorting**
- Add last_significant_update field
- Implement grace period logic
- Refactor home.html for three tiers
- Test early promotion

**Week 8: Badges & Filters**
- Implement New/Updated badge logic
- Build dual filter UI
- Write client-side filtering JS
- Test combined filtering

**Launch Criteria:**
- [ ] All Phase 1 epics complete
- [ ] 10+ articles with growth_stage assigned
- [ ] Daily rebuild tested for 7 days
- [ ] Umami hearts and webmentions verified
- [ ] Sorting tested with real data

---

### Phase 2: Polish & History
**Duration:** 2-3 weeks
**Goal:** Add transparency and visual polish

**Epics:**
- Epic 6: History Timeline (1 week)
- Epic 8: Polish & Optimization (partial, 2 weeks)

**Tasks:**
1. Implement history field and sidebar widget
2. Generate OG images with stage badges
3. Update Schema.org markup
4. Add withered article warnings
5. Implement no-JS banner
6. Performance optimization pass
7. Accessibility audit

**Deliverables:**
- [ ] History timeline functional
- [ ] OG images with badges
- [ ] Withered warnings display
- [ ] Lighthouse score >90
- [ ] WCAG AA compliant

---

### Phase 3: Federated Community
**Duration:** 2 weeks
**Goal:** Enable POSSE and advanced webmentions

**Epics:**
- Epic 7: POSSE & Advanced Webmentions (2 weeks)

**Tasks:**
1. Set up Mastodon account
2. Implement POSSE automation
3. Add reply context to webmention display
4. Implement conversation threading
5. Add syndication links

**Deliverables:**
- [ ] Auto-posting to Mastodon works
- [ ] Webmention threading functional
- [ ] Reply context displays

---

### Phase 4: Future Enhancements
**Duration:** Ongoing
**Goal:** Nice-to-have features, experimentation

**Features:**
- Webring integration (#146)
- Sidenotes (#157)
- Error/info notifications (#46)
- Concept-based related articles (TF-IDF)
- Visual garden map (force-directed graph)
- Format expansion (link, gallery, chat, instagram)

**Priority:** Low (as time permits)

---

## Dependencies & Risks

### Critical Path Dependencies

```
Phase 0: Foundation Cleanup
    ↓
Epic 1: Engagement Infrastructure
    ↓
Epic 3: Popularity Scoring Engine
    ↓
Epic 4: Three-Tier Sorting
    ↓
Phase 1 Launch

Epic 2: Growth Stages (parallel to Epic 1)
    ↓
Epic 5: Badge & Filter System
```

**Blocker:** Epic 1 must complete before Epic 3 (can't score without engagement data)
**Blocker:** Epic 3 must complete before Epic 4 (can't sort without scores)

### Technical Risks

#### Risk 1: Umami API Rate Limiting
**Probability:** Medium
**Impact:** High (blocks daily rebuild)

**Mitigation:**
- Cache API responses
- Implement exponential backoff
- Monitor API usage
- Consider self-hosted Umami (unlimited API calls)

---

#### Risk 2: Webmention Spam
**Probability:** High (after growth)
**Impact:** Medium (pollutes comment counts)

**Mitigation:**
- Manual moderation queue (Phase 2)
- Domain reputation filtering
- Automated spam detection (Akismet integration)
- Rate limiting on webmention.io

---

#### Risk 3: GitHub Actions Build Failures
**Probability:** Medium
**Impact:** High (stale data)

**Mitigation:**
- Comprehensive error handling in scripts
- Retry logic for API failures
- Failure notifications (email/Slack)
- Fallback to previous data file if fetch fails
- Weekly monitoring and maintenance

---

#### Risk 4: Performance Degradation (Large Dataset)
**Probability:** Low (current scale)
**Impact:** Medium (slow builds)

**Mitigation:**
- Hugo caching enabled
- Incremental builds (if Hugo supports)
- Data file size monitoring
- Pagination to limit cards per page
- Image optimization (WebP, lazy loading)

---

#### Risk 5: Complex Sorting Logic Bugs
**Probability:** High (complex business rules)
**Impact:** High (user confusion)

**Mitigation:**
- Comprehensive unit tests for sorting logic
- Test articles in all states (new, grace, established, pinned)
- Visual debugging (log tier placement)
- Beta testing with real content
- Gradual rollout (Phase 1 testing)

---

### Business Risks

#### Risk 6: Low Engagement (Hearts/Comments)
**Probability:** Medium
**Impact:** Medium (formula depends on engagement)

**Mitigation:**
- Weight field provides manual override (2x multiplier)
- Formula still works with zero engagement (weight-only sorting)
- Grace period provides time-based boost (not just engagement)
- Promote heart button visibility
- Encourage webmention usage (link from Mastodon)

---

#### Risk 7: Maintenance Burden
**Probability:** Medium
**Impact:** Medium (Angel's limited time)

**Mitigation:**
- Automated daily rebuilds (no manual work)
- Simple frontmatter schema (easy to manage)
- Optional history field (not required)
- GitHub Actions handles complexity
- Monitoring and alerts for failures

---

## Open Questions

### Product Questions

1. **Withered Content Handling:**
   - Q: Should withered articles be hidden by default in filters?
   - Options: (a) Show by default, (b) Hide by default, (c) Separate archive page
   - Decision: TBD - Angel to decide based on content volume

2. **Grace Period Duration:**
   - Q: Is 4 weeks the right grace period length?
   - Options: (a) 4 weeks, (b) 2 weeks, (c) 6 weeks, (d) Author-configurable
   - Decision: Start with 4 weeks, evaluate after 3 months

3. **Pinned Article Limit:**
   - Q: Is 3 the right limit for pinned articles?
   - Options: (a) 3, (b) 5, (c) Unlimited
   - Decision: TBD - Angel to decide based on content strategy

4. **Format Expansion Priority:**
   - Q: Which new formats should be prioritized? (link, gallery, chat, instagram, quote)
   - Decision: TBD - Defer to Phase 4, focus on core formats first

5. **Webmention Moderation:**
   - Q: Should webmentions require manual approval?
   - Options: (a) Auto-approve all, (b) Manual review, (c) Trusted domain whitelist
   - Decision: Start with auto-approve, add moderation if spam becomes issue

---

### Technical Questions

6. **Umami Hosting:**
   - Q: Self-hosted or Umami Cloud?
   - Options: (a) Self-hosted (unlimited API), (b) Cloud (easier setup)
   - Decision: TBD - Angel to evaluate based on budget and technical comfort

7. **Deployment Platform:**
   - Q: Which hosting platform for static site?
   - Options: (a) Netlify, (b) Vercel, (c) Cloudflare Pages, (d) GitHub Pages
   - Decision: TBD - Evaluate based on GitHub Actions integration

8. **OG Image Generation:**
   - Q: Build-time or on-demand?
   - Options: (a) Hugo image processing, (b) Cloudinary/Imgix, (c) External service
   - Decision: TBD - Start with Hugo, evaluate if performance issues

9. **POSSE Target:**
   - Q: Just Mastodon or other platforms?
   - Options: (a) Mastodon only, (b) Mastodon + Bluesky, (c) Multi-platform
   - Decision: Start with Mastodon, expand if desired

10. **Data File Storage:**
    - Q: Should popularity_scores.json be committed to repo or build artifact only?
    - Options: (a) Commit to repo (version history), (b) Build artifact only (cleaner)
    - Decision: TBD - Consider pros/cons of each approach

---

## Appendices

### Appendix A: Frontmatter Schema Reference

**Full Articles Schema (Phase 1+):**
```yaml
---
title: "Article Title Here"
slug: "custom-slug-if-needed"
subtitle: "Optional subtitle"
date: 2025-11-13
lastmod: 2025-11-13
publishdate: 2025-11-13
draft: false

# Digital Garden Fields
growth_stage: "seedling"  # seedling, budding, evergreen, withered
last_significant_update: 2025-11-13  # Triggers grace period
weight: 5  # 1-10 scale (10 = pinned, 0 = default)
format: "article"  # article, log, link, gallery, chat, instagram, quote

# History Tracking
history:
  - date: 2025-11-13
    note: "Initial planting 🌱"
  - date: 2025-12-01
    note: "Expanded examples section"

# Taxonomies
categories: ["Technology"]
tags: ["Hugo", "Digital Garden", "Static Sites"]
series: ["Building a Digital Garden"]
authors: ["angel"]

# SEO
summary: "Required summary for article cards (120-158 chars ideal)"

params:
  SEO:
    desc: "Optional SEO description (else uses summary)"
    keywords: ["hugo", "digital garden"]
    canonicalURL: ""  # For cross-posting
---
```

---

### Appendix B: Glossary

**Digital Garden:**
A website organized around content maturity and quality rather than chronology. Content is tended (updated) rather than published and forgotten.

**Growth Stage:**
The maturity level of an article (seedling, budding, evergreen, withered). Signals content state to readers.

**Grace Period:**
4-week visibility boost after significant content update (`last_significant_update` field). Rewards refinement.

**Popularity Score:**
Composite engagement metric: (hearts × 1) + (comments × 3) + (weight × 2). Used for sorting.

**Three-Tier Sorting:**
Homepage sorting into Pinned (manual curation) → Grace Period (recently updated) → Established (quality catalog).

**Early Promotion:**
Automatic boost to top of Grace Period tier when article reaches ≥20 popularity points.

**Webmention:**
IndieWeb standard for cross-site interactions (comments, likes, replies). Federated alternative to platform-specific engagement.

**POSSE:**
"Publish (on) Own Site, Syndicate Elsewhere." Publish on your site first, auto-post to social media.

**Umami:**
Privacy-respecting, cookie-free analytics platform. Tracks pageviews and custom events without violating GDPR.

**Heart Events:**
Anonymous "like" interactions tracked via Umami custom events. No cookies, no personal data.

---

### Appendix C: Success Metrics Dashboard

**Phase 1 Launch Metrics:**
- [ ] 10+ articles with growth_stage assigned
- [ ] Daily rebuild success rate: >95%
- [ ] Heart button functional on 100% of articles
- [ ] Webmentions received and displayed
- [ ] Homepage sorting verified (all three tiers)
- [ ] Filter UI functional (format + stage)
- [ ] Privacy policy updated
- [ ] Zero tracking cookies

**3-Month Post-Launch Metrics:**
- [ ] 50% of articles updated (history entries added)
- [ ] Average 3+ history entries per article
- [ ] Top 5 articles: 15+ popularity points
- [ ] 40% of sessions use filters
- [ ] 10+ webmentions on popular articles
- [ ] Time-on-site increased by 20%

**6-Month Goals:**
- [ ] 80% of articles have visible history
- [ ] Evergreen articles: 2x traffic vs seedlings
- [ ] POSSE automation: 100% success rate
- [ ] Bounce rate decreased by 15%
- [ ] 100% GDPR compliance maintained

---

### Appendix D: Reference Links

**Digital Garden Examples:**
- [Maggie Appleton's Garden](https://maggieappleton.com/garden)
- [Tom Critchlow's Wiki](https://tomcritchlow.com/wiki/)
- [Andy Matuschak's Notes](https://notes.andymatuschak.org/)
- [Joel Hooks' Garden](https://joelhooks.com/)

**IndieWeb Resources:**
- [IndieWeb.org](https://indieweb.org/)
- [webmention.io](https://webmention.io/)
- [Bridgy](https://brid.gy/) (social media → webmentions)

**Hugo Documentation:**
- [Hugo Docs](https://gohugo.io/documentation/)
- [Hugo Data Files](https://gohugo.io/templates/data-templates/)
- [Hugo Related Content](https://gohugo.io/content-management/related/)

**Tools:**
- [Umami Analytics](https://umami.is/)
- [Bulma CSS](https://bulma.io/)
- [Remix Icon](https://remixicon.com/)

---

## Document Status

**Current Version:** 1.0 (Initial Release)
**Last Updated:** 2025-11-13
**Next Review:** After Phase 1 Launch

**Approval:**
- [ ] Product Owner (Angel) - Pending
- [ ] Business Analyst (Mary) - Approved
- [ ] Technical Review - Pending

**Change Log:**
- 2025-11-13: Initial PRD created from brainstorming + codebase analysis

---

*End of Product Requirements Document*

**Ready for Implementation: Phase 0 → Phase 1 → Launch**
