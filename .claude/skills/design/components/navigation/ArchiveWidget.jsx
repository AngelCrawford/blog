import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { LinedTitle } from '../core/Heading.jsx';

/* Entries per year, with a dotted leader running between the year and its count.
 * Includes withered entries — the archive is the one place where everything is
 * listed, because that is what an archive is for. */
export function ArchiveWidget({ label = 'Übersicht', years = [], href = '/pages/archiv/', showButton = true, className = '', ...rest }) {
  return (
    <div className={className} {...rest}>
      <LinedTitle>{label}</LinedTitle>
      <ul className="at-widget-list at-leader-list" style={{ marginTop: '0.75em' }}>
        {years.map((y) => (
          <li key={y.year}>
            <span><a href={`${href}#${y.year}`} title={y.year}>{y.year}</a></span>
            <span>{y.count} {y.count === 1 ? 'Eintrag' : 'Einträge'}</span>
          </li>
        ))}
      </ul>
      {showButton ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-4)' }}>
          <a href={href} className="gd-button gd-button-secondary" title="Archiv">
            <Icon name="bookmark-line" variant="plain" size="1em" color="currentColor" /> Archiv
          </a>
        </div>
      ) : null}
    </div>
  );
}
