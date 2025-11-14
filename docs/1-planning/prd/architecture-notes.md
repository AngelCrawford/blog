# Technical Architecture Notes (for Architecture Phase)

**Purpose:** Technical implementation details extracted from PRD for use during architecture workflow

**Status:** Reference material for architecture phase - DO NOT IMPLEMENT until architecture workflow

**Date:** 2025-11-14

---

## Note

This document contains **HOW** to implement features (technical details, code, formulas, APIs).

The PRD describes **WHAT** capabilities are needed (functional requirements).

During the architecture phase, these notes will be refined, validated, and formalized into the architecture document.

---

## 1. Popularity Score Formula

**Requirement:** FR-018 (Popularity score calculation)

**Proposed Formula:**
```
popularity_score = (hearts × 1) + (webmentions × 3) + (weight × 2)
```

**Rationale:**
- Hearts (weight: 1) - Low friction, passive engagement
- Webmentions (weight: 3) - High value, requires effort, indicates conversation
- Manual weight (weight: 2) - Editorial boost, quality signal

**Implementation Location:** `scripts/calculate-popularity.js`

**Validation:** Architect should review formula weights, adjust if needed

---

## 2. Grace Period Logic

**Requirement:** FR-015, FR-016 (Grace period visibility boost)

**Proposed Logic:**
```javascript
const gracePeriodDays = site.Params.digital_garden.grace_period_days || 28;
const isInGracePeriod = (lastSignificantUpdate) => {
  const daysSinceUpdate = (new Date() - new Date(lastSignificantUpdate)) / (1000 * 60 * 60 * 24);
  return daysSinceUpdate <= gracePeriodDays;
};
```

**Hugo Template Logic:**
```hugo
{{ $gracePeriodDays := site.Params.digital_garden.grace_period_days | default 28 }}
{{ $inGracePeriod := false }}
{{ with .Params.last_significant_update }}
  {{ $daysSince := now.Sub (time .) | duration.Hours | div 24 }}
  {{ if lt $daysSince $gracePeriodDays }}
    {{ $inGracePeriod = true }}
  {{ end }}
{{ end }}
```

**Configuration:**
```yaml
# config/_default/params.yaml
digital_garden:
  grace_period_days: 28  # Configurable
```

---

## 3. Umami Cloud Integration

**Requirements:** FR-008, FR-009, FR-010, FR-047, FR-049

**Umami Script Tag:**
```html
<!-- layouts/_default/baseof.html -->
<head>
  {{ if hugo.IsProduction }}
    <script async defer
      data-website-id="{{ site.Params.umami.website_id }}"
      src="{{ site.Params.umami.script_url }}">
    </script>
  {{ end }}
</head>
```

**Configuration:**
```yaml
# config/_default/params.yaml
umami:
  website_id: "your-umami-website-id"
  script_url: "https://cloud.umami.is/script.js"
```

**Heart Button Component:**
```html
<!-- layouts/_partials/widgets/heart-button.html -->
<button class="heart-button"
  data-article="{{ .Permalink }}"
  aria-label="Heart this article">
  <span class="heart-icon">♥</span>
  <span class="heart-count">{{ .Params.hearts | default 0 }}</span>
</button>
```

**Heart Button JavaScript:**
```javascript
// assets/js/heart.js
document.querySelectorAll('.heart-button').forEach(button => {
  button.addEventListener('click', async (e) => {
    e.preventDefault();

    // Track event via Umami
    if (typeof umami !== 'undefined') {
      umami.track('heart', {
        article: button.dataset.article
      });
    }

    // Visual feedback
    button.classList.add('hearted');
    const count = button.querySelector('.heart-count');
    count.textContent = parseInt(count.textContent) + 1;

    // Animation
    button.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.3)' },
      { transform: 'scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-out'
    });

    // Debounce to prevent double-clicks
    button.disabled = true;
    setTimeout(() => button.disabled = false, 1000);
  });
});
```

