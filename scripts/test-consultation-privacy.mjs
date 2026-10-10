// 共有確認用の3ポリシーだけを検査する。外部への送信・WordPressの操作は行わない。
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

const root=path.resolve(import.meta.dirname,'..');
const folder='review/consultation-20261010';
const baseline=process.argv.find(arg=>arg.startsWith('--baseline='))?.slice('--baseline='.length);
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const before=relative=>execFileSync('git',['show',`${baseline}:${relative}`],{cwd:root,encoding:'utf8'});
const main=html=>{
 const matches=[...html.matchAll(/<main\b[\s\S]*?<\/main>/g)];
 assert.equal(matches.length,1,'Exactly one main article is required.');
 return matches[0][0];
};

for(const slug of ['horitsu_lp','zeimu_lp','fudosan_lp']){
 const policyFile=`${folder}/${slug}-privacy.html`;
 const html=read(policyFile);
 assert.ok(!/<(?:header|footer)\b[^>]*class="[^"]*\bsite-(?:header|footer)\b/.test(html),`${slug}: no shared header/footer`);
 assert.ok(!/<(?:aside|div)\b[^>]*(?:id="mobile-menu"|class="drawer(?:-shade)?")/.test(html),`${slug}: no shared mobile menu`);
 assert.ok(html.includes('id="kagoya-consultation-privacy-layout"'),`${slug}: standalone layout`);
 assert.ok(html.includes('body.kagoya-legacy-lp-policy-page{padding-bottom:0;}'),`${slug}: no mobile contact-bar space`);
 assert.ok(html.includes('name="robots" content="noindex,nofollow"'),`${slug}: keep review robots policy`);
 assert.ok(main(html).includes(`href="${slug}.html">相談窓口に戻る →</a>`),`${slug}: return to matching consultation`);
 assert.ok(!/<(?:script|form|iframe)\b/.test(html),`${slug}: static policy only`);
 const consultationFile=`${folder}/${slug}.html`;
 const consultation=read(consultationFile);
 assert.ok(consultation.includes(`href="${slug}-privacy.html"`),`${slug}: matching policy link`);
 const controls=consultation.match(/<(?:input|textarea|select|button)\b[^>]*>/g)||[];
 assert.ok(controls.length>0,`${slug}: preview form remains present`);
 assert.ok(controls.every(control=>/\bdisabled(?:\s|=|>)/.test(control)),`${slug}: no enabled submission controls`);
 if(baseline){
  assert.equal(main(html),main(before(policyFile)),`${slug}: policy article, title and return link unchanged`);
  assert.equal(consultation,before(consultationFile),`${slug}: consultation page unchanged`);
 }
}

const corporate=read('privacy.html');
assert.ok(/<header\b[^>]*class="site-header"/.test(corporate),'Corporate policy keeps its header.');
assert.ok(/<footer\b[^>]*class="site-footer"/.test(corporate),'Corporate policy keeps its footer.');
if(baseline)assert.equal(corporate,before('privacy.html'),'Corporate policy is unchanged.');
console.log('PASS: 3 standalone policies; original articles and back links intact; forms disabled; corporate header/footer retained'+(baseline?'; exact baseline comparison passed.':'.'));
