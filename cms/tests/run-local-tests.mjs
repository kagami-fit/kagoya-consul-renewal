import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(import.meta.dirname, '../..');
const cacheValues = new Map();
const scriptCache = {
  get: (key) => cacheValues.has(key) ? cacheValues.get(key) : null,
  put: (key, value) => cacheValues.set(key, String(value)),
  removeAll: (keys) => keys.forEach((key) => cacheValues.delete(key))
};
const context = vm.createContext({
  console,
  JSON,
  Date,
  Object,
  Array,
  String,
  Number,
  Math,
  RegExp,
  Utilities: {
    DigestAlgorithm: { SHA_256: 'sha256' },
    Charset: { UTF_8: 'utf8' },
    computeDigest: (_algorithm, value) => [...crypto.createHash('sha256').update(String(value), 'utf8').digest()],
    formatDate: (value) => new Date(value).toISOString().replace('T', ' ').slice(0, 16),
    getUuid: () => crypto.randomUUID()
  },
  CacheService: { getScriptCache: () => scriptCache }
});

for (const file of ['Config.js', 'Validation.js', 'Publisher.js']) {
  const source = await fs.readFile(path.join(projectRoot, 'cms/gas', file), 'utf8');
  vm.runInContext(source, context, { filename: file });
}

const evaluate = (source) => vm.runInContext(source, context);

const todayHeaders = ['コンテンツID', '表示', '公開状態', '種別コード', '表示ラベル', 'タイトル', '概要', '表示時期', '情報元', 'リンク先', '表示順', '公開予約日時', '版', 'メモ'];
const todayRow = ['TODAY_TEST', '表示', '確認待ち', 'NEW', '新規案件', 'テスト案件', '公開フローのテスト', '本日', 'KAGOYA', 'contact.html', 1, '', 1, ''];
context.__headers = todayHeaders;
context.__row = todayRow;
assert.equal(evaluate("getPendingOperation_('02_Today', __row).action"), 'publish');

const existingHidden = todayRow.slice();
existingHidden[2] = '非公開';
existingHidden[13] = '';
context.__existingHidden = existingHidden;
assert.equal(evaluate("getPendingOperation_('02_Today', __existingHidden)"), null, '既存の非公開行を再申請してはいけない');

const newlyHidden = existingHidden.slice();
newlyHidden[13] = '状態変更待ち：非公開';
context.__newlyHidden = newlyHidden;
assert.equal(evaluate("getPendingOperation_('02_Today', __newlyHidden).action"), 'unpublish');
const idOnly = Array(todayHeaders.length).fill('');
idOnly[0] = 'TODAY_TEST';
context.__idOnly = idOnly;
assert.deepEqual([...evaluate("validateSourceRow_('02_Today', __headers, __idOnly, {action:'unpublish',requestedState:'非公開'})")], []);
assert.equal(evaluate("isSafeUrlOrPath_('tel:0344007994')"), true, '電話番号リンクを許可する');
assert.equal(evaluate("isSafeUrlOrPath_('mailto:info@example.com')"), true, 'メールリンクを許可する');
assert.equal(evaluate("isSafeUrlOrPath_('#service-area')"), true, 'ページ内リンクを許可する');
assert.equal(evaluate("isSafeUrlOrPath_('javascript:alert(1)')"), false, '危険なスキームを拒否する');

const fingerprint = evaluate("sourceFingerprint_(__row, CMS_CONFIG.SOURCE_SHEETS['02_Today'])");
const statusOnly = todayRow.slice();
statusOnly[2] = '公開予約';
statusOnly[13] = '公開申請済み';
context.__statusOnly = statusOnly;
assert.equal(evaluate("sourceFingerprint_(__statusOnly, CMS_CONFIG.SOURCE_SHEETS['02_Today'])"), fingerprint, '状態とメモは申請指紋から除外する');
statusOnly[5] = '申請後に変更されたタイトル';
assert.notEqual(evaluate("sourceFingerprint_(__statusOnly, CMS_CONFIG.SOURCE_SHEETS['02_Today'])"), fingerprint, '本文変更は指紋で検出する');

