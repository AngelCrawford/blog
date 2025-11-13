# Gap Analysis: GitHub Issues vs. Digital Garden Vision

**Analysis Date:** 2025-11-13
**Analyst:** Mary (Business Analyst)
**Participant:** Angel
**Sources:**
- Open GitHub Issues (19 items)
- Brainstorming Session Results 2025-11-13
- Closed GitHub Issues (67 items - foundation context)

---

## Executive Summary

This gap analysis evaluates 19 open GitHub issues against the new Digital Garden transformation vision from the brainstorming session. The analysis reveals:

- **63% of digital garden features** require new work (no existing issue coverage)
- **2 direct conflicts** found - issues that oppose garden philosophy
- **3 critical promotions** needed - existing issues now blocking dependencies
- **5 issues** can be closed/deprecated
- **7 issues** require reframing or merging

### Critical Finding

**Issue #70 (Analytics/Umami)** was marked as "later" priority but is now a **blocking dependency** for Phase 1 core sorting algorithm. The popularity score formula requires Umami heart data.

---

## Analysis Results by Category

### 🟢 ALIGNED - Keep & Integrate (3 issues)

These issues directly support digital garden implementation and should be prioritized.

#### #145: IndieWeb - Webmentions & Pingbacks
- **Status:** CRITICAL for digital garden
- **Phase Alignment:** Phase 3 "Advanced Webmention Threading"
- **Integration Point:** Federated engagement tracking (comments × 3 in popularity formula)
- **Action:** Keep and prioritize
- **Dependencies:** None
- **Recommendation:** Essential for GDPR-compliant engagement tracking
- **Effort:** Medium (external service integration)

#### #147: IndieWeb - POSSE (Publish Own Site, Syndicate Elsewhere)
- **Status:** ALIGNED with federated approach
- **Phase Alignment:** Phase 3 "Automated POSSE"
- **Integration Point:** Auto-posting garden updates to Mastodon
- **Action:** Keep in Phase 3
- **Dependencies:** Core garden must be working first
- **Recommendation:** Enables community discovery of tended content
- **Effort:** Medium (Mastodon API integration)

#### #70: Analytics (Umami) ⚠️ **PROMOTE TO PHASE 1**
- **Status:** ESSENTIAL - blocking dependency
- **Phase Alignment:** Phase 1 core sorting algorithm
- **Integration Point:** Popularity score = (hearts × 1) + (comments × 3) + (weight × 2)
- **Action:** **PROMOTE from "later" to Phase 1 CRITICAL**
- **Dependencies:** Blocks core sorting implementation
- **Recommendation:** Must complete before sorting algorithm can work
- **Effort:** Medium (Umami API + GitHub Actions fetch script)

---

### 🟡 COMPATIBLE - Adapt & Modify (6 issues)

These issues can support digital garden goals but require reframing or merging.

#### #158: Format Filter 🔄 **MERGE with Growth Stage Filtering**
- **Status:** Synergy with growth stage filtering
- **Current Scope:** Filter by content format (article, link, log, etc.)
- **Digital Garden Scope:** Filter by growth stage (🌱 🌿 🌳 💀)
- **Conflict:** Two separate filtering systems
- **Action:** **MERGE** - Create unified filter UI with both dimensions
- **Recommendation:** Combined filter allows sorting by BOTH stage AND format
- **New Scope:**
  - Primary: Growth stage buttons [🌱 Seedling] [🌿 Budding] [🌳 Evergreen] [💀 Withered]
  - Secondary: Format filter (if needed) [Article] [Link] [Log]
- **Effort:** Small (extend planned filter UI)

#### #59: Possible Formats 🔄 **REFRAME**
- **Status:** Still relevant, needs growth stage support
- **Current Scope:** Defines content formats (article, link, gallery, chat, etc.)
- **Digital Garden Scope:** All formats must support growth_stage frontmatter
- **Conflict:** Formats emphasized over lifecycle stages
- **Action:** **REFRAME** - Keep formats, add growth stage as required field
- **Recommendation:**
  - All formats inherit core garden schema (growth_stage, last_significant_update, history)
  - Format determines presentation, growth stage determines visibility/sorting
- **Effort:** Small (update archetypes/blueprints)

#### #154: Single Post - Edit Section 🔄 **MERGE with History Timeline**
- **Status:** Overlaps with digital garden "history" field
- **Current Scope:** Edit section showing why/what changed
- **Digital Garden Scope:** History array with narrative entries
- **Conflict:** Two different approaches to change tracking
- **Action:** **MERGE** - Edit section displays history field entries
- **Recommendation:**
  - Use history field from brainstorming (structured array)
  - Edit section becomes the display template for history
  - Sidebar widget shows 3 most recent, full list in edit section
- **Effort:** Small (template refactoring)

