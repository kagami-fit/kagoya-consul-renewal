# KAGOYA コーポレートサイト

株式会社籠やの確定HP設計書を内容の正本にし、`sample07`と同じデザイン構成・スクロール演出へ作り替えた静的HTMLのコーポレートサイトです。配色と書体はKAGOYAの指定を優先しています。

## ページ構成

- トップページ
- 「今日の籠や」更新フィードと8領域の事業紹介
- サービス総合と5つの詳細ページ
- 社会貢献・案件相談・協業・投資・採用の入口
- 物件情報
- 会社情報
- 知る・読みもの／ブログ
- お問い合わせ
- プライバシーポリシー

## 確認方法

GitHub Pagesの公開URLからそのまま閲覧できます。

https://kagami-fit.github.io/kagoya-consul-renewal/

デザイン比較ページ：

https://kagami-fit.github.io/kagoya-consul-renewal/design-comparison.html

ローカルでは、このフォルダをWebサーバーの公開フォルダとして開いてください。

再生成は次の順序です。

```bash
python3 scripts/build_site.py
python3 scripts/build_sample07_home.py
python3 scripts/update_blog_chrome.py
```

## 補足

静的サイトのため、入力内容の送信は株式会社籠やの現行公式フォームへ安全に引き継ぐ導線にしています。電話・メールのリンクも利用できます。「今日の籠や」は `data/today-items.json` を更新すると一覧を差し替えられます（ローカルをfile://で開く場合はHTML内の初期表示を使用します）。

`design-sample07.html`、`design-sample12.html`、`design-sample33.html` は、現行トップと同じ文章・画像を使った比較用デザインです。比較専用のため検索エンジンには登録しない設定です。
