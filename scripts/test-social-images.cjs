// 社会貢献ページの重複写真と、共通フッターの名称が戻らないことを確認する。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const page = fs.readFileSync(path.join(root, 'social-contribution.html'), 'utf8');
const main = page.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
const images = [...main.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
assert.equal(images.length, 5, 'Five content photos');
assert.equal(new Set(images).size, images.length, 'No repeated content image paths');
const hashes = images.map(src => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, src))).digest('hex'));
assert.equal(new Set(hashes).size, images.length, 'No same photo saved under another name');

const activity = main.match(/<section class="nbc-activity\b[\s\S]*?<\/section>/)[0];
assert.doesNotMatch(activity, /src\/gen-nbc-/);
for (const original of ['01', '02']) {
  const name = `src/nbc-junior-workshop-${original}.jpg`;
  assert.equal(images.filter(src => src === name).length, 1, 'Client photo used once');
  assert.ok(activity.includes(name), 'Client photo remains in the real activity report');
}
assert.equal((main.match(/class="nbc-image-note"/g) || []).length, 3, 'Three generated content images are labeled');
assert.match(main, /loading="eager" fetchpriority="high"/);
const expected = ['gen-nbc-learning-hero', 'gen-nbc-learning-approach', 'gen-nbc-mentor-partnership', 'gen-nbc-education-contact'];
for (const name of expected) {
  for (const format of ['jpg', 'webp']) {
    const file = path.join(root, 'src', `${name}.${format}`);
    assert.ok(fs.statSync(file).size > 1024, 'Nonempty image: ' + file);
  }
  assert.ok(fs.statSync(path.join(root, 'src', name + '.webp')).size < 200000, 'Optimized web image');
}

const files = execFileSync('git', ['ls-files', '*.html'], { cwd: root, encoding: 'utf8' }).trim().split('\n');
let footers = 0;
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const footer = html.match(/<footer\b[^>]*class="site-footer"[^>]*>[\s\S]*?<\/footer>/)?.[0];
  if (!footer || !footer.includes('エフクリ')) continue;
  const anchors = [...footer.matchAll(/<a\b[^>]*>([^<]*エフクリ[^<]*)<\/a>/g)];
  assert.equal(anchors.length, 1, file + ' single footer link');
  assert.equal(anchors[0][1], '資産形成ラウンジ「エフクリ」', file + ' full service name');
  footers++;
}
assert.ok(footers >= 33, 'All main site footers covered');
for (const generator of ['scripts/update_common_chrome.py', 'scripts/build_business_pages.mjs']) {
  assert.ok(fs.readFileSync(path.join(root, generator), 'utf8').includes('data-cms-id="common_common-footer_A_009">資産形成ラウンジ「エフクリ」</a>'), generator);
}
console.log(`PASS: 5 unique content photos; 2 original activity photos; 4 optimized generated assets; ${footers} full-name footers`);
