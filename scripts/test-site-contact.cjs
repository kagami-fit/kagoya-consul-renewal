// 共通窓口の対象ページ・相対URL・二重追加防止をブラウザーなしで確認する。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/js/site.js'), 'utf8');
const mountSource = source.slice(0, source.indexOf("  const toggle =")) + '\n})();';

function mount(page, { nested = false, existing = false, footer = true } = {}) {
  let html = '';
  vm.runInNewContext(mountSource, {
    window: { location: { pathname: '/kagoya-consul-renewal/' + page } },
    document: {
      body: {},
      querySelector(selector) {
        if (selector.startsWith('script[')) return { getAttribute: () => (nested ? '../' : '') + 'assets/js/site.js' };
        if (selector === 'main') return { insertAdjacentHTML: (position, content) => { assert.equal(position, 'beforeend'); html += content; } };
        if (selector === '.site-footer') return footer ? {} : null;
        if (selector === '#site-contact') return existing ? {} : null;
        throw new Error('Unexpected selector: ' + selector);
      }
    }
  });
  return html;
}

const expectedPages = {
  'index.html': ['不動産・事業のご相談', ''],
  'animation-dynamic.html': ['不動産・事業のご相談', ''],
  'business.html': ['事業・サービスのご相談', ''],
  'about.html': ['籠やへのお問い合わせ', ''],
  'services.html': ['不動産の選択肢をご相談ください', 'project'],
  'service.html': ['不動産の選択肢をご相談ください', 'project'],
  'sale-consulting.html': ['不動産コンサルティングのご相談', 'project'],
  'inheritance-vacant-house.html': ['相続・空き家のご相談', 'project'],
  'brokerage-purchase.html': ['仲介・買取のご相談', 'project'],
  'rights-coordination.html': ['底地・借地・権利調整のご相談', 'project'],
  'fukuri.html': ['エフクリ導入・活用のご相談', 'investment'],
  'purchase-asset.html': ['購入・資産形成のご相談', 'investment'],
  'property-management.html': ['賃貸経営・管理のご相談', 'project'],
  'corporate-seminars.html': ['企業向けセミナーのご相談', 'recruit'],
  'corporate-benefits.html': ['法人向け不動産相談のご案内', 'investment'],
  'social-contribution.html': ['社会貢献活動のお問い合わせ', 'partner'],
  'team.html': ['専門家との連携・ご相談', ''],
  'features.html': ['不動産の判断に迷ったら', 'project'],
  'for-sale.html': ['販売中物件のお問い合わせ', 'project'],
  'properties.html': ['販売中物件のお問い合わせ', 'project'],
  'wp-sale.html': ['販売中物件のお問い合わせ', 'project'],
  'sold-properties.html': ['成約実績を参考にしたご相談', 'project'],
  'property-detail.html': ['物件についてのお問い合わせ', 'project'],
  'news.html': ['お知らせ・セミナーのお問い合わせ', ''],
  'news-detail.html': ['この記事についてのお問い合わせ', ''],
  'insights.html': ['読みものから、個別のご相談へ', 'project'],
  'faq.html': ['解決しなかった疑問はこちらへ', ''],
  'blog/check-before-price-cut.html': ['売却価格・販売方法のご相談', 'project'],
  'blog/inherited-property-first-steps.html': ['相続した不動産のご相談', 'project'],
  'blog/rebuild-impossible-property.html': ['再建築不可物件のご相談', 'project']
};
for (const [page, [heading, type]] of Object.entries(expectedPages)) {
  const nested = page.startsWith('blog/');
  const html = mount(page, {nested});
  assert.equal((html.match(/id="site-contact"/g) || []).length, 1, page);
  assert.match(html, /contact-demo--focus/);
  assert.match(html, /contact-demo--cards/);
  const formHref = `${nested ? '../' : ''}contact.html${type ? '?type=' + type : ''}`;
  assert.equal([...html.matchAll(/class="contact-form-link" href="([^"]+)"/g)].length, 2, page);
  for (const link of html.matchAll(/class="contact-form-link" href="([^"]+)"/g)) assert.equal(link[1], formHref, page);
  for (const device of ['desktop', 'mobile']) assert.ok(html.includes(`id="site-contact-title-${device}">${heading}</h2>`), page);
  const desktopTitle = html.match(/<h3>([\s\S]*?)<\/h3>/)[1];
  const desktopCopy = html.match(/<h3>[\s\S]*?<\/h3>\s*<p>([\s\S]*?)<\/p>/)[1];
  assert.ok(html.includes(`<h3 class="contact-channel__label">${desktopTitle}</h3>`), page + ' mobile title matches');
  assert.ok(html.includes(`<p class="contact-channel__note">${desktopCopy}</p>`), page + ' mobile copy matches');
  assert.doesNotMatch(html, /undefined|お問い合わせはこちら|ご相談内容を、分かる範囲で。/);
  assert.match(html, /href="tel:0344007994"/);
  assert.match(html, /accountId=096igviz/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Unique heading IDs');
  for (const asset of html.matchAll(/\bsrc(?:set)?="([^"]+)"/g)) assert.ok(fs.existsSync(path.resolve(root, path.dirname(page), asset[1])), asset[1]);
  const pageSource = fs.readFileSync(path.join(root, page), 'utf8');
  const main = pageSource.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  assert.doesNotMatch(main, /class="mini-cta"|class="c-cta"|Not one answer|class="post-foot__cta"|class="widget w-cta"/, page + ' duplicate CTA removed');
  const expectedVersion = page === 'social-contribution.html' ? '20260905-social-images' : '20260905-contact-unified';
  assert.ok(pageSource.includes('site.js?v=' + expectedVersion), page + ' cache refreshed');
}
assert.equal(mount(''), mount('index.html'));
assert.equal(mount('animation-dynamic.html'), mount('index.html'));
assert.equal(mount('service.html'), mount('services.html'));
assert.equal(mount('wp-sale.html'), mount('for-sale.html'));
assert.equal(mount('properties.html'), mount('for-sale.html'));
const homeRoutes = mount('index.html').match(/<nav class="site-contact__routes"[\s\S]*?<\/nav>/)[0];
for (const type of ['project', 'partner', 'investment', 'recruit']) assert.ok(homeRoutes.includes(`contact.html?type=${type}`));
assert.doesNotMatch(mount('services.html'), /class="site-contact__routes"/);
assert.match(mount('social-contribution.html'), /src="src\/gen-nbc-education-contact\.jpg"/);
assert.match(mount('social-contribution.html'), /教育活動の連携イメージ（AI生成）/);
assert.doesNotMatch(mount('social-contribution.html'), /gen-consultation/);
assert.match(mount('services.html'), /src="src\/gen-consultation\.jpg"/);
for (const page of ['contact.html', 'privacy.html', 'contact-section-comparison.html', 'consultation-button-comparison.html', 'animation-recommended.html']) assert.equal(mount(page), '', page);
assert.equal(mount('index.html', {existing:true}), '');
assert.equal(mount('index.html', {footer:false}), '');
const article = mount('blog/inherited-property-first-steps.html', {nested:true});
assert.match(article, /href="\.\.\/contact.html\?type=project"/);
assert.match(article, /src="\.\.\/src\/kagoya-line-qr.webp"/);
const responsive = fs.readFileSync(path.join(root, 'assets/css/site-contact.css'), 'utf8');
assert.match(responsive, /@media\(max-width:767px\)/);
assert.match(responsive, /\.site-contact__desktop\{display:none\}/);
assert.match(responsive, /\.site-contact__mobile\{display:block\}/);
assert.doesNotMatch(fs.readFileSync(path.join(root, 'scripts/build_business_pages.mjs'), 'utf8'), /class="mini-cta"/);
console.log(`PASS: ${Object.keys(expectedPages).length} pages; tailored desktop/mobile copy, duplicate CTA removal, purpose links, aliases, local assets and responsive variants`);
