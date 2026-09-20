/* Static HTML has no mail server. The WordPress theme replaces this form with CF7. */
(() => {
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  const status = document.getElementById('inquiry-form-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.textContent = '送信できませんでした。このページは送信サーバーに接続されていません。WordPress版のお問い合わせページ、または電話・LINEをご利用ください。入力内容は送信されていません。';
  });
})();
