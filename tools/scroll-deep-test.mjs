// scroll-deep-test.mjs — vollständiger Scroll-Test für alle 6 Aufgaben
// Aufgabe 1: Computed Styles
// Aufgabe 2: Scroll von oben nach unten (sanft, hart, sehr schnell)
// Aufgabe 3: Von unten nach oben
// Aufgabe 4: Countdown prüfen
// Aufgabe 5: Footer-Sichtbarkeit bei Contact
// Aufgabe 6: Abstandsprüfung About / Services / Pricing

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const URL = 'http://localhost:4321';
const VIEWPORT = { width: 1366, height: 768 };

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = join('C:\\ClaudeBusiness\\homepage-starter-evolve\\.screenshots', ts, 'scroll-deep');
mkdirSync(outDir, { recursive: true });
console.log(`\nSCREENSHOTS_DIR=${outDir}\n`);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: 1,
  reducedMotion: 'no-preference',
});
const page = await ctx.newPage();
page.on('pageerror', e => console.warn('[pageerror]', e.message));

// ─── Setup ────────────────────────────────────────────────────────────────────
await page.goto(URL, { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(800);

await page.evaluate(() => {
  const t = document.querySelector('astro-dev-toolbar');
  if (t) t.style.display = 'none';
  const btn = document.querySelector('.cookie-btn-secondary');
  if (btn) btn.click();
});
await page.waitForTimeout(400);

// Reveal-Animationen erzwingen
await page.evaluate(() => {
  document.querySelectorAll('.r').forEach(el => el.classList.add('in'));
});
await page.waitForTimeout(300);

// Helper: welche Section ist aktuell in der Mitte des Viewports sichtbar?
const visibleSection = () => page.evaluate(() => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const el = document.elementFromPoint(cx, cy);
  let cursor = el;
  while (cursor && cursor !== document.documentElement) {
    if (cursor.tagName === 'SECTION') return { id: cursor.id || '(no-id)', scrollY: Math.round(window.scrollY) };
    cursor = cursor.parentElement;
  }
  return { id: el?.tagName || '?', scrollY: Math.round(window.scrollY) };
});

// Helper: Snap-Check für eine Section
const snapCheck = (id) => page.evaluate((secId) => {
  const el = document.getElementById(secId);
  if (!el) return { found: false };
  const offsetTop = el.getBoundingClientRect().top + window.scrollY;
  const diff = Math.abs(window.scrollY - offsetTop);
  return {
    found: true,
    scrollY: Math.round(window.scrollY),
    offsetTop: Math.round(offsetTop),
    diff: Math.round(diff),
    height: Math.round(el.getBoundingClientRect().height),
    ok: diff <= 5,
  };
}, id);

// ─── AUFGABE 1: Computed Styles ───────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════');
console.log('AUFGABE 1 — Computed Styles');
console.log('══════════════════════════════════════════════');

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

const rootSnap = await page.evaluate(() => ({
  html: getComputedStyle(document.documentElement).scrollSnapType,
  body: getComputedStyle(document.body).scrollSnapType,
  htmlOverflow: getComputedStyle(document.documentElement).overflow,
  bodyOverflow: getComputedStyle(document.body).overflow,
  htmlOverflowY: getComputedStyle(document.documentElement).overflowY,
}));
console.log('html scroll-snap-type:', rootSnap.html || '(leer)');
console.log('body scroll-snap-type:', rootSnap.body || '(leer)');
console.log('html overflow:', rootSnap.htmlOverflow, '/ overflow-y:', rootSnap.htmlOverflowY);
console.log('body overflow:', rootSnap.bodyOverflow);

const sectionStyles = await page.evaluate(() => {
  return [...document.querySelectorAll('main > section')].map((s, i) => ({
    idx: i + 1,
    id: s.id || '(no-id)',
    snapAlign: getComputedStyle(s).scrollSnapAlign,
    snapStop:  getComputedStyle(s).scrollSnapStop,
    minHeight: getComputedStyle(s).minHeight,
    height:    Math.round(s.getBoundingClientRect().height),
    offsetTop: Math.round(s.getBoundingClientRect().top + window.scrollY),
  }));
});

console.log('\nmain > section computed styles:');
console.log(`${'#'.padEnd(3)} ${'id'.padEnd(16)} ${'snap-align'.padEnd(14)} ${'snap-stop'.padEnd(12)} ${'min-height'.padEnd(12)} ${'height'.padEnd(8)} offsetTop`);
console.log('─'.repeat(95));
sectionStyles.forEach(s => {
  console.log(
    `${String(s.idx).padEnd(3)} ${('#' + s.id).padEnd(16)} ${(s.snapAlign || '(leer)').padEnd(14)} ${(s.snapStop || '(leer)').padEnd(12)} ${(s.minHeight || '(leer)').padEnd(12)} ${String(s.height + 'px').padEnd(8)} ${s.offsetTop}px`
  );
});

const sectionIds = sectionStyles.map(s => s.id);
console.log('\nGefundene Section-IDs:', sectionIds.join(', '));

// ─── AUFGABE 2a: Sanft zu #about ─────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════');
console.log('AUFGABE 2a — Sanft zu #about (Section 2/3)');
console.log('══════════════════════════════════════════════');

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);

