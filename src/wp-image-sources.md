# WordPress公式画像 取得元一覧

> 取得日：2026-08-11
> 方針：会社案内PDFは配色・余白・罫線の参考に限定し、ページ内写真には使用しない。以下はすべて株式会社籠やの現行WordPress公式サイトで公開されている画像。

| ローカルファイル | 主な用途 | 取得元URL |
|---|---|---|
| `logo.png` / `logo.webp` | ヘッダー・フッター | `https://kagoya-consul.co.jp/cms/wp-content/themes/kagoya-theme_241202/_assets/img/common/logo@2x.webp` |
| `wp-hero.*` | トップのメインビジュアル | `https://kagoya-consul.co.jp/cms/wp-content/themes/kagoya-theme_241202/_assets/img/main-visual/total-visual.webp` |
| `wp-company.*` | 会社情報 | `https://kagoya-consul.co.jp/cms/wp-content/themes/kagoya-theme_241202/_assets/img/page/company/image01.webp` |
| `wp-sell.*` | 売却・査定 | `https://kagoya-consul.co.jp/cms/wp-content/themes/kagoya-theme_241202/_assets/img/page/service/image01.webp` |
| `wp-buy.*` | 購入 | `https://kagoya-consul.co.jp/cms/wp-content/themes/kagoya-theme_241202/_assets/img/page/service/image02.webp` |
| `wp-manage.*` | 管理 | `https://kagoya-consul.co.jp/cms/wp-content/themes/kagoya-theme_241202/_assets/img/page/service/image03.webp` |
| `wp-invest.*` | 投資・資産計画 | `https://kagoya-consul.co.jp/cms/wp-content/themes/kagoya-theme_241202/_assets/img/page/service/image04.webp` |
| `wp-consultation.*` | 相談・法人・メッセージ | `https://kagoya-consul.co.jp/cms/wp-content/themes/kagoya-theme_241202/_assets/img/page/service/image05.webp` |
| `wp-finance.*` | 資金計画・確認フロー | `https://kagoya-consul.co.jp/cms/wp-content/themes/kagoya-theme_241202/_assets/img/page/service/image06.webp` |
| `wp-inherit.*` | 相続・空き家 | `https://kagoya-consul.co.jp/cms/wp-content/themes/kagoya-theme_241202/_assets/img/page/service/image07.webp` |
| `wp-income.*` | 一棟収益不動産 | `https://kagoya-consul.co.jp/cms/wp-content/themes/kagoya-theme_241202/_assets/img/page/service/image08.webp` |
| `wp-renovation.*` | 建築・改修・最終CTA | `https://kagoya-consul.co.jp/cms/wp-content/themes/kagoya-theme_241202/_assets/img/page/service/image09.webp` |
| `wp-case-map.*` | 事例の土地関係図 | `https://kagoya-consul.co.jp/cms/wp-content/uploads/2024/04/6a4243ea324bfa28540d397ef6df0ae8-1.jpg` |
| `wp-property-commercial.*` | 物件外観 | `https://kagoya-consul.co.jp/cms/wp-content/uploads/2024/05/1ef3ddeff6b0d1d2f8bdb1fb58087827.jpg` |
| `wp-property-street.*` | 事例の現地・周辺 | `https://kagoya-consul.co.jp/cms/wp-content/uploads/2024/08/a6389a20d72023ca2ea90633b40f1ba9.jpg` |
| `wp-property-house.*` | 戸建て外観 | `https://kagoya-consul.co.jp/cms/wp-content/uploads/2025/07/cf5441fe80638471c4882c64c08d4f6b.jpg` |
| `wp-property-condo.*` | マンション外観 | `https://kagoya-consul.co.jp/cms/wp-content/uploads/2025/09/0ac4650d26cf4dab8fff89ce8dfdb23c.jpg` |
| `wp-property-apartment.*` | 管理物件外観 | `https://kagoya-consul.co.jp/cms/wp-content/uploads/2026/06/49c8e74e93c29337dadab2c28b3837e7.jpg` |
| `wp-property-store.*` | 店舗物件外観 | `https://kagoya-consul.co.jp/cms/wp-content/uploads/2026/06/99efa51c37ddc995c0bbcb8547203eff.jpg` |
| `wp-property-interior.*` | 事例の室内・利用状態 | `https://kagoya-consul.co.jp/cms/wp-content/uploads/2026/05/8f84c3eddab9cf0efae81fee724be6df.jpg` |
| `ogp.jpg` / `ogp.webp` | SNS共有画像 | `https://kagoya-consul.co.jp/cms/wp-content/uploads/2023/12/img_ogp.png` |

ブログの3枚のサムネイルも公式画像を再利用しています。相続記事は `wp-inherit.*`、再建築不可記事は `wp-case-map.*`、価格見直し記事は `wp-sell.*` が取得元です。

## WordPressで新しい画像を使うとき

1. 管理画面の「メディア」を開く。
2. 使いたい画像を選び、「ファイルのURLをクリップボードにコピー」を押す。
3. URLをCodexへ渡し、使いたい場所を伝える。
4. 差し替え後、この一覧へ取得元URLを追記する。

`WP File Manager`で `wp-content/uploads` を直接操作する必要はありません。
