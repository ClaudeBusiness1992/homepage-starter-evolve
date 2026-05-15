import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dir, 'og-gen.html');
const outPath  = resolve(__dir, '..', 'public', 'og-image.jpg');

const browser = await chromium.launch();
const page    = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.goto('file://' + htmlPath);
await page.waitForTimeout(200);
await page.screenshot({ path: outPath, type: 'jpeg', quality: 92, fullPage: false });
await browser.close();

console.log('og-image.jpg gespeichert →', outPath);
