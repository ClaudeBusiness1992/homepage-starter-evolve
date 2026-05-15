const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:4321');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  const sectionIds = ['about', 'services', 'gallery', 'reviews'];
  for (const id of sectionIds) {
    const el = await page.$('#' + id);
    if (!el) { console.log(id + ': not found'); continue; }

    // Scroll section to viewport
    await page.evaluate((sectionId) => {
      const el = document.getElementById(sectionId);
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72');
      window.scrollTo({ top: el.offsetTop - navH, behavior: 'instant' });
    }, id);
    await page.waitForTimeout(800);

    const gaps = await page.evaluate((sectionId) => {
      const section = document.getElementById(sectionId);
      if (!section) return null;
      const sRect = section.getBoundingClientRect();

      // Find the visible wrap and its children
      const wrap = section.querySelector('.wrap');
      if (!wrap) return { error: 'no wrap' };
      const wChildren = [...wrap.children];
      if (!wChildren.length) return { error: 'no wrap children' };

      const first = wChildren[0].getBoundingClientRect();
      const last = wChildren[wChildren.length - 1].getBoundingClientRect();

      return {
        sectionTop: Math.round(sRect.top),
        sectionBottom: Math.round(sRect.bottom),
        sectionH: Math.round(sRect.height),
        wrapFirstTop: Math.round(first.top),
        wrapLastBottom: Math.round(last.bottom),
        spaceAbove: Math.round(first.top - sRect.top),
        spaceBelow: Math.round(sRect.bottom - last.bottom),
        wrapH: Math.round(wrap.getBoundingClientRect().height),
      };
    }, id);
    console.log('#' + id + ':', JSON.stringify(gaps));

    // Screenshot
    await page.screenshot({ path: 'C:/tmp/section-' + id + '-new.png' });
  }

  await browser.close();
})().catch(e => console.error(e));
