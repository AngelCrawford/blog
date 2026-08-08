repo: AngelCrawford/blog
branch: neustart
path: themes

## Last sync

date: 2026-08-07T15:54:40Z

### Updated in this project

- Token CSS mirrored from `themes/garden/assets/css/main.css` (colours, type scale, spacing, radii, shadows).
- Montserrat TTFs and the Remixicon SVG sprite copied in; header, favicon, identity and cover images copied in.
- 26 React components rebuilt from the Hugo templates and SCSS; 18 foundation specimen cards written.
- Website UI kit recreating Startseite, Artikel, Rubriken, Tags and Archiv.

## Screen map

| Screen / file | Built from |
|---|---|
| `tokens/*.css`, `css/components.css` | `themes/garden/assets/css/main.css` |
| `guidelines/*.card.html` | `themes/garden/layouts/page/styleguide.html`, `docs/design.md` |
| `components/core/*` | `main.css` (`gd-h1`–`gd-h3`, `gd-button`, `gd-round-button`, `gd-panel`, `gd-icon-duo`), `vars/_helpers.scss` |
| `components/forms/*` | `main.css` (`gd-field`, `gd-check`) |
| `components/content/ArticleCard`, `TermCard`, `Tag` | `layouts/_partials/card.html`, `scss/layout/card.scss`, `scss/elements/ribbon.scss` |
| `components/content/GrowthBadge` | `layouts/_partials/growth-badge.html`, `scss/elements/growth-badge.scss` |
| `components/content/HeartButton` | `scss/elements/engagement.scss`, `layouts/_partials/widgets/heart-button.html` |
| `components/content/InfoTile` | `scss/elements/article-info.scss` |
| `components/content/WitheredBanner` | `scss/elements/withered-banner.scss`, `layouts/_partials/withered-banner.html` |
| `components/content/Webmention` | `scss/elements/webmentions.scss` |
| `components/navigation/SiteNav` | `themes/garden/layouts/_partials/_base/navigation.html` |
| `components/navigation/Pagination` | `scss/elements/pagination.scss` |
| `components/navigation/TocSidebar` (toc, series, related) | `scss/elements/{toc,series,related}-sidebar.scss` |
| `components/navigation/ArchiveWidget` | `layouts/_partials/widgets/archive.html`, `scss/base/footer.scss` |
| `components/site/SiteHeader` | `layouts/_partials/_base/hero.html`, `scss/base/hero.scss`, `assets/js/header.js` |
| `components/site/SiteFooter`, `HCard` | `layouts/_partials/_base/footer.html`, `scss/base/footer.scss`, `config/_default/params.yaml` |
| `ui_kits/website/*` | `layouts/home.html`, `layouts/single.html`, `layouts/list.html`, `layouts/page/archive.html` |
