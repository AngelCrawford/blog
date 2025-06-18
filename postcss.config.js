const { purgeCSSPlugin } = require('@fullhuman/postcss-purgecss');

const purgecss = purgeCSSPlugin({
  content: ["./hugo_stats.json", "./layouts/**/*.html", "./assets/js/**/*.js"],
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
      // Classes used in search.js
      'title', 'is-5', 'subtitle', 'ri-1x', 'read-more',
      'column', 'search-bottom', 'remix', 'lens', 'close',
      // Classes used in header.js
      'shimmer-animation', 'is-night', 'is-dawn', 'is-day', 'is-dusk',
      // Classes used in navbar.js
      'is-opened', 'is-fixed-top',
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