---
name: implementation-planning
description: 承認済み仕様を、依存関係と検証方法を持つ小さな垂直スライスへ分解する。複数ファイルや複数工程にまたがる実装計画、Ticket作成、大規模作業の見通し整理に使用する。
---

# Implementation Planning

仕様を、1つずつ完了と判定できる作業へ変換する。Ticketや外部Issueの作成は、利用者が許可した場合だけ行う。

## 進め方

1. 承認済み仕様、設計、既存実装、テスト、プロジェクトの実行コマンドを確認する。
2. 依存グラフを作り、すぐ開始できる作業とBlockされる作業を分ける。
3. Schema、API、UI、Testなどを層別に切らず、利用者から見て狭いが一貫した振る舞いを届ける垂直スライスへ分ける。
4. 各TaskへGoal、変更対象、Acceptance criteria、Verification、Blocked by、対象外を記録する。1つの新しいコンテキストで完了できる大きさを目安にする。
5. 広範な機械的変更は、旧形式と新形式を並存させるExpand、呼び出し側を段階移行するMigrate、旧形式を除くContractへ分ける。
6. 規模が大きく先の判断をまだ具体化できない場合は、Destination、Decisions so far、Not yet specified、Out of scopeを持つMapを先に作る。
7. 粒度と依存関係を利用者と確認し、承認後に計画を確定する。

## 成果物

既存規約がなければ`docs/plans/<feature>.md`へ保存する。外部Trackerを使う場合は、承認済みTaskを1 Ticketずつ作成し、依存関係を明記する。

## 完了条件

- 各Taskが独立してデモまたは検証できる。
- 依存関係に循環がなく、着手可能なFrontierが分かる。
- 各Taskに受け入れ条件と具体的な検証方法がある。
- 仕様の全範囲がいずれかのTaskまたは対象外へ対応している。
