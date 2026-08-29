function initializeCms() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const ss = getCmsSpreadsheet_();
    const snapshot = ensureSnapshotSheet_(ss);
    let seeded = 0;
    if (snapshot.getLastRow() < 2) seeded = seedPublishedSnapshot_(ss, snapshot);
    const properties = PropertiesService.getScriptProperties();
    if (!properties.getProperty('CALLBACK_TOKEN')) properties.setProperty('CALLBACK_TOKEN', Utilities.getUuid() + Utilities.getUuid());
    properties.setProperty('CMS_INITIALIZED_AT', toIsoDate_(new Date()));
    const triggerCreated = ensureScheduledPublisherTrigger_();
    return { ok: true, seeded: seeded, triggerCreated: triggerCreated, message: '公開データ ' + seeded + '件を準備しました。予約公開の自動確認も有効です。編集途中の内容は公開されません。' };
  } finally {
    lock.releaseLock();
  }
}

function getCmsDeploymentInfo() {
  const properties = PropertiesService.getScriptProperties();
  return {
    spreadsheetId: CMS_CONFIG.SPREADSHEET_ID,
    feedUrl: ScriptApp.getService().getUrl() || '',
    callbackUrl: ScriptApp.getService().getUrl() || '',
    callbackToken: properties.getProperty('CALLBACK_TOKEN') || '',
    initializedAt: properties.getProperty('CMS_INITIALIZED_AT') || ''
  };
}

function ensureSnapshotSheet_(ss) {
  let sheet = ss.getSheetByName(CMS_CONFIG.SNAPSHOT_SHEET);
  if (!sheet) sheet = ss.insertSheet(CMS_CONFIG.SNAPSHOT_SHEET);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, CMS_CONFIG.SNAPSHOT_HEADERS.length).setValues([CMS_CONFIG.SNAPSHOT_HEADERS]);
    sheet.setFrozenRows(1);
  }
  sheet.hideSheet();
  return sheet;
}

function seedPublishedSnapshot_(ss, snapshot) {
  const now = new Date();
  const editor = getEditorEmail_();
  const output = [];
  Object.keys(CMS_CONFIG.SOURCE_SHEETS).forEach(function (sheetName) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getLastRow() < 2) return;
    const matrix = sheet.getDataRange().getValues();
    const headers = matrix.shift();
    const config = CMS_CONFIG.SOURCE_SHEETS[sheetName];
    matrix.forEach(function (row) {
      const status = String(row[config.statusColumn]);
      if (CMS_CONFIG.PUBLIC_STATES.indexOf(status) === -1 && !(sheetName === '08_画像' && status === '使用中')) return;
      if (sheetName === '02_Today' && String(row[1]) !== '表示') return;
      const record = serializePublishedRecord_(sheetName, headers, row, true);
      output.push(snapshotRow_(record, status, now, editor));
    });
  });
  if (output.length) snapshot.getRange(2, 1, output.length, output[0].length).setValues(output);
  return output.length;
}

