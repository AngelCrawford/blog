export interface InfoTilesProps {
  children?: React.ReactNode;
  className?: string;
}
export declare function InfoTiles(props: InfoTilesProps): JSX.Element;

export interface InfoTileProps {
  /** Remixicon symbol id, rendered flat at 1.6rem in the label grey. */
  icon?: string;
  /** Overrides the icon grey — used to tint the Stadium tile per growth stage. */
  iconColor?: string;
  /** Uppercase 11px label: RUBRIK, STADIUM, PUBLIZIERT, TAGS, LESEDAUER … */
  label?: string;
  /** Spans both columns — Tags and Herzen do. */
  wide?: boolean;
  /** Growth stage, exposed as data-stage for per-stage styling. */
  stage?: 'seedling' | 'budding' | 'evergreen' | 'withered';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function InfoTile(props: InfoTileProps): JSX.Element;
