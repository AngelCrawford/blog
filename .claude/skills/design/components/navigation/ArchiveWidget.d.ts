export interface ArchiveYear { year: string; count: number }

export interface ArchiveWidgetProps {
  label?: string;
  /** Newest year first. Counts include withered entries. */
  years?: ArchiveYear[];
  href?: string;
  /** Hidden on the archive page itself. */
  showButton?: boolean;
  className?: string;
}
export declare function ArchiveWidget(props: ArchiveWidgetProps): JSX.Element;
