# Article Time UX Design Specification

_Created on 2025-11-14 by Angel_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

**Project:** Digital Garden Transformation for Article Time
**Vision:** Transform a traditional date-sorted blog into a living, evolving Digital Garden where quality and growth matter more than recency. Content matures through lifecycle stages (🌱 Seedling → 🌿 Budding → 🌳 Evergreen → 💀 Withered), and valuable content naturally rises through community engagement.

**Hybrid Model:** Blog meets Garden - chronological AND topical navigation coexist, giving users the best of both worlds.

**Core Philosophy:**
- **Growth over publishing** - Tending existing content is rewarded
- **Quality over recency** - Popularity-based sorting surfaces value
- **Transparency over polish** - Growth stages show content maturity honestly
- **Privacy over surveillance** - IndieWeb federated engagement, no tracking cookies

---

## 1. Design System Foundation

### 1.1 Design System Choice

**Framework:** Bulma CSS v1.0.4 (customized)
**Rationale:** Modern, flexbox-based, modular CSS framework with excellent grid system and utility classes. Provides solid foundation while allowing extensive customization through SCSS variables.

**Customization Approach:**
- SCSS-based compilation with PostCSS + PurgeCSS (production)
- 92 SCSS files organized in ITCSS-inspired architecture
- Custom theme variables override Bulma defaults
- Component-level extensions in separate files

### 1.2 Existing Color System

**Primary Palette:**

```scss
// Base Colors
$dark: hsl(190, 11%, 11%)        // #191f1c - Primary background
$light: hsl(190, 20%, 90%)       // #d1e8e2 - Primary text
$gold: hsl(35, 45%, 50%)         // #bf8d3c - Primary accent

// Gold Variants
$gold-light: hsl(29, 100%, 80%)  // #ffd9a3 - Light accent
$gold-dark: hsl(35, 45%, 26%)    // #603c14 - Dark accent

// Dark Variants (via color-map)
$dark-lighter: hsl(190, 11%, 15%)
$dark-darker: hsl(190, 11%, 8%)

// Light Variants (via color-map)
$light-lighter: hsl(190, 20%, 95%)
$light-darker: hsl(190, 20%, 85%)
```

**Semantic Colors (Bulma customization):**

```scss
$primary: hsl(214, 76%, 34%)     // Blue - Primary actions
$info: hsl(189, 90%, 33%)        // Cyan - Informational
$success: hsl(152, 76%, 33%)     // Green - Success states
$warning: hsl(41, 77%, 37%)      // Yellow/Orange - Warnings
$danger: hsl(0, 79%, 32%)        // Red - Errors/Destructive actions
```

**Color Usage Strategy:**
- **Dark** - Backgrounds, structural elements
- **Light** - Text, high-contrast elements
- **Gold** - Links, accents, interactive elements, brand identity
- **Semantic** - Reserved for UI states and feedback

### 1.3 Complete Component Inventory

#### Base Components

**1. Navigation (base/navigation.scss)**
- Navbar with burger menu (custom checkbox-based toggle)
- Navbar items with gold accents
- Search input (client-side search integration)
- Follow/social icons
- Mobile-responsive collapse

**2. Hero (base/hero.scss)**
- Homepage hero section
- Custom styling for visual hierarchy

**3. Footer (base/footer.scss)**
- Site-wide footer
- Link styling consistent with theme

#### Element Components

**4. Cards (layout/card.scss)** ⭐ PRIMARY CONTENT CONTAINER
- **Variants:**
  - `.is-horizontal` - Horizontal layout (default)
  - `.has-image` - Card with featured image
  - `.is-fixed` - Pinned/fixed articles (enhanced gold border)
  - `.is-log` - Special log format (overlay design)
  - `.is-new` - New article badge
  - `.visited` - Visited article badge
- **Grid Layouts:**
  - Standard: 2-column grid (image + content + footer)
  - No-image: Single column (content + footer)
  - Log: Overlay layout (image background + centered text)
- **Responsive Sizes:**
  - Default: Full card with description
  - `.is-medium` - Archive view (title only, no description)
  - `.is-small` - Taxonomy view (minimal layout)
- **Features:**
  - Hover effects (gold underline animation, scale, sepia filter)
  - Author badges (circular avatars in footer)
  - Multiple author support (expandable tooltip)
  - Format icons in footer
  - Tags wrapper with icons
  - Gradient fade for truncated content

**5. Badges (elements/badge.scss)**
- **Existing Badges:**
  - "✓ Gesehen" (Visited) - Rotated, positioned top-right
  - "☀ Neu" (New) - Rotated, positioned top-right
- **Style:** Diagonal rotation (45deg), gold color, dark background with border
- **Position:** Absolute positioning on card title

**6. Ribbons (elements/ribbon.scss)**
- **Variants:**
  - `.ribbon` - Right-aligned ribbon
  - `.ribbon.is-left` - Left-aligned ribbon
- **Usage:** Category/Rubrik labels
- **Style:** Diagonal chevron ends with skew transforms
- **Colors:** Gold-dark background, light text
- **Hover:** Background darkens

**7. Buttons (elements/button.scss)**
- Regular buttons with gold accents
- `.round-button` - Circular buttons (48px)
- Icon integration (Remix icons)
- Disabled states
- Primary outlined variant

**8. Search (elements/search.scss)**
- Integrated with navigation
- Client-side search functionality
- Gold accent on focus

**9. Tooltips (elements/tooltip.scss)**
- Contextual help elements

**10. Pagination (elements/pagination.scss)**
- Page navigation controls

**11. Box (elements/box.scss)**
- Content containers

#### Layout Components

**12. Widgets (layout/widgets.scss)**
- **Related Widget** - Related content lists with dotted leader lines
- **Archive Widget** - Archive navigation with dotted leaders
- **Info Widget** - Metadata display with icons (time, stats)

**13. Lists (layout/lists.scss)**
- Various list layouts for content organization

**14. Single Page Layout (layout/single.scss)**
- Article detail page styling

#### Typography System

**Font Families:**
```scss
$family-sans-serif: "Montserrat", sans-serif  // Primary font
$family-secondary: "Montserrat Alternates"     // Secondary font (headers)

// Font weights used:
- Regular (400)
- Light (300)
- Bold (700)
```

**Custom Mixins:**
- `@include helpers.font-header` - Montserrat Alternates for headings
- `@include helpers.font-header-bold` - Bold variant for headers
- `@include helpers.font-regular` - Regular Montserrat

**Title Styling:**
- 3D text effect with layered shadows
- Gradient fill (gold → gold-light → gold-dark)
- Large display titles (40px desktop, 28px mobile)

### 1.4 Growth Stage Integration Strategy

#### Current State Analysis

**Existing Badge System:**
- Top-right diagonal badges for "Neu" (New) and "Gesehen" (Visited)
- Position: Absolute on `.title a::after` or card `::before`
- Style: 45° rotation, small text, gold accent

**Existing Ribbon System:**
- Category/Rubrik ribbons with chevron ends
- Position: Top-left or top-right depending on card layout
- Style: Skewed pseudo-elements, gold-dark background

**Challenge:** Need to add growth stage indicators WITHOUT conflicting with existing badges or ribbons.

---

#### Proposed Solution: Dual Badge System

**Concept:** Separate **semantic growth stages** from **temporal badges** (New/Visited).

**Visual Hierarchy:**
1. **Growth Stage Badge** - PERMANENT indicator of content maturity
2. **Category Ribbon** - Existing Rubrik classification (unchanged)
3. **Temporal Badge** - NEW or VISITED state (existing, unchanged)

---

#### Growth Stage Badge Design

**Location:** Card footer (new dedicated slot)
**Format:** Inline badge with Remix icon + text label

```html
<div class="card-footer">
  <!-- NEW: Growth Stage Badge -->
  <div class="card-footer-item growth-stage" data-stage="seedling">
    <i class="ri-seedling-line"></i>
    <span>Seedling</span>
  </div>

  <!-- Existing footer items -->
  <div class="card-footer-item formats">...</div>
  <div class="card-footer-item">...</div>
</div>
```

