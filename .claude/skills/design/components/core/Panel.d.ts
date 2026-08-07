export interface PanelProps {
  /** plain = same footprint, no fill: groups without spending a depth level. */
  plain?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  className?: string;
}
export declare function Panel(props: PanelProps): JSX.Element;
