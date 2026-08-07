export interface ArticleCardProps {
  /** article = title + excerpt + cover. note = the text IS the card, set large
   *  between gold quote marks; notes have no detail page. */
  format?: 'article' | 'note';
  title?: string;
  href?: string;
  /** Article: the excerpt, faded out at the bottom by a protection gradient.
   *  Note: the whole note text. */
  summary?: React.ReactNode;
  /** Already formatted DD.MM.YY — the site never prints a raw timestamp. */
  date?: string;
  /** Only rendered when it differs from date — on the card it appears in the footer
   *  tooltip context rather than the metadata row, which has no room beside the
   *  floated cover. */
  updated?: string;
  /** The Rubrik (category) shown as a corner ribbon. One per entry. */
  rubrik?: string;
  rubrikHref?: string;
  /** The Rubrik's own colour. Rendered as a 0.5em dot on the badge, never as a
   *  fill — per-category colour comes back this way without spending the palette. */
  rubrikColor?: string;
  cover?: string;
  coverAlt?: string;
  /** Image caption from the file's EXIF description. */
  caption?: string;
  /** Free tags, without the leading #. */
  tags?: string[];
  readingTime?: number;
  growthStage?: 'seedling' | 'budding' | 'evergreen' | 'withered';
  hearts?: number;
  /** Part of a series — adds the stack glyph to the footer. */
  series?: boolean;
  /** weight=1 in front matter: a stronger gold border, pinned to the top of the feed. */
  featured?: boolean;
  /** Corner badge across the top-right: { icon: 'sparkling-line', label: 'Neu' }
   *  for recent entries, { icon: 'check-fill', label: 'Gesehen' } for ones this
   *  visitor has already opened. A bare string renders the label with no glyph.
   *  Upstream used the literal characters ☀ and ✓ here; both are sprite glyphs now. */
  badge?: string | { icon?: string; label: string };
  onHeart?: () => void;
  className?: string;
}
export declare function ArticleCard(props: ArticleCardProps): JSX.Element;
