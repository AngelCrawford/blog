# Digital Garden - Technical Implementation Specification

**Project:** Article Time Blog - Digital Garden
**Version:** 1.0
**Date:** 2025-11-13
**Target Hugo Version:** 0.152.2+extended

---

## Architecture Overview

### Technology Stack

- **Static Site Generator:** Hugo 0.152.2+extended
- **CSS Framework:** Bulma 1.0.4
- **Analytics:** Umami (self-hosted or umami.is)
- **Federated Engagement:** webmention.io
- **Build Automation:** GitHub Actions
- **Deployment:** GitHub Pages
- **Package Manager:** npm

### Build Pipeline

```
Daily Schedule (2 AM UTC)
OR Git Push to main
OR Manual Trigger
    ↓
┌─────────────────────────┐
│  GitHub Actions Runner  │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 1. Fetch Webmentions    │
│    → data/webmentions.json
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 2. Fetch Umami Hearts   │
│    → data/umami-hearts.json
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 3. Hugo Build           │
│    - Calculate scores   │
│    - Apply sorting      │
│    - Generate HTML      │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 4. Deploy to GH Pages   │
└─────────────────────────┘
```

---

## Frontmatter Schema

### Complete Article Frontmatter

```yaml
---
# Core Hugo fields
title: "Article Title"
date: 2024-11-13              # Original creation (NEVER changes)
lastmod: 2024-12-05           # Auto-updated by Hugo on every save
draft: false

# Digital Garden fields
growth_stage: seedling        # seedling|budding|evergreen|withered
weight: 1                     # 1-10 (10 = pinned, set once on publish)
last_significant_update: 2024-12-05  # Manual - triggers grace period

# History tracking
history:
  - date: 2024-12-05
    note: "Refined introduction section"
  - date: 2024-11-13
    note: "Initial planting"
    stage: seedling

# Existing fields (preserved)
description: "Article description for SEO"
tags: ["hugo", "webdev"]
categories: ["Development"]
authors: ["angel"]
series: ["Hugo Guide"]
---
```

### Field Definitions

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| `date` | Date | Yes | Hugo generates | Original creation, never changes |
| `lastmod` | Date | Auto | Hugo updates | Last file modification |
| `last_significant_update` | Date | Manual | `date` | Grace period trigger |
| `growth_stage` | String | Yes | `seedling` | seedling, budding, evergreen, withered |
| `weight` | Integer | No | `1` | 1-10, where 10 = pinned |
| `history` | Array | Recommended | Empty | Evolution timeline |
| `history[].date` | Date | Yes | - | When change occurred |
| `history[].note` | String | Yes | - | Description of change |
| `history[].stage` | String | No | - | Include when stage changes |

### Validation Rules

**At Build Time (Hugo warnings):**

```go-html-template
{{/* Check history matches last_significant_update */}}
{{- with .Params.history -}}
  {{- $latestHistory := index . 0 -}}
  {{- $latestDate := $latestHistory.date | time.AsTime -}}
  {{- $sigUpdate := $.Params.last_significant_update | time.AsTime -}}
  {{- if ne ($latestDate.Format "2006-01-02") ($sigUpdate.Format "2006-01-02") -}}
    {{- warnf "History mismatch in %s: last_significant_update=%s but latest history=%s"
        $.File.Path
        ($sigUpdate.Format "2006-01-02")
        ($latestDate.Format "2006-01-02") -}}
  {{- end -}}
{{- end -}}

{{/* Check growth_stage is valid */}}
{{- $validStages := slice "seedling" "budding" "evergreen" "withered" -}}
{{- if not (in $validStages .Params.growth_stage) -}}
  {{- errorf "Invalid growth_stage '%s' in %s. Must be: seedling, budding, evergreen, or withered"
      .Params.growth_stage
      .File.Path -}}
{{- end -}}

{{/* Check weight range */}}
{{- with .Params.weight -}}
  {{- if or (lt . 1) (gt . 10) -}}
    {{- errorf "Invalid weight %d in %s. Must be 1-10" . $.File.Path -}}
  {{- end -}}
{{- end -}}
```

---

## Sorting Algorithm Implementation

### Hugo Partial: `layouts/partials/garden-sort.html`

