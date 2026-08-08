export interface HeadingProps {
  /** 1 = page title with the gold gradient (once per page). 2 = section heading
   *  with the gold rule. 3 = gold sub-heading. */
  level?: 1 | 2 | 3;
  /** Level 1 only: overrides the text copied into data-heading. Children are
   *  flattened to a string automatically, so this is rarely needed. */
  text?: string;
  children?: React.ReactNode;
  className?: string;
}
export declare function Heading(props: HeadingProps): JSX.Element;

export interface LinedTitleProps {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  className?: string;
}
export declare function LinedTitle(props: LinedTitleProps): JSX.Element;
