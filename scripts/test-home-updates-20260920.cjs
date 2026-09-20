// 追加依存なし。初期HTML、JSON描画、リンクなし表示、通信失敗時の表示を検証する。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const today = JSON.parse(read('data/today-items.json'));
const projects = JSON.parse(read('data/project-items.json'));
const source = read('assets/js/site.js');
const renderSource = source.slice(source.indexOf('  const escapeHtml ='), source.indexOf('  // 物件は管理シート由来'));
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const br = (value) => escapeHtml(value).replace(/\r?\n/g, '<br>');
const count = (value, expression) => (value.match(expression) || []).length;

assert.equal(today.updatedAt, '2026-09-20');
assert.deepEqual(today.items.map((item) => item.kind), ['NEW', 'MEETING', 'CLOSE', 'OTHER']);
assert.equal(today.items[0].title, 'クレストフォルム月島サウススクエア');
for (const text of ['1億3,000万円', '「月島」駅徒歩1分', '73.45㎡', '2LDK＋DEN']) assert.ok(today.items[0].summary.includes(text), text);
assert.match(today.items[1].title, /株式会社エータイ様/);
assert.equal(today.items[2].title, 'エイジングコート姫路');
assert.match(today.items[2].summary, /860万円/);
assert.match(today.items[3].title, /2026年11月6日/);
assert.match(today.items[3].summary, /弁護士×税理士×宅建士/);
today.items.forEach((item) => {
  assert.ok(!item.href, 'Unconfirmed detail destinations are not linked');
  assert.ok(!item.when && !item.source, 'No relative dates or internal-update labels');
});
assert.equal(projects.items.length, 3);
assert.equal(projects.items[0].title, '籠やみらい相談');
assert.equal(projects.items[0].href, 'kazokumiraikaigi.html');
assert.equal(projects.items[1].href, '', 'Etai card has no link');
assert.equal(projects.items[2].href, 'fukuri.html');
assert.equal(new Set(projects.items.map((item) => item.image)).size, 3);
projects.items.forEach((item) => {
  assert.ok(item.lead && item.summary && item.imageAlt);
  if (item.titleParts) assert.equal(item.titleParts.join(''), item.title);
  assert.ok(!item.status, 'No stale IN PROGRESS overlay');
  assert.match(item.imageAlt, /AI生成/);
  for (const asset of [item.image, item.imageWebp]) {
    assert.ok(fs.existsSync(path.join(root, asset)), asset);
    assert.ok(fs.statSync(path.join(root, asset)).size > 20000, asset + ' is a real image');
  }
  if (item.href) assert.ok(fs.existsSync(path.join(root, item.href)));
});

const homePages = ['index.html', 'animation-dynamic.html'].map(read);
const todaySection = (html) => html.slice(html.indexOf('    <section class="today"'), html.indexOf('    <section class="domain-section"'));
assert.equal(todaySection(homePages[0]), todaySection(homePages[1]), 'Both home variants match');
for (const html of homePages) {
  const section = todaySection(html);
  const activity = section.slice(0, section.indexOf('<div class="today__entry'));
  assert.doesNotMatch(activity, /<a\b|today__news-button|today__arrow/, 'Today is display-only, including no archive button');
  assert.equal(count(section, /id="projectGrid"/g), 1);
  assert.equal(count(section, /class="project-card"/g), 3);
  assert.equal(count(section, /class="project-card__link"/g), 2);
  assert.equal(count(section, /class="today__item today__item--notice"/g), 4);
  assert.doesNotMatch(section, /社内更新|本日｜|[234]日前｜|IN PROGRESS|2026\.08/);
  for (const item of today.items) {
    assert.ok(section.includes(escapeHtml(item.title)));
    assert.ok(section.includes(br(item.summary)));
  }
  for (const item of projects.items) {
    assert.ok(section.replace(/<[^>]+>/g, '').includes(escapeHtml(item.title)), item.title);
    for (const text of [item.summary, item.imageAlt]) assert.ok(section.includes(escapeHtml(text)), text);
    assert.ok(section.includes(br(item.lead)));
    assert.ok(section.includes(item.image) && section.includes(item.imageWebp));
  }
  assert.match(section, /実際の相談風景・施設・サービス画面とは異なります/);
  assert.match(html, /assets\/css\/home-updates-20260920\.css/);
  assert.match(html, /site\.js\?v=20260916-readable-home-20260920/);
}

