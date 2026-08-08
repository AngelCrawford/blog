import React from 'react';
import { RoundButton } from '../core/RoundButton.jsx';

/* Round buttons in a row. The current page is held pressed — the same shadow
 * inversion the buttons use as feedback, frozen. That is the whole active state:
 * pressed already means "you are here", so it needs no colour of its own.
 *
 * It is rendered as a SPAN, not a disabled button. There is no action to disable:
 * the page you are on is not a destination, and a control that highlights on hover
 * and then does nothing is worse than one that plainly cannot be pressed. */
export function Pagination({ page = 1, pages = 1, onPage, className = '', ...rest }) {
  const go = (p) => () => onPage && onPage(p);
  const nums = Array.from({ length: pages }, (_, i) => i + 1);
  const label = { fontFamily: 'var(--font-heading)', fontWeight: 'var(--weight-strong)' };

  return (
    <nav
      className={className} aria-label="Seitennavigation"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-gutter) 0' }}
      {...rest}
    >
      <RoundButton icon="arrow-left-s-line" label="Vorherige Seite" disabled={page === 1} onClick={go(page - 1)} />
      {nums.map((n) => (n === page ? (
        <span
          key={n} className="gd-round-button gd-round-button-pressed"
          aria-current="page" aria-label={`Seite ${n}, aktuelle Seite`} style={label}
        >
          {n}
        </span>
      ) : (
        <button key={n} type="button" className="gd-round-button" onClick={go(n)} aria-label={`Seite ${n}`} style={label}>
          {n}
        </button>
      )))}
      <RoundButton icon="arrow-right-s-line" label="Nächste Seite" disabled={page === pages} onClick={go(pages === page ? page : page + 1)} />
    </nav>
  );
}
