const purgeCSSPlugin = require('@fullhuman/postcss-purgecss');

const purgecss = purgeCSSPlugin({
  // Templates and JS live in themes/<name>/ — the glob covers every theme so a
  // new one is picked up without touching this file. Globs that match nothing
  // fail SILENTLY here: PurgeCSS falls back to hugo_stats.json alone and quietly
  // over-purges. If style.min.css suddenly shrinks, check these paths first.
  content: [
    "./hugo_stats.json",
    "./themes/*/layouts/**/*.html",
    "./themes/*/assets/js/**/*.js",
  ],
  defaultExtractor: (content) => {
    // For HTML and JS files, use a standard extractor
    if (typeof content === 'string') {
      return content.match(/[\w-/:]+(?<!:)/g) || [];
    }
    
    // For hugo_stats.json, extract elements
    const els = JSON.parse(content).htmlElements;
    return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
  },
  // Completely disable purging for specific CSS selectors
  fontFace: true,
  keyframes: true,
  variables: true,
  rejected: false,
  whitelistPatterns: [/.*\[disabled].*/],
  // Configure safelist with standard classes and patterns for pseudo-elements
  safelist: {
    standard: [
      // Formerly injected by the jQuery search.js. That script now lives in
      // themes/garden and generates Tailwind-classed markup, so only the names
      // still used by other templates remain — and those PurgeCSS finds on its
      // own. Kept as a belt-and-braces measure for the Bulma components.
      'title', 'subtitle', 'column',
      // Toggled by search.js and withered-banner.js.
      'closed', 'visible', 'is-loading',
      // Set by gdpr.js on cards: read markers and the seven-day "Neu" flag.
      'visited', 'is-new'
      //
      // GONE WITH THE SCRIPTS THAT SET THEM, August 2026:
      //   shimmer-animation, is-night, is-dawn, is-day, is-dusk
      //     header.js is garden's now and carries the time of day as
      //     `data-sky`, one attribute instead of four classes. The Bulma rules
      //     for them died with hero.scss's `header.hero` selector.
      //   opened, closed(gdpr), is-rounded, is-disabled, is-danger
      //     the comment form and the Gravatar loader, both commented out in
      //     the source for years and deleted with the jQuery port. There was
      //     never any live code setting them.
      //
      // A safelist entry for a class nobody sets does not protect anything —
      // it just pins dead CSS into the production bundle and tells the next
      // reader that a feature exists.
    ]
  }
});

module.exports = {
  plugins: [
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};