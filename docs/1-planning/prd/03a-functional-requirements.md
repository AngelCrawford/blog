# 3A. Functional Requirements

[← Back to Index](./README.md) | [Previous: Vision & Goals](./02-vision-and-goals.md) | [Next: Core Features →](./03-core-features.md)

---

## Purpose

This section defines **WHAT** capabilities the Digital Garden system must provide, without specifying **HOW** they are implemented (implementation details belong in Architecture).

Each requirement has:
- **FR-XXX:** Unique identifier for traceability
- **Capability:** What the system must do
- **Rationale:** Why this capability matters
- **Priority:** MVP (Phase 1A/1B), Growth (Phase 2/3), Vision (Phase 4)
- **Validation:** How we'll verify it works

---

## FR Category 1: Content Maturity System

### FR-001: Growth Stage Assignment
**Capability:** Content creators can assign one of four growth stages to each piece of content
**Rationale:** Transparent signaling of content maturity and quality to readers
**Priority:** MVP (Phase 1A - Week 3)
**Validation:** Growth stage field accepts valid values (seedling, budding, evergreen, withered) and rejects invalid values

### FR-002: Growth Stage Visibility
**Capability:** Readers can see the growth stage of content at a glance
**Rationale:** Quick assessment of content maturity without reading full article
**Priority:** MVP (Phase 1A - Week 3)
**Validation:** Growth stage badge visible on card and single page views

### FR-003: Growth Stage Filtering
**Capability:** Readers can filter content by growth stage
**Rationale:** Find content at specific maturity levels (e.g., only evergreen content)
**Priority:** MVP (Phase 1A - Week 6)
**Validation:** Filter UI shows all 4 stages, filtering works correctly

### FR-004: Withered Content Default Hiding
**Capability:** Content marked as "withered" is hidden from default homepage view
**Rationale:** Reduce noise from deprecated content while preserving it
**Priority:** MVP (Phase 1A - Week 3)
**Validation:** Withered content not visible unless "Show Withered" explicitly toggled

### FR-005: Withered Content Explicit Display
**Capability:** Readers can explicitly choose to view withered content
**Rationale:** Access to historical/deprecated content when needed
**Priority:** MVP (Phase 1A - Week 6)
**Validation:** "Show Withered" toggle reveals withered content with count

### FR-006: Withered Content SEO Inclusion
**Capability:** Withered content included in RSS feed and sitemap with deprecation metadata
**Rationale:** Search engines and subscribers know content is deprecated but still accessible
**Priority:** Growth (Phase 2 - Week 10)
**Validation:** RSS includes withered with "[Withered DATE]" suffix, sitemap includes with low priority

### FR-007: Withered Reason Documentation
**Capability:** Content creators can document why content was deprecated
**Rationale:** Transparent explanation and potential link to replacement content
**Priority:** Growth (Phase 2 - Week 10)
**Validation:** Withered reason displays on single page with optional replacement link

---

## FR Category 2: Anonymous Engagement System

### FR-008: Anonymous Heart Button
**Capability:** Readers can express appreciation for content with one click, without login
**Rationale:** Engagement signals without privacy invasion or authentication barriers
**Priority:** MVP (Phase 1A - Week 1-2)
**Validation:** Heart button functional, click increments count, no cookies required

### FR-009: Heart Count Display
**Capability:** Readers can see how many hearts content has received
**Rationale:** Social proof and quality signal for popular content
**Priority:** MVP (Phase 1A - Week 1-2)
**Validation:** Heart count visible on cards and single pages, updates daily

### FR-010: Heart Count Persistence
**Capability:** Heart counts are stored and persist across site rebuilds
**Rationale:** Engagement data preserved for popularity scoring
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** Heart counts retrieved from analytics API and stored in data files

### FR-011: Webmention Reception
**Capability:** Site can receive webmentions from other websites and blogs
**Rationale:** Federated conversation and engagement tracking
**Priority:** MVP (Phase 1A - Week 1-2)
**Validation:** Webmention endpoint functional, mentions received and stored

### FR-012: Webmention Display
**Capability:** Webmentions (replies, mentions, reposts) are displayed on article pages
**Rationale:** Show federated engagement and conversation
**Priority:** MVP (Phase 1A - Week 1-2)
**Validation:** Webmentions grouped by type and displayed in article footer

