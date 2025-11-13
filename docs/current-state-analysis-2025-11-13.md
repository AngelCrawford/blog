# Current State Analysis: Article Time Blog

**Analysis Date:** 2025-11-13
**Analyst:** Mary (Business Analyst)
**Purpose:** Document actual implemented features vs historical experiments to inform Digital Garden PRD

---

## Executive Summary

After inspecting the codebase, the current "Article Time" blog is a **clean, minimal Hugo static site** with:
- ✅ **2 content types:** Articles + Logs
- ✅ **Basic sorting:** Weight-based pinning + date sorting
- ✅ **Taxonomy system:** Categories, tags, authors, series
- ✅ **Responsive design:** Bulma CSS framework with PurgeCSS
- ✅ **Image optimization:** WebP conversion, responsive images
- ✅ **SEO foundation:** Meta tags, canonical URLs, sitemap, robots.txt

**What's NOT currently implemented** (despite closed GitHub issues):
- ❌ No analytics (Umami or otherwise)
- ❌ No webmentions or IndieWeb features
- ❌ No deployment automation (GitHub Actions)
- ❌ No engagement tracking (likes/hearts)
- ❌ No comments system (Staticman was removed)
- ❌ No growth stages or badges
- ❌ No format filtering beyond articles/logs

This is a **clean slate** for digital garden transformation - minimal technical debt from historical experiments.

---

## Current Implementation Details

### 1. Content Structure

#### Content Types
**Articles** (`content/articles/`)
- Full-featured blog posts
- Frontmatter: title, subtitle, date, lastmod, weight, categories, tags, series, authors, summary
- Supports cover images (converted to WebP)
- Image captions from EXIF data
- Card layout with optional ribbon (category badge)

**Logs** (`content/logs/`)
- Lightweight, microblog-style entries
- Frontmatter: title, date, categories, tags, authors (no summary required)
- One-line content, no detail pages
- Card layout optimized for logs

#### Content Organization
```
content/
├── articles/     # Blog posts (full detail pages)
├── logs/         # Microblog entries (card-only)
├── authors/      # Author taxonomy pages
├── categories/   # Category taxonomy pages
├── tags/         # Tag taxonomy pages
├── series/       # Series taxonomy pages
└── pages/        # Static pages (about, contact, etc.)
```

#### Archetypes (Templates)
- `archetypes/articles/index.md` - Article template with full frontmatter, SEO guidance
- `archetypes/logs/index.md` - Log template (minimal frontmatter)
- `archetypes/default.md` - Fallback template

**Key Archetype Features:**
- SEO optimization hints (60-70 char titles, 120-158 char descriptions)
- Image handling instructions (cover.* naming, WebP conversion)
- Shortcode examples (tags, YouTube, rating, message boxes)
- Weight system documentation (1 = sticky, 0+ = sorted)

---

### 2. Sorting & Display Logic

#### Current Homepage Sorting (from `layouts/home.html`)

**Three-tier sorting** (already partially implemented!):
1. **Tier 1:** Articles with `weight > 0`, sorted by weight (sticky/pinned)
2. **Tier 2:** Articles with `weight <= 0`, sorted by publish date (reverse chronological)
3. **Tier 3:** Articles without weight parameter, sorted by publish date (reverse chronological)

**This is similar to your digital garden vision but simpler:**
- ✅ Tier 1 = Pinned (matches garden "Pinned" tier)
- ✅ Tier 2/3 = Date-sorted (needs to become "Grace Period" + "Established")

**Pagination:**
- 6 items per page (`config.yaml`: `pagerSize: 6`)
- Traditional pagination (not infinite scroll)

---

### 3. Card System

#### Card Layout (`layouts/_partials/card.html`)

**Features:**
- Responsive grid (1 col mobile, 2 col desktop, 3 col fullhd)
- Horizontal cards with optional image
- Category ribbon (colored badge from first category)
- Sticky indicator (weight: 1 adds `is-fixed` class)
- Log format indicator (adds `is-log` class)
- Date + lastmod display (shows pencil icon if updated)
- Tag list
- Image with EXIF caption
- Truncated summary (1000 chars no image, 500 chars with image)

**CSS Classes Used:**
- `.card.is-horizontal` - Base card
- `.has-image` - Card with cover image
- `.has-ribbon` - Card with category badge
- `.is-fixed` - Sticky/pinned article (weight: 1)
- `.is-log` - Log format

**Responsive Images:**
- Articles: 320x480 portrait (desktop), 480x320 landscape (mobile)
- Logs: 600x480 fill
- Lazy loading enabled
- WebP format

---

### 4. Taxonomies

#### Configured Taxonomies (`config.yaml`)
- **Categories:** Primary classification (only first one shown on card)
- **Tags:** Multiple tags per article
- **Authors:** Multi-author support
- **Series:** Group related articles

