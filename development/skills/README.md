# システム開発用Skills

このディレクトリには、要求分析からリリースまでの繰り返し利用可能なAI向け手順を置きます。工程Skillは必要なものだけを選んで使い、複数モデルで連続実行するときはオーケストレーションModeから組み合わせます。

## 設計方針

- **Addy = いつ、何をするか**: SDLC、仕様駆動、タスク分解、段階的実装、CI/CD、リリースの流れを担う。
- **Matt = どう考え、どう品質を上げるか**: 要求の深掘り、ドメインモデル、深いモジュール、テストのSeam、根本原因調査、仕様適合レビューを担う。
- AI-Engine-Devの標準フローでは、同じ工程を担う考え方を汎用的な統合Skillとして使用する。
- Matt Pocockの原文Skillは、参照・個別利用・差分確認ができるよう[`matt-pocock/`](matt-pocock/README.md)へ別枠で全件収録する。
- Skillは作業権限を広げない。コミット、push、Issue作成、デプロイなどの外部変更は、利用者の依頼とプロジェクト規則を確認してから行う。

## Skill全体

このワークスペースには50個のSkill定義があります。同名Skillは統合されず、AI-Engine-Dev統合SkillとMatt Pocock原文Skillの両方が存在します。

| 区分 | Skill数 | 位置づけ |
|---|---:|---|
| AI-Engine-Dev統合Skill | 13 | 初回導入、標準工程、オーケストレーション |
| Matt Pocock安定版 | 25 | Engineering 18件とProductivity 7件 |
| Matt Pocock In progress | 8 | 開発途中のベータ版 |
| Matt Pocock Misc | 4 | 用途限定の補助Skill |
| 合計 | 50 | Skill定義の総数 |

詳細な利用場面と注意点は[Matt Pocock Skillガイド](matt-pocock/SKILL_GUIDE.md)、有効化方法は[セットアップガイド](matt-pocock/SETUP.md)を参照してください。

### AI-Engine-Dev統合Skill（13件）

以下は、個人、チーム、組織を問わず利用できるAI-Engine-Devの標準工程です。

既存Projectへ初めてdevelopmentハーネスを適用するときは、ユーザーが`bootstrap-development-harness`を明示的に起動します。通常の変更に伴う文書同期には`documentation`を使います。

| 工程 | 統合Skill | 主な参照元 | 主な成果物 |
|---|---|---|---|
| 初回導入 | [`bootstrap-development-harness`](bootstrap-development-harness/SKILL.md) | AI-Engine-Dev文書規則; Matt `writing-for-agents` | Project rootと必要なDirectoryのREADME、`AGENTS.md` |
| 要求 | [`requirements-analysis`](requirements-analysis/SKILL.md) | Addy `interview-me`; Matt `grill-with-docs`, `domain-modeling` | `docs/requirements/<feature>.md` |
| 仕様 | [`specification`](specification/SKILL.md) | Addy `spec-driven-development`; Matt `to-spec` | `docs/specs/<feature>.md` |
| 設計 | [`architecture-design`](architecture-design/SKILL.md) | Addy `api-and-interface-design`; Matt `codebase-design`, `domain-modeling` | 設計記録、必要時ADR |
| 計画 | [`implementation-planning`](implementation-planning/SKILL.md) | Addy `planning-and-task-breakdown`; Matt `to-tickets`, `wayfinder` | `docs/plans/<feature>.md`または承認済みTicket |
| 調査 | [`research`](research/SKILL.md) | Addy `source-driven-development`; Matt `research` | `docs/research/<topic>.md` |
| テスト駆動 | [`tdd`](tdd/SKILL.md) | Addy `test-driven-development`; Matt `tdd` | RED→GREEN→REFACTORの証拠 |
| 実装 | [`implementation`](implementation/SKILL.md) | Addy `incremental-implementation`; Matt `implement` | 検証済みの小さな垂直スライス |
| 障害調査 | [`debugging`](debugging/SKILL.md) | Addy `debugging-and-error-recovery`; Matt `diagnosing-bugs` | 根本原因、再現手順、回帰テスト |
| レビュー | [`code-review`](code-review/SKILL.md) | Addy `code-review-and-quality`; Matt `code-review` | Standards軸とSpecification軸の指摘 |
| 文書化 | [`documentation`](documentation/SKILL.md) | Addy `documentation-and-adrs`; Matt `domain-modeling`, `wayfinder` | README、用語集、ADR、設計文書 |
| デリバリー | [`delivery`](delivery/SKILL.md) | Addy `git-workflow-and-versioning`, `ci-cd-and-automation`, `shipping-and-launch`; Matt `resolving-merge-conflicts` | PR、CI結果、リリース・ロールバック記録 |
| オーケストレーション | [`orchestrated-development`](orchestrated-development/SKILL.md) | obra/superpowers `subagent-driven-development` | Task Brief、実装報告、二軸レビュー、進捗台帳、全体レビュー |

