/* The shell every screen sits in: header, navigation, content column, footer.
 * Search filters the entry list live and shows the result panel hanging off the
 * navigation's right edge, as it does in production. */
const { SiteHeader, SiteNav, SiteFooter, Icon, GrowthBadge } = window.ArticleTimeDesignSystem_de8a72;

function App() {
  const [route, setRoute] = React.useState('home');
  const [openId, setOpenId] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [showWithered, setShowWithered] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const open = (id) => { setOpenId(id); setRoute('artikel'); window.scrollTo({ top: 0 }); };
  const go = (label) => {
    const map = { Artikel: 'home', Notizen: 'home', Rubriken: 'rubriken', Tags: 'tags', Archiv: 'archiv' };
    setRoute(map[label] || 'home');
    setOpenId(null);
    setQuery('');
    window.scrollTo({ top: 0 });
  };

  const hits = query
    ? ENTRIES.filter((e) => `${e.title || ''} ${e.summary} ${(e.tags || []).join(' ')}`.toLowerCase().includes(query.toLowerCase()))
    : [];

  const results = query ? (
    hits.length ? (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--spacing-3)' }}>
        {hits.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              onClick={(ev) => { ev.preventDefault(); if (e.format !== 'note') open(e.id); }}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-hairline-quiet)' }}
            >
              <Icon name={e.format === 'note' ? 'lightbulb-line' : 'article-line'} size="1.25rem" />
              <span style={{ flex: 1, color: 'var(--color-ink)' }}>{e.title || e.summary.slice(0, 60) + '…'}</span>
              {e.growthStage ? <GrowthBadge stage={e.growthStage} /> : null}
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)', fontVariantNumeric: 'tabular-nums' }}>{e.date}</span>
            </a>
          </li>
        ))}
      </ul>
    ) : (
      <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--color-ink-muted)' }}>Keine Treffer für „{query}“.</p>
    )
  ) : null;

  const entry = openId ? ENTRIES.find((e) => e.id === openId) : null;
  const activeLabel = { home: 'Artikel', artikel: 'Artikel', rubriken: 'Rubriken', tags: 'Tags', archiv: 'Archiv' }[route];

  return (
    <>
      <SiteHeader title="Article Time" href="#home" />
      <SiteNav
        items={MENU} active={activeLabel} brand="Artikel"
        logo="../../assets/images/favicon/favicon-96x96.png"
        follow={[{ name: 'RSS Feed', href: '#', icon: 'rss-line' }]}
        query={query} onQuery={setQuery} results={results}
        onNavigate={(it) => go(it.label)}
      />

      <main className="at-page" style={{ minHeight: '60vh' }}>
        <div style={{ maxWidth: 'var(--page-max)', margin: '0 auto', padding: 'var(--spacing-section) var(--spacing-gutter)' }}>
          {route === 'home' ? <HomeScreen onOpen={open} page={page} setPage={setPage} showWithered={showWithered} setShowWithered={setShowWithered} /> : null}
          {route === 'artikel' && entry ? <ArticleScreen entry={entry} onOpen={open} /> : null}
          {route === 'rubriken' ? <TermsScreen kind="rubriken" onOpen={open} /> : null}
          {route === 'tags' ? <TermsScreen kind="tags" onOpen={open} /> : null}
          {route === 'archiv' ? <ArchiveScreen onOpen={open} /> : null}
        </div>
      </main>

      <SiteFooter
        slogan={<>Ein Blog. Ein Autor.<br />Und viel Zeit.</>}
        identity={IDENTITY}
        statsIntro={<>Momentan befinden sich 17 <a href="#home">Einträge</a> auf dieser Seite — davon 2 verwelkt.</>}
        stats={STATS}
        archiveYears={ARCHIVE}
        menu={FOOTER_MENU}
        version="v2.1.0"
        copyright="CC BY-NC-SA 4.0"
        credits={<>Header SVGs von <a href="#">pixelliebe</a> | <a href="#">shutterstock.com</a></>}
      />
    </>
  );
}

Object.assign(window, { App });
