export interface SiteHeaderProps {
  /** The wordmark text. Written twice internally so the gradient and shadow
   *  layers can read it from data-heading. */
  title?: string;
  href?: string;
  /** Forces a sky state instead of deriving it from the clock — use it to show
   *  all four in a specimen. */
  sky?: 'night' | 'dawn' | 'day' | 'dusk';
  /** 300px on desktop, 200px on phones upstream. */
  height?: number;
  /** The clock face that rises into place on load. */
  clock?: boolean;
  birds?: boolean;
  className?: string;
}
export declare function SiteHeader(props: SiteHeaderProps): JSX.Element;
/** night ≥22 or <5 · dawn <8 · day <19 · dusk otherwise. */
export declare function skyForHour(hour?: number): 'night' | 'dawn' | 'day' | 'dusk';
