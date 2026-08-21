# KAGOYA コーポレートサイト リニューアル

## 一言で言うと

株式会社籠やの確定HP設計書を内容の正本にし、参考サイト`sample07`と同じレイアウト・写真リズム・スクロール演出で、不動産相談サイトへ作り替えたプロジェクトです。主要写真はサイト専用に新規生成し、販売中物件カードだけ実物写真を使用しています。

## 何ができるのか

- 状況・価値・選択肢・リスクを整理するKAGOYAの考え方を伝える
- 売却、相続・空き家、購入・資産形成、管理・活用、法人向け相談へ案内する
- 「今日の籠や」で新規案件・商談・成約・提携など日々の動きを伝える
- 不動産・地上げ・開発・エフクリ・介護・コンサル・新規事業など、複数領域が同時に動いている印象をサイト全体で伝える
- 「今日の籠や」の更新から、案件相談・協業・投資・採用へ自然につなげる
- 公開中の販売物件を、画像ギャラリー・カテゴリ・タグ・詳細情報付きで確認する
- 元サイトの「お知らせ」20件を、一覧と個別本文ページで確認する
- 電話、メール、公式お問い合わせフォームから相談へ進める
- スマートフォンとPCの両方で閲覧できる
- sample07と同じスリットFV、横スクロールサービス、円形フローを体験できる
- GitHub Pagesで公開し、ZIPでも再配布できる
- 同じ内容のまま、sample07／sample12／sample33を参考にした3つのデザイン・動きの比較案を確認できる

## 構成

- `HP設計書_確定.txt`：今回反映した確定版の内容設計
- `site-design.md`：戦略、配色、レイアウト、公開保留ルール
- `SPEC.md`：NAP、確定コピー、FAQ、ページメタ
- `scripts/build_site.py`：確定仕様から主要HTMLを再生成するスクリプト
- `templates/sample07-reference.html`：移植元sample07の構造・動きを保存した参照テンプレート
- `scripts/build_sample07_home.py`：参照テンプレートへKAGOYAの確定内容を流し込み、トップを再生成するスクリプト
- `scripts/update_blog_chrome.py`：ブログ3記事へsample07の共通ヘッダー・フッターを適用するスクリプト
- `scripts/migrate-wp-news.js`：元WordPressの公開お知らせを取得し、一覧・詳細表示用JSONを生成するスクリプト
- `scripts/qa_site.py`：3画面幅で全ページを検証し、代表スクリーンショットを保存するスクリプト
- `scripts/qa_sample07.cjs`：sample07特有の長いスクロール演出を含め、3画面幅で主要21ページを検証するスクリプト
- `assets/css/_shared.css`：会社案内PDFの色・余白・罫線を反映した共通デザイン
- `assets/css/sample07-theme.css`：sample07の構成をKAGOYAの配色・指定書体へ適合させる共通テーマ
- `assets/js/site.js`：スマホメニュー、表示アニメーション、固定問い合わせ導線
- `assets/css/variant-*.css`：3つの比較案ごとの配色、レイアウト、FVデザイン
- `assets/js/variant-motion.js`：縦スリット、グリッド、光点、ワイプ、スクロール演出
- `scripts/build_design_variants.py`：現行トップの内容から比較用3案を再生成するスクリプト
- `src/gen-*`：サイト専用に生成したトップ、相談、サービス、事例、会社用の写真素材
- `src/listing-*`：現行公式サイトから取得した販売中物件の実物写真
- `data/news-items.json`：元サイトから移行したお知らせ20件（本文HTML・カテゴリ・日付・元URL）
- `src/generated-image-manifest.md`：生成画像の用途とプロンプト一覧
- `src/wp-image-sources.md`：販売中物件写真の取得元URL一覧
- `index.html`：トップページ
- `services.html` と5つの詳細ページ：相談サービス
- `team.html`／`about.html`：体制、会社情報（相談事例ページは廃止）
- `news.html`／`news-detail.html`：移行したお知らせの一覧と個別詳細
- `insights.html`／`blog/`：読みもの
- `for-sale.html`：販売中物件の一覧
- `data/today-items.json`：トップの「今日の籠や」更新データ
- `TODAY_FEED.md`：「今日の籠や」をSNS・WordPress・自動連携へ拡張する運用設計
- `contact.html`／`privacy.html`：問い合わせと個人情報保護方針
- `design-comparison.html`：現行版と比較案3種の一覧
- `design-sample07.html`／`design-sample12.html`／`design-sample33.html`：参考サイト別の比較案
- `zoroya-site.zip`：納品・再公開用パッケージ

## 使い方

1. 公開版は `https://kagami-fit.github.io/kagoya-consul-renewal/` を開く。
2. ローカル確認はプロジェクト直下で `python3 -m http.server 8765` を実行し、`http://127.0.0.1:8765/` を開く。
3. 確定仕様から再生成する場合は `python3 scripts/build_site.py` → `python3 scripts/build_sample07_home.py` → `python3 scripts/update_blog_chrome.py` の順に実行する。
4. ローカルサーバー起動後、`node scripts/qa_sample07.cjs http://127.0.0.1:8765/`で3画面幅の品質確認を行う。
5. 現行トップを旧比較案3種へ反映する場合は `python3 scripts/build_design_variants.py` を実行する。
6. 修正後は品質確認を行い、GitHubへpushする。

## 状態

- HP設計書の反映：完了
- 会社案内PDFのカラー・トンマナ反映：完了
- PDF由来画像の不使用・主要写真の新規生成：完了
- 販売中物件ページ：稼働中
- トップページ：sample07デザイン・演出へ変更済み
- 今日の籠や・動いている領域の表示・4つの相談入口：反映済み
- 相談事例ページ：削除済み
- 主要下層ページ：sample07共通ヘッダー・配色・書体へ変更済み
- ブログ3記事：sample07共通ヘッダー・配色・書体へ変更済み
- GitHub Pages：稼働中
- 参考サイト別デザイン比較3案：旧比較資料として維持（検索除外）
- 納品ZIP：今回の公開時に再生成
- WordPress移行：未着手