function requestPublish() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const ss = getCmsSpreadsheet_();
    const queue = ss.getSheetByName(CMS_CONFIG.QUEUE_SHEET);
    if (!queue) throw new Error('公開キューが見つかりません');
    const editor = getEditorEmail_();
    const errors = [];
    let queued = 0;
    let skipped = 0;
    const waitingKeys = {};
    if (queue.getLastRow() >= 2) {
      queue.getRange(2, 1, queue.getLastRow() - 1, 12).getValues().forEach(function (queueRow) {
        if (String(queueRow[7]) === '待機中') waitingKeys[String(queueRow[3]) + ':' + String(queueRow[4])] = true;
      });
    }
    Object.keys(CMS_CONFIG.SOURCE_SHEETS).forEach(function (sheetName) {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet || sheet.getLastRow() < 2) return;
      const matrix = sheet.getDataRange().getValues();
      const headers = matrix.shift();
      const config = CMS_CONFIG.SOURCE_SHEETS[sheetName];
      matrix.forEach(function (row, index) {
        const operation = getPendingOperation_(sheetName, row);
        if (!operation) return;
        const rowErrors = validateSourceRow_(sheetName, headers, row, operation);
        const id = String(row[config.idColumn] || '').trim();
        if (rowErrors.length) {
          errors.push(sheetName + ' ' + (index + 2) + '行目：' + rowErrors.join('／'));
          sheet.getRange(index + 2, config.statusColumn + 1).setValue('エラー');
          if (config.memoColumn != null) sheet.getRange(index + 2, config.memoColumn + 1).setValue(rowErrors.join('／'));
          return;
        }
        const waitingKey = sheetName + ':' + id;
        if (waitingKeys[waitingKey]) {
          skipped += 1;
          return;
        }
        const queueId = 'QUEUE_' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMddHHmmss') + '_' + Utilities.getUuid().slice(0, 8);
        const expectedState = operation.action === 'publish' && sheetName !== '08_画像' ? '公開予約' : operation.requestedState;
        const fingerprint = sourceFingerprint_(row, config);
        const queueMeta = queueValidationMeta_(operation.action, expectedState, fingerprint);
        const scheduleIndex = headers.indexOf('公開予約日時');
        const scheduledAt = scheduleIndex === -1 ? '' : row[scheduleIndex];
        queue.appendRow([queueId, new Date(), editor, sheetName, id, describeChange_(sheetName, headers, row, operation), scheduledAt || '', '待機中', queueMeta, CMS_CONFIG.PUBLIC_SITE_URL, '自動反映待ち', '']);
        if (operation.action === 'publish' && sheetName !== '08_画像') {
          sheet.getRange(index + 2, config.statusColumn + 1).setValue('公開予約');
        }
        if (config.memoColumn != null) {
          const currentMemo = String(row[config.memoColumn] || '');
          const separator = currentMemo ? '｜' : '';
          sheet.getRange(index + 2, config.memoColumn + 1).setValue(currentMemo + separator + '公開申請済み：' + queueId);
        }
        waitingKeys[waitingKey] = true;
        queued += 1;
      });
    });
    return { ok: errors.length === 0, queued: queued, skipped: skipped, errors: errors };
  } finally {
    lock.releaseLock();
  }
}

