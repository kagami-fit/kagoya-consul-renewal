#!/usr/bin/env python3
"""確定したHP設計書から静的HTMLを再生成する。"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

NAP_NAME = "株式会社籠や"
NAP_ADDRESS = "〒152-0032 東京都目黒区平町1丁目26-17 ソシアル都立大学駅前201号"


def img(name: str, alt: str, cls: str = "", eager: bool = False) -> str:
    stem = name.rsplit(".", 1)[0]
    loading = "eager" if eager else "lazy"
    priority = ' fetchpriority="high"' if eager else ""
    cls_attr = f' class="{cls}"' if cls else ""
    return (
        f'<picture{cls_attr}><source type="image/webp" srcset="src/{stem}.webp">'
        f'<img src="src/{stem}.jpg" alt="{alt}" loading="{loading}" decoding="async"{priority}></picture>'
    )


def header(current: str = "") -> str:
    def nav_link(key: str, href: str, label: str) -> str:
        current_attr = ' aria-current="page"' if current == key else ""
        return f'<a href="{href}"{current_attr}>{label}</a>'

    left_links = "".join(
        [
            nav_link("services", "services.html", "サービス"),
            nav_link("for-sale", "for-sale.html", "販売中物件"),
            nav_link("cases", "cases.html", "相談事例"),
            nav_link("", "insights.html", "読みもの"),
        ]
    )
    right_links = "".join(
        [
            nav_link("team", "team.html", "専門家・チーム"),
            nav_link("about", "about.html", "会社情報"),
            nav_link("", "faq.html", "よくある質問"),
        ]
    )
    drawer_links = [
        ("index.html", "ホーム", "HOME"),
        ("services.html", "サービス", "SERVICES"),
        ("cases.html", "相談事例", "CASES"),
        ("for-sale.html", "販売中物件", "FOR SALE"),
        ("team.html", "専門家・チーム", "TEAM"),
        ("about.html", "会社情報", "ABOUT"),
        ("insights.html", "知る・読みもの", "INSIGHTS"),
        ("privacy.html", "プライバシー", "PRIVACY"),
    ]
    drawer = "".join(f'<a href="{href}">{label}<small>{en}</small></a>' for href, label, en in drawer_links)
    return f'''<!-- ZOROYA:HEADER -->
<header class="site-header">
  <div class="site-header__topbar"><div class="in"><span>売却を急がず、不動産の選択肢を整理する。</span><div class="right"><span>10:00–18:00／木曜定休</span><span class="tel">03-4400-7994</span><a href="contact.html">相談する</a></div></div></div>
  <div class="site-header__main">
    <nav class="site-header__nav is-left" aria-label="主要ナビゲーション（左）">{left_links}</nav>
    <a class="site-header__brand" href="index.html" aria-label="KAGOYA 株式会社籠や トップへ"><picture><source type="image/webp" srcset="src/logo.webp"><img src="src/logo.png" alt="KAGOYA 株式会社籠や" loading="eager" decoding="async"></picture></a>
    <nav class="site-header__nav is-right" aria-label="主要ナビゲーション（右）">{right_links}</nav>
    <a class="site-header__cta" href="contact.html">相談する</a>
    <button class="hamburger" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="メニューを開く"><span></span><span></span><span></span></button>
  </div>
  <div class="site-header__strip"></div>
</header>
<div class="drawer-shade" data-menu-shade></div>
<aside class="drawer" id="mobile-menu" data-menu-drawer aria-hidden="true">
  <nav aria-label="スマートフォンメニュー">{drawer}</nav>
  <div class="drawer-contact"><a class="btn primary" href="contact.html">選択肢を相談する</a><a class="btn ghost" href="tel:0344007994">03-4400-7994</a></div>
</aside>
<!-- /ZOROYA:HEADER -->'''


def footer() -> str:
    return f'''<!-- ZOROYA:FOOTER -->
<footer class="site-footer">
  <div class="site-footer__info">
    <div class="site-footer__nap"><div class="nm">{NAP_NAME}</div><p>不動産売買・仲介・管理、不動産コンサルティング<br>〒152-0032 東京都目黒区平町1丁目26-17<br>ソシアル都立大学駅前201号<br>10:00〜18:00／木曜定休</p><a class="tel" href="tel:0344007994">03-4400-7994</a></div>
    <div class="site-footer__col"><h4>Consulting</h4><a href="sale-consulting.html">売却・調査</a><a href="inheritance-vacant-house.html">相続・空き家</a><a href="purchase-asset.html">購入・資産形成</a><a href="property-management.html">管理・活用</a></div>
    <div class="site-footer__col"><h4>Guide</h4><a href="for-sale.html">販売中物件</a><a href="cases.html">相談事例</a><a href="team.html">専門家・チーム</a><a href="about.html">会社情報</a><a href="insights.html">知る・読みもの</a><a href="privacy.html">プライバシー</a></div>
  </div>
  <div class="site-footer__cp"><div class="in"><span>© KAGOYA Co., Ltd.</span><span>東京都知事（1）第108542号</span></div></div>
</footer>
<!-- /ZOROYA:FOOTER -->'''


def page(title: str, description: str, body: str, current: str = "") -> str:
    return f'''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=Noto+Sans+JP:wght@400;500;600;700&family=Zen+Kaku+Gothic+New:wght@600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/_shared.css">
<link rel="stylesheet" href="assets/css/sample07-theme.css">
<style>.hero{{width: 100%;}}.sig-decoration{{mix-blend-mode:multiply}}.oversized-pull{{font-size:clamp(4rem,8vw,8rem)}}.hero-line{{clip-path:inset(0 0 0 0)}}@media(max-width:768px){{.zoroya-breakpoint{{display:block}}}}</style>
</head>
<body class="sample07-subpage">
<a class="skip-link" href="#main">本文へスキップ</a>
{header(current)}
<!-- ZOROYA:MAIN -->
<main id="main">{body}</main>
<!-- /ZOROYA:MAIN -->
{footer()}
<script src="assets/js/site.js"></script>
</body>
</html>
'''


def faq_items() -> str:
    items = [
        ("まだ売ると決めていなくても相談できますか。", "できます。売却前に状況と選択肢を整理するための相談です。"),
        ("資料がそろっていなくても大丈夫ですか。", "分かる範囲から伺います。所在地や権利関係など、確認が必要な情報をご案内します。"),
        ("相続した空き家も相談できますか。", "相談できます。利用状況、権利関係、管理負担などを確認し、売却・保有・活用の可能性を整理します。"),
        ("権利関係が複雑な不動産にも対応できますか。", "内容を確認し、不動産の実務に加えて専門家との連携が必要かを判断します。"),
        ("購入予定物件の相談もできますか。", "できます。利点だけでなく、条件やリスクも比較できる状態に整理します。"),
        ("費用はいつ分かりますか。", "相談内容と必要な調査・実行業務を確認し、費用が発生する前に内容と金額をご説明します。"),
        ("どこから相談できますか。", "電話、メール、公式お問い合わせフォームからご連絡いただけます。"),
    ]
    return "".join(f'<details class="faq-item"><summary>{q}</summary><div class="faq-answer"><p>{a}</p></div></details>' for q, a in items)


LISTINGS = [
    {
        "category": "residential",
        "category_label": "土地建物・マンション",
        "title": "コスモシティ川越 1階",
        "place": "埼玉県川越市脇田本町",
        "access": "東武東上線「川越」駅 徒歩5分",
        "price": "5,120万円",
        "area": "85.12㎡",
        "note": "",
        "image": "listing-cosmo-kawagoe.jpg",
        "alt": "コスモシティ川越1階の現行公式掲載写真",
        "url": "https://kagoya-consul.co.jp/sale/cosumosithykawagoe5120/",
        "image_note": "",
    },
    {
        "category": "residential",
        "category_label": "土地建物・マンション",
        "title": "藤和シティコープ初台",
        "place": "東京都渋谷区初台1-33-3",
        "access": "京王新線「初台」駅 徒歩5分／小田急線「参宮橋」駅 徒歩13分",
        "price": "8,933万円",
        "area": "61.85㎡",
        "note": "",
        "image": "listing-hatsudai.jpg",
        "alt": "藤和シティコープ初台の現行公式掲載写真",
        "url": "https://kagoya-consul.co.jp/sale/touwashityikopuhatudai/",
        "image_note": "",
    },
    {
        "category": "income",
        "category_label": "一棟収益",
        "title": "ハイム矢口台",
        "place": "神奈川県横浜市中区矢口台112-2",
        "access": "JR根岸線「山手」駅 徒歩7分",
        "price": "8,900万円",
        "area": "建物322.11㎡／土地267.76㎡",
        "note": "総戸数6戸（1LDK／2DK）",
        "image": "listing-heim-yaguchidai.jpg",
        "alt": "ハイム矢口台の現行公式掲載写真",
        "url": "https://kagoya-consul.co.jp/sale/haimuyakouguthi8900/",
        "image_note": "",
    },
    {
        "category": "income",
        "category_label": "一棟収益",
        "title": "杉田一丁目店舗ビル",
        "place": "神奈川県横浜市磯子区杉田1-12-28",
        "access": "京急本線「杉田」駅／JR根岸線「新杉田」駅 各徒歩5分",
        "price": "1億2,500万円",
        "area": "建物269.79㎡／土地129.75㎡",
        "note": "表面利回り7.37％（現況満室）",
        "image": "listing-sugita-building.jpg",
        "alt": "杉田一丁目店舗ビルの現行公式掲載写真",
        "url": "https://kagoya-consul.co.jp/sale/sugitaittyoumetennpobill12500/",
        "image_note": "",
    },
    {
        "category": "income",
        "category_label": "一棟収益",
        "title": "未公開物件",
        "place": "詳細は個別にご案内",
        "access": "京急本線「弘明寺」駅 徒歩20分超",
        "price": "価格未公開",
        "area": "詳細非公開",
        "note": "一棟収益物件は、主に未公開物件を扱っています。",
        "image": "gen-for-sale.jpg",
        "alt": "住宅と集合住宅が混在する街並みのイメージ",
        "url": "https://kagoya-consul.co.jp/sale/gumyouziapart/",
        "image_note": "イメージ画像",
    },
]


def listing_cards(items: list[dict]) -> str:
    cards = []
    for item in items:
        image_note = f'<span class="listing-image-note">{item["image_note"]}</span>' if item["image_note"] else ""
        note = f'\n    <p class="listing-note">{item["note"]}</p>' if item["note"] else ""
        cards.append(f'''<article class="listing-card">
  <div class="listing-card__image">{img(item["image"], item["alt"])}{image_note}</div>
  <div class="listing-card__body">
    <span class="listing-type">{item["category_label"]}</span>
    <h3>{item["title"]}</h3>
    <p class="listing-price">{item["price"]}</p>
    <dl><div><dt>所在地</dt><dd>{item["place"]}</dd></div><div><dt>交通</dt><dd>{item["access"]}</dd></div><div><dt>面積</dt><dd>{item["area"]}</dd></div></dl>{note}
    <a class="listing-link" href="{item["url"]}" target="_blank" rel="noopener">公式の物件詳細を見る <span aria-hidden="true">↗</span></a>
  </div>
</article>''')
    return "".join(cards)


INDEX = f'''
<section class="hero" data-hero>
  <div class="hero-inner">
    <div class="hero-copy reveal reveal--intro">
      <span class="eyebrow">KAGOYA REAL ESTATE CONSULTING</span>
      <h1><span>売る前に、</span><br><em>知る。</em><br><span>選択肢はそこから。</span></h1>
      <p class="lead">不動産の状況・価値・リスクを整理し、納得できる判断を支えます。</p>
      <div class="hero-actions"><a class="btn" href="contact.html">売る前に、選択肢を相談する</a><a class="btn btn-outline" href="cases.html">相談事例を見る</a></div>
      <div class="hero-proof"><span>東京都目黒区</span><span>東京都知事（1）第108542号</span><span>資料が未整理でも相談可能</span></div>
    </div>
    <div class="hero-visual">{img("gen-hero.jpg", "住宅模型と資料を置いた明るい住まいから東京の街を望むイメージ", eager=True)}<span class="hero-caption">SITUATION / VALUE / OPTIONS / RISK</span><span class="hero-line"></span></div>
  </div>
</section>

<section class="c-section">
  <span class="sig-corner sig-corner--tl sig-decoration"></span>
  <div class="wrap empathy-grid">
    <div><span class="kicker">Before price</span><div class="empathy-pull oversized-pull">知る</div></div>
    <div class="empathy-copy reveal"><h2>価格だけでは決められない不動産があります。</h2><p>相続、空き家、共有、接道、管理、収益性。ひとつの査定額だけでは、残すべき選択肢まで見えないことがあります。KAGOYAは、売却の結論を急ぐ前に、判断に必要な材料を整理します。</p></div>
  </div>
</section>

<section class="c-section c-section--soft">
  <div class="wrap knowledge">
    <div class="knowledge-visual reveal">{img("gen-sale.jpg", "住宅模型と資料を使って不動産の価値と選択肢を検討するイメージ")}</div>
    <div><span class="eyebrow">Four viewpoints</span><h2>状況・価値・選択肢・リスクを、順番に見える化します。</h2><ol class="knowledge-list"><li><b>01</b><div><strong>状況を知る</strong><span>所在地、利用状態、権利関係、希望時期を確認します。</span></div></li><li><b>02</b><div><strong>価値を知る</strong><span>市場だけでなく、条件や活用可能性まで見ます。</span></div></li><li><b>03</b><div><strong>選択肢を知る</strong><span>売却・保有・管理・活用を同じ土俵で比べます。</span></div></li><li><b>04</b><div><strong>リスクを知る</strong><span>必要な手続き、時間、費用、将来の注意点を言葉にします。</span></div></li></ol></div>
  </div>
</section>

<section class="c-section">
  <div class="wrap reason-grid">
    <div class="reason-image">{img("gen-consultation.jpg", "不動産について相談する夫婦と担当者のイメージ")}</div>
    <div><span class="eyebrow">Connected support</span><h2>一つの相談を、必要な支援へつなぎます。</h2><div class="reason-index"><article class="reason-row"><span class="no">01</span><div><h3>調べるところから始める</h3><p>査定額の提示だけで終わらず、判断を変える条件がないかを整理します。</p></div></article><article class="reason-row"><span class="no">02</span><div><h3>選択肢を並べて説明する</h3><p>売る・持つ・貸す・整える。それぞれの利点と注意点を比較します。</p></div></article><article class="reason-row"><span class="no">03</span><div><h3>必要に応じて専門家へつなぐ</h3><p>法務、税務、資金計画など、不動産だけで完結しない課題を一つの窓口から整理します。</p></div></article></div></div>
  </div>
</section>

<section class="c-section c-section--soft">
  <div class="wrap">
    <div class="service-feature">
      <div class="service-feature__image">{img("gen-investment.jpg", "集合住宅模型と資料を使って資産計画を検討するイメージ")}</div>
      <div class="service-feature__copy"><span class="kicker">Services</span><h2>相談内容に合わせて、必要な道筋を組み立てます。</h2><p>ひとつのサービスへ当てはめるのではなく、目の前の状況から必要な確認と支援を組み合わせます。</p><div class="service-index"><a href="sale-consulting.html"><span class="no">01</span><strong>売却・調査相談</strong><span class="arr">↗</span></a><a href="inheritance-vacant-house.html"><span class="no">02</span><strong>相続・空き家相談</strong><span class="arr">↗</span></a><a href="purchase-asset.html"><span class="no">03</span><strong>購入・資産形成相談</strong><span class="arr">↗</span></a><a href="property-management.html"><span class="no">04</span><strong>管理・活用相談</strong><span class="arr">↗</span></a></div></div>
    </div>
    <div class="service-secondary"><a href="corporate-benefits.html"><small>FOR COMPANY</small><h3>法人向け不動産相談</h3><p>従業員の住まいや資産形成を支える福利厚生の選択肢。</p></a><a href="services.html"><small>ALL SERVICES</small><h3>サービス全体を見る</h3><p>相談領域と進め方を一覧で確認できます。</p></a></div>
  </div>
</section>

<section class="c-section">
  <div class="wrap">
    <div class="section-head section-head--split"><div><span class="kicker">For sale</span><h2>現在、販売中の物件。</h2></div><div><p class="lead">居住用マンションから一棟収益まで、現在公開中の情報をご案内します。</p><a class="text-link" href="for-sale.html">販売中物件をすべて見る</a></div></div>
    <div class="listing-grid listing-grid--featured">{listing_cards(LISTINGS[:3])}</div>
    <p class="small-note">情報更新日：2026年8月11日。最新の募集状況・条件は各物件の公式詳細ページでご確認ください。</p>
  </div>
</section>

<section class="c-section">
  <span class="sig-corner sig-corner--br sig-decoration"></span>
  <div class="wrap proof-layout">
    <div class="proof-intro"><span class="eyebrow">Case note</span><h2>難しい案件ほど、調査と対話を重ねます。</h2><div class="proof-pull">9<small>筆の土地を整理した一例</small></div><p>複数の所有者と条件を一つずつ確認し、約1年半かけて調整した事例を会社案内で紹介しています。</p><a class="text-link" href="cases.html">相談事例を詳しく見る</a></div>
    <div><div class="proof-gallery"><figure>{img("gen-site-survey.jpg", "住宅地で敷地条件を調査するイメージ")}<figcaption>SITE / 現地と境界条件を確認</figcaption></figure><figure>{img("gen-finance.jpg", "図面と資料を精査するイメージ")}<figcaption>REVIEW / 資料と条件を整理</figcaption></figure><figure>{img("gen-renovation.jpg", "改修後の明るい住戸イメージ")}<figcaption>USE / 活用可能性を検討</figcaption></figure></div><div class="proof-story"><h3>成果の数字より、判断できる状態をつくる。</h3><p>事例の条件や結果は物件ごとに異なります。ここでお伝えしたいのは、複雑さをそのままにせず、所有者の意思・法的条件・市場性を分けて考える姿勢です。</p></div></div>
  </div>
</section>

<section class="c-section c-section--soft">
  <div class="wrap message-layout">
    <div class="message-photo">{img("gen-consultation.jpg", "不動産の選択肢を相談する夫婦と担当者のイメージ")}</div>
    <div class="message-copy"><span class="eyebrow">Message</span><h2>売却の前に、納得できる判断を支えたい。</h2><blockquote>分からないまま決めさせない。選択肢と注意点を、言葉にしてお伝えします。</blockquote><p>不動産には、一つとして同じ条件のものがありません。だからこそ、答えを急ぐ前に状況を知り、理由を理解し、自分で選べる土台をつくることを大切にしています。</p><p class="message-sign">代表取締役　内田 豊</p><a class="text-link" href="team.html">相談体制を見る</a></div>
  </div>
</section>

<section class="c-section">
  <div class="wrap"><div class="section-head"><span class="kicker">Cost clarity</span><h2>費用が発生するタイミングを、先にお伝えします。</h2><p class="lead">必要な業務は物件の状況によって変わります。調査や専門家対応など追加の費用が必要になる場合は、実行前に内容と金額をご説明します。</p></div><div class="fee-table"><div class="fee-row"><h3>最初の状況確認</h3><p>分かる範囲でお話を伺い、次に確認したい資料や情報をご案内します。</p></div><div class="fee-row"><h3>調査・実行の提案</h3><p>必要な作業、専門家連携、想定する進め方を整理します。</p></div><div class="fee-row"><h3>費用の説明</h3><p>費用が発生する業務は、内容と金額をご確認いただいてから進めます。</p></div></div><p class="small-note">※具体的な費用はご相談内容により異なります。個別にご説明します。</p></div>
</section>

<section class="c-section c-section--main">
  <div class="wrap"><div class="section-head"><span class="eyebrow" style="color:#8FC4D4">Process</span><h2>初めから、売ると決めていなくても構いません。</h2></div><div class="flow-list"><article class="flow-step"><h3>相談</h3><p>電話・メール・フォームから、物件と迷っていることを共有します。</p></article><article class="flow-step"><h3>情報確認</h3><p>所在地、利用状態、権利関係、ご希望の時期などを確認します。</p></article><article class="flow-step"><h3>分析</h3><p>価値を左右する条件と、注意すべきリスクを整理します。</p></article><article class="flow-step"><h3>選択肢・実行</h3><p>売却・保有・管理・活用を比べ、納得した方針で進めます。</p></article></div><div class="flow-art">{img("gen-finance.jpg", "図面・予定・費用を確認しながら不動産の条件を整理するイメージ")}</div></div>
</section>

<section class="c-section">
  <div class="wrap faq-layout"><div class="faq-sticky"><span class="eyebrow">FAQ</span><h2>相談前の、よくある質問。</h2><p>売却を決める前に気になることへ、先にお答えします。</p><a class="text-link" href="contact.html">それ以外を相談する</a></div><div class="faq-list">{faq_items()}</div></div>
</section>

<section class="final-cta">
  <div class="final-cta__bg">{img("gen-renovation.jpg", "不動産の改修と活用を想起させる明るい住戸イメージ")}</div>
  <div class="final-cta__inner"><div class="final-cta__card"><span class="kicker">Start with knowing</span><h2>まずは、状況を知ることから。</h2><p>売るかどうかは、その後で決められます。資料がそろっていなくても、分かる範囲からお聞かせください。</p><div class="hero-actions"><a class="btn" href="contact.html">売る前に、選択肢を相談する</a><a class="btn btn-outline" href="tel:0344007994">電話 03-4400-7994</a></div></div></div>
</section>
'''


def page_hero(en: str, title: str, lead: str, art: str, alt: str) -> str:
    return f'''<section class="page-hero"><div class="wrap page-hero__grid"><div><p class="crumb"><a href="index.html">ホーム</a> ／ {title}</p><span class="eyebrow">{en}</span><h1>{title}</h1><p class="lead">{lead}</p></div><div class="page-hero__art">{img(art, alt)}</div></div></section>'''


def service_detail(en: str, title: str, lead: str, art: str, alt: str, pull: str, intro: str, checks: list[tuple[str, str]], outcomes: list[tuple[str, str]]) -> str:
    check_html = "".join(f'<div class="numbered-row"><h3>{h}</h3><p>{p}</p></div>' for h, p in checks)
    out_html = "".join(f'<article class="info-card"><h3>{h}</h3><p>{p}</p></article>' for h, p in outcomes)
    return page_hero(en, title, lead, art, alt) + f'''
<section class="page-sec"><div class="wrap page-intro"><div class="page-intro__pull">{pull}</div><div class="page-intro__body"><span class="eyebrow">Our approach</span><h2>結論を急ぐ前に、判断の材料をそろえます。</h2><p>{intro}</p></div></div></section>
<section class="page-sec alt"><div class="wrap"><div class="section-head"><span class="eyebrow">What we check</span><h2>最初に確認すること</h2></div><div class="numbered-list">{check_html}</div></div></section>
<section class="page-sec"><div class="wrap"><div class="section-head"><span class="eyebrow">What you gain</span><h2>相談後に目指す状態</h2></div><div class="content-grid">{out_html}</div></div></section>
<section class="page-sec"><div class="wrap"><div class="mini-cta"><div><h2>分かる範囲から相談する</h2><p>資料が未整理でも構いません。必要な確認事項からご案内します。</p></div><a class="btn btn-light" href="contact.html">選択肢を相談する</a></div></div></section>'''


SERVICES = page_hero("Services", "サービス", "相談内容に合わせて、必要な道筋を組み立てます。", "gen-sale.jpg", "住宅模型と資料を使って不動産の価値と選択肢を検討するイメージ") + '''
<section class="page-sec"><div class="wrap page-intro"><div class="page-intro__pull">6</div><div class="page-intro__body"><span class="eyebrow">One desk</span><h2>不動産を起点に、判断に必要な支援をつなぎます。</h2><p>売却だけ、管理だけと区切る前に、今の状況と将来の希望を確認します。複数の選択肢があるときは、条件とリスクを比べられる形に整理します。</p></div></div></section>
<section class="page-sec alt"><div class="wrap"><div class="numbered-list"><a class="numbered-row" href="sale-consulting.html"><h3>売却・調査相談</h3><p>価値を左右する条件を調べ、売却・保有・活用を比較します。</p></a><a class="numbered-row" href="inheritance-vacant-house.html"><h3>相続・空き家相談</h3><p>名義、共有、管理負担、期限などを整理します。</p></a><a class="numbered-row" href="purchase-asset.html"><h3>購入・資産形成相談</h3><p>物件の利点とリスク、資金計画を一緒に確認します。</p></a><a class="numbered-row" href="property-management.html"><h3>管理・活用相談</h3><p>空室、修繕、賃貸管理、将来の活用方法を整理します。</p></a><a class="numbered-row" href="corporate-benefits.html"><h3>法人向け不動産相談</h3><p>従業員の住まいと資産形成を福利厚生へつなげます。</p></a><a class="numbered-row" href="team.html"><h3>専門家連携</h3><p>法務・税務・資金計画など、必要な領域へつなぎます。</p></a></div></div></section>
<section class="page-sec"><div class="wrap image-split"><div class="image-split__image">''' + img("gen-inheritance.jpg", "相続した住まいと鍵・資料を整理するイメージ") + '''</div><div class="image-split__body"><span class="eyebrow">Not one answer</span><h2>売ることだけが、相談の出口ではありません。</h2><p>保有、管理、賃貸、改修、売却。時間や費用を含めて比較し、納得できる方針を選ぶための土台をつくります。</p><a class="btn" href="contact.html">相談を始める</a></div></div></section>'''


DETAILS = {
    "sale-consulting.html": ("Sale consulting", "不動産売却・調査相談", "価格だけで決める前に、条件と可能性を確認します。", "gen-sale.jpg", "住宅模型と資料を使って不動産の価値を検討するイメージ", "売る前", "査定は判断材料の一つです。接道、建築条件、権利関係、利用状態などを確認し、売却以外の可能性も含めて考えます。", [("物件の現況", "利用状態、管理状況、修繕の必要性を確認します。"), ("権利・法的条件", "登記、接道、境界、共有など、価値と実行に関わる条件を整理します。"), ("市場と活用可能性", "売却時の見え方に加え、保有・賃貸・改修の可能性を比較します。")], [("理由を説明できる", "価格や方針の根拠が分かり、家族や共有者と話しやすくなります。"), ("売り急がずに決められる", "希望時期と負担を踏まえ、進め方を選べる状態を目指します。")]),
    "inheritance-vacant-house.html": ("Inheritance & vacant house", "相続・空き家相談", "名義・共有・管理負担を整理し、次の判断へつなぎます。", "gen-inheritance.jpg", "相続した住まいと鍵・資料を整理するイメージ", "相続後", "相続不動産は、家族の意向、期限、維持費が同時に動きます。売却の前に、誰が何を判断するのかを一つずつ整理します。", [("所有者と共有者", "登記名義と関係者の意向を確認します。"), ("空き家の状態", "建物、設備、近隣への影響、維持費を確認します。"), ("期限と専門家", "税務・法務の確認が必要な項目を切り分けます。")], [("家族で話す材料ができる", "感情と実務を分け、共通の判断材料をつくります。"), ("売却以外も比べられる", "保有、管理、活用、売却を同じ条件で比較します。")]),
    "purchase-asset.html": ("Purchase & asset", "不動産購入・資産形成相談", "良い面だけでなく、見えにくい条件とリスクも確認します。", "gen-purchase.jpg", "購入条件を相談する夫婦と担当者のイメージ", "買う前", "購入予定の不動産は、立地や価格だけでなく、収益性、修繕、融資、出口まで含めて判断する必要があります。", [("物件条件", "構造、築年、法的条件、修繕履歴を確認します。"), ("収支と資金計画", "収入、支出、空室、融資条件を整理します。"), ("将来の出口", "保有期間、売却可能性、変更しにくい条件を確認します。")], [("利点と注意点を比べられる", "購入後に気づきやすい負担も事前に整理します。"), ("生活全体で判断できる", "住まい・教育・老後など資金計画との関係も考えます。")]),
    "property-management.html": ("Management & use", "不動産管理・活用相談", "一室から一棟まで、持ち続けるための課題を整理します。", "gen-management.jpg", "丁寧に管理された集合住宅のイメージ", "持つ間", "管理は集金や連絡だけではありません。空室、修繕、入居者対応、将来の売却まで含めて、負担と価値の両方を見ます。", [("管理状態", "契約、入居、修繕、清掃、連絡体制を確認します。"), ("収支と空室", "固定費、修繕費、募集条件、稼働状況を整理します。"), ("中長期の方針", "保有、改修、売却の判断時期を考えます。")], [("優先順位が分かる", "今すぐ必要な対応と、後で検討できることを分けます。"), ("管理と出口をつなげる", "持ち続けることと将来の売却を別々に考えません。")]),
    "corporate-benefits.html": ("Corporate benefits", "法人向け不動産相談", "従業員の住まいと資産形成を支える選択肢をご提案します。", "gen-consultation.jpg", "不動産について相談する夫婦と担当者のイメージ", "従業員支援", "住宅購入や資産形成は、従業員にとって大きな意思決定です。企業の福利厚生の一つとして、不動産と資金計画を相談できる窓口を整えます。", [("制度の目的", "対象者、利用場面、社内案内の方法を確認します。"), ("相談領域", "住まいの購入、売却、資産形成など必要な範囲を整理します。"), ("運用方法", "個別相談へのつなぎ方と、個人情報の扱いを確認します。")], [("従業員の判断を支えられる", "営業ではなく、条件比較と理解を助ける機会をつくります。"), ("社内の相談先が明確になる", "不動産の悩みを抱え込まず、専門窓口へつなげます。")]),
}


CASES = page_hero("Cases", "相談事例", "難しい案件ほど、状況を分けて考えます。", "gen-site-survey.jpg", "住宅地で敷地条件を調査するイメージ") + f'''
<section class="page-sec"><div class="wrap page-intro"><div class="page-intro__pull">9筆</div><div class="page-intro__body"><span class="eyebrow">Rights coordination</span><h2>複数所有者の意思と条件を、一つずつ整理。</h2><p>会社案内で紹介している、複数所有者の土地を調整した一例です。約1年半をかけて現地、権利関係、所有者の意向、実行条件を確認しました。</p><div class="notice">事例の結果は個別条件によって異なります。同じ結果を保証するものではなく、調査・調整の考え方をご紹介しています。</div></div></div></section>
<section class="page-sec alt"><div class="wrap"><div class="case-board"><figure>{img("gen-site-survey.jpg", "住宅地で敷地条件を調査するイメージ")}<figcaption>01 / 現地と境界条件を確認</figcaption></figure><figure>{img("gen-finance.jpg", "図面と資料を精査するイメージ")}<figcaption>02 / 資料と費用条件を整理</figcaption></figure><figure>{img("gen-renovation.jpg", "改修後の住戸イメージ")}<figcaption>03 / 利用状態と活用可能性を検討</figcaption></figure></div></div></section>
<section class="page-sec"><div class="wrap"><div class="section-head"><span class="eyebrow">Process</span><h2>複雑さを、順番にほどく。</h2></div><div class="numbered-list"><div class="numbered-row"><h3>現地と資料の確認</h3><p>図面、登記、現況を見比べ、事実をそろえます。</p></div><div class="numbered-row"><h3>関係者の整理</h3><p>誰の意思と同意が必要かを明確にします。</p></div><div class="numbered-row"><h3>条件の比較</h3><p>実行可能性、時間、費用、リスクを比べます。</p></div><div class="numbered-row"><h3>合意と実行</h3><p>説明と対話を重ね、納得できる方針へ進みます。</p></div></div></div></section>
<section class="page-sec"><div class="wrap"><div class="mini-cta"><div><h2>似た状況かもしれない、という段階から。</h2><p>資料がそろっていなくても、分かることからお聞かせください。</p></div><a class="btn btn-light" href="contact.html">状況を相談する</a></div></div></section>'''


TEAM = page_hero("Team", "専門家・チーム", "不動産を起点に、必要な専門知識へつなぎます。", "gen-consultation.jpg", "不動産について相談する夫婦と担当者のイメージ") + f'''
<section class="page-sec"><div class="wrap profile-grid"><div>{img("gen-consultation.jpg", "不動産の選択肢を相談する夫婦と担当者のイメージ")}</div><div><span class="eyebrow">Representative message</span><h2>売却の前に、納得できる判断を支えたい。</h2><p>不動産には、一つとして同じ条件のものがありません。分からないまま決めるのではなく、状況と理由を理解し、自分で選べる状態をつくる。そのために、調査と対話を大切にしています。</p><blockquote style="margin:32px 0;padding:24px 0;border-top:1px solid var(--main);border-bottom:1px solid var(--line);font-size:1.4rem;font-weight:700;color:var(--main)">分からないまま決めさせない。選択肢と注意点を言葉にしてお伝えします。</blockquote><p class="message-sign">代表取締役　内田 豊</p><p class="small-note">※写真は相談風景のイメージです。</p></div></div></section>
<section class="page-sec alt"><div class="wrap"><div class="section-head"><span class="eyebrow">Network</span><h2>一つの窓口から、必要な専門家へ。</h2><p class="lead">案件の内容に応じて、法務・税務・ファイナンシャルプランニングなどの確認が必要かを切り分けます。</p></div><div class="content-grid"><article class="info-card"><h3>法務・権利関係</h3><p>登記、相続、共有など、不動産実務だけで判断できない項目を整理します。</p></article><article class="info-card"><h3>税務・資金計画</h3><p>税金、手取り、融資、ライフプランなど、金額の背景まで確認します。</p></article><article class="info-card"><h3>建築・活用</h3><p>改修、建築、賃貸、管理など、売却以外の実行可能性を検討します。</p></article><article class="info-card"><h3>不動産実務</h3><p>売買、仲介、管理を一つにつなぎ、判断から実行まで伴走します。</p></article></div><p class="small-note">※個別の専門家・提携先は、ご相談内容と許諾状況に応じてご案内します。</p></div></section>'''


ABOUT = page_hero("About", "会社情報", "不動産は、まず“知る”こと。", "gen-company.jpg", "不動産相談スペースのイメージ") + f'''
<section class="page-sec"><div class="wrap page-intro"><div class="page-intro__pull">KAGOYA</div><div class="page-intro__body"><span class="eyebrow">Company</span><h2>不動産を中心に、あらゆる選択肢をつくる会社。</h2><p>{NAP_NAME}は、東京都目黒区を拠点に、不動産の状況・価値・選択肢・リスクを整理し、売却・購入・管理・相続などの判断を支える不動産コンサルティング会社です。</p></div></div></section>
<section class="page-sec alt"><div class="wrap"><div class="section-head"><span class="eyebrow">Company profile</span><h2>会社概要</h2></div><table class="company-table"><tbody><tr><th>会社名</th><td>{NAP_NAME}</td></tr><tr><th>代表者</th><td>代表取締役 内田 豊</td></tr><tr><th>所在地</th><td>{NAP_ADDRESS}</td></tr><tr><th>電話</th><td><a href="tel:0344007994">03-4400-7994</a></td></tr><tr><th>FAX</th><td>03-4400-7995</td></tr><tr><th>メール</th><td><a href="mailto:info@kagoya-consul.com">info@kagoya-consul.com</a></td></tr><tr><th>営業時間</th><td>10:00〜18:00／定休日：木曜日</td></tr><tr><th>設立</th><td>令和3年2月1日</td></tr><tr><th>資本金</th><td>3,000,000円</td></tr><tr><th>宅建業免許</th><td>東京都知事（1）第108542号</td></tr><tr><th>事業内容</th><td>不動産売買・仲介・管理、不動産コンサルティング</td></tr></tbody></table></div></section>
<section class="page-sec"><div class="wrap"><div class="mini-cta"><div><h2>売る前の相談から、お聞かせください。</h2><p>状況を知り、選択肢を比較するところから始めます。</p></div><a class="btn btn-light" href="contact.html">お問い合わせ</a></div></div></section>'''


INSIGHTS = page_hero("Insights", "知る・読みもの", "不動産の判断を急ぐ前に、確認したいこと。", "gen-finance.jpg", "図面・予定・費用を確認しながら不動産の条件を整理するイメージ") + '''
<section class="page-sec"><div class="wrap"><div class="section-head"><span class="eyebrow">Latest articles</span><h2>状況・価値・選択肢・リスクを知る。</h2></div><div class="article-index"><a href="blog/inherited-property-first-steps.html"><time datetime="2026-08-02">2026.08.02</time><h3>不動産を相続したら最初に整理したい5つのこと</h3><span class="tag">相続・空き家</span></a><a href="blog/rebuild-impossible-property.html"><time datetime="2026-08-02">2026.08.02</time><h3>再建築不可物件は売れない？確認したい4つの条件</h3><span class="tag">売却・調査</span></a><a href="blog/check-before-price-cut.html"><time datetime="2026-08-02">2026.08.02</time><h3>不動産の価格を下げる前に確認したい6項目</h3><span class="tag">売却・調査</span></a></div></div></section>
<section class="page-sec alt"><div class="wrap page-intro"><div class="page-intro__pull">4</div><div class="page-intro__body"><span class="eyebrow">Editorial policy</span><h2>結論ではなく、判断の順番を伝える。</h2><p>この読みものでは、個別の物件について一つの答えを断定しません。何を確認し、誰へ相談し、どの条件を比較するかを整理します。</p></div></div></section>'''


FOR_SALE = page_hero("For sale", "販売中の物件", "居住用から一棟収益まで、現在公開中の情報をご案内します。", "gen-for-sale.jpg", "住宅と集合住宅が混在する街並みのイメージ") + f'''
<section class="page-sec listing-intro"><div class="wrap page-intro"><div class="page-intro__pull">5件</div><div class="page-intro__body"><span class="eyebrow">Current listings</span><h2>現在公開中の物件情報です。</h2><p>価格・面積・募集状況は、株式会社籠やの現行公式サイトに基づき2026年8月11日時点で整理しています。条件は変更されることがあるため、検討時は各物件の公式詳細ページをご確認ください。</p><nav class="listing-categories" aria-label="物件カテゴリ"><a href="#residential">土地建物・マンション <span>2</span></a><a href="#income">一棟収益 <span>3</span></a></nav></div></div></section>
<section class="page-sec alt" id="residential"><div class="wrap"><div class="listing-heading"><div><span class="eyebrow">Residential</span><h2>販売中物件<br>土地建物・マンション</h2></div><p>住み心地だけでなく、建物の状態や管理、将来の売却可能性まで含めてご相談いただけます。</p></div><div class="listing-grid">{listing_cards([item for item in LISTINGS if item["category"] == "residential"])}</div></div></section>
<section class="page-sec" id="income"><div class="wrap"><div class="listing-heading"><div><span class="eyebrow">Income property</span><h2>販売中物件<br>一棟収益</h2></div><p>現況収入だけでなく、修繕、空室、融資、出口まで整理して判断を支えます。</p></div><div class="listing-grid">{listing_cards([item for item in LISTINGS if item["category"] == "income"])}</div></div></section>
<section class="page-sec listing-source"><div class="wrap"><div class="notice"><strong>掲載情報について</strong><p>物件写真4枚は、対象を正確に伝えるため現行公式サイトの掲載写真を使用しています。未公開物件とページ上部の街並みは新規生成したイメージ画像です。価格・面積・利回り・販売状況は変更または成約となる場合があります。</p><a class="text-link" href="https://kagoya-consul.co.jp/sale/" target="_blank" rel="noopener">現行公式サイトの販売中物件一覧を見る ↗</a></div><div class="mini-cta"><div><h2>気になる物件を、条件から相談する。</h2><p>購入判断や資金計画も含めて、分かる範囲からお聞かせください。</p></div><a class="btn btn-light" href="contact.html">物件について相談する</a></div></div></section>'''

PROPERTIES = FOR_SALE


CONTACT = page_hero("Contact", "お問い合わせ", "売ると決める前の段階から、分かる範囲でお聞かせください。", "gen-consultation.jpg", "不動産について相談する夫婦と担当者のイメージ") + f'''
<section class="page-sec"><div class="wrap contact-grid"><aside class="contact-panel"><span class="eyebrow">By phone</span><h2>お電話で相談</h2><a class="contact-phone" href="tel:0344007994">03-4400-7994</a><p>受付 10:00〜18:00<br>定休日：木曜日</p><div class="notice">所在地、現在の利用状況、ご希望の時期が分かると相談がスムーズです。分からない項目はそのままで構いません。</div><h3 style="margin-top:34px">所在地</h3><p>{NAP_ADDRESS}</p><h3>メール</h3><p><a href="mailto:info@kagoya-consul.com">info@kagoya-consul.com</a></p></aside><div><span class="eyebrow">Inquiry form</span><h2>公式フォームで相談</h2><!-- ZOROYA:CONTACTFORM --><div class="form-bridge"><p>お問い合わせは、株式会社籠やの公式フォームで受け付けています。</p><div class="form-bridge__topics"><span>売却・調査</span><span>相続・空き家</span><span>購入・資産形成</span><span>管理・活用</span><span>法人向け</span></div><p>お名前、ご連絡先、物件の所在地、ご相談内容を入力できます。分かる範囲だけで構いません。</p><a class="btn" href="https://kagoya-consul.co.jp/contactus/" target="_blank" rel="noopener">公式お問い合わせフォーム</a><p class="form-bridge__note">公式サイトの入力画面が新しいタブで開きます。</p></div><!-- /ZOROYA:CONTACTFORM --></div></div></section>
<section class="page-sec alt"><div class="wrap"><div class="section-head"><span class="eyebrow">Before contact</span><h2>ご相談前に</h2></div><div class="numbered-list"><div class="numbered-row"><h3>売却を決めていなくても構いません</h3><p>状況と選択肢を知るための相談です。</p></div><div class="numbered-row"><h3>資料がなくても始められます</h3><p>必要な資料や確認先を順番にご案内します。</p></div><div class="numbered-row"><h3>費用は実行前に説明します</h3><p>必要な業務と費用をご確認いただいてから進めます。</p></div></div></div></section>'''


PRIVACY = page_hero("Privacy", "プライバシーポリシー", "お預かりする情報を適切に取り扱います。", "gen-company.jpg", "不動産相談スペースのイメージ") + f'''
<section class="page-sec"><div class="wrap" style="max-width:860px"><div class="numbered-list"><div class="numbered-row"><h3>個人情報の取得</h3><p>お問い合わせ、相談、取引などに必要な範囲で、適正な方法により個人情報を取得します。</p></div><div class="numbered-row"><h3>利用目的</h3><p>ご相談への回答、不動産サービスの提供、契約手続き、法令上必要な対応、ご案内のために利用します。</p></div><div class="numbered-row"><h3>第三者提供</h3><p>法令に基づく場合または本人の同意がある場合を除き、個人情報を第三者へ提供しません。</p></div><div class="numbered-row"><h3>安全管理</h3><p>漏えい、滅失、改ざん等を防ぐため、必要かつ適切な安全管理措置を講じます。</p></div><div class="numbered-row"><h3>開示・訂正・停止</h3><p>本人からの請求に対し、法令に従って適切に対応します。</p></div><div class="numbered-row"><h3>お問い合わせ窓口</h3><p>{NAP_NAME}<br>{NAP_ADDRESS}<br>電話 03-4400-7994／メール info@kagoya-consul.com</p></div></div><p class="small-note" style="margin-top:28px">制定・改定：2026年8月10日</p></div></section>'''


FEATURES = page_hero("Our approach", "籠やの考え方", "不動産は、まず“知る”こと。", "gen-investment.jpg", "集合住宅模型と資料を使って資産計画を検討するイメージ") + '''
<section class="page-sec"><div class="wrap page-intro"><div class="page-intro__pull">知る</div><div class="page-intro__body"><h2>答えを急がず、判断の土台をつくる。</h2><p>状況、価値、選択肢、リスクを順番に確認し、ご自身で納得できる判断を支えます。</p><a class="btn" href="services.html">サービスを見る</a></div></div></section>'''


FAQ_PAGE = page_hero("FAQ", "よくある質問", "売る前の相談で気になることへお答えします。", "gen-finance.jpg", "図面・予定・費用を確認しながら不動産の条件を整理するイメージ") + f'''<section class="page-sec"><div class="wrap faq-layout"><div class="faq-sticky"><span class="eyebrow">FAQ</span><h2>相談前の確認事項</h2><p>掲載のない内容は、分かる範囲からお問い合わせください。</p></div><div class="faq-list">{faq_items()}</div></div></section>'''


PAGES = {
    "index.html": ("株式会社籠や｜売る前に、不動産の選択肢を知る", "東京都目黒区の株式会社籠やは、不動産の状況・価値・選択肢・リスクを整理し、売却・購入・管理・相続の納得できる判断を支えます。", INDEX, ""),
    "services.html": ("サービス｜株式会社籠や", "売却・相続・購入・資産形成・管理・法人向け支援を、相談内容に合わせて組み立てる株式会社籠やのサービスです。", SERVICES, "services"),
    "service.html": ("サービス｜株式会社籠や", "売却・相続・購入・資産形成・管理・法人向け支援を、相談内容に合わせて組み立てる株式会社籠やのサービスです。", SERVICES, "services"),
    "cases.html": ("相談事例｜株式会社籠や", "権利関係や複数所有者を含む不動産について、調査と対話を重ねて選択肢を整理した事例をご紹介します。", CASES, "cases"),
    "team.html": ("専門家・チーム｜株式会社籠や", "不動産を起点に法務・税務・ファイナンシャルプランニングへつなぐ株式会社籠やの相談体制です。", TEAM, "team"),
    "about.html": ("会社情報｜東京都目黒区の株式会社籠や", "株式会社籠やの所在地、代表、宅建業免許、営業時間、事業内容をご案内します。", ABOUT, "about"),
    "insights.html": ("知る・読みもの｜株式会社籠や", "不動産を売る前、買う前、相続したときに確認したい状況・価値・選択肢・リスクを解説します。", INSIGHTS, ""),
    "news.html": ("知る・読みもの｜株式会社籠や", "不動産を売る前、買う前、相続したときに確認したい状況・価値・選択肢・リスクを解説します。", INSIGHTS, ""),
    "for-sale.html": ("販売中の物件｜株式会社籠や", "株式会社籠やが現在公開している居住用・一棟収益の販売中物件を、価格・所在地・交通・面積とともにご案内します。", FOR_SALE, "for-sale"),
    "properties.html": ("販売中の物件｜株式会社籠や", "株式会社籠やが現在公開している居住用・一棟収益の販売中物件を、価格・所在地・交通・面積とともにご案内します。", PROPERTIES, "for-sale"),
    "contact.html": ("お問い合わせ｜株式会社籠や", "不動産の売却・購入・管理・相続について、売ると決める前の段階から株式会社籠やへご相談いただけます。", CONTACT, ""),
    "privacy.html": ("プライバシーポリシー｜株式会社籠や", "株式会社籠やの個人情報の取得、利用、管理、お問い合わせ窓口について定めたプライバシーポリシーです。", PRIVACY, ""),
    "features.html": ("籠やの考え方｜株式会社籠や", "不動産の状況・価値・選択肢・リスクを順番に確認し、納得できる判断を支える株式会社籠やの考え方です。", FEATURES, ""),
    "faq.html": ("よくある質問｜株式会社籠や", "売却前の相談、資料、相続・空き家、権利関係、購入、費用について株式会社籠やがお答えします。", FAQ_PAGE, ""),
}

DETAIL_META = {
    "sale-consulting.html": ("不動産売却・調査相談｜株式会社籠や", "売る前に不動産の状況、価値、権利関係、リスクを確認し、売却・保有・活用の選択肢を整理します。"),
    "inheritance-vacant-house.html": ("相続・空き家相談｜株式会社籠や", "相続した不動産や空き家について、権利関係、管理負担、売却・保有・活用の可能性を整理します。"),
    "purchase-asset.html": ("不動産購入・資産形成相談｜株式会社籠や", "購入予定物件や収益不動産の利点とリスクを整理し、資金計画を含む判断を支援します。"),
    "property-management.html": ("不動産管理・活用相談｜株式会社籠や", "一室から一棟まで、不動産の管理状況と空室・修繕・活用の選択肢を整理します。"),
    "corporate-benefits.html": ("法人向け不動産相談｜株式会社籠や", "従業員の住まい・住宅購入・資産形成など、法人の福利厚生に組み込める不動産相談をご案内します。"),
}


def main() -> None:
    for filename, (title, description, body, current) in PAGES.items():
        (ROOT / filename).write_text(page(title, description, body, current), encoding="utf-8")
    for filename, args in DETAILS.items():
        title, description = DETAIL_META[filename]
        (ROOT / filename).write_text(page(title, description, service_detail(*args), "services"), encoding="utf-8")


if __name__ == "__main__":
    main()