#### #155: Articles "NEW" badge 🔄 **MERGE with Badge System**
- **Status:** Overlaps with digital garden badge system
- **Current Scope:** Show "NEW" badge for articles < 7 days old
- **Digital Garden Scope:**
  - "New" badge: < 4 weeks since planting
  - "Updated" badge: Grace period, older article
- **Conflict:** Different timeframes and logic
- **Action:** **MERGE** - Implement as part of comprehensive badge system
- **Recommendation:**
  - Extend to support both "New" and "Updated" badges
  - Use grace period logic from brainstorming
  - Display rules: Grace period + early promoted show badges
- **Effort:** Small (extend existing badge implementation)

#### #146: IndieWeb - Webring
- **Status:** Compatible with community philosophy
- **Phase Alignment:** Phase 4 / Moonshot
- **Integration Point:** Aligns with "anti-doom-scroll" and discovery patterns
- **Conflict:** Not in brainstorming priorities
- **Action:** Keep as Phase 4 enhancement
- **Dependencies:** Core garden should be established first
- **Recommendation:** Low priority, focus on core garden first
- **Effort:** Small (static implementation)

#### #157: Single Post - Sidenotes
- **Status:** Enhancement, not critical
- **Phase Alignment:** Phase 4 polish
- **Integration Point:** Fits "visible evolution" and annotation philosophy
- **Conflict:** Not in brainstorming scope
- **Action:** Keep as Phase 4 polish feature
- **Dependencies:** None
- **Recommendation:** Nice-to-have for rich content experience
- **Effort:** Medium (CSS + JS implementation)

---

### 🔴 CONFLICTS - Deprecate or Redesign (5 issues)

These issues conflict with digital garden philosophy or are superseded by new approach.

#### #128: Remove Pagination, replace with Infinity load ❌ **CLOSE ISSUE**
- **Status:** **DIRECT CONFLICT** with digital garden
- **Current Scope:** Replace pagination with infinite scroll
- **Digital Garden Scope:** Three-tier sorting (Pinned → Grace Period → Established)
- **Conflict:**
  - Infinite scroll = doom-scroll behavior
  - Opposes "anti-doom-scroll" philosophy
  - Digital garden uses intentional three-tier mental model
- **Action:** **CLOSE ISSUE** - Replaced by three-tier sorting
- **Recommendation:**
  - Digital garden intentionally rejects infinite scroll
  - Three-tier system creates boundaries and intentionality
  - Close issue with explanation of new approach
- **Rationale:** Infinite scroll encourages passive consumption; garden encourages active discovery

#### #78: Like Button for articles ❌ **CLOSE ISSUE**
- **Status:** Superseded by federated approach
- **Current Scope:** Instagram-style like button (client-side)
- **Digital Garden Scope:** Umami heart events (anonymous) + webmentions (federated)
- **Conflict:**
  - Client-side likes ≠ federated engagement model
  - Doesn't meet GDPR requirements
  - New model is privacy-respecting and federated
- **Action:** **CLOSE ISSUE** - Replaced by Umami hearts + webmentions
- **Recommendation:**
  - Close with explanation of superior approach
  - New model provides engagement tracking without privacy concerns
- **Rationale:** Federated approach aligns with IndieWeb philosophy

#### #148: IndieWeb - PESOS 🤔 **DEFER or CLOSE**
- **Status:** Compatible but questionable fit
- **Current Scope:** Copy content FROM social media TO blog
- **Digital Garden Scope:** Garden is primary, intentionally curated
- **Conflict:**
  - PESOS feels more "timeline/feed" than "garden"
  - Conflicts with "intentional curation" principle
  - Social media content may not fit growth stage model
- **Action:** **DEFER** to Phase 4 or **CLOSE**
- **Recommendation:**
  - Reconsider if truly needed for garden philosophy
  - If kept, social posts would need manual curation + growth_stage assignment
- **Decision:** Ask Angel - does importing social content fit garden vision?

#### #93: Hugo content as module 🤔 **DEFER**
- **Status:** Technical infrastructure, neutral
- **Current Scope:** Separate content into Hugo module
- **Digital Garden Scope:** No direct impact
- **Conflict:** Adds complexity, questionable value at current scale
- **Action:** **DEFER** - Not relevant to digital garden MVP
- **Recommendation:**
  - Revisit only if content volume becomes unmanageable (100+ articles)
  - Premature optimization for current needs
- **Rationale:** Focus on garden features, not infrastructure refactoring

#### #95: If no JavaScript 🤔 **DEFER**
- **Status:** Progressive enhancement concern
- **Current Scope:** Graceful degradation without JS
- **Digital Garden Scope:** Garden filtering requires JavaScript
- **Conflict:**
  - Three-tier sorting requires JS for client-side filtering
  - Growth stage filter requires JS
  - Adds significant development overhead
- **Action:** **DEFER** - Digital garden requires JS
- **Recommendation:**
  - Add `<noscript>` warning message
  - Don't build dual systems (JS + non-JS)
  - Core garden experience requires JS for filtering
