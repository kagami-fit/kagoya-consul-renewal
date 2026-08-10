# KAGOYA コーポレートサイト リニューアル

## 一言で言うと

株式会社籠やの会社案内PDFと確定HP設計書をもとに、不動産を「売る前に知る」ための相談サイトへ作り替えたプロジェクトです。

## 何ができるのか

- 状況・価値・選択肢・リスクを整理するKAGOYAの考え方を伝える
- 売却、相続・空き家、購入・資産形成、管理・活用、法人向け相談へ案内する
- 権利関係を整理した相談事例と、専門家連携の体制を紹介する
- 電話、メール、公式お問い合わせフォームから相談へ進める
- スマートフォンとPCの両方で閲覧できる
- GitHub Pagesで公開し、ZIPでも再配布できる

## 構成

- `HP設計書_確定.txt`：今回反映した確定版の内容設計
- `site-design.md`：戦略、配色、レイアウト、公開保留ルール
- `SPEC.md`：NAP、確定コピー、FAQ、ページメタ
- `scripts/build_site.py`：確定仕様から主要HTMLを再生成するスクリプト
- `scripts/qa_site.py`：3画面幅で全ページを検証し、代表スクリーンショットを保存するスクリプト
- `assets/css/_shared.css`：会社案内PDFの色・余白・罫線を反映した共通デザイン
- `assets/js/site.js`：スマホメニュー、表示アニメーション、固定問い合わせ導線
- `src/brochure-*`：会社案内PDFから抽出・軽量化した建物線画、相談、相続、事例素材
- `index.html`：トップページ
- `services.html` と5つの詳細ページ：相談サービス
- `cases.html`／`team.html`／`about.html`：事例、体制、会社情報
- `insights.html`／`blog/`：読みもの
- `contact.html`／`privacy.html`：問い合わせと個人情報保護方針
- `zoroya-site.zip`：納品・再公開用パッケージ

## 使い方

1. 公開版は `https://kagami-fit.github.io/kagoya-consul-renewal/` を開く。
2. ローカル確認はプロジェクト直下で `python3 -m http.server 8765` を実行し、`http://127.0.0.1:8765/` を開く。
3. 確定仕様からHTMLを再生成する場合は `python3 scripts/build_site.py` を実行する。
4. 修正後は品質確認を行い、GitHubへpushする。

## 状態

- HP設計書の反映：完了
- 会社案内PDFのカラー・トンマナ反映：完了
- トップページ：稼働中
- 主要下層ページ：稼働中
- ブログ3記事：稼働中
- GitHub Pages：稼働中
- 納品ZIP：更新済み
- WordPress移行：未着手