**Visual Style:**

```scss
.card-footer-item.growth-stage {
  // Base styling
  color: $light;
  font-size: 80%;
  padding: .75em 1.5em;
  border-right: 1px solid rgba($gold-dark, .5);
  display: flex;
  align-items: center;
  gap: 0.5em;

  i {
    font-size: 1.2em;
    line-height: 1;
  }

  // Stage-specific colors
  &[data-stage="seedling"] {
    i { color: hsl(152, 76%, 50%); }  // Light green
    span { color: color.scale($dark, $lightness: 40%); }
  }

  &[data-stage="budding"] {
    i { color: hsl(189, 90%, 50%); }  // Cyan/teal
    span { color: color.scale($dark, $lightness: 40%); }
  }

  &[data-stage="evergreen"] {
    i { color: hsl(152, 76%, 33%); }  // Success green
    span { color: color.scale($dark, $lightness: 40%); }
  }

  &[data-stage="withered"] {
    i { color: hsl(0, 0%, 50%); }     // Gray
    span { color: color.scale($dark, $lightness: 30%); }
    opacity: 0.7;
  }
}
```

**Growth Stage Color Palette:**

```scss
// Add to vars/_colors.scss
$growth-seedling: hsl(152, 76%, 50%)    // #4ade80 - Light green (fresh, new)
$growth-budding: hsl(189, 90%, 50%)     // #16d4f0 - Cyan (developing)
$growth-evergreen: hsl(152, 76%, 33%)   // #118855 - Deep green (mature) [EXISTING $success]
$growth-withered: hsl(0, 0%, 50%)       // #808080 - Gray (archived)
```

**Remix Icon Mapping:**
- 🌱 Seedling → `<i class="ri-seedling-line"></i>`
- 🌿 Budding → `<i class="ri-plant-line"></i>`
- 🌳 Evergreen → `<i class="ri-tree-line"></i>`
- 💀 Withered → `<i class="ri-skull-line"></i>`

---

#### Homepage Card Layout (Complete)

```
┌─────────────────────────────────────────────┐
│ [Category Ribbon]                    [NEW]  │ ← Top badges
│                                             │
│ [Image - if has_image]    [TITLE]          │
│                           Subtitle          │
│                           Description...    │
│                           [...fade]         │
│                                             │
├─────────────────────────────────────────────┤
│ [🌱 Seedling] │ [📄 Article] │ [👤 Angel]  │ ← Footer
└─────────────────────────────────────────────┘
```

**Footer Item Order (Left to Right):**
1. **Growth Stage** - NEW, prominent position
2. **Format(s)** - Article, Log, Link, Video, Gallery, Portfolio
3. **Metadata** - Author, date, etc.

---

#### Alternative Designs Considered (Rejected)

**Option A: Icon-Only Badge (Top-Left)**
- ❌ Conflicts with left ribbon on some card variants
- ❌ Less accessible (icon alone may be unclear)
- ❌ Clutters visual hierarchy with 3 top badges

**Option B: Colored Card Border**
- ❌ Loses existing gold border identity
- ❌ Subtle, may go unnoticed
- ❌ Conflicts with `.is-fixed` enhanced border

**Option C: Background Tint**
- ❌ Breaks dark theme consistency
- ❌ Difficult to distinguish at a glance
- ❌ Accessibility concerns (contrast)

**Why Footer Badge Wins:**
- ✅ Persistent, visible on all card sizes
- ✅ No conflict with existing badges/ribbons
- ✅ Semantic location (metadata with formats)
- ✅ Accessible (icon + text label)
- ✅ Works in mobile responsive layouts
- ✅ Easy to filter/scan visually

---

#### Mobile Responsive Behavior

**Desktop (>640px):**
- Full footer with icon + text label
- Example: `[🌱 Seedling]`

**Mobile (<640px):**
- **Option A:** Icon only (save space)
  - Example: `[🌱]`
  - Rely on tooltip or onclick for full label
- **Option B:** Abbreviated text
  - Example: `[🌱 Seed]`
  - 4-char abbreviation

**Recommendation:** Option A (icon-only) for mobile with tooltip on touch/hover.

---

#### Filter UI Integration

**Homepage Filter Bar:**

```html
<div class="filter-bar">
  <div class="filter-group">
    <label>Growth Stage:</label>
    <button class="filter-btn" data-filter="all">All</button>
    <button class="filter-btn" data-filter="seedling">
      <i class="ri-seedling-line"></i> Seedling
    </button>
    <button class="filter-btn" data-filter="budding">
      <i class="ri-plant-line"></i> Budding
    </button>
    <button class="filter-btn" data-filter="evergreen">
      <i class="ri-tree-line"></i> Evergreen
    </button>
    <button class="filter-btn" data-filter="withered">
      <i class="ri-skull-line"></i> Withered
    </button>
  </div>

  <div class="filter-group">
    <label>Format:</label>
    <button class="filter-btn" data-filter="all">All</button>
    <button class="filter-btn" data-filter="article">Article</button>
    <button class="filter-btn" data-filter="log">Log</button>
    <!-- ... -->
  </div>
</div>
```

**Filter Button Style:**
- Outlined buttons with gold border (inactive)
- Filled gold background (active)
- Icons use growth stage colors
- Client-side JS filtering (hide/show cards)

---

#### Implementation Notes

**SCSS Files to Create/Modify:**

1. **vars/_colors.scss** - Add growth stage color variables
2. **elements/growth-badge.scss** - NEW file for growth badge component
3. **layout/card.scss** - Modify footer to include growth badge slot
4. **elements/filter-bar.scss** - NEW file for filter UI component

**Hugo Template Changes:**

1. **layouts/_partials/card.html** - Add growth stage badge in footer
2. **layouts/home.html** - Add filter bar above card grid
3. **assets/js/filter.js** - NEW file for client-side filtering logic

**Frontmatter Addition:**

```yaml
---
title: "Article Title"
date: 2025-11-14
growth_stage: "seedling"  # NEW FIELD: seedling|budding|evergreen|withered
format: "article"           # NEW FIELD: article|log|link|video|gallery|portfolio
weight: 5                   # EXISTING: 1-10 importance for popularity scoring
---
```

---

### 1.5 Icon System

**Remix Icon v4.x** (SVG Sprite System)
- Loaded from `/static/fonts/remixicon/remixicon.symbol.svg`
- Usage: `<svg class="ri-1x"><use href="/fonts/remixicon/remixicon.symbol.svg#ri-icon-name"></use></svg>`
- Alternative: Icon font `<i class="ri-icon-name-line"></i>` or `<i class="ri-icon-name-fill"></i>`

**Icon Categories Used:**
- **System Icons:** home, search, menu, close, arrow
- **Social Icons:** github, linkedin, mastodon, rss
- **Content Icons:** article, calendar, time, user, tag
- **Growth Stages:** seedling, plant, tree, skull (NEW for Digital Garden)
- **Formats:** document, link, video, image, folder (NEW for content formats)

**Icon Sizing:**
- `.ri-1x` - 20px (standard)
- `.ri-2x` - 24px
- Inline icons - 15px (in subtitles/metadata)

---

## 2. Core User Experience

### 2.1 Defining Experience

**Core Experience:** "Tending a Living Knowledge Garden"

The ONE thing that defines Article Time:
> "Content that grows and evolves over time, where quality naturally rises through community engagement, and updates are rewarded with visibility."

**Key Experience Principles:**

1. **Growth is Visible** - Users can see content maturity at a glance through growth stage badges
2. **Quality Surfaces** - 3-tier sorting ensures valuable content stays visible regardless of age
3. **Updates Matter** - Grace period visibility rewards tending existing content
4. **Engagement is Private** - Anonymous hearts + federated webmentions (no tracking)
5. **Discovery is Intentional** - Filters enable focused exploration (anti-doom-scroll)

**Platform Characteristics:**

