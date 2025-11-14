# 4. Content Formats

[← Back to Index](./README.md) | [Previous: Core Features](./03-core-features.md) | [Next: Technical Architecture →](./05-technical-architecture.md)

---

## Overview

The digital garden supports **6 content formats**, each with distinct card layouts, single page templates, and purposes.

### Format Comparison

| Format | Card Layout | Detail Page | Images | Use Case |
|--------|-------------|-------------|--------|----------|
| **Article** | Horizontal, summary | Full post | 1 cover | Long-form writing |
| **Log** | Compact | None (headless) | 1 optional | Quick thoughts |
| **Link** | Horizontal, domain | Redirect/notes | 1 optional | Curation |
| **Video** | Thumbnail, play icon | Embedded player | Thumbnail | Video sharing |
| **Gallery** | Image grid | Masonry/lightbox | Many | Photo essays |
| **Portfolio** | Screenshot, tech | Case study | Many | Work samples |

---

## Format 1: Article ✅ EXISTING

### Purpose
Long-form blog posts, tutorials, essays, deep dives

### Frontmatter
```yaml
format: "article"  # Default, can be omitted
title: "My Article Title"
summary: "Required summary for card (120-158 chars)"
categories: ["Technology"]
tags: ["Hugo", "Tutorial"]
```

### Card Design
- Full-width horizontal card
- Optional cover image (2:3 portrait ratio)
- Category ribbon (top-left)
- Title + summary + tags
- Date + lastmod indicators
- Growth stage badge
- New/Updated badges

### Single Page Template
- Hero image (if exists)
- Full article content (markdown)
- Table of contents (auto-generated)
- History timeline (sidebar + footer)
- Webmention replies
- Related articles

### Archetype Location
✅ `archetypes/articles/index.md`

### Status
✅ Already implemented

---

## Format 2: Log ✅ EXISTING

### Purpose
Microblog entries, quotes, short thoughts, quick notes

### Frontmatter
```yaml
format: "log"
title: "For internal use only (not displayed)"
# No summary required
```

### Card Design
- Compact card (smaller than article)
- Optional image (600×480)
- Content directly in card (no summary)
- No "Read more" link
- Growth stage badge
- Date indicator

### Single Page Template
- **Headless** - No detail page
- Card is the only view
- Content lives entirely in card

### Note
Replaces "Instagram" format (identical design) - **DECISION: Instagram format removed**

### Archetype Location
✅ `archetypes/logs/index.md`

### Status
✅ Already implemented

---

## Format 3: Link ❌ NEW - PHASE 1B

### Purpose
External resource curation with commentary (bookmarks, tool recommendations, reference links)

### Use Cases
- Bookmarks of interesting articles
- Tool recommendations
- Reference links for tutorials
- "Link blog" style curation

### Frontmatter
```yaml
format: "link"
title: "Interesting Article Title"
url: "https://example.com/article"
domain: "example.com"  # Auto-extracted from URL
summary: "Why this resource is valuable..."
categories: ["Resources"]
tags: ["Tools", "Research"]
```

### Card Design
- Horizontal card (similar to article)
- External link icon (↗) prominent
- Domain displayed (e.g., "→ example.com")
- Your commentary in summary
- Growth stage badge
- Click behavior:
  - Option A: Card links directly to external URL
  - Option B: Title → external, card → detail page with notes

### Single Page Template
**Three implementation options:**

**Option A: Redirect**
```html
<meta http-equiv="refresh" content="0; url={{ .Params.url }}" />
```

**Option B: Iframe + Notes**
- Embedded iframe of external site
- Your commentary above/below
- Link to open in new tab

**Option C: Commentary Page**
- No iframe
- Your full notes/commentary
- Prominent external link button
- Why you're recommending it

**Recommended:** Option C (best for SEO, reader value)

### Archetype Location
❌ `archetypes/links/index.md` - To be created

### Implementation Effort
2-3 days (archetype + card + template)

### Status
❌ Phase 1B Week 7-8

---

## Format 4: Video ❌ NEW - PHASE 1B

### Purpose
YouTube/Vimeo sharing with notes (conference talks, tutorial videos, video essays you recommend)

