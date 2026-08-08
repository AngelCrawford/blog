import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const fails = [];
p.on('pageerror', e => fails.push('JS: '+e.message));
for (const [name, url] of [['Home','/'],['Artikel','/articles/chapter-6/'],['Movie','/articles/movie-test/'],['Liste','/articles/'],['Rubriken','/categories/'],['Archiv','/pages/archiv/'],['Profil','/pages/ueber-mich/'],['Datenschutz','/pages/datenschutz/'],['404','/404.html'],['Styleguide','/pages/styleguide/']]) {
  const r = await p.goto('http://127.0.0.1:8116'+url, { waitUntil: 'networkidle' });
  const info = await p.evaluate(() => ({
    header: !!document.querySelector('.at-header'), footer: !!document.querySelector('[data-page-footer]'),
    mainW: Math.round(document.querySelector('main')?.getBoundingClientRect().width || 0),
    bulmaCss: [...document.styleSheets].some(ss => (ss.href||'').includes('/style.')),
  }));
  console.log(name.padEnd(12), r.status(), JSON.stringify(info));
}
console.log('JS-Fehler:', fails.length ? fails.slice(0,5) : 'keine');
await p.goto('http://127.0.0.1:8116/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.getElementById('cookie-banner')?.remove());
await p.screenshot({ path: '/tmp/w3-home.png' });
await p.goto('http://127.0.0.1:8116/pages/ueber-mich/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.getElementById('cookie-banner')?.remove());
await p.screenshot({ path: '/tmp/w3-profil.png' });
await b.close();
