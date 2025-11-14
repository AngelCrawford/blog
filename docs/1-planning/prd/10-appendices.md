# 10. Appendices

[← Back to Index](./README.md) | [Previous: Risks & Dependencies](./09-risks-and-dependencies.md)

---

## Appendix A: Frontmatter Schema

**Complete schema for all formats:**

```yaml
---
# Core Fields (All Formats)
title: "Article Title"
date: 2025-11-13
lastmod: 2025-11-13
draft: false

# Digital Garden Fields
growth_stage: "seedling"  # seedling, budding, evergreen, withered
last_significant_update: 2025-11-13
weight: 5  # 1-10 (10 = pinned, max 3 site-wide)

# Format
format: "article"  # article, log, link, video, gallery, portfolio

# History
history:
  - date: 2025-11-13
    note: "Initial planting 🌱"
  - date: 2025-12-01
    note: "Expanded examples"

# Withered (if deprecated)
withered_date: 2025-11-13
withered_reason: "See: /new-article/"

# Taxonomies
categories: ["Technology"]
tags: ["Hugo"]
series: ["Digital Garden"]

# SEO
summary: "Summary for cards (120-158 chars)"

# Format-Specific Fields

# LINK FORMAT
url: "https://example.com"
domain: "example.com"

# VIDEO FORMAT
video_url: "https://youtube.com/watch?v=..."
video_id: "dQw4w9WgXcQ"
platform: "youtube"
duration: "12:34"

# PORTFOLIO FORMAT
project_url: "https://example.com"
github_url: "https://github.com/..."
tech_stack: ["Vue.js", "Node.js"]
role: "Full-stack Developer"
year: 2024
---
```

---

## Appendix B: FR Coverage & Traceability Matrix

**Purpose:** Complete mapping of Functional Requirements → Epics → User Stories

### Coverage Summary

- **Total FRs:** 52
- **Total Epics:** 9
- **Total Stories:** 48
- **Coverage:** 100% (all FRs mapped to stories)
- **Orphaned FRs:** 0
- **Orphaned Stories:** 0

### Detailed Traceability

