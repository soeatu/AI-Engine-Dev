# Codexでの実行

ControllerのSessionはSol high以上で設計、計画、判定を担当する。サブエージェントを起動するときは、Taskごとに`model`と`reasoning_effort`を明示し、独立Contextとなる設定を使う。

## Dispatch mapping

| 役割 | model | reasoning_effort | Context |
|---|---|---|---|
| Mechanical implementer | `gpt-5.6-luna` | `medium` | 履歴を継承しない |
| Integration implementer | `gpt-5.6-terra` | `high` | 履歴を継承しない |
| Task reviewer | `gpt-5.6-sol` | `high` | 履歴を継承しない |
| Scoped re-reviewer | `gpt-5.6-luna`または`gpt-5.6-terra` | `medium` | 履歴を継承しない |
| Final reviewer | `gpt-5.6-sol` | `high`以上 | 履歴を継承しない |

利用可能なモデル名が異なる環境では、同じ役割階層に対応する利用可能モデルを選び、実際に選択した値を`ledger.md`へ記録する。モデル指定を受け付けない実行環境では、暗黙に目的のモデルが使われたと仮定せず、利用者へ制約を報告する。

## 委譲Promptの契約

Promptには次だけを含め、要求本文はBriefへ集約する。

1. Taskが全体のどこに位置するか
2. 最初に読むBriefの絶対パス
3. 作業ディレクトリ
4. 前Taskから確定したInterfaceまたは判断
5. 書き込む報告ファイルの絶対パス
6. 実装、レビュー、再レビューのどの役割か

Implementerへは下位サブエージェントを作らせない。ReviewerはRead-onlyとし、修正を行わせない。修正はControllerがImplementerへ戻す。
