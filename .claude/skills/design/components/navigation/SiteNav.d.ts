export interface NavItem { label: string; href: string; icon?: string }
export interface FollowItem { name: string; href: string; icon: string }

export interface SiteNavProps {
  /** Main menu, in order. German plural labels: Artikel, Notizen, Rubriken, Tags, Serien. */
  items?: NavItem[];
  /** Right-hand icon links — in production this is RSS only. */
  follow?: FollowItem[];
  /** Label of the current item; gets gold, aria-current and the fading underline. */
  active?: string;
  /** Accessible name of the home link, and the drawer's own heading. */
  brand?: string;
  /** Favicon path used as the brand mark; there is no wordmark logo file. With a
   *  logo the bar shows the mark ALONE — the header's wordmark above already names
   *  the site. Without one, `brand` renders as text. */
  logo?: string;
  query?: string;
  /** Result rows for the dropdown panel, anchored to the nav's right edge. */
  results?: React.ReactNode;
  onQuery?: (value: string) => void;
  /** Called with the clicked NavItem; prevents default so a mock can route. */
  onNavigate?: (item: NavItem) => void;
  /** Controls the mobile drawer. Omit to let the component own it; pass `true` to
   *  hold it open in a specimen (body scroll is then left alone). */
  drawerOpen?: boolean;
  onDrawerToggle?: (open: boolean) => void;
  className?: string;
}
export declare function SiteNav(props: SiteNavProps): JSX.Element;
