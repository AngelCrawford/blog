export interface ButtonProps {
  /** primary = filled gold; secondary = gold outline that fills on hover. */
  variant?: 'primary' | 'secondary';
  /** Render as an anchor when the action navigates. */
  as?: 'button' | 'a';
  href?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  className?: string;
}
export declare function Button(props: ButtonProps): JSX.Element;
