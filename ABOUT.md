# KAGOYA コーポレートサイト リニューアル

## 一言で言うと

株式会社籠やの修正指示を正本にし、参考サイト`sample07`の書体・写真リズム・セクション演出を取り入れて、不動産相談サイトへ作り替えたプロジェクトです。ファーストビューは指定写真の静止表示、物件欄は公開中・公開可能な実物写真を使用しています。

## 何ができるのか

- 状況・価値・選択肢・リスクを整理するKAGOYAの考え方を伝える
- 売却、相続・空き家、購入・資産形成、管理・活用、法人向け相談へ案内する
- 「Today’s KAGOYA」で新規案件・商談・成約・提携など日々の動きを伝える
- 進行中プロジェクトで、開発・相続連携・賃貸運営の現場を写真付きで紹介する
- 相続、不動産コンサル、仲介・買取、底地・借地、エフクリ、賃貸経営、企業向けセミナー、社会貢献の8領域を写真付きで紹介する
- 全国の収益不動産、東京23区の収益不動産・空きビル、国道16号線内側の空き家について、買取対象エリアを図解で確認する
- 物件・相続、協業・連携、事業・資産形成、セミナー・採用の4入口から問い合わせへつなげる
- 公開中の販売物件を、画像ギャラリー・カテゴリ・タグ・詳細情報付きで確認する
- 元サイトの「お知らせ」20件を、一覧と個別本文ページで確認する
- 電話、メール、公式お問い合わせフォームから相談へ進める
- スマートフォンとPCの両方で閲覧できる
- sample07と同じ横スクロールサービスとカード表示演出を体験できる（ファーストビューは静止表示）
- B案の紙面出力・写真展開・カード展開・伸縮パネルを採用した正式トップを閲覧できる
- GitHub Pagesで公開し、ZIPでも再配布できる
- Google スプレッドシートで日々の更新、公開確認、更新履歴を一元管理できる
- HTMLやGitHubを開かずにToday・お知らせ・物件・プロジェクト・文章・画像を更新できる
- 同じ内容のまま、sample07／sample12／sample33を参考にした3つのデザイン・動きの比較案を確認できる

## 構成

