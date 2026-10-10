import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const registry=JSON.parse(fs.readFileSync(path.join(root,'versions/registry.json'),'utf8'));
assert.equal(new Set(registry.versions.map(v=>v.id)).size,registry.versions.length);
let count=0;
for(const version of registry.versions){
 const dest=path.join(root,'versions',version.id),metadata=JSON.parse(fs.readFileSync(path.join(dest,'snapshot.json'),'utf8'));
 assert.equal(metadata.sourceCommit,version.sourceCommit);
 for(const [name,hash] of Object.entries(metadata.files)){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dest,name))).digest('hex'),hash,`${version.id}/${name}: 固定保存版が変更されています。`);count++;}
}
console.log(`PASS: ${registry.versions.length} immutable versions, ${count} files match saved hashes.`);
