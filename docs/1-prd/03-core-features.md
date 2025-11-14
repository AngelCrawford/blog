# 3. Core Features

[← Back to Index](./README.md) | [Previous: Vision & Goals](./02-vision-and-goals.md) | [Next: Content Formats →](./04-content-formats.md)

---

## Feature 1: Growth Stage System

### Overview

Articles progress through 4 distinct growth stages, visualized with badges and tracked in frontmatter.

### Growth Stages

#### 🌱 Seedling
**Definition:** New ideas, rough drafts, work-in-progress
**Characteristics:**
- Recently planted (< 4 weeks old)
- Incomplete or exploratory
- May have TODOs or gaps
- Open to feedback

**Use Cases:**
- Brain dumps
- Initial research notes
- Experimental ideas
- "Note to self" content

#### 🌿 Budding
**Definition:** Growing content, being refined
**Characteristics:**
- Structure emerging
- Key points established
- Still evolving
- 1-3 updates since planting

**Use Cases:**
- Tutorials in progress
- Expanding thoughts
- Adding examples
- Incorporating feedback

#### 🌳 Evergreen
**Definition:** Mature, stable, high-quality
**Characteristics:**
- Well-structured
- Comprehensive
- Regularly maintained
- Proven valuable (high engagement)

**Use Cases:**
- Reference guides
- Definitive tutorials
- Core philosophy posts
- Flagship content

#### 💀 Withered
**Definition:** Deprecated, outdated, historical
**Characteristics:**
- No longer accurate/relevant
- Framework/tool deprecated
- Better alternative exists
- Kept for historical context

**Use Cases:**
- Outdated framework guides
- Superseded approaches
- Historical snapshots
- Migration archived

### Implementation

**Frontmatter:**
```yaml
growth_stage: "seedling"  # seedling, budding, evergreen, withered
```

**Badge Display:**
- Card: Top-right corner
- Single page: Below title
- Filter UI: Filter by stage

**Withered Handling:**
- Hidden by default on homepage
- Explicit "Show Withered" toggle
- Included in SEO/RSS with "[Withered DATE]" suffix
- Warning banner on single pages
- Link to replacement content (if exists)

---

## Feature 2: Three-Tier Sorting Algorithm

### Overview

Homepage content sorted into 3 distinct tiers, creating a mental model of importance and freshness.

### Tier 1: Pinned (Manual Curation)

**Criteria:** `weight: 10` (exactly 3 articles maximum)

**Purpose:** Showcase flagship content

**Template Logic:**
```html
{{ $pinned := where .Pages "Params.weight" "eq" 10 | first 3 }}
```

**Selection Strategy:**
- Only absolute best content
- Rotate periodically based on relevance
- Balanced across topics/formats

### Tier 2: Grace Period (Freshness Boost)

**Criteria:** Updated within last 28 days

**Field:** `last_significant_update: 2025-11-13`

**Purpose:** Reward content updates

**Grace Period Duration:** Configurable in `params.yaml`
```yaml
digital_garden:
  grace_period_days: 28  # Adjustable
```

**What Counts as "Significant":**
- New sections added
- Examples expanded
- Major corrections
- Substantial rewrites
- NOT: Typo fixes, formatting tweaks

**Target Distribution:** 30-40% of homepage

### Tier 3: Established (Popularity-Based)

**Criteria:** All non-pinned, non-grace-period content

**Sorting:** By popularity score (descending)

**Formula:**
```
popularity_score = (hearts × 1) + (comments × 3) + (weight × 2)
```

**Early Promotion:** Articles with ≥20 points promoted to top of Tier 3

**Re-sort Frequency:** Daily (via GitHub Actions rebuild)

---

## Feature 3: Popularity Score Formula

### Components

**Hearts (weight: 1):**
- Anonymous "like" via Umami events
- No login required
- GDPR-compliant (no cookies)
- One click = +1 score

