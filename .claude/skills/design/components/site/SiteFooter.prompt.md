The full site footer: slogan, four columns (h-card, Most Loved, Statistik, Archiv), footer menu, copyright.

```jsx
<SiteFooter
  slogan={<>Ein Blog. Ein Autor.<br />Und viel Zeit.</>}
  identity={{ name: 'Angel Crawford', photo: '…', note: 'Web Entwickler. Sonnenliebhaber. Goth.', socials: [...], mostLoved: [...] }}
  statsIntro="Momentan befinden sich 17 Einträge auf dieser Seite — davon 2 verwelkt."
  stats={[{ label: 'Artikel', count: 14, icon: 'article-line', color: 'rgb(88,179,189)' }]}
  archiveYears={[{ year: '2026', count: 14 }]}
  menu={[{ label: 'Impressum', href: '/pages/impressum/' }]}
  credits={<>Header SVGs von pixelliebe / shutterstock.com</>}
/>
```

Every column heading is a `LinedTitle` — gold rules to both sides. Statistic and archive rows use a dotted gold leader between label and number. Behind it all, the harbour skyline is reflected upside-down and rippled by an inline SVG turbulence filter over 200 seconds.

The stock header/skyline SVGs are licensed — keep the `credits` attribution in place.
