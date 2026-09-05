/* この比較ページ内だけで表示を変更。採用デザインやCMSには書き込まない。 */
(() => {
  'use strict';
  const variants = {
  "1": {
    "name": "01 写真背景と白いパネル",
    "description": "元サイトの写真背景と3つの窓口を継承。白いパネルに情報をまとめ、安心感を伝えます。"
  },
  "2": {
    "name": "02 写真と窓口の左右分割",
    "description": "相談風景を大きく見せ、右側に窓口を整理。現在のサイトの写真と余白に馴染むデザインです。"
  },
  "3": {
    "name": "03 3つの窓口カード",
    "description": "電話・フォーム・LINEを独立したカードに。窓口を見比べながら、自分に合う方法を選べます。"
  },
  "4": {
    "name": "04 コンパクトなグレー帯",
    "description": "写真を使わず、連絡先を横一列に集約。ページの余韻を保ちながら、相談への入口をつくります。"
  },
  "5": {
    "name": "05 フォーム中心の相談窓口",
    "description": "フォームへの導線を主役に、電話とLINEを右側へ。どこから相談するか迷いにくい構成です。"
  }
};
  const choices = [...document.querySelectorAll('[data-contact-choice]')];
  const previews = [...document.querySelectorAll('[data-contact-preview]')];
  const label = document.querySelector('[data-contact-current]');
  const description = document.querySelector('[data-contact-description]');
  if (!label || !description || !choices.length) return;

  function select(value, updateUrl = false) {
    const id = Object.prototype.hasOwnProperty.call(variants, value) ? value : '1';
    previews.forEach(preview => { preview.hidden = preview.dataset.contactPreview !== id; });
    choices.forEach(choice => { choice.setAttribute('aria-pressed', String(choice.dataset.contactChoice === id)); });
    label.textContent = variants[id].name;
    description.textContent = variants[id].description;
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('design', id);
      window.history.replaceState(null, '', url);
    }
  }

  choices.forEach(choice => choice.addEventListener('click', () => select(choice.dataset.contactChoice, true)));
  window.addEventListener('popstate', () => select(new URLSearchParams(window.location.search).get('design')));
  select(new URLSearchParams(window.location.search).get('design'));
})();