- `HP設計書_確定.txt`：今回反映した確定版の内容設計
- `site-design.md`：戦略、配色、レイアウト、公開保留ルール
- `SPEC.md`：NAP、確定コピー、FAQ、ページメタ
- `scripts/build_site.py`：確定仕様から主要HTMLを再生成するスクリプト
- `templates/sample07-reference.html`：移植元sample07の構造・動きを保存した参照テンプレート
- `scripts/build_sample07_home.py`：参照テンプレートへKAGOYAの確定内容を流し込み、トップを再生成するスクリプト
- `scripts/build_business_pages.mjs`：8事業の一覧ページと、PDF確定原稿を展開した7つの事業別ページを再生成するスクリプト
- `scripts/update_blog_chrome.py`：ブログ3記事へsample07の共通ヘッダー・フッターを適用するスクリプト
- `scripts/update_common_chrome.py`：全公開ページのナビゲーション、営業時間、フッターを一括で揃えるスクリプト
- `assets/css/site-header.css`：トップ・下層共通の左寄せロゴ、ナビ配置、相談ボタンの表示。下層は`sample07-theme.css`から読み込む
- `scripts/enrich_subpages.py`：主要下層ページへ、内容に合わせた写真セクションを一括追加する再実行可能なスクリプト
- `scripts/migrate-wp-news.js`：元WordPressの公開お知らせを取得し、一覧・詳細表示用JSONを生成するスクリプト
- `scripts/qa_site.py`：3画面幅で全ページを検証し、代表スクリーンショットを保存するスクリプト
- `scripts/qa_sample07.cjs`：sample07特有の長いスクロール演出を含め、3画面幅で主要21ページを検証するスクリプト
- `assets/css/_shared.css`：会社案内PDFの色・余白・罫線を反映した共通デザイン
- `assets/css/sample07-theme.css`：sample07の構成をKAGOYAの配色・指定書体へ適合させる共通テーマ
- `assets/js/site.js`：スマホメニュー、表示アニメーション、固定問い合わせ導線、管理シート由来の物件・文章・画像・共通設定の反映
- `cms/`：Google スプレッドシート管理、Apps Script、公開済みデータのサイト同期
- `.github/workflows/publish-cms.yml`：公開済みデータを定期取得してGitHub Pagesへ反映
- `assets/css/variant-*.css`：3つの比較案ごとの配色、レイアウト、FVデザイン
- `assets/js/variant-motion.js`：縦スリット、グリッド、光点、ワイプ、スクロール演出
- `scripts/build_design_variants.py`：現行トップの内容から比較用3案を再生成するスクリプト
- `src/hero-kagoya-consultation.*`：指定されたファーストビュー背景写真
- `src/gen-*`：サイト専用に生成した相談、サービス、事例、会社用の写真素材
- `src/gen-domain-*`：8つの事業領域カード用に生成した写真素材
- `src/nbc-junior-workshop-*`：クライアント提供のNBCジュニア授業写真（Web表示用WebPを併記）
- `src/listing-*`：現行公式サイトから取得した販売中物件の実物写真
- `data/news-items.json`：元サイトから移行したお知らせ20件（本文HTML・カテゴリ・日付・元URL）
- `src/generated-image-manifest.md`：生成画像の用途とプロンプト一覧
- `src/wp-image-sources.md`：販売中物件写真の取得元URL一覧
- `index.html`：トップページ
- `business.html`：8つの事業領域を短く紹介し、各専用ページへ案内する一覧ページ
- `inheritance-vacant-house.html`／`sale-consulting.html`／`brokerage-purchase.html`／`rights-coordination.html`／`fukuri.html`／`property-management.html`／`corporate-seminars.html`：事業別の詳しい説明、確認項目、選択肢、進め方、連携体制
- `social-contribution.html`：NBCジュニアの授業と社会貢献活動を紹介する専用ページ。2026-09-05に指定サイトの冒頭からPARTNERSHIPまで7セクションを本文どおりに移行（JET-ALLとその後の参加案内は除外）
- `assets/css/social-contribution.css`：社会貢献ページ専用の画像・学習ステップ・活動レポートのレイアウト
- `consultation-button-comparison.html`：相談ボタン3案の比較ページ。選択すると実際のヘッダー表示が切り替わる（本番のボタンには影響しない）
- `assets/css/consultation-button-comparison.css`／`assets/js/consultation-button-comparison.js`：輪郭線・塗り分け・丸みの3案と、比較ページ内だけの切り替え
- `contact-section-comparison.html`：電話・フォーム・公式LINEをまとめたお問い合わせセクション5案。番号で実寸プレビューを切り替え、`?design=1`〜`5`で各案を直接開ける
- `assets/css/contact-section-comparison.css`／`assets/js/contact-section-comparison.js`：写真パネル・写真分割・3カード・グレー帯・フォーム中心の5レイアウトと比較操作。本番の問い合わせセクションは選定後に追加する
- `src/kagoya-line-qr.webp`／`src/kagoya-contact-background.webp`：元公式サイトから取得したLINEのQRコードと問い合わせ背景（出典は`src/contact-asset-sources.md`）
- `animation-recommended.html`：縦タイムライン、追従ビジュアル、背景連動インデックス、一覧型サービスを採用した推奨モーション案
- `animation-dynamic.html`：採用したB案の確認用URL。内容は正式トップ `index.html` と同期
- `services.html` と5つの詳細ページ：相談サービス
- `team.html`／`about.html`：体制、会社情報（相談事例ページは廃止）
- `news.html`／`news-detail.html`：移行したお知らせの一覧と個別詳細
- `insights.html`／`blog/`：読みもの
- `for-sale.html`：販売中物件の一覧
- `data/today-items.json`：トップの「Today’s KAGOYA」更新データ
- `TODAY_FEED.md`：「Today’s KAGOYA」をSNS・WordPress・自動連携へ拡張する運用設計
- `contact.html`／`privacy.html`：問い合わせと個人情報保護方針
- `design-comparison.html`：現行版と比較案3種の一覧
- `design-sample07.html`／`design-sample12.html`／`design-sample33.html`：参考サイト別の比較案
- `zoroya-site.zip`：納品・再公開用パッケージ