**Umami Hearts Fetch Script:**
```javascript
// scripts/fetch-umami-hearts.js
const fetch = require('node-fetch');
const fs = require('fs');

const UMAMI_API_URL = process.env.UMAMI_API_URL || 'https://cloud.umami.is/api';
const UMAMI_API_KEY = process.env.UMAMI_API_KEY;
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

async function fetchHearts() {
  try {
    const response = await fetch(
      `${UMAMI_API_URL}/websites/${UMAMI_WEBSITE_ID}/stats`,
      {
        headers: {
          'Authorization': `Bearer ${UMAMI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Umami API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Process events to count hearts per article
    const heartsByArticle = {};
    // ... process data.events to count hearts ...

    // Write to data file
    fs.writeFileSync(
      'data/umami_hearts.json',
      JSON.stringify(heartsByArticle, null, 2)
    );

    console.log('✓ Hearts fetched successfully');
  } catch (error) {
    console.error('✗ Failed to fetch hearts:', error.message);
    process.exit(1);
  }
}

fetchHearts();
```

---

## 4. Webmention Integration

**Requirements:** FR-011, FR-012, FR-013

**Webmention Endpoint:**
```html
<!-- layouts/_default/baseof.html -->
<head>
  <link rel="webmention"
    href="https://webmention.io/article-time.de/webmention" />
</head>
```

**Webmention Fetch:**
```bash
# GitHub Actions workflow
curl "https://webmention.io/api/mentions.jf2?domain=article-time.de" \
  -o data/webmentions_raw.json
```

**Webmention Processing Script:**
```javascript
// scripts/process-webmentions.js
const fs = require('fs');

function processWebmentions() {
  const raw = JSON.parse(fs.readFileSync('data/webmentions_raw.json', 'utf8'));

  // Group by target URL (article)
  const byArticle = {};
  raw.children.forEach(mention => {
    const target = mention['wm-target'];
    if (!byArticle[target]) {
      byArticle[target] = [];
    }
    byArticle[target].push({
      type: mention['wm-property'], // reply, mention, repost, like
      author: mention.author?.name || 'Anonymous',
      avatar: mention.author?.photo,
      content: mention.content?.text,
      url: mention.url,
      published: mention.published
    });
  });

  // Write grouped webmentions
  fs.writeFileSync(
    'data/webmentions_by_article.json',
    JSON.stringify(byArticle, null, 2)
  );

  console.log('✓ Webmentions processed');
}

processWebmentions();
```

**Webmention Display Component:**
```html
<!-- layouts/_partials/webmentions.html -->
{{ $articleUrl := .Permalink }}
{{ $webmentions := index site.Data.webmentions_by_article $articleUrl }}

{{ with $webmentions }}
  <section class="webmentions">
    <h3>Replies & Mentions</h3>

    {{ $replies := where . "type" "reply" }}
    {{ $reposts := where . "type" "repost" }}
    {{ $likes := where . "type" "like" }}

    {{ with $replies }}
      <h4>Replies ({{ len . }})</h4>
      {{ range . }}
        <div class="webmention webmention-reply">
          <img src="{{ .avatar }}" alt="{{ .author }}" class="avatar">
          <div class="content">
            <strong>{{ .author }}</strong>
            <p>{{ .content }}</p>
            <a href="{{ .url }}" target="_blank" rel="noopener">View original →</a>
          </div>
        </div>
      {{ end }}
    {{ end }}

    <!-- Similar for reposts and likes -->
  </section>
{{ end }}
```

---

## 5. Three-Tier Sorting Algorithm

**Requirements:** FR-014, FR-015, FR-017, FR-020

**Homepage Template Logic:**
```hugo
<!-- layouts/index.html -->
{{ $allPages := where site.RegularPages "Type" "in" (slice "articles" "logs" "links" "videos" "galleries" "portfolio") }}

<!-- Tier 1: Pinned (max 3) -->
{{ $pinned := where $allPages "Params.weight" "eq" 10 | first 3 }}

