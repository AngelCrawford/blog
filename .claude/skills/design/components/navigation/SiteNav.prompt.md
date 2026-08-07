The navigation band that sits directly under `SiteHeader` — and the line where the header's decoration stops and the page begins.

```jsx
<SiteNav
  active="Artikel" logo="assets/images/favicon/favicon-96x96.png"
  items={[
    { label: 'Artikel', href: '/', icon: 'article-line' },
    { label: 'Notizen', href: '/notes/', icon: 'lightbulb-line' },
    { label: 'Rubriken', href: '/rubriken/', icon: 'pushpin-line' },
    { label: 'Tags', href: '/tags/', icon: 'price-tag-3-line' },
  ]}
  follow={[{ name: 'RSS Feed', href: '/index.xml', icon: 'rss-line' }]}
  query={q} onQuery={setQ} results={rows} onNavigate={(it) => route(it.label)}
/>
```

Sits on `--color-surface-sunken`, one level below the page, and closes with the fading gold rule — the same device as `gd-h2`. Sticky, so that separation survives scrolling. The current item is gold with a 2px gold underline fading to the right; nothing else in the bar is coloured.

**Below 768px the links move into a full-viewport drawer**, they do not shrink: heading font at 22px, 44px rows, one fading rule between them, search at the top and the follow icons at the bottom. The drawer is opaque — the system has no backdrop filters over content, and a translucent menu over the dotted page is unreadable. Body scroll locks while it is open. Pass `drawerOpen` to hold it open in a specimen.

The search panel hangs from the **nav's** right edge, not from the field: it is much wider than the field, and anchoring it there put an 800px panel under a 224px input.
