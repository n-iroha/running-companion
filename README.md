# Running Companion

個人用PWA。前日ラン評価routineの手動実行と、`n-iroha/Running` の `daily_evaluations/eval_YYYY-MM-DD.md` のプレビューを行う。

**URL:** https://n-iroha.github.io/running-companion/

## セットアップ(iPhone)

1. GitHubで fine-grained PAT を作成: Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token
   - Repository access: **Only select repositories → n-iroha/Running**
   - Permissions:
     - **Contents: Read-only**
     - **Actions: Read and write**
   - 有効期限は最長(1年)を推奨。期限切れ時は再発行してアプリの設定で更新
2. iPhoneのSafariで上記URLを開く
3. 設定ダイアログにPATを貼り付けて保存
4. 共有ボタン → **ホーム画面に追加**

## 仕組み

- 実行ボタン → `n-iroha/Running` の GitHub Actions `run-eval.yml`(workflow_dispatch)→ claude.ai routine fire API
- プレビュー → GitHub contents API → marked.js でレンダリング
- 秘密情報はこのリポジトリに含まれない:
  - GitHub PATは端末のlocalStorageのみに保存
  - claude.ai routine tokenは `n-iroha/Running` のActions secret(`CLAUDE_TRIGGER_API_TOKEN`)のみに保存

## 注意

- 実行後の進捗ポーリング中は画面を開いたままにする(iOSはバックグラウンドでJSが止まる)。閉じた場合も評価自体はクラウドで完了するので、後で日付を選べば表示される
- routineは冪等(既存の eval がある日は何もしない)なので連打しても安全
- 自動実行(毎朝6:30 JST)とは独立に動く
