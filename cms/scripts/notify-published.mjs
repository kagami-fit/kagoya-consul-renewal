import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const callbackUrl = process.env.KAGOYA_CMS_CALLBACK_URL || '';
const token = process.env.KAGOYA_CMS_CALLBACK_TOKEN || '';
if (!callbackUrl || !token) process.exit(0);

let meta = {};
try { meta = JSON.parse(await fs.readFile(path.join(root, 'data/cms-meta.json'), 'utf8')); } catch (_) {}
const payload = {
  action: 'publish_callback',
  token,
  queueIds: Array.isArray(meta.queueIds) ? meta.queueIds : [],
  commitSha: process.env.PUBLISHED_SHA || process.env.GITHUB_SHA || '',
  runUrl: process.env.GITHUB_RUN_URL || ''
};
const response = await fetch(callbackUrl, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(payload),
  redirect: 'follow'
});
if (!response.ok) throw new Error(`CMS callback HTTP ${response.status}`);
const result = await response.json();
if (!result.ok) throw new Error(`CMS callback error: ${result.error || 'unknown'}`);
console.log(JSON.stringify({ ok: true, queueIds: payload.queueIds }));
