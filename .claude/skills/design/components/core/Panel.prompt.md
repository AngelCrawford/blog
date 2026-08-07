The page-level block that carries a background — use it for prose and controls.

```jsx
<Panel>
  <Heading level={2}>Abschnitt</Heading>
  <p>Fließtext.</p>
</Panel>
<Panel plain>Nur gerahmt, keine neue Tiefenstufe.</Panel>
```

24px padding, 8px radius, gold hairline at 40% and `--shadow-md`. Content that is already made of cards does **not** get one, or you stack two panels and the depth collapses.
