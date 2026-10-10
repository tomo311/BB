# Center Circle

バスケットボールの技術を個人で見返すための静的Webサイトです。HTML、CSS、JavaScriptだけで動き、GitHub Pagesで公開できます。

## ローカルで確認する

JSONを`fetch`で読み込むため、HTMLファイルを直接開かず、簡単なHTTPサーバーを使います。

```sh
python3 -m http.server 8001
```

起動後、`http://localhost:8001/`を開きます。

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

`start`と`end`は秒数です。カテゴリ内の各技術には、並び順に応じて`skill-1`、`skill-2`のような内部IDが自動で付きます。各技術のJSONに`id`を書く必要はありません。

カテゴリ自体の`id`は、トップページから対応するJSONを開くために引き続き必要です。

`practice`と`memo`は、内容がなければ省略できます。`memo`内の`summary`、`usage`、`advantages`、`points`も、空文字を入れず項目ごと省略してください。
