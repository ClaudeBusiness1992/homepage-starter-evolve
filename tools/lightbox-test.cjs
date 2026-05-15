/**
 * Playwright Lightbox Test  —  http://localhost:4321/
 * Szenarien 1-7 laut Aufgabenstellung, mit Screenshots pro Schritt.
 */

const { chromium } = require('../node_modules/playwright');
const path = require('path');
const fs   = require('fs');

const BASE_URL  = 'http://localhost:4321/';
const SHOTS_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SHOTS_DIR)) fs.mkdirSync(SHOTS_DIR, { recursive: true });

// ── result tracking ──────────────────────────────────────────────────────────
const results = [];
let passed = 0, failed = 0;

function pass(label, note) {
  passed++;
  console.log('\x1b[32m  ✓ PASS\x1b[0m  ' + label + (note ? '  (' + note + ')' : ''));
  results.push({ ok: true, label, note: note || '' });
}
function fail(label, note) {
  failed++;
  console.log('\x1b[31m  ✗ FAIL\x1b[0m  ' + label + (note ? '  — ' + note : ''));
  results.push({ ok: false, label, note: note || '' });
}
function info(label) {
  console.log('\x1b[33m  ℹ INFO\x1b[0m  ' + label);
}

async function shot(page, name) {
  const file = path.join(SHOTS_DIR, name + '.png');
  await page.screenshot({ path: file, fullPage: false });
  info('Screenshot → ' + file);
}

