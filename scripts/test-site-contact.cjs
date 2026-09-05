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

for (const page of ['', 'index.html', 'animation-dynamic.html', 'social-contribution.html', 'business.html', 'sold-properties.html', 'for-sale.html', 'news.html', 'inheritance-vacant-house.html']) {
  const html = mount(page);
  assert.equal((html.match(/id="site-contact"/g) || []).length, 1, page);
  assert.match(html, /contact-demo--focus/);
  assert.match(html, /contact-demo--cards/);
  assert.match(html, /href="contact.html"/);
  assert.match(html, /href="tel:0344007994"/);
  assert.match(html, /accountId=096igviz/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Unique heading IDs');
  for (const asset of [...html.matchAll(/\bsrc(?:set)?="([^"]+)"/g)]) assert.ok(fs.existsSync(path.join(root, asset[1])), asset[1]);
}
for (const page of ['contact.html', 'privacy.html', 'contact-section-comparison.html', 'consultation-button-comparison.html', 'animation-recommended.html']) assert.equal(mount(page), '', page);
assert.equal(mount('index.html', {existing:true}), '');
assert.equal(mount('index.html', {footer:false}), '');
const article = mount('blog/inherited-property-first-steps.html', {nested:true});
assert.match(article, /href="\.\.\/contact.html"/);
assert.match(article, /src="\.\.\/src\/kagoya-line-qr.webp"/);
const responsive = fs.readFileSync(path.join(root, 'assets/css/site-contact.css'), 'utf8');
assert.match(responsive, /@media\(max-width:767px\)/);
assert.match(responsive, /\.site-contact__desktop\{display:none\}/);
assert.match(responsive, /\.site-contact__mobile\{display:block\}/);
console.log('PASS: production pages, exclusions, unique IDs, contact links, local assets, nested paths and responsive variants');
