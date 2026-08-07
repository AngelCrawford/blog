The three heading levels, plus the centred rule-flanked title used in the footer.

```jsx
<Heading level={1}>Wie ein Blog überlebt</Heading>
<Heading level={2}>Der erste Abschnitt</Heading>
<Heading level={3}>Ein Unterpunkt</Heading>
<LinedTitle>Statistik</LinedTitle>
```

`level={1}` carries the site's signature gold gradient and only ever appears once on a page — pass it a plain string, not nested markup, because the gradient layers read the text from `data-heading`. `level={2}` owns its own bottom margin: that rhythm is a system decision, not a per-call one.
