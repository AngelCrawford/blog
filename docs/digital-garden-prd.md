# Digital Garden Transformation - Product Requirements Document

**Project:** Article Time Blog - Digital Garden Transformation
**Author:** Angel Crawford
**Contributors:** BMAD Team (Sally, Winston, John, Mary, Dr. Quinn, Sophia, Maya, Victor, Paige)
**Date:** 2025-11-13
**Status:** Specification Complete - Ready for Implementation

---

## Executive Summary

Transform Article Time from a traditional chronological blog into a living digital garden that emphasizes content evolution, community engagement, and intentional discovery over doom-scrolling.

**Core Philosophy:**
- Anti-doom-scroll: Intentional content discovery over algorithmic feeds
- Visible evolution: Show thinking and refinement process transparently
- Community-driven quality: Surface valuable content through engagement
- Privacy-respecting: GDPR-compliant federated interactions via IndieWeb

---

## Vision & Goals

### Problem Statement

Traditional chronological blogs are "empty souls" that:
- Force creator-centric timeline consumption
- Hide content evolution and learning process
- Prioritize newness over value
- Create no-win choice: publish imperfect content vs. never publish

### Solution

A digital garden that:
- **Shows growth stages:** 🌱 Seedling → 🌿 Budding → 🌳 Evergreen → 💀 Withered
- **Surfaces quality:** Community engagement determines visibility
- **Enables tending:** Updates refresh content without penalty
- **Embraces imperfection:** Early-stage thinking is welcomed and labeled
- **Respects readers:** Intentional discovery, not infinite scroll

### Success Metrics

**For Readers:**
- Discover valuable content regardless of age
- Understand content maturity at a glance
- See authentic learning journeys
- Engage without tracking or data collection

**For Creator (Angel):**
- Publish early-stage thoughts without fear
- Refine content over time (tending)
- See community-validated quality rise
- Maintain creative control via manual curation

---

## User Personas

### Persona 1: The Intentional Learner
**Needs:** High-quality, refined content on specific topics
**Pain Points:** Tired of clickbait, wants substance
**How Garden Helps:** Evergreen content surfaces via popularity score

### Persona 2: The Fellow Gardener
**Needs:** Raw thinking, work-in-progress ideas to build on
**Pain Points:** Most blogs only show polished final thoughts
**How Garden Helps:** Seedling filter shows early-stage exploration

### Persona 3: The Returning Visitor
**Needs:** Updates to content they previously read
**Pain Points:** No way to know what changed
**How Garden Helps:** "Updated" badges + history timeline show evolution

---

## Core Concepts

### Growth Stages (Manual)

Articles exist in four states, manually assigned by author:

| Stage | Icon | Meaning | Creator Intent |
|-------|------|---------|----------------|
| **Seedling** | 🌱 | Early exploration, rough ideas | "I'm thinking through this" |
| **Budding** | 🌿 | Refined, but evolving | "Getting clearer, still iterating" |
| **Evergreen** | 🌳 | Mature, reliable content | "This is refined and trustworthy" |
| **Withered** | 💀 | Deprecated, archived | "Outdated - see newer approach" |

**Transition Rules:**
- Manual only (frontmatter changes)
- Does NOT automatically trigger grace period
- Should include history entry explaining transition

### Content Lifecycle

```
PLANTING
↓
🌱 Seedling (4-week grace period)
  - "New" badge
  - Sorted by date
  - Gathering initial feedback
↓
Author tends: adds content, refines
↓
🌿 Budding (manual promotion)
  - History entry: "Promoted to Budding"
  - If updated: "Updated" badge + grace period reset
↓
Matures through community engagement
↓
🌳 Evergreen (manual promotion)
  - History entry: "Promoted to Evergreen"
  - Sorted by popularity score
↓
Eventually outdated
↓
💀 Withered (manual demotion)
  - Hidden from default view
  - History explains why + redirects to new content
```

---

## Sorting Algorithm

### Three-Tier System