### Use Cases
- Conference talk recommendations
- Tutorial video curation
- Video essays with commentary
- Embedded screencasts

### Frontmatter
```yaml
format: "video"
title: "Video Title"
video_url: "https://youtube.com/watch?v=dQw4w9WgXcQ"
video_id: "dQw4w9WgXcQ"  # Extracted from URL
platform: "youtube"  # or "vimeo"
duration: "12:34"  # Optional
summary: "What this video is about and why you recommend it"
```

### Card Design
- Video thumbnail (from YouTube/Vimeo API)
- Play icon overlay (▶ centered)
- Platform badge (YouTube/Vimeo logo)
- Duration badge (bottom-right)
- Title + summary
- Click → detail page with embedded player

### Single Page Template
- Embedded video player (responsive 16:9)
- Your notes/commentary below video
- Transcript (if available)
- Timestamp links (optional)
- Tags/categories

### YouTube Thumbnail Fetch
```javascript
// scripts/helpers/video-thumbnail.js
const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
```

### Vimeo Thumbnail Fetch
```javascript
// Vimeo API call required
const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
const thumbnail = response[0].thumbnail_large;
```

### Archetype Location
❌ `archetypes/videos/index.md` - To be created

### Implementation Effort
2-3 days (YouTube API, embed, archetype)

### Status
❌ Phase 1B Week 7-8

---

## Format 5: Gallery ❌ NEW - PHASE 1B

### Purpose
Photo collections, travel logs, design showcases (photo essays, before/after, event coverage)

### Use Cases
- Travel photo essays
- Before/after design comparisons
- Design portfolio pieces
- Event photography
- "A day in the life" photo stories

### Frontmatter
```yaml
format: "gallery"
title: "Trip to Iceland"
summary: "Photos from my 2-week Iceland road trip"
# Images stored in same folder as index.md
```

### Resources Structure
```
content/articles/iceland-trip/
├── index.md
├── cover.jpg        # Card preview
├── photo-001.jpg
├── photo-002.jpg
├── photo-003.jpg
├── ...
└── photo-024.jpg
```

### Card Design
- Image grid preview (2×2 or 3×3)
- Photo count badge (e.g., "24 photos")
- Cover image featured prominently
- Double-height card option (`is-row-span-2`)
- Hover: Preview more images

### Single Page Template
**Layout Options:**

**Option A: Masonry Grid**
```html
<div class="gallery-masonry">
  {{ range .Resources.ByType "image" }}
    <img src="{{ .RelPermalink }}" alt="{{ .Title }}" />
  {{ end }}
</div>
```

**Option B: Justified Grid** (Flickr-style)
- All photos same height, variable width
- No gaps, flush edges
- Looks professional

**Option C: Simple Grid** (3-column)
- Fixed columns
- Equal spacing
- Simplest implementation

**Recommended:** Option A (Masonry) for visual interest

### Image Features
- Lightbox/modal for full-size viewing
- Captions from EXIF data (if available)
- Lazy loading (performance)
- Swipe navigation on mobile
- Optional filters (B&W, vintage)

### Archetype Location
❌ `archetypes/galleries/index.md` - To be created

### Implementation Effort
4-5 days (complex layout, lightbox, grid logic)

### Status
❌ Phase 1B Week 9

---

## Format 6: Portfolio ❌ NEW - PHASE 1B

### Purpose
Project showcases, work samples, case studies (web dev projects, design work, open source contributions)

### Use Cases
- Web development projects
- Design case studies
- Open source contributions
- Client work (if allowed to share)
- Personal projects

### Frontmatter
```yaml
format: "portfolio"
title: "E-Commerce Redesign"
summary: "Complete redesign of online store for improved conversions"
project_url: "https://example-store.com"
github_url: "https://github.com/angel/project"
tech_stack: ["Vue.js", "Node.js", "PostgreSQL", "Docker", "Stripe"]
role: "Full-stack Developer"
year: 2024
client: "Example Store Inc."  # Optional
```

### Card Design
- Project screenshot/mockup (hero image)
- Tech stack pills/badges (visible on card)
- Links: [Live Demo] [GitHub]
- Role + year
- Distinct styling (border color, accent)
- Growth stage badge (if applicable)

