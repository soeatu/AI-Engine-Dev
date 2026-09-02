# システム開発

このフォルダは、AIを活用した要求分析、設計、実装、テスト、障害調査、デリバリーを行うための作業領域です。

## 新規Projectへ展開する

`development/`自身がportable harnessの正本です。空の新規Projectへ展開する場合は、AI-Engine-Devの親Directoryで次を実行します。

```bash
cp -R /path/to/AI-Engine-Dev/development/. /path/to/new-project/
```

`development/.`の末尾の`.`を省略しないでください。`.agents/`と`.claude/`を含む隠しDirectoryもコピーされ、コピー先がProject rootとしてそのまま使えます。コピー後は対象Projectの既存構造を維持し、`projects/`へSourceを移動する必要はありません。`projects/`はAI-Engine-Dev内で複数Projectを管理するときだけ使います。

この操作は空の新規Project専用です。既存Projectへ一括コピーせず、既存構造と文書を調査する[`bootstrap-development-harness`](skills/bootstrap-development-harness/SKILL.md)を明示的に起動してください。新規Projectと既存Projectの導入判断はこの節を正本とします。

## フォルダ構成

- [`projects/`](projects/): AI-Engine-Dev内で複数Projectを管理するときだけ、個別システムや機能ごとの成果物、仕様、ソースコードを置く。portable rootでは対象Projectの標準構造（例: `src/`）を維持し、ここへ移動しない。
- [`skills/`](skills/): 開発工程で繰り返し使うAI向け手順を置く。Skillの一覧と選び方は[`skills/README.md`](skills/README.md)を参照する。
- [`scripts/`](scripts/): ビルド、テスト、解析などの自動化処理を置く。
- [`templates/`](templates/): 要求、仕様、設計、テスト、調査報告などのひな型を置く。
- [`tests/`](tests/): ワークスペース共通の検証やサンプルテストを置く。

## 標準ワークフロー

```text
要求分析
  → 仕様化
  → Architecture設計
  → 実装計画
  → 調査（必要な場合）
  → TDD・実装
  → デバッグ（不具合がある場合）
  → コードレビュー
  → 文書化
  → デリバリー
  → Human Review
```

作業内容に応じて、[`skills/README.md`](skills/README.md)から必要なSkillだけを選びます。小さく明確な変更では不要な工程を省略できますが、受け入れ条件、検証方法、権限の境界は実装前に確認します。

Architecture、Workflow、Sequence、Data Flow、Lifecycleを共有可能な図として残す場合は、[`archify`](skills/archify/README.md)を`architecture-design`の補助として使えます。Archifyの検証成功は、設計判断や本番構成の正しさそのものを証明しないため、根拠とレビュー結果を別に記録します。

## 既存Projectへの初回導入

既存Projectへdevelopmentハーネスを初めて適用する場合は、ユーザーが[`bootstrap-development-harness`](skills/bootstrap-development-harness/SKILL.md)を明示的に起動します。このSkillはProjectの実装、設定、既存文書を調査し、Project rootのREADMEと`AGENTS.md`を作成または更新します。局所文書は、親文書だけでは役割や安全な変更方法を判断できないDirectoryに限って追加します。

導入後の機能変更に伴うREADME、設計文書、ADRなどの同期には[`documentation`](skills/documentation/SKILL.md)を使用します。

## 作業の基本原則

1. 利用者、目的、対象範囲、制約、受け入れ条件を確認する。
2. 仕様、実装、ログ、テスト結果、公式文書を根拠として、事実、推測、未確認事項を分ける。
3. 変更をレビュー・検証できる小さな単位に分ける。
4. 単体、結合、E2Eなど、リスクに応じた方法で検証する。
5. 変更内容、確認済み事項、未確認事項、残るリスクを次の担当者へ引き継ぐ。

## 完了条件

- 受け入れ条件を満たす確認可能な証拠がある。
- 変更の影響範囲と検証結果が記録されている。
- 未確認事項と残るリスクが明示されている。
- 次の担当者が成果物と再利用部品を見つけられる。

AI Agent向けの詳細な作業ルールは[`AGENTS.md`](AGENTS.md)を参照してください。

## モデルルーティング型の実行

承認済みの設計と実装計画がある開発では、[`orchestrated-development`](skills/orchestrated-development/SKILL.md)を使い、設計・レビューを高判断モデル、明確なTask実装を実装担当モデルへ分担できます。Task Brief、実装報告、二軸レビュー、進捗台帳をファイルで引き継ぐため、CodexとClaude Codeで同じ工程を再現できます。
