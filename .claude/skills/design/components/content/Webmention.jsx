import React from 'react';

/* IndieWeb replies. There is no comment system on this site — a reply is a post on
 * someone else's site that webmention.io forwards here.
 *
 * TWO SHAPES, because two things arrive. A reply has text and gets a box: left
 * edge in the type colour, author, the text, the source. A like or a repost has NO
 * text at all, and giving each one its own full-width row implies there is
 * something to read in it — three near-empty strips down the page was exactly how
 * that looked. Those render as chips instead, meant to sit together in one wrapped
 * row. `compact` is inferred from the absence of content; pass it explicitly to
 * force either shape. */
const EDGE = {
  like: 'var(--color-accent)',
  repost: 'var(--color-accent-hover)',
  mention: 'var(--color-accent-muted)',
  reply: 'var(--color-accent-muted)',
};

export function Webmention({ author, authorUrl, avatar, content, source, sourceLabel, type = 'mention', compact, className = '', ...rest }) {
  const isCompact = compact != null ? compact : !content;
  const edge = EDGE[type] || EDGE.mention;

  const face = avatar
    ? <img src={avatar} alt="" width={isCompact ? 24 : 40} height={isCompact ? 24 : 40} style={{ borderRadius: '50%', objectFit: 'cover', flex: '0 0 auto' }} />
    : null;

  if (isCompact) {
    return (
      <li className={className} data-wm-type={type} style={{ listStyle: 'none', display: 'inline-flex' }} {...rest}>
        <a
          href={source} title={`${author} · ${sourceLabel || source}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5em', minHeight: '2.25rem',
            padding: avatar ? '0.25rem 0.75rem 0.25rem 0.35rem' : '0.4rem 0.75rem',
            border: `1px solid color-mix(in srgb, ${edge} 55%, transparent)`,
            borderRadius: 'var(--radius-pill)', background: 'hsl(190 11% 9%)',
            color: 'var(--color-accent-hover)', fontSize: 'var(--text-sm)', textDecoration: 'none', whiteSpace: 'nowrap',
          }}
        >
          {face}{author}
        </a>
      </li>
    );
  }

  return (
    <li
      className={className} data-wm-type={type}
      style={{
        listStyle: 'none', marginBottom: 'var(--spacing-3)', padding: '0.9rem 1.1rem',
        minWidth: '18rem',
        borderLeft: `3px solid ${edge}`, borderRadius: '0 var(--radius-md) var(--radius-md) 0',
        background: 'hsl(190 11% 9%)',
      }}
      {...rest}
    >
      <a
        href={authorUrl}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', fontWeight: 'var(--weight-strong)', color: 'var(--color-accent-hover)', textDecoration: 'none' }}
      >
        {face}{author}
      </a>
      <p style={{ margin: '0.6rem 0 0.5rem', overflowWrap: 'anywhere', color: 'var(--color-ink)' }}>{content}</p>
      <a href={source} style={{ display: 'inline-block', fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)', textDecoration: 'none' }}>
        {sourceLabel || source}
      </a>
    </li>
  );
}
