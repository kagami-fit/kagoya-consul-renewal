# 共同編集の手順

## 共通ルール
- GitHubのmainを共通の確定版とします。作業はブランチで行い、Pull Requestで統合します。
- 編集前に `git switch main` → `git pull --ff-only origin main` → `git switch -c edit/作業名`。
- 編集後は変更内容を確認し、必要なファイルだけcommit・pushします。認証情報、問い合わせ原文、バックアップDBを含めないでください。
- `git push -u origin edit/作業名` の後、GitHubでPull Requestを作成します。
- 同じファイルの変更が競合したら、お互いの変更を確認して解決します。force pushで上書きしません。
- 本番WordPressへの反映担当者をその都度決めます。GitHubへのPushだけでWordPressには反映されません。

## Codexへの依頼例
「このリポジトリの最新版を確認し、作業ブランチで○○を修正して。既存の変更を保持し、確認後にPull Requestを作成して。本番WordPressにはまだ反映しないで。」

## 管理するファイル
- HTML / assets / src：ページ・デザイン・写真
- data：物件・ニュースなどの掲載情報
- wordpress/theme-source：WordPressテーマの元コード（初回統合準備中）
- scripts：生成・テスト用スクリプト
- review：クライアント向け静的確認ページ。実際の送信機能なし
- outputs / _review / node_modules：生成物・ローカル確認環境。コミットしません。
- Contact Form 7の送信先・管理画面設定：WordPress内で管理。認証情報をGitHubへ載せません。

## 初回の統合が必要
2026-10-10時点では、クライアントが本番側に追加した物件・差し替え写真、および手元の未コミットのWordPress移行コードがmainに統合されていません。今回の共有ページ公開は、サイト全体の同期完了を意味しません。
クライアントの編集元ファイルを回収し、公開版と照合してから初回統合します。それまでは旧ZIPで本番を丸ごと上書きしないでください。

## テーマ更新
統合済みmainの同じコミットからZIPを生成 → テスト環境で確認 → 本番をバックアップ → テーマ更新 → 公開画面・フォームの確認、の順番にします。
ZIP名と元のコミットIDを記録します。既存のフォーム宛先などは別途確認し、無断で変更しません。

## 招待
所有者が Settings → Collaborators からクライアントのGitHubユーザー名を指定して招待します。招待受諾後に共同編集できます。
