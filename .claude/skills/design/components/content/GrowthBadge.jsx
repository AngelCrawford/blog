import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* The digital-garden signal: four stages, four tints, and the tint goes on the
 * GLYPH — never as a background and never as a text colour. That is why the
 * growth colours sit with the icons in the styleguide rather than in the palette.
 * Missing stage falls back to seedling, matching the Hugo partial. */
export const GROWTH_STAGES = {
  seedling:  { icon: 'seedling-line', label: 'Seedling',  tooltip: 'Seedling; früher Entwurf' },
  budding:   { icon: 'flower-line',   label: 'Budding',   tooltip: 'Budding; in Entwicklung' },
  evergreen: { icon: 'tree-line',     label: 'Evergreen', tooltip: 'Evergreen; gepflegt & aktuell' },
  withered:  { icon: 'skull-2-line',  label: 'Withered',  tooltip: 'Withered; veraltet' },
};

export function GrowthBadge({ stage = 'seedling', showLabel = false, tinted = true, size = '1.2em', className = '', ...rest }) {
  const s = GROWTH_STAGES[stage] || GROWTH_STAGES.seedling;
  return (
    <span className={`at-growth ${className}`} data-stage={stage} data-tooltip={s.tooltip} title={s.tooltip} {...rest}>
      <Icon
        name={s.icon}
        variant={tinted ? 'duo' : 'plain'}
        className={tinted ? 'gd-icon-duo-tinted' : ''}
        size={size}
        color="currentColor"
      />
      {showLabel ? <span>{s.label}</span> : null}
    </span>
  );
}
