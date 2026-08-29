---
name: orchestrated-development
description: 承認済みの設計・実装計画を、役割別モデルへ委譲し、Task単位の実装、仕様適合・品質レビュー、修正ループ、全体レビューまで統括する。CodexまたはClaude Codeでモデルルーティング型の開発を実行するときに使用する。
---

# Orchestrated Development

Controllerはコードを直接実装せず、設計、Task Brief、実装報告、レビュー結果、進捗台帳を引き継ぎ境界として作業を進める。実装担当の自己レビューと独立レビューを分離し、各Taskを検証可能な状態で閉じる。

## 開始条件

- 承認済みの仕様と実装計画があり、Taskごとに受け入れ条件と検証方法が定義されている。
- Taskが独立して実装・レビューできる。密結合した変更は、先に`implementation-planning`で分割し直す。
- 実装、テスト、レビューに必要なファイルとコマンドへアクセスできる。

設計または計画が不足している場合は、`architecture-design`と`implementation-planning`を先に使用し、実装を開始しない。

## Platformの選択

実行前に、使用中のPlatformだけを読む。

- Codex: [references/codex.md](references/codex.md)
- Claude Code: [references/claude-code.md](references/claude-code.md)

## 実行記録

プロジェクト規約がなければ、`docs/orchestration/<feature>/`を作業記録のRootとし、`development/templates/orchestration/`のひな型から次を作る。

- `ledger.md`: Task、状態、担当モデル、基準点、判断、残課題
- `task-<N>-brief.md`: 実装担当とレビュアーが共有する唯一の要求
- `task-<N>-implementation-report.md`: 変更内容と検証証拠
- `task-<N>-review.md`: SpecificationとStandardsの独立判定
- `final-review.md`: 全Taskを通した最終判定

会話上のTodoだけで進捗を管理しない。委譲、判定、修正、保留を行うたびに`ledger.md`を更新し、再開時は台帳と成果物から状態を復元する。

## Model Routing

役割に必要な最小モデルを明示して委譲する。Platformの既定モデルへ暗黙継承させない。

| 役割 | Codex | Claude Code | 基準 |
|---|---|---|---|
| Architecture・計画 | Sol high以上 | Opus high以上 | 境界、Trade-off、複数Moduleの判断 |
| 明確な小規模実装 | Luna medium | Sonnet medium | 完全なBrief、1〜2ファイル、既知の検証方法 |
| 統合を伴う実装 | Terra highまたはSol high | Sonnet high | 複数ファイル、外部連携、デバッグ |
| Task review | Sol high | Opus high | 仕様適合と品質の独立判定 |
| 小さな修正の再レビュー | Luna/Terra medium | Sonnet medium | 指摘と修正差分だけを確認 |
| Whole-branch review | Sol high以上 | Opus high以上 | Task間の整合、回帰、Architecture |

Lunaへ委譲するTaskは、実装方法の選択ではなく、明確な契約の実現を中心にする。Briefを読んでもArchitecture判断が残る場合は、Taskを再設計するか上位モデルへ送る。

## Task Loop

### 1. Briefを固定する

`task-<N>-brief.md`へGoal、背景、正確な要求、変更候補、受け入れ条件、検証方法、依存、対象外、権限境界を記録する。数値、文字列、API契約などの正確な値はBriefだけを正とし、委譲Promptへ重複させない。

開始時のCommitまたは比較可能な基準点を台帳へ記録する。Gitが使えない場合は、対象ファイル一覧と開始時状態を記録し、未取得の差分をレビュー済みとして扱わない。

### 2. Implementerへ委譲する

新しい独立ContextへBriefのパス、作業場所、既決事項、報告ファイルのパスを渡す。Implementerは`implementation`と、必要な場合は`tdd`に従い、実装、検証、自己レビューを行う。

報告には変更ファイル、受け入れ条件との対応、実行したコマンド、結果、未確認事項、懸念を含める。コミット、push、Issue更新、デプロイは、利用者がその操作を明示的に許可した場合だけ依頼する。

### 3. Task reviewを委譲する

実装担当とは別のContextへBrief、実装報告、固定した差分を渡す。Reviewerは`code-review`に従い、Read-onlyで次を別々に判定する。

- Specification: 要求の不足、余分な実装、誤解、受け入れ条件との対応
- Standards: Correctness、Architecture、Security、Performance、Maintainability、Tests

一方の合格で他方を相殺しない。実装担当の自己レビューを独立レビューの代わりにしない。

### 4. 修正を収束させる

Critical、Important、仕様不適合を、同じImplementerへ指摘単位で戻す。修正後は、前回の指摘と修正差分だけを別Contextで再レビューする。

- Round 1〜3: 同じImplementerを再開し、Contextを保持する。
- Round 4: 新しいImplementerへ切り替え、少なくとも一段上のモデルを使う。
- Round 5: 最後の修正と再レビューを行い、残件ごとにControllerが根拠付きで判定する。

5 Round後も受け入れ条件に関わる問題が残る場合は、そのTaskを完了にしない。計画不備、情報不足、設計判断のいずれかへ戻し、台帳へ停止理由を記録する。

### 5. Taskを閉じる

SpecificationとStandardsが合格し、検証証拠を確認できたときだけTaskを完了にする。未実行の検証、環境依存の確認、残るリスクはTask完了と分けて台帳へ残す。

### 6. 全体レビューを行う

全Task完了後、最上位モデルの新しいContextへ計画、全Task Brief、実装報告、レビュー、全体差分を渡す。Task間の契約、重複、欠落、回帰、移行順序、運用・Rollbackを確認し、`final-review.md`へ記録する。

## 並列実行

同時に実装できるのは、変更ファイル、契約、状態が独立したTaskだけとする。並列Implementerには別worktreeまたは同等の分離環境を割り当てる。同じCheckoutへ同時に書き込ませない。依存するTaskは前Taskのレビュー完了後に開始する。

## 停止条件

不可逆または破壊的な操作、Security上の重要判断、共有Branchへのpush・merge・公開・デプロイ、仕様から安全に決められない設計変更は、利用者の承認または追加情報を得るまで停止する。

## 完了条件

- 全TaskについてBrief、実装報告、二軸レビュー、検証証拠が対応している。
- 修正Roundと未解決Findingが台帳から追跡できる。
- Whole-branch reviewが完了し、実施済み・未実施・未確認・残存リスクが分離されている。
- 利用者が許可していないCommit、push、merge、公開、デプロイを実行していない。
