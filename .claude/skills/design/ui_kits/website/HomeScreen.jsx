/* Home — the card feed. Weighted entries first, then everything else by date.
 * A fixed grid: one column on phones, two on desktop, three on very wide screens. */
const { ArticleCard, Heading, Panel, Pagination, Check } = window.ArticleTimeDesignSystem_de8a72;

function HomeScreen({ onOpen, page, setPage, showWithered, setShowWithered }) {
  const visible = showWithered ? ENTRIES : ENTRIES.filter((e) => e.growthStage !== 'withered');
  const hidden = ENTRIES.length - visible.length;

  return (
    <>
      <Panel style={{ marginBottom: 'var(--spacing-gutter)' }}>
        <Heading level={1}>Artikel</Heading>
        <p style={{ maxWidth: '70ch', margin: '1.5rem 0 0', color: 'var(--color-ink)' }}>
          Ein Blog im IndieWeb, geschrieben von einer Person. Rubriken, Tags, Serien und ein Archiv —
          wie ein Magazin aufgebaut, nur eben ohne Redaktion.
        </p>
      </Panel>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-gutter)', margin: 'var(--spacing-gutter) 0' }}>
        <Check label="Verwelkte Einträge anzeigen" checked={showWithered} onChange={(e) => setShowWithered(e.target.checked)} />
        {hidden > 0 ? (
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)' }}>
            {hidden} {hidden === 1 ? 'Eintrag ist' : 'Einträge sind'} verwelkt und ausgeblendet.
          </span>
        ) : null}
      </div>

      <div style={{ display: 'grid', gap: '1rem 1.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(30rem, 1fr))' }}>
        {visible.map((e) => (
          <ArticleCard
            key={e.id} {...e}
            href={e.format === 'note' ? undefined : `#${e.id}`}
            rubrikHref={e.rubrik ? '#rubriken' : undefined}
            onClick={e.format === 'note' ? undefined : (ev) => { ev.preventDefault(); onOpen(e.id); }}
          />
        ))}
      </div>

      <Pagination page={page} pages={3} onPage={setPage} />
    </>
  );
}

Object.assign(window, { HomeScreen });
