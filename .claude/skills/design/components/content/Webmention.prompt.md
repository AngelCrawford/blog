One incoming IndieWeb reply, like or repost. Always an `<li>` — group them by type under their own heading.

```jsx
<h3 className="gd-h3">Antworten</h3>
<ul style={{ margin: 0, padding: 0 }}>
  <Webmention type="reply" author="@someone@norden.social" authorUrl="https://…"
    avatar="…" content="Genau so." source="https://…" sourceLabel="norden.social" />
</ul>

<h3 className="gd-h3">Likes und Reposts</h3>
<ul style={{ margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
  <Webmention type="like" author="@jemand@chaos.social" source="https://…" />
</ul>
```

**Two shapes, because two things arrive.** A reply has text and gets a box with a coloured left edge and an 18rem minimum width. A like or repost has no text — those render as **chips** meant to wrap into one row, because a full-width row with nothing in it implies there is something to read. The shape follows `content` automatically.

There is deliberately no comment form anywhere in this system — comments were on the 2020 requirements list and were answered with webmentions instead. Empty state: one italic muted line, *"Noch keine Reaktionen."*
