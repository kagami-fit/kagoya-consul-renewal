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
    if (filterStatus) filterStatus.textContent = `${cards.filter(c => !c.hidden).length}件の物件を表示しています。`;
  };
  filters.forEach(b => { b.disabled = false; b.addEventListener('click', () => applyFilter(b.dataset.incomeFilter)); });
  if (filters.length) applyFilter(ranges.has(params.get('range')) ? params.get('range') : 'all');

  const form=document.querySelector('.wpcf7 form');
  if(form){const property=form.querySelector('[name="property-interest"]'),range=form.querySelector('[name="price-range"]');if(property&&params.has('property'))property.value=params.get('property').slice(0,200);if(range&&ranges.has(params.get('range')))range.value=({'under-500m':'5億円以下','500m-800m':'5億円〜8億円','over-800m':'8億円以上'})[params.get('range')];}
})();