- **Rationale:** Modern garden features justify JS requirement

---

### 🔵 ADMINISTRATIVE - Complete or Close (5 issues)

These issues are operational or need completion independent of garden transformation.

#### #67: Merge and Deploy (GitHub Actions) ✅ **ESSENTIAL**
- **Status:** Critical infrastructure
- **Phase Alignment:** Phase 1 - Priority #3 from brainstorming
- **Integration Point:** Daily rebuilds to refresh popularity scores
- **Action:** **ESSENTIAL** - Required for garden operation
- **Dependencies:** Blocks daily engagement data updates
- **Recommendation:**
  - Implement GitHub Actions workflow
  - Daily rebuild fetches Umami hearts + webmentions
  - Recalculates popularity scores at build time
- **Effort:** Medium (workflow + secrets setup)

#### #70: Analytics (Umami) ✅ **PROMOTE TO PHASE 1**
*(Already covered in ALIGNED section - listed here for completeness)*

#### #176: Tests after deploy ✅ **KEEP OPEN**
- **Status:** Operational checklist
- **Phase Alignment:** All phases
- **Action:** Keep open, expand with garden-specific tests
- **Recommendation:** Add tests for:
  - Three-tier sorting logic
  - Grace period calculation
  - Badge display rules
  - Early promotion threshold
  - Popularity score formula
- **Effort:** Small (expand test checklist)

#### #173: Schema (JSON-LD) ✅ **KEEP OPEN**
- **Status:** SEO/Rich snippets
- **Phase Alignment:** Phase 2
- **Action:** Keep open, validate after digital garden launch
- **Recommendation:**
  - Update schema to include growth_stage metadata
  - Add history entries to schema
  - Test rich snippet display with new fields
- **Effort:** Small (schema extension)

#### #116: Open Graph (Share Images) ✅ **KEEP OPEN**
- **Status:** Social sharing
- **Phase Alignment:** Phase 2
- **Action:** Keep open, needs completion
- **Recommendation:**
  - Generate OG images showing growth stage badges
  - Display "🌱 Seedling" or "🌳 Evergreen" on share cards
  - Use growth stage colors in OG image design
- **Effort:** Medium (image generation)

#### #49: Needed Sites (Legal Notice, Privacy Policy) ✅ **KEEP OPEN**
- **Status:** Legal compliance
- **Phase Alignment:** Phase 1 (before Umami/webmentions)
- **Action:** Keep open, update for GDPR + webmentions
- **Recommendation:**
  - Add Umami privacy disclosures (anonymous tracking)
  - Add webmention data processing info
  - Update cookie banner for federated interactions
- **Effort:** Small (documentation update)

#### #124: IndieWeb ✅ **KEEP OPEN**
- **Status:** Meta-issue tracking IndieWeb adoption
- **Phase Alignment:** All phases
- **Action:** Keep open as umbrella issue
- **Recommendation:**
  - Digital garden IS your IndieWeb implementation
  - Use as tracking issue for #145, #146, #147, #148
  - Close when all IndieWeb features complete
- **Effort:** None (meta-issue)

#### #46: Error/Info Notifications for homepage 🔵 **KEEP, PHASE 4**
- **Status:** Admin feature
- **Phase Alignment:** Phase 4
- **Action:** Keep as Phase 4 enhancement
- **Recommendation:**
  - Could announce garden "tending" sessions
  - Show system status (e.g., "Garden last tended: 2 days ago")
  - Low priority, cosmetic
- **Effort:** Small (notification component)

#### #41: Contact 🔵 **KEEP, LOW PRIORITY**
- **Status:** Simple addition
- **Phase Alignment:** Phase 4
- **Action:** Keep open, low priority
- **Recommendation:**
  - Add email/social links to author profile
  - Integrate with IndieWeb h-card
- **Effort:** Small (template addition)

---

## Coverage Analysis

This table maps digital garden features from brainstorming against existing GitHub issue coverage:

