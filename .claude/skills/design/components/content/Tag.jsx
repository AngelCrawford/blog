import React from 'react';

/* Two flavours of label, and they are not interchangeable:
 * Badge    — the Rubrik (category). Neutral pill, coloured dot, one per entry.
 * Hashtag  — a free tag. Pill, gold text on a barely-raised fill, many per entry.
 * Tag      — the solid Rubrik chip, for sidebar tile values.
 * Ribbon   — the Rubrik hung off the corner of a card. Kept for the note card and
 *            anywhere the label has to sit ON an image. */
export function Badge({ href, dot, children, className = '', style, ...rest }) {
  const Tag_ = href ? 'a' : 'span';
  return (
    <Tag_ className={`at-badge ${className}`} href={href} style={{ '--at-badge-dot': dot, ...style }} {...rest}>
      {children}
    </Tag_>
  );
}

export function Tag({ href, children, color, className = '', ...rest }) {
  const Tag_ = href ? 'a' : 'span';
  return (
    <Tag_ className={`at-tag ${className}`} href={href} style={color ? { background: color } : undefined} {...rest}>
      {children}
    </Tag_>
  );
}

export function Hashtag({ href, children, className = '', ...rest }) {
  const Tag_ = href ? 'a' : 'span';
  return <Tag_ className={`at-hashtag ${className}`} href={href} {...rest}>#{children}</Tag_>;
}

export function Ribbon({ href, children, color, side = 'left', className = '', style, ...rest }) {
  const Tag_ = href ? 'a' : 'span';
  const pos = side === 'left' ? { top: '3em', left: '-1.66em' } : { top: '1.3em', right: '-3px' };
  return (
    <Tag_ className={`at-ribbon ${className}`} href={href} style={{ ...pos, background: color, ...style }} {...rest}>
      {children}
    </Tag_>
  );
}
