import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { LinedTitle } from '../core/Heading.jsx';

/* The site-wide representative h-card — the IndieWeb visiting card. Every class
 * name here that starts with p-, u- or h- is a microformats2 property, not a
 * style hook: h-card, p-name, u-photo, p-note, u-url, u-uid, rel="me". They are
 * what webmention.io, Bridgy, Mastodon verification and indiewebify.me read.
 * Renaming one to suit the CSS silently breaks the identity. */
export function HCard({ name, photo, note, socials = [], aboutUrl, siteUrl = '/', label = 'Kontakt', className = '', ...rest }) {
  return (
    <article className={`h-card ${className}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }} {...rest}>
      <LinedTitle className="p-name" style={{ alignSelf: 'stretch' }}>{name}</LinedTitle>
      {photo ? (
        <div style={{ width: 120, height: 120, margin: '0.25rem auto 1rem' }}>
          <a href={aboutUrl || siteUrl} aria-label={`Mehr über ${name}`}>
            <img
              className="u-photo" src={photo} width="120" height="120" alt={name} title={name}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent-muted)', transition: 'border-color var(--duration-slow)' }}
            />
          </a>
        </div>
      ) : null}
      {note ? <p className="p-note" style={{ maxWidth: '18rem', margin: '0 0 1rem', color: 'var(--color-ink-muted)' }}>{note}</p> : null}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5em' }}>
        {socials.map((s) => (
          <a key={s.name} href={s.href} data-tooltip={s.name} aria-label={s.name} target="_blank" rel="noopener me"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1.4em', height: '1.4em', fontSize: '1.4em' }}>
            <Icon name={s.icon} variant="plain" size="1.4em" color={s.color || 'var(--color-accent-hover)'} style={{ opacity: s.opacity }} />
          </a>
        ))}
      </div>
      {aboutUrl ? (
        <div style={{ marginTop: '1rem' }}>
          <a href={aboutUrl} className="gd-button gd-button-secondary" title="Über mich">
            <Icon name="arrow-right-s-line" variant="plain" size="1em" color="currentColor" /> Über mich
          </a>
        </div>
      ) : null}
      {/* Canonical self-link. The avatar and button point at the about page for
          UX, so the identity URL lives here as a non-visual element — still
          parsed by mf2 tools and RelMeAuth. */}
      <a className="u-url u-uid" rel="me" href={siteUrl} hidden>{name}</a>
    </article>
  );
}
