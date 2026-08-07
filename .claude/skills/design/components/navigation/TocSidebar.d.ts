export interface TocItem { label: string; href: string; children?: TocItem[] }

export interface TocSidebarProps {
  label?: string;
  items?: TocItem[];
  /** href of the section currently in view (scroll-spy hook). */
  current?: string;
  className?: string;
}
export declare function TocSidebar(props: TocSidebarProps): JSX.Element;

export interface SeriesItem { label: string; href: string; withered?: boolean }

export interface SeriesSidebarProps {
  label?: string;
  /** Name of the series, linking to its term page. */
  title?: string;
  href?: string;
  items?: SeriesItem[];
  /** href of the article being read — rendered as a span, not a link. */
  current?: string;
  className?: string;
}
export declare function SeriesSidebar(props: SeriesSidebarProps): JSX.Element;

export interface RelatedItem { label: string; href: string; date?: string }

export interface RelatedSidebarProps {
  label?: string;
  items?: RelatedItem[];
  className?: string;
}
export declare function RelatedSidebar(props: RelatedSidebarProps): JSX.Element;
