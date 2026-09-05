// 一覧先頭の構成と、既存のサービス・お知らせ導線を確認する。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

for (const [file, firstClass, marker] of [
  ['services.html', 'services-index', 'class="numbered-list"'],
  ['news.html', 'news-listing-first', 'id="noticeList"']
]) {
  const html = read(file);
  const main = html.match(/<main id="main">([\s\S]*?)<\/main>/)[1];
  const first = main.match(/^\s*<section\b([^>]*)>([\s\S]*?)<\/section>/);
  assert.ok(first, `${file}: 一覧がmain直下の最初のセクション`);
  assert.ok(first[1].includes(firstClass), `${file}: 先頭セクションの識別`);
  assert.ok(first[2].includes(marker), `${file}: 一覧を先頭に表示`);
  assert.doesNotMatch(main, /class="page-hero\b/, `${file}: 旧ヒーローの削除`);
  assert.equal((main.match(/<h1\b/g) || []).length, 1, `${file}: 主見出しは1つ`);
  assert.ok(main.indexOf('data-subpage-visual') > main.indexOf(marker), `${file}: 写真紹介は一覧の後`);
  assert.match(html, /assets\/css\/listing-pages\.css\?v=/);
  for (const [, attrs, source] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!attrs.includes('application/ld+json') && source.trim()) new Function(source);
  }
}

const services = read('services.html');
const links = [...services.matchAll(/<a class="numbered-row" href="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(links, [
  'sale-consulting.html', 'inheritance-vacant-house.html', 'purchase-asset.html',
  'property-management.html', 'corporate-benefits.html', 'team.html'
]);
for (const link of links) assert.ok(fs.existsSync(path.join(root, link)), link);

const news = read('news.html');
assert.equal((news.match(/id="noticeList"/g) || []).length, 1);
assert.deepEqual([...news.matchAll(/<button\b[^>]*\bdata-filter="([^"]+)"/g)].map(match => match[1]),
  ['all', 'お知らせ', 'セミナー', '販売', '成約']);
assert.match(news, /data-cms-id="news_page-sec-2_H2_001"/);
const data = JSON.parse(read('data/news-items.json'));
assert.equal(data.items.length, data.count);
assert.ok(fs.existsSync(path.join(root, 'news-detail.html')));
console.log(`PASS: services/news list-first layout, single headings, six service links, news filters and ${data.count} news entries`);