```go-html-template
{{/*
  Garden Sorting Algorithm
  Returns sorted array of pages for homepage display
*/}}

{{- $pages := where site.RegularPages "Type" "articles" -}}
{{- $now := now -}}
{{- $graceWeeks := 4 -}}
{{- $promotionThreshold := 20 -}}

{{/* Calculate popularity scores for all pages */}}
{{- range $pages -}}
  {{- partial "calculate-popularity.html" . -}}
{{- end -}}

{{/* Separate into tiers */}}
{{- $pinned := slice -}}
{{- $gracePeriod := slice -}}
{{- $established := slice -}}

{{- range $pages -}}
  {{- $weight := default 1 .Params.weight -}}
  {{- $stage := .Params.growth_stage -}}
  {{- $sigUpdate := default .Date (.Params.last_significant_update | time.AsTime) -}}

  {{/* Skip withered */}}
  {{- if ne $stage "withered" -}}

    {{/* Tier 1: Pinned */}}
    {{- if eq $weight 10 -}}
      {{- $pinned = $pinned | append . -}}

    {{/* Tier 2: Grace Period */}}
    {{- else -}}
      {{- $weeksSinceUpdate := div (sub $now.Unix $sigUpdate.Unix) 604800 -}}
      {{- if le $weeksSinceUpdate $graceWeeks -}}
        {{- $gracePeriod = $gracePeriod | append . -}}

      {{/* Tier 3: Established */}}
      {{- else -}}
        {{- $established = $established | append . -}}
      {{- end -}}
    {{- end -}}

  {{- end -}}
{{- end -}}

{{/* Sort Tier 1: Pinned by lastmod DESC, take top 3 */}}
{{- $pinned = sort $pinned ".Lastmod" "desc" -}}
{{- if gt (len $pinned) 3 -}}
  {{- $pinned = first 3 $pinned -}}
{{- end -}}

{{/* Sort Tier 2: Grace Period (early promoted first) */}}
{{- $gracePromoted := slice -}}
{{- $graceRegular := slice -}}

{{- range $gracePeriod -}}
  {{- $score := .Scratch.Get "popularity_score" -}}
  {{- if ge $score $promotionThreshold -}}
    {{- $gracePromoted = $gracePromoted | append . -}}
  {{- else -}}
    {{- $graceRegular = $graceRegular | append . -}}
  {{- end -}}
{{- end -}}

{{/* Sort promoted by score DESC */}}
{{- $gracePromoted = sort $gracePromoted ".Scratch.popularity_score" "desc" -}}

{{/* Sort regular by lastmod DESC */}}
{{- $graceRegular = sort $graceRegular ".Lastmod" "desc" -}}

{{/* Combine grace period sub-tiers */}}
{{- $gracePeriod = $gracePromoted | append $graceRegular -}}

{{/* Sort Tier 3: Established by popularity DESC, then lastmod DESC */}}
{{- $established = sort $established ".Scratch.popularity_score" "desc" ".Lastmod" "desc" -}}

{{/* Combine all tiers */}}
{{- $sorted := $pinned | append $gracePeriod | append $established -}}

{{/* Return sorted pages */}}
{{- return $sorted -}}
```

### Popularity Score Calculation

`layouts/partials/calculate-popularity.html`:

```go-html-template
{{/*
  Calculate Popularity Score
  Stores result in .Scratch for sorting
*/}}

{{- $webmentions := site.Data.webmentions -}}
{{- $umamiHearts := site.Data.umami_hearts.hearts | default dict -}}

{{- $articleUrl := .Permalink -}}
{{- $articleSlug := .File.BaseFileName -}}

{{/* Count webmentions */}}
{{- $likes := 0 -}}
{{- $comments := 0 -}}

{{- range $webmentions -}}
  {{- if eq .target $articleUrl -}}
    {{- if eq .type "like" -}}
      {{- $likes = add $likes 1 -}}
    {{- else if in (slice "reply" "mention") .type -}}
      {{- $comments = add $comments 1 -}}
    {{- end -}}
  {{- end -}}
{{- end -}}

{{/* Add Umami hearts */}}
{{- with index $umamiHearts $articleSlug -}}
  {{- $likes = add $likes . -}}
{{- end -}}

{{/* Calculate score */}}
{{- $weight := default 1 .Params.weight -}}
{{- $score := add (mul $likes 1) (mul $comments 3) (mul $weight 2) -}}

{{/* Store in scratch */}}
{{- .Scratch.Set "popularity_score" $score -}}
{{- .Scratch.Set "likes_count" $likes -}}
{{- .Scratch.Set "comments_count" $comments -}}
```