| FR ID | Requirement Summary | Epic | Stories | Phase | Status |
|-------|---------------------|------|---------|-------|--------|
| **Content Maturity System** |
| FR-001 | Growth stage assignment | Epic 1 | 1.1, 1.2 | 1A | MVP |
| FR-002 | Growth stage visibility | Epic 1 | 1.2, 1.4 | 1A | MVP |
| FR-003 | Growth stage filtering | Epic 5 | 5.3, 5.4 | 1A | MVP |
| FR-004 | Withered default hiding | Epic 1 | 1.3 | 1A | MVP |
| FR-005 | Withered explicit display | Epic 5 | 5.3 | 1A | MVP |
| FR-006 | Withered SEO inclusion | Epic 9 | 9.6 | 2 | Growth |
| FR-007 | Withered reason documentation | Epic 1 | 1.4 | 1A | MVP |
| **Anonymous Engagement** |
| FR-008 | Anonymous heart button | Epic 2 | 2.2 | 1A | MVP |
| FR-009 | Heart count display | Epic 2 | 2.2 | 1A | MVP |
| FR-010 | Heart count persistence | Epic 3 | 3.1 | 1A | MVP |
| FR-011 | Webmention reception | Epic 2 | 2.3 | 1A | MVP |
| FR-012 | Webmention display | Epic 2 | 2.4 | 1A | MVP |
| FR-013 | Webmention counting | Epic 3 | 3.2 | 1A | MVP |
| **Content Sorting & Visibility** |
| FR-014 | Pinned content designation | Epic 4 | 4.1 | 1A | MVP |
| FR-015 | Grace period visibility boost | Epic 4 | 4.2 | 1A | MVP |
| FR-016 | Last significant update tracking | Epic 4 | 4.2 | 1A | MVP |
| FR-017 | Popularity-based sorting | Epic 4 | 4.3 | 1A | MVP |
| FR-018 | Popularity score calculation | Epic 3 | 3.3 | 1A | MVP |
| FR-019 | Early promotion threshold | Epic 3 | 3.5 | 1A | MVP |
| FR-020 | Three-tier mental model | Epic 4 | 4.4 | 1A | MVP |
| **Content Update Transparency** |
| FR-021 | Content history recording | Epic 6 | 6.1 | 2 | Growth |
| FR-022 | Recent history widget | Epic 6 | 6.2 | 2 | Growth |
| FR-023 | Full history timeline | Epic 6 | 6.3 | 2 | Growth |
| FR-024 | New content badge | Epic 5 | 5.1 | 1A | MVP |
| FR-025 | Updated content badge | Epic 5 | 5.2 | 1A | MVP |
| **Content Format Diversity** |
| FR-026 | Article format | N/A | Existing | 1A | Existing |
| FR-027 | Log format | N/A | Existing | 1A | Existing |
| FR-028 | Link format | Epic 8 | 8.1, 8.2 | 1B | Growth |
| FR-029 | Video format | Epic 8 | 8.3, 8.4 | 1B | Growth |
| FR-030 | Gallery format | Epic 8 | 8.5, 8.6 | 1B | Growth |
| FR-031 | Portfolio format | Epic 8 | 8.7, 8.8 | 1B | Growth |
| FR-032 | Format filtering | Epic 5 | 5.4, 5.5 | 1A/1B | MVP/Growth |
| FR-033 | Combined filtering | Epic 5 | 5.6 | 1A | MVP |
| **Daily Data Operations** |
| FR-034 | Automated daily rebuild | Epic 2 | 2.6 | 1A | MVP |
| FR-035 | Engagement data fetching | Epic 3 | 3.1, 3.2 | 1A | MVP |
| FR-036 | Popularity score updates | Epic 3 | 3.3 | 1A | MVP |
| FR-037 | Data history preservation | Epic 3 | 3.4 | 1A | MVP |
| **Federated Publishing (POSSE)** |
| FR-038 | Mastodon auto-syndication | Epic 7 | 7.1 | 3 | Growth |
| FR-039 | Threads auto-syndication | Epic 7 | 7.2 | 3 | Growth |
| FR-040 | Manual POSSE documentation | Epic 7 | 7.3 | 3 | Growth |
| FR-041 | Syndication link display | Epic 7 | 7.4 | 3 | Growth |
| **SEO & Accessibility** |
| FR-042 | OG image generation | Epic 9 | 9.1 | 2 | Growth |
| FR-043 | Schema.org structured data | Epic 9 | 9.2 | 2 | Growth |
| FR-044 | No-JS fallback banner | Epic 9 | 9.3 | 2 | Growth |
| FR-045 | Keyboard navigation | Epic 9 | 9.4 | 2 | Growth |
| FR-046 | Screen reader support | Epic 9 | 9.4 | 2 | Growth |
| **Privacy & Compliance** |
| FR-047 | Zero tracking cookies | Epic 2 | 2.1 | 1A | MVP |
| FR-048 | Privacy policy publication | Epic 2 | 2.5 | 1A | MVP |
| FR-049 | Anonymous analytics | Epic 2 | 2.1 | 1A | MVP |
| **Configuration & Flexibility** |
| FR-050 | Configurable grace period | Epic 4 | 4.2 | 1A | MVP |
| FR-051 | Configurable pinned limit | Epic 4 | 4.1 | 1A | MVP |
| FR-052 | Feature toggle support | Multiple | Multiple | 1B-2 | Growth |

### Epic → Story Quick Reference

**Epic 1 (Growth Stage System):**
- Story 1.1: Growth Stage Frontmatter Field
- Story 1.2: Growth Stage Badge Component
- Story 1.3: Withered Content Default Hiding
- Story 1.4: Withered Content Warning Banner
- Story 1.5: Withered SEO & RSS Inclusion

**Epic 2 (Engagement Infrastructure):**
- Story 2.1: Umami Analytics Integration
- Story 2.2: Heart Button Component
- Story 2.3: Webmention Endpoint Setup
- Story 2.4: Webmention Display Component
- Story 2.5: Privacy Policy Page
- Story 2.6: Daily Rebuild GitHub Actions Workflow

**Epic 3 (Popularity Scoring Engine):**
- Story 3.1: Umami Hearts Fetch Script
- Story 3.2: Webmention Processing Script
- Story 3.3: Popularity Score Calculation Script
- Story 3.4: Data Commits to data-updates Branch
- Story 3.5: Early Promotion Logic

**Epic 4 (Three-Tier Sorting):**
- Story 4.1: Pinned Content (Tier 1)
- Story 4.2: Grace Period (Tier 2)
- Story 4.3: Established Content (Tier 3)
- Story 4.4: Homepage Layout Refactor

**Epic 5 (Badge & Filter System):**
- Story 5.1: New Badge Implementation
- Story 5.2: Updated Badge Implementation
- Story 5.3: Growth Stage Filter UI
- Story 5.4: Client-Side Filter JavaScript
- Story 5.5: Format Filter UI
- Story 5.6: Combined Filter Logic

**Epic 6 (History Timeline):**
- Story 6.1: History Frontmatter Field
- Story 6.2: Recent History Sidebar Widget
- Story 6.3: Full History Timeline (Article Footer)

