export interface FieldProps {
  /** input (default), textarea or select. Pass <option>s as children for select. */
  as?: 'input' | 'textarea' | 'select';
  /** Renders the 14px muted caption above the control and wraps both in a label. */
  label?: string;
  hint?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent) => void;
  children?: React.ReactNode;
  className?: string;
}
export declare function Field(props: FieldProps): JSX.Element;