## 使い方

1. 公開版は `https://kagami-fit.github.io/kagoya-consul-renewal/` を開く。
2. ローカル確認はプロジェクト直下で `python3 -m http.server 8765` を実行し、`http://127.0.0.1:8765/` を開く。
3. 事業紹介の文章や構成を更新した場合は `node scripts/build_business_pages.mjs` を実行する。
4. 共通ナビゲーションや営業時間を更新する場合は `python3 scripts/update_common_chrome.py` を実行する。
5. ローカルサーバー起動後、`node scripts/qa_sample07.cjs http://127.0.0.1:8765/`で3画面幅の品質確認を行う。
6. 現行トップを旧比較案3種へ反映する場合は `python3 scripts/build_design_variants.py` を実行する。
7. 修正後は品質確認を行い、GitHubへpushする。

## 状態

- HP設計書の反映：完了
- 会社案内PDFのカラー・トンマナ反映：完了
- PDF由来画像の不使用・主要写真の新規生成：完了
- 販売中物件ページ：稼働中
- トップページ：B案を正式採用し、自動紙送りを含むデザイン・演出へ変更済み（ファーストビューは静止）
- Today’s KAGOYA・動いている領域の表示・4つの相談入口：反映済み
- 社会貢献を8事業領域の一つとして表示し、共通ナビゲーションから遷移：反映済み
- 社会貢献ページ：実際の授業写真を使った大きなビジュアル、2枚組の活動レポート、学習ステップのアイコンを反映済み。JET-ALL以降は引き続き非掲載
- 相談ボタン：①「上品な輪郭線」を共通ヘッダーに採用。ロゴ左端固定と販売・成約物件の並びを維持
- お問い合わせセクション5案：比較ページを作成。電話・フォーム・公式LINE付き。デザインは選定待ちで、本番セクションには未追加
- 8事業領域の見出し・写真カード・領域別導線：一覧を簡潔化し、各専用ページへ接続済み
- 事業別ページ：最新修正指示PDFの確定原稿をもとに、確認項目・選択肢・進め方・連携体制まで詳しく反映済み
- 進行中プロジェクト表示・目的別問い合わせ導線・対応エリア案内：反映済み
- 買取対象・対応エリアの3分割図解（全国／東京23区／国道16号線内側）：反映済み
- トップの相談フロー・代表メッセージ・FAQ：修正指示により削除済み
- 販売中物件（未公開除外）・成約実績（非公開除外）：管理シートの状態から一覧・トップ・比較案へ自動振り分け
- 相談事例ページ：削除済み
- 主要下層ページ：sample07共通ヘッダー・配色・書体へ変更し、相談・現場・事業内容に合う写真セクションを追加済み
- 読みもの・お知らせ：一覧カードと個別詳細へ内容別の写真を追加済み
- ブログ3記事：sample07共通ヘッダー・配色・書体へ変更済み
- GitHub Pages：稼働中
- モーション比較A・推奨版：実装・PC／スマホ相当幅QA完了
- モーションB案：正式トップへ反映済み
- 参考サイト別デザイン比較3案：旧比較資料として維持（検索除外）
- 納品ZIP：今回の公開時に再生成
- WordPress移行：未着手
- Google スプレッドシート管理画面：作成・初期データ登録済み。サイト本文等739件＋SEO設定43件＝782件をページ文章として管理
- Apps Script自動公開：状態遷移・二重申請防止・申請後変更検知・予約公開・大量配信まで実装／ローカル安全テスト済み／Google再認証後に紐付け・デプロイ
- GitHub自動同期：実装済み・GitHub CLIの`workflow`権限追加とWebアプリURL登録後に有効化
