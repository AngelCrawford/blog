The site header — and the single most recognisable thing about Article Time.

```jsx
<SiteHeader title="Article Time" />
<SiteHeader sky="night" />   {/* pin a state for a specimen */}
```

Four layers, back to front: the sky gradient (changes with the visitor's time of day — night, dawn, day, dusk); stars at night and dusk, the hot-air balloon by day and dusk; the harbour silhouette repeating along the bottom in `sepia(0.4)`; the clock face rising once on load; the wordmark in gold gradient with a shimmer that sweeps across on hover.

Nothing else on the site is allowed to be this decorated. Do not add a second decorated band, and do not put a heading directly under it — the page's `gd-h1` follows in the content column.
