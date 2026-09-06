# Skillセットアップ

このRepository内では `presentation/AGENTS.md` と各READMEからSkillを参照できます。CodexまたはClaude Codeに自動検出させる場合は、5 Skillのディレクトリを利用する環境のSkill directoryへリンクします。

## Codex

Repository単位で有効化する場合:

```bash
mkdir -p .codex/skills
for skill in presentation/skills/*/SKILL.md; do
  skill_dir="$(dirname "$skill")"
  ln -s "$(pwd)/$skill_dir" ".codex/skills/$(basename "$skill_dir")"
done
```

## Claude Code

```bash
mkdir -p .claude/skills
for skill in presentation/skills/*/SKILL.md; do
  skill_dir="$(dirname "$skill")"
  ln -s "$(pwd)/$skill_dir" ".claude/skills/$(basename "$skill_dir")"
done
```

既存リンクと同名のSkillがある場合は上書きせず、参照先を確認してから選択してください。Engineの依存関係は [ハーネスREADME](../harness/README.md) に従って別途準備します。

`ui-ux-pro-max`は`development/skills/`にも同じ固定Revisionを収録しています。同じProject rootで両方を使う場合は一方だけをSkill directoryへリンクし、作業対象に応じて各領域のREADMEから利用境界を確認してください。
