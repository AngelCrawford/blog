# Article Time Blog - Project Documentation Index

**Generated:** 2025-11-12
**Project:** Article Time
**Type:** Hugo Static Site Generator (JAMstack)
**Live Site:** https://article-time.de
**Repository:** https://github.com/AngelCrawford/blog

---

## 📋 Project Overview

### Project Classification

- **Repository Type:** Monolith (single cohesive codebase)
- **Project Type:** Web - Static Site Generator
- **Primary Language:** HTML/Templates, SCSS, JavaScript
- **Architecture:** JAMstack (JavaScript, APIs, Markup)
- **Content Languages:** German (primary), English (secondary)

### Quick Reference

| Aspect | Details |
|--------|---------|
| **Tech Stack** | Hugo v0.152.2 Extended, Bulma v1.0.4, SCSS, PostCSS/PurgeCSS, jQuery, Remix Icon |
| **Entry Point** | `layouts/baseof.html` (base template) |
| **Content Root** | `content/` (31 Markdown files) |
| **Build Output** | `public/` (static HTML/CSS/JS) |
| **Dev Command** | `hugo server` (live reload) |
| **Build Command** | `hugo --environment production` |

---

## 🗂️ Generated Documentation

### Core Documentation

- **[Project Overview](./project-overview.md)** - Executive summary, tech stack, quick start
- **[Architecture](./architecture.md)** - Complete system architecture, design decisions, JAMstack implementation
- **[Development Guide](./development-guide.md)** - Setup, workflow, commands, troubleshooting
- **[Source Tree Analysis](./source-tree-analysis.md)** - Annotated directory structure, file organization

### Component Documentation

- **[Component Inventory](./component-inventory.md)** - UI components, layouts, partials, shortcodes, JavaScript modules
- **[Data Models](./data-models.md)** - Content structure, frontmatter schema, taxonomies

### Existing Documentation

- **[README.md](../README.md)** - Original project README with credits and resources
- **[TODO.md](./todo.md)** - Technical debt, improvements, optimization recommendations

---

## 🚀 Getting Started

### For AI-Assisted Development

**Start here based on your task:**

1. **Understanding the codebase:**
   - Read [Project Overview](./project-overview.md) first
   - Then [Architecture](./architecture.md) for deep understanding
   - Check [Source Tree Analysis](./source-tree-analysis.md) for file locations

2. **Adding new features:**
   - Review [Architecture](./architecture.md) § Component Architecture
   - Check [Component Inventory](./component-inventory.md) for existing patterns
   - See [Development Guide](./development-guide.md) § Adding Features

3. **Modifying content structure:**
   - Read [Data Models](./data-models.md) for frontmatter schema
   - Check [Architecture](./architecture.md) § Content Architecture
   - See archetype template: `archetypes/articles/index.md`

4. **Styling changes:**
   - Review [Architecture](./architecture.md) § CSS/Style Architecture
   - Check SCSS structure in [Source Tree Analysis](./source-tree-analysis.md)
   - Note: Bulma CSS framework with custom SCSS layers

5. **Performance optimization:**
   - Review [TODO.md](./todo.md) for known issues
   - Check [Architecture](./architecture.md) § Performance Characteristics
   - See [Development Guide](./development-guide.md) § Performance Testing

6. **Deployment:**
   - Read [Development Guide](./development-guide.md) § Deployment
   - Check [Architecture](./architecture.md) § Build & Deployment Architecture

### For Human Developers

1. **First time setup:**
   ```bash
   git clone https://github.com/AngelCrawford/blog.git
   cd blog
   npm install
   hugo server
   ```

2. **Create new article:**
   ```bash
   hugo new content articles/my-title
   ```

3. **Build for production:**
   ```bash
   hugo --environment production
   ```

See [Development Guide](./development-guide.md) for complete instructions.

---

## 📁 Project Structure

```
blog/
├── config/           # Multi-environment Hugo configuration
├── content/          # Markdown content (31 files)
│   ├── articles/     # Blog posts (primary content)
│   ├── logs/         # Development logs
│   ├── authors/      # Author profiles
│   └── pages/        # Static pages
├── layouts/          # HTML templates (22 files)
│   ├── _partials/    # Reusable components
│   ├── _shortcodes/  # Content shortcodes
│   └── _markup/      # Render hooks
├── assets/           # Source assets
│   ├── scss/         # Stylesheets (92 files, Bulma-based)
│   └── js/           # JavaScript (7 modules, jQuery-based)
├── static/           # Static files (fonts, images)
├── public/           # Build output (generated, not versioned)
├── docs/             # Project documentation (this folder)
└── README.md         # Original project README
```

