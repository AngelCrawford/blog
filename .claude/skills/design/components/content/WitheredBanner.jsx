import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* Shown at the top of an article whose growth stage is `withered`. Says plainly
 * that the text is out of date and, where there is one, points at the successor.
 * Dismissible — the visitor has been told, once is enough. */
export function WitheredBanner({ date, reason, replacement, replacementHref, onDismiss, className = '', ...rest }) {
  return (
    <aside
      className={className}
      style={{
        marginBottom: 'var(--spacing-gutter)', padding: 'var(--spacing-4)',
        border: '1px solid color-mix(in srgb, var(--color-warning) 35%, transparent)',
        borderLeft: '4px solid var(--color-warning)', borderRadius: 'var(--radius-sm)',
        background: 'var(--color-surface)', display: 'flex', gap: 'var(--spacing-3)', alignItems: 'flex-start',
      }}
      {...rest}
    >
      <Icon name="skull-2-line" variant="plain" size="1.4rem" color="var(--color-withered)" style={{ marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 'var(--weight-bold)', color: 'var(--color-warning)' }}>Verwelkt</p>
        {date ? <p style={{ margin: '0.35rem 0', color: 'var(--color-ink-muted)', fontSize: 'var(--text-sm)' }}>Zuletzt gepflegt am {date}.</p> : null}
        {reason ? <p style={{ margin: '0.35rem 0' }}>{reason}</p> : null}
        {replacement ? (
          <p style={{ margin: '0.35rem 0 0' }}>
            Aktueller Ersatz: <a href={replacementHref} style={{ fontWeight: 'var(--weight-strong)', textDecoration: 'underline' }}>{replacement}</a>
          </p>
        ) : null}
      </div>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} aria-label="Hinweis schließen"
          style={{ appearance: 'none', border: 0, background: 'transparent', color: 'var(--color-ink-muted)', minWidth: '2.75rem', minHeight: '2.75rem' }}>
          <Icon name="close-fill" variant="plain" size="1.1rem" color="currentColor" />
        </button>
      ) : null}
    </aside>
  );
}
