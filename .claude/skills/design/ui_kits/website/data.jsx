/* Fake content for the UI kit. Titles, Rubriken and Tags follow the real
 * repository: the neustart branch is a Hugo blog documenting its own rebuild. */
const AT = window.ArticleTimeDesignSystem_de8a72;

const IDENTITY = {
  name: 'Angel Crawford',
  photo: '../../assets/images/identity/angel.webp',
  note: 'Web Entwickler. Sonnenliebhaber. Goth.',
  aboutUrl: '#ueber-mich',
  siteUrl: '#',
  socials: [
    { name: 'Mastodon', href: '#', icon: 'mastodon-fill', color: '#6364FF' },
    { name: 'Instagram', href: '#', icon: 'instagram-line', color: '#c13584' },
    { name: 'GitHub', href: '#', icon: 'github-line', color: '#bbbbbb' },
  ],
  mostLoved: [
    { label: 'Warum Hugo', href: '#warum-hugo', hearts: 41 },
    { label: 'Erst die Programmierung', href: '#note-1', hearts: 23 },
    { label: 'Bulma raus, Tailwind rein', href: '#bulma-raus', hearts: 18 },
  ],
};

const MENU = [
  { label: 'Artikel', href: '#home', icon: 'article-line' },
  { label: 'Notizen', href: '#notizen', icon: 'lightbulb-line' },
  { label: 'Rubriken', href: '#rubriken', icon: 'pushpin-line' },
  { label: 'Tags', href: '#tags', icon: 'price-tag-3-line' },
  { label: 'Archiv', href: '#archiv', icon: 'bookmark-line' },
];

const FOOTER_MENU = [
  { label: 'Impressum', href: '#' },
  { label: 'Datenschutz', href: '#' },
  { label: 'Styleguide', href: '#' },
  { label: 'RSS', href: '#' },
];

const ENTRIES = [
  {
    id: 'warum-hugo', format: 'article', title: 'Warum Hugo',
    date: '06.08.26', updated: '07.08.26',
    rubrik: 'Allgemein', rubrikColor: '#4e97b3', cover: '../../assets/images/covers/rubriken-cover.jpg',
    summary: 'Fünfzehn Kriterien, vier Kandidaten. WordPress ein permanentes Update-Laufband mit einem Backend, das gesichert werden muss. Grav dünn dokumentiert und ohne zwei getrennte Menüs. Jekyll erst gewählt, dann verworfen, weil GitHub Pages Fremd-Plugins abschaltet. Geblieben ist Hugo: von der Profilkarte bereits bekannt, SEO, Sitemap und RSS eingebaut, und Bearbeiten nur lokal — genau die erklärte Vorliebe.',
    tags: ['hugo', 'static-site'], readingTime: 7, growthStage: 'evergreen', hearts: 41, series: true, featured: true,
  },
  {
    id: 'bulma-raus', format: 'article', title: 'Bulma raus, Tailwind rein',
    date: '02.08.26', rubrik: 'Kategorie 1', rubrikColor: '#c463cc',
    summary: '4.355 Zeilen SCSS über 29 Dateien, allein card.scss mit 552 — nicht weil es Komponenten gab, sondern weil jede Komponente ihre Werte neu erfand. Der Umbau tauscht nicht nur das Framework: er verschiebt die Entscheidung über Farbe, Abstand und Radius aus den Komponenten heraus in einen einzigen Token-Block. Zwei Stylesheets teilen sich vorerst die Seite, deshalb liegt Bulma in einer Cascade Layer und verliert damit jeden Konflikt.',
    tags: ['tailwind', 'css', 'migration'], readingTime: 11, growthStage: 'budding', hearts: 18,
  },
  {
    id: 'note-1', format: 'note',
    summary: 'Design und Programmierung müssen getrennt voneinander statt finden! Erst die Programmierung, dann das komplette Design.',
    date: '31.07.26', hearts: 23, rubrik: 'Allgemein', rubrikColor: '#4e97b3',
  },
  {
    id: 'die-diagnose', format: 'article', title: 'Die Diagnose',
    date: '28.07.26', rubrik: 'Allgemein', rubrikColor: '#4e97b3', cover: '../../assets/images/covers/tags-cover.jpg',
    summary: 'Vom Mehrautoren-Portal über den Co-Autoren-Blog und den Digital Garden zum privaten IndieWeb-Blog. Der Weg wurde vollständig gegangen, obwohl die Notiz von 2020 die Antwort schon enthielt: erst einmal ein privater Blog. Zu hohe Anforderungen, kombiniert mit der Unklarheit darüber, wo es überhaupt hin soll — das ist die eigentliche Ursache, nicht die Technik.',
    tags: ['scope', 'indieweb'], readingTime: 5, growthStage: 'evergreen', hearts: 23, series: true,
  },
  {
    id: 'alte-farben', format: 'article', title: 'Der alte Farbentwurf',
    date: '12.03.24', rubrik: 'Movie', rubrikColor: '#4e974e',
    summary: 'Die erste Fassung benannte Farben nach ihrem Aussehen — dark, light, gold — und produzierte damit Widersprüche wie color-dark-lighter. Der Beitrag steht noch, weil die Begründung erhalten bleiben soll.',
    tags: ['farben'], readingTime: 4, growthStage: 'withered', hearts: 2,
  },
  {
    id: 'note-2', format: 'note',
    summary: 'Ein Styleguide, der von Hand gepflegt wird, driftet innerhalb eines Monats.',
    date: '20.07.26', hearts: 9,
  },
];

const RUBRIKEN = [
  { title: 'Allgemein', count: 9, cover: '../../assets/images/covers/rubriken-cover.jpg' },
  { title: 'Kategorie 1', count: 3, cover: '../../assets/images/covers/tags-cover.jpg' },
  { title: 'Movie', count: 2 },
];

const TAGS = ['hugo', 'static-site', 'tailwind', 'css', 'migration', 'indieweb', 'scope', 'farben'];

const ARCHIVE = [
  { year: '2026', count: 14 },
  { year: '2024', count: 2 },
  { year: '2020', count: 1 },
];

const STATS = [
  { label: 'Artikel', count: 14, icon: 'article-line', color: 'rgb(88,179,189)' },
  { label: 'Notizen', count: 3, icon: 'lightbulb-line', color: 'hsl(29,100%,80%)' },
];

Object.assign(window, { AT, IDENTITY, MENU, FOOTER_MENU, ENTRIES, RUBRIKEN, TAGS, ARCHIVE, STATS });
