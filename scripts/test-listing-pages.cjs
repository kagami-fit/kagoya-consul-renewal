// サービス・会社概要・お知らせの配置と、販売／成約一覧への導線を確認する。
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
  if (file === 'about.html') assert.ok(main.indexOf('data-subpage-visual') > main.indexOf(listMarker), `${file}: 写真紹介は一覧の後`);
  else assert.doesNotMatch(main, /data-subpage-visual/, `${file}: 指定の写真紹介ブロックは削除済み`);
  if (file !== 'about.html') assert.match(html, /assets\/css\/listing-pages\.css\?v=/);
  for (const [, attrs, source] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!attrs.includes('application/ld+json') && source.trim()) new Function(source);
  }
}

const about = read('about.html');
assert.equal((about.match(/class="company-table"/g) || []).length, 1, '会社概要の重複なし');
assert.equal((about.match(/<tr><th>/g) || []).length, 12, '既存11項目＋所属');
assert.match(about, /公益社団法人 東京都宅地建物取引業協会/);
assert.match(about, /公益社団法人 全国宅地建物取引業保証協会/);
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
assert.doesNotMatch(news, /<span class="notice-row__media">/);
assert.doesNotMatch(read('news-detail.html'), /<figure class="news-detail__visual">/);
console.log(`PASS: service hero and six links retained; company profile with affiliations; ${data.count} news entries without photos`);

for (const file of ['index.html', 'animation-dynamic.html']) {
  const html = read(file);
  const resultHeader = html.match(/<div class="result-block__head">([\s\S]*?)<div class="result-grid">/);
  assert.ok(resultHeader, `${file}: 成約実績の見出しがある`);
  assert.match(resultHeader[1], /<a class="facility__link" href="sold-properties\.html">成約物件一覧を見る<\/a>/,
    `${file}: 販売中物件と同じデザインで成約一覧へ進める`);
  assert.equal((resultHeader[1].match(/href="sold-properties\.html"/g) || []).length, 1,
    `${file}: 成約一覧ボタンを重複させない`);
  assert.match(resultHeader[1], /公開可能な成約物件の一部をご紹介します。未公開物件は掲載していません。/);
  assert.match(html, /<a class="facility__link" href="for-sale\.html">販売中物件一覧を見る<\/a>/);
  for (const [, attrs, source] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!attrs.includes('application/ld+json') && source.trim()) new Function(source);
  }
}
assert.match(read('sold-properties.html'), /<h1>成約物件一覧<\/h1>/);
assert.match(read('sold-properties.html'), /id="sold-listings"/);
console.log('PASS: home and mirror link to the sold archive; current listings and disclosure copy retained');
