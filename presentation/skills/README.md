# 資料作成Skills

資料作成の作業を4つの責務へ分け、UI/UX設計知識を検索する補助Skillを追加しています。新しいDeckを作るときは `build-presentation`、再利用部品を増やすときは続く3つを使い、視覚設計の候補が必要な場合だけ`ui-ux-pro-max`を併用します。

| Skill | 用途 | 主な成果物 |
|---|---|---|
| [`build-presentation`](build-presentation/SKILL.md) | 作成前の理解確認、セクション構成、途中追加、テンプレート選択、新規作図、生成、出典、QA | `projects/<deck-id>/brief.txt`、`output/deck.pptx`、各Report |
| [`ingest-slide-templates`](ingest-slide-templates/SKILL.md) | 既存PPTXをclone-and-fill部品へ変換 | `templates/<name>/` |
| [`describe-slide-template`](describe-slide-template/SKILL.md) | テンプレートの役割・容量・Fieldを記述 | `description.md` |
| [`customize-presentation-design`](customize-presentation-design/SKILL.md) | 新規作図側の共通Design Systemを変更 | `harness/src/design.ts`、`harness/design.md` |
| [`ui-ux-pro-max`](ui-ux-pro-max/SKILL.md) | Style、Color、Typography、Accessibilityなどの設計知識を検索 | 設計候補、Pre-delivery check観点 |

## 分割の理由

- 対象読者、目的、利用場面、期待する行動を合意してから資料作成を開始する。
- 作成途中の追加内容をセクションとして扱い、既存構成のどこへ、なぜ差し込むかを明確にする。
- Deck制作ごとの判断と、共通基盤の変更を混ぜない。
- テンプレート取込後に、AIが正しく選べる説明を必ず作る。
- Cloneしたスライドの見た目と、新規作図のDesign Systemを別物として扱う。
- PPTX生成、構造検査、レンダリング、目視QAを別の確認結果として残す。
- UI/UX検索結果を、Slideの根拠、PowerPoint固有の仕様、表示QAの合格証拠として扱わない。

CodexとClaude Codeへの有効化は [SETUP.md](SETUP.md)、外部参照とライセンスは [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) を参照してください。
