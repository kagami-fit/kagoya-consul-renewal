#!/usr/bin/env python3
"""本番用HTMLの共通ヘッダー／フッターを同じ内容へ揃える。"""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

ROOT_PAGES = [
    "index.html",
    "animation-dynamic.html",
    "business.html",
    "social-contribution.html",
    "about.html",
    "services.html",
    "service.html",
    "sale-consulting.html",
    "inheritance-vacant-house.html",
    "purchase-asset.html",
    "property-management.html",
    "corporate-benefits.html",
    "team.html",
    "features.html",
    "for-sale.html",
    "properties.html",
    "wp-sale.html",
    "property-detail.html",
    "news.html",
    "news-detail.html",
    "insights.html",
    "faq.html",
    "contact.html",
    "privacy.html",
]

BLOG_PAGES = [
    "blog/check-before-price-cut.html",
    "blog/inherited-property-first-steps.html",
    "blog/rebuild-impossible-property.html",
]


def current_key(relative_path: str) -> str:
    name = Path(relative_path).name
    if name == "about.html":
        return "company"
    if name == "business.html":
        return "business"
    if name in {"for-sale.html", "properties.html", "wp-sale.html", "property-detail.html"}:
        return "property"
    if name in {
        "services.html",
        "service.html",
        "sale-consulting.html",
        "inheritance-vacant-house.html",
        "purchase-asset.html",
        "property-management.html",
        "corporate-benefits.html",
        "team.html",
        "features.html",
        "faq.html",
    }:
        return "services"
    if name in {"news.html", "news-detail.html", "insights.html"} or relative_path.startswith("blog/"):
        return "news"
    if name == "social-contribution.html":
        return "social"
    if name == "contact.html":
        return "contact"
    if name == "privacy.html":
        return "privacy"
    return ""


def link(href: str, label: str, cms_id: str, key: str, current: str, small: str = "") -> str:
    active = ' aria-current="page"' if current == key else ""
    suffix = f"<small>{small}</small>" if small else ""
    return f'<a href="{href}" data-cms-id="{cms_id}"{active}>{label}{suffix}</a>'


def header(prefix: str, current: str) -> str:
    home = f"{prefix}index.html"
    company = f"{prefix}about.html"
    business = f"{prefix}business.html"
    properties = f"{prefix}for-sale.html"
    services = f"{prefix}services.html"
    area = f"{prefix}index.html#service-area"
    news = f"{prefix}news.html"
    social = f"{prefix}social-contribution.html"
    contact = f"{prefix}contact.html"
    privacy = f"{prefix}privacy.html"
    logo = f"{prefix}src/logo"

    left = "".join(
        [
            link(company, "会社情報", "common_common-header_A_002", "company", current),
            link(business, "事業紹介", "common_common-header_A_003", "business", current),
            link(properties, "販売物件", "common_common-header_A_004", "property", current),
            link(services, "サービス", "common_common-header_A_005", "services", current),
        ]
    )
    right = "".join(
        [
            link(area, "対応エリア", "common_common-header_A_006", "area", current),
            link(news, "お知らせ", "common_common-header_A_007", "news", current),
            link(social, "社会貢献", "common_common-header_A_008", "social", current),
            link(contact, "相談する", "common_common-header_A_009", "contact", current),
        ]
    )
    drawer = "".join(
        [
            link(home, "ホーム", "common_common-header_A_011", "home", current, "HOME"),
            link(company, "会社情報", "common_common-header_A_012", "company", current, "ABOUT"),
            link(business, "事業紹介", "common_common-header_A_013", "business", current, "BUSINESS"),
            link(properties, "販売物件", "common_common-header_A_014", "property", current, "FOR SALE"),
            link(services, "サービス", "common_common-header_A_015", "services", current, "SERVICES"),
            link(area, "対応エリア", "common_common-header_A_016", "area", current, "AREA"),
            link(news, "お知らせ", "common_common-header_A_017", "news", current, "NEWS"),
            link(social, "社会貢献", "common_common-header_A_018", "social", current, "SOCIAL"),
            link(privacy, "プライバシー", "common_common-header_A_019", "privacy", current, "PRIVACY"),
        ]
    )
    return f'''<!-- ZOROYA:HEADER -->
<header class="site-header">
  <div class="site-header__topbar"><div class="in"><span class="site-header__ticker"><b>LIVE</b><span data-live-ticker>案件・商談・提携の動きを随時更新しています。</span></span><div class="right"><span>10:00–18:00／水曜定休</span><span class="tel">03-4400-7994</span><a href="{contact}" data-cms-id="common_common-header_A_001">相談する</a></div></div></div>
  <div class="site-header__main">
    <nav class="site-header__nav is-left" aria-label="主要ナビゲーション（左）">{left}</nav>
    <a class="site-header__brand" href="{home}" aria-label="KAGOYA 株式会社籠や トップへ"><picture><source type="image/webp" srcset="{logo}.webp"><img src="{logo}.png" alt="KAGOYA 株式会社籠や" loading="eager" decoding="async"></picture></a>
    <nav class="site-header__nav is-right" aria-label="主要ナビゲーション（右）">{right}</nav>
    <a class="site-header__cta" href="{contact}" data-cms-id="common_common-header_A_010">相談する</a>
    <button class="hamburger" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="メニューを開く"><span></span><span></span><span></span></button>
  </div>
  <div class="site-header__strip"></div>
</header>
<div class="drawer-shade" data-menu-shade></div>
<aside class="drawer" id="mobile-menu" data-menu-drawer aria-hidden="true">
  <nav aria-label="スマートフォンメニュー">{drawer}</nav>
  <div class="drawer-contact"><a class="btn primary" href="{contact}" data-cms-id="common_common-header_A_020">選択肢を相談する</a><a class="btn ghost" href="tel:0344007994" data-cms-id="common_common-header_A_021">03-4400-7994</a></div>
</aside>
<!-- /ZOROYA:HEADER -->'''


