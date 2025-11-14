# 8. Final Decisions

[← Back to Index](./README.md) | [Previous: Implementation Phases](./07-implementation-phases.md) | [Next: Risks & Dependencies →](./09-risks-and-dependencies.md)

---

**Date:** 2025-11-13
**Analyst:** Mary (Business Analyst)
**Participant:** Angel Crawford
**Status:** LOCKED - Ready for Implementation

---

## All 10 Questions - Final Decisions

### Question 1: Withered Content Handling
**Decision:** Hide by default, include in SEO/RSS with "[Withered DATE]" suffix

**Implementation Details:**
- **Filter UI:** Withered hidden by default, explicit "Show Withered" toggle
- **RSS Feed:** Include withered with title suffix: `"Article Title [Withered Nov 2025]"`
- **RSS Description:** Prepend warning: `⚠️ This content is deprecated as of [DATE]. Reason: [REASON]`
- **Sitemap:** Include withered, use `withered_date` for `<lastmod>`, set `<priority>` to 0.3
- **SEO:** Timeline-based signals (lastmod = when deprecated)
- **Archive Page:** Already exists at `/pages/archiv/` - can link withered content there

**Frontmatter Addition:**
```yaml
growth_stage: "withered"
withered_date: 2025-11-13  # When deprecated
withered_reason: "Framework deprecated, see new article: /new-article/"  # Optional
```

**Benefits:**
- Clean homepage (only current content visible)
- SEO preserved (all content indexed)
- Transparent to RSS subscribers
- Search engines understand deprecation timeline

---

### Question 2: Grace Period Duration
**Decision:** 4 weeks (28 days), configurable in params

**Implementation:**
```yaml
# config/_default/params.yaml
digital_garden:
  grace_period_days: 28  # Easy to change later
```

**Re-evaluation Plan:**
- After 3 months, analyze grace period tier size
- Adjust to 2 or 6 weeks if data suggests
- Target: 30-40% of homepage in grace period tier

---

### Question 3: Pinned Article Limit
**Decision:** Exactly 3 articles

**Implementation:**
```yaml
# Frontmatter
weight: 10  # Pinned (max 3 site-wide enforced in template)
```

**Template Logic:**
```html
{{ $pinned := where .Pages "Params.weight" "eq" 10 | first 3 }}
```

**Rationale:**
- Forces quality curation (only best content)
- Doesn't dominate homepage (50% of first page)
- Clear "Top 3" mental model

---

### Question 4: Format Expansion Priority
**Decision:** Implement ALL formats, no rush to go live

**Formats to Implement:**

#### Phase 1A (Core - Already Exist)
1. ✅ **Article** - Long-form blog posts (EXISTING)
2. ✅ **Log** - Microblog, quotes, short thoughts (EXISTING)

#### Phase 1B (New Formats - High Priority)
3. ❌ **Link** - External resource with commentary
   - Card: Shows domain, external link icon, opens in new tab
   - Frontmatter: `url`, `domain`, `summary`
   - Use case: Bookmarks, resource curation
   - Effort: 2-3 days

4. ❌ **Video** - YouTube/Vimeo embeds with notes
   - Card: Video thumbnail, duration, platform icon
   - Frontmatter: `video_url`, `video_id`, `platform`
   - Use case: Video sharing with commentary
   - Effort: 2-3 days

#### Phase 1C (New Formats - Medium Priority)
5. ❌ **Gallery** - Photo collections with captions
   - Card: Image grid (2×2 or 3×3), photo count badge
   - Frontmatter: Multiple images in resources folder
   - Use case: Photo essays, travel logs, design showcases
   - Effort: 4-5 days (complex layout)

6. ❌ **Portfolio** - Project showcases
   - Card: Project preview, tech stack, links (demo, GitHub)
   - Frontmatter: `project_url`, `github_url`, `tech_stack`, `role`
   - Use case: Work samples, case studies
   - Effort: 3-4 days

#### Removed Format
- ~~**Instagram**~~ - Identical to Log design-wise, NOT NEEDED ✅

**Total New Formats:** 4 (Link, Video, Gallery, Portfolio)
**Total Implementation Time:** ~12-15 days

**Archetype Structure:**
```
archetypes/
├── articles/index.md  ✅ Exists
├── logs/index.md      ✅ Exists
├── links/index.md     ❌ Create
├── videos/index.md    ❌ Create
├── galleries/index.md ❌ Create
└── portfolio/index.md ❌ Create
```

**Revised Timeline:**
- Phase 1A: Core Garden (sorting, growth stages, engagement) - 6 weeks
- Phase 1B: Format Expansion (Link, Video, Gallery, Portfolio) - 3 weeks
- Phase 2: Polish & History - 2 weeks
- Phase 3: POSSE & Advanced Webmentions - 2 weeks
- **Total: ~13 weeks (3 months)**

---

### Question 5: Webmention Moderation
**Decision:** Auto-approve all, add moderation later if spam > 10%

**Implementation:**
- Phase 1-2: All webmentions display automatically
- Monitor spam rate weekly
- If spam > 10%: Implement trusted domain whitelist
- If spam > 30%: Implement manual moderation queue

