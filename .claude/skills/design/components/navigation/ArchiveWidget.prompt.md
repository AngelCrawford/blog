Entries per year, for the footer and the archive page.

```jsx
<ArchiveWidget years={[{ year: '2026', count: 14 }, { year: '2020', count: 3 }]} />
```

Year left, count right, with a dotted gold leader drawn between them by a repeating radial gradient — the same leader the footer statistics rows use. Unlike every other count on the site, this one **includes** withered entries: an archive that hides things is not an archive. Pass `showButton={false}` on the archive page itself.
