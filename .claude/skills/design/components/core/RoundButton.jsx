import React from 'react';
import { Icon } from './Icon.jsx';

/* The press effect, and the only surviving neumorphism in the system. Raised at
 * rest: dark shadow below-right plus a faint light one above-left, which makes
 * the disc read as formed out of the page. Pressed: the same pair inverted to
 * inset, plus 2px of travel. Inverting the pair is the whole trick. */
export function RoundButton({ icon, size = 'md', fullGlyph = false, as = 'button', label, children, className = '', ...rest }) {
  const Tag = as;
  return (
    <Tag
      className={`gd-round-button${size === 'lg' ? ' gd-round-button-lg' : ''}${fullGlyph ? ' gd-round-button-full' : ''} ${className}`}
      aria-label={label}
      title={label}
      {...rest}
    >
      {icon ? <Icon name={icon} variant="plain" size="100%" color="currentColor" /> : children}
    </Tag>
  );
}