---

## Data Fetching Scripts

### GitHub Actions Workflow

`.github/workflows/daily-rebuild.yml`:

```yaml
name: Daily Garden Rebuild

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC (3 AM CET)
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Fetch Webmentions
        run: |
          mkdir -p data
          curl "https://webmention.io/api/mentions.jf2?domain=article-time.de&per-page=999" \
            -H "Accept: application/json" \
            -o data/webmentions.json
          echo "✅ Fetched webmentions"

      - name: Fetch Umami Hearts
        env:
          UMAMI_API_URL: ${{ secrets.UMAMI_API_URL }}
          UMAMI_API_KEY: ${{ secrets.UMAMI_API_KEY }}
          UMAMI_WEBSITE_ID: ${{ secrets.UMAMI_WEBSITE_ID }}
        run: |
          node scripts/fetch-umami-hearts.js
          echo "✅ Fetched Umami data"

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.152.2'
          extended: true

      - name: Build with Hugo
        run: |
          hugo --minify --environment production
          echo "✅ Built site"

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          cname: article-time.de
```

### Umami Fetch Script

`scripts/fetch-umami-hearts.js`:

```javascript
const https = require('https');
const fs = require('fs');

// Configuration from environment
const UMAMI_API_URL = process.env.UMAMI_API_URL || 'https://cloud.umami.is';
const UMAMI_API_KEY = process.env.UMAMI_API_KEY;
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

if (!UMAMI_API_KEY || !UMAMI_WEBSITE_ID) {
  console.error('❌ Missing Umami configuration');
  process.exit(1);
}

// Fetch events from Umami API
async function fetchUmamiHearts() {
  const endDate = new Date().getTime();
  const startDate = endDate - (90 * 24 * 60 * 60 * 1000); // Last 90 days

  // Umami API v2 endpoint structure (adjust for your version)
  const url = `${UMAMI_API_URL}/api/websites/${UMAMI_WEBSITE_ID}/events` +
    `?startAt=${startDate}&endAt=${endDate}`;

  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `Bearer ${UMAMI_API_KEY}`,
        'Accept': 'application/json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          return;
        }

        try {
          const events = JSON.parse(data);
          resolve(events);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

// Process events and count hearts per article
async function processHearts() {
  try {
    console.log('Fetching Umami events...');
    const events = await fetchUmamiHearts();

    // Group by article slug
    const heartCounts = {};

    // Filter for heart events only
    const heartEvents = events.filter(event =>
      event.event_name === 'article-heart' ||
      event.eventName === 'article-heart'
    );

    heartEvents.forEach(event => {
      // Extract slug from event data or URL path
      const slug = event.event_data?.slug ||
                   event.eventData?.slug ||
                   event.url_path?.split('/').pop() ||
                   event.urlPath?.split('/').pop();

      if (slug) {
        heartCounts[slug] = (heartCounts[slug] || 0) + 1;
      }
    });

    // Write to data file
    const output = {
      last_updated: new Date().toISOString(),
      hearts: heartCounts
    };

    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/umami-hearts.json', JSON.stringify(output, null, 2));

    console.log(`✅ Umami hearts saved: ${Object.keys(heartCounts).length} articles with hearts`);
    console.log(`   Total hearts: ${Object.values(heartCounts).reduce((a, b) => a + b, 0)}`);

  } catch (error) {
    console.error('❌ Error fetching Umami hearts:', error.message);

    // Write empty file to not break build
    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/umami-hearts.json', JSON.stringify({
      last_updated: new Date().toISOString(),
      hearts: {}
    }, null, 2));
  }
}

// Run
processHearts();
```

**Make executable:**
```bash
chmod +x scripts/fetch-umami-hearts.js
```

---

## Client-Side Filtering

### Filter UI Component

`layouts/partials/garden-filter.html`:

