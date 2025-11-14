# Source Tree Analysis - Article Time Blog

**Generated:** 2025-11-12
**Project Root:** `/home/angel/Projects/blog`
**Project Type:** Hugo Static Site Generator

---

## Annotated Directory Structure

```
blog/                                    # Project root
├── .git/                               # Git version control
├── .bmad/                              # BMad Method workflow automation
├── .claude/                            # Claude Code configuration
├── .cursor/                            # Cursor IDE configuration
├── .windsurf/                          # Windsurf IDE configuration
│
├── config/                             # Hugo configuration (multi-environment)
│   ├── _default/                       # Default configuration
│   │   ├── config.yaml                 # Main Hugo config (title, taxonomies, markup)
│   │   └── params.yaml                 # Theme parameters and custom settings
│   ├── development/                    # Development overrides
│   │   ├── config.yaml                 # Dev-specific settings
│   │   └── params.yaml                 # Dev parameters
│   └── production/                     # Production overrides
│       ├── config.yaml                 # Production settings
│       └── params.yaml                 # Production parameters
│
├── archetypes/                         # Content templates for `hugo new`
│   ├── articles/                       # Article archetype
│   │   └── index.md                    # Template with full frontmatter
│   └── logs/                           # Log entry archetype
│
├── content/                            # All markdown content (bilingual: de/en)
│   ├── articles/                       # Blog articles (primary content)
│   │   ├── chapter-1/                  # Article bundle (folder-based)
│   │   │   ├── index.md                # Article content + frontmatter
│   │   │   └── cover.[ext]             # Featured image
│   │   ├── chapter-2/ ... chapter-6/   # Series articles
│   │   ├── draft-test/                 # Draft content
│   │   ├── movie-test/                 # Test articles
│   │   ├── rss-test/
│   │   └── test/
│   │
│   ├── logs/                           # Development logs/journal
│   │   ├── log-testing/
│   │   └── log-test-2/
│   │
│   ├── authors/                        # Author profile pages
│   │   ├── angel/                      # Default author
│   │   │   └── _index.md              # Author bio
│   │   └── jdksaj/                     # Test author
│   │
│   ├── pages/                          # Static pages
│   │   ├── archiv/                     # Archive page
│   │   └── ueber-mich/                 # About page (German)
│   │
│   ├── series/                         # Series taxonomy
│   ├── categories/                     # Category taxonomy
│   │   ├── allgemein/                  # General category
│   │   ├── kategorie-1/
│   │   └── movie/
│   └── tags/                           # Tag taxonomy
│       ├── eins/
│       └── scene/
│
├── layouts/                            # Hugo templates (Go templates)
│   ├── _markup/                        # Markdown render hooks
│   │   ├── render-image.html           # Custom image rendering
│   │   ├── render-link.html            # Custom link rendering
│   │   └── render-heading.html         # Custom heading rendering
│   │
│   ├── _partials/                      # Reusable template components
│   │   ├── _base/                      # Core layout partials
│   │   │   ├── head.html               # HTML head + meta tags
│   │   │   ├── seo.html                # SEO structured data
│   │   │   ├── navigation.html         # Main navigation
│   │   │   ├── hero.html               # Hero section
│   │   │   └── footer.html             # Site footer
│   │   ├── widgets/                    # Widget components
│   │   │   ├── pagination.html         # Page navigation
│   │   │   ├── series.html             # Series navigation
│   │   │   └── archive.html            # Archive listings
│   │   └── card.html                   # Article card component
│   │
│   ├── _shortcodes/                    # Custom content shortcodes
│   │   ├── message.html                # Colored message boxes
│   │   ├── rating.html                 # Star ratings
│   │   ├── tags.html                   # Visual tag display
│   │   └── youtube.html                # YouTube embeds
│   │
│   ├── page/                           # Custom page layouts
│   │   └── archive.html                # Archive page template
│   │
│   ├── baseof.html                     # ⭐ Base template (all pages extend)
│   ├── home.html                       # Homepage layout
│   ├── list.html                       # List/archive layout
│   ├── single.html                     # Single article layout
│   └── 404.html                        # Error page
│
├── assets/                             # Source assets (processed by Hugo)
│   ├── js/                             # JavaScript files
│   │   ├── main.js                     # Core functionality
│   │   ├── search.js                   # Client-side search
│   │   ├── header.js                   # Dynamic header
│   │   ├── navbar.js                   # Mobile navigation
│   │   ├── gdpr.js                     # Cookie consent
│   │   ├── firework.js                 # Special effects
│   │   ├── suncalc.js                  # Sunrise/sunset calc
│   │   └── jquery.js                   # jQuery library (vendored)
│   │
│   └── scss/                           # SCSS stylesheets (92 files)
│       ├── main.scss                   # ⭐ Main stylesheet entry point
│       ├── base/                       # Base component styles
│       │   ├── footer.scss
│       │   ├── hero.scss
│       │   └── navigation.scss
│       ├── layout/                     # Layout-specific styles
│       │   ├── card.scss
│       │   ├── lists.scss
│       │   ├── single.scss
│       │   └── widgets.scss
│       ├── elements/                   # Element styles
│       ├── vars/                       # SCSS variables
│       └── src/                        # Third-party sources
│           └── bulma/                  # Bulma CSS framework v1.0.4
│
├── static/                             # Static files (copied as-is)
│   ├── fonts/                          # Web fonts
│   │   ├── Montserrat/                 # Primary font family
│   │   └── remixicon/                  # Icon font files
│   │
│   └── images/                         # Static images
│       ├── favicon/                    # Favicon files
│       └── header/                     # Header images
│
├── public/                             # 🚀 Build output (generated by Hugo)
│   ├── articles/                       # Generated article pages
│   ├── authors/                        # Generated author pages
│   ├── images/                         # Processed images
│   ├── js/                             # Processed JavaScript
│   ├── fonts/                          # Copied fonts
│   ├── categories/                     # Category taxonomy pages
│   ├── tags/                           # Tag taxonomy pages
│   ├── series/                         # Series taxonomy pages
│   ├── pages/                          # Static pages
│   ├── logs/                           # Log pages
│   ├── index.html                      # Homepage
│   ├── index.json                      # Search index
│   ├── index.xml                       # RSS feed
│   └── sitemap.xml                     # XML sitemap
│
├── resources/                          # Hugo cache (image processing, etc.)
│   └── _gen/                           # Generated resources
│
├── docs/                               # Project documentation (this file!)
│   ├── technical/                      # Technical documentation folder
│   ├── bmm-workflow-status.yaml        # BMad Method workflow tracking
│   ├── todo.md                         # Technical debt and improvements
│   ├── project-scan-report.json        # Scan state file
│   ├── component-inventory.md          # UI components catalog
│   ├── data-models.md                  # Content structure documentation
│   └── source-tree-analysis.md         # This file
│
├── node_modules/                       # npm dependencies
│
├── package.json                        # npm package manifest
├── package-lock.json                   # npm lock file
├── postcss.config.js                   # ⭐ PostCSS configuration (PurgeCSS)
├── hugo_stats.json                     # Hugo usage statistics for PurgeCSS
├── .hugo_build.lock                    # Hugo build lock file
├── .gitignore                          # Git ignore rules
└── README.md                           # Project overview
```

