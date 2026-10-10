# QUALITAページの版管理

修正の実装を依頼されたときは、公開中のGitコミットを確認し、変更前の版を `versions/` へ残してから作業する。単なる調査・説明の依頼では保存や公開を行わない。

- `versions/YYYYMMDD-before*/`・`versions/YYYYMMDD-after*/` は固定保存版。削除・上書き・本文の修正をしない。
- 確定済みのコミットを `scripts/archive-version.mjs` で保存する。未コミットの内容を古いHEADと取り違えない。
- 同日に複数回修正する場合は日時や連番をIDに付け、保存済みのIDを再使用しない。
- 必要に応じて修正後の確定コミットも保存し、`scripts/build-version-index.mjs` で比較一覧を更新する。
- 最新ページの「編集前を見る」は直近の変更前の固定URLへ向ける。過去の固定URLは引き続き保持する。
- 公開前に `npm test` と `node scripts/verify-versions.mjs` を実行する。
- 写真・CSS・JSも版ごとに保存する。企業サイトへのリンクと外部フォントは固定保存の対象外。
- リポジトリは公開。実物件・顧客情報・未公開資料は追加しない。本番WordPressは別作業。
