/* 共通データからトップ新着・販売一覧・詳細を静的生成。本番WPへは接続しない。 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const e=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export const priceRange=yen=>yen<=500000000?'under-500m':yen<=800000000?'500m-800m':'over-800m';
const labels={'under-500m':'5億円以下','500m-800m':'5億円超〜8億円以下','over-800m':'8億円超'};
export function newestPerRange(items){const sorted=[...items].filter(p=>p.saleStatus==='available').sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)||a.id.localeCompare(b.id));return Object.keys(labels).map(r=>sorted.find(p=>priceRange(p.priceYen)===r)).filter(Boolean);}
const money=yen=>{const oku=Math.floor(yen/100000000),man=Math.round((yen%100000000)/10000);return oku?`${oku}億${man?man.toLocaleString('ja-JP')+'万円':'円'}`:`${man.toLocaleString('ja-JP')}万円`;};
const area=n=>n.toLocaleString('ja-JP',{minimumFractionDigits:1,maximumFractionDigits:1})+'㎡';
const file=p=>'property-'+p.id.toLowerCase()+'.html';
const source=JSON.parse(fs.readFileSync(path.join(root,'data/income-properties.json'),'utf8'));
assert.equal(source.sampleOnly,true,'公開確認版はサンプル専用です。');
const all=source.properties;
assert.equal(new Set(all.map(p=>p.id)).size,all.length,'物件番号は一意にしてください。');
for(const p of all){assert.equal(p.isSample,true);assert.match(p.id,/^DEMO-\d+$/);assert.ok(p.priceYen>0&&p.grossYieldPercent>0&&p.landAreaSqm>0&&p.floorAreaSqm>0);assert.ok(Number.isFinite(Date.parse(p.publishedAt)));assert.ok(fs.existsSync(path.join(root,'assets/images',p.image)));}
const available=all.filter(p=>p.saleStatus==='available').sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)||a.id.localeCompare(b.id));
const yieldNote='表面利回り（想定）は、年間賃料収入÷物件価格×100で算出する費用控除前の指標です。管理費・税金・修繕費等を含まず、将来の収益を保証しません。数値は架空の設定です。';
const facts=p=>`<div><dt>価格例</dt><dd>${e(money(p.priceYen))}</dd></div><div><dt>表面利回り（想定）</dt><dd>${p.grossYieldPercent.toFixed(1)}<span>％</span></dd></div><div><dt>土地面積例</dt><dd class="fact-secondary">${e(area(p.landAreaSqm))}</dd></div><div><dt>延床面積例</dt><dd class="fact-secondary">${e(area(p.floorAreaSqm))}</dd></div>`;
const card=(p,i)=>`<article class="property-card" data-income-property="${e(p.id)}" data-price-range="${priceRange(p.priceYen)}"><figure class="property-image"><a href="${file(p)}"><img src="assets/images/${e(p.image)}" alt="${e(p.imageAlt)}" width="1536" height="1024" loading="lazy"></a><span class="image-tag">INCOME PROPERTY</span><figcaption>生成イメージ・実在物件ではありません</figcaption></figure><div class="property-content"><a class="income-range" href="for-sale.html?range=${priceRange(p.priceYen)}">${labels[priceRange(p.priceYen)]} <span aria-hidden="true">→</span></a><p class="property-folio" aria-hidden="true"><span>${String(i+1).padStart(2,'0')}</span><em>Investment</em></p><div class="property-meta"><span>${e(p.type)}</span><span class="sample-label">サンプル ${e(p.id)}</span></div><h3><a href="${file(p)}">${e(p.title)}</a></h3><p class="property-description">${e(p.description)}</p><dl class="property-facts">${facts(p)}</dl><p class="property-reference">${e(p.id)} · 架空のモデルケース</p><a class="property-detail-link" href="${file(p)}">物件詳細を見る <span aria-hidden="true">↗</span></a></div></article>`;
let home=fs.readFileSync(path.join(root,'index.html'),'utf8');
home=home.replace(/<section class="faq section-space"[\s\S]*?<\/section>\s*/, '');
home=home.replace(/\s*<dialog id="property-dialog"[\s\S]*?<\/dialog>/,'');
home=home.replace('気になる物件や、用途・エリア・予算などをお伝えください。','気になる物件や、エリア・予算・希望利回りなどをお伝えください。');
home=home.replace('href="../privacy.html"','href="privacy.html"');
home=home.replace('JavaScriptが無効のため、絞り込み・詳細表示は利用できません。サンプルの概要はそのままご覧いただけます。','JavaScriptが無効のため、メニュー操作とフォームの入力確認は利用できません。物件概要と詳細ページはそのままご覧いただけます。');
const newest=newestPerRange(all);
const grid=`<div class="property-grid">\n${newest.map(card).join('\n')}\n</div>\n<p class="yield-note">${yieldNote}</p>`;
home=home.replace(/<div class="property-grid">[\s\S]*?<div class="collection-bottom">/,`${grid}\n<div class="collection-bottom">`);
const dataTag=`<script id="income-property-data" type="application/json">${JSON.stringify(available.map(p=>({id:p.id,title:p.title,range:priceRange(p.priceYen)}))).replaceAll('<','\\u003c')}</script>`;
home=home.replace(/\s*<script id="income-property-data"[\s\S]*?<\/script>/,'').replace('</body>',dataTag+'\n</body>');
fs.writeFileSync(path.join(root,'index.html'),home);
const head=home.match(/<head>[\s\S]*?<\/head>/)[0];
const aside=home.match(/<aside class="preview-note"[\s\S]*?<\/aside>/)[0];
const header=home.match(/<!-- KAGOYA:PRIVATE_HEADER -->[\s\S]*?<!-- \/KAGOYA:PRIVATE_HEADER -->/)[0].replaceAll('href="#philosophy"','href="index.html#philosophy"').replaceAll('href="#consultation"','href="index.html#consultation"');
const footer=home.match(/<!-- KAGOYA:PRIVATE_FOOTER -->[\s\S]*?<!-- \/KAGOYA:PRIVATE_FOOTER -->/)[0];
function page(title,main){return `<!doctype html>\n<html lang="ja">${head.replace(/<title>[\s\S]*?<\/title>/,`<title>${e(title)}｜KAGOYA Private Collection</title>`)}<body><a class="skip-link" href="#main">本文へスキップ</a>${aside}${header}<main id="main">${main}</main>${footer}</body></html>\n`;}
const filters=`<div class="filter-bar" role="group" aria-label="価格帯で絞り込み"><button type="button" data-income-filter="all" aria-pressed="true" disabled>すべて</button>${Object.entries(labels).map(([r,l])=>`<button type="button" data-income-filter="${r}" aria-pressed="false" disabled>${l}</button>`).join('')}<span class="filter-label">NEWEST FIRST</span></div><p id="filter-status" class="small-note" role="status" aria-live="polite">${available.length}件のサンプルを表示しています。</p>`;
fs.writeFileSync(path.join(root,'for-sale.html'),page('販売中収益物件',`<section class="income-list-intro"><div class="wrap"><p class="crumb"><a href="index.html">トップ</a> ／ 販売中収益物件</p><p class="eyebrow">INCOME PROPERTY COLLECTION</p><h1>販売中収益物件</h1><p class="lead">ご希望の価格帯から、収益不動産を比較する。</p><p class="small-note">制作確認用。掲載情報・価格・面積・利回りはすべて架空のサンプルです。実際の販売物件ではありません。</p></div></section><section class="collection section-space income-listing"><div class="wrap">${filters}<div class="property-grid">${available.map(card).join('\n')}</div><p class="yield-note">${yieldNote}</p><div class="collection-bottom"><p>物件が決まっていなくても、<br>ご希望の条件からお聞かせください。</p><a class="button button-dark" href="index.html#consultation">希望条件から相談する <span aria-hidden="true">→</span></a></div><noscript><p class="no-script">価格帯の絞り込みにはJavaScriptが必要です。物件概要と詳細ページはそのままご覧いただけます。</p></noscript></div></section>`));
for(const p of available){
const detailFacts=[['物件番号',p.id+'（架空）'],['種別',p.type],['想定エリア',p.area],['価格例',money(p.priceYen)],['表面利回り（想定）',p.grossYieldPercent.toFixed(1)+'％'],['土地面積例',area(p.landAreaSqm)],['延床面積例',area(p.floorAreaSqm)],['構造・階数',p.building],['戸数・テナント',p.units],['取扱状況','サンプル・実際の販売物件ではありません']];
fs.writeFileSync(path.join(root,file(p)),page(p.title,`<article class="income-detail wrap"><p class="crumb"><a href="index.html">トップ</a> ／ <a href="for-sale.html">販売中収益物件</a> ／ ${e(p.id)}</p><div class="income-detail-layout"><div><figure class="detail-image"><img src="assets/images/${e(p.image)}" alt="${e(p.imageAlt)}" width="1536" height="1024"><figcaption>生成イメージ・実在物件ではありません</figcaption></figure><p class="income-detail-copy">${e(p.description)}</p></div><div><p class="eyebrow">INCOME PROPERTY / SAMPLE</p><h1>${e(p.title)}</h1><p class="detail-preview-note">名称・価格・面積・利回りはすべて架空の設定です。販売や内覧はできません。</p><dl class="detail-facts">${detailFacts.map(([k,v])=>`<div><dt>${e(k)}</dt><dd>${e(v)}</dd></div>`).join('')}</dl><p class="yield-note">${yieldNote}</p><div class="income-detail-actions"><a class="button button-dark" href="index.html?property=${encodeURIComponent(p.id)}#consultation">この物件について相談する <span aria-hidden="true">→</span></a><a class="text-link" href="for-sale.html?range=${priceRange(p.priceYen)}">同じ価格帯の物件を見る <span aria-hidden="true">→</span></a></div></div></div></article>`));
}
// 既存WordPress固定ページID3から確認済みの原文をそのまま掲載。住所等も無断で変更しない。
const original=fs.readFileSync(path.join(root,'data/privacy-original.md'),'utf8').split('\n---\n')[1];
assert.ok(original.includes('第９条'));
const policy=original.trim().split(/\n\s*\n/).map(block=>block.startsWith('## ')?`<h2>${e(block.slice(3))}</h2>`:block.startsWith('# ')?`<h1>${e(block.slice(2))}</h1>`:`<p>${e(block).replace(/  \n/g,'<br>').replaceAll('\n','<br>')}</p>`).join('\n');
fs.writeFileSync(path.join(root,'privacy.html'),page('プライバシーポリシー',`<article class="income-privacy wrap">${policy}<p class="policy-source">出典：籠やWordPressの固定ページ「プライバシーポリシー」（ID3）、2026年9月28日確認の原文。本文・旧住所を保持しています。</p><a class="text-link" href="index.html#consultation">相談フォームへ戻る <span aria-hidden="true">→</span></a></article>`));
console.log(`Generated home (${newest.length} newest), listing (${available.length}), ${available.length} details, original policy.`);