### Single Page Template

**Sections:**

**1. Hero**
- Large project image or video demo
- Project name + tagline
- Quick links (demo, GitHub, case study)

**2. Overview**
- Problem statement
- Goals/objectives
- Your role
- Timeline

**3. Tech Stack**
- Technology icons/logos
- Why each tech was chosen
- Integration challenges

**4. Solution**
- Approach taken
- Key features built
- Design decisions
- Architecture diagrams (if relevant)

**5. Results**
- Outcomes/impact
- Metrics (if available)
- Lessons learned

**6. Gallery**
- Screenshots/demos
- Before/after comparisons
- Mobile views

**7. Testimonial** (optional)
- Client/user feedback
- Quote + photo

**8. Links**
- Live demo
- GitHub repository
- Related case study
- Press coverage

### Tech Stack Icons
- Use SVG sprite or icon CDN
- Support: React, Vue, Node, Python, Go, Rust, Docker, etc.
- Fallback: Text labels if icon unavailable

### Archetype Location
❌ `archetypes/portfolio/index.md` - To be created

### Implementation Effort
3-4 days (template, tech stack icons, case study layout)

### Status
❌ Phase 1B Week 9

---

## Format Implementation Priority

### Phase 1A (Existing)
1. ✅ Article - Already implemented
2. ✅ Log - Already implemented

### Phase 1B Week 7-8 (Lightweight)
3. ❌ Link (2-3 days)
4. ❌ Video (2-3 days)

### Phase 1B Week 9 (Complex)
5. ❌ Gallery (4-5 days)
6. ❌ Portfolio (3-4 days)

**Total Format Development:** ~3 weeks (~12-15 days)

---

## Removed Formats

### Instagram Format ❌ REMOVED
**Reason:** Identical to Log design-wise
**Replacement:** Use Log format for photo + short text posts
**Decision Date:** 2025-11-13 (final decisions)

---

## Format Selection Guide

**When to use each format:**

| Your Content | Recommended Format |
|--------------|-------------------|
| Long tutorial (1000+ words) | **Article** |
| Quick thought (< 280 chars) | **Log** |
| Bookmark with notes | **Link** |
| Conference talk recommendation | **Video** |
| Travel photos (10-50 images) | **Gallery** |
| Project case study | **Portfolio** |
| Quote + commentary | **Log** |
| How-to guide | **Article** |
| Tool recommendation | **Link** |
| YouTube explainer | **Video** |

---

## Archetype Structure

```
archetypes/
├── articles/
│   └── index.md  ✅ Exists
├── logs/
│   └── index.md  ✅ Exists
├── links/
│   └── index.md  ❌ Phase 1B
├── videos/
│   └── index.md  ❌ Phase 1B
├── galleries/
│   └── index.md  ❌ Phase 1B
└── portfolio/
    └── index.md  ❌ Phase 1B
```

### Archetype Example (Link)

```yaml
---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
draft: false

format: "link"
url: "https://example.com"  # Replace with actual URL
domain: ""  # Auto-extracted

growth_stage: "seedling"
weight: 1

categories: ["Resources"]
tags: []

summary: "Why this resource is valuable..."

params:
  SEO:
    desc: ""
    keywords: []
---

Your commentary on this resource goes here.

Why is it valuable? What did you learn? Who should read it?
```

---

## Filter Integration

All 6 formats integrated into dual filter UI:

**Format Filter:**
```html
<div class="filter-format">
  <button data-filter="format" data-value="all">All</button>
  <button data-filter="format" data-value="article">Articles</button>
  <button data-filter="format" data-value="log">Logs</button>
  <button data-filter="format" data-value="link">Links</button>
  <button data-filter="format" data-value="video">Videos</button>
  <button data-filter="format" data-value="gallery">Galleries</button>
  <button data-filter="format" data-value="portfolio">Portfolio</button>
</div>
```

**Card Markup:**
```html
<article class="card" data-format="{{ .Params.format }}" data-stage="{{ .Params.growth_stage }}">
  <!-- ... -->
</article>
```

---

[← Back to Index](./README.md) | [Previous: Core Features](./03-core-features.md) | [Next: Technical Architecture →](./05-technical-architecture.md)
