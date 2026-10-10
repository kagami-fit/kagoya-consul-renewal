/* 確定済みGitコミットから静的な比較版を保存。既存保存版は上書きしない。 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const repo=execFileSync('git',['rev-parse','--show-toplevel'],{cwd:root,encoding:'utf8'}).trim();
const args=process.argv.slice(2);
const arg=name=>args[args.indexOf(name)+1];
assert.ok(args.includes('--ref')&&args.includes('--id')&&args.includes('--label'),'--ref、--id、--labelが必要です。');
const ref=arg('--ref'),id=arg('--id'),label=arg('--label');
assert.match(id,/^\d{8}(?:-[a-z0-9]+)+$/,'保存IDは日付＋英小文字の識別名にしてください。');
assert.ok(ref&&!ref.startsWith('-')&&label);
const commit=execFileSync('git',['rev-parse','--verify','--end-of-options',ref+'^{commit}'],{cwd:repo,encoding:'utf8'}).trim();
const versions=path.join(root,'versions'),dest=path.join(versions,id);
assert.ok(!fs.existsSync(dest),'この保存IDは既に存在します。上書きせず、新しいIDを使ってください。');
const prefix='qualita-property-lp/';
const files=execFileSync('git',['ls-tree','-r','--name-only',commit,'--',prefix],{cwd:repo,encoding:'utf8'}).trim().split('\n').map(p=>p.slice(prefix.length)).filter(p=>/^[^/]+\.html$/.test(p)||/^assets\/(?:css|js|images)\//.test(p)||/^data\/.*\.json$/.test(p));
assert.ok(files.includes('index.html'));
const show=p=>execFileSync('git',['show',`${commit}:${p}`],{cwd:repo,maxBuffer:32*1024*1024});
// 全素材を先に読み、参照コミットの欠損時に中途半端な保存版を作らない。
const entries=files.map(p=>[p,show(prefix+p)]);
entries.push(['assets/images/version-site-logo.png',show('src/logo.png')],['assets/images/version-site-favicon.png',show('src/favicon.png')]);
const e=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
for(const entry of entries){if(!entry[0].endsWith('.html'))continue;
 let html=entry[1].toString('utf8').replaceAll('../src/logo.png','assets/images/version-site-logo.png').replaceAll('../src/favicon.png','assets/images/version-site-favicon.png');
 html=html.replace(/\s*<a\b[^>]*data-version-navigation[^>]*>[\s\S]*?<\/a>/g,'');
 html=html.replace(/href="\.\.\/(?!src\/)([^"]+)"/g,'href="../../../$1"');
 html=html.replace(/href="versions\//g,'href="../');
 html=html.replace(/(<aside class="preview-note"[^>]*>[\s\S]*?<p>)/,`$1固定保存版｜${e(label)}。`);
 html=html.replace(/(<aside class="preview-note"[^>]*>[\s\S]*?)(<\/aside>)/,`$1<a href="../index.html">比較一覧を見る ↗</a><a href="../../index.html">現在の最新版を見る ↗</a>$2`);
 entry[1]=Buffer.from(html);
}
fs.mkdirSync(dest,{recursive:true});
const hashes={};
for(const [name,bytes] of entries){fs.mkdirSync(path.dirname(path.join(dest,name)),{recursive:true});fs.writeFileSync(path.join(dest,name),bytes);hashes[name]=crypto.createHash('sha256').update(bytes).digest('hex');}
const metadata={id,label,sourceCommit:commit,savedAt:new Date().toISOString(),sampleOnly:true,files:hashes};
fs.writeFileSync(path.join(dest,'snapshot.json'),JSON.stringify(metadata,null,2)+'\n');
fs.writeFileSync(path.join(dest,'ABOUT.md'),`# ${label}\n\n## 一言で言うと\n\nQUALITA紹介ページの当時の表示を比較する固定保存版です。最新版の更新で上書きしません。\n\n## 何ができるのか\n\n- 写真・文言・詳細・フォームの当時の表示を確認する。\n- 比較一覧と現在の最新版へ移動する。\n\n## 構成\n\n- index.html：当時のトップ。\n- その他のHTML・assets：当時のページ・CSS・JavaScript・画像。\n- snapshot.json：元コミットと保存ファイルの照合値。\n\n## 使い方\n\nプロジェクトのHTTPサーバーかGitHub Pagesで index.html を開きます。\n\n## 状態\n\n- 固定保存版・直接編集禁止。元コミット：${commit}。\n- 物件・価格・写真は架空のサンプル。メール送信はしません。\n- 保存時の変更は参照パスと比較用案内だけです。本文・写真・CSSは当時のものです。\n- 企業サイトへのリンクと外部配信フォントは固定保存の対象外です。\n`);
const registryPath=path.join(versions,'registry.json');
const registry=fs.existsSync(registryPath)?JSON.parse(fs.readFileSync(registryPath,'utf8')):{versions:[]};
registry.versions.push({id,label,sourceCommit:commit,savedAt:metadata.savedAt});
fs.writeFileSync(registryPath,JSON.stringify(registry,null,2)+'\n');
console.log(`Saved ${label}: versions/${id}/index.html (${files.length} files, source ${commit.slice(0,7)})`);
