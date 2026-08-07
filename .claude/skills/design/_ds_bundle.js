/* @ds-bundle: {"format":4,"namespace":"ArticleTimeDesignSystem_de8a72","components":[{"name":"ArticleCard","sourcePath":"components/content/ArticleCard.jsx"},{"name":"GROWTH_STAGES","sourcePath":"components/content/GrowthBadge.jsx"},{"name":"GrowthBadge","sourcePath":"components/content/GrowthBadge.jsx"},{"name":"HeartButton","sourcePath":"components/content/HeartButton.jsx"},{"name":"InfoTiles","sourcePath":"components/content/InfoTile.jsx"},{"name":"InfoTile","sourcePath":"components/content/InfoTile.jsx"},{"name":"Badge","sourcePath":"components/content/Tag.jsx"},{"name":"Tag","sourcePath":"components/content/Tag.jsx"},{"name":"Hashtag","sourcePath":"components/content/Tag.jsx"},{"name":"Ribbon","sourcePath":"components/content/Tag.jsx"},{"name":"TermCard","sourcePath":"components/content/TermCard.jsx"},{"name":"Webmention","sourcePath":"components/content/Webmention.jsx"},{"name":"WitheredBanner","sourcePath":"components/content/WitheredBanner.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Heading","sourcePath":"components/core/Heading.jsx"},{"name":"LinedTitle","sourcePath":"components/core/Heading.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Message","sourcePath":"components/core/Message.jsx"},{"name":"Panel","sourcePath":"components/core/Panel.jsx"},{"name":"RoundButton","sourcePath":"components/core/RoundButton.jsx"},{"name":"Check","sourcePath":"components/forms/Check.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"ArchiveWidget","sourcePath":"components/navigation/ArchiveWidget.jsx"},{"name":"Pagination","sourcePath":"components/navigation/Pagination.jsx"},{"name":"SiteNav","sourcePath":"components/navigation/SiteNav.jsx"},{"name":"TocSidebar","sourcePath":"components/navigation/TocSidebar.jsx"},{"name":"SeriesSidebar","sourcePath":"components/navigation/TocSidebar.jsx"},{"name":"RelatedSidebar","sourcePath":"components/navigation/TocSidebar.jsx"},{"name":"HCard","sourcePath":"components/site/HCard.jsx"},{"name":"SiteFooter","sourcePath":"components/site/SiteFooter.jsx"},{"name":"SiteHeader","sourcePath":"components/site/SiteHeader.jsx"}],"sourceHashes":{"assets/icons/inline-sprite.js":"44dc20a76eb9","components/content/ArticleCard.jsx":"e01aee6c9151","components/content/GrowthBadge.jsx":"54966df3ffae","components/content/HeartButton.jsx":"f7e27cc06006","components/content/InfoTile.jsx":"88aaafad47a4","components/content/Tag.jsx":"d636a06ffd07","components/content/TermCard.jsx":"f239788e28ea","components/content/Webmention.jsx":"789e37720bb7","components/content/WitheredBanner.jsx":"4d9f823ff084","components/core/Button.jsx":"2ac827141bda","components/core/Heading.jsx":"514261c2d7c1","components/core/Icon.jsx":"a4c1ce32bd53","components/core/Message.jsx":"841259802de7","components/core/Panel.jsx":"804cb1026215","components/core/RoundButton.jsx":"794d4241caab","components/forms/Check.jsx":"82ab81fbee4e","components/forms/Field.jsx":"74f3ec4d7426","components/navigation/ArchiveWidget.jsx":"4813c8c454c2","components/navigation/Pagination.jsx":"4670486f72cc","components/navigation/SiteNav.jsx":"80e0ed104833","components/navigation/TocSidebar.jsx":"8bf6da06bad2","components/site/HCard.jsx":"b566e303de33","components/site/SiteFooter.jsx":"c08181172b1e","components/site/SiteHeader.jsx":"9bb258dbe572","ui_kits/website/App.jsx":"711aebc2edee","ui_kits/website/ArticleScreen.jsx":"50ce39a5005c","ui_kits/website/HomeScreen.jsx":"a27786edcf7b","ui_kits/website/TermsScreen.jsx":"813757cdd31b","ui_kits/website/data.jsx":"f6df7dd61b2d"},"inlinedExternals":[],"unexposedExports":[{"name":"skyForHour","sourcePath":"components/site/SiteHeader.jsx"},{"name":"spritePath","sourcePath":"components/core/Icon.jsx"}]} */

