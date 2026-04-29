/**
 * Scroll-Snap Final Verification Script
 * Tests: computed styles, snap-scroll, countdown height, footer snap, reverse scroll
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const URL = 'http://localhost:4321';
const VIEWPORT = { width: 1366, height: 768 };

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = join('.screenshots', ts, 'snap-verify');
mkdirSync(outDir, { recursive: true });

console.log(`SCREENSHOTS_DIR=.screenshots/${ts}/snap-verify`);
console.log(`URL: ${URL}`);
console.log(`Viewport: ${VIEWPORT.width}x${VIEWPORT.height}`);
console.log('');

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});
const page = await ctx.newPage();
page.on('pageerror', e => console.warn('pageerror:', e.message));

await page.goto(URL, { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(800);

// Hide dev toolbar + dismiss cookie
await page.evaluate(() => {
  const t = document.querySelector('astro-dev-toolbar');
  if (t) t.style.display = 'none';
  const btn = document.querySelector('.cookie-btn-secondary');
  if (btn) btn.click();
});
await page.waitForTimeout(400);

// Force reveal animations
await page.evaluate(() => {
  document.querySelectorAll('.r').forEach(el => el.classList.add('in'));
});
await page.waitForTimeout(300);

// ─── TEST 1: Computed Styles ─────────────────────────────────────────────────
console.log('═══ TEST 1: Computed Styles ═══');
const computedStyles = await page.evaluate(() => {
  const main = document.querySelector('main');
  const mainStyle = window.getComputedStyle(main);
  const mainSnap = {
    scrollSnapType: mainStyle.scrollSnapType,
    overflowY: mainStyle.overflowY,
    height: mainStyle.height,
  };

  const sections = [...document.querySelectorAll('main > section, footer')].map(s => ({
    tag: s.tagName,
    id: s.id,
    classes: s.className.substring(0, 60),
    snapAlign: window.getComputedStyle(s).scrollSnapAlign,
    snapStop: window.getComputedStyle(s).scrollSnapStop,
    minHeight: window.getComputedStyle(s).minHeight,
    height: window.getComputedStyle(s).height,
    actualHeight: Math.round(s.getBoundingClientRect().height),
    offsetTop: s.offsetTop,
  }));

  return { main: mainSnap, sections };
});

console.log('MAIN container:');
console.log(`  scroll-snap-type: ${computedStyles.main.scrollSnapType}`);
console.log(`  overflow-y:       ${computedStyles.main.overflowY}`);
console.log(`  height:           ${computedStyles.main.height}`);
console.log('');
console.log('Sections:');
for (const s of computedStyles.sections) {
  const snapOk = s.snapAlign !== 'none' && s.snapAlign !== '';
  const heightOk = s.actualHeight >= 700;
  console.log(`  [${snapOk ? '✓' : '✗'} snap] [${heightOk ? '✓' : '✗'} height] #${s.id || s.tag} — snap-align:${s.snapAlign} | min-height:${s.minHeight} | actualHeight:${s.actualHeight}px | offsetTop:${s.offsetTop}px`);
}
console.log('');

// ─── TEST 2: Scroll Top to Bottom ────────────────────────────────────────────
console.log('═══ TEST 2: Scroll Top→Bottom ═══');
const scrollResults = await page.evaluate(() => {
  const sections = [...document.querySelectorAll('main > section, footer')];
  return sections.map(s => ({ id: s.id || s.tagName, offsetTop: s.offsetTop }));
});

// Start at top
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(500);

const snapResults = [];
for (const sec of scrollResults) {
  await page.evaluate((offsetTop) => {
    window.scrollTo({ top: offsetTop, behavior: 'instant' });
  }, sec.offsetTop);
  await page.waitForTimeout(600);

  const scrollY = await page.evaluate(() => window.scrollY);
  const diff = Math.abs(scrollY - sec.offsetTop);
  const snapped = diff < 20;
  snapResults.push({ id: sec.id, targetOffsetTop: sec.offsetTop, scrollY, diff, snapped });
  console.log(`  ${snapped ? '✓' : '✗'} #${sec.id} — target:${sec.offsetTop} scrollY:${scrollY} diff:${diff}px`);
}
console.log('');

// ─── TEST 3: Countdown Section ───────────────────────────────────────────────
console.log('═══ TEST 3: Countdown Section ═══');

await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(600);

const countdownInfo = await page.evaluate(() => {
  const cd = document.querySelector('#countdown');
  if (!cd) return null;
  const style = window.getComputedStyle(cd);
  const rect = cd.getBoundingClientRect();
  const vh = window.innerHeight;

  // Check if hero is visible while at scrollY=0
  const hero = document.querySelector('#hero');
  const heroRect = hero ? hero.getBoundingClientRect() : null;

  // Check what's visible in viewport
  const allSections = [...document.querySelectorAll('main > section, footer')];
  const visible = allSections.filter(s => {
    const r = s.getBoundingClientRect();
    return r.top < vh && r.bottom > 0;
  }).map(s => ({ id: s.id || s.tagName, top: Math.round(s.getBoundingClientRect().top), bottom: Math.round(s.getBoundingClientRect().bottom) }));

  return {
    minHeight: style.minHeight,
    actualHeight: Math.round(rect.height),
    viewportHeight: vh,
    meetsMinHeight: rect.height >= vh * 0.95,
    heroVisible: heroRect ? (heroRect.top < vh && heroRect.bottom > 0) : false,
    heroTop: heroRect ? Math.round(heroRect.top) : null,
    sectionsInView: visible,
  };
});

if (countdownInfo) {
  console.log(`  min-height:     ${countdownInfo.minHeight}`);
  console.log(`  actualHeight:   ${countdownInfo.actualHeight}px`);
  console.log(`  viewportHeight: ${countdownInfo.viewportHeight}px`);
  console.log(`  meetsMinHeight: ${countdownInfo.meetsMinHeight ? '✓' : '✗'} (≥95% vh)`);
  console.log(`  Hero visible at scrollY=0: ${countdownInfo.heroVisible ? '⚠ YES (leaks)' : '✓ NO (hidden)'}`);
  console.log(`  Hero top: ${countdownInfo.heroTop}px`);
  console.log(`  Sections in viewport:`);
  for (const v of countdownInfo.sectionsInView) {
    console.log(`    #${v.id}: top=${v.top}px bottom=${v.bottom}px`);
  }
} else {
  console.log('  ✗ #countdown not found!');
}
console.log('');

await page.screenshot({ path: join(outDir, '03-countdown-snap.png'), fullPage: false });
console.log('  Screenshot: 03-countdown-snap.png');
console.log('');

// ─── TEST 4: Footer Snap ─────────────────────────────────────────────────────
console.log('═══ TEST 4: Footer Snap ═══');

const footerInfo = await page.evaluate(() => {
  const footer = document.querySelector('footer');
  if (!footer) return null;
  const style = window.getComputedStyle(footer);
  return {
    snapAlign: style.scrollSnapAlign,
    snapStop: style.scrollSnapStop,
    minHeight: style.minHeight,
    actualHeight: Math.round(footer.getBoundingClientRect().height),
    offsetTop: footer.offsetTop,
  };
});

console.log(`  footer snap-align: ${footerInfo?.snapAlign}`);
console.log(`  footer snap-stop:  ${footerInfo?.snapStop}`);
console.log(`  footer min-height: ${footerInfo?.minHeight}`);
console.log(`  footer height:     ${footerInfo?.actualHeight}px`);
console.log(`  footer offsetTop:  ${footerInfo?.offsetTop}px`);

// Scroll to contact first
const contactOffsetTop = await page.evaluate(() => {
  const contact = document.querySelector('#contact');
  return contact ? contact.offsetTop : 0;
});
await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), contactOffsetTop);
await page.waitForTimeout(600);
const scrollAtContact = await page.evaluate(() => window.scrollY);
console.log(`  scrollY at #contact: ${scrollAtContact}px`);

// Now scroll to footer
await page.evaluate(() => {
  const footer = document.querySelector('footer');
  if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(800);
const scrollAtFooter = await page.evaluate(() => window.scrollY);
const targetFooter = footerInfo?.offsetTop ?? 0;
const footerSnapDiff = Math.abs(scrollAtFooter - targetFooter);
console.log(`  scrollY at footer: ${scrollAtFooter}px (target: ${targetFooter}px, diff: ${footerSnapDiff}px)`);
console.log(`  Footer snap: ${footerSnapDiff < 30 ? '✓ works' : '⚠ misaligned by ' + footerSnapDiff + 'px'}`);

await page.screenshot({ path: join(outDir, '09-footer-snap.png'), fullPage: false });
console.log('  Screenshot: 09-footer-snap.png');
console.log('');

// ─── TEST 5: Reverse Scroll (bottom → top) ───────────────────────────────────
console.log('═══ TEST 5: Reverse Scroll (Bottom→Top) ═══');

// Get all sections reversed
const allSectionsReverse = [...scrollResults].reverse();

for (const sec of allSectionsReverse) {
  await page.evaluate((offsetTop) => {
    window.scrollTo({ top: offsetTop, behavior: 'instant' });
  }, sec.offsetTop);
  await page.waitForTimeout(600);

  const scrollY = await page.evaluate(() => window.scrollY);
  const diff = Math.abs(scrollY - sec.offsetTop);
  const snapped = diff < 20;
  console.log(`  ${snapped ? '✓' : '✗'} #${sec.id} — target:${sec.offsetTop} scrollY:${scrollY} diff:${diff}px`);
}
console.log('');

// ─── TEST 6: Full-Page Screenshots per Section ───────────────────────────────
console.log('═══ TEST 6: Section Screenshots ═══');

const sectionDefs = [
  { sel: '#countdown', name: '01-countdown.png' },
  { sel: '#hero',      name: '02-hero.png' },
  { sel: '#about',     name: '03-about.png' },
  { sel: '#services',  name: '04-services.png' },
  { sel: '#gallery',   name: '05-gallery.png' },
  { sel: '#pricing',   name: '06-pricing.png' },
  { sel: '#reviews',   name: '07-reviews.png' },
  { sel: '#booking',   name: '08-booking.png' },
  { sel: '#contact',   name: '09-contact.png' },
  { sel: 'footer',     name: '10-footer.png' },
];

for (const { sel, name } of sectionDefs) {
  const el = await page.$(sel);
  if (!el) {
    console.log(`  ✗ ${sel} not found — skipping ${name}`);
    continue;
  }
  await page.evaluate((s) => {
    const e = document.querySelector(s);
    if (e) e.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, sel);
  await page.waitForTimeout(800);

  const scrollY = await page.evaluate(() => window.scrollY);
  await page.screenshot({ path: join(outDir, name), fullPage: false });
  console.log(`  ✓ ${name} — scrollY:${scrollY}px`);
}
console.log('');

// Full page overview
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(400);
await page.screenshot({ path: join(outDir, '00-full-page.png'), fullPage: true });
console.log('  ✓ 00-full-page.png (full page overview)');

await ctx.close();
await browser.close();

console.log('');
console.log(`SCREENSHOTS_DIR=.screenshots/${ts}/snap-verify`);