// Finde offsetTop von #about
const aboutOffset = await page.evaluate(() => {
  const el = document.getElementById('about');
  if (!el) return null;
  return Math.round(el.getBoundingClientRect().top + window.scrollY);
});
console.log('#about offsetTop:', aboutOffset, 'px');

// Sanft scrollen mit scrollTo behavior:smooth
await page.evaluate((top) => {
  window.scrollTo({ top, behavior: 'smooth' });
}, aboutOffset);
await page.waitForTimeout(1500); // Warte auf smooth scroll

const afterAboutSmooth = await visibleSection();
const aboutSnap = await snapCheck('about');
console.log('Nach smooth scrollTo #about → scrollY:', afterAboutSmooth.scrollY, '| sichtbare Section:', afterAboutSmooth.id);
console.log('Snap-Check #about: offsetTop=' + aboutSnap.offsetTop + ' diff=' + aboutSnap.diff + 'px', aboutSnap.ok ? '✓ OK' : '✗ NICHT GESNAPPT');

await page.screenshot({ path: join(outDir, '2a-about-smooth.png'), fullPage: false });
console.log('[screenshot] 2a-about-smooth.png');

// ─── AUFGABE 2b: Hart 2 Sections überspringen → #gallery ─────────────────────
console.log('\n══════════════════════════════════════════════');
console.log('AUFGABE 2b — Hart zu #gallery (2 Sections überspringen)');
console.log('══════════════════════════════════════════════');

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

const galleryOffset = await page.evaluate(() => {
  const el = document.getElementById('gallery');
  if (!el) return null;
  return Math.round(el.getBoundingClientRect().top + window.scrollY);
});
console.log('#gallery offsetTop:', galleryOffset, 'px');

// Hart scrollen (instant)
await page.evaluate((top) => {
  window.scrollTo({ top, behavior: 'instant' });
}, galleryOffset);
await page.waitForTimeout(1000);

const afterGalleryHard = await visibleSection();
const gallerySnap = await snapCheck('gallery');
console.log('Nach instant scrollTo #gallery → scrollY:', afterGalleryHard.scrollY, '| sichtbare Section:', afterGalleryHard.id);
console.log('Snap-Check #gallery: offsetTop=' + gallerySnap.offsetTop + ' diff=' + gallerySnap.diff + 'px', gallerySnap.ok ? '✓ OK' : '✗ ABWEICHUNG');

// Prüfe welche Sections übersprungen wurden (keine Screenshots von ihnen)
// Intermediate sections between start and gallery:
const intermediates = sectionIds.slice(0, sectionIds.indexOf('gallery'));
console.log('Übersprungene Sections:', intermediates.join(', '));

await page.screenshot({ path: join(outDir, '2b-gallery-hard-jump.png'), fullPage: false });
console.log('[screenshot] 2b-gallery-hard-jump.png');

// ─── AUFGABE 2c: Sehr schnell bis Ende → #contact ────────────────────────────
console.log('\n══════════════════════════════════════════════');
console.log('AUFGABE 2c — Sehr schnell bis Ende (#contact)');
console.log('══════════════════════════════════════════════');

const contactOffset = await page.evaluate(() => {
  const el = document.getElementById('contact');
  if (!el) return null;
  return Math.round(el.getBoundingClientRect().top + window.scrollY);
});
console.log('#contact offsetTop:', contactOffset, 'px');

await page.evaluate((top) => {
  window.scrollTo({ top, behavior: 'instant' });
}, contactOffset);
await page.waitForTimeout(1200);

const afterContactFast = await visibleSection();
const contactSnap = await snapCheck('contact');
console.log('Nach instant scrollTo #contact → scrollY:', afterContactFast.scrollY, '| sichtbare Section:', afterContactFast.id);
console.log('Snap-Check #contact: offsetTop=' + contactSnap.offsetTop + ' diff=' + contactSnap.diff + 'px', contactSnap.ok ? '✓ OK' : '✗ ABWEICHUNG');