### FR-013: Webmention Counting
**Capability:** System counts total webmentions per article for popularity scoring
**Rationale:** Webmentions are stronger engagement signal than passive hearts
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** Webmention count accurate and included in popularity formula

---

## FR Category 3: Content Sorting & Visibility

### FR-014: Pinned Content Designation
**Capability:** Content creators can pin up to 3 articles to top of homepage
**Rationale:** Manual curation of flagship content
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** Exactly 3 articles with weight=10 appear at top of homepage

### FR-015: Grace Period Visibility Boost
**Capability:** Recently updated content appears in prominent "Grace Period" tier for 28 days
**Rationale:** Reward content updates with temporary visibility boost
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** Content updated within 28 days appears in Tier 2, sorted by update date

### FR-016: Last Significant Update Tracking
**Capability:** Content creators can record when significant updates occur
**Rationale:** Grace period triggered by meaningful updates, not minor edits
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** `last_significant_update` field triggers grace period when < 28 days old

### FR-017: Popularity-Based Sorting
**Capability:** Content outside pinned/grace period tiers sorted by popularity score
**Rationale:** Quality content naturally rises to top over time
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** Tier 3 content sorted descending by popularity score

### FR-018: Popularity Score Calculation
**Capability:** System calculates popularity score from hearts, comments, and manual weight
**Rationale:** Multi-factor quality signal combining engagement and editorial judgment
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** Formula `(hearts × 1) + (webmentions × 3) + (weight × 2)` calculated correctly

### FR-019: Early Promotion Threshold
**Capability:** High-engagement content (≥20 popularity points) promoted to top of established tier
**Rationale:** Fast-rising quality content gets extra visibility
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** Articles with popularity ≥20 appear before lower-scored articles in Tier 3

### FR-020: Three-Tier Mental Model
**Capability:** Homepage clearly divided into Pinned, Grace Period, and Established tiers
**Rationale:** Clear hierarchy helps readers understand content organization
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** Visual separation between tiers, tier labels/headers visible

---

## FR Category 4: Content Update Transparency

### FR-021: Content History Recording
**Capability:** Content creators can record history of significant updates
**Rationale:** Transparent content evolution, learning in public
**Priority:** Growth (Phase 2 - Week 10)
**Validation:** History field accepts date + note entries, displays chronologically

### FR-022: Recent History Widget
**Capability:** Recent content updates (last 3) visible in sidebar widget
**Rationale:** Show readers that content is actively maintained
**Priority:** Growth (Phase 2 - Week 10)
**Validation:** Widget displays 3 most recent history entries with dates

### FR-023: Full History Timeline
**Capability:** Complete content history visible in article footer
**Rationale:** Full transparency of content evolution over time
**Priority:** Growth (Phase 2 - Week 10)
**Validation:** Timeline displays all history entries with visual connection

### FR-024: New Content Badge
**Capability:** Content published within last 28 days displays "New" badge
**Rationale:** Highlight fresh content for regular readers
**Priority:** MVP (Phase 1A - Week 6)
**Validation:** "New" badge visible on content < 28 days old, disappears after

### FR-025: Updated Content Badge
**Capability:** Content in grace period displays "Updated" badge
**Rationale:** Highlight recently improved content
**Priority:** MVP (Phase 1A - Week 6)
**Validation:** "Updated" badge visible when last_significant_update < 28 days, disappears after

---

## FR Category 5: Content Format Diversity

### FR-026: Article Format
**Capability:** Support long-form articles with full markdown content
**Rationale:** Primary content type for tutorials, essays, deep dives
**Priority:** MVP (Existing)
**Validation:** Articles display with cover image, summary, full content

### FR-027: Log Format
**Capability:** Support short microblog entries without detail pages
**Rationale:** Quick thoughts, quotes, ephemeral content
**Priority:** MVP (Existing)
**Validation:** Logs display as compact cards, no separate single page

### FR-028: Link Format
**Capability:** Support external resource curation with commentary
**Rationale:** Bookmark and recommend external content with context
**Priority:** Growth (Phase 1B - Week 7-8)
**Validation:** Link card shows domain, external link icon, commentary

