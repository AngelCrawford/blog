# Development Guide - Article Time Blog

**Generated:** 2025-11-12
**Project:** Article Time Hugo Blog
**Live Site:** https://article-time.de

---

## Prerequisites

### Required Software

| Software | Minimum Version | Purpose | Installation |
|----------|----------------|---------|--------------|
| **Hugo Extended** | v0.147+ | Static site generator | [gohugo.io](https://gohugo.io/installation/) |
| **Node.js** | v14+ | npm package management | [nodejs.org](https://nodejs.org/) |
| **npm** | v6+ | JavaScript dependencies | Included with Node.js |
| **Git** | v2.0+ | Version control | [git-scm.com](https://git-scm.com/) |

### Optional Tools

- **Image editing:** GIMP (raster), Inkscape (vector)
- **Platform:** Windows (primary), but works on Linux/macOS

### System Check

Verify installations:

```bash
hugo version         # Should show v0.152.2+extended (or similar)
node --version       # v14.0.0 or higher
npm --version        # v6.0.0 or higher
git --version        # v2.0.0 or higher
```

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/AngelCrawford/blog.git
cd blog
```

### 2. Install Dependencies

```bash
npm install
```

**Installs:**
- `@fullhuman/postcss-purgecss` ^7.0.2 - CSS optimization
- `postcss` ^8.5.6 - CSS processing
- `postcss-cli` ^11.0.1 - PostCSS command line

### 3. Verify Hugo Extended

Hugo **Extended** is required for SCSS processing:

```bash
hugo version
# Must show "extended" in output
```

If you see only `hugo v0.xxx`, you need Hugo Extended version.

---

## Development Workflow

### Start Development Server

```bash
hugo server
```

**Features:**
- Live reload on file changes
- Serves at `http://localhost:1313`
- Drafts visible by default (development mode)
- Fast refresh (< 1 second)

**Output:**
```
Web Server is available at http://localhost:1313/
Press Ctrl+C to stop
```

### Start with Production Settings

```bash
hugo server --environment production
```

**Differences from development:**
- PurgeCSS enabled (smaller CSS)
- Drafts hidden
- Optimized assets
- Slower build (due to optimization)

### Watch for Changes

Hugo automatically watches:
- `content/` - Markdown files
- `layouts/` - Templates
- `assets/` - SCSS and JS
- `static/` - Static files
- `config/` - Configuration
- `archetypes/` - Content templates

**No restart needed!** Hugo rebuilds on file save.

---

## Creating Content

### New Article

```bash
hugo new content articles/my-article-title
```

**Creates:**
```
content/articles/my-article-title/
└── index.md (from archetype template)
```

**Archetype includes:**
- Full frontmatter template
- Inline documentation
- SEO guidelines
- Shortcode examples

### Article Images

1. Place images in the same folder as `index.md`
2. Name featured image: `cover.jpg` (or `.png`, `.webp`, etc.)
3. Hugo automatically converts to WebP format
4. Set image metadata (Windows: Properties → Details → Title) for figcaptions

### New Log Entry

```bash
hugo new content logs/my-log-entry
```

### Draft vs. Published

**Draft (not published):**
```yaml
draft: true
```

**Published:**
```yaml
draft: false
```

---

## Build Process

### Production Build

```bash
hugo --environment production
```

**Generates:** `public/` folder (deployable site)

**Process:**
1. Reads configuration from `config/production/`
2. Processes all content files
3. Applies layouts and templates
4. Compiles SCSS to CSS
5. Bundles and minifies JavaScript
6. Runs PostCSS + PurgeCSS (CSS optimization)
7. Processes images (WebP conversion)
8. Generates search index (`index.json`)
9. Creates RSS feed (`index.xml`)
10. Builds sitemap (`sitemap.xml`)

**Build time:** ~2-5 seconds (small site)

### Development Build

```bash
hugo
```

**Faster** but **not optimized** (no PurgeCSS).

### Clean Build

```bash
rm -rf public/ resources/
hugo --environment production
```

Removes cached resources for a clean rebuild.

---

## CSS Development

### SCSS Structure

Main entry point: `assets/scss/main.scss`

**Build pipeline:**
```
assets/scss/main.scss
    → Hugo SCSS processor
    → CSS output
    → PostCSS (prod only)
    → PurgeCSS (prod only)
    → public/css/main.min.css
```

### PurgeCSS Configuration

Configured in `postcss.config.js`:

```javascript
content: [
  "./hugo_stats.json",      // Hugo usage tracking
  "./layouts/**/*.html",    // Templates
  "./assets/js/**/*.js"     // JavaScript
]
```

**Safelist:** Classes that must NOT be removed:
- Dynamic classes from `search.js`
- Classes from `header.js` (time-of-day themes)
- Classes from `navbar.js` (mobile menu)
- Classes from `gdpr.js` (cookie consent)

### Adding New Styles

1. Edit SCSS files in `assets/scss/`
2. Hugo auto-recompiles on save
3. Browser auto-refreshes

### Viewing Compiled CSS

During development:
```
resources/_gen/assets/scss/scss/main.scss/...
```

In production build:
```
public/css/main.min.css
```

---

## JavaScript Development

### File Locations

All JS in `assets/js/`:
- `main.js` - Core functionality
- `search.js` - Search feature
- `header.js` - Dynamic header
- `navbar.js` - Mobile menu
- `gdpr.js` - Cookie consent
- `firework.js` - Special effects
- `suncalc.js` - Astronomy calculations
- `jquery.js` - jQuery library (vendored)

### jQuery Usage

Site currently uses jQuery for DOM manipulation.

**Note:** See `docs/todo.md` for migration to vanilla JS consideration.

### Adding New JavaScript

1. Create new file in `assets/js/`
2. Reference in template:
```html
{{ $js := resources.Get "js/my-script.js" }}
<script src="{{ $js.RelPermalink }}"></script>
```

---

## Configuration

### Multi-Environment Setup

```
config/
├── _default/         # Base configuration
├── development/      # Development overrides
└── production/       # Production overrides
```

**Environment selection:**
```bash
hugo server --environment development    # Default
hugo server --environment production     # Prod mode
hugo --environment production            # Build for prod
```

### Key Configuration Files

| File | Purpose |
|------|---------|
| `config/_default/config.yaml` | Main Hugo settings |
| `config/_default/params.yaml` | Theme parameters |
| `config/production/config.yaml` | Production overrides |
| `postcss.config.js` | PostCSS and PurgeCSS setup |

### Environment Variables

**HUGO_ENVIRONMENT:**
- `development` - Fast builds, drafts visible
- `production` - Optimized builds, drafts hidden

Set in `postcss.config.js`:
```javascript
process.env.HUGO_ENVIRONMENT === "production"
```

---

## Testing

### Manual Testing Checklist

- [x] Homepage loads correctly
- [x] Article pages display properly
- [x] Navigation works (desktop and mobile)
- [x] Search functionality works
- [x] Images load and convert to WebP
- [ ] RSS feed validates (not ready yet)
- [ ] Sitemap generates correctly (not ready yet)
- [ ] 404 page displays (not ready yet)
- [x] Series navigation works
- [x] Taxonomy pages (tags, categories, authors) work

### Performance Testing

1. Build with production settings
2. Test page load speed
3. Check CSS size (PurgeCSS effectiveness)
4. Validate HTML (W3C validator)
5. Test responsive design (mobile/tablet/desktop)

### SEO Testing (Not ready yet)

- [ ] Meta tags present (title, description)
- [ ] Open Graph tags (social media)
- [ ] Structured data (JSON-LD)
- [ ] Canonical URLs
- [ ] Sitemap accessible
- [ ] robots.txt configured

---

## Common Tasks

### Update Hugo Version

1. Download Hugo Extended from [gohugo.io/installation/](https://gohugo.io/installation/)
2. Replace binary
3. Test: `hugo version`
4. Rebuild site: `hugo --environment production`

### Update npm Dependencies

```bash
npm update
npm outdated          # Check for updates
npm audit            # Security check
```

### Add New Taxonomy

1. Edit `config/_default/config.yaml`:
```yaml
taxonomies:
  my_taxonomy: my_taxonomies
```

2. Add to frontmatter:
```yaml
my_taxonomies: ["value1", "value2"]
```

3. Create layout: `layouts/my_taxonomy/list.html`

### Change Site Title

Edit `config/_default/config.yaml`:
```yaml
title: "My New Title"
```

### Change Default Language

Edit `config/_default/config.yaml`:
```yaml
defaultContentLanguage: en    # Change from "de"
```

---

## Troubleshooting

### "Hugo command not found"

**Solution:** Add Hugo to PATH or use full path to binary.

### "SCSS processing failed"

**Cause:** Using Hugo standard (not Extended).

**Solution:** Install Hugo Extended version.

### "PurgeCSS removed needed styles"

**Solution:** Add classes to safelist in `postcss.config.js`:

```javascript
safelist: {
  standard: ['my-class', 'another-class']
}
```

### "Live reload not working"

**Solutions:**
1. Check browser console for errors
2. Restart Hugo server
3. Clear browser cache
4. Check firewall settings

### "Images not converting to WebP"

**Cause:** Hugo image processing issue.

**Solution:**
1. Ensure Hugo Extended is installed
2. Check image is in page bundle
3. Verify render hook: `layouts/_markup/render-image.html`

### "Build is slow"

**Solutions:**
1. Use development mode (not production)
2. Disable PurgeCSS during development
3. Clean resources: `rm -rf resources/`
4. Check for large images (optimize first)

---

## Git Workflow

### Standard Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "Add new article about Hugo"

# Push to remote
git push origin main
```

### Git Features Used

- **Git Info:** `enableGitInfo: true` in config
- **Last Modified:** Automatically pulled from Git commits
- **Frontmatter fallback:** Uses Git date if `lastmod` not set

---

## Deployment

**Note:** No CI/CD configuration found in repository.

### Manual Deployment Process

1. Build production site:
```bash
hugo --environment production
```

2. Upload `public/` folder to web host

### Recommended Deployment Options

- **Netlify:** Auto-deploy from Git (recommended)
- **Vercel:** Git-based deployment
- **GitHub Pages:** Free hosting
- **Traditional hosting:** FTP/SFTP upload of `public/`

### Netlify Configuration (suggested)

Create `netlify.toml`:
```toml
[build]
  publish = "public"
  command = "hugo --environment production"

[build.environment]
  HUGO_VERSION = "0.152.2"
  HUGO_EXTENDED = "true"
```

---

## Development Tips

### Speed Up Development

1. **Skip CSS optimization:**
   ```bash
   hugo server  # Not --environment production
   ```

2. **Limit content:**
   Use `draft: true` on articles you're not actively editing

3. **Use fast refresh:**
   Hugo's live reload is very fast - save often!

### Best Practices

- **Commit often:** Git tracks content changes
- **Test locally:** Always preview before deploying
- **Optimize images:** Use appropriate sizes before adding
- **Semantic HTML:** Use proper heading hierarchy
- **SEO keywords:** Follow guidelines in archetype comments
- **Mobile-first:** Test responsive design early

### Useful Commands

```bash
# Show Hugo configuration
hugo config

# List all content
hugo list all

# Count words in drafts
hugo list drafts

# Server with custom port
hugo server --port 8080

# Build and show stats
hugo --environment production --templateMetrics

# Clear cache
rm -rf resources/ public/
```

---

## Resources

### Official Documentation

- **Hugo:** https://gohugo.io/documentation/
- **Bulma CSS:** https://bulma.io/documentation/
- **PostCSS:** https://postcss.org/
- **PurgeCSS:** https://purgecss.com/

### Project-Specific

- **Live Site:** https://article-time.de
- **Repository:** https://github.com/AngelCrawford/blog
- **Issues:** https://github.com/AngelCrawford/blog/issues

### Referenced in README.md

- [Hugo Related Pages Tutorial](https://www.pakstech.com/blog/hugo-related-pages/)
- [Hugo Series Links](http://www.joesacher.com/blog/2017/08/27/converting-series-to-taxonomy/)
- [Dynamic Search in Static Hugo](https://blog.jeremylikness.com/blog/dynamic-search-in-a-static-hugo-website/)
- [Remix Icon](https://remixicon.com)
- [Google Fonts - Montserrat](https://fonts.google.com/specimen/Montserrat)

---

## Contact & Support

**Author:** Angel Crawford
**Default Author:** angel
**Email:** See repository for contact info
**Platform:** Windows (primary development)
**Editor:** Windsurf (current), previously Visual Studio Code
