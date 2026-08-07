The card the whole site is built out of — home feed, Rubrik pages, tag pages, archive.

```jsx
<ArticleCard
  title="Warum Hugo" href="/articles/warum-hugo/" date="06.08.26"
  rubrik="Allgemein" rubrikHref="/rubriken/allgemein/"
  cover="assets/images/covers/rubriken-cover.jpg"
  summary="Fünfzehn Kriterien, vier Kandidaten…"
  tags={['hugo', 'static-site']} readingTime={7} growthStage="evergreen" hearts={12}
/>
<ArticleCard format="note" summary="Ein Gedanke, der keinen Artikel braucht." date="04.08.26" hearts={3} />
```

Cover images sit in `sepia(1)` and release to full colour on hover — that is the house treatment for imagery, not an effect to pick per card. The excerpt is clipped by a fade in the card's own fill, never by an ellipsis. `featured` is the `weight: 1` entry: same card, stronger gold border. `badge` hangs a rotated flag across the top-right corner — `{ icon: 'sparkling-line', label: 'Neu' }` or `{ icon: 'check-fill', label: 'Gesehen' }`; the glyph comes from the sprite like every other icon.

`format="note"` is a genuinely different shape: no title, no read-more, 400px minimum height, the text set at 30px in Montserrat Alternates between remixicon quote marks, and the heart is interactive because a note has no page of its own.
