import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { RoundButton } from '../core/RoundButton.jsx';

/* The navigation band, and the page's top edge.
 *
 * It has one job beyond navigating: to separate. The header above it is the most
 * decorated thing on the site — sky, silhouette, clock, gold wordmark — and this
 * strip is where that stops. So it sits on the sunken surface, one level below the
 * page, and closes with the same fading gold rule the section headings use.
 *
 * Below 768px the links move into a full-viewport drawer rather than shrinking. A
 * menu on a phone is a place you go, not a strip you squint at: heading font,
 * 44px rows, one fading rule between them, search at the top, follow links at the
 * bottom. */
export function SiteNav({
  items = [], follow = [], active, brand = 'Artikel', logo,
  query = '', results = null, onQuery, onNavigate,
  drawerOpen, onDrawerToggle, className = '', ...rest
}) {
  const [innerOpen, setInnerOpen] = React.useState(false);
  const open = drawerOpen != null ? drawerOpen : innerOpen;
  const setOpen = (v) => (onDrawerToggle ? onDrawerToggle(v) : setInnerOpen(v));
  const [panel, setPanel] = React.useState(false);

  /* Body scroll is locked while the drawer covers the page — otherwise the page
   * behind keeps scrolling under the fingers and the drawer feels detached. */
  React.useEffect(() => {
    if (drawerOpen != null) return;
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open, drawerOpen]);

  const go = (item) => (e) => {
    if (!onNavigate) return;
    e.preventDefault();
    onNavigate(item);
    setOpen(false);
  };

  const searchField = (
    <div className="at-nav-search">
      <label htmlFor="at-searchbox" className="at-sr-only">Suchen</label>
      <input
        id="at-searchbox" type="search" placeholder="Suchen…" aria-label="Suchen"
        value={query}
        onChange={(e) => { if (onQuery) onQuery(e.target.value); setPanel(Boolean(e.target.value)); }}
      />
      <span className="at-nav-search-icon">
        <Icon name={query ? 'close-fill' : 'search-line'} variant="plain" size="1rem" color="currentColor" />
      </span>
    </div>
  );

  return (
    <>
      <nav className={`at-nav ${className}`} aria-label="Hauptnavigation" {...rest}>
        {/* Mark only when there is a logo: the wordmark in the header directly above
         * already names the site, and repeating "Artikel" next to the menu item of
         * the same name reads as a duplicate rather than as a home link. */}
        <a className="at-nav-brand" href="/" title={brand} aria-label={brand}>
          {logo ? <img src={logo} width="26" height="26" alt="" /> : brand}
        </a>

        <div className="at-nav-links">
          {items.map((it) => (
            <a
              key={it.label} className="at-nav-link" href={it.href} title={it.label}
              aria-current={it.label === active ? 'page' : undefined}
              onClick={go(it)}
            >
              {it.icon ? <Icon name={it.icon} variant="plain" size="1.125rem" color="currentColor" /> : null}
              {it.label}
            </a>
          ))}
        </div>

        <div className="at-nav-right">
          <span className="at-nav-follow" style={{ display: 'flex' }}>
            {follow.map((f) => (
              <a key={f.name} className="at-nav-icon" href={f.href} title={f.name} target="_blank" rel="noreferrer">
                <Icon name={f.icon} variant="plain" size="1.125rem" color="currentColor" />
              </a>
            ))}
          </span>
          {searchField}
          <button
            type="button" className="at-nav-icon at-nav-burger"
            aria-label="Menü öffnen" aria-expanded={open} onClick={() => setOpen(true)}
          >
            <Icon name="links-line" variant="plain" size="1.375rem" color="currentColor" />
          </button>
        </div>

        {results && panel && query ? (
          <div className="at-nav-results"><div>{results}</div></div>
        ) : null}
      </nav>

      {open ? (
        <div className="at-drawer" role="dialog" aria-modal="true" aria-label="Menü">
          <div className="at-drawer-head">
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--weight-strong)', color: 'var(--color-ink-muted)' }}>{brand}</span>
            <RoundButton icon="close-fill" fullGlyph label="Menü schließen" onClick={() => setOpen(false)} />
          </div>
          {searchField}
          <div className="at-drawer-links">
            {items.map((it) => (
              <a
                key={it.label} className="at-drawer-link" href={it.href}
                aria-current={it.label === active ? 'page' : undefined}
                onClick={go(it)}
              >
                <Icon name={it.icon || 'article-line'} size="1.5rem" />
                {it.label}
              </a>
            ))}
          </div>
          <div className="at-drawer-follow">
            {follow.map((f) => (
              <a key={f.name} className="at-nav-icon" href={f.href} title={f.name} target="_blank" rel="noreferrer">
                <Icon name={f.icon} size="1.375rem" />
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