**Category Colors:**
- Categories can have `categoryColor` parameter
- Applied to ribbon background color
- Example: `style="background-color: {{.Params.categoryColor}}"`

#### Related Posts System
Built-in Hugo related content with weighted indices:
- Series: weight 3 (strongest)
- Categories: weight 2
- Authors: weight 1
- Threshold: 20 (minimum similarity score)

---

### 5. Design System

#### CSS Framework
**Bulma v1.0.4** with PurgeCSS optimization
- Grid system: `.fixed-grid`, `.grid`
- Responsive breakpoints: mobile, tablet, desktop, widescreen, fullhd
- Components: cards, ribbons, tags, pagination
- Typography: Montserrat + Montserrat Alternates (Google Fonts)

**Icons:**
- Remix Icon system
- SVG sprite loading: `/fonts/remixicon/remixicon.symbol.svg`
- Timestamped cache busting: `?t={{ .Site.Params.remixicon_version }}`

**Build Process:**
- PostCSS with PurgeCSS for production builds
- Development: `hugo server` (full CSS)
- Production: `hugo server --environment production` (purged CSS)

---

### 6. SEO & Meta

#### Implemented SEO Features (from closed issues)
✅ **Meta Tags** (#181 - closed June 2025)
- Standard meta tags
- Open Graph tags (partial - #116 still open for share images)
- Schema.org structured data (partial - #173 still open for validation)

✅ **Canonical URLs** (#180 - closed June 2025)
- Frontmatter: `params.SEO.canonicalURL`
- Use for cross-posting or homage to other articles

✅ **Sitemap** (#171 - closed June 2025)
- Auto-generated sitemap.xml
- Weekly changefreq
- Custom template: `layouts/sitemap.xml`

✅ **Robots.txt** (#172 - closed June 2025)
- Search engine directives

✅ **Security Headers** (#38 - still open for validation)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
- Cache-Control headers for assets (1 year), HTML (1 hour)

✅ **RSS Feed** (#31 - still open for validation)
- Custom RSS template: `layouts/rss.xml`
- Output: `/index.xml`
- Linked in header/footer navigation

#### SEO Archetype Guidance
Articles archetype includes SEO best practices:
- 60-70 character titles
- 120-158 character descriptions
- 1-3 keywords max
- Keyword in title, H1, URL, intro, conclusion
- No keyword stuffing warnings

---

### 7. Image Handling

#### Optimization Pipeline
**WebP Conversion:**
- All images auto-converted to WebP
- Quality: 75 (`config.yaml`: `imaging.quality: 75`)
- EXIF stripping: dates and geolocation removed for privacy

**Responsive Images:**
- `<picture>` elements with multiple sources
- Media queries for breakpoints
- Lazy loading: `loading="lazy"`

**Cover Images:**
- Naming convention: `cover.*` (any format)
- Hugo processes with `.Resources.GetMatch "cover*"`
- Placed in same folder as `index.md`

**Image Captions:**
- Extracted from EXIF ImageDescription field
- Set via: Windows Properties → Details → Description → Title
- Supports HTML in captions (`safeHTML` filter)

---

### 8. Frontmatter Schema (Current)

#### Articles Schema
```yaml
title: ""              # SEO meta title (60-70 chars)
slug: ""               # Optional, use for special chars
subtitle: ""           # Optional
date: 2025-11-13       # Publish date
lastmod: 2025-11-13    # Manual override (else uses git)
draft: true            # true/false
weight: 0              # 1 = sticky, 0+ = sorted

categories: [""]       # Only first one displayed
tags: [""]             # Multiple allowed
series: [""]           # Group related articles
authors: ["angel"]     # Multi-author support

summary: ""            # REQUIRED for articles

params:
  SEO:
    desc: ""           # 120-158 chars (else uses summary)
    keywords: [""]     # 1-3 keywords (else from tags)
    canonicalURL: ""   # Cross-posting URL
```

#### Logs Schema
```yaml
title: ""              # Internal only, not displayed on card
date: 2025-11-13
draft: true

categories: [""]
tags: [""]
authors: ["angel"]
# NO summary - logs use content directly
```

#### What's Missing for Digital Garden:
- ❌ `growth_stage` field (seedling, budding, evergreen, withered)
- ❌ `last_significant_update` field (triggers grace period)
- ❌ `history` array (evolution tracking)
- ❌ `format` field (article type: article, link, log, gallery, chat)
- ❌ Popularity score fields (hearts_count, comments_count, popularity_score)

---

### 9. Navigation & Layout

#### Base Template (`layouts/baseof.html`)
- Header with navigation (`_partials/_base/navigation.html`)
- Hero section (`_partials/_base/hero.html`)
- Main content block
- Footer (`_partials/_base/footer.html`)

#### Homepage (`layouts/home.html`)
- Title (H1)
- Summary (optional)
- Grid of cards (articles + logs)
- Pagination widget

#### Single Post (`layouts/single.html`)
- Full article/page template
- Complex layout (13KB file - largest template)
- Author bylines, series navigation, related posts
- Reading time calculation: 179 WPM (`params.yaml`)

#### List Pages (`layouts/list.html`)
- Taxonomy pages (categories, tags, authors, series)
- Archive pages
- Complex sorting logic (8.5KB file)

---

### 10. What Was Removed (Historical Experiments)

Based on README and closed issues, these were **tried and removed**:

❌ **Staticman Comments** (mentioned in README intro)
- Reason: "ditched later on"
- No traces in current codebase

❌ **Infinite Scroll** (#128 closed, #164 Pagination implemented)
- Traditional pagination won in the end

❌ **Sidenotes** (#157 closed June 2025)
- Was implemented, then removed

❌ **Search** (#163 closed June 2025)
- Was implemented, then removed
- README mentions "Dynamic Search in a Static Hugo Website" tutorial

❌ **Link Previews** (#32 still open, but likely abandoned)
- Enhancement, never implemented

**Three Complete Redesigns:**
- Angel mentioned: "I did THREE redesign, from scratch and more"
- Current codebase is clean, minimal - lesson learned from over-engineering?

---

## Current Open Issues Analysis

### 20 Open Issues (from GitHub CLI)

#### Control/Validation Issues (Need Testing)
- #176: Tests after deploy
- #173: Schema validation
- #116: Open Graph share images
- #38: Security headers validation
- #31: RSS feed validation

#### Todo (Planned Work)
- #95: No JavaScript fallback
- #70: Analytics (Umami)
- #67: Merge and Deploy (GitHub Actions)
- #49: Legal pages (Privacy, Notice)
- #41: Contact page

#### Enhancement (Later)
- #158: Format filter
- #147: IndieWeb - POSSE
- #146: IndieWeb - Webring
- #145: IndieWeb - Webmentions
- #124: IndieWeb (umbrella)
- #78: Like button
- #59: Possible formats
- #46: Error/info notifications
- #32: Link previews

---

## Gap: Current State → Digital Garden

### What You Have (Foundation)
✅ Multi-tier sorting system (weight-based)
✅ Card-based grid layout
✅ Responsive design
✅ Image optimization
✅ Taxonomy system (categories, tags, authors, series)
✅ Date + lastmod tracking
✅ Related posts system
✅ RSS feed
✅ SEO basics (meta, sitemap, robots)
✅ Clean frontmatter schema
✅ Build pipeline (Hugo + PostCSS + PurgeCSS)

### What You Need (Digital Garden Transform)
❌ **Engagement Tracking:**
  - Umami analytics setup (#70)
  - Heart events implementation (#78 reframed)
  - Webmention integration (#145)
  - Daily data fetch (GitHub Actions #67)

❌ **Growth Stage System:**
  - `growth_stage` frontmatter field (seedling → budding → evergreen → withered)
  - `last_significant_update` field
  - `history` array for evolution tracking
  - Badge system (New/Updated)
  - Withered article warnings

❌ **Popularity Scoring:**
  - Formula: (hearts × 1) + (comments × 3) + (weight × 2)
  - Early promotion logic (grace period + 20 points)
  - Sort by popularity in established tier

❌ **Grace Period Logic:**
  - 4-week visibility window after `last_significant_update`
  - Automatic tier placement
  - Grace period badge display

❌ **Dual Filter System:**
  - Format filter (article, link, log, gallery, chat) - #158
  - Growth stage filter (🌱 🌿 🌳 💀)
  - Client-side JS filtering

❌ **Format System Expansion:**
  - Beyond articles/logs: link, gallery, chat, instagram, quote
  - Format determines card layout, not sorting
  - All formats support growth_stage field

❌ **History Timeline:**
  - Sidebar widget showing 3 recent entries
  - Full history in article footer
  - Growth stage transition tracking

❌ **Deployment Automation:**
  - GitHub Actions workflow (#67)
  - Daily rebuilds for fresh engagement data
  - Umami + webmention fetch scripts

---

## Technical Architecture

### Current Tech Stack
- **Static Site Generator:** Hugo Extended 0.147
- **CSS Framework:** Bulma 1.0.4
- **CSS Processing:** PostCSS + PurgeCSS
- **Icons:** Remix Icon (SVG sprite)
- **Fonts:** Google Fonts (Montserrat)
- **Image Format:** WebP
- **Hosting:** TBD (article-time.de)
- **Version Control:** Git + GitHub
- **Editor:** Windsurf (VS Code fork)
- **Platform:** Windows
- **Node.js:** For PostCSS build

### Build Commands
- Development: `hugo server`
- Production: `hugo server --environment production`
- Content creation: `hugo new content articles/my-title`

### Configuration Structure
```
config/
├── _default/
│   ├── config.yaml   # Hugo core config
│   └── params.yaml   # Theme parameters
├── development/
│   ├── config.yaml   # Dev overrides
│   └── params.yaml
└── production/
    ├── config.yaml   # Prod overrides
    └── params.yaml
```

---

## Recommended Migration Strategy

### Phase 0: Foundation Cleanup (Pre-Garden)
1. ✅ **Already done** - Clean codebase, removed experiments
2. ⏭️ Complete open "control" issues (#173, #116, #38, #31, #176)
3. ⏭️ Add legal pages (#49: Privacy Policy, Legal Notice)
4. ⏭️ Add contact page (#41)

### Phase 1: Core Garden (New Work)
Build the digital garden sorting + engagement system:
1. **Analytics Setup** (#70) - Umami installation
2. **Heart Events** (#78 reframed) - Anonymous engagement tracking
3. **Webmentions** (#145) - Federated comments
4. **GitHub Actions** (#67) - Daily rebuild + data fetch
5. **Growth Stage System** - New frontmatter fields + logic
6. **Popularity Scoring** - Formula implementation
7. **Grace Period Logic** - 4-week visibility window
8. **Badge System** - New/Updated badges
9. **Dual Filter UI** (#158 extended) - Format + Growth stage filters

### Phase 2: Polish & History
Enhance the garden with evolution tracking:
1. **History Timeline** - Sidebar widget
2. **Withered Handling** - Deprecation warnings
3. **Share Images** (#116) - OG images with growth badges
4. **Schema Updates** (#173) - Include garden metadata
5. **No-JS Banner** (#95) - Simple `<noscript>` message

### Phase 3: Federated Community
Enable POSSE and advanced webmentions:
1. **POSSE Automation** (#147) - Mastodon syndication
2. **Webmention Threading** (#145 extended) - Reply context
3. **Webring** (#146) - Community discovery

### Phase 4: Future Enhancements
1. **Concept-based Related** - TF-IDF similarity
2. **Visual Garden Map** - Force-directed graph
3. **Format Expansion** (#59) - New content types
4. **Notifications** (#46) - Garden tending announcements

---

## Key Insights for PRD

### 1. You Have a Solid Foundation
Your current blog is **NOT** bloated with failed experiments. It's clean, minimal, and well-architected. The three redesigns taught you what NOT to do.

### 2. Sorting System Partially Exists
The three-tier sorting in `home.html` is a great starting point:
- Tier 1 (weight > 0) → Pinned tier ✅
- Tier 2/3 (date-sorted) → Needs to split into Grace Period + Established

### 3. No Technical Debt from Closed Issues
Closed issues represent learning experiments, not current state:
- Most features from closed issues are NOT in the codebase
- Don't assume anything is implemented based on closed issues
- Verify everything in actual code

### 4. Card System is Garden-Ready
Your card partial already supports:
- Weight-based styling (`.is-fixed`)
- Format detection (`.is-log`)
- Ribbons (category badges)
- Update indicators (lastmod pencil icon)

**Easy to extend for:**
- Growth stage badges (🌱 🌿 🌳 💀)
- New/Updated badges
- Popularity indicators
- Grace period highlighting

### 5. Frontmatter Schema is Extensible
Current schema is clean and focused. Easy to add:
- `growth_stage: "seedling"`
- `last_significant_update: 2025-11-13`
- `history: [...]`
- `format: "article"`

No conflicts or legacy fields to remove.

### 6. Build Pipeline is Modern
PostCSS + PurgeCSS + Hugo pipes = fast, optimized builds. Ready for:
- Daily GitHub Actions rebuilds
- API data fetching (Umami, webmentions)
- Popularity score calculation
- Static JSON generation for client-side filtering

---

## Conclusion

**Current State:** Clean, minimal Hugo blog with solid foundation (sorting, cards, taxonomies, SEO).

**Historical Baggage:** Minimal - three redesigns removed failed experiments.

**Readiness for Garden:** HIGH - no major refactoring needed, mostly additive changes.

**Critical Path:**
1. Engagement tracking (#70, #78, #145, #67) - Foundation for popularity scoring
2. Growth stage system - New frontmatter + logic
3. Popularity formula - Combine engagement + weight
4. Grace period - 4-week visibility window
5. Filters - Format + Growth stage (client-side)

**PRD Should Focus On:**
- NEW capabilities (growth stages, engagement, popularity)
- EXTENDING existing systems (sorting tiers, card badges, frontmatter)
- INTEGRATION points (Umami API, webmention.io, GitHub Actions)

**NOT waste time documenting:**
- Closed issues that aren't implemented
- Removed features (Staticman, search, etc.)
- Historical experiments

---

*Analysis by Mary, Business Analyst*
*Next Step: Create unified PRD focused on digital garden transformation*