<!-- Tier 2: Grace Period (last_significant_update < 28 days, exclude pinned) -->
{{ $gracePeriodDays := site.Params.digital_garden.grace_period_days | default 28 }}
{{ $gracePeriod := slice }}
{{ range $allPages }}
  {{ if not (in $pinned .) }}
    {{ with .Params.last_significant_update }}
      {{ $daysSince := now.Sub (time .) | duration.Hours | div 24 }}
      {{ if lt $daysSince $gracePeriodDays }}
        {{ $gracePeriod = $gracePeriod | append $ }}
      {{ end }}
    {{ end }}
  {{ end }}
{{ end }}
{{ $gracePeriod = $gracePeriod | sort "Params.last_significant_update" "desc" }}

<!-- Tier 3: Established (exclude pinned + grace period, sort by popularity) -->
{{ $established := slice }}
{{ range $allPages }}
  {{ if and (not (in $pinned .)) (not (in $gracePeriod .)) }}
    {{ $established = $established | append . }}
  {{ end }}
{{ end }}
{{ $established = $established | sort "Params.popularity_score" "desc" }}

<!-- Render three tiers -->
<section class="tier tier-1-pinned">
  <h2>📌 Pinned</h2>
  {{ range $pinned }}
    {{ partial "cards/article.html" . }}
  {{ end }}
</section>

<section class="tier tier-2-grace-period">
  <h2>🔄 Recently Updated</h2>
  {{ range $gracePeriod }}
    {{ partial "cards/article.html" . }}
  {{ end }}
</section>

<section class="tier tier-3-established">
  <h2>📚 Established</h2>
  {{ range $established }}
    {{ partial "cards/article.html" . }}
  {{ end }}
</section>
```

---

## 6. Filter JavaScript

**Requirements:** FR-003, FR-032, FR-033

**HTML Data Attributes:**
```html
<article class="card"
  data-format="{{ .Params.format }}"
  data-stage="{{ .Params.growth_stage }}">
  <!-- card content -->
</article>
```

**Filter UI:**
```html
<!-- layouts/_partials/filters.html -->
<div class="filters">
  <!-- Format Filter -->
  <div class="filter-group filter-format">
    <label>Format:</label>
    <button data-filter="format" data-value="all" class="active">All</button>
    <button data-filter="format" data-value="article">Articles</button>
    <button data-filter="format" data-value="log">Logs</button>
    <button data-filter="format" data-value="link">Links</button>
    <button data-filter="format" data-value="video">Videos</button>
    <button data-filter="format" data-value="gallery">Galleries</button>
    <button data-filter="format" data-value="portfolio">Portfolio</button>
  </div>

  <!-- Stage Filter -->
  <div class="filter-group filter-stage">
    <label>Growth Stage:</label>
    <button data-filter="stage" data-value="all-except-withered" class="active">All</button>
    <button data-filter="stage" data-value="seedling">🌱 Seedling</button>
    <button data-filter="stage" data-value="budding">🌿 Budding</button>
    <button data-filter="stage" data-value="evergreen">🌳 Evergreen</button>
    <button data-filter="stage" data-value="withered">💀 Show Withered ({{ $witheredCount }})</button>
  </div>
</div>
```

**Filter JavaScript:**
```javascript
// assets/js/filter.js
const state = {
  format: 'all',
  stage: 'all-except-withered'
};

// Load from sessionStorage
if (sessionStorage.getItem('filterState')) {
  Object.assign(state, JSON.parse(sessionStorage.getItem('filterState')));
}

