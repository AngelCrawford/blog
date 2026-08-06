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
      // Classes used in header.js
      'shimmer-animation', 'is-night', 'is-dawn', 'is-day', 'is-dusk',
      // Classes used in gdpr.js
      'opened', 'closed', 'is-rounded',
      // Classes used in main.js
      'is-loading', 'is-disabled', 'is-danger', 'visible',
      // Classes for dynamic article states
      'visited', 'is-new'
    ]
  }
});

module.exports = {
  plugins: [
    ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};