(() => {

const __ds_ns = (window.ArticleTimeDesignSystem_de8a72 = window.ArticleTimeDesignSystem_de8a72 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/icons/inline-sprite.js
try { (() => {
/* Inlines the Remixicon sprite into the document so every `<use href="#name">`
 * is a same-document reference.
 *
 * The sprite is self-hosted as a separate file upstream and referenced across
 * documents (`<use href="…/remixicon.symbol.svg#name">`). That form is fragile:
 * several rendering contexts — print, canvas rasterisation, sandboxed previews —
 * silently drop cross-document references, and the icon disappears with no
 * error. Inlining once at load costs one request and removes the whole class of
 * failure. Same-document references are live, so icons that React rendered
 * before the fetch finished light up on their own.
 *
 * Load it once per page, after styles.css:
 *   <script src="assets/icons/inline-sprite.js"></script>
 * Point it somewhere else with either
 *   <script src="…/inline-sprite.js" data-sprite="…/remixicon.symbol.svg"></script>
 * or `window.AT_SPRITE_URL = '…'` before the tag.
 *
 * THE URL IS NEVER GUESSED FROM A NON-MATCH. An earlier version derived it from
 * document.currentScript.src with a regex replace — and String.replace returns
 * the string UNCHANGED when the pattern does not match. Whenever currentScript
 * resolved to something else (a bundle tag, a rewritten src), the loader happily
 * fetched that file, got HTTP 200, and injected 101 KB of JavaScript into an
 * <svg> container. Every icon on the page vanished with nothing in the console.
 * Hence: derive only on a real match, fall back to finding our own script tag in
 * the document, and refuse any response that is not SVG.
 *
 * IDEMPOTENT, and that matters here: this file is re-executed in some contexts,
 * and a re-execution has a null document.currentScript. Bailing out on that path
 * logged an error on every single load — permanent noise that would mask the next
 * real one. The sprite already being in the document is the answer, so that check
 * comes first, before any URL resolution.
 */
(function () {
  if (document.getElementById('at-sprite')) return;
  var explicit = document.currentScript && document.currentScript.dataset && document.currentScript.dataset.sprite || typeof window !== 'undefined' && window.AT_SPRITE_URL;
  var here = document.currentScript && document.currentScript.src;
  var derived = here && /inline-sprite\.js(\?.*)?$/.test(here) ? here.replace(/inline-sprite\.js(\?.*)?$/, 'remixicon.symbol.svg') : null;
  /* Last resort when currentScript is unavailable: find our own tag in the
   * document. Reliable at any page depth, unlike a document-relative guess —
   * this file lives beside the sprite, a page does not. */
  var own = null;
  var tags = document.querySelectorAll('script[src*="inline-sprite.js"]');
  if (tags.length) own = tags[tags.length - 1].src.replace(/inline-sprite\.js(\?.*)?$/, 'remixicon.symbol.svg');
  var url = explicit || derived || own;
  if (!url) {
    /* Silent, deliberately. This is reached only by a re-execution of this file in
     * a context that has neither currentScript nor our own tag in its document —
     * the first, real run has already fetched and mounted. Logging here put an
     * error in the console of every page in the project on every load, which is
     * permanent noise that would mask the next genuine failure. The failure that
     * matters — a response that is not an SVG sprite — is still loud, below. */
    return;
  }
  fetch(url).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.text();
  }).then(function (svg) {
    /* Guard: a 200 response proves nothing about what came back. */
    if (svg.indexOf('<symbol') === -1 && svg.trim().indexOf('<svg') !== 0) {
      throw new Error('response from ' + url + ' is not an SVG sprite (no <symbol> found)');
    }
    var mount = function () {
      if (document.getElementById('at-sprite')) return;
      var host = document.body || document.documentElement;
      var box = document.createElement('div');
      box.id = 'at-sprite';
      box.setAttribute('aria-hidden', 'true');
      box.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      box.innerHTML = svg;
      host.insertBefore(box, host.firstChild);
    };
    if (document.body) mount();else document.addEventListener('DOMContentLoaded', mount);
  }).catch(function (e) {
    console.error('inline-sprite.js: ' + e.message + ' — icons will not render.');
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/icons/inline-sprite.js", error: String((e && e.message) || e) }); }

// components/content/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Two flavours of label, and they are not interchangeable:
 * Badge    — the Rubrik (category). Neutral pill, coloured dot, one per entry.
 * Hashtag  — a free tag. Pill, gold text on a barely-raised fill, many per entry.
 * Tag      — the solid Rubrik chip, for sidebar tile values.
 * Ribbon   — the Rubrik hung off the corner of a card. Kept for the note card and
 *            anywhere the label has to sit ON an image. */
function Badge({
  href,
  dot,
  children,
  className = '',
  style,
  ...rest
}) {
  const Tag_ = href ? 'a' : 'span';
  return /*#__PURE__*/React.createElement(Tag_, _extends({
    className: `at-badge ${className}`,
    href: href,
    style: {
      '--at-badge-dot': dot,
      ...style
    }
  }, rest), children);
}
function Tag({
  href,
  children,
  color,
  className = '',
  ...rest
}) {
  const Tag_ = href ? 'a' : 'span';
  return /*#__PURE__*/React.createElement(Tag_, _extends({
    className: `at-tag ${className}`,
    href: href,
    style: color ? {
      background: color
    } : undefined
  }, rest), children);
}
function Hashtag({
  href,
  children,
  className = '',
  ...rest
}) {
  const Tag_ = href ? 'a' : 'span';
  return /*#__PURE__*/React.createElement(Tag_, _extends({
    className: `at-hashtag ${className}`,
    href: href
  }, rest), "#", children);
}
function Ribbon({
  href,
  children,
  color,
  side = 'left',
  className = '',
  style,
  ...rest
}) {
  const Tag_ = href ? 'a' : 'span';
  const pos = side === 'left' ? {
    top: '3em',
    left: '-1.66em'
  } : {
    top: '1.3em',
    right: '-3px'
  };
  return /*#__PURE__*/React.createElement(Tag_, _extends({
    className: `at-ribbon ${className}`,
    href: href,
    style: {
      ...pos,
      background: color,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge, Tag, Hashtag, Ribbon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Tag.jsx", error: String((e && e.message) || e) }); }

// components/content/TermCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The Rubrik / Tag overview tile. Same chrome as the article card, but there is
 * nothing to summarise — a term is a cover, a name and a count. */
function TermCard({
  title,
  href = '#',
  cover,
  coverAlt = '',
  count,
  color,
  unit = 'Artikel',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("article", _extends({
    className: `at-card ${className}`
  }, rest), cover ? /*#__PURE__*/React.createElement("a", {
    href: href,
    title: title
  }, /*#__PURE__*/React.createElement("img", {
    className: "at-card-cover",
    src: cover,
    alt: coverAlt,
    style: {
      height: 230,
      aspectRatio: 'auto',
      borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
      boxShadow: 'none'
    }
  })) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--spacing-gutter)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "at-card-title"
  }, /*#__PURE__*/React.createElement("a", {
    href: href,
    style: color ? {
      color
    } : undefined
  }, title)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0.2em 0 0',
      color: 'var(--color-ink-muted)',
      fontSize: 'var(--text-sm)'
    }
  }, count, " ", unit)));
}
Object.assign(__ds_scope, { TermCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/TermCard.jsx", error: String((e && e.message) || e) }); }

// components/content/Webmention.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* IndieWeb replies. There is no comment system on this site — a reply is a post on
 * someone else's site that webmention.io forwards here.
 *
 * TWO SHAPES, because two things arrive. A reply has text and gets a box: left
 * edge in the type colour, author, the text, the source. A like or a repost has NO
 * text at all, and giving each one its own full-width row implies there is
 * something to read in it — three near-empty strips down the page was exactly how
 * that looked. Those render as chips instead, meant to sit together in one wrapped
 * row. `compact` is inferred from the absence of content; pass it explicitly to
 * force either shape. */
const EDGE = {
  like: 'var(--color-accent)',
  repost: 'var(--color-accent-hover)',
  mention: 'var(--color-accent-muted)',
  reply: 'var(--color-accent-muted)'
};
function Webmention({
  author,
  authorUrl,
  avatar,
  content,
  source,
  sourceLabel,
  type = 'mention',
  compact,
  className = '',
  ...rest
}) {
  const isCompact = compact != null ? compact : !content;
  const edge = EDGE[type] || EDGE.mention;
  const face = avatar ? /*#__PURE__*/React.createElement("img", {
    src: avatar,
    alt: "",
    width: isCompact ? 24 : 40,
    height: isCompact ? 24 : 40,
    style: {
      borderRadius: '50%',
      objectFit: 'cover',
      flex: '0 0 auto'
    }
  }) : null;
  if (isCompact) {
    return /*#__PURE__*/React.createElement("li", _extends({
      className: className,
      "data-wm-type": type,
      style: {
        listStyle: 'none',
        display: 'inline-flex'
      }
    }, rest), /*#__PURE__*/React.createElement("a", {
      href: source,
      title: `${author} · ${sourceLabel || source}`,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5em',
        minHeight: '2.25rem',
        padding: avatar ? '0.25rem 0.75rem 0.25rem 0.35rem' : '0.4rem 0.75rem',
        border: `1px solid color-mix(in srgb, ${edge} 55%, transparent)`,
        borderRadius: 'var(--radius-pill)',
        background: 'hsl(190 11% 9%)',
        color: 'var(--color-accent-hover)',
        fontSize: 'var(--text-sm)',
        textDecoration: 'none',
        whiteSpace: 'nowrap'
      }
    }, face, author));
  }
  return /*#__PURE__*/React.createElement("li", _extends({
    className: className,
    "data-wm-type": type,
    style: {
      listStyle: 'none',
      marginBottom: 'var(--spacing-3)',
      padding: '0.9rem 1.1rem',
      minWidth: '18rem',
      borderLeft: `3px solid ${edge}`,
      borderRadius: '0 var(--radius-md) var(--radius-md) 0',
      background: 'hsl(190 11% 9%)'
    }
  }, rest), /*#__PURE__*/React.createElement("a", {
    href: authorUrl,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.6rem',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--color-accent-hover)',
      textDecoration: 'none'
    }
  }, face, author), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0.6rem 0 0.5rem',
      overflowWrap: 'anywhere',
      color: 'var(--color-ink)'
    }
  }, content), /*#__PURE__*/React.createElement("a", {
    href: source,
    style: {
      display: 'inline-block',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-ink-muted)',
      textDecoration: 'none'
    }
  }, sourceLabel || source));
}
Object.assign(__ds_scope, { Webmention });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Webmention.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* A component, not a pile of utilities repeated at every call site. The label
 * weight is a real decision — buttons read as actionable partly because they are
 * a little heavier than the prose around them. */
function Button({
  variant = 'primary',
  as = 'button',
  children,
  className = '',
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `gd-button${variant === 'secondary' ? ' gd-button-secondary' : ''} ${className}`
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Heading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Levels are deliberately distinct so a page reads as a hierarchy rather than a
 * uniform wall:
 *   1  gold gradient over a raised drop-line, largest, once per page
 *   2  light, with a gold rule that runs to the edge
 *   3  gold, smaller, no decoration
 * The h1's gradient and shadow are two stacked pseudo-elements that read their
 * text from data-heading, so the text has to reach the attribute as a plain
 * string — children are flattened rather than assumed to be one. */
function flatten(node) {
  if (node == null || node === false) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flatten).join('');
  if (node.props && node.props.children != null) return flatten(node.props.children);
  return '';
}
function Heading({
  level = 2,
  text,
  children,
  className = '',
  ...rest
}) {
  const Tag = `h${level}`;
  if (level === 1) {
    return /*#__PURE__*/React.createElement(Tag, _extends({
      className: `gd-h1 ${className}`,
      "data-heading": text || flatten(children)
    }, rest), children);
  }
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `gd-h${level === 3 ? 3 : 2} ${className}`
  }, rest), children);
}

/* Centred title with a gold rule to both sides — the footer column headings.
 * One of the few pieces of the old design that was really successful. */
function LinedTitle({
  as = 'p',
  children,
  className = '',
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `gd-lined-title ${className}`
  }, rest), children);
}
Object.assign(__ds_scope, { Heading, LinedTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Heading.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Remixicon, self-hosted as an SVG sprite. Every glyph on the site comes from
 * assets/icons/remixicon.symbol.svg — there is no second icon set and no emoji.
 *
 * References are SAME-DOCUMENT (`#name`): the page loads
 * assets/icons/inline-sprite.js once, which injects the sprite into the DOM.
 * Cross-document `<use>` is silently dropped by several rendering contexts —
 * print, canvas rasterisation, sandboxed previews — and the icon vanishes with
 * no error. Set window.AT_SPRITE to a URL only if you deliberately want the
 * cross-document form. */
function spritePath() {
  return typeof window !== 'undefined' && window.AT_SPRITE || '';
}
function Icon({
  name,
  variant = 'duo',
  fill,
  size = '1.25em',
  color,
  title,
  style,
  className = '',
  ...rest
}) {
  const src = rest.sprite != null ? rest.sprite : spritePath();
  delete rest.sprite;
  const back = fill || (name.endsWith('-line') ? name.replace(/-line$/, '-fill') : name);

  /* Duotone: the filled body behind in muted gold, the line in front in the
   * accent. Size comes from font-size, never width/height — the shadow offset is
   * in em so it stays proportional at any size. */
  if (variant === 'duo') {
    return /*#__PURE__*/React.createElement("span", _extends({
      className: `gd-icon-duo ${className}`,
      style: {
        fontSize: size,
        color,
        ...style
      },
      title: title,
      "aria-hidden": title ? undefined : 'true'
    }, rest), /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("use", {
      href: `${src}#${back}`
    })), /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("use", {
      href: `${src}#${name}`
    })));
  }

  /* Glyphs without a `-fill` partner: same offset via drop-shadow, which follows
   * the rendered alpha and so works on a hairline shape.
   *
   * font-size is set alongside width/height on purpose: the offset in
   * .gd-icon-shadow is in em, and em on an svg resolves against its FONT size,
   * not its box. Without this a 56px icon kept a 16px-worth shadow and the effect
   * simply vanished at display sizes. */
  return /*#__PURE__*/React.createElement("svg", _extends({
    className: `${variant === 'line' ? 'gd-icon-shadow ' : ''}${className}`,
    style: {
      width: size,
      height: size,
      fontSize: size,
      flex: 'none',
      fill: 'currentColor',
      color: color || 'var(--color-accent)',
      ...style
    },
    viewBox: "0 0 24 24",
    title: title,
    "aria-hidden": title ? undefined : 'true'
  }, rest), /*#__PURE__*/React.createElement("use", {
    href: `${src}#${name}`
  }));
}
Object.assign(__ds_scope, { spritePath, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/content/GrowthBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The digital-garden signal: four stages, four tints, and the tint goes on the
 * GLYPH — never as a background and never as a text colour. That is why the
 * growth colours sit with the icons in the styleguide rather than in the palette.
 * Missing stage falls back to seedling, matching the Hugo partial. */
const GROWTH_STAGES = {
  seedling: {
    icon: 'seedling-line',
    label: 'Seedling',
    tooltip: 'Seedling; früher Entwurf'
  },
  budding: {
    icon: 'flower-line',
    label: 'Budding',
    tooltip: 'Budding; in Entwicklung'
  },
  evergreen: {
    icon: 'tree-line',
    label: 'Evergreen',
    tooltip: 'Evergreen; gepflegt & aktuell'
  },
  withered: {
    icon: 'skull-2-line',
    label: 'Withered',
    tooltip: 'Withered; veraltet'
  }
};
function GrowthBadge({
  stage = 'seedling',
  showLabel = false,
  tinted = true,
  size = '1.2em',
  className = '',
  ...rest
}) {
  const s = GROWTH_STAGES[stage] || GROWTH_STAGES.seedling;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `at-growth ${className}`,
    "data-stage": stage,
    "data-tooltip": s.tooltip,
    title: s.tooltip
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    variant: tinted ? 'duo' : 'plain',
    className: tinted ? 'gd-icon-duo-tinted' : '',
    size: size,
    color: "currentColor"
  }), showLabel ? /*#__PURE__*/React.createElement("span", null, s.label) : null);
}
Object.assign(__ds_scope, { GROWTH_STAGES, GrowthBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/GrowthBadge.jsx", error: String((e && e.message) || e) }); }

// components/content/HeartButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The only engagement control on the site — no comments, no reactions bar.
 * Articles show it read-only on cards (the action lives on the article page);
 * notes have no detail page, so their card heart is interactive. */
function HeartButton({
  count = 0,
  hearted = false,
  readonly = false,
  flat = false,
  hint,
  onHeart,
  className = '',
  ...rest
}) {
  const heart = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: hearted ? 'heart-fill' : 'heart-line',
    variant: "plain",
    size: "1.1em",
    color: "currentColor"
  }), /*#__PURE__*/React.createElement("span", {
    className: "at-heart-count"
  }, count));
  if (readonly) {
    return /*#__PURE__*/React.createElement("span", _extends({
      className: `at-heart at-heart-flat ${className}`,
      title: `${count} Herzen`
    }, rest), heart);
  }
  return (
    /*#__PURE__*/
    /* The hint stacks UNDER the pill, not beside it. Beside it, in a third of a
     * 533px column, "einmal pro Besuch" broke into three lines and pushed the box
     * footer to 81px — the hint is an aside, so it takes the space an aside gets. */
    React.createElement("span", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.35em'
      }
    }, /*#__PURE__*/React.createElement("button", _extends({
      type: "button",
      className: `at-heart${flat ? ' at-heart-flat' : ''}${hearted ? ' is-hearted' : ''} ${className}`,
      "aria-pressed": hearted,
      disabled: hearted,
      onClick: onHeart,
      title: hearted ? 'Danke!' : 'Gefällt mir'
    }, rest), heart), hint ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.7rem',
        lineHeight: 1.2,
        fontStyle: 'italic',
        whiteSpace: 'nowrap',
        color: 'var(--color-ink-muted)'
      }
    }, hint) : null)
  );
}
Object.assign(__ds_scope, { HeartButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/HeartButton.jsx", error: String((e && e.message) || e) }); }

// components/content/ArticleCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The magazine tile. Two shapes from one component, because the source is one
 * Hugo partial with variants:
 *
 *   format="article"  cover left in a 2:3 well, text right, footer across both.
 *                     Without a cover the text simply takes the whole width and
 *                     the excerpt is allowed to run longer.
 *   format="note"     no title, no excerpt — the note IS the text, set large in
 *                     Montserrat Alternates between gold quote marks, with the
 *                     cover dimmed behind it.
 *
 * Hover does three things and no more: the gold rule grows along the bottom
 * edge, the cover releases its sepia, and the round button presses in. */
function ArticleCard({
  format = 'article',
  title,
  href = '#',
  summary,
  date,
  updated,
  rubrik,
  rubrikHref,
  rubrikColor,
  cover,
  coverAlt = '',
  caption,
  tags = [],
  readingTime,
  growthStage,
  hearts = 0,
  series = false,
  featured = false,
  badge,
  onHeart,
  className = '',
  ...rest
}) {
  const isNote = format === 'note';
  const hasImage = Boolean(cover);

  /* The badge takes a sprite glyph, not a unicode symbol: upstream wrote "☀ Neu"
   * and "✓ Gesehen" literally, which were the only two non-Remixicon marks on the
   * site. Pass a string for the label alone, or { icon, label }. */
  const badgeSpec = typeof badge === 'string' ? {
    label: badge
  } : badge;
  const badgeNode = badgeSpec ? /*#__PURE__*/React.createElement("span", {
    className: "at-card-badge"
  }, badgeSpec.icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: badgeSpec.icon,
    variant: "plain",
    size: "0.9em",
    color: "currentColor"
  }) : null, badgeSpec.label) : null;
  const dateRow = /*#__PURE__*/React.createElement("p", {
    className: "at-card-meta"
  }, /*#__PURE__*/React.createElement("time", {
    dateTime: date,
    title: "Ver\xF6ffentlichungsdatum"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "calendar-line",
    variant: "plain",
    size: "15px",
    color: "var(--color-ink-muted)",
    style: {
      display: 'inline-block',
      verticalAlign: '-3px',
      marginRight: 2
    }
  }), ' ', date), updated && updated !== date ? /*#__PURE__*/React.createElement("time", {
    dateTime: updated,
    title: "Letztes Bearbeitungsdatum"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "pencil-line",
    variant: "plain",
    size: "15px",
    color: "var(--color-ink-muted)",
    style: {
      display: 'inline-block',
      verticalAlign: '-3px',
      marginRight: 2
    }
  }), ' ', updated) : null);
  const footer = /*#__PURE__*/React.createElement("footer", {
    className: "at-card-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "at-card-footer-item"
  }, isNote ? dateRow : /*#__PURE__*/React.createElement("span", {
    "data-tooltip": `${readingTime} Minuten Lesedauer`
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "timer-line",
    variant: "plain",
    size: "20px",
    color: "var(--color-ink-muted)",
    style: {
      display: 'inline-block',
      verticalAlign: '-5px',
      marginRight: 2
    }
  }), ' ', readingTime, " Min.")), !isNote && tags.length ? /*#__PURE__*/React.createElement("div", {
    className: "at-card-footer-item",
    style: {
      flexWrap: 'wrap',
      gap: '0.35em'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "price-tag-3-line",
    variant: "plain",
    size: "18px",
    color: "var(--color-ink-muted)"
  }), tags.slice(0, 3).map(t => /*#__PURE__*/React.createElement(__ds_scope.Hashtag, {
    key: t,
    href: `/tags/${t}/`
  }, t)), tags.length > 3 ? /*#__PURE__*/React.createElement("a", {
    href: href,
    title: tags.slice(3).map(t => `#${t}`).join(' '),
    style: {
      color: 'var(--color-ink-muted)'
    }
  }, "+", tags.length - 3) : null) : null, /*#__PURE__*/React.createElement("div", {
    className: "at-card-footer-item",
    style: {
      gap: 10
    }
  }, isNote ? /*#__PURE__*/React.createElement("span", {
    "data-tooltip": "Notiz"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "lightbulb-line",
    size: "20px",
    color: "var(--color-accent-hover)"
  })) : /*#__PURE__*/React.createElement(__ds_scope.GrowthBadge, {
    stage: growthStage
  }), series ? /*#__PURE__*/React.createElement("span", {
    "data-tooltip": "Teil einer Serie"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "stack-line",
    size: "20px"
  })) : null, /*#__PURE__*/React.createElement(__ds_scope.HeartButton, {
    count: hearts,
    flat: true,
    readonly: !isNote,
    onHeart: onHeart
  }), !isNote ? /*#__PURE__*/React.createElement("a", {
    href: href,
    title: "Weiterlesen",
    "aria-label": "Weiterlesen",
    style: {
      display: 'flex',
      color: 'var(--color-accent)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right-s-line",
    variant: "plain",
    size: "20px",
    color: "currentColor"
  })) : null));
  if (isNote) {
    return /*#__PURE__*/React.createElement("article", _extends({
      className: `at-card ${featured ? 'at-card-fixed ' : ''}${className}`,
      style: {
        display: 'grid',
        gridTemplateRows: '1fr auto',
        minHeight: 400
      }
    }, rest), badgeNode, rubrik ? /*#__PURE__*/React.createElement(__ds_scope.Ribbon, {
      href: rubrikHref,
      side: hasImage ? 'left' : 'right'
    }, rubrik) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        padding: rubrik ? '5.5rem var(--spacing-gutter) var(--spacing-gutter)' : 'var(--spacing-gutter)'
      }
    }, hasImage ? /*#__PURE__*/React.createElement("img", {
      className: "at-card-bleed",
      src: cover,
      alt: coverAlt
    }) : null, /*#__PURE__*/React.createElement("p", {
      className: "at-quoted",
      style: {
        position: 'relative',
        zIndex: 2,
        margin: 0,
        textAlign: 'center',
        fontFamily: 'var(--font-heading)',
        fontWeight: 'var(--weight-strong)',
        fontSize: 30,
        lineHeight: 1.3,
        color: 'var(--color-ink-strong)',
        textShadow: '3px 3px 4px rgb(0 0 0 / 0.5)',
        background: 'linear-gradient(270deg, transparent 0%, rgb(0 0 0 / 0.5) 50%, transparent 100%)',
        padding: '1rem 0'
      }
    }, summary)), footer);
  }
  return /*#__PURE__*/React.createElement("article", _extends({
    className: `at-card ${featured ? 'at-card-fixed ' : ''}${className}`,
    style: {
      display: 'grid',
      gridTemplateRows: '1fr auto'
    }
  }, rest), badgeNode, /*#__PURE__*/React.createElement("div", {
    className: "at-flow",
    style: {
      padding: 'var(--spacing-gutter)',
      position: 'relative'
    }
  }, hasImage ?
  /*#__PURE__*/
  /* Floated, not a grid column: the text runs around the cover. The figure
   * hangs 1.5em off the card's left edge and starts 1.5em below its top,
   * which is what makes the image read as laid ON the card. */
  React.createElement("figure", {
    className: "at-figure at-figure-float"
  }, /*#__PURE__*/React.createElement("a", {
    href: href,
    title: title
  }, /*#__PURE__*/React.createElement("img", {
    className: "at-card-cover",
    src: cover,
    alt: coverAlt
  })), caption ? /*#__PURE__*/React.createElement("figcaption", {
    className: "at-figcaption"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "pencil-line",
    variant: "plain",
    size: "16px",
    style: {
      display: 'inline-block',
      verticalAlign: '-3px',
      marginRight: 3
    }
  }), ' ', caption) : null) : null, /*#__PURE__*/React.createElement("h2", {
    className: "at-card-title"
  }, /*#__PURE__*/React.createElement("a", {
    href: href,
    title: title
  }, title)), /*#__PURE__*/React.createElement("p", {
    className: "at-card-meta"
  }, rubrik ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    href: rubrikHref,
    dot: rubrikColor
  }, rubrik) : null, /*#__PURE__*/React.createElement("time", {
    dateTime: date,
    title: "Ver\xF6ffentlichungsdatum"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "calendar-line",
    variant: "plain",
    size: "15px",
    color: "var(--color-ink-muted)",
    style: {
      display: 'inline-block',
      verticalAlign: '-3px',
      marginRight: 2
    }
  }), ' ', date)), /*#__PURE__*/React.createElement("div", {
    className: "at-card-excerpt",
    style: {
      margin: '0.75rem 0 0'
    }
  }, summary)), footer);
}
Object.assign(__ds_scope, { ArticleCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ArticleCard.jsx", error: String((e && e.message) || e) }); }

// components/content/InfoTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Article metadata, one atom per tile, in a two-column grid. Rubrik, Stadium,
 * Publiziert, Editiert, Tags, Lesedauer, Reaktionen, Herzen. Tags and Herzen
 * span both columns. Every tile has the same shape — icon left, uppercase label,
 * value — so the sidebar scans as a table without being one. */
function InfoTiles({
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: className,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '0.6rem'
    }
  }, rest), children);
}
function InfoTile({
  icon,
  iconColor,
  label,
  wide = false,
  stage,
  children,
  className = '',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `at-tile ${className}`,
    "data-stage": stage,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.65rem',
      padding: '0.65rem 0.8rem',
      gridColumn: wide ? '1 / -1' : undefined,
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    variant: "plain",
    size: "1.6rem",
    color: iconColor || 'var(--color-ink-muted)'
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.2rem',
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "at-tile-label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "at-tile-value",
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0.35em 0.4em'
    }
  }, children)));
}
Object.assign(__ds_scope, { InfoTiles, InfoTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/InfoTile.jsx", error: String((e && e.message) || e) }); }

// components/content/WitheredBanner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Shown at the top of an article whose growth stage is `withered`. Says plainly
 * that the text is out of date and, where there is one, points at the successor.
 * Dismissible — the visitor has been told, once is enough. */
function WitheredBanner({
  date,
  reason,
  replacement,
  replacementHref,
  onDismiss,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("aside", _extends({
    className: className,
    style: {
      marginBottom: 'var(--spacing-gutter)',
      padding: 'var(--spacing-4)',
      border: '1px solid color-mix(in srgb, var(--color-warning) 35%, transparent)',
      borderLeft: '4px solid var(--color-warning)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--color-surface)',
      display: 'flex',
      gap: 'var(--spacing-3)',
      alignItems: 'flex-start'
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "skull-2-line",
    variant: "plain",
    size: "1.4rem",
    color: "var(--color-withered)",
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: 'var(--weight-bold)',
      color: 'var(--color-warning)'
    }
  }, "Verwelkt"), date ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0.35rem 0',
      color: 'var(--color-ink-muted)',
      fontSize: 'var(--text-sm)'
    }
  }, "Zuletzt gepflegt am ", date, ".") : null, reason ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0.35rem 0'
    }
  }, reason) : null, replacement ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0.35rem 0 0'
    }
  }, "Aktueller Ersatz: ", /*#__PURE__*/React.createElement("a", {
    href: replacementHref,
    style: {
      fontWeight: 'var(--weight-strong)',
      textDecoration: 'underline'
    }
  }, replacement)) : null), onDismiss ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onDismiss,
    "aria-label": "Hinweis schlie\xDFen",
    style: {
      appearance: 'none',
      border: 0,
      background: 'transparent',
      color: 'var(--color-ink-muted)',
      minWidth: '2.75rem',
      minHeight: '2.75rem'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close-fill",
    variant: "plain",
    size: "1.1rem",
    color: "currentColor"
  })) : null);
}
Object.assign(__ds_scope, { WitheredBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/WitheredBanner.jsx", error: String((e && e.message) || e) }); }

// components/core/Message.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* For messages, form validation and build/deploy feedback. The state colour IS
 * the text here (on a dark surface), not a background behind dark text — which
 * is why the tokens are lighter than the Bulma equivalents they replaced. */
function Message({
  tone = 'success',
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("p", _extends({
    className: `gd-message gd-message-${tone} ${className}`
  }, rest), children);
}
Object.assign(__ds_scope, { Message });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Message.jsx", error: String((e && e.message) || e) }); }

// components/core/Panel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Three levels of surface, and the rule is that a level only ever sits on a
 * DIFFERENT level. Panel on page, card on panel or page, never panel on panel —
 * that constraint is what makes depth readable on a palette this dark, where
 * shadows barely register. */
function Panel({
  plain = false,
  as = 'div',
  children,
  className = '',
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `${plain ? 'gd-panel-plain' : 'gd-panel'} ${className}`
  }, rest), children);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Panel.jsx", error: String((e && e.message) || e) }); }

// components/core/RoundButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The press effect, and the only surviving neumorphism in the system. Raised at
 * rest: dark shadow below-right plus a faint light one above-left, which makes
 * the disc read as formed out of the page. Pressed: the same pair inverted to
 * inset, plus 2px of travel. Inverting the pair is the whole trick. */
function RoundButton({
  icon,
  size = 'md',
  fullGlyph = false,
  as = 'button',
  label,
  children,
  className = '',
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `gd-round-button${size === 'lg' ? ' gd-round-button-lg' : ''}${fullGlyph ? ' gd-round-button-full' : ''} ${className}`,
    "aria-label": label,
    title: label
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    variant: "plain",
    size: "100%",
    color: "currentColor"
  }) : children);
}
Object.assign(__ds_scope, { RoundButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/RoundButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Check.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Checkbox and radio, rebuilt. The checkmark is a clip-path polygon rather than
 * a glyph, so it needs no font and no sprite. */
function Check({
  type = 'checkbox',
  label,
  className = '',
  ...rest
}) {
  const input = /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    className: `gd-check ${className}`
  }, rest));
  if (!label) return input;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-3)'
    }
  }, input, /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Check });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Check.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The scoped baseline strips the browser's own styling from form controls; this
 * puts a deliberate one back. Native select and checkbox rendering cannot be
 * themed on most platforms, so both are rebuilt in CSS: the arrow is two
 * gradients meeting in a chevron, the checkmark a clip-path polygon. */
