---
name: specification
description: 合意済みの要求や会話を、振る舞い、Interface、異常系、テスト可能な受け入れ条件を含む実装前の仕様へ変換する。非自明な機能や複数モジュールにまたがる変更に使用する。
---

# Specification

コードを書く前に、何を作り、どの状態を完了とするかを単一の仕様へ固定する。要求が未確定なら`requirements-analysis`へ戻る。

## 進め方

1. 要求、用語集、ADR、関連実装、既存テストを読み、現状の振る舞いと変更対象を確認する。
2. 利用者視点のProblem、Solution、User scenariosを記述する。
3. Functional requirementsと、具体的かつテスト可能なAcceptance criteriaを対応付ける。
4. Domain rules、Interface、データ、権限、Error behavior、Edge cases、Non-functional requirementsを定義する。
5. テストを置くSeamを既存構造から選ぶ。新しいSeamは必要性がある場合だけ提案し、実装詳細ではなく外部から観測できる振る舞いを検証対象にする。
6. Always / Ask first / Neverの境界、Open questions、Out of scopeを明記し、利用者の承認を得る。

## 成果物

既存規約がなければ`docs/specs/<feature>.md`へ保存する。

```markdown
# Specification: <feature>
## Goal
## Problem and user scenarios
## Functional requirements
## Acceptance criteria
## Domain rules
## Interfaces and data
## Error and edge cases
## Non-functional requirements
## Testing decisions
## Boundaries
## Open questions
## Out of scope
```

ファイルパスやコード断片は、判断を正確に表すため不可欠な場合だけ含める。実装中に合意が変わったら、コードと同時に仕様を更新する。

## 完了条件

- 各要求に検証可能な受け入れ条件がある。
- 正常系、異常系、境界条件、対象外が区別されている。
- InterfaceとテストSeamが実装前にレビュー可能である。
- 利用者が仕様を承認し、未決事項が実装開始を妨げない。