See [Source Tree Analysis](./source-tree-analysis.md) for detailed structure with annotations.

---

## 🏗️ Architecture Highlights

### JAMstack Pattern

```
Build Time:
  Markdown Content + Hugo Templates → Static HTML/CSS/JS

Runtime:
  User Request → CDN → Pre-rendered HTML → Instant Load
```

**Benefits:**
- ⚡ Fast (no server processing)
- 🔒 Secure (no server-side vulnerabilities)
- 📈 Scalable (static files + CDN)
- 💰 Cost-effective (minimal hosting)

See [Architecture](./architecture.md) for complete details.

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Generator** | Hugo v0.152.2 Extended | Build system, templating, asset pipeline |
| **Templates** | Go Templates | HTML rendering |
| **Content** | Markdown + YAML | Content authoring |
| **CSS** | SCSS → Bulma → PostCSS → PurgeCSS | Styling and optimization |
| **JavaScript** | jQuery + custom modules | Interactivity (search, navigation, effects) |
| **Icons** | Remix Icon (SVG) | Icon system |
| **Fonts** | Montserrat (Google Fonts) | Typography |

### Content Model

- **Format:** Markdown with YAML frontmatter
- **Organization:** Page bundles (folder-based)
- **Taxonomies:** Categories, tags, series, authors
- **Images:** Co-located with content, auto-converted to WebP

See [Data Models](./data-models.md) and [Architecture](./architecture.md) § Content Architecture.

### Component System

**22 HTML templates:**
- Base: `baseof.html` (all pages extend)
- Layouts: `home.html`, `list.html`, `single.html`
- Partials: Navigation, footer, hero, SEO, widgets
- Shortcodes: Message boxes, ratings, tags, YouTube embeds
- Render hooks: Custom image/link/heading rendering

**92 SCSS files:**
- Structure: ITCSS-inspired layers
- Framework: Bulma CSS v1.0.4
- Optimization: PurgeCSS in production

**7 JavaScript modules:**
- search.js, header.js, navbar.js, gdpr.js, main.js, firework.js, suncalc.js
- Library: jQuery (consideration for removal in todo.md)

See [Component Inventory](./component-inventory.md).

---

## 🔧 Development Workflow

### Commands

```bash
# Start dev server (live reload)
hugo server

# Build for production
hugo --environment production

# Create new article
hugo new content articles/my-title

# Check Hugo version
hugo version  # Must show "extended"
```

### Build Process

```
1. Hugo reads config/               # Configuration
2. Hugo processes content/          # Markdown → HTML
3. Hugo applies layouts/            # Templates
4. Hugo processes assets/           # SCSS → CSS, JS bundling
5. PostCSS + PurgeCSS (prod)       # CSS optimization
6. Hugo generates public/           # Final static site
```

**Build Time:** ~2-5 seconds (small site)
**Live Reload:** < 1 second (incremental)

See [Development Guide](./development-guide.md) for complete workflow.

---

## ⚠️ Technical Debt & Known Issues

See [TODO.md](./todo.md) for complete list. Key items:

### High Priority
1. **jQuery migration** - Consider vanilla JS (~30KB savings)
2. **CSP implementation** - Add Content Security Policy
3. **Search optimization** - Lazy-load search index

### Medium Priority
1. **CSS cleanup** - Remove `!important` from universal selector
2. **Font loading** - Add `font-display: swap`
3. **Error pages** - Add 500, 403, etc.

### Low Priority
1. **Design system** - Token-based design system
2. **Automated testing** - Build validation tests
3. **CI/CD** - Automated deployment pipeline

---

## 📊 Project Statistics

- **Content Files:** 31 Markdown documents
- **Articles:** ~11 (including drafts)
- **HTML Templates:** 22 files
- **SCSS Files:** 92 files
- **JavaScript Files:** 7 modules
- **Shortcodes:** 4 custom shortcodes
- **Build Time:** ~2-5 seconds
- **Languages:** German (primary), English

---

## 🎯 Common Tasks Quick Reference

### Content Tasks

| Task | Command | Documentation |
|------|---------|---------------|
| Create article | `hugo new content articles/title` | [Dev Guide](./development-guide.md) § Creating Content |
| Set as draft | `draft: true` in frontmatter | [Data Models](./data-models.md) § Frontmatter |
| Publish article | `draft: false` in frontmatter | [Data Models](./data-models.md) |
| Add images | Place in article folder | [Dev Guide](./development-guide.md) § Article Images |