```go-html-template
<div class="garden-filter">
  <label>Growth Stage:</label>
  <div class="filter-buttons">
    <button class="filter-btn active" data-stage="all">All</button>
    <button class="filter-btn" data-stage="seedling">🌱 Seedling</button>
    <button class="filter-btn" data-stage="budding">🌿 Budding</button>
    <button class="filter-btn" data-stage="evergreen">🌳 Evergreen</button>
    <button class="filter-btn" data-stage="withered">💀 Withered</button>
  </div>
</div>

<div id="article-grid" class="articles-container">
  {{/* Articles rendered by garden-sort partial */}}
  {{- $sorted := partial "garden-sort.html" . -}}
  {{- range $sorted -}}
    {{- partial "article-card.html" . -}}
  {{- end -}}
</div>
```

### Filter JavaScript

`assets/js/garden-filter.js`:

```javascript
// Garden stage filtering
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const articleCards = document.querySelectorAll('.article-card');

  // Get stage from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const initialStage = urlParams.get('stage') || 'all';

  // Apply initial filter
  applyFilter(initialStage);

  // Filter button click handlers
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const stage = this.dataset.stage;

      // Update URL without reload
      const newUrl = stage === 'all'
        ? window.location.pathname
        : `${window.location.pathname}?stage=${stage}`;
      window.history.pushState({}, '', newUrl);

      // Apply filter
      applyFilter(stage);

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });

  function applyFilter(stage) {
    articleCards.forEach(card => {
      const cardStage = card.dataset.stage;

      if (stage === 'all') {
        // Show all except withered
        card.style.display = cardStage === 'withered' ? 'none' : '';
      } else {
        // Show only selected stage
        card.style.display = cardStage === stage ? '' : 'none';
      }
    });
  }
});
```

### Article Card Data Attribute

`layouts/partials/article-card.html`:

```go-html-template
<article class="article-card" data-stage="{{ .Params.growth_stage }}">
  {{/* Card content */}}
</article>
```

---

## Badge System

### Badge Partial

`layouts/partials/garden-badge.html`:

```go-html-template
{{/* Determine if in grace period */}}
{{- $now := now -}}
{{- $sigUpdate := default .Date (.Params.last_significant_update | time.AsTime) -}}
{{- $weeksSinceUpdate := div (sub $now.Unix $sigUpdate.Unix) 604800 -}}
{{- $inGracePeriod := le $weeksSinceUpdate 4 -}}

{{- if $inGracePeriod -}}
  {{- $weeksSincePlanting := div (sub $now.Unix .Date.Unix) 604800 -}}

  {{- if le $weeksSincePlanting 4 -}}
    <span class="badge badge-new">New</span>
  {{- else -}}
    <span class="badge badge-updated">Updated</span>
  {{- end -}}
{{- end -}}
```

### Badge CSS

`assets/scss/components/_badges.scss`:

```scss
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &-new {
    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
    animation: sparkle 2s ease-in-out infinite;
  }

  &-updated {
    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
    color: white;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);

    &::before {
      content: "🔄 ";
    }
  }
}

@keyframes sparkle {
  0%, 100% { box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3); }
  50% { box-shadow: 0 4px 16px rgba(34, 197, 94, 0.5); }
}
```

---

## History Widget

### Sidebar Widget Partial

`layouts/partials/history-widget.html`:

```go-html-template
{{- with .Params.history -}}
<aside class="widget widget-history">
  <h3>📜 Geschichte</h3>

  <ol class="history-list">
    {{/* Show first 3 entries */}}
    {{- range first 3 . -}}
    <li class="history-entry">
      <time datetime="{{ .date }}">
        {{ .date | time.Format "02.01.2006" }}
      </time>

      {{- with .stage -}}
        <span class="stage-icon stage-{{ . }}" title="{{ . }}">
          {{- if eq . "evergreen" -}}🌳
          {{- else if eq . "budding" -}}🌿
          {{- else if eq . "seedling" -}}🌱
          {{- else if eq . "withered" -}}💀
          {{- end -}}
        </span>
      {{- end -}}

      <p>{{ .note | markdownify }}</p>
    </li>
    {{- end -}}

    {{/* Collapse button if more than 3 */}}
    {{- if gt (len .) 3 -}}
    <li class="history-expand">
      <button class="expand-btn" data-target="history-full">
        [{{ sub (len .) 3 }} weitere Einträge ▼]
      </button>
    </li>

    {{/* Hidden full history */}}
    <div id="history-full" class="history-full hidden">
      {{- range after 3 . -}}
      <li class="history-entry">
        <time datetime="{{ .date }}">
          {{ .date | time.Format "02.01.2006" }}
        </time>

        {{- with .stage -}}
          <span class="stage-icon stage-{{ . }}" title="{{ . }}">
            {{- if eq . "evergreen" -}}🌳
            {{- else if eq . "budding" -}}🌿
            {{- else if eq . "seedling" -}}🌱
            {{- else if eq . "withered" -}}💀
            {{- end -}}
          </span>
        {{- end -}}

        <p>{{ .note | markdownify }}</p>
      </li>
      {{- end -}}
    </div>
    {{- end -}}
  </ol>
</aside>
{{- end -}}
```