**Comments (weight: 3):**
- Webmentions (replies, mentions, reposts)
- Federated engagement
- Values conversation over passive likes
- One webmention = +3 score

**Manual Weight (weight: 2):**
- Editorial boost (0-10 scale)
- Highlights quality, not just engagement
- Useful for evergreen content
- weight: 5 = +10 score

### Calculation

**Script:** `scripts/calculate-popularity.js`

```javascript
const popularityScore = (
  (hearts * 1) +
  (webmentions * 3) +
  (weight * 2)
);
```

**Data Sources:**
- Hearts: Umami Cloud API (daily fetch)
- Webmentions: webmention.io API (daily fetch)
- Weight: Frontmatter (manual, committed)

**Storage:** `data/popularity_scores.json` (generated daily, committed to `data-updates` branch)

**Update Frequency:** Daily at 2 AM UTC

---

## Feature 4: Grace Period Logic

### Trigger

`last_significant_update` field updated → Grace period starts

### Duration

28 days (configurable)

### Configuration

```yaml
# config/_default/params.yaml
digital_garden:
  grace_period_days: 28
```

### Behavior

**Within Grace Period:**
- Article appears in Tier 2 (Grace Period)
- "Updated" badge visible
- Boosted visibility regardless of popularity
- Sorting: Most recent update first

**After Grace Period:**
- Article moves to Tier 3 (Established)
- "Updated" badge removed
- Sorted by popularity score
- Can be promoted back via new update

### Edge Cases

**Article Published + Updated Same Day:**
- Both "New" and "Updated" badges show
- Grace period starts from `last_significant_update`

**Pinned + In Grace Period:**
- Stays in Tier 1 (Pinned)
- Grace period doesn't apply
- Still shows "Updated" badge

**Withered + Updated:**
- Grace period applies
- But still hidden by default (withered filter)
- Useful for "final update before deprecation"

---

## Feature 5: Umami Analytics + Heart Events

### Hosting

**Platform:** Umami Cloud Hobby (FREE plan)

**Why:**
- Angel already has account
- Free plan includes API access
- Zero monthly cost
- No setup overhead
- No maintenance burden

### Heart Button

**Frontend:**
```html
<button class="heart-button" data-article="{{ .Permalink }}">
  ♥ {{ .Params.hearts | default 0 }}
</button>
```

**JavaScript:**
```javascript
// assets/js/heart.js
button.addEventListener('click', () => {
  umami.track('heart', { article: articleUrl });
  // Visual feedback (+1, animation)
});
```

**Umami Event:**
- Event name: `heart`
- Event data: `{ article: "https://article-time.de/articles/my-post/" }`
- Anonymous (no user ID)
- No cookies

### Daily Fetch

**Script:** `scripts/fetch-umami-hearts.js`

**API Call:**
```javascript
const response = await fetch(`${UMAMI_API_URL}/websites/${WEBSITE_ID}/stats`, {
  headers: { 'Authorization': `Bearer ${UMAMI_API_KEY}` }
});
```

**Output:** `data/umami_hearts.json`

```json
{
  "/articles/my-post/": 42,
  "/articles/another-post/": 17
}
```

**Frequency:** Once per day (2 AM UTC via GitHub Actions)

---

## Feature 6: Webmention Integration

### Service

**Platform:** webmention.io (free, open source)

### Setup

**1. Add Endpoint to Site:**
```html
<link rel="webmention" href="https://webmention.io/article-time.de/webmention" />
```

**2. Receive Mentions:**
- Replies on Mastodon
- Mentions on other blogs
- Reposts/shares

**3. Daily Fetch:**
```bash
curl "https://webmention.io/api/mentions.jf2?domain=article-time.de" \
  -o data/webmentions_raw.json
```

**4. Process Webmentions:**

**Script:** `scripts/process-webmentions.js`

```javascript
// Group by article URL
const webmentionsByArticle = {
  "/articles/my-post/": [
    { type: "reply", author: "Jane", content: "Great post!", ... },
    { type: "repost", author: "Bob", ... }
  ]
};
```