function publishQueued(options) {
  const scheduledOnly = Boolean(options && options.scheduledOnly);
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const ss = getCmsSpreadsheet_();
    const snapshot = ensureSnapshotSheet_(ss);
    const queue = ss.getSheetByName(CMS_CONFIG.QUEUE_SHEET);
    const history = ss.getSheetByName(CMS_CONFIG.HISTORY_SHEET);
    const editor = getEditorEmail_();
    const queueValues = queue.getDataRange().getValues();
    queueValues.shift();
    let published = 0;
    let scheduled = 0;
    const errors = [];
    const publishedQueueIds = [];
    queueValues.forEach(function (queueRow, queueIndex) {
      if (String(queueRow[7]) !== '待機中') return;
      const scheduledAt = queueRow[6];
      if (scheduledOnly && !scheduledAt) return;
      if (scheduledAt && new Date(scheduledAt).getTime() > Date.now()) {
        scheduled += 1;
        return;
      }
      const sheetName = String(queueRow[3]);
      const contentId = String(queueRow[4]);
      if (!CMS_CONFIG.SOURCE_SHEETS[sheetName] || !contentId || contentId === '—') return;
      const source = findSourceRow_(ss, sheetName, contentId);
      if (!source) {
        queue.getRange(queueIndex + 2, 8).setValue('エラー');
        queue.getRange(queueIndex + 2, 12).setValue('対象データが見つかりません');
        errors.push(contentId + '：対象データが見つかりません');
        return;
      }
      const config = CMS_CONFIG.SOURCE_SHEETS[sheetName];
      const queueMeta = parseQueueValidationMeta_(queueRow[8]);
      const currentState = String(source.row[config.statusColumn] || '');
      if (currentState !== queueMeta.expectedState) {
        const message = '公開申請後に状態が変わりました（申請時：' + queueMeta.expectedState + '／現在：' + currentState + '）。内容を確認して再申請してください';
        queue.getRange(queueIndex + 2, 8).setValue('エラー');
        queue.getRange(queueIndex + 2, 12).setValue(message);
        errors.push(contentId + '：' + message);
        return;
      }
      if (queueMeta.fingerprint && sourceFingerprint_(source.row, config) !== queueMeta.fingerprint) {
        const message = '公開申請後に内容が変更されました。入力確認から再申請してください';
        queue.getRange(queueIndex + 2, 8).setValue('エラー');
        queue.getRange(queueIndex + 2, 12).setValue(message);
        errors.push(contentId + '：' + message);
        return;
      }
      const operation = { action: queueMeta.action, requestedState: queueMeta.expectedState };
      const validation = validateSourceRow_(sheetName, source.headers, source.row, operation);
      if (validation.length) {
        queue.getRange(queueIndex + 2, 8).setValue('エラー');
        queue.getRange(queueIndex + 2, 12).setValue(validation.join('／'));
        errors.push(contentId + '：' + validation.join('／'));
        return;
      }
      try {
        let record = null;
        let previous = null;
        if (operation.action === 'unpublish') {
          const key = config.type + ':' + contentId;
          previous = removeSnapshot_(snapshot, key);
          record = { key: key, type: config.type, id: contentId, status: operation.requestedState, version: Number(source.row[config.versionColumn] || 1), data: {} };
        } else {
          record = serializePublishedRecord_(sheetName, source.headers, source.row, false);
          const snapshotStatus = publishedSnapshotStatus_(sheetName, operation);
          previous = upsertSnapshot_(snapshot, record, editor, snapshotStatus);
        }
        finalizeSourceRow_(source.sheet, source.rowNumber, sheetName, source.headers, source.row, operation, String(queueRow[0]));
        queue.getRange(queueIndex + 2, 8, 1, 4).setValues([['公開済み', '公開データ作成済み', CMS_CONFIG.PUBLIC_SITE_URL, 'GitHub自動反映待ち']]);
        queue.getRange(queueIndex + 2, 12).clearContent();
        appendHistory_(history, editor, sheetName, contentId, source.row, previous, record, String(queueRow[0]), operation);
        published += 1;
        publishedQueueIds.push(String(queueRow[0]));
      } catch (error) {
        queue.getRange(queueIndex + 2, 8).setValue('エラー');
        queue.getRange(queueIndex + 2, 12).setValue(String(error.message || error));
        errors.push(contentId + '：' + String(error.message || error));
      }
    });
    if (publishedQueueIds.length) {
      const properties = PropertiesService.getScriptProperties();
      let pendingQueueIds = [];
      try { pendingQueueIds = JSON.parse(properties.getProperty('LAST_PUBLISHED_QUEUE_IDS') || '[]'); } catch (_) {}
      properties.setProperty('LAST_PUBLISHED_QUEUE_IDS', JSON.stringify(Array.from(new Set(pendingQueueIds.concat(publishedQueueIds)))));
    }
    clearFeedCache_();
    return { ok: errors.length === 0, published: published, scheduled: scheduled, errors: errors, queueIds: publishedQueueIds };
  } finally {
    lock.releaseLock();
  }
}

function publishScheduledQueue() {
  return publishQueued({ scheduledOnly: true });
}

function ensureScheduledPublisherTrigger_() {
  const exists = ScriptApp.getProjectTriggers().some(function (trigger) {
    return trigger.getHandlerFunction() === 'publishScheduledQueue';
  });
  if (exists) return false;
  ScriptApp.newTrigger('publishScheduledQueue').timeBased().everyMinutes(10).create();
  return true;
}

function findSourceRow_(ss, sheetName, contentId) {
  const config = CMS_CONFIG.SOURCE_SHEETS[sheetName];
  const sheet = ss.getSheetByName(sheetName);
  if (!config || !sheet || sheet.getLastRow() < 2) return null;
  const matrix = sheet.getDataRange().getValues();
  const headers = matrix.shift();
  for (let index = 0; index < matrix.length; index += 1) {
    if (String(matrix[index][config.idColumn]) === contentId) return { sheet: sheet, headers: headers, row: matrix[index], rowNumber: index + 2 };
  }
  return null;
}