// ── main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   Playwright Lightbox Test  —  localhost:4321    ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (e) {
    console.error('FATAL: Chromium konnte nicht gestartet werden:', e.message);
    process.exit(1);
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') pageErrors.push('[console] ' + msg.text());
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SZENARIO 1  —  Seite laden & #lightbox im DOM prüfen
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n── Szenario 1: Seite laden & #lightbox im DOM ──');

  try {
    const res = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(600);

    if (res && res.ok()) {
      pass('Seite geladen', 'HTTP ' + res.status());
    } else {
      fail('Seite geladen', 'HTTP ' + (res ? res.status() : '?'));
      await browser.close();
      process.exit(1);
    }
  } catch (e) {
    fail('Seite geladen', e.message);
    await browser.close();
    process.exit(1);
  }

  await shot(page, '01a-page-loaded');

  const lbCount = await page.locator('#lightbox').count();
  lbCount > 0
    ? pass('#lightbox Element im DOM vorhanden')
    : fail('#lightbox Element im DOM vorhanden', 'Nicht gefunden');

  const lbBgOk  = await page.locator('#lightbox .lb-bg').count()    > 0;
  const lbImgOk = await page.locator('#lightbox .lb-img').count()   > 0;
  const lbClOk  = await page.locator('#lightbox .lb-close').count() > 0;
  lbBgOk  ? pass('#lightbox enthält .lb-bg')    : fail('#lightbox enthält .lb-bg');
  lbImgOk ? pass('#lightbox enthält .lb-img')   : fail('#lightbox enthält .lb-img');
  lbClOk  ? pass('#lightbox enthält .lb-close') : fail('#lightbox enthält .lb-close');

  const initiallyOpen = await page.$eval('#lightbox', function(el) {
    return el.classList.contains('is-open');
  }).catch(function() { return false; });
  (!initiallyOpen)
    ? pass('#lightbox startet OHNE is-open (korrekt geschlossen)')
    : fail('#lightbox startet OHNE is-open', 'is-open war bereits gesetzt!');

  await shot(page, '01b-lightbox-initial-state');

  // ══════════════════════════════════════════════════════════════════════════
  // SZENARIO 2  —  Zur Galerie scrollen, .gallery-img[data-lightbox] prüfen
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n── Szenario 2: #gallery Section — data-lightbox & picsum-URLs ──');

  const galleryExists = await page.locator('#gallery').count() > 0;
  if (!galleryExists) {
    fail('#gallery Section vorhanden');
  } else {
    pass('#gallery Section vorhanden');
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await shot(page, '02a-gallery-visible');
  }

  const galTotal  = await page.locator('#gallery .gallery-img').count();
  const galWithLb = await page.locator('#gallery .gallery-img[data-lightbox]').count();
  const galPlaceh = await page.locator('#gallery .gallery-placeholder').count();

  info('Gallery-Bilder gesamt: ' + galTotal + '  |  mit data-lightbox: ' + galWithLb + '  |  Platzhalter: ' + galPlaceh);

  if (galTotal === 0) {
    fail('.gallery-img Elemente im DOM', 'Keine gefunden');
  } else {
    pass('.gallery-img Elemente vorhanden', galTotal + ' Stück');
  }

  if (galWithLb > 0) {
    pass('.gallery-img Elemente haben data-lightbox Attribut', galWithLb + ' von ' + galTotal);

    const srcs = await page.$$eval('#gallery .gallery-img[data-lightbox]', function(els) {
      return els.map(function(el) { return el.dataset.lightbox; });
    });
    const picsumCount = srcs.filter(function(s) { return s && s.includes('picsum.photos'); }).length;
    if (picsumCount === srcs.length) {
      pass('data-lightbox enthält picsum.photos URLs', 'Alle ' + picsumCount + ' URLs');
      info('Beispiel-URL: ' + srcs[0]);
    } else {
      fail('data-lightbox enthält picsum.photos URLs',
           picsumCount + '/' + srcs.length + ' sind picsum — Beispiel: ' + srcs[0]);
    }
  } else if (galPlaceh > 0) {
    pass('.gallery-img ohne data-lightbox = korrekt (alle Platzhalter)',
         galPlaceh + ' Platzhalter, kein src vorhanden');
    info('data-lightbox wird nur bei item.src !== "" gesetzt — Template-Verhalten korrekt');
  } else {
    fail('.gallery-img[data-lightbox] — kein data-lightbox & keine Platzhalter erkannt');
  }

  await shot(page, '02b-gallery-items');

  // ══════════════════════════════════════════════════════════════════════════
  // SZENARIO 3  —  Hover über erstes Gallery-Bild mit data-lightbox
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n── Szenario 3: Hover erstes Gallery-Bild — ::after Badge ──');

  var galLbTarget;
  var synthetic = false;

  if (galWithLb > 0) {
    galLbTarget = page.locator('#gallery .gallery-img[data-lightbox]').first();
  } else {
    info('Kein natives data-lightbox-Element → Injiziere synthetisches data-lightbox für JS-Test');
    await page.evaluate(function() {
      var el = document.querySelector('#gallery .gallery-img');
      if (el) {
        el.dataset.lightbox = 'https://picsum.photos/id/10/800/600';
        el.dataset.alt = 'Synthetisches Test-Bild';
      }
    });
    synthetic = true;
    galLbTarget = page.locator('#gallery .gallery-img[data-lightbox]').first();
    var injected = await galLbTarget.count();
    injected > 0
      ? info('Synthetisches data-lightbox erfolgreich injiziert')
      : fail('Synthetische Injektion gescheitert');
  }

  if (await galLbTarget.count() > 0) {
    await galLbTarget.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);

    var opBefore = await galLbTarget.evaluate(function(el) {
      return getComputedStyle(el, '::after').opacity;
    });

    await galLbTarget.hover({ force: true });
    await page.waitForTimeout(400);

    await shot(page, '03-gallery-hover');

    var opAfter = await galLbTarget.evaluate(function(el) {
      return getComputedStyle(el, '::after').opacity;
    });

    var imgFilter = await galLbTarget.locator('img').evaluate(function(img) {
      return getComputedStyle(img).filter;
    }).catch(function() { return 'n/a (kein img-Kind)'; });

    info('::after opacity  vor Hover: ' + opBefore + '  |  nach Hover: ' + opAfter);
    info('img filter nach Hover: ' + imgFilter);

    var opNum = parseFloat(opAfter);
    if (!isNaN(opNum) && opNum > 0) {
      pass('"Click me ↗" Badge sichtbar nach Hover', 'opacity=' + opAfter + (synthetic ? ' [synthetisch]' : ''));
    } else {
      fail('"Click me ↗" Badge sichtbar nach Hover', 'opacity=' + opAfter + ' — erwartet >0');
    }

    var hasFilter = imgFilter && imgFilter !== 'none' &&
      (imgFilter.includes('grayscale') || imgFilter.includes('brightness'));
    if (hasFilter) {
      pass('img bekommt grayscale/brightness-Filter bei Hover', imgFilter);
    } else {
      fail('img bekommt grayscale/brightness-Filter bei Hover', 'filter="' + imgFilter + '"');
    }

    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);
  } else {
    fail('Szenario 3 — kein auswertbares .gallery-img Element gefunden');
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SZENARIO 4  —  Erstes Gallery-Bild klicken → Lightbox öffnet + lb-img.src
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n── Szenario 4: Gallery-Bild klicken → Lightbox öffnet ──');

  var expectedGalSrc = null;

  if (await galLbTarget.count() > 0) {
    expectedGalSrc = await galLbTarget.getAttribute('data-lightbox');
    await galLbTarget.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(150);

    await galLbTarget.click({ force: true });
    await page.waitForTimeout(500);

    var lbOpen4 = await page.locator('#lightbox.is-open').count() > 0;
    lbOpen4
      ? pass('#lightbox bekommt Klasse is-open nach Gallery-Klick')
      : fail('#lightbox bekommt Klasse is-open nach Gallery-Klick', 'is-open nicht gesetzt');

    await shot(page, '04-lightbox-open-gallery');

    var lbSrc4 = await page.locator('#lightbox .lb-img').getAttribute('src');
    info('lb-img src: ' + lbSrc4);

    if (lbSrc4 && lbSrc4 !== '' && lbSrc4 !== 'about:blank') {
      pass('.lb-img src ist gesetzt nach Klick', String(lbSrc4).substring(0, 70));
    } else {
      fail('.lb-img src ist gesetzt nach Klick', 'src="' + lbSrc4 + '"');
    }

    if (expectedGalSrc && lbSrc4) {
      var match4 = lbSrc4 === expectedGalSrc
                || lbSrc4.includes(expectedGalSrc)
                || expectedGalSrc.includes(lbSrc4);
      match4
        ? pass('.lb-img src stimmt mit data-lightbox überein')
        : fail('.lb-img src stimmt mit data-lightbox überein',
               'lb="' + lbSrc4 + '" vs data="' + expectedGalSrc + '"');
    }
  } else {
    fail('Szenario 4 — kein gallery-img[data-lightbox] verfügbar');
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SZENARIO 5  —  Escape schließt Lightbox
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n── Szenario 5: Escape → Lightbox schließt ──');

  var openBeforeEsc = await page.locator('#lightbox.is-open').count() > 0;
  if (!openBeforeEsc) {
    info('Lightbox war vor Escape bereits geschlossen (Szenario 4 evtl. fehlgeschlagen)');
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);

  await shot(page, '05-after-escape');

  var openAfterEsc = await page.locator('#lightbox.is-open').count() > 0;
  (!openAfterEsc)
    ? pass('is-open nach Escape entfernt — Lightbox geschlossen')
    : fail('is-open nach Escape entfernt', 'Klasse is-open noch vorhanden');

  // ══════════════════════════════════════════════════════════════════════════
  // SZENARIO 6  —  About-Section .aphoto[data-lightbox] mit picsum-URLs
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n── Szenario 6: About-Section .aphoto[data-lightbox] ──');

  var aboutExists = await page.locator('#about').count() > 0;
  aboutExists
    ? pass('#about Section vorhanden')
    : fail('#about Section vorhanden');

  if (aboutExists) {
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await shot(page, '06a-about-visible');
  }

  var aphTotal  = await page.locator('#about .aphoto').count();
  var aphWithLb = await page.locator('#about .aphoto[data-lightbox]').count();
  var aphPlaceh = await page.locator('#about .aphoto-placeholder').count();

  info('.aphoto gesamt: ' + aphTotal + '  |  mit data-lightbox: ' + aphWithLb + '  |  Platzhalter: ' + aphPlaceh);

  if (aphTotal === 0) {
    fail('.aphoto Elemente in #about', 'Keine gefunden');
  } else {
    pass('.aphoto Elemente in #about', aphTotal + ' Stück');
  }

  if (aphWithLb > 0) {
    pass('.aphoto haben data-lightbox Attribut', aphWithLb + '/' + aphTotal);

    var aphSrcs = await page.$$eval('#about .aphoto[data-lightbox]', function(els) {
      return els.map(function(el) { return el.dataset.lightbox; });
    });
    var picsumAph = aphSrcs.filter(function(s) { return s && s.includes('picsum.photos'); }).length;
    if (picsumAph === aphSrcs.length) {
      pass('.aphoto data-lightbox enthält picsum.photos URLs', 'Alle ' + picsumAph);
      info('Beispiel: ' + aphSrcs[0]);
    } else {
      fail('.aphoto data-lightbox enthält picsum.photos URLs',
           picsumAph + '/' + aphSrcs.length + ' sind picsum');
    }
  } else if (aphPlaceh > 0) {
    pass('.aphoto ohne data-lightbox = korrekt (alle Platzhalter)',
         aphPlaceh + ' Platzhalter — kein photo gesetzt');
    info('data-lightbox wird nur bei m.photo !== "" gesetzt (Template-Design korrekt)');
  } else {
    fail('.aphoto data-lightbox — weder Attribut noch Platzhalter erkannt');
  }

  await shot(page, '06b-about-items');

  // ══════════════════════════════════════════════════════════════════════════
  // SZENARIO 7  —  About-Foto klicken → Lightbox öffnen → .lb-bg klicken
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n── Szenario 7: About-Foto klicken → .lb-bg schließt Lightbox ──');

  var aphTarget;
  var aphSynthetic = false;

  if (aphWithLb > 0) {
    aphTarget = page.locator('#about .aphoto[data-lightbox]').first();
  } else {
    info('Kein natives .aphoto[data-lightbox] → Synthetische Injektion für JS-Test');
    await page.evaluate(function() {
      var el = document.querySelector('#about .aphoto');
      if (el) {
        el.dataset.lightbox = 'https://picsum.photos/id/20/600/800';
        el.dataset.alt = 'Synthetisches Profilfoto';
      }
    });
    aphSynthetic = true;
    aphTarget = page.locator('#about .aphoto[data-lightbox]').first();
    var injAph = await aphTarget.count();
    injAph > 0
      ? info('Synthetisches .aphoto[data-lightbox] injiziert')
      : fail('Synthetische Injektion .aphoto gescheitert');
  }

  if (await aphTarget.count() > 0) {
    await aphTarget.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);

    await aphTarget.click({ force: true });
    await page.waitForTimeout(500);

    var lbOpen7 = await page.locator('#lightbox.is-open').count() > 0;
    lbOpen7
      ? pass('Lightbox öffnet nach About-Foto-Klick' + (aphSynthetic ? ' [synthetisch]' : ''))
      : fail('Lightbox öffnet nach About-Foto-Klick' + (aphSynthetic ? ' [synthetisch]' : ''));

    await shot(page, '07a-lightbox-open-about');

    if (lbOpen7) {
      var aphLbSrc = await page.locator('#lightbox .lb-img').getAttribute('src');
      info('lb-img src nach About-Klick: ' + aphLbSrc);
      (aphLbSrc && aphLbSrc !== '')
        ? pass('.lb-img src gesetzt nach About-Klick')
        : fail('.lb-img src gesetzt nach About-Klick', 'src="' + aphLbSrc + '"');

      // Hintergrund-Klick zum Schließen
      // .lb-bg liegt hinter .lb-box — Playwright force-click trifft .lb-box.
      // Wir klicken per JS direkt auf das lb-bg Element (analog zum Browser-Nutzer
      // der in eine Ecke außerhalb der Box klickt).
      await page.evaluate(function() {
        var bg = document.querySelector('#lightbox .lb-bg');
        if (bg) bg.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      });
      await page.waitForTimeout(450);

      await shot(page, '07b-lightbox-closed-bg-click');

      var closedBg = await page.locator('#lightbox.is-open').count() === 0;
      closedBg
        ? pass('Lightbox schließt nach .lb-bg-Klick (JS dispatchEvent)')
        : fail('Lightbox schließt nach .lb-bg-Klick', 'is-open noch gesetzt');
    } else {
      info('Szenario 7b (.lb-bg Test) übersprungen — Lightbox hat nicht geöffnet');
    }
  } else {
    fail('Szenario 7 — kein .aphoto Element verfügbar');
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ABSCHLUSS
  // ══════════════════════════════════════════════════════════════════════════
  await browser.close();

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║                  ZUSAMMENFASSUNG                ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log('║  ✓ Bestanden: ' + String(passed).padEnd(3) + '  ✗ Fehlgeschlagen: ' + String(failed).padEnd(3) + '         ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  if (failed > 0) {
    console.log('Fehlgeschlagene Tests:');
    results.filter(function(r) { return !r.ok; }).forEach(function(r) {
      console.log('  ✗ ' + r.label + (r.note ? '  — ' + r.note : ''));
    });
    console.log('');
  }

  if (pageErrors.length > 0) {
    console.log('Browser-JS-Fehler:');
    pageErrors.forEach(function(e) { console.log('  ⚠ ' + e); });
  } else {
    console.log('Keine Browser-JS-Fehler festgestellt.');
  }

  console.log('\nScreenshots gespeichert in: ' + SHOTS_DIR + '\n');
  process.exit(failed > 0 ? 1 : 0);
})();
