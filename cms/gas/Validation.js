function validatePendingChanges() {
  const ss = getCmsSpreadsheet_();
  const errors = [];
  let count = 0;
  Object.keys(CMS_CONFIG.SOURCE_SHEETS).forEach(function (sheetName) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getLastRow() < 2) return;
    const values = sheet.getDataRange().getValues();
    const headers = values.shift();
    values.forEach(function (row, index) {
      const operation = getPendingOperation_(sheetName, row);
      if (!operation) return;
      count += 1;
      validateSourceRow_(sheetName, headers, row, operation).forEach(function (message) {
        errors.push(sheetName + ' ' + (index + 2) + '行目：' + message);
      });
    });
  });
  return { ok: errors.length === 0, count: count, errors: errors };
}

function validateSourceRow_(sheetName, headers, row, operation) {
  const value = rowObject_(headers, row);
  const errors = [];
  const action = operation && operation.action ? operation.action : 'publish';
  const idName = sheetName === '07_共通設定' ? '設定ID' : (sheetName === '08_画像' ? '画像ID' : 'コンテンツID');
  if (action === 'unpublish') {
    if (!String(value[idName] || '').trim()) errors.push('「' + idName + '」が未入力です');
    return errors;
  }
  const required = {
    '02_Today': ['コンテンツID', '表示ラベル', 'タイトル', '概要'],
    '03_お知らせ': ['コンテンツID', 'タイトル', '公開日', 'カテゴリ', 'スラッグ'],
    '04_物件': ['コンテンツID', '物件名', 'スラッグ', 'メイン画像'],
    '05_進行中PJ': ['コンテンツID', 'プロジェクト名', '概要', '画像'],
    '06_ページ文章': ['コンテンツID', 'ページ', '修正案'],
    '07_共通設定': ['設定ID', '修正案'],
    '08_画像': ['画像ID', '差し替え画像URL']
  }[sheetName] || [];
  required.forEach(function (name) {
    if (!String(value[name] || '').trim()) errors.push('「' + name + '」が未入力です');
  });
  const scheduledAt = value['公開予約日時'];
  if (scheduledAt && isNaN(new Date(scheduledAt).getTime())) errors.push('「公開予約日時」の形式を確認してください');
  ['リンク先', '公開URL', '元ページURL', '出典URL', '差し替え画像URL'].forEach(function (name) {
    const input = String(value[name] || '').trim();
    if (input && !isSafeUrlOrPath_(input)) errors.push('「' + name + '」のURL形式を確認してください');
  });
  if (sheetName === '02_Today' && String(value['表示']) === '非表示') errors.push('非表示の項目は公開申請できません');
  if (sheetName === '04_物件') {
    const gallery = String(value['ギャラリーJSON'] || '').trim();
    if (gallery) {
      try { if (!Array.isArray(JSON.parse(gallery))) errors.push('ギャラリーJSONは画像URLの配列にしてください'); }
      catch (_) { errors.push('ギャラリーJSONの形式が正しくありません'); }
    }
  }
  if (sheetName === '03_お知らせ') {
    const html = String(value['本文HTML'] || '');
    if (/<\s*(script|iframe|object|embed|form)\b|\bon[a-z]+\s*=|javascript\s*:/i.test(html)) {
      errors.push('本文HTMLに公開できないタグまたは属性があります');
    }
  }
  const textLimits = {
    'タイトル': 180,
    '物件名': 180,
    'プロジェクト名': 180,
    '概要': 600,
    '修正案': 3000
  };
  Object.keys(textLimits).forEach(function (name) {
    if (String(value[name] || '').length > textLimits[name]) errors.push('「' + name + '」が長すぎます（上限' + textLimits[name] + '文字）');
  });
  return errors;
}

function isSafeUrlOrPath_(value) {
  if (/^(https?:\/\/|\.\.\/|\.\/|[A-Za-z0-9_./-]+\.html(?:[?#].*)?|[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|webp|gif|svg)(?:[?#].*)?)$/i.test(value)) return true;
  return false;
}
