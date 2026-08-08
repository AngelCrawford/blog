export interface MessageProps {
  tone?: 'success' | 'warning' | 'error';
  children?: React.ReactNode;
  className?: string;
}
export declare function Message(props: MessageProps): JSX.Element;