function Field({
  as = 'input',
  label,
  hint,
  children,
  className = '',
  ...rest
}) {
  const Tag = as;
  const control = /*#__PURE__*/React.createElement(Tag, _extends({
    className: `gd-field ${className}`
  }, rest), children);
  if (!label) return control;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-ink-muted)'
    }
  }, label), control, hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-ink-muted)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/navigation/ArchiveWidget.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Entries per year, with a dotted leader running between the year and its count.
 * Includes withered entries — the archive is the one place where everything is
 * listed, because that is what an archive is for. */
function ArchiveWidget({
  label = 'Übersicht',
  years = [],
  href = '/pages/archiv/',
  showButton = true,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: className
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.LinedTitle, null, label), /*#__PURE__*/React.createElement("ul", {
    className: "at-widget-list at-leader-list",
    style: {
      marginTop: '0.75em'
    }
  }, years.map(y => /*#__PURE__*/React.createElement("li", {
    key: y.year
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
    href: `${href}#${y.year}`,
    title: y.year
  }, y.year)), /*#__PURE__*/React.createElement("span", null, y.count, " ", y.count === 1 ? 'Eintrag' : 'Einträge')))), showButton ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 'var(--spacing-4)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: href,
    className: "gd-button gd-button-secondary",
    title: "Archiv"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "bookmark-line",
    variant: "plain",
    size: "1em",
    color: "currentColor"
  }), " Archiv")) : null);
}
Object.assign(__ds_scope, { ArchiveWidget });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/ArchiveWidget.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Pagination.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Round buttons in a row. The current page is held pressed — the same shadow
 * inversion the buttons use as feedback, frozen. That is the whole active state:
 * pressed already means "you are here", so it needs no colour of its own.
 *
 * It is rendered as a SPAN, not a disabled button. There is no action to disable:
 * the page you are on is not a destination, and a control that highlights on hover
 * and then does nothing is worse than one that plainly cannot be pressed. */
