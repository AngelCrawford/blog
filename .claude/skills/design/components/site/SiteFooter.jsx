import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { LinedTitle } from '../core/Heading.jsx';
import { HCard } from './HCard.jsx';
import { ArchiveWidget } from '../navigation/ArchiveWidget.jsx';

/* The footer, and the one part of the old design that was really successful:
 * gold rules over each column heading, four columns, the h-card, and the harbour
 * skyline reflected upside-down in a rippling sea below it.
 *
 * The turbulence filter is an inline <svg> because a CSS filter cannot do
 * feDisplacementMap; the animate element drives it over 200 seconds so the water
 * moves without anyone noticing it move. */
export function SiteFooter({
  slogan, identity = {}, stats = [], statsIntro, archiveYears = [], menu = [], copyright,
  version = 'dev', credits, className = '', ...rest
}) {
  /* mostLoved is the footer's own second column, not an h-card property. Spreading
   * the whole identity object into HCard put it through to the DOM as a stray
   * `mostloved` attribute on the one element in the system whose attributes are
   * machine-parsed — webmention.io, Bridgy and indiewebify.me all read this card. */
  const { mostLoved = [], ...hcard } = identity;

  return (
    <footer
      className={className}
      style={{ position: 'relative', overflow: 'hidden', margin: 0, padding: '0 0 2em', background: 'hsl(190 11% 6%)', boxShadow: 'inset 10px 10px 15px rgb(0 0 0 / 0.3), inset -10px -10px 15px hsl(190 20% 90% / 0.1)' }}
      {...rest}
    >
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <filter id="at-turbulence" x="0" y="0" width="100%" height="100%">
          <feTurbulence id="at-sea-filter" numOctaves="2" seed="2" baseFrequency="0.02 0.05" />
          <feDisplacementMap in2="" scale="20" in="SourceGraphic" />
          <animate href="#at-sea-filter" attributeName="baseFrequency" dur="200s" keyTimes="0;0.8;1"
            values="0.02 0.06;0.04 0.08;0.02 0.06" repeatCount="indefinite" />
        </filter>
      </svg>
      <div className="at-footer-sea" style={{ position: 'absolute', inset: '0 0 auto 0', height: 300, zIndex: 1, pointerEvents: 'none' }} aria-hidden="true" />

      <div style={{ position: 'relative', zIndex: 5, padding: '3em' }}>
        {slogan ? (
          <p className="at-quoted" style={{
            width: 'fit-content', margin: '0 auto var(--spacing-section)', padding: '0.3em',
            textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 'var(--weight-strong)',
            fontSize: 'var(--text-2xl)', lineHeight: 1.5, color: 'var(--color-ink-muted)',
            textShadow: '3px 3px 4px rgb(0 0 0 / 0.5)',
            background: 'linear-gradient(270deg, transparent 0%, rgb(0 0 0 / 0.3) 50%, transparent 100%)',
          }}>{slogan}</p>
        ) : null}

        <div style={{ display: 'grid', gap: 'var(--spacing-section) var(--spacing-gutter)', gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))', color: 'var(--color-ink-muted)' }}>
          <HCard {...hcard} />

          <div>
            <LinedTitle>Most Loved</LinedTitle>
            <ul className="at-widget-list at-rows" style={{ marginTop: '0.75em' }}>
              {mostLoved.map((it, i) => (
                <li key={`${it.label}-${i}`}>
                  <a href={it.href}>{it.label}</a>
                  <span className="at-rows-aside"><Icon name="heart-fill" variant="plain" size="0.9em" color="hsl(0 70% 65%)" style={{ display: 'inline-block', verticalAlign: '-0.1em', marginRight: 3 }} />{it.hearts}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <LinedTitle>Statistik</LinedTitle>
            {statsIntro ? <p style={{ margin: '0.75em 0 0' }}>{statsIntro}</p> : null}
            <ul className="at-widget-list at-leader-list" style={{ marginTop: '0.75em' }}>
              {stats.map((s) => (
                <li key={s.label}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon name={s.icon} variant="plain" size="20px" color={s.color} />{s.label}
                  </span>
                  <span>{s.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <ArchiveWidget years={archiveYears} />
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}>
        <ul style={{ listStyle: 'none', margin: '0 0 0.5em', padding: 0 }}>
          {menu.map((m, i) => (
            <li key={m.label} style={{ display: 'inline-block', lineHeight: '1.5em' }}>
              {i > 0 ? <span style={{ color: 'var(--color-accent-muted)', padding: '0 0.2em' }}>|</span> : null}
              <a href={m.href} title={m.label}>{m.label}</a>
            </li>
          ))}
        </ul>
        <div style={{ fontSize: '90%', opacity: 0.7, color: 'var(--color-ink-muted)' }}>
          © 2020 – {new Date().getFullYear()} {hcard.name} | <abbr title="Build">{version}</abbr>
          {copyright ? <> | <span>{copyright}</span></> : null}
          {credits ? <p style={{ margin: '0.5em 0 0' }}>{credits}</p> : null}
        </div>
      </div>
    </footer>
  );
}
