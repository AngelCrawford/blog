import React from 'react';

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

export function Heading({ level = 2, text, children, className = '', ...rest }) {
  const Tag = `h${level}`;
  if (level === 1) {
    return <Tag className={`gd-h1 ${className}`} data-heading={text || flatten(children)} {...rest}>{children}</Tag>;
  }
  return <Tag className={`gd-h${level === 3 ? 3 : 2} ${className}`} {...rest}>{children}</Tag>;
}

/* Centred title with a gold rule to both sides — the footer column headings.
 * One of the few pieces of the old design that was really successful. */
export function LinedTitle({ as = 'p', children, className = '', ...rest }) {
  const Tag = as;
  return <Tag className={`gd-lined-title ${className}`} {...rest}>{children}</Tag>;
}
