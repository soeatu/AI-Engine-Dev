# Codexでの実行

ControllerのSessionはブレイン/プランナーとしてSol high以上で設計、計画、判定を担当する。サブエージェントを起動するときは、Taskごとに`model`と`reasoning_effort`を明示し、独立Contextとなる設定を使う。

## Dispatch mapping

| 役割 | model | reasoning_effort | Context |
|---|---|---|---|
| Mechanical implementer（ワーカー） | `gpt-5.6-luna` | `medium` | 履歴を継承しない |
| Integration implementer（ワーカー） | `gpt-5.6-luna` | `high` | 履歴を継承しない |
| Task reviewer（ブレイン/プランナー） | `gpt-5.6-sol` | `high` | 履歴を継承しない |
| Scoped re-reviewer（ブレイン/プランナー） | `gpt-5.6-sol` | `medium` | 履歴を継承しない |
| Final reviewer（ブレイン/プランナー） | `gpt-5.6-sol` | `high`以上 | 履歴を継承しない |

ブレイン/プランナーはSol、ワーカーはLunaに固定し、Terraなど他のモデルへ振り分けない。利用可能なモデル名が異なる環境では、Sol/Lunaに対応するデプロイ名を選び、実際に選択した値を`ledger.md`へ記録する。モデル指定を受け付けない実行環境では、暗黙に目的のモデルが使われたと仮定せず、利用者へ制約を報告する。

## 委譲Promptの契約

Promptには次だけを含め、要求本文はBriefへ集約する。

1. Taskが全体のどこに位置するか
2. 最初に読むBriefの絶対パス
3. 作業ディレクトリ
4. 前Taskから確定したInterfaceまたは判断
5. 書き込む報告ファイルの絶対パス
6. 実装、レビュー、再レビューのどの役割か

Implementerへは下位サブエージェントを作らせない。ReviewerはRead-onlyとし、修正を行わせない。修正はControllerがImplementerへ戻す。
