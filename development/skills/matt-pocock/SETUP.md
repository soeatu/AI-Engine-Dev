# Matt Pocock Skills セットアップガイド

この文書は、`development/skills/matt-pocock/` に収録したMatt PocockのSkillを、AI-Engine-Devで利用できるようにする手順を説明します。

## 先に理解すること

- このリポジトリには、上流のSkill 37個と補助ファイルが既に収録されています。
- 収録先は保管・参照用の場所です。Codexから自動検出させるには、リポジトリルートの`.agents/skills/`から各Skillへリンクします。
- Claude Codeで利用する場合は、`.claude/skills/`から同じSkillへリンクできます。
- `engineering`と`productivity`の25個が上流で正式提供されている安定版です。`in-progress`の8個はベータ版、`misc`の4個は非推奨寄りの補助Skillです。
- AI-Engine-Devの統合SkillとMatt原文Skillには、`tdd`、`research`、`code-review`などの同名Skillがあります。同名Skillは統合されないため、呼び出すSkillとパスを確認してください。

CodexのSkill仕様と探索場所は[OpenAI公式ドキュメント](https://learn.chatgpt.com/docs/build-skills)を根拠にしています。Codexは`.agents/skills`を探索し、Skillフォルダへのシンボリックリンクを利用できます。

## 推奨構成

原文を`development/skills/matt-pocock/`の一か所だけで管理し、利用するAIごとのSkillディレクトリからシンボリックリンクを張ります。

```text
development/skills/matt-pocock/   原文を保管する場所
          ↑
          ├── .agents/skills/      Codexから利用
          └── .claude/skills/      Claude Codeから利用
```

この構成なら原文を複製せず、更新箇所を一か所に保てます。

## Codexで有効化する

以下のコマンドは、リポジトリルートで実行します。

### 安定版25個だけを有効化する場合（推奨）

```bash
mkdir -p .agents/skills

for skill_file in development/skills/matt-pocock/{engineering,productivity}/*/SKILL.md; do
  skill_dir=${skill_file%/SKILL.md}
  skill_name=${skill_dir##*/}
  link=.agents/skills/$skill_name

  if [ -e "$link" ] || [ -L "$link" ]; then
    printf 'skip existing: %s\n' "$link"
  else
    ln -s "../../$skill_dir" "$link"
  fi
done
```

### 37個すべてを有効化する場合

```bash
mkdir -p .agents/skills

for skill_file in development/skills/matt-pocock/{engineering,productivity,in-progress,misc}/*/SKILL.md; do
  skill_dir=${skill_file%/SKILL.md}
  skill_name=${skill_dir##*/}
  link=.agents/skills/$skill_name

  if [ -e "$link" ] || [ -L "$link" ]; then
    printf 'skip existing: %s\n' "$link"
  else
    ln -s "../../$skill_dir" "$link"
  fi
done
```

既存のファイルやリンクは上書きせず、`skip existing`として残します。既存Skillと置き換える場合は、内容と利用元を確認してから個別に対応してください。

### 認識を確認する

1. Codex CLIまたはIDE拡張で`/skills`を開きます。
2. 例として`ask-matt`、`setup-matt-pocock-skills`、`tdd`を検索します。
3. Codexでは`$ask-matt`のように、`$`を付けて明示的に呼び出せます。

CodexはSkillの変更を自動検出します。表示されない場合はCodexを再起動してください。Skill数が多い場合、初期コンテキストの上限により一部が初期一覧から省略されることがありますが、明示呼び出しの対象から削除されたことを意味しません。

## Claude Codeで有効化する

このリポジトリに収録した原文を使う場合は、リポジトリルートで次を実行します。

```bash
mkdir -p .claude/skills

for skill_file in development/skills/matt-pocock/{engineering,productivity,in-progress,misc}/*/SKILL.md; do
  skill_dir=${skill_file%/SKILL.md}
  skill_name=${skill_dir##*/}
  link=.claude/skills/$skill_name

  if [ -e "$link" ] || [ -L "$link" ]; then
    printf 'skip existing: %s\n' "$link"
  else
    ln -s "../../$skill_dir" "$link"
  fi
done
```

Claude Codeでは、`/ask-matt`や`/setup-matt-pocock-skills`のように明示的に呼び出します。

上流はClaude Code公式マーケットプレイスの`mattpocock-skills`プラグインも提供しています。ただし、このリポジトリの原文リンクとプラグインを同時に有効化するとSkillが重複します。このワークスペースでは、収録済み原文へのリンクを使用し、両方を同時に導入しないでください。

## 初回のリポジトリ設定

Engineering Skillを初めて使う前に、`setup-matt-pocock-skills`を一度実行します。

- Codex: `$setup-matt-pocock-skills`
- Claude Code: `/setup-matt-pocock-skills`

このSkillは対話形式で、次を設定します。

1. Issueの管理先: GitHub、GitLab、ローカルMarkdown、またはその他
2. `triage`が使うラベル名
3. `CONTEXT.md`とADRの配置
4. `docs/agents/`配下の設定文書
5. `AGENTS.md`または`CLAUDE.md`の`Agent skills`セクション

このリポジトリには`CLAUDE.md`と`AGENTS.md`の両方があるため、原文Skillの規則では`CLAUDE.md`が更新対象になります。Skillは調査結果と文案を提示し、利用者の確認後に書き込みます。

## Skillを呼び出す

### 明示呼び出し専用

`agents/openai.yaml`で`allow_implicit_invocation: false`になっているSkillは、自動選択されません。`ask-matt`、`grill-with-docs`、`implement`、`setup-matt-pocock-skills`などは名前を指定して呼び出します。

```text
$ask-matt この要望を仕様化して実装するまでの流れを選んでください
```

### 自動選択可能

`tdd`、`diagnosing-bugs`、`code-review`などは、依頼内容が`description`と一致するとCodexが自動選択できます。確実に使いたい場合は明示します。

```text
$tdd この不具合を回帰テストから修正してください
```

### 原文を直接参照する

Skillを有効化していない場合も、特定の`SKILL.md`を明示して参照できます。

```text
development/skills/matt-pocock/engineering/tdd/SKILL.mdを読み、この手順で進めてください
```

## 推奨する最初の使い方

1. 安定版25個を有効化する。
2. `$setup-matt-pocock-skills`でIssue管理先とドキュメント配置を設定する。
3. どのSkillを使うか迷ったら`$ask-matt`へ相談する。
4. 小規模な開発では`grill-with-docs` → `implement`を使う。
5. 複数セッションにまたがる開発では`grill-with-docs` → `to-spec` → `to-tickets` → `implement`を使う。
6. ベータ版とMiscは、用途と制約を[Skillガイド](SKILL_GUIDE.md)で確認してから個別に有効化する。

## 無効化する

リポジトリからSkill本体を削除せず、`.agents/skills/`または`.claude/skills/`の対象リンクだけを削除します。削除対象がシンボリックリンクであることを確認してから操作してください。

Codexでは、個人設定の`~/.codex/config.toml`に`[[skills.config]]`を追加して、Skillの`SKILL.md`パスを指定し`enabled = false`にする方法もあります。設定変更後はCodexを再起動します。

## 更新する

この収録物は上流の特定リビジョンを固定したコピーで、自動更新されません。

- 現在の参照リビジョン: `6654f6b60cd9d5be8b54c6fafe44346dabeb3b76`
- 上流: [mattpocock/skills](https://github.com/mattpocock/skills)

更新時は、上流の変更内容とライセンスを確認し、`engineering`、`productivity`、`in-progress`、`misc`、`deprecated`を同期します。その後、Skill数、`SKILL.md`、`agents/openai.yaml`、補助ファイル、実行権限、ローカルリンクを検証し、この文書と[Skillガイド](SKILL_GUIDE.md)の説明も更新してください。

## セキュリティと権限

- Skillを有効化しても、コミット、push、Issue作成、デプロイなどの権限が自動で付与されるわけではありません。
- `wizard`は認証情報やCI Secretの設定支援を扱います。生成物やログへ秘密情報を残さないでください。
- `git-guardrails-claude-code`、`setup-pre-commit`、`setup-ts-deep-modules`は設定ファイルやフックを変更します。対象リポジトリの既存設定を確認してから使用してください。
- `claude-handoff`と`implement-spec`は外部プロセスや複数エージェントを前提とします。利用環境の機能と承認範囲を先に確認してください。

## 参考資料

- [Skillガイド](SKILL_GUIDE.md)
- [収録物README](README.md)
- [OpenAI公式: Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Matt Pocock — skills](https://github.com/mattpocock/skills)