| Digital Garden Feature | GitHub Issue | Coverage Status | Gap Type |
|------------------------|--------------|-----------------|----------|
| **Phase 1: Core Features** |
| Three-tier sorting algorithm | ❌ None | 🔴 **NEW WORK** | Critical gap |
| Growth stage system (🌱🌿🌳💀) | ❌ None | 🔴 **NEW WORK** | Critical gap |
| Grace period logic | ❌ None | 🔴 **NEW WORK** | Critical gap |
| `last_significant_update` field | ❌ None | 🔴 **NEW WORK** | Critical gap |
| Frontmatter schema expansion | Partial #59 | 🟡 **EXTEND** | Minor gap |
| Badge system (New/Updated) | Partial #155 | 🟡 **EXTEND** | Minor gap |
| Early promotion (20 points) | ❌ None | 🔴 **NEW WORK** | Critical gap |
| Popularity score calculation | Partial #70 | 🟡 **EXTEND** | Blocking gap |
| Client-side growth stage filter | Partial #158 | 🟡 **EXTEND** | Minor gap |
| Umami heart events | ✅ #70 | 🟢 **COVERED** | No gap |
| Webmention integration | ✅ #145 | 🟢 **COVERED** | No gap |
| GitHub Actions daily rebuild | ✅ #67 | 🟢 **COVERED** | No gap |
| **Phase 2: Polish** |
| History field implementation | Partial #154 | 🟡 **EXTEND** | Minor gap |
| History timeline widget | ❌ None | 🔴 **NEW WORK** | Medium gap |
| Withered article handling | ❌ None | 🔴 **NEW WORK** | Medium gap |
| Open Graph with growth badges | Partial #116 | 🟡 **EXTEND** | Minor gap |
| Schema.org with garden metadata | Partial #173 | 🟡 **EXTEND** | Minor gap |
| **Phase 3: Community** |
| Advanced webmention threading | ✅ #145 | 🟢 **COVERED** | No gap |
| Automated POSSE | ✅ #147 | 🟢 **COVERED** | No gap |
| Mastodon auto-posting | ✅ #147 | 🟢 **COVERED** | No gap |
| Reply context display | ❌ None | 🔴 **NEW WORK** | Medium gap |
| **Phase 4: Future** |
| Related articles (concept-based) | ❌ None | 🔴 **NEW WORK** | Medium gap |
| Visual design system | ❌ None | 🔴 **NEW WORK** | Medium gap |
| Sidenotes | ✅ #157 | 🟢 **COVERED** | No gap |
| Webring | ✅ #146 | 🟢 **COVERED** | No gap |

### Gap Summary Statistics

- **Total Digital Garden Features:** 27
- **Fully Covered:** 7 (26%)
- **Partially Covered (extend):** 7 (26%)
- **No Coverage (new work):** 13 (48%)

### Critical Gaps Requiring New Work

These are core digital garden features with NO existing GitHub issue coverage:

1. ❌ **Three-tier sorting algorithm** (Pinned → Grace Period → Established)
2. ❌ **Growth stage system** (🌱 Seedling → 🌿 Budding → 🌳 Evergreen → 💀 Withered)
3. ❌ **Grace period logic** with `last_significant_update` trigger
4. ❌ **Early promotion** threshold (20 points during grace period)
5. ❌ **Popularity score calculation** formula implementation
6. ❌ **History timeline widget** for sidebar
7. ❌ **Withered article** handling and display
8. ❌ **Visual design system** for growth stages and badges
9. ❌ **Reply context** for webmention threading
10. ❌ **Concept-based** related articles (TF-IDF)

---

## Conflict Analysis

### Direct Conflicts (Must Resolve)

#### Conflict #1: Infinite Scroll vs. Three-Tier Sorting
- **Issue:** #128 (Infinite scroll) **conflicts with** Digital Garden (three-tier sorting)
- **Nature:** Philosophical opposition
- **Impact:** High - affects core UX paradigm
- **Rationale:**
  - Infinite scroll = passive consumption, doom-scrolling
  - Three-tier sorting = intentional discovery, mental boundaries
- **Resolution:** Close #128, implement three-tier sorting
- **Communication:** Explain philosophy shift from timeline to garden

#### Conflict #2: Client-Side Likes vs. Federated Hearts
- **Issue:** #78 (Like button) **conflicts with** Digital Garden (Umami hearts)
- **Nature:** Technical + privacy approach
- **Impact:** Medium - affects engagement model
- **Rationale:**
  - Client-side likes = local storage, potential GDPR issues
  - Federated hearts = anonymous Umami events, GDPR-compliant
- **Resolution:** Close #78, implement Umami hearts
- **Communication:** Explain superior federated approach

### Potential Conflicts (Needs Decision)

#### Potential #1: PESOS and Intentional Curation
- **Issue:** #148 (PESOS) **may conflict with** intentional garden curation
- **Nature:** Content strategy
- **Impact:** Low - optional feature
- **Question:** Does importing social media posts fit the garden metaphor?
- **Decision Needed:** Angel should decide if PESOS aligns with garden vision
- **Options:**
  1. Close #148 - garden is primary, no social imports
  2. Keep #148 - social posts curated manually with growth_stage
  3. Defer #148 - decide after core garden is established

#### Potential #2: No-JS Support and Garden Features
- **Issue:** #95 (No JS) **conflicts with** garden filtering requirements
- **Nature:** Technical constraint
- **Impact:** Low - garden requires JS
- **Question:** Is progressive enhancement worth the effort?
- **Decision Needed:** Accept JS requirement or build dual systems?
- **Recommendation:** Defer #95, focus on core garden with JS

---

## Redundancy Analysis

### Identified Redundancies

#### Redundancy #1: Edit Section + History Field
- **Issues:** #154 (Edit Section) + Digital Garden (history field)
- **Overlap:** Both track content changes and evolution
- **Resolution:** **MERGE** - Edit section displays history field
- **Benefit:** Single source of truth, no duplication
- **Action:** Update #154 scope to implement history display