### Development Tasks

| Task | Command | Documentation |
|------|---------|---------------|
| Start dev server | `hugo server` | [Dev Guide](./development-guide.md) § Workflow |
| Build for prod | `hugo --environment production` | [Dev Guide](./development-guide.md) § Build Process |
| Clean build | `rm -rf public/ resources/ && hugo` | [Dev Guide](./development-guide.md) § Clean Build |
| Update deps | `npm update` | [Dev Guide](./development-guide.md) § Update Dependencies |

### Styling Tasks

| Task | Location | Documentation |
|------|----------|---------------|
| Edit styles | `assets/scss/` | [Architecture](./architecture.md) § CSS Architecture |
| Main entry | `assets/scss/main.scss` | [Source Tree](./source-tree-analysis.md) |
| Add to safelist | `postcss.config.js` | [Dev Guide](./development-guide.md) § PurgeCSS |

### Component Tasks

| Task | Location | Documentation |
|------|----------|---------------|
| Add partial | `layouts/_partials/` | [Component Inventory](./component-inventory.md) |
| Add shortcode | `layouts/_shortcodes/` | [Component Inventory](./component-inventory.md) § Shortcodes |
| Modify layout | `layouts/` | [Architecture](./architecture.md) § Component Architecture |

---

## 🔍 Finding Specific Information

### Architecture Questions

- **"How does the build process work?"** → [Architecture](./architecture.md) § Build & Deployment Architecture
- **"What's the template hierarchy?"** → [Architecture](./architecture.md) § Component Architecture
- **"How is content organized?"** → [Architecture](./architecture.md) § Content Architecture
- **"What's the CSS structure?"** → [Architecture](./architecture.md) § CSS/Style Architecture

### Development Questions

- **"How do I set up the project?"** → [Development Guide](./development-guide.md) § Initial Setup
- **"How do I create content?"** → [Development Guide](./development-guide.md) § Creating Content
- **"What commands are available?"** → [Development Guide](./development-guide.md) § Commands
- **"How do I troubleshoot issues?"** → [Development Guide](./development-guide.md) § Troubleshooting

### Content Structure Questions

- **"What frontmatter fields are required?"** → [Data Models](./data-models.md) § Frontmatter Schema
- **"How do taxonomies work?"** → [Data Models](./data-models.md) § Taxonomies
- **"How is content organized?"** → [Data Models](./data-models.md) § Content Organization

### Component Questions

- **"What templates exist?"** → [Component Inventory](./component-inventory.md) § Layout Templates
- **"What shortcodes are available?"** → [Component Inventory](./component-inventory.md) § Shortcodes
- **"What JavaScript modules exist?"** → [Component Inventory](./component-inventory.md) § JavaScript Components

### File Location Questions

- **"Where is the base template?"** → [Source Tree Analysis](./source-tree-analysis.md) - `layouts/baseof.html`
- **"Where are styles defined?"** → [Source Tree Analysis](./source-tree-analysis.md) - `assets/scss/`
- **"Where is content stored?"** → [Source Tree Analysis](./source-tree-analysis.md) - `content/`

---

## 📞 Support & Resources

### Documentation

- This index file (primary entry point)
- 7 generated documentation files
- Original README.md
- Inline code comments and archetype templates

### External Resources

- **Hugo Docs:** https://gohugo.io/documentation/
- **Bulma Docs:** https://bulma.io/documentation/
- **Repository:** https://github.com/AngelCrawford/blog
- **Live Site:** https://article-time.de

### Credits

See [README.md](../README.md) and [Project Overview](./project-overview.md) § Resources & Credits.

---

## 📝 Documentation Maintenance

**Generated:** 2025-11-12
**Scan Level:** Exhaustive (all source files analyzed)
**Documentation Version:** 1.0
**Hugo Version:** v0.152.2+extended

**Note:** This documentation was generated automatically by the BMad Method document-project workflow. For updates, re-run the workflow or manually edit the relevant files.

**State File:** `project-scan-report.json` (contains workflow execution state)

---

**Navigation:**
- [↑ Back to Top](#article-time-blog---project-documentation-index)
- [→ Start with Project Overview](./project-overview.md)
- [→ Deep Dive into Architecture](./architecture.md)
- [→ Developer Setup Guide](./development-guide.md)
