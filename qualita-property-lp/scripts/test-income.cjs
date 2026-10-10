const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const {JSDOM}=require('jsdom');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const dom=f=>new JSDOM(read(f),{url:'https://example.invalid/qualita-property-lp/'+f,runScripts:'outside-only',pretendToBeVisual:true});
(async()=>{
 const {priceRange,newestPerRange}=await import('./build-income.mjs');
 for(const [p,r] of [[499999999,'under-500m'],[500000000,'under-500m'],[500000001,'500m-800m'],[800000000,'500m-800m'],[800000001,'over-800m']])assert.equal(priceRange(p),r);
 const data=JSON.parse(read('data/income-properties.json')).properties;
 const newer={...data[0],id:'DEMO-04',publishedAt:'2026-10-11T09:00:00+09:00'};
 assert.equal(newestPerRange([...data,newer])[0].id,'DEMO-04');
 assert.equal(newestPerRange([...data,{...newer,saleStatus:'closed'}])[0].id,'DEMO-01');
 const h=dom('index.html'),d=h.window.document;
 for(const text of ['3億円以上の不動産をご検討の方へ','住まい・別荘','用途の異なる物件を','次の選択に、出会う場所','選び抜いた収益不動産を、確かな情報とともにご紹介します。','ご相談の前に。','ご検討の用途'])assert.ok(!d.body.textContent.includes(text),text);
 assert.equal(d.querySelector('.hero-visual img').getAttribute('src'),'assets/images/building.jpg');
 assert.equal(d.querySelectorAll('[data-income-property]').length,3);
 assert.ok(!d.querySelector('#property-dialog'));
 assert.ok(!d.querySelector('#property-interest').required);
 for(const id of ['your-name','your-email','your-message','privacy-consent'])assert.ok(d.getElementById(id).required);
 assert.equal(d.querySelector('.privacy-information a').getAttribute('href'),'privacy.html');
 h.window.matchMedia=()=>({matches:false,addEventListener(){}});
 h.window.HTMLElement.prototype.scrollIntoView=function(){};
 let sends=0;h.window.fetch=()=>{sends++;throw Error('Unexpected external request');};
 h.window.eval(read('assets/js/income-collection.js'));
 assert.equal(d.getElementById('inquiry-fields').disabled,false);
 d.getElementById('your-name').value='表示確認';d.getElementById('your-email').value='preview@example.invalid';d.getElementById('your-message').value='物件を指定しない相談の確認';d.getElementById('privacy-consent').checked=true;
 d.getElementById('preview-inquiry').click();assert.equal(d.getElementById('form-status').hidden,false);assert.match(d.getElementById('form-status').textContent,/物件を指定しない/);assert.equal(sends,0);
 const listing=dom('for-sale.html');listing.window.matchMedia=()=>({matches:false,addEventListener(){}});listing.window.eval(read('assets/js/income-collection.js'));
 const ld=listing.window.document;for(const r of ['under-500m','500m-800m','over-800m']){ld.querySelector(`[data-income-filter="${r}"]`).click();assert.equal([...ld.querySelectorAll('[data-income-property]')].filter(c=>!c.hidden).length,1);assert.equal(ld.querySelector(`[data-income-filter="${r}"]`).getAttribute('aria-pressed'),'true');}
 ld.querySelector('[data-income-filter="all"]').click();assert.equal([...ld.querySelectorAll('[data-income-property]')].filter(c=>!c.hidden).length,3);
 const corporateHome=new URL('../index.html',listing.window.location.href);
 for(const link of ld.querySelectorAll('a[href]')){
  const target=new URL(link.getAttribute('href'),listing.window.location.href);
  assert.ok(target.origin!==corporateHome.origin||target.pathname!==corporateHome.pathname,'販売一覧から籠や本体のトップへ移動しない');
 }
 assert.equal(ld.querySelector('.brand').getAttribute('href'),'index.html','ロゴは収益不動産紹介のトップへ');
 assert.equal(ld.querySelector('.brand').getAttribute('aria-label'),'収益不動産紹介のトップへ');
 assert.ok(!ld.querySelector('#mobile-nav').textContent.includes('籠やのホームへ'),'スマホメニューから本体トップへのリンクを削除');
 assert.ok(!ld.querySelector('.site-footer').textContent.includes('籠やのホームへ'),'フッターから本体トップへのリンクを削除');
 const latestBefore=JSON.parse(read('versions/registry.json')).versions.filter(v=>/-before(?:-|$)/.test(v.id)).at(-1);
 assert.equal(ld.querySelector('[data-version-navigation]').getAttribute('href'),`versions/${latestBefore.id}/for-sale.html`,'編集前リンクは直近の固定保存版の一覧へ');
 assert.equal(ld.querySelector('.crumb a').getAttribute('href'),'index.html','紹介サイト内のトップリンクは維持');
 assert.equal(ld.querySelector('.collection-bottom a').getAttribute('href'),'index.html#consultation','紹介サイト内の相談リンクは維持');
 for(const p of data){const detail=dom('property-'+p.id.toLowerCase()+'.html').window.document;assert.match(detail.body.textContent,new RegExp(p.grossYieldPercent.toFixed(1).replace('.','\\.')+'％'));assert.ok(detail.body.textContent.includes('土地面積例'));assert.ok(detail.body.textContent.includes('延床面積例'));assert.match(detail.querySelector('.income-detail-actions a').href,/property=DEMO-/);}
 const selected=new JSDOM(read('index.html'),{url:'https://example.invalid/qualita-property-lp/index.html?property=DEMO-03#consultation',runScripts:'outside-only'});selected.window.matchMedia=()=>({matches:false,addEventListener(){}});selected.window.eval(read('assets/js/income-collection.js'));assert.match(selected.window.document.getElementById('property-interest').value,/DEMO-03/);assert.equal(selected.window.document.getElementById('price-range').value,'over-800m');
 const policy=dom('privacy.html').window.document;assert.equal(policy.querySelectorAll('.income-privacy h2').length,9);
 const corporate=new JSDOM(fs.readFileSync(path.resolve(root,'../privacy.html'),'utf8')).window.document;
 const normalize=text=>text.replace(/\s/g,'');
 const original=corporate.querySelector('h1').textContent+corporate.querySelector('.privacy-document__intro').textContent+corporate.querySelector('.privacy-document__body').textContent;
 const published=policy.querySelector('h1').textContent+policy.querySelector('.income-privacy-intro').textContent+policy.querySelector('.income-privacy-body').textContent;
 assert.equal(normalize(published),normalize(original),'指定された籠や privacy.html の全文と一致');
 assert.ok(published.includes('〒152-0032　東京都目黒区平町1丁目26-17 ソシアル都立大学駅前201号'));
 assert.ok(!published.includes('目黒本町一丁目12番15号-1F'),'最新版には旧住所を残さない');
 assert.ok(!policy.querySelector('.policy-source'),'旧住所保持という古い案内を表示しない');
 assert.equal(d.querySelector('[data-version-navigation]').getAttribute('href'),'versions/20261010-before-privacy/index.html');
 for(const link of d.querySelectorAll('a[href*="privacy.html"]'))assert.equal(link.getAttribute('href'),'privacy.html','フォームとフッターは共通の全文ポリシーへ');
 assert.equal(corporate.querySelectorAll('.privacy-document__section').length,9);
 assert.ok(corporate.querySelector('link[href^="assets/css/privacy-document.css"]'),'公開版にも記事用のスタイルを同梱');
 for(const f of ['index.html','for-sale.html','property-demo-01.html','property-demo-02.html','property-demo-03.html','privacy.html']){const doc=dom(f).window.document;assert.equal(doc.querySelectorAll('h1').length,1,f);for(const el of doc.querySelectorAll('[src],[href]'))for(const attr of ['src','href']){const v=el.getAttribute(attr);if(!v||/^(?:[a-z]+:|\/\/|#)/i.test(v))continue;assert.ok(fs.existsSync(path.resolve(root,v.split(/[?#]/)[0])),`${f}: ${v}`);}}
 console.log('PASS: boundary filters, newest per segment, no closed properties, three details, areas/yields, property preselection, optional property form, no send, nine shared policy articles/current address, privacy/version links; listing has no corporate-home links and retains collection navigation.');
})();
