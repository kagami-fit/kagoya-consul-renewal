# 籠や｜収益不動産紹介LP（GitHub Pages確認版）

## 一言で言うと

QUALITA向け紹介企画のラグジュアリー案を、収益不動産に特化したトップ・販売一覧・詳細へ整えた静的確認サイトです。物件・価格・面積・利回りは架空の設定です。PDF誌面案は以前の比較資料として残しています。

## 何ができるのか

- パソコン・スマートフォンで2案を比較する。
- 上部の比較リンクで2案を切り替える。
- 5億円以下／5億円超〜8億円以下／8億円超で絞り込む。
- 各価格帯の新着をトップに表示し、独立した詳細ページを見る。
- 物件詳細から相談フォームへ物件番号・価格帯を引き継ぐ。
- 必須項目と同意欄を含むフォームの表示を確認する（保存・送信なし）。

## 構成

- `index-pdf.html`：従来のPDF誌面比較案（今回未変更）。
- `index.html`：収益不動産向けトップ。
- `for-sale.html`：価格帯別の一覧。ロゴはこの紹介サイトのトップへ移動し、籠や本体のトップへ移動するリンクは置かない。
- `property-demo-*.html`：サンプル物件詳細。
- `privacy.html`：サイト直下の `../privacy.html` と全文を共用する9条のポリシー。現在の住所を掲載。
- `data/income-properties.json`：収益物件データの編集元。
- `../privacy.html`：プライバシーポリシーの正本。本文の修正はこのファイルに集約。
- `data/privacy-original.md`：2026年9月28日の取得時の原文記録。旧住所のまま保管し、最新版の生成には使わない。
- `scripts/build-income.mjs`：新着・一覧・詳細・正本と同じポリシーの生成。
- `scripts/test-income.cjs`：価格帯の境界・新着・フォーム・原文一致・ローカルリンクの確認。
- `versions/`：編集前・編集後の固定保存版。各版の写真・CSS・JSも保持し、上書きしない。
- `versions/index.html`：過去版・修正版・最新版の比較入口。
- `scripts/archive-version.mjs`：確定したGitコミットから比較用の版を保存。
- `scripts/build-version-index.mjs`：比較一覧だけを再生成。
- `scripts/verify-versions.mjs`：保存した版の照合値を確認。
- `assets/css/`：各案専用のスタイル。
- `assets/js/income-collection.js`：価格帯絞り込み・物件引き継ぎ・入力確認。
- `assets/js/private-collection.js`：以前のPDF比較案専用。
- `assets/images/`：架空の建築写真と背景・装飾素材。
- `../src/logo.png`、`../src/favicon.png`：既存サイトと共通のロゴ・アイコン。

現在の収益不動産版の正本はこのフォルダーです。`../outputs/qualita-property-lp-20261003/` は以前の制作案の保管先です。旧制作案をコピーしてこの版を上書きしないでください。

## 使い方

サイトのルートで以下を実行します。

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

ブラウザーで `/qualita-property-lp/index-pdf.html` または `/qualita-property-lp/index.html` を開きます。

物件を編集するときは `data/income-properties.json` を更新し、`node qualita-property-lp/scripts/build-income.mjs` を実行します。表示は掲載日降順。トップは販売対象の各価格帯の新着1件です。公開確認版は `sampleOnly:true`・`isSample:true` のサンプル専用です。実物件を追加するには本番の認証・情報公開範囲を先に確定してください。

Node.js 20.19以降で、生成・自動チェックを行えます。チェック用ライブラリーを最初にインストールします。

ポリシーを編集するときは、サイト直下の `privacy.html` の導入文と本文を修正し、以下の生成・チェックを行ってください。QUALITA側の `privacy.html` を直接編集しても、次の生成で正本の内容に戻ります。チェックは9条の全文・現在の住所・フォームのリンクを照合します。

```sh
cd qualita-property-lp
npm ci
npm run build
npm test
```

GitHub Pagesは既存の `main` ブランチのルートから配信する設定を利用します。公開用フォルダは制作元より1階層浅いため、共通画像・企業サイトへのリンクは `../` に調整しています。初期案へのリンクは公開版から除外しています。

更新は作業ブランチ → Pull Request → GitHub Pages確認の順で行います。WordPressへの自動反映はありません。

修正前には、実際に公開されているGitコミットを固定保存します。以下のID・参照・ラベルは次の修正に合わせて変更してください。保存済みのIDで実行すると上書きせず停止します。

```sh
node scripts/archive-version.mjs --ref origin/main --id 20261011-before --label '2026年10月11日 編集前'
node scripts/build-version-index.mjs
node scripts/verify-versions.mjs
```

修正後の確定コミットも同様に別IDで保存できます。最新版の上部には直近の「編集前」と「比較一覧」へのリンクを設置します。固定保存版の本文・画像・スタイルを後から修正しないでください。

## 状態

- 収益不動産版の新着・価格帯別一覧・詳細・物件引き継ぎ：実装済み。
- 販売一覧から籠や本体トップへのリンク3か所を修正（2026年10月10日）。ロゴは紹介サイトのトップへ、スマホメニュー・フッターの本体ホームリンクは削除。生成し直しても修正を維持。物件・絞り込み・詳細・相談リンクは未変更。
- サンプル物件の写真3点：内蔵画像生成で個別制作。
- 公開用データ：GitHub Pages配信用に整理済み。
- 限定閲覧の認証・機密資料の保護：未実装。
- 実物件管理・メール送信・WordPress接続：未接続。
- Contact Form 7移行用フォーム原稿：`forms/` に準備。送信先の管理画面確認・接続・実送信テストは未実施。
- 企業サイトのGitHub確認版：プライバシーポリシーのみ、指定の全文と記事レイアウトに統一（2026年10月10日）。その他の未公開変更は含めない。
- 本番WordPress・テーマZIP：今回未更新。

**注意：GitHubリポジトリとGitHub Pagesは公開です。noindexは閲覧制限ではありません。実際の水面下物件、顧客情報、未公開資料をこのフォルダへ追加しないでください。**
