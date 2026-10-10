// 共有確認用ページのみを検査する。WordPress操作やフォーム送信は行わない。
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root=path.resolve(import.meta.dirname,'..');
const folder='review/consultation-20261010-seminar';
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const bytes=relative=>fs.readFileSync(path.join(root,relative));
const metadata=JSON.parse(read(`${folder}/seminar.json`));
const previous=metadata.previousDirectory;
const baseline=metadata.previousSourceCommit;
const gitBytes=relative=>execFileSync('git',['show',`${baseline}:${relative}`],{cwd:root,maxBuffer:10*1024*1024});
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
const matches=(html,regex)=>[...html.matchAll(regex)];
const excerpt=html=>{
 const found=matches(html,/<div class="seminar-container">([\s\S]*?)<\/section>/g);
 assert.equal(found.length,1,'Each page must contain exactly one seminar.');
 return found[0][1];
};
const normalizeSeminar=html=>html
 .replace(/(<div class="seminar-image">\s*)<img\b[^>]*>/,'$1__SEMINAR_IMAGE__')
 .replace(/(<div class="seminar-info">\s*)<h3\b[^>]*>[\s\S]*?<\/h3>\s*<p\b[^>]*>[\s\S]*?<\/p>\s*<p\b[^>]*>[\s\S]*?<\/p>/,'$1__SEMINAR_INFORMATION__')
 .trimEnd(); // パッチ適用時の末尾改行だけは本文変更として扱わない。

assert.equal(metadata.title,'分けられない、売れない、決められない');
assert.equal(metadata.subtitle,'親が認知症になる前に考える不動産相続');
assert.equal(metadata.specialists,'(弁護士・税理士)');
assert.equal(metadata.dateLabel,'2026年11月6日(金)');
assert.equal(metadata.timeLabel,'12:05～12:55(Teams開催)');
assert.equal(new Date(`${metadata.date}T00:00:00Z`).getUTCDay(),5,'November 6, 2026 is Friday.');
assert.equal(metadata.formSubmission,false);
assert.equal(metadata.wordpressUpdated,false);
assert.equal(metadata.pages.length,3);

// 旧URLの全ファイルを、作業開始時のコミットとバイト単位で照合する。
const oldFiles=execFileSync('git',['ls-tree','-r','--name-only',baseline,'--',previous],{cwd:root,encoding:'utf8'}).trim().split('\n');
assert.ok(oldFiles.length>=15,'The preserved folder contains the complete previous version.');
for(const file of oldFiles)assert.deepEqual(bytes(file),gitBytes(file),`${file}: previous URL must remain unchanged`);

