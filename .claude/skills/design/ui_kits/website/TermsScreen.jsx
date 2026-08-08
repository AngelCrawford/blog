/* Rubriken and Tags overviews, and the archive page. All three are the same
 * page shape as home — a heading and a grid of cards — because a taxonomy is
 * just another feed. */
const { Heading, TermCard, ArchiveWidget, ArticleCard, Hashtag, Panel } = window.ArticleTimeDesignSystem_de8a72;

function TermsScreen({ kind, onOpen }) {
  if (kind === 'tags') {
    return (
      <>
        <Heading level={1}>Tags</Heading>
        <p style={{ maxWidth: '70ch', margin: '1.5rem 0 var(--spacing-gutter)' }}>
          Freie Schlagworte, mehrere pro Eintrag. Die Rubrik ist etwas anderes: genau eine pro Eintrag.
        </p>
        <Panel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {TAGS.map((t) => <Hashtag key={t} href="#tags">{t}</Hashtag>)}
          </div>
        </Panel>
      </>
    );
  }

  return (
    <>
      <Heading level={1}>Rubriken</Heading>
      <p style={{ maxWidth: '70ch', margin: '1.5rem 0 var(--spacing-gutter)' }}>
        Genau eine Rubrik pro Eintrag — sie hängt als Banderole an der Ecke jeder Karte.
        Verwelkte Einträge sind aus den Zahlen herausgerechnet.
      </p>
      <div style={{ display: 'grid', gap: 'var(--spacing-gutter)', gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))' }}>
        {RUBRIKEN.map((r) => <TermCard key={r.title} {...r} href="#rubriken" />)}
      </div>
    </>
  );
}

function ArchiveScreen({ onOpen }) {
  return (
    <>
      <Heading level={1}>Archiv</Heading>
      <p style={{ maxWidth: '70ch', margin: '1.5rem 0 var(--spacing-gutter)' }}>
        Alles, nach Jahren. Die einzige Übersicht, die verwelkte Einträge mitzählt — ein Archiv,
        das etwas verschweigt, ist keins.
      </p>
      <div style={{ display: 'grid', gap: 'var(--spacing-gutter)', gridTemplateColumns: 'minmax(0, 1fr) 19rem', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 'var(--spacing-gutter)' }}>
          {ARCHIVE.map((y) => (
            <section key={y.year} id={y.year}>
              <h2 className="gd-h2">{y.year}</h2>
              <div style={{ display: 'grid', gap: 'var(--spacing-gutter)', gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))' }}>
                {ENTRIES.filter((e) => e.format === 'article').slice(0, y.year === '2026' ? 3 : 1).map((e) => (
                  <ArticleCard
                    key={`${y.year}-${e.id}`} {...e} cover={undefined} summary={undefined} tags={[]}
                    href={`#${e.id}`} rubrikHref="#rubriken"
                    onClick={(ev) => { ev.preventDefault(); onOpen(e.id); }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
        <Panel><ArchiveWidget years={ARCHIVE} showButton={false} /></Panel>
      </div>
    </>
  );
}

Object.assign(window, { TermsScreen, ArchiveScreen });
