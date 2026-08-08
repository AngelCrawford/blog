import type { HCardProps } from './HCard';

export interface FooterStat { label: string; count: number; icon: string; color?: string }
export interface FooterLink { label: string; href: string }

export interface SiteFooterProps {
  /** Two lines at most, set in Montserrat Alternates between gold quote marks. */
  slogan?: React.ReactNode;
  /** Everything HCard takes, plus `mostLoved` for the second column. `mostLoved` is
   *  stripped before the rest is handed to HCard — it is footer content, not an
   *  h-card property, and must never reach the DOM as an attribute. */
  identity?: HCardProps & { mostLoved?: Array<{ label: string; href: string; hearts: number }> };
  /** Per-format entry counts. Withered entries are included here. */
  stats?: FooterStat[];
  /** The sentence above the counts, e.g. "Momentan befinden sich 17 Einträge…". */
  statsIntro?: React.ReactNode;
  archiveYears?: Array<{ year: string; count: number }>;
  /** Impressum, Datenschutz, Styleguide … */
  menu?: FooterLink[];
  copyright?: React.ReactNode;
  /** git-describe output, or "dev" locally. */
  version?: string;
  /** Asset attributions — the header SVGs are licensed stock and must be credited. */
  credits?: React.ReactNode;
  className?: string;
}
export declare function SiteFooter(props: SiteFooterProps): JSX.Element;
