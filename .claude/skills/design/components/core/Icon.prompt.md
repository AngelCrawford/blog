Renders one Remixicon glyph from the self-hosted SVG sprite — use it for every icon; the brand has no second icon set and no emoji.

```jsx
<Icon name="calendar-line" />
<Icon name="seedling-line" color="var(--color-seedling)" size="1.5em" />
<Icon name="arrow-up-s-fill" variant="plain" />
```

Variants: `duo` (default — filled body behind in muted gold, line in front in accent gold, offset 0.03em/0.055em); `line` for glyphs the sprite has no `-fill` partner for (same offset via `drop-shadow`); `plain` inside round buttons and other places that colour the glyph themselves.

Set `window.AT_SPRITE` to the sprite's path relative to the page before mounting.