**Tier 1: Pinned Articles (Max 3)**
- Condition: `weight === 10`
- Sort: `lastmod DESC` (if >3 pinned, show 3 newest)
- Purpose: Curator's "start here" guidance
- Typical use: Garden guide, philosophy, current focus

**Tier 2: Recently Tended (Grace Period)**
- Condition: `(now - last_significant_update) <= 28 days` AND `weight !== 10`
- Duration: 4 weeks from last significant update
- Sub-tiers:
  - **2a: Early Promoted** (score >= 20): Sort by popularity
  - **2b: Regular Grace** (score < 20): Sort by lastmod DESC
- Badge: "New" (if < 4 weeks old) or "Updated" (if older)
- Purpose: Give new/updated content discovery visibility

**Tier 3: Established Garden**
- Condition: `(now - last_significant_update) > 28 days` OR `promoted early`
- Sort: `popularity_score DESC`, then `lastmod DESC` (tie-breaker)
- Purpose: Community-validated quality content

**Hidden: Withered**
- Condition: `growth_stage === 'withered'`
- Access: Only via growth stage filter
- Sort: Same as Tier 3 when filtered

### Early Promotion

Articles in grace period (Tier 2) that reach **20+ popularity points** are promoted to Tier 3 sorting within the grace period section, signaling strong community validation.

Visual effect: Show popularity score on card, sort by score instead of date.

---

## Popularity Score

### Formula

```
popularity_score = (hearts × 1) + (comments × 3) + (weight × 2)

Where:
- hearts = umami_hearts + webmention_likes
- comments = webmention_comments
- weight = manual frontmatter value (1-10)
```

### Data Sources

**Hearts:**
- Umami Events: Anonymous heart clicks (GDPR-safe)
- Webmention Likes: Federated likes from Mastodon, blogs, etc.

**Comments:**
- Webmention Replies: Federated comments from across the web

**Weight:**
- Manual frontmatter field (1-10)
- Set once on publish, never auto-changed
- Used for initial boost (2x multiplier)

### Engagement Rules

- **Author exclusion:** Own hearts/comments don't count
- **Persistence:** Score NOT reset when content updated
- **Build-time calculation:** Daily GitHub Action fetches data
- **Display:** Show on cards in grace period (if promoted) and established tier

### Point Values Rationale

| Action | Points | Reasoning |
|--------|--------|-----------|
| Heart/Like | 1 | Light engagement, easy action |
| Comment | 3 | Deeper engagement, thoughtful response |
| Weight boost | 2 | Creator's intuition about quality/importance |

**Example scores:**
- 5 hearts + 2 comments = 11 points (not promoted)
- 10 hearts + 4 comments = 22 points (promoted!)
- 20 hearts + 10 comments + weight 5 = 60 points (high popularity)

---

## Grace Period System

### Purpose

Give new and updated content **equal visibility** alongside popular established content for a limited time.

### Mechanism

**Duration:** 4 weeks (28 days)

**Trigger:** Changes to `last_significant_update` field (manual)

**Behavior:**
- Article moves to Tier 2 (recently tended)
- Gets "New" or "Updated" badge
- Sorted by date (unless early promoted)
- After 4 weeks: Moves to Tier 3 (established)

### Date Field Architecture

Three date fields with distinct purposes:

| Field | Type | Updated When | Purpose |
|-------|------|--------------|---------|
| `date` | Hugo standard | Once (creation) | Original planting, badge logic |
| `lastmod` | Hugo standard | Every save (auto) | "Last edited" display |
| `last_significant_update` | Custom | Manual (with history) | Grace period trigger, sorting |

**Key insight:** Grace period triggered by `last_significant_update`, NOT `lastmod`.

This allows typo fixes without resetting grace period.

### Workflows

**Small Edit (Typo, Grammar):**
1. Edit content
2. Save (lastmod auto-updates)
3. DON'T update `last_significant_update`
4. DON'T add history entry
5. Result: No grace period reset

**Significant Update:**
1. Edit content substantially
2. Add history entry with today's date
3. Update `last_significant_update` to today
4. Save (lastmod auto-updates)
5. Result: Grace period resets to 4 weeks

### Grace Period + Popularity Interaction

