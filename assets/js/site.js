(() => {
  const body = document.body;
  const script = document.querySelector('script[src$="assets/js/site.js"]');
  const prefix = script?.getAttribute('src')?.startsWith('../') ? '../' : '';
  const toggle = document.querySelector('[data-menu-toggle]');
  const shade = document.querySelector('[data-menu-shade]');
  const drawer = document.querySelector('[data-menu-drawer]');

  // 共通ヘッダーは、ロゴを左端に置き、成約実績への入口を全ページで表示する。
  // 既存ページにも同じスクリプトを読み込んでいるため、個別HTMLを増やさずにナビを統一できる。
  const normalizeHeader = () => {
    document.querySelectorAll('.site-header__main').forEach((main) => {
      const brand = main.querySelector('.site-header__brand');
      if (brand && main.firstElementChild !== brand) main.insertBefore(brand, main.firstElementChild);
    });

    const soldHref = `${prefix}sold-properties.html`;
    const makeLink = (mobile = false) => {
      const link = document.createElement('a');
      link.href = soldHref;
      link.textContent = mobile ? '成約物件' : '成約物件';
      link.setAttribute('data-site-nav', 'sold-properties');
      if (mobile) {
        const small = document.createElement('small');
        small.textContent = 'SOLD';
        link.appendChild(small);
      }
      if (window.location.pathname.endsWith('/sold-properties.html') || window.location.pathname.endsWith('sold-properties.html')) link.setAttribute('aria-current', 'page');
      return link;
    };

    const desktopNav = document.querySelector('.site-header__nav.is-right');
    if (desktopNav && !desktopNav.querySelector('[data-site-nav="sold-properties"]')) {
      const link = makeLink();
      const contactLink = [...desktopNav.querySelectorAll('a')].find((node) => node.getAttribute('href') === 'contact.html' && node.textContent.trim() === '相談する');
      desktopNav.insertBefore(link, contactLink || null);
    }

    const drawerNav = drawer?.querySelector('nav');
    if (drawerNav && !drawerNav.querySelector('[data-site-nav="sold-properties"]')) {
      const link = makeLink(true);
      const forSaleLink = [...drawerNav.querySelectorAll('a')].find((node) => node.getAttribute('href')?.endsWith('for-sale.html'));
      if (forSaleLink?.nextSibling) drawerNav.insertBefore(link, forSaleLink.nextSibling);
      else drawerNav.appendChild(link);
    }
  };
  normalizeHeader();

  // ホームの導線は「対応エリア」から「不動産相談」へ自然につながる順番に統一する。
  const homeMain = document.querySelector('main#main');
  const serviceAreaSection = homeMain?.querySelector('#service-area');
  const servicesSection = homeMain?.querySelector('#services');
  if (homeMain && serviceAreaSection && servicesSection) homeMain.insertBefore(serviceAreaSection, servicesSection);

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

  // 「Today’s KAGOYA」はJSONの差し替えだけで更新できる。
  // 本番ではmeta[name="kagoya-today-feed"]をWordPress REST / WorkerのURLへ差し替え可能。
  // file:// プレビューではfetchが制限されるため、HTMLに入れた初期表示をそのまま使う。
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const safeHref = (value) => {
    const raw = String(value || 'contact.html');
    try {
      const url = new URL(raw, window.location.href);
      if (['http:', 'https:', 'file:', 'tel:', 'mailto:'].includes(url.protocol)) return url.href;
    } catch (_) {}
    return `${prefix}contact.html`;
  };
  const safeContentHref = (value) => {
    let raw = String(value || 'contact.html');
    const hasScheme = /^[A-Za-z][A-Za-z0-9+.-]*:/.test(raw);
    if (prefix && !hasScheme && !raw.startsWith('/') && !raw.startsWith('../') && !raw.startsWith('./') && !raw.startsWith('#')) raw = `${prefix}${raw}`;
    return safeHref(raw);
  };
  const safeAssetHref = (value, fallback) => {
    const raw = String(value || fallback || '');
    try {
      const url = new URL(raw, window.location.href);
      if (url.protocol === 'http:' || url.protocol === 'https:' || (url.protocol === 'file:' && window.location.protocol === 'file:')) return url.href;
    } catch (_) {}
    return fallback ? new URL(String(fallback), window.location.href).href : '';
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

  // スプレッドシートで公開された進行中プロジェクトを表示する。
  const projectGrid = document.querySelector('#projectGrid');
  if (projectGrid) {
    fetch(`${prefix}data/project-items.json`, { cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error('project feed unavailable');
      return response.json();
    }).then((payload) => {
      const items = Array.isArray(payload) ? payload : payload?.items;
      if (!Array.isArray(items) || !items.length) return;
      projectGrid.innerHTML = items.map((item) => {
        const imageUrl = safeAssetHref(item.image, 'src/gen-company.jpg');
        const linkUrl = safeHref(item.href || 'contact.html?type=project');
        return `<article class="project-card"><div class="project-card__media"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(item.title || '進行中プロジェクト')}" loading="lazy" decoding="async"><span class="project-card__status">${escapeHtml(item.status || 'IN PROGRESS')}</span></div><div class="project-card__body"><span class="project-card__meta">${escapeHtml(item.meta || '')}</span><h4>${escapeHtml(item.title || '')}</h4><p>${escapeHtml(item.summary || '')}</p><a class="project-card__link" href="${escapeHtml(linkUrl)}">このテーマを相談する</a></div></article>`;
      }).join('');
      if (window.gsap && window.ScrollTrigger && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.gsap.utils.toArray('#projectGrid .project-card').forEach((element, index) => {
          window.gsap.from(element, { y: 28, opacity: 0, duration: .85, delay: index * .08, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true } });
        });
        window.ScrollTrigger.refresh();
      }
    }).catch(() => {});
  }

  // 物件は管理シート由来の1つのJSONから、販売中・成約実績・一覧ページへ振り分ける。
  // 「成約済み」へ変更すると販売中から外れ、「非公開」は全表示から除外される。
  const propertyTargets = {
    mosaic: document.querySelector('#facgrid'),
    currentCards: document.querySelector('.facility > .wrap > .result-grid'),
    soldCards: document.querySelector('.result-block .result-grid'),
    soldArchive: document.querySelector('#sold-listings .listing-grid'),
    residential: document.querySelector('#residential .listing-grid'),
    income: document.querySelector('#income .listing-grid'),
    other: document.querySelector('#other-listings .listing-grid')
  };
  if (Object.values(propertyTargets).some(Boolean)) {
    fetch(`${prefix}data/sale-items.json`, { cache: 'no-store' }).then((response) => {
      if (!response.ok) throw new Error('property feed unavailable');
      return response.json();
    }).then((payload) => {
      const items = Array.isArray(payload) ? payload : payload?.items;
      if (!Array.isArray(items) || !items.length) return;
      const sorted = items.slice().sort((a, b) => {
        const orderDiff = Number(a?.order || 0) - Number(b?.order || 0);
        if (a?.order != null && b?.order != null && orderDiff) return orderDiff;
        return String(b?.date || '').localeCompare(String(a?.date || ''));
      });
      const categoriesOf = (item) => Array.isArray(item?.categories) ? item.categories.map(String) : [];
      const isSold = (item) => item?.status === '成約済み' || categoriesOf(item).includes('成約物件');
      const isHidden = (item) => item?.status === '非公開';
      const current = sorted.filter((item) => !isHidden(item) && !isSold(item));
      const sold = sorted.filter((item) => !isHidden(item) && isSold(item));
      const residential = current.filter((item) => categoriesOf(item).includes('販売中物件(土地建物/マンション)'));
      const income = current.filter((item) => categoriesOf(item).includes('販売中物件(一棟収益)'));
      const grouped = new Set([...residential, ...income]);
      const other = current.filter((item) => !grouped.has(item));

      const propertyUrl = (item) => safeHref(`${prefix}property-detail.html#${encodeURIComponent(String(item?.slug || item?.id || ''))}`);
      const imageUrl = (item) => safeAssetHref(item?.image, `${prefix}src/gen-for-sale.jpg`);
      const field = (item, name) => String(item?.fields?.[name] || '').trim();
      const summary = (item) => [field(item, '種別'), field(item, '所在地')].filter(Boolean).join('／');
      const taxonomy = (item) => [
        ...categoriesOf(item).map((label) => ({ label, kind: 'category' })),
        ...(Array.isArray(item?.tags) ? item.tags : []).map((label) => ({ label: `#${label}`, kind: 'hash' }))
      ];
      const taxonomyHtml = (item) => {
        const tags = taxonomy(item);
        return tags.length ? `<div class="listing-taxonomy-tags">${tags.map((tag) => `<span class="${escapeHtml(tag.kind)}">${escapeHtml(tag.label)}</span>`).join('')}</div>` : '';
      };
      const resultCard = (item, soldCard) => `<a class="result-card" href="${escapeHtml(propertyUrl(item))}"><div class="result-card__media"><img src="${escapeHtml(imageUrl(item))}" alt="${escapeHtml(item?.title || '物件写真')}" loading="lazy" decoding="async"><span class="result-card__badge">${soldCard ? 'SOLD' : 'FOR SALE'}</span></div><div class="result-card__body"><h4>${escapeHtml(item?.title || '')}</h4><p>${escapeHtml(summary(item))}</p><span class="result-card__more">${soldCard ? '成約物件' : '販売中物件'}の詳細を見る →</span></div></a>`;
      const listingCard = (item, compact) => {
        const details = [
          ['所在地', field(item, '所在地')],
          ['交通', field(item, '交通')],
          ['面積', field(item, '建物面積／土地面積')]
        ].filter((entry) => entry[1]);
        const note = field(item, 'その他');
        return `<article class="listing-card${compact ? ' listing-card--compact' : ''}"><div class="listing-card__image"><img src="${escapeHtml(imageUrl(item))}" alt="${escapeHtml(item?.title || '物件写真')}" loading="lazy" decoding="async"></div><div class="listing-card__body">${taxonomyHtml(item)}<span class="listing-type">${escapeHtml(field(item, '種別') || '物件')}</span><h3>${escapeHtml(item?.title || '')}</h3><p class="listing-price">${escapeHtml(field(item, '価格') || '詳細はお問い合わせください')}</p>${details.length ? `<dl>${details.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>` : ''}${note ? `<p class="listing-note">${escapeHtml(note)}</p>` : ''}<a class="listing-link" href="${escapeHtml(propertyUrl(item))}">物件詳細を見る <span aria-hidden="true">↗</span></a></div></article>`;
      };

      if (propertyTargets.mosaic) {
        const layout = ['big2', '', '', 'wide'];
        propertyTargets.mosaic.innerHTML = current.slice(0, 4).map((item, index) => {
          const klass = layout[index] || '';
          return `<a class="property-shot${klass ? ` ${klass}` : ''}" href="${escapeHtml(propertyUrl(item))}"><figure${klass ? ` class="${klass}"` : ''}><img src="${escapeHtml(imageUrl(item))}" alt="${escapeHtml(item?.title || '販売中物件')}" loading="lazy" decoding="async"><figcaption>${escapeHtml(item?.title || '')}</figcaption></figure></a>`;
        }).join('');
      }
      if (propertyTargets.currentCards) propertyTargets.currentCards.innerHTML = current.slice(0, 4).map((item) => resultCard(item, false)).join('');
      if (propertyTargets.soldCards) propertyTargets.soldCards.innerHTML = sold.slice(0, 4).map((item) => resultCard(item, true)).join('');
      if (propertyTargets.soldArchive) propertyTargets.soldArchive.innerHTML = sold.length ? sold.map((item) => listingCard(item, true)).join('') : '<p class="listing-empty">成約物件はありません。</p>';
      if (propertyTargets.residential) propertyTargets.residential.innerHTML = residential.length ? residential.map((item) => listingCard(item, false)).join('') : '<p class="listing-empty">現在公開中の物件はありません。</p>';
      if (propertyTargets.income) propertyTargets.income.innerHTML = income.length ? income.map((item) => listingCard(item, false)).join('') : '<p class="listing-empty">現在公開中の物件はありません。</p>';
      if (propertyTargets.other) propertyTargets.other.innerHTML = other.length ? other.map((item) => listingCard(item, true)).join('') : '<p class="listing-empty">現在公開中の物件はありません。</p>';

      const totalNode = document.querySelector('.page-intro__pull');
      if (totalNode) {
        const visibleCurrentCount = residential.length + income.length;
        totalNode.textContent = propertyTargets.soldArchive ? `${sold.length}件` : `${propertyTargets.other ? current.length : visibleCurrentCount}件`;
      }
      const counts = { '#residential': residential.length, '#income': income.length, '#other-listings': other.length };
      Object.entries(counts).forEach(([href, count]) => {
        const node = document.querySelector(`.listing-categories a[href="${href}"] span`);
        if (node) node.textContent = String(count);
      });
      if (window.ScrollTrigger) window.setTimeout(() => window.ScrollTrigger.refresh(), 80);
    }).catch(() => {});
  }

  // ページ文章は「修正案を公開」した項目だけを上書きする。
  const pathName = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const currentPage = prefix === '../' ? `blog/${pathName}` : pathName;
  const pageCopyReady = fetch(`${prefix}data/page-copy-items.json`, { cache: 'no-store' }).then((response) => {
    if (!response.ok) throw new Error('page copy unavailable');
    return response.json();
  }).then((payload) => {
    const items = Array.isArray(payload) ? payload : payload?.items;
    if (!Array.isArray(items)) return;
    items.filter((item) => item?.apply && (item.page === currentPage || item.page === '共通')).forEach((item) => {
      const value = String(item.publishedValue ?? '');
      if (item.kind === 'TITLE') {
        document.title = value;
        return;
      }
      if (item.kind === 'META DESCRIPTION') {
        const node = document.querySelector('meta[name="description"]');
        if (node) node.setAttribute('content', value);
        return;
      }
      document.querySelectorAll(`[data-cms-id="${String(item.id).replace(/["\\]/g, '')}"]`).forEach((node) => {
        if (value.includes('\n')) node.innerHTML = value.split('\n').map(escapeHtml).join('<br>');
        else node.textContent = value;
        if (item.href && node.tagName === 'A') node.setAttribute('href', safeContentHref(item.href));
      });
    });
  }).catch(() => {});

  // 差し替え画像URLが公開された画像だけを置換する。
  fetch(`${prefix}data/media-items.json`, { cache: 'no-store' }).then((response) => {
    if (!response.ok) throw new Error('media feed unavailable');
    return response.json();
  }).then((payload) => {
    const items = Array.isArray(payload) ? payload : payload?.items;
    if (!Array.isArray(items)) return;
    items.filter((item) => item?.apply && item.path && item.replacementUrl).forEach((item) => {
      const target = String(item.path).replace(/^\.\.\//, '');
      document.querySelectorAll('img').forEach((image) => {
        const source = String(image.getAttribute('src') || '').replace(/^\.\.\//, '');
        if (source !== target) return;
        image.src = safeAssetHref(item.replacementUrl, image.src);
        if (item.alt) image.alt = item.alt;
      });
    });
  }).catch(() => {});

  const replaceText = (root, before, after) => {
    if (!root || !before || before === after) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const targets = [];
    while (walker.nextNode()) {
      const parent = walker.currentNode.parentElement;
      if (!parent || parent.closest('script,style,noscript,template')) continue;
      if (walker.currentNode.nodeValue.includes(before)) targets.push(walker.currentNode);
    }
    targets.forEach((node) => { node.nodeValue = node.nodeValue.split(before).join(after); });
  };
  const replaceAttributes = (before, after) => {
    if (!before || before === after) return;
    document.querySelectorAll('[alt],[title],[aria-label]').forEach((node) => {
      ['alt', 'title', 'aria-label'].forEach((name) => {
        const value = node.getAttribute(name);
        if (value?.includes(before)) node.setAttribute(name, value.split(before).join(after));
      });
    });
  };
  const navigationMap = {
    NAV_LEFT_01: { defaults: ['会社情報'], ids: ['common_common-header_A_002', 'common_common-header_A_012'] },
    NAV_LEFT_02: { defaults: ['事業紹介'], ids: ['common_common-header_A_003', 'common_common-header_A_013'] },
    NAV_LEFT_03: { defaults: ['販売物件', '販売中物件'], ids: ['common_common-header_A_004', 'common_common-header_A_014'] },
    NAV_LEFT_04: { defaults: ['サービス'], ids: ['common_common-header_A_005', 'common_common-header_A_015'] },
    NAV_RIGHT_01: { defaults: ['対応エリア'], ids: ['common_common-header_A_006', 'common_common-header_A_016'] },
    NAV_RIGHT_02: { defaults: ['お知らせ', 'ニュース'], ids: ['common_common-header_A_007', 'common_common-header_A_017'] },
    NAV_RIGHT_03: { defaults: ['社会貢献'], ids: ['common_common-header_A_008', 'common_common-header_A_018'] },
    NAV_RIGHT_04: { defaults: ['相談する', '選択肢を相談する'], ids: ['common_common-header_A_001', 'common_common-header_A_009', 'common_common-header_A_010', 'common_common-header_A_020'] }
  };
  const navigationHref = (value) => {
    let raw = String(value || 'contact.html');
    if (raw.startsWith('#') && pathName !== 'index.html') raw = `index.html${raw}`;
    return safeContentHref(raw);
  };
  const updateNavigation = (setting) => {
    const map = navigationMap[setting.id];
    if (!map || !setting.value) return;
    const candidates = new Set();
    map.ids.forEach((id) => document.querySelectorAll(`[data-cms-id="${id}"]`).forEach((node) => candidates.add(node)));
    document.querySelectorAll('header a,footer a,[data-menu-drawer] a').forEach((node) => {
      const text = node.textContent.replace(/\s+/g, ' ').trim();
      if (map.defaults.some((label) => text === label || text.startsWith(`${label} `))) candidates.add(node);
    });
    candidates.forEach((link) => {
      const current = link.textContent;
      const before = map.defaults.find((label) => current.includes(label));
      if (before) replaceText(link, before, setting.value);
      else link.textContent = setting.value;
      if (setting.target && setting.target !== '変更不要') link.setAttribute('href', navigationHref(setting.target));
    });
  };
  const applySiteSettings = (items) => {
    if (!Array.isArray(items)) return;
    const settings = Object.fromEntries(items.filter((item) => item?.id && item?.value != null).map((item) => [item.id, item]));
    const textSettings = [
      ['COMPANY_NAME', '株式会社籠や'],
      ['COMPANY_NAME_EN', 'KAGOYA'],
      ['BUSINESS_HOURS', '10:00–18:00／水曜定休'],
      ['ADDRESS', '〒152-0032 東京都目黒区平町1丁目26-17 ソシアル都立大学駅前201号']
    ];
    textSettings.forEach(([id, before]) => {
      const after = String(settings[id]?.value || '');
      if (!after) return;
      replaceText(document.body, before, after);
      replaceAttributes(before, after);
    });
    const phone = settings.PHONE;
    if (phone?.value) {
      const dial = String(phone.value).replace(/[^0-9+]/g, '');
      document.querySelectorAll('a[href^="tel:"]').forEach((link) => { link.href = `tel:${dial}`; });
      replaceText(document.body, '03-4400-7994', String(phone.value));
      replaceAttributes('03-4400-7994', String(phone.value));
    }
    Object.keys(navigationMap).forEach((id) => updateNavigation(settings[id] || {}));
    const contact = settings.CONTACT_URL;
    if (contact?.value) {
      document.querySelectorAll('a[href]').forEach((link) => {
        let current;
        try { current = new URL(link.getAttribute('href'), window.location.href); } catch (_) { return; }
        if (!current.pathname.endsWith('/contact.html')) return;
        const next = new URL(safeContentHref(contact.value), window.location.href);
        if (!next.search && current.search) next.search = current.search;
        if (!next.hash && current.hash) next.hash = current.hash;
        link.href = next.href;
      });
    }
    const publicUrl = settings.PUBLIC_URL?.value;
    if (publicUrl) {
      let canonicalUrl = String(publicUrl);
      try {
        const baseUrl = new URL(canonicalUrl.endsWith('/') ? canonicalUrl : `${canonicalUrl}/`);
        canonicalUrl = new URL(currentPage === 'index.html' ? '' : currentPage, baseUrl).href;
      } catch (_) {}
      document.querySelectorAll('link[rel="canonical"],meta[property="og:url"]').forEach((node) => {
        if (node.tagName === 'LINK') node.setAttribute('href', canonicalUrl);
        else node.setAttribute('content', canonicalUrl);
      });
    }
  };
  if (new URLSearchParams(window.location.search).has('cms-debug')) window.__KagoyaCmsApplySettings = applySiteSettings;

  // 共通設定はページ文章より後に適用し、ナビ・電話番号などの正本を07_共通設定へ統一する。
  pageCopyReady.then(() => fetch(`${prefix}data/site-settings.json`, { cache: 'no-store' })).then((response) => {
    if (!response.ok) throw new Error('settings feed unavailable');
    return response.json();
  }).then((payload) => {
    const items = Array.isArray(payload) ? payload : payload?.items;
    applySiteSettings(items);
  }).catch(() => {});

  // 4つの入口（案件相談／協業／投資／採用）は同じフォームを使い、typeだけを引き継ぐ。
  // 受付側で案件ごとのフォームを増やさず、到着時に相談目的を見える化する設計。
  const inquiryRoutes = {
    project: { title: '物件・相続について相談する', lead: '売却・買取・底地・借地・相続など、分かる範囲からお聞かせください。', label: '物件・相続相談', description: '所在地や現在の状況を確認し、次に必要な調査と選択肢を整理します。' },
    partner: { title: '協業・連携について相談する', lead: '専門家・地域事業者との連携や社会貢献など、ご一緒できるテーマをお聞かせください。', label: '協業・連携', description: 'できること、必要な役割、進め方を確認し、最初の打ち合わせへつなげます。' },
    investment: { title: '事業・資産形成について相談する', lead: 'エフクリ、投資、事業提携などの可能性とリスクを、対話しながら整理します。', label: '事業・資産形成', description: '対象・時期・関係者を確認し、公開できる情報から検討を始めます。' },
    recruit: { title: 'セミナー・採用について相談する', lead: '企業向けセミナーのご依頼や、動いている案件への関わり方をお聞かせください。', label: 'セミナー・採用', description: 'ご希望のテーマや経験を確認し、担当者から次の進め方をご案内します。' }
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
