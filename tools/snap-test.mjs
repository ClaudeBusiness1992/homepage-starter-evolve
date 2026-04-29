// Scroll-Snap-Test: prüft computed styles + Snap-Verhalten per Playwright
// Nutzung: node tools/snap-test.mjs

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const URL = 'http://localhost:4321';
const VIEWPORT = { width: 1366, height: 768 };

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = join('.screenshots', ts, 'snap-test');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
const page = await ctx.newPage();

page.on('pageerror', e => console.warn('[pageerror]', e.message));

// 1. Seite laden
await page.goto(URL, { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(600);

// Astro toolbar + Cookie-Banner ausblenden
await page.evaluate(() => {
  const t = document.querySelector('astro-dev-toolbar');
  if (t) t.style.display = 'none';
  const btn = document.querySelector('.cookie-btn-secondary');
  if (btn) btn.click();
});
await page.waitForTimeout(400);

// Reveal-Klassen erzwingen
await page.evaluate(() => {
  document.querySelectorAll('.r').forEach(el => el.classList.add('in'));
});
await page.waitForTimeout(300);

// Scroll to top
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);

// ─── 2. computed style: scroll-snap-type auf documentElement ──────────────
const rootSnapType = await page.evaluate(() => {
  const html = document.documentElement;
  const body = document.body;
  return {
    html: getComputedStyle(html).scrollSnapType,
    body: getComputedStyle(body).scrollSnapType,
  };
});
console.log('\n=== scroll-snap-type ===');
console.log('html:', rootSnapType.html || '(leer)');
console.log('body:', rootSnapType.body || '(leer)');

// ─── 3. Sections-Styles ───────────────────────────────────────────────────
const sectionStyles = await page.evaluate(() => {
  return [...document.querySelectorAll('main > section')].map(s => ({
    id: s.id || '(no-id)',
    tagName: s.tagName,
    snapAlign: getComputedStyle(s).scrollSnapAlign,
    snapStop:  getComputedStyle(s).scrollSnapStop,
    minHeight: getComputedStyle(s).minHeight,
    height:    s.getBoundingClientRect().height,
  }));
});
console.log('\n=== main > section computed styles ===');
sectionStyles.forEach(s => {
  console.log(`  #${s.id}:`);
  console.log(`    scroll-snap-align: ${s.snapAlign || '(leer)'}`);
  console.log(`    scroll-snap-stop:  ${s.snapStop  || '(leer)'}`);
  console.log(`    min-height:        ${s.minHeight || '(leer)'}`);
  console.log(`    actual height:     ${Math.round(s.height)}px`);
});

// ─── 4. Full-page screenshot ──────────────────────────────────────────────
await page.screenshot({ path: join(outDir, '01-full-page.png'), fullPage: true });
console.log('\n[screenshot] 01-full-page.png');

// ─── 5. Viewport-Screenshot Section 1 (Hero) ─────────────────────────────
await page.screenshot({ path: join(outDir, '02-hero-viewport.png'), fullPage: false });
console.log('[screenshot] 02-hero-viewport.png');

// Welches Element ist bei (683,400) sichtbar?
const visibleAt = await page.evaluate(() => {
  const el = document.elementFromPoint(683, 400);
  let cursor = el;
  while (cursor && cursor !== document.documentElement) {
    if (cursor.tagName === 'SECTION') return { id: cursor.id, tag: cursor.tagName };
    cursor = cursor.parentElement;
  }
  return { id: el?.id || '?', tag: el?.tagName || '?' };
});
console.log('\n[Anfang] Sichtbare Section bei (683,400):', visibleAt);

// ─── 6. scrollBy(1px) smooth → warte 1s → welche Section? ───────────────
await page.evaluate(() => window.scrollBy({ top: 1, behavior: 'smooth' }));
await page.waitForTimeout(1200);

const visibleAfter1px = await page.evaluate(() => {
  const el = document.elementFromPoint(683, 400);
  let cursor = el;
  while (cursor && cursor !== document.documentElement) {
    if (cursor.tagName === 'SECTION') return { id: cursor.id, tag: cursor.tagName, scrollY: window.scrollY };
    cursor = cursor.parentElement;
  }
  return { id: el?.id || '?', tag: el?.tagName || '?', scrollY: window.scrollY };
});
console.log('[nach scrollBy(1)] scrollY:', visibleAfter1px.scrollY, '→ Section:', visibleAfter1px.id);

await page.screenshot({ path: join(outDir, '03-after-1px-scroll.png'), fullPage: false });
console.log('[screenshot] 03-after-1px-scroll.png');

// ─── 7. Zur nächsten Section scrollen (programmatisch wie User-Scroll) ───
const sections = await page.evaluate(() =>
  [...document.querySelectorAll('main > section')].map(s => s.id)
);
console.log('\n[Sections gefunden]:', sections);

// Nächste Section nach Hero
const nextSectionId = sections[1] || sections[0];
if (nextSectionId) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, nextSectionId);
  await page.waitForTimeout(1500);

  const visibleAtNext = await page.evaluate(() => {
    const el = document.elementFromPoint(683, 400);
    let cursor = el;
    while (cursor && cursor !== document.documentElement) {
      if (cursor.tagName === 'SECTION') return { id: cursor.id, scrollY: window.scrollY };
      cursor = cursor.parentElement;
    }
    return { id: el?.id || '?', scrollY: window.scrollY };
  });
  console.log(`\n[nach scrollIntoView #${nextSectionId}] scrollY:`, visibleAtNext.scrollY, '→ Section:', visibleAtNext.id);

  await page.screenshot({ path: join(outDir, `04-section-${nextSectionId}.png`), fullPage: false });
  console.log(`[screenshot] 04-section-${nextSectionId}.png`);

  // Snap-Check: Ist die Section exakt oben (scrollY ≈ offsetTop)?
  const snapCheck = await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const offsetTop = el.getBoundingClientRect().top + window.scrollY;
    const diff = Math.abs(window.scrollY - offsetTop);
    return { scrollY: window.scrollY, offsetTop: Math.round(offsetTop), diff: Math.round(diff) };
  }, nextSectionId);
  console.log(`[snap-check #${nextSectionId}] offsetTop=${snapCheck?.offsetTop}, scrollY=${snapCheck?.scrollY}, diff=${snapCheck?.diff}px`);
  if (snapCheck && snapCheck.diff <= 2) {
    console.log('  ✓ SNAP OK — Seite ist exakt auf Section-Oberkante gesnapped (<= 2px Abweichung)');
  } else {
    console.log('  ✗ SNAP NICHT PERFEKT — Abweichung:', snapCheck?.diff, 'px');
  }
}