**Epic 7 (POSSE & Advanced Webmentions):**
- Story 7.1: Mastodon API Integration
- Story 7.2: Threads API Integration (If Available)
- Story 7.3: Manual POSSE Documentation
- Story 7.4: Syndication Links Display
- Story 7.5: Advanced Webmention Threading

**Epic 8 (Format Expansion):**
- Story 8.1: Link Format - Archetype & Frontmatter
- Story 8.2: Link Format - Card & Template
- Story 8.3: Video Format - Archetype & Frontmatter
- Story 8.4: Video Format - Card & Embed
- Story 8.5: Gallery Format - Archetype & Structure
- Story 8.6: Gallery Format - Card & Lightbox
- Story 8.7: Portfolio Format - Archetype & Frontmatter
- Story 8.8: Portfolio Format - Card & Case Study

**Epic 9 (Polish & Optimization):**
- Story 9.1: OG Image Template & Generation
- Story 9.2: Schema.org Structured Data
- Story 9.3: No-JavaScript Fallback Banner
- Story 9.4: Accessibility Audit & Fixes
- Story 9.5: Performance Optimization
- Story 9.6: Withered Content SEO Integration

### Validation Summary

✅ **All FRs covered** - Every functional requirement maps to at least one story
✅ **No orphaned FRs** - No requirements without implementation stories
✅ **No orphaned stories** - All stories trace back to FRs
✅ **Sequencing validated** - No forward dependencies detected
✅ **Vertical slicing** - All stories deliverend-to-end value
✅ **Foundation appropriate** - Epic 1 & 2 establish baseline (brownfield-adapted)

---

## Appendix C: Glossary

**Digital Garden:** A website where content grows and evolves over time, prioritizing quality over chronology

**Growth Stage:** Content maturity indicator (Seedling, Budding, Evergreen, Withered)

**Grace Period:** 28-day visibility boost after content updates

**Popularity Score:** Engagement metric: `(hearts × 1) + (comments × 3) + (weight × 2)`

**Pinned:** Manually curated top content (max 3 site-wide)

**POSSE:** Publish Own Site, Syndicate Elsewhere (IndieWeb principle)

**Webmention:** Federated comment/mention system

**Withered:** Deprecated content, kept for historical context

---

## Appendix C: Success Metrics Dashboard

### Phase 1A Launch
- [ ] 10+ articles with growth_stage
- [ ] Daily rebuild success >95%
- [ ] Hearts functional 100%
- [ ] Homepage sorting verified
- [ ] Filters working
- [ ] Zero tracking cookies

### Phase 1B Launch
- [ ] All 6 formats implemented
- [ ] 2-3 examples per format
- [ ] Format filter (6 options)
- [ ] Responsive on mobile

### 3-Month Post-Launch
- [ ] 50% articles updated
- [ ] Top 5: 15+ popularity points
- [ ] 40% sessions use filters
- [ ] 10+ webmentions on popular articles
- [ ] All 6 formats in use

### 6-Month Goals
- [ ] 80% articles have history
- [ ] Evergreen: 2x traffic vs seedlings
- [ ] POSSE: 100% success (Mastodon)
- [ ] 100% GDPR compliance
- [ ] 50+ articles across formats

---

## Appendix D: Reference Links

**Digital Garden Examples:**
- [Maggie Appleton](https://maggieappleton.com/garden)
- [Tom Critchlow](https://tomcritchlow.com/)
- [Andy Matuschak](https://notes.andymatuschak.org/)

**Technical Resources:**
- [Hugo Documentation](https://gohugo.io/documentation/)
- [Umami Analytics](https://umami.is/)
- [Webmention.io](https://webmention.io/)
- [IndieWeb](https://indieweb.org/)

**Related Documents:**
- [Brainstorming Session Results](../brainstorming-session-results-2025-11-13.md)
- [Current State Analysis](../current-state-analysis-2025-11-13.md)
- [Final Decisions Summary](../final-decisions-summary.md)

---

## Document Status

**Version:** 1.1 (Sharded Edition)
**Last Updated:** 2025-11-14
**Status:** ✅ APPROVED - Ready for Phase 0

**Approval:**
- ✅ Product Owner (Angel) - APPROVED
- ✅ Business Analyst (Mary) - APPROVED
- ⏭️ Technical Review - Pending

**Change Log:**
- 2025-11-13 v1.0: Initial PRD
- 2025-11-13 v1.1: Updated with final decisions
- 2025-11-14 v1.1-sharded: Split into modular sections

---

[← Back to Index](./README.md) | [Previous: Risks & Dependencies](./09-risks-and-dependencies.md)

---

**End of PRD v1.1**

**Next Step:** Phase 0 Implementation