---

## Critical Folders Explained

### Entry Points

| Path | Purpose | Role |
|------|---------|------|
| `layouts/baseof.html` | Base template | All pages inherit from this |
| `assets/scss/main.scss` | Main stylesheet | SCSS compilation entry point |
| `assets/js/*.js` | JavaScript modules | Client-side functionality |
| `config/_default/config.yaml` | Hugo config | Site configuration |

### Content Flow

```
content/articles/my-post/index.md
         ↓
layouts/single.html (extends baseof.html)
         ↓
public/articles/my-post/index.html
```

### Build Process Flow

```
1. Hugo reads config/                # Configuration
2. Hugo processes content/           # Markdown → HTML
3. Hugo applies layouts/             # Templates
4. Hugo processes assets/            # SCSS → CSS, JS bundling
5. PostCSS + PurgeCSS runs          # CSS optimization (prod only)
6. Hugo generates public/            # Final site
```

### Asset Processing Pipeline

```
SCSS: assets/scss/main.scss
         → Hugo SCSS processor
         → PostCSS (production)
         → PurgeCSS
         → public/css/main.min.css

JS:   assets/js/*.js
         → Hugo bundling
         → public/js/bundle.js
```

---

## Folder Purpose Matrix

| Folder | Editable | Generated | Versioned | Purpose |
|--------|----------|-----------|-----------|---------|
| `content/` | ✅ | ❌ | ✅ | Markdown source content |
| `layouts/` | ✅ | ❌ | ✅ | HTML templates |
| `assets/` | ✅ | ❌ | ✅ | Source styles and scripts |
| `static/` | ✅ | ❌ | ✅ | Static assets (fonts, images) |
| `config/` | ✅ | ❌ | ✅ | Hugo configuration |
| `archetypes/` | ✅ | ❌ | ✅ | Content templates |
| `public/` | ❌ | ✅ | ❌ | Build output (deployable site) |
| `resources/` | ❌ | ✅ | ❌ | Hugo cache |
| `node_modules/` | ❌ | ✅ | ❌ | npm dependencies |
| `docs/` | ✅ | ✅ | ✅ | Project documentation |

---

## Key Architectural Patterns

### Content Organization: Page Bundles

Article Time uses Hugo's **page bundle** pattern:
- Each article = folder with `index.md`
- Images live alongside content
- Self-contained, portable units

### Multi-Environment Configuration

Hugo config uses **directory-based environments**:
- `config/_default/` - Base configuration
- `config/development/` - Development overrides (e.g., drafts visible)
- `config/production/` - Production overrides (e.g., PurgeCSS enabled)

**Command:** `hugo server --environment production`

### CSS Architecture: ITCSS-inspired

SCSS follows a layered architecture:
1. `vars/` - Variables and tokens
2. `src/bulma/` - Framework (Bulma)
3. `base/` - Base component styles
4. `elements/` - Element styles
5. `layout/` - Layout-specific styles

### JavaScript Pattern: jQuery-based Modules

Each JS file is a self-contained module:
- `main.js` - UI interactions
- `search.js` - Search functionality
- `header.js` - Dynamic header
- Loaded and concatenated by Hugo

---

## File Count Statistics

- **Markdown Files:** 31 (content)
- **HTML Templates:** 22 (layouts)
- **SCSS Files:** 92 (styles)
- **JavaScript Files:** 7 (functionality)
- **Configuration Files:** 6 (Hugo config)

---

## Development vs. Production Differences

| Aspect | Development | Production |
|--------|-------------|------------|
| **Drafts** | Visible | Hidden |
| **CSS Optimization** | None | PurgeCSS enabled |
| **Asset Minification** | Minimal | Full |
| **Source Maps** | Yes | No |
| **Build Speed** | Fast | Slower (optimization) |

---

## Notes

- **Build command:** `hugo` (generates `public/`)
- **Dev server:** `hugo server` (watches for changes)
- **Production build:** `hugo --environment production`
- **New content:** `hugo new content articles/my-title`
- **PostCSS runs:** Only in production environment
- **Search index:** Generated at build time (`public/index.json`)
