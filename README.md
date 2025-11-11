# 冬季休業 勤務態様管理システム

## ファイル構成

```
プロジェクトルート/
├── firebase.json          ← Firebase Hosting設定
└── public/               ← この中にすべてのファイルを配置
    ├── index.html
    ├── main.js
    └── firebase.js
```

## デプロイ手順

1. **ファイルを正しく配置**
   - `index.html`、`main.js`、`firebase.js` を `public` ディレクトリ内に配置してください
   - `firebase.json` はプロジェクトルートに配置してください

2. **Firebase Hostingにデプロイ**
   ```bash
   firebase deploy --only hosting
   ```

3. **ブラウザのキャッシュをクリア**
   - Chromeの場合: Ctrl+Shift+R (Mac: Cmd+Shift+R) でハードリロード
   - または、デベロッパーツールを開いて「キャッシュを空にしてハードリロード」

## データ構造

このシステムは以下の階層構造でFirestoreにデータを保存します:

```
winter-shifts (コレクション)
└── {職員名} (ドキュメント)
    └── records (サブコレクション)
        └── {日付} (ドキュメント)
            ├── date: "2025-12-24"
            ├── am: "勤務（学校）"
            ├── pm: "勤務（学校）"
            ├── teacher: "山田太郎"
            └── updatedAt: (タイムスタンプ)
```

## デバッグ方法

1. **ブラウザのコンソールを開く**
   - Chrome/Edge: F12 → Console タブ
   - Safari: Option+Cmd+C

2. **コンソールに表示される情報**
   - ✅ ページ読み込み完了
   - ✅ Firebase初期化完了
   - 💾 保存ボタンがクリックされました
   - ✅ 保存完了: XX件

3. **エラーが出た場合**
   - コンソールに ❌ マークのエラーメッセージが表示されます
   - エラー内容をコピーして確認してください

## トラブルシューティング

### データが保存されない場合

1. **ファイルの配置を確認**
   - すべてのファイルが `public` ディレクトリ内にあるか確認

2. **Firestoreのセキュリティルールを確認**
   Firebase Consoleで以下のルールが設定されているか確認:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /winter-shifts/{teacherId}/records/{recordId} {
         allow read, write: if true;  // 本番環境では適切な認証ルールに変更してください
       }
     }
   }
   ```

3. **ブラウザのコンソールでエラーを確認**
   - F12を押してConsoleタブを開く
   - 赤いエラーメッセージがないか確認

4. **キャッシュをクリア**
   - Ctrl+Shift+R (Mac: Cmd+Shift+R) でハードリロード

### 古いデータが残っている場合

Firestoreコンソールで `winter-shifts` コレクションの古いドキュメント(ランダムなID)を手動で削除してください。

## 使い方

1. 職員名を入力
2. 各日付の午前・午後の勤務態様を選択
3. 「保存」ボタンをクリック
4. 「保存しました」のメッセージが表示されたら完了

## 注意事項

- 同じ職員名で保存すると、以前のデータが上書きされます
- 職員名は必ず入力してください
- インターネット接続が必要です