const hashes=new Set();
const dimensions=[];
const originalRatios={horitsu_lp:886/427,zeimu_lp:886/441,fudosan_lp:625/503};
for(const page of metadata.pages){
 const file=`${folder}/${page.slug}.html`;
 const html=read(file);
 const old=read(`${previous}/${page.slug}.html`);
 const seminar=excerpt(html);
 assert.ok(html.includes(`id="${page.section}"`),`${page.slug}: seminar anchor`);
 assert.ok(seminar.includes(`<h3>${metadata.title}<br>${metadata.subtitle}<br>${metadata.specialists}</h3>`),`${page.slug}: exact theme and specialist text`);
 assert.ok(seminar.includes(`<p>日時：${metadata.dateLabel}</p>`),`${page.slug}: date and weekday`);
 assert.ok(seminar.includes(`<p>${metadata.timeLabel}</p>`),`${page.slug}: time and Teams`);
 assert.ok(seminar.includes(`src="${page.thumbnail}"`),`${page.slug}: new local thumbnail`);
 assert.ok(seminar.includes(`alt="${metadata.title}。${metadata.subtitle}${metadata.specialists}。${metadata.dateLabel} ${metadata.timeLabel}"`),`${page.slug}: accessible thumbnail text`);
 assert.equal(normalizeSeminar(html),normalizeSeminar(old),`${page.slug}: all other content and layout must be unchanged`);
 assert.ok(!/<(?:header|footer)\b[^>]*class="[^"]*\bsite-(?:header|footer)\b/.test(html),`${page.slug}: no shared header/footer`);
 assert.ok(!/<script\b/.test(html),`${page.slug}: review remains static`);
 assert.ok(!/https?:\/\/(?:localhost|127\.0\.0\.1)/.test(html),`${page.slug}: no local-only URLs`);
 const controls=html.match(/<(?:input|textarea|select|button)\b[^>]*>/g)||[];
 assert.ok(controls.length>0,`${page.slug}: review form remains present`);
 assert.ok(controls.every(control=>/\bdisabled(?:\s|=|>)/.test(control)),`${page.slug}: form submission remains disabled`);
 assert.ok(!/<form\b[^>]*\b(?:action|method)=/.test(html),`${page.slug}: no form endpoint`);
 assert.ok(!/<input\b[^>]*type="hidden"/.test(html),`${page.slug}: no submission tokens`);

 const policy=`${folder}/${page.slug}-privacy.html`;
 assert.deepEqual(bytes(policy),bytes(`${previous}/${page.slug}-privacy.html`),`${page.slug}: standalone policy is unchanged`);
 assert.ok(html.includes(`href="${page.slug}-privacy.html"`),`${page.slug}: matching policy link`);
 assert.ok(read(policy).includes(`href="${page.slug}.html">相談窓口に戻る →</a>`),`${page.slug}: policy returns to new page`);

 const png=bytes(`${folder}/${page.thumbnail}`);
 assert.deepEqual(png.subarray(0,8),Buffer.from([137,80,78,71,13,10,26,10]),`${page.slug}: valid PNG header`);
 const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
 assert.ok(width>=625 && height>=427,`${page.slug}: sufficient thumbnail resolution`);
 assert.ok(Math.abs((width/height)/originalRatios[page.slug]-1)<0.04,`${page.slug}: original image proportions retained`);
 hashes.add(hash(png));
 dimensions.push(`${page.label}: ${width}×${height}`);
}
assert.equal(hashes.size,3,'Each consultation uses its own edited original design.');
for(let i=1;i<=7;i++)assert.deepEqual(bytes(`${folder}/style-${i}.css`),bytes(`${previous}/style-${i}.css`),`style-${i}: original style preserved`);
const corporate=read('privacy.html');
const corporateBefore=gitBytes('privacy.html').toString('utf8');
assert.equal(corporate.match(/<main\b[\s\S]*?<\/main>/)?.[0],corporateBefore.match(/<main\b[\s\S]*?<\/main>/)?.[0],'Corporate policy article outside these three pages is unchanged.');
assert.ok(/<header\b[^>]*class="site-header"/.test(corporate),'Corporate policy retains its header.');
assert.ok(/<footer\b[^>]*class="site-footer"/.test(corporate),'Corporate policy retains its footer.');
// 手元には他作業の更新があり得るため、公開用チェックでだけファイル全体も照合する。
if(process.argv.includes('--release'))assert.deepEqual(bytes('privacy.html'),gitBytes('privacy.html'),'Release must not include unrelated corporate policy changes.');
const index=read(`${folder}/index.html`);
assert.ok(index.includes('href="../consultation-20261010/"'),'Comparison index links to the preserved previous version.');
assert.ok(index.includes('noindex,nofollow'),'Review indexing policy remains in place.');
for(const page of metadata.pages)assert.ok(index.includes(`src="${page.slug}.html"`),`${page.slug}: comparison iframe uses updated page`);
console.log(`PASS: 3 updated seminars; exact theme/date/time; separate PNGs (${dimensions.join(', ')}); old ${oldFiles.length} files unchanged; all other LP content, CSS and policies intact; disabled forms.`);
