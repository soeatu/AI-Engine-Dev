---
name: code-review
description: 固定した比較起点からの差分を、Specification適合とEngineering Standardsの独立した2軸でレビューする。Branch、PR、作業中の差分、特定Commit以降の変更確認に使用する。
---

# Code Review

正しいものを作ったかと、正しく作ったかを混ぜずに判定する。レビューはRead-onlyで行い、修正は利用者が依頼した場合だけ実施する。

## 進め方

1. 比較起点をCommit、Branch、Tag、Merge baseのいずれかで固定し、差分とCommit一覧が空でないことを確認する。
2. 仕様、Issue、Acceptance criteriaのSourceを特定する。見つからない場合はSpecification軸を未確認として扱う。
3. AGENTS、CONTRIBUTING、Coding standards、既存テスト規約などのStandards sourceを特定する。
4. **Specification軸**で、未実装・部分実装、仕様外の追加、誤った振る舞い、Acceptance criteriaとTestの対応を確認する。
5. **Standards軸**で、Correctness、Readability、Architecture、Security、Performance、Testsを確認する。重複、曖昧な命名、Feature envy、Data clumps、Primitive obsession、Shotgun surgery、Speculative generalityなどは判断材料として扱い、Repository規約を優先する。
6. 指摘ごとにSeverity、根拠、影響、最小の修正方向、ファイルと行を示す。Toolが既に確実に検出する事項は重複して列挙しない。
7. 実行済みTest、未実行Test、Build、静的検査を区別し、両軸を別々に結論付ける。

## 出力

重大度順のFindingを先に示し、その後に次を分けて記載する。

- Specification: findingsまたはpass / spec unavailable
- Standards: findingsまたはpass
- Verification: 実行内容と結果
- Open questions / residual risks

## 完了条件

- すべての変更Hunkが両軸で確認されている。
- Findingが具体的な影響と根拠を持つ。
- Specification軸とStandards軸を相殺または統合していない。
- 指摘がない場合も、確認範囲と未確認事項を明示している。