// 相談カードと遷移先FVは、同じinquiryRoutesを使う。
const routeStart = source.indexOf('  const inquiryRoutes =');
const routeSource = source.slice(routeStart, source.indexOf('  const archive =', routeStart));
const routeKeys = ['project', 'partner', 'investment', 'recruit'];
function renderRoutes(type = '') {
  const cards = [...routeKeys, 'unknown'].map((key) => ({
    key,
    fields: Object.fromEntries(['label', 'title', 'lead'].map((field) => [`[data-inquiry-route-${field}]`, {textContent:'initial'}])),
    getAttribute: () => key,
    querySelector(selector) { return this.fields[selector] || null; }
  }));
  const contact = Object.fromEntries(['title', 'lead', 'label', 'description', 'note'].map((key) => [`[data-inquiry-${key}]`, {textContent:'initial'}]));
  contact['[data-inquiry-panel]'] = {hidden:true};
  const context = {
    URLSearchParams,
    window: {location:{search:type ? `?type=${type}` : ''}},
    document: {
      querySelectorAll: (selector) => selector === '.entry-card[data-inquiry-route]' ? cards : [],
      querySelector: (selector) => contact[selector] || null
    }
  };
  vm.runInNewContext(routeSource + '\nglobalThis.testInquiryRoutes = inquiryRoutes;', context);
  return {cards, contact, routes:context.testInquiryRoutes};
}
const renderedRoutes = renderRoutes();
for (const html of homePages) {
  const connect = html.match(/<section class="entry-routes"[^>]*>[\s\S]*?<\/section>/)[0];
  const cards = [...connect.matchAll(/<a class="entry-card"[^>]*data-inquiry-route="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.deepEqual(cards.map((match) => match[1]), routeKeys);
  for (const [, key, body] of cards) {
    const route = renderedRoutes.routes[key];
    for (const field of ['label','title','lead']) assert.ok(body.includes(`data-inquiry-route-${field}>${escapeHtml(route[field])}<`), key + ' ' + field);
    assert.ok(connect.includes(`href="contact.html?type=${key}"`));
  }
  assert.doesNotMatch(connect, /不動産の状況を相談する|専門家・地域事業者の方へ|事業・物件の可能性を話す|動いている案件に関わる/);
}
for (const card of renderedRoutes.cards.filter((card) => card.key !== 'unknown')) {
  for (const field of ['label','title','lead']) assert.equal(card.fields[`[data-inquiry-route-${field}]`].textContent, renderedRoutes.routes[card.key][field]);
}
assert.equal(renderedRoutes.cards.at(-1).fields['[data-inquiry-route-title]'].textContent, 'initial', 'Unknown route is left intact');
for (const key of [...routeKeys, 'family']) {
  const {contact, routes} = renderRoutes(key);
  for (const field of ['title','lead','label','description']) assert.equal(contact[`[data-inquiry-${field}]`].textContent, routes[key][field]);
  assert.equal(contact['[data-inquiry-panel]'].hidden, false);
}
assert.equal(renderRoutes('unknown').contact['[data-inquiry-panel]'].hidden, true);
console.log('PASS: four Connect cards match destination hero titles, leads and labels; shared-copy updates and all five inquiry routes preserved');

async function render({ payloads = {today, projects}, fail = false, prefix = '' } = {}) {
  const nodes = {
    '#todayFeed': { innerHTML: 'STATIC_TODAY' },
    '#projectGrid': { innerHTML: 'STATIC_PROJECTS' },
    '[data-live-updated]': { textContent: '' },
    '[data-live-ticker]': { textContent: '' }
  };
  vm.runInNewContext(renderSource, {
    prefix, URL,
    window: { location: { href: `https://example.test/kagoya/${prefix ? 'nested/' : ''}index.html`, protocol: 'https:' } },
    document: { querySelector: (selector) => nodes[selector] || null },
    fetch: async (url) => {
      if (fail) throw new Error('offline');
      return { ok: true, json: async () => url.includes('today-items') ? payloads.today : payloads.projects };
    }
  });
  await new Promise(setImmediate);
  return nodes;
}

(async () => {
  const nodes = await render();
  const feed = nodes['#todayFeed'].innerHTML;
  const cards = nodes['#projectGrid'].innerHTML;
  assert.equal(count(feed, /<article\b/g), 4);
  assert.doesNotMatch(feed, /<a\b|today__arrow|today__meta|<p>｜/);
  assert.match(feed, /today__kind--other/);
  assert.equal(nodes['[data-live-updated]'].textContent, '2026.09.20');
  assert.equal(count(cards, /<article\b/g), 3);
  assert.equal(count(cards, /<a\b/g), 2);
  assert.equal(count(cards, /<picture>/g), 3);
  assert.doesNotMatch(cards, /IN PROGRESS|project-card__status|type=partner/);
  assert.match(cards, /href="https:\/\/example.test\/kagoya\/kazokumiraikaigi.html"/);
  assert.match(cards, /href="https:\/\/example.test\/kagoya\/fukuri.html"/);
  assert.doesNotMatch(cards.match(/<article class="project-card">[\s\S]*?<\/article>/g)[1], /<a\b/);
  const offline = await render({fail:true});
  assert.equal(offline['#todayFeed'].innerHTML, 'STATIC_TODAY');
  assert.equal(offline['#projectGrid'].innerHTML, 'STATIC_PROJECTS');
  const empty = await render({payloads:{today:{items:[]},projects:{items:[]}}});
  assert.equal(empty['#todayFeed'].innerHTML, 'STATIC_TODAY');
  assert.equal(empty['#projectGrid'].innerHTML, 'STATIC_PROJECTS');
  const unsafe = '<img src=x onerror=alert(1)>';
  const hostile = await render({payloads:{today:[{title:unsafe,summary:unsafe,href:'javascript:alert(1)',when:'2026年9月20日',source:'公開情報'}],projects:[{title:unsafe,lead:unsafe,summary:unsafe,image:'javascript:alert(1)',href:'javascript:alert(1)',linkLabel:unsafe,status:unsafe}]}});
  for (const key of ['#todayFeed','#projectGrid']) {
    assert.doesNotMatch(hostile[key].innerHTML, /(?:src|href)="javascript:|<img src=x/);
    assert.ok(hostile[key].innerHTML.includes('&lt;img'));
  }
  assert.match(hostile['#todayFeed'].innerHTML, /公開情報/);
  assert.doesNotMatch(hostile['#todayFeed'].innerHTML, /<a\b|today__arrow/);
  const linkedToday = await render({payloads:{today:[{title:'表示のみ',href:'news.html'}],projects}});
  assert.doesNotMatch(linkedToday['#todayFeed'].innerHTML, /<a\b|href=|today__arrow/, 'A feed URL cannot re-enable Today navigation');
  const nested = await render({prefix:'../'});
  assert.match(nested['#projectGrid'].innerHTML, /href="https:\/\/example.test\/kagoya\/fukuri.html"/);
  console.log('PASS: four approved notices; three illustrated projects; two working links; Etai unlinked; matching initial HTML; offline fallback; escaped content');
})().catch((error) => { console.error(error); process.exitCode = 1; });