### FR-029: Video Format
**Capability:** Support video embeds (YouTube/Vimeo) with commentary
**Rationale:** Share and discuss video content
**Priority:** Growth (Phase 1B - Week 7-8)
**Validation:** Video card shows thumbnail, play icon, embedded player on single page

### FR-030: Gallery Format
**Capability:** Support photo collections with captions
**Rationale:** Photo essays, travel logs, visual storytelling
**Priority:** Growth (Phase 1B - Week 9)
**Validation:** Gallery card shows image grid, single page has masonry layout with lightbox

### FR-031: Portfolio Format
**Capability:** Support project showcases with tech stack and case studies
**Rationale:** Display work samples, development projects
**Priority:** Growth (Phase 1B - Week 9)
**Validation:** Portfolio card shows tech stack badges, single page has case study layout

### FR-032: Format Filtering
**Capability:** Readers can filter content by format type
**Rationale:** Find specific content types (e.g., only videos, only articles)
**Priority:** Growth (Phase 1B - Week 7-9)
**Validation:** Format filter shows all 6 options, filtering works correctly

### FR-033: Combined Filtering
**Capability:** Readers can filter by both format AND growth stage simultaneously
**Rationale:** Precise content discovery (e.g., "evergreen videos")
**Priority:** Growth (Phase 1B - Week 7-9)
**Validation:** Both filters apply with AND logic, counts update correctly

---

## FR Category 6: Daily Data Operations

### FR-034: Automated Daily Rebuild
**Capability:** Site automatically rebuilds daily with fresh engagement data
**Rationale:** Popularity scores and content sorting stay current
**Priority:** MVP (Phase 1A - Week 1-2)
**Validation:** GitHub Actions workflow runs daily at 2 AM UTC, site deploys successfully

### FR-035: Engagement Data Fetching
**Capability:** System fetches heart counts and webmentions daily via APIs
**Rationale:** Fresh engagement data for popularity calculations
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** Hearts fetched from Umami API, webmentions from webmention.io, data saved

### FR-036: Popularity Score Updates
**Capability:** Popularity scores recalculated daily with latest engagement data
**Rationale:** Content sorting reflects current engagement levels
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** Scores updated in data file, homepage sorting reflects changes

### FR-037: Data History Preservation
**Capability:** Daily engagement data committed to separate branch for historical tracking
**Rationale:** Analyze engagement trends over time, debug scoring issues
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** Data committed to `data-updates` branch daily, history accessible

---

## FR Category 7: Federated Publishing (POSSE)

### FR-038: Mastodon Auto-Syndication
**Capability:** New content automatically posted to Mastodon account
**Rationale:** Reach federated audience, drive traffic from Mastodon
**Priority:** Growth (Phase 3 - Week 12)
**Validation:** New articles posted to Mastodon with summary + link within 1 hour of publish

### FR-039: Threads Auto-Syndication (If Available)
**Capability:** New content automatically posted to Threads if API permits
**Rationale:** Reach Meta ecosystem audience
**Priority:** Growth (Phase 3 - Week 12-13)
**Validation:** If Threads API functional, new articles posted automatically

### FR-040: Manual POSSE Documentation
**Capability:** Clear guide for manually posting to Facebook and Reddit
**Rationale:** Platforms with restricted APIs still reachable via manual process
**Priority:** Growth (Phase 3 - Week 13)
**Validation:** Documentation exists with step-by-step instructions for FB + Reddit

### FR-041: Syndication Link Display
**Capability:** Articles show links to syndicated copies on other platforms
**Rationale:** Cross-platform conversation visibility
**Priority:** Growth (Phase 3 - Week 13)
**Validation:** Syndication links displayed in article footer

---

## FR Category 8: SEO & Accessibility

### FR-042: Open Graph Image Generation
**Capability:** Unique OG images generated for each article with growth stage badge
**Rationale:** Rich social media previews increase click-through
**Priority:** Growth (Phase 2 - Week 11)
**Validation:** OG images generated at build time, include title + badge, proper dimensions

### FR-043: Schema.org Structured Data
**Capability:** Articles include structured data for search engines
**Rationale:** Rich search results with article metadata
**Priority:** Growth (Phase 2 - Week 11)
**Validation:** Schema.org markup validates, includes growth stage as custom property

