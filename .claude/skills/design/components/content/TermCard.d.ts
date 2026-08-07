export interface TermCardProps {
  title?: string;
  href?: string;
  cover?: string;
  coverAlt?: string;
  /** Withered entries are excluded from this count. */
  count?: number;
  /** Per-Rubrik colour applied to the title only. */
  color?: string;
  /** "Artikel" by default; "Einträge" where notes are included. */
  unit?: string;
  className?: string;
}
export declare function TermCard(props: TermCardProps): JSX.Element;
