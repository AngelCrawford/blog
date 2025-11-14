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

## Appendix B: Glossary

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