**Scenario:** Popular article (score 50) gets updated

1. Grace period resets (article in Tier 2)
2. Score still 50 (>= 20 threshold)
3. **Immediately early promoted** within Tier 2
4. Shows "Updated" badge + popularity score
5. Sorted by score, not date

**Net effect:** Popular content stays visible, "Updated" badge signals refresh.

---

## Pinning System

### Rules

- **Maximum:** 3 pinned articles
- **Mechanism:** Set `weight: 10` in frontmatter
- **Overflow:** If >3 articles have weight=10, display top 3 by `lastmod DESC`
- **Fourth article:** Falls into normal sorting (Tier 2 or 3)

### Recommended Pin Strategy

```
Pin 1: Garden Guide ("How This Garden Works")
  Purpose: Onboarding for new visitors

Pin 2: About / Philosophy ("Why I Built This")
  Purpose: Context and values

Pin 3: Current Focus (dynamic, changes over time)
  Purpose: "What I'm exploring now"
```

### Pinning Workflow

```yaml
# Pin an article
weight: 10  # Set to 10

# Unpin (move to normal sorting)
weight: 5   # Change to any value 1-9
```

If >3 pinned, manually reduce one to unpin it.

---

## Content History

### Purpose

Show transparent evolution of thinking, making learning visible.

### Frontmatter Structure

```yaml
history:
  - date: 2024-12-03
    note: "Refined asset pipeline section, promoted to evergreen"
    stage: evergreen

  - date: 2024-11-05
    note: "Complete overhaul with Hugo 0.120+ features"

  - date: 2023-08-15
    note: "Promoted to budding after community feedback"
    stage: budding

  - date: 2023-01-15
    note: "Initial planting"
    stage: seedling
```

### Field Definitions

- **date** (required): ISO date of the change (YYYY-MM-DD)
- **note** (required): Human-readable description of what changed
- **stage** (optional): Include when growth stage transitions

### Best Practices

**Good history entries:**
- Editorial summaries, not technical diffs
- Focus on "what" and "why", not "how"
- Written for readers, not developers

**Examples:**

✅ "Verfeinert Asset-Pipeline-Abschnitt"
✅ "Neuer Abschnitt über Image Processing hinzugefügt"
✅ "Komplette Überarbeitung mit Hugo 0.120+ Features"

❌ "Fixed typo in line 145"
❌ "Updated code block syntax"
❌ "Merged PR #42"

### Withered Articles

History explains deprecation:

```yaml
history:
  - date: 2025-03-15
    note: "Als Withered markiert - Hugo hat diese Funktionalität komplett geändert. Siehe [neuen Artikel](/neuer-ansatz) für aktuellen Ansatz."
    stage: withered
```

