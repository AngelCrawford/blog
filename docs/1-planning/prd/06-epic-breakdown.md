# 6. Epic Breakdown

[← Back to Index](./README.md) | [Previous: Technical Architecture](./05-technical-architecture.md) | [Next: Implementation Phases →](./07-implementation-phases.md)

---

## Epic 1: Engagement Infrastructure

**Goal:** Set up anonymous engagement tracking (hearts + webmentions)

**User Stories:**
- As Angel, I want to track engagement without cookies
- As a reader, I want to "heart" articles anonymously
- As a reader, I want to send webmentions from my blog

**Features:**
- Umami Cloud integration
- Heart button component
- Webmention.io setup
- GitHub Actions workflow

**Effort:** 2 weeks (Week 1-2)

---

## Epic 2: Growth Stage System

**Goal:** Visual content maturity indicators

**Features:**
- 4 growth stage badges (🌱🌿🌳💀)
- Frontmatter field integration
- Withered content handling

**Effort:** 1 week (Week 3)

---

## Epic 3: Popularity Scoring Engine

**Goal:** Calculate and store engagement scores

**Features:**
- Umami fetch script
- Webmention processing
- Popularity formula implementation
- Daily data commits to data-updates branch

**Effort:** 2 weeks (Week 4-5)

---

## Epic 4: Three-Tier Sorting

**Goal:** Homepage sorted by quality + freshness

**Features:**
- Tier 1: Pinned (max 3)
- Tier 2: Grace period (28 days)
- Tier 3: Popularity-based
- Early promotion logic (≥20 points)

**Effort:** 2 weeks (Week 4-5)

---

## Epic 5: Badge & Filter System

**Goal:** Visual badges + dual filtering UI

**Features:**
- New badge (< 4 weeks)
- Updated badge (in grace period)
- Format filter (6 options)
- Growth stage filter
- Client-side JavaScript filtering

**Effort:** 1 week (Week 6)

---

## Epic 6: History Timeline

**Goal:** Transparent content evolution tracking

**Features:**
- History frontmatter array
- Sidebar widget (3 recent)
- Full timeline (article footer)
- CSS timeline styling

**Effort:** 1 week (Week 10)

---

## Epic 7: POSSE & Advanced Webmentions

**Goal:** Federated content distribution

**Platforms:**
- Mastodon (automated)
- Threads (automated if possible)
- Facebook (manual guide)
- Reddit (manual guide)

**Features:**
- Mastodon API integration
- Threads API evaluation
- Advanced webmention threading
- Reply context display

**Effort:** 2 weeks (Week 12-13)

---

## Epic 8: Format Expansion

**Goal:** Implement 4 new content formats

**Formats:**
- Link (external curation)
- Video (YouTube/Vimeo)
- Gallery (photo collections)
- Portfolio (project showcases)

**Effort:** 3 weeks (Week 7-9)

---

## Epic 9: Polish & Optimization

**Goal:** Visual polish and performance

**Features:**
- OG image generation (Hugo)
- Withered in RSS/sitemap
- Schema.org updates
- No-JS banner
- Performance optimization
- Accessibility audit

**Effort:** 2 weeks (Week 10-11)

---

[← Back to Index](./README.md) | [Previous: Technical Architecture](./05-technical-architecture.md) | [Next: Implementation Phases →](./07-implementation-phases.md)
