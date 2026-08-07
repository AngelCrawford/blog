import React from 'react';

/* For messages, form validation and build/deploy feedback. The state colour IS
 * the text here (on a dark surface), not a background behind dark text — which
 * is why the tokens are lighter than the Bulma equivalents they replaced. */
export function Message({ tone = 'success', children, className = '', ...rest }) {
  return <p className={`gd-message gd-message-${tone} ${className}`} {...rest}>{children}</p>;
}