function filterCards() {
  const cards = document.querySelectorAll('.card');
  let visibleCount = 0;

  cards.forEach(card => {
    const format = card.dataset.format;
    const stage = card.dataset.stage;

    const matchesFormat = (state.format === 'all' || format === state.format);
    const matchesStage = (
      (state.stage === 'all-except-withered' && stage !== 'withered') ||
      (state.stage === 'all' || stage === state.stage)
    );

    if (matchesFormat && matchesStage) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Update count
  document.querySelector('.filter-count').textContent =
    `Showing ${visibleCount} of ${cards.length}`;

  // Save state
  sessionStorage.setItem('filterState', JSON.stringify(state));
}

// Attach event listeners
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', (e) => {
    const filterType = e.target.dataset.filter;
    const filterValue = e.target.dataset.value;

    // Update state
    state[filterType] = filterValue;

    // Update active button
    e.target.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    // Apply filter
    filterCards();
  });
});

// Apply initial filter on page load
filterCards();
```

---

## 7. GitHub Actions Daily Rebuild

**Requirements:** FR-034, FR-035, FR-036, FR-037

**Workflow File:**
```yaml
# .github/workflows/daily-rebuild.yml
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
        with:
          ref: main
          fetch-depth: 0  # Full history for data-updates branch

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.147.0'
          extended: true

      - name: Install dependencies
        run: npm install

      - name: Fetch Umami hearts
        env:
          UMAMI_API_KEY: ${{ secrets.UMAMI_API_KEY }}
          UMAMI_WEBSITE_ID: ${{ secrets.UMAMI_WEBSITE_ID }}
          UMAMI_API_URL: ${{ secrets.UMAMI_API_URL }}
        run: node scripts/fetch-umami-hearts.js

      - name: Fetch webmentions
        run: |
          curl "https://webmention.io/api/mentions.jf2?domain=article-time.de" \
            -o data/webmentions_raw.json

      - name: Process webmentions
        run: node scripts/process-webmentions.js

      - name: Calculate popularity scores
        run: node scripts/calculate-popularity.js

      - name: Commit to data-updates branch
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"

          # Switch to data-updates branch (create if doesn't exist)
          git checkout -B data-updates

          # Commit data files
          git add data/*.json
          git commit -m "chore: update popularity scores $(date +%Y-%m-%d) [skip ci]" || echo "No changes"

          # Push to remote
          git push origin data-updates --force

          # Switch back to main
          git checkout main

      - name: Copy data from data-updates
        run: |
          # Fetch latest data from data-updates branch
          git fetch origin data-updates
          git checkout origin/data-updates -- data/
          # Now main has updated data (not committed), ready for build

      - name: Build Hugo site
        run: hugo --environment production --minify

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          cname: article-time.de
```

---

## 8. OG Image Generation (Hugo)

**Requirement:** FR-042

**OG Image Partial:**
```hugo
<!-- layouts/_partials/og-image-generator.html -->
{{ $template := resources.Get "images/og-template.png" }}
{{ $badgeFile := printf "images/badges/%s.png" .Params.growth_stage }}
{{ $badge := resources.Get $badgeFile }}

{{/* Generate OG image with text overlay */}}
{{ $img := $template | images.Filter (images.Text .Title (dict
    "color" "#ffffff"
    "size" 48
    "font" "Montserrat"
    "x" 50
    "y" 300
)) }}

{{/* Overlay growth stage badge */}}
{{ if $badge }}
  {{ $img = $img | images.Filter (images.Overlay $badge (dict
    "x" 1000
    "y" 50
  )) }}
{{ end }}

{{/* Resize to standard OG dimensions */}}
{{ $img = $img.Resize "1200x630 webp" }}

{{/* Output OG meta tags */}}
<meta property="og:image" content="{{ $img.Permalink }}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

---

## 9. Mastodon POSSE Script

**Requirement:** FR-038

**Mastodon Post Script:**
```javascript
// scripts/posse-mastodon.js
const Mastodon = require('mastodon-api');
const fs = require('fs');

const M = new Mastodon({
  access_token: process.env.MASTODON_TOKEN,
  api_url: process.env.MASTODON_INSTANCE_URL + '/api/v1/'
});

async function postToMastodon() {
  // Get recently published articles (last 24 hours)
  // ... logic to find new articles ...

  const article = {
    title: "My Article Title",
    summary: "Article summary...",
    url: "https://article-time.de/articles/my-article/",
    growthStage: "seedling"
  };

  const stageEmoji = {
    seedling: "🌱",
    budding: "🌿",
    evergreen: "🌳",
    withered: "💀"
  };

  const status = `${stageEmoji[article.growthStage]} New article: ${article.title}

