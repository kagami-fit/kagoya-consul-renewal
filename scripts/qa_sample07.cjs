#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const base = process.argv[2] || 'http://127.0.0.1:8770/';
const pages = [
  'index.html', 'services.html', 'service.html', 'sale-consulting.html',
  'inheritance-vacant-house.html', 'purchase-asset.html', 'property-management.html',
  'corporate-benefits.html', 'for-sale.html', 'properties.html', 'cases.html',
  'team.html', 'about.html', 'insights.html', 'news.html', 'faq.html',
  'contact.html', 'privacy.html', 'blog/inherited-property-first-steps.html',
  'blog/rebuild-impossible-property.html', 'blog/check-before-price-cut.html'
];
const widths = [375, 768, 1280];
const shots = new Set(['index.html', 'for-sale.html', 'cases.html', 'contact.html']);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const filename of pages) {
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const consoleErrors = [];
      const badResponses = [];
      page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      page.on('pageerror', error => consoleErrors.push(String(error)));
      page.on('response', response => { if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`); });
      await page.goto(base + filename, { waitUntil: 'load', timeout: 30000 });
      await page.evaluate(async () => {
        document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
        await Promise.all([...document.images].map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        })));
        await Promise.all([...document.images].map(img => img.decode?.().catch(() => {}) || Promise.resolve()));
      });
      await page.evaluate(async () => {
        const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        for (let y = 0; y <= document.body.scrollHeight; y += 450) {
          window.scrollTo(0, y);
          await sleep(22);
        }
        window.scrollTo(0, document.body.scrollHeight);
        await sleep(700);
        window.scrollTo(0, 0);
        await sleep(900);
      });
      const metrics = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
        const visibleText = document.body.innerText;
        const dental = visibleText.match(/歯科|治療|診療|患者|来院|Web予約|クリニック|お口|ホワイトニング/g) || [];
        const h1 = document.querySelector('h1');
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          duplicateIds: [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))],
          h1Count: document.querySelectorAll('h1').length,
          missingImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.currentSrc || img.src),
          hiddenReveals: document.querySelectorAll('.reveal:not(.is-in)').length,
          dentalTerms: [...new Set(dental)],
          bodyFont: getComputedStyle(document.body).fontFamily,
          h1Font: h1 ? getComputedStyle(h1).fontFamily : ''
        };
      });
      let menu = null;
      if (width === 375 && await page.locator('[data-menu-toggle]').count()) {
        await page.locator('[data-menu-toggle]').click();
        menu = await page.evaluate(() => document.body.classList.contains('menu-open') && document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded') === 'true');
        await page.keyboard.press('Escape');
        menu = Boolean(menu && !(await page.evaluate(() => document.body.classList.contains('menu-open'))));
      }
      if (shots.has(filename)) {
        const stem = path.basename(filename, '.html');
        await page.screenshot({ path: path.join(root, '_review', `${stem}_sample07_${width}.png`), fullPage: true });
      }
      results.push({ page: filename, width, ...metrics, menu, consoleErrors, badResponses });
      await context.close();
    }
  }
  await browser.close();
  const report = { base, results };
  const reportPath = path.join(root, '_review', 'qa-sample07-production.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  const failures = results.filter(row => row.overflow > 1 || row.duplicateIds.length || row.h1Count !== 1 || row.missingImages.length || row.hiddenReveals || row.dentalTerms.length || row.consoleErrors.length || row.badResponses.length || row.menu === false);
  console.log(`QA: ${results.length} checks / ${failures.length} failures`);
  failures.slice(0, 30).forEach(row => console.log(JSON.stringify(row)));
  process.exitCode = failures.length ? 1 : 0;
})();
