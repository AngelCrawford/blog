The four labels the magazine structure needs. They are not interchangeable.

```jsx
<Badge href="/rubriken/allgemein/" dot="#4e97b3">Allgemein</Badge>  {/* the Rubrik, above the title */}
<Tag href="/rubriken/movie/">Movie</Tag>                            {/* the Rubrik, in a sidebar tile */}
<Hashtag href="/tags/hugo/">hugo</Hashtag>                          {/* free tags, many per entry */}
<Ribbon href="/rubriken/allgemein/">Allgemein</Ribbon>              {/* the Rubrik, ON an image */}
```

`Badge` is the default place a **Rubrik** appears: a neutral surface-and-hairline pill with a coloured dot. That is how per-category colour comes back without spending the palette on it — the ribbon put a saturated fill across the top of the photograph and competed with both the picture and the gold; a 0.5em dot tells Rubriken apart and fights nothing. Set the dot with `dot`; it falls back to accent gold.

`Ribbon` survives for the one case a badge cannot do: a label that has to sit **on** an image, as on the note card. It is absolutely positioned, so its parent needs `position: relative` (`.at-card` already has it).

`Hashtag` = a free tag, several per entry, and the `#` is added by the component.
