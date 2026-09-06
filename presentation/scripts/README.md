# 資料作成Scripts

このフォルダには、コピーした `presentation/` を別のProjectで利用するためのセットアップ処理を置きます。

## Skillをコピー先へ登録する

`presentation/` をコピーした後、コピー先のProject rootで実行します。

```bash
./presentation/scripts/setup-skills.sh
```

`setup-skills.sh` は、`presentation/skills/*/SKILL.md` を持つ全Skillについて、Codex用の `.agents/skills/` とClaude Code用の `.claude/skills/` に相対Linkを作ります。既存項目は上書きせず、同じLinkへの再実行は成功します。

## 検証

Repository rootで実行します。

```bash
sh presentation/tests/setup-skills.test.sh
```

Testは、コピー先への登録、再実行、Project移動後のLink解決、競合時の既存項目保持を確認します。