### FR-044: No-JavaScript Fallback Banner
**Capability:** Site displays notice when JavaScript is disabled
**Rationale:** Communicate that filters require JS, but content still readable
**Priority:** Growth (Phase 2 - Week 11)
**Validation:** <noscript> banner visible when JS disabled, content still accessible

### FR-045: Keyboard Navigation
**Capability:** All interactive elements accessible via keyboard
**Rationale:** Accessibility for keyboard-only users
**Priority:** Growth (Phase 2 - Week 11)
**Validation:** Tab navigation works, focus indicators visible, no keyboard traps

### FR-046: Screen Reader Support
**Capability:** All content and UI elements properly labeled for screen readers
**Rationale:** Accessibility for visually impaired users
**Priority:** Growth (Phase 2 - Week 11)
**Validation:** ARIA labels present, landmarks defined, screen reader testing passes

---

## FR Category 9: Privacy & Compliance

### FR-047: Zero Tracking Cookies
**Capability:** Site functions without any tracking cookies
**Rationale:** GDPR compliance, privacy-respecting engagement
**Priority:** MVP (Phase 1A - Week 1-2)
**Validation:** Cookie audit shows zero tracking cookies, heart button works without cookies

### FR-048: Privacy Policy Publication
**Capability:** Clear privacy policy explains data collection practices
**Rationale:** Legal compliance, user trust
**Priority:** MVP (Phase 0 - Week 1)
**Validation:** Privacy policy page exists, explains Umami + webmentions, accessible from footer

### FR-049: Anonymous Analytics
**Capability:** Analytics track pageviews and events without personal identification
**Rationale:** Understand content performance without violating privacy
**Priority:** MVP (Phase 1A - Week 1-2)
**Validation:** Umami configured for anonymous tracking, no user IDs or personal data

---

## FR Category 10: Configuration & Flexibility

### FR-050: Configurable Grace Period
**Capability:** Grace period duration configurable via site parameters
**Rationale:** Adjust visibility boost duration based on content velocity
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** `grace_period_days` parameter in config, changes reflected in sorting

### FR-051: Configurable Pinned Limit
**Capability:** Maximum pinned articles enforced via template logic
**Rationale:** Consistent curation limit, prevent homepage dominance
**Priority:** MVP (Phase 1A - Week 4-5)
**Validation:** Template enforces exactly 3 pinned articles maximum

### FR-052: Feature Toggle Support
**Capability:** Major features (hearts, webmentions, formats) can be enabled/disabled via config
**Rationale:** Gradual rollout, debugging, future flexibility
**Priority:** Growth (Phase 1B-2)
**Validation:** Config parameters control feature visibility and functionality

---

## FR Summary

**Total Functional Requirements:** 52

**By Priority:**
- **MVP (Phase 1A):** 28 FRs
- **Growth (Phase 1B-3):** 22 FRs
- **Vision (Phase 4):** 2 FRs (future enhancements)

**By Category:**
- Content Maturity System: 7 FRs
- Anonymous Engagement: 6 FRs
- Content Sorting & Visibility: 7 FRs
- Content Update Transparency: 5 FRs
- Content Format Diversity: 8 FRs
- Daily Data Operations: 4 FRs
- Federated Publishing: 4 FRs
- SEO & Accessibility: 5 FRs
- Privacy & Compliance: 3 FRs
- Configuration & Flexibility: 3 FRs

---

## Requirements Not Included

**Out of Scope for v1.0:**
- User accounts and authentication
- Comment system (using webmentions instead)
- Content search (existing feature retained)
- Editorial workflow (single author blog)
- A/B testing or analytics experiments
- Email subscriptions
- Push notifications

---

## Next Steps

1. ✅ **FRs defined** - All capabilities documented with traceability IDs
2. ⏭️ **Create epics.md** - Break FRs into user stories with acceptance criteria
3. ⏭️ **Build traceability matrix** - Map FR → Epic → Story
4. ⏭️ **Architecture phase** - Define HOW to implement these capabilities

---

[← Back to Index](./README.md) | [Previous: Vision & Goals](./02-vision-and-goals.md) | [Next: Core Features →](./03-core-features.md)
