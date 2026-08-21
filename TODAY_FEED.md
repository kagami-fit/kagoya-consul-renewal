# 「今日の籠や」更新・SNS連携の設計

## 目的

「完成して終わるHP」ではなく、案件・商談・成約・提携・新事業の現在地が日々見えるサイトにするための運用メモです。

トップページはSNSを直接埋め込むのではなく、いったん同じ形式の更新データへ集約します。これにより、SNS側の仕様変更や一時的な障害があっても、サイトの表示を止めずに運用できます。

## 現在の構成（静的プレビュー）

```text
社内で内容を確認
        ↓
data/today-items.json
        ↓
トップの「今日の籠や」／ヘッダーのLIVE表示
        ↓
案件相談・協業・投資・採用の入口
```

`data/today-items.json` は次の形式です。

```json
{
  "updatedAt": "2026-08-22",
  "items": [
    {
      "kind": "MEETING",
      "label": "商談",
      "title": "協業先との新サービス企画が進行",
      "summary": "不動産と介護をつなぐ相談窓口を検討中です。",
      "when": "2日前",
      "source": "社内更新",
      "href": "contact.html?type=partner"
    }
  ]
}
```

## 本番の自動連携案

```text
Threads / Instagram / YouTube
          ↓ API・RSS・Webhook
Make・n8n・Cloudflare Workerなどの集約処理
          ↓ 内容・個人情報・未公開案件を確認
WordPress REST API または JSONエンドポイント
          ↓ 15分〜1時間ごとに取得
トップページ「今日の籠や」
```

### 連携元ごとの考え方

- YouTube：チャンネルのRSSまたはYouTube Data APIで新しい動画を取得。動画タイトル・公開日・URLを「動画」項目として登録します。
- Instagram：Meta Graph APIで投稿を取得。プロアカウント、Metaアプリ、アクセストークンが必要です。
- Threads：Threads APIで投稿を取得。Metaアプリとアクセストークンが必要です。
- 社内案件：WordPressのカスタム投稿タイプ「今日の籠や」またはGoogleスプレッドシートを入力画面にします。SNSに出せない案件もここから安全に追加できます。

案件情報には未公開情報が含まれる可能性があるため、完全自動公開ではなく「自動取得 → 社内確認 → 公開」の3段階を推奨します。成約前の住所、個人名、金額などは自動で公開しないルールにします。

## 実装を開始するために必要なもの

1. Threads・Instagram・YouTubeの公式アカウントURL
2. Instagram / Threads のMetaアプリとアクセストークン
3. YouTubeチャンネルID、またはYouTube Data APIキー
4. 更新担当者と、公開してよい情報の基準
5. JSONを置く場所（WordPress REST API、Cloudflare Worker、GitHub Actionsなど）

認証情報はHTMLやGitリポジトリに書かず、GitHub Actions Secrets、WordPressの環境変数、またはWorkerのSecretへ保存します。

## サイト側の切り替え

現在はトップの`<meta name="kagoya-today-feed" content="data/today-items.json">`を読み込みます。自動連携用のJSON URLが用意できたら、同じスキーマを返すエンドポイントへ`content`の値を差し替えるだけで、HTMLを作り直さずに接続できます。

取得に失敗した場合は、HTMLに入れてある初期4件を表示するため、外部SNSの一時障害でトップが空になることはありません。

## 相談導線の考え方

フィードの直下に4つの入口を置いています。

- 案件相談：`contact.html?type=project`
- 協業：`contact.html?type=partner`
- 投資：`contact.html?type=investment`
- 採用：`contact.html?type=recruit`

すべて同じ問い合わせフォームへ進みますが、`type`を読み取って見出し・説明文を切り替えます。フォームを4つに分けず、入口だけを分けることで、訪問者は迷わず、受け手は問い合わせを一つに集約できます。
