(() => {
  const body = document.body;
  const script = document.querySelector('script[src$="assets/js/site.js"]');
  const prefix = script?.getAttribute('src')?.startsWith('../') ? '../' : '';
  const toggle = document.querySelector('[data-menu-toggle]');
  const shade = document.querySelector('[data-menu-shade]');
  const drawer = document.querySelector('[data-menu-drawer]');

  const closeMenu = () => {
    body.classList.remove('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (drawer) drawer.setAttribute('aria-hidden', 'true');
  };

  const openMenu = () => {
    body.classList.add('menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    if (drawer) drawer.setAttribute('aria-hidden', 'false');
  };

  if (toggle) {
    toggle.addEventListener('click', () => body.classList.contains('menu-open') ? closeMenu() : openMenu());
  }
  if (shade) shade.addEventListener('click', closeMenu);
  document.querySelectorAll('[data-menu-drawer] a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  const reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .06, rootMargin: '0px 0px -4% 0px' });
    reveal.forEach((el) => observer.observe(el));

    // 高速スクロールや大きなスクリーンショットでも要素を取りこぼさない。
    let revealTicking = false;
    const revealVisible = () => {
      revealTicking = false;
      reveal.forEach((el) => {
        if (el.classList.contains('is-in')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * .96 && rect.bottom > 0) {
          el.classList.add('is-in');
          observer.unobserve(el);
        }
      });
    };
    window.addEventListener('scroll', () => {
      if (!revealTicking) {
        revealTicking = true;
        window.requestAnimationFrame(revealVisible);
      }
    }, { passive: true });
    window.addEventListener('load', revealVisible, { once: true });
  } else {
    reveal.forEach((el) => el.classList.add('is-in'));
  }

  const hero = document.querySelector('[data-dolly-hero]');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const copy = hero.querySelector('[data-dolly-copy]');
    hero.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth - .5) * -20;
      const y = (event.clientY / window.innerHeight - .5) * -12;
      if (copy) copy.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    hero.addEventListener('pointerleave', () => { if (copy) copy.style.transform = ''; });
  }

  // 「今日の籠や」はJSONの差し替えだけで更新できる。
  // 本番ではmeta[name="kagoya-today-feed"]をWordPress REST / WorkerのURLへ差し替え可能。
  // file:// プレビューではfetchが制限されるため、HTMLに入れた初期表示をそのまま使う。
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const safeHref = (value) => {
    const raw = String(value || 'contact.html');
    try {
      const url = new URL(raw, window.location.href);
      if (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'file:') return url.href;
    } catch (_) {}
    return `${prefix}contact.html`;
  };
  const todayFeed = document.querySelector('#todayFeed');
  if (todayFeed) {
    const kindClass = { NEW: 'new', MEETING: 'meeting', CLOSE: 'close', PARTNER: 'partner' };
    const feedMeta = document.querySelector('meta[name="kagoya-today-feed"]');
    const feedUrl = feedMeta?.getAttribute('content') || `${prefix}data/today-items.json`;
    fetch(feedUrl, { cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error('today feed unavailable');
      return response.json();
    }).then((payload) => {
      const items = Array.isArray(payload) ? payload : payload?.items;
      if (!Array.isArray(items) || !items.length) return;
      const updatedAt = Array.isArray(payload) ? '' : payload?.updatedAt;
      const updatedNode = document.querySelector('[data-live-updated]');
      if (updatedNode && updatedAt) updatedNode.textContent = String(updatedAt).replace(/-/g, '.');
      const ticker = document.querySelector('[data-live-ticker]');
      if (ticker) {
        const labels = items.slice(0, 3).map((item) => item?.label || item?.kind).filter(Boolean);
        if (labels.length) ticker.textContent = `${labels.join('・')}の動きを随時更新しています。`;
      }
      todayFeed.innerHTML = items.map((item) => {
        const kind = String(item.kind || 'NEW').toUpperCase();
        const klass = kindClass[kind] || 'new';
        const source = item.source || item.platform || 'KAGOYA';
        return `<a class="today__item" href="${escapeHtml(safeHref(item.href))}"><span class="today__kind today__kind--${klass}">${escapeHtml(kind)}</span><div><strong>${escapeHtml(item.label || kind)}</strong><h3>${escapeHtml(item.title || '')}</h3><p>${escapeHtml(item.when || '')}｜${escapeHtml(item.summary || '')}</p><small class="today__meta">${escapeHtml(source)}</small></div><span class="today__arrow">→</span></a>`;
      }).join('');
    }).catch(() => {});
  }

  // 4つの入口（案件相談／協業／投資／採用）は同じフォームを使い、typeだけを引き継ぐ。
  // 受付側で案件ごとのフォームを増やさず、到着時に相談目的を見える化する設計。
  const inquiryRoutes = {
    project: { title: '案件相談をはじめる', lead: '不動産・地上げ・開発・相続など、分かる範囲からお聞かせください。', label: '案件相談', description: '所在地や現在の状況を確認し、次に必要な調査と選択肢を整理します。' },
    partner: { title: '協業の相談をはじめる', lead: '専門家・地域事業者・介護など、連携できるテーマをお聞かせください。', label: '協業', description: 'できること、必要な役割、進め方を確認し、最初の打ち合わせへつなげます。' },
    investment: { title: '投資について相談する', lead: '事業・物件の可能性とリスクを、対話しながら整理します。', label: '投資', description: '対象・時期・関係者を確認し、公開できる情報から検討を始めます。' },
    recruit: { title: '採用について相談する', lead: 'いま動いている案件に、どのように関わりたいかお聞かせください。', label: '採用', description: '経験や関心のある領域を確認し、現在の募集・協働機会をご案内します。' }
  };
  const route = inquiryRoutes[new URLSearchParams(window.location.search).get('type')];
  if (route) {
    const titleNode = document.querySelector('[data-inquiry-title]');
    const leadNode = document.querySelector('[data-inquiry-lead]');
    const panel = document.querySelector('[data-inquiry-panel]');
    const labelNode = document.querySelector('[data-inquiry-label]');
    const descriptionNode = document.querySelector('[data-inquiry-description]');
    const noteNode = document.querySelector('[data-inquiry-note]');
    if (titleNode) titleNode.textContent = route.title;
    if (leadNode) leadNode.textContent = route.lead;
    if (panel) panel.hidden = false;
    if (labelNode) labelNode.textContent = route.label;
    if (descriptionNode) descriptionNode.textContent = route.description;
    if (noteNode) noteNode.textContent = `公式フォームの相談内容欄に「${route.label}」とご記入ください。${noteNode.textContent}`;
  }

  const archive = document.querySelector('[data-search-archive]');
  if (archive) {
    const params = new URLSearchParams(window.location.search);
    const query = (params.get('q') || '').trim();
    const input = document.querySelector('#archive-q');
    const status = document.querySelector('[data-search-status]');
    const cards = [...archive.querySelectorAll('.p-card')];
    if (input) input.value = query;
    if (query) {
      const normalized = query.toLocaleLowerCase('ja');
      const matched = cards.filter((card) => card.textContent.toLocaleLowerCase('ja').includes(normalized));
      cards.forEach((card) => { card.hidden = !matched.includes(card); });
      if (status) status.textContent = `「${query}」の検索結果：${matched.length}件`;
    } else if (status) {
      status.textContent = `公開中の記事：${cards.length}件`;
    }
  }

  if (!document.querySelector('.mobile-contact-bar')) {
    const bar = document.createElement('nav');
    bar.className = 'mobile-contact-bar';
    bar.setAttribute('aria-label', 'お問い合わせ');
    bar.innerHTML = `<a class="mobile-contact-bar__tel" href="tel:0344007994">電話で相談</a><a class="mobile-contact-bar__form" href="${prefix}contact.html">お問い合わせ</a>`;
    body.appendChild(bar);
  }
})();
