Icon-only circular control with the shadow-inversion press effect — back-to-top, pagination, "weiterlesen" on a card.

```jsx
<RoundButton icon="arrow-up-s-fill" label="Nach oben" />
<RoundButton icon="arrow-up-s-fill" size="lg" label="Nach oben" />
<RoundButton icon="heart-line" fullGlyph label="Herz" />
```

Raised at rest, pressed on hover and keyboard focus (both shadows flip to inset, 2px of downward travel). With `prefers-reduced-motion` the travel is dropped and the shadow inversion stays — it is the feedback, not decoration. `fullGlyph` exists because Remixicon's `-s-` arrows draw a compact shape inside their viewBox while `heart-line` nearly fills it; without it the heart dwarfs the arrows in the same-size button.
