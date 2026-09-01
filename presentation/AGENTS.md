# 資料作成領域

このフォルダでは、提案資料、週次報告、会議説明、レビュー資料などを作成します。

## フォルダの役割

- `assets/`: ロゴ、画像、図表、参考データなど、資料から参照する素材を置く。
- `presentations/`: 完成版およびレビュー対象のプレゼンテーションを置く。
- `skills/`: 資料作成で繰り返し使うAI向け手順を置く。
- `scripts/`: 生成、変換、検査などを自動化する処理を置く。
- `tests/`: 内容、表記、リンク、レイアウトなどの検証を置く。

## PowerPointハーネス

PowerPointを作成・改訂・部品化する場合は、最初に[`README.md`](README.md)で作業の入口を選ぶ。

- 実行Engine、Template library、Deck projectは[`harness/`](harness/README.md)を使用する。
- 資料作成Skillの選択は[`skills/README.md`](skills/README.md)、有効化は[`skills/SETUP.md`](skills/SETUP.md)を参照する。
- 通常のDeck作成では[`build-presentation`](skills/build-presentation/SKILL.md)を使用し、`source-notes.txt`、Build report、QA reportを成果物と一緒に残す。
- 既存Templateを利用する場合は実Slideのcloneを優先し、適合しないSlideだけを共通Design Systemで新規作図する。
- PPTX構造検査、全Slideのrender、1枚ずつの目視確認を別々に実施し、未実施の確認を合格扱いにしない。

## 作業手順

1. 目的、対象読者、伝えたい結論、利用場面、期限を確認する。
2. 根拠資料を集め、確定事実と未確認事項を分ける。
3. 結論から逆算して構成を作り、1スライド1メッセージを基本に本文を作る。
4. 図表、文字量、視線の流れ、出典、表記を確認する。
5. 実際にスライドを表示して崩れや読みにくさを確認し、確認結果を記録する。

完了条件は、対象読者が次に取る行動を理解でき、主要な主張に根拠があり、表示確認で重大な崩れがないことです。
