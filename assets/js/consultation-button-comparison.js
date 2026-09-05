/* セレクションはこの比較ページだけに適用。共通設定や保存データには書き込まない。 */
(() => {
  'use strict';
  const choices = {
    line: '01 上品な輪郭線',
    solid: '02 端正なアクセント',
    soft: '03 やわらかな丸み'
  };
  const headerButton = document.querySelector('.site-header__cta');
  const status = document.querySelector('[data-current-label]');
  const buttons = [...document.querySelectorAll('[data-choose]')];
  const isChoice = value => Object.prototype.hasOwnProperty.call(choices, value);
  if (!headerButton || !status) return;
  const select = (value, updateUrl) => {
    const variant = isChoice(value) ? value : 'line';
    headerButton.classList.add('cta-design');
    headerButton.dataset.ctaVariant = variant;
    status.textContent = choices[variant];
    document.querySelectorAll('[data-option]').forEach(card => {
      card.dataset.selected = String(card.dataset.option === variant);
    });
    buttons.forEach(button => {
      const active = button.dataset.choose === variant;
      button.setAttribute('aria-pressed', String(active));
      button.querySelector('[data-select-label]').textContent = active ? 'ヘッダーに表示中' : 'ヘッダーで見る';
    });
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant);
      window.history.replaceState(null, '', url);
    }
  };
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.choose, true)));
  window.addEventListener('popstate', () => select(new URLSearchParams(window.location.search).get('variant'), false));
  select(new URLSearchParams(window.location.search).get('variant'), false);
})();
