import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* Four sidebar widgets, one shape. Tile chrome, an uppercase label with a rule
 * under it, then a list. Only the list differs — which is why they share a file
 * and a stylesheet section instead of being four near-copies. */

function Widget({ label, aside, children, className = '', ...rest }) {
  return (
    <aside className={`at-tile at-widget ${className}`} {...rest}>
      <div className="at-widget-head">
        <span className="at-tile-label">{label}</span>
        {aside ? <span className="at-widget-count">{aside}</span> : null}
      </div>
      {children}
    </aside>
  );
}

/* Table of contents. Em-dash bullets; nested levels indent and gain a rail. */
export function TocSidebar({ label = 'Inhalt', items = [], current, className = '', ...rest }) {
  const render = (list) => (
    <ul className="at-widget-list at-toc-list">
      {list.map((it, i) => (
        <li key={`${it.label}-${i}`} className={it.href === current ? 'is-current' : undefined}>
          <a href={it.href}>{it.label}</a>
          {it.children && it.children.length ? render(it.children) : null}
        </li>
      ))}
    </ul>
  );
  return <Widget label={label} className={className} {...rest}>{render(items)}</Widget>;
}

/* Series. Leading-zero counters in a column with a continuous rail behind them.
 * Withered parts keep their number and fade rather than disappear. */
export function SeriesSidebar({ label = 'Serie', title, href, items = [], current, className = '', ...rest }) {
  return (
    <Widget label={label} aside={`${items.length} Teile`} className={className} {...rest}>
      {title ? (
        <a href={href} style={{ display: 'block', padding: '0.35rem 0.7rem 0.5rem', marginBottom: '0.35rem', fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 'var(--weight-strong)', lineHeight: 1.35, color: 'var(--color-accent-hover)' }}>{title}</a>
      ) : null}
      <ol className="at-widget-list at-series-list">
        {items.map((it, i) => {
          const isCurrent = it.href === current;
          return (
            <li key={`${it.label}-${i}`} className={`${isCurrent ? 'is-current' : ''}${it.withered ? ' is-withered' : ''}`}>
              {isCurrent ? <span>{it.label}</span> : (
                <a href={it.href}>
                  {it.withered ? <Icon name="skull-2-line" variant="plain" size="0.85em" color="var(--color-withered)" style={{ display: 'inline-block', verticalAlign: '-0.1em', marginRight: '0.2em' }} /> : null}
                  {it.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </Widget>
  );
}

/* Ähnliche Artikel. Title left, date right, dashed divider between rows. */
export function RelatedSidebar({ label = 'Ähnliche Artikel', items = [], className = '', ...rest }) {
  return (
    <Widget label={label} className={className} {...rest}>
      <ul className="at-widget-list at-rows">
        {items.map((it, i) => (
          <li key={`${it.label}-${i}`}>
            <a href={it.href}>{it.label}</a>
            <span className="at-rows-aside">{it.date}</span>
          </li>
        ))}
      </ul>
    </Widget>
  );
}