def footer(prefix: str) -> str:
    return f'''<!-- ZOROYA:FOOTER -->
<footer class="site-footer">
  <div class="site-footer__info">
    <div class="site-footer__nap"><div class="nm">株式会社籠や</div><p data-cms-id="common_common-footer_P_001">不動産売買・仲介・管理、不動産コンサルティング<br>〒152-0032 東京都目黒区平町1丁目26-17<br>ソシアル都立大学駅前201号<br>10:00〜18:00／水曜定休</p><a class="tel" href="tel:0344007994" data-cms-id="common_common-footer_A_002">03-4400-7994</a></div>
    <div class="site-footer__col"><h4 data-cms-id="common_common-footer_H4_003">Business</h4><a href="{prefix}business.html" data-cms-id="common_common-footer_A_004">事業紹介</a><a href="{prefix}inheritance-vacant-house.html" data-cms-id="common_common-footer_A_005">相続コンサルティング</a><a href="{prefix}sale-consulting.html" data-cms-id="common_common-footer_A_006">不動産コンサルティング</a><a href="{prefix}property-management.html" data-cms-id="common_common-footer_A_007">賃貸経営オーナー支援</a><a href="{prefix}corporate-benefits.html" data-cms-id="common_common-footer_A_008">企業向けセミナー</a><a href="{prefix}social-contribution.html" data-cms-id="common_common-footer_A_009">社会貢献</a></div>
    <div class="site-footer__col"><h4 data-cms-id="common_common-footer_H4_010">Guide</h4><a href="{prefix}about.html" data-cms-id="common_common-footer_A_011">会社情報</a><a href="{prefix}for-sale.html" data-cms-id="common_common-footer_A_012">販売物件</a><a href="{prefix}services.html" data-cms-id="common_common-footer_A_013">サービス</a><a href="{prefix}index.html#service-area" data-cms-id="common_common-footer_A_014">対応エリア</a><a href="{prefix}news.html" data-cms-id="common_common-footer_A_015">お知らせ</a><a href="{prefix}contact.html" data-cms-id="common_common-footer_A_016">相談する</a><a href="{prefix}privacy.html" data-cms-id="common_common-footer_A_017">プライバシー</a></div>
  </div>
  <div class="site-footer__cp"><div class="in"><span>© KAGOYA Co., Ltd.</span><span>東京都知事（1）第108542号</span></div></div>
</footer>
<!-- /ZOROYA:FOOTER -->'''


def replace_marked(html: str, marker: str, replacement: str) -> tuple[str, bool]:
    pattern = rf"<!-- ZOROYA:{marker} -->.*?<!-- /ZOROYA:{marker} -->"
    updated, count = re.subn(pattern, replacement, html, count=1, flags=re.S)
    return updated, count == 1


def update_page(relative_path: str, prefix: str) -> None:
    path = ROOT / relative_path
    if not path.exists():
        return
    html = path.read_text(encoding="utf-8")
    current = current_key(relative_path)

    html, header_done = replace_marked(html, "HEADER", header(prefix, current))
    if not header_done:
        html, count = re.subn(
            r'<header[^>]*class="[^"]*\bsite-header\b[^"]*"[^>]*>.*?</header>',
            header(prefix, current),
            html,
            count=1,
            flags=re.S,
        )
        if count != 1:
            raise RuntimeError(f"header not found: {relative_path}")

    html, footer_done = replace_marked(html, "FOOTER", footer(prefix))
    if not footer_done:
        html, count = re.subn(
            r'<footer[^>]*class="[^"]*\bsite-footer\b[^"]*"[^>]*>.*?</footer>',
            footer(prefix),
            html,
            count=1,
            flags=re.S,
        )
        if count != 1:
            raise RuntimeError(f"footer not found: {relative_path}")

    if "skip-link" not in html:
        html = html.replace("<body class=\"sample07-subpage\">", '<body class="sample07-subpage">\n<a class="skip-link" href="#main">本文へスキップ</a>', 1)
    html = re.sub(r"<main(?![^>]*\bid=)([^>]*)>", r'<main id="main"\1>', html, count=1)
    if f'{prefix}assets/js/site.js' not in html:
        html = html.replace("</body>", f'<script src="{prefix}assets/js/site.js"></script>\n</body>', 1)

    path.write_text(html, encoding="utf-8")
    print(f"updated: {relative_path}")


def main() -> None:
    for page in ROOT_PAGES:
        update_page(page, "")
    for page in BLOG_PAGES:
        update_page(page, "../")


if __name__ == "__main__":
    main()
