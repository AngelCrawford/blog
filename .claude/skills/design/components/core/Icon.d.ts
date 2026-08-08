export interface IconProps {
  /** Remixicon symbol id, e.g. "seedling-line", "arrow-up-s-fill". */
  name: string;
  /** duo = filled body behind + line in front (the house default). line = single
   *  glyph with the same offset shadow, for glyphs with no -fill partner.
   *  plain = no shadow at all. */
  variant?: 'duo' | 'line' | 'plain';
  /** Back-layer glyph for duotone. Defaults to name with -line swapped for -fill. */
  fill?: string;
  /** Any CSS length. Duotone sizes itself from font-size, so em works. */
  size?: string;
  /** Overrides the accent gold — used for growth-stage tints. */
  color?: string;
  /** Present = the icon is meaningful; absent = aria-hidden. */
  title?: string;
  /** Sprite URL override. Normally set once per page via window.AT_SPRITE. */
  sprite?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
export declare function spritePath(): string;
