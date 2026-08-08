import React from 'react';

/* Remixicon, self-hosted as an SVG sprite. Every glyph on the site comes from
 * assets/icons/remixicon.symbol.svg — there is no second icon set and no emoji.
 *
 * References are SAME-DOCUMENT (`#name`): the page loads
 * assets/icons/inline-sprite.js once, which injects the sprite into the DOM.
 * Cross-document `<use>` is silently dropped by several rendering contexts —
 * print, canvas rasterisation, sandboxed previews — and the icon vanishes with
 * no error. Set window.AT_SPRITE to a URL only if you deliberately want the
 * cross-document form. */
export function spritePath() {
  return (typeof window !== 'undefined' && window.AT_SPRITE) || '';
}

export function Icon({ name, variant = 'duo', fill, size = '1.25em', color, title, style, className = '', ...rest }) {
  const src = rest.sprite != null ? rest.sprite : spritePath();
  delete rest.sprite;
  const back = fill || (name.endsWith('-line') ? name.replace(/-line$/, '-fill') : name);

  /* Duotone: the filled body behind in muted gold, the line in front in the
   * accent. Size comes from font-size, never width/height — the shadow offset is
   * in em so it stays proportional at any size. */
  if (variant === 'duo') {
    return (
      <span
        className={`gd-icon-duo ${className}`}
        style={{ fontSize: size, color, ...style }}
        title={title}
        aria-hidden={title ? undefined : 'true'}
        {...rest}
      >
        <svg viewBox="0 0 24 24"><use href={`${src}#${back}`}></use></svg>
        <svg viewBox="0 0 24 24"><use href={`${src}#${name}`}></use></svg>
      </span>
    );
  }

  /* Glyphs without a `-fill` partner: same offset via drop-shadow, which follows
   * the rendered alpha and so works on a hairline shape.
   *
   * font-size is set alongside width/height on purpose: the offset in
   * .gd-icon-shadow is in em, and em on an svg resolves against its FONT size,
   * not its box. Without this a 56px icon kept a 16px-worth shadow and the effect
   * simply vanished at display sizes. */
  return (
    <svg
      className={`${variant === 'line' ? 'gd-icon-shadow ' : ''}${className}`}
      style={{ width: size, height: size, fontSize: size, flex: 'none', fill: 'currentColor', color: color || 'var(--color-accent)', ...style }}
      viewBox="0 0 24 24"
      title={title}
      aria-hidden={title ? undefined : 'true'}
      {...rest}
    >
      <use href={`${src}#${name}`}></use>
    </svg>
  );
}
