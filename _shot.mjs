import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
p.on('pageerror', e => console.log('PAGEERROR', e));
await p.goto('http://127.0.0.1:8115/articles/movie-test/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.getElementById('cookie-banner')?.remove());
console.log(await p.evaluate(() => ({
  sterne: document.querySelectorAll('.at-prose svg use[href*="star"]').length,
  paare: document.querySelectorAll('.at-prose .inline-flex.overflow-hidden').length,
  messages: document.querySelectorAll('.at-prose aside').length,
})));
const rating = await p.locator('.at-prose .my-4.flex').first().boundingBox();
await p.evaluate(() => { const el = document.querySelector('.at-prose aside'); el?.scrollIntoView({block:'center'}); });
await p.waitForTimeout(300);
await p.screenshot({ path: '/tmp/w2-shortcodes.png' });
await b.close();
