Checkbox and radio — same component, `type` picks which.

```jsx
<Check label="Verwelkte Einträge anzeigen" defaultChecked />
<Check type="radio" name="stadium" label="Keimling" />
```

18.4px box, gold border, filled gold when checked. The checkmark is drawn with `clip-path` in the sunken colour — no icon font involved; the radio uses the same mechanism with a circle.
