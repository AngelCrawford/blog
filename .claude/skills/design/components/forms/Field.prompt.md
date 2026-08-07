Text input, textarea and select — one component, because they share the whole treatment.

```jsx
<Field label="Textfeld" placeholder="Klick hinein — der Cursor ist golden" />
<Field as="textarea" rows={3} label="Mehrzeilig" />
<Field as="select" label="Stadium"><option>Keimling</option><option>Verwelkt</option></Field>
```

Sunken fill, gold border, and focus is a **ring** rather than a colour change so it stays visible in any state; `caret-color` picks up the accent so even the text cursor belongs to the palette. `required` validates on blur via `:user-invalid` — the border goes red only after the user has left the field, never while they are still typing.
