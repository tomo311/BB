# Center Circle

バスケットボールの技術を個人で見返すための静的Webサイトです。HTML、CSS、JavaScriptだけで動き、GitHub Pagesで公開できます。

## ローカルで確認する

JSONを`fetch`で読み込むため、HTMLファイルを直接開かず、簡単なHTTPサーバーを使います。

```sh
python3 -m http.server 8000
```

起動後、`http://localhost:8000/`を開きます。

## 技術を追加する

`data/`内の対象カテゴリのJSONを編集します。YouTube動画はURL全体ではなく、`youtubeId`と再生区間の秒数を入力します。

```json
{
  "title": "動画の表示名",
  "youtubeId": "XIHqHouUHoY",
  "start": 18,
  "end": 76
}
```

`start`と`end`は秒数です。技術を追加したら、同じカテゴリ内で重複しない`id`を付けます。
