import { chromium } from 'playwright';

const SCREENSHOT_PATH = 'C:/ClaudeBusiness/homepage-starter-evolve/tools/screenshots/gallery-text-check.png';
const URL = 'http://localhost:4321/';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto(URL, { waitUntil: 'networkidle' });

  // Scroll to #gallery
  await page.evaluate(() => {
    const el = document.querySelector('#gallery');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });

  // Wait a moment for any lazy content
  await page.waitForTimeout(600);

  // Take screenshot
  await page.screenshot({ path: SCREENSHOT_PATH, fullPage: false });
  console.log('Screenshot saved:', SCREENSHOT_PATH);

  // --- DOM Inspections ---

  // 1. Do .gallery-item elements have display: flex?
  const displayFlex = await page.evaluate(() => {
    const items = document.querySelectorAll('.gallery-item');
    if (!items.length) return { count: 0, results: [] };
    const results = Array.from(items).slice(0, 5).map((el, i) => ({
      index: i,
      display: getComputedStyle(el).display
    }));
    return { count: items.length, results };
  });
  console.log('\n1. .gallery-item display:');
  console.log('   Count:', displayFlex.count);
  displayFlex.results.forEach(r => console.log(`   [${r.index}] display = "${r.display}"`));

  // 2. Do .gallery-item-body elements have visible height > 0?
  const bodyHeights = await page.evaluate(() => {
    const items = document.querySelectorAll('.gallery-item-body');
    if (!items.length) return { count: 0, results: [] };
    const results = Array.from(items).slice(0, 5).map((el, i) => {
      const rect = el.getBoundingClientRect();
      return { index: i, height: rect.height };
    });
    return { count: items.length, results };
  });
  console.log('\n2. .gallery-item-body heights:');
  console.log('   Count:', bodyHeights.count);
  bodyHeights.results.forEach(r => console.log(`   [${r.index}] height = ${r.height}px (visible: ${r.height > 0})`));

  // 3. Are .gallery-item-body elements in the viewport?
  const inViewport = await page.evaluate(() => {
    const items = document.querySelectorAll('.gallery-item-body');
    if (!items.length) return { count: 0, results: [] };
    const results = Array.from(items).slice(0, 5).map((el, i) => {
      const rect = el.getBoundingClientRect();
      return {
        index: i,
        top: rect.top,
        bottom: rect.bottom,
        inViewport: rect.top < window.innerHeight && rect.bottom > 0
      };
    });
    return { count: items.length, windowHeight: window.innerHeight, results };
  });
  console.log('\n3. .gallery-item-body in viewport? (windowHeight:', inViewport.windowHeight, ')');
  inViewport.results.forEach(r =>
    console.log(`   [${r.index}] top=${r.top.toFixed(1)}, bottom=${r.bottom.toFixed(1)}, inViewport=${r.inViewport}`)
  );

  // 4. Computed background-color of .gallery-item-body
  const bgColors = await page.evaluate(() => {
    const items = document.querySelectorAll('.gallery-item-body');
    if (!items.length) return [];
    return Array.from(items).slice(0, 5).map((el, i) => ({
      index: i,
      backgroundColor: getComputedStyle(el).backgroundColor
    }));
  });
  console.log('\n4. .gallery-item-body background-color:');
  bgColors.forEach(r => console.log(`   [${r.index}] background-color = "${r.backgroundColor}"`));

  // 5. Computed color of .gallery-item-cat
  const catColors = await page.evaluate(() => {
    const items = document.querySelectorAll('.gallery-item-cat');
    if (!items.length) return { count: 0, results: [] };
    return {
      count: items.length,
      results: Array.from(items).slice(0, 5).map((el, i) => ({
        index: i,
        color: getComputedStyle(el).color,
        text: el.textContent.trim().slice(0, 40)
      }))
    };
  });
  console.log('\n5. .gallery-item-cat color:');
  console.log('   Count:', catColors.count);
  catColors.results.forEach(r =>
    console.log(`   [${r.index}] color = "${r.color}", text = "${r.text}"`)
  );

  await browser.close();
  console.log('\nDone.');
})();
