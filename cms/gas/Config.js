const CMS_CONFIG = Object.freeze({
  SPREADSHEET_ID: '1Eb4K2hOqYRmUnRcjzKGP9KBoNTpke3Hvhd2Zk0zsVek',
  PUBLIC_SITE_URL: 'https://kagami-fit.github.io/kagoya-consul-renewal/',
  SNAPSHOT_SHEET: '98_公開データ',
  QUEUE_SHEET: '90_公開キュー',
  HISTORY_SHEET: '99_更新履歴',
  FEED_CACHE_KEY: 'kagoya-published-feed-v1',
  FEED_CACHE_SECONDS: 300,
  FEED_CACHE_CHUNK_SIZE: 24000,
  SNAPSHOT_HEADERS: ['キー', 'データ種別', 'コンテンツID', '公開状態', 'JSON', '版', '公開日時', '公開者'],
  PUBLIC_STATES: ['公開中', '成約済み'],
  SNAPSHOT_PUBLIC_STATES: ['公開中', '成約済み', '使用中'],
  SOURCE_SHEETS: {
    '02_Today': { type: 'today', idColumn: 0, statusColumn: 2, versionColumn: 12, memoColumn: 13, specialStates: ['非公開'] },
    '03_お知らせ': { type: 'news', idColumn: 0, statusColumn: 1, versionColumn: 12, memoColumn: 13, specialStates: ['非公開'] },
    '04_物件': { type: 'sale', idColumn: 0, statusColumn: 1, versionColumn: 21, memoColumn: 22, specialStates: ['成約済み', '非公開'] },
    '05_進行中PJ': { type: 'projects', idColumn: 0, statusColumn: 1, versionColumn: 10, memoColumn: 11, specialStates: ['非公開'] },
    '06_ページ文章': { type: 'pageCopy', idColumn: 0, statusColumn: 1, versionColumn: 12, memoColumn: 13, specialStates: ['非公開'] },
    '07_共通設定': { type: 'settings', idColumn: 0, statusColumn: 5, versionColumn: 8, memoColumn: 9, specialStates: ['非公開'] },
    '08_画像': { type: 'media', idColumn: 0, statusColumn: 1, versionColumn: null, memoColumn: 9, pendingStates: ['確認待ち', '差し替え待ち'], specialStates: ['非使用'] }
  }
});

function getCmsSpreadsheet_() {
  return SpreadsheetApp.openById(CMS_CONFIG.SPREADSHEET_ID);
}

function getEditorEmail_() {
  return Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail() || '担当者';
}

function toIsoDate_(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) {
    return Utilities.formatDate(value, 'Asia/Tokyo', "yyyy-MM-dd'T'HH:mm:ssXXX");
  }
  return String(value);
}

function normalizeCellValue_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') return toIsoDate_(value);
  return value == null ? '' : value;
}

function rowObject_(headers, row) {
  return headers.reduce(function (object, header, index) {
    object[String(header)] = normalizeCellValue_(row[index]);
    return object;
  }, {});
}

function isSpecialState_(config, status) {
  return (config.specialStates || []).indexOf(String(status || '')) !== -1;
}

function stateChangeMarker_(status) {
  return '状態変更待ち：' + String(status || '');
}

function hasStateChangeMarker_(row, config, status) {
  if (config.memoColumn == null) return false;
  return String(row[config.memoColumn] || '').indexOf(stateChangeMarker_(status)) === 0;
}

function getPendingOperation_(sheetName, row) {
  const config = CMS_CONFIG.SOURCE_SHEETS[sheetName];
  if (!config) return null;
  const status = String(row[config.statusColumn] || '');
  const pendingStates = config.pendingStates || ['確認待ち'];
  if (pendingStates.indexOf(status) !== -1) return { action: 'publish', requestedState: status };
  if (isSpecialState_(config, status) && hasStateChangeMarker_(row, config, status)) {
    return { action: status === '成約済み' ? 'sold' : 'unpublish', requestedState: status };
  }
  return null;
}

function sourceFingerprint_(row, config) {
  const values = row.map(function (value, index) {
    if (index === config.statusColumn || index === config.versionColumn || index === config.memoColumn) return '';
    return normalizeCellValue_(value);
  });
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(values), Utilities.Charset.UTF_8);
  return digest.map(function (byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); }).join('');
}

function queueValidationMeta_(operation, expectedState, fingerprint) {
  return '入力チェック済み｜操作=' + operation + '｜状態=' + expectedState + '｜指紋=' + fingerprint;
}

function parseQueueValidationMeta_(value) {
  const text = String(value || '');
  const action = (text.match(/操作=([^｜]+)/) || [])[1] || 'publish';
  const expectedState = (text.match(/状態=([^｜]+)/) || [])[1] || '公開予約';
  const fingerprint = (text.match(/指紋=([0-9a-f]+)/) || [])[1] || '';
  return { action: action, expectedState: expectedState, fingerprint: fingerprint };
}
