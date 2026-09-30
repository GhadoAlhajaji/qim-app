import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const out = 'scripts/shots';
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'ar-SA' });
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));

async function shot(name) {
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: false });
}

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.removeItem('qiyam-heroes-progress-v1'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await shot('01-home');

const subtitle = await page.getByText('مغامرة صغيرة... وقيم عظيمة!').count();
if (!subtitle) errors.push('subtitle missing');

await page.getByRole('button', { name: 'ابدئي المغامرة' }).click();
await page.waitForTimeout(400);
await shot('02-map');

await page.getByRole('button', { name: /الانتماء للوطن/ }).click();
await page.waitForTimeout(300);
await shot('03-situation');

const leaked = await page.getByText('امتثال للقيم الوطنية').count();
if (leaked) errors.push('definition shown before the correct answer');

await page.getByRole('button', { name: /أتجاهلهن/ }).click();
await shot('04-hint');
const hint = await page.getByText('لنفكّر معاً').count();
if (!hint) errors.push('hint missing');

await page.getByRole('button', { name: /أشجعهن على التوقف/ }).click();
await page.waitForTimeout(300);
await shot('05-lesson');
const definition = await page.getByText('امتثال للقيم الوطنية').count();
if (!definition) errors.push('definition missing after correct answer');
const tipsTitle = await page.getByRole('heading', { name: 'كيف أنمّي هذه القيمة؟' }).count();
if (!tipsTitle) errors.push('tips heading missing');

await page.getByRole('button', { name: 'الانتقال إلى المرحلة التالية' }).click();
await page.waitForTimeout(400);
await shot('06-unlock');

const saved = await page.evaluate(() => localStorage.getItem('qiyam-heroes-progress-v1'));
if (!saved?.includes('"completed":[1]')) errors.push(`progress missing: ${saved}`);

const level2 = await page.getByRole('button', { name: /المثابرة/ }).getAttribute('aria-label');
if (!level2?.includes('مفتوح')) errors.push(`level 2 not open: ${level2}`);
const level3 = await page.getByRole('button', { name: /المرونة/ }).getAttribute('aria-label');
if (!level3?.includes('مغلق')) errors.push(`level 3 should be locked: ${level3}`);

await page.evaluate(() => {
  localStorage.setItem(
    'qiyam-heroes-progress-v1',
    JSON.stringify({ completed: [1, 2, 3, 4, 5, 6, 7, 8, 9], heroName: 'ليان' }),
  );
});
await page.reload({ waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'شاهدي الاحتفال' }).click();
await page.waitForTimeout(300);
await shot('07-finale');
const cheer = await page.getByText('تهانينا! لقد أصبحتِ بطلة القيم!').count();
if (!cheer) errors.push('finale message missing');

await page.setViewportSize({ width: 390, height: 844 });
await page.getByRole('button', { name: 'أبطال القيم' }).click();
await page.waitForTimeout(300);
await shot('08-mobile-home');

await browser.close();
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('verify ok');
