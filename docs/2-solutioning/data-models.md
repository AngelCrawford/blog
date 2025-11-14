# Data Models & Content Structure - Article Time Blog

**Generated:** 2025-11-12
**Project:** Article Time (Hugo Static Site)
**Content Type:** Markdown-based with YAML frontmatter

---

## Overview

Article Time uses Hugo's content management system with Markdown files and YAML frontmatter for structured data. Content is organized into taxonomies and sections.

## Content Sections

### Articles Section (`content/articles/`)

Primary content type for blog posts. Each article is a bundle (folder with `index.md`).

**Current Count:** ~11 articles (including drafts and tests)

**Sample Articles:**
- chapter-1 through chapter-6 (series)
- draft-test, rss-test, movie-test
- test (standalone articles)

### Logs Section (`content/logs/`)

Development logs or journal entries.

**Subdirectories:**
- `log-testing/`
- `log-test-2/`

### Authors Section (`content/authors/`)

Author profile pages.

**Authors:**
- `angel/` (default author)
- `jdksaj/` (test author)

### Other Sections
- `series/` - Series taxonomy pages
- `pages/` - Static pages
- `tags/` - Tag taxonomy pages
- `categories/` - Category taxonomy pages

## Article Frontmatter Schema

### Required Fields

```yaml
title: string              # SEO meta title (60-70 characters max)
date: datetime             # Publication date (ISO 8601)
summary: string            # REQUIRED: List view summary
draft: boolean             # true/false publication status
```

### Optional Core Fields

```yaml
slug: string               # URL-friendly slug (use for special characters)
subtitle: string           # Optional subtitle
lastmod: datetime          # Manual last modified date (overrides git)
publishdate: datetime      # Scheduled publishing date
weight: integer            # 1 = sticky, others sort normally
```

### Taxonomy Fields

```yaml
categories: [string]       # Array - only first is used
tags: [string]             # Array of tags
series: [string]           # Must match across articles to group
authors: [string]          # Default: ["angel"]
```

### SEO Parameters

```yaml
params:
  SEO:
    desc: string           # SEO description (120-158 chars)
                          # Falls back to summary if not set
    keywords: [string]     # 1-3 keywords (generated from tags if empty)
    canonicalURL: string   # Canonical URL for cross-posting
```

## Complete Frontmatter Example

```yaml
---
title: 'My Article Title'
slug: "my-article-title"  # Optional
subtitle: "An engaging subtitle"
date: 2025-11-12T10:00:00+01:00
lastmod: 2025-11-12T15:30:00+01:00
draft: false
weight: 0

categories: ["Technology"]
tags: ["Hugo", "Web Development", "Static Sites"]
series: ["Hugo Tutorials"]
authors: ["angel"]

summary: "This is a compelling summary that appears in list views and meta descriptions."

params:
  SEO:
    desc: "Detailed SEO description optimized for search engines with target keywords."
    keywords: ["Hugo", "Static Site", "JAMstack"]
    canonicalURL: ""
---
```

## Taxonomies Configuration

Defined in `config/_default/config.yaml`:

```yaml
taxonomies:
  category: categories
  tag: tags
  author: authors
  series: series
```

### Taxonomy Behavior

- **Categories:** Single primary category (first in array)
- **Tags:** Multiple tags supported
- **Series:** Groups related articles with navigation
- **Authors:** Multiple authors per article supported

## Content Archetypes

### Articles Archetype (`archetypes/articles/index.md`)

Template for creating new articles via `hugo new content articles/my-title-name`.

**Features:**
- Pre-populated frontmatter with all fields
- Inline documentation/comments
- SEO guidelines
- Shortcode usage examples
- Image handling instructions

**Key Instructions:**
- Place cover image as `cover.[format]` in article folder
- Automatic WebP conversion
- Image metadata extracted for figcaptions
- Use title for SEO optimization

## Content Organization Pattern

```
content/
├── articles/
│   ├── chapter-1/
│   │   ├── index.md (frontmatter + content)
│   │   ├── cover.jpg (featured image)
│   │   └── [other-images].png
│   └── [other-articles]/
├── logs/
│   └── [log-entries]/
├── authors/
│   ├── angel/
│   │   └── _index.md
│   └── [other-authors]/
├── series/
│   └── _index.md (taxonomy terms)
├── pages/
│   └── [static-pages]/
├── tags/
│   └── _index.md
└── categories/
    └── _index.md
```

## Data Relationships

### Article → Series
```
Article (frontmatter: series: ["Series Name"])
  ↓
Series Taxonomy
  ↓
Widget: Related Articles in Same Series
```

### Article → Author
```
Article (frontmatter: authors: ["angel"])
  ↓
Author Profile Page
  ↓
Author Bio and Articles by Author
```

### Article → Tags/Categories
```
Article (frontmatter: tags/categories)
  ↓
Taxonomy Pages
  ↓
List View with All Tagged Articles
```

## Search Index Data Model

Generated at build time as `/index.json`:

```json
[
  {
    "title": "Article Title",
    "showTitle": "Display Title",
    "content": "Full article content",
    "showContent": "Searchable content excerpt",
    "permalink": "/articles/slug/",
    "tags": "tag1, tag2, tag3",
    "categories": "Category Name",
    "publishedOn": "09.04.2017",
    "updatedOn": "12.11.2025"
  }
]
```

**Usage:** Loaded by `search.js` for client-side full-text search

## Content Count Statistics

- **Total Markdown Files:** 31
- **Sections:** 6 (articles, logs, authors, series, pages, categories, tags)
- **Primary Content Type:** Articles (leaf bundles)
- **Languages Supported:** German (default), English

## Content Frontmatter Validation

Based on archetype template:

- ✅ `title` - Required
- ✅ `date` - Required (auto-generated)
- ✅ `summary` - Required (explicitly marked in archetype)
- ⚠️  `draft` - Defaults to `true` (must manually set to `false`)
- ⚠️  `params.SEO.desc` - Falls back to summary if missing
- ✅ `authors` - Defaults to `["angel"]`

## Image Handling

- **Location:** Same folder as `index.md` (page bundle)
- **Cover Image:** Named `cover.[ext]` (auto-detected by theme)
- **Processing:** Hugo image processing + WebP conversion
- **Metadata:** EXIF title property → figcaption
- **Alt Text:** Defined in markdown image syntax

## Git Integration

```yaml
enableGitInfo: true
frontmatter:
  lastmod: ["lastmod", ":git", "date"]
```

**Behavior:** `lastmod` falls back to Git commit date if not manually specified.

## Related Content Algorithm

```yaml
related:
  threshold: 20
  includeNewer: true
  indices:
  - name: series (weight: 3)
  - name: categories (weight: 2)
  - name: authors (weight: 1)
```

**Priority:** Series matching (highest) → Category matching → Author matching

---

## Notes

- Content is versioned in Git
- All dates use Europe/Berlin timezone
- Markdown supports extended Goldmark features (strikethrough, subscript, superscript, mark, insert, delete)
- Unsafe HTML allowed in markdown (for advanced formatting)
