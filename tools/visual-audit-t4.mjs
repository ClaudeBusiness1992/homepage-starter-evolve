import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:4326';
const VIEWPORT = { width: 1280, height: 800 };

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  // ─────────────────────────────────────────────────────────────
  // TEST 4 – Kein Doppel-Skip beim Scrollen?
  // Strategie: Wheel-Events an das echte scroll-target schicken
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST 4 (re-run): Doppel-Skip-Test ---');

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(500);

  // Finde heraus, welches Element scrollt
  const scrollInfo = await page.evaluate(() => {
    // Gängige Scroll-Container: html, body, main, #app
    const candidates = [document.documentElement, document.body, document.querySelector('main')].filter(Boolean);
    return candidates.map(el => ({
      tag: el.tagName,
      id: el.id || '',
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      overflow: window.getComputedStyle(el).overflow + '/' + window.getComputedStyle(el).overflowY
    }));
  });
  console.log('Scroll-Container-Kandidaten:', JSON.stringify(scrollInfo, null, 2));

  // Ermittle Sektionen
  const sectionOffsets = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section[id], div[id]'));
    return sections.map(s => ({
      id: s.id,
      offsetTop: s.getBoundingClientRect().top + window.scrollY
    }));
  });
  console.log('Sektionen (offsetTop absolut):', JSON.stringify(sectionOffsets));

  // Strategie A: page.mouse.wheel (Playwright sendet echtes OS-Wheel-Event)
  console.log('\n[Strategie A] 5x page.mouse.wheel(0, 100)...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(500);
  const y0A = await page.evaluate(() => window.scrollY);
  console.log('scrollY vor:', y0A);

  // Maus in Seitenmitte positionieren
  await page.mouse.move(640, 400);
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 100);
  }
  await page.waitForTimeout(2000);
  const yAfterA = await page.evaluate(() => window.scrollY);
  console.log('scrollY nach 5x wheel + 2s:', yAfterA);

  const about = sectionOffsets.find(s => s.id === 'about')?.offsetTop ?? 'n/a';
  console.log('About-offsetTop:', about);
  if (typeof yAfterA === 'number' && typeof about === 'number') {
    const diff = Math.abs(yAfterA - about);
    console.log('|scrollY - about.offsetTop|:', diff);
    if (diff <= 80) {
      console.log('ERGEBNIS A: Kein Doppel-Skip – scrollY nahe About-Section (~728-800)');
    } else {
      const nextSection = sectionOffsets.find(s => s.offsetTop > about);
      console.log('ERGEBNIS A: Nicht bei About. Nächste Sektion danach:', JSON.stringify(nextSection));
      if (nextSection && Math.abs(yAfterA - nextSection.offsetTop) <= 80) {
        console.log('=> Doppel-Skip! scrollY entspricht der übernächsten Sektion:', nextSection.id);
      } else {
        console.log('=> scrollY=', yAfterA, '– keine exakte Sektion-Übereinstimmung');
      }
    }
  }

  await browser.close();
  console.log('\n=== Test 4 abgeschlossen ===');
}

run().catch(err => {
  console.error('FEHLER:', err);
  process.exit(1);
});
