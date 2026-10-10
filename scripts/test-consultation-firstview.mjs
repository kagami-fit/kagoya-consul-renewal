import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
const root=path.resolve(import.meta.dirname,'..');
const {JSDOM}=createRequire(path.join(root,'qualita-property-lp/package.json'))('jsdom');
const before='review/consultation-20261010-seminar';
const after='review/consultation-20261010-firstview';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const baseline='93ca8bb3bb5f81be58a18d71d80f6af901841ba0';
for(const dir of [before,'review/consultation-20261010']) {
 const files=execFileSync('git',['ls-tree','-r','--name-only',baseline,'--',dir],{cwd:root,encoding:'utf8'}).trim().split('\n');
 for(const file of files)assert.deepEqual(fs.readFileSync(path.join(root,file)),execFileSync('git',['show',`${baseline}:${file}`],{cwd:root,maxBuffer:15*1024*1024}),`Previous file unchanged: ${file}`);
}
for(const [slug,type,content,contact] of [['horitsu_lp','法律',3,5],['zeimu_lp','税務',3,5],['fudosan_lp','不動産',5,7]]) {
 const html=read(`${after}/${slug}.html`),old=read(`${before}/${slug}.html`);
 const doc=new JSDOM(html).window.document;
 assert.equal(doc.documentElement.lang,'ja');
 assert.equal(doc.querySelectorAll('h1').length,1);
 assert.equal(doc.querySelector('h1').textContent,`専用${type}相談窓口`);
 assert.equal(doc.querySelector('.efukuri-hero__audience').textContent,'資産形成ラウンジ エフクリご利用者様');
 assert.equal(doc.querySelector('.efukuri-hero__free').textContent,'相談無料（60分まで）');
 assert.ok(doc.querySelector('.efukuri-hero__notes').textContent.includes('※相談無料（60分まで）。正式な依頼受任後は所定の料金が発生します。'));
 assert.ok(doc.querySelector('.efukuri-hero__notes').textContent.includes('※相談内容は第三者へ漏れることはありません(SCSKには共有されません)'));
 assert.equal(doc.querySelectorAll('.attention').length,0,'No repeated confidentiality notice');
 assert.deepEqual([...doc.querySelectorAll('.efukuri-hero__actions a')].map(a=>a.getAttribute('href')),[`#section${content}`,`#section${contact}`]);
 for(const a of doc.querySelectorAll('a[href^="#"]'))assert.ok(doc.getElementById(a.getAttribute('href').slice(1)),`Anchor exists ${slug}: ${a.href}`);
 const marker='<section class="service-sec js-fade" id="section1">';
 assert.equal(html.slice(html.indexOf(marker)),old.slice(old.indexOf(marker)),'All body content, seminar and form after first-view unchanged');
 assert.equal(read(`${after}/${slug}-privacy.html`),read(`${before}/${slug}-privacy.html`));
 assert.equal(doc.querySelectorAll('script,.site-header,.site-footer').length,0);
 assert.ok([...doc.querySelectorAll('input,textarea,select,button')].every(el=>el.disabled));
 assert.ok([...doc.querySelectorAll('form')].every(el=>!el.hasAttribute('action')&&!el.hasAttribute('method')));
 for(const el of doc.querySelectorAll('[src],link[href]')) {
  const url=el.getAttribute('src')||el.getAttribute('href');
  if(!/^(https?:|data:|#)/.test(url))assert.ok(fs.existsSync(path.resolve(root,after,url.split('?')[0])),`Local resource exists ${url}`);
 }
}
for(let i=1;i<=7;i++)assert.equal(read(`${after}/style-${i}.css`),read(`${before}/style-${i}.css`));
console.log('PASS: 3 unique first-view titles; exact notices; CTA targets; old versions unchanged; seminar, body, policies and disabled forms preserved; local resources valid.');