function Pagination({
  page = 1,
  pages = 1,
  onPage,
  className = '',
  ...rest
}) {
  const go = p => () => onPage && onPage(p);
  const nums = Array.from({
    length: pages
  }, (_, i) => i + 1);
  const label = {
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--weight-strong)'
  };
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: className,
    "aria-label": "Seitennavigation",
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 'var(--spacing-3)',
      padding: 'var(--spacing-gutter) 0'
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.RoundButton, {
    icon: "arrow-left-s-line",
    label: "Vorherige Seite",
    disabled: page === 1,
    onClick: go(page - 1)
  }), nums.map(n => n === page ? /*#__PURE__*/React.createElement("span", {
    key: n,
    className: "gd-round-button gd-round-button-pressed",
    "aria-current": "page",
    "aria-label": `Seite ${n}, aktuelle Seite`,
    style: label
  }, n) : /*#__PURE__*/React.createElement("button", {
    key: n,
    type: "button",
    className: "gd-round-button",
    onClick: go(n),
    "aria-label": `Seite ${n}`,
    style: label
  }, n)), /*#__PURE__*/React.createElement(__ds_scope.RoundButton, {
    icon: "arrow-right-s-line",
    label: "N\xE4chste Seite",
    disabled: page === pages,
    onClick: go(pages === page ? page : page + 1)
  }));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function SiteNav({
  items = [],
  follow = [],
  active,
  brand = 'Artikel',
  logo,
  query = '',
  results = null,
  onQuery,
  onNavigate,
  drawerOpen,
  onDrawerToggle,
  className = '',
  ...rest
}) {
  const [innerOpen, setInnerOpen] = React.useState(false);
  const open = drawerOpen != null ? drawerOpen : innerOpen;
  const setOpen = v => onDrawerToggle ? onDrawerToggle(v) : setInnerOpen(v);
  const [panel, setPanel] = React.useState(false);

  /* Body scroll is locked while the drawer covers the page — otherwise the page
   * behind keeps scrolling under the fingers and the drawer feels detached. */
  React.useEffect(() => {
    if (drawerOpen != null) return;
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, drawerOpen]);
  const go = item => e => {
    if (!onNavigate) return;
    e.preventDefault();
    onNavigate(item);
    setOpen(false);
  };
  const searchField = /*#__PURE__*/React.createElement("div", {
    className: "at-nav-search"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "at-searchbox",
    className: "at-sr-only"
  }, "Suchen"), /*#__PURE__*/React.createElement("input", {
    id: "at-searchbox",
    type: "search",
    placeholder: "Suchen\u2026",
    "aria-label": "Suchen",
    value: query,
    onChange: e => {
      if (onQuery) onQuery(e.target.value);
      setPanel(Boolean(e.target.value));
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "at-nav-search-icon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: query ? 'close-fill' : 'search-line',
    variant: "plain",
    size: "1rem",
    color: "currentColor"
  })));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("nav", _extends({
    className: `at-nav ${className}`,
    "aria-label": "Hauptnavigation"
  }, rest), /*#__PURE__*/React.createElement("a", {
    className: "at-nav-brand",
    href: "/",
    title: brand,
    "aria-label": brand
  }, logo ? /*#__PURE__*/React.createElement("img", {
    src: logo,
    width: "26",
    height: "26",
    alt: ""
  }) : brand), /*#__PURE__*/React.createElement("div", {
    className: "at-nav-links"
  }, items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.label,
    className: "at-nav-link",
    href: it.href,
    title: it.label,
    "aria-current": it.label === active ? 'page' : undefined,
    onClick: go(it)
  }, it.icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon,
    variant: "plain",
    size: "1.125rem",
    color: "currentColor"
  }) : null, it.label))), /*#__PURE__*/React.createElement("div", {
    className: "at-nav-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "at-nav-follow",
    style: {
      display: 'flex'
    }
  }, follow.map(f => /*#__PURE__*/React.createElement("a", {
    key: f.name,
    className: "at-nav-icon",
    href: f.href,
    title: f.name,
    target: "_blank",
    rel: "noreferrer"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: f.icon,
    variant: "plain",
    size: "1.125rem",
    color: "currentColor"
  })))), searchField, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "at-nav-icon at-nav-burger",
    "aria-label": "Men\xFC \xF6ffnen",
    "aria-expanded": open,
    onClick: () => setOpen(true)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "links-line",
    variant: "plain",
    size: "1.375rem",
    color: "currentColor"
  }))), results && panel && query ? /*#__PURE__*/React.createElement("div", {
    className: "at-nav-results"
  }, /*#__PURE__*/React.createElement("div", null, results)) : null), open ? /*#__PURE__*/React.createElement("div", {
    className: "at-drawer",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Men\xFC"
  }, /*#__PURE__*/React.createElement("div", {
    className: "at-drawer-head"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--weight-strong)',
      color: 'var(--color-ink-muted)'
    }
  }, brand), /*#__PURE__*/React.createElement(__ds_scope.RoundButton, {
    icon: "close-fill",
    fullGlyph: true,
    label: "Men\xFC schlie\xDFen",
    onClick: () => setOpen(false)
  })), searchField, /*#__PURE__*/React.createElement("div", {
    className: "at-drawer-links"
  }, items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.label,
    className: "at-drawer-link",
    href: it.href,
    "aria-current": it.label === active ? 'page' : undefined,
    onClick: go(it)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon || 'article-line',
    size: "1.5rem"
  }), it.label))), /*#__PURE__*/React.createElement("div", {
    className: "at-drawer-follow"
  }, follow.map(f => /*#__PURE__*/React.createElement("a", {
    key: f.name,
    className: "at-nav-icon",
    href: f.href,
    title: f.name,
    target: "_blank",
    rel: "noreferrer"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: f.icon,
    size: "1.375rem"
  }))))) : null);
}
Object.assign(__ds_scope, { SiteNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TocSidebar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Four sidebar widgets, one shape. Tile chrome, an uppercase label with a rule
 * under it, then a list. Only the list differs — which is why they share a file
 * and a stylesheet section instead of being four near-copies. */

function Widget({
  label,
  aside,
  children,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("aside", _extends({
    className: `at-tile at-widget ${className}`
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "at-widget-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "at-tile-label"
  }, label), aside ? /*#__PURE__*/React.createElement("span", {
    className: "at-widget-count"
  }, aside) : null), children);
}

/* Table of contents. Em-dash bullets; nested levels indent and gain a rail. */
function TocSidebar({
  label = 'Inhalt',
  items = [],
  current,
  className = '',
  ...rest
}) {
  const render = list => /*#__PURE__*/React.createElement("ul", {
    className: "at-widget-list at-toc-list"
  }, list.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: `${it.label}-${i}`,
    className: it.href === current ? 'is-current' : undefined
  }, /*#__PURE__*/React.createElement("a", {
    href: it.href
  }, it.label), it.children && it.children.length ? render(it.children) : null)));
  return /*#__PURE__*/React.createElement(Widget, _extends({
    label: label,
    className: className
  }, rest), render(items));
}

