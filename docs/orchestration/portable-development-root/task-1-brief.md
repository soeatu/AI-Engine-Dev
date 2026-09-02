# Task 1: Development harnessをProject rootへ展開可能にする

## Goal and context

- Goal: `development/`の内容を空の新規Project rootへコピーした直後に、文書、統合Skill、Template、Codex設定、Claude Code設定を利用できるportable layoutへ変更する。
- User-visible or system-visible outcome: 利用者が案内された1つのコピー操作を実行すると、コピー先で`AGENTS.md`がroot規則として働き、統合13 SkillとArchifyが検出可能になり、Claude Codeの役割別Agent定義も利用できる。
- Related specification/design: `/Users/soenoa/Documents/ChatGPT/AI-Engine-Dev/docs/orchestration/portable-development-root/ledger.md`
- Dependencies already completed: 現行の`development/`構造、統合Skill、Matt Pocock原文Skill、Archify、オーケストレーションTemplateは存在する。

## Exact requirements

1. `development/`をAI-Engine-Dev配下で使う場合と、その内容を空の新規Project rootへ展開する場合の両方で、同じ正本ファイルが使える構成にする。
2. `development/AGENTS.md`をportable rootとして読める表現へ変更する。親にroot `AGENTS.md`が存在するときは親規則も適用し、コピー後に自身がrootとなる場合は自身だけで必要規則が完結するようにする。
3. 新規Project向けの正式な展開手順を`development/README.md`へ記載する。隠しDirectoryを含む`development/.`をコピーすること、対象は空の新規Projectであること、既存Projectには一括コピーせず`bootstrap-development-harness`を使うことを明記する。
4. コピー後のProject rootでは、既存Sourceを`projects/`へ移動することを要求しない。AI-Engine-Dev内で複数Projectを管理するときだけ`projects/`を使い、portable rootでは対象Projectの既存構造を維持する規則にする。
5. `orchestrated-development`のTemplate参照を、`development/`という親Directory名に依存しないPath表現へ変更する。Skill位置からharness rootを特定できる契約にする。
6. `development/.agents/skills/`から、統合13 Skillと`archify`へ相対Symbolic linkを用意する。Matt Pocock原文Skillは既定リンクへ含めない。
7. `development/.claude/skills/`にも同じ14件の相対Symbolic linkを用意する。
8. Claude Codeの`architecture-designer`、`implementation-worker`、`task-reviewer`、`final-reviewer`を`development/.claude/agents/`へ正本として配置し、参照Pathをportable rootの`skills/...`にする。AI-Engine-Dev rootの`.claude/agents`からも同じ正本を利用し、定義を重複管理しない。
9. AI-Engine-Dev rootからも統合SkillとClaude設定を従来どおり利用できるよう、rootの`.agents/skills`、`.claude/skills`、`.claude/agents`をportable正本へ接続する。既存の未コミット変更を保持する。
10. `development/skills/matt-pocock/SETUP.md`の有効化手順を、AI-Engine-Dev rootとportable rootの両方で機械的に判定できる形へ修正する。同名リンクは上書きせず、統合Skillを既定として保持する。
11. root `README.md`と`Lerning/02_system-development.md`へportable展開の入口を追加し、既存Project向けbootstrapとの使い分けを一か所の正本へLinkする。root `AGENTS.md`は変更しない。
12. portable layoutを一時Directoryへコピーして検証する再実行可能なScriptを`development/scripts/`へ追加する。少なくとも必須ファイル、隠しDirectory、14件のSkill link解決、4件のClaude Agent定義、禁止された固定Pathの不在、主要Markdown linkを検査する。
13. Script、文書、Symbolic linkはmacOSの標準環境で利用でき、生成した一時Directoryだけを安全に後片付けする。

## Interfaces and fixed decisions

- Portable harness root: `development/`自身。コピー後はコピー先Project root。
- 正式なコピー元表現: `development/.`。`development/*`は隠しDirectoryを落とすため案内しない。
- Default skill set: `bootstrap-development-harness`、`requirements-analysis`、`specification`、`architecture-design`、`implementation-planning`、`research`、`tdd`、`implementation`、`debugging`、`code-review`、`documentation`、`delivery`、`orchestrated-development`、`archify`。
- Matt Pocock原文Skill: 収録は維持し、選択的有効化。Default skill setと同名のLinkを置換しない。
- Existing Project: bulk copy対象外。`bootstrap-development-harness`を明示起動する。
- root `.claude/agents`の4定義はportable側を正本とし、Symbolic linkまたはDirectory linkで参照する。

## Expected change area

- Files or modules: `development/README.md`、`development/AGENTS.md`、`development/skills/orchestrated-development/SKILL.md`、`development/skills/matt-pocock/SETUP.md`、`development/.agents/`、`development/.claude/`、root `.agents/`、root `.claude/`、`development/scripts/`、必要な`development/tests/`、root `README.md`、`Lerning/02_system-development.md`。
- Existing patterns to follow: 相対Link、既存のSkill命名、既存Claude Agent frontmatter、`development/templates/orchestration/`の成果物契約、文書同期規則。

## Acceptance criteria

- [ ] 空の一時Directoryへ`development/.`相当をコピーした状態で検証Scriptが成功する。
- [ ] コピー先の`.agents/skills`と`.claude/skills`に既定14 Skillがあり、すべてコピー先内部へ解決する。
- [ ] コピー先の`.claude/agents`に4役割があり、各定義が`skills/...`のportable Pathを参照する。
- [ ] AI-Engine-Dev rootからも既定SkillとClaude Agent定義へのLinkが解決する。
- [ ] portable実行契約に`development/templates/...`の固定Pathが残っていない。
- [ ] Matt Pocockのセットアップ手順が両Layoutを識別し、既存Linkを上書きしない。
- [ ] READMEが新規Project展開と既存Project導入を明確に分け、隠しDirectoryを含むコピー方法を示す。
- [ ] root `AGENTS.md`および開始時のArchify関連未コミット変更を意図せず変更しない。
- [ ] 変更したMarkdownのローカルLink検査と`git diff --check`が成功する。

## Verification

- Focused test: 追加するportable layout検証Scriptを実行する。
- Type/lint/build checks: 全統合SkillとArchify `SKILL.md`のfrontmatter／リンク構造を検査する。文書変更のためApplication buildは不要。
- Environment or integration check: 一時Directoryへの実コピー後にSymbolic linkを`test -e`で確認する。Codex／Claude Code UI上の検出は未実施として報告する。
- Expected result: 検証Scriptと`git diff --check`がexit 0。

## Out of scope

- 既存Projectへの自動Mergeまたは上書きInstaller。
- Matt Pocock原文37 Skillの既定有効化。
- Commit、push、PR作成。
- Archify本体の機能変更、upstream full test、Browser visual review。
- root `AGENTS.md`の変更。

## Authority and stopping conditions

- Commit authorized: no
- External writes authorized: no
- Stop and report when: root `AGENTS.md`変更が必要、既存未コミット変更と安全に分離できない、Symbolic link以外のLayout判断が必要、または受け入れ条件を変える必要がある場合。

## Report destination

- Implementation report: `/Users/soenoa/Documents/ChatGPT/AI-Engine-Dev/docs/orchestration/portable-development-root/task-1-implementation-report.md`
- Review report: `/Users/soenoa/Documents/ChatGPT/AI-Engine-Dev/docs/orchestration/portable-development-root/task-1-review.md`