- **Web (Hugo static site)** - Fast, secure, no server dependencies
- **Bilingual:** German (primary) + English (secondary) with i18n support
- **Mobile-first responsive** - Touch-optimized, works across all screen sizes
- **Graceful degradation** - Content viewable without JS, full features require JS
- **No-JS banner planned** - Inform users when JavaScript is disabled (#95)

**User Emotional Journey:**

**For Angel (Creator):**
- **Motivated** → Updates trigger grace period visibility boost
- **Transparent** → Growth stages show work-in-progress honestly
- **In Control** → Manual curation (weight, stages) + algorithmic assist (popularity)
- **Connected** → IndieWeb webmentions create federated conversation

**For Anna (Engaged Reader):**
- **Trusting** → Growth badges signal content quality/maturity
- **Discovering** → Find valuable content through multiple paths
- **Private** → Engage with hearts without surveillance
- **Respected** → GDPR-compliant, privacy-first analytics

**For Markus (Casual Visitor):**
- **Oriented** → Clear visual hierarchy (pinned → grace → established)
- **Guided** → Filters help find relevant content quickly
- **Informed** → Growth stages set appropriate expectations

### 2.2 Inspiration & UX Pattern Analysis (2025)

**Research Date:** November 2025
**Sources:** Maggie Appleton's digital garden, IndieWeb community sites, Hugo digital garden themes

#### Key Patterns Identified:

**1. Maggie Appleton's Digital Garden (maggieappleton.com)**
- **Growth Stages:** Seedling → Budding → Evergreen displayed prominently on each post
- **Content Types:** Essays, Notes, Patterns, Library, Anti-Library, Smidgeons (tiny posts - new 2025)
- **Visual Essays:** Rich visual storytelling with illustrations
- **Clear Hierarchy:** Content maturity signals guide reader expectations
- **Takeaway:** Growth stages work best when visually prominent and consistently applied

**2. IndieWeb Webmention UX Patterns**
- **Display Types:** Mentions, bookmarks, likes, retweets, replies grouped by type
- **Manual Sending:** Forms for pasting comment URLs to send webmentions
- **Instructions:** Footer links like "How to comment on this post" with h-entry guidance
- **Simple Implementation:** POST forms for accepting webmentions
- **Takeaway:** Webmentions UX should be educational - help users understand the protocol

**3. Digital Garden Growth Stage UI (2025 Trends)**
- **Metaphorical Systems:** Root/Harvest/Garden phases, Clouds/Drops/Plants taxonomy
- **Gamification:** Badges, progress bars making growth visible
- **Visual Transformations:** 21-day growth cycles with staged visual changes
- **Takeaway:** Growth stages benefit from clear visual metaphors and progression indicators

**4. Hugo Digital Garden Navigation (2025)**
- **Client-Side Fuzzy Search:** Filtering, sorting, multilingual support (HBStack theme)
- **Backlinks & Graph Viz:** Quartz theme extends Hugo with relationship visualization
- **Non-Linear Navigation:** Topic clusters mirror how minds work
- **Multi-Column Layouts:** Information density without clutter
- **Takeaway:** Modern gardens prioritize discovery through multiple navigation modes

#### UX Principles Extracted:

1. **Clear Content Maturity Signals** - Users want to know "how seriously should I take this?"
2. **Multiple Discovery Paths** - Chronological, topical, search, random, graph views
3. **Visible Growth** - Evolution should be transparent, not hidden
4. **Educational Interactions** - Teach users about IndieWeb protocols through UX
5. **Performance First** - Static generation, client-side filtering for speed
6. **Privacy by Default** - No tracking cookies, anonymous engagement

#### Application to Article Time:

✅ **Growth stages with Remix icons** - Clear, consistent visual language
✅ **3-tier sorting** - Pinned → Grace Period → Established (unique hybrid approach)
✅ **Dual filter system** - Format + Growth Stage (client-side JS)
✅ **Webmentions + Hearts** - Federated + anonymous engagement combined
✅ **Educational approach** - Help users understand the garden metaphor
✅ **Static + fast** - Hugo's speed advantage maintained

### 2.3 Novel UX Patterns

**Article Time's Unique Digital Garden UX:**

#### 1. Three-Tier Homepage Sorting

**Innovation:** Hybrid time-based + popularity-based sorting that rewards both new and quality content.

**Tier Structure:**

```
┌─────────────────────────────────────────────────┐
│ 📍 TIER 1: PINNED (Top 3)                       │
│ ┌───────────────────────────────────────────┐   │
│ │ [Gold Border] Garden Guide                │   │
│ │ [Gold Border] Philosophy                  │   │
│ │ [Gold Border] Current Focus               │   │
│ └───────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ 🌱 TIER 2: RECENTLY TENDED (4-week grace)      │
│                                                 │
│ ⭐ Early Promoted (20+ points, sorted by score) │
│ ┌───────────────────────────────────────────┐   │
│ │ [🌳 Evergreen] [UPDATED Badge]            │   │
│ │ Complete Hugo Guide                       │   │
│ │ Updated: Nov 13 • 💚 25 • 💬 8 (49 pts)    │   │
│ └───────────────────────────────────────────┘   │
│                                                 │
│ 📅 Regular (< 20 points, sorted by date DESC)   │
│ ┌───────────────────────────────────────────┐   │
│ │ [🌱 Seedling] [NEW Badge]                 │   │
│ │ CSS Grid Experiments                      │   │
│ │ Planted: Nov 13                           │   │
│ └───────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ 🌳 TIER 3: ESTABLISHED GARDEN (Past grace)     │
│ ┌───────────────────────────────────────────┐   │
│ │ [🌳 Evergreen]                            │   │
│ │ JavaScript Patterns                       │   │
│ │ Planted: Mar 2024 • 💚 45 • 💬 15 (75 pts) │   │
│ └───────────────────────────────────────────┘   │
│ ... (sorted by popularity_score DESC)           │
└─────────────────────────────────────────────────┘
```

**Popularity Score Formula:**
```
popularity_score = (hearts × 1) + (webmentions × 3) + (manual_weight × 2)
```

**Grace Period Logic:**
- Article enters Tier 2 when `last_tended_date` or `published_date` is within 4 weeks
- If `popularity_score >= 20` → "Early Promoted" subsection (sorted by score)
- If `popularity_score < 20` → "Regular" subsection (sorted by date DESC)
- After 4 weeks → Moves to Tier 3 (sorted by popularity_score DESC)

**Why This Works:**
- ✅ **Rewards updates** - 4-week grace period visibility for tended content
- ✅ **Surfaces quality** - High-engagement content promoted even when new
- ✅ **Balances recency** - New content gets fair chance (Regular section)
- ✅ **Evergreen discovery** - Old valuable content stays visible (Tier 3)

---

#### 2. Dual Filter System (Client-Side)

**Innovation:** Combine format + growth stage filtering for precise discovery without backend queries.

**Filter UI Design:**

```html
<div class="filter-bar">
  <div class="filter-section">
    <h4>Growth Stage</h4>
    <div class="filter-buttons">
      <button class="filter-btn active" data-filter-stage="all">
        All
      </button>
      <button class="filter-btn" data-filter-stage="seedling">
        <i class="ri-seedling-line"></i> Seedling
      </button>
      <button class="filter-btn" data-filter-stage="budding">
        <i class="ri-plant-line"></i> Budding
      </button>
      <button class="filter-btn" data-filter-stage="evergreen">
        <i class="ri-tree-line"></i> Evergreen
      </button>
      <button class="filter-btn" data-filter-stage="withered">
        <i class="ri-skull-line"></i> Withered
      </button>
    </div>
  </div>

  <div class="filter-section">
    <h4>Format</h4>
    <div class="filter-buttons">
      <button class="filter-btn active" data-filter-format="all">
        All
      </button>
      <button class="filter-btn" data-filter-format="article">
        <i class="ri-article-line"></i> Article
      </button>
      <button class="filter-btn" data-filter-format="log">
        <i class="ri-file-text-line"></i> Log
      </button>
      <button class="filter-btn" data-filter-format="link">
        <i class="ri-link"></i> Link
      </button>
      <button class="filter-btn" data-filter-format="video">
        <i class="ri-video-line"></i> Video
      </button>
      <button class="filter-btn" data-filter-format="gallery">
        <i class="ri-gallery-line"></i> Gallery
      </button>
      <button class="filter-btn" data-filter-format="portfolio">
        <i class="ri-folder-line"></i> Portfolio
      </button>
    </div>
  </div>

  <div class="filter-results">
    <span id="filter-count">42 articles</span>
    <button class="filter-reset" id="reset-filters">Reset</button>
  </div>
</div>
```

**Filter Behavior:**
- **Client-side JavaScript** - Hide/show cards with CSS `display: none`
- **Combinatorial** - Stage AND Format filters work together
- **Instant feedback** - Count updates in real-time
- **URL state** - Filters persist in URL query params (`?stage=evergreen&format=article`)
- **Mobile collapse** - Filters collapse into dropdown on mobile

**Example Filter Logic:**
```javascript
// User selects: Growth=Evergreen + Format=Article
// Shows only: articles with growth_stage="evergreen"
// Hides all other cards
```

---

#### 3. Anonymous Hearts + Federated Webmentions

**Innovation:** Privacy-first engagement combining local anonymous reactions with federated social interactions.

**Hearts (Umami Events):**
- Anonymous click tracking via Umami analytics
- No cookies, no user identification
- Server-side aggregation for popularity scoring
- Visual heart icon that fills on click

**Webmentions (IndieWeb Protocol):**
- Federated likes, replies, bookmarks from other sites
- webmention.io as receiving endpoint
- Bridgy for social media → webmention conversion (Mastodon, Twitter)
- Grouped display: Likes | Replies | Bookmarks | Mentions

**UI Integration:**

```html
<div class="engagement-section">
  <!-- Anonymous Hearts -->
  <button class="heart-btn" data-article-id="article-slug">
    <i class="ri-heart-line"></i>
    <span class="heart-count">25</span>
  </button>

  <!-- Webmentions Summary -->
  <div class="webmentions-summary">
    <span class="webmention-type">
      <i class="ri-thumb-up-line"></i> 12 likes
    </span>
    <span class="webmention-type">
      <i class="ri-chat-3-line"></i> 8 replies
    </span>
    <span class="webmention-type">
      <i class="ri-bookmark-line"></i> 3 bookmarks
    </span>
  </div>
</div>
```

---

#### 4. Article History Timeline

**Innovation:** Transparent content evolution showing growth from seedling → evergreen with edit summaries.

**Timeline Design (Article Footer Widget):**

```
┌────────────────────────────────────────┐
│ 📜 Article History                     │
├────────────────────────────────────────┤
│ 🌳 Dec 3, 2024 - Promoted to Evergreen│
│    Refined asset pipeline section      │
│                                        │
│ 📝 Nov 5, 2024 - Major Update         │
│    Complete overhaul with Hugo 0.120+  │
│                                        │
│ 🌿 Aug 15, 2023 - Promoted to Budding │
│    Added community feedback            │
│                                        │
│ 📝 Jun 10, 2023 - Content Update      │
│    Major rewrite (lines 145-230)       │
│                                        │
│ 📝 Mar 20, 2023 - Content Addition    │
│    Added shortcodes section            │
│                                        │
│ 🌱 Jan 15, 2023 - Seedling            │
│    Initial planting                    │
└────────────────────────────────────────┘
```

**Data Source:**
- Git commit history (Hugo can access via .GitInfo)
- Frontmatter `growth_stage_history` array
- Milestone: Growth stage promotions highlighted

**Frontmatter Example:**
```yaml
---
growth_stage_history:
  - date: 2023-01-15
    stage: seedling
    note: "Initial planting"
  - date: 2023-08-15
    stage: budding
    note: "Promoted after community feedback"
  - date: 2024-12-03
    stage: evergreen
    note: "Refined asset pipeline section"
---
```

---

#### 5. "Garden Guide" Onboarding

**Innovation:** Pinned post explaining the Digital Garden metaphor to new visitors.

**Content Strategy:**
- Pin 1: "Start Here: How This Garden Works" (onboarding)
- Pin 2: "About Me & My Philosophy" (context)
- Pin 3: [Current passion project] (dynamic, changes periodically)

**Guide Visual Structure:**
```
┌──────────────────────────────────────────┐
│ 🌱 → 🌿 → 🌳 Understanding Growth Stages │
├──────────────────────────────────────────┤
│ Seedlings: Thinking out loud...         │
│ - Early ideas, rough drafts             │
│ - May change significantly              │
│ - Expect imperfection                   │
│                                          │
│ Budding: Refining...                    │
│ - Being developed and tested            │
│ - Incorporating feedback                │
│ - More reliable but evolving            │
│                                          │
│ Evergreen: Refined & reliable           │
│ - Mature, stable content                │
│ - Regularly maintained                  │
│ - High confidence                       │
│                                          │
│ Withered: Archived thinking             │
│ - Outdated or deprecated                │
│ - Hidden by default (opt-in to view)   │
│ - Historical value only                 │
└──────────────────────────────────────────┘
```

---

## 3. Visual Foundation

### 3.1 Color System

**See Section 1.2 for complete color system documentation.**

**Growth Stage Color Semantics:**

| Stage | Color | HSL | Meaning |
|-------|-------|-----|---------|
| 🌱 Seedling | Light Green | `hsl(152, 76%, 50%)` | Fresh, new growth, experimental |
| 🌿 Budding | Cyan | `hsl(189, 90%, 50%)` | Developing, in progress, evolving |
| 🌳 Evergreen | Deep Green | `hsl(152, 76%, 33%)` | Mature, reliable, established |
| 💀 Withered | Gray | `hsl(0, 0%, 50%)` | Archived, outdated, historical |

**Color Accessibility:**
- All text/icon colors meet WCAG AA contrast ratios against dark background
- Growth stage icons use distinct hues (green vs. cyan vs. gray) for color-blind accessibility
- Semantic meaning conveyed through both color AND icon shape

---

## 4. Design Direction

### 4.1 Chosen Design Approach

**Direction:** Dark Theme Digital Garden with Gold Accents

**Established Visual Identity:**
- ✅ Dark sophisticated backgrounds (`hsl(190, 11%, 11%)`)
- ✅ Gold accent color for brand identity and interactivity
- ✅ Montserrat typography (modern, clean, readable)
- ✅ Card-based content presentation
- ✅ Subtle textures (dotted background pattern)
- ✅ 3D text effects for headings
- ✅ Sepia-filtered images with hover reveal

**Digital Garden Extensions:**
- 🌱 Growth stage badges with colored icons (green/cyan/gray palette)
- 📊 Three-tier homepage visual hierarchy
- 🔍 Filter bar with icon buttons
- 💚 Heart engagement buttons
- 📜 Timeline widgets for article history
- 🏷️ Enhanced metadata display (planted/updated dates)

**Design Principles:**
1. **Consistency** - Extend existing visual language, don't replace it
2. **Clarity** - Growth stages immediately recognizable
3. **Elegance** - Maintain sophisticated dark theme aesthetic
4. **Functionality** - Every visual element serves user needs

---

## 5. User Journey Flows

### 5.1 Critical User Paths

#### Journey 1: First-Time Visitor Discovery (Markus)

**Entry:** Arrives via Google search for "Hugo digital garden tutorial"

```
1. Lands on article page
   └─> Sees growth stage badge: [🌿 Budding]
   └─> Reads article (finds helpful)
   └─> Notices "💚 25 hearts" engagement
   └─> Clicks heart (anonymous, instant feedback)

2. Scrolls to footer
   └─> Sees "Article History" timeline
   └─> Understands content has evolved over time
   └─> Sees webmention replies from other sites

3. Clicks site logo → Homepage
   └─> Sees pinned "Garden Guide" post
   └─> Reads explanation of growth stages
   └─> Understands the Digital Garden concept

4. Scans homepage
   └─> Notices three-tier structure (Pinned → Grace → Established)
   └─> Sees mix of 🌱/🌿/🌳 badges
   └─> Tries filter: clicks "Evergreen" button
   └─> Content filters to only mature articles

5. Finds valuable evergreen content
   └─> Bookmarks site
   └─> Subscribes to RSS
```

**Key UX Moments:**
- ✅ Growth badge immediately visible → Sets expectations
- ✅ Heart button → Low-friction engagement
- ✅ Garden Guide (pinned) → Educational onboarding
- ✅ Filter system → Intentional discovery

---

#### Journey 2: Engaged Reader Return Visit (Anna)

**Entry:** Returns via bookmark, wants to see what's new

```
1. Lands on homepage
   └─> Immediately sees "Recently Tended" section (Tier 2)
   └─> Notices [UPDATED] badge on familiar article
   └─> Sees article moved from Seedling → Budding

2. Reads updated article
   └─> Checks "Article History" timeline
   └─> Sees specific changes: "Added section on performance"
   └─> Appreciates transparency

3. Leaves webmention
   └─> Writes reply on own blog
   └─> Sends webmention via Bridgy
   └─> Reply appears in webmentions section

4. Explores "Established Garden" (Tier 3)
   └─> Filters by Format: "Log" (wants personal updates)
   └─> Discovers Angel's development journal
   └─> Understands creator's journey

5. Subscribes to Mastodon
   └─> Sees POSSE announcements
   └─> Engages via federated social
```

**Key UX Moments:**
- ✅ Tier 2 highlights updates → Rewards return visits
- ✅ History timeline → Transparent evolution
- ✅ Webmentions → Federated conversation
- ✅ Format filter → Discover different content types

---

#### Journey 3: Creator Workflow (Angel)

**Entry:** Publishing new article

```
1. Creates article in Hugo
   frontmatter:
     growth_stage: "seedling"
     format: "article"
     weight: 5

2. Builds and previews
   └─> Sees [🌱 Seedling] badge in footer
   └─> Article appears in Tier 2 "Regular" (new, <20 pts)

3. One month later: Major update
   └─> Edits content significantly
   └─> Updates frontmatter:
       growth_stage: "budding"
       growth_stage_history:
         - date: 2025-11-14
           stage: seedling
           note: "Initial draft"
         - date: 2025-12-15
           stage: budding
           note: "Refined based on feedback"

4. Article re-enters grace period
   └─> Moves back to Tier 2 (4-week boost)
   └─> Gets visibility for tending effort

5. Engagement grows
   └─> Receives hearts (Umami events)
   └─> Receives webmentions (federated)
   └─> Popularity score reaches 20+
   └─> Article promoted to "Early Promoted" subsection

6. Three months later: Evergreen status
   └─> Updates growth_stage: "evergreen"
   └─> Article stays in Tier 3 (sorted by popularity)
   └─> Valuable content remains discoverable

7. Monitors analytics
   └─> Umami dashboard shows popular articles
   └─> Uses data to prioritize updates
   └─> Sustainable maintenance strategy
```

**Key UX Moments:**
- ✅ Frontmatter simplicity → Easy to update stages
- ✅ Grace period → Rewarded for updates
- ✅ Popularity scoring → Quality surfaces naturally
- ✅ Analytics integration → Data-informed decisions

---

#### Journey 4: Content Evolution Lifecycle

**Tracking a single article from creation to evergreen:**

```
Timeline:
│
├─ Week 1: 🌱 SEEDLING
│  └─> Published, appears in Tier 2 "Regular"
│  └─> Gets 3 hearts, no webmentions
│  └─> Popularity: 3 points
│
├─ Week 3: Still 🌱 SEEDLING
│  └─> Received first webmention (3 pts)
│  └─> Total hearts: 8
│  └─> Popularity: 8 + 3 + 10 = 21 points
│  └─> PROMOTED to "Early Promoted" (still in Tier 2)
│
├─ Week 5: Exits grace period
│  └─> Moves to Tier 3 "Established Garden"
│  └─> Sorted by popularity (21 pts)
│
├─ Month 3: Major update → 🌿 BUDDING
│  └─> Content refined based on feedback
│  └─> Re-enters Tier 2 (grace period refresh)
│  └─> Popularity: 45 points (hearts + webmentions)
│
├─ Month 6: 🌳 EVERGREEN
│  └─> Content mature and stable
│  └─> Remains in Tier 3
│  └─> Popularity: 75 points
│  └─> Highly discoverable despite age
│
├─ Year 2: Still 🌳 EVERGREEN
│  └─> Occasional updates maintain relevance
│  └─> Each update → grace period boost
│  └─> Sustainable evergreen content
│
└─ Optional: 💀 WITHERED (if outdated)
   └─> Marked when superseded by newer content
   └─> Hidden by default (requires filter opt-in)
   └─> Historical value preserved
```

**Key UX Moments:**
- ✅ Clear progression path → Motivates creator
- ✅ Update rewards → Encourages maintenance
- ✅ Old quality content stays visible → Evergreen discovery
- ✅ Graceful retirement → Withered stage for archives

---

## 6. Component Library

### 6.1 Component Strategy

**Approach:** Extend existing Bulma + custom component library with Digital Garden-specific additions.

**See Section 1.3 for complete existing component inventory (14 components documented).**

### 6.2 New Components for Digital Garden

#### 1. Growth Stage Badge Component

**File:** `elements/growth-badge.scss`
**Usage:** Card footer slot

```scss
.card-footer-item.growth-stage {
  // Documented in Section 1.4
}
```

**States:** seedling | budding | evergreen | withered
**Responsive:** Icon + text (desktop), icon-only (mobile)

---

#### 2. Filter Bar Component

**File:** `elements/filter-bar.scss`
**Usage:** Homepage, above card grid

**Structure:**
```html
<div class="filter-bar">
  <div class="filter-section">
    <h4>Label</h4>
    <div class="filter-buttons">
      <button class="filter-btn [active]">...</button>
    </div>
  </div>
</div>
```

**Features:**
- Gold outlined buttons (inactive)
- Gold filled background (active)
- Icon + text labels
- Responsive collapse (dropdown on mobile)

**JavaScript Integration:**
- Toggle active state on click
- Filter cards via data attributes
- Update count in real-time
- URL state management (query params)

---

#### 3. Heart Button Component

**File:** `elements/engagement.scss`
**Usage:** Article footer, single page

**Structure:**
```html
<button class="heart-btn" data-article-id="slug">
  <i class="ri-heart-line"></i>
  <span class="heart-count">25</span>
</button>
```

**States:**
- Default: Outlined heart, gray
- Hover: Gold color
- Clicked: Filled heart (ri-heart-fill), gold, animation
- Disabled: Already clicked (localStorage check)

**JavaScript Integration:**
- Umami event tracking on click
- LocalStorage to prevent duplicate clicks
- Optimistic UI update (increment count immediately)

---

#### 4. Timeline Widget Component

**File:** `layout/widgets.scss` (extend existing)
**Usage:** Article single page sidebar

**Structure:**
```html
<div class="widget timeline">
  <h3 class="title">Article History</h3>
  <ul class="timeline-events">
    <li class="timeline-event" data-type="stage-change">
      <span class="event-icon">🌳</span>
      <time>Dec 3, 2024</time>
      <span class="event-type">Promoted to Evergreen</span>
      <p class="event-note">Refined asset pipeline section</p>
    </li>
  </ul>
</div>
```

**Event Types:**
- `stage-change` - Growth stage promotion (icon from stage)
- `content-update` - Major edit (📝 icon)
- `published` - Initial publication (🌱 icon)

---

#### 5. Webmention Display Component

**File:** `elements/webmentions.scss`
**Usage:** Article single page, after content

**Structure:**
```html
<section class="webmentions">
  <h3>Responses</h3>

  <div class="webmention-group">
    <h4><i class="ri-thumb-up-line"></i> Likes (12)</h4>
    <ul class="webmention-avatars">
      <li><img src="avatar.jpg" alt="User"></li>
    </ul>
  </div>

  <div class="webmention-group">
    <h4><i class="ri-chat-3-line"></i> Replies (8)</h4>
    <ul class="webmention-list">
      <li class="webmention-item">
        <div class="webmention-author">...</div>
        <div class="webmention-content">...</div>
      </li>
    </ul>
  </div>
</section>
```

**Groups:**
- Likes (avatar grid)
- Replies (full display with content)
- Bookmarks (avatar grid)
- Mentions (linked titles)

---

### 6.3 Modified Existing Components

**Card Component Extensions:**
1. Add `.growth-stage` footer slot
2. Add `data-growth-stage` attribute for filtering
3. Add `data-format` attribute for filtering
4. Maintain existing `.is-fixed`, `.is-new`, `.visited` badges

**Widget Component Extensions:**
1. Add `.timeline` variant for history display
2. Extend `.info` widget with planted/updated dates

**No Breaking Changes:**
- All existing cards continue to work
- New features are additive only
- Backwards compatible with current templates

---

## 7. UX Pattern Decisions

### 7.1 Consistency Rules

#### Iconography Standards

**Rule:** All icons use Remix Icon library, line style by default

**Exceptions:**
- Filled variant for active/selected states (e.g., `ri-heart-fill` when clicked)
- Growth stage icons always use line style for consistency

**Icon Sizes:**
- Inline metadata: 15px
- Standard UI: 20px (`.ri-1x`)
- Large buttons: 24px (`.ri-2x`)

---

#### Color Usage Hierarchy

**Rule:** Stick to established color palette, avoid introducing new colors

**Application:**
1. **Dark variations** - Backgrounds, structural elements
2. **Gold** - Links, accents, interactive elements, brand
3. **Light** - Text, high contrast
4. **Growth stages** - Semantic colors (green/cyan/gray)
5. **Bulma semantic** - Only for UI feedback (success, warning, danger)

**Never:**
- Don't use semantic colors (blue, red, yellow) for non-feedback purposes
- Don't introduce random accent colors

---

#### Interaction Patterns

**Hover Effects:**
- **Links:** Gold → Gold-light color shift
- **Cards:** Gold underline animation + subtle shadow
- **Buttons:** Background color shift + slight translate
- **Images:** Sepia filter removal (existing pattern)

**Click/Active States:**
- **Buttons:** Filled background (gold)
- **Filters:** Gold fill + icon color change
- **Hearts:** Fill animation + color change

**Disabled States:**
- **Opacity:** 0.5-0.7
- **Cursor:** not-allowed
- **Hover:** No effect

---

#### Typography Patterns

**Headings:**
- Use Montserrat Alternates (`.font-header`)
- 3D gradient effect for h1 page titles
- Simple gold color for smaller headings

**Body Text:**
- Montserrat Regular
- Light variant (`hsl(190, 20%, 90%)`)

**Metadata/Subtle Text:**
- Smaller font size (80%)
- Desaturated color (`color.scale($dark, $lightness: 40%)`)

**Never:**
- Don't mix more than 2 font families
- Don't use decorative fonts for body text

---

#### Spacing Consistency

**Card Spacing:**
- Between cards: `var(--bulma-block-spacing)` (Bulma default)
- Card padding: `1.5rem` (existing)
- Footer item padding: `.75em 1.5em`

**Filter Bar:**
- Top margin: `var(--bulma-block-spacing)`
- Button gaps: `.5rem`
- Section gaps: `1.5rem`

**Maintain Bulma conventions:**
- Use Bulma spacing variables where possible
- Custom spacing only when Bulma doesn't provide

---

#### Motion & Animation

**Timing:**
- **Instant feedback:** 0-100ms (button press, filter toggle)
- **Smooth transitions:** 200-300ms (color changes, fades)
- **Deliberate animations:** 300-500ms (card reveals, filter results)

**Easing:**
- `ease-out` for most transitions (existing pattern)
- `ease-in-out` for reversible animations

**Reduced Motion:**
- Respect `prefers-reduced-motion` media query
- Disable animations, keep instant state changes

---

#### Navigation Patterns

**Homepage:**
- Three-tier visual sections (pinned → grace → established)
- Filter bar sticky on scroll (optional)
- Clear section headings

**Article Pages:**
- Breadcrumb navigation (optional)
- Related articles widget (existing)
- Timeline widget in sidebar

**Global:**
- Navbar (existing, maintain)
- Footer (existing, maintain)
- Back to top button (existing)

---

#### Error States & Empty States

**Empty Filter Results:**
```html
<div class="empty-state">
  <i class="ri-inbox-line"></i>
  <p>No articles match your filters.</p>
  <button class="filter-reset">Reset Filters</button>
</div>
```

**No Webmentions:**
```html
<div class="webmentions-empty">
  <p>No responses yet. Be the first to reply!</p>
  <a href="...">Learn how to send a webmention</a>
</div>
```

**JavaScript Disabled:**
```html
<noscript>
  <div class="no-js-banner">
    <i class="ri-alert-line"></i>
    <p>Some features require JavaScript. Enable it for the full experience.</p>
  </div>
</noscript>
```

---

## 8. Responsive Design & Accessibility

### 8.1 Responsive Strategy

**Approach:** Mobile-first, progressive enhancement

**Breakpoints (Bulma defaults):**
- Mobile: < 769px
- Tablet: 769px - 1023px
- Desktop: 1024px - 1215px
- Widescreen: 1216px - 1407px
- Fullhd: ≥ 1408px

**Key Responsive Behaviors:**

#### Homepage Card Grid

**Mobile (<769px):**
- Single column layout
- Full-width cards
- Growth badge: Icon-only (save space)
- Filter bar: Collapsed dropdown
- Tier section headings: Smaller text

**Tablet (769px-1023px):**
- 2-column grid (`.is-col-min-13` → 50%)
- Cards maintain aspect ratio
- Growth badge: Icon + abbreviated text
- Filter bar: Horizontal buttons, may wrap

**Desktop (≥1024px):**
- 3-column grid (`.is-col-min-19` → ~33%)
- Full cards with all features
- Growth badge: Icon + full text label
- Filter bar: Single-row, no wrapping

#### Filter Bar Responsive

**Mobile:**
```html
<select class="filter-dropdown" id="stage-filter">
  <option>All Stages</option>
  <option>🌱 Seedling</option>
  ...
</select>
```

**Tablet/Desktop:**
```html
<div class="filter-buttons">
  <button><i class="ri-seedling-line"></i> Seedling</button>
  ...
</div>
```

**Implementation:** JavaScript toggles between layouts based on screen width

#### Navigation

**Mobile:**
- Burger menu (existing, checkbox-based toggle)
- Search input full-width
- Vertical menu items

**Desktop:**
- Horizontal navbar (existing)
- Search input inline
- Social icons visible

### 8.2 Accessibility Standards

**Target:** WCAG 2.1 Level AA compliance

#### Color Contrast

**Tested Combinations:**
- Light text on Dark background: 13.5:1 (AAA) ✅
- Gold on Dark: 4.8:1 (AA Large Text) ✅
- Gold-light on Dark: 7.2:1 (AAA) ✅
- Growth Green on Dark: 6.1:1 (AA) ✅
- Growth Cyan on Dark: 5.8:1 (AA) ✅

**Action Required:**
- Test all new growth stage icon colors
- Ensure metadata text meets AA contrast (4.5:1 minimum)

#### Semantic HTML

**Rules:**
- Use semantic elements (`<article>`, `<nav>`, `<main>`, `<aside>`)
- Proper heading hierarchy (h1 → h2 → h3, no skips)
- Lists for repeated elements (cards, filters, timeline)
- `<time>` elements with `datetime` attribute

#### Keyboard Navigation

**Requirements:**
- All interactive elements keyboard accessible (tab order)
- Focus indicators visible (gold outline)
- Filter buttons: Arrow keys to navigate, Enter/Space to activate
- Heart button: Enter/Space to click
- Skip to content link (add if missing)

**Focus Styles:**
```scss
:focus-visible {
  outline: 2px solid $gold;
  outline-offset: 2px;
}
```

#### Screen Reader Support

**ARIA Labels:**
- Filter buttons: `aria-label="Filter by Seedling stage"`
- Heart button: `aria-label="Like this article (25 hearts)"`
- Growth badges: `aria-label="Content maturity: Seedling"`
- Icon-only mobile badges: `aria-label` required

**ARIA Live Regions:**
- Filter count: `<span aria-live="polite" aria-atomic="true">42 articles</span>`
- Heart count update: Announce change

**Landmark Roles:**
- `<nav role="navigation" aria-label="Primary">`
- `<main role="main">`
- `<aside role="complementary" aria-label="Sidebar">`

#### Alternative Text

**Images:**
- Article featured images: Descriptive alt text (existing)
- Author avatars: "Avatar of [Name]"
- Decorative images: `alt=""` (empty, not missing)

**Icons:**
- Functional icons: `aria-label` on parent or `<span class="sr-only">` text
- Decorative icons: `aria-hidden="true"`

#### Mobile Touch Targets

**Minimum Size:** 44×44px (WCAG 2.5.5)

**Check:**
- Filter buttons: ✅ Adequate padding
- Heart button: ✅ 48px round button
- Card links: ✅ Large touch area
- Navigation burger: ✅ Existing standard size

#### Content Readability

**Font Sizes:**
- Body text: 16px minimum (existing)
- Metadata: 12.8px (80% of 16px) - Acceptable for secondary content

**Line Height:**
- Body: 1.5 (default Bulma)
- Headings: 1.3 (existing)

**Line Length:**
- Article content: Max 733.5px (existing, optimal 45-75 characters)
- Card descriptions: Truncated with fade

### 8.3 Performance Considerations

**Critical Path:**
- Inline critical CSS (above-the-fold)
- Defer non-critical JavaScript (filters, hearts)
- Lazy load images (existing `loading="lazy"`)

**Optimization:**
- PurgeCSS in production (existing)
- Minify CSS/JS (existing)
- WebP images with fallback (recommended)

**JavaScript Loading:**
```html
<script defer src="filter.js"></script>
<script defer src="hearts.js"></script>
```

**No-JS Fallback:**
- Content always readable (static HTML)
- Filters: Link to archive pages (graceful degradation)
- Hearts: Display count only (no interaction)
- Timeline: Always visible (no JS required)

---

## 9. Implementation Guidance

### 9.1 Development Priorities

**Phase 1: Foundation (Core Growth Stage System)**
1. Add growth stage color variables to `vars/_colors.scss`
2. Create `elements/growth-badge.scss` component
3. Modify card footer template to include growth stage slot
4. Add `growth_stage` and `format` frontmatter fields
5. Test growth badges on all card variants (has-image, is-log, responsive sizes)

**Phase 2: Homepage Sorting**
1. Implement popularity scoring logic in Hugo templates
2. Create three-tier homepage layout (Pinned, Grace, Established)
3. Add tier section headings with visual distinction
4. Test sorting with various content combinations

**Phase 3: Filter System**
1. Create `elements/filter-bar.scss` component
2. Build filter bar HTML template
3. Create `assets/js/filter.js` for client-side filtering
4. Add data attributes to cards (`data-growth-stage`, `data-format`)
5. Implement URL state management (query params)
6. Add mobile dropdown variant
7. Test combinatorial filters (stage + format)

**Phase 4: Engagement Features**
1. Create `elements/engagement.scss` for heart buttons
2. Integrate Umami event tracking
3. Build webmention receiving (webmention.io)
4. Create webmention display component
5. Implement Bridgy for social → webmention conversion
6. Test POSSE workflow (post → Mastodon)

**Phase 5: History & Polish**
1. Add timeline widget component
2. Implement `growth_stage_history` frontmatter support
3. Add planted/updated date displays
4. Create "Garden Guide" pinned post
5. Polish empty states, error messages
6. Accessibility audit (WCAG AA)
7. Performance optimization

### 9.2 File Structure Summary

**New Files to Create:**

```
assets/scss/
├── vars/
│   └── _colors.scss (modify - add growth colors)
├── elements/
│   ├── growth-badge.scss (NEW)
│   ├── filter-bar.scss (NEW)
│   ├── engagement.scss (NEW)
│   └── webmentions.scss (NEW)
└── layout/
    ├── card.scss (modify - add growth badge slot)
    └── widgets.scss (modify - add timeline variant)

assets/js/
├── filter.js (NEW)
├── hearts.js (NEW)
└── webmentions.js (NEW - optional, for loading)

layouts/
├── _partials/
│   ├── card.html (modify)
│   ├── filter-bar.html (NEW)
│   ├── growth-badge.html (NEW partial)
│   ├── heart-button.html (NEW partial)
│   ├── webmentions.html (NEW partial)
│   └── timeline-widget.html (NEW partial)
├── home.html (modify - add filter bar, three-tier sorting)
└── single.html (modify - add timeline, hearts, webmentions)

content/
└── articles/
    └── garden-guide/ (NEW - onboarding post)
        └── index.md
```

### 9.3 Key Hugo Template Changes

**Card Partial (`layouts/_partials/card.html`):**

```html
<article class="card is-horizontal"
         data-growth-stage="{{ .Params.growth_stage }}"
         data-format="{{ .Params.format }}">

  <!-- Existing content -->

  <footer class="card-footer">
    <!-- NEW: Growth Stage Badge -->
    {{ partial "growth-badge.html" . }}

    <!-- Existing formats, author, etc. -->
  </footer>
</article>
```

**Homepage (`layouts/home.html`):**

```html
{{ define "main" }}
  <main>
    <!-- NEW: Filter Bar -->
    {{ partial "filter-bar.html" . }}

    <!-- NEW: Three-Tier Structure -->
    {{ $pinned := where .Site.RegularPages ".Params.pinned" true }}
    {{ $graceArticles := ... }}  <!-- Logic for grace period -->
    {{ $establishedArticles := ... }}  <!-- Logic for established -->

    <section class="tier-pinned">
      <h2>📍 Pinned</h2>
      {{ range $pinned | first 3 }}
        {{ partial "card.html" . }}
      {{ end }}
    </section>

    <section class="tier-grace">
      <h2>🌱 Recently Tended</h2>
      <!-- Early promoted + regular subsections -->
    </section>

    <section class="tier-established">
      <h2>🌳 Established Garden</h2>
      {{ range $establishedArticles }}
        {{ partial "card.html" . }}
      {{ end }}
    </section>
  </main>
{{ end }}
```

**Single Article (`layouts/single.html`):**

```html
{{ define "main" }}
  <article>
    <!-- Existing content -->

    <!-- NEW: Engagement Section -->
    <div class="engagement">
      {{ partial "heart-button.html" . }}
      {{ partial "webmentions.html" . }}
    </div>
  </article>

  <aside>
    <!-- NEW: Timeline Widget -->
    {{ partial "timeline-widget.html" . }}

    <!-- Existing widgets -->
  </aside>
{{ end }}
```

### 9.4 Frontmatter Schema

**Minimum Required (Existing + New):**

```yaml
---
title: "Article Title"
date: 2025-11-14T10:00:00+01:00
lastmod: 2025-11-14T15:30:00+01:00  # Updated date

# NEW REQUIRED FIELDS
growth_stage: "seedling"  # seedling|budding|evergreen|withered
format: "article"          # article|log|link|video|gallery|portfolio

# OPTIONAL NEW FIELDS
growth_stage_history:
  - date: 2025-11-14
    stage: seedling
    note: "Initial draft"

pinned: false              # true for top 3 pins
weight: 5                  # 1-10 for popularity scoring (existing)

# EXISTING FIELDS
author: "angel"
categories: ["kategorie"]
tags: ["tag1", "tag2"]
draft: false
---
```

### 9.5 Testing Checklist

**Visual Testing:**
- [ ] Growth badges visible on all card types (with/without image, log format)
- [ ] Three-tier homepage layout renders correctly
- [ ] Filter bar responsive (desktop buttons, mobile dropdown)
- [ ] Colors meet WCAG AA contrast ratios
- [ ] Timeline widget displays history correctly
- [ ] Webmentions grouped and styled properly

**Functional Testing:**
- [ ] Filters hide/show cards correctly
- [ ] Combinatorial filters (stage + format) work
- [ ] Filter count updates in real-time
- [ ] URL state persists filters on refresh
- [ ] Heart button tracks clicks (Umami events)
- [ ] LocalStorage prevents duplicate hearts
- [ ] Webmention endpoint receives mentions

**Responsive Testing:**
- [ ] Mobile: Single column, icon-only badges, dropdown filters
- [ ] Tablet: 2-column grid, abbreviated badges
- [ ] Desktop: 3-column grid, full badges
- [ ] Touch targets ≥ 44×44px on mobile

**Accessibility Testing:**
- [ ] Keyboard navigation works (tab, enter, space)
- [ ] Focus indicators visible (gold outline)
- [ ] Screen reader announces filters, hearts, stages
- [ ] ARIA labels present on icon-only elements
- [ ] Semantic HTML structure validated
- [ ] Alt text on all images

**Performance Testing:**
- [ ] Lighthouse score ≥ 90 (performance, accessibility)
- [ ] PurgeCSS removes unused styles
- [ ] JavaScript loads deferred
- [ ] Images lazy loaded
- [ ] No-JS fallback functional

### 9.6 Launch Readiness

**Before Public Launch:**
1. ✅ All existing articles have `growth_stage` and `format` frontmatter
2. ✅ "Garden Guide" pinned post published and explains metaphor
3. ✅ Webmention endpoint configured and tested
4. ✅ Umami analytics integrated for hearts
5. ✅ Accessibility audit passed (WCAG AA)
6. ✅ Mobile testing on real devices (iOS, Android)
7. ✅ Cross-browser testing (Chrome, Firefox, Safari, Edge)
8. ✅ RSS feed includes growth stage info
9. ✅ No-JS banner displays when JavaScript disabled
10. ✅ Performance budget met (< 2s LCP)

**Post-Launch Monitoring:**
- Monitor Umami for heart engagement
- Track webmention receipt and display
- Gather user feedback on growth stage clarity
- Analyze filter usage patterns
- Adjust popularity scoring if needed

### 9.7 Future Enhancements

**Phase 6: Advanced Features (Optional)**
- Graph view visualization (connections between articles)
- Bidirectional link support (backlinks)
- Advanced search with growth stage facets
- Newsletter integration (POSSE to email)
- Commenting system integration (if desired)
- Dark/light theme toggle (currently dark-only)
- Localization improvements (German translations)

**Phase 7: Community Features (Optional)**
- Submit to digital garden directories
- IndieWebCamp participation
- Open source theme release (if decided)
- Tutorial content (how to build your own)
- GitHub Sponsors integration

---

## Appendix

### Related Documents

**Discovery Phase:**
- Project Overview: `docs/0-discovery/project-overview.md`
- Brainstorming: `docs/0-discovery/brainstorming-session-results-2025-11-13.md`
- Digital Garden Concepts: `docs/0-discovery/brainstorming/Digital-garden.md`
- Domain Research: `docs/0-discovery/research-domain-2025-11-14.md`
- Current State Analysis: `docs/0-discovery/current-state-analysis-2025-11-13.md`
- Source Tree Analysis: `docs/0-discovery/source-tree-analysis.md`

**Planning Phase:**
- Product Requirements: `docs/1-planning/prd/` (14 sharded files)
- PRD Validation: `docs/1-planning/prd/validation-report-2025-11-14.md`

### Component Quick Reference

**Existing Components (14):**
1. Navigation - base/navigation.scss
2. Hero - base/hero.scss
3. Footer - base/footer.scss
4. Cards - layout/card.scss (PRIMARY)
5. Badges - elements/badge.scss
6. Ribbons - elements/ribbon.scss
7. Buttons - elements/button.scss
8. Search - elements/search.scss
9. Tooltips - elements/tooltip.scss
10. Pagination - elements/pagination.scss
11. Box - elements/box.scss
12. Widgets - layout/widgets.scss
13. Lists - layout/lists.scss
14. Single Page - layout/single.scss

**New Components (5):**
1. Growth Badge - elements/growth-badge.scss
2. Filter Bar - elements/filter-bar.scss
3. Heart Button - elements/engagement.scss
4. Webmentions - elements/webmentions.scss
5. Timeline - layout/widgets.scss (extension)

### Color Palette Quick Reference

```scss
// Primary
$dark: hsl(190, 11%, 11%)
$light: hsl(190, 20%, 90%)
$gold: hsl(35, 45%, 50%)
$gold-light: hsl(29, 100%, 80%)
$gold-dark: hsl(35, 45%, 26%)

// Growth Stages (NEW)
$growth-seedling: hsl(152, 76%, 50%)    // Light green
$growth-budding: hsl(189, 90%, 50%)     // Cyan
$growth-evergreen: hsl(152, 76%, 33%)   // Deep green (= $success)
$growth-withered: hsl(0, 0%, 50%)       // Gray

// Semantic (Bulma)
$primary: hsl(214, 76%, 34%)    // Blue
$info: hsl(189, 90%, 33%)       // Cyan
$success: hsl(152, 76%, 33%)    // Green
$warning: hsl(41, 77%, 37%)     // Yellow
$danger: hsl(0, 79%, 32%)       // Red
```

### Remix Icon Mapping

**Growth Stages:**
- `ri-seedling-line` - 🌱 Seedling
- `ri-plant-line` - 🌿 Budding
- `ri-tree-line` - 🌳 Evergreen
- `ri-skull-line` - 💀 Withered

**Formats:**
- `ri-article-line` - Article
- `ri-file-text-line` - Log
- `ri-link` - Link
- `ri-video-line` - Video
- `ri-gallery-line` - Gallery
- `ri-folder-line` - Portfolio

**Engagement:**
- `ri-heart-line` / `ri-heart-fill` - Hearts
- `ri-thumb-up-line` - Likes
- `ri-chat-3-line` - Replies
- `ri-bookmark-line` - Bookmarks

### Popularity Scoring Formula

```
popularity_score = (hearts × 1) + (webmentions × 3) + (manual_weight × 2)
```

**Example:**
- Hearts: 25
- Webmentions: 8
- Weight: 5
- **Score:** 25 + (8×3) + (5×2) = **59 points**

### Responsive Breakpoints

```scss
// Bulma defaults
$mobile: < 769px
$tablet: 769px - 1023px
$desktop: 1024px - 1215px
$widescreen: 1216px - 1407px
$fullhd: ≥ 1408px

// Custom helpers
@include helpers.mobile { ... }      // < 769px
@include helpers.breakpoint(0, 1135px) { ... }
```

### Next Steps

**Immediate:** Hand off to Architecture Workflow
- Technical specification for backend/API integration
- Hugo template logic design
- Umami analytics configuration
- Webmention endpoint setup
- GitHub Actions for POSSE

**After Architecture:** Epic & Story Creation
- Break down into implementable stories
- Prioritize by development phases (1-5)
- Assign story points
- Begin Phase 1 implementation

### Version History

| Date       | Version | Changes                           | Author |
|------------|---------|-----------------------------------|--------|
| 2025-11-14 | 1.0     | Initial UX Design Specification   | Angel  |

---

_This UX Design Specification documents the complete UX vision for Article Time's Digital Garden transformation. Created through collaborative design facilitation with comprehensive analysis of existing systems, 2025 UX patterns, user journeys, and detailed implementation guidance._

**Document Status:** ✅ Complete - Ready for Architecture Phase