function serializePublishedRecord_(sheetName, headers, row, isSeed) {
  const value = rowObject_(headers, row);
  const config = CMS_CONFIG.SOURCE_SHEETS[sheetName];
  const id = String(row[config.idColumn]);
  const version = config.versionColumn == null ? 1 : Number(row[config.versionColumn] || 1);
  let data;
  if (sheetName === '02_Today') data = { id: id, kind: value['種別コード'], label: value['表示ラベル'], title: value['タイトル'], summary: value['概要'], when: value['表示時期'], source: value['情報元'], href: value['リンク先'], order: Number(value['表示順'] || 0) };
  if (sheetName === '03_お知らせ') data = { id: id.replace(/^NEWS_/, ''), slug: value['スラッグ'], title: value['タイトル'], date: String(value['元データ日付'] || value['公開日']).slice(0, 10), category: value['カテゴリ'], kind: value['カテゴリ'], excerpt: value['概要'], contentHtml: value['本文HTML'], sourceUrl: value['元ページURL'], featuredImage: value['画像'] };
  if (sheetName === '04_物件') {
    let gallery = [];
    try { gallery = JSON.parse(value['ギャラリーJSON'] || '[]'); } catch (_) {}
    const sourceStatus = String(row[config.statusColumn] || '');
    let categories = String(value['カテゴリ'] || '').split('／').filter(Boolean);
    if (sourceStatus === '成約済み') {
      categories = categories.filter(function (category) { return category.indexOf('販売中物件') !== 0; });
      if (categories.indexOf('成約物件') === -1) categories.unshift('成約物件');
    }
    data = { id: id.replace(/^SALE_/, ''), title: value['物件名'], date: String(value['元データ日付'] || value['登録日']).slice(0, 10), slug: value['スラッグ'], image: value['メイン画像'], gallery: gallery, categories: categories, tags: String(value['タグ'] || '').split('／').filter(Boolean), link: value['元ページURL'], order: Number(value['表示順'] || 0), status: sourceStatus === '成約済み' ? '成約済み' : '公開中', fields: { '価格': value['価格'], '種別': value['種別'], '所在地': value['所在地'], '交通': value['交通'], '建物面積／土地面積': value['建物面積／土地面積'], '築年月': value['築年月'], '間取り': value['間取り'], 'その他': value['その他'] } };
  }
  if (sheetName === '05_進行中PJ') data = { id: id, status: value['進行状態'], meta: value['事業領域・日付'], title: value['プロジェクト名'], summary: value['概要'], image: value['画像'], href: value['リンク先'], order: Number(value['表示順'] || 0) };
  if (sheetName === '06_ページ文章') data = { id: id, page: value['ページ'], section: value['セクション'], kind: value['種類'], publishedValue: isSeed ? value['現在の表示'] : (value['修正案'] || value['現在の表示']), href: value['リンク先'], order: Number(value['表示順'] || 0), apply: isSeed ? false : Boolean(value['修正案']) };
  if (sheetName === '07_共通設定') data = { id: id, name: value['項目名'], value: isSeed ? value['現在の値'] : (value['修正案'] || value['現在の値']), kind: value['種類'], target: value['使用箇所・リンク先'], apply: isSeed ? false : Boolean(value['修正案']) };
  if (sheetName === '08_画像') data = { id: id, path: value['ファイルパス'], alt: value['代替テキスト'], pages: value['使用ページ'], sourceType: value['出典区分'], sourceUrl: value['出典URL'], replacementUrl: value['差し替え画像URL'], apply: Boolean(value['差し替え画像URL']) };
  return { key: config.type + ':' + id, type: config.type, id: id, status: String(row[config.statusColumn]), version: version, data: data || value };
}

function snapshotRow_(record, status, when, editor) {
  return [record.key, record.type, record.id, status, JSON.stringify(record.data), record.version, when, editor];
}

function upsertSnapshot_(sheet, record, editor, snapshotStatus) {
  const matrix = sheet.getDataRange().getValues();
  const now = new Date();
  for (let index = 1; index < matrix.length; index += 1) {
    if (String(matrix[index][0]) !== record.key) continue;
    const previous = matrix[index][4] ? JSON.parse(matrix[index][4]) : null;
    sheet.getRange(index + 1, 1, 1, 8).setValues([snapshotRow_(record, snapshotStatus, now, editor)]);
    return previous;
  }
  sheet.appendRow(snapshotRow_(record, snapshotStatus, now, editor));
  return null;
}

function removeSnapshot_(sheet, key) {
  const matrix = sheet.getDataRange().getValues();
  for (let index = 1; index < matrix.length; index += 1) {
    if (String(matrix[index][0]) !== key) continue;
    const previous = matrix[index][4] ? JSON.parse(matrix[index][4]) : null;
    sheet.deleteRow(index + 1);
    return previous;
  }
  return null;
}

function publishedSnapshotStatus_(sheetName, operation) {
  if (operation.action === 'sold') return '成約済み';
  if (sheetName === '08_画像') return '使用中';
  return '公開中';
}

