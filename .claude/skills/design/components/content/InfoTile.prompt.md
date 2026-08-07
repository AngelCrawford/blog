The metadata sidebar on an article page — one tile per fact, two columns.

```jsx
<InfoTiles>
  <InfoTile icon="pushpin-line" label="Rubrik"><Tag href="/rubriken/allgemein/">Allgemein</Tag></InfoTile>
  <InfoTile icon="tree-line" iconColor="var(--color-evergreen)" label="Stadium" stage="evergreen">
    <GrowthBadge stage="evergreen" showLabel tinted={false} />
  </InfoTile>
  <InfoTile icon="calendar-line" label="Publiziert"><time>06.08.26</time></InfoTile>
  <InfoTile icon="price-tag-3-line" label="Tags" wide>
    <Hashtag href="/tags/hugo/">hugo</Hashtag>
  </InfoTile>
</InfoTiles>
```

Tile chrome is the shared `--surface-tile` + gold hairline + 7.2px radius used by every sidebar widget. Values are gold, labels uppercase muted grey with 0.08em tracking. `wide` spans both columns — Tags and Herzen do, everything else is a half.
