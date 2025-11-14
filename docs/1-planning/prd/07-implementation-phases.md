# 7. Implementation Phases

[← Back to Index](./README.md) | [Previous: Epic Breakdown](./06-epic-breakdown.md) | [Next: Final Decisions →](./08-final-decisions.md)

---

## Timeline Overview

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 0: Foundation | 1 week | 1 week |
| Phase 1A: Core Garden | 6 weeks | 7 weeks |
| Phase 1B: Formats | 3 weeks | 10 weeks |
| Phase 2: Polish | 2 weeks | 12 weeks |
| Phase 3: POSSE | 2 weeks | **14 weeks** |
| **Total to Launch** | | **~3.5 months** |

---

## Phase 0: Foundation Cleanup (1 week)

**Goal:** Prepare infrastructure

### Tasks
- [ ] Generate Umami API key
- [ ] Add GitHub Secrets (UMAMI_API_KEY, UMAMI_WEBSITE_ID)
- [ ] Validate security headers (#38)
- [ ] Validate RSS feed (#31)
- [ ] Add privacy policy (#49)
- [ ] Add contact page (#41)
- [ ] Create `data-updates` branch
- [ ] Configure GitHub Pages (article-time.de)

---

## Phase 1A: Core Garden (6 weeks)

**Goal:** Build digital garden sorting + engagement

### Week 1-2: Engagement Infrastructure
- [ ] Umami script in `<head>`
- [ ] Heart button component
- [ ] Webmention.io setup
- [ ] GitHub Actions workflow
- [ ] Test daily rebuild

### Week 3: Growth Stage System
- [ ] Add growth_stage frontmatter
- [ ] Design 4 badges (🌱🌿🌳💀)
- [ ] Badge display on cards
- [ ] Withered warning banner
- [ ] Update archetypes

### Week 4-5: Popularity Scoring & Sorting
- [ ] fetch-umami-hearts.js
- [ ] process-webmentions.js
- [ ] calculate-popularity.js
- [ ] last_significant_update field
- [ ] Grace period logic (28 days)
- [ ] Refactor home.html (3 tiers)
- [ ] data-updates branch workflow

### Week 6: Badges & Filters
- [ ] New badge (< 4 weeks)
- [ ] Updated badge (grace period)
- [ ] Dual filter UI (format + stage)
- [ ] filter.js (client-side)
- [ ] "Show Withered" toggle

---

## Phase 1B: Format Expansion (3 weeks)

**Goal:** Implement 4 new formats

### Week 7-8: Link & Video
**Link Format (3 days):**
- [ ] archetypes/links/index.md
- [ ] Link card design
- [ ] layouts/links/single.html
- [ ] Test with samples

**Video Format (3 days):**
- [ ] archetypes/videos/index.md
- [ ] Video card (thumbnail, play icon)
- [ ] YouTube thumbnail fetch
- [ ] layouts/videos/single.html
- [ ] Responsive embed

### Week 9: Gallery & Portfolio
**Gallery Format (4 days):**
- [ ] archetypes/galleries/index.md
- [ ] Gallery card (image grid)
- [ ] layouts/galleries/single.html
- [ ] Lightbox/modal
- [ ] Lazy loading

**Portfolio Format (3 days):**
- [ ] archetypes/portfolio/index.md
- [ ] Portfolio card (tech stack)
- [ ] layouts/portfolio/single.html
- [ ] Tech stack icons

---

## Phase 2: Polish & History (2 weeks)

**Goal:** Add transparency and visual polish

### Week 10
- [ ] History frontmatter implementation
- [ ] History sidebar widget (3 recent)
- [ ] Full history timeline (footer)
- [ ] Withered in RSS/sitemap
- [ ] Update archetypes with history

### Week 11
- [ ] OG image template
- [ ] Hugo image processing for OG
- [ ] Growth stage badge on OG images
- [ ] Schema.org updates
- [ ] No-JS banner
- [ ] Performance optimization (Lighthouse)
- [ ] Accessibility audit (WCAG AA)

---

## Phase 3: Federated Community (2 weeks)

**Goal:** POSSE automation + advanced webmentions

### Week 12
- [ ] Mastodon account setup
- [ ] Generate Mastodon API token
- [ ] posse-mastodon.js script
- [ ] Test Mastodon posting
- [ ] Add to GitHub Actions
- [ ] Evaluate Threads API
- [ ] posse-threads.js (if possible)

### Week 13
- [ ] Advanced webmention display
- [ ] Reply context/threading
- [ ] Author avatars
- [ ] Conversation threading UI
- [ ] Syndication links (footer)
- [ ] Facebook posting guide
- [ ] Reddit posting guide (10:1 rule)

---

## Phase 4: Future Enhancements (Ongoing)

**Goal:** Nice-to-have features

### Features (as time permits)
- [ ] Webring integration (#146)
- [ ] Sidenotes (#157)
- [ ] Error/info notifications (#46)
- [ ] Concept-based related articles (TF-IDF)
- [ ] Visual garden map (force-directed graph)
- [ ] Additional formats (Quote, Book, Event)

---

[← Back to Index](./README.md) | [Previous: Epic Breakdown](./06-epic-breakdown.md) | [Next: Final Decisions →](./08-final-decisions.md)