### Matt Pocock Engineering（18件）

| Skill | 呼び出し | 用途 |
|---|---|---|
| [`ask-matt`](matt-pocock/engineering/ask-matt/SKILL.md) | 明示 | 状況に合うSkillと実行フローを選ぶRouter |
| [`grill-with-docs`](matt-pocock/engineering/grill-with-docs/SKILL.md) | 明示 | 要望を質問で深掘りし、用語とADRを更新する |
| [`triage`](matt-pocock/engineering/triage/SKILL.md) | 明示 | 未整理のIssueや外部PRを分類し、作業可能なBriefにする |
| [`improve-codebase-architecture`](matt-pocock/engineering/improve-codebase-architecture/SKILL.md) | 明示 | Deep module化の候補を調査してHTMLレポートで示す |
| [`setup-matt-pocock-skills`](matt-pocock/engineering/setup-matt-pocock-skills/SKILL.md) | 明示 | Issue管理先、Triage label、Domain文書の配置を初期設定する |
| [`to-spec`](matt-pocock/engineering/to-spec/SKILL.md) | 明示 | 現在の会話を実装可能な仕様へまとめる |
| [`to-tickets`](matt-pocock/engineering/to-tickets/SKILL.md) | 明示 | 仕様や計画を依存関係付きTracer bullet Ticketへ分割する |
| [`implement`](matt-pocock/engineering/implement/SKILL.md) | 明示 | 仕様またはTicketをTDDと二軸Review付きで実装する |
| [`wayfinder`](matt-pocock/engineering/wayfinder/SKILL.md) | 明示 | 巨大で不確実な計画を意思決定Ticketの地図へ整理する |
| [`prototype`](matt-pocock/engineering/prototype/SKILL.md) | 自動可 | 状態、Logic、UIの設計上の疑問を試作で検証する |
| [`diagnosing-bugs`](matt-pocock/engineering/diagnosing-bugs/SKILL.md) | 自動可 | 難しい不具合や性能劣化を再現から回帰Testまで調査する |
| [`research`](matt-pocock/engineering/research/SKILL.md) | 自動可 | 一次資料を調査し、引用付きMarkdownを残す |
| [`tdd`](matt-pocock/engineering/tdd/SKILL.md) | 自動可 | RED、GREEN、REFACTORを垂直Slice単位で進める |
| [`domain-modeling`](matt-pocock/engineering/domain-modeling/SKILL.md) | 自動可 | Domain用語を明確化し、CONTEXT.mdとADRを更新する |
| [`codebase-design`](matt-pocock/engineering/codebase-design/SKILL.md) | 自動可 | Deep module、Interface、Seamの設計語彙を提供する |
| [`code-review`](matt-pocock/engineering/code-review/SKILL.md) | 自動可 | 差分をRepository標準と仕様適合の二軸でReviewする |
| [`resolving-merge-conflicts`](matt-pocock/engineering/resolving-merge-conflicts/SKILL.md) | 自動可 | MergeまたはRebase conflictを両側の意図から解消する |
| [`wizard`](matt-pocock/engineering/wizard/SKILL.md) | 自動可 | 人にしかできない設定作業を対話型Bash手順にする |

### Matt Pocock Productivity（7件）

| Skill | 呼び出し | 用途 |
|---|---|---|
| [`grill-me`](matt-pocock/productivity/grill-me/SKILL.md) | 明示 | 作業Directoryを持たない計画や設計を質問で深掘りする |
| [`handoff`](matt-pocock/productivity/handoff/SKILL.md) | 明示 | 現在の会話を別AgentやSession向けの引き継ぎ文書にする |
| [`teach`](matt-pocock/productivity/teach/SKILL.md) | 明示 | Directoryへ学習状態を残しながら複数Sessionで教える |
| [`to-questionnaire`](matt-pocock/productivity/to-questionnaire/SKILL.md) | 明示 | 他の担当者やDomain expertへ渡す質問票を作る |
| [`wait-what`](matt-pocock/productivity/wait-what/SKILL.md) | 明示 | 直前の説明を不足した前提と共有語彙を補って説明し直す |
| [`grilling`](matt-pocock/productivity/grilling/SKILL.md) | 自動可 | 計画、判断、Ideaを質問でStress testする共通Primitive |
| [`writing-for-agents`](matt-pocock/productivity/writing-for-agents/SKILL.md) | 自動可 | Skill、AGENTS.md、CLAUDE.mdなどAgent向け文書を書く |

