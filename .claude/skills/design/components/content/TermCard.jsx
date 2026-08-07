import React from 'react';

/* The Rubrik / Tag overview tile. Same chrome as the article card, but there is
 * nothing to summarise — a term is a cover, a name and a count. */
export function TermCard({ title, href = '#', cover, coverAlt = '', count, color, unit = 'Artikel', className = '', ...rest }) {
  return (
    <article className={`at-card ${className}`} {...rest}>
      {cover ? (
        <a href={href} title={title}>
          <img className="at-card-cover" src={cover} alt={coverAlt} style={{ height: 230, aspectRatio: 'auto', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', boxShadow: 'none' }} />
        </a>
      ) : null}
      <div style={{ padding: 'var(--spacing-gutter)', textAlign: 'center' }}>
        <h2 className="at-card-title"><a href={href} style={color ? { color } : undefined}>{title}</a></h2>
        <p style={{ margin: '0.2em 0 0', color: 'var(--color-ink-muted)', fontSize: 'var(--text-sm)' }}>{count} {unit}</p>
      </div>
    </article>
  );
}
