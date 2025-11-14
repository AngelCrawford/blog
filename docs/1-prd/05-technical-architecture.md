# 5. Technical Architecture

[← Back to Index](./README.md) | [Previous: Content Formats](./04-content-formats.md) | [Next: Epic Breakdown →](./06-epic-breakdown.md)

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                Digital Garden System Architecture            │
└─────────────────────────────────────────────────────────────┘

External Services                     GitHub Repository
┌──────────────┐                     ┌─────────────────────┐
│ Umami Cloud  │────API Fetch───────>│   main branch       │
│ (FREE Hobby) │                     │   - Code/Content    │
│ Heart Events │                     │   - Layouts         │
└──────────────┘                     └─────────────────────┘
                                              │
┌──────────────┐                             │
│ Webmention   │────API Fetch───────>┌───────▼─────────────┐
│    .io       │                     │  data-updates branch│
│  Comments    │                     │  - popularity.json  │
└──────────────┘                     │  - hearts.json      │
                                     │  - webmentions.json │
                                     └──────┬──────────────┘
                                            │
                    ┌───────────────────────▼────────────────┐
                    │      GitHub Actions (Daily 2 AM)        │
                    │  1. Fetch Umami hearts                   │
                    │  2. Fetch webmentions                    │
                    │  3. Calculate popularity                 │
                    │  4. Commit to data-updates               │
                    │  5. Copy data to main                    │
                    │  6. Build Hugo                           │
                    │  7. Deploy to GitHub Pages               │
                    └───────────────┬──────────────────────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────────┐
                    │       GitHub Pages              │
                    │  - article-time.de              │
                    │  - HTTPS (Let's Encrypt)        │
                    └────────────┬────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────────────┐
                    │         Users                   │
                    │  - Browse, filter               │
                    │  - Click hearts                 │
                    │  - Send webmentions             │
                    └─────────────────────────────────┘
```

## Technology Stack

**Core Platform:**
- Hugo 0.147 Extended
- Bulma 1.0.4 CSS
- PostCSS + PurgeCSS
- Node.js 20

**Engagement:**
- Umami Cloud Hobby (FREE)
- webmention.io
- GitHub Actions

**Hosting:**
- GitHub Pages (FREE)
- Custom domain: article-time.de

**POSSE:**
- Mastodon (automated)
- Threads (automated if API allows)
- Facebook (manual)
- Reddit (manual)

## Data Flow

**Daily Rebuild (2 AM UTC):**
1. GitHub Actions triggered
2. Fetch Umami hearts → `umami_hearts.json`
3. Fetch webmentions → `webmentions_raw.json`
4. Process webmentions → `webmentions_by_article.json`
5. Calculate popularity → `popularity_scores.json`
6. Commit data to `data-updates` branch
7. Copy data to main (not committed)
8. Build Hugo site
9. Deploy to GitHub Pages

## File Structure

```
blog/
├── .github/workflows/daily-rebuild.yml
├── archetypes/
│   ├── articles/index.md  ✅
│   ├── logs/index.md      ✅
│   ├── links/index.md     ❌ Phase 1B
│   ├── videos/index.md    ❌ Phase 1B
│   ├── galleries/index.md ❌ Phase 1B
│   └── portfolio/index.md ❌ Phase 1B
├── assets/
│   ├── js/ (heart.js, filter.js)
│   └── scss/
├── config/_default/
│   ├── config.yaml
│   └── params.yaml
├── content/
│   ├── articles/
│   ├── logs/
│   └── pages/archiv/
├── data/
│   ├── popularity_scores.json (generated)
│   ├── umami_hearts.json (generated)
│   └── webmentions_by_article.json (generated)
├── layouts/
│   ├── _partials/
│   ├── home.html
│   └── single.html
└── scripts/
    ├── fetch-umami-hearts.js
    ├── process-webmentions.js
    ├── calculate-popularity.js
    └── posse-mastodon.js

Branches:
├── main (code, content)
└── data-updates (data history)
```

## GitHub Secrets Required

```
UMAMI_API_KEY          - Umami Cloud API key
UMAMI_WEBSITE_ID       - Umami website ID
MASTODON_TOKEN         - Mastodon access token (Phase 3)
MASTODON_INSTANCE_URL  - E.g., https://mastodon.social (Phase 3)
THREADS_TOKEN          - If Threads automation works (Phase 3)
```

## Configuration

```yaml
# config/_default/params.yaml
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

[← Back to Index](./README.md) | [Previous: Content Formats](./04-content-formats.md) | [Next: Epic Breakdown →](./06-epic-breakdown.md)