/* Series. Leading-zero counters in a column with a continuous rail behind them.
 * Withered parts keep their number and fade rather than disappear. */
function SeriesSidebar({
  label = 'Serie',
  title,
  href,
  items = [],
  current,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Widget, _extends({
    label: label,
    aside: `${items.length} Teile`,
    className: className
  }, rest), title ? /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      display: 'block',
      padding: '0.35rem 0.7rem 0.5rem',
      marginBottom: '0.35rem',
      fontFamily: 'var(--font-heading)',
      fontSize: '0.95rem',
      fontWeight: 'var(--weight-strong)',
      lineHeight: 1.35,
      color: 'var(--color-accent-hover)'
    }
  }, title) : null, /*#__PURE__*/React.createElement("ol", {
    className: "at-widget-list at-series-list"
  }, items.map((it, i) => {
    const isCurrent = it.href === current;
    return /*#__PURE__*/React.createElement("li", {
      key: `${it.label}-${i}`,
      className: `${isCurrent ? 'is-current' : ''}${it.withered ? ' is-withered' : ''}`
    }, isCurrent ? /*#__PURE__*/React.createElement("span", null, it.label) : /*#__PURE__*/React.createElement("a", {
      href: it.href
    }, it.withered ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "skull-2-line",
      variant: "plain",
      size: "0.85em",
      color: "var(--color-withered)",
      style: {
        display: 'inline-block',
        verticalAlign: '-0.1em',
        marginRight: '0.2em'
      }
    }) : null, it.label));
  })));
}

/* Ähnliche Artikel. Title left, date right, dashed divider between rows. */
function RelatedSidebar({
  label = 'Ähnliche Artikel',
  items = [],
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Widget, _extends({
    label: label,
    className: className
  }, rest), /*#__PURE__*/React.createElement("ul", {
    className: "at-widget-list at-rows"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: `${it.label}-${i}`
  }, /*#__PURE__*/React.createElement("a", {
    href: it.href
  }, it.label), /*#__PURE__*/React.createElement("span", {
    className: "at-rows-aside"
  }, it.date)))));
}
Object.assign(__ds_scope, { TocSidebar, SeriesSidebar, RelatedSidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TocSidebar.jsx", error: String((e && e.message) || e) }); }

// components/site/HCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The site-wide representative h-card — the IndieWeb visiting card. Every class
 * name here that starts with p-, u- or h- is a microformats2 property, not a
 * style hook: h-card, p-name, u-photo, p-note, u-url, u-uid, rel="me". They are
 * what webmention.io, Bridgy, Mastodon verification and indiewebify.me read.
 * Renaming one to suit the CSS silently breaks the identity. */
function HCard({
  name,
  photo,
  note,
  socials = [],
  aboutUrl,
  siteUrl = '/',
  label = 'Kontakt',
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("article", _extends({
    className: `h-card ${className}`,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.LinedTitle, {
    className: "p-name",
    style: {
      alignSelf: 'stretch'
    }
  }, name), photo ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120,
      height: 120,
      margin: '0.25rem auto 1rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: aboutUrl || siteUrl,
    "aria-label": `Mehr über ${name}`
  }, /*#__PURE__*/React.createElement("img", {
    className: "u-photo",
    src: photo,
    width: "120",
    height: "120",
    alt: name,
    title: name,
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid var(--color-accent-muted)',
      transition: 'border-color var(--duration-slow)'
    }
  }))) : null, note ? /*#__PURE__*/React.createElement("p", {
    className: "p-note",
    style: {
      maxWidth: '18rem',
      margin: '0 0 1rem',
      color: 'var(--color-ink-muted)'
    }
  }, note) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1.5em'
    }
  }, socials.map(s => /*#__PURE__*/React.createElement("a", {
    key: s.name,
    href: s.href,
    "data-tooltip": s.name,
    "aria-label": s.name,
    target: "_blank",
    rel: "noopener me",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '1.4em',
      height: '1.4em',
      fontSize: '1.4em'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    variant: "plain",
    size: "1.4em",
    color: s.color || 'var(--color-accent-hover)',
    style: {
      opacity: s.opacity
    }
  })))), aboutUrl ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: aboutUrl,
    className: "gd-button gd-button-secondary",
    title: "\xDCber mich"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-right-s-line",
    variant: "plain",
    size: "1em",
    color: "currentColor"
  }), " \xDCber mich")) : null, /*#__PURE__*/React.createElement("a", {
    className: "u-url u-uid",
    rel: "me",
    href: siteUrl,
    hidden: true
  }, name));
}
Object.assign(__ds_scope, { HCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/HCard.jsx", error: String((e && e.message) || e) }); }

// components/site/SiteFooter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The footer, and the one part of the old design that was really successful:
 * gold rules over each column heading, four columns, the h-card, and the harbour
 * skyline reflected upside-down in a rippling sea below it.
 *
 * The turbulence filter is an inline <svg> because a CSS filter cannot do
 * feDisplacementMap; the animate element drives it over 200 seconds so the water
 * moves without anyone noticing it move. */
function SiteFooter({
  slogan,
  identity = {},
  stats = [],
  statsIntro,
  archiveYears = [],
  menu = [],
  copyright,
  version = 'dev',
  credits,
  className = '',
  ...rest
}) {
  /* mostLoved is the footer's own second column, not an h-card property. Spreading
   * the whole identity object into HCard put it through to the DOM as a stray
   * `mostloved` attribute on the one element in the system whose attributes are
   * machine-parsed — webmention.io, Bridgy and indiewebify.me all read this card. */
  const {
    mostLoved = [],
    ...hcard
  } = identity;
  return /*#__PURE__*/React.createElement("footer", _extends({
    className: className,
    style: {
      position: 'relative',
      overflow: 'hidden',
      margin: 0,
      padding: '0 0 2em',
      background: 'hsl(190 11% 6%)',
      boxShadow: 'inset 10px 10px 15px rgb(0 0 0 / 0.3), inset -10px -10px 15px hsl(190 20% 90% / 0.1)'
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      width: 0,
      height: 0
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("filter", {
    id: "at-turbulence",
    x: "0",
    y: "0",
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement("feTurbulence", {
    id: "at-sea-filter",
    numOctaves: "2",
    seed: "2",
    baseFrequency: "0.02 0.05"
  }), /*#__PURE__*/React.createElement("feDisplacementMap", {
    in2: "",
    scale: "20",
    in: "SourceGraphic"
  }), /*#__PURE__*/React.createElement("animate", {
    href: "#at-sea-filter",
    attributeName: "baseFrequency",
    dur: "200s",
    keyTimes: "0;0.8;1",
    values: "0.02 0.06;0.04 0.08;0.02 0.06",
    repeatCount: "indefinite"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "at-footer-sea",
    style: {
      position: 'absolute',
      inset: '0 0 auto 0',
      height: 300,
      zIndex: 1,
      pointerEvents: 'none'
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 5,
      padding: '3em'
    }
  }, slogan ? /*#__PURE__*/React.createElement("p", {
    className: "at-quoted",
    style: {
      width: 'fit-content',
      margin: '0 auto var(--spacing-section)',
      padding: '0.3em',
      textAlign: 'center',
      fontFamily: 'var(--font-heading)',
      fontWeight: 'var(--weight-strong)',
      fontSize: 'var(--text-2xl)',
      lineHeight: 1.5,
      color: 'var(--color-ink-muted)',
      textShadow: '3px 3px 4px rgb(0 0 0 / 0.5)',
      background: 'linear-gradient(270deg, transparent 0%, rgb(0 0 0 / 0.3) 50%, transparent 100%)'
    }
  }, slogan) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--spacing-section) var(--spacing-gutter)',
      gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
      color: 'var(--color-ink-muted)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.HCard, hcard), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.LinedTitle, null, "Most Loved"), /*#__PURE__*/React.createElement("ul", {
    className: "at-widget-list at-rows",
    style: {
      marginTop: '0.75em'
    }
  }, mostLoved.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: `${it.label}-${i}`
  }, /*#__PURE__*/React.createElement("a", {
    href: it.href
  }, it.label), /*#__PURE__*/React.createElement("span", {
    className: "at-rows-aside"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "heart-fill",
    variant: "plain",
    size: "0.9em",
    color: "hsl(0 70% 65%)",
    style: {
      display: 'inline-block',
      verticalAlign: '-0.1em',
      marginRight: 3
    }
  }), it.hearts))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.LinedTitle, null, "Statistik"), statsIntro ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0.75em 0 0'
    }
  }, statsIntro) : null, /*#__PURE__*/React.createElement("ul", {
    className: "at-widget-list at-leader-list",
    style: {
      marginTop: '0.75em'
    }
  }, stats.map(s => /*#__PURE__*/React.createElement("li", {
    key: s.label
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    variant: "plain",
    size: "20px",
    color: s.color
  }), s.label), /*#__PURE__*/React.createElement("span", null, s.count))))), /*#__PURE__*/React.createElement(__ds_scope.ArchiveWidget, {
    years: archiveYears
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 5,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '0 0 0.5em',
      padding: 0
    }
  }, menu.map((m, i) => /*#__PURE__*/React.createElement("li", {
    key: m.label,
    style: {
      display: 'inline-block',
      lineHeight: '1.5em'
    }
  }, i > 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-accent-muted)',
      padding: '0 0.2em'
    }
  }, "|") : null, /*#__PURE__*/React.createElement("a", {
    href: m.href,
    title: m.label
  }, m.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '90%',
      opacity: 0.7,
      color: 'var(--color-ink-muted)'
    }
  }, "\xA9 2020 \u2013 ", new Date().getFullYear(), " ", hcard.name, " | ", /*#__PURE__*/React.createElement("abbr", {
    title: "Build"
  }, version), copyright ? /*#__PURE__*/React.createElement(React.Fragment, null, " | ", /*#__PURE__*/React.createElement("span", null, copyright)) : null, credits ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0.5em 0 0'
    }
  }, credits) : null)));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// components/site/SiteHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The header. A 300px band of sky whose gradient follows the visitor's own time
 * of day, the Hamburg/Kiel harbour silhouette repeating along the bottom in
 * sepia, the clock face rising into place once, and the wordmark in gold
 * gradient on top. Night and dusk get stars; day and dusk get the balloon.
 *
 * Upstream the boundaries come from SunriseSunsetJS at the site's coordinates,
 * recalculated hourly. `skyForHour` is the same four-state ladder against local
 * clock hours — close enough for a mock, and `sky` overrides it outright. */
