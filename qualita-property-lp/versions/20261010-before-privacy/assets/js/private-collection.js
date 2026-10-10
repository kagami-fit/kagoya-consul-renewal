/* 制作確認用。実データ、認証、外部送信、入力保存は実装しない。 */
(() => {
  'use strict';
  const samples = Object.freeze({
    'DEMO-01': {
      title:'光と眺望を愉しむ、レジデンス。', category:'居住用 / 都心エリア / サンプル01', image:'residence.jpg',
      facts:[['物件番号','DEMO-01（架空）'],['価格例','4億8,000万円（架空の設定）'],['種別例','マンション'],['専有面積例','136.8㎡'],['想定用途','居住用'],['取扱状況','制作確認用・販売物件ではありません']],
      comment:'居住用では、立地や住空間に加えて、建物の仕様・管理情報・権利・取扱条件を整理する詳細画面を想定しています。このモデルには実際の物件資料はありません。'
    },
    'DEMO-02': {
      title:'街とつながる、一棟不動産。', category:'収益・事業用 / 都心近郊 / サンプル02', image:'building.jpg',
      facts:[['物件番号','DEMO-02（架空）'],['価格例','8億2,000万円（架空の設定）'],['種別例','一棟不動産'],['延床面積例','620.4㎡'],['土地面積例','198.6㎡'],['想定用途','収益・事業用'],['取扱状況','制作確認用・販売物件ではありません']],
      comment:'収益・事業用では、用途、建物、稼働状況、収支の根拠、修繕・権利等の確認事項を分けて提示する想定です。このサンプルで利回りや収益を約束するものではありません。'
    },
    'DEMO-03': {
      title:'庭と暮らす、静かな邸宅。', category:'邸宅・別荘 / リゾートエリア / サンプル03', image:'villa.jpg',
      facts:[['物件番号','DEMO-03（架空）'],['価格例','3億6,000万円（架空の設定）'],['種別例','戸建て・別荘'],['土地面積例','512.0㎡'],['建物面積例','238.0㎡'],['想定用途','居住用・セカンドハウス'],['取扱状況','制作確認用・販売物件ではありません']],
      comment:'邸宅や別荘では、建物と土地、周辺環境、管理方法、利用目的との相性などを確認する詳細画面を想定しています。所在地や販売条件は実物件の登録時に確認します。'
    }
  });

  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const closeMenu = () => { mobileNav.hidden=true; menuButton.setAttribute('aria-expanded','false'); };
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    mobileNav.hidden=expanded;
    menuButton.setAttribute('aria-expanded',String(!expanded));
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event => {
    if(event.key==='Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); }
  });
  window.matchMedia('(min-width:601px)').addEventListener('change',event => { if(event.matches) closeMenu(); });
  menuButton.hidden=false;

  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-property]')];
  const filterStatus = document.getElementById('filter-status');
  const validFilters=new Set(['all','residential','investment']);
  filters.forEach(button => {
    button.addEventListener('click',()=>{
      const filter=button.dataset.filter;
      if(!validFilters.has(filter)) return;
      filters.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
      cards.forEach(card=>{ card.hidden=filter!=='all' && card.dataset.category!==filter; });
      filterStatus.textContent=filter==='all'?'すべてのサンプルを表示しています。':`${button.textContent}のサンプルを表示しています。`;
    });
    button.disabled=false;
  });

  const dialog=document.getElementById('property-dialog');
  const choice=document.getElementById('property-choice');
  let activeProperty='';
  const closeDetail=()=>dialog.close();
  document.querySelector('.dialog-close').addEventListener('click',closeDetail);
  dialog.addEventListener('close',()=>{ document.documentElement.classList.remove('dialog-is-open'); });
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog) return;
    const box=dialog.getBoundingClientRect();
    if(event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom) closeDetail();
  });
  document.querySelectorAll('[data-open-property]').forEach(button=>{
    button.addEventListener('click',()=>{
      const id=button.dataset.openProperty;
      if(!Object.hasOwn(samples,id)) return;
      const sample=samples[id];
      activeProperty=id;
      document.getElementById('detail-title').textContent=sample.title;
      document.getElementById('detail-category').textContent=sample.category;
      const image=document.getElementById('detail-image');
      image.src=`assets/images/${sample.image}`;
      image.alt=`${sample.title}を想定した生成イメージ。実在する販売物件ではありません。`;
      const facts=document.getElementById('detail-facts');
      facts.replaceChildren();
      sample.facts.forEach(([label,value])=>{
        const row=document.createElement('div');
        const dt=document.createElement('dt'); dt.textContent=label;
        const dd=document.createElement('dd'); dd.textContent=value;
        row.append(dt,dd); facts.append(row);
      });
      document.getElementById('detail-comment').textContent=sample.comment;
      dialog.showModal();
      document.documentElement.classList.add('dialog-is-open');
    });
    button.disabled=false;
  });
  document.getElementById('detail-consult').addEventListener('click',()=>{
    if(!Object.hasOwn(samples,activeProperty)) return;
    choice.value=activeProperty;
    closeDetail();
    document.getElementById('consultation').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});
    choice.focus({preventScroll:true});
  });

  const form=document.getElementById('inquiry-form');
  const status=document.getElementById('form-status');
  // 実送信を防ぐイベントを登録してから、入力欄を有効化する。
  form.addEventListener('submit',event=>event.preventDefault());
  document.getElementById('preview-inquiry').addEventListener('click',()=>{
    if(!form.reportValidity()) return;
    const item=choice.value==='general'?'希望条件の相談':`${choice.value}のサンプル`;
    status.textContent=`${item}の入力画面を確認しました。この確認版では、入力内容を保存・送信していません。本番の受信先・個人情報の取り扱い・送信機能は、運用条件を確認してから接続します。`;
    status.hidden=false;
    status.scrollIntoView({block:'nearest',behavior:'auto'});
  });
  form.addEventListener('input',()=>{ status.hidden=true; });
  document.getElementById('inquiry-fields').disabled=false;
})();
