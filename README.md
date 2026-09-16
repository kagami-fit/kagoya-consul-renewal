# KAGOYA コーポレートサイト

[公開サイト](https://kagami-fit.github.io/kagoya-consul-renewal/)の編集元です。

- 初めて開く方：[ABOUT.md](ABOUT.md)
- 修正の仕方：[更新ガイド](docs/更新ガイド.md)
- 会社・事業・採用内容のナレッジ：[SPEC.md](SPEC.md)
- 今回の変更：[2026-09-16修正履歴](docs/修正履歴_20260916.md)
- ファイルとページの対応：[directory-map.md](directory-map.md)

## ローカル確認

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

`http://127.0.0.1:8765/`を開きます。JSONを読み込むため、HTMLファイルを直接開かずWebサーバーを使ってください。

旧手順は`docs/reference/`に保管しています。`scripts/build_site.py`・`build_sample07_home.py`は初期生成用で、日常更新には使いません。
