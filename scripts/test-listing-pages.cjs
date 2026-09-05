// サービスのヒーロー復元・会社概要とお知らせ一覧の先頭配置・既存導線を確認する。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

for (const [file, firstClass, marker] of [
  ['services.html', 'page-hero', 'src="src/gen-sale.jpg"'],
  ['news.html', 'news-listing-first', 'id="noticeList"'],
  ['about.html', 'company-profile-first', 'class="company-table"']
]) {
  const html = read(file);
  const main = html.match(/<main id="main">([\s\S]*?)<\/main>/)[1];
  const first = main.match(/^\s*<section\b([^>]*)>([\s\S]*?)<\/section>/);
  assert.ok(first, `${file}: main直下の最初のセクション`);
  assert.ok(first[1].includes(firstClass), `${file}: 先頭セクションの識別`);
  assert.ok(first[2].includes(marker), `${file}: 指定した内容を先頭に表示`);
  if (file === 'news.html') assert.doesNotMatch(main, /class="page-hero\b/, 'お知らせはヒーローなしを維持');
  if (file === 'services.html') {
    const afterHero = main.slice(first[0].length);
    assert.match(afterHero, /^\s*<section\b[^>]*\bservices-index\b/, 'サービス一覧はヒーローの直後');
    assert.equal((main.match(/class="page-hero"/g) || []).length, 1, 'サービスのヒーローは1つ');
    assert.match(first[2], /data-cms-id="services_page-hero-1_H1_002">サービス<\/h1>/);
    assert.match(first[2], /相談内容に合わせて、必要な道筋を組み立てます。/);
  }
  assert.equal((main.match(/<h1\b/g) || []).length, 1, `${file}: 主見出しは1つ`);
  const listMarker = file === 'services.html' ? 'class="numbered-list"' : marker;
  assert.ok(main.indexOf('data-subpage-visual') > main.indexOf(listMarker), `${file}: 写真紹介は一覧の後`);
  if (file !== 'about.html') assert.match(html, /assets\/css\/listing-pages\.css\?v=/);
  for (const [, attrs, source] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!attrs.includes('application/ld+json') && source.trim()) new Function(source);
  }
}

const about = read('about.html');
assert.equal((about.match(/class="company-table"/g) || []).length, 1, '会社概要の重複なし');
assert.equal((about.match(/<tr><th>/g) || []).length, 11, '会社概要11項目を維持');
assert.match(about, /id="company-profile-title">会社概要<\/h1>/);
assert.match(about, /class="company-intro-title">難しい不動産ほど、<br>籠やへ。<\/h2>/);

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
console.log(`PASS: restored service hero, company profile first with 11 fields, news list first, single headings, six service links and ${data.count} news entries`);