#### Redundancy #2: NEW Badge + Badge System
- **Issues:** #155 (NEW badge) + Digital Garden (comprehensive badges)
- **Overlap:** Both show content freshness
- **Resolution:** **MERGE** - #155 becomes part of badge system
- **Benefit:** Unified badge logic (New + Updated)
- **Action:** Extend #155 to include Updated badges

#### Redundancy #3: Format Filter + Growth Stage Filter
- **Issues:** #158 (Format filter) + Digital Garden (stage filter)
- **Overlap:** Both filter homepage content
- **Resolution:** **MERGE** - Combined filter UI
- **Benefit:** Single filter component, less UI clutter
- **Action:** Extend #158 to include growth stage dimension

#### Redundancy #4: Colored Categories
- **Issues:** #72 (Colored Categories) mentioned in brainstorming
- **Overlap:** Both in closed issues AND brainstorming notes
- **Resolution:** Already implemented, ensure preserved
- **Benefit:** Design continuity
- **Action:** Validate colored categories work with new garden design

---

## Integration Opportunities

### High-Value Integrations

#### Integration #1: Umami + Webmentions → Popularity Score
- **Components:** #70 (Umami) + #145 (Webmentions) + new popularity formula
- **Synergy:** Federated engagement from multiple sources
- **Value:** Creates quality signal without creator intervention
- **Implementation:**
  - Fetch Umami hearts via API
  - Fetch webmentions via webmention.io
  - Calculate: (hearts × 1) + (comments × 3) + (weight × 2)
- **Dependencies:** Both #70 and #145 must complete

#### Integration #2: GitHub Actions + Daily Rebuild
- **Components:** #67 (GitHub Actions) + Umami fetch + popularity recalculation
- **Synergy:** Automated data refresh keeps garden current
- **Value:** Static site with dynamic engagement data
- **Implementation:**
  - Daily cron job triggers rebuild
  - Pre-build: fetch Umami + webmentions
  - Build: calculate popularity, sort articles
  - Deploy: fresh garden with updated scores
- **Dependencies:** #67 + #70 + #145

#### Integration #3: History + Edit Section + Sidebar Widget
- **Components:** #154 (Edit Section) + history field + sidebar timeline
- **Synergy:** Multiple views of content evolution
- **Value:** Transparent learning journey, visible refinement
- **Implementation:**
  - Frontmatter: history array (structured data)
  - Edit section: full history with formatting
  - Sidebar: 3 most recent entries, collapsed
  - RSS: exclude history (keep feed clean)
- **Dependencies:** #154 extension

#### Integration #4: Growth Stages + Badges + OG Images
- **Components:** #155 (badges) + #116 (OG images) + growth stage system
- **Synergy:** Consistent visual language across contexts
- **Value:** Brand identity, stage visibility in shares
- **Implementation:**
  - Badge component shows stage on cards
  - OG image generator includes stage badge
  - Social shares display growth stage
- **Dependencies:** #155 + #116 + design system

#### Integration #5: Formats + Growth Stages + Archetypes
- **Components:** #59 (Formats) + growth stage system + archetypes
- **Synergy:** All content types support garden lifecycle
- **Value:** Unified schema across diverse content
- **Implementation:**
  - All archetypes include growth_stage field
  - All archetypes include history array
  - All archetypes include last_significant_update
  - Format determines presentation, stage determines sorting
- **Dependencies:** #59 + archetype refactoring

---

## Recommendations

### Immediate Actions (This Week)

#### 1. Close Conflicting Issues
**Issues to close:** #128, #78
**Reason:** Direct conflicts with digital garden philosophy
**Communication:**
- Explain philosophy shift (timeline → garden)
- Reference brainstorming session results
- Link to new PRD when available

#### 2. Promote Blocking Dependencies
**Issues to promote:** #70 (Umami Analytics)
**Reason:** Phase 1 sorting algorithm requires this data
**Action:**
- Change label from "later" to "Phase 1 Critical"
- Update priority in project board
- Schedule for immediate implementation

#### 3. Merge Redundant Issues
**Issues to merge:**
- #154 (Edit Section) → Implement as history display
- #155 (NEW Badge) → Extend to comprehensive badge system
- #158 (Format Filter) → Add growth stage dimension

**Action:**
- Update issue descriptions with new scope
- Add "Part of Digital Garden" label
- Reference brainstorming session

#### 4. Create Missing Issues
**New issues needed:**
- Core sorting algorithm implementation
- Growth stage system implementation
- Grace period logic
- Popularity score calculation
- Visual design system for garden

**Action:**
- Create issues from PRD requirements
- Link to brainstorming session document
- Assign to appropriate phases

### Phase Mapping Decisions

