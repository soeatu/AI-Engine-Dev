---
name: tdd
description: 外部から観測できる振る舞いを、正しいSeamでRED・GREEN・REFACTORの順に実装する。新機能、振る舞い変更、再現可能なBug修正をテストファーストで進める場合に使用する。
---

# Test-Driven Development

Testは実装詳細ではなくPublic Interfaceから観測できる振る舞いを保証する。既存のTest Runner、規約、類似Testを最初に確認する。

## ループ

1. 仕様とAcceptance criteriaを確認し、最も高い既存Seamを選ぶ。
2. 1つの振る舞いを表すTestを書く。Arrange、Act、Assertが読み取れ、失敗理由が一意になる名前を付ける。
3. Testを実行して期待した理由で失敗することを確認する。既に通る、実行されない、別理由で落ちる場合はRED未達とする。
4. そのTestを通す最小のImplementationを行う。隣接機能や将来用の抽象化を加えない。
5. 対象Testを実行してGREENを確認し、関連Testも実行する。
6. GREENを維持したまま重複、命名、Moduleの深さ、Interfaceを改善する。
7. 次のAcceptance criterionへ進み、同じループを繰り返す。

Bug修正では、最小再現を正しいSeamの回帰Testへ変換してから修正する。実際のBug経路を再現できるSeamがない場合は、偽の安心を作る浅いTestを追加せず、Testability上の設計課題として記録する。

## Testの基準

- StateとObservable behaviorを検証し、内部呼び出し回数への過度な依存を避ける。
- Testは理解しやすさを優先し、共有Fixtureで意図を隠さない。
- 実物を安全かつ高速に使える場合は、Mockより実物を優先する。
- Unit、Integration、E2Eは、リスクとSeamに合わせて選ぶ。

## 完了条件

- すべての新しい振る舞いについてREDを観測している。
- 最小ImplementationでGREENになり、関連Testも通る。
- Refactor後にも同じTestが通る。
- 実行したTest、結果、未実施の検証を分けて報告している。
