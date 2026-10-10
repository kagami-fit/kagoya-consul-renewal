// 現行のセミナー確認版を変えず、別フォルダでファーストビューを提案する。
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const source=path.join(root,'review/consultation-20261010-seminar');
const dest=path.join(root,'review/consultation-20261010-firstview');
const pages=[['horitsu_lp','法律',3,5],['zeimu_lp','税務',3,5],['fudosan_lp','不動産',5,7]];
const fees='※相談無料（60分まで）。正式な依頼受任後は所定の料金が発生します。';
const privacy='※相談内容は第三者へ漏れることはありません(SCSKには共有されません)';
for(const [slug,type,content,contact] of pages){
 let html=fs.readFileSync(path.join(source,`${slug}.html`),'utf8');
 assert.equal((html.match(/<header class="kagoya-legacy-lp__heading">/g)||[]).length,1);
 html=html.replace('lang="en-US"','lang="ja"')
 .replace(/<title>[\s\S]*?<\/title>/,`<title>エフクリ ご利用者様専用${type}相談窓口｜ファーストビュー確認版</title>`)
 .replace('</head>','<link rel="stylesheet" href="firstview.css">\n</head>')
 .replace(/<header class="kagoya-legacy-lp__heading">[\s\S]*?<\/header>/,`<header class="efukuri-hero" aria-labelledby="efukuri-hero-title">
<img class="efukuri-hero__image" src="assets/images/efukuri-consultation-hero-v1.png" alt="" width="1536" height="1024" fetchpriority="high">
<div class="efukuri-hero__copy">
<p class="efukuri-hero__audience">資産形成ラウンジ <strong>エフクリ</strong><br>ご利用者様</p>
<h1 id="efukuri-hero-title">専用${type}<br>相談窓口</h1>
<span class="efukuri-hero__free">相談無料（60分まで）</span>
<nav class="efukuri-hero__actions" aria-label="相談窓口のご案内"><a href="#section${content}">相談内容を見る <span aria-hidden="true">→</span></a><a href="#section${contact}">お問い合わせ <span aria-hidden="true">→</span></a></nav>
</div>
</header>
<div class="efukuri-hero__notes" aria-label="相談に関するご案内"><p>${fees}</p><p>${privacy}</p></div>`)
 .replace(`<p class="attention">${privacy}</p>\n`,'');
 fs.writeFileSync(path.join(dest,`${slug}.html`),html);
}
let index=fs.readFileSync(path.join(source,'index.html'),'utf8');
index=index.replaceAll('セミナー更新版','ファーストビュー更新案')
 .replace(/<main><h1>[\s\S]*?<nav>/,`<main><h1>エフクリ 3相談窓口｜ファーストビュー更新案</h1><p>添付のエフクリ画面に合わせた、アイボリーと落ち着いたグリーンのファーストビューです。タイトル・注意事項は修正できるHTMLテキスト。セミナーと本文は前版のまま維持しています。</p><p class="note"><a href="../consultation-20261010-seminar/">変更前の3ページを見る</a> ／ 本番WordPressは未変更。フォームは送信できません。</p><nav>`);
fs.writeFileSync(path.join(dest,'index.html'),index);
console.log('Built 3 first-view proposals in a separate directory.');
