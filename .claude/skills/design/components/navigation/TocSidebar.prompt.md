The three article-page sidebar widgets. They share one shape — tile chrome, uppercase label with a rule under it, then a list — so they live in one file.

```jsx
<TocSidebar items={[{ label: 'Warum Hugo', href: '#warum-hugo', children: [...] }]} current="#warum-hugo" />
<SeriesSidebar title="Der Neustart" href="/serien/neustart/" current="/articles/teil-2/"
  items={[{ label: 'Die Diagnose', href: '/articles/teil-1/' }, { label: 'Teil 2', href: '/articles/teil-2/' }]} />
<RelatedSidebar items={[{ label: 'Warum Hugo', href: '/articles/warum-hugo/', date: '06.08.26' }]} />
```

`SeriesSidebar` numbers its parts with a leading-zero CSS counter (01, 02, …) over a continuous vertical rail; the part you are reading is highlighted and is a span, not a link. Withered parts keep their number and fade to 50% with a small grey skull rather than being dropped — the sequence has to stay intact.