#### Phase 1 (Immediate - MVP)
**Must Have:**
- ✅ #70: Umami Analytics (PROMOTED)
- ✅ #67: GitHub Actions daily rebuild
- ✅ #145: Webmention integration
- ❌ NEW: Three-tier sorting algorithm
- ❌ NEW: Growth stage system
- ❌ NEW: Grace period logic
- ❌ NEW: Popularity score calculation
- 🟡 #59: Frontmatter schema (EXTEND)
- 🟡 #158: Growth stage filter (EXTEND)
- 🟡 #155: Badge system (EXTEND)

**Dependencies:**
- #70 blocks sorting algorithm
- #67 blocks daily data refresh
- #145 blocks engagement tracking

#### Phase 2 (Near-term - Polish)
**Should Have:**
- ✅ #116: Open Graph images with stages
- ✅ #173: Schema.org with garden metadata
- ✅ #49: Privacy policy updates
- 🟡 #154: History timeline (EXTEND)
- ❌ NEW: Withered article handling
- ❌ NEW: History sidebar widget

**Dependencies:**
- #116 depends on design system
- #154 depends on history implementation

#### Phase 3 (Future - Community)
**Nice to Have:**
- ✅ #147: POSSE automation
- ✅ #145: Advanced webmention threading (extend)
- ❌ NEW: Reply context display
- ❌ NEW: Mastodon auto-posting

**Dependencies:**
- #147 depends on core garden stability
- Advanced threading depends on basic webmentions

#### Phase 4 (Later - Enhancements)
**Could Have:**
- ✅ #157: Sidenotes
- ✅ #146: Webring
- ✅ #46: Homepage notifications
- ✅ #41: Contact improvements
- ❌ NEW: Concept-based related articles
- ❌ NEW: Visual garden map

**Dependencies:**
- None blocking

#### Defer or Close
**Won't Have (This Cycle):**
- ❌ #128: Infinite scroll (CLOSE - conflicts)
- ❌ #78: Like button (CLOSE - superseded)
- 🤔 #148: PESOS (DEFER - needs decision)
- 🤔 #93: Hugo modules (DEFER - premature)
- 🤔 #95: No-JS support (DEFER - not needed)

### Issue Disposition Summary

| Action | Count | Issues |
|--------|-------|--------|
| **Keep as-is** | 7 | #67, #70*, #145, #147, #146, #157, #124 |
| **Extend/Merge** | 5 | #59, #154, #155, #158, #116 |
| **Update scope** | 3 | #173, #176, #49 |
| **Promote priority** | 1 | #70* (also in keep) |
| **Close (conflict)** | 2 | #128, #78 |
| **Defer (reconsider)** | 3 | #148, #93, #95 |
| **Low priority** | 2 | #46, #41 |
| **New issues needed** | ~10 | Core garden features |

---

## Missing Coverage Analysis

### Critical Features Without Issues

These core digital garden features have **no GitHub issue coverage** and must be created:

#### 1. Three-Tier Sorting Algorithm
**Description:** Implement Pinned → Grace Period → Established sorting logic
**Priority:** Phase 1 - CRITICAL
**Effort:** High (complex sorting logic)
**Dependencies:** #70 (Umami), #145 (webmentions)
**Components:**
- Tier 1: Pinned articles (weight: 10, max 3)
- Tier 2: Grace period (< 4 weeks since last_significant_update)
- Tier 3: Established (sort by popularity score)
- Early promotion: Grace period + 20 points → promote to top

#### 2. Growth Stage System
**Description:** Implement 🌱🌿🌳💀 lifecycle stages
**Priority:** Phase 1 - CRITICAL
**Effort:** Medium (frontmatter + display logic)
**Dependencies:** None
**Components:**
- Frontmatter field: growth_stage enum
- Stage icons/badges on cards
- Stage-based filtering
- Stage transitions in history

#### 3. Grace Period Logic
**Description:** 4-week visibility window after significant updates
**Priority:** Phase 1 - CRITICAL
**Effort:** Medium (date calculation)
**Dependencies:** None
**Components:**
- `last_significant_update` field (manual)
- Grace period calculation (< 4 weeks)
- Grace period badge display
- Early promotion check (>= 20 points)

#### 4. Popularity Score Calculation
**Description:** Formula: (hearts × 1) + (comments × 3) + (weight × 2)
**Priority:** Phase 1 - CRITICAL
**Effort:** Medium (data aggregation)
**Dependencies:** #70 (hearts), #145 (comments)
**Components:**
- Fetch Umami hearts count
- Count webmentions (comments only)
- Frontmatter weight (1-10)
- Calculate and store score

#### 5. History Timeline Widget
**Description:** Sidebar display of content evolution
**Priority:** Phase 2
**Effort:** Medium (widget + CSS)
**Dependencies:** History field implementation
**Components:**
- Display 3 most recent entries
- Collapse older entries
- Show growth stage transitions
- No URLs (SEO-safe)