**Output:** `data/webmentions_by_article.json`

### Moderation

**Policy:** Auto-approve all (initially)

**Monitoring:**
- Track spam rate weekly
- If spam >10%: Implement trusted domain whitelist
- If spam >30%: Implement manual review queue

**Escape Hatch:**
```yaml
# config/_default/params.yaml
webmentions:
  moderation: true  # Toggle on if needed
  auto_approve_domains: ['mastodon.social', 'micro.blog']
```

### Display

**Article Footer:**
- "Replies & Mentions" section
- Author avatar (from webmention data)
- Reply text
- Link to original mention
- Grouped by type (replies, reposts, likes)

---

## Feature 7: Dual Filter System

### Filter Options

**Format Filter:**
- All (default)
- Article
- Log
- Link
- Video
- Gallery
- Portfolio

**Growth Stage Filter:**
- All (default, hides withered)
- 🌱 Seedling
- 🌿 Budding
- 🌳 Evergreen
- 💀 Withered (explicit opt-in)

### Implementation

**HTML:**
```html
<div class="filters">
  <!-- Format Filter -->
  <div class="filter-group">
    <button data-filter="format" data-value="all">All</button>
    <button data-filter="format" data-value="article">Articles</button>
    <!-- ... -->
  </div>

  <!-- Stage Filter -->
  <div class="filter-group">
    <button data-filter="stage" data-value="all-except-withered">All</button>
    <button data-filter="stage" data-value="seedling">🌱 Seedling</button>
    <!-- ... -->
    <button data-filter="stage" data-value="withered">💀 Show Withered ({{ count }})</button>
  </div>
</div>
```

**Card Attributes:**
```html
<article class="card" data-format="article" data-stage="budding">
  <!-- ... -->
</article>
```

**JavaScript:**
```javascript
// assets/js/filter.js
function filterCards(format, stage) {
  cards.forEach(card => {
    const matchesFormat = (format === 'all' || card.dataset.format === format);
    const matchesStage = (stage === 'all-except-withered' && card.dataset.stage !== 'withered') ||
                          (stage === 'all' || card.dataset.stage === stage);

    card.style.display = (matchesFormat && matchesStage) ? 'block' : 'none';
  });
}
```

**Default State:**
- Format: All
- Stage: All (except withered)

**Combination Filtering:**
- Both filters apply simultaneously (AND logic)
- Example: "Videos that are Evergreen"

---

## Feature 8: Badge System

### Badge Types

#### Growth Stage Badge (Always Visible)
- Position: Top-right corner of card
- Designs: 🌱 🌿 🌳 💀 (emoji or SVG)
- Color-coded background
- Tooltip: Full stage name

#### New Badge
- **Criteria:** `date` < 28 days old
- **Visual:** "New" ribbon, bright color
- **Position:** Top-left corner of card
- **Duration:** 4 weeks from publish date
- **Logic:**
```hugo
{{ if (time .Date).After (now.AddDate 0 0 -28) }}
  <span class="badge badge-new">New</span>
{{ end }}
```

#### Updated Badge
- **Criteria:** In grace period (last_significant_update < 28 days ago)
- **Visual:** "Updated" ribbon, accent color
- **Position:** Top-left corner (below New if both)
- **Duration:** 28 days from last significant update
- **Logic:**
```hugo
{{ with .Params.last_significant_update }}
  {{ if (time .).After (now.AddDate 0 0 -28) }}
    <span class="badge badge-updated">Updated</span>
  {{ end }}
{{ end }}
```

### Badge Priority

1. Growth Stage (always)
2. New (if < 4 weeks old)
3. Updated (if in grace period)

**Both New + Updated:**
- Stack vertically
- New on top, Updated below
- Both visible simultaneously

---

## Feature 9: History Timeline

### Purpose

Transparency about content evolution. Show readers that articles grow and change over time.

### Frontmatter