${article.summary}

🔗 ${article.url}

#DigitalGarden #Hugo #${article.growthStage}`;

  try {
    const result = await M.post('statuses', {
      status: status,
      visibility: 'public'
    });

    console.log('✓ Posted to Mastodon:', result.data.url);

    // Store posted article to avoid duplicates
    // ... logic to track posted articles ...
  } catch (error) {
    console.error('✗ Mastodon posting failed:', error.message);
    // Don't fail build, just log error
  }
}

postToMastodon();
```

---

## 10. Format-Specific Templates

**Requirements:** FR-028, FR-029, FR-030, FR-031

**Link Format Single Page:**
```hugo
<!-- layouts/links/single.html -->
{{ define "main" }}
  <article class="single single-link">
    <header>
      <h1>{{ .Title }}</h1>
      <p class="link-domain">
        <a href="{{ .Params.url }}" target="_blank" rel="noopener">
          → {{ .Params.domain }}
        </a>
      </p>
    </header>

    <div class="content">
      {{ .Content }}
    </div>

    <footer>
      <a href="{{ .Params.url }}" class="button button-external" target="_blank" rel="noopener">
        Visit Resource →
      </a>
    </footer>
  </article>
{{ end }}
```

**Video Format Single Page:**
```hugo
<!-- layouts/videos/single.html -->
{{ define "main" }}
  <article class="single single-video">
    <header>
      <h1>{{ .Title }}</h1>
    </header>

    <!-- Responsive video embed -->
    <div class="video-embed">
      {{ if eq .Params.platform "youtube" }}
        <iframe
          src="https://www.youtube.com/embed/{{ .Params.video_id }}"
          allowfullscreen>
        </iframe>
      {{ else if eq .Params.platform "vimeo" }}
        <iframe
          src="https://player.vimeo.com/video/{{ .Params.video_id }}"
          allowfullscreen>
        </iframe>
      {{ end }}
    </div>

    <div class="content">
      {{ .Content }}
    </div>
  </article>
{{ end }}
```

**Gallery Format Single Page:**
```hugo
<!-- layouts/galleries/single.html -->
{{ define "main" }}
  <article class="single single-gallery">
    <header>
      <h1>{{ .Title }}</h1>
    </header>

    <div class="gallery-masonry">
      {{ range .Resources.ByType "image" }}
        <figure class="gallery-item" data-lightbox="{{ .RelPermalink }}">
          <img src="{{ .RelPermalink }}" alt="{{ .Title }}" loading="lazy">
          {{ with .Title }}
            <figcaption>{{ . }}</figcaption>
          {{ end }}
        </figure>
      {{ end }}
    </div>

    <div class="content">
      {{ .Content }}
    </div>
  </article>

  <!-- Lightbox modal (JavaScript-powered) -->
  <div id="lightbox" class="lightbox">
    <button class="lightbox-close">&times;</button>
    <img class="lightbox-image" src="" alt="">
    <button class="lightbox-prev">&lt;</button>
    <button class="lightbox-next">&gt;</button>
  </div>
{{ end }}
```

---

## Architecture Phase Next Steps

1. **Review these notes** - Validate technical approaches
2. **Refine architecture** - Adjust formulas, APIs, implementation strategies
3. **Add missing details** - File structure, data models, API contracts
4. **Document decisions** - Why each technical choice was made
5. **Create architecture document** - Formal architecture specification

**Note:** These are PROPOSED implementations, not final. Architecture workflow will validate and refine.

---

**Status:** Reference material for architecture phase
**Last Updated:** 2025-11-14
