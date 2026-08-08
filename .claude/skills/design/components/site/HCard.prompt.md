The IndieWeb visiting card — one author, their photo, one line of bio, their rel=me silos. It lives in the footer of every page.

```jsx
<HCard
  name="Angel Crawford"
  photo="assets/images/identity/angel.webp"
  note="Web Entwickler. Sonnenliebhaber. Goth."
  aboutUrl="/pages/ueber-mich/" siteUrl="https://angel-crawford.de/"
  socials={[
    { name: 'Mastodon', href: 'https://norden.social/@…', icon: 'mastodon-fill', color: '#6364FF' },
    { name: 'GitHub', href: 'https://github.com/…', icon: 'github-line', color: '#bbbbbb' },
  ]}
/>
```

**The microformats classes are functional, not decorative.** `h-card`, `p-name`, `u-photo`, `p-note`, `u-url`, `u-uid` and `rel="me"` are what webmention.io, Bridgy and Mastodon verification read — never rename one for styling reasons. Social icons carry their silo's own brand colour; that is the one sanctioned exception to gold-only, and hovering one dims the others to 35%.

Only the footer-flagged silos belong here. The full list belongs on the profile page.