Gives readers:
- Transparency (why it's deprecated)
- Direction (where to go instead)
- Respect (not just hiding it)

### Display Location

**Sidebar widget** (right side, above author section):
- Show 3 most recent entries
- Collapse older entries (click to expand)
- Compact format: date + icon + one-line note
- No URLs (display only, no versioning)

---

## Growth Stage Filtering

### Filter UI

```
┌──────────────────────────────────────────┐
│ Growth Stage:                            │
│ [All ✓] [🌱 Seedling] [🌿 Budding]      │
│ [🌳 Evergreen] [💀 Withered]            │
└──────────────────────────────────────────┘
```

### Behavior

**Default:** All (excludes withered)

**Filtered:** Apply same 3-tier sorting algorithm to filtered subset

- `?stage=seedling` → Show only seedlings, sorted by tiers
- `?stage=withered` → Show withered, sorted by popularity + date
- `?stage=all` → Default view

**Key:** Filtering changes DATASET, not ALGORITHM. Consistency maintained.

---

## Badges

### Types

| Badge | Condition | Visual |
|-------|-----------|--------|
| **New** | In grace period AND `(now - date) <= 28 days` | Fresh green, sparkle |
| **Updated** | In grace period AND `(now - date) > 28 days` | Blue refresh icon |
| None | Established tier OR pinned | Standard display |

### Badge + Score Display Rules

**Grace Period (Tier 2):**
- Early promoted (score >= 20): Show badge + score
- Regular (score < 20): Show badge only (hide score)

**Established (Tier 3):**
- No badges
- Always show popularity score

**Rationale:** Early validation signals quality. Scores without validation are noise.

---

## IndieWeb Integration

### Philosophy

Federated, privacy-respecting engagement that creates portable data and respects user agency.

### Components

**Webmentions (via webmention.io):**
- Receive: Likes, replies, reposts from across the web
- Display: As threaded conversations
- Send: Manual or via Telegraph API

**POSSE (Publish Own Site, Syndicate Elsewhere):**
```
Hugo build → RSS feed → Automation → Mastodon/Twitter
                                   → Canonical link back
```

**Interaction Patterns:**

**Hearts/Likes:**
- Primary: Federated via Mastodon favorites
- Secondary: Anonymous via Umami events
- Display: Combined count

**Comments:**
- Federated replies via webmentions
- Show as threaded discussions
- Reply button links to user's preferred platform

### GDPR Compliance

**Germany + EU requirements:**
- ✅ No localStorage (no consent needed)
- ✅ No cookies (no consent needed)
- ✅ Umami anonymous events (no personal data)
- ✅ Webmentions (user controls data on their platform)

**User interaction flow:**
```
[❤️ Like on Mastodon] [💬 Reply on Mastodon]
         ↓                       ↓
   Federated back          Federated back
         ↓                       ↓
   Aggregated count       Displayed as comment
```

No data stored on Article Time servers. Fully decentralized.

---

## Implementation Phases

### Phase 1: Core Sorting (MVP)
- Three-tier algorithm
- Grace period system
- Growth stage filtering
- Manual weight/pinning

**Deliverables:**
- Hugo templates with sorting logic
- Frontmatter schema
- Basic UI (cards, filters, badges)

### Phase 2: Engagement Tracking
- Umami heart tracking
- Webmention integration
- Popularity score calculation
- Daily GitHub Actions rebuild

**Deliverables:**
- Umami fetch script
- Webmention data processing
- Popularity score display
- Automated build pipeline

### Phase 3: History & Polish
- History widget display
- Badge system refinement
- Visual design polish
- Performance optimization

**Deliverables:**
- History sidebar widget
- Date field migration
- Complete UI design system
- SEO optimization

### Phase 4: IndieWeb (Future)
- POSSE automation
- Webmention sending
- Conversation threading
- Backlink discovery

**Deliverables:**
- Automated syndication
- Reply context display
- Cross-site conversation UI

---

## Success Criteria

### Must Have (Phase 1-2)

✅ Three-tier sorting works correctly
✅ Grace period resets on significant updates
✅ Growth stage filtering functions
✅ Pinned articles appear first
✅ Popularity score displays accurately
✅ Badges show correctly

### Should Have (Phase 3)

✅ History timeline displays in sidebar
✅ Early promotion works (20+ threshold)
✅ Withered articles hidden by default
✅ Mobile responsive design
✅ Fast build times (<5 minutes)

### Nice to Have (Phase 4)

✅ Full POSSE automation
✅ Rich webmention display
✅ Backlink notifications
✅ Related articles by concept (not just tags)

---

## Open Questions

1. **History collapse:** Inline expansion or modal overlay?
2. **Umami API format:** Exact endpoint structure for umami.is
3. **Mobile filter UI:** Dropdown or horizontal scroll?
4. **RSS feed:** Include withered articles or exclude?
5. **Related articles:** Keep current algorithm or redesign for garden?

---

## Appendix: Inspiration & References

**Digital Garden Philosophy:**
- https://github.com/swyxio/digital-garden-tos
- https://maggieappleton.com/garden

**IndieWeb:**
- https://indieweb.org
- https://webmention.io
- https://brid.gy

**Similar Implementations:**
- Andy Matuschak's notes
- Tom Critchlow's wiki
- Maggie Appleton's garden

---

**Document Version:** 1.0
**Last Updated:** 2025-11-13
**Next Review:** After Phase 1 implementation
