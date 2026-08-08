import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* The only engagement control on the site — no comments, no reactions bar.
 * Articles show it read-only on cards (the action lives on the article page);
 * notes have no detail page, so their card heart is interactive. */
export function HeartButton({ count = 0, hearted = false, readonly = false, flat = false, hint, onHeart, className = '', ...rest }) {
  const heart = (
    <>
      <Icon name={hearted ? 'heart-fill' : 'heart-line'} variant="plain" size="1.1em" color="currentColor" />
      <span className="at-heart-count">{count}</span>
    </>
  );

  if (readonly) {
    return (
      <span className={`at-heart at-heart-flat ${className}`} title={`${count} Herzen`} {...rest}>{heart}</span>
    );
  }

  return (
    /* The hint stacks UNDER the pill, not beside it. Beside it, in a third of a
     * 533px column, "einmal pro Besuch" broke into three lines and pushed the box
     * footer to 81px — the hint is an aside, so it takes the space an aside gets. */
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.35em' }}>
      <button
        type="button"
        className={`at-heart${flat ? ' at-heart-flat' : ''}${hearted ? ' is-hearted' : ''} ${className}`}
        aria-pressed={hearted}
        disabled={hearted}
        onClick={onHeart}
        title={hearted ? 'Danke!' : 'Gefällt mir'}
        {...rest}
      >
        {heart}
      </button>
      {hint ? (
        <span style={{ fontSize: '0.7rem', lineHeight: 1.2, fontStyle: 'italic', whiteSpace: 'nowrap', color: 'var(--color-ink-muted)' }}>{hint}</span>
      ) : null}
    </span>
  );
}
