# Project Overview - Article Time Blog

**Generated:** 2025-11-12
**Project Name:** Article Time
**Live Site:** https://article-time.de
**Repository:** https://github.com/AngelCrawford/blog

---

## Executive Summary

**Article Time** is a bilingual personal blog (German/English) built with Hugo, the world's fastest static site generator. The blog serves as a platform for technical articles, development logs, and personal writing, featuring a custom-designed theme with advanced features like client-side search, dynamic time-based headers, and responsive design.

**Project Purpose:**
> "Web development is my full time job. But after work isn't much space for private projects. Thus, I almost everytime discarded my projects. Now I want to stick on to one project - a custom theme for my private blog. And a blog!"
> — Angel Crawford

---

## Project Characteristics

### Project Type

**Classification:** Static Website (JAMstack Architecture)

| Attribute | Value |
|-----------|-------|
| **Repository Type** | Monolith (single cohesive codebase) |
| **Project Type** | Web - Static Site Generator |
| **Architecture** | JAMstack (JavaScript, APIs, Markup) |
| **Primary Language** | HTML/Templates, SCSS, JavaScript |
| **Content Languages** | German (primary), English (secondary) |
| **Deployment** | Static files (no server-side processing) |

### Key Features

- ✅ **Bilingual Support:** German and English content
- ✅ **Client-Side Search:** Full-text search with German stopwords
- ✅ **Dynamic Header:** Time-of-day based styling (dawn, day, dusk, night)
- ✅ **Responsive Design:** Mobile-first with Bulma CSS framework
- ✅ **Content Taxonomies:** Categories, tags, series, authors
- ✅ **SEO Optimized:** Meta tags, Open Graph, structured data, sitemap
- ✅ **Custom Shortcodes:** Message boxes, ratings, YouTube embeds
- ✅ **Image Optimization:** Automatic WebP conversion
- ✅ **Performance:** PurgeCSS optimization for production

---

## Technology Stack Summary

### Core Technologies

**Static Site Generator:** Hugo v0.152.2 Extended
**CSS Framework:** Bulma v1.0.4
**CSS Preprocessor:** SCSS (92 source files)
**CSS Optimization:** PostCSS with PurgeCSS
**JavaScript Library:** jQuery (consideration for removal)
**Icons:** Remix Icon (SVG sprites)
**Typography:** Google Fonts - Montserrat family
**Package Manager:** npm

### Architecture Pattern

**JAMstack:**
- **J**avaScript: Client-side enhancements (search, navigation, effects)
- **A**PIs: Potential for future integrations (none currently)
- **M**arkup: Pre-rendered HTML at build time

**Benefits:**
- Fast page loads (no server processing)
- High security (no server-side vulnerabilities)
- Scalable (CDN-ready static files)
- Cost-effective (minimal hosting requirements)

---

## Project Structure

```
article-time/
├── content/           # Markdown content (31 articles)
│   ├── articles/      # Blog posts
│   ├── logs/          # Development logs
│   ├── authors/       # Author profiles
│   └── pages/         # Static pages
├── layouts/           # HTML templates (22 files)
│   ├── _partials/     # Reusable components
│   ├── _shortcodes/   # Content shortcodes
│   └── _markup/       # Render hooks
├── assets/            # Source assets
│   ├── scss/          # Stylesheets (92 files)
│   └── js/            # JavaScript (7 modules)
├── static/            # Static files (fonts, images)
├── config/            # Multi-environment configuration
├── public/            # Build output (generated)
└── docs/              # Project documentation
```

---

## Content Statistics

- **Total Markdown Files:** 31
- **Articles:** ~11 (including drafts and tests)
- **Development Logs:** 2
- **Authors:** 2 (angel, jdksaj)
- **Series:** Multiple (chapter-1 through chapter-6)
- **Categories:** 3 (Allgemein, Kategorie-1, Movie)
- **Tags:** 2+ (eins, scene, etc.)
- **HTML Templates:** 22
- **SCSS Files:** 92
- **JavaScript Modules:** 7
- **Shortcodes:** 4

---

## Architecture Highlights

### Content Management

**Format:** Markdown with YAML frontmatter
**Organization:** Page bundles (folder-based articles)
**Taxonomies:** Categories, tags, series, authors
**Entry Point:** Hugo archetypes for consistent structure

### Build System

**Engine:** Hugo Extended (Go-based, very fast)
**Build Time:** ~2-5 seconds for full site
**Live Reload:** < 1 second incremental updates
**Asset Pipeline:** SCSS compilation, image processing, JS bundling
**Optimization:** PurgeCSS (production only)

### Deployment

**Current:** Manual (build + upload)
**Output:** Static HTML/CSS/JS files in `public/`
**Recommended:** Netlify or Vercel for auto-deployment
**Hosting:** Any static host, CDN, or object storage

---

## Quick Reference

### Tech Stack at a Glance

| Layer | Technology |
|-------|-----------|
| **Generator** | Hugo v0.152.2 Extended |
| **Templates** | Go Templates (Hugo built-in) |
| **Content** | Markdown (Goldmark) with YAML |
| **Styling** | SCSS → CSS (Bulma framework) |
| **Optimization** | PostCSS + PurgeCSS |
| **Interactivity** | jQuery + custom modules |
| **Icons** | Remix Icon (SVG) |
| **Fonts** | Montserrat (Google Fonts) |
| **Version Control** | Git |
| **Package Manager** | npm |

