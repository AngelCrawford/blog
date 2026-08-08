export interface WitheredBannerProps {
  /** Already formatted DD.MM.YY — when the entry was last tended. */
  date?: string;
  /** Why it withered, in the author's own words. */
  reason?: string;
  /** Title of the article that replaces this one, if there is one. */
  replacement?: string;
  replacementHref?: string;
  /** Omit to render the banner non-dismissible. */
  onDismiss?: () => void;
  className?: string;
}
export declare function WitheredBanner(props: WitheredBannerProps): JSX.Element;
