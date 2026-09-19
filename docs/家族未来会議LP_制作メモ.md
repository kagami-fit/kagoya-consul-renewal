# 家族未来会議LP 制作メモ

作成日：2026-09-19。初稿をGitHub Pagesへ公開済み（コミット`1770cf3`）。

## 内容とデザイン

- ページ：`kazokumiraikaigi.html`
- プレビュー：`http://127.0.0.1:8792/kazokumiraikaigi.html`（このPCでサーバーが稼働している間）
- 参考：[柴田行政書士事務所 家族未来会議](https://shibata-legal.com/kazokumiraikaigi/)
- 既存サイトの共通ヘッダー・フッター、Shippori Mincho／Zen Kaku Gothic、青とゴールドの色を継承。
- 文章は籠やの既存ナレッジに合わせて再構成。第三者の口コミ・人物プロフィール・メディア実績は転載していない。
- サービス名は仮称。具体的な価格、無料相談、2時間の所要時間は未確定のため記載しない。
- 外部の公式フォームには相談テーマを自動入力せず、記入すべき文言を画面で案内する。テスト送信は実施しない。

## 編集するファイル

- 本文・料金・FAQ：`kazokumiraikaigi.html`
- LP専用スタイル：`assets/css/family-future.css`
- 既存ページからの入口：`assets/css/family-future-entry.css`と各HTML
- 問い合わせの目的表示：`assets/js/site.js`の`inquiryRoutes.family`
- 再生成時の相続ページの導線：`scripts/build_business_pages.mjs`の`familyFutureEntry`

## 画像

内蔵の`image_gen`で家族写真を新規生成。イメージ画像で、実際の顧客・担当者ではない。

- WebP：`src/gen-family-future.webp`
- JPEG：`src/gen-family-future.jpg`
- 原寸PNGの確認用控え：`_review/family-future/hero-original.png`（Git対象外）
- 生成後の変更はWeb配信用のJPEG／WebP形式変換のみ。
- 2枚目の相談画像は既存の`src/gen-consultation.webp`／`.jpg`を再利用。

### 生成プロンプト

```text
Use case: photorealistic-natural.
Asset type: editorial hero photograph for KAGOYA, an elegant Japanese real estate and family-future consultation landing page.
Primary request: A calm multigenerational Japanese family thoughtfully talking about their future at a dining table, accompanied by a professional facilitator. Five people: a Japanese mother and father in their late sixties, a Japanese adult daughter and son in their forties, and a male Japanese advisor in his forties wearing a muted blue jacket without a tie. They are listening warmly and naturally to the mother, not posing or looking at the camera. No handshake, no exaggerated smiling.
Scene: a bright contemporary Japanese home, pale plaster walls, natural light oak table and furniture, linen curtains, a few green plants outside the window. Not a traditional temple, no religious objects. A simple notebook, plain papers and two ceramic tea cups on the table. No legible documents.
Composition: wide landscape 3:2 photograph, all five people grouped in the middle two thirds, seen at comfortable eye level from a slight angle. People visible from waist upward, uncrowded edges so image can also crop to 4:3. Honest documentary feeling, no staged stock-photo gestures. Natural realistic hands and distinct believable faces.
Palette: clean whites, light timber, muted slate blue clothing, restrained warm accents. Soft diffused daylight, slight film grain and lifelike skin texture. Quiet confidence, familial warmth, dignified and inviting. High-end Japanese editorial photography.
No text, logo, watermark, graphic overlays, borders, chart, UI, or decorative illustration. These are fictional people, not actual clients or employees.
```


## 確認結果

- 320 / 375 / 768 / 1024 / 1440 CSS pxで、LP本文の横はみ出しなし。
- メイン画像と既存画像の参照正常。警告・JavaScriptエラーなし。
- FAQ5項目の開閉、スマホメニューの開閉とEscape、相談ページへのテーマ引き継ぎを確認。
- トップ・サービス・相続ページでLP入口の表示とリンク先を確認し、実際にLPへ移動。
- 変更したHTML7ページのローカル参照、重複ID、H1、ページ内リンクを検証。
- 既存の`test-site-contact.cjs`、`test-listing-pages.cjs`、`test-social-images.cjs`、`test-business-images.cjs`はすべて成功。
- JavaScript構文チェックと`git diff --check`は成功。
- ページ内のフォーム・LINE・電話はリンク確認まで。問い合わせ送信はしていない。
- 公開URLでLP本体、トップのLP入口、`contact.html?type=family`の相談目的表示、画像読み込みを確認。