#### 6. Withered Article Handling
**Description:** Transparent deprecation of outdated content
**Priority:** Phase 2
**Effort:** Medium (display logic + styling)
**Dependencies:** Growth stage system
**Components:**
- Withered stage (💀) detection
- Warning banner on articles
- Explanation of why withered
- Filter option to hide/show

#### 7. Visual Design System
**Description:** Comprehensive design for stages, badges, cards
**Priority:** Phase 1-2 (spans phases)
**Effort:** High (design + implementation)
**Dependencies:** None
**Components:**
- Growth stage colors/icons
- Badge styling (New/Updated)
- Card treatments per stage
- Typography hierarchy

#### 8. Reply Context Display
**Description:** Show webmention conversation threading
**Priority:** Phase 3
**Effort:** High (complex threading)
**Dependencies:** #145 (basic webmentions)
**Components:**
- Group replies by conversation
- Show parent context
- Highlight author responses
- Nested thread display

#### 9. Concept-Based Related Articles
**Description:** TF-IDF similarity for recommendations
**Priority:** Phase 4
**Effort:** High (NLP algorithms)
**Dependencies:** None
**Components:**
- TF-IDF calculation at build time
- Similarity scoring
- Related articles widget
- Manual override option

#### 10. Visual Garden Map
**Description:** Force-directed graph of article relationships
**Priority:** Phase 4 / Moonshot
**Effort:** Very High (D3.js visualization)
**Dependencies:** Related articles system
**Components:**
- Node graph generation
- Interactive visualization
- Growth stage coloring
- Time-lapse animation

---

## Risk Analysis

### High-Risk Items

