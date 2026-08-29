---
name: requirements-analysis
description: 曖昧な要望を、利用者、目的、業務用語、制約、受け入れ条件、未決事項が明確な要求へ変換する。新機能、業務変更、関係者間で解釈が揺れる依頼の要求分析に使用する。
---

# Requirements Analysis

実装案を決める前に、利用者が達成したい結果と業務上の境界を確定する。既存の要求書、議事録、用語集、ADR、実装を読み、会話上の説明と現状が矛盾する場合は両方を示す。

## 進め方

1. 依頼から、対象利用者、解決したい問題、成功の状態、期限、変更できない制約を仮説として整理する。
2. 不足情報を一度に並べず、回答によって次の判断が変わる質問から一問ずつ確認する。質問には現時点の推定を添える。
3. 「欲しい手段」と「達成したい結果」を分け、暗黙の前提、矛盾、利害関係者ごとの期待差を明示する。
4. 曖昧または多義的な業務用語を具体例と境界例で検証し、Entity、Value Object、Invariant、Boundary、Ubiquitous Languageを整理する。
5. 機能要求、非機能要求、制約、前提、対象外、未決事項、受け入れ条件をまとめ、利用者の確認を得る。

## 成果物

プロジェクトの既存規約がなければ、`docs/requirements/<feature>.md`へ次を記録する。

- Background / Problem / Stakeholders
- Domain terminology
- Requirements / Non-functional requirements
- Constraints / Assumptions
- Acceptance criteria
- Open questions / Out of scope

業務用語が確定した場合は、既存の用語集をその場で更新する。実装判断や一時メモを用語集へ混ぜない。

## 完了条件

- 誰の何を改善するかを一文で説明できる。
- 受け入れ条件が観測可能で、未決事項と対象外が明記されている。
- 重要な用語が実装および既存文書と矛盾していないか、矛盾が未決事項として残されている。
- 利用者が要求の要約を確認している。
