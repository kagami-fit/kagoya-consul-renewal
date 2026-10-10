import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const previous='review/consultation-20261010-firstview';
const current='review/consultation-20261010-firstview-colors';
const baseline='aa2507bf8a4bf641d2b5ea6f19ae8d75c56dbe3a';
for(const dir of [previous,'review/consultation-20261010-seminar','review/consultation-20261010']) {
 for(const file of execFileSync('git',['ls-tree','-r','--name-only',baseline,'--',dir],{cwd:root,encoding:'utf8'}).trim().split('\n')) {
  assert.deepEqual(fs.readFileSync(path.join(root,file)),execFileSync('git',['show',`${baseline}:${file}`],{cwd:root,maxBuffer:15*1024*1024}),`Preserved previous file: ${file}`);
 }
}
for(const slug of ['horitsu_lp','zeimu_lp','fudosan_lp']) {
 for(const suffix of ['.html','-privacy.html'])assert.deepEqual(fs.readFileSync(path.join(root,current,slug+suffix)),fs.readFileSync(path.join(root,previous,slug+suffix)),'HTML content, CTA, seminar, policies and disabled forms are unchanged');
}
for(let i=1;i<=7;i++)assert.deepEqual(fs.readFileSync(path.join(root,current,`style-${i}.css`)),fs.readFileSync(path.join(root,previous,`style-${i}.css`)));
for(const filename of fs.readdirSync(path.join(root,previous,'assets/images')))assert.deepEqual(fs.readFileSync(path.join(root,current,'assets/images',filename)),fs.readFileSync(path.join(root,previous,'assets/images',filename)));
const css=fs.readFileSync(path.join(root,current,'firstview.css'),'utf8');
for(const [kind,color] of [['law','#003475'],['tax','#067653'],['estate','#176e75']])assert.ok(css.includes(`.kagoya-legacy-lp--${kind} { --hero-green: ${color};`));
for(const property of ['--hero-background','--hero-border','--hero-note','--hero-note-text'])assert.ok(css.includes(`var(${property})`));
console.log('PASS: 3 page-specific color palettes; all previous versions preserved; HTML, images, seminars, policies, disabled forms and base CSS unchanged.');
