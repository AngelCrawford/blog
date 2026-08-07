import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* Article metadata, one atom per tile, in a two-column grid. Rubrik, Stadium,
 * Publiziert, Editiert, Tags, Lesedauer, Reaktionen, Herzen. Tags and Herzen
 * span both columns. Every tile has the same shape — icon left, uppercase label,
 * value — so the sidebar scans as a table without being one. */
export function InfoTiles({ children, className = '', ...rest }) {
  return (
    <div
      className={className}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.6rem' }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function InfoTile({ icon, iconColor, label, wide = false, stage, children, className = '', style, ...rest }) {
  return (
    <div
      className={`at-tile ${className}`}
      data-stage={stage}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.8rem',
        gridColumn: wide ? '1 / -1' : undefined, ...style,
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} variant="plain" size="1.6rem" color={iconColor || 'var(--color-ink-muted)'} /> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0, flex: 1 }}>
        <span className="at-tile-label">{label}</span>
        <span className="at-tile-value" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.35em 0.4em' }}>{children}</span>
      </div>
    </div>
  );
}