await page.screenshot({ path: join(outDir, '2c-contact-fast.png'), fullPage: false });
console.log('[screenshot] 2c-contact-fast.png');

// ─── AUFGABE 3d: Von #contact zurück zu #services ────────────────────────────
console.log('\n══════════════════════════════════════════════');
console.log('AUFGABE 3d — Von #contact zurück zu #services');
console.log('══════════════════════════════════════════════');

const servicesOffset = await page.evaluate(() => {
  const el = document.getElementById('services');
  if (!el) return null;
  return Math.round(el.getBoundingClientRect().top + window.scrollY);
});
console.log('#services offsetTop:', servicesOffset, 'px');

// Smooth nach oben
await page.evaluate((top) => {
  window.scrollTo({ top, behavior: 'smooth' });
}, servicesOffset);
await page.waitForTimeout(1800);

const afterServicesBack = await visibleSection();
const servicesSnap = await snapCheck('services');
console.log('Nach smooth scrollTo #services → scrollY:', afterServicesBack.scrollY, '| sichtbare Section:', afterServicesBack.id);
console.log('Snap-Check #services: offsetTop=' + servicesSnap.offsetTop + ' diff=' + servicesSnap.diff + 'px', servicesSnap.ok ? '✓ OK' : '✗ ABWEICHUNG');

await page.screenshot({ path: join(outDir, '3d-services-back.png'), fullPage: false });
console.log('[screenshot] 3d-services-back.png');

// ─── AUFGABE 3e: Ganz nach oben (#hero / #countdown) ─────────────────────────
console.log('\n══════════════════════════════════════════════');
console.log('AUFGABE 3e — Ganz nach oben (#hero / #countdown)');
console.log('══════════════════════════════════════════════');

