import React from 'react';

/* The scoped baseline strips the browser's own styling from form controls; this
 * puts a deliberate one back. Native select and checkbox rendering cannot be
 * themed on most platforms, so both are rebuilt in CSS: the arrow is two
 * gradients meeting in a chevron, the checkmark a clip-path polygon. */
export function Field({ as = 'input', label, hint, children, className = '', ...rest }) {
  const Tag = as;
  const control = <Tag className={`gd-field ${className}`} {...rest}>{children}</Tag>;
  if (!label) return control;
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)' }}>{label}</span>
      {control}
      {hint ? <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)' }}>{hint}</span> : null}
    </label>
  );
}
