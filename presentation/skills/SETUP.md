# Skillセットアップ

`presentation/` は別のProject rootへそのままコピーできます。コピー後、同梱のセットアップスクリプトを1回実行すると、CodexとClaude Codeが5つのSkillをコピー先から検出できるようになります。

## コピー後のセットアップ

コピー先のProject rootで実行します。

```bash
./presentation/scripts/setup-skills.sh
```

スクリプトは自身の配置場所からコピー先のProject rootを判定し、次の相対Linkを作成します。

- Codex: `<project-root>/.agents/skills/<skill-name>`
- Claude Code: `<project-root>/.claude/skills/<skill-name>`

相対Linkのため、セットアップ後にProject rootごと移動しても、`presentation/` との位置関係が変わらなければ利用できます。同じ参照先へ再実行しても安全です。同名のFile、Directory、または別のLinkがある場合は上書きせず、競合を表示して終了します。

Skillが一覧へ現れない場合は、コピー先をProject rootとしてCodexまたはClaude Codeを再起動してください。CodexはRepository内の `.agents/skills` をSkill検出先として使用します。

## ハーネスの準備

Skill登録とは別に、PowerPoint生成Engineの依存関係をコピー先で準備します。

```bash
cd presentation/harness
npm ci
npm run build
npm test
npm run self-validate
```

必要環境とVisual QAの条件は [ハーネスREADME](../harness/README.md) を参照してください。

`ui-ux-pro-max`は`development/skills/`にも同じ固定Revisionを収録しています。同じProject rootで両方を使う場合は一方だけをSkill directoryへリンクし、作業対象に応じて各領域のREADMEから利用境界を確認してください。
