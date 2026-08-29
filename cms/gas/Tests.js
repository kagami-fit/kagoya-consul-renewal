function runCmsSelfTest() {
  const details = [];
  const ss = getCmsSpreadsheet_();
  const today = ss.getSheetByName('02_Today');
  const snapshot = ensureSnapshotSheet_(ss);
  const testId = 'TEST_' + Utilities.getUuid().slice(0, 8);
  const row = [testId, '表示', '確認待ち', 'NEW', 'テスト', '公開されない安全テスト', '検証後に自動削除します。', '本日', 'システムテスト', 'contact.html', 9999, new Date(), 1, '一時データ'];
  let insertedRow = null;
  try {
    today.appendRow(row);
    insertedRow = today.getLastRow();
    const headers = today.getRange(1, 1, 1, today.getLastColumn()).getValues()[0];
    const errors = validateSourceRow_('02_Today', headers, row);
    if (errors.length) details.push('正常データの検証に失敗：' + errors.join('／'));
    const invalid = row.slice();
    invalid[5] = '';
    if (!validateSourceRow_('02_Today', headers, invalid).length) details.push('必須項目エラーを検出できませんでした');
    const statusChange = row.slice();
    statusChange[2] = '非公開';
    statusChange[13] = stateChangeMarker_('非公開');
    const operation = getPendingOperation_('02_Today', statusChange);
    if (!operation || operation.action !== 'unpublish') details.push('非公開の状態変更を公開申請対象として検出できませんでした');
    statusChange[13] = '';
    if (getPendingOperation_('02_Today', statusChange)) details.push('既存の非公開データを誤って再申請対象にしています');
    const unpublishRow = statusChange.map(function (_, index) { return index === 0 ? testId : ''; });
    const unpublishErrors = validateSourceRow_('02_Today', headers, unpublishRow, { action: 'unpublish', requestedState: '非公開' });
    if (unpublishErrors.length) details.push('公開停止に不要な入力項目を要求しています：' + unpublishErrors.join('／'));
    if (!isSafeUrlOrPath_('tel:0344007994')) details.push('電話番号リンクを安全なリンクとして認識できません');
    if (!isSafeUrlOrPath_('mailto:info@example.com')) details.push('メールリンクを安全なリンクとして認識できません');
    if (!isSafeUrlOrPath_('#service-area')) details.push('ページ内リンクを安全なリンクとして認識できません');
    if (isSafeUrlOrPath_('javascript:alert(1)')) details.push('危険なリンク形式を許可しています');
    if (!isSafeHttpsUrl_('https://example.com/image.jpg')) details.push('HTTPSの差し替え画像を許可できません');
    if (isSafeHttpsUrl_('http://example.com/image.jpg')) details.push('差し替え画像でHTTPを許可しています');
    if (!isSafeImageUrlOrPath_('src/property/example.webp')) details.push('サイト内画像パスを認識できません');
    if (isSafeImageUrlOrPath_('tel:0344007994')) details.push('画像欄で電話リンクを許可しています');
    const config = CMS_CONFIG.SOURCE_SHEETS['02_Today'];
    const firstFingerprint = sourceFingerprint_(row, config);
    const statusOnly = row.slice();
    statusOnly[2] = '公開予約';
    statusOnly[13] = '公開申請済み';
    if (sourceFingerprint_(statusOnly, config) !== firstFingerprint) details.push('状態・メモの変更だけで申請指紋が変化しました');
    statusOnly[5] = '内容を変更';
    if (sourceFingerprint_(statusOnly, config) === firstFingerprint) details.push('申請後の本文変更を指紋で検出できませんでした');
    const snapshotValues = snapshot.getLastRow() < 2 ? [] : snapshot.getRange(2, 1, snapshot.getLastRow() - 1, 1).getDisplayValues().flat();
    if (snapshotValues.some(function (key) { return String(key).indexOf(testId) !== -1; })) details.push('下書きデータが公開スナップショットへ混入しました');
  } finally {
    if (insertedRow) today.deleteRow(insertedRow);
  }
  return { ok: details.length === 0, details: details };
}
