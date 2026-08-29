---
name: delivery
description: 検証済みの変更を、Git、CI、PR、段階リリース、監視、Rollbackへ安全につなぐ。コミット、PR、CI/CD、リリース準備またはMerge conflict解消を利用者が依頼した場合に使用する。
---

# Delivery

Deliveryは外部状態を変える。利用者が許可した範囲、対象Branch、Environment、既存Workflow、組織の承認手順を確認してから実行する。

## 進め方

1. 作業ツリー、Branch、差分、対象Release、未関連変更を確認し、利用者の変更を分離して保全する。
2. 変更を一つの意図で説明できるAtomicな単位にし、Test、Lint、Typecheck、Build、Security確認などRepositoryのQuality gateを実行する。
3. Commit、push、PR作成・更新は依頼された操作だけ行う。MessageとPR本文には目的、主要変更、検証結果、未確認事項、Risk、関連仕様を記載する。
4. CI失敗は同じ条件で再現し、原因を特定してから修正する。Checkを迂回して通過扱いにしない。
5. Conflictは両側のCommit、Issue、仕様から意図を調べ、両立可能なら保持する。両立しない場合はDeliveryの目的に合う選択とTrade-offを記録し、解消後に全Quality gateを再実行する。
6. ReleaseではFeature flag、段階Rollout、Monitoring、Rollback trigger、Rollback手順、Database互換性を確認する。
7. Release後の主要Scenarioと監視指標を確認し、結果を残す。未確認の本番動作を成功と報告しない。

## 完了条件

- 依頼されたCommit、PR、CI、Releaseの状態が確認できる。
- Quality gateの実行結果と未実行項目が分離されている。
- Rollback条件と手順が対象変更に対して実行可能である。
- 機密情報や無関係な変更が成果物に含まれていない。
- Human Reviewが必要な地点と次の担当者の行動が明確である。
