export interface RoundButtonProps {
  /** Remixicon symbol id. Compact `-s-` arrows want the default icon box. */
  icon?: string;
  /** md = 48px (default), lg = 55px — what the back-to-top button uses. */
  size?: 'md' | 'lg';
  /** Set for glyphs that fill their 24×24 viewBox (heart-line, star-fill).
   *  Shrinks the icon box so they match the arrows in an identical button. */
  fullGlyph?: boolean;
  as?: 'button' | 'a';
  href?: string;
  /** Required in practice — the button is icon-only, so this is its name. */
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  className?: string;
}
export declare function RoundButton(props: RoundButtonProps): JSX.Element;