await page.evaluate(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
await page.waitForTimeout(1800);

const afterTop = await visibleSection();
const topScrollY = await page.evaluate(() => Math.round(window.scrollY));
console.log('Nach scroll-to-top → scrollY:', topScrollY, '| sichtbare Section:', afterTop.id);

// Was ist die erste Section?
const firstSection = sectionIds[0];
const topSnap = await snapCheck(firstSection);
console.log(`Snap-Check erste Section (#${firstSection}): offsetTop=${topSnap.offsetTop} diff=${topSnap.diff}px`, topSnap.ok ? '✓ OK' : '✗ ABWEICHUNG');

await page.screenshot({ path: join(outDir, '3e-top-back.png'), fullPage: false });
console.log('[screenshot] 3e-top-back.png');

// ─── AUFGABE 4: Countdown prüfen ─────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════');
console.log('AUFGABE 4 — Countdown Section');
console.log('══════════════════════════════════════════════');

const countdownInfo = await page.evaluate(() => {
  const el = document.getElementById('countdown');
  if (!el) return { found: false };

  // Position in main > section Liste
  const mainSections = [...document.querySelectorAll('main > section')];
  const idx = mainSections.findIndex(s => s.id === 'countdown');

  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const offsetTop = rect.top + window.scrollY;

  // Ist #countdown das erste Kind von main?
  const mainEl = document.querySelector('main');
  const firstMainSection = mainEl ? mainEl.querySelector('section') : null;
  const isFirst = firstMainSection && firstMainSection.id === 'countdown';

  return {
    found: true,
    isFirst,
    indexInMain: idx,
    snapAlign: cs.scrollSnapAlign,
    snapStop: cs.scrollSnapStop,
    minHeight: cs.minHeight,
    height: Math.round(rect.height),
    offsetTop: Math.round(offsetTop),
    display: cs.display,
    visibility: cs.visibility,
  };
});

console.log('#countdown vorhanden:', countdownInfo.found);
if (countdownInfo.found) {
  console.log('Ist erste Section in <main>:', countdownInfo.isFirst);
  console.log('Index in main > section:', countdownInfo.indexInMain);
  console.log('scroll-snap-align:', countdownInfo.snapAlign || '(leer)');
  console.log('scroll-snap-stop:', countdownInfo.snapStop || '(leer)');
  console.log('min-height:', countdownInfo.minHeight || '(leer)');
  console.log('actual height:', countdownInfo.height + 'px');
  console.log('display:', countdownInfo.display);
  console.log('visibility:', countdownInfo.visibility);

  // Scroll zu Countdown
  await page.evaluate(() => {
    const el = document.getElementById('countdown');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(800);

  const cdSnap = await snapCheck('countdown');
  console.log('Snap-Check #countdown: diff=' + cdSnap.diff + 'px', cdSnap.ok ? '✓ OK' : '✗ ABWEICHUNG');

  await page.screenshot({ path: join(outDir, '4-countdown.png'), fullPage: false });
  console.log('[screenshot] 4-countdown.png');
} else {
  console.log('  → #countdown NICHT gefunden in DOM');
}

// ─── AUFGABE 5: Footer-Sichtbarkeit bei #contact ──────────────────────────────
console.log('\n══════════════════════════════════════════════');
console.log('AUFGABE 5 — Footer-Sichtbarkeit bei #contact');
console.log('══════════════════════════════════════════════');

// Scroll zu #contact
await page.evaluate((top) => {
  window.scrollTo({ top, behavior: 'instant' });
}, contactOffset);
await page.waitForTimeout(1000);

const footerInfo = await page.evaluate(() => {
  const footer = document.querySelector('footer');
  if (!footer) return { found: false };

  const footerRect = footer.getBoundingClientRect();
  const viewportH = window.innerHeight;

  return {
    found: true,
    // top/bottom relativ zum Viewport (negativ = oberhalb Viewport, > viewportH = unterhalb)
    top:    Math.round(footerRect.top),
    bottom: Math.round(footerRect.bottom),
    height: Math.round(footerRect.height),
    viewportH,
    // Sichtbar = teilweise oder vollständig im Viewport
    partiallyVisible: footerRect.top < viewportH && footerRect.bottom > 0,
    fullyVisible: footerRect.top >= 0 && footerRect.bottom <= viewportH,
    // Abstand zwischen Footer-Oberkante und Viewport-Unterkante
    distanceFromBottom: Math.round(viewportH - footerRect.top),
  };
});

const contactSnapFinal = await snapCheck('contact');
console.log('scrollY nach snap zu #contact:', contactSnapFinal.scrollY);
console.log('Snap-Check #contact: diff=' + contactSnapFinal.diff + 'px', contactSnapFinal.ok ? '✓ OK' : '✗ ABWEICHUNG');

if (footerInfo.found) {
  console.log('Footer gefunden:');
  console.log('  top (relativ Viewport):', footerInfo.top + 'px');
  console.log('  bottom (relativ Viewport):', footerInfo.bottom + 'px');
  console.log('  height:', footerInfo.height + 'px');
  console.log('  Viewport-H:', footerInfo.viewportH + 'px');
  console.log('  Teilweise sichtbar:', footerInfo.partiallyVisible);
  console.log('  Vollständig sichtbar:', footerInfo.fullyVisible);
  if (footerInfo.partiallyVisible) {
    console.log('  → Footer ragt', footerInfo.distanceFromBottom + 'px in den Viewport (von oben)');
  } else if (footerInfo.top >= footerInfo.viewportH) {
    console.log('  → Footer ist UNTERHALB des Viewports, nicht sichtbar');
    console.log('  → Footer-Oberkante bei', footerInfo.top + 'px (Viewport endet bei', footerInfo.viewportH + 'px)');
  }
} else {
  console.log('  → <footer> NICHT gefunden');
}

await page.screenshot({ path: join(outDir, '5-contact-footer.png'), fullPage: false });
console.log('[screenshot] 5-contact-footer.png');

// ─── AUFGABE 6: Abstandsprüfung About / Services / Pricing ───────────────────
console.log('\n══════════════════════════════════════════════');
console.log('AUFGABE 6 — Abstandsprüfung About / Services / Pricing');
console.log('══════════════════════════════════════════════');

for (const secId of ['about', 'services', 'pricing']) {
  const secOffset = await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    return Math.round(el.getBoundingClientRect().top + window.scrollY);
  }, secId);

  if (secOffset === null) {
    console.log(`#${secId}: NICHT GEFUNDEN`);
    continue;
  }

  await page.evaluate((top) => {
    window.scrollTo({ top, behavior: 'instant' });
  }, secOffset);
  await page.waitForTimeout(900);

  // Messe tatsächliche Abstände: Abstand zwischen Oberkante Section und erstem Inhalts-Element
  const spacingInfo = await page.evaluate((id) => {
    const section = document.getElementById(id);
    if (!section) return null;

    const sRect = section.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // Finde das erste sichtbare Inline-/Block-Element (h2, p, div.container, etc.)
    const firstChild = section.querySelector('h2, h3, .container, .section-header, [class*="header"], [class*="title"]');
    const lastChild = [...section.querySelectorAll('*')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.bottom > sRect.top && r.top < sRect.bottom && r.height > 0;
    }).pop();

    const firstRect = firstChild ? firstChild.getBoundingClientRect() : null;
    const lastRect = lastChild ? lastChild.getBoundingClientRect() : null;

    return {
      sectionTop: Math.round(sRect.top),
      sectionBottom: Math.round(sRect.bottom),
      sectionH: Math.round(sRect.height),
      viewportH,
      // freier Platz oben: von section-top bis erstem Inhaltselement
      spaceTop: firstRect ? Math.round(firstRect.top - sRect.top) : '(n/a)',
      // freier Platz unten: von letztem Element bis section-bottom
      spaceBottom: lastRect ? Math.round(sRect.bottom - lastRect.bottom) : '(n/a)',
      firstChildTag: firstChild ? (firstChild.tagName + '.' + firstChild.className.split(' ').join('.')) : '(none)',
      lastChildTag: lastChild ? (lastChild.tagName + '.' + lastChild.className.split(' ').join('.')) : '(none)',
    };
  }, secId);

  if (spacingInfo) {
    const balanced = typeof spacingInfo.spaceTop === 'number' && typeof spacingInfo.spaceBottom === 'number'
      ? Math.abs(spacingInfo.spaceTop - spacingInfo.spaceBottom) <= 40
        ? '≈ symmetrisch'
        : `ASYMMETRISCH (Diff: ${Math.abs(spacingInfo.spaceTop - spacingInfo.spaceBottom)}px)`
      : '(n/a)';
    console.log(`\n#${secId}:`);
    console.log(`  Section im Viewport: top=${spacingInfo.sectionTop}px bottom=${spacingInfo.sectionBottom}px h=${spacingInfo.sectionH}px`);
    console.log(`  Freier Platz oben:   ${spacingInfo.spaceTop}px (bis ${spacingInfo.firstChildTag})`);
    console.log(`  Freier Platz unten:  ${spacingInfo.spaceBottom}px (nach ${spacingInfo.lastChildTag})`);
    console.log(`  Balance:             ${balanced}`);
  }

  await page.screenshot({ path: join(outDir, `6-${secId}-spacing.png`), fullPage: false });
  console.log(`[screenshot] 6-${secId}-spacing.png`);
}

