# Jump&Tap

Jump&Tapは、提供されたハテナブロック画像とコイン獲得音ファイルを使うスマートフォン向けWebアプリです。

## ファイル構成
- `index.html` — アプリ画面
- `style.css` — 空色の背景とレイアウト
- `app.js` — タップ動作、音声再生、音量調整
- `question-block.png` — 提供画像から切り出したハテナブロック
- `coin-pickup-3.mp3` — 指定された効果音
- `manifest.json` — ホーム画面追加用設定
- `service-worker.js` — オフライン用キャッシュ
- `icon.svg` — アプリアイコン

## GitHub Pagesで公開する手順
1. ZIPを解凍します。
2. GitHubの対象リポジトリを開きます。
3. ZIP内の `JumpAndTap` フォルダにあるファイルを、公開元フォルダ（通常はリポジトリのルート）へアップロードします。フォルダごと入れ子にしないでください。
4. リポジトリの **Settings → Pages** を開きます。
5. Sourceを **Deploy from a branch**、Branchを `main`、フォルダを `/ (root)` にして保存します（既に設定済みなら変更不要）。
6. 公開URLを開き、画像・効果音・音量スライダーを確認します。

## 更新方法
GitHubに変更をコミットすると公開サイトに反映されます。キャッシュ内容を変えたときは `service-worker.js` の `CACHE_NAME` のバージョン番号を変更してください。

## 音と通信
効果音は同梱した `coin-pickup-3.mp3` を使用します。音量は初期30%で、アプリを開くたびに30%に戻ります。GoatCounterでページビューを計測するため外部通信が発生しますが、タップ回数や音量操作は送信しません。
