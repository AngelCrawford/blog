# Product Requirements Document: Digital Garden Transformation

**Product Name:** Article Time Digital Garden
**Version:** 1.1 (Updated with Final Decisions)
**Date:** 2025-11-13
**Owner:** Angel Crawford
**Business Analyst:** Mary
**Status:** ✅ APPROVED - Ready for Implementation

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-13 | Mary (Business Analyst) | Initial PRD from brainstorming + codebase analysis |
| 1.1 | 2025-11-13 | Mary (Business Analyst) | **Updated with all final decisions from Angel** |

**Related Documents:**
- [Brainstorming Session Results](brainstorming-session-results-2025-11-13.md)
- [Current State Analysis](current-state-analysis-2025-11-13.md)
- [Gap Analysis](gap-analysis-github-issues-vs-digital-garden.md)
- [Gap Analysis Corrections](gap-analysis-corrections-2025-11-13.md)
- [Open Questions Decision Guide](open-questions-decision-guide.md)
- ✅ [**Final Decisions Summary**](final-decisions-summary.md) ⭐ **NEW**

---

## 🎯 Quick Reference - Final Decisions

| Decision | Final Choice | Details |
|----------|--------------|---------|
| **Withered Handling** | Hide by default, include in SEO/RSS | [Decision #1](#decision-1-withered-content-handling) |
| **Grace Period** | 4 weeks (configurable) | [Decision #2](#decision-2-grace-period-duration) |
| **Pinned Limit** | Exactly 3 articles | [Decision #3](#decision-3-pinned-article-limit) |
| **Formats** | 6 total: Article, Log, Link, Video, Gallery, Portfolio | [Decision #4](#decision-4-format-expansion) |
| **Webmention Moderation** | Auto-approve, monitor for spam | [Decision #5](#decision-5-webmention-moderation) |
| **Umami Hosting** | Cloud Hobby (FREE with API) | [Decision #6](#decision-6-umami-hosting) |
| **Deployment** | GitHub Pages | [Decision #7](#decision-7-deployment-platform) |
| **OG Images** | Hugo image processing | [Decision #8](#decision-8-og-image-generation) |
| **POSSE Targets** | Automate: Mastodon + Threads, Manual: Facebook + Reddit | [Decision #9](#decision-9-posse-platforms) |
| **Data Storage** | Commit to `data-updates` branch | [Decision #10](#decision-10-data-file-storage) |

**Timeline:** ~14 weeks (3.5 months)
**Scope:** Quality over speed - implementing all features properly

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Current State](#current-state)
4. [Goals & Success Metrics](#goals--success-metrics)
5. [User Personas](#user-personas)
6. [Core Features](#core-features)
7. [Content Formats](#content-formats) ⭐ **UPDATED**
8. [Technical Architecture](#technical-architecture) ⭐ **UPDATED**
9. [Epic Breakdown](#epic-breakdown)
10. [Implementation Phases](#implementation-phases) ⭐ **UPDATED**
11. [Dependencies & Risks](#dependencies--risks)
12. [Final Decisions Detail](#final-decisions-detail) ⭐ **NEW**
13. [Appendices](#appendices)

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
6. **6 Content Formats:** Articles, logs, links, videos, galleries, portfolios ⭐ **NEW**

### Expected Impact

- **Writer:** Incentivized to tend existing content (updates boost visibility)
- **Reader:** Discover high-quality content regardless of publish date
- **Content:** Lives and breathes, never becomes stale
- **Philosophy:** Anti-doom-scroll, intentional discovery, learning in public

### Investment Summary ⭐ **UPDATED**

**Development Effort:** ~14 weeks (3.5 months)
**Technical Complexity:** Medium (API integrations, sorting logic, GitHub Actions, multiple formats)
**Risk Level:** Low (additive changes, minimal refactoring)
**ROI:** High (unique positioning, sustainable content model)
**Cost:** $0/month (Umami Cloud Free, GitHub Pages Free)

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
- **Diverse content types** (articles, videos, galleries, projects) ⭐ **NEW**

**For Readers:**
- Discover quality content by popularity, not date
- See content maturity at a glance (growth badges)
- Trust evergreen content is maintained
- Know when content is withered/deprecated
- Engage without cookies (anonymous hearts)
- **Explore different formats** (text, video, images, projects) ⭐ **NEW**

**For the Web:**
- IndieWeb-compliant (own your data)
- Federated (webmentions, POSSE to Mastodon/Threads)
- Privacy-respecting (no tracking)
- Accessible (progressive enhancement)
- Sustainable (static generation)

---

## Current State

*(Same as v1.0 - see original PRD for full details)*

**Summary:**
- Clean Hugo blog with Articles + Logs
- Bulma CSS, PostCSS, WebP images
- Basic 3-tier sorting (ready to enhance)
- Minimal technical debt
- 20 open GitHub issues
- Archive page already exists at `/pages/archiv/`

---

## Goals & Success Metrics

*(Same as v1.0 - see original PRD for full details)*

**Key Success Metrics:**
1. 50% of articles updated within 6 months
2. Top 5 homepage articles average 15+ popularity points
3. 80% of articles have visible history timelines
4. 0 tracking cookies, 100% GDPR compliance
5. 40% of sessions use filter UI
6. **NEW:** All 6 content formats in active use within 6 months ⭐

---

## User Personas

*(Same as v1.0 - see original PRD for full details)*

**Primary:** Angel (Content Creator)
**Secondary:** Anna (Engaged Reader)
**Tertiary:** Markus (Casual Visitor)

---

## Core Features

### Feature 1: Growth Stage System
*(Same as v1.0 - see original PRD for implementation details)*

**Growth Stages:**
- 🌱 Seedling
- 🌿 Budding
- 🌳 Evergreen
- 💀 Withered ⭐ **Enhanced with SEO/RSS integration**

---

### Feature 2: Three-Tier Sorting Algorithm
*(Same as v1.0 - see original PRD for implementation details)*

**Tiers:**
1. Pinned (weight: 10, **max 3 articles**) ⭐ **CONFIRMED**
2. Grace Period (**28 days**) ⭐ **CONFIRMED**
3. Established (by popularity)

---

### Feature 3: Popularity Score Formula
*(Same as v1.0 - see original PRD for implementation details)*

Formula: `(hearts × 1) + (comments × 3) + (weight × 2)`

---

### Feature 4: Grace Period Logic
*(Same as v1.0 - see original PRD for implementation details)*

**Duration:** 28 days (configurable in `params.yaml`) ⭐ **CONFIRMED**

```yaml
# config/_default/params.yaml
digital_garden:
  grace_period_days: 28
```

---

### Feature 5: Umami Analytics + Heart Events ⭐ **UPDATED**

**Hosting Decision:** Umami Cloud Hobby (FREE) ✅

**Why this changed from v1.0:**
- Angel already has Umami Cloud account on free Hobby plan
- Free plan includes API access (confirmed by Angel)
- No monthly cost ($0/month)
- No setup overhead (already configured)

**Umami Cloud Hobby Plan:**
- 100K events/month
- Up to 3 websites
- 6-month data retention
- Community support
- ✅ **API access** (critical for daily rebuilds)

**Daily API Usage:**
- 1 fetch per day = 30 calls/month
- Well under any rate limits
- No cost, no restrictions

**Implementation:**
```yaml
# GitHub Actions
- name: Fetch Umami hearts
  env:
    UMAMI_API_KEY: ${{ secrets.UMAMI_API_KEY }}
    UMAMI_WEBSITE_ID: ${{ secrets.UMAMI_WEBSITE_ID }}
  run: node scripts/fetch-umami-hearts.js
```

**Setup Steps:**
1. ✅ Umami Cloud account (already exists)
2. Generate API key: Settings → API Keys → Create
3. Add to GitHub Secrets: `UMAMI_API_KEY`, `UMAMI_WEBSITE_ID`
4. Done!

---

### Feature 6: Webmention Integration

*(Same as v1.0 - see original PRD for implementation details)*

**Moderation:** Auto-approve all, monitor for spam >10% ⭐ **CONFIRMED**

---

### Feature 7: Dual Filter System

*(Same as v1.0 - see original PRD for implementation details)*

**Filters:**
- Format: All, Article, Log, Link, Video, Gallery, Portfolio ⭐ **UPDATED**
- Growth Stage: All, 🌱 Seedling, 🌿 Budding, 🌳 Evergreen, 💀 Withered (hidden by default) ⭐ **UPDATED**

---

### Feature 8: Badge System

*(Same as v1.0 - see original PRD for implementation details)*

**Badges:**
- Growth stage badges (always visible)
- New badge (< 4 weeks old)
- Updated badge (in grace period)

---

### Feature 9: History Timeline

*(Same as v1.0 - see original PRD for implementation details)*

---

### Feature 10: GitHub Actions Daily Rebuild ⭐ **UPDATED**

**Deployment Target:** GitHub Pages ✅

**Why GitHub Pages:**
- Free forever
- 1 GB repository limit (plenty for years)
- 100 GB/month bandwidth (~100K pageviews)
- Custom domain support (article-time.de)
- HTTPS via Let's Encrypt
- Simple deployment
- Handles thousands of images before issues

**Data Storage:** Separate `data-updates` branch ⭐ **NEW**

**Branch Strategy:**
```
main (clean commits)
├── code, content, layouts
└── (data files NOT committed)

data-updates (data history)
└── data/
    ├── popularity_scores.json
    ├── umami_hearts.json
    └── webmentions_by_article.json
```

**Workflow:**
```yaml
# Daily rebuild at 2 AM UTC
- Fetch engagement data (Umami + webmentions)
- Commit to data-updates branch
- Copy data to main (not committed)
- Build Hugo site
- Deploy to GitHub Pages
```

**Benefits:**
- ✅ Main branch stays clean (no daily commit noise)
- ✅ Data history preserved (can inspect historical scores)
- ✅ Local development (merge data-updates to test)
- ✅ Transparency (public data visible)

---

## Content Formats ⭐ **NEW SECTION**

### Overview

The digital garden supports **6 content formats**, each with distinct card layouts and purposes.

### Format 1: Article ✅ **EXISTING**

**Purpose:** Long-form blog posts, tutorials, essays

**Frontmatter:**
```yaml
format: "article"  # Default, can be omitted
title: "My Article Title"
summary: "Required summary for card"
```

**Card Design:**
- Full-width horizontal card
- Optional cover image (2:3 portrait)
- Category ribbon
- Title + summary + tags
- Date + lastmod indicators

**Effort:** ✅ Already implemented

---

### Format 2: Log ✅ **EXISTING**

**Purpose:** Microblog entries, quotes, short thoughts

**Frontmatter:**
```yaml
format: "log"
title: "For internal use only"
# No summary required
```

**Card Design:**
- Compact card
- Optional image (600×480)
- Content directly in card (no summary)
- No detail page (headless)

**Note:** Replaces "Instagram" format (identical design) ⭐ **DECISION**

**Effort:** ✅ Already implemented

---

### Format 3: Link ❌ **NEW - PHASE 1B**

**Purpose:** External resource curation with commentary

**Use Cases:**
- Bookmarks of interesting articles
- Tool recommendations
- Reference links for tutorials

**Frontmatter:**
```yaml
format: "link"
title: "Interesting Article Title"
url: "https://example.com/article"
domain: "example.com"  # Auto-extracted from URL
summary: "Why this resource is valuable..."
```

**Card Design:**
- External link icon (↗)
- Domain displayed (e.g., "→ example.com")
- Card links to external URL (not detail page)
- Option: Click title → external, click card → detail page
- Your commentary in summary

**Single Page Template:**
- Redirect to external URL (meta refresh)
- OR: Show iframe + commentary
- OR: Full page with embedded link + your notes

**Effort:** 2-3 days (archetype + card + template)

---

### Format 4: Video ❌ **NEW - PHASE 1B**

**Purpose:** YouTube/Vimeo sharing with notes

**Use Cases:**
- Conference talks
- Tutorial videos
- Video essays you recommend

**Frontmatter:**
```yaml
format: "video"
title: "Video Title"
video_url: "https://youtube.com/watch?v=..."
video_id: "dQw4w9WgXcQ"  # Extracted from URL
platform: "youtube"  # or "vimeo"
duration: "12:34"  # Optional
summary: "What this video is about..."
```

**Card Design:**
- Video thumbnail (from YouTube API)
- Play icon overlay
- Platform badge (YouTube/Vimeo)
- Duration badge
- Click → detail page with embedded player

**Single Page Template:**
- Embedded video player (responsive)
- Your notes below video
- Transcript (if available)
- Tags/categories

**Effort:** 2-3 days (YouTube API, embed, archetype)

---

### Format 5: Gallery ❌ **NEW - PHASE 1B**

**Purpose:** Photo collections, travel logs, design showcases

**Use Cases:**
- Travel photo essays
- Before/after comparisons
- Design portfolio pieces
- Event coverage

**Frontmatter:**
```yaml
format: "gallery"
title: "Trip to Iceland"
summary: "Photos from my 2-week Iceland trip"
# Images stored in same folder as index.md
```

**Resources Structure:**
```
content/articles/iceland-trip/
├── index.md
├── cover.jpg (card preview)
├── photo-001.jpg
├── photo-002.jpg
├── photo-003.jpg
└── ... (up to 50+ images)
```

**Card Design:**
- Image grid (2×2 or 3×3 preview)
- Photo count badge (e.g., "24 photos")
- Cover image featured
- Double-height card (is-row-span-2)

**Single Page Template:**
- Masonry or grid layout
- Lightbox/modal for full-size
- Captions from EXIF
- Lazy loading
- Optional: Image filters (B&W, vintage)

**Effort:** 4-5 days (complex layout, lightbox, grid logic)

---

### Format 6: Portfolio ❌ **NEW - PHASE 1B**

**Purpose:** Project showcases, work samples, case studies

**Use Cases:**
- Web development projects
- Design case studies
- Open source contributions
- Client work (if allowed)

**Frontmatter:**
```yaml
format: "portfolio"
title: "E-Commerce Redesign"
summary: "Complete redesign of online store..."
project_url: "https://example-store.com"
github_url: "https://github.com/angel/project"
tech_stack: ["Vue.js", "Node.js", "PostgreSQL", "Docker"]
role: "Full-stack Developer"
year: 2024
client: "Example Store Inc."  # Optional
```

**Card Design:**
- Project screenshot/mockup
- Tech stack pills/badges
- Links: [Live Demo] [GitHub]
- Role + year
- Distinct styling (border color, badge)

**Single Page Template:**
- Hero: Large project image/video
- Overview section
- Tech stack (with icons)
- Problem/Solution/Results
- Screenshots/demos
- Links (live, GitHub, case study)
- Testimonial (if available)

**Effort:** 3-4 days (template, tech stack icons, layout)

---

### Format Comparison

| Format | Card Layout | Detail Page | Images | Use Case |
|--------|-------------|-------------|--------|----------|
| **Article** | Horizontal, summary | Full post | 1 cover | Long-form writing |
| **Log** | Compact | None (headless) | 1 optional | Quick thoughts |
| **Link** | Horizontal, domain | Redirect/notes | 1 optional | Curation |
| **Video** | Thumbnail, play icon | Embedded player | Thumbnail | Video sharing |
| **Gallery** | Image grid | Masonry/lightbox | Many | Photo essays |
| **Portfolio** | Screenshot, tech | Case study | Many | Work samples |

---

### Format Implementation Priority

**Phase 1A (Existing):**
1. ✅ Article
2. ✅ Log

**Phase 1B Week 7-8 (Lightweight):**
3. ❌ Link (2-3 days)
4. ❌ Video (2-3 days)

**Phase 1B Week 9 (Complex):**
5. ❌ Gallery (4-5 days)
6. ❌ Portfolio (3-4 days)

**Total Format Development:** ~3 weeks

---

## Technical Architecture ⭐ **UPDATED**

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                Digital Garden System Architecture            │
└─────────────────────────────────────────────────────────────┘

External Services                     GitHub Repository
┌──────────────┐                     ┌─────────────────────┐
│ Umami Cloud  │────API Fetch───────>│   main branch       │
│ (FREE Hobby) │                     │   - Code/Content    │
│              │                     │   - Layouts         │
│ Heart Events │                     │   - Config          │
└──────────────┘                     └─────────────────────┘
                                              │
┌──────────────┐                             │
│ Webmention   │────API Fetch───────>┌───────▼─────────────┐
│    .io       │                     │  data-updates branch│
│              │                     │  - popularity.json  │
│  Comments    │                     │  - hearts.json      │
└──────────────┘                     │  - webmentions.json │
                                     └──────┬──────────────┘
                                            │
                    ┌───────────────────────▼────────────────┐
                    │      GitHub Actions (Daily 2 AM)        │
                    │  1. Fetch Umami hearts                   │
                    │  2. Fetch webmentions                    │
                    │  3. Calculate popularity scores          │
                    │  4. Commit to data-updates branch        │
                    │  5. Copy data to main (not committed)    │
                    │  6. Build Hugo site                      │
                    │  7. Deploy to GitHub Pages               │
                    └───────────────┬──────────────────────────┘
                                    │
                                    │ Static HTML
                                    ▼
                    ┌─────────────────────────────────┐
                    │       GitHub Pages              │
                    │  - Custom domain: article-time.de│
                    │  - HTTPS (Let's Encrypt)        │
                    │  - 100 GB/month bandwidth       │
                    └────────────┬────────────────────┘
                                 │
                                 │ Serve
                                 ▼
                    ┌─────────────────────────────────┐
                    │         Users                   │
                    │  - Browse articles               │
                    │  - Click hearts (→ Umami)       │
                    │  - Send webmentions             │
                    │  - Filter by format/stage       │
                    └─────────────────────────────────┘

POSSE Syndication (Phase 3)
┌──────────────┐                     ┌──────────────┐
│  Mastodon    │<────Auto-Post──────│  New Article │
│ (automated)  │                     │  Published   │
└──────────────┘                     └──────────────┘

┌──────────────┐
│   Threads    │<────Auto-Post (try)
│ (if possible)│
└──────────────┘

┌──────────────┐
│ Facebook     │<────Manual Post
│ (manual)     │     (personal profile)
└──────────────┘

┌──────────────┐
│   Reddit     │<────Manual Post
│  (manual)    │     (community engagement)
└──────────────┘
```

### Technology Stack ⭐ **UPDATED**

**Core Platform:**
- Hugo 0.147 Extended (static site generator)
- Bulma 1.0.4 (CSS framework)
- PostCSS + PurgeCSS (CSS optimization)
- Node.js 20 (build scripts)

**Engagement Tracking:**
- ✅ Umami Cloud Hobby (FREE, API-enabled) ⭐ **CONFIRMED**
- webmention.io (federated comments)
- GitHub Actions (automation)

**Hosting:**
- ✅ GitHub Pages (FREE, custom domain, HTTPS) ⭐ **CONFIRMED**
- CDN: GitHub's CDN (global)

**POSSE Platforms:** ⭐ **NEW**
- Mastodon (automated)
- Threads (automated if API allows)
- Facebook (manual - personal profile)
- Reddit (manual - community engagement)

**Development:**
- Git + GitHub (version control + deployment)
- Windsurf / VS Code (editor)
- Hugo server (local development)

---

### Data Flow ⭐ **UPDATED**

**Daily Rebuild Cycle:**
```
1. GitHub Actions Cron (2 AM UTC)
   ↓
2. Fetch Umami Cloud API → umami_hearts.json
   (API key from secrets)
   ↓
3. Fetch webmention.io → webmentions_raw.json
   ↓
4. Process webmentions → webmentions_by_article.json
   ↓
5. Calculate popularity → popularity_scores.json
   Formula: (hearts × 1) + (comments × 3) + (weight × 2)
   ↓
6. Commit data to data-updates branch
   (Preserves history, keeps main clean)
   ↓
7. Copy data to main workspace (NOT committed)
   ↓
8. Hugo build (reads data files)
   - 6 content formats (article, log, link, video, gallery, portfolio)
   - Growth stage sorting
   - Three-tier homepage
   - OG image generation (Hugo image processing)
   ↓
9. Deploy to GitHub Pages
   - Static HTML + images
   - Custom domain: article-time.de
   - HTTPS enabled
```

**User Interaction:**
```
1. User loads homepage (GitHub Pages serves static HTML)
   ↓
2. See three-tier sorted articles (from latest build)
   ↓
3. Filter by format (article/log/link/video/gallery/portfolio)
   ↓
4. Filter by growth stage (seedling/budding/evergreen/withered)
   (Client-side JS, instant)
   ↓
5. Click heart button
   ↓
6. Umami Cloud tracks event (no cookies, anonymous)
   ↓
7. Visual feedback (+1 count, temporary until next build)
   ↓
8. Next day: Daily rebuild includes heart in popularity score
```

---

### File Structure ⭐ **UPDATED**

```
blog/
├── .github/
│   └── workflows/
│       └── daily-rebuild.yml (fetch data, build, deploy)
│
├── archetypes/
│   ├── articles/index.md  ✅
│   ├── logs/index.md      ✅
│   ├── links/index.md     ❌ Phase 1B
│   ├── videos/index.md    ❌ Phase 1B
│   ├── galleries/index.md ❌ Phase 1B
│   └── portfolio/index.md ❌ Phase 1B
│
├── assets/
│   ├── js/
│   │   ├── heart.js (Umami event tracking)
│   │   └── filter.js (dual filter: format + stage)
│   └── scss/
│       └── (Bulma + custom + format-specific styles)
│
├── config/
│   └── _default/
│       ├── config.yaml
│       └── params.yaml (digital_garden settings)
│
├── content/
│   ├── articles/ (format: article)
│   ├── logs/ (format: log)
│   ├── links/ (format: link) ❌ Phase 1B
│   ├── videos/ (format: video) ❌ Phase 1B
│   ├── galleries/ (format: gallery) ❌ Phase 1B
│   ├── portfolio/ (format: portfolio) ❌ Phase 1B
│   └── pages/
│       └── archiv/ (withered content archive)
│
├── data/
│   ├── popularity_scores.json (generated daily, NOT in main)
│   ├── umami_hearts.json (generated daily, NOT in main)
│   ├── webmentions_raw.json (generated daily, NOT in main)
│   └── webmentions_by_article.json (generated daily, NOT in main)
│
├── docs/ (planning documents)
│   ├── prd-digital-garden-transformation-v1.1.md ⭐ THIS FILE
│   ├── final-decisions-summary.md
│   ├── brainstorming-session-results-2025-11-13.md
│   ├── current-state-analysis-2025-11-13.md
│   └── ... (other planning docs)
│
├── layouts/
│   ├── _partials/
│   │   ├── card.html (6 format variants)
│   │   ├── og-image-generator.html (Hugo image processing)
│   │   └── widgets/
│   │       └── history.html (timeline widget)
│   ├── home.html (three-tier sorting)
│   ├── single.html (handles all 6 formats)
│   └── ... (format-specific templates)
│
├── scripts/
│   ├── fetch-umami-hearts.js (Umami Cloud API)
│   ├── process-webmentions.js
│   ├── calculate-popularity.js (formula implementation)
│   └── posse-mastodon.js (Phase 3)
│
└── static/
    └── (fonts, images, OG templates)

Branches:
├── main (clean commits: features, content, fixes)
└── data-updates (data history: daily popularity updates)
```

---

## Epic Breakdown

*(Same epics as v1.0, with format expansion added)*

### Epic 1: Engagement Infrastructure
*(Same as v1.0)*

**NEW Details:**
- Use Umami Cloud Hobby (not self-hosted)
- Generate API key from Umami dashboard
- Deploy to GitHub Pages (not Netlify)

---

### Epic 2: Growth Stage System
*(Same as v1.0)*

**NEW Details:**
- Withered content: Hide by default, include in SEO/RSS with "[Withered DATE]"
- Add withered_date and withered_reason frontmatter fields

---

### Epic 3: Popularity Scoring Engine
*(Same as v1.0)*

**NEW Details:**
- Commit scores to data-updates branch (not main)

---

### Epic 4: Three-Tier Sorting
*(Same as v1.0)*

**NEW Details:**
- Pinned limit enforced: max 3 articles (template logic)
- Grace period configurable: `params.digital_garden.grace_period_days`

---

### Epic 5: Badge & Filter System
*(Same as v1.0)*

**NEW Details:**
- Filter includes 6 formats: article, log, link, video, gallery, portfolio
- Withered hidden by default, explicit "Show Withered" toggle

---

### Epic 6: History Timeline
*(Same as v1.0)*

---

### Epic 7: POSSE & Advanced Webmentions ⭐ **UPDATED**

**Goal:** Federated content distribution and conversation threading

**User Stories:**
1. As Angel, I want new articles auto-posted to Mastodon
2. As Angel, I want new articles auto-posted to Threads (if API allows)
3. As Angel, I want guidance on manual posting to Facebook/Reddit
4. As a reader, I want to see webmention replies in context
5. As a reader, I want to follow conversations across sites

**Features:**
- Mastodon POSSE automation (guaranteed)
- Threads POSSE automation (attempt, fallback to manual)
- Facebook posting guide (personal profile, manual)
- Reddit posting guide (community engagement, manual)
- Advanced webmention display with threading
- Reply context/conversation display
- Syndication links in footer

**Platforms:**

| Platform | Method | Phase | API | Reason |
|----------|--------|-------|-----|--------|
| **Mastodon** | Automated | Phase 3 | ✅ Free | IndieWeb-aligned, easy API |
| **Threads** | Automated (try) | Phase 3 | ⚠️ New | Meta API, check limits |
| **Facebook** | Manual guide | Phase 3 | ❌ Restricted | Personal profile TOS |
| **Reddit** | Manual guide | Phase 3 | ⚠️ Anti-spam | Community rules vary |

**Acceptance Criteria:**
- [ ] Mastodon account connected
- [ ] Mastodon POSSE posts new articles automatically
- [ ] Threads API evaluated (automate if possible, else manual)
- [ ] Facebook manual posting guide created
- [ ] Reddit manual posting guide created (10:1 rule)
- [ ] Webmention replies display with context
- [ ] Author avatars shown
- [ ] Links to original mentions work
- [ ] Syndication links in article footer

**Dependencies:**
- Epic 1 (Webmentions) must be complete
- Mastodon account required
- Threads account required
- Meta developer account (for Threads API)

**Effort:** 2 weeks (Week 12-13)
**Priority:** MEDIUM (Phase 3)

---

### Epic 8: Format Expansion ⭐ **NEW EPIC**

**Goal:** Implement 4 new content formats (Link, Video, Gallery, Portfolio)

**User Stories:**
1. As Angel, I want to curate external links with commentary (Link format)
2. As Angel, I want to share videos with notes (Video format)
3. As Angel, I want to showcase photo collections (Gallery format)
4. As Angel, I want to display project portfolios (Portfolio format)
5. As a reader, I want to filter by content format
6. As a reader, I want distinct visual layouts for each format

**Features:**
- Link format (external resource curation)
- Video format (YouTube/Vimeo embeds)
- Gallery format (photo collections with lightbox)
- Portfolio format (project showcases)
- Format-specific archetypes
- Format-specific card designs
- Format-specific single page templates
- Filter UI extended to include all 6 formats

**Acceptance Criteria:**

**Link Format:**
- [ ] Link archetype created
- [ ] Link card shows domain + external icon
- [ ] Link opens external URL or shows detail page with commentary
- [ ] url and domain frontmatter fields recognized

**Video Format:**
- [ ] Video archetype created
- [ ] Video card shows thumbnail + play icon + duration
- [ ] Video single page embeds player (responsive)
- [ ] Supports YouTube and Vimeo
- [ ] video_url, video_id, platform fields recognized

**Gallery Format:**
- [ ] Gallery archetype created
- [ ] Gallery card shows image grid (2×2 or 3×3)
- [ ] Gallery card displays photo count badge
- [ ] Gallery single page shows masonry/grid layout
- [ ] Lightbox/modal for full-size viewing
- [ ] Captions from EXIF data
- [ ] Lazy loading implemented

**Portfolio Format:**
- [ ] Portfolio archetype created
- [ ] Portfolio card shows project screenshot + tech stack
- [ ] Portfolio card displays links (demo, GitHub)
- [ ] Portfolio single page shows case study layout
- [ ] Tech stack icons/badges displayed
- [ ] project_url, github_url, tech_stack, role fields recognized

**Filter UI:**
- [ ] Format filter includes: All, Article, Log, Link, Video, Gallery, Portfolio
- [ ] Filter UI responsive on mobile
- [ ] Filter state persists during session

**Dependencies:**
- Epic 2 (Growth Stages) for consistent badge system
- Epic 5 (Filters) for dual filter foundation

**Effort:** 3 weeks (Week 7-9)
- Week 7-8: Link + Video (lightweight formats)
- Week 9: Gallery + Portfolio (complex layouts)

**Priority:** HIGH (Phase 1B)

---

### Epic 9: Polish & Optimization
*(Renumbered from Epic 8)*

**NEW Details:**
- OG image generation via Hugo image processing (not external service)
- Withered SEO: Include in sitemap/RSS with "[Withered DATE]" suffix

---

## Implementation Phases ⭐ **UPDATED**

### Phase 0: Foundation Cleanup
**Duration:** 1 week
**Goal:** Prepare infrastructure

**Tasks:**
- [ ] ✅ Set up Umami Cloud account (already done!)
- [ ] Generate Umami API key (Settings → API Keys)
- [ ] Add GitHub Secrets: UMAMI_API_KEY, UMAMI_WEBSITE_ID
- [ ] Validate security headers (#38)
- [ ] Validate RSS feed (#31)
- [ ] Add privacy policy (#49) - Update for Umami + webmentions
- [ ] Add contact page (#41)
- [ ] Set up GitHub Actions infrastructure
- [ ] Create `data-updates` branch
- [ ] Configure GitHub Pages (article-time.de custom domain)

**Deliverables:**
- [ ] Umami API key generated and tested
- [ ] GitHub Actions workflow skeleton created
- [ ] data-updates branch initialized
- [ ] GitHub Pages configured with custom domain
- [ ] All "control" issues (#38, #31) validated
- [ ] Legal pages published (#49, #41)

---

### Phase 1A: Core Garden (MVP)
**Duration:** 6 weeks
**Goal:** Build digital garden sorting + engagement

**Week 1-2: Engagement Infrastructure**
- [ ] Umami script integrated in <head>
- [ ] Heart button component created
- [ ] Heart click tracks to Umami (event: 'heart')
- [ ] Visual feedback on heart click
- [ ] webmention.io endpoint setup
- [ ] Webmention <link> tags in <head>
- [ ] GitHub Actions workflow: fetch Umami hearts
- [ ] GitHub Actions workflow: fetch webmentions
- [ ] Test daily rebuild workflow

**Week 3: Growth Stage System**
- [ ] Add growth_stage frontmatter field
- [ ] Add withered_date, withered_reason fields
- [ ] Design 4 growth stage badges (🌱 🌿 🌳 💀)
- [ ] Implement badge display on cards
- [ ] Update archetypes with growth_stage default
- [ ] Create withered article warning banner

**Week 4-5: Popularity Scoring & Three-Tier Sorting**
- [ ] Write scripts/fetch-umami-hearts.js
- [ ] Write scripts/process-webmentions.js
- [ ] Write scripts/calculate-popularity.js
- [ ] Implement popularity formula: (hearts × 1) + (comments × 3) + (weight × 2)
- [ ] Add last_significant_update frontmatter field
- [ ] Implement grace period logic (28 days, configurable)
- [ ] Refactor layouts/home.html for three tiers
- [ ] Implement early promotion (≥20 points)
- [ ] Test sorting with mock data
- [ ] Commit data to data-updates branch workflow

**Week 6: Badges & Filters**
- [ ] Implement New badge logic (< 4 weeks since date)
- [ ] Implement Updated badge logic (in grace period)
- [ ] Build dual filter UI (format + growth stage)
- [ ] Write assets/js/filter.js (client-side filtering)
- [ ] Add data-format and data-stage attributes to cards
- [ ] Withered hidden by default logic
- [ ] "Show Withered" toggle button
- [ ] Test filtering combinations

**Launch Criteria:**
- [ ] All Phase 1A features tested
- [ ] 10+ articles with growth_stage assigned
- [ ] Daily rebuild tested for 7 days
- [ ] Umami hearts tracking verified
- [ ] Webmentions receiving verified
- [ ] Three-tier sorting validated
- [ ] Filters working (format + stage)

---

### Phase 1B: Format Expansion ⭐ **NEW PHASE**
**Duration:** 3 weeks
**Goal:** Implement 4 new content formats

**Week 7-8: Link & Video Formats**

**Link Format (3 days):**
- [ ] Create archetypes/links/index.md
- [ ] Add url, domain frontmatter fields
- [ ] Design link card (external icon, domain display)
- [ ] Create layouts/links/single.html (redirect or commentary page)
- [ ] Add external link icon SVG
- [ ] Test with 3-5 sample links

**Video Format (3 days):**
- [ ] Create archetypes/videos/index.md
- [ ] Add video_url, video_id, platform frontmatter fields
- [ ] Design video card (thumbnail, play icon, duration)
- [ ] Implement YouTube thumbnail fetch
- [ ] Create layouts/videos/single.html (embedded player)
- [ ] Make video embed responsive
- [ ] Test with YouTube and Vimeo videos

**Week 9: Gallery & Portfolio Formats**

**Gallery Format (4 days):**
- [ ] Create archetypes/galleries/index.md
- [ ] Design gallery card (image grid 2×2)
- [ ] Add photo count badge
- [ ] Create layouts/galleries/single.html (masonry layout)
- [ ] Implement lightbox/modal (vanilla JS or library)
- [ ] Extract captions from EXIF
- [ ] Implement lazy loading
- [ ] Test with 10-20 photo gallery

**Portfolio Format (3 days):**
- [ ] Create archetypes/portfolio/index.md
- [ ] Add project_url, github_url, tech_stack, role fields
- [ ] Design portfolio card (screenshot, tech badges, links)
- [ ] Create layouts/portfolio/single.html (case study layout)
- [ ] Add tech stack icons (SVG sprite or CDN)
- [ ] Test with 2-3 sample projects

**Testing & Integration:**
- [ ] Update filter UI to include all 6 formats
- [ ] Test each format with growth stages
- [ ] Test each format with popularity sorting
- [ ] Validate all formats on mobile
- [ ] Create sample content for each format

**Deliverables:**
- [ ] 6 archetypes (article, log, link, video, gallery, portfolio)
- [ ] 6 card designs
- [ ] 6 single page templates
- [ ] Filter UI with all formats
- [ ] Sample content for each format

---

### Phase 2: Polish & History
**Duration:** 2 weeks
**Goal:** Add transparency and visual polish

**Week 10:**
- [ ] Implement history frontmatter array
- [ ] Create layouts/_partials/widgets/history.html (sidebar)
- [ ] Show 3 most recent history entries
- [ ] Create full history section (article footer)
- [ ] Timeline styling (CSS)
- [ ] Update archetypes with history template
- [ ] Exclude history from RSS feed
- [ ] Implement withered in RSS: title suffix "[Withered Nov 2025]"
- [ ] Implement withered in sitemap: use withered_date for lastmod

**Week 11:**
- [ ] Create OG image template (1200×630 PNG)
- [ ] Implement Hugo image processing for OG images
- [ ] Add growth stage badge to OG images
- [ ] Test OG images on Twitter, Facebook, LinkedIn
- [ ] Update Schema.org markup (add growth_stage, history)
- [ ] Implement <noscript> banner (JS required message)
- [ ] Performance optimization pass (Lighthouse audit)
- [ ] Accessibility audit (WCAG AA compliance)
- [ ] Fix any issues found

**Deliverables:**
- [ ] History timeline functional (sidebar + footer)
- [ ] OG images with stage badges
- [ ] Withered content in SEO/RSS properly marked
- [ ] Schema.org updated
- [ ] Lighthouse score >90
- [ ] WCAG AA compliant
- [ ] No-JS banner displays

---

### Phase 3: Federated Community
**Duration:** 2 weeks
**Goal:** POSSE automation + advanced webmentions

**Week 12:**
- [ ] Set up Mastodon account (if not exists)
- [ ] Generate Mastodon API token
- [ ] Add GitHub Secret: MASTODON_TOKEN, MASTODON_INSTANCE_URL
- [ ] Write scripts/posse-mastodon.js
- [ ] Test Mastodon posting manually
- [ ] Add Mastodon POSSE to GitHub Actions workflow
- [ ] Test automated Mastodon posting
- [ ] Evaluate Threads API availability
- [ ] IF Threads API available: Write scripts/posse-threads.js
- [ ] IF Threads API not ready: Document manual posting process

**Week 13:**
- [ ] Implement advanced webmention display
- [ ] Add reply context/threading logic
- [ ] Display author avatars (from webmention data)
- [ ] Add conversation threading UI
- [ ] Add syndication links in article footer
- [ ] Create Facebook manual posting guide
- [ ] Create Reddit manual posting guide (10:1 rule)
- [ ] Test full POSSE workflow (Mastodon → Webmention loop)

**Deliverables:**
- [ ] Mastodon POSSE automation working
- [ ] Threads POSSE (automated or manual guide)
- [ ] Facebook posting guide (personal profile)
- [ ] Reddit posting guide (community engagement)
- [ ] Advanced webmention threading
- [ ] Reply context displays
- [ ] Syndication links in footer

---

### Phase 4: Future Enhancements
**Duration:** Ongoing
**Goal:** Nice-to-have features, experimentation

**Features (as time permits):**
- [ ] Webring integration (#146)
- [ ] Sidenotes (#157)
- [ ] Error/info notifications (#46)
- [ ] Concept-based related articles (TF-IDF)
- [ ] Visual garden map (force-directed graph)
- [ ] Additional formats (if needed): Quote, Book, Event

**Priority:** Low (ongoing, as inspiration strikes)

---

## Dependencies & Risks

*(Same risks as v1.0, with updates)*

### Critical Path Dependencies ⭐ **UPDATED**

```
Phase 0: Foundation Cleanup
    ↓
Epic 1: Engagement Infrastructure (Umami Cloud + webmentions)
    ↓
Epic 3: Popularity Scoring Engine
    ↓
Epic 4: Three-Tier Sorting
    ↓
Epic 5: Badge & Filter System
    ↓
Epic 8: Format Expansion (can be parallel to Epics 6-7)
    ↓
Phase 1 Complete (Core Garden + Formats)

Epic 2: Growth Stages (parallel to Epic 1)
Epic 6: History Timeline (parallel to Epic 8)
Epic 7: POSSE (Phase 3, after Phase 1 complete)
```

**Blocker:** Epic 1 must complete before Epic 3 (can't score without engagement data)
**Blocker:** Epic 3 must complete before Epic 4 (can't sort without scores)
**Non-blocking:** Epic 8 (formats) can develop parallel to Epics 6-7

---

### Technical Risks ⭐ **UPDATED**

#### Risk 1: Umami Cloud API Rate Limiting ⭐ **MITIGATED**
**Probability:** LOW (was Medium in v1.0)
**Impact:** High (blocks daily rebuild)

**Update:**
- Angel confirmed Umami Cloud Hobby FREE plan includes API access
- 1 fetch/day = 30 calls/month (well under any limits)
- No cost concerns

**Mitigation:**
- ✅ Free plan confirmed working
- Monitor API response times
- Implement exponential backoff if rate limits hit
- Fallback: Self-host if free plan discontinued (unlikely)

---

#### Risk 2: Webmention Spam
*(Same as v1.0)*

---

#### Risk 3: GitHub Actions Build Failures
*(Same as v1.0, updated for GitHub Pages)*

**Update:**
- GitHub Pages has no strict build time limits (unlike Netlify 300 min/month)
- Build failures less costly (no paid tier needed)

---

#### Risk 4: Performance Degradation (Large Dataset)
*(Same as v1.0, updated for multiple formats)*

**Update:**
- 6 formats × average 50 articles each = 300 total items
- Hugo handles 1000+ pages easily
- GitHub Pages serves static files (no server-side processing)
- Image processing cached in /resources/

**Mitigation:**
- Monitor build times (expect <5 min for 300 articles)
- Implement pagination if homepage >100 items
- Lazy load images in Gallery format

---

#### Risk 5: Complex Sorting Logic Bugs
*(Same as v1.0)*

---

#### Risk 6: Format-Specific Complexity ⭐ **NEW RISK**
**Probability:** Medium
**Impact:** Medium (format bugs, inconsistent UX)

**Description:**
- 6 formats = 6 archetypes, 6 card designs, 6 templates
- Potential for bugs in format-specific logic
- Inconsistent styling across formats
- Filter complexity with 6 format options

**Mitigation:**
- Shared base template (DRY principle)
- Consistent card structure across formats
- Comprehensive testing for each format
- Beta test all formats before Phase 1B complete
- Document format decision matrix (when to use which)

---

#### Risk 7: Threads API Unavailability ⭐ **NEW RISK**
**Probability:** Medium
**Impact:** Low (fallback to manual)

**Description:**
- Threads API is new (2024), may have restrictions
- API may require business account or verification
- Rate limits unknown

**Mitigation:**
- Evaluate Threads API in Phase 3
- If not available: Document manual posting workflow
- Focus on Mastodon automation (guaranteed)
- Threads automation is "nice-to-have", not critical

---

### Business Risks

*(Same as v1.0)*

---

## Final Decisions Detail ⭐ **NEW SECTION**

### Decision 1: Withered Content Handling

**Decision:** Hide by default, include in SEO/RSS with "[Withered DATE]" suffix

**Rationale:**
- Clean homepage for new visitors (only current content)
- Transparency via RSS/SEO (subscribers/search engines see deprecation)
- Explicit user choice (toggle to show withered)
- Archive page already exists for historical browsing

**Implementation:**

**Filter UI:**
```js
// Default state
activeFilters.stage = 'all-except-withered';

// Explicit toggle
<button data-filter="show-withered">
  Show Withered Content ({{ witheredCount }})
</button>
```

**RSS Feed:**
```xml
<item>
  <title>
    {{ .Title }}
    {{ if eq .Params.growth_stage "withered" }}
      [Withered {{ .Params.withered_date | dateFormat "Jan 2006" }}]
    {{ end }}
  </title>
  <description>
    {{ if eq .Params.growth_stage "withered" }}
      ⚠️ This content is deprecated as of {{ .Params.withered_date }}.
      {{ with .Params.withered_reason }}Reason: {{ . }}{{ end }}
    {{ end }}
    {{ .Summary }}
  </description>
</item>
```

**Sitemap:**
```xml
<url>
  <loc>{{ .Permalink }}</loc>
  <lastmod>
    {{ if .Params.withered_date }}
      {{ .Params.withered_date }}
    {{ else }}
      {{ .Lastmod }}
    {{ end }}
  </lastmod>
  <changefreq>
    {{ if eq .Params.growth_stage "withered" }}yearly{{ else }}weekly{{ end }}
  </changefreq>
  <priority>
    {{ if eq .Params.growth_stage "withered" }}0.3{{ else }}0.7{{ end }}
  </priority>
</url>
```

**Frontmatter:**
```yaml
growth_stage: "withered"
withered_date: 2025-11-13
withered_reason: "Framework deprecated, see new article: /new-approach/"
```

---

### Decision 2: Grace Period Duration

**Decision:** 4 weeks (28 days), configurable in params.yaml

**Rationale:**
- Balanced (not too short, not too long)
- Aligns with "New" badge (also 4 weeks)
- Easy to adjust based on data

**Implementation:**
```yaml
# config/_default/params.yaml
digital_garden:
  grace_period_days: 28  # Change to 14 or 42 if needed
```

**Re-evaluation Plan:**
- After 3 months: Analyze grace period tier size
- Target: 30-40% of homepage in grace period
- Adjust if needed (2 weeks or 6 weeks)

---

### Decision 3: Pinned Article Limit

**Decision:** Exactly 3 articles (enforced in template)

**Rationale:**
- Forces curation (only absolute best)
- Doesn't dominate homepage (with 6 per page = 50%)
- Clear "Top 3" mental model

**Implementation:**
```html
{{ $pinned := where .Pages "Params.weight" "eq" 10 | first 3 }}
```

---

### Decision 4: Format Expansion

**Decision:** Implement all 6 formats (Article, Log, Link, Video, Gallery, Portfolio)

**Rationale:**
- No rush to launch (quality over speed)
- Diverse content types showcase flexibility
- Formats ready when inspiration strikes

**Timeline:**
- Phase 1A: Article, Log (existing)
- Phase 1B Week 7-8: Link, Video (lightweight)
- Phase 1B Week 9: Gallery, Portfolio (complex)

**Instagram format REMOVED:** Identical to Log, not needed

---

### Decision 5: Webmention Moderation

**Decision:** Auto-approve all, monitor for spam >10%

**Rationale:**
- Low traffic initially = low spam risk
- Real-time display encourages engagement
- Easy to add moderation later if needed

**Monitoring:**
- Weekly spam rate check
- If spam >10%: Implement whitelist
- If spam >30%: Implement manual review

---

### Decision 6: Umami Hosting

**Decision:** Umami Cloud Hobby (FREE plan with API access)

**Rationale:**
- Angel already has account on free plan
- Free plan includes API access (confirmed)
- Zero setup overhead
- No monthly cost
- No maintenance burden

**Setup:**
1. Generate API key: Umami Cloud → Settings → API Keys
2. Add to GitHub Secrets: UMAMI_API_KEY, UMAMI_WEBSITE_ID
3. Done!

---

### Decision 7: Deployment Platform

**Decision:** GitHub Pages

**Rationale:**
- Free forever
- Simple setup
- Custom domain support (article-time.de)
- HTTPS included
- Handles thousands of images
- No build minute limits (unlike Netlify)

**Limits:**
- 1 GB repo (plenty)
- 100 GB/month bandwidth (supports ~100K pageviews)
- Build time: ~2-5 min (acceptable)

---

### Decision 8: OG Image Generation

**Decision:** Hugo image processing (build-time)

**Rationale:**
- No external dependencies
- Free (no API costs)
- Full control
- Cached (fast subsequent builds)

**Implementation:**
- Hugo processes images during build
- Once generated, images are static files
- No per-request regeneration
- Growth stage badges overlaid via Hugo

---

### Decision 9: POSSE Platforms

**Decision:** Automate Mastodon + Threads (try), Manual Facebook + Reddit

**Rationale:**

**Mastodon:**
- Free API, well-documented
- IndieWeb-aligned
- Active tech community
- Automated in Phase 3

**Threads:**
- Meta API available (2024)
- Growing platform
- Attempt automation, fallback to manual if complex

**Facebook:**
- Personal profile API restricted (TOS)
- Manual posting (tailored to friends/family)
- 2-3 min per article

**Reddit:**
- Anti-spam rules vary by subreddit
- Requires community engagement (10:1 rule)
- Manual posting + participation
- 10 min per article

---

### Decision 10: Data File Storage

**Decision:** Commit to `data-updates` branch (separate from main)

**Rationale:**
- Clean main branch (no daily commit noise)
- Data history preserved (can inspect past scores)
- Local development (merge data-updates to test)
- Transparency (public data visible)

**Workflow:**
```yaml
# Daily rebuild
1. Fetch engagement data
2. Calculate scores
3. Commit to data-updates branch (preserves history)
4. Copy data to main workspace (NOT committed)
5. Build Hugo site
6. Deploy to GitHub Pages
```

**Accessing historical data:**
```bash
git checkout data-updates
git log -- data/popularity_scores.json
git show <commit>:data/popularity_scores.json
```

---

## Appendices

*(Same as v1.0, with additions)*

### Appendix A: Frontmatter Schema Reference ⭐ **UPDATED**

**Full Schema (All Formats):**

```yaml
---
# Core Fields (All Formats)
title: "Article Title Here"
slug: "custom-slug-if-needed"
subtitle: "Optional subtitle"
date: 2025-11-13
lastmod: 2025-11-13
publishdate: 2025-11-13
draft: false

# Digital Garden Fields (All Formats)
growth_stage: "seedling"  # seedling, budding, evergreen, withered
last_significant_update: 2025-11-13  # Triggers grace period
weight: 5  # 1-10 scale (10 = pinned, max 3 site-wide)

# Format Field (Determines card/template)
format: "article"  # article, log, link, video, gallery, portfolio

# History Tracking (All Formats)
history:
  - date: 2025-11-13
    note: "Initial planting 🌱"
  - date: 2025-12-01
    note: "Expanded examples section"

# Withered Fields (If Deprecated)
withered_date: 2025-11-13  # When deprecated
withered_reason: "Framework deprecated, see: /new-article/"

# Taxonomies (All Formats)
categories: ["Technology"]
tags: ["Hugo", "Digital Garden"]
series: ["Building a Digital Garden"]
authors: ["angel"]

# SEO (All Formats)
summary: "Required summary for cards (120-158 chars ideal)"

params:
  SEO:
    desc: "Optional SEO description (else uses summary)"
    keywords: ["hugo", "digital garden"]
    canonicalURL: ""  # For cross-posting

# Format-Specific Fields

# LINK FORMAT
url: "https://example.com/article"
domain: "example.com"  # Auto-extracted from url

# VIDEO FORMAT
video_url: "https://youtube.com/watch?v=dQw4w9WgXcQ"
video_id: "dQw4w9WgXcQ"
platform: "youtube"  # or "vimeo"
duration: "12:34"

# GALLERY FORMAT
# (No special fields - images in resources folder)

# PORTFOLIO FORMAT
project_url: "https://example-project.com"
github_url: "https://github.com/angel/project"
tech_stack: ["Vue.js", "Node.js", "PostgreSQL"]
role: "Full-stack Developer"
year: 2024
client: "Example Inc."  # Optional
---
```

---

### Appendix B: Glossary

*(Same as v1.0, with format additions)*

**Content Format:**
The type of content (article, log, link, video, gallery, portfolio). Determines card layout and single page template. Independent of growth stage.

---

### Appendix C: Success Metrics Dashboard

**Phase 1A Launch Metrics:**
- [ ] 10+ articles with growth_stage assigned
- [ ] Daily rebuild success rate: >95%
- [ ] Heart button functional on 100% of articles
- [ ] Webmentions received and displayed
- [ ] Homepage sorting verified (all three tiers)
- [ ] Filter UI functional (format + stage)
- [ ] Privacy policy updated
- [ ] Zero tracking cookies

**Phase 1B Launch Metrics:** ⭐ **NEW**
- [ ] All 6 formats implemented and tested
- [ ] Sample content for each format (2-3 examples minimum)
- [ ] Format filter working (6 options)
- [ ] Card designs consistent across formats
- [ ] Single page templates responsive on mobile

**3-Month Post-Launch Metrics:**
- [ ] 50% of articles updated (history entries added)
- [ ] Average 3+ history entries per article
- [ ] Top 5 articles: 15+ popularity points
- [ ] 40% of sessions use filters
- [ ] 10+ webmentions on popular articles
- [ ] Time-on-site increased by 20%
- [ ] **NEW:** All 6 formats in active use

**6-Month Goals:**
- [ ] 80% of articles have visible history
- [ ] Evergreen articles: 2x traffic vs seedlings
- [ ] POSSE automation: 100% success rate (Mastodon)
- [ ] Bounce rate decreased by 15%
- [ ] 100% GDPR compliance maintained
- [ ] **NEW:** 50+ articles across all 6 formats

---

### Appendix D: Reference Links

*(Same as v1.0)*

---

### Appendix E: Timeline Comparison ⭐ **NEW**

| Version | Total Duration | Key Changes |
|---------|----------------|-------------|
| **v1.0 (Initial)** | 8-12 weeks | 4 phases, basic formats |
| **v1.1 (Final)** | 14 weeks | 4 phases + Format Expansion, no rush |

**Why longer:**
- +3 weeks for 4 new formats (Link, Video, Gallery, Portfolio)
- Quality over speed philosophy
- Comprehensive testing for each format

**Why not longer:**
- Umami Cloud (no self-host setup time)
- GitHub Pages (simple deployment)
- Mastodon automation only (no multi-platform complexity upfront)

---

## Document Status

**Current Version:** 1.1 (Final Decisions Incorporated)
**Last Updated:** 2025-11-13
**Next Review:** After Phase 1A Launch

**Approval:**
- ✅ Product Owner (Angel) - **APPROVED**
- ✅ Business Analyst (Mary) - **APPROVED**
- ⏭️ Technical Review - Pending (Phase 0)

**Change Log:**
- 2025-11-13 v1.0: Initial PRD created from brainstorming + codebase analysis
- 2025-11-13 v1.1: ⭐ **Updated with all 10 final decisions from Angel**
  - Format expansion: 6 formats (added Link, Video, Gallery, Portfolio)
  - Umami Cloud Hobby (FREE plan confirmed)
  - GitHub Pages deployment
  - Withered content in SEO/RSS
  - POSSE platforms (Mastodon + Threads auto, FB + Reddit manual)
  - data-updates branch strategy
  - Timeline extended to 14 weeks (quality over speed)

---

*End of Product Requirements Document v1.1*

**Status: ✅ APPROVED - Ready for Phase 0 Implementation**

**Next Document:** Phase 0 Detailed Task Breakdown
