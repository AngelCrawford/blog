/* Article page. Prose in a panel on the left, metadata tiles and the three
 * sidebar widgets on the right. The withered banner appears above everything when
 * the entry's growth stage says so. */
const {
  Heading, Panel, InfoTiles, InfoTile, Tag, Hashtag, GrowthBadge, HeartButton,
  TocSidebar, SeriesSidebar, RelatedSidebar, WitheredBanner, Webmention, Icon, RoundButton, GROWTH_STAGES,
} = window.ArticleTimeDesignSystem_de8a72;

function ArticleScreen({ entry, onOpen }) {
  const [hearts, setHearts] = React.useState(entry.hearts || 0);
  const [hearted, setHearted] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const [toc, setToc] = React.useState('#anforderungen');
  const stage = GROWTH_STAGES[entry.growthStage || 'seedling'];

  return (
    <>
      {entry.growthStage === 'withered' && !dismissed ? (
        <WitheredBanner
          date={entry.date}
          reason="Die Farbtokens heißen inzwischen nach ihrer Rolle, nicht nach ihrem Aussehen."
          replacement="Bulma raus, Tailwind rein" replacementHref="#bulma-raus"
          onDismiss={() => setDismissed(true)}
        />
      ) : null}

      <div style={{ display: 'grid', gap: 'var(--spacing-gutter)', gridTemplateColumns: 'minmax(0, 1fr) 19rem', alignItems: 'start' }}>
        {/* Title and byline live INSIDE the panel. Outside it they read as a second
         * banner under the header — two gold display texts stacked, the wordmark and
         * the page title competing. In the box the title is plainly the page's own
         * heading, and the header above it is plainly the site. */}
        <Panel as="article" className="at-prose at-flow" style={{ maxWidth: 'none' }}>
          {entry.cover ? (
            <figure className="at-figure at-figure-float" style={{ marginTop: 0 }}>
              <img className="at-card-cover" src={entry.cover} alt="" />
              <figcaption className="at-figcaption">
                <Icon name="pencil-line" size="1rem" style={{ verticalAlign: '-3px', marginRight: 4 }} />
                Aufgenommen an der Kieler Förde
              </figcaption>
            </figure>
          ) : null}
          <Heading level={1}>{entry.title}</Heading>
          {/* No date here — Publiziert and Editiert are both sidebar tiles, and a third
           * copy of the same value in the byline is noise. */}
          <p style={{ margin: '1rem 0 var(--spacing-gutter)', color: 'var(--color-ink-muted)', fontSize: '0.95rem' }}>
            von <a href="#ueber-mich">{IDENTITY.name}</a>
          </p>
          <p style={{ fontSize: 'var(--text-lg)', lineHeight: 'var(--text-lg--line-height)' }}>{entry.summary}</p>

          <h2 className="gd-h2" id="anforderungen" style={{ marginTop: 'var(--spacing-gutter)' }}>Die Anforderungen</h2>
          <p>
            Erste Priorität, alles ausgeliefert: Tags <em>und</em> Kategorien, Serien, ein
            Inhaltsverzeichnis pro Artikel, zwei Menüs, Markdown als Autorenformat, Suche.
            Kommentare standen auf der Liste und wurden später anders beantwortet — durch
            IndieWeb-Webmentions statt durch ein Kommentarsystem.
          </p>

          <h3 className="gd-h3" id="kandidaten">Die Kandidaten</h3>
          <p>
            Vier Systeme, fünfzehn Kriterien. Entscheidend war am Ende nicht das Feature-Blatt,
            sondern die Frage, was auf Dauer nicht gepflegt werden muss.
          </p>
          <blockquote className="at-quoted" style={{
            width: '80%', margin: '1.5em auto', padding: '1.5em 2.5em',
            background: 'hsl(190 11% 10%)', borderLeft: '4px solid var(--color-accent)',
            fontFamily: 'var(--font-heading)', fontSize: '1.3rem', lineHeight: 1.5, color: 'var(--color-ink-muted)',
          }}>
            Fazit: Erst einmal ein privater Blog.
          </blockquote>
          <ul style={{ paddingLeft: '1.4em' }}>
            <li>Nicht zu groß, keine tief verschachtelte Auszeichnung.</li>
            <li>Flexbox statt Floats, JavaScript optional.</li>
            <li>Statisch generiert, Bearbeiten nur lokal.</li>
          </ul>

          {/* Tags belong to the article body, not only to the sidebar tile: at the end
           * of a text they are the reader's next step. */}
          {(entry.tags || []).length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4em', marginTop: 'var(--spacing-gutter)' }}>
              <Icon name="price-tag-3-line" size="1.1rem" />
              {(entry.tags || []).map((t) => <Hashtag key={t} href="#tags">{t}</Hashtag>)}
            </div>
          ) : null}

          {/* The box footer, as upstream: evenly split cells with a gold hairline
           * between them, carrying everything that is about the article rather than
           * in it — reading time, hearts, incoming reactions. */}
          <footer style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', alignItems: 'stretch',
            margin: '2em -1.5rem -1.5rem',
            borderTop: '1px solid color-mix(in srgb, var(--color-accent-muted) 50%, transparent)',
            background: 'var(--color-surface)', borderRadius: '0 0 var(--radius-md) var(--radius-md)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4em', padding: '1.25rem', fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)', whiteSpace: 'nowrap' }}>
              <Icon name="timer-line" size="1.1rem" />{entry.readingTime} Min.
            </span>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem', borderLeft: '1px solid color-mix(in srgb, var(--color-accent-muted) 50%, transparent)', borderRight: '1px solid color-mix(in srgb, var(--color-accent-muted) 50%, transparent)' }}>
              <HeartButton
                count={hearts} hearted={hearted} hint={hearted ? 'Danke!' : 'einmal pro Besuch'}
                onHeart={() => { setHearts(hearts + 1); setHearted(true); }}
              />
            </span>
            <a href="#reaktionen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4em', padding: '1.25rem', fontSize: 'var(--text-sm)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              <Icon name="message-3-line" size="1.1rem" />3 Reaktionen
            </a>
          </footer>
        </Panel>

        <div style={{ display: 'grid', gap: 'var(--spacing-gutter)' }}>
          <InfoTiles>
            <InfoTile icon="pushpin-line" label="Rubrik"><Tag href="#rubriken">{entry.rubrik}</Tag></InfoTile>
            <InfoTile icon={stage.icon} iconColor={`var(--color-${entry.growthStage || 'seedling'})`} label="Stadium" stage={entry.growthStage}>
              <GrowthBadge stage={entry.growthStage} showLabel tinted={false} />
            </InfoTile>
            {/* Edited date sits UNDER the published one rather than in a tile of its
              * own: it is the same fact, one revision later, and it only exists when
              * it differs. Its own tile spent a whole slot on an em dash most of the
              * time. */}
            <InfoTile icon="calendar-line" label="Publiziert">
              <span style={{ display: 'flex', flexDirection: 'column', gap: '0.15em' }}>
                <time>{entry.date}</time>
                {entry.updated && entry.updated !== entry.date ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>editiert {entry.updated}</span>
                ) : null}
              </span>
            </InfoTile>
            <InfoTile icon="timer-line" label="Lesedauer">{entry.readingTime} Min.</InfoTile>
            {/* Herzen and Reaktionen side by side — outgoing and incoming engagement
              * weigh the same, so they get the same size. */}
            <InfoTile icon="heart-line" iconColor="hsl(0 70% 65%)" label="Herzen">{hearts}</InfoTile>
            <InfoTile icon="message-3-line" label="Reaktionen"><a href="#reaktionen">3</a></InfoTile>
            <InfoTile icon="price-tag-3-line" label="Tags" wide>
              {(entry.tags || []).map((t) => <Hashtag key={t} href="#tags">{t}</Hashtag>)}
            </InfoTile>
          </InfoTiles>

          <TocSidebar
            current={toc}
            items={[
              { label: 'Die Anforderungen', href: '#anforderungen' },
              { label: 'Die Kandidaten', href: '#kandidaten', children: [
                { label: 'WordPress', href: '#wordpress' },
                { label: 'Jekyll', href: '#jekyll' },
              ] },
              { label: 'Fazit', href: '#fazit' },
            ]}
          />

          {entry.series ? (
            <SeriesSidebar
              title="Der Neustart" href="#serien" current={`#${entry.id}`}
              items={[
                { label: 'Die Diagnose', href: '#die-diagnose' },
                { label: 'Warum Hugo', href: '#warum-hugo' },
                { label: 'Bulma raus, Tailwind rein', href: '#bulma-raus' },
                { label: 'Der alte Farbentwurf', href: '#alte-farben', withered: true },
              ]}
            />
          ) : null}

          <RelatedSidebar items={ENTRIES.filter((e) => e.format === 'article' && e.id !== entry.id).slice(0, 3).map((e) => ({ label: e.title, href: `#${e.id}`, date: e.date }))} />
        </div>
      </div>

      {/* Reaktionen sits in the SAME grid column as the article, not across the full
        * page. Loose below the grid it ran the sidebar's width wider than the text it
        * belongs to, which read as squeezed above and sprawling below. */}
      <section id="reaktionen" style={{ gridColumn: 1, marginTop: 'var(--spacing-section)' }}>
        <h2 className="gd-h2">Reaktionen</h2>
        <p style={{ margin: '0 0 var(--spacing-gutter)', maxWidth: '70ch', color: 'var(--color-ink-muted)', fontSize: 'var(--text-sm)' }}>
          Kein Kommentarfeld — Antworten kommen als Webmention von der Seite, auf der sie geschrieben wurden.
        </p>
        {/* Grouped by kind, as upstream: replies are boxes you read, likes and
          * reposts are chips you count. */}
        <h3 className="gd-h3">Antworten</h3>
        <ul style={{ margin: '0 0 var(--spacing-gutter)', padding: 0, display: 'grid', gap: 'var(--spacing-3)', gridTemplateColumns: 'repeat(auto-fill, minmax(22rem, 1fr))' }}>
          <Webmention type="reply" author="@leser@norden.social" authorUrl="#" avatar="../../assets/images/identity/angel.webp" content="Genau diese Reihenfolge — erst Code, dann Design — hat bei mir auch als Einziges funktioniert." source="#" sourceLabel="norden.social" />
          <Webmention type="reply" author="@theo@chaos.social" authorUrl="#" content="Der Absatz über die Kaskadenschicht hat mir eine Woche gespart." source="#" sourceLabel="chaos.social" />
        </ul>

        <h3 className="gd-h3">Likes und Reposts</h3>
        <ul style={{ margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Webmention type="like" author="@jemand@chaos.social" source="#" sourceLabel="chaos.social" />
          <Webmention type="like" author="@nina@norden.social" source="#" sourceLabel="norden.social" />
          <Webmention type="repost" author="hugo-weekly.dev" source="#" sourceLabel="hugo-weekly.dev" />
        </ul>
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-gutter)' }}>
        <RoundButton icon="arrow-up-s-fill" size="lg" label="Nach oben" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      </div>
    </>
  );
}

Object.assign(window, { ArticleScreen });