### Matt Pocock In progress（8件）

上流で開発途中のベータ版です。仕様変更や削除の可能性があるため、用途と依存機能を確認して個別に使用します。

| Skill | 呼び出し | 用途 |
|---|---|---|
| [`loop-me`](matt-pocock/in-progress/loop-me/SKILL.md) | 明示 | 複数SessionでWorkflow仕様を自己Interviewする |
| [`writing-beats`](matt-pocock/in-progress/writing-beats/SKILL.md) | 明示 | 記事をBeat単位のJourneyとして組み立てる |
| [`writing-fragments`](matt-pocock/in-progress/writing-fragments/SKILL.md) | 明示 | 将来の記事材料となる断片をInterviewで収集する |
| [`writing-shape`](matt-pocock/in-progress/writing-shape/SKILL.md) | 明示 | Markdown素材を段落単位で完成記事へ整える |
| [`claude-handoff`](matt-pocock/in-progress/claude-handoff/SKILL.md) | 明示 | 会話を`claude --bg`のBackground agentへ引き継ぐ |
| [`setup-ts-deep-modules`](matt-pocock/in-progress/setup-ts-deep-modules/SKILL.md) | 明示 | TypeScript packageのDeep module境界をdependency-cruiserで強制する |
| [`implement-spec`](matt-pocock/in-progress/implement-spec/SKILL.md) | 明示 | 仕様をTask graphとして複数Agentで並行実装し、一つのPRにする |
| [`retro`](matt-pocock/in-progress/retro/SKILL.md) | 明示 | Coding session後にAgent環境の改善案を出す。現状はStub |

### Matt Pocock Misc（4件）

上流の正式提供セットには含まれない用途限定の補助Skillです。

| Skill | 呼び出し | 用途 |
|---|---|---|
| [`git-guardrails-claude-code`](matt-pocock/misc/git-guardrails-claude-code/SKILL.md) | 自動可 | Claude Code Hookで危険なGit操作を阻止する |
| [`migrate-to-shoehorn`](matt-pocock/misc/migrate-to-shoehorn/SKILL.md) | 自動可 | TypeScript Testの`as`型Assertionを`@total-typescript/shoehorn`へ移行する |
| [`scaffold-exercises`](matt-pocock/misc/scaffold-exercises/SKILL.md) | 自動可 | Section、Problem、Solution、Explainerを持つ演習構造を作る |
| [`setup-pre-commit`](matt-pocock/misc/setup-pre-commit/SKILL.md) | 自動可 | Husky、lint-staged、Prettier、型検査、Testをpre-commitへ設定する |

### Matt Pocock Deprecated（0件）

現リビジョンではSkill本体はありません。廃止されたSkillは削除され、置き換え先は上流のChangesetで案内されます。

## 標準フロー

```text
既存Projectへの初回導入（明示起動時のみ）
  → bootstrap-development-harness

Issue / 要望
  → requirements-analysis
  → specification
  → architecture-design
  → implementation-planning
  → research（外部仕様や選定の確認が必要な場合）
  → tdd
  → implementation
  → debugging（不具合がある場合）
  → code-review
  → documentation
  → delivery
  → Human Review
```

小さく明確な変更では、不要な前工程を省略できます。ただし、実装前に受け入れ条件、検証方法、権限の境界は明確にします。

承認済み計画をCodexまたはClaude Codeの役割別モデルへ委譲して実装する場合は、`orchestrated-development`を実行Modeとして選びます。これは各工程Skillを置き換えず、設計、実装、TDD、レビューの呼び出しと引き継ぎを統括します。

## 参照元

- [Addy Osmani — agent-skills](https://github.com/addyosmani/agent-skills)
- [Matt Pocock — skills](https://github.com/mattpocock/skills)
- [Jesse Vincent — obra/superpowers](https://github.com/obra/superpowers)

このディレクトリ直下の統合Skillは、上記リポジトリの考え方を、特定の組織やプロジェクトに依存しないワークフローとして再構成したものです。Matt Pocockの原文Skill 37個は[`matt-pocock/`](matt-pocock/README.md)に収録しています。有効化は[セットアップガイド](matt-pocock/SETUP.md)、各Skillの選び方は[Skillガイド](matt-pocock/SKILL_GUIDE.md)を参照してください。ライセンス表記は[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)にあります。
