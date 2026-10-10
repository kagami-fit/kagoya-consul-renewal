const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync,spawnSync}=require('node:child_process');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const registry=JSON.parse(fs.readFileSync(path.join(root,'versions/registry.json'),'utf8'));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const doc=file=>new JSDOM(read(file)).window.document;
const normalize=text=>text.replace(/\s+/g,'');
for(const v of registry.versions){
 const source=execFileSync('git',['show',`${v.sourceCommit}:qualita-property-lp/index.html`],{cwd:root,encoding:'utf8'});
 const original=new JSDOM(source).window.document;
 const saved=doc(`versions/${v.id}/index.html`);
 assert.equal(normalize(saved.querySelector('main').textContent),normalize(original.querySelector('main').textContent),'保存版の本文は元コミットと同一');
 assert.ok(saved.querySelector('.preview-note').textContent.includes(v.label));
 for(const name of Object.keys(JSON.parse(read(`versions/${v.id}/snapshot.json`)).files).filter(name=>name.endsWith('.html'))){
  const htmlPath=`versions/${v.id}/${name}`,page=doc(htmlPath);
  for(const node of page.querySelectorAll('[src],[href]'))for(const attr of ['src','href']){const url=node.getAttribute(attr);if(!url||/^(?:[a-z]+:|\/\/|#)/i.test(url))continue;assert.ok(fs.existsSync(path.resolve(path.dirname(path.join(root,htmlPath)),url.split(/[?#]/)[0])),`${htmlPath}: ${url}`);}
 }
}
const before=doc('versions/20261010-before/index.html'),after=doc('versions/20261010-after/index.html');
assert.ok(before.body.textContent.includes('3億円以上の不動産をご検討の方へ'));
assert.ok(!after.body.textContent.includes('3億円以上の不動産をご検討の方へ'));
assert.ok(before.querySelector('.faq'));
assert.ok(!after.querySelector('.faq'));
assert.equal(before.querySelector('.hero-visual img').getAttribute('src'),'assets/images/residence.jpg');
assert.equal(after.querySelector('.hero-visual img').getAttribute('src'),'assets/images/building.jpg');
const repeated=spawnSync(process.execPath,['scripts/archive-version.mjs','--ref','HEAD','--id','20261010-before','--label','上書き禁止確認'],{cwd:root,encoding:'utf8'});
assert.notEqual(repeated.status,0,'保存済みIDは上書き禁止');
execFileSync(process.execPath,['scripts/verify-versions.mjs'],{cwd:root,stdio:'inherit'});
console.log('PASS: historical text matches Git, before/after differences, copied assets and local links, overwrite refused.');
