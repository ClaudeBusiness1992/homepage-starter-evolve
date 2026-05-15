import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ts = '2026-05-13T13-41-27';
const browser = await chromium.launch();

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 900 }
];

for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  const dir = join('.screenshots', ts, vp.name + '-legal');
  mkdirSync(dir, { recursive: true });

  // Impressum
  await page.goto('http://localhost:4321/impressum', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const t = document.querySelector('astro-dev-toolbar');
    if (t) t.style.display = 'none';
    // dismiss cookie banner if present, don't care if hidden
    const btn = document.querySelector('.cookie-btn-secondary');
    if (btn) btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(dir, '01-impressum-top.png'), fullPage: false });
  await page.screenshot({ path: join(dir, '02-impressum-full.png'), fullPage: true });

  // Datenschutz
  await page.goto('http://localhost:4321/datenschutz', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const t = document.querySelector('astro-dev-toolbar');
    if (t) t.style.display = 'none';
    const btn = document.querySelector('.cookie-btn-secondary');
    if (btn) btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(dir, '03-datenschutz-top.png'), fullPage: false });
  await page.screenshot({ path: join(dir, '04-datenschutz-full.png'), fullPage: true });

  await ctx.close();
  console.log('[' + vp.name + '-legal] done');
}

await browser.close();
console.log('LEGAL_SCREENSHOTS_DIR=.screenshots/' + ts);
