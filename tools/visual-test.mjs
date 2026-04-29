// Visual UX-Test: rendert die Homepage in mehreren Viewports und macht
// Screenshots pro Section. Das Sub-Agent visual-tester konsumiert die Bilder
// und meldet visuelle Probleme zurück.
//
// Nutzung:
//   node tools/visual-test.mjs                              # alle Viewports, alle Sections
//   node tools/visual-test.mjs --viewports=laptop           # nur Laptop
//   node tools/visual-test.mjs --url=http://localhost:4322  # andere URL
//   node tools/visual-test.mjs --sections=hero,about,contact

import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const m = a.match(/^--([^=]+)=(.+)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ''), 'true'];
  })
);

const URL = args.url ?? process.env.URL ?? 'http://localhost:4321';

const VIEWPORTS = {
  mobile:  { width: 390,  height: 844  },
  laptop:  { width: 1366, height: 768  },
  desktop: { width: 1920, height: 1080 },
};

const ALL_SECTIONS = [
  '#hero',
  '#countdown',
  '#about',
  '#services',
  '#gallery',
  '#pricing',
  '#reviews',
  '#booking',
  '#contact',
  'footer',
];

const onlyVps = args.viewports?.split(',') ?? Object.keys(VIEWPORTS);
const onlySections = args.sections === 'all' || !args.sections
  ? ALL_SECTIONS
  : args.sections.split(',').map(s => s.startsWith('#') || s === 'footer' ? s : `#${s}`);

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outBase = join('.screenshots', ts);

console.log(`URL: ${URL}`);
console.log(`Viewports: ${onlyVps.join(', ')}`);
console.log(`Sections: ${onlySections.join(', ')}`);
console.log(`Output: ${outBase}`);

const browser = await chromium.launch();

try {
  for (const vpName of onlyVps) {
    const vp = VIEWPORTS[vpName];
    if (!vp) {
      console.warn(`unknown viewport: ${vpName}, skipping`);
      continue;
    }
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    const page = await ctx.newPage();
    page.on('pageerror', e => console.warn(`[${vpName}] pageerror:`, e.message));

    try {
      await page.goto(URL, { waitUntil: 'networkidle', timeout: 15000 });
    } catch (e) {
      console.error(`[${vpName}] failed to load ${URL}: ${e.message}`);
      console.error(`Astro Dev-Server läuft? \`pnpm dev\``);
      await ctx.close();
      continue;
    }
    await page.waitForTimeout(600);

    // Astro dev-toolbar ausblenden (sonst blockiert sie pointer-events beim Cookie-Click)
    await page.evaluate(() => { const t = document.querySelector('astro-dev-toolbar'); if (t) t.style.display = 'none'; });

    // Cookie-Banner wegklicken damit er in Screenshots nicht stoert
    const cookieDismissed = await page.evaluate(() => { const btn = document.querySelector('.cookie-btn-secondary'); if (btn) { btn.click(); return true; } return false; });
    if (cookieDismissed) await page.waitForTimeout(300);

    // Reveal-Animationen erzwingen: .r-Elemente starten mit opacity:0 und werden
    // erst per IntersectionObserver sichtbar. Im Headless-Modus sind Elemente
    // außerhalb des Viewports unsichtbar → Full-Page-Screenshot zeigt leere Sections.
    await page.evaluate(() => {
      document.querySelectorAll('.r').forEach(el => el.classList.add('in'));
    });

    const dir = join(outBase, vpName);
    mkdirSync(dir, { recursive: true });

    // 1) Full-page screenshot (zum Überblick + Snap-Verhalten)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(dir, '00-full-page.png'), fullPage: true });

    // 2) Pro Section: scrollen, warten, Viewport-Screenshot
    let i = 1;
    for (const sel of onlySections) {
      const el = await page.$(sel);
      if (!el) {
        console.log(`[${vpName}] ${sel}: not found`);
        continue;
      }
      // Scroll wie ein User: snap-aware (jumpToHash), dann Inertia abklingen lassen.
      // 800ms Wartezeit: Animation .65s + max Delay .30s = .95s — 800ms reicht für
      // die meisten Elemente und hält den Gesamtlauf in vertretbarer Zeit.
      await page.evaluate(s => {
        const e = document.querySelector(s);
        if (e) e.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, sel);
      await page.waitForTimeout(1100);
      const name = `${String(i).padStart(2, '0')}-${sel.replace(/[^a-z0-9-]/gi, '_')}.png`;
      await page.screenshot({ path: join(dir, name), fullPage: false });
      i++;
    }

    await ctx.close();
    console.log(`[${vpName}] done`);
  }
} finally {
  await browser.close();
}

console.log(`\nSCREENSHOTS_DIR=${outBase}`);
