export interface GrowthBadgeProps {
  /** Missing or unknown falls back to seedling, as the Hugo partial does. */
  stage?: 'seedling' | 'budding' | 'evergreen' | 'withered';
  /** Icon-only inside card footers; label visible in article sidebars. */
  showLabel?: boolean;
  /** Duotone in the stage hue (default) vs a single flat glyph. */
  tinted?: boolean;
  size?: string;
  className?: string;
}
export declare function GrowthBadge(props: GrowthBadgeProps): JSX.Element;
export declare const GROWTH_STAGES: Record<string, { icon: string; label: string; tooltip: string }>;
