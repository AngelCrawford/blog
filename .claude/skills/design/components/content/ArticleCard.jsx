import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { GrowthBadge } from './GrowthBadge.jsx';
import { HeartButton } from './HeartButton.jsx';
import { Hashtag, Ribbon, Badge } from './Tag.jsx';

/* The magazine tile. Two shapes from one component, because the source is one
 * Hugo partial with variants:
 *
 *   format="article"  cover left in a 2:3 well, text right, footer across both.
 *                     Without a cover the text simply takes the whole width and
 *                     the excerpt is allowed to run longer.
 *   format="note"     no title, no excerpt — the note IS the text, set large in
 *                     Montserrat Alternates between gold quote marks, with the
 *                     cover dimmed behind it.
 *
 * Hover does three things and no more: the gold rule grows along the bottom
 * edge, the cover releases its sepia, and the round button presses in. */
export function ArticleCard({
  format = 'article', title, href = '#', summary, date, updated, rubrik, rubrikHref, rubrikColor,
  cover, coverAlt = '', caption, tags = [], readingTime, growthStage, hearts = 0, series = false,
  featured = false, badge, onHeart, className = '', ...rest
}) {
  const isNote = format === 'note';
  const hasImage = Boolean(cover);

  /* The badge takes a sprite glyph, not a unicode symbol: upstream wrote "☀ Neu"
   * and "✓ Gesehen" literally, which were the only two non-Remixicon marks on the
   * site. Pass a string for the label alone, or { icon, label }. */
  const badgeSpec = typeof badge === 'string' ? { label: badge } : badge;
  const badgeNode = badgeSpec ? (
    <span className="at-card-badge">
      {badgeSpec.icon ? <Icon name={badgeSpec.icon} variant="plain" size="0.9em" color="currentColor" /> : null}
      {badgeSpec.label}
    </span>
  ) : null;

  const dateRow = (
    <p className="at-card-meta">
      <time dateTime={date} title="Veröffentlichungsdatum">
        <Icon name="calendar-line" variant="plain" size="15px" color="var(--color-ink-muted)" style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 2 }} />
        {' '}{date}
      </time>
      {updated && updated !== date ? (
        <time dateTime={updated} title="Letztes Bearbeitungsdatum">
          <Icon name="pencil-line" variant="plain" size="15px" color="var(--color-ink-muted)" style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 2 }} />
          {' '}{updated}
        </time>
      ) : null}
    </p>
  );

  const footer = (
    <footer className="at-card-footer">
      <div className="at-card-footer-item">
        {isNote ? dateRow : (
          <span data-tooltip={`${readingTime} Minuten Lesedauer`}>
            <Icon name="timer-line" variant="plain" size="20px" color="var(--color-ink-muted)" style={{ display: 'inline-block', verticalAlign: '-5px', marginRight: 2 }} />
            {' '}{readingTime} Min.
          </span>
        )}
      </div>
      {/* Tags moved out of the running text into the footer, where the other metadata
        * already lives. In the body they interrupted the excerpt with a row of
        * uppercase links; here they read as what they are — filing, not content.
        *
        * CAPPED AT THREE. Six tags in a third of a card wrapped the footer into four
        * lines and made it taller than the excerpt above it. The full list is on the
        * article page; the footer's job is to say what kind of thing this is. */}
      {!isNote && tags.length ? (
        <div className="at-card-footer-item" style={{ flexWrap: 'wrap', gap: '0.35em' }}>
          <Icon name="price-tag-3-line" variant="plain" size="18px" color="var(--color-ink-muted)" />
          {tags.slice(0, 3).map((t) => <Hashtag key={t} href={`/tags/${t}/`}>{t}</Hashtag>)}
          {tags.length > 3 ? (
            <a href={href} title={tags.slice(3).map((t) => `#${t}`).join(' ')} style={{ color: 'var(--color-ink-muted)' }}>+{tags.length - 3}</a>
          ) : null}
        </div>
      ) : null}
      <div className="at-card-footer-item" style={{ gap: 10 }}>
        {isNote
          ? <span data-tooltip="Notiz"><Icon name="lightbulb-line" size="20px" color="var(--color-accent-hover)" /></span>
          : <GrowthBadge stage={growthStage} />}
        {series ? <span data-tooltip="Teil einer Serie"><Icon name="stack-line" size="20px" /></span> : null}
        <HeartButton count={hearts} flat readonly={!isNote} onHeart={onHeart} />
        {/* Weiterlesen sits in the footer row with everything else. Floating, it
          * hovered over the excerpt, covered words and belonged to no row — the one
          * control on the card with no place of its own. */}
        {!isNote ? (
          <a href={href} title="Weiterlesen" aria-label="Weiterlesen" style={{ display: 'flex', color: 'var(--color-accent)' }}>
            <Icon name="arrow-right-s-line" variant="plain" size="20px" color="currentColor" />
          </a>
        ) : null}
      </div>
    </footer>
  );

  if (isNote) {
    return (
      <article
        className={`at-card ${featured ? 'at-card-fixed ' : ''}${className}`}
        style={{ display: 'grid', gridTemplateRows: '1fr auto', minHeight: 400 }}
        {...rest}
      >
        {badgeNode}
        {/* Ribbon side follows the COVER, not the format: card.scss pins it right
         * only for `.is-note:not(.has-image)`; a note with a cover falls through to
         * the `.has-image` rule and hangs off the left over the image. */}
        {/* No rubrikColor here: on a note the label sits ON the picture, and a
         * saturated fill there is the very thing the dot badge replaced. The ribbon
         * stays muted gold; colour is the dot's job everywhere it can be one. */}
        {rubrik ? <Ribbon href={rubrikHref} side={hasImage ? 'left' : 'right'}>{rubrik}</Ribbon> : null}
        <div style={{ position: 'relative', display: 'grid', placeItems: 'center', padding: rubrik ? '5.5rem var(--spacing-gutter) var(--spacing-gutter)' : 'var(--spacing-gutter)' }}>
          {hasImage ? (
            <img className="at-card-bleed" src={cover} alt={coverAlt} />
          ) : null}
          <p
            className="at-quoted"
            style={{
              position: 'relative', zIndex: 2, margin: 0, textAlign: 'center',
              fontFamily: 'var(--font-heading)', fontWeight: 'var(--weight-strong)',
              fontSize: 30, lineHeight: 1.3, color: 'var(--color-ink-strong)',
              textShadow: '3px 3px 4px rgb(0 0 0 / 0.5)',
              background: 'linear-gradient(270deg, transparent 0%, rgb(0 0 0 / 0.5) 50%, transparent 100%)',
              padding: '1rem 0',
            }}
          >
            {summary}
          </p>
        </div>
        {footer}
      </article>
    );
  }

  return (
    <article
      className={`at-card ${featured ? 'at-card-fixed ' : ''}${className}`}
      style={{ display: 'grid', gridTemplateRows: '1fr auto' }}
      {...rest}
    >
      {/* The Rubrik is a dot badge above the title, not a ribbon over the picture:
        * a saturated fill across the top of a photograph competes with the photograph
        * and with the gold. Notes keep the ribbon — their label has to sit ON the
        * image, because the image is the whole card. */}
      {badgeNode}

      <div className="at-flow" style={{ padding: 'var(--spacing-gutter)', position: 'relative' }}>
        {hasImage ? (
          /* Floated, not a grid column: the text runs around the cover. The figure
           * hangs 1.5em off the card's left edge and starts 1.5em below its top,
           * which is what makes the image read as laid ON the card. */
          <figure className="at-figure at-figure-float">
            <a href={href} title={title}>
              <img className="at-card-cover" src={cover} alt={coverAlt} />
            </a>
            {caption ? (
              <figcaption className="at-figcaption">
                <Icon name="pencil-line" variant="plain" size="16px" style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 3 }} />
                {' '}{caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <h2 className="at-card-title"><a href={href} title={title}>{title}</a></h2>
        {/* Rubrik sits in the metadata row beside the dates, not above the title.
          * Above it, it stood between the reader and the one thing on the card that
          * matters — and it is metadata, so it belongs with the metadata. */}
        <p className="at-card-meta">
          {rubrik ? <Badge href={rubrikHref} dot={rubrikColor}>{rubrik}</Badge> : null}
          <time dateTime={date} title="Veröffentlichungsdatum">
            <Icon name="calendar-line" variant="plain" size="15px" color="var(--color-ink-muted)" style={{ display: 'inline-block', verticalAlign: '-3px', marginRight: 2 }} />
            {' '}{date}
          </time>
          {/* The edited date is NOT repeated here. Badge plus two dates needs ~230px
           * and the text column beside a 46% float is ~250px, so it broke onto a
           * second line; the article page states it under Publiziert anyway. */}
        </p>
        <div className="at-card-excerpt" style={{ margin: '0.75rem 0 0' }}>{summary}</div>
      </div>

      {footer}
    </article>
  );
}
