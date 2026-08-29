# システム開発用Skills

このディレクトリには、要求分析からリリースまでの繰り返し利用可能なAI向け手順を置きます。工程Skillは必要なものだけを選んで使い、複数モデルで連続実行するときはオーケストレーションModeから組み合わせます。

## 設計方針

- **Addy = いつ、何をするか**: SDLC、仕様駆動、タスク分解、段階的実装、CI/CD、リリースの流れを担う。
- **Matt = どう考え、どう品質を上げるか**: 要求の深掘り、ドメインモデル、深いモジュール、テストのSeam、根本原因調査、仕様適合レビューを担う。
- 社内標準フローでは、同じ工程を担う考え方を社内Skillへ統合して使用する。
- Matt Pocockの原文Skillは、参照・個別利用・差分確認ができるよう[`matt-pocock/`](matt-pocock/README.md)へ別枠で全件収録する。
- Skillは作業権限を広げない。コミット、push、Issue作成、デプロイなどの外部変更は、利用者の依頼とプロジェクト規則を確認してから行う。

## Skill一覧

以下はAI-Engine-Devの標準工程として使用する社内Skillです。

| 工程 | 社内Skill | 主な参照元 | 主な成果物 |
|---|---|---|---|
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

## 標準フロー

```text
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

このディレクトリ直下の社内Skillは、上記リポジトリの考え方を社内ワークフロー向けに再構成したものです。Matt Pocockの原文Skill 37個は[`matt-pocock/`](matt-pocock/README.md)に収録しています。有効化は[セットアップガイド](matt-pocock/SETUP.md)、各Skillの選び方は[Skillガイド](matt-pocock/SKILL_GUIDE.md)を参照してください。ライセンス表記は[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)にあります。
