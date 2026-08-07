export interface CheckProps {
  type?: 'checkbox' | 'radio';
  /** Wraps the control in a label with 12px between box and text. */
  label?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}
export declare function Check(props: CheckProps): JSX.Element;
