Page navigation under a card feed — a row of round buttons.

```jsx
<Pagination page={2} pages={5} onPage={setPage} />
```

The current page is **held pressed**: inset shadows, no hover, no focus reaction, `cursor: default`. It renders as a `<span>` rather than a disabled `<button>` — the page you are already on is not a destination, so there is no action to disable. That pressed state is the entire active treatment; it needs no colour of its own, because pressed already means "you are here".

Previous and next are real buttons and go `disabled` at the ends (55% opacity, `not-allowed`).