### History Expansion Script

`assets/js/history-expand.js`:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const expandButtons = document.querySelectorAll('.expand-btn');

  expandButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.dataset.target;
      const target = document.getElementById(targetId);

      if (target) {
        target.classList.toggle('hidden');

        // Update button text
        if (target.classList.contains('hidden')) {
          this.textContent = this.textContent.replace('▲', '▼');
        } else {
          this.textContent = this.textContent.replace('▼', '▲');
        }
      }
    });
  });
});
```

---

## Umami Heart Tracking (Client-Side)

### Heart Button Component

`layouts/partials/heart-button.html`:

```go-html-template
{{- $slug := .File.BaseFileName -}}
{{- $likes := .Scratch.Get "likes_count" | default 0 -}}

<div class="heart-button">
  <button
    class="btn-heart"
    data-slug="{{ $slug }}"
    aria-label="Like this article">
    <svg class="heart-icon" viewBox="0 0 24 24" width="24" height="24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
    <span class="heart-count">{{ $likes }}</span>
  </button>

  {{/* Federated like option */}}
  <a href="https://fosstodon.org/@angelcrawford/status/..."
     class="federated-like"
     target="_blank"
     rel="noopener">
    Like on Mastodon
  </a>
</div>
```

### Heart Click Handler

`assets/js/umami-hearts.js`:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const heartButtons = document.querySelectorAll('.btn-heart');

  heartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const slug = this.dataset.slug;

      // Track with Umami
      if (typeof umami !== 'undefined') {
        umami.track('article-heart', { slug: slug });
      }

      // Visual feedback
      this.classList.add('hearted');

      // Update count (optimistic UI)
      const countSpan = this.querySelector('.heart-count');
      const currentCount = parseInt(countSpan.textContent) || 0;
      countSpan.textContent = currentCount + 1;

      // Disable button (prevent double-click)
      this.disabled = true;

      // Optional: Store in localStorage to remember
      try {
        localStorage.setItem(`hearted-${slug}`, 'true');
      } catch (e) {
        // Ignore if localStorage not available
      }
    });

    // Check if already hearted
    const slug = button.dataset.slug;
    try {
      if (localStorage.getItem(`hearted-${slug}`)) {
        button.classList.add('hearted');
        button.disabled = true;
      }
    } catch (e) {
      // Ignore
    }
  });
});
```

**Note:** LocalStorage is optional. If GDPR concerns, remove localStorage logic and allow unlimited hearts.

---

## Testing & Validation

### Build-Time Checks

Add to `layouts/partials/validate-garden.html`:

```go-html-template
{{/* Run on every page build */}}

{{/* 1. Check required fields */}}
{{- if not .Params.growth_stage -}}
  {{- errorf "Missing growth_stage in %s" .File.Path -}}
{{- end -}}

{{/* 2. Validate date fields */}}
{{- if .Params.last_significant_update -}}
  {{- $sigUpdate := .Params.last_significant_update | time.AsTime -}}
  {{- if $sigUpdate.After now -}}
    {{- warnf "Future date in last_significant_update: %s in %s"
        ($sigUpdate.Format "2006-01-02") .File.Path -}}
  {{- end -}}
{{- end -}}

{{/* 3. Validate history consistency */}}
{{- with .Params.history -}}
  {{- range $i, $entry := . -}}
    {{- if not $entry.date -}}
      {{- errorf "Missing date in history entry %d of %s" $i $.File.Path -}}
    {{- end -}}
    {{- if not $entry.note -}}
      {{- warnf "Missing note in history entry %d of %s" $i $.File.Path -}}
    {{- end -}}
  {{- end -}}
{{- end -}}

{{/* 4. Check for too many pinned */}}
{{- if eq .Params.weight 10 -}}
  {{- $pinnedCount := len (where site.RegularPages "Params.weight" 10) -}}
  {{- if gt $pinnedCount 3 -}}
    {{- warnf "Warning: %d articles pinned (max 3 recommended). %s"
        $pinnedCount .File.Path -}}
  {{- end -}}
{{- end -}}
```

