function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('KAGOYAサイト更新')
    .addItem('① 入力内容を確認する', 'validatePendingFromMenu')
    .addItem('② 確認待ちを公開申請する', 'requestPublishFromMenu')
    .addSeparator()
    .addItem('③ 公開予約をサイトへ反映する', 'publishQueuedFromMenu')
    .addSeparator()
    .addItem('初期設定・公開データを作る', 'initializeCmsFromMenu')
    .addItem('安全テストを実行する', 'runCmsSelfTestFromMenu')
    .addToUi();
}

function initializeCmsFromMenu() {
  const result = initializeCms();
  SpreadsheetApp.getUi().alert('初期設定', result.message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function validatePendingFromMenu() {
  const result = validatePendingChanges();
  const message = result.errors.length
    ? '修正が必要な項目があります。\n\n' + result.errors.slice(0, 12).join('\n')
    : '確認待ち ' + result.count + '件の入力内容に問題はありません。';
  SpreadsheetApp.getUi().alert('入力チェック', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function requestPublishFromMenu() {
  const result = requestPublish();
  const skipped = result.skipped ? '／申請済みのためスキップ ' + result.skipped + '件' : '';
  const message = result.errors.length
    ? '申請 ' + result.queued + '件' + skipped + '。修正が必要 ' + result.errors.length + '件。\n\n' + result.errors.slice(0, 10).join('\n')
    : result.queued + '件を公開予約にしました' + skipped + '。内容を確認してから「公開予約をサイトへ反映する」を実行してください。';
  SpreadsheetApp.getUi().alert('公開申請', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function publishQueuedFromMenu() {
  const ui = SpreadsheetApp.getUi();
  const answer = ui.alert('公開確認', '公開予約中の内容をサイト用データへ反映します。よろしいですか？', ui.ButtonSet.YES_NO);
  if (answer !== ui.Button.YES) return;
  const result = publishQueued();
  const details = result.errors.length ? '\n\n' + result.errors.slice(0, 8).join('\n') : '';
  const scheduled = result.scheduled ? '／予約時刻待ち ' + result.scheduled + '件' : '';
  ui.alert('公開処理', '公開済み ' + result.published + '件／エラー ' + result.errors.length + '件' + scheduled + '\nサイトへの反映は通常10分以内です。' + details, ui.ButtonSet.OK);
}

function runCmsSelfTestFromMenu() {
  const result = runCmsSelfTest();
  SpreadsheetApp.getUi().alert('安全テスト', result.ok ? 'すべてのテストに合格しました。' : result.details.join('\n'), SpreadsheetApp.getUi().ButtonSet.OK);
}

function doGet(e) {
  try {
    const action = e && e.parameter && e.parameter.action ? String(e.parameter.action) : 'feed';
    if (action !== 'feed' && action !== 'health') return jsonOutput_({ ok: false, error: 'unsupported_action' });
    if (action === 'health') return jsonOutput_({ ok: true, service: 'KAGOYA CMS', time: toIsoDate_(new Date()) });
    return jsonOutput_(buildPublishedFeed_());
  } catch (error) {
    return jsonOutput_({ ok: false, error: String(error && error.message || error) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e && e.postData && e.postData.contents || '{}');
    if (body.action !== 'publish_callback') return jsonOutput_({ ok: false, error: 'unsupported_action' });
    const expected = PropertiesService.getScriptProperties().getProperty('CALLBACK_TOKEN');
    if (!expected || body.token !== expected) return jsonOutput_({ ok: false, error: 'unauthorized' });
    recordGitHubCallback_(body);
    return jsonOutput_({ ok: true });
  } catch (error) {
    return jsonOutput_({ ok: false, error: String(error && error.message || error) });
  }
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function onEdit(e) {
  if (!e || !e.range || e.range.getRow() < 2) return;
  const sheet = e.range.getSheet();
  const config = CMS_CONFIG.SOURCE_SHEETS[sheet.getName()];
  if (!config) return;
  const editedColumn = e.range.getColumn() - 1;
  if ([config.idColumn, config.versionColumn, config.memoColumn].indexOf(editedColumn) !== -1) return;
  const id = sheet.getRange(e.range.getRow(), config.idColumn + 1).getDisplayValue().trim();
  if (!id) return;
  const statusCell = sheet.getRange(e.range.getRow(), config.statusColumn + 1);
  const status = statusCell.getDisplayValue().trim();
  const memoCell = config.memoColumn == null ? null : sheet.getRange(e.range.getRow(), config.memoColumn + 1);

  if (editedColumn === config.statusColumn) {
    if (isSpecialState_(config, status) && String(e.oldValue || '') !== status) {
      if (memoCell) memoCell.setValue(stateChangeMarker_(status));
      SpreadsheetApp.getActive().toast('「' + status + '」への変更を記録しました。①入力確認→②公開申請→③サイト反映の順で進めてください。', 'KAGOYAサイト更新', 8);
    } else if (memoCell && !isSpecialState_(config, status)) {
      const memo = memoCell.getDisplayValue();
      if (memo.indexOf('状態変更待ち：') === 0) memoCell.clearContent();
    }
    return;
  }

  const publishedOrQueued = ['公開中', '成約済み', '公開予約', '確認待ち', '使用中', '差し替え待ち', '非公開', '非使用'];
  if (publishedOrQueued.indexOf(status) !== -1) {
    const nextStatus = sheet.getName() === '08_画像' ? '差し替え待ち' : '下書き';
    statusCell.setValue(nextStatus);
    if (memoCell) memoCell.setValue('内容変更：' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm'));
    const nextStep = sheet.getName() === '08_画像'
      ? '内容を変更したため「差し替え待ち」にしました。①入力確認から進めてください。'
      : '内容を変更したため「下書き」に戻しました。確認後に「確認待ち」を選んでください。';
    SpreadsheetApp.getActive().toast(nextStep, 'KAGOYAサイト更新', 7);
  }
}