// ─── 8. Noch eine Section weiter ─────────────────────────────────────────
const thirdSectionId = sections[2];
if (thirdSectionId) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, thirdSectionId);
  await page.waitForTimeout(1500);

  const snapCheck3 = await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const offsetTop = el.getBoundingClientRect().top + window.scrollY;
    const diff = Math.abs(window.scrollY - offsetTop);
    return { scrollY: window.scrollY, offsetTop: Math.round(offsetTop), diff: Math.round(diff) };
  }, thirdSectionId);
  console.log(`\n[snap-check #${thirdSectionId}] offsetTop=${snapCheck3?.offsetTop}, scrollY=${snapCheck3?.scrollY}, diff=${snapCheck3?.diff}px`);
  if (snapCheck3 && snapCheck3.diff <= 2) {
    console.log('  ✓ SNAP OK');
  } else {
    console.log('  ✗ SNAP NICHT PERFEKT — Abweichung:', snapCheck3?.diff, 'px');
  }

  await page.screenshot({ path: join(outDir, `05-section-${thirdSectionId}.png`), fullPage: false });
  console.log(`[screenshot] 05-section-${thirdSectionId}.png`);
}

// ─── 9. Alle Sections durchfahren und Snap-Diff prüfen ───────────────────
console.log('\n=== Snap-Check alle Sections ===');
for (const secId of sections) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, secId);
  await page.waitForTimeout(800);

  const check = await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const offsetTop = el.getBoundingClientRect().top + window.scrollY;
    const diff = Math.abs(window.scrollY - offsetTop);
    return {
      scrollY: Math.round(window.scrollY),
      offsetTop: Math.round(offsetTop),
      diff: Math.round(diff),
      height: Math.round(el.getBoundingClientRect().height),
    };
  }, secId);

  const status = check && check.diff <= 2 ? '✓' : '✗';
  console.log(`  ${status} #${secId}: offsetTop=${check?.offsetTop} scrollY=${check?.scrollY} diff=${check?.diff}px h=${check?.height}px`);
}

await browser.close();

console.log(`\nSCREENSHOTS_DIR=${outDir}`);