const saleHeaders = ['コンテンツID', '公開状態', '物件名', '登録日', 'スラッグ', 'カテゴリ', 'タグ', '価格', '種別', '所在地', '交通', '建物面積／土地面積', '築年月', '間取り', 'その他', 'メイン画像', 'ギャラリーJSON', '元ページURL', '表示順', '公開予約日時', '元データ日付', '版', 'メモ'];
const soldRow = ['SALE_TEST', '成約済み', 'テスト物件', '2026-08-30', 'test-property', '販売中物件(土地建物/マンション)', '', '1,000万円', '戸建て', '東京都', '駅徒歩5分', '100㎡', '2020年', '3LDK', '', 'src/test.jpg', '["src/test.jpg"]', 'https://example.com/property', 1, '', '2026-08-30', 2, '状態変更待ち：成約済み'];
context.__saleHeaders = saleHeaders;
context.__soldRow = soldRow;
const soldRecord = evaluate("serializePublishedRecord_('04_物件', __saleHeaders, __soldRow, false)");
assert.equal(soldRecord.data.status, '成約済み');
assert.ok(soldRecord.data.categories.includes('成約物件'));
assert.ok(!soldRecord.data.categories.some((category) => category.startsWith('販売中物件')));

const meta = evaluate("queueValidationMeta_('sold','成約済み','abc123')");
context.__meta = meta;
assert.deepEqual({ ...evaluate('parseQueueValidationMeta_(__meta)') }, { action: 'sold', expectedState: '成約済み', fingerprint: 'abc123' });

const largeFeed = {
  ok: true,
  schemaVersion: 1,
  generatedAt: '2026-08-30T00:00:00+09:00',
  content: { today: [{ id: 'BIG', title: 'あ'.repeat(110000) }], news: [], sale: [], projects: [], pageCopy: [], settings: [], media: [] }
};
context.__largeFeed = largeFeed;
evaluate('cacheFeed_(__largeFeed)');
const cachedFeed = evaluate('readCachedFeed_()');
assert.equal(cachedFeed.content.today[0].title.length, 110000, '大きな配信データを分割キャッシュできる');
assert.ok([...cacheValues.keys()].some((key) => key.includes(':part:1')), '複数チャンクに分割される');
evaluate('clearFeedCache_()');
assert.equal(cacheValues.size, 0);

const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'kagoya-cms-test-'));
try {
  const fixturePath = path.join(tempRoot, 'feed.json');
  const fixture = {
    ok: true,
    schemaVersion: 1,
    generatedAt: '2026-08-30T09:00:00+09:00',
    lastPublishedAt: '2026-08-30T09:00:00+09:00',
    queueIds: ['QUEUE_TEST'],
    content: {
      today: [{ id: 'TODAY_1', order: 3, kind: 'NEW', label: '新規', title: 'テスト', summary: '概要' }],
      news: [],
      sale: [{ id: 'SALE_1', slug: 'sale-1', title: '販売中物件', status: '公開中', categories: [] }],
      projects: [],
      pageCopy: [],
      settings: [],
      media: []
    }
  };
  await fs.writeFile(fixturePath, JSON.stringify(fixture), 'utf8');
  await execFileAsync(process.execPath, [path.join(projectRoot, 'cms/scripts/sync-from-feed.mjs'), `--file=${fixturePath}`, `--root=${tempRoot}`]);
  const todayOutput = JSON.parse(await fs.readFile(path.join(tempRoot, 'data/today-items.json'), 'utf8'));
  const saleOutput = JSON.parse(await fs.readFile(path.join(tempRoot, 'data/sale-items.json'), 'utf8'));
  assert.equal(todayOutput.items[0].id, 'TODAY_1');
  assert.equal(todayOutput.items[0].order, 3);
  assert.equal(saleOutput.count, 1);
  assert.equal(saleOutput.items[0].status, '公開中');
} finally {
  await fs.rm(tempRoot, { recursive: true, force: true });
}

console.log('KAGOYA CMS local tests: PASS');
