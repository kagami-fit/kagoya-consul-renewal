#!/usr/bin/env python3
"""既存ブログ記事へ sample07 共通ヘッダー・フッターを適用する。"""

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
ARTICLES = sorted((ROOT / "blog").glob("*.html"))


HEADER = '''<!-- ZOROYA:HEADER -->
<header class="site-header">
  <div class="site-header__topbar"><div class="in"><span>売却を急がず、不動産の選択肢を整理する。</span><div class="right"><span>10:00–18:00／木曜定休</span><span class="tel">03-4400-7994</span><a href="../contact.html">相談する</a></div></div></div>
  <div class="site-header__main">
    <nav class="site-header__nav is-left" aria-label="主要ナビゲーション（左）"><a href="../services.html">サービス</a><a href="../for-sale.html">販売中物件</a><a href="../cases.html">相談事例</a><a href="../insights.html" aria-current="page">読みもの</a></nav>
    <a class="site-header__brand" href="../index.html" aria-label="KAGOYA 株式会社籠や トップへ"><picture><source type="image/webp" srcset="../src/logo.webp"><img src="../src/logo.png" alt="KAGOYA 株式会社籠や" loading="eager" decoding="async"></picture></a>
    <nav class="site-header__nav is-right" aria-label="主要ナビゲーション（右）"><a href="../team.html">専門家・チーム</a><a href="../about.html">会社情報</a><a href="../faq.html">よくある質問</a></nav>
    <a class="site-header__cta" href="../contact.html">相談する</a>
    <button class="hamburger" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="メニューを開く"><span></span><span></span><span></span></button>
  </div>
  <div class="site-header__strip"></div>
</header>
<div class="drawer-shade" data-menu-shade></div>
<aside class="drawer" id="mobile-menu" data-menu-drawer aria-hidden="true">
  <nav aria-label="スマートフォンメニュー"><a href="../index.html">ホーム<small>HOME</small></a><a href="../services.html">サービス<small>SERVICES</small></a><a href="../for-sale.html">販売中物件<small>FOR SALE</small></a><a href="../cases.html">相談事例<small>CASES</small></a><a href="../team.html">専門家・チーム<small>TEAM</small></a><a href="../about.html">会社情報<small>ABOUT</small></a><a href="../insights.html">知る・読みもの<small>INSIGHTS</small></a></nav>
  <div class="drawer-contact"><a class="btn primary" href="../contact.html">選択肢を相談する</a><a class="btn ghost" href="tel:0344007994">03-4400-7994</a></div>
</aside>
<!-- /ZOROYA:HEADER -->'''


FOOTER = '''<!-- ZOROYA:FOOTER -->
<footer class="site-footer">
  <div class="site-footer__info">
    <div class="site-footer__nap"><div class="nm">株式会社籠や</div><p>不動産売買・仲介・管理、不動産コンサルティング<br>〒152-0032 東京都目黒区平町1丁目26-17<br>ソシアル都立大学駅前201号<br>10:00〜18:00／木曜定休</p><a class="tel" href="tel:0344007994">03-4400-7994</a></div>
    <div class="site-footer__col"><h4>Consulting</h4><a href="../sale-consulting.html">売却・調査</a><a href="../inheritance-vacant-house.html">相続・空き家</a><a href="../purchase-asset.html">購入・資産形成</a><a href="../property-management.html">管理・活用</a></div>
    <div class="site-footer__col"><h4>Guide</h4><a href="../for-sale.html">販売中物件</a><a href="../cases.html">相談事例</a><a href="../team.html">専門家・チーム</a><a href="../about.html">会社情報</a><a href="../insights.html">知る・読みもの</a><a href="../privacy.html">プライバシー</a></div>
  </div>
  <div class="site-footer__cp"><div class="in"><span>© KAGOYA Co., Ltd.</span><span>東京都知事（1）第108542号</span></div></div>
</footer>
<!-- /ZOROYA:FOOTER -->'''


def replace_block(html: str, marker: str, replacement: str) -> str:
    pattern = rf"<!-- ZOROYA:{marker} -->.*?<!-- /ZOROYA:{marker} -->"
    updated, count = re.subn(pattern, replacement, html, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError(f"{marker} block not found")
    return updated


def main() -> None:
    for path in ARTICLES:
        html = path.read_text(encoding="utf-8")
        if 'href="../assets/css/sample07-theme.css"' not in html:
            html = html.replace(
                '<link rel="stylesheet" href="../assets/css/_shared.css">',
                '<link rel="stylesheet" href="../assets/css/_shared.css">\n<link rel="stylesheet" href="../assets/css/sample07-theme.css">',
                1,
            )
        html = html.replace("<body>", '<body class="sample07-subpage">\n<a class="skip-link" href="#main">本文へスキップ</a>', 1)
        html = html.replace("<main>", '<main id="main">', 1)
        html = replace_block(html, "HEADER", HEADER)
        html = replace_block(html, "FOOTER", FOOTER)
        path.write_text(html, encoding="utf-8")
        print(f"updated: {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
