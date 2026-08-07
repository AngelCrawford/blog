import React from 'react';

/* Checkbox and radio, rebuilt. The checkmark is a clip-path polygon rather than
 * a glyph, so it needs no font and no sprite. */
export function Check({ type = 'checkbox', label, className = '', ...rest }) {
  const input = <input type={type} className={`gd-check ${className}`} {...rest} />;
  if (!label) return input;
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
      {input}
      <span>{label}</span>
    </label>
  );
}
