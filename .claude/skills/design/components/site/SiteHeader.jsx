import React from 'react';

/* The header. A 300px band of sky whose gradient follows the visitor's own time
 * of day, the Hamburg/Kiel harbour silhouette repeating along the bottom in
 * sepia, the clock face rising into place once, and the wordmark in gold
 * gradient on top. Night and dusk get stars; day and dusk get the balloon.
 *
 * Upstream the boundaries come from SunriseSunsetJS at the site's coordinates,
 * recalculated hourly. `skyForHour` is the same four-state ladder against local
 * clock hours — close enough for a mock, and `sky` overrides it outright. */
export function skyForHour(h = new Date().getHours()) {
  if (h >= 22 || h < 5) return 'night';
  if (h < 8) return 'dawn';
  if (h < 19) return 'day';
  return 'dusk';
}

function Stars() {
  /* Deterministic scatter — the upstream version bakes 210 random box-shadows
   * into the stylesheet at build time; a fixed seed keeps it stable per render. */
  const shadow = (n, seed) => Array.from({ length: n }, (_, i) => {
    const x = ((i * seed) % 2000).toFixed(0);
    const y = ((i * (seed + 7)) % 270).toFixed(0);
    return `${x}px ${y}px #FFF`;
  }).join(', ');
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.2 }} aria-hidden="true">
      <div style={{ width: 1, height: 1, boxShadow: shadow(100, 137) }} />
      <div style={{ width: 2, height: 2, boxShadow: shadow(80, 271) }} />
      <div style={{ width: 3, height: 3, boxShadow: shadow(30, 419) }} />
    </div>
  );
}

export function SiteHeader({ title = 'Article Time', href = '/', sky, height = 300, clock = true, birds = true, className = '', ...rest }) {
  const state = sky || skyForHour();
  return (
    <header
      className={`at-sky ${className}`} data-sky={state}
      style={{ position: 'relative', height, overflow: 'hidden' }}
      {...rest}
    >
      {state === 'night' || state === 'dusk' ? <Stars /> : null}
      {state === 'day' || state === 'dusk' ? <div className="at-balloon" aria-hidden="true" /> : null}
      {birds ? (
        <div aria-hidden="true">
          <div className="at-bird-path"><div className="at-bird" style={{ marginTop: 150, animationDelay: '-0.5s' }} /></div>
          <div className="at-bird-path" style={{ animationDuration: '17s', animationDelay: '4s' }}>
            <div className="at-bird" style={{ animationDuration: '0.8s', animationDelay: '-0.75s' }} />
          </div>
        </div>
      ) : null}
      <div className="at-city" aria-hidden="true" />
      <div style={{ position: 'relative', height: '100%' }}>
        {clock ? <div className="at-clock" aria-hidden="true" /> : null}
        <div style={{ position: 'relative', zIndex: 5, top: 'calc(50% - 20px)', textAlign: 'center' }}>
          <a href={href} title={title}>
            <span className="at-wordmark" data-heading={title}>
              <span className="at-wordmark-shimmer">{title}</span>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