### Manual Testing Checklist

**Before Deployment:**

- [ ] Create test articles with all growth stages
- [ ] Verify tier sorting (pinned → grace → established)
- [ ] Test early promotion (set score >= 20)
- [ ] Check badge display (new vs updated)
- [ ] Validate history widget display
- [ ] Test growth stage filtering (all stages)
- [ ] Verify withered articles hidden by default
- [ ] Check mobile responsive design
- [ ] Test Umami heart click tracking
- [ ] Validate webmention display (if data available)
- [ ] Check build performance (<5 min)

---

## Performance Optimization

### Build Time Optimization

**Current bottlenecks:**
- Sorting algorithm runs on every page
- Popularity calculation per article

**Optimizations:**

1. **Cache sorted list:**
```go-html-template
{{- $sortedPages := .Scratch.Get "garden_sorted" -}}
{{- if not $sortedPages -}}
  {{- $sortedPages = partial "garden-sort.html" . -}}
  {{- .Scratch.Set "garden_sorted" $sortedPages -}}
{{- end -}}
```

2. **Paginate results:**
```go-html-template
{{- $paginator := .Paginate $sortedPages 20 -}}
{{- range $paginator.Pages -}}
  {{/* Render cards */}}
{{- end -}}
```

3. **Lazy load images:**
```html
<img loading="lazy" src="..." alt="...">
```

### Client-Side Performance

**JavaScript optimization:**
- Debounce filter clicks
- Use CSS display instead of DOM manipulation
- Minimize reflows/repaints

**CSS optimization:**
- Use PurgeCSS in production
- Minimize animation complexity
- Use `will-change` sparingly

---

## Deployment Checklist

### GitHub Secrets Configuration

Add these secrets to your GitHub repository:

```
UMAMI_API_URL         → https://cloud.umami.is (or your instance)
UMAMI_API_KEY         → Your API key from Umami settings
UMAMI_WEBSITE_ID      → Your website ID from Umami
```

### DNS Configuration

For `article-time.de` on GitHub Pages:

```
Type: A
Name: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153

Type: CNAME
Name: www
Value: angelcrawford.github.io
```

### Post-Deployment Validation

After first deploy:

1. **Check data files:**
   - `data/webmentions.json` exists and valid
   - `data/umami-hearts.json` exists and valid

2. **Verify sorting:**
   - Pinned articles appear first
   - Grace period articles show badges
   - Popularity scores calculate correctly

3. **Test interactions:**
   - Heart button sends Umami event
   - Growth stage filters work
   - History expands/collapses

4. **Performance check:**
   - Lighthouse score >90
   - Build time <5 minutes
   - Page load <2 seconds

---

## Troubleshooting

### Common Issues

**Issue:** History dates don't match `last_significant_update`
**Fix:** Ensure latest history entry date === `last_significant_update`

**Issue:** More than 3 articles pinned
**Fix:** Change `weight` from 10 to lower value on oldest pinned article

**Issue:** Umami hearts not fetching
**Fix:** Check GitHub secrets, verify API key permissions

**Issue:** Grace period not resetting
**Fix:** Confirm `last_significant_update` field updated manually

**Issue:** Withered articles showing in default view
**Fix:** Check filter logic excludes `growth_stage === 'withered'`

---

## Future Enhancements

### Phase 4 Ideas

1. **Advanced webmention threading**
   - Group replies by conversation
   - Show reply context
   - Highlight author responses

2. **Automated POSSE**
   - Auto-post to Mastodon on publish
   - Include first paragraph as preview
   - Track syndication links

3. **Related articles by concept**
   - TF-IDF similarity scoring
   - Manual "see also" links
   - Automatic backlink detection

4. **Reader gardens**
   - Allow readers to "plant" bookmarks
   - Create personal collections
   - Share curated paths

---

**Document Version:** 1.0
**Last Updated:** 2025-11-13
**Maintained By:** Winston (Architect) & Paige (Technical Writer)
