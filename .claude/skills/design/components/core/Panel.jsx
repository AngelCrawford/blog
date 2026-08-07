import React from 'react';

/* Three levels of surface, and the rule is that a level only ever sits on a
 * DIFFERENT level. Panel on page, card on panel or page, never panel on panel —
 * that constraint is what makes depth readable on a palette this dark, where
 * shadows barely register. */
export function Panel({ plain = false, as = 'div', children, className = '', ...rest }) {
  const Tag = as;
  return <Tag className={`${plain ? 'gd-panel-plain' : 'gd-panel'} ${className}`} {...rest}>{children}</Tag>;
}
