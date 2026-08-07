import React from 'react';

/* A component, not a pile of utilities repeated at every call site. The label
 * weight is a real decision — buttons read as actionable partly because they are
 * a little heavier than the prose around them. */
export function Button({ variant = 'primary', as = 'button', children, className = '', ...rest }) {
  const Tag = as;
  return (
    <Tag className={`gd-button${variant === 'secondary' ? ' gd-button-secondary' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
