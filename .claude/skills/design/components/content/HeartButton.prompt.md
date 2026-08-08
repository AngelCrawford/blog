The site's only engagement control — a heart with a count. There are no comments; replies arrive as IndieWeb webmentions instead.

```jsx
<HeartButton count={12} onHeart={fn} hint="einmal pro Besuch" />
<HeartButton count={12} readonly />          {/* article cards */}
<HeartButton count={3} flat hearted />        {/* note card footer */}
```

Pill at rest in gold, red once hearted and then disabled. `readonly` renders a plain span, not a button — use it on article cards so the only real action sits on the article page.
