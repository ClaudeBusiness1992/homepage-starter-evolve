import { chromium } from 'playwright';
import path from 'path';

const SCREENSHOTS_DIR = 'C:\\ClaudeBusiness\\homepage-starter-evolve\\tools\\screenshots';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  console.log('Navigating to http://localhost:4321/ ...');
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

  // --- 1. Scroll to #gallery and screenshot ---
  console.log('Scrolling to #gallery ...');
  await page.locator('#gallery').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.locator('#gallery').screenshot({
    path: path.join(SCREENSHOTS_DIR, 'gallery-now.png')
  });
  console.log('Screenshot gallery-now.png saved.');

  // --- 2. Click a lightbox image ---
  const lightboxTrigger = page.locator('[data-lightbox]').first();
  const count = await lightboxTrigger.count();
  console.log(`Found ${count} element(s) with data-lightbox.`);

  if (count > 0) {
    await lightboxTrigger.scrollIntoViewIfNeeded();
    await lightboxTrigger.click();
    console.log('Clicked lightbox trigger, waiting 1s...');
    await page.waitForTimeout(1000);

    // Full page screenshot of lightbox state
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'lightbox-caption-now.png'),
      fullPage: false
    });
    console.log('Screenshot lightbox-caption-now.png saved.');

    // --- Check .lb-caption ---
    const caption = page.locator('.lb-caption').first();
    const captionCount = await caption.count();
    console.log(`\n=== .lb-caption ===`);
    if (captionCount > 0) {
      const bgColor = await caption.evaluate(el => getComputedStyle(el).backgroundColor);
      const color = await caption.evaluate(el => getComputedStyle(el).color);
      const text = await caption.evaluate(el => el.textContent?.trim());
      console.log(`  background-color: ${bgColor}`);
      console.log(`  color: ${color}`);
      console.log(`  textContent: "${text}"`);
    } else {
      console.log('  .lb-caption not found in DOM.');
    }
  } else {
    console.log('No [data-lightbox] elements found!');
  }

  // --- 3. Check for purple/blue colours not matching orange scheme ---
  console.log('\n=== Colour check: .gallery-item-body, .gallery-item-cat ===');

  // Go back to full page (lightbox may be open — that's fine, we query the DOM)
  // Close lightbox first if open so we can inspect gallery items properly
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  const selectors = ['.gallery-item-body', '.gallery-item-cat'];
  for (const sel of selectors) {
    const els = page.locator(sel);
    const n = await els.count();
    if (n === 0) {
      console.log(`  ${sel}: NOT FOUND`);
      continue;
    }
    // Check first element
    const first = els.first();
    const bg = await first.evaluate(el => getComputedStyle(el).backgroundColor);
    const col = await first.evaluate(el => getComputedStyle(el).color);
    const borderColor = await first.evaluate(el => getComputedStyle(el).borderColor);
    console.log(`  ${sel} (${n} items):`);
    console.log(`    background-color: ${bg}`);
    console.log(`    color: ${col}`);
    console.log(`    borderColor: ${borderColor}`);
  }

  // Also check .gallery-item, .gallery-item-title
  const extra = ['.gallery-item', '.gallery-item-title', '.lb-outerContainer', '.lb-container'];
  for (const sel of extra) {
    const els = page.locator(sel);
    const n = await els.count();
    if (n === 0) continue;
    const first = els.first();
    const bg = await first.evaluate(el => getComputedStyle(el).backgroundColor);
    const col = await first.evaluate(el => getComputedStyle(el).color);
    console.log(`  ${sel} (${n}):`);
    console.log(`    background-color: ${bg}`);
    console.log(`    color: ${col}`);
  }

  await browser.close();
  console.log('\nDone.');
})();