function skyForHour(h = new Date().getHours()) {
  if (h >= 22 || h < 5) return 'night';
  if (h < 8) return 'dawn';
  if (h < 19) return 'day';
  return 'dusk';
}
function Stars() {
  /* Deterministic scatter — the upstream version bakes 210 random box-shadows
   * into the stylesheet at build time; a fixed seed keeps it stable per render. */
  const shadow = (n, seed) => Array.from({
    length: n
  }, (_, i) => {
    const x = (i * seed % 2000).toFixed(0);
    const y = (i * (seed + 7) % 270).toFixed(0);
    return `${x}px ${y}px #FFF`;
  }).join(', ');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      opacity: 0.2
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 1,
      boxShadow: shadow(100, 137)
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 2,
      height: 2,
      boxShadow: shadow(80, 271)
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 3,
      height: 3,
      boxShadow: shadow(30, 419)
    }
  }));
}
function SiteHeader({
  title = 'Article Time',
  href = '/',
  sky,
  height = 300,
  clock = true,
  birds = true,
  className = '',
  ...rest
}) {
  const state = sky || skyForHour();
  return /*#__PURE__*/React.createElement("header", _extends({
    className: `at-sky ${className}`,
    "data-sky": state,
    style: {
      position: 'relative',
      height,
      overflow: 'hidden'
    }
  }, rest), state === 'night' || state === 'dusk' ? /*#__PURE__*/React.createElement(Stars, null) : null, state === 'day' || state === 'dusk' ? /*#__PURE__*/React.createElement("div", {
    className: "at-balloon",
    "aria-hidden": "true"
  }) : null, birds ? /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "at-bird-path"
  }, /*#__PURE__*/React.createElement("div", {
    className: "at-bird",
    style: {
      marginTop: 150,
      animationDelay: '-0.5s'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "at-bird-path",
    style: {
      animationDuration: '17s',
      animationDelay: '4s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "at-bird",
    style: {
      animationDuration: '0.8s',
      animationDelay: '-0.75s'
    }
  }))) : null, /*#__PURE__*/React.createElement("div", {
    className: "at-city",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '100%'
    }
  }, clock ? /*#__PURE__*/React.createElement("div", {
    className: "at-clock",
    "aria-hidden": "true"
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 5,
      top: 'calc(50% - 20px)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: href,
    title: title
  }, /*#__PURE__*/React.createElement("span", {
    className: "at-wordmark",
    "data-heading": title
  }, /*#__PURE__*/React.createElement("span", {
    className: "at-wordmark-shimmer"
  }, title))))));
}
Object.assign(__ds_scope, { skyForHour, SiteHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/App.jsx
try { (() => {
/* The shell every screen sits in: header, navigation, content column, footer.
 * Search filters the entry list live and shows the result panel hanging off the
 * navigation's right edge, as it does in production. */
const {
  SiteHeader,
  SiteNav,
  SiteFooter,
  Icon,
  GrowthBadge
} = window.ArticleTimeDesignSystem_de8a72;
function App() {
  const [route, setRoute] = React.useState('home');
  const [openId, setOpenId] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [showWithered, setShowWithered] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const open = id => {
    setOpenId(id);
    setRoute('artikel');
    window.scrollTo({
      top: 0
    });
  };
  const go = label => {
    const map = {
      Artikel: 'home',
      Notizen: 'home',
      Rubriken: 'rubriken',
      Tags: 'tags',
      Archiv: 'archiv'
    };
    setRoute(map[label] || 'home');
    setOpenId(null);
    setQuery('');
    window.scrollTo({
      top: 0
    });
  };
  const hits = query ? ENTRIES.filter(e => `${e.title || ''} ${e.summary} ${(e.tags || []).join(' ')}`.toLowerCase().includes(query.toLowerCase())) : [];
  const results = query ? hits.length ? /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 'var(--spacing-3)'
    }
  }, hits.map(e => /*#__PURE__*/React.createElement("li", {
    key: e.id
  }, /*#__PURE__*/React.createElement("a", {
    href: `#${e.id}`,
    onClick: ev => {
      ev.preventDefault();
      if (e.format !== 'note') open(e.id);
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-3)',
      padding: 'var(--spacing-2) var(--spacing-3)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border-hairline-quiet)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: e.format === 'note' ? 'lightbulb-line' : 'article-line',
    size: "1.25rem"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: 'var(--color-ink)'
    }
  }, e.title || e.summary.slice(0, 60) + '…'), e.growthStage ? /*#__PURE__*/React.createElement(GrowthBadge, {
    stage: e.growthStage
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-ink-muted)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, e.date))))) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontStyle: 'italic',
      color: 'var(--color-ink-muted)'
    }
  }, "Keine Treffer f\xFCr \u201E", query, "\u201C.") : null;
  const entry = openId ? ENTRIES.find(e => e.id === openId) : null;
  const activeLabel = {
    home: 'Artikel',
    artikel: 'Artikel',
    rubriken: 'Rubriken',
    tags: 'Tags',
    archiv: 'Archiv'
  }[route];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SiteHeader, {
    title: "Article Time",
    href: "#home"
  }), /*#__PURE__*/React.createElement(SiteNav, {
    items: MENU,
    active: activeLabel,
    brand: "Artikel",
    logo: "../../assets/images/favicon/favicon-96x96.png",
    follow: [{
      name: 'RSS Feed',
      href: '#',
      icon: 'rss-line'
    }],
    query: query,
    onQuery: setQuery,
    results: results,
    onNavigate: it => go(it.label)
  }), /*#__PURE__*/React.createElement("main", {
    className: "at-page",
    style: {
      minHeight: '60vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--page-max)',
      margin: '0 auto',
      padding: 'var(--spacing-section) var(--spacing-gutter)'
    }
  }, route === 'home' ? /*#__PURE__*/React.createElement(HomeScreen, {
    onOpen: open,
    page: page,
    setPage: setPage,
    showWithered: showWithered,
    setShowWithered: setShowWithered
  }) : null, route === 'artikel' && entry ? /*#__PURE__*/React.createElement(ArticleScreen, {
    entry: entry,
    onOpen: open
  }) : null, route === 'rubriken' ? /*#__PURE__*/React.createElement(TermsScreen, {
    kind: "rubriken",
    onOpen: open
  }) : null, route === 'tags' ? /*#__PURE__*/React.createElement(TermsScreen, {
    kind: "tags",
    onOpen: open
  }) : null, route === 'archiv' ? /*#__PURE__*/React.createElement(ArchiveScreen, {
    onOpen: open
  }) : null)), /*#__PURE__*/React.createElement(SiteFooter, {
    slogan: /*#__PURE__*/React.createElement(React.Fragment, null, "Ein Blog. Ein Autor.", /*#__PURE__*/React.createElement("br", null), "Und viel Zeit."),
    identity: IDENTITY,
    statsIntro: /*#__PURE__*/React.createElement(React.Fragment, null, "Momentan befinden sich 17 ", /*#__PURE__*/React.createElement("a", {
      href: "#home"
    }, "Eintr\xE4ge"), " auf dieser Seite \u2014 davon 2 verwelkt."),
    stats: STATS,
    archiveYears: ARCHIVE,
    menu: FOOTER_MENU,
    version: "v2.1.0",
    copyright: "CC BY-NC-SA 4.0",
    credits: /*#__PURE__*/React.createElement(React.Fragment, null, "Header SVGs von ", /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "pixelliebe"), " | ", /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "shutterstock.com"))
  }));
}
Object.assign(window, {
  App
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ArticleScreen.jsx
try { (() => {
/* Article page. Prose in a panel on the left, metadata tiles and the three
 * sidebar widgets on the right. The withered banner appears above everything when
 * the entry's growth stage says so. */
const {
  Heading,
  Panel,
  InfoTiles,
  InfoTile,
  Tag,
  Hashtag,
  GrowthBadge,
  HeartButton,
  TocSidebar,
  SeriesSidebar,
  RelatedSidebar,
  WitheredBanner,
  Webmention,
  Icon,
  RoundButton,
  GROWTH_STAGES
} = window.ArticleTimeDesignSystem_de8a72;
function ArticleScreen({
  entry,
  onOpen
}) {
  const [hearts, setHearts] = React.useState(entry.hearts || 0);
  const [hearted, setHearted] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const [toc, setToc] = React.useState('#anforderungen');
  const stage = GROWTH_STAGES[entry.growthStage || 'seedling'];
  return /*#__PURE__*/React.createElement(React.Fragment, null, entry.growthStage === 'withered' && !dismissed ? /*#__PURE__*/React.createElement(WitheredBanner, {
    date: entry.date,
    reason: "Die Farbtokens hei\xDFen inzwischen nach ihrer Rolle, nicht nach ihrem Aussehen.",
    replacement: "Bulma raus, Tailwind rein",
    replacementHref: "#bulma-raus",
    onDismiss: () => setDismissed(true)
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--spacing-gutter)',
      gridTemplateColumns: 'minmax(0, 1fr) 19rem',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Panel, {
    as: "article",
    className: "at-prose at-flow",
    style: {
      maxWidth: 'none'
    }
  }, entry.cover ? /*#__PURE__*/React.createElement("figure", {
    className: "at-figure at-figure-float",
    style: {
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "at-card-cover",
    src: entry.cover,
    alt: ""
  }), /*#__PURE__*/React.createElement("figcaption", {
    className: "at-figcaption"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil-line",
    size: "1rem",
    style: {
      verticalAlign: '-3px',
      marginRight: 4
    }
  }), "Aufgenommen an der Kieler F\xF6rde")) : null, /*#__PURE__*/React.createElement(Heading, {
    level: 1
  }, entry.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '1rem 0 var(--spacing-gutter)',
      color: 'var(--color-ink-muted)',
      fontSize: '0.95rem'
    }
  }, "von ", /*#__PURE__*/React.createElement("a", {
    href: "#ueber-mich"
  }, IDENTITY.name)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-lg)',
      lineHeight: 'var(--text-lg--line-height)'
    }
  }, entry.summary), /*#__PURE__*/React.createElement("h2", {
    className: "gd-h2",
    id: "anforderungen",
    style: {
      marginTop: 'var(--spacing-gutter)'
    }
  }, "Die Anforderungen"), /*#__PURE__*/React.createElement("p", null, "Erste Priorit\xE4t, alles ausgeliefert: Tags ", /*#__PURE__*/React.createElement("em", null, "und"), " Kategorien, Serien, ein Inhaltsverzeichnis pro Artikel, zwei Men\xFCs, Markdown als Autorenformat, Suche. Kommentare standen auf der Liste und wurden sp\xE4ter anders beantwortet \u2014 durch IndieWeb-Webmentions statt durch ein Kommentarsystem."), /*#__PURE__*/React.createElement("h3", {
    className: "gd-h3",
    id: "kandidaten"
  }, "Die Kandidaten"), /*#__PURE__*/React.createElement("p", null, "Vier Systeme, f\xFCnfzehn Kriterien. Entscheidend war am Ende nicht das Feature-Blatt, sondern die Frage, was auf Dauer nicht gepflegt werden muss."), /*#__PURE__*/React.createElement("blockquote", {
    className: "at-quoted",
    style: {
      width: '80%',
      margin: '1.5em auto',
      padding: '1.5em 2.5em',
      background: 'hsl(190 11% 10%)',
      borderLeft: '4px solid var(--color-accent)',
      fontFamily: 'var(--font-heading)',
      fontSize: '1.3rem',
      lineHeight: 1.5,
      color: 'var(--color-ink-muted)'
    }
  }, "Fazit: Erst einmal ein privater Blog."), /*#__PURE__*/React.createElement("ul", {
    style: {
      paddingLeft: '1.4em'
    }
  }, /*#__PURE__*/React.createElement("li", null, "Nicht zu gro\xDF, keine tief verschachtelte Auszeichnung."), /*#__PURE__*/React.createElement("li", null, "Flexbox statt Floats, JavaScript optional."), /*#__PURE__*/React.createElement("li", null, "Statisch generiert, Bearbeiten nur lokal.")), (entry.tags || []).length ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0.4em',
      marginTop: 'var(--spacing-gutter)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "price-tag-3-line",
    size: "1.1rem"
  }), (entry.tags || []).map(t => /*#__PURE__*/React.createElement(Hashtag, {
    key: t,
    href: "#tags"
  }, t))) : null, /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      alignItems: 'stretch',
      margin: '2em -1.5rem -1.5rem',
      borderTop: '1px solid color-mix(in srgb, var(--color-accent-muted) 50%, transparent)',
      background: 'var(--color-surface)',
      borderRadius: '0 0 var(--radius-md) var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.4em',
      padding: '1.25rem',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-ink-muted)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "timer-line",
    size: "1.1rem"
  }), entry.readingTime, " Min."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      borderLeft: '1px solid color-mix(in srgb, var(--color-accent-muted) 50%, transparent)',
      borderRight: '1px solid color-mix(in srgb, var(--color-accent-muted) 50%, transparent)'
    }
  }, /*#__PURE__*/React.createElement(HeartButton, {
    count: hearts,
    hearted: hearted,
    hint: hearted ? 'Danke!' : 'einmal pro Besuch',
    onHeart: () => {
      setHearts(hearts + 1);
      setHearted(true);
    }
  })), /*#__PURE__*/React.createElement("a", {
    href: "#reaktionen",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.4em',
      padding: '1.25rem',
      fontSize: 'var(--text-sm)',
      textDecoration: 'none',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-3-line",
    size: "1.1rem"
  }), "3 Reaktionen"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--spacing-gutter)'
    }
  }, /*#__PURE__*/React.createElement(InfoTiles, null, /*#__PURE__*/React.createElement(InfoTile, {
    icon: "pushpin-line",
    label: "Rubrik"
  }, /*#__PURE__*/React.createElement(Tag, {
    href: "#rubriken"
  }, entry.rubrik)), /*#__PURE__*/React.createElement(InfoTile, {
    icon: stage.icon,
    iconColor: `var(--color-${entry.growthStage || 'seedling'})`,
    label: "Stadium",
    stage: entry.growthStage
  }, /*#__PURE__*/React.createElement(GrowthBadge, {
    stage: entry.growthStage,
    showLabel: true,
    tinted: false
  })), /*#__PURE__*/React.createElement(InfoTile, {
    icon: "calendar-line",
    label: "Publiziert"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.15em'
    }
  }, /*#__PURE__*/React.createElement("time", null, entry.date), entry.updated && entry.updated !== entry.date ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: 'var(--color-ink-muted)'
    }
  }, "editiert ", entry.updated) : null)), /*#__PURE__*/React.createElement(InfoTile, {
    icon: "timer-line",
    label: "Lesedauer"
  }, entry.readingTime, " Min."), /*#__PURE__*/React.createElement(InfoTile, {
    icon: "heart-line",
    iconColor: "hsl(0 70% 65%)",
    label: "Herzen"
  }, hearts), /*#__PURE__*/React.createElement(InfoTile, {
    icon: "message-3-line",
    label: "Reaktionen"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#reaktionen"
  }, "3")), /*#__PURE__*/React.createElement(InfoTile, {
    icon: "price-tag-3-line",
    label: "Tags",
    wide: true
  }, (entry.tags || []).map(t => /*#__PURE__*/React.createElement(Hashtag, {
    key: t,
    href: "#tags"
  }, t)))), /*#__PURE__*/React.createElement(TocSidebar, {
    current: toc,
    items: [{
      label: 'Die Anforderungen',
      href: '#anforderungen'
    }, {
      label: 'Die Kandidaten',
      href: '#kandidaten',
      children: [{
        label: 'WordPress',
        href: '#wordpress'
      }, {
        label: 'Jekyll',
        href: '#jekyll'
      }]
    }, {
      label: 'Fazit',
      href: '#fazit'
    }]
  }), entry.series ? /*#__PURE__*/React.createElement(SeriesSidebar, {
    title: "Der Neustart",
    href: "#serien",
    current: `#${entry.id}`,
    items: [{
      label: 'Die Diagnose',
      href: '#die-diagnose'
    }, {
      label: 'Warum Hugo',
      href: '#warum-hugo'
    }, {
      label: 'Bulma raus, Tailwind rein',
      href: '#bulma-raus'
    }, {
      label: 'Der alte Farbentwurf',
      href: '#alte-farben',
      withered: true
    }]
  }) : null, /*#__PURE__*/React.createElement(RelatedSidebar, {
    items: ENTRIES.filter(e => e.format === 'article' && e.id !== entry.id).slice(0, 3).map(e => ({
      label: e.title,
      href: `#${e.id}`,
      date: e.date
    }))
  }))), /*#__PURE__*/React.createElement("section", {
    id: "reaktionen",
    style: {
      gridColumn: 1,
      marginTop: 'var(--spacing-section)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "gd-h2"
  }, "Reaktionen"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--spacing-gutter)',
      maxWidth: '70ch',
      color: 'var(--color-ink-muted)',
      fontSize: 'var(--text-sm)'
    }
  }, "Kein Kommentarfeld \u2014 Antworten kommen als Webmention von der Seite, auf der sie geschrieben wurden."), /*#__PURE__*/React.createElement("h3", {
    className: "gd-h3"
  }, "Antworten"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: '0 0 var(--spacing-gutter)',
      padding: 0,
      display: 'grid',
      gap: 'var(--spacing-3)',
      gridTemplateColumns: 'repeat(auto-fill, minmax(22rem, 1fr))'
    }
  }, /*#__PURE__*/React.createElement(Webmention, {
    type: "reply",
    author: "@leser@norden.social",
    authorUrl: "#",
    avatar: "../../assets/images/identity/angel.webp",
    content: "Genau diese Reihenfolge \u2014 erst Code, dann Design \u2014 hat bei mir auch als Einziges funktioniert.",
    source: "#",
    sourceLabel: "norden.social"
  }), /*#__PURE__*/React.createElement(Webmention, {
    type: "reply",
    author: "@theo@chaos.social",
    authorUrl: "#",
    content: "Der Absatz \xFCber die Kaskadenschicht hat mir eine Woche gespart.",
    source: "#",
    sourceLabel: "chaos.social"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "gd-h3"
  }, "Likes und Reposts"), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement(Webmention, {
    type: "like",
    author: "@jemand@chaos.social",
    source: "#",
    sourceLabel: "chaos.social"
  }), /*#__PURE__*/React.createElement(Webmention, {
    type: "like",
    author: "@nina@norden.social",
    source: "#",
    sourceLabel: "norden.social"
  }), /*#__PURE__*/React.createElement(Webmention, {
    type: "repost",
    author: "hugo-weekly.dev",
    source: "#",
    sourceLabel: "hugo-weekly.dev"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: 'var(--spacing-gutter)'
    }
  }, /*#__PURE__*/React.createElement(RoundButton, {
    icon: "arrow-up-s-fill",
    size: "lg",
    label: "Nach oben",
    onClick: () => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })));
}
Object.assign(window, {
  ArticleScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ArticleScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Home — the card feed. Weighted entries first, then everything else by date.
 * A fixed grid: one column on phones, two on desktop, three on very wide screens. */
const {
  ArticleCard,
  Heading,
  Panel,
  Pagination,
  Check
} = window.ArticleTimeDesignSystem_de8a72;
function HomeScreen({
  onOpen,
  page,
  setPage,
  showWithered,
  setShowWithered
}) {
  const visible = showWithered ? ENTRIES : ENTRIES.filter(e => e.growthStage !== 'withered');
  const hidden = ENTRIES.length - visible.length;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Panel, {
    style: {
      marginBottom: 'var(--spacing-gutter)'
    }
  }, /*#__PURE__*/React.createElement(Heading, {
    level: 1
  }, "Artikel"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: '70ch',
      margin: '1.5rem 0 0',
      color: 'var(--color-ink)'
    }
  }, "Ein Blog im IndieWeb, geschrieben von einer Person. Rubriken, Tags, Serien und ein Archiv \u2014 wie ein Magazin aufgebaut, nur eben ohne Redaktion.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-gutter)',
      margin: 'var(--spacing-gutter) 0'
    }
  }, /*#__PURE__*/React.createElement(Check, {
    label: "Verwelkte Eintr\xE4ge anzeigen",
    checked: showWithered,
    onChange: e => setShowWithered(e.target.checked)
  }), hidden > 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-ink-muted)'
    }
  }, hidden, " ", hidden === 1 ? 'Eintrag ist' : 'Einträge sind', " verwelkt und ausgeblendet.") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: '1rem 1.75rem',
      gridTemplateColumns: 'repeat(auto-fill, minmax(30rem, 1fr))'
    }
  }, visible.map(e => /*#__PURE__*/React.createElement(ArticleCard, _extends({
    key: e.id
  }, e, {
    href: e.format === 'note' ? undefined : `#${e.id}`,
    rubrikHref: e.rubrik ? '#rubriken' : undefined,
    onClick: e.format === 'note' ? undefined : ev => {
      ev.preventDefault();
      onOpen(e.id);
    }
  })))), /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    pages: 3,
    onPage: setPage
  }));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/TermsScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Rubriken and Tags overviews, and the archive page. All three are the same
 * page shape as home — a heading and a grid of cards — because a taxonomy is
 * just another feed. */