// ─── Alle Sections Viewport-Screenshots ──────────────────────────────────────
console.log('\n══════════════════════════════════════════════');
console.log('ALLE SECTIONS — Viewport-Screenshots (Laptop 1366×768)');
console.log('══════════════════════════════════════════════');

// Reset nach oben
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

// Full-page screenshot
await page.screenshot({ path: join(outDir, '00-full-page.png'), fullPage: true });
console.log('[screenshot] 00-full-page.png');

let idx = 1;
for (const secId of sectionIds) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, secId);
  await page.waitForTimeout(900);

  const name = `${String(idx).padStart(2, '0')}-${secId}.png`;
  await page.screenshot({ path: join(outDir, name), fullPage: false });
  console.log(`[screenshot] ${name}`);
  idx++;
}

// Footer Screenshot
await page.evaluate(() => {
  const footer = document.querySelector('footer');
  if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: join(outDir, `${String(idx).padStart(2, '0')}-footer.png`), fullPage: false });
console.log(`[screenshot] ${String(idx).padStart(2, '0')}-footer.png`);

// ─── Zusammenfassung ─────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════');
console.log('ZUSAMMENFASSUNG');
console.log('══════════════════════════════════════════════');

const allSectionsSnap = await page.evaluate(() => {
  const results = [];
  document.querySelectorAll('main > section').forEach(s => {
    const cs = getComputedStyle(s);
    const rect = s.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY;
    results.push({
      id: s.id || '(no-id)',
      snapAlign: cs.scrollSnapAlign,
      snapStop: cs.scrollSnapStop,
      minHeight: cs.minHeight,
      height: Math.round(rect.height),
      offsetTop: Math.round(offsetTop),
    });
  });
  return results;
});

console.log('\nScroll-Snap aktiv auf:', rootSnap.html ? 'html' : (rootSnap.body ? 'body' : 'KEIN SNAP CONTAINER'));
console.log('Sections mit snap-align: start:', allSectionsSnap.filter(s => s.snapAlign.includes('start')).length, '/', allSectionsSnap.length);
console.log('Sections mit snap-align (leer):', allSectionsSnap.filter(s => !s.snapAlign || s.snapAlign === 'none').length);
console.log('\nSCREENSHOTS_DIR=' + outDir);

await browser.close();