function finalizeSourceRow_(sheet, rowNumber, sheetName, headers, row, operation, queueId) {
  const config = CMS_CONFIG.SOURCE_SHEETS[sheetName];
  if (operation.action === 'publish' && sheetName === '06_ページ文章') {
    const current = headers.indexOf('現在の表示');
    const proposal = headers.indexOf('修正案');
    if (row[proposal]) {
      sheet.getRange(rowNumber, current + 1).setValue(row[proposal]);
      sheet.getRange(rowNumber, proposal + 1).clearContent();
    }
  }
  if (operation.action === 'publish' && sheetName === '07_共通設定') {
    const current = headers.indexOf('現在の値');
    const proposal = headers.indexOf('修正案');
    if (row[proposal]) {
      sheet.getRange(rowNumber, current + 1).setValue(row[proposal]);
      sheet.getRange(rowNumber, proposal + 1).clearContent();
    }
  }
  let finalStatus = sheetName === '08_画像' ? '使用中' : '公開中';
  if (operation.action === 'sold') finalStatus = '成約済み';
  if (operation.action === 'unpublish') finalStatus = operation.requestedState;
  sheet.getRange(rowNumber, config.statusColumn + 1).setValue(finalStatus);
  if (config.versionColumn != null) sheet.getRange(rowNumber, config.versionColumn + 1).setValue(Number(row[config.versionColumn] || 1) + 1);
  if (config.memoColumn != null) {
    const label = operation.action === 'sold' ? '成約反映' : (operation.action === 'unpublish' ? '公開停止' : '公開データ作成');
    sheet.getRange(rowNumber, config.memoColumn + 1).setValue(label + '：' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm') + '｜' + queueId);
  }
}

function describeChange_(sheetName, headers, row, operation) {
  const value = rowObject_(headers, row);
  if (operation && operation.action === 'sold') return value['物件名'] + ' を成約実績へ変更';
  if (operation && operation.action === 'unpublish') return (value['タイトル'] || value['物件名'] || value['プロジェクト名'] || value['ファイルパス'] || value['コンテンツID'] || value['設定ID'] || value['画像ID']) + ' を公開停止';
  if (sheetName === '06_ページ文章') return value['ページ'] + '／' + value['セクション'] + ' の文章修正';
  if (sheetName === '07_共通設定') return value['項目名'] + ' の共通設定修正';
  if (sheetName === '08_画像') return value['ファイルパス'] + ' の画像差し替え';
  return value['タイトル'] || value['物件名'] || value['プロジェクト名'] || value['コンテンツID'] || value['設定ID'] || value['画像ID'];
}

function appendHistory_(sheet, editor, sheetName, contentId, sourceRow, previous, record, queueId, operation) {
  const actionLabel = operation.action === 'sold' ? '成約へ変更' : (operation.action === 'unpublish' ? '公開停止' : '公開');
  sheet.appendRow([
    'HISTORY_' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMddHHmmss') + '_' + Utilities.getUuid().slice(0, 8),
    new Date(), editor, record.type, contentId, sheetName, '公開内容', JSON.stringify(previous || {}), JSON.stringify(record.data),
    actionLabel, '成功', '待機:' + queueId, CMS_CONFIG.PUBLIC_SITE_URL, ''
  ]);
}

function buildPublishedFeed_() {
  const cached = readCachedFeed_();
  if (cached) return cached;
  const ss = getCmsSpreadsheet_();
  const sheet = ss.getSheetByName(CMS_CONFIG.SNAPSHOT_SHEET);
  if (!sheet || sheet.getLastRow() < 2) throw new Error('公開データが未初期化です');
  const rows = sheet.getDataRange().getValues();
  rows.shift();
  const content = { today: [], news: [], sale: [], projects: [], pageCopy: [], settings: [], media: [] };
  let latest = '';
  rows.forEach(function (row) {
    if (CMS_CONFIG.SNAPSHOT_PUBLIC_STATES.indexOf(String(row[3])) === -1) return;
    const type = String(row[1]);
    if (!content[type]) return;
    try { content[type].push(JSON.parse(row[4])); } catch (_) {}
    const publishedAt = toIsoDate_(row[6]);
    if (publishedAt > latest) latest = publishedAt;
  });
  ['today', 'sale', 'projects', 'pageCopy'].forEach(function (type) {
    content[type].sort(function (a, b) { return Number(a.order || 0) - Number(b.order || 0); });
  });
  content.news.sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
  const feed = {
    ok: true,
    schemaVersion: 1,
    generatedAt: toIsoDate_(new Date()),
    lastPublishedAt: latest,
    siteUrl: CMS_CONFIG.PUBLIC_SITE_URL,
    queueIds: JSON.parse(PropertiesService.getScriptProperties().getProperty('LAST_PUBLISHED_QUEUE_IDS') || '[]'),
    content: content
  };
  cacheFeed_(feed);
  return feed;
}

function recordGitHubCallback_(body) {
  const ss = getCmsSpreadsheet_();
  const queue = ss.getSheetByName(CMS_CONFIG.QUEUE_SHEET);
  const history = ss.getSheetByName(CMS_CONFIG.HISTORY_SHEET);
  const ids = Array.isArray(body.queueIds) ? body.queueIds.map(String) : [];
  const record = String(body.commitSha || body.runUrl || 'GitHub反映済み');
  if (queue && queue.getLastRow() >= 2) {
    const values = queue.getRange(2, 1, queue.getLastRow() - 1, 12).getValues();
    values.forEach(function (row, index) {
      if (ids.indexOf(String(row[0])) !== -1) queue.getRange(index + 2, 11).setValue(record);
    });
  }
  if (history && history.getLastRow() >= 2) {
    const values = history.getRange(2, 1, history.getLastRow() - 1, 14).getValues();
    values.forEach(function (row, index) {
      const marker = String(row[11]);
      const queueId = marker.indexOf('待機:') === 0 ? marker.slice(3) : '';
      if (ids.indexOf(queueId) !== -1) history.getRange(index + 2, 12).setValue(record);
    });
  }
  if (ids.length) {
    const properties = PropertiesService.getScriptProperties();
    let pendingQueueIds = [];
    try { pendingQueueIds = JSON.parse(properties.getProperty('LAST_PUBLISHED_QUEUE_IDS') || '[]'); } catch (_) {}
    properties.setProperty('LAST_PUBLISHED_QUEUE_IDS', JSON.stringify(pendingQueueIds.filter(function (queueId) { return ids.indexOf(String(queueId)) === -1; })));
    clearFeedCache_();
  }
}

function readCachedFeed_() {
  const cache = CacheService.getScriptCache();
  const rawMeta = cache.get(CMS_CONFIG.FEED_CACHE_KEY + ':meta');
  if (!rawMeta) return null;
  try {
    const meta = JSON.parse(rawMeta);
    const parts = [];
    for (let index = 0; index < Number(meta.parts || 0); index += 1) {
      const part = cache.get(CMS_CONFIG.FEED_CACHE_KEY + ':part:' + index);
      if (part == null) return null;
      parts.push(part);
    }
    return JSON.parse(parts.join(''));
  } catch (_) {
    return null;
  }
}

function cacheFeed_(feed) {
  const cache = CacheService.getScriptCache();
  const json = JSON.stringify(feed);
  const size = CMS_CONFIG.FEED_CACHE_CHUNK_SIZE;
  const parts = [];
  for (let index = 0; index < json.length; index += size) parts.push(json.slice(index, index + size));
  parts.forEach(function (part, index) {
    cache.put(CMS_CONFIG.FEED_CACHE_KEY + ':part:' + index, part, CMS_CONFIG.FEED_CACHE_SECONDS);
  });
  cache.put(CMS_CONFIG.FEED_CACHE_KEY + ':meta', JSON.stringify({ parts: parts.length }), CMS_CONFIG.FEED_CACHE_SECONDS);
}

function clearFeedCache_() {
  const cache = CacheService.getScriptCache();
  const rawMeta = cache.get(CMS_CONFIG.FEED_CACHE_KEY + ':meta');
  let count = 0;
  try { count = Number(JSON.parse(rawMeta || '{}').parts || 0); } catch (_) {}
  const keys = [CMS_CONFIG.FEED_CACHE_KEY, CMS_CONFIG.FEED_CACHE_KEY + ':meta'];
  for (let index = 0; index < count; index += 1) keys.push(CMS_CONFIG.FEED_CACHE_KEY + ':part:' + index);
  cache.removeAll(keys);
}
