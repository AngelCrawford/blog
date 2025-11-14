# Product Requirements Document: Digital Garden Transformation

**Product Name:** Article Time Digital Garden
**Version:** 1.1 (Sharded Edition)
**Date:** 2025-11-13
**Owner:** Angel Crawford
**Business Analyst:** Mary
**Status:** ✅ APPROVED - Ready for Implementation

---

## Document Structure

This PRD has been split into focused, manageable sections for easier navigation and maintenance.

### Quick Links

1. **[Executive Summary](./01-executive-summary.md)** - What we're building and why
2. **[Vision & Goals](./02-vision-and-goals.md)** - Product vision, philosophy, success metrics
3. **[Core Features](./03-core-features.md)** - Growth stages, sorting, popularity, engagement
4. **[Content Formats](./04-content-formats.md)** - All 6 formats (Article, Log, Link, Video, Gallery, Portfolio)
5. **[Technical Architecture](./05-technical-architecture.md)** - System design, tech stack, data flow
6. **[Epic Breakdown](./06-epic-breakdown.md)** - 9 epics with user stories and acceptance criteria
7. **[Implementation Phases](./07-implementation-phases.md)** - Phase 0-4 detailed roadmap (14 weeks)
8. **[Final Decisions](./08-final-decisions.md)** - All 10 decisions with implementation details
9. **[Risks & Dependencies](./09-risks-and-dependencies.md)** - Critical path, technical risks, mitigations
10. **[Appendices](./10-appendices.md)** - Frontmatter schema, glossary, metrics dashboard

---

## Quick Reference - Final Decisions

| Decision | Final Choice | Details |
|----------|--------------|---------|
| **Withered Handling** | Hide by default, include in SEO/RSS | [Section 8.1](./08-final-decisions.md#decision-1-withered-content-handling) |
| **Grace Period** | 4 weeks (configurable) | [Section 8.2](./08-final-decisions.md#decision-2-grace-period-duration) |
| **Pinned Limit** | Exactly 3 articles | [Section 8.3](./08-final-decisions.md#decision-3-pinned-article-limit) |
| **Formats** | 6 total: Article, Log, Link, Video, Gallery, Portfolio | [Section 4](./04-content-formats.md) |
| **Webmention Moderation** | Auto-approve, monitor for spam | [Section 8.5](./08-final-decisions.md#decision-5-webmention-moderation) |
| **Umami Hosting** | Cloud Hobby (FREE with API) | [Section 8.6](./08-final-decisions.md#decision-6-umami-hosting) |
| **Deployment** | GitHub Pages | [Section 8.7](./08-final-decisions.md#decision-7-deployment-platform) |
| **OG Images** | Hugo image processing | [Section 8.8](./08-final-decisions.md#decision-8-og-image-generation) |
| **POSSE Targets** | Automate: Mastodon + Threads, Manual: Facebook + Reddit | [Section 8.9](./08-final-decisions.md#decision-9-posse-platforms) |
| **Data Storage** | Commit to `data-updates` branch | [Section 8.10](./08-final-decisions.md#decision-10-data-file-storage) |

**Timeline:** ~14 weeks (3.5 months)
**Scope:** Quality over speed - implementing all features properly

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-13 | Mary (Business Analyst) | Initial PRD from brainstorming + codebase analysis |
| 1.1 | 2025-11-13 | Mary (Business Analyst) | Updated with all final decisions from Angel |
| 1.1-sharded | 2025-11-14 | Mary (Business Analyst) | Split into modular sections for easier navigation |

**Related Documents:**
- [Brainstorming Session Results](../brainstorming-session-results-2025-11-13.md)
- [Current State Analysis](../current-state-analysis-2025-11-13.md)
- [Final Decisions Summary](../final-decisions-summary.md)
- [Open Questions Decision Guide](../open-questions-decision-guide.md)

---

## How to Navigate This PRD

**For Quick Overview:**
- Start with [Executive Summary](./01-executive-summary.md)
- Review [Final Decisions](./08-final-decisions.md)

**For Technical Planning:**
- Read [Technical Architecture](./05-technical-architecture.md)
- Study [Epic Breakdown](./06-epic-breakdown.md)
- Follow [Implementation Phases](./07-implementation-phases.md)

**For Feature Details:**
- Review [Core Features](./03-core-features.md)
- Explore [Content Formats](./04-content-formats.md)

**For Risk Assessment:**
- Check [Risks & Dependencies](./09-risks-and-dependencies.md)

---

## Approval Status

- ✅ Product Owner (Angel) - **APPROVED**
- ✅ Business Analyst (Mary) - **APPROVED**
- ⏭️ Technical Review - Pending (Phase 0)

---

**Next Document:** Phase 0 Detailed Task Breakdown

**Status: ✅ APPROVED - Ready for Phase 0 Implementation**
