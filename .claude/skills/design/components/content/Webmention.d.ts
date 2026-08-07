export interface WebmentionProps {
  author?: string;
  authorUrl?: string;
  /** Round u-photo from the sender's h-card — 40px in a reply, 24px in a chip. */
  avatar?: string;
  /** Absent for likes and reposts, which is what switches the compact shape on. */
  content?: string;
  source?: string;
  sourceLabel?: string;
  /** Sets the left edge (reply) or the chip border (like, repost). */
  type?: 'mention' | 'reply' | 'like' | 'repost';
  /** Force the shape. Defaults to compact whenever there is no `content`:
   *  a box with nothing in it implies there is something to read. */
  compact?: boolean;
  className?: string;
}
export declare function Webmention(props: WebmentionProps): JSX.Element;
