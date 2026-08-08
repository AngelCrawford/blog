# Article Time — Website UI Kit

A click-through recreation of the one product this design system serves: **articletime**, a statically generated Hugo blog (`AngelCrawford/blog`, branch `neustart`). German throughout.

## Screens

| Screen | File | Built from |
|---|---|---|
| Startseite — card feed, withered filter, pagination | `HomeScreen.jsx` | `themes/article-time/layouts/home.html`, `_partials/card.html`, `layout/card.scss` |
| Artikel — prose panel, info tiles, TOC / Serie / Ähnliches, webmentions | `ArticleScreen.jsx` | `layouts/single.html`, `elements/article-info.scss`, `elements/{toc,series,related}-sidebar.scss`, `elements/webmentions.scss` |
| Rubriken and Tags overviews | `TermsScreen.jsx` | `layouts/list.html`, the term branch of `_partials/card.html` |
| Archiv | `TermsScreen.jsx` | `layouts/page/archive.html`, `_partials/widgets/archive.html` |
| Shell — header, navigation with live search, footer | `App.jsx` | `_base/hero.html`, `themes/garden/.../navigation.html`, `_base/footer.html` |

`data.jsx` holds the fake content. Titles, Rubriken and tags follow the real repository, which is a blog documenting its own rebuild.

## What is interactive

- Menu switches screens; the active item goes gold with `aria-current`.
- Search filters entries live and drops a result panel off the navigation's right edge.
- Clicking a card or a search hit opens the article page.
- The heart increments once and then locks; the withered banner dismisses.
- "Verwelkte Einträge anzeigen" filters the feed and reports how many are hidden.
- Pagination marks the current page as a permanently pressed round button.

## What is deliberately absent

Notes have no detail page (the note *is* the content), and there is no comment form — replies arrive as IndieWeb webmentions. The maintenance page, cookie banner, profile page and YouTube shortcode exist upstream but are not recreated here; nothing was invented to fill a gap.