**Monitoring Script:**
```js
// Weekly check
const spamRate = spamCount / totalMentions;
if (spamRate > 0.1) console.log('⚠️ Consider adding moderation');
```

---

### Question 6: Umami Analytics Hosting
**Decision:** Umami Cloud Hobby (FREE) - API key confirmed available!

**Details:**
- **Plan:** Hobby (Free forever)
- **Limits:** 100K events/month, 3 websites, 6-month retention
- **API Access:** ✅ Confirmed - Can generate API keys
- **Cost:** $0/month

**API Setup:**
1. Umami Cloud → Settings → API Keys → Generate key
2. Add to GitHub Secrets: `UMAMI_API_KEY`
3. Daily rebuild fetches heart events via API
4. No rate limit issues (1 call/day = 30 calls/month, well under limit)

**Perfect solution:** Free, managed, API access, no maintenance!

---

### Question 7: Deployment Platform
**Decision:** GitHub Pages

**Configuration:**
```yaml
# .github/workflows/daily-rebuild.yml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./public
    cname: article-time.de  # Custom domain
```

**Limits (not a concern):**
- Repository: 1 GB (you'll use < 500 MB)
- Site size: 1 GB (you'll use < 300 MB even after 3 years)
- Bandwidth: 100 GB/month (supports ~100K pageviews)
- Build time: ~2-5 minutes (acceptable for daily rebuilds)

**Image Processing:**
- Hugo processes at build time (not per request)
- Cached in /resources/ (fast subsequent builds)
- Can handle thousands of images before issues
- OG image generation: +30-60 seconds per build

**Custom Domain:**
- article-time.de via CNAME
- GitHub Pages supports HTTPS (Let's Encrypt)

---

### Question 8: OG Image Generation
**Decision:** Hugo Image Processing (Option A)

**Implementation:**
```html
<!-- layouts/partials/og-image-generator.html -->
{{ $template := resources.Get "images/og-template.png" }}
{{ $badge := resources.Get (printf "images/badges/%s.png" .Params.growth_stage) }}

{{ $img := $template | images.Filter (images.Text .Title (dict
    "color" "#ffffff"
    "size" 48
    "font" "Montserrat"
)) }}

{{ $img = $img | images.Filter (images.Overlay $badge (dict "x" 1000 "y" 50)) }}
{{ $img = $img.Resize "1200x630 webp" }}

<meta property="og:image" content="{{ $img.Permalink }}" />
```

**Build Time Impact:**
- First build: +30-60 seconds (all OG images)
- Subsequent: ~5-10 seconds (only new/updated articles)
- Cached in /resources/_gen/images/

**No regeneration per request!** Static files served by GitHub Pages.

**Image Limits:**
- 100 articles × 1 OG image each = 100 OG images
- Each: ~150 KB × 100 = 15 MB total
- GitHub Pages: No problem (1 GB site limit)

---

### Question 9: POSSE Target Platforms
**Decision:** Automate Mastodon + Threads (if possible), Manual for Facebook + Reddit

**Your Social Accounts:**
- ✅ **Mastodon** - Automate in Phase 3
- ✅ **Threads** - Automate if API allows (Meta platform)
- ✅ **Facebook** - Personal profile, manual posting (API restrictions)
- ✅ **Reddit** - Personal profile, manual posting (subreddit rules vary)

**Phase 3 POSSE Implementation:**

#### Mastodon (Automate - Priority 1)
```js
// scripts/posse-mastodon.js
const Mastodon = require('mastodon-api');

const M = new Mastodon({
  access_token: process.env.MASTODON_TOKEN,
  api_url: 'https://mastodon.social/api/v1/'
});

M.post('statuses', {
  status: `🌱 New article: ${article.title}\n\n${article.summary}\n\n🔗 ${article.url}\n\n#DigitalGarden #Hugo`,
  visibility: 'public'
});
```

**Effort:** 1-2 days
**Cost:** Free
**API:** Stable, well-documented

---

#### Threads (Automate - Priority 2, If Possible)
**API Status:** Meta Threads API launched 2024, available for developers

**Requirements:**
- Meta developer account
- Threads account
- API access token

**Implementation:**
```js
// scripts/posse-threads.js
// Similar to Instagram Graph API
const response = await fetch('https://graph.threads.net/v1.0/me/threads', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.THREADS_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    media_type: 'TEXT',
    text: `New article: ${article.title}\n\n${article.summary}\n\n${article.url}`
  })
});
```

**Effort:** 2-3 days (newer API, less documentation)
**Cost:** Free
**API:** Available, but check current limits

**Fallback:** If Threads API too complex, keep manual

---

#### Facebook (Manual - Personal Profile)
**Why manual:**
- Facebook API for personal profiles is restricted
- Posting requires Facebook Pages API (business pages)
- Personal timeline posting via API = against TOS
- Different engagement patterns (friends vs. public)

**Strategy:**
- Post manually to personal profile
- Tailor message to friends/family audience
- Use Facebook sharing debugger for OG previews

**Effort:** 2-3 minutes per article (manual)

---

#### Reddit (Manual - Personal Profile)
**Why manual:**
- Each subreddit has different rules
- Self-promotion often restricted
- Needs context/community participation
- API posting without engagement = spam

**Strategy:**
- Share to relevant subreddits manually
- Add context, engage in comments
- Follow 10:1 rule (10 comments : 1 self-post)

**Effort:** 5-10 minutes per article (manual + engagement)

---

**POSSE Summary:**

| Platform | Method | Phase | Effort | API | Notes |
|----------|--------|-------|--------|-----|-------|
| **Mastodon** | Automated | Phase 3 | 1-2 days | ✅ Easy | Top priority |
| **Threads** | Automated (try) | Phase 3 | 2-3 days | ⚠️ New | If API allows |
| **Facebook** | Manual | All | 2 min/article | ❌ Restricted | Personal profile TOS |
| **Reddit** | Manual | All | 10 min/article | ⚠️ Anti-spam | Needs engagement |

**Phase 3 Goal:** Automate Mastodon for sure, attempt Threads automation

---

### Question 10: Data File Storage
**Decision:** Commit to repo, use separate `data-updates` branch

**Implementation:**

#### Branch Structure
```
main (clean commit history)
├── code, content, layouts, config
└── (data files NOT committed here)