const {
  Heading,
  TermCard,
  ArchiveWidget,
  ArticleCard,
  Hashtag,
  Panel
} = window.ArticleTimeDesignSystem_de8a72;
function TermsScreen({
  kind,
  onOpen
}) {
  if (kind === 'tags') {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Heading, {
      level: 1
    }, "Tags"), /*#__PURE__*/React.createElement("p", {
      style: {
        maxWidth: '70ch',
        margin: '1.5rem 0 var(--spacing-gutter)'
      }
    }, "Freie Schlagworte, mehrere pro Eintrag. Die Rubrik ist etwas anderes: genau eine pro Eintrag."), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }
    }, TAGS.map(t => /*#__PURE__*/React.createElement(Hashtag, {
      key: t,
      href: "#tags"
    }, t)))));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Heading, {
    level: 1
  }, "Rubriken"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: '70ch',
      margin: '1.5rem 0 var(--spacing-gutter)'
    }
  }, "Genau eine Rubrik pro Eintrag \u2014 sie h\xE4ngt als Banderole an der Ecke jeder Karte. Verwelkte Eintr\xE4ge sind aus den Zahlen herausgerechnet."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--spacing-gutter)',
      gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))'
    }
  }, RUBRIKEN.map(r => /*#__PURE__*/React.createElement(TermCard, _extends({
    key: r.title
  }, r, {
    href: "#rubriken"
  })))));
}
function ArchiveScreen({
  onOpen
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Heading, {
    level: 1
  }, "Archiv"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: '70ch',
      margin: '1.5rem 0 var(--spacing-gutter)'
    }
  }, "Alles, nach Jahren. Die einzige \xDCbersicht, die verwelkte Eintr\xE4ge mitz\xE4hlt \u2014 ein Archiv, das etwas verschweigt, ist keins."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--spacing-gutter)',
      gridTemplateColumns: 'minmax(0, 1fr) 19rem',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--spacing-gutter)'
    }
  }, ARCHIVE.map(y => /*#__PURE__*/React.createElement("section", {
    key: y.year,
    id: y.year
  }, /*#__PURE__*/React.createElement("h2", {
    className: "gd-h2"
  }, y.year), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 'var(--spacing-gutter)',
      gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))'
    }
  }, ENTRIES.filter(e => e.format === 'article').slice(0, y.year === '2026' ? 3 : 1).map(e => /*#__PURE__*/React.createElement(ArticleCard, _extends({
    key: `${y.year}-${e.id}`
  }, e, {
    cover: undefined,
    summary: undefined,
    tags: [],
    href: `#${e.id}`,
    rubrikHref: "#rubriken",
    onClick: ev => {
      ev.preventDefault();
      onOpen(e.id);
    }
  }))))))), /*#__PURE__*/React.createElement(Panel, null, /*#__PURE__*/React.createElement(ArchiveWidget, {
    years: ARCHIVE,
    showButton: false
  }))));
}
Object.assign(window, {
  TermsScreen,
  ArchiveScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/TermsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.jsx
try { (() => {
/* Fake content for the UI kit. Titles, Rubriken and Tags follow the real
 * repository: the neustart branch is a Hugo blog documenting its own rebuild. */
const AT = window.ArticleTimeDesignSystem_de8a72;
const IDENTITY = {
  name: 'Angel Crawford',
  photo: '../../assets/images/identity/angel.webp',
  note: 'Web Entwickler. Sonnenliebhaber. Goth.',
  aboutUrl: '#ueber-mich',
  siteUrl: '#',
  socials: [{
    name: 'Mastodon',
    href: '#',
    icon: 'mastodon-fill',
    color: '#6364FF'
  }, {
    name: 'Instagram',
    href: '#',
    icon: 'instagram-line',
    color: '#c13584'
  }, {
    name: 'GitHub',
    href: '#',
    icon: 'github-line',
    color: '#bbbbbb'
  }],
  mostLoved: [{
    label: 'Warum Hugo',
    href: '#warum-hugo',
    hearts: 41
  }, {
    label: 'Erst die Programmierung',
    href: '#note-1',
    hearts: 23
  }, {
    label: 'Bulma raus, Tailwind rein',
    href: '#bulma-raus',
    hearts: 18
  }]
};
const MENU = [{
  label: 'Artikel',
  href: '#home',
  icon: 'article-line'
}, {
  label: 'Notizen',
  href: '#notizen',
  icon: 'lightbulb-line'
}, {
  label: 'Rubriken',
  href: '#rubriken',
  icon: 'pushpin-line'
}, {
  label: 'Tags',
  href: '#tags',
  icon: 'price-tag-3-line'
}, {
  label: 'Archiv',
  href: '#archiv',
  icon: 'bookmark-line'
}];
const FOOTER_MENU = [{
  label: 'Impressum',
  href: '#'
}, {
  label: 'Datenschutz',
  href: '#'
}, {
  label: 'Styleguide',
  href: '#'
}, {
  label: 'RSS',
  href: '#'
}];
const ENTRIES = [{
  id: 'warum-hugo',
  format: 'article',
  title: 'Warum Hugo',
  date: '06.08.26',
  updated: '07.08.26',
  rubrik: 'Allgemein',
  rubrikColor: '#4e97b3',
  cover: '../../assets/images/covers/rubriken-cover.jpg',
  summary: 'Fünfzehn Kriterien, vier Kandidaten. WordPress ein permanentes Update-Laufband mit einem Backend, das gesichert werden muss. Grav dünn dokumentiert und ohne zwei getrennte Menüs. Jekyll erst gewählt, dann verworfen, weil GitHub Pages Fremd-Plugins abschaltet. Geblieben ist Hugo: von der Profilkarte bereits bekannt, SEO, Sitemap und RSS eingebaut, und Bearbeiten nur lokal — genau die erklärte Vorliebe.',
  tags: ['hugo', 'static-site'],
  readingTime: 7,
  growthStage: 'evergreen',
  hearts: 41,
  series: true,
  featured: true
}, {
  id: 'bulma-raus',
  format: 'article',
  title: 'Bulma raus, Tailwind rein',
  date: '02.08.26',
  rubrik: 'Kategorie 1',
  rubrikColor: '#c463cc',
  summary: '4.355 Zeilen SCSS über 29 Dateien, allein card.scss mit 552 — nicht weil es Komponenten gab, sondern weil jede Komponente ihre Werte neu erfand. Der Umbau tauscht nicht nur das Framework: er verschiebt die Entscheidung über Farbe, Abstand und Radius aus den Komponenten heraus in einen einzigen Token-Block. Zwei Stylesheets teilen sich vorerst die Seite, deshalb liegt Bulma in einer Cascade Layer und verliert damit jeden Konflikt.',
  tags: ['tailwind', 'css', 'migration'],
  readingTime: 11,
  growthStage: 'budding',
  hearts: 18
}, {
  id: 'note-1',
  format: 'note',
  summary: 'Design und Programmierung müssen getrennt voneinander statt finden! Erst die Programmierung, dann das komplette Design.',
  date: '31.07.26',
  hearts: 23,
  rubrik: 'Allgemein',
  rubrikColor: '#4e97b3'
}, {
  id: 'die-diagnose',
  format: 'article',
  title: 'Die Diagnose',
  date: '28.07.26',
  rubrik: 'Allgemein',
  rubrikColor: '#4e97b3',
  cover: '../../assets/images/covers/tags-cover.jpg',
  summary: 'Vom Mehrautoren-Portal über den Co-Autoren-Blog und den Digital Garden zum privaten IndieWeb-Blog. Der Weg wurde vollständig gegangen, obwohl die Notiz von 2020 die Antwort schon enthielt: erst einmal ein privater Blog. Zu hohe Anforderungen, kombiniert mit der Unklarheit darüber, wo es überhaupt hin soll — das ist die eigentliche Ursache, nicht die Technik.',
  tags: ['scope', 'indieweb'],
  readingTime: 5,
  growthStage: 'evergreen',
  hearts: 23,
  series: true
}, {
  id: 'alte-farben',
  format: 'article',
  title: 'Der alte Farbentwurf',
  date: '12.03.24',
  rubrik: 'Movie',
  rubrikColor: '#4e974e',
  summary: 'Die erste Fassung benannte Farben nach ihrem Aussehen — dark, light, gold — und produzierte damit Widersprüche wie color-dark-lighter. Der Beitrag steht noch, weil die Begründung erhalten bleiben soll.',
  tags: ['farben'],
  readingTime: 4,
  growthStage: 'withered',
  hearts: 2
}, {
  id: 'note-2',
  format: 'note',
  summary: 'Ein Styleguide, der von Hand gepflegt wird, driftet innerhalb eines Monats.',
  date: '20.07.26',
  hearts: 9
}];
const RUBRIKEN = [{
  title: 'Allgemein',
  count: 9,
  cover: '../../assets/images/covers/rubriken-cover.jpg'
}, {
  title: 'Kategorie 1',
  count: 3,
  cover: '../../assets/images/covers/tags-cover.jpg'
}, {
  title: 'Movie',
  count: 2
}];
const TAGS = ['hugo', 'static-site', 'tailwind', 'css', 'migration', 'indieweb', 'scope', 'farben'];
const ARCHIVE = [{
  year: '2026',
  count: 14
}, {
  year: '2024',
  count: 2
}, {
  year: '2020',
  count: 1
}];
const STATS = [{
  label: 'Artikel',
  count: 14,
  icon: 'article-line',
  color: 'rgb(88,179,189)'
}, {
  label: 'Notizen',
  count: 3,
  icon: 'lightbulb-line',
  color: 'hsl(29,100%,80%)'
}];
Object.assign(window, {
  AT,
  IDENTITY,
  MENU,
  FOOTER_MENU,
  ENTRIES,
  RUBRIKEN,
  TAGS,
  ARCHIVE,
  STATS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ArticleCard = __ds_scope.ArticleCard;

__ds_ns.GROWTH_STAGES = __ds_scope.GROWTH_STAGES;

__ds_ns.GrowthBadge = __ds_scope.GrowthBadge;

__ds_ns.HeartButton = __ds_scope.HeartButton;

__ds_ns.InfoTiles = __ds_scope.InfoTiles;

__ds_ns.InfoTile = __ds_scope.InfoTile;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Hashtag = __ds_scope.Hashtag;

__ds_ns.Ribbon = __ds_scope.Ribbon;

__ds_ns.TermCard = __ds_scope.TermCard;

__ds_ns.Webmention = __ds_scope.Webmention;

__ds_ns.WitheredBanner = __ds_scope.WitheredBanner;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Heading = __ds_scope.Heading;

__ds_ns.LinedTitle = __ds_scope.LinedTitle;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Message = __ds_scope.Message;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.RoundButton = __ds_scope.RoundButton;

__ds_ns.Check = __ds_scope.Check;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.ArchiveWidget = __ds_scope.ArchiveWidget;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.SiteNav = __ds_scope.SiteNav;

__ds_ns.TocSidebar = __ds_scope.TocSidebar;

__ds_ns.SeriesSidebar = __ds_scope.SeriesSidebar;

__ds_ns.RelatedSidebar = __ds_scope.RelatedSidebar;

__ds_ns.HCard = __ds_scope.HCard;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SiteHeader = __ds_scope.SiteHeader;

})();
