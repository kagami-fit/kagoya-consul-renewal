(() => {
  const body = document.body;
  const script = document.querySelector('script[src*="assets/js/site.js"]');
  const prefix = script?.getAttribute('src')?.startsWith('../') ? '../' : '';

  // 共通の問い合わせ窓口。PCは05、767px以下は03をCSSで切り替える。
  // ページ末尾の旧CTAはこの窓口へ統合。文面はPC・モバイルで同じ設定を使う。
  // 比較ページ・問い合わせページ・プライバシーページには追加しない。
  const siteContactPages = new Map(Object.entries({
    'index.html': {
      heading: '不動産・事業のご相談',
      lead: '売却・購入・相続から、協業・資産形成・セミナーまで。まずは今の状況をお聞かせください。',
      title: '不動産のことを、\nまずは知るところから。',
      copy: '売却を決めていなくても、資料がそろっていなくても構いません。物件の所在地や現在の状況、ご希望を分かる範囲でお聞かせください。',
      routes: true
    },
    'business.html': {
      heading: '事業・サービスのご相談',
      lead: '相続から不動産の活用、企業向けの支援まで、必要な相談先を一緒に整理します。',
      title: '相談先が決まる前から、\nお話しください。',
      copy: 'どの事業に当てはまるか分からなくても構いません。今の状況とご希望を伺い、必要な確認や支援につなぎます。'
    },
    'about.html': {
      heading: '籠やへのお問い合わせ',
      lead: '不動産のお困りごとや、事業の連携について、お気軽にお問い合わせください。',
      title: '難しい不動産のことを、\nお聞かせください。',
      copy: '資料がそろっていない段階でも、現状を知るところから始められます。案件のご相談だけでなく、協業・連携のお話も承ります。'
    },
    'services.html': {
      heading: '不動産の選択肢をご相談ください',
      lead: '売却・相続・購入・管理。相談内容が一つに決まっていなくても構いません。',
      title: '売ることだけが、\n相談の出口ではありません。',
      copy: '保有、管理、賃貸、改修、売却。時間や費用も含めて比較し、納得できる方針を選ぶための土台を一緒につくります。',
      type: 'project'
    },
    'sale-consulting.html': {
      heading: '不動産コンサルティングのご相談',
      lead: '状況・価値・選択肢・リスクを整理し、判断から実行まで支援します。',
      title: '答えが見つかる前に、\nお話しください。',
      copy: '「どうすればいいか分からない」段階で構いません。売却や購入を決める前に、物件の状況と選択肢を一緒に整理します。',
      type: 'project'
    },
    'inheritance-vacant-house.html': {
      heading: '相続・空き家のご相談',
      lead: '名義やご家族の意向、建物の管理、期限のこと。気になっていることからお聞かせください。',
      title: '相続の状況が、\n固まる前から。',
      copy: '資料がそろっていなくても構いません。誰が、何を、いつまでに確認するかを整理し、売却・保有・賃貸・活用を一緒に考えます。',
      type: 'project'
    },
    'brokerage-purchase.html': {
      heading: '仲介・買取のご相談',
      lead: '価格・時期・条件のうち、何を大切にしたいかをお聞かせください。',
      title: '仲介か、買取か。\n迷っている段階から。',
      copy: '物件の状況と優先条件を確認し、比較できる材料から整えます。購入をご検討の方も、希望条件や資金計画からご相談いただけます。',
      type: 'project'
    },
    'rights-coordination.html': {
      heading: '底地・借地・権利調整のご相談',
      lead: '共有、接道、境界、契約関係など、複雑な条件を一つずつ確認します。',
      title: '複雑だからと、\n諦める前に。',
      copy: '契約書や図面がそろっていない場合も、分かる範囲からお聞かせください。現地と関係者の状況を踏まえ、調査の入口を整理します。',
      type: 'project'
    },
    'fukuri.html': {
      heading: 'エフクリ導入・活用のご相談',
      lead: '従業員の住まいと資産形成を支える、学びと相談の機会をつくります。',
      title: '従業員の学びと相談を、\n福利厚生の中へ。',
      copy: '対象者や社内の課題に合わせて、導入方法や周知、個別相談へのつなぎ方を一緒に考えます。具体的な制度が決まる前でもご相談ください。',
      type: 'investment', label: '導入について相談する'
    },
    'purchase-asset.html': {
      heading: '購入・資産形成のご相談',
      lead: '物件の利点だけでなく、収支・修繕・融資・将来の出口まで確認します。',
      title: '買う前に、\n条件とリスクを整理する。',
      copy: '気になる物件や、ご希望の暮らし・資金計画をお聞かせください。物件が決まっていない段階でも、比較する条件から一緒に考えます。',
      type: 'investment'
    },
    'property-management.html': {
      heading: '賃貸経営・管理のご相談',
      lead: '空室、修繕、収支、管理負担など、オーナー様のお悩みを伺います。',
      title: '一室の悩みから、\n一棟の運用まで。',
      copy: '管理資料がまとまっていない場合も、今ある情報から確認の順番をつくります。日々の管理と、将来の活用・売却をつなげて考えます。',
      type: 'project'
    },
    'corporate-seminars.html': {
      heading: '企業向けセミナーのご相談',
      lead: '住まい・資産形成・相続など、企業と従業員の課題に合わせてご相談いただけます。',
      title: '企業の課題に合わせた、\n学びの場を。',
      copy: 'テーマや対象者が固まっていなくても構いません。開催の目的やご希望を伺い、内容・形式・実施後の相談まで一緒に考えます。',
      type: 'recruit', label: 'セミナーについて相談する'
    },
    'corporate-benefits.html': {
      heading: '法人向け不動産相談のご案内',
      lead: '従業員の住まいや資産形成の悩みを、専門窓口へつなぎます。',
      title: '住まいの安心を、\n働く人の支えに。',
      copy: '制度の目的や対象となる方を確認し、社内への案内と個別相談の進め方を整理します。企業に合った支援の形からご相談ください。',
      type: 'investment'
    },
    'social-contribution.html': {
      heading: '社会貢献活動のお問い合わせ',
      lead: 'NBCジュニアでの取り組みや、次世代を支える活動への連携について承ります。',
      title: '子どもたちの挑戦を、\n一緒に支えるために。',
      copy: '籠やのメンター活動へのご質問や、教育・地域活動での連携のお話をお聞かせください。ご相談の内容を確認し、担当者からご案内します。',
      type: 'partner', label: '活動について問い合わせる',
      image: 'gen-nbc-education-contact',
      imageAlt: '教材と試作品を囲み、教育活動の連携を話し合うイメージ',
      imageNote: '教育活動の連携イメージ（AI生成）'
    },
    'team.html': {
      heading: '専門家との連携・ご相談',
      lead: '不動産・法務・税務・資金計画など、複数の領域にまたがる課題もお聞かせください。',
      title: '必要な専門知識を、\n一つの窓口から。',
      copy: 'どの専門家に相談すべきか分からない場合も、状況から確認します。案件のご相談に加え、専門家・事業者の皆様からの連携のご提案も承ります。'
    },
    'features.html': {
      heading: '不動産の判断に迷ったら',
      lead: '答えを急ぐ前に、状況・価値・選択肢・リスクを一緒に確認します。',
      title: '決める前に、\n知ることから。',
      copy: '今の状況と、気になっていることをお聞かせください。現地と資料、対話を重ね、納得して選ぶための材料を整えます。',
      type: 'project'
    },
    'for-sale.html': {
      heading: '販売中物件のお問い合わせ',
      lead: '募集状況や物件の詳細、内見、購入のご相談を承ります。',
      title: '気になる物件を、\n条件から相談する。',
      copy: '物件名と気になっている点をお知らせください。購入判断や資金計画、ご希望の時期も含めて、分かる範囲からご相談いただけます。',
      type: 'project', label: '物件について相談する'
    },
    'sold-properties.html': {
      heading: '成約実績を参考にしたご相談',
      lead: '似た条件の物件の売却や、新たな物件探しについてご相談いただけます。',
      title: '次の不動産の選択肢を、\n一緒に考える。',
      copy: '掲載物件は成約済みです。気になる実績があれば、物件名やご自身の状況をお聞かせください。売却・購入・相続の次の一歩を整理します。',
      type: 'project'
    },
    'property-detail.html': {
      heading: '物件についてのお問い合わせ',
      lead: '掲載内容の確認や、購入・売却のご相談を承ります。',
      title: '物件のことを、\nもう少し詳しく。',
      copy: '物件名と確認したいことをお知らせください。募集状況を確認のうえご案内します。成約済みの場合も、似た条件の物件探しをご相談いただけます。',
      type: 'project', label: '物件について相談する'
    },
    'news.html': {
      heading: 'お知らせ・セミナーのお問い合わせ',
      lead: '掲載しているニュースやセミナーについて、確認したいことがあればお寄せください。',
      title: '気になるお知らせを、\nもう少し詳しく。',
      copy: '記事のタイトルや開催日、ご質問の内容をお知らせください。過去の開催情報を含むため、現在の受付状況を確認のうえご案内します。',
      label: '掲載内容を問い合わせる'
    },
    'news-detail.html': {
      heading: 'この記事についてのお問い合わせ',
      lead: '掲載内容やセミナーの開催・受付状況について、ご質問を承ります。',
      title: '記事を読んで、\n気になったことから。',
      copy: '記事のタイトルと、確認したいことをお知らせください。開催日や募集条件などは掲載当時の情報を含むため、現在の状況を確認してお伝えします。',
      label: '記事について問い合わせる'
    },
    'insights.html': {
      heading: '読みものから、個別のご相談へ',
      lead: '記事で気になったことを、ご自身の物件や状況に合わせて確認できます。',
      title: '自分の場合はどうか、\n一緒に確かめる。',
      copy: '同じテーマでも、物件やご家族の事情によって選択肢は変わります。気になった記事と今の状況を、分かる範囲でお聞かせください。',
      type: 'project'
    },
    'faq.html': {
      heading: '解決しなかった疑問はこちらへ',
      lead: 'よくある質問に載っていないことや、個別の事情についてもご相談ください。',
      title: '小さな疑問から、\nお話しください。',
      copy: '何を聞けばよいか分からない段階でも構いません。売却の予定や資料の有無にかかわらず、気になっていることから一緒に整理します。'
    },
    'check-before-price-cut.html': {
      heading: '売却価格・販売方法のご相談',
      lead: '値下げを決める前に、物件の条件と現在の販売状況を確認します。',
      title: '価格を変える前に、\n確かめたいことを。',
      copy: '売り出し中の反響や物件の状態、ご希望の時期をお聞かせください。価格だけでなく、伝え方や条件を含めて選択肢を整理します。',
      type: 'project'
    },
    'inherited-property-first-steps.html': {
      heading: '相続した不動産のご相談',
      lead: '記事の確認項目を、ご家族や物件の状況に合わせて一緒に整理します。',
      title: '相続したその後を、\n分かることから。',
      copy: '名義、管理、期限など、まだ確認できていないことがあっても構いません。売却ありきではなく、保有や管理も含めた選択肢を考えます。',
      type: 'project'
    },
    'rebuild-impossible-property.html': {
      heading: '再建築不可物件のご相談',
      lead: '接道や権利関係、建物の状態から、実行できる方法を確認します。',
      title: '売れないと決める前に、\n条件を確かめる。',
      copy: '所在地や、分かっている範囲の条件をお聞かせください。売却だけでなく、保有・賃貸・改修の可能性も含めて整理します。',
      type: 'project'
    }
  }));
  for (const [alias, page] of [
    ['animation-dynamic.html', 'index.html'], ['service.html', 'services.html'],
    ['properties.html', 'for-sale.html'], ['wp-sale.html', 'for-sale.html']
  ]) siteContactPages.set(alias, siteContactPages.get(page));
  const siteContactPage = window.location.pathname.split('/').pop() || 'index.html';
  const contactContent = siteContactPages.get(siteContactPage);
  const contactEscape = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
  const contactLines = (value) => contactEscape(value).replace(/\n/g, '<br>');
  const contactHref = `${prefix}contact.html${contactContent?.type ? `?type=${contactContent.type}` : ''}`;
  const contactLabel = contactContent?.label || 'フォームで相談する';
  const contactImage = contactContent?.image || 'gen-consultation';
  const contactImageAlt = contactContent?.imageAlt || '資料を見ながら話し合う相談のイメージ';
  const contactRoutes = contactContent?.routes ? `<nav class="site-contact__routes" aria-label="ご相談のテーマから選ぶ">
    <span>ご相談のテーマ</span>
    <a href="${prefix}contact.html?type=project">物件・相続 <span aria-hidden="true">→</span></a>
    <a href="${prefix}contact.html?type=partner">協業・連携 <span aria-hidden="true">→</span></a>
    <a href="${prefix}contact.html?type=investment">事業・資産形成 <span aria-hidden="true">→</span></a>
    <a href="${prefix}contact.html?type=recruit">セミナー・採用 <span aria-hidden="true">→</span></a>
  </nav>` : '';
  const siteContactMain = document.querySelector('main');
  if (siteContactPages.has(siteContactPage) && siteContactMain &&
      document.querySelector('.site-footer') && !document.querySelector('#site-contact')) {
    siteContactMain.insertAdjacentHTML('beforeend', `
<div class="site-contact" id="site-contact">
<div class="site-contact__desktop">
<section class="contact-demo contact-demo--focus" aria-labelledby="site-contact-title-desktop">
<div class="contact-inner">
<div class="contact-focus-heading">
<header class="contact-heading">
<p class="contact-eyebrow">LET’S TALK</p>
<h2 id="site-contact-title-desktop">${contactEscape(contactContent.heading)}</h2>
<p class="contact-lead">${contactEscape(contactContent.lead)}</p>
</header>
<span class="contact-online">
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" >
<rect x="3" y="6" width="12" height="12" rx="2"/>
<path d="m15 10 6-3v10l-6-3"/>
</svg>
<span>オンライン相談も可能です</span>
</span>
</div>
<div class="contact-focus-grid">
<div class="contact-primary">
<div class="contact-primary-copy">
<p class="contact-eyebrow">CONTACT FORM</p>
<h3>${contactLines(contactContent.title)}</h3>
<p>${contactEscape(contactContent.copy)}</p>
<a class="contact-form-link" href="${contactHref}">
<span>${contactEscape(contactLabel)}</span>
<span class="contact-link-arrow">
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" >
<path d="M5 12h14m-6-6 6 6-6 6"/>
</svg>
</span>
</a>
</div>
<figure class="contact-primary-photo">
<picture>
<source type="image/webp" srcset="${prefix}src/${contactEscape(contactImage)}.webp">
<img src="${prefix}src/${contactEscape(contactImage)}.jpg" alt="${contactEscape(contactImageAlt)}" width="1536" height="1024" loading="lazy" decoding="async">
</picture>
${contactContent.imageNote ? `<figcaption class="nbc-image-note">${contactEscape(contactContent.imageNote)}</figcaption>` : ''}
</figure>
</div>
<div class="contact-secondary">
<div class="contact-channel contact-channel--phone">
<span class="contact-channel__icon">
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" >
<path d="M7 3H4.7C3.8 3 3 3.8 3 4.7 3 13.7 10.3 21 19.3 21c.9 0 1.7-.8 1.7-1.7V17l-5-2-1.8 2.1a14 14 0 0 1-7.3-7.3L9 8 7 3Z"/>
</svg>
</span>
<p class="contact-channel__label">お電話で相談</p>
<a class="contact-phone" href="tel:0344007994">03-4400-7994</a>
<p class="contact-hours">10:00–18:00／水曜定休</p>
</div>
<div class="contact-channel contact-channel--line">
<span class="contact-channel__icon">
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" >
<path d="M21 11.3c0 4.1-4 7.3-9 7.3l-4 2 .5-2.6C5.2 17 3 14.4 3 11.3 3 7.3 7 4 12 4s9 3.3 9 7.3Z"/>
<path d="M8 11h.01M12 11h.01M16 11h.01" stroke-width="2.5"/>
</svg>
</span>
<p class="contact-channel__label">公式LINE</p>
<div class="contact-line-body">
<a class="contact-qr" href="https://liff.line.me/1645278921-kWRPP32q/?accountId=096igviz" target="_blank" rel="noopener" aria-label="公式LINEを開く（新しいタブ）">
<img src="${prefix}src/kagoya-line-qr.webp" alt="KAGOYA公式LINEのQRコード" width="176" height="178" loading="lazy" decoding="async">
</a>
<div>
<p class="contact-channel__note">スマートフォンから<br>ご相談いただけます。</p>
<a class="contact-line-link" href="https://liff.line.me/1645278921-kWRPP32q/?accountId=096igviz" target="_blank" rel="noopener">LINEを開く <span aria-hidden="true">↗</span>
<span class="contact-sr-only">（新しいタブ）</span>
</a>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
</div>
<div class="site-contact__mobile">
<section class="contact-demo contact-demo--cards" aria-labelledby="site-contact-title-mobile">
<div class="contact-inner">
<header class="contact-heading">
<p class="contact-eyebrow">LET’S TALK</p>
<h2 id="site-contact-title-mobile">${contactEscape(contactContent.heading)}</h2>
<p class="contact-lead">${contactEscape(contactContent.lead)}</p>
</header>
<span class="contact-online">
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" >
<rect x="3" y="6" width="12" height="12" rx="2"/>
<path d="m15 10 6-3v10l-6-3"/>
</svg>
<span>オンライン相談も可能です</span>
</span>
<div class="contact-channels">
<div class="contact-channel contact-channel--phone">
<span class="contact-channel__icon">
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" >
<path d="M7 3H4.7C3.8 3 3 3.8 3 4.7 3 13.7 10.3 21 19.3 21c.9 0 1.7-.8 1.7-1.7V17l-5-2-1.8 2.1a14 14 0 0 1-7.3-7.3L9 8 7 3Z"/>
</svg>
</span>
<p class="contact-channel__label">お電話で相談</p>
<a class="contact-phone" href="tel:0344007994">03-4400-7994</a>
<p class="contact-hours">10:00–18:00／水曜定休</p>
</div>
<div class="contact-channel contact-channel--form">
<span class="contact-channel__icon">
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" >
<rect x="3" y="5" width="18" height="14" rx="2"/>
<path d="m3 6 9 7 9-7"/>
</svg>
</span>
<h3 class="contact-channel__label">${contactLines(contactContent.title)}</h3>
<p class="contact-channel__note">${contactEscape(contactContent.copy)}</p>
<a class="contact-form-link" href="${contactHref}">
<span>${contactEscape(contactLabel)}</span>
<span class="contact-link-arrow">
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" >
<path d="M5 12h14m-6-6 6 6-6 6"/>
</svg>
</span>
</a>
</div>
<div class="contact-channel contact-channel--line">
<span class="contact-channel__icon">
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" >
<path d="M21 11.3c0 4.1-4 7.3-9 7.3l-4 2 .5-2.6C5.2 17 3 14.4 3 11.3 3 7.3 7 4 12 4s9 3.3 9 7.3Z"/>
<path d="M8 11h.01M12 11h.01M16 11h.01" stroke-width="2.5"/>
</svg>
</span>
<p class="contact-channel__label">公式LINE</p>
<div class="contact-line-body">
<a class="contact-qr" href="https://liff.line.me/1645278921-kWRPP32q/?accountId=096igviz" target="_blank" rel="noopener" aria-label="公式LINEを開く（新しいタブ）">
<img src="${prefix}src/kagoya-line-qr.webp" alt="KAGOYA公式LINEのQRコード" width="176" height="178" loading="lazy" decoding="async">
</a>
<div>
<p class="contact-channel__note">スマートフォンから<br>ご相談いただけます。</p>
<a class="contact-line-link" href="https://liff.line.me/1645278921-kWRPP32q/?accountId=096igviz" target="_blank" rel="noopener">LINEを開く <span aria-hidden="true">↗</span>
<span class="contact-sr-only">（新しいタブ）</span>
</a>
</div>
</div>
</div>
</div>
</div>
</section>
</div>
${contactRoutes}
</div>`);
  }
  const toggle = document.querySelector('[data-menu-toggle]');
  const shade = document.querySelector('[data-menu-shade]');
  const drawer = document.querySelector('[data-menu-drawer]');

  // 共通ヘッダー：ロゴ → 販売・成約を隣接させたナビ → 相談ボタン。
  const normalizeHeader = () => {
    const makeLink = (mobile = false) => {
      const link = document.createElement('a');
      link.href = `${prefix}sold-properties.html`;
      link.textContent = '成約物件';
      link.setAttribute('data-site-nav', 'sold-properties');
      if (mobile) {
        const small = document.createElement('small');
        small.textContent = 'SOLD';
        link.appendChild(small);
      }
      if (window.location.pathname.endsWith('/sold-properties.html')) link.setAttribute('aria-current', 'page');
      return link;
    };
    const placeSoldAfterSale = (root, mobile = false) => {
      if (!root) return;
      const forSaleLink = [...root.querySelectorAll('a')].find((node) => node.getAttribute('href')?.endsWith('for-sale.html'));
      if (!forSaleLink) return;
      const soldLink = root.querySelector('[data-site-nav="sold-properties"]') || makeLink(mobile);
      if (forSaleLink.nextElementSibling !== soldLink) forSaleLink.after(soldLink);
    };

    document.querySelectorAll('.site-header__main').forEach((main) => {
      const brand = main.querySelector('.site-header__brand');
      if (brand && main.firstElementChild !== brand) main.insertBefore(brand, main.firstElementChild);
      placeSoldAfterSale(main);

      const cta = main.querySelector('.site-header__cta');
      if (!cta) return;
      main.querySelectorAll('.site-header__nav a').forEach((link) => {
        if (link.getAttribute('data-cms-id') === 'common_common-header_A_009' || link.getAttribute('href') === cta.getAttribute('href')) link.classList.add('site-header__nav-contact');
      });
      if (!cta.querySelector('.site-header__cta-label')) {
        const label = cta.textContent.trim();
        cta.innerHTML = '<span class="site-header__cta-label"></span><span class="site-header__cta-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></span>';
        cta.querySelector('.site-header__cta-label').textContent = !label || label === '相談する' ? 'まずは相談する' : label;
      }
    });
    placeSoldAfterSale(drawer?.querySelector('nav'), true);
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
      const ctaLabel = link.querySelector('.site-header__cta-label');
      const current = link.textContent;
      const before = map.defaults.find((label) => current.includes(label));
      if (ctaLabel) ctaLabel.textContent = setting.value === '相談する' ? 'まずは相談する' : setting.value;
      else if (before) replaceText(link, before, setting.value);
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
  }).catch(() => {}).finally(normalizeHeader);

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