data-updates (data-only history)
└── data/
    ├── popularity_scores.json
    ├── umami_hearts.json
    └── webmentions_by_article.json
```

#### GitHub Actions Workflow
```yaml
# .github/workflows/daily-rebuild.yml
name: Daily Rebuild with Engagement Data

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
  workflow_dispatch:

jobs:
  fetch-and-rebuild:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout main branch
        uses: actions/checkout@v4
        with:
          ref: main

      - name: Setup Node.js & Hugo
        # ... setup steps

      - name: Fetch engagement data
        env:
          UMAMI_API_KEY: ${{ secrets.UMAMI_API_KEY }}
        run: |
          node scripts/fetch-umami-hearts.js
          curl "https://webmention.io/api/mentions.jf2?domain=article-time.de" -o data/webmentions_raw.json
          node scripts/process-webmentions.js
          node scripts/calculate-popularity.js

      - name: Commit to data-updates branch
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"

          # Create/switch to data-updates branch
          git checkout -B data-updates

          # Commit data files
          git add data/*.json
          git commit -m "chore: update popularity scores $(date +%Y-%m-%d) [skip ci]" || echo "No changes"
          git push origin data-updates --force

          # Switch back to main
          git checkout main

      - name: Copy data from data-updates branch
        run: |
          # Fetch latest data from data-updates branch
          git fetch origin data-updates
          git checkout origin/data-updates -- data/
          # Now main has updated data (not committed), ready for build

      - name: Build Hugo site
        run: |
          npm install
          hugo --environment production --minify

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          cname: article-time.de
```

#### Benefits
✅ **Clean main branch:** Only feature/content commits
✅ **Data history preserved:** Can inspect historical scores
✅ **No commit noise:** Daily data updates on separate branch
✅ **Local development:** Merge data-updates to test locally
✅ **Transparency:** Public data visible in data-updates branch

#### Accessing Historical Data
```bash
# View data from November 15, 2025
git checkout data-updates
git log --since="2025-11-15" --until="2025-11-16" -- data/popularity_scores.json
git show <commit-hash>:data/popularity_scores.json
```

---

## GitHub Secrets Required

Add these to GitHub Repository Settings → Secrets:

```
UMAMI_API_KEY          - Umami Cloud API key
UMAMI_WEBSITE_ID       - Umami website ID
MASTODON_TOKEN         - Mastodon app access token
MASTODON_INSTANCE_URL  - E.g., https://mastodon.social
THREADS_TOKEN          - (If Threads automation works)
```

---

## Configuration Files to Create

```yaml
# config/_default/params.yaml additions
digital_garden:
  grace_period_days: 28
  pinned_limit: 3
  enable_hearts: true
  enable_webmentions: true

umami:
  website_id: "your-website-id"
  script_url: "https://cloud.umami.is/script.js"

webmentions:
  endpoint: "https://webmention.io/article-time.de/webmention"

posse:
  mastodon:
    enabled: true
    instance: "https://mastodon.social"
  threads:
    enabled: false  # Set true when ready
```

---

## Next Steps

1. ✅ **Decisions locked** - All 10 questions answered
2. ✅ **PRD updated** - Incorporated into sharded PRD
3. ⏭️ **Begin Phase 0** - Foundation cleanup tasks
4. ⏭️ **Set up Umami API key** - Generate and test
5. ⏭️ **Architecture workflow** - Use PRD as input for technical design

---

*Decisions finalized by Angel Crawford & Mary (Business Analyst)*
*Date: 2025-11-13*
*Status: LOCKED - Ready for implementation*

---

[← Back to Index](./README.md) | [Previous: Implementation Phases](./07-implementation-phases.md) | [Next: Risks & Dependencies →](./09-risks-and-dependencies.md)
