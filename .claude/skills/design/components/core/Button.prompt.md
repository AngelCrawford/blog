The standard action button — filled gold for the one primary action on a view, outline for everything else.

```jsx
<Button>Speichern</Button>
<Button variant="secondary" as="a" href="/pages/ueber-mich/">
  <Icon name="arrow-right-s-line" variant="plain" size="1em" /> Über mich
</Button>
```

4px radius, 14px label at weight 600, gold fill going to `--color-accent-hover` on hover. Disabled drops to 55% opacity with a not-allowed cursor. For icon-only actions use `RoundButton` instead — that is where the press effect lives.
