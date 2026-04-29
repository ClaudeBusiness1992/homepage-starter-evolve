import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:4326';
const VIEWPORT = { width: 1280, height: 800 };

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);

  console.log('=== Navigiere zu ' + BASE_URL + ' ===');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  // ─────────────────────────────────────────────────────────────
  // TEST 1 – Galerie-Pfeile sichtbar?
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST 1: Galerie-Pfeile (#gallery) ---');
  await page.evaluate(() => {
    const el = document.querySelector('#gallery');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(600);

  const galleryNextRect = await page.evaluate(() => {
    // Suche zuerst innerhalb #gallery, dann global
    const gallery = document.querySelector('#gallery');
    const btn = gallery
      ? gallery.querySelector('.gallery-nav--next')
      : document.querySelector('.gallery-nav--next');
    if (!btn) return null;
    const r = btn.getBoundingClientRect();
    return { top: r.top, right: r.right, bottom: r.bottom, left: r.left, width: r.width, height: r.height };
  });
  console.log('gallery-nav--next BoundingClientRect:', JSON.stringify(galleryNextRect));
  if (galleryNextRect) {
    const inViewport = galleryNextRect.right <= 1280 && galleryNextRect.bottom <= 800
      && galleryNextRect.left >= 0 && galleryNextRect.top >= 0;
    console.log('Vollständig im Viewport?', inViewport);
  } else {
    console.log('ELEMENT NICHT GEFUNDEN');
  }

  const galleryPrevHidden = await page.evaluate(() => {
    const gallery = document.querySelector('#gallery');
    const btn = gallery
      ? gallery.querySelector('.gallery-nav--prev')
      : document.querySelector('.gallery-nav--prev');
    if (!btn) return 'NICHT GEFUNDEN';
    return btn.hasAttribute('hidden') ? 'JA (hidden-Attribut vorhanden)' : 'NEIN (kein hidden-Attribut)';
  });
  console.log('gallery-nav--prev hidden-Attribut:', galleryPrevHidden);

  // ─────────────────────────────────────────────────────────────
  // TEST 2 – Reviews-Pfeile sichtbar?
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST 2: Reviews-Pfeile (#reviews) ---');
  await page.evaluate(() => {
    const el = document.querySelector('#reviews');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(600);

  const reviewsNextRect = await page.evaluate(() => {
    const reviews = document.querySelector('#reviews');
    const btn = reviews
      ? reviews.querySelector('.gallery-nav--next')
      : null;
    if (!btn) return null;
    const r = btn.getBoundingClientRect();
    return { top: r.top, right: r.right, bottom: r.bottom, left: r.left, width: r.width, height: r.height };
  });
  console.log('reviews .gallery-nav--next BoundingClientRect:', JSON.stringify(reviewsNextRect));
  if (reviewsNextRect) {
    const inViewport = reviewsNextRect.right <= 1280 && reviewsNextRect.bottom <= 800
      && reviewsNextRect.left >= 0 && reviewsNextRect.top >= 0;
    console.log('Vollständig im Viewport?', inViewport);
  } else {
    console.log('ELEMENT NICHT GEFUNDEN');
  }

  // ─────────────────────────────────────────────────────────────
  // TEST 3 – Erste Bewertungskarte bündig mit Stats-Banner?
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST 3: reviews-stats vs. erste review-card (left-Bündigkeit) ---');
  const alignment = await page.evaluate(() => {
    const reviews = document.querySelector('#reviews');
    if (!reviews) return { error: '#reviews nicht gefunden' };
    const stats = reviews.querySelector('.reviews-stats');
    const card = reviews.querySelector('.review-card');
    if (!stats) return { error: '.reviews-stats nicht gefunden' };
    if (!card) return { error: '.review-card nicht gefunden' };
    const statsLeft = stats.getBoundingClientRect().left;
    const cardLeft = card.getBoundingClientRect().left;
    return {
      reviewsStatsLeft: statsLeft,
      firstReviewCardLeft: cardLeft,
      differenz: Math.abs(statsLeft - cardLeft),
      buendig: Math.abs(statsLeft - cardLeft) <= 2
    };
  });
  console.log('Alignment-Messung:', JSON.stringify(alignment));

  // ─────────────────────────────────────────────────────────────
  // TEST 4 – Kein Doppel-Skip beim Scrollen?
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST 4: Doppel-Skip-Test (5x wheel deltaY=100) ---');
  // Zuerst zurück zum Hero / scrollY=0
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);

  const scrollYBefore = await page.evaluate(() => window.scrollY);
  console.log('scrollY vor Wheel-Events:', scrollYBefore);

  // 5 Wheel-Events schnell hintereinander
  await page.evaluate(() => {
    for (let i = 0; i < 5; i++) {
      window.dispatchEvent(new WheelEvent('wheel', {
        deltaY: 100,
        deltaMode: 0,
        bubbles: true,
        cancelable: true
      }));
    }
  });

  await page.waitForTimeout(2000);
  const scrollYAfter = await page.evaluate(() => window.scrollY);

  // Zusätzlich: offsetTop der About- und nächsten Sektion ermitteln
  const sectionOffsets = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section[id], div[id]'));
    return sections.slice(0, 6).map(s => ({ id: s.id, offsetTop: s.offsetTop }));
  });
  console.log('scrollY nach 5x wheel + 2s Wartezeit:', scrollYAfter);
  console.log('Erste Sektionen offsetTop:', JSON.stringify(sectionOffsets));

  const aboutOffset = sectionOffsets.find(s => s.id === 'about')?.offsetTop ?? 'nicht gefunden';
  const diff = typeof aboutOffset === 'number' ? Math.abs(scrollYAfter - aboutOffset) : 'n/a';
  console.log('About-Section offsetTop:', aboutOffset);
  console.log('|scrollY - aboutOffsetTop|:', diff);
  if (typeof scrollYAfter === 'number' && typeof aboutOffset === 'number') {
    if (diff <= 50) {
      console.log('ERGEBNIS: Kein Doppel-Skip – scrollY nahe About-Section');
    } else if (scrollYAfter > aboutOffset * 1.5) {
      console.log('ERGEBNIS: Möglicher Doppel-Skip – scrollY deutlich über About-Section');
    } else {
      console.log('ERGEBNIS: Scrollposition unklar – manuelle Prüfung empfohlen');
    }
  }

  await browser.close();
  console.log('\n=== Alle Tests abgeschlossen ===');
}

run().catch(err => {
  console.error('FEHLER:', err);
  process.exit(1);
});