### Entry Points

| Component | Location | Purpose |
|-----------|----------|---------|
| **Base Template** | `layouts/baseof.html` | All pages extend this |
| **Main Stylesheet** | `assets/scss/main.scss` | SCSS entry point |
| **Hugo Config** | `config/_default/config.yaml` | Site configuration |
| **Content Root** | `content/` | All markdown content |
| **Build Output** | `public/` | Deployable static files |

### Documentation Index

| Document | Purpose |
|----------|---------|
| `architecture.md` | Complete architecture documentation |
| `component-inventory.md` | UI components catalog |
| `data-models.md` | Content structure and frontmatter |
| `source-tree-analysis.md` | Annotated directory structure |
| `development-guide.md` | Setup, workflow, commands |
| `project-overview.md` | This file - high-level summary |
| `todo.md` | Technical debt and improvements |

---

## Getting Started

### For Developers

1. **Prerequisites:** Install Hugo Extended v0.147+, Node.js v14+
2. **Clone:** `git clone https://github.com/AngelCrawford/blog.git`
3. **Install:** `npm install`
4. **Develop:** `hugo server`
5. **Build:** `hugo --environment production`

See `docs/development-guide.md` for complete instructions.

### For Content Authors

1. **Create Article:** `hugo new content articles/my-title`
2. **Edit:** Open `content/articles/my-title/index.md`
3. **Add Images:** Place in same folder as `index.md`
4. **Publish:** Set `draft: false` in frontmatter
5. **Preview:** `hugo server` → http://localhost:1313

See archetype template in `archetypes/articles/index.md` for full guidance.

---

## Key Design Decisions

### Why Hugo?

- ✅ Fastest static site generator (Go-based)
- ✅ No dependencies (single binary)
- ✅ Built-in SCSS, image processing, templating
- ✅ Content organization (page bundles, taxonomies)
- ✅ Large ecosystem and active community

### Why JAMstack?

- ✅ Maximum performance (pre-rendered)
- ✅ High security (no server vulnerabilities)
- ✅ Scalability (static files + CDN)
- ✅ Cost-effective (minimal hosting needs)
- ✅ Developer experience (simple deployment)

### Why Bulma CSS?

- ✅ Modern, flexbox-based responsive framework
- ✅ No JavaScript required (pure CSS)
- ✅ Modular and customizable (SCSS variables)
- ✅ Good documentation and examples

---

## Development Status

### Current State

- **Functional:** Fully operational blog
- **Deployed:** Live at https://article-time.de
- **Content:** Active with multiple articles
- **Maintenance:** Ongoing improvements

### Technical Debt

See `docs/todo.md` for complete list. Key items:

1. **jQuery Migration:** Consider vanilla JS (~30KB savings)
2. **Performance:** Optimize search index loading
3. **CSS:** Remove overly aggressive `!important` usage
4. **CSP:** Implement Content Security Policy
5. **Testing:** Add automated tests
6. **CI/CD:** Automate deployment

### Future Enhancements

- Enhanced search (Algolia or Pagefind)
- Comment system integration
- Progressive Web App (PWA) features
- Newsletter subscription
- Advanced analytics

---

## Project History

**Platform Evolution:**
- Original: Windows
- Current: Cross-platform (developed on Windows)

**Editor Evolution:**
- Original: Visual Studio Code
- Current: Windsurf

**Hugo Version:**
- Original: v0.67.0 (mentioned in README)
- Current: v0.152.2

**Framework:**
- Bulma v1.0.4 (stable and maintained)

---

## Resources & Credits

### Official Resources

- **Live Site:** https://article-time.de
- **Repository:** https://github.com/AngelCrawford/blog
- **Hugo Docs:** https://gohugo.io/documentation/
- **Bulma Docs:** https://bulma.io/documentation/

### Tutorials & Inspiration

- [Related Pages Tutorial](https://www.pakstech.com/blog/hugo-related-pages/)
- [Hugo Series Links](http://www.joesacher.com/blog/2017/08/27/converting-series-to-taxonomy/)
- [Dynamic Search in Hugo](https://blog.jeremylikness.com/blog/dynamic-search-in-a-static-hugo-website/)

### Third-Party Resources

- **CodePen Inspirations:** Firework.js, Sky Background, Hot Air Balloon, Santa Hat, Ghosty, Bird animations
- **Icons:** [Remix Icon](https://remixicon.com)
- **Fonts:** [Google Fonts - Montserrat](https://fonts.google.com/specimen/Montserrat)
- **Images:** Hamburg and Kiel skylines from Shutterstock (by pixelliebe)
- **Astronomical Calculations:** [SunCalc](https://github.com/mourner/suncalc)

---

## Contact

**Author:** Angel Crawford
**Default Author ID:** angel
**GitHub:** https://github.com/AngelCrawford/blog

---

## License

See repository for license information.

---

**Last Updated:** 2025-11-12
**Documentation Version:** 1.0
**Hugo Version:** v0.152.2+extended
