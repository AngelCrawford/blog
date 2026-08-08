/**
 * @startingPoint section="IndieWeb" subtitle="h-card als IndieWeb-Visitenkarte mit rel=me-Silos" viewport="360x520"
 */
export interface HCardSocial {
  name: string;
  href: string;
  /** Remixicon symbol id, e.g. "mastodon-fill". */
  icon: string;
  /** The silo's own brand colour — the one place non-palette colour is allowed. */
  color?: string;
  opacity?: number;
}

export interface HCardProps {
  name?: string;
  /** 120px round u-photo. */
  photo?: string;
  /** Short bio — the p-note. One line, no full stop needed. */
  note?: string;
  /** Only the IndieWeb-relevant rel=me silos belong here; the full list lives on
   *  the profile page. */
  socials?: HCardSocial[];
  aboutUrl?: string;
  /** Canonical identity URL for u-url / u-uid / rel=me. */
  siteUrl?: string;
  label?: string;
  className?: string;
}
export declare function HCard(props: HCardProps): JSX.Element;