```yaml
history:
  - date: 2025-11-13
    note: "Initial planting 🌱"
  - date: 2025-11-20
    note: "Added 3 practical examples"
  - date: 2025-12-01
    note: "Expanded troubleshooting section"
  - date: 2026-01-15
    note: "Major rewrite, updated for 2026"
```

### Display Locations

#### Sidebar Widget (3 Recent Entries)
- Compact list
- Icon: 📜 or timeline SVG
- "3 recent updates" heading
- Link to full history

#### Article Footer (Full History)
- Timeline visualization (CSS)
- All history entries
- Chronological (newest first or oldest first)
- Date + note for each entry
- Visual connection lines

### Implementation

**Partial:** `layouts/_partials/widgets/history.html`

```hugo
{{ with .Params.history }}
  <div class="widget widget-history">
    <h3>📜 Recent Updates</h3>
    <ul class="history-list">
      {{ range first 3 (sort . "date" "desc") }}
        <li>
          <time datetime="{{ .date }}">{{ dateFormat "Jan 2, 2006" .date }}</time>
          <span>{{ .note }}</span>
        </li>
      {{ end }}
    </ul>
    <a href="#full-history">View full history →</a>
  </div>
{{ end }}
```

### Exclusions

**Not in RSS Feed:**
- History adds noise to syndication
- Only include in web view

**Not on Log Format:**
- Logs are ephemeral, short-lived
- History makes sense for articles/portfolios

---

## Feature 10: GitHub Actions Daily Rebuild

### Workflow Overview

**Trigger:** Cron schedule (2 AM UTC daily)

**Steps:**
1. Fetch Umami hearts via API
2. Fetch webmentions via API
3. Process webmentions (group by article)
4. Calculate popularity scores
5. Commit data to `data-updates` branch
6. Copy data to main workspace (not committed)
7. Build Hugo site
8. Deploy to GitHub Pages

### Branch Strategy

**main branch:**
- Code, content, layouts, config
- Clean commit history (features, content, fixes)
- Data files NOT committed here

**data-updates branch:**
- Data files only (`data/*.json`)
- Daily commits with scores
- Preserves historical data
- No code/content changes

### Daily Workflow

**File:** `.github/workflows/daily-rebuild.yml`

```yaml
name: Daily Rebuild with Engagement Data

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
  workflow_dispatch:  # Manual trigger

jobs:
  fetch-and-rebuild:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout main branch
        uses: actions/checkout@v4

      - name: Setup Node.js & Hugo
        # ... setup

      - name: Fetch engagement data
        env:
          UMAMI_API_KEY: ${{ secrets.UMAMI_API_KEY }}
        run: |
          node scripts/fetch-umami-hearts.js
          curl "https://webmention.io/api/mentions.jf2?domain=article-time.de" \
            -o data/webmentions_raw.json
          node scripts/process-webmentions.js
          node scripts/calculate-popularity.js

      - name: Commit to data-updates branch
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"
          git checkout -B data-updates
          git add data/*.json
          git commit -m "chore: update popularity scores $(date +%Y-%m-%d) [skip ci]"
          git push origin data-updates --force
          git checkout main

      - name: Copy data from data-updates
        run: |
          git fetch origin data-updates
          git checkout origin/data-updates -- data/

      - name: Build Hugo site
        run: hugo --environment production --minify

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          cname: article-time.de
```

### Benefits

✅ **Daily freshness:** Scores updated automatically
✅ **No manual work:** Fully automated
✅ **Data history:** Preserved in data-updates branch
✅ **Clean main:** No commit noise
✅ **Local testing:** Merge data-updates to develop locally

### Secrets Required

Add to GitHub Repository Settings → Secrets:

```
UMAMI_API_KEY          # Umami Cloud API key
UMAMI_WEBSITE_ID       # Umami website ID
```

---

[← Back to Index](./README.md) | [Previous: Vision & Goals](./02-vision-and-goals.md) | [Next: Content Formats →](./04-content-formats.md)
