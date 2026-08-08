export interface BadgeProps {
  href?: string;
  /** The Rubrik's own colour — rendered as a 0.5em dot, never as a fill.
   *  Falls back to the accent gold. */
  dot?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;

export interface TagProps {
  href?: string;
  /** Per-Rubrik colour from the content front matter (categoryColor). */
  color?: string;
  children?: React.ReactNode;
  className?: string;
}
export declare function Tag(props: TagProps): JSX.Element;

export interface HashtagProps {
  href?: string;
  /** The label without the leading #, which the component adds. */
  children?: React.ReactNode;
  className?: string;
}
export declare function Hashtag(props: HashtagProps): JSX.Element;

export interface RibbonProps {
  href?: string;
  color?: string;
  /** left = hangs off the cover's left edge (any card WITH a cover);
   *  right = notches into the top-right of a text-only card.
   *  Note the upstream class name is inverted: `card.html` adds `is-left` when
   *  there is NO image, while this prop names the visual side. */
  side?: 'left' | 'right';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Ribbon(props: RibbonProps): JSX.Element;
