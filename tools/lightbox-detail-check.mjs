/**
 * Lightbox Detail-Check
 * 1. Screenshot nach Öffnen → tools/screenshots/lightbox-open.png
 * 2. .lb-caption Höhe & textContent
 * 3. .lb-close vs .lb-img Überlappung (getBoundingClientRect)
 * 4. .lb-prev / .lb-next Sichtbarkeit bei mehreren Bildern
 */

import { chromium } from '../node_modules/playwright/index.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOTS_DIR = path.join(__dirname, 'screenshots');
const BASE_URL  = 'http://localhost:4321/';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page    = await context.newPage();

  // ── Seite laden ──────────────────────────────────────────────────────────
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(600);

  // ── Zur Galerie scrollen ─────────────────────────────────────────────────
  const gallery = page.locator('#gallery');
  if (await gallery.count() === 0) {
    console.error('FEHLER: #gallery nicht gefunden');
    await browser.close();
    process.exit(1);
  }
  await gallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // ── Erstes Bild mit data-lightbox klicken ─────────────────────────────
  const firstImg = page.locator('[data-lightbox]').first();
  const imgCount = await page.locator('[data-lightbox]').count();
  console.log(`Gefundene [data-lightbox] Elemente: ${imgCount}`);

  if (imgCount === 0) {
    console.error('FEHLER: kein Element mit data-lightbox gefunden');
    await browser.close();
    process.exit(1);
  }

  await firstImg.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await firstImg.click({ force: true });

  // ── Warten bis .is-open gesetzt ──────────────────────────────────────────
  try {
    await page.waitForSelector('#lightbox.is-open', { timeout: 5000 });
    console.log('✓ Lightbox geöffnet (is-open Klasse gesetzt)');
  } catch {
    console.error('✗ Lightbox hat nicht geöffnet (is-open fehlt nach 5s)');
    await page.screenshot({ path: path.join(SHOTS_DIR, 'lightbox-open.png') });
    await browser.close();
    process.exit(1);
  }

  await page.waitForTimeout(300);

  // ── Screenshot ───────────────────────────────────────────────────────────
  const screenshotPath = path.join(SHOTS_DIR, 'lightbox-open.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`Screenshot gespeichert: ${screenshotPath}`);

  // ═══════════════════════════════════════════════════════════════════════
  // CHECK 1 + 2: .lb-caption Höhe & textContent
  // ═══════════════════════════════════════════════════════════════════════
  const captionData = await page.evaluate(() => {
    const el = document.querySelector('.lb-caption');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      offsetHeight:  el.offsetHeight,
      clientHeight:  el.clientHeight,
      rectHeight:    rect.height,
      display:       style.display,
      visibility:    style.visibility,
      overflow:      style.overflow,
      textContent:   el.textContent.trim(),
      innerHTML:     el.innerHTML.trim(),
    };
  });

  console.log('\n── CHECK 1+2: .lb-caption ──────────────────────────────');
  if (!captionData) {
    console.log('✗ .lb-caption Element NICHT im DOM gefunden');
  } else {
    const sichtbareHoehe = captionData.rectHeight > 0 || captionData.clientHeight > 0;
    console.log(`  offsetHeight : ${captionData.offsetHeight}px`);
    console.log(`  clientHeight : ${captionData.clientHeight}px`);
    console.log(`  rect.height  : ${captionData.rectHeight}px`);
    console.log(`  display      : ${captionData.display}`);
    console.log(`  visibility   : ${captionData.visibility}`);
    console.log(`  textContent  : "${captionData.textContent}"`);
    console.log(`  innerHTML    : "${captionData.innerHTML}"`);
    console.log(sichtbareHoehe
      ? `✓ .lb-caption hat sichtbare Höhe > 0`
      : `✗ .lb-caption Höhe = 0 (nicht sichtbar)`);
    if (captionData.textContent === '') {
      console.log('⚠ .lb-caption textContent ist LEER');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CHECK 3: .lb-close vs .lb-img Überlappung
  // ═══════════════════════════════════════════════════════════════════════
  const overlapData = await page.evaluate(() => {
    const close = document.querySelector('.lb-close');
    const img   = document.querySelector('.lb-img');
    if (!close || !img) return { error: 'Elemente nicht gefunden', close: !!close, img: !!img };

    const cr = close.getBoundingClientRect();
    const ir = img.getBoundingClientRect();

    // Überlappung = Rechtecke schneiden sich
    const overlaps = !(
      cr.right  <= ir.left  ||
      cr.left   >= ir.right ||
      cr.bottom <= ir.top   ||
      cr.top    >= ir.bottom
    );

    return {
      close: { top: cr.top, right: cr.right, bottom: cr.bottom, left: cr.left, width: cr.width, height: cr.height },
      img:   { top: ir.top, right: ir.right, bottom: ir.bottom, left: ir.left, width: ir.width, height: ir.height },
      overlaps,
    };
  });

  console.log('\n── CHECK 3: .lb-close vs .lb-img Position ───────────────');
  if (overlapData.error) {
    console.log(`✗ Fehler: ${overlapData.error} (close=${overlapData.close}, img=${overlapData.img})`);
  } else {
    console.log('  .lb-close rect:', JSON.stringify(overlapData.close));
    console.log('  .lb-img   rect:', JSON.stringify(overlapData.img));
    if (overlapData.overlaps) {
      console.log('✗ .lb-close ÜBERLАПPT .lb-img — Button liegt über dem Bild');
    } else {
      console.log('✓ .lb-close liegt AUSSERHALB von .lb-img (keine Überlappung)');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CHECK 4: .lb-prev / .lb-next bei mehreren Bildern
  // ═══════════════════════════════════════════════════════════════════════
  console.log('\n── CHECK 4: .lb-prev / .lb-next Navigation ──────────────');
  console.log(`  Gesamt [data-lightbox] Elemente auf der Seite: ${imgCount}`);

  const navData = await page.evaluate(() => {
    const prev = document.querySelector('.lb-prev');
    const next = document.querySelector('.lb-next');

    function isVisible(el) {
      if (!el) return false;
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== 'none'
          && s.visibility !== 'hidden'
          && parseFloat(s.opacity) > 0
          && r.width > 0
          && r.height > 0;
    }

    return {
      prevInDom:  !!prev,
      nextInDom:  !!next,
      prevVisible: isVisible(prev),
      nextVisible: isVisible(next),
      prevDisplay: prev ? getComputedStyle(prev).display : 'n/a',
      nextDisplay: next ? getComputedStyle(next).display : 'n/a',
      prevOpacity: prev ? getComputedStyle(prev).opacity : 'n/a',
      nextOpacity: next ? getComputedStyle(next).opacity : 'n/a',
    };
  });

  console.log(`  .lb-prev im DOM  : ${navData.prevInDom}  | display: ${navData.prevDisplay} | opacity: ${navData.prevOpacity} | sichtbar: ${navData.prevVisible}`);
  console.log(`  .lb-next im DOM  : ${navData.nextInDom}  | display: ${navData.nextDisplay} | opacity: ${navData.nextOpacity} | sichtbar: ${navData.nextVisible}`);

  if (imgCount > 1) {
    if (navData.prevVisible && navData.nextVisible) {
      console.log('✓ .lb-prev und .lb-next sind bei mehreren Bildern sichtbar');
    } else {
      console.log(`✗ Navigation nicht sichtbar obwohl ${imgCount} Bilder vorhanden:`);
      if (!navData.prevVisible) console.log('  — .lb-prev NICHT sichtbar');
      if (!navData.nextVisible) console.log('  — .lb-next NICHT sichtbar');
    }
  } else {
    console.log(`ℹ Nur ${imgCount} Bild mit data-lightbox — Navigation evtl. korrekt ausgeblendet`);
    if (navData.prevVisible || navData.nextVisible) {
      console.log('⚠ Nav-Buttons bei nur 1 Bild sichtbar — könnte überflüssig sein');
    }
  }

  await browser.close();
  console.log('\nFertig.\n');
})();
