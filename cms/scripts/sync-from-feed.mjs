import fs from 'node:fs/promises';
import path from 'node:path';

const outputRoot = process.argv.find((arg) => arg.startsWith('--root='))?.slice(7) || '';
const root = outputRoot ? path.resolve(outputRoot) : path.resolve(import.meta.dirname, '../..');
const feedUrl = process.env.KAGOYA_CMS_FEED_URL || '';
const localFeed = process.argv.find((arg) => arg.startsWith('--file='))?.slice(7) || '';

if (!feedUrl && !localFeed) {
  console.log('KAGOYA_CMS_FEED_URL が未設定のため同期をスキップします。');
  process.exit(0);
}

const payload = localFeed
  ? JSON.parse(await fs.readFile(path.resolve(localFeed), 'utf8'))
  : await fetchJsonWithRetry(feedUrl);

validateFeed(payload);
const content = payload.content;
const generatedAt = payload.lastPublishedAt || payload.generatedAt || new Date().toISOString();

await writeJson('data/today-items.json', {
  updatedAt: generatedAt.slice(0, 10),
  items: content.today
});
await writeJson('data/news-items.json', { items: content.news.map(validateNewsItem) });
await writeJson('data/sale-items.json', { count: content.sale.length, items: content.sale });
await writeJson('data/project-items.json', { updatedAt: generatedAt, items: content.projects });
await writeJson('data/page-copy-items.json', { updatedAt: generatedAt, items: content.pageCopy.filter((item) => item.apply) });
await writeJson('data/site-settings.json', { updatedAt: generatedAt, items: content.settings.filter((item) => item.apply) });
await writeJson('data/media-items.json', { updatedAt: generatedAt, items: content.media.filter((item) => item.apply) });
await writeJson('data/cms-meta.json', {
  schemaVersion: payload.schemaVersion,
  generatedAt: payload.generatedAt,
  lastPublishedAt: payload.lastPublishedAt,
  queueIds: payload.queueIds || []
});

console.log(JSON.stringify({
  ok: true,
  counts: Object.fromEntries(Object.entries(content).map(([key, items]) => [key, items.length])),
  queueIds: payload.queueIds || []
}));

async function fetchJsonWithRetry(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { accept: 'application/json' }, redirect: 'follow' });
      if (!response.ok) throw new Error(`CMS feed HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  throw lastError;
}

function validateFeed(value) {
  if (!value || value.ok !== true || value.schemaVersion !== 1 || !value.content) throw new Error('CMS feedの基本形式が不正です');
  const required = ['today', 'news', 'sale', 'projects', 'pageCopy', 'settings', 'media'];
  required.forEach((key) => {
    if (!Array.isArray(value.content[key])) throw new Error(`CMS feedの${key}が配列ではありません`);
  });
  const duplicateCheck = (items, key) => {
    const ids = items.map((item) => String(item[key] || '')).filter(Boolean);
    if (new Set(ids).size !== ids.length) throw new Error(`${key}に重複があります`);
  };
  duplicateCheck(value.content.today, 'id');
  duplicateCheck(value.content.news, 'id');
  duplicateCheck(value.content.sale, 'id');
  duplicateCheck(value.content.projects, 'id');
}

function validateNewsItem(item) {
  const html = String(item?.contentHtml || '');
  if (/<\s*(script|iframe|object|embed|form)\b|\bon[a-z]+\s*=|javascript\s*:/i.test(html)) {
    throw new Error(`お知らせ ${item?.id || ''} の本文HTMLに公開できない要素があります`);
  }
  return item;
}

async function writeJson(relativePath, value) {
  const target = path.join(root, relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const temporary = `${target}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await fs.rename(temporary, target);
}
