// 承認済みの6画像が18箇所と再生成元で一致し、共有画像が残ることを確認。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const items = [
  ['inheritance', 'inheritance-vacant-house.html'],
  ['consulting', 'sale-consulting.html'],
  ['brokerage', 'brokerage-purchase.html'],
  ['rights', 'rights-coordination.html'],
  ['fukuri', 'fukuri.html'],
  ['seminar', 'corporate-seminars.html'],
];
const generated = {};
const generator = read('scripts/build_business_pages.mjs')
  .replace(/^import .*;$/gm, '')
  .replace(/^const root = .*;$/m, 'const root = ".";');
vm.runInNewContext(generator, {
  resolve: path.resolve, process: { argv: [] }, console: { log() {} },
  writeFileSync(file, html) { generated[path.basename(file)] = html; },
});
let placements = 0;
for (const [key, detail] of items) {
  const stem = 'src/client-0912-' + key;
  for (const extension of ['jpg', 'webp']) {
    const size = fs.statSync(path.join(root, stem + '.' + extension)).size;
    assert.ok(size > 1024 && size < 1000000, 'Valid optimized asset: ' + stem);
  }
  const pages = ['index.html', 'business.html', detail];
  for (const file of [...pages, 'animation-dynamic.html']) {
    const html = read(file);
    const images = [...html.matchAll(/<img\b[^>]*>/g)].filter(m => m[0].includes('src="' + stem + '.jpg"'));
    assert.equal(images.length, 1, file + ': one supplied image for ' + key);
    assert.match(images[0][0], /width="1672" height="941"/);
    assert.match(images[0][0], /alt="[^"]+"/);
    assert.ok(html.includes('srcset="' + stem + '.webp"'), file + ': WebP paired');
    if (file !== 'animation-dynamic.html') placements++;
  }
  for (const file of ['business.html', detail]) {
    const blockPattern = /<div class="(?:page-hero__art|business-story__media) business-image--supplied[^"]*">.*?<\/div>/g;
    const findBlock = html => [...html.matchAll(blockPattern)].find(m => m[0].includes(stem))?.[0];
    assert.ok(findBlock(generated[file]), file + ': supplied image survives regeneration');
    assert.equal(findBlock(generated[file]), findBlock(read(file)), file + ': generated image markup matches');
  }
}
assert.equal(placements, 18);
const home = read('index.html');
for (const preserved of ['hero-kagoya-consultation', 'project-rental-management', 'nbc-junior-workshop-02', 'gen-inheritance', 'gen-consultation', 'gen-investment']) {
  assert.ok(home.includes('src/' + preserved + '.'), 'Unrelated home image preserved: ' + preserved);
}
assert.ok(read('assets/js/site.js').includes('gen-consultation'), 'Shared contact image remains');
for (const file of ['index.html', 'animation-dynamic.html', 'business.html', 'fukuri.html']) {
  assert.ok(read(file).includes('business-image--fukuri'), file + ': text-safe artwork layout');
}
console.log('PASS: 18 placements + home mirror; 12 assets; generator consistency; unrelated images preserved');
