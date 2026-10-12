/* GitHub Pagesの確認版。入力値を保存・外部送信しない。 */
(() => {
  'use strict';
  const button = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mobile-nav');
  if (button && nav) {
    const close = () => { nav.hidden = true; button.setAttribute('aria-expanded', 'false'); };
    button.hidden = false;
    button.addEventListener('click', () => { const open = button.getAttribute('aria-expanded') === 'true'; nav.hidden = open; button.setAttribute('aria-expanded', String(!open)); });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !nav.hidden) { close(); button.focus(); } });
    window.matchMedia('(min-width:601px)').addEventListener('change', e => { if (e.matches) close(); });
  }
  const ranges = new Set(['under-500m', '500m-800m', 'over-800m']);
  const params = new URLSearchParams(location.search);
  const filters = [...document.querySelectorAll('[data-income-filter]')];
  const cards = [...document.querySelectorAll('[data-income-property]')];
  const filterStatus = document.getElementById('filter-status');
  const applyFilter = value => {
    if (value !== 'all' && !ranges.has(value)) return;
    filters.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.incomeFilter === value)));
    cards.forEach(c => { c.hidden = value !== 'all' && c.dataset.priceRange !== value; });
    if (filterStatus) filterStatus.textContent = `${cards.filter(c => !c.hidden).length}件のサンプルを表示しています。`;
  };
  filters.forEach(b => { b.disabled = false; b.addEventListener('click', () => applyFilter(b.dataset.incomeFilter)); });
  if (filters.length) applyFilter(ranges.has(params.get('range')) ? params.get('range') : 'all');
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  const range = document.getElementById('price-range');
  const interest = document.getElementById('property-interest');
  const data = JSON.parse(document.getElementById('income-property-data').textContent);
  const selected = data.find(p => p.id === params.get('property'));
  if (selected) { interest.value = `${selected.id}｜${selected.title}`; range.value = selected.range; }
  else if (ranges.has(params.get('range'))) range.value = params.get('range');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', e => e.preventDefault());
  document.getElementById('preview-inquiry').addEventListener('click', () => {
    if (!form.reportValidity()) return;
    status.textContent = `入力項目を確認しました。${interest.value.trim() ? '物件についてのご相談' : '物件を指定しないご相談'}として受付できる構成です。この確認版は保存・送信しません。`;
    status.hidden = false;
    status.scrollIntoView({block: 'nearest', behavior: 'auto'});
  });
  form.addEventListener('input', () => { status.hidden = true; });
  document.getElementById('inquiry-fields').disabled = false;
})();
