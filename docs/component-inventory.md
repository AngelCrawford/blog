# Component Inventory - Article Time Blog

**Generated:** 2025-11-12
**Project:** Article Time (Hugo Static Site)
**Scan Level:** Exhaustive

---

## Overview

This document catalogs all reusable components, layouts, and templates in the Article Time Hugo blog project.

## Layout Templates

### Core Layouts (6)

| Template | Purpose | Type |
|----------|---------|------|
| `baseof.html` | Base template for all pages | Base Layout |
| `home.html` | Homepage layout | Page Layout |
| `list.html` | List/archive pages (categories, tags, etc.) | List Layout |
| `single.html` | Individual article/content pages | Single Layout |
| `404.html` | Error page | Error Layout |
| `page/archive.html` | Archive page layout | Custom Page |

### Render Hooks (3)

| Hook | Purpose |
|------|---------|
| `_markup/render-image.html` | Custom image rendering with WebP support |
| `_markup/render-link.html` | Custom link rendering |
| `_markup/render-heading.html` | Custom heading rendering with anchor links |

## Partials

### Base Partials (`_partials/_base/`) - 5 Components

| Component | Purpose | Dependencies |
|-----------|---------|--------------|
| `head.html` | HTML head, meta tags, SEO | params.yaml, seo.html |
| `seo.html` | SEO meta tags and structured data | Hugo SEO variables |
| `navigation.html` | Main navigation bar | navbar.js |
| `hero.html` | Hero section for pages | header.js, suncalc.js |
| `footer.html` | Site footer | - |

### Widget Partials (`_partials/widgets/`) - 3 Components

| Widget | Purpose | Type |
|--------|---------|------|
| `pagination.html` | Page navigation | List Widget |
| `series.html` | Series navigation for articles | Content Widget |
| `archive.html` | Archive listings | Content Widget |

### Other Partials - 1 Component

| Component | Purpose |
|-----------|---------|
| `card.html` | Article card for list views |

## Shortcodes

Custom content shortcodes for enhanced article formatting:

| Shortcode | Purpose | Parameters | Example |
|-----------|---------|------------|---------|
| `message.html` | Colored message boxes | color, header | `{{< message color="info" header="Note" >}}...{{< /message >}}` |
| `tags.html` | Visual tag display | tags (formatted string) | `{{< tags tags="tag: Action" >}}` |
| `rating.html` | Star rating display | value, showValue | `{{< rating value="4.5" showValue="true" >}}` |
| `youtube.html` | YouTube video embed | id | `{{< youtube id="VIDEO_ID" >}}` |

## JavaScript Components

### Core Scripts (7 files)

| Script | Purpose | Dependencies | State Management |
|--------|---------|--------------|------------------|
| `main.js` | Back-to-top button, footer reveal | jQuery | DOM manipulation |
| `search.js` | Client-side search functionality | jQuery, /index.json | Search state, results rendering |
| `header.js` | Dynamic header with time-of-day styling | jQuery, suncalc.js | Time-based theme switching |
| `navbar.js` | Mobile navigation toggle | jQuery | Menu open/closed state |
| `gdpr.js` | Cookie consent management | jQuery | Consent state (localStorage) |
| `firework.js` | Special effects (seasonal) | - | Animation state |
| `jquery.js` | jQuery library (vendored) | - | - |
| `suncalc.js` | Sunrise/sunset calculations | - | - |

## SCSS Structure

### Component Styles (92 SCSS files)

**Base Styles** (`assets/scss/base/`):
- `footer.scss` - Footer styling
- `hero.scss` - Hero section
- `navigation.scss` - Navigation bar

**Layout Styles** (`assets/scss/layout/`):
- `card.scss` - Article cards
- `lists.scss` - List layouts
- `single.scss` - Single article layout
- `widgets.scss` - Widget components

**Bulma Framework** (`assets/scss/src/bulma/`):
- Complete Bulma CSS framework v1.0.4
- Customized configuration
- PurgeCSS optimization for production

## Component Hierarchy

```
baseof.html (Base)
├── head.html
│   └── seo.html
├── navigation.html
├── hero.html
└── footer.html

home.html / list.html / single.html (Extends baseof)
├── card.html (in list views)
└── widgets/
    ├── pagination.html
    ├── series.html
    └── archive.html
```

## Design System

### Typography
- **Primary Font:** Montserrat (Google Fonts)
- **Alt Font:** Montserrat Alternates

### Icons
- **Icon Library:** Remix Icon
- **Version:** Cached at build time
- **Usage:** SVG sprite system

### CSS Framework
- **Framework:** Bulma v1.0.4
- **Optimization:** PurgeCSS in production
- **Customization:** Custom SCSS layers

## Reusability Analysis

### Highly Reusable Components
- Shortcodes (message, rating, tags, youtube)
- Card component (used in all list views)
- Base partials (head, footer, navigation)
- Widget partials

### Page-Specific Components
- Archive page layout
- Hero section (homepage only)

### State Management Patterns
- **Client-side search:** In-memory search index loaded from /index.json
- **GDPR consent:** localStorage persistence
- **Time-based theming:** SunCalc + dynamic CSS classes
- **Navigation state:** jQuery-based toggle

## Notes

- All components use Hugo's templating syntax (Go templates)
- JavaScript heavily relies on jQuery (consideration for modernization noted in todo.md)
- Responsive design built into Bulma framework
- WebP image format conversion handled by Hugo render hooks
- Bilingual support (German/English) integrated into templates