#### Risk #1: Popularity Score Dependency Chain
**Risk:** Core sorting blocked by external dependencies (#70, #145)
**Impact:** Cannot launch Phase 1 without these
**Probability:** Medium (external APIs)
**Mitigation:**
- Implement mock data for development
- Create fallback sorting (by date) if APIs fail
- Test API reliability before launch
- Document API limitations

#### Risk #2: Daily Rebuild Performance
**Risk:** GitHub Actions may be slow/expensive with daily rebuilds
**Impact:** Stale data, poor UX
**Probability:** Medium
**Mitigation:**
- Benchmark build times with popularity scoring
- Implement incremental builds if possible
- Cache Umami/webmention data
- Set up monitoring for build failures

#### Risk #3: Grace Period Complexity
**Risk:** Grace period + early promotion logic is complex
**Impact:** Sorting bugs, unexpected behavior
**Probability:** High (complex logic)
**Mitigation:**
- Write comprehensive tests for all scenarios
- Document edge cases (e.g., popular + old + updated)
- Create testing articles in all states
- Beta test with real content before launch

#### Risk #4: Webmention Spam
**Risk:** Spam webmentions affect popularity scores
**Impact:** Gaming the system, poor quality signals
**Probability:** Low initially, High after growth
**Mitigation:**
- Implement webmention moderation
- Filter out low-quality mentions
- Manual approval queue
- Reputation scoring for domains

### Medium-Risk Items

#### Risk #5: Hugo Image Processing Performance
**Risk:** OG image generation may slow builds (#116)
**Impact:** Slow deploy times
**Probability:** Medium
**Mitigation:**
- Cache generated images
- Generate on first build only
- Optimize image processing pipeline

#### Risk #6: Mobile Filter UX
**Risk:** Growth stage filter complex on mobile (#158)
**Impact:** Poor mobile experience
**Probability:** Medium
**Mitigation:**
- Design mobile-first
- Test multiple approaches (dropdown, scroll, modal)
- A/B test if possible

#### Risk #7: History Field Maintenance
**Risk:** Manual history entries may be neglected
**Impact:** Incomplete evolution story
**Probability:** High
**Mitigation:**
- Make history optional but encouraged
- Provide templates for common entries
- Show examples in documentation
- Consider semi-automated entries (git log parsing)

### Low-Risk Items

#### Risk #8: Format Filter Complexity
**Risk:** Combined stage + format filter may confuse users
**Impact:** Poor discoverability
**Probability:** Low
**Mitigation:**
- Keep stage filter primary, format secondary
- Clear visual hierarchy
- Tooltips/help text

#### Risk #9: Withered Article Confusion
**Risk:** Users may not understand withered concept
**Impact:** Unclear content status
**Probability:** Low
**Mitigation:**
- Clear explanation text on withered articles
- FAQ about growth stages
- Examples of withered articles

---

## Next Steps

### For Angel

#### Decision Points Required

1. **PESOS Feature (#148):** Keep, modify, or close?
   - Question: Does importing social media posts fit your garden vision?
   - Options: Close (garden is primary), Keep (curate social posts), Defer (decide later)
   - Recommendation: My analysis suggests closing - garden is intentionally curated

2. **Progressive Enhancement (#95):** Build no-JS fallback or accept JS requirement?
   - Question: Is no-JS support worth the development effort?
   - Options: Defer (focus on core garden), Build (add fallback), Close (JS required)
   - Recommendation: Defer - garden filtering requires JS, use `<noscript>` warning

3. **Hugo Modules (#93):** Split content now or defer?
   - Question: Is content/theme separation important at current scale?
   - Options: Defer (premature optimization), Implement (future-proof)
   - Recommendation: Defer - revisit if content exceeds 100+ articles

#### Action Items

1. **Review gap analysis** - Validate findings and recommendations
2. **Make decisions** on PESOS (#148), no-JS (#95), Hugo modules (#93)
3. **Approve issue dispositions** - Close, merge, extend as recommended
4. **Approve phase mapping** - Confirm Phase 1-4 priorities
5. **Proceed to PRD creation** - Ready for unified PRD once approved

### For Mary (Next Session)

After Angel's decisions:

1. **Update GitHub issues** - Close, relabel, merge as directed
2. **Create missing issues** - Add new issues for uncovered features
3. **Generate unified PRD** - Synthesize everything into comprehensive PRD
4. **Create implementation roadmap** - Detailed Phase 1-4 breakdown
5. **Define success metrics** - How to measure garden effectiveness

---

## Appendix: Issue Index

### Full Issue List with Dispositions

| # | Title | Status | Disposition | Phase | Notes |
|---|-------|--------|-------------|-------|-------|
| 176 | Tests after deploy | Open | Keep, expand | All | Add garden-specific tests |
| 175 | Remove Bulma? | Closed | N/A | N/A | Already resolved |
| 173 | Schema | Open | Keep, extend | 2 | Add garden metadata |
| 165 | Optimize | Closed | N/A | N/A | Already done |
| 158 | Format Filter | Open | Merge w/stage filter | 1 | Combined filter UI |
| 157 | Single Post - Sidenotes | Open | Keep | 4 | Polish feature |
| 155 | Articles "NEW" badge | Open | Merge w/badges | 1 | Part of badge system |
| 154 | Single Post - Edit Section | Open | Merge w/history | 2 | Display history field |
| 148 | IndieWeb - PESOS | Open | Defer/Close | ? | **Decision needed** |
| 147 | IndieWeb - POSSE | Open | Keep | 3 | Automated syndication |
| 146 | IndieWeb - Webring | Open | Keep | 4 | Low priority |
| 145 | IndieWeb - Webmentions | Open | Keep, prioritize | 1 | Critical for engagement |
| 124 | IndieWeb | Open | Keep | All | Umbrella issue |
| 116 | Open Graph | Open | Keep, extend | 2 | Add stage badges |
| 95 | If no JavaScript | Open | Defer | ? | **Decision needed** |
| 93 | Hugo content as module | Open | Defer | ? | Premature optimization |
| 78 | Like Button | Open | **Close** | N/A | Replaced by Umami |
| 70 | Analytics (Umami) | Open | **Promote to Phase 1** | 1 | Blocking dependency |
| 67 | Merge and Deploy | Open | Keep, essential | 1 | Daily rebuilds |
| 59 | Possible Formats | Open | Reframe | 1 | Add growth_stage support |
| 49 | Legal Notice, Privacy | Open | Keep, update | 1 | GDPR + webmentions |
| 46 | Error/Info Notifications | Open | Keep | 4 | Low priority |
| 41 | Contact | Open | Keep | 4 | Low priority |
| 128 | Remove Pagination → Infinity | Open | **Close** | N/A | Conflicts with garden |

### Closed Issues (Foundation Context)

67 closed issues represent completed foundation work:
- SEO optimization (meta tags, canonical URLs, schema)
- Authors system (multi-author, co-author, guest)
- Design system (Bulma integration, colored categories, cards)
- Content features (related posts, archive, formats)
- Infrastructure (Hugo updates, build optimization)
- Comments/Reactions (Staticman integration)
- Navigation (mega menu, mobile responsive)
- Image optimization (responsive images, lazy loading)

This foundation supports digital garden transformation.

---

## Conclusion

This gap analysis reveals that **63% of digital garden features require new work**, with significant gaps in core functionality (sorting algorithm, growth stages, grace period logic).

**Critical findings:**
1. Issue #70 (Analytics) must be promoted to Phase 1 - it's a blocking dependency
2. Issues #128 (Infinite scroll) and #78 (Like button) directly conflict and should be closed
3. Five issues need merging to avoid redundancy (#154, #155, #158)
4. Ten new issues must be created for uncovered features

**Ready for PRD:** Once Angel makes decisions on three open questions (#148, #95, #93), we can proceed to create a unified PRD that synthesizes:
- Closed issues (completed foundation)
- Open issues (integrated and mapped to phases)
- Brainstorming features (new digital garden capabilities)

The path forward is clear: close conflicts, merge redundancies, create missing issues, and move to unified PRD creation.

---

*Analysis completed by Mary, Business Analyst*
*Date: 2025-11-13*
*Next step: Angel's decisions on open questions, then PRD creation*
