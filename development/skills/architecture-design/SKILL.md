---
name: architecture-design
description: ドメイン、Module、Interface、Seam、依存方向、API契約を整理し、変更しやすくテスト可能な設計を作る。新しい境界、外部連携、データモデル、難しい設計判断に使用する。
---

# Architecture Design

多くの振る舞いを小さなInterfaceの背後へ置く深いModuleを設計する。既存の用語集、ADR、仕様、コード構造を優先し、将来の仮説だけを理由に抽象化を増やさない。

## 進め方

1. 仕様からDomain、主要なInvariant、変更理由、外部システム、非機能制約を抽出する。
2. 責務をModuleへ割り当て、公開Interfaceと依存方向を図または表で示す。
3. Interfaceが呼び出し側へ露出する知識を最小化し、複雑さをModule内へ局所化する。削除したとき複雑さが呼び出し側へ戻らないModuleは、不要な中継になっていないか見直す。
4. テストするSeamを公開Interface上に置く。依存は受け取り、結果を返す形を優先する。実際に差し替えるAdapterがない抽象化は追加しない。
5. APIではContract first、入力境界での検証、一貫したError、互換性、冪等性、Pagination、Versioningを必要範囲で定義する。
6. 代替案を比較し、後戻りが高価で、理由が将来分かりにくく、実際のTrade-offがある判断だけADR候補にする。

## 成果物

プロジェクトの既存設計書へ、少なくとも次を記録する。

- DomainとModuleの責務
- Public InterfaceとContract
- Dependency directionとSeam / Adapter
- データと外部連携
- Error、Security、Performance、運用上の考慮
- 採用案、代替案、Trade-off
- 検証方法と未決事項

## 完了条件

- 各責務のOwnerと依存方向が一意に説明できる。
- InterfaceがInvariant、Error、順序、性能特性を含むContractとして定義されている。
- 受け入れ条件を外部から観測できるSeamがある。
- 仕様にない複雑さと不要な抽象化が残っていない。